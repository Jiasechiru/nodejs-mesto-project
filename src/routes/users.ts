import { Router } from 'express';
import {
  getUserById,
  getUsers,
  updateUser,
  updateAvatar,
  getCurrentUser,
} from '../controllers/users';

const router = Router();
router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
