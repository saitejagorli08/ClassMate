import express from 'express';
import Department from '../models/Department.js';
import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import Class from '../models/Class.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

// Departments
router.get('/departments', async (req, res) => {
  const data = await Department.find({ isActive: true }).populate('head', 'firstName lastName');
  res.json({ success: true, data });
});
router.post('/departments', authorize('admin'), async (req, res) => {
  const doc = await Department.create(req.body);
  res.status(201).json({ success: true, data: doc });
});
router.put('/departments/:id', authorize('admin'), async (req, res) => {
  const doc = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: doc });
});

// Courses
router.get('/courses', async (req, res) => {
  const { department } = req.query;
  const filter = { isActive: true };
  if (department) filter.department = department;
  const data = await Course.find(filter).populate('department', 'name code');
  res.json({ success: true, data });
});
router.post('/courses', authorize('admin'), async (req, res) => {
  const doc = await Course.create(req.body);
  res.status(201).json({ success: true, data: doc });
});
router.put('/courses/:id', authorize('admin'), async (req, res) => {
  const doc = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: doc });
});

// Subjects
router.get('/subjects', async (req, res) => {
  const { course, semester } = req.query;
  const filter = { isActive: true };
  if (course) filter.course = course;
  if (semester) filter.semester = semester;
  const data = await Subject.find(filter).populate('course', 'name').populate('faculty', 'firstName lastName');
  res.json({ success: true, data });
});
router.post('/subjects', authorize('admin'), async (req, res) => {
  const doc = await Subject.create(req.body);
  res.status(201).json({ success: true, data: doc });
});
router.put('/subjects/:id', authorize('admin'), async (req, res) => {
  const doc = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: doc });
});

// Classes
router.get('/classes', async (req, res) => {
  const { course, semester, academicYear } = req.query;
  const filter = { isActive: true };
  if (course) filter.course = course;
  if (semester) filter.semester = semester;
  if (academicYear) filter.academicYear = academicYear;
  const data = await Class.find(filter)
    .populate('course', 'name code')
    .populate('department', 'name')
    .populate('classTeacher', 'firstName lastName');
  res.json({ success: true, data });
});
router.post('/classes', authorize('admin'), async (req, res) => {
  const doc = await Class.create(req.body);
  res.status(201).json({ success: true, data: doc });
});
router.put('/classes/:id', authorize('admin'), async (req, res) => {
  const doc = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: doc });
});

export default router;
