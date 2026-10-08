import {
  createWorkoutRecord,
  getUserWorkouts,
  getWorkoutById,
  deleteWorkoutRecord
} from '../services/workoutService.js';

/**
 * @desc    Log a new workout record
 * @route   POST /api/workouts
 * @access  Private
 */
export const createWorkout = async (req, res, next) => {
  try {
    const { exerciseId, weight, reps, performedAt } = req.body;

    if (!exerciseId) {
      return res.status(400).json({ success: false, message: 'exerciseId is required' });
    }

    if (weight === undefined || weight === null || weight === '') {
      return res.status(400).json({ success: false, message: 'weight is required' });
    }

    if (reps === undefined || reps === null || reps === '') {
      return res.status(400).json({ success: false, message: 'reps is required' });
    }

    // Always use req.user.id for security
    const result = await createWorkoutRecord(req.user.id, {
      exerciseId,
      weight,
      reps,
      performedAt
    });

    return res.status(201).json({
      success: true,
      message: result.isNewMaxWeightPR
        ? `🔥 NEW PR! Logged ${result.weight} kg on ${result.exercise.name}!`
        : 'Workout recorded successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get authenticated user's workout records
 * @route   GET /api/workouts
 * @access  Private
 */
export const getMyWorkouts = async (req, res, next) => {
  try {
    const { limit, offset, exerciseId, muscleGroupId } = req.query;

    const result = await getUserWorkouts(req.user.id, {
      limit,
      offset,
      exerciseId,
      muscleGroupId
    });

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single workout record by ID
 * @route   GET /api/workouts/:id
 * @access  Private
 */
export const getSingleWorkout = async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const record = await getWorkoutById(workoutId, req.user.id);

    return res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a workout record by ID
 * @route   DELETE /api/workouts/:id
 * @access  Private
 */
export const deleteWorkout = async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const result = await deleteWorkoutRecord(workoutId, req.user.id);

    return res.status(200).json({
      success: true,
      message: result.message,
      deletedId: result.id
    });
  } catch (error) {
    next(error);
  }
};
