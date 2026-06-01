import express from 'express';
import { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, updateUserPermissions, deleteUser } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

router.route('/users').get(protect, admin, getUsers);
router.route('/staff').get(protect, getUsers);
router.route('/users/:id')
  .delete(protect, admin, deleteUser);
router.route('/users/:id/permissions').put(protect, admin, updateUserPermissions);

export default router;
