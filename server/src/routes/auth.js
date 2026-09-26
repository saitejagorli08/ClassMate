import express from 'express';
import { login, logout, refreshToken, getMe, forgotPassword, resetPassword, changePassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', authLimiter, login);
router.post('/logout', authenticate, logout);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getMe);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/change-password', authenticate, changePassword);

export default router;
