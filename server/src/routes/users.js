import express from 'express';
import { getUsers, createUser, getUserById, updateUser, deactivateUser } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/', authorize('admin'), getUsers);
router.post('/', authorize('admin'), createUser);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deactivateUser);

export default router;
