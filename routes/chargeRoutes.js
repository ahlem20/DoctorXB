import express from 'express';
import { getCharges, createCharge, deleteCharge } from '../controllers/chargeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCharges)
  .post(protect, createCharge);

router.route('/:id')
  .delete(protect, deleteCharge);

export default router;
