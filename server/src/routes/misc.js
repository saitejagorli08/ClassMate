import express from 'express';
import Announcement from '../models/Announcement.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import Payment from '../models/Payment.js';
import FeeStructure from '../models/FeeStructure.js';
import Timetable from '../models/Timetable.js';
import Notification from '../models/Notification.js';
import Faculty from '../models/Faculty.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

// ─── ANNOUNCEMENTS ─────────────────────────────────────────────────────────
router.get('/announcements', async (req, res) => {
  const filter = { isPublished: true };
  if (req.user.role !== 'admin') filter.$or = [{ targetRole: 'all' }, { targetRole: req.user.role }];
  const data = await Announcement.find(filter).populate('author', 'name').sort({ isPinned: -1, createdAt: -1 }).limit(50);
  res.json({ success: true, data });
});
router.post('/announcements', authorize('admin', 'faculty'), async (req, res) => {
  const doc = await Announcement.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, data: doc });
});
router.put('/announcements/:id', authorize('admin', 'faculty'), async (req, res) => {
  const doc = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: doc });
});
router.delete('/announcements/:id', authorize('admin'), async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Announcement deleted.' });
});

// ─── ASSIGNMENTS ────────────────────────────────────────────────────────────
router.get('/assignments', async (req, res) => {
  const { classId, subjectId } = req.query;
  const filter = { isPublished: true };
  if (classId) filter.class = classId;
  if (subjectId) filter.subject = subjectId;
  const data = await Assignment.find(filter)
    .populate('subject', 'name code')
    .populate('faculty', 'firstName lastName')
    .sort({ dueDate: 1 });
  res.json({ success: true, data });
});
router.post('/assignments', authorize('faculty', 'admin'), async (req, res) => {
  const faculty = await Faculty.findOne({ user: req.user._id });
  const doc = await Assignment.create({ ...req.body, faculty: faculty?._id });
  res.status(201).json({ success: true, data: doc });
});
router.put('/assignments/:id', authorize('faculty', 'admin'), async (req, res) => {
  const doc = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: doc });
});

// ─── SUBMISSIONS ────────────────────────────────────────────────────────────
router.get('/submissions', authorize('faculty', 'admin'), async (req, res) => {
  const { assignmentId } = req.query;
  const filter = {};
  if (assignmentId) filter.assignment = assignmentId;
  const data = await Submission.find(filter)
    .populate('student', 'studentId firstName lastName')
    .populate('assignment', 'title');
  res.json({ success: true, data });
});
router.post('/submissions', authorize('student'), async (req, res) => {
  const { Assignment: AssignmentModel } = await import('../models/Assignment.js');
  const assignment = await Assignment.findById(req.body.assignment);
  const isLate = assignment?.dueDate && new Date() > new Date(assignment.dueDate);
  const doc = await Submission.create({ ...req.body, isLate });
  res.status(201).json({ success: true, data: doc });
});
router.put('/submissions/:id/grade', authorize('faculty', 'admin'), async (req, res) => {
  const doc = await Submission.findByIdAndUpdate(
    req.params.id,
    { ...req.body, status: 'graded', gradedBy: req.user._id, gradedAt: new Date() },
    { new: true }
  );
  res.json({ success: true, data: doc });
});

// ─── FEES ───────────────────────────────────────────────────────────────────
router.get('/fee-structures', async (req, res) => {
  const { course, semester, academicYear } = req.query;
  const filter = {};
  if (course) filter.course = course;
  if (semester) filter.semester = semester;
  if (academicYear) filter.academicYear = academicYear;
  const data = await FeeStructure.find(filter).populate('course', 'name');
  res.json({ success: true, data });
});
router.post('/fee-structures', authorize('admin'), async (req, res) => {
  const doc = await FeeStructure.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

router.get('/payments', authorize('admin', 'faculty', 'student'), async (req, res) => {
  const { studentId } = req.query;
  const filter = {};
  if (studentId) filter.student = studentId;
  const data = await Payment.find(filter).populate('student', 'studentId firstName lastName').sort({ paymentDate: -1 });
  res.json({ success: true, data });
});
router.post('/payments', authorize('admin'), async (req, res) => {
  const receiptNumber = `RCP-${Date.now()}`;
  const doc = await Payment.create({ ...req.body, receiptNumber, recordedBy: req.user._id });
  res.status(201).json({ success: true, data: doc });
});

// ─── TIMETABLE ──────────────────────────────────────────────────────────────
router.get('/timetable/:classId', async (req, res) => {
  const { academicYear } = req.query;
  const filter = { class: req.params.classId };
  if (academicYear) filter.academicYear = academicYear;
  const data = await Timetable.findOne(filter)
    .populate('schedule.periods.subject', 'name code')
    .populate('schedule.periods.faculty', 'firstName lastName');
  res.json({ success: true, data });
});
router.post('/timetable', authorize('admin'), async (req, res) => {
  const doc = await Timetable.findOneAndUpdate(
    { class: req.body.class, academicYear: req.body.academicYear },
    req.body,
    { upsert: true, new: true, runValidators: true }
  );
  res.status(201).json({ success: true, data: doc });
});

// ─── NOTIFICATIONS ──────────────────────────────────────────────────────────
router.get('/notifications', async (req, res) => {
  const data = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(30);
  res.json({ success: true, data });
});
router.put('/notifications/:id/read', async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});
router.put('/notifications/read-all', async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true });
});

