import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { studentChat, generateQuiz, summarizeClassPerformance } from '../controllers/aiController.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
router.use(authenticate);
router.use(aiLimiter);

router.post('/chat', authorize('student', 'admin'), studentChat);
router.post('/quiz', authorize('faculty', 'admin'), generateQuiz);
router.get('/performance/:examinationId', authorize('faculty', 'admin'), summarizeClassPerformance);

export default router;
