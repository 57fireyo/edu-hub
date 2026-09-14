import React, { useState } from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users2,
  BookOpen,
  Tv,
  Code2,
  MessageSquare,
  Briefcase,
  Settings,
  HelpCircle,
  Crown,
  ChevronDown,
  GraduationCap,
  Sparkles,
  Compass,
  Cog,
  ArrowUpRight,
  ShieldCheck,
  Radio,
  Lock,
} from 'lucide-react';

interface NavItemConfig {
  id: NavigationTab;
  label: string;
  badge?: string;
  icon: React.FC<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsPostGigModalOpen,
    isOwner,
    setIsSecretOwnerModalOpen,
    resources,
    liveClasses,
  } = useApp();
  const { user } = useAuth();

  // Collapsible category states
  const [academicOpen, setAcademicOpen] = useState(true);
  const [communityOpen, setCommunityOpen] = useState(true);
  const [systemOpen, setSystemOpen] = useState(true);

  const academicItems: NavItemConfig[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resources', label: 'Resources (Notes/PDFs)', badge: `${resources.length}`, icon: BookOpen },
    { id: 'live-classes', label: 'Live Classes', badge: liveClasses.some((c) => c.isLiveNow) ? 'LIVE' : undefined, icon: Tv },
    { id: 'code-editor', label: 'Code Editor & AI Debugger', icon: Code2 },
  ];

  const communityItems: NavItemConfig[] = [
    { id: 'freelance', label: 'Freelance Hub', icon: Briefcase },
    { id: 'mentorship', label: 'Mentorship', icon: Users2 },
    { id: 'messages', label: 'Messages & Social', icon: MessageSquare },
  ];

  const systemItems: NavItemConfig[] = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & FAQ', icon: HelpCircle },
    ...(isOwner
      ? [{ id: 'owner-portal' as NavigationTab, label: 'Owner Control Center', badge: 'ADMIN', icon: Crown }]
      : []),
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="desktop-sidebar"
        className="hidden md:flex flex-col h-[calc(100vh-61px)] w-64 sticky top-[61px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-3.5 gap-3 flex-shrink-0 select-none overflow-y-auto"
      >
        {/* User Card */}
        <div
          id="sidebar-user-card"
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all group"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500 group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user.name}
              </h3>
              {isOwner ? (
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                  OWNER
                </span>
              ) : user.role === 'alumni' ? (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ALUMNI
                </span>
              ) : null}
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate font-medium">
              {user.btId} • {user.branch || 'CSE'}
            </p>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="flex-1 flex flex-col gap-3.5">
          {/* 1. Academic Portal Category */}
          <div className="space-y-1">
            <button
              onClick={() => setAcademicOpen(!academicOpen)}
              className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 tracking-wider uppercase transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                <span>Academic Portal</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  academicOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {academicOpen && (
              <div className="space-y-0.5">
                {academicItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-item-${item.id}`}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            item.badge === 'LIVE'
                              ? 'bg-red-500 text-white animate-pulse'
                              : isActive
                              ? 'bg-indigo-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Community & Career Category */}
          <div className="space-y-1">
            <button
              onClick={() => setCommunityOpen(!communityOpen)}
              className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 tracking-wider uppercase transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-500" />
                <span>Community & Career</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  communityOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {communityOpen && (
              <div className="space-y-0.5">
                {communityItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-item-${item.id}`}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. System Category */}
          <div className="space-y-1">
            <button
              onClick={() => setSystemOpen(!systemOpen)}
              className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 tracking-wider uppercase transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Cog className="w-3.5 h-3.5 text-slate-500" />
                <span>System</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  systemOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {systemOpen && (
              <div className="space-y-0.5">
                {systemItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-item-${item.id}`}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        item.id === 'owner-portal'
                          ? isActive
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                            : 'bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800'
                          : isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            item.id === 'owner-portal'
                              ? 'text-amber-600 dark:text-amber-400'
                              : isActive
                              ? 'text-white'
                              : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            item.id === 'owner-portal'
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-indigo-700 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Start Earning / Post Gig CTA */}
        <div className="pt-2">
          <button
            id="sidebar-start-earning-btn"
            onClick={() => {
              if (user.role === 'alumni' || isOwner) {
                setIsPostGigModalOpen(true);
              } else {
                setActiveTab('freelance');
              }
            }}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{user.role === 'alumni' ? 'Post a Student Gig' : 'Start Earning (Gigs)'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer info & owner trigger */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-mono text-[10px]">JDCOEM Connect v2.4</span>
          {!isOwner && (
            <button
              onClick={() => setIsSecretOwnerModalOpen(true)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              title="Owner Authentication"
            >
              <Lock className="w-3 h-3" />
              <span>Owner</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 py-1.5 select-none"
      >
        {[
          { id: 'dashboard' as NavigationTab, label: 'Home', icon: LayoutDashboard },
          { id: 'resources' as NavigationTab, label: 'Resources', icon: BookOpen },
          { id: 'live-classes' as NavigationTab, label: 'Live', icon: Tv },
          { id: 'code-editor' as NavigationTab, label: 'Code', icon: Code2 },
          { id: 'freelance' as NavigationTab, label: 'Gigs', icon: Briefcase },
          { id: 'messages' as NavigationTab, label: 'Chat', icon: MessageSquare },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors flex-1 ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
