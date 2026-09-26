import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { markAttendance, getAttendanceByClass, getStudentAttendance, correctAttendance } from '../controllers/attendanceController.js';

const router = express.Router();
router.use(authenticate);

router.post('/mark', authorize('faculty', 'admin'), markAttendance);
router.post('/mark-bulk', authorize('faculty', 'admin'), markAttendance);
router.get('/class', authorize('faculty', 'admin'), getAttendanceByClass);
router.get('/class/:classId', authorize('faculty', 'admin'), (req, res, next) => {
  req.query.classId = req.params.classId;
  return getAttendanceByClass(req, res, next);
});
router.get('/student/:studentId', authorize('admin', 'faculty', 'student'), getStudentAttendance);
router.put('/correct', authorize('admin', 'faculty'), correctAttendance);

export default router;
