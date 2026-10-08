import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const muscleGroupsData = [
  {
    name: 'Chest',
    exercises: [
      { name: 'Barbell Bench Press', description: 'Compound push exercise targeting the sternal and clavicular head of the pectorals.' },
      { name: 'Incline Barbell Bench Press', description: 'Compound movement emphasizing the clavicular upper pectoral fibers.' },
      { name: 'Decline Barbell Bench Press', description: 'Targets the lower pectoral fibers and allows heavier mechanical loading.' },
      { name: 'Flat Dumbbell Press', description: 'Provides deep pectoral stretch and unilateral stabilizer recruitment.' },
      { name: 'Incline Dumbbell Press', description: 'Builds upper chest density with full range of motion at top contraction.' },
      { name: 'Decline Dumbbell Press', description: 'Unilateral lower pectoral builder reducing anterior shoulder stress.' },
      { name: 'Cable Crossover', description: 'Constant cable tension across the chest line for peak metabolic stress.' },
      { name: 'Low-to-High Cable Fly', description: 'Upward rotational arc focusing on the upper chest fibers.' },
      { name: 'High-to-Low Cable Fly', description: 'Downward fly trajectory focusing on lower chest definition.' },
      { name: 'Dumbbell Chest Fly', description: 'Isolation exercise offering deep eccentric stretch across the pectoralis major.' },
      { name: 'Chest Dips', description: 'Bodyweight compound dip with forward torso lean to overload chest.' },
      { name: 'Pec Deck Machine Fly', description: 'Fixed path machine isolation ensuring maximal squeeze without stabilizing.' },
      { name: 'Machine Chest Press', description: 'Plate or pin-loaded machine press for safe failure training.' },
      { name: 'Push-Ups (Standard / Deficit)', description: 'Calisthenic horizontal push engaging core, serratus anterior, and chest.' }
    ]
  },
  {
    name: 'Back',
    exercises: [
      { name: 'Conventional Deadlift', description: 'Posterior chain compound king targeting erectors, lats, traps, and glutes.' },
      { name: 'Barbell Bent-Over Row', description: 'Mass-building horizontal pull targeting mid-back, lats, and rhomboids.' },
      { name: 'Pull-Ups', description: 'Overhand grip vertical pull emphasizing lat width and upper back.' },
      { name: 'Chin-Ups', description: 'Underhand grip vertical pull maximizing lat stretch and biceps recruitment.' },
      { name: 'Wide-Grip Lat Pulldown', description: 'Controlled vertical pulling pattern to build V-taper lat flare.' },
      { name: 'Close-Grip Lat Pulldown', description: 'Neutral grip pulldown maximizing lower lat contraction.' },
      { name: 'One-Arm Dumbbell Row', description: 'Unilateral horizontal row allowing heavy stretch and lat elbow drive.' },
      { name: 'Seated Cable Row', description: 'Cable row focusing on scapular retraction and mid-back thickness.' },
      { name: 'T-Bar Row', description: 'Supported or freestanding heavy rowing to build rhomboids and traps.' },
      { name: 'Chest-Supported Dumbbell Row', description: 'Strict row isolating mid-back without spinal erector fatigue.' },
      { name: 'Face Pulls', description: 'Crucial health movement for rear deltoids, rhomboids, and external rotators.' },
      { name: 'Straight-Arm Cable Pulldown', description: 'Isolation pull engaging the lats without bicep involvement.' },
      { name: 'Back Hyperextensions', description: 'Lower back strengthener targeting spinal erectors, glutes, and hamstrings.' }
    ]
  },
  {
    name: 'Shoulders',
    exercises: [
      { name: 'Overhead Barbell Press (OHP)', description: 'Strict standing press building anterior delts, triceps, and overhead stability.' },
      { name: 'Seated Dumbbell Shoulder Press', description: 'Vertical press providing continuous tension on the front and lateral delts.' },
      { name: 'Arnold Press', description: 'Rotational dumbbell press recruiting anterior and medial heads smoothly.' },
      { name: 'Standing Dumbbell Lateral Raise', description: 'The gold standard isolation movement for lateral head shoulder width.' },
      { name: 'Cable Lateral Raise', description: 'Continuous lateral delt tension through the entire range of motion.' },
      { name: 'Barbell Upright Row', description: 'Compound pull developing medial deltoids and upper trapezius.' },
      { name: 'Rear Delt Dumbbell Fly', description: 'Bent-over raise targeting posterior deltoid heads.' },
      { name: 'Reverse Pec Deck (Rear Delt)', description: 'Machine isolation to lock in strict posterior deltoid contractions.' },
      { name: 'Front Dumbbell Raise', description: 'Isolation movement focusing strictly on anterior deltoid development.' },
      { name: 'Barbell Shrugs', description: 'Heavy elevation targeting upper trapezius mass.' },
      { name: 'Dumbbell Shrugs', description: 'Unilateral trapezius builder with natural grip orientation.' },
      { name: 'Machine Shoulder Press', description: 'Controlled overhead pressing platform for volume and drop sets.' }
    ]
  },
  {
    name: 'Biceps',
    exercises: [
      { name: 'Standing Barbell Curl', description: 'The classic mass-builder for overall bicep volume and strength.' },
      { name: 'EZ-Bar Preacher Curl', description: 'Strict arm isolation eliminating shoulder momentum for lower bicep peak.' },
      { name: 'Incline Dumbbell Curl', description: 'Places the long head of the bicep into extreme stretch for maximal growth.' },
      { name: 'Dumbbell Hammer Curl', description: 'Neutral grip curl targeting the brachialis and brachioradialis for arm thickness.' },
      { name: 'Concentration Curl', description: 'Seated elbow-braced curl emphasizing peak contraction and mind-muscle link.' },
      { name: 'Bayesian Cable Curl', description: 'Facing away from cable pulley for maximal stretch tension at the bottom.' },
      { name: 'Standing Cable Bicep Curl', description: 'Uniform cable resistance across the whole curling curve.' },
      { name: 'Spider Curl', description: 'Prone incline bench curl isolating peak contraction of the short head.' },
      { name: 'Reverse Barbell Curl', description: 'Pronated grip curl building forearm flexors and brachioradialis.' },
      { name: 'Cable Rope Hammer Curl', description: 'Continuous resistance hammer variation with flare out at top.' }
    ]
  },
  {
    name: 'Triceps',
    exercises: [
      { name: 'Close-Grip Barbell Bench Press', description: 'Compound press overloading all three triceps heads with heavy weight.' },
      { name: 'Skull Crushers (Lying Tricep Ext)', description: 'Lying EZ-bar extension targeting medial and long heads.' },
      { name: 'Triceps Cable Rope Pushdown', description: 'Constant resistance pushdown with abduction at the lockout.' },
      { name: 'Straight Bar Cable Pushdown', description: 'Allows heavier loading on the lateral head of the triceps.' },
      { name: 'Overhead Cable Triceps Extension', description: 'Long head stretch movement using high or low cable pulley.' },
      { name: 'Dumbbell Overhead Extension', description: 'Two-handed or one-handed seated stretch for long head development.' },
      { name: 'Parallel Bar Dips (Triceps Focus)', description: 'Upright torso dip emphasizing triceps lockout power.' },
      { name: 'Diamond Push-Ups', description: 'Close-hand bodyweight push-up targeting the triceps.' },
      { name: 'Bench Dips', description: 'Elevated heel bodyweight dip for high-rep pump finisher.' },
      { name: 'Cable Kickbacks', description: 'Strict isolation ensuring constant lockout tension on the lateral head.' }
    ]
  },
  {
    name: 'Legs',
    exercises: [
      { name: 'Barbell Back Squat', description: 'The undisputed king of lower body compounds: quadriceps, glutes, adductors.' },
      { name: 'Front Squat', description: 'Upright barbell squat prioritizing quadriceps quad sweep and thoracic strength.' },
      { name: 'Romanian Deadlift (RDL)', description: 'Hinge exercise emphasizing hamstring eccentric stretch and glute loading.' },
      { name: 'Barbell Hip Thrust', description: 'Horizontal hip extension isolating gluteus maximus strength.' },
      { name: 'Leg Press', description: 'High-load machine compound to safely blast quadriceps and glutes.' },
      { name: 'Bulgarian Split Squat', description: 'Unilateral leg punishment improving balance, quad drive, and glute hypertrophy.' },
      { name: 'Hack Squat', description: 'Fixed angle squat placing enormous tension on the knee extensors and quads.' },
      { name: 'Walking Dumbbell Lunges', description: 'Dynamic unilateral leg builder testing conditioning and stability.' },
      { name: 'Leg Extension', description: 'Pure quad isolation targeting the rectus femoris in the shortened position.' },
      { name: 'Lying Hamstring Curl', description: 'Isolation knee flexion exercise hitting the hamstring belly directly.' },
      { name: 'Seated Hamstring Curl', description: 'Superior hamstring growth stimulus due to hip flexion stretch.' },
      { name: 'Standing Calf Raise', description: 'Loads the gastrocnemius under stretch with full ankle plantarflexion.' },
      { name: 'Seated Calf Raise', description: 'Targets the underlying soleus muscle through bent-knee calf raises.' },
      { name: 'Goblet Squat', description: 'Dumbbell or kettlebell front-loaded squat for deep hip mobility and quad work.' }
    ]
  },
  {
    name: 'Abs',
    exercises: [
      { name: 'Hanging Leg Raise', description: 'Hanging core movement targeting lower rectus abdominis and hip flexors.' },
      { name: 'Ab Wheel Rollout', description: 'Bracing anti-extension movement creating immense abdominal tension.' },
      { name: 'Cable Crunch', description: 'Kneeling weighted crunch providing progressive overload for rectus abdominis.' },
      { name: 'Cable Woodchoppers', description: 'Rotational core power exercise building transverse abs and obliques.' },
      { name: 'Weighted Plank', description: 'Isometric anti-extension core hold supporting spinal column stability.' },
      { name: 'Russian Twists', description: 'Seated rotational movement engaging external and internal obliques.' },
      { name: 'Decline Sit-Up', description: 'Elevated abdominal flexion allowing extended range of motion.' },
      { name: 'Captain’s Chair Knee Raise', description: 'Supported forearm knee raises for concentrated lower abdominal firing.' },
      { name: 'Bicycle Crunches', description: 'Alternating rotational crunch targeting rectus abdominis and obliques.' },
      { name: 'Dragon Flag', description: 'Advanced straight-body lever movement popularized by Bruce Lee.' }
    ]
  }
];

