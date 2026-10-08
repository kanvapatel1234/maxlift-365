import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workoutService } from '../services/workoutService';
import {
  Layers,
  ArrowRight,
  Shield,
  Zap,
  Activity,
  Award,
  Dumbbell
} from 'lucide-react';

const muscleGroupMeta = {
  Chest: {
    color: 'from-amber-500/20 to-orange-600/10',
    borderColor: 'group-hover:border-amber-500/50',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Bench presses, dumbbell presses, dips, and cable flies for pectoral mass.'
  },
  Back: {
    color: 'from-blue-500/20 to-cyan-600/10',
    borderColor: 'group-hover:border-blue-500/50',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Deadlifts, pull-ups, barbell rows, and lat pulldowns for V-taper thickness.'
  },
  Shoulders: {
    color: 'from-purple-500/20 to-indigo-600/10',
    borderColor: 'group-hover:border-purple-500/50',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    description: 'Overhead presses, lateral raises, and face pulls for 3D capped deltoids.'
  },
  Biceps: {
    color: 'from-rose-500/20 to-pink-600/10',
    borderColor: 'group-hover:border-rose-500/50',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    description: 'Barbell curls, hammer curls, and preacher curls to maximize peak contraction.'
  },
  Triceps: {
    color: 'from-emerald-500/20 to-teal-600/10',
    borderColor: 'group-hover:border-emerald-500/50',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Close grip presses, skull crushers, and cable rope pushdowns for arm size.'
  },
  Legs: {
    color: 'from-yellow-500/20 to-amber-600/10',
    borderColor: 'group-hover:border-yellow-500/50',
    badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    description: 'Squats, RDLs, leg presses, and lunges for total lower body foundation.'
  },
  Abs: {
    color: 'from-cyan-500/20 to-blue-600/10',
    borderColor: 'group-hover:border-cyan-500/50',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    description: 'Hanging leg raises, cable crunches, and rollouts for bulletproof core strength.'
  }
};

export const MuscleGroups = () => {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const data = await workoutService.getMuscleGroups();
        setMuscleGroups(data);
      } catch (err) {
        console.error('Failed to fetch muscle groups:', err);
        setError('Failed to load muscle groups.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Target Anatomy</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display">Muscle Groups</h1>
          <p className="text-sm text-slate-400 mt-1">
            Choose a muscle category to view specific exercises and track your PRs
          </p>
        </div>

        <Link
          to="/exercises"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <span>Browse All Exercises</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-44 bg-slate-900/60 rounded-2xl border border-slate-800" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-center text-rose-300 bg-rose-950/20 border border-rose-900 rounded-2xl">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {muscleGroups.map((group) => {
            const meta = muscleGroupMeta[group.name] || {
              color: 'from-slate-800 to-slate-900',
              borderColor: 'group-hover:border-amber-500/50',
              badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
              description: 'Targeted exercises and progressive overload lifts.'
            };

            return (
              <Link
                key={group.id}
                to={`/exercises?muscleGroupId=${group.id}`}
                className={`group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 ${meta.borderColor}`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${meta.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-white group-hover:scale-105 group-hover:border-slate-700 transition-all">
                        <Dumbbell className="w-5 h-5 text-amber-400" />
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.badgeColor}`}
                      >
                        {group.exerciseCount} Exercises
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white font-display group-hover:text-amber-400 transition-colors">
                      {group.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {meta.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-amber-400 transition-colors">
                    <span>View {group.name} Workouts</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
