import {
  BookOpen,
  Brain,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Coins,
  Flame,
  GitBranch,
  GraduationCap,
  Home,
  LayoutDashboard,
  Shield,
  Sparkles,
  TrendingUp,
  Trophy,
  Users2,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { getXPProgress } from '../../services/gamification';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: UserProfile;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  pendingRequestsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  isCollapsed,
  onToggleCollapse,
  pendingRequestsCount,
}) => {
  const xpProg = getXPProgress(currentUser.xp);

  let navItems: { id: string; label: string; icon: any; accent?: boolean; badge?: number }[] = [];

  if (currentUser.role === 'admin') {
    navItems = [
      { id: 'admin-dashboard', label: 'Admin Overview', icon: LayoutDashboard },
      { id: 'admin', label: 'Safety & Audit', icon: Shield },
      { id: 'sessions', label: 'Session Logs', icon: Calendar },
      { id: 'knowledge-check', label: 'Diagnostic Quizzes', icon: Brain },
      { id: 'credits', label: 'Credit Ledger', icon: Coins },
      { id: 'circles', label: 'Campus Circles', icon: Users2 },
    ];
  } else if (currentUser.role === 'tutor') {
    navItems = [
      { id: 'tutor-dashboard', label: 'Tutor Studio', icon: LayoutDashboard },
      {
        id: 'sessions',
        label: 'Tutoring Sessions',
        icon: Calendar,
        badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      },
      { id: 'availability', label: 'Availability Slots', icon: BookOpen },
      { id: 'progress', label: 'Learning Scores', icon: TrendingUp },
      { id: 'credits', label: 'Skill Credits', icon: Coins },
      { id: 'quest', label: 'XP & Mentor Badges', icon: Trophy, accent: true },
      { id: 'circles', label: 'Learning Circles', icon: Users2 },
      { id: 'tutors', label: 'Browse Mentors', icon: GraduationCap },
    ];
  } else {
    // Student / Learner
    navItems = [
      { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
      { id: 'tutors', label: 'Find a Tutor', icon: GraduationCap },
      { id: 'knowledge-check', label: 'Diagnostic Quiz', icon: Brain },
      { id: 'exam-rescue', label: 'Exam Rescue Mode', icon: Flame, accent: true },
      { id: 'progress', label: 'Learning Scores', icon: TrendingUp },
      { id: 'credits', label: 'Skill Credits', icon: Coins },
      {
        id: 'sessions',
        label: 'My Sessions',
        icon: Calendar,
        badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      },
      { id: 'quest', label: 'BrainBridge Quest', icon: Trophy },
      { id: 'skill-tree', label: 'Skill Tree', icon: GitBranch },
      { id: 'circles', label: 'Learning Circles', icon: Users2 },
      { id: 'apply-tutor', label: 'Apply to Tutor', icon: Sparkles },
    ];
  }

  return (
    <aside
      className={`relative flex flex-col justify-between bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shrink-0 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Navigation Links */}
      <div className="py-6 px-3 space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition group relative ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition ${
                  isActive
                    ? 'text-white'
                    : item.accent
                    ? 'text-amber-500 group-hover:scale-110'
                    : 'text-slate-400 group-hover:text-indigo-600'
                }`}
              />

              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {/* Badge for pending requests */}
              {item.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    isActive
                      ? 'bg-white text-indigo-700'
                      : 'bg-rose-500 text-white animate-pulse'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Collapsed Tooltip on Hover */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50">
                  {item.label}
                  {item.badge && ` (${item.badge})`}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Gamification Mini-Widgets in Sidebar Footer */}
      {!isCollapsed ? (
        <div className="p-4 mx-3 mb-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 border border-indigo-100/80 shadow-sm space-y-3">
          {/* Streak indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-600 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {currentUser.streakDays} Day Streak
                </p>
                <p className="text-[10px] text-slate-500">
                  Best: {currentUser.bestStreak} days
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
              Active
            </span>
          </div>

          {/* Level Progress */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-indigo-900">
                Lvl {currentUser.level} &bull; {currentUser.levelTitle}
              </span>
              <span className="text-[11px] font-semibold text-indigo-600">
                {currentUser.xp} / {xpProg.nextLevelTarget} XP
              </span>
            </div>
            <div className="w-full bg-indigo-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${xpProg.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 text-center mb-2">
          <div
            className="w-10 h-10 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center cursor-pointer"
            onClick={() => onNavigate('quest')}
            title={`${currentUser.streakDays} Day Streak 🔥`}
          >
            <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
          </div>
        </div>
      )}

      {/* Collapse/Expand Toggle Button */}
      <div className="p-3 border-t border-slate-200 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-[11px] font-medium text-slate-400 pl-2">
            Collapse Navigation
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition mx-auto"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
