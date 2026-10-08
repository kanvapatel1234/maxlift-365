import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workoutService } from '../services/workoutService';
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Dumbbell,
  TrendingUp,
  Award,
  LogOut,
  Layers,
  ArrowRight,
  Flame,
  Scale
} from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await workoutService.getUserProfile();
        setProfileData(data);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = profileData?.stats;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Profile Card Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-2xl font-display shadow-lg shadow-amber-500/20">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {user?.name || 'Athlete'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{user?.email}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Member since{' '}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          year: 'numeric'
                        })
                      : '2026'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-auto flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Total Lifts Logged
          </span>
          <div className="mt-2 text-2xl font-black text-white font-display">
            {stats?.totalWorkouts || 0}
          </div>
          <span className="text-[11px] text-slate-500">Recorded workout sets</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Exercises Tracked
          </span>
          <div className="mt-2 text-2xl font-black text-white font-display">
            {stats?.exercisesTrackedCount || 0}
          </div>
          <span className="text-[11px] text-slate-500">Target movements</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
            Personal Records
          </span>
          <div className="mt-2 text-2xl font-black text-amber-400 font-display">
            {stats?.personalRecordsCount || 0}
          </div>
          <span className="text-[11px] text-slate-500">All-time max weight PRs</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Total Weight Moved
          </span>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-display">
            {stats?.totalVolumeKg?.toLocaleString() || 0} <span className="text-xs text-slate-400 font-normal">kg</span>
          </div>
          <span className="text-[11px] text-slate-500">Cumulative tonnage volume</span>
        </div>
      </div>

      {/* Complete Personal Records Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-display">
              Personal Records Directory
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {stats?.topPRs?.length || 0} PRs Established
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {stats?.topPRs?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Exercise</th>
                    <th className="py-3.5 px-6">Muscle Group</th>
                    <th className="py-3.5 px-6">Max Weight PR</th>
                    <th className="py-3.5 px-6">Best 1RM (Epley)</th>
                    <th className="py-3.5 px-6">Lifetime Sets</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {stats.topPRs.map((pr) => (
                    <tr key={pr.exerciseId} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-white font-display">
                        <Link
                          to={`/exercises/${pr.exerciseId}`}
                          className="hover:text-amber-400 transition-colors"
                        >
                          {pr.exerciseName}
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {pr.muscleGroup}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-base font-black text-amber-400 font-display">
                          {pr.maxWeight} kg
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        <span className="font-semibold text-emerald-400">{pr.best1RM} kg</span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {pr.totalSets} sets
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/exercises/${pr.exerciseId}`}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
                        >
                          <span>Log / Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white font-display mb-1">
                No Personal Records Yet
              </h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mb-5">
                Head over to the exercises directory to log sets and build your PR trophy case!
              </p>
              <Link
                to="/exercises"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                <Dumbbell className="w-4 h-4" />
                <span>Browse Exercises</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
