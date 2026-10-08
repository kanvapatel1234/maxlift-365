import React, { useState, useEffect } from 'react';
import { workoutService } from '../services/workoutService';
import {
  X,
  Dumbbell,
  Flame,
  Calendar,
  CheckCircle,
  AlertCircle,
  Trophy,
  Sparkles
} from 'lucide-react';

export const AddWorkoutModal = ({ isOpen, onClose, exercise = null, onWorkoutAdded }) => {
  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('5');
  const [performedAt, setPerformedAt] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [prCelebration, setPrCelebration] = useState(null);

  // Load exercises list if exercise is not pre-provided
  useEffect(() => {
    if (isOpen) {
      setError('');
      setPrCelebration(null);
      if (exercise) {
        setSelectedExerciseId(exercise.id.toString());
      } else {
        const fetchExercises = async () => {
          try {
            const data = await workoutService.getAllExercises();
            setExercisesList(data);
            if (data.length > 0 && !selectedExerciseId) {
              setSelectedExerciseId(data[0].id.toString());
            }
          } catch (err) {
            console.error('Failed to load exercises for modal:', err);
          }
        };
        fetchExercises();
      }
    }
  }, [isOpen, exercise]);

  if (!isOpen) return null;

  // Calculate live estimated 1RM
  const numWeight = parseFloat(weight) || 0;
  const numReps = parseInt(reps, 10) || 0;
  const liveEstimated1RM =
    numWeight > 0 && numReps > 0
      ? numReps === 1
        ? numWeight
        : Number((numWeight * (1 + numReps / 30)).toFixed(1))
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const exId = exercise ? exercise.id : parseInt(selectedExerciseId, 10);
    if (!exId) {
      setError('Please select an exercise');
      return;
    }

    if (!weight || numWeight <= 0) {
      setError('Please enter a valid weight greater than 0');
      return;
    }

    if (!reps || numReps <= 0) {
      setError('Please enter a valid repetition count (at least 1)');
      return;
    }

    setSubmitting(true);
    try {
      const response = await workoutService.createWorkout({
        exerciseId: exId,
        weight: numWeight,
        reps: numReps,
        performedAt: new Date(performedAt).toISOString()
      });

      if (response.data.isNewMaxWeightPR) {
        setPrCelebration({
          weight: numWeight,
          reps: numReps,
          exerciseName: response.data.exercise?.name || 'Exercise',
          prevMax: response.data.previousMaxWeight
        });
        setTimeout(() => {
          if (onWorkoutAdded) onWorkoutAdded(response.data);
          onClose();
        }, 1800);
      } else {
        if (onWorkoutAdded) onWorkoutAdded(response.data);
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to record workout';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* PR Celebration Overlay */}
        {prCelebration && (
          <div className="absolute inset-0 z-20 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-4 animate-bounce">
              <Trophy className="w-9 h-9" />
            </div>
            <div className="flex items-center space-x-1 text-amber-400 font-bold tracking-widest uppercase text-xs mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Personal Record Smashed!</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-2xl font-black text-white font-display mb-2">
              {prCelebration.weight} kg × {prCelebration.reps} Reps
            </h3>
            <p className="text-slate-300 text-sm max-w-xs">
              New all-time maximum weight PR for <span className="text-amber-400 font-semibold">{prCelebration.exerciseName}</span>!
              {prCelebration.prevMax > 0 && ` (Previous: ${prCelebration.prevMax} kg)`}
            </p>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Log Workout Set</h2>
              <p className="text-xs text-slate-400">Record your lift and update your PRs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 text-sm text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Exercise Picker / Display */}
          {exercise ? (
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Exercise</span>
              <div className="text-base font-bold text-white mt-0.5">{exercise.name}</div>
              <div className="text-xs text-amber-400/90 font-medium">
                {exercise.muscleGroup?.name || 'Target Muscle'}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Select Exercise
              </label>
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                {exercisesList.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.muscleGroup?.name})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Weight Input + Increment Helpers */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Weight (kg)
              </label>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => setWeight((prev) => (Math.max(0, (parseFloat(prev) || 0) + 2.5)).toFixed(1))}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  +2.5
                </button>
                <button
                  type="button"
                  onClick={() => setWeight((prev) => (Math.max(0, (parseFloat(prev) || 0) + 5)).toFixed(1))}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => setWeight((prev) => (Math.max(0, (parseFloat(prev) || 0) + 10)).toFixed(1))}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  +10
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="e.g. 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base text-white font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 pr-12"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">
                kg
              </span>
            </div>
          </div>

          {/* Reps Input + Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Repetitions
              </label>
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                {[1, 3, 5, 8, 10, 12].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReps(r.toString())}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      reps === r.toString()
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              min="1"
              max="100"
              placeholder="e.g. 5"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base text-white font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Performed Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Workout Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={performedAt}
                onChange={(e) => setPerformedAt(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Live Calculated Stats Box */}
          {liveEstimated1RM > 0 && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-300 font-medium">Estimated 1-Rep Max:</span>
              </div>
              <span className="text-sm font-bold text-amber-400 font-display">
                {liveEstimated1RM} kg <span className="text-[10px] text-slate-400 font-normal">(Epley)</span>
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Recording...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Workout</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
