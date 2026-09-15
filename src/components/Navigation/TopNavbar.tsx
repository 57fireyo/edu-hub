import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Bell,
  MessageSquare,
  User,
  Sparkles,
  Code2,
  Briefcase,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
  LogOut,
  ShieldCheck,
  KeyRound,
  Crown,
  Camera,
  History,
} from 'lucide-react';
import { ActivityHistoryModal } from './ActivityHistoryModal';

export const TopNavbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setIsProModalOpen,
    setIsAuthModalOpen,
    setIsAvatarModalOpen,
    isOwner,
    setIsSecretOwnerModalOpen,
    activityHistory,
    isHistoryModalOpen,
    setIsHistoryModalOpen,
    showToast,
  } = useApp();
  const { user, logout, toggleRole } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <nav
      id="top-navbar"
      className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md w-full sticky top-0 border-b border-slate-200 dark:border-slate-800 z-40 transition-colors"
    >
      <div className="flex justify-between items-center px-4 md:px-8 py-2.5 max-w-[1400px] mx-auto w-full">
        {/* Brand Logo & Search */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                JDCOEM CONNECT
              </span>
              <span className="ml-1.5 text-[9.5px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-600 text-white shadow-xs">
                SKILL GRID
              </span>
            </div>
          </button>

          {/* Quick Search */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search resources, gigs, mentors, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9.5 pr-4 py-1.5 bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 w-72 lg:w-96 transition-all"
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          <button
            id="nav-link-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Dashboard
          </button>
          <button
            id="nav-link-resources"
            onClick={() => setActiveTab('resources')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'resources'
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Resources
          </button>
          <button
            id="nav-link-compile"
            onClick={() => setActiveTab('code-editor')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'code-editor'
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Compile & Collab
          </button>
          <button
            id="nav-link-freelance"
            onClick={() => setActiveTab('freelance')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'freelance'
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Freelance Hub
          </button>

          {/* Owner Portal Link when Owner is logged in */}
          {isOwner && (
            <button
              id="nav-link-owner-portal"
              onClick={() => setActiveTab('owner-portal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                activeTab === 'owner-portal'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
              <span>Owner Portal</span>
            </button>
          )}
        </div>

        {/* Right Actions: Notifications, Messages, Secret Owner Gateway, Go Pro, Profile */}
        <div className="flex items-center gap-2">
          {/* Learning & Activity History Button (Header feature) */}
          <button
            id="history-header-btn"
            onClick={() => setIsHistoryModalOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative cursor-pointer group"
            title="Activity History (Track Downloads, Code Changes & Classes)"
          >
            <History className="w-4.5 h-4.5 group-hover:rotate-[-20deg] transition-transform duration-200" />
            {activityHistory.length > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.2 text-[9px] font-bold bg-indigo-600 text-white rounded-full">
                {activityHistory.length > 99 ? '99+' : activityHistory.length}
              </span>
            )}
          </button>

          {/* Secret Owner Gateway Trigger Button */}
          <button
            id="secret-owner-trigger-btn"
            onClick={() => {
              if (isOwner) {
                setActiveTab('owner-portal');
              } else {
                setIsSecretOwnerModalOpen(true);
              }
            }}
            className={`p-2 rounded-xl transition-all relative ${
              isOwner
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isOwner ? 'Owner Mode Active (Click to open Owner Hub)' : 'Secret Owner Login (or press Ctrl+Shift+O)'}
          >
            <KeyRound className="w-4.5 h-4.5" />
            {isOwner && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </button>

          {/* Notification Menu */}
          <div className="relative">
            <button
              id="notif-toggle-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            </button>

            {isNotifOpen && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">
                    Notifications
                  </span>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">
                    Mark read
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 flex gap-3 items-start">
                    <span className="w-2 h-2 mt-1.5 rounded-full bg-indigo-600 shrink-0"></span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        New Gig Match Available!
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                        Build a Custom E-commerce Dashboard ($450–$600).
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">2h ago</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 flex gap-3 items-start transition-colors">
                    <span className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Live Class starting soon
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                        Microservices with gRPC & Go with David Chen.
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Today at 6:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Chat Shortcut */}
          <button
            id="chat-quick-btn"
            onClick={() => setActiveTab('messages')}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
            title="Messages & Study Groups"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 px-1.5 py-0.2 text-[9px] font-bold bg-indigo-600 text-white rounded-full">
              2
            </span>
          </button>

          {/* Go Pro Button */}
          <button
            id="go-pro-btn"
            onClick={() => setIsProModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow active:scale-98 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {user.isPro ? 'Pro Active' : 'Go Pro'}
          </button>

          {/* User Profile Trigger & Menu */}
          <div className="relative">
            <button
              id="user-profile-menu-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover border border-indigo-500"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden xl:inline-block max-w-[90px] truncate">
                {user.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div
                id="user-dropdown-menu"
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">{user.btId}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 uppercase tracking-wider">
                      {user.role === 'student' ? 'Current Student' : 'Alumni Network'}
                    </span>
                    {user.isPro && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> PRO
                      </span>
                    )}
                    {isOwner && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 flex items-center gap-0.5">
                        👑 OWNER
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  {/* Secret Owner Access Link inside User Menu */}
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (isOwner) {
                        setActiveTab('owner-portal');
                      } else {
                        setIsSecretOwnerModalOpen(true);
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-amber-700 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 font-semibold flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      {isOwner ? 'Open Owner Control Hub' : 'Secret Owner Login'}
                    </span>
                    <span className="text-[10px] text-amber-600/70 font-mono">⌘+Shift+O</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAvatarModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between transition-colors font-medium"
                  >
                    <span>Update Profile Picture</span>
                    <Camera className="w-3.5 h-3.5 text-indigo-500" />
                  </button>

                  <button
                    onClick={() => {
                      toggleRole();
                      setIsUserMenuOpen(false);
                      showToast(
                        `Switched view to ${
                          user.role === 'student' ? 'Alumni Network' : 'Student Mode'
                        }`
                      );
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between transition-colors"
                  >
                    <span>Switch to {user.role === 'student' ? 'Alumni' : 'Student'}</span>
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Account Settings
                  </button>

                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Switch Account / Sign In
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                      setIsAuthModalOpen(true);
                      showToast('Logged out of EduHub');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-between transition-colors mt-1 pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    <span>Log Out</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ActivityHistoryModal />
    </nav>
  );
};

