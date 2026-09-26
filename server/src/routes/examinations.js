import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  createExamination, getExaminations, enterResults, getStudentResults, getClassResults
} from '../controllers/examinationController.js';

const router = express.Router();
router.use(authenticate);

router.post('/', authorize('faculty', 'admin'), createExamination);
router.get('/', authorize('admin', 'faculty'), getExaminations);
router.post('/results', authorize('faculty', 'admin'), enterResults);
router.get('/results/student/:studentId', authorize('admin', 'faculty', 'student'), getStudentResults);
router.get('/results/class/:examinationId', authorize('admin', 'faculty'), getClassResults);

export default router;
