import express from 'express';
import {
  getAllExercises,
  getExerciseById,
  getExerciseWorkouts,
  getExercisePR
} from '../controllers/exerciseController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getAllExercises);
router.get('/:id', getExerciseById);
router.get('/:id/workouts', protect, getExerciseWorkouts);
router.get('/:id/pr', protect, getExercisePR);

export default router;
