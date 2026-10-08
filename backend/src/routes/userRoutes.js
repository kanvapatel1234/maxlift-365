import express from 'express';
import { getUserProfile, getUserStats } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// User profile & stats require authentication
router.use(protect);

router.get('/profile', getUserProfile);
router.get('/stats', getUserStats);

export default router;