async function main() {
  console.log('--- Starting MaxLift365 Database Seeding ---');

  // Clean existing exercises and muscle groups safely if re-running
  console.log('Seeding muscle groups and exercises...');
  for (const group of muscleGroupsData) {
    const muscleGroup = await prisma.muscleGroup.upsert({
      where: { name: group.name },
      update: {},
      create: { name: group.name }
    });

    for (const ex of group.exercises) {
      await prisma.exercise.upsert({
        where: {
          name_muscleGroupId: {
            name: ex.name,
            muscleGroupId: muscleGroup.id
          }
        },
        update: {
          description: ex.description
        },
        create: {
          name: ex.name,
          muscleGroupId: muscleGroup.id,
          description: ex.description
        }
      });
    }
  }

  const totalMuscleGroups = await prisma.muscleGroup.count();
  const totalExercises = await prisma.exercise.count();
  console.log(`Seeded ${totalMuscleGroups} Muscle Groups and ${totalExercises} Exercises.`);

  // Seed Demo User
  const demoEmail = 'alex@maxlift365.com';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  const demoUser = await prisma.User.upsert({
    where: { email: demoEmail },
    update: {
      passwordHash
    },
    create: {
      name: 'Alex Rivera',
      email: demoEmail,
      passwordHash
    }
  });

  console.log(`Demo User ready: ${demoUser.email} / Password123! (ID: ${demoUser.id})`);

  // Check if demo user already has workout records
  const existingRecords = await prisma.workoutRecord.count({
    where: { userId: demoUser.id }
  });

  if (existingRecords === 0) {
    console.log('Seeding initial workout records and PRs for Demo User...');

    // Find key exercises
    const benchPress = await prisma.exercise.findFirst({ where: { name: 'Barbell Bench Press' } });
    const squat = await prisma.exercise.findFirst({ where: { name: 'Barbell Back Squat' } });
    const deadlift = await prisma.exercise.findFirst({ where: { name: 'Conventional Deadlift' } });
    const ohp = await prisma.exercise.findFirst({ where: { name: 'Overhead Barbell Press (OHP)' } });
    const curl = await prisma.exercise.findFirst({ where: { name: 'Standing Barbell Curl' } });

    const sampleWorkouts = [];

    // Bench Press progression (demonstrating PR evolution)
    if (benchPress) {
      sampleWorkouts.push(
        { userId: demoUser.id, exerciseId: benchPress.id, weight: 60.0, reps: 8, performedAt: new Date('2026-09-10T10:00:00Z') },
        { userId: demoUser.id, exerciseId: benchPress.id, weight: 65.0, reps: 6, performedAt: new Date('2026-09-17T10:00:00Z') },
        { userId: demoUser.id, exerciseId: benchPress.id, weight: 70.0, reps: 5, performedAt: new Date('2026-09-24T10:00:00Z') },
        { userId: demoUser.id, exerciseId: benchPress.id, weight: 75.0, reps: 5, performedAt: new Date('2026-10-01T10:00:00Z') },
        { userId: demoUser.id, exerciseId: benchPress.id, weight: 80.0, reps: 3, performedAt: new Date('2026-10-07T10:00:00Z') } // Current PR: 80kg
      );
    }

    // Squat progression
    if (squat) {
      sampleWorkouts.push(
        { userId: demoUser.id, exerciseId: squat.id, weight: 90.0, reps: 8, performedAt: new Date('2026-09-12T11:00:00Z') },
        { userId: demoUser.id, exerciseId: squat.id, weight: 100.0, reps: 6, performedAt: new Date('2026-09-19T11:00:00Z') },
        { userId: demoUser.id, exerciseId: squat.id, weight: 110.0, reps: 5, performedAt: new Date('2026-09-26T11:00:00Z') },
        { userId: demoUser.id, exerciseId: squat.id, weight: 115.0, reps: 4, performedAt: new Date('2026-10-05T11:00:00Z') } // Current PR: 115kg
      );
    }

    // Deadlift progression
    if (deadlift) {
      sampleWorkouts.push(
        { userId: demoUser.id, exerciseId: deadlift.id, weight: 120.0, reps: 5, performedAt: new Date('2026-09-14T09:30:00Z') },
        { userId: demoUser.id, exerciseId: deadlift.id, weight: 130.0, reps: 5, performedAt: new Date('2026-09-21T09:30:00Z') },
        { userId: demoUser.id, exerciseId: deadlift.id, weight: 140.0, reps: 3, performedAt: new Date('2026-09-28T09:30:00Z') },
        { userId: demoUser.id, exerciseId: deadlift.id, weight: 145.0, reps: 2, performedAt: new Date('2026-10-06T09:30:00Z') } // Current PR: 145kg
      );
    }

    // Overhead Press
    if (ohp) {
      sampleWorkouts.push(
        { userId: demoUser.id, exerciseId: ohp.id, weight: 40.0, reps: 8, performedAt: new Date('2026-09-15T12:00:00Z') },
        { userId: demoUser.id, exerciseId: ohp.id, weight: 45.0, reps: 6, performedAt: new Date('2026-09-22T12:00:00Z') },
        { userId: demoUser.id, exerciseId: ohp.id, weight: 50.0, reps: 5, performedAt: new Date('2026-10-02T12:00:00Z') } // Current PR: 50kg
      );
    }

    // Barbell Curl
    if (curl) {
      sampleWorkouts.push(
        { userId: demoUser.id, exerciseId: curl.id, weight: 25.0, reps: 10, performedAt: new Date('2026-09-16T15:00:00Z') },
        { userId: demoUser.id, exerciseId: curl.id, weight: 30.0, reps: 8, performedAt: new Date('2026-09-23T15:00:00Z') },
        { userId: demoUser.id, exerciseId: curl.id, weight: 32.5, reps: 8, performedAt: new Date('2026-10-04T15:00:00Z') } // Current PR: 32.5kg
      );
    }

    for (const record of sampleWorkouts) {
      await prisma.workoutRecord.create({ data: record });
    }

    console.log(`Seeded ${sampleWorkouts.length} workout records for demo user.`);
  }

  console.log('--- MaxLift365 Database Seeding Finished Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
