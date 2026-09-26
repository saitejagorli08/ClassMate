import Student from '../models/Student.js';
import User from '../models/User.js';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

export const getStudents = async (req, res) => {
  const { page = 1, limit = 50, search, department, course, status, semester } = req.query;
  const filter = {};
  if (department) filter.department = department;
  if (course) filter.course = course;
  if (status) filter.status = status;
  if (semester) filter.currentSemester = Number(semester);
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
      { rollNumber: { $regex: search, $options: 'i' } },
    ];
  }
  const total = await Student.countDocuments(filter);
  const students = await Student.find(filter)
    .populate('department', 'name code')
    .populate('course', 'name code')
    .populate('user', 'name email phone avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({ success: true, data: students, pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) } });
};

export const getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('department', 'name code')
    .populate('course', 'name code')
    .populate('user', 'name email phone avatar lastLogin');
  if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
  res.json({ success: true, data: student });
};

export const getStudentMe = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id })
    .populate('department', 'name code')
    .populate('course', 'name code')
    .populate('user', 'name email phone avatar lastLogin');
  if (!student) return res.status(404).json({ success: false, message: 'Student profile not found.' });
  res.json({ success: true, data: student });
};

export const createStudent = async (req, res) => {
  const { user: userData, personalInfo, rollNo, studentId, department, course, currentSemester, guardianInfo } = req.body;
  
  // If user details provided, create user first or link existing
  let userId = req.body.user;
  if (typeof userData === 'object' && userData?.email) {
    let existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      existingUser = await User.create({
        name: userData.name || `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim(),
        email: userData.email,
        password: userData.password || 'Student@123!',
        role: 'student',
        phone: personalInfo?.phone,
      });
    }
    userId = existingUser._id;
  }

  const sId = studentId || rollNo || `STU${Date.now().toString().slice(-6)}`;
  const fName = personalInfo?.firstName || req.body.firstName || 'Student';
  const lName = personalInfo?.lastName || req.body.lastName || 'Learner';

  const student = await Student.create({
    user: userId,
    studentId: sId,
    rollNumber: rollNo || sId,
    firstName: fName,
    lastName: lName,
    dateOfBirth: personalInfo?.dateOfBirth,
    gender: personalInfo?.gender ? personalInfo.gender.charAt(0).toUpperCase() + personalInfo.gender.slice(1) : 'Male',
    department: department || undefined,
    course: course || undefined,
    currentSemester: currentSemester || 1,
    guardianName: guardianInfo?.name,
    guardianPhone: guardianInfo?.phone,
    address: personalInfo?.address ? { street: personalInfo.address } : undefined,
  });

  if (userId) {
    await User.findByIdAndUpdate(userId, { studentProfile: student._id });
  }

  res.status(201).json({ success: true, data: student });
};

export const updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  }).populate('department course user');
  if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
  res.json({ success: true, message: 'Student updated.', data: student });
};

export const deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { status: 'inactive' },
    { new: true }
  );
  if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
  res.json({ success: true, message: 'Student marked inactive.' });
};

export const uploadPhoto = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { photo: `/uploads/avatar/${req.file.filename}` },
    { new: true }
  );
  res.json({ success: true, data: { photo: student.photo } });
};

export const bulkImportCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No CSV file uploaded.' });

  const results = [];
  const errors = [];

  const stream = Readable.from(req.file.buffer);
  stream
    .pipe(csvParser())
    .on('data', (row) => results.push(row))
    .on('end', async () => {
      let created = 0;
      for (const row of results) {
        try {
          const user = await User.create({
            name: `${row.firstName} ${row.lastName}`,
            email: row.email,
            password: row.password || 'ChangeMe@123',
            role: 'student',
          });
          const sId = row.studentId || `STU${Date.now().toString().slice(-6)}`;
          await Student.create({
            user: user._id,
            studentId: sId,
            firstName: row.firstName,
            lastName: row.lastName,
          });
          created++;
        } catch (e) {
          errors.push({ row, error: e.message });
        }
      }
      res.json({ success: true, message: `Imported ${created} students. ${errors.length} errors.`, errors });
    });
};
