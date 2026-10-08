import prisma from '../config/db.js';
import { getExercisePRDetails, getUserWorkouts } from '../services/workoutService.js';

/**
 * @desc    Get all muscle groups with exercise counts
 * @route   GET /api/muscle-groups
 * @access  Public
 */
export const getMuscleGroups = async (req, res, next) => {
  try {
    const muscleGroups = await prisma.muscleGroup.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: { exercises: true }
        }
      }
    });

    const formatted = muscleGroups.map((mg) => ({
      id: mg.id,
      name: mg.name,
      exerciseCount: mg._count.exercises
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all exercises for a specific muscle group
 * @route   GET /api/muscle-groups/:id/exercises
 * @access  Public (optional auth for user PR badges)
 */
export const getExercisesByMuscleGroup = async (req, res, next) => {
  try {
    const muscleGroupId = parseInt(req.params.id, 10);

    if (isNaN(muscleGroupId)) {
      return res.status(400).json({ success: false, message: 'Invalid muscle group ID' });
    }

    const muscleGroup = await prisma.muscleGroup.findUnique({
      where: { id: muscleGroupId },
      include: {
        exercises: {
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!muscleGroup) {
      return res.status(404).json({ success: false, message: 'Muscle group not found' });
    }

    // If request has authenticated user, include their max PR for each exercise
    const userId = req.user?.id;
    let exercisesWithPR = muscleGroup.exercises;

    if (userId) {
      const userRecords = await prisma.workoutRecord.findMany({
        where: {
          userId,
          exercise: { muscleGroupId }
        },
        select: {
          exerciseId: true,
          weight: true
        }
      });

      const maxMap = {};
      userRecords.forEach((r) => {
        if (!maxMap[r.exerciseId] || r.weight > maxMap[r.exerciseId]) {
          maxMap[r.exerciseId] = r.weight;
        }
      });

      exercisesWithPR = muscleGroup.exercises.map((ex) => ({
        ...ex,
        personalRecord: maxMap[ex.id] || null
      }));
    }

    return res.status(200).json({
      success: true,
      muscleGroup: {
        id: muscleGroup.id,
        name: muscleGroup.name
      },
      count: exercisesWithPR.length,
      data: exercisesWithPR
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all exercises across all groups (supports ?search= and ?muscleGroupId=)
 * @route   GET /api/exercises
 * @access  Public (optional auth for user PR badges)
 */
export const getAllExercises = async (req, res, next) => {
  try {
    const { search, muscleGroupId } = req.query;

    const where = {};
    if (muscleGroupId) {
      where.muscleGroupId = parseInt(muscleGroupId, 10);
    }
    if (search && search.trim()) {
      where.name = {
        contains: search.trim(),
        mode: 'insensitive'
      };
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: [
        { muscleGroupId: 'asc' },
        { name: 'asc' }
      ],
      include: {
        muscleGroup: true
      }
    });

    // If request has authenticated user, attach their PR
    const userId = req.user?.id;
    let exercisesWithPR = exercises;

    if (userId) {
      const userRecords = await prisma.workoutRecord.findMany({
        where: { userId },
        select: {
          exerciseId: true,
          weight: true
        }
      });

      const maxMap = {};
      userRecords.forEach((r) => {
        if (!maxMap[r.exerciseId] || r.weight > maxMap[r.exerciseId]) {
          maxMap[r.exerciseId] = r.weight;
        }
      });

      exercisesWithPR = exercises.map((ex) => ({
        ...ex,
        personalRecord: maxMap[ex.id] || null
      }));
    }

    return res.status(200).json({
      success: true,
      count: exercisesWithPR.length,
      data: exercisesWithPR
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get exercise by ID
 * @route   GET /api/exercises/:id
 * @access  Public
 */
export const getExerciseById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid exercise ID' });
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: { muscleGroup: true }
    });

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }

    return res.status(200).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's workout history for an exercise
 * @route   GET /api/exercises/:id/workouts
 * @access  Private
 */
export const getExerciseWorkouts = async (req, res, next) => {
  try {
    const exerciseId = parseInt(req.params.id, 10);

    if (isNaN(exerciseId)) {
      return res.status(400).json({ success: false, message: 'Invalid exercise ID' });
    }

    const details = await getExercisePRDetails(exerciseId, req.user.id);

    return res.status(200).json({
      success: true,
      data: details
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's PR for an exercise
 * @route   GET /api/exercises/:id/pr
 * @access  Private
 */
export const getExercisePR = async (req, res, next) => {
  try {
    const exerciseId = parseInt(req.params.id, 10);

    if (isNaN(exerciseId)) {
      return res.status(400).json({ success: false, message: 'Invalid exercise ID' });
    }

    const details = await getExercisePRDetails(exerciseId, req.user.id);

    return res.status(200).json({
      success: true,
      data: {
        exercise: details.exercise,
        maxWeight: details.maxWeight,
        bestRepsAtMaxWeight: details.bestRepsAtMaxWeight,
        best1RM: details.best1RM,
        maxVolume: details.maxVolume,
        totalSets: details.totalSets,
        latestWorkout: details.latestWorkout
      }
    });
  } catch (error) {
    next(error);
  }
};
