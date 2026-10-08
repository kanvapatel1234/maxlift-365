import prisma from '../config/db.js';

/**
 * Calculate estimated 1-Rep Max using the Epley formula:
 * 1RM = weight * (1 + reps / 30)
 * Note: If reps == 1, 1RM = weight.
 */
export const calculate1RM = (weight, reps) => {
  if (!weight || weight <= 0) return 0;
  if (reps <= 1) return Number(weight.toFixed(1));
  const oneRm = weight * (1 + reps / 30);
  return Number(oneRm.toFixed(1));
};

export const createWorkoutRecord = async (userId, { exerciseId, weight, reps, performedAt }) => {
  const numericExerciseId = parseInt(exerciseId, 10);
  const numericWeight = parseFloat(weight);
  const numericReps = parseInt(reps, 10);

  if (isNaN(numericExerciseId)) {
    const error = new Error('Valid exerciseId is required');
    error.statusCode = 400;
    throw error;
  }

  if (isNaN(numericWeight) || numericWeight <= 0) {
    const error = new Error('Weight must be a positive number');
    error.statusCode = 400;
    throw error;
  }

  if (isNaN(numericReps) || numericReps <= 0) {
    const error = new Error('Reps must be a positive integer');
    error.statusCode = 400;
    throw error;
  }

  // Check exercise exists
  const exercise = await prisma.exercise.findUnique({
    where: { id: numericExerciseId },
    include: { muscleGroup: true }
  });

  if (!exercise) {
    const error = new Error('Exercise not found');
    error.statusCode = 404;
    throw error;
  }

  // Find previous max weight for PR detection
  const previousRecords = await prisma.workoutRecord.findMany({
    where: {
      userId,
      exerciseId: numericExerciseId
    },
    select: {
      weight: true
    }
  });

  const previousMaxWeight = previousRecords.length > 0
    ? Math.max(...previousRecords.map((r) => r.weight))
    : 0;

  const isNewMaxWeightPR = numericWeight > previousMaxWeight;

  const recordDate = performedAt ? new Date(performedAt) : new Date();

  const newRecord = await prisma.workoutRecord.create({
    data: {
      userId,
      exerciseId: numericExerciseId,
      weight: numericWeight,
      reps: numericReps,
      performedAt: recordDate
    },
    include: {
      exercise: {
        include: {
          muscleGroup: true
        }
      }
    }
  });

  return {
    ...newRecord,
    estimated1RM: calculate1RM(numericWeight, numericReps),
    isNewMaxWeightPR,
    previousMaxWeight
  };
};

