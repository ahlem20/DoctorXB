import express from 'express';
import { getDashboardStats, getRecentActivity } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/stats').get(protect, getDashboardStats);
router.route('/activity').get(protect, getRecentActivity);

export default router;
