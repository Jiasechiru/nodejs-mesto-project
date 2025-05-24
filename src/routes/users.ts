import { Router } from 'express';
import { idParamValidator, updateAvatarValidator, updateUserValidator } from '../middlewares/requestValidators';
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
router.get('/:userId', idParamValidator, getUserById);
router.patch('/me', updateUserValidator, updateUser);
router.patch('/me/avatar', updateAvatarValidator, updateAvatar);

export default router;
