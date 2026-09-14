import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  FileText,
  Video,
  Globe,
  Radio,
  Briefcase,
  Megaphone,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  Sparkles,
  ArrowRight,
  LogOut,
  Layers,
  Upload,
  BookOpen,
  Pin,
  RefreshCw,
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Check,
  Award,
  UserX,
  Gavel,
  RotateCcw,
  Lock,
  Scale,
  GraduationCap,
  Settings2,
} from 'lucide-react';
import { ResourceType } from '../../types';
import { CreditsSection } from '../Credits/CreditsSection';
import { ManageAcademicStructureModal } from '../Resources/ManageAcademicStructureModal';

export const OwnerControlCenter: React.FC = () => {
  const {
    isOwner,
    logoutOwner,
    resources,
    addResource,
    deleteResource,
    websites,
    addWebsite,
    deleteWebsite,
    togglePinWebsite,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementActive,
    liveClasses,
    addLiveClass,
    deleteLiveClass,
    gigs,
    deleteGig,
    postGig,
    reports,
    resolveReport,
    deleteReport,
    bannedUsers,
    openBanModal,
    unbanUser,
    projectCredits,
    academicSubjects,
    academicBranches,
    academicYears,
    addAcademicSubject,
    deleteAcademicSubject,
    addAcademicBranch,
    deleteAcademicBranch,
    addAcademicYear,
    deleteAcademicYear,
    collegeStats,
    updateCollegeStats,
    setActiveTab,
    showToast,
  } = useApp();

  const [activeOwnerTab, setActiveOwnerTab] = useState<
    'curriculum' | 'pdf' | 'video' | 'website' | 'live' | 'announcements' | 'credits' | 'all-items' | 'reports' | 'moderation'
  >('curriculum');

  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);

  // Quick Subject Form State
  const [quickSubjCode, setQuickSubjCode] = useState('');
  const [quickSubjName, setQuickSubjName] = useState('');
  const [quickSubjYear, setQuickSubjYear] = useState('2nd Year');
  const [quickSubjBranch, setQuickSubjBranch] = useState('CY');

  // Stats Form State
  const [statsTotalStudents, setStatsTotalStudents] = useState<number>(collegeStats?.totalStudents ?? 3200);
  const [statsPlacementRate, setStatsPlacementRate] = useState<number>(() => {
    if (typeof collegeStats?.placementRate === 'number') return collegeStats.placementRate;
    const num = parseInt(String(collegeStats?.placementRate || '77').replace(/\D/g, ''), 10);
    return isNaN(num) ? 77 : num;
  });
  const [statsActiveProjects, setStatsActiveProjects] = useState<number>(collegeStats?.activeProjects ?? 142);
  const [statsLiveStreams, setStatsLiveStreams] = useState<number>(collegeStats?.liveStreams ?? 8);

  // PDF Form State
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfCategory, setPdfCategory] = useState('Algorithms');
  const [pdfAuthor, setPdfAuthor] = useState('EduHub Faculty Board');
  const [pdfAuthorRole, setPdfAuthorRole] = useState('Faculty Lead');
  const [pdfPages, setPdfPages] = useState<number>(24);
  const [pdfSize, setPdfSize] = useState('3.8 MB');
  const [pdfSnippet, setPdfSnippet] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  // Video Form State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState('System Design');
  const [videoAuthor, setVideoAuthor] = useState('Staff Engineer');
  const [videoAuthorRole, setVideoAuthorRole] = useState('Industry Architect');
  const [videoDuration, setVideoDuration] = useState('45 min');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=sample');
  const [videoThumb, setVideoThumb] = useState(
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'
  );
  const [videoDesc, setVideoDesc] = useState('');

  // Website Form State ("add a thing a website")
  const [siteTitle, setSiteTitle] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [siteCategory, setSiteCategory] = useState('Academics');
  const [siteDesc, setSiteDesc] = useState('');
  const [sitePinned, setSitePinned] = useState(true);

  // Live Class Form State
  const [liveTitle, setLiveTitle] = useState('');
  const [liveInstructor, setLiveInstructor] = useState('Prof. Alan Vance');
  const [liveCategory, setLiveCategory] = useState('Computer Systems');
  const [liveDate, setLiveDate] = useState('Tomorrow, 4:00 PM');
  const [liveDuration, setLiveDuration] = useState('60 min');
  const [liveRoomId, setLiveRoomId] = useState('room-cs-live-101');
  const [liveIsNow, setLiveIsNow] = useState(false);

  // Announcement Form State
  const [annText, setAnnText] = useState('');
  const [annType, setAnnType] = useState<'info' | 'alert' | 'success'>('info');
  const [annLinkText, setAnnLinkText] = useState('Explore Catalog');
  const [annLinkTab, setAnnLinkTab] = useState('resources');

  // Search & Filter for All Items list
  const [itemSearch, setItemSearch] = useState('');

  if (!isOwner) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Owner Portal Protected
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          This management portal is reserved for authenticated platform administrators and content owners.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Handle PDF Submit
  const handleAddPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfTitle.trim()) {
      showToast('Please provide a document title.');
      return;
    }
    addResource({
      title: pdfTitle.trim(),
      description:
        pdfSnippet.trim() ||
        `Verified comprehensive academic and exam preparation handbook for ${pdfCategory}.`,
      category: pdfCategory,
      type: 'pdf',
      author: pdfAuthor.trim() || 'EduHub Faculty Board',
      authorRole: pdfAuthorRole.trim() || 'Academic Faculty Lead',
      pages: Number(pdfPages) || 16,
      size: pdfSize.trim() || '2.5 MB',
      views: '1.2k views',
      contentSnippet:
        pdfSnippet.trim() ||
        'Comprehensive syllabus walkthrough including definitions, time complexity matrices, and faculty practice problems.',
      url: pdfUrl.trim() || 'https://eduhub.edu/docs/sample-curriculum.pdf',
    });
    setPdfTitle('');
    setPdfSnippet('');
    showToast('✓ PDF Document published to Resources catalog!');
  };

  // Handle Video Submit
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      showToast('Please provide a video title.');
      return;
    }
    addResource({
      title: videoTitle.trim(),
      description:
        videoDesc.trim() ||
        `Masterclass lecture covering core architectural patterns and real-world implementations.`,
      category: videoCategory,
      type: 'video',
      author: videoAuthor.trim() || 'Staff Engineer',
      authorRole: videoAuthorRole.trim() || 'Senior Architect',
      duration: videoDuration.trim() || '30 min',
      thumbnail:
        videoThumb.trim() ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      views: '850 views',
      url: videoUrl.trim() || 'https://www.youtube.com/watch?v=sample',
    });
    setVideoTitle('');
    setVideoDesc('');
    showToast('✓ Video Lecture published to Resources catalog!');
  };

  // Handle Website Submit ("or they need to add a thing a website")
  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteTitle.trim() || !siteUrl.trim()) {
      showToast('Please provide website title and URL.');
      return;
    }
    let formattedUrl = siteUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    addWebsite({
      title: siteTitle.trim(),
      url: formattedUrl,
      category: siteCategory.trim() || 'Academics',
      description:
        siteDesc.trim() ||
        'Direct web gateway curated by EduHub administrators for academic and professional reference.',
      isPinned: sitePinned,
    });
    setSiteTitle('');
    setSiteUrl('');
    setSiteDesc('');
    showToast(`✓ External Website "${siteTitle}" published to Platform Tools!`);
  };

  // Handle Live Class Submit
  const handleAddLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle.trim()) {
      showToast('Please provide a live class topic title.');
      return;
    }
    addLiveClass({
      title: liveTitle.trim(),
      instructor: liveInstructor.trim() || 'Prof. Alan Vance',
      instructorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      instructorTitle: 'Faculty Lead',
      date: liveDate.trim() || 'Today',
      time: '6:00 PM EST',
      duration: liveDuration.trim() || '45 min',
      attendeesCount: 42,
      category: liveCategory,
      isLive: liveIsNow,
      thumbnail:
        'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600',
      description: 'Interactive lecture and Q&A session broadcasted to all enrolled students.',
      roomId: liveRoomId.trim() || `room-${Date.now()}`,
    });
    setLiveTitle('');
    showToast('✓ Live Class scheduled and visible on Live Classes board!');
  };

  // Handle Announcement Submit
  const handleAddAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annText.trim()) {
      showToast('Please write the announcement text.');
      return;
    }
    addAnnouncement({
      text: annText.trim(),
      type: annType,
      active: true,
      linkText: annLinkText.trim() || undefined,
      linkTab: annLinkTab.trim() || undefined,
    });
    setAnnText('');
    showToast('✓ Global platform announcement broadcasted live!');
  };

  const filteredResources = resources.filter(
    (r) =>
      !itemSearch ||
      r.title.toLowerCase().includes(itemSearch.toLowerCase()) ||
      r.category.toLowerCase().includes(itemSearch.toLowerCase()) ||
      r.author.toLowerCase().includes(itemSearch.toLowerCase())
  );

  return (
    <div id="owner-control-center" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-indigo-500/20 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/30 text-amber-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>EduHub Master Administration</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Owner & Admin Control Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80 max-w-2xl mt-1 leading-relaxed">
              Upload verified course PDFs, publish tutorial videos, bookmark external campus websites, schedule live classes, and manage all platform content in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('resources')}
              className="px-4 py-2 bg-indigo-600/60 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl border border-indigo-400/30 transition-all flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Public App</span>
            </button>
            <button
              onClick={logoutOwner}
              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/30 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Owner Mode</span>
            </button>
          </div>
        </div>

        {/* Quick Platform Vital Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Total Learning Material</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{resources.length} Items</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">External Web Portals</span>
            <span className="text-lg font-bold text-cyan-400 mt-0.5 block">{websites.length} Websites</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Scheduled Live Streams</span>
            <span className="text-lg font-bold text-amber-400 mt-0.5 block">{liveClasses.length} Sessions</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Marketplace Gigs</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">{gigs.length} Active Gigs</span>
          </div>
        </div>
      </header>

      {/* Control Center Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <button
          id="owner-tab-curriculum"
          onClick={() => setActiveOwnerTab('curriculum')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeOwnerTab === 'curriculum'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-indigo-700 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>🎓 Curriculum, Years & Subjects</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('pdf')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeOwnerTab === 'pdf'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>+ Add PDF Notes</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('video')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeOwnerTab === 'video'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Video className="w-4 h-4 text-rose-400" />
          <span>+ Add Video Tutorial</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('website')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeOwnerTab === 'website'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>+ Add Website Portal</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('live')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeOwnerTab === 'live'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-4 h-4 text-amber-400" />
          <span>+ Schedule Live Class</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeOwnerTab === 'announcements'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4 text-purple-400" />
          <span>📢 Announcements</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('credits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeOwnerTab === 'credits'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 hover:bg-amber-100'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Project Credits & HOD</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('all-items')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeOwnerTab === 'all-items'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Manage Library ({resources.length})</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeOwnerTab === 'reports'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Student Reports ({reports.length})</span>
          {reports.some((r) => r.status === 'pending') && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveOwnerTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeOwnerTab === 'moderation'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-red-700 dark:text-red-400 bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 hover:bg-red-100'
          }`}
        >
          <Gavel className="w-4 h-4 text-red-500" />
          <span>User Bans & Punishment ({bannedUsers.length})</span>
        </button>
      </div>

      {/* TAB 0: CURRICULUM, YEARS & SUBJECTS (OWNER MODE CORE) */}
      {activeOwnerTab === 'curriculum' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border border-indigo-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-mono text-[11px] font-bold border border-indigo-400/30">
                  OWNER CURRICULUM GOVERNANCE
                </span>
                <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-time Firestore Sync</span>
                </span>
              </div>
              <h2 className="text-lg font-black text-white">
                Academic Structure & Course Subject Control
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                Define and curate academic years (1st, 2nd, 3rd, 4th Year), engineering departments (CY, CSE, AIDS, ETC), and semester subjects (e.g. DSA, CAN, ISE). These directly structure the student and faculty resource directories.
              </p>
            </div>

            <button
              onClick={() => setIsStructureModalOpen(true)}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer shrink-0"
            >
              <Settings2 className="w-4 h-4" />
              <span>Open Interactive Curriculum Manager</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Subject Creator */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Quick Add Subject (e.g. DSA, CAN, ISE)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Instantly register a course subject to curriculum.
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!quickSubjCode.trim() || !quickSubjName.trim()) {
                    showToast('Please enter both subject code and full name.');
                    return;
                  }
                  addAcademicSubject({
                    code: quickSubjCode.trim().toUpperCase(),
                    name: quickSubjName.trim(),
                    academicYear: quickSubjYear,
                    branch: quickSubjBranch,
                    semester: 3,
                  });
                  setQuickSubjCode('');
                  setQuickSubjName('');
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Acronym / Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DSA, CAN, ISE, OS, DBMS"
                    value={quickSubjCode}
                    onChange={(e) => setQuickSubjCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono uppercase focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Data Structures & Algorithms"
                    value={quickSubjName}
                    onChange={(e) => setQuickSubjName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Year
                    </label>
                    <select
                      value={quickSubjYear}
                      onChange={(e) => setQuickSubjYear(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-hidden"
                    >
                      {academicYears.map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Department
                    </label>
                    <select
                      value={quickSubjBranch}
                      onChange={(e) => setQuickSubjBranch(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-hidden"
                    >
                      {academicBranches.map((b) => (
                        <option key={b.code} value={b.code}>{b.code} - {b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Subject to Year & Branch</span>
                </button>
              </form>

              {/* Subject Quick Chips */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Sample Quick Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { code: 'DSA', name: 'Data Structures & Algorithms', year: '2nd Year', branch: 'CY' },
                    { code: 'CAN', name: 'Computer Architecture & Networks', year: '2nd Year', branch: 'CY' },
                    { code: 'ISE', name: 'Information Security Essentials', year: '3rd Year', branch: 'CY' },
                    { code: 'OS', name: 'Operating Systems & Kernel Dev', year: '2nd Year', branch: 'CSE' },
                    { code: 'DBMS', name: 'Database Management Systems', year: '2nd Year', branch: 'CSE' },
                  ].map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => {
                        setQuickSubjCode(s.code);
                        setQuickSubjName(s.name);
                        setQuickSubjYear(s.year);
                        setQuickSubjBranch(s.branch);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors"
                    >
                      +{s.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Configured Subjects Inventory */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Configured Subjects ({academicSubjects.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live course subjects grouped by year and branch.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                  {academicBranches.length} Branches
                </span>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {academicSubjects.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    No subjects configured yet. Add your first subject using the form.
                  </p>
                ) : (
                  academicSubjects.map((subj) => (
                    <div
                      key={subj.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400 px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950">
                            {subj.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                            {subj.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {subj.academicYear} • Branch {subj.branch}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteAcademicSubject(subj.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* College Stats & Metrics Manager */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  College Metrics & Stats
                </h3>
                <p className="text-[11px] text-slate-500">
                  Displayed on JDCOEM Connect public hero banner and dashboards.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateCollegeStats({
                    totalStudents: Number(statsTotalStudents || 0),
                    placementRate: `${statsPlacementRate}%`,
                    activeProjects: Number(statsActiveProjects || 0),
                    liveStreams: Number(statsLiveStreams || 0),
                  });
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Enrolled Students
                  </label>
                  <input
                    type="number"
                    value={statsTotalStudents}
                    onChange={(e) => setStatsTotalStudents(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Placement Record (%)
                  </label>
                  <input
                    type="number"
                    value={statsPlacementRate}
                    onChange={(e) => setStatsPlacementRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Active Student Projects
                  </label>
                  <input
                    type="number"
                    value={statsActiveProjects}
                    onChange={(e) => setStatsActiveProjects(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Broadcasted Live Sessions
                  </label>
                  <input
                    type="number"
                    value={statsLiveStreams}
                    onChange={(e) => setStatsLiveStreams(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  Save Metrics to Firestore
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: ADD PDF FORM */}
      {activeOwnerTab === 'pdf' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Publish Academic PDF or Cheatsheet
                </h3>
                <p className="text-xs text-slate-500">
                  Documents are immediately visible to students under the Resources & Compendiums tab.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddPdf} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems & Raft Consensus Architecture Handbook"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Category
                  </label>
                  <select
                    value={pdfCategory}
                    onChange={(e) => setPdfCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Algorithms">Algorithms & Data Structures</option>
                    <option value="System Design">System Design & Cloud</option>
                    <option value="Web Dev">Web Development & Frontend</option>
                    <option value="AI & ML">AI & Machine Learning</option>
                    <option value="Data Science">Data Science & Analytics</option>
                    <option value="Mobile Dev">Mobile & Native Apps</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Faculty / Author Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. Alan Vance or CS Department Lead"
                    value={pdfAuthor}
                    onChange={(e) => setPdfAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Author Title / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chair of Computer Systems"
                    value={pdfAuthorRole}
                    onChange={(e) => setPdfAuthorRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pdfPages}
                    onChange={(e) => setPdfPages(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    File Size Display
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4.2 MB"
                    value={pdfSize}
                    onChange={(e) => setPdfSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Summary / Lecture Key Takeaways
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize the core topics covered in this PDF..."
                  value={pdfSnippet}
                  onChange={(e) => setPdfSnippet(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document PDF URL / Storage Link (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://... or leave default simulated PDF"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Publish PDF to EduHub</span>
                </button>
              </div>
            </form>
          </div>

          {/* PDF Preview Card */}
          <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Live Resource Card Preview
            </h4>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  PDF Compendium
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{pdfSize || '3.5 MB'}</span>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-2">
                  {pdfTitle || 'Distributed Systems & Consensus Handbook'}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {pdfSnippet || 'Verified faculty notes, diagram breakdowns, and practice problems.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500">
                <span>By {pdfAuthor || 'EduHub Faculty'}</span>
                <span>{pdfPages || 24} Pages</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-indigo-50/50 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
              💡 <strong>Owner Note:</strong> Students can immediately download, bookmark, or preview this PDF with one click.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADD VIDEO TUTORIAL FORM */}
      {activeOwnerTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Upload & Publish Video Lecture
                </h3>
                <p className="text-xs text-slate-500">
                  Include video breakdowns, screen recordings, YouTube tutorials, or high-definition campus streams.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Video Lecture Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Design Masterclass: Designing High-Scale Event-Driven Message Brokers"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Category
                  </label>
                  <select
                    value={videoCategory}
                    onChange={(e) => setVideoCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="System Design">System Design & Architecture</option>
                    <option value="Algorithms">Algorithms & Problem Solving</option>
                    <option value="Web Dev">Full Stack & Web Dev</option>
                    <option value="AI & ML">Deep Learning & LLMs</option>
                    <option value="Data Science">Big Data & ETL</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (e.g. 42 min)
                  </label>
                  <input
                    type="text"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Instructor / Speaker Name
                  </label>
                  <input
                    type="text"
                    value={videoAuthor}
                    onChange={(e) => setVideoAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Speaker Title / Affiliation
                  </label>
                  <input
                    type="text"
                    value={videoAuthorRole}
                    onChange={(e) => setVideoAuthorRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Video URL / Stream Link
                </label>
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=... or .mp4 URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={videoThumb}
                  onChange={(e) => setVideoThumb(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lecture Description
                </label>
                <textarea
                  rows={2}
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  placeholder="Outline key concepts, timestamps, and prerequisites..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Publish Video Lecture</span>
                </button>
              </div>
            </form>
          </div>

          {/* Video Preview Card */}
          <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Live Video Preview
            </h4>

            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="relative aspect-video bg-slate-800">
                <img
                  src={videoThumb}
                  alt="preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-lg">
                    <Video className="w-5 h-5 ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                  {videoDuration}
                </span>
              </div>
              <div className="p-3">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1">
                  {videoTitle || 'System Design Masterclass'}
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">By {videoAuthor}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADD WEBSITE PORTAL ("or they need to add a thing a website") */}
      {activeOwnerTab === 'website' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add External Website or Web Tool Portal
                </h3>
                <p className="text-xs text-slate-500">
                  Connect official course websites, compiler hubs, university portals, or external interactive apps.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddWebsite} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Website / Platform Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MIT OpenCourseWare AI Lab, LeetCode Campus Hub, or WolframAlpha"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Website Destination URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://ocw.mit.edu or https://leetcode.com"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Portal Category
                  </label>
                  <select
                    value={siteCategory}
                    onChange={(e) => setSiteCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Academics">Academics & Research</option>
                    <option value="Competitions">Coding Contests & Practice</option>
                    <option value="Documentation">Documentation & Standards</option>
                    <option value="AI & ML">AI Repositories & Models</option>
                    <option value="Campus LMS">Campus LMS & Portals</option>
                    <option value="Developer Tools">Developer Web Tools</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sitePinned}
                      onChange={(e) => setSitePinned(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Pin to Featured Web Portals on Resources
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brief Description / Purpose
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why students should visit this site..."
                  value={siteDesc}
                  onChange={(e) => setSiteDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Website Portal to EduHub</span>
                </button>
              </div>
            </form>
          </div>

          {/* Existing Websites list */}
          <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center justify-between">
              <span>Active External Portals ({websites.length})</span>
              <span className="text-[10px] text-slate-400">Live on platform</span>
            </h4>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {websites.map((site) => (
                <div
                  key={site.id}
                  className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs shadow-2xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {site.title}
                      </span>
                      {site.isPinned && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-[9px] font-bold">
                          PINNED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{site.url}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Test URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => togglePinWebsite(site.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        site.isPinned
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={site.isPinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteWebsite(site.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Delete website"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SCHEDULE LIVE CLASS */}
      {activeOwnerTab === 'live' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Schedule Live Stream / Interactive Workshop
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcast live interactive classrooms with synchronized whiteboard and code editor to all students.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddLive} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Workshop / Stream Topic *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real-Time Distributed Consensus with Raft & Paxos: Live Deep Dive"
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Instructor Name
                  </label>
                  <input
                    type="text"
                    value={liveInstructor}
                    onChange={(e) => setLiveInstructor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Topic Category
                  </label>
                  <input
                    type="text"
                    value={liveCategory}
                    onChange={(e) => setLiveCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Broadcast Date / Time
                  </label>
                  <input
                    type="text"
                    value={liveDate}
                    onChange={(e) => setLiveDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={liveDuration}
                    onChange={(e) => setLiveDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={liveIsNow}
                      onChange={(e) => setLiveIsNow(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      🔴 Stream is LIVE NOW
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Broadcast Live Class</span>
                </button>
              </div>
            </form>
          </div>

          {/* Existing Live sessions */}
          <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center justify-between">
              <span>Scheduled Live Streams ({liveClasses.length})</span>
            </h4>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {liveClasses.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs shadow-2xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      {item.isLive && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white text-[9px] font-bold animate-pulse">
                          LIVE
                        </span>
                      )}
                      <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {item.instructor} • {item.date}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteLiveClass(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GLOBAL PLATFORM ANNOUNCEMENTS */}
      {activeOwnerTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Broadcast Global Platform Banner
                </h3>
                <p className="text-xs text-slate-500">
                  Display high-visibility announcements at the top of the entire EduHub application.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddAnn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Message *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 📢 Final Exam Review Notes and New $1,000+ Freelance Gigs Published!"
                  value={annText}
                  onChange={(e) => setAnnText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Banner Tone / Style
                  </label>
                  <select
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="info">Indigo Info</option>
                    <option value="success">Emerald Success</option>
                    <option value="alert">Amber Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Call to Action Text
                  </label>
                  <input
                    type="text"
                    value={annLinkText}
                    onChange={(e) => setAnnLinkText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target View Tab
                  </label>
                  <select
                    value={annLinkTab}
                    onChange={(e) => setAnnLinkTab(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="resources">Resources Compendium</option>
                    <option value="freelance">Freelance Marketplace</option>
                    <option value="live-classes">Live Classes</option>
                    <option value="mentorship">Mentorship</option>
                    <option value="code-editor">Collaborative Code</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Publish Announcement Banner</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Announcements List */}
          <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              Live Broadcasts ({announcements.length})
            </h4>

            <div className="space-y-2.5">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-slate-800 dark:text-slate-200 font-medium text-[11px] leading-relaxed">
                      {ann.text}
                    </p>
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                    <button
                      onClick={() => toggleAnnouncementActive(ann.id)}
                      className={`font-semibold ${ann.active ? 'text-emerald-600' : 'text-slate-400'}`}
                    >
                      {ann.active ? '● Active Banner' : '○ Paused'}
                    </button>
                    <span className="text-slate-400">{ann.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PROJECT CREDITS & HOD / FACULTY / CONTRIBUTORS */}
      {activeOwnerTab === 'credits' && (
        <div className="space-y-6">
          <CreditsSection showOwnerEditButton={true} />
        </div>
      )}

      {/* TAB 6: MANAGE ALL ITEMS / CRUD TABLE */}
      {activeOwnerTab === 'all-items' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Platform Resource Directory ({resources.length} items)
              </h3>
              <p className="text-xs text-slate-500">
                View, search, and manage all published PDFs, video lectures, and code compendiums.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resources..."
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="pb-3 pl-2">Format</th>
                  <th className="pb-3">Title & Category</th>
                  <th className="pb-3">Author</th>
                  <th className="pb-3">Specs</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredResources.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 pl-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.type === 'pdf'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : item.type === 'video'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {item.type === 'pdf' ? (
                          <FileText className="w-3 h-3" />
                        ) : (
                          <Video className="w-3 h-3" />
                        )}
                        {item.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 max-w-xs">
                      <span className="font-bold text-slate-900 dark:text-white block truncate">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-500">{item.category}</span>
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">
                      <span>{item.author}</span>
                      <span className="block text-[10px] text-slate-400">{item.authorRole}</span>
                    </td>
                    <td className="py-3 text-slate-500 font-mono text-[11px]">
                      {item.type === 'pdf'
                        ? `${item.pages || 16} pgs • ${item.size || '3MB'}`
                        : item.duration || '30 min'}
                    </td>
                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={() => deleteResource(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: CAMPUS HONOR & MODERATION BOARD (REPORTS) */}
      {activeOwnerTab === 'reports' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Campus Honor & Moderation Reports ({reports.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review flagged content, copyright inquiries, broken links, and student peer reports.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-800">
                {reports.filter((r) => r.status === 'pending').length} Pending
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                {reports.filter((r) => r.status === 'resolved').length} Resolved
              </span>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-800 dark:text-slate-200">No Pending Reports</p>
              <p className="text-[11px]">All student submissions, live streams, and resource materials comply with campus standards.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    rep.status === 'pending'
                      ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-80'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rep.status === 'pending'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                        }`}
                      >
                        {rep.status.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold capitalize">
                        {rep.targetType} Flagged
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {rep.targetTitle}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        Reason: {rep.reason}
                      </span>
                      {rep.details && (
                        <p className="mt-1 text-slate-500 dark:text-slate-400 italic bg-white/70 dark:bg-slate-900/70 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                          "{rep.details}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                      <span>Reporter: {rep.reporterName}</span>
                      <span>•</span>
                      <span>Logged: {rep.timestamp}</span>
                      <span>•</span>
                      <span className="font-mono">ID: {rep.targetId}</span>
                    </div>
                  </div>

                  {/* Moderation Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {rep.status === 'pending' && (
                      <button
                        onClick={() => resolveReport(rep.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}

                    {rep.targetType === 'resource' && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete the reported resource "${rep.targetTitle}" from platform?`)) {
                            deleteResource(rep.targetId);
                            resolveReport(rep.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                        title="Delete offending resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Item</span>
                      </button>
                    )}

                    <button
                      onClick={() => deleteReport(rep.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors text-xs"
                      title="Dismiss / Clear record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 9: USER BANS & DISCIPLINARY MODERATION */}
      {activeOwnerTab === 'moderation' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Campus Disciplinary Center & User Bans</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                    {bannedUsers.length} Active Bans
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Enforce penalties, ban fraudulent/misconducting student accounts, and synchronize disciplinary records to Cloud Firestore.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                openBanModal({
                  userId: `student-${Date.now()}`,
                  name: 'Student Member',
                  btId: 'BT22CSE099',
                  branch: 'Computer Science & Engineering',
                })
              }
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 flex items-center gap-2 transition-all shrink-0"
            >
              <UserX className="w-4 h-4" />
              <span>+ Discipline / Ban User</span>
            </button>
          </div>

          {/* List of Disciplined / Banned Accounts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span>Active Punishment Records & Restrictions</span>
              </h4>
              <span className="text-xs text-slate-400">
                Synced in real-time with Firestore /banned_users collection
              </span>
            </div>

            {bannedUsers.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No Active Disciplinary Bans
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  All registered students and contributors are currently in good academic standing.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bannedUsers.map((bUser) => (
                  <div
                    key={bUser.id}
                    className="p-4 rounded-2xl border-2 border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={bUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                          alt={bUser.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-red-400 grayscale"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-red-600 text-white p-0.5 rounded-full text-[9px]">
                          🚫
                        </span>
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate line-through">
                            {bUser.name}
                          </h5>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-200">
                            {bUser.btId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {bUser.branch || 'Campus Student'}
                        </p>
                      </div>
                    </div>

                    {/* Reason box */}
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Infraction:
                        </span>
                        <span className="text-slate-500 font-medium">{bUser.duration}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        {bUser.reason}
                      </p>
                      {bUser.notes && (
                        <p className="text-[11px] text-slate-400 italic">
                          Memo: "{bUser.notes}"
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                        Banned on {bUser.bannedAt} by {bUser.bannedBy}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => unbanUser(bUser.userId)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Revoke Ban & Reinstate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Contributor Disciplinary Roster */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-500" />
              <span>Project Contributor Disciplinary Actions (Credits Section)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Quickly manage the disciplinary standing of student developers listed in the public project credits.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {projectCredits.contributors.map((contrib) => {
                const isBanned = contrib.isBanned || contrib.disciplinaryStatus === 'banned';
                return (
                  <div
                    key={contrib.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      isBanned
                        ? 'border-red-300 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={contrib.avatar}
                        alt={contrib.name}
                        className={`w-9 h-9 rounded-lg object-cover border ${isBanned ? 'border-red-400 grayscale' : 'border-slate-200 dark:border-slate-700'}`}
                      />
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isBanned ? 'text-red-900 dark:text-red-200 line-through' : 'text-slate-900 dark:text-white'}`}>
                          {contrib.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {isBanned ? 'Suspended' : contrib.role}
                        </p>
                      </div>
                    </div>

                    {isBanned ? (
                      <button
                        onClick={() => unbanUser(contrib.id)}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg shrink-0 transition-colors"
                      >
                        Reinstate
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          openBanModal({
                            userId: contrib.id,
                            name: contrib.name,
                            btId: contrib.rollNo,
                            avatar: contrib.avatar,
                            isContributor: true,
                            contributorId: contrib.id,
                          })
                        }
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg shrink-0 transition-colors"
                      >
                        Punish / Ban
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Curriculum Governance Modal */}
      <ManageAcademicStructureModal
        isOpen={isStructureModalOpen}
        onClose={() => setIsStructureModalOpen(false)}
      />
    </div>
  );
};