// ─── FACULTY ────────────────────────────────────────────────────────────────
router.get('/faculty', authorize('admin', 'faculty', 'student'), async (req, res) => {
  const { department, search } = req.query;
  const filter = { status: 'active' };
  if (department) filter.department = department;
  if (search) filter.$or = [
    { firstName: { $regex: search, $options: 'i' } },
    { lastName: { $regex: search, $options: 'i' } },
  ];
  const data = await Faculty.find(filter)
    .populate('department', 'name code')
    .populate('user', 'name email')
    .sort({ firstName: 1 });
  res.json({ success: true, data });
});
router.get('/faculty/:id', async (req, res) => {
  const data = await Faculty.findById(req.params.id)
    .populate('department', 'name code')
    .populate('subjects', 'name code')
    .populate('user', 'name email phone');
  if (!data) return res.status(404).json({ success: false, message: 'Faculty not found.' });
  res.json({ success: true, data });
});
router.post('/faculty', authorize('admin'), async (req, res) => {
  const { user: userData, personalInfo, employeeId, designation, department, qualification, specialization } = req.body;
  let userId = req.body.user;
  if (typeof userData === 'object' && userData?.email) {
    let existing = await User.findOne({ email: userData.email });
    if (!existing) {
      existing = await User.create({
        name: userData.name || `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim(),
        email: userData.email,
        password: userData.password || 'Faculty@123!',
        role: 'faculty',
        phone: personalInfo?.phone,
      });
    }
    userId = existing._id;
  }

  const empId = employeeId || `FAC${Date.now().toString().slice(-4)}`;
  const fName = personalInfo?.firstName || req.body.firstName || 'Faculty';
  const lName = personalInfo?.lastName || req.body.lastName || 'Member';

  const doc = await Faculty.create({
    user: userId,
    employeeId: empId,
    firstName: fName,
    lastName: lName,
    department: department || undefined,
    designation: designation || 'Assistant Professor',
    qualification,
    specialization,
  });

  if (userId) {
    await User.findByIdAndUpdate(userId, { facultyProfile: doc._id });
  }

  res.status(201).json({ success: true, data: doc });
});

router.delete('/faculty/:id', authorize('admin'), async (req, res) => {
  const doc = await Faculty.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true });
  if (!doc) return res.status(404).json({ success: false, message: 'Faculty not found.' });
  res.json({ success: true, message: 'Faculty member deactivated.' });
});

// ─── FEES ──────────────────────────────────────────────────────────────────
router.get('/fees', authorize('admin', 'faculty', 'student'), async (req, res) => {
  const filter = {};
  if (req.user.role === 'student') {
    const student = await (await import('../models/Student.js')).default.findOne({ user: req.user._id });
    if (student) filter.student = student._id;
  }
  const data = await Payment.find(filter)
    .populate('student', 'studentId firstName lastName')
    .sort({ paymentDate: -1 });
  res.json({ success: true, data });
});

// ─── ENROLLMENTS ────────────────────────────────────────────────────────────
router.get('/enrollments', authorize('admin', 'faculty'), async (req, res) => {
  const { classId, studentId } = req.query;
  const filter = {};
  if (classId) filter.class = classId;
  if (studentId) filter.student = studentId;
  const data = await (await import('../models/Enrollment.js')).default
    .find(filter)
    .populate('student', 'studentId firstName lastName')
    .populate('class', 'name semester');
  res.json({ success: true, data });
});
router.post('/enrollments', authorize('admin'), async (req, res) => {
  const { default: Enrollment } = await import('../models/Enrollment.js');
  const doc = await Enrollment.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

export default router;
