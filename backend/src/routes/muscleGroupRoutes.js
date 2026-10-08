import express from 'express';
import { getMuscleGroups, getExercisesByMuscleGroup } from '../controllers/exerciseController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMuscleGroups);
router.get('/:id/exercises', optionalAuth, getExercisesByMuscleGroup);

export default router;
