import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { workoutService } from '../services/workoutService';
import { AddWorkoutModal } from '../components/AddWorkoutModal';
import {
  Trophy,
  Dumbbell,
  Calendar,
  Flame,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
  BarChart2,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';

export const ExerciseDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchExerciseData = async () => {
    try {
      setLoading(true);
      const res = await workoutService.getExerciseWorkouts(id);
      setData(res);
    } catch (err) {
      console.error('Failed to load exercise details:', err);
      setError('Could not load exercise details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExerciseData();
  }, [id]);

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await workoutService.deleteWorkout(deleteCandidate.id);
      setDeleteCandidate(null);
      await fetchExerciseData();
    } catch (err) {
      alert('Failed to delete workout: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-800 rounded" />
        <div className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="h-64 bg-slate-900 rounded-2xl border border-slate-800" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <p className="text-slate-300 font-medium">{error || 'Exercise not found'}</p>
        <Link
          to="/exercises"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exercises</span>
        </Link>
      </div>
    );
  }

  const { exercise, maxWeight, bestRepsAtMaxWeight, best1RM, maxVolume, totalSets, history } = data;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Breadcrumb / Back button */}
      <div>
        <Link
          to="/exercises"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Exercises</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <span>{exercise.muscleGroup?.name}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              {exercise.name}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {exercise.description || 'Standardized progressive overload movement.'}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>+ Add Workout</span>
          </button>
        </div>
      </div>

      {/* PR Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Max PR */}
        <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 relative overflow-hidden transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider">
              Current PR (Max Weight)
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-400 font-display">
              {maxWeight > 0 ? `${maxWeight} kg` : '—'}
            </span>
            {bestRepsAtMaxWeight > 0 && (
              <span className="text-xs text-slate-400 font-medium">
                for {bestRepsAtMaxWeight} reps
              </span>
            )}
          </div>
          <span className="block text-[11px] text-slate-500 mt-1">Calculated from workout log</span>
        </div>

        {/* Estimated 1RM (Epley) */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Best Estimated 1RM
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-display">
              {best1RM > 0 ? `${best1RM} kg` : '—'}
            </span>
            <span className="text-xs text-slate-400 font-medium">(Epley 1RM)</span>
          </div>
          <span className="block text-[11px] text-slate-500 mt-1">Weight × (1 + Reps/30)</span>
        </div>

        {/* Max Single Set Volume */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Peak Set Volume
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-display">
              {maxVolume > 0 ? `${maxVolume} kg` : '—'}
            </span>
          </div>
          <span className="block text-[11px] text-slate-500 mt-1">Max (Weight × Reps) in 1 set</span>
        </div>

        {/* Total Sets Logged */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Sets Logged
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Dumbbell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-display">
              {totalSets}
            </span>
            <span className="text-xs text-slate-400 font-medium">completed sets</span>
          </div>
          <span className="block text-[11px] text-slate-500 mt-1">Lifetime exercise volume</span>
        </div>
      </div>

      {/* Workout History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-display">Workout History</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {history.length} {history.length === 1 ? 'Record' : 'Records'} logged
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Weight</th>
                    <th className="py-3.5 px-6">Reps</th>
                    <th className="py-3.5 px-6">Est. 1RM</th>
                    <th className="py-3.5 px-6">Status / Milestone</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {history.map((record) => {
                    const recordDate = new Date(record.performedAt);
                    const formattedDate = recordDate.toLocaleDateString(undefined, {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    });

                    return (
                      <tr
                        key={record.id}
                        className={`hover:bg-slate-850/50 transition-colors ${
                          record.isMaxWeightPR ? 'bg-amber-500/[0.03]' : ''
                        }`}
                      >
                        {/* Date */}
                        <td className="py-4 px-6 font-medium text-slate-300 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* Weight */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="font-extrabold text-white text-base font-display">
                            {record.weight}
                          </span>
                          <span className="text-xs text-slate-400 ml-1">kg</span>
                        </td>

                        {/* Reps */}
                        <td className="py-4 px-6 whitespace-nowrap font-semibold text-slate-200">
                          {record.reps} <span className="text-xs text-slate-400 font-normal">reps</span>
                        </td>

                        {/* Estimated 1RM */}
                        <td className="py-4 px-6 whitespace-nowrap text-slate-300">
                          <span className="font-semibold">{record.estimated1RM} kg</span>
                        </td>

                        {/* PR Badge */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {record.isMaxWeightPR && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse-subtle">
                                <Trophy className="w-3 h-3 text-amber-400" />
                                <span>CURRENT PR</span>
                              </span>
                            )}
                            {record.isBest1RMPR && !record.isMaxWeightPR && (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                <Flame className="w-3 h-3 text-emerald-400" />
                                <span>BEST 1RM</span>
                              </span>
                            )}
                            {!record.isMaxWeightPR && !record.isBest1RMPR && (
                              <span className="text-xs text-slate-500 font-medium">Set logged</span>
                            )}
                          </div>
                        </td>

                        {/* Delete Action with confirmation */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => setDeleteCandidate(record)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete this set"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white font-display mb-1">
                No Workout History Yet
              </h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mb-5">
                Log your first weight and reps for {exercise.name} to establish your personal record!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Log Your First Set</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Delete Workout Record?</h3>
              <p className="text-sm text-slate-400 mt-1">
                Are you sure you want to delete the set of{' '}
                <span className="font-semibold text-white">
                  {deleteCandidate.weight} kg × {deleteCandidate.reps} reps
                </span>{' '}
                from{' '}
                {new Date(deleteCandidate.performedAt).toLocaleDateString()}? If this is your PR, the next highest lift will become your current PR.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                disabled={isDeleting}
                className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-1/2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-colors flex items-center justify-center space-x-2"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Workout Modal for this exercise */}
      <AddWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        exercise={exercise}
        onWorkoutAdded={() => fetchExerciseData()}
      />
    </div>
  );
};
