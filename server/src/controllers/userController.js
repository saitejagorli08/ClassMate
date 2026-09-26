import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import { generateStudentId, generateEmployeeId } from '../utils/idGenerator.js';

export const getUsers = async (req, res) => {
  const { page = 1, limit = 20, role, search, isActive } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({ success: true, data: users, pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) } });
};

export const createUser = async (req, res) => {
  const { name, email, password, role, phone, ...profileData } = req.body;
  const user = await User.create({ name, email, password, role, phone });

  if (role === 'student') {
    const studentId = await generateStudentId();
    const profile = await Student.create({
      user: user._id,
      studentId,
      firstName: profileData.firstName || name.split(' ')[0],
      lastName: profileData.lastName || name.split(' ').slice(1).join(' ') || '',
      ...profileData,
    });
    user.studentProfile = profile._id;
    await user.save();
  } else if (role === 'faculty') {
    const employeeId = await generateEmployeeId();
    const profile = await Faculty.create({
      user: user._id,
      employeeId,
      firstName: profileData.firstName || name.split(' ')[0],
      lastName: profileData.lastName || name.split(' ').slice(1).join(' ') || '',
      ...profileData,
    });
    user.facultyProfile = profile._id;
    await user.save();
  }

  res.status(201).json({ success: true, message: 'User created successfully.', data: user });
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).populate('studentProfile').populate('facultyProfile');
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, data: user });
};

export const updateUser = async (req, res) => {
  const { password, role, ...updateData } = req.body; // prevent role/password change here
  const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, message: 'User updated.', data: user });
};

export const deactivateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, message: 'User deactivated.' });
};
