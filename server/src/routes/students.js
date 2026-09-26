import express from 'express';
import {
  getStudents,
  getStudentById,
  getStudentMe,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadPhoto,
  bulkImportCSV,
} from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.use(authenticate);

router.get('/me', getStudentMe);
router.get('/', authorize('admin', 'faculty'), getStudents);
router.post('/', authorize('admin'), createStudent);
router.get('/:id', authorize('admin', 'faculty', 'student'), getStudentById);
router.put('/:id', authorize('admin', 'faculty'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);
router.post('/:id/photo', authorize('admin', 'student'), upload.single('avatar'), uploadPhoto);
router.post('/import/csv', authorize('admin'), upload.single('csv'), bulkImportCSV);

export default router;
