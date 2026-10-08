import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { AddWorkoutModal } from '../components/AddWorkoutModal';
import { Dumbbell, Heart } from 'lucide-react';

export const MainLayout = () => {
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWorkoutAdded = () => {
    // Increment trigger so children or pages listening can refetch if desired
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gym-dark text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Navbar */}
      <Navbar onOpenQuickLog={() => setQuickLogOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Outlet context={{ refreshTrigger, openQuickLog: () => setQuickLogOpen(true) }} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-amber-500 flex items-center justify-center">
              <Dumbbell className="w-3 h-3 text-slate-950" />
            </div>
            <span className="font-bold text-slate-300 font-display">MaxLift365</span>
            <span>— Precision Gym & PR Tracking</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Calculate 1RM (Epley Formula)</span>
            <span>•</span>
            <span>PostgreSQL & Prisma</span>
            <span>•</span>
            <span>JWT Auth</span>
          </div>
        </div>
      </footer>

      {/* Global Quick Log Modal */}
      <AddWorkoutModal
        isOpen={quickLogOpen}
        onClose={() => setQuickLogOpen(false)}
        onWorkoutAdded={handleWorkoutAdded}
      />
    </div>
  );
};
