import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getAdminAnalytics, getFacultyAnalytics, getStudentAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();
router.use(authenticate);

router.get('/admin', authorize('admin'), getAdminAnalytics);
router.get('/faculty', authorize('faculty'), getFacultyAnalytics);
router.get('/student', authorize('student'), getStudentAnalytics);

export default router;
