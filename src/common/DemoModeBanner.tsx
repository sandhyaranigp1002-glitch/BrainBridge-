import React, { useState } from 'react';
import { 
  Sparkles, 
  User, 
  GraduationCap, 
  Shield, 
  Trash2, 
  RefreshCw, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle 
} from 'lucide-react';
import { storage } from '../../services/storage';
import { UserProfile } from '../../types';

interface DemoModeBannerProps {
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  onDataReset: () => void;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({
  currentUser,
  onSwitchUser,
  onDataReset
}) => {
  const [isDemoActive, setIsDemoActive] = useState<boolean>(storage.isDemoMode());
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleToggleDemoMode = () => {
    if (isDemoActive) {
      storage.clearDemoSampleData();
      setIsDemoActive(false);
      onDataReset();
      setToastMsg('Demo sample records cleared. Clean production state active.');
    } else {
      storage.loadDemoSampleData();
      setIsDemoActive(true);
      onDataReset();
      setToastMsg('Hackathon demo data loaded! Evaluator personas ready.');
    }
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSelectPersona = (userId: string) => {
    const allUsers = storage.getUsers();
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      storage.setCurrentUserId(target.id);
      onSwitchUser(target);
      setToastMsg(`Switched to persona: ${target.name} (${target.role.toUpperCase()})`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  return (
    <div className="relative z-40 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-indigo-500/30 text-white shadow-lg">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-14 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-xl shadow-indigo-500/30 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left Side Status */}
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${isDemoActive ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Hackathon Evaluator Suite
          </span>
          <span className="hidden sm:inline-block text-slate-500">•</span>
          <span className="text-xs text-slate-300 hidden sm:inline-block">
            {isDemoActive ? (
              <span className="text-amber-300 font-medium">Demo Mode Active (Sample records tagged)</span>
            ) : (
              <span className="text-slate-400">Clean Production Database</span>
            )}
          </span>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {isDemoActive ? (
            <>
              {/* Persona Switchers */}
              <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs">
                <span className="text-[10px] font-semibold text-slate-400 px-2 uppercase hidden md:inline">
                  Persona:
                </span>
                
                <button
                  onClick={() => handleSelectPersona('demo_student_alex')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    currentUser.id === 'demo_student_alex'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title="Switch to Alex Chen (Student)"
                >
                  <User className="w-3 h-3 text-indigo-400" />
                  <span className="text-xs">Alex (Student)</span>
                </button>

                <button
                  onClick={() => handleSelectPersona('demo_tutor_sarah')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    currentUser.id === 'demo_tutor_sarah'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title="Switch to Sarah Lin (Tutor)"
                >
                  <GraduationCap className="w-3 h-3 text-purple-400" />
                  <span className="text-xs">Sarah (Tutor)</span>
                </button>

                <button
                  onClick={() => handleSelectPersona('user_admin')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    currentUser.id === 'user_admin'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title="Switch to Dr. Thorne (Admin)"
                >
                  <Shield className="w-3 h-3 text-red-400" />
                  <span className="text-xs">Admin (Faculty)</span>
                </button>
              </div>

              {/* Clear Demo Data */}
              <button
                onClick={handleToggleDemoMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                title="Unload sample records and restore empty baseline state"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Reset to Clean</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleToggleDemoMode}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Hackathon Demo Suite
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
