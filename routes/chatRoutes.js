import express from 'express';
import { getChatMessages, sendChatMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getChatMessages)
  .post(protect, sendChatMessage);

export default router;