export const getUserWorkouts = async (userId, { limit = 50, offset = 0, exerciseId, muscleGroupId } = {}) => {
  const where = { userId };

  if (exerciseId) {
    where.exerciseId = parseInt(exerciseId, 10);
  }

  if (muscleGroupId) {
    where.exercise = {
      muscleGroupId: parseInt(muscleGroupId, 10)
    };
  }

  const [records, total] = await Promise.all([
    prisma.workoutRecord.findMany({
      where,
      orderBy: [
        { performedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: parseInt(offset, 10) || 0,
      take: parseInt(limit, 10) || 50,
      include: {
        exercise: {
          include: {
            muscleGroup: true
          }
        }
      }
    }),
    prisma.workoutRecord.count({ where })
  ]);

  const formatted = records.map((r) => ({
    ...r,
    estimated1RM: calculate1RM(r.weight, r.reps)
  }));

  return {
    records: formatted,
    total,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10)
  };
};

export const getWorkoutById = async (workoutId, userId) => {
  const record = await prisma.workoutRecord.findUnique({
    where: { id: parseInt(workoutId, 10) },
    include: {
      exercise: {
        include: {
          muscleGroup: true
        }
      }
    }
  });

  if (!record) {
    const error = new Error('Workout record not found');
    error.statusCode = 404;
    throw error;
  }

  if (record.userId !== userId) {
    const error = new Error('Not authorized to access this workout record');
    error.statusCode = 403;
    throw error;
  }

  return {
    ...record,
    estimated1RM: calculate1RM(record.weight, record.reps)
  };
};

export const deleteWorkoutRecord = async (workoutId, userId) => {
  const numericId = parseInt(workoutId, 10);

  const record = await prisma.workoutRecord.findUnique({
    where: { id: numericId }
  });

  if (!record) {
    const error = new Error('Workout record not found');
    error.statusCode = 404;
    throw error;
  }

  if (record.userId !== userId) {
    const error = new Error('Not authorized to delete this workout record');
    error.statusCode = 403;
    throw error;
  }

  await prisma.workoutRecord.delete({
    where: { id: numericId }
  });

  return { id: numericId, message: 'Workout record deleted successfully' };
};

export const getExercisePRDetails = async (exerciseId, userId) => {
  const numericExerciseId = parseInt(exerciseId, 10);

  const exercise = await prisma.exercise.findUnique({
    where: { id: numericExerciseId },
    include: { muscleGroup: true }
  });

  if (!exercise) {
    const error = new Error('Exercise not found');
    error.statusCode = 404;
    throw error;
  }

  const records = await prisma.workoutRecord.findMany({
    where: {
      exerciseId: numericExerciseId,
      userId
    },
    orderBy: [
      { performedAt: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  if (records.length === 0) {
    return {
      exercise,
      totalSets: 0,
      maxWeight: 0,
      bestRepsAtMaxWeight: 0,
      best1RM: 0,
      maxVolume: 0,
      latestWorkout: null,
      history: []
    };
  }

  let maxWeight = 0;
  let bestRepsAtMaxWeight = 0;
  let best1RM = 0;
  let maxVolume = 0;

  for (const r of records) {
    if (r.weight > maxWeight) {
      maxWeight = r.weight;
      bestRepsAtMaxWeight = r.reps;
    } else if (r.weight === maxWeight && r.reps > bestRepsAtMaxWeight) {
      bestRepsAtMaxWeight = r.reps;
    }

    const calculated1RM = calculate1RM(r.weight, r.reps);
    if (calculated1RM > best1RM) {
      best1RM = calculated1RM;
    }

    const volume = r.weight * r.reps;
    if (volume > maxVolume) {
      maxVolume = volume;
    }
  }

  const history = records.map((r) => {
    const calculated1RM = calculate1RM(r.weight, r.reps);
    return {
      ...r,
      estimated1RM: calculated1RM,
      isMaxWeightPR: r.weight === maxWeight,
      isBest1RMPR: calculated1RM === best1RM
    };
  });

  return {
    exercise,
    totalSets: records.length,
    maxWeight,
    bestRepsAtMaxWeight,
    best1RM,
    maxVolume,
    latestWorkout: history[0] || null,
    history
  };
};

export const getUserDashboardStats = async (userId) => {
  const userRecords = await prisma.workoutRecord.findMany({
    where: { userId },
    include: {
      exercise: {
        include: {
          muscleGroup: true
        }
      }
    },
    orderBy: [
      { performedAt: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  const totalWorkouts = userRecords.length;

  // Distinct exercises
  const exerciseMap = new Map();
  let totalVolume = 0;

  for (const r of userRecords) {
    totalVolume += (r.weight * r.reps);

    if (!exerciseMap.has(r.exerciseId)) {
      exerciseMap.set(r.exerciseId, {
        exercise: r.exercise,
        maxWeight: r.weight,
        best1RM: calculate1RM(r.weight, r.reps),
        totalSets: 1,
        latestDate: r.performedAt
      });
    } else {
      const existing = exerciseMap.get(r.exerciseId);
      existing.totalSets += 1;
      if (r.weight > existing.maxWeight) {
        existing.maxWeight = r.weight;
      }
      const e1RM = calculate1RM(r.weight, r.reps);
      if (e1RM > existing.best1RM) {
        existing.best1RM = e1RM;
      }
    }
  }

  const personalRecords = Array.from(exerciseMap.values()).map((item) => ({
    exerciseId: item.exercise.id,
    exerciseName: item.exercise.name,
    muscleGroup: item.exercise.muscleGroup.name,
    maxWeight: item.maxWeight,
    best1RM: item.best1RM,
    totalSets: item.totalSets,
    latestDate: item.latestDate
  })).sort((a, b) => b.maxWeight - a.maxWeight);

  const recentWorkouts = userRecords.slice(0, 8).map((r) => ({
    ...r,
    estimated1RM: calculate1RM(r.weight, r.reps)
  }));

  return {
    totalWorkouts,
    exercisesTrackedCount: exerciseMap.size,
    personalRecordsCount: personalRecords.length,
    totalVolumeKg: Math.round(totalVolume),
    recentWorkouts,
    topPRs: personalRecords.slice(0, 6)
  };
};
