import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, X, Zap } from 'lucide-react';
import { LevelInfo } from '../../services/gamification';

interface LevelUpModalProps {
  levelInfo: LevelInfo;
  newXP: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ levelInfo, newXP, onClose }) => {
  useEffect(() => {
    // Blast celebratory confetti!
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#7C3AED', '#DDD6FE', '#10B981', '#F59E0B'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl border border-indigo-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 mb-5 animate-bounce">
          <Zap className="w-10 h-10 fill-amber-300 text-amber-300" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          Level Up Achieved!
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          You are now a {levelInfo.title}!
        </h2>

        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Outstanding effort! Your dedication to teaching and learning has unlocked Level {levelInfo.level}.
        </p>

        <div className="my-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
          <p className="text-xs text-indigo-700 font-semibold">Total Verified Experience</p>
          <p className="text-3xl font-extrabold text-indigo-950 mt-0.5">{newXP} XP</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition active:scale-[0.98]"
        >
          Continue Exploring
        </button>
      </div>
    </div>
  );
};
