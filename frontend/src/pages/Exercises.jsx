import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { workoutService } from '../services/workoutService';
import {
  Search,
  Layers,
  Dumbbell,
  Trophy,
  ArrowRight,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';

export const Exercises = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const muscleGroupParam = searchParams.get('muscleGroupId');

  const [exercises, setExercises] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(muscleGroupParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Sync state if URL query param changes
  useEffect(() => {
    if (muscleGroupParam) {
      setSelectedGroup(muscleGroupParam);
    } else {
      setSelectedGroup('all');
    }
  }, [muscleGroupParam]);

  // Load muscle groups once
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await workoutService.getMuscleGroups();
        setMuscleGroups(groups);
      } catch (err) {
        console.error('Failed to load muscle groups:', err);
      }
    };
    fetchGroups();
  }, []);

  // Fetch exercises based on selected group & search
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedGroup !== 'all') {
          params.muscleGroupId = selectedGroup;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        const data = await workoutService.getAllExercises(params);
        setExercises(data);
      } catch (err) {
        console.error('Failed to fetch exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [selectedGroup, searchQuery]);

  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);
    if (groupId === 'all') {
      searchParams.delete('muscleGroupId');
    } else {
      searchParams.set('muscleGroupId', groupId);
    }
    setSearchParams(searchParams);
  };

  const currentGroupName =
    selectedGroup === 'all'
      ? 'All Muscle Groups'
      : muscleGroups.find((g) => g.id.toString() === selectedGroup.toString())?.name || 'Exercises';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Exercise Catalog</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display">
            {currentGroupName}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse through 80+ standardized movements, log sets, and view personal record history
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Muscle Group Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleGroupSelect('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedGroup === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          All Exercises
        </button>
        {muscleGroups.map((mg) => (
          <button
            key={mg.id}
            onClick={() => handleGroupSelect(mg.id.toString())}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedGroup === mg.id.toString()
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {mg.name} ({mg.exerciseCount})
          </button>
        ))}
      </div>

      {/* Exercise Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-slate-900/60 rounded-2xl border border-slate-800" />
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white font-display">No Exercises Found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or choosing another muscle group category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleGroupSelect('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-amber-400 hover:bg-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {exercises.map((exercise) => (
            <Link
              key={exercise.id}
              to={`/exercises/${exercise.id}`}
              className="group bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    {exercise.muscleGroup?.name}
                  </span>

                  {/* PR Badge if logged */}
                  {exercise.personalRecord ? (
                    <span className="inline-flex items-center space-x-1 text-xs font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg shadow-sm">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>{exercise.personalRecord} kg</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium">Unlogged</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors font-display mt-1">
                  {exercise.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {exercise.description || 'Compound/isolation exercise targeting target muscle fibers.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-amber-400 transition-colors">
                <span>View Details & PR</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
