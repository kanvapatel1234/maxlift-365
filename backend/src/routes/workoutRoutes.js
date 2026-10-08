import express from 'express';
import {
  createWorkout,
  getMyWorkouts,
  getSingleWorkout,
  deleteWorkout
} from '../controllers/workoutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All workout routes require authentication
router.use(protect);

router.post('/', createWorkout);
router.get('/', getMyWorkouts);
router.get('/:id', getSingleWorkout);
router.delete('/:id', deleteWorkout);

export default router;
