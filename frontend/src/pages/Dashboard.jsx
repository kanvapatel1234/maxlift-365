import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workoutService } from '../services/workoutService';
import {
  Trophy,
  Dumbbell,
  TrendingUp,
  Flame,
  Calendar,
  Layers,
  Plus,
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock,
  Award
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { refreshTrigger, openQuickLog } = useOutletContext() || {};
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await workoutService.getUserStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
      setError('Unable to load dashboard stats. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  if (loading && !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-900/60 rounded-2xl border border-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-900/60 rounded-2xl border border-slate-800" />
          ))}
        </div>
        <div className="h-64 bg-slate-900/60 rounded-2xl border border-slate-800" />
      </div>
    );
  }

  const recentWorkout = stats?.recentWorkouts?.[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MaxLift365 Training HQ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display tracking-tight">
              Welcome Back, <span className="text-amber-400">{user?.name || 'Athlete'}</span>!
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
              Consistent overload breeds champions. Check your recent progression, log today's sets, and set new personal records.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={openQuickLog}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Log Workout</span>
            </button>
            <Link
              to="/muscle-groups"
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 font-semibold text-sm transition-colors"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Muscle Groups</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workouts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Total Workouts
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Dumbbell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-display">
              {stats?.totalWorkouts || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">completed sets</span>
          </div>
        </div>

        {/* Exercises Tracked */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Exercises Tracked
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-display">
              {stats?.exercisesTrackedCount || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">distinct movements</span>
          </div>
        </div>

        {/* Personal Records */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-colors relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-amber-400/90 tracking-wider">
              Personal Records
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-400 font-display">
              {stats?.personalRecordsCount || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">PR milestones</span>
          </div>
        </div>

        {/* Recent Workout */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Recent Workout
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            {recentWorkout ? (
              <div>
                <p className="text-sm font-bold text-white truncate">
                  {recentWorkout.exercise?.name}
                </p>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">
                  {recentWorkout.weight} kg × {recentWorkout.reps} reps
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {new Date(recentWorkout.performedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-400 mt-2 italic">No workouts logged yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Top PRs Showcase & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white font-display">Recent Workout Activity</h2>
            </div>
            <Link
              to="/exercises"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              <span>Explore All Exercises</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            {stats?.recentWorkouts?.length > 0 ? (
              <div className="divide-y divide-slate-800/80">
                {stats.recentWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="p-4 sm:px-6 hover:bg-slate-850/40 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-amber-400 flex-shrink-0">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={`/exercises/${workout.exerciseId}`}
                          className="text-sm font-bold text-white hover:text-amber-400 transition-colors block truncate"
                        >
                          {workout.exercise?.name}
                        </Link>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                          <span className="text-amber-400/90 font-medium">
                            {workout.exercise?.muscleGroup?.name}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(workout.performedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0 text-right">
                      <div>
                        <div className="text-sm font-black text-white font-display">
                          {workout.weight} kg <span className="text-xs text-slate-400 font-normal">× {workout.reps}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          e1RM: <span className="font-semibold text-slate-300">{workout.estimated1RM} kg</span>
                        </div>
                      </div>

                      <Link
                        to={`/exercises/${workout.exerciseId}`}
                        className="hidden sm:inline-flex p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="View Exercise Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-4">
                  <Dumbbell className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white font-display mb-1">
                  No Workouts Logged Yet
                </h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto mb-5">
                  Begin your MaxLift365 journey by logging your first workout set or browsing exercises.
                </p>
                <button
                  onClick={openQuickLog}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Your First Lift</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Top PRs Showcase */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-display">Top Personal Records</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            {stats?.topPRs?.length > 0 ? (
              stats.topPRs.map((pr, idx) => (
                <Link
                  key={pr.exerciseId}
                  to={`/exercises/${pr.exerciseId}`}
                  className="block p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-950 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {pr.muscleGroup}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-amber-400 transition-colors">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate max-w-[150px]">
                      {pr.exerciseName}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-black text-amber-400 font-display">
                        {pr.maxWeight} kg
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        1RM: {pr.best1RM} kg
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-6 italic">
                Log lifts to establish your benchmark personal records!
              </p>
            )}

            <Link
              to="/profile"
              className="block w-full py-2.5 text-center text-xs font-bold text-slate-300 hover:text-amber-400 bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/60 mt-2"
            >
              View Full PR Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
