import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Coins,
  Compass,
  GraduationCap,
  Layers,
  LogOut,
  Moon,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Sun,
  User,
  Zap,
} from 'lucide-react';
import { InAppNotification, UserProfile, UserRole } from '../../types';
import { LocalStorageAdapter } from '../../services/storage';
import { getDataSourceInfo } from '../../services/supabase';

interface NavbarProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (userId: string) => void;
  notifications: InAppNotification[];
  onNotificationClick: (notif: InAppNotification) => void;
  onMarkAllRead: () => void;
  onResetDemoData: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  notifications,
  onNotificationClick,
  onMarkAllRead,
  onResetDemoData,
  onNavigate,
  searchQuery,
  onSearchChange,
  onLogout,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showDataSourceModal, setShowDataSourceModal] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead);
  const dataInfo = getDataSourceInfo();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() =>
            onNavigate(
              currentUser.role === 'admin'
                ? 'admin-dashboard'
                : currentUser.role === 'tutor'
                ? 'tutor-dashboard'
                : 'dashboard'
            )
          }
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            {/* Stylized P / Connected upward learning nodes */}
            <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 24L16 8L24 24" stroke="#E0E7FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8" cy="24" r="3" fill="#A5B4FC" />
              <circle cx="24" cy="24" r="3" fill="#A5B4FC" />
              <circle cx="16" cy="8" r="3.5" fill="#FFFFFF" />
              <path d="M16 8V24" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 2"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-900 bg-clip-text text-transparent">
                BrainBridge
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                Ecosystem
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              Bridge the Gap. Unlock Your Potential.
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tutors, subjects (e.g. Python, DBMS, DSA)..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-400 rounded-xl transition outline-none text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Credit Economy Badge */}
          <button
            onClick={() => onNavigate('credits')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300/80 bg-amber-50 hover:bg-amber-100/90 text-amber-900 text-xs font-bold transition shadow-sm cursor-pointer"
            title="Skill Exchange Credits — click to manage"
          >
            <Coins className="w-4 h-4 text-amber-600" />
            <span className="font-mono text-sm">{currentUser.creditBalance ?? 5}</span>
            <span className="hidden sm:inline font-semibold text-amber-800">Credits</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              LocalStorageAdapter.toggleTheme();
            }}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition shadow-sm cursor-pointer"
            title="Toggle Light / Dark Theme"
            aria-label="Toggle Theme"
          >
            <Moon className="w-4 h-4 text-indigo-600" />
          </button>

          {/* Data Mode Indicator Badge */}
          <button
            onClick={() => setShowDataSourceModal(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100/80 transition"
            title="Click to view data layer details"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{dataInfo.label}</span>
          </button>

          {/* Role Pill Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-sm transition"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  currentUser.role === 'learner'
                    ? 'bg-blue-500'
                    : currentUser.role === 'tutor'
                    ? 'bg-emerald-500'
                    : 'bg-purple-600'
                }`}
              />
              <span className="font-semibold capitalize">Role: {currentUser.role}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* User Switcher Dropdown */}
            {showUserDropdown && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Account
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quick switch between registered accounts
                  </p>
                </div>

                <div className="py-1 max-h-64 overflow-y-auto">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user.id);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition ${
                        currentUser.id === user.id ? 'bg-indigo-50/60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                            {user.name}
                            {currentUser.id === user.id && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {user.role.toUpperCase()} &bull; Lvl {user.level} {user.levelTitle}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          user.role === 'learner'
                            ? 'bg-blue-100 text-blue-700'
                            : user.role === 'tutor'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 px-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onResetDemoData();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Platform Data
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 transition"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notification Center Dropdown */}
            {showNotifDropdown && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={onMarkAllRead}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          onNotificationClick(notif);
                          setShowNotifDropdown(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 ${
                          !notif.isRead ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                          {notif.type.includes('request') ? (
                            <GraduationCap className="w-4 h-4" />
                          ) : notif.type.includes('badge') ? (
                            <Sparkles className="w-4 h-4 text-amber-500" />
                          ) : notif.type.includes('level') ? (
                            <Zap className="w-4 h-4 text-purple-600" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-900">
                            {notif.title}
                          </p>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(notif.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 self-center shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      onNavigate('sessions');
                      setShowNotifDropdown(false);
                    }}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    View All Sessions & Activity &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Current User Avatar & Level Pill */}
          <div
            onClick={() => onNavigate('quest')}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
            title="View gamification & XP progress"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition"
              />
              <span className="absolute -bottom-1 -right-1 text-[9px] font-black bg-indigo-600 text-white w-4 h-4 rounded-full flex items-center justify-center shadow">
                {currentUser.level}
              </span>
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser.name.split(' ')[0]}
              </p>
              <p className="text-[10px] font-semibold text-indigo-600">
                {currentUser.xp} XP &bull; {currentUser.levelTitle}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Sign Out of BrainBridge"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Data Source Explanation Modal */}
      {showDataSourceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{dataInfo.label}</h3>
                <p className="text-xs text-slate-500">Architecture Transparency Note</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {dataInfo.description}
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-700 space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Storage Engine:</span>
                <span className="font-mono font-semibold">Local Storage Reactive Store</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Supabase Cloud Sync:</span>
                <span className="text-amber-600 font-semibold">Ready (Keys in .env.example)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">PostgreSQL Migration:</span>
                <span className="text-emerald-600 font-semibold">Provided in /supabase</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onResetDemoData();
                  setShowDataSourceModal(false);
                }}
                className="flex-1 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
              >
                Reset Platform Data
              </button>
              <button
                onClick={() => setShowDataSourceModal(false)}
                className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
