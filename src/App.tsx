import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavbar } from './components/Navigation/TopNavbar';
import { Sidebar } from './components/Navigation/Sidebar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ResourcesView } from './components/Resources/ResourcesView';
import { FreelanceView } from './components/Freelance/FreelanceView';
import { CodeWorkspaceView } from './components/CodeWorkspace/CodeWorkspaceView';
import { MentorshipView } from './components/Mentorship/MentorshipView';
import { LiveClassesView } from './components/LiveClasses/LiveClassesView';
import { MessagesView } from './components/Messages/MessagesView';
import { SettingsView } from './components/Settings/SettingsView';
import { HelpView } from './components/Help/HelpView';
import { OwnerControlCenter } from './components/Owner/OwnerControlCenter';

// Modals
import { AuthModal } from './components/Auth/AuthModal';
import { ProUpgradeModal } from './components/Modals/ProUpgradeModal';
import { ResourceViewerModal } from './components/Modals/ResourceViewerModal';
import { ApplyGigModal } from './components/Modals/ApplyGigModal';
import { ScheduleMentorModal } from './components/Modals/ScheduleMentorModal';
import { PostGigModal } from './components/Modals/PostGigModal';
import { GigDetailModal } from './components/Modals/GigDetailModal';
import { SecretOwnerLoginModal } from './components/Owner/SecretOwnerLoginModal';
import { AvatarUpdateModal } from './components/Modals/AvatarUpdateModal';
import { BanUserModal } from './components/Modals/BanUserModal';
import { BannedNoticeModal } from './components/Modals/BannedNoticeModal';
import { Megaphone, X, Crown } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, notificationToast, announcements, isOwner } = useApp();
  const [closedAnnouncementId, setClosedAnnouncementId] = React.useState<string | null>(null);

  const activeAnnouncement = announcements && announcements.length > 0
    ? announcements.find((a) => a.active && a.id !== closedAnnouncementId)
    : null;

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'resources':
        return <ResourcesView />;
      case 'freelance':
        return <FreelanceView />;
      case 'code-editor':
        return <CodeWorkspaceView />;
      case 'mentorship':
        return <MentorshipView />;
      case 'live-classes':
        return <LiveClassesView />;
      case 'messages':
        return <MessagesView />;
      case 'settings':
        return <SettingsView />;
      case 'help':
        return <HelpView />;
      case 'owner-portal':
        return <OwnerControlCenter />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Global Campus Broadcast / Owner Announcement Bar */}
      {activeAnnouncement && (
        <div
          id="global-announcement-banner"
          className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white text-xs py-2 px-4 flex items-center justify-between shadow-xs z-30"
        >
          <div className="flex items-center gap-2.5 max-w-[1400px] mx-auto w-full">
            <span className="p-1 rounded bg-white/20 shrink-0">
              <Megaphone className="w-3.5 h-3.5" />
            </span>
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <span className="font-bold tracking-tight">{activeAnnouncement.title}:</span>
              <span className="text-white/90 font-normal">{activeAnnouncement.content}</span>
            </div>
            {isOwner && (
              <button
                onClick={() => setActiveTab('owner-portal')}
                className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold hover:bg-amber-300 transition-colors shrink-0"
              >
                Owner Edit
              </button>
            )}
            <button
              onClick={() => setClosedAnnouncementId(activeAnnouncement.id)}
              className="p-1 hover:bg-white/20 rounded transition-colors text-white/80 hover:text-white shrink-0"
              title="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main App Canvas */}
      <div className="flex-1 flex max-w-[1440px] mx-auto w-full">
        {/* Desktop Sidebar & Mobile Bottom Navigation */}
        <Sidebar />

        {/* Dynamic Content Canvas */}
        <main
          id="main-canvas"
          className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 overflow-y-auto max-w-full"
        >
          {renderActiveView()}
        </main>
      </div>

      {/* Persistent Global Footer */}
      <footer
        id="global-footer"
        className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 w-full text-xs text-slate-500 dark:text-slate-400 py-5 px-6 md:px-12 mt-auto transition-colors"
      >
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-medium text-slate-800 dark:text-slate-200">
            © 2026 JDCOEM Connect • SKILL GRID Learning Hub. All rights reserved.
          </span>

          <div className="flex flex-wrap gap-5 justify-center font-medium">
            <a href="#privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Terms of Service
            </a>
            <a href="#partners" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              JDCOEM Academic Departments
            </a>
            <a href="#support" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Contact Support
            </a>
          </div>

          <span className="font-semibold text-indigo-600 dark:text-indigo-400 tracking-tight">
            JDCOEM Connect • Academic Track 2024–2026
          </span>
        </div>
      </footer>

      {/* Toast Notification Alert */}
      {notificationToast && (
        <div
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Global Modals */}
      <AuthModal />
      <ProUpgradeModal />
      <ResourceViewerModal />
      <ApplyGigModal />
      <ScheduleMentorModal />
      <PostGigModal />
      <GigDetailModal />
      <SecretOwnerLoginModal />
      <AvatarUpdateModal />
      <BanUserModal />
      <BannedNoticeModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

