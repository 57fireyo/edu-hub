import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  BookOpen,
  Save,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Crown,
  Moon,
  Sun,
  Bell,
  Sliders,
  Database,
  ExternalLink,
  Lock,
  LogOut,
  RefreshCw,
  Award,
  Users,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { CreditsSection } from '../Credits/CreditsSection';

export const SettingsView: React.FC = () => {
  const { user, updateUser, toggleRole, logout } = useAuth();
  const {
    isOwner,
    setIsSecretOwnerModalOpen,
    setActiveTab,
    setIsProModalOpen,
    setIsAuthModalOpen,
    setIsAvatarModalOpen,
    showToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'credits' | 'appearance' | 'owner' | 'notifications' | 'privacy'>('profile');

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [btId, setBtId] = useState(user?.btId || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skillsStr, setSkillsStr] = useState((user?.skills || []).join(', '));
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate?.toString() || '35');

  // Preferences State
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [notifyGigs, setNotifyGigs] = useState(true);
  const [notifyClasses, setNotifyClasses] = useState(true);
  const [notifyMentors, setNotifyMentors] = useState(true);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
      showToast('Light mode activated');
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
      showToast('Dark mode activated');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      btId,
      branch,
      bio,
      hourlyRate: parseInt(hourlyRate, 10) || 35,
      skills: (skillsStr || '').split(',').map((s) => s.trim()).filter(Boolean),
    });
    showToast('Settings and profile updated successfully!');
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header Banner */}
      <header className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings & Preferences</h1>
            {isOwner && (
              <span className="bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-500" />
                OWNER MODE ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Configure your student identity, appearance, role permissions, notification preferences, and administrative controls.
          </p>
        </div>

        {/* Quick Owner Action or Pro Status */}
        <div className="flex items-center gap-2">
          {isOwner ? (
            <button
              onClick={() => setActiveTab('owner-portal')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-98"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Go to Owner Portal</span>
            </button>
          ) : (
            <button
              onClick={() => setIsSecretOwnerModalOpen(true)}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Owner Access</span>
            </button>
          )}
        </div>
      </header>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile & Academic Details</span>
        </button>

        <button
          onClick={() => setActiveSubTab('credits')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'credits'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Project Credits & HOD</span>
        </button>

        <button
          onClick={() => setActiveSubTab('appearance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'appearance'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Appearance & Theme</span>
        </button>

        <button
          onClick={() => setActiveSubTab('owner')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'owner'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Owner & Admin Settings</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'notifications'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveSubTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'privacy'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Account</span>
        </button>
      </div>

      {/* Tab 1: Profile Form */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          {/* Profile Card & Avatar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div
                onClick={() => setIsAvatarModalOpen(true)}
                className="relative group cursor-pointer"
                title="Click to update your profile photo"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-xs group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-slate-950/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-xs">
                  <Camera className="w-3 h-3" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{user.name}</h2>
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Change Picture</span>
                  </button>
                </div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">{user.btId}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.academicTrack}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-98"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Update Profile Picture</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleRole();
                  showToast(`Role switched to ${user.role === 'student' ? 'Alumni' : 'Student'}`);
                }}
                className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Switch to {user.role === 'student' ? 'Alumni' : 'Student'} Role</span>
              </button>

              <button
                type="button"
                onClick={() => setIsProModalOpen(true)}
                className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{user.isPro ? 'Pro Membership Active' : 'Upgrade to Pro'}</span>
              </button>
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student BT ID / Roll Number
              </label>
              <input
                type="text"
                value={btId}
                onChange={(e) => setBtId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department / Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Freelance Hourly Rate (USD $)
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Skills & Tech Stack (comma-separated for smart gig matching)
              </label>
              <input
                type="text"
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="e.g. React, TypeScript, Python, Node.js, Tailwind CSS, PostgreSQL, Docker"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bio & Client Portfolio Pitch
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 active:scale-98 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Project Credits & Contributors */}
      {activeSubTab === 'credits' && (
        <div className="space-y-6">
          <CreditsSection showOwnerEditButton={true} />
        </div>
      )}

      {/* Tab 2: Appearance & Theme */}
      {activeSubTab === 'appearance' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Theme & Interface</h2>
            <p className="text-xs text-slate-500">Customize the visual theme and contrast modes for late-night coding.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={toggleDarkMode}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                isDarkMode
                  ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-slate-900 text-amber-300">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</h3>
                  <p className="text-xs text-slate-500">High contrast for code editing & dark interfaces</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleDarkMode}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div
              onClick={toggleDarkMode}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                !isDarkMode
                  ? 'border-indigo-500 bg-indigo-50/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Light Mode</h3>
                  <p className="text-xs text-slate-500">Clean, crisp daylight reading view</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={!isDarkMode}
                onChange={toggleDarkMode}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Owner & Admin Settings */}
      {activeSubTab === 'owner' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500 text-slate-950">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Platform Owner & Content Administration</h2>
                <p className="text-xs text-slate-500">
                  Manage academic content, upload PDFs, curate external links, and broadcast campus announcements.
                </p>
              </div>
            </div>

            {isOwner ? (
              <span className="px-3 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 rounded-full text-xs font-bold">
                ✓ Authenticated
              </span>
            ) : (
              <span className="px-3 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-full text-xs font-semibold">
                Locked
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-3">
            <div className="flex items-start gap-2">
              <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950 dark:text-amber-200">How to access Owner Mode:</p>
                <p className="text-amber-900/80 dark:text-amber-300/80 mt-0.5">
                  1. Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-amber-300 dark:border-amber-800 font-mono font-bold">Ctrl + Shift + O</kbd> (or ⌘+Shift+O) anywhere.<br />
                  2. Use passcode <code className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-1 py-0.5 rounded">owner2026</code>.<br />
                  3. You can also append <code className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded">/#owner</code> to your browser URL.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {isOwner ? (
              <button
                onClick={() => setActiveTab('owner-portal')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-98"
              >
                <Crown className="w-4 h-4" />
                <span>Open Owner Control Hub</span>
              </button>
            ) : (
              <button
                onClick={() => setIsSecretOwnerModalOpen(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-98"
              >
                <KeyRound className="w-4 h-4" />
                <span>Enter Owner Passcode to Unlock</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('resources')}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors"
            >
              Browse Student Resource Directory
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeSubTab === 'notifications' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
            <p className="text-xs text-slate-500">Choose when and how you receive alerts and campus opportunities.</p>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Freelance Gig Matches</p>
                <p className="text-slate-500">Notify me when a client posts a gig matching my skills stack</p>
              </div>
              <input
                type="checkbox"
                checked={notifyGigs}
                onChange={(e) => setNotifyGigs(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Live Masterclasses & Workshops</p>
                <p className="text-slate-500">Reminders 15 minutes before scheduled faculty streams begin</p>
              </div>
              <input
                type="checkbox"
                checked={notifyClasses}
                onChange={(e) => setNotifyClasses(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Mentorship Direct Inquiries</p>
                <p className="text-slate-500">Instant alerts when an alumni mentor responds to your request</p>
              </div>
              <input
                type="checkbox"
                checked={notifyMentors}
                onChange={(e) => setNotifyMentors(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 5: Privacy & Account */}
      {activeSubTab === 'privacy' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Security & Account Sessions</h2>
            <p className="text-xs text-slate-500">Manage account authentication, sessions, and data storage.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Current Session</p>
                <p className="text-[11px] text-slate-500">Logged in as {user.name} ({user.email})</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsAuthModalOpen(true);
                  showToast('Logged out of session');
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Switch Demo User Account</p>
                <p className="text-[11px] text-slate-500">Switch between verified student and alumni profiles</p>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Switch Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
