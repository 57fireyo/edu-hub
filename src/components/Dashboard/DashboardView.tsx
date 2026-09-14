import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumb } from '../Navigation/Breadcrumb';
import {
  Users2,
  Briefcase,
  BookOpen,
  ArrowRight,
  FileText,
  PlayCircle,
  Link2,
  Tv,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Clock,
  ExternalLink,
  Code2,
  GraduationCap,
  Award,
  Layers,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    setActiveTab,
    resources,
    setViewingResource,
    gigs,
    applications,
    liveClasses,
    mentors,
    collegeStats,
    setSelectedMentorForBooking,
    setSelectedGigForApply,
    setIsProModalOpen,
  } = useApp();
  const { user } = useAuth();

  const activeLiveClass = liveClasses.find((c) => c.isLiveNow) || liveClasses[0];

  return (
    <div id="dashboard-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Explicit Breadcrumb */}
      <Breadcrumb category="Academic Portal" items={[{ label: 'Executive Dashboard' }]} />

      {/* College Live Academic Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Enrolled Engineers
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {Number(collegeStats?.totalStudents ?? 3200).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Placement Record
            </span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {collegeStats?.placementRate ? (String(collegeStats.placementRate).includes('%') ? collegeStats.placementRate : `${collegeStats.placementRate}%`) : '~77%'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Projects
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {collegeStats?.activeProjects ?? 142}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Live Faculty Streams
            </span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-400">
              {collegeStats?.liveStreams ?? 8}
            </span>
          </div>
        </div>
      </div>

      {/* Overview Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {user?.academicTrack || 'Computer Science'}
            </span>
            {user?.isPro && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Pro Member
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Engineer'}! 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your academic progress, live collaborative rooms, and student freelance opportunities at a glance.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <button
            id="dash-compile-btn"
            onClick={() => setActiveTab('code-editor')}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-xs"
          >
            <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Open Code Editor</span>
          </button>
          <button
            id="dash-freelance-btn"
            onClick={() => setActiveTab('freelance')}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs active:scale-98"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Gigs</span>
          </button>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mentorship Highlight (Span 8) */}
        <section
          id="dash-mentorship-section"
          className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xs hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-5 relative z-10">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Mentorship Network</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Connect with industry alumni and book 1-on-1 guidance sessions.
              </p>
            </div>
            <button
              id="dash-view-network-btn"
              onClick={() => setActiveTab('mentorship')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {mentors.slice(0, 2).map((mentor) => (
              <div
                key={mentor.id}
                id={`mentor-card-${mentor.id}`}
                onClick={() => setSelectedMentorForBooking(mentor)}
                className="flex items-center gap-3.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group"
              >
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {mentor.name}
                    </h3>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                      ★ {mentor.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {mentor.role} @ {mentor.company}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-md">
                      Book 1-on-1
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {mentor.availableDays.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Freelance Hub (Span 4) */}
        <section
          id="dash-freelance-hub-card"
          className="lg:col-span-4 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-sm"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-200" />
                <span>Freelance Hub</span>
              </h2>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-md">
                {gigs.length} Active Gigs
              </span>
            </div>
            <p className="text-xs text-indigo-100">
              {gigs.filter((g) => (g.skills || []).some((s) => (user?.skills || []).includes(s))).length} new contracts
              matching your profile skillset.
            </p>
          </div>

          <div className="relative z-10 my-4">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/15">
              <p className="text-[11px] font-medium uppercase tracking-wider text-indigo-100 mb-1">
                Potential Student Earnings
              </p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold tracking-tight">${user?.earnings ?? 0}</span>
                <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +$450 this month
                </span>
              </div>
            </div>
          </div>

          <button
            id="dash-browse-gigs-btn"
            onClick={() => setActiveTab('freelance')}
            className="relative z-10 w-full bg-white hover:bg-slate-50 text-indigo-700 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span>Browse All Gigs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>

        {/* Live Class Spotlight */}
        {activeLiveClass && (
          <section
            id="dash-live-class-banner"
            className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                <img
                  src={activeLiveClass.thumbnail}
                  alt={activeLiveClass.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <Tv className="w-6 h-6 text-white" />
                </div>
                {activeLiveClass.isLiveNow && (
                  <span className="absolute top-1 left-1 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                    LIVE
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                    Interactive Stream
                  </span>
                  <span className="text-xs text-slate-400">
                    {activeLiveClass.time} ({activeLiveClass.duration})
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeLiveClass.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instructor: {activeLiveClass.instructor} • {activeLiveClass.instructorRole}
                </p>
              </div>
            </div>

            <button
              id="dash-join-stream-btn"
              onClick={() => setActiveTab('live-classes')}
              className="w-full md:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all whitespace-nowrap"
            >
              Join Live Class
            </button>
          </section>
        )}

        {/* Resource Library (Span 12) */}
        <section
          id="dash-resources-section"
          className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs"
        >
          <div className="flex justify-between items-end mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Resource Library</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Curated notes, code repositories, and recorded tutorials for your academic track.
              </p>
            </div>
            <button
              id="dash-view-all-resources-btn"
              onClick={() => setActiveTab('resources')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.slice(0, 4).map((resource) => (
              <div
                key={resource.id}
                id={`dash-resource-card-${resource.id}`}
                onClick={() => setViewingResource(resource)}
                className="group cursor-pointer p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xs transition-all flex flex-col"
              >
                {/* Thumbnail / Header Area */}
                <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-lg mb-3 flex items-center justify-center border border-slate-200/60 dark:border-slate-700 relative overflow-hidden group-hover:scale-98 transition-transform">
                  {resource.thumbnail ? (
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
                    />
                  ) : resource.type === 'pdf' ? (
                    <FileText className="w-10 h-10 text-indigo-600 dark:text-indigo-400 opacity-60" />
                  ) : resource.type === 'video' ? (
                    <PlayCircle className="w-10 h-10 text-indigo-600 dark:text-indigo-400 opacity-70" />
                  ) : (
                    <Link2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 opacity-60" />
                  )}

                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-indigo-700 dark:text-indigo-300 shadow-2xs">
                    {resource.category}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{resource.author}</p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-200/60 dark:border-slate-750 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                    {resource.type === 'pdf'
                      ? `${resource.pages} Pages`
                      : resource.type === 'video'
                      ? resource.duration
                      : 'Article'}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
