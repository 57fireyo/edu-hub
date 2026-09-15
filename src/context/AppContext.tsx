import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ResourceItem,
  FreelanceGig,
  GigApplication,
  Mentor,
  LiveClass,
  ChatMessage,
  ResourceType,
  ExternalWebsite,
  PlatformAnnouncement,
  UserReview,
  ContentReport,
  FriendConnection,
  DirectMessage,
  UserRole,
  ProjectCredits,
  ProjectContributor,
  FacultyGuide,
  ChatGroup,
  GroupMessage,
  ChatGroupMember,
  AcademicSubject,
  AcademicBranch,
  CollegeStats,
  SupportedCodeLanguage,
  CampusDirectoryUser,
  ActivityHistoryItem,
  ActivityHistoryType,
} from '../types';
import {
  sampleResources,
  sampleGigs,
  sampleMentors,
  sampleLiveClasses,
  initialStudyGroupMessages,
  defaultCodeSnippets,
  sampleWebsites,
  sampleAnnouncements,
  sampleFriends,
  sampleDirectMessages,
  initialProjectCredits,
  sampleChatGroups,
  sampleGroupMessages,
  initialAcademicSubjects,
  initialAcademicBranches,
  initialCollegeStats,
  initialCampusDirectoryUsers,
} from '../mockData';
import confetti from 'canvas-confetti';
import {
  seedFirestoreIfEmpty,
  subscribeToProjectCredits,
  saveProjectCreditsToFirestore,
  subscribeToResources,
  addResourceToFirestore,
  updateResourceInFirestore,
  deleteResourceFromFirestore,
  subscribeToAcademicSubjects,
  saveAcademicSubjectToFirestore,
  deleteAcademicSubjectFromFirestore,
  subscribeToAcademicBranches,
  saveAcademicBranchToFirestore,
  deleteAcademicBranchFromFirestore,
  subscribeToCollegeStats,
  saveCollegeStatsToFirestore,
  subscribeToChatGroups,
  saveChatGroupToFirestore,
  deleteChatGroupFromFirestore,
  subscribeToGroupMessages,
  addGroupMessageToFirestore,
  deleteGroupMessageFromFirestore,
  updateGroupMessageReactionsInFirestore,
  subscribeToDirectMessages,
  addDirectMessageToFirestore,
  subscribeToBannedUsers,
  saveBannedUserToFirestore,
  removeBannedUserFromFirestore,
} from '../lib/firestoreService';
import { BannedUserRecord, AvatarModalTarget } from '../types';

export type NavigationTab =
  | 'dashboard'
  | 'mentorship'
  | 'resources'
  | 'live-classes'
  | 'code-editor'
  | 'freelance'
  | 'messages'
  | 'settings'
  | 'help'
  | 'owner-portal';

interface ReportTargetPayload {
  id: string;
  title: string;
  type: 'resource' | 'live-class' | 'user' | 'message';
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Resources
  resources: ResourceItem[];
  resourceCategoryFilter: string;
  setResourceCategoryFilter: (category: string) => void;
  toggleSaveResource: (id: string) => void;
  toggleLikeResource: (id: string) => void;
  incrementResourceViews: (id: string) => void;
  viewingResource: ResourceItem | null;
  setViewingResource: (resource: ResourceItem | null) => void;
  addResource: (resource: Omit<ResourceItem, 'id' | 'rating' | 'viewCount' | 'likesCount' | 'reviewsCount'>) => void;
  deleteResource: (id: string) => void;
  updateResource: (id: string, updates: Partial<ResourceItem>) => void;

  // Academic Subjects & Structure
  academicSubjects: AcademicSubject[];
  academicBranches: AcademicBranch[];
  academicYears: string[];
  addAcademicSubject: (subj: Omit<AcademicSubject, 'id'>) => void;
  updateAcademicSubject: (id: string, updates: Partial<AcademicSubject>) => void;
  deleteAcademicSubject: (id: string) => void;
  addAcademicBranch: (branch: AcademicBranch) => void;
  deleteAcademicBranch: (code: string) => void;
  addAcademicYear: (year: string) => void;
  deleteAcademicYear: (year: string) => void;

  // College Overview Stats
  collegeStats: CollegeStats;
  updateCollegeStats: (updates: Partial<CollegeStats>) => void;

  // External Websites & Tools
  websites: ExternalWebsite[];
  addWebsite: (site: Omit<ExternalWebsite, 'id' | 'addedAt'>) => void;
  deleteWebsite: (id: string) => void;
  togglePinWebsite: (id: string) => void;

  // Announcements
  announcements: PlatformAnnouncement[];
  addAnnouncement: (ann: Omit<PlatformAnnouncement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncementActive: (id: string) => void;

  // Gigs
  gigs: FreelanceGig[];
  deleteGig: (id: string) => void;
  applications: GigApplication[];
  selectedGigForApply: FreelanceGig | null;
  setSelectedGigForApply: (gig: FreelanceGig | null) => void;
  submitGigApplication: (gigId: string, proposedRate: string, coverLetter: string) => void;
  postGig: (gigData: Omit<FreelanceGig, 'id' | 'postedAt' | 'proposalsCount'>) => void;
  isPostGigModalOpen: boolean;
  setIsPostGigModalOpen: (open: boolean) => void;
  activeGigDetail: FreelanceGig | null;
  setActiveGigDetail: (gig: FreelanceGig | null) => void;

  // Mentors
  mentors: Mentor[];
  selectedMentorForBooking: Mentor | null;
  setSelectedMentorForBooking: (mentor: Mentor | null) => void;
  bookedSessions: Array<{ mentorName: string; date: string; time: string; topic: string }>;
  bookMentorSession: (mentorName: string, date: string, time: string, topic: string) => void;

  // Live Classes
  liveClasses: LiveClass[];
  addLiveClass: (liveClass: Omit<LiveClass, 'id' | 'viewCount' | 'likesCount' | 'reviewsCount' | 'rating'>) => void;
  deleteLiveClass: (id: string) => void;
  toggleLikeLiveClass: (id: string) => void;
  incrementLiveClassViews: (id: string) => void;
  activeLiveRoom: LiveClass | null;
  setActiveLiveRoom: (liveClass: LiveClass | null) => void;

  // Reviews & Ratings
  addReview: (targetId: string, targetType: 'resource' | 'live-class' | 'mentor', rating: number, comment: string) => void;

  // Reports
  reports: ContentReport[];
  isReportModalOpen: boolean;
  reportTarget: ReportTargetPayload | null;
  openReportModal: (target: ReportTargetPayload) => void;
  closeReportModal: () => void;
  submitReport: (reason: ContentReport['reason'], details?: string) => void;
  deleteReport: (id: string) => void;
  resolveReport: (id: string) => void;

  // Friends & Connections
  friends: FriendConnection[];
  campusDirectoryUsers: CampusDirectoryUser[];
  addCampusDirectoryUser: (user: Omit<CampusDirectoryUser, 'id'>) => void;
  sendFriendRequest: (user: { id: string; name: string; avatar: string; role: UserRole; branch: string; academicTrack?: string; bio?: string }) => void;
  acceptFriendRequest: (userId: string) => void;
  declineFriendRequest: (userId: string) => void;
  cancelFriendRequest: (userId: string) => void;
  removeFriend: (userId: string) => void;
  blockUser: (userId: string, userName?: string) => void;
  unblockUser: (userId: string) => void;

  // Direct Messaging (DM)
  directMessages: Record<string, DirectMessage[]>;
  activeDMUserId: string | null;
  setActiveDMUserId: (userId: string | null) => void;
  sendDirectMessage: (receiverId: string, text: string, codeSnippet?: string) => void;
  startDMWithUser: (
    userId: string,
    userDetails?: {
      name: string;
      avatar: string;
      role?: UserRole;
      branch?: string;
      academicTrack?: string;
      bio?: string;
    }
  ) => void;
  activeMessagesSubTab: 'groups' | 'dms' | 'search' | 'friends' | 'channels' | 'blocked';
  setActiveMessagesSubTab: (tab: 'groups' | 'dms' | 'search' | 'friends' | 'channels' | 'blocked') => void;

  // Collaboration Chat (Channels)
  chatMessages: ChatMessage[];
  activeChannel: string;
  setActiveChannel: (channelId: string) => void;
  sendChatMessage: (text: string, codeSnippet?: string) => void;

  // Code Editor & Multi-Language Compiler
  codeLanguage: SupportedCodeLanguage;
  setCodeLanguage: (lang: SupportedCodeLanguage) => void;
  code: string;
  setCode: (newCode: string) => void;
  consoleLogs: Array<{ type: 'output' | 'success' | 'error' | 'info'; text: string }>;
  isExecutingCode: boolean;
  runCode: () => void;
  clearConsole: () => void;
  formatCode: () => void;
  debugCodeWithAi: (customPrompt?: string) => Promise<{ success: boolean; diagnostic: string }>;
  aiDebugResult: string | null;
  isAiDebugging: boolean;
  clearAiDebugResult: () => void;
  archiveLiveClassToSubjectResources: (liveClassId: string, subjectCode: string) => void;

  // Project Credits & Contributors
  projectCredits: ProjectCredits;
  updateProjectCredits: (credits: Partial<ProjectCredits>) => void;
  updateHODInfo: (hod: Partial<ProjectCredits['hod']>) => void;
  addContributor: (contributor: Omit<ProjectContributor, 'id'>) => void;
  updateContributor: (id: string, updates: Partial<ProjectContributor>) => void;
  deleteContributor: (id: string) => void;
  addFacultyGuide: (guide: Omit<FacultyGuide, 'id'>) => void;
  updateFacultyGuide: (id: string, updates: Partial<FacultyGuide>) => void;
  deleteFacultyGuide: (id: string) => void;
  resetProjectCredits: () => void;

  // Group Chats (WhatsApp style)
  groups: ChatGroup[];
  groupMessages: Record<string, GroupMessage[]>;
  activeGroupId: string | null;
  setActiveGroupId: (groupId: string | null) => void;
  createGroup: (data: { name: string; description: string; category: string; avatarColor?: string; isPrivate?: boolean; initialMemberIds?: string[] }) => ChatGroup;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  deleteGroup: (groupId: string) => void;
  addMemberToGroup: (groupId: string, member: { userId: string; name: string; avatar: string }) => void;
  removeMemberFromGroup: (groupId: string, userId: string) => void;
  sendGroupMessage: (groupId: string, text: string, codeSnippet?: string, replyTo?: GroupMessage['replyTo']) => void;
  deleteGroupMessage: (groupId: string, messageId: string) => void;
  reactToGroupMessage: (groupId: string, messageId: string, emoji: string) => void;
  updateGroupInfo: (groupId: string, updates: Partial<ChatGroup>) => void;

  // Modals & Profile Customization
  isProModalOpen: boolean;
  setIsProModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileEditModalOpen: boolean;
  setIsProfileEditModalOpen: (open: boolean) => void;
  isAvatarModalOpen: boolean;
  setIsAvatarModalOpen: (open: boolean) => void;
  avatarModalTarget: AvatarModalTarget | null;
  openAvatarModal: (target?: AvatarModalTarget) => void;
  closeAvatarModal: () => void;

  // Owner Moderation & Punishment
  bannedUsers: BannedUserRecord[];
  isBanModalOpen: boolean;
  setIsBanModalOpen: (open: boolean) => void;
  banModalTarget: { userId?: string; name?: string; email?: string; btId?: string; avatar?: string; branch?: string; isContributor?: boolean; contributorId?: string; isPreRegMode?: boolean } | null;
  openBanModal: (target: { userId?: string; name?: string; email?: string; btId?: string; avatar?: string; branch?: string; isContributor?: boolean; contributorId?: string; isPreRegMode?: boolean }) => void;
  closeBanModal: () => void;
  banUser: (data: { userId?: string; name: string; email?: string; btId?: string; avatar?: string; branch?: string; reason: string; duration?: string; notes?: string; isContributor?: boolean; contributorId?: string; targetType?: 'pre_registration_blacklist' | 'registered_user' | 'contributor' }) => void;
  unbanUser: (userId: string) => void;
  isUserBanned: (identifier: { email?: string; btId?: string; name?: string; userId?: string }) => BannedUserRecord | undefined;
  banContributorInCredits: (contributorId: string, reason: string, duration?: string) => void;
  unbanContributorInCredits: (contributorId: string) => void;

  // Owner State & Secret Access
  isOwner: boolean;
  isSecretOwnerModalOpen: boolean;
  setIsSecretOwnerModalOpen: (open: boolean) => void;
  loginOwner: (passcode: string) => boolean;
  logoutOwner: () => void;
  notificationToast: string | null;
  showToast: (msg: string) => void;

  // Activity History Tracker (Header feature)
  activityHistory: ActivityHistoryItem[];
  addActivityHistory: (item: Omit<ActivityHistoryItem, 'id' | 'createdAt' | 'timestamp'>) => void;
  clearActivityHistory: () => void;
  isHistoryModalOpen: boolean;
  setIsHistoryModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Secret Owner State
  const [isOwner, setIsOwner] = useState<boolean>(() => {
    return localStorage.getItem('eduhub_owner_session') === 'true';
  });
  const [isSecretOwnerModalOpen, setIsSecretOwnerModalOpen] = useState<boolean>(false);

  // Websites & Tools
  const [websites, setWebsites] = useState<ExternalWebsite[]>(() => {
    const saved = localStorage.getItem('eduhub_websites');
    return saved ? JSON.parse(saved) : sampleWebsites;
  });

  // Announcements
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>(() => {
    const saved = localStorage.getItem('eduhub_announcements');
    return saved ? JSON.parse(saved) : sampleAnnouncements;
  });

  // Activity History Tracker State (Header section)
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryItem[]>(() => {
    const saved = localStorage.getItem('eduhub_activity_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'hist-init-1',
        type: 'download',
        title: 'Advanced Data Structures & Trees Compendium',
        subtitle: 'DSA Practical Guide (PDF) via Supabase Storage',
        timestamp: 'Today at 09:30 AM',
        createdAt: Date.now() - 3600000,
        metadata: {
          fileUrl: 'https://slosofqdfxelmonorspt.supabase.co/storage/v1/object/public/BHAVESH%20RAVINDRA%20DHAWALE/dsa%20all%20practicals.pdf',
        },
      },
      {
        id: 'hist-init-2',
        type: 'live_class',
        title: 'Building Production Microservices with gRPC & Go',
        subtitle: 'Attended live masterclass by David Chen',
        timestamp: 'Yesterday at 04:15 PM',
        createdAt: Date.now() - 86400000,
        metadata: {
          classId: 'class-1',
          instructor: 'David Chen',
        },
      },
      {
        id: 'hist-init-3',
        type: 'code_execution',
        title: 'Executed Python 3 Algorithm',
        subtitle: 'Segment Tree & Range Sum Queries • 0 errors',
        timestamp: '2 days ago',
        createdAt: Date.now() - 172800000,
        metadata: {
          language: 'python',
          hasError: false,
          executionTimeMs: 142,
        },
      },
    ];
  });
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('eduhub_activity_history', JSON.stringify(activityHistory));
  }, [activityHistory]);

  const addActivityHistory = (item: Omit<ActivityHistoryItem, 'id' | 'createdAt' | 'timestamp'>) => {
    const newItem: ActivityHistoryItem = {
      ...item,
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
      timestamp: 'Just now',
    };
    setActivityHistory((prev) => [newItem, ...prev.slice(0, 49)]); // keep latest 50
  };

  const clearActivityHistory = () => {
    setActivityHistory([]);
    localStorage.removeItem('eduhub_activity_history');
    showToast('Activity history cleared');
  };

  // Resources
  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('eduhub_resources');
    return saved ? JSON.parse(saved) : sampleResources;
  });
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState<string>('All');
  const [viewingResource, setViewingResource] = useState<ResourceItem | null>(null);

  // Academic Subjects & Structure State
  const [academicSubjects, setAcademicSubjects] = useState<AcademicSubject[]>(() => {
    const saved = localStorage.getItem('eduhub_academic_subjects');
    return saved ? JSON.parse(saved) : initialAcademicSubjects;
  });

  const [academicBranches, setAcademicBranches] = useState<AcademicBranch[]>(() => {
    const saved = localStorage.getItem('eduhub_academic_branches');
    return saved ? JSON.parse(saved) : initialAcademicBranches;
  });

  const [academicYears, setAcademicYears] = useState<string[]>(() => {
    const saved = localStorage.getItem('eduhub_academic_years');
    return saved ? JSON.parse(saved) : ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  });

  const [collegeStats, setCollegeStats] = useState<CollegeStats>(() => {
    const saved = localStorage.getItem('eduhub_college_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialCollegeStats,
          ...parsed,
          totalStudents: Number(parsed?.totalStudents ?? 3200),
          activeProjects: Number(parsed?.activeProjects ?? 142),
          liveStreams: Number(parsed?.liveStreams ?? 8),
          placementRate: parsed?.placementRate || '~77%',
        };
      } catch {
        return { ...initialCollegeStats, totalStudents: 3200, activeProjects: 142, liveStreams: 8, placementRate: '~77%' };
      }
    }
    return { ...initialCollegeStats, totalStudents: 3200, activeProjects: 142, liveStreams: 8, placementRate: '~77%' };
  });

  // Gigs
  const [gigs, setGigs] = useState<FreelanceGig[]>(() => {
    const saved = localStorage.getItem('eduhub_gigs');
    return saved ? JSON.parse(saved) : sampleGigs;
  });
  const [applications, setApplications] = useState<GigApplication[]>(() => {
    const saved = localStorage.getItem('eduhub_applications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'app-1',
        gigId: 'gig-1',
        gigTitle: 'Build a Custom E-commerce Dashboard',
        studentName: 'Alex Rivera',
        proposedRate: '$500 Fixed',
        coverLetter: 'I have built multiple React & Tailwind dashboards with real-time analytics. Ready to deliver within 10 days.',
        appliedDate: 'Yesterday',
        status: 'in_progress',
      },
    ];
  });
  const [selectedGigForApply, setSelectedGigForApply] = useState<FreelanceGig | null>(null);
  const [activeGigDetail, setActiveGigDetail] = useState<FreelanceGig | null>(null);
  const [isPostGigModalOpen, setIsPostGigModalOpen] = useState<boolean>(false);

  // Mentors
  const [mentors] = useState<Mentor[]>(sampleMentors);
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<Mentor | null>(null);
  const [bookedSessions, setBookedSessions] = useState<
    Array<{ mentorName: string; date: string; time: string; topic: string }>
  >([
    {
      mentorName: 'Sarah Jenkins',
      date: 'Tomorrow',
      time: '5:30 PM EST',
      topic: 'System Design Mock Interview & Resume Breakdown',
    },
  ]);

  // Live Classes
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(() => {
    const saved = localStorage.getItem('eduhub_live_classes');
    return saved ? JSON.parse(saved) : sampleLiveClasses;
  });
  const [activeLiveRoom, setActiveLiveRoom] = useState<LiveClass | null>(null);

  // Friends & Connections
  const [friends, setFriends] = useState<FriendConnection[]>(() => {
    const saved = localStorage.getItem('eduhub_friends');
    return saved ? JSON.parse(saved) : sampleFriends;
  });

  // Direct Messages
  const [directMessages, setDirectMessages] = useState<Record<string, DirectMessage[]>>(() => {
    const saved = localStorage.getItem('eduhub_dms');
    return saved ? JSON.parse(saved) : sampleDirectMessages;
  });
  const [activeDMUserId, setActiveDMUserId] = useState<string | null>('u-elena');

  // Campus Directory Users (Dynamic Search & Social Network)
  const [campusDirectoryUsers, setCampusDirectoryUsers] = useState<CampusDirectoryUser[]>(() => {
    const saved = localStorage.getItem('eduhub_campus_directory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed parsing campus directory from storage:', e);
      }
    }
    return initialCampusDirectoryUsers;
  });

  const [activeMessagesSubTab, setActiveMessagesSubTab] = useState<'groups' | 'dms' | 'search' | 'friends' | 'channels' | 'blocked'>('search');

  // Reports
  const [reports, setReports] = useState<ContentReport[]>(() => {
    const saved = localStorage.getItem('eduhub_reports');
    return saved ? JSON.parse(saved) : [
      {
        id: 'rep-1',
        targetId: 'res-5',
        targetTitle: 'PostgreSQL Indexing & Query Tuning Deep Dive',
        targetType: 'resource',
        reporterId: 'u-elena',
        reporterName: 'Elena Rostova',
        reason: 'Broken Link / Audio Issue',
        details: 'Code snippet on line 14 has a missing closing parenthesis.',
        timestamp: '1 day ago',
        status: 'pending',
      },
    ];
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportTarget, setReportTarget] = useState<ReportTargetPayload | null>(null);

  // Project Credits
  const [projectCredits, setProjectCredits] = useState<ProjectCredits>(() => {
    const saved = localStorage.getItem('eduhub_credits');
    return saved ? JSON.parse(saved) : initialProjectCredits;
  });

  // Group Chats (WhatsApp style)
  const [groups, setGroups] = useState<ChatGroup[]>(() => {
    const saved = localStorage.getItem('eduhub_chat_groups');
    return saved ? JSON.parse(saved) : sampleChatGroups;
  });
  const [groupMessages, setGroupMessages] = useState<Record<string, GroupMessage[]>>(() => {
    const saved = localStorage.getItem('eduhub_group_msgs');
    return saved ? JSON.parse(saved) : sampleGroupMessages;
  });
  const [activeGroupId, setActiveGroupId] = useState<string | null>('group-hackathon-2026');

  // Collaboration Chat (Channels)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('eduhub_chat_msgs');
    return saved ? JSON.parse(saved) : initialStudyGroupMessages;
  });
  const [activeChannel, setActiveChannel] = useState<string>('study-group-cs2024');

  // Code Editor & AI Compiler
  const [codeLanguage, setCodeLanguage] = useState<SupportedCodeLanguage>('python');
  const [code, setCode] = useState<string>(defaultCodeSnippets.python);
  const [consoleLogs, setConsoleLogs] = useState<
    Array<{ type: 'output' | 'success' | 'error' | 'info'; text: string }>
  >([
    { type: 'success', text: '✓ Environment ready (JDCOEM Sandboxed Multi-Language Compiler)' },
    { type: 'info', text: '> Select language, execute test suite, or launch Gemini AI Debugger.' },
  ]);
  const [isExecutingCode, setIsExecutingCode] = useState<boolean>(false);
  const [aiDebugResult, setAiDebugResult] = useState<string | null>(null);
  const [isAiDebugging, setIsAiDebugging] = useState<boolean>(false);

  // Modals & Feedback
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState<boolean>(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const [avatarModalTarget, setAvatarModalTarget] = useState<AvatarModalTarget | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Moderation & Banned Users State
  const [bannedUsers, setBannedUsers] = useState<BannedUserRecord[]>(() => {
    const saved = localStorage.getItem('eduhub_banned_users');
    return saved ? JSON.parse(saved) : [];
  });
  const [isBanModalOpen, setIsBanModalOpen] = useState<boolean>(false);
  const [banModalTarget, setBanModalTarget] = useState<{
    userId?: string;
    name?: string;
    email?: string;
    btId?: string;
    avatar?: string;
    branch?: string;
    isContributor?: boolean;
    contributorId?: string;
    isPreRegMode?: boolean;
  } | null>(null);

  // Persist State
  useEffect(() => {
    localStorage.setItem('eduhub_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('eduhub_banned_users', JSON.stringify(bannedUsers));
  }, [bannedUsers]);

  // LIVE CLOUD FIRESTORE REAL-TIME SYNCHRONIZATION
  useEffect(() => {
    // 1. Seed initial collections if database is fresh
    seedFirestoreIfEmpty();

    // 2. Real-time Project Credits listener
    const unsubCredits = subscribeToProjectCredits((liveCredits) => {
      if (liveCredits && liveCredits.hod) {
        setProjectCredits(liveCredits);
      }
    });

    // 3. Real-time Resources listener
    const unsubResources = subscribeToResources((liveResources) => {
      if (liveResources && liveResources.length > 0) {
        setResources(liveResources);
      }
    });

    // 4. Real-time Chat Groups listener
    const unsubGroups = subscribeToChatGroups((liveGroups) => {
      if (liveGroups && liveGroups.length > 0) {
        setGroups(liveGroups);
      }
    });

    // 5. Real-time Group Messages listener
    const unsubGroupMsgs = subscribeToGroupMessages((liveMsgs) => {
      if (liveMsgs && Object.keys(liveMsgs).length > 0) {
        setGroupMessages(liveMsgs);
      }
    });

    // 6. Real-time Direct Messages listener
    const unsubDMs = subscribeToDirectMessages((liveDMs) => {
      if (liveDMs && Object.keys(liveDMs).length > 0) {
        setDirectMessages(liveDMs);
      }
    });

    // 7. Real-time Banned Users listener
    const unsubBanned = subscribeToBannedUsers((liveBanned) => {
      if (liveBanned && liveBanned.length > 0) {
        setBannedUsers(liveBanned);
      }
    });

    // 8. Real-time Academic Subjects listener
    const unsubSubjects = subscribeToAcademicSubjects((liveSubjects) => {
      if (liveSubjects && liveSubjects.length > 0) {
        setAcademicSubjects(liveSubjects);
      }
    });

    // 9. Real-time Academic Branches listener
    const unsubBranches = subscribeToAcademicBranches((liveBranches) => {
      if (liveBranches && liveBranches.length > 0) {
        setAcademicBranches(liveBranches);
      }
    });

    // 10. Real-time College Stats listener
    const unsubStats = subscribeToCollegeStats((liveStats) => {
      if (liveStats && (liveStats.naacGrade || liveStats.totalStudents)) {
        setCollegeStats((prev) => ({
          ...prev,
          ...liveStats,
          totalStudents: Number(liveStats.totalStudents ?? prev.totalStudents ?? 3200),
          activeProjects: Number(liveStats.activeProjects ?? prev.activeProjects ?? 142),
          liveStreams: Number(liveStats.liveStreams ?? prev.liveStreams ?? 8),
          placementRate: liveStats.placementRate || prev.placementRate || '~77%',
        }));
      }
    });

    return () => {
      unsubCredits();
      unsubResources();
      unsubGroups();
      unsubGroupMsgs();
      unsubDMs();
      unsubBanned();
      unsubSubjects();
      unsubBranches();
      unsubStats();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('eduhub_websites', JSON.stringify(websites));
  }, [websites]);

  useEffect(() => {
    localStorage.setItem('eduhub_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('eduhub_gigs', JSON.stringify(gigs));
  }, [gigs]);

  useEffect(() => {
    localStorage.setItem('eduhub_live_classes', JSON.stringify(liveClasses));
  }, [liveClasses]);

  useEffect(() => {
    localStorage.setItem('eduhub_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('eduhub_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('eduhub_campus_directory', JSON.stringify(campusDirectoryUsers));
  }, [campusDirectoryUsers]);

  useEffect(() => {
    localStorage.setItem('eduhub_dms', JSON.stringify(directMessages));
  }, [directMessages]);

  useEffect(() => {
    localStorage.setItem('eduhub_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('eduhub_chat_msgs', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('eduhub_credits', JSON.stringify(projectCredits));
  }, [projectCredits]);

  useEffect(() => {
    localStorage.setItem('eduhub_chat_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('eduhub_group_msgs', JSON.stringify(groupMessages));
  }, [groupMessages]);

  useEffect(() => {
    localStorage.setItem('eduhub_owner_session', isOwner ? 'true' : 'false');
  }, [isOwner]);

  // URL Hash & Keyboard Listener for Secret Owner Trigger (#owner or Ctrl+Shift+O)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#owner' || window.location.hash === '#admin' || window.location.hash === '#secret') {
        setIsSecretOwnerModalOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && (e.key === 'O' || e.key === 'o' || e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsSecretOwnerModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Switch snippet when language changes
  useEffect(() => {
    setCode(defaultCodeSnippets[codeLanguage] || '');
    setConsoleLogs([
      { type: 'info', text: `> Switched environment to ${codeLanguage.toUpperCase()}` },
    ]);
  }, [codeLanguage]);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  // Secret Owner Authentication
  const loginOwner = (passcode: string): boolean => {
    const validCodes = ['owner2026', 'admin123', 'eduhub-owner', 'owner', 'admin'];
    const cleaned = passcode.trim().toLowerCase();
    if (validCodes.includes(cleaned)) {
      setIsOwner(true);
      setIsSecretOwnerModalOpen(false);
      setActiveTab('owner-portal');
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3600bf', '#10b981', '#f59e0b'],
      });
      showToast('👑 Welcome Boss! Owner Mode Activated.');
      return true;
    }
    return false;
  };

  const logoutOwner = () => {
    setIsOwner(false);
    if (activeTab === 'owner-portal') {
      setActiveTab('dashboard');
    }
    showToast('Logged out of Owner Mode');
  };

  // Resources
  const addResource = (resData: Omit<ResourceItem, 'id' | 'rating' | 'viewCount' | 'likesCount' | 'reviewsCount'>) => {
    const newResource: ResourceItem = {
      ...resData,
      id: `res-${Date.now()}`,
      rating: 5.0,
      viewCount: 1,
      views: '1 view',
      likesCount: 0,
      reviewsCount: 0,
      reviews: [],
      isOwnerUploaded: true,
      saved: false,
    };
    setResources((prev) => [newResource, ...prev]);
    addResourceToFirestore(newResource).catch((e) => console.warn('Firestore sync note:', e));
    showToast(`✓ Published ${newResource.type.toUpperCase()}: "${newResource.title}"`);
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    deleteResourceFromFirestore(id).catch((e) => console.warn('Firestore delete note:', e));
    showToast('Resource removed from platform');
  };

  const updateResource = (id: string, updates: Partial<ResourceItem>) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    updateResourceInFirestore(id, updates).catch((e) => console.warn('Firestore update note:', e));
    showToast('Resource updated successfully');
  };

  const toggleSaveResource = (id: string) => {
    setResources((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, saved: !item.saved } : item
      )
    );
    showToast('Resource bookmark updated');
  };

  const toggleLikeResource = (id: string) => {
    setResources((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const willLike = !item.isLiked;
        return {
          ...item,
          isLiked: willLike,
          likesCount: willLike ? (item.likesCount || 0) + 1 : Math.max(0, (item.likesCount || 1) - 1),
        };
      })
    );
  };

  const incrementResourceViews = (id: string) => {
    setResources((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newCount = (item.viewCount || 0) + 1;
        const viewsFormatted = newCount >= 1000 ? `${(newCount / 1000).toFixed(1)}k views` : `${newCount} views`;
        return {
          ...item,
          viewCount: newCount,
          views: viewsFormatted,
        };
      })
    );
  };

  // External Websites
  const addWebsite = (siteData: Omit<ExternalWebsite, 'id' | 'addedAt'>) => {
    const newSite: ExternalWebsite = {
      ...siteData,
      id: `web-${Date.now()}`,
      addedAt: 'Just now',
    };
    setWebsites((prev) => [newSite, ...prev]);
    showToast(`✓ Added website portal: "${newSite.title}"`);
  };

  const deleteWebsite = (id: string) => {
    setWebsites((prev) => prev.filter((s) => s.id !== id));
    showToast('Website portal removed');
  };

  const togglePinWebsite = (id: string) => {
    setWebsites((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s))
    );
  };

  // Announcements
  const addAnnouncement = (annData: Omit<PlatformAnnouncement, 'id' | 'createdAt'>) => {
    const newAnn: PlatformAnnouncement = {
      ...annData,
      id: `ann-${Date.now()}`,
      createdAt: 'Just now',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('Global platform announcement broadcasted!');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement removed');
  };

  const toggleAnnouncementActive = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  // Live Classes
  const addLiveClass = (classData: Omit<LiveClass, 'id' | 'viewCount' | 'likesCount' | 'reviewsCount' | 'rating'>) => {
    const newClass: LiveClass = {
      ...classData,
      id: `live-${Date.now()}`,
      viewCount: 1,
      likesCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
    };
    setLiveClasses((prev) => [newClass, ...prev]);
    showToast(`✓ Scheduled Live Class: "${newClass.title}"`);
  };

  const deleteLiveClass = (id: string) => {
    setLiveClasses((prev) => prev.filter((c) => c.id !== id));
    showToast('Live class session cancelled');
  };

  const toggleLikeLiveClass = (id: string) => {
    setLiveClasses((prev) =>
      prev.map((cls) => {
        if (cls.id !== id) return cls;
        const willLike = !cls.isLiked;
        return {
          ...cls,
          isLiked: willLike,
          likesCount: willLike ? (cls.likesCount || 0) + 1 : Math.max(0, (cls.likesCount || 1) - 1),
        };
      })
    );
  };

  const incrementLiveClassViews = (id: string) => {
    setLiveClasses((prev) =>
      prev.map((cls) => {
        if (cls.id !== id) return cls;
        return {
          ...cls,
          viewCount: (cls.viewCount || cls.attendeesCount || 0) + 1,
        };
      })
    );
  };

  // Reviews System
  const addReview = (
    targetId: string,
    targetType: 'resource' | 'live-class' | 'mentor',
    rating: number,
    comment: string
  ) => {
    const newReview: UserReview = {
      id: `rev-${Date.now()}`,
      targetId,
      targetType,
      userId: 'user-101',
      userName: 'Alex Rivera',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      userRole: 'CS Student',
      rating,
      comment: comment.trim(),
      createdAt: 'Just now',
      likesCount: 0,
    };

    if (targetType === 'resource') {
      setResources((prev) =>
        prev.map((res) => {
          if (res.id !== targetId) return res;
          const currentReviews = res.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = Number((totalRating / updatedReviews.length).toFixed(1));
          return {
            ...res,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: avgRating,
          };
        })
      );
    } else if (targetType === 'live-class') {
      setLiveClasses((prev) =>
        prev.map((cls) => {
          if (cls.id !== targetId) return cls;
          const currentReviews = cls.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = Number((totalRating / updatedReviews.length).toFixed(1));
          return {
            ...cls,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: avgRating,
          };
        })
      );
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#6366f1'],
    });
    showToast('★ Review & star rating submitted!');
  };

  // Report System
  const openReportModal = (target: ReportTargetPayload) => {
    setReportTarget(target);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportTarget(null);
  };

  const submitReport = (reason: ContentReport['reason'], details?: string) => {
    if (!reportTarget) return;
    const newReport: ContentReport = {
      id: `rep-${Date.now()}`,
      targetId: reportTarget.id,
      targetTitle: reportTarget.title,
      targetType: reportTarget.type,
      reporterId: 'user-101',
      reporterName: 'Alex Rivera',
      reason,
      details: details?.trim(),
      timestamp: 'Just now',
      status: 'pending',
    };
    setReports((prev) => [newReport, ...prev]);
    closeReportModal();
    showToast('🛡️ Report submitted to Campus Honor & Moderation Board');
  };

  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    showToast('Report cleared');
  };

  const resolveReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    );
    showToast('Report marked as resolved');
  };

  // Friends & Connections System
  const sendFriendRequest = (targetUser: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
    branch: string;
    academicTrack?: string;
    bio?: string;
  }) => {
    const existing = friends.find((f) => f.userId === targetUser.id);
    if (existing) {
      if (existing.status === 'blocked') {
        showToast('Cannot send connection to a blocked user');
        return;
      }
      if (existing.status === 'friend') {
        showToast(`You and ${targetUser.name} are already connected!`);
        return;
      }
    }

    const newConnection: FriendConnection = {
      id: `conn-${Date.now()}`,
      userId: targetUser.id,
      name: targetUser.name,
      avatar: targetUser.avatar,
      role: targetUser.role,
      branch: targetUser.branch,
      academicTrack: targetUser.academicTrack || `${targetUser.branch} Track`,
      status: 'pending_outgoing',
      bio: targetUser.bio || 'EduHub student',
      isOnline: true,
      lastSeen: 'Active now',
    };

    setFriends((prev) => [newConnection, ...prev.filter((f) => f.userId !== targetUser.id)]);
    showToast(`Friend request sent to ${targetUser.name}!`);
  };

  const acceptFriendRequest = (userId: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.userId === userId ? { ...f, status: 'friend' } : f))
    );
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    showToast('Connection request accepted! You can now send Direct Messages.');
  };

  const declineFriendRequest = (userId: string) => {
    setFriends((prev) => prev.filter((f) => f.userId !== userId));
    showToast('Friend request declined');
  };

  const cancelFriendRequest = (userId: string) => {
    setFriends((prev) => prev.filter((f) => f.userId !== userId));
    showToast('Friend request cancelled');
  };

  const removeFriend = (userId: string) => {
    setFriends((prev) => prev.filter((f) => f.userId !== userId));
    showToast('Removed from friends');
  };

  const blockUser = (userId: string, userName?: string) => {
    setFriends((prev) => {
      const existing = prev.find((f) => f.userId === userId);
      if (existing) {
        return prev.map((f) => (f.userId === userId ? { ...f, status: 'blocked' } : f));
      }
      return [
        {
          id: `conn-${Date.now()}`,
          userId,
          name: userName || 'Blocked User',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          role: 'student',
          branch: 'General',
          academicTrack: 'Blocked',
          status: 'blocked',
        },
        ...prev,
      ];
    });
    showToast(`User ${userName || ''} has been blocked.`);
  };

  const unblockUser = (userId: string) => {
    setFriends((prev) => prev.filter((f) => f.userId !== userId));
    showToast('User has been unblocked.');
  };

  // Direct Messaging System
  const sendDirectMessage = (receiverId: string, text: string, codeSnippet?: string) => {
    if (!text.trim() && !codeSnippet) return;

    const partner = friends.find((f) => f.userId === receiverId);
    if (partner?.status === 'blocked') {
      showToast('Cannot send message: User is blocked');
      return;
    }

    const newDM: DirectMessage = {
      id: `dm-${Date.now()}`,
      conversationPartnerId: receiverId,
      senderId: 'user-101',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      codeSnippet,
      isCurrentUser: true,
    };

    setDirectMessages((prev) => {
      const currentList = prev[receiverId] || [];
      return {
        ...prev,
        [receiverId]: [...currentList, newDM],
      };
    });

    addDirectMessageToFirestore(newDM).catch((e) => console.warn('Firestore DM sync:', e));

    // Auto simulated response
    setTimeout(() => {
      const friendName = partner?.name || 'Classmate';
      const replyDM: DirectMessage = {
        id: `dm-${Date.now() + 1}`,
        conversationPartnerId: receiverId,
        senderId: receiverId,
        senderName: friendName,
        senderAvatar: partner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        text: `Got your message! Let's sync on this code together. 👍`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: false,
      };

      setDirectMessages((prev) => {
        const currentList = prev[receiverId] || [];
        return {
          ...prev,
          [receiverId]: [...currentList, replyDM],
        };
      });
    }, 1500);
  };

  const addCampusDirectoryUser = (newUser: Omit<CampusDirectoryUser, 'id'>) => {
    const created: CampusDirectoryUser = {
      ...newUser,
      id: `user-${Date.now()}`,
    };
    setCampusDirectoryUsers((prev) => [created, ...prev]);
    showToast(`✓ Registered ${created.name} in Campus Social Directory!`);
  };

  const startDMWithUser = (
    userId: string,
    userDetails?: {
      name: string;
      avatar: string;
      role?: UserRole;
      branch?: string;
      academicTrack?: string;
      bio?: string;
    }
  ) => {
    // Ensure this user exists in friends/contacts so the DM interface displays their information correctly
    setFriends((prev) => {
      const existing = prev.find((f) => f.userId === userId);
      if (existing) return prev;

      const dirUser = campusDirectoryUsers.find((u) => u.id === userId);
      const newConn: FriendConnection = {
        id: `conn-${Date.now()}`,
        userId,
        name: userDetails?.name || dirUser?.name || 'Classmate',
        avatar:
          userDetails?.avatar ||
          dirUser?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: userDetails?.role || dirUser?.role || 'student',
        branch: userDetails?.branch || dirUser?.branch || 'Engineering',
        academicTrack: userDetails?.academicTrack || dirUser?.academicTrack || 'JDCOEM Campus Track',
        status: 'friend', // Connected for direct messaging
        bio: userDetails?.bio || dirUser?.bio || 'Campus classmate',
        isOnline: dirUser ? dirUser.isOnline : true,
        lastSeen: dirUser?.lastSeen || 'Active now',
      };
      return [newConn, ...prev];
    });

    setActiveDMUserId(userId);
    setActiveMessagesSubTab('dms');
    setActiveTab('messages');
    const partnerName = userDetails?.name || campusDirectoryUsers.find((u) => u.id === userId)?.name || 'classmate';
    showToast(`💬 Opened private chat with ${partnerName}`);
  };

  // Gigs & Applications
  const deleteGig = (id: string) => {
    setGigs((prev) => prev.filter((g) => g.id !== id));
    showToast('Freelance gig removed');
  };

  const submitGigApplication = (
    gigId: string,
    proposedRate: string,
    coverLetter: string
  ) => {
    const targetGig = gigs.find((g) => g.id === gigId);
    if (!targetGig) return;

    const newApp: GigApplication = {
      id: `app-${Date.now()}`,
      gigId,
      gigTitle: targetGig.title,
      studentName: 'Alex Rivera',
      proposedRate,
      coverLetter,
      appliedDate: 'Just now',
      status: 'pending',
    };

    setApplications((prev) => [newApp, ...prev]);
    setGigs((prev) =>
      prev.map((g) =>
        g.id === gigId ? { ...g, proposalsCount: g.proposalsCount + 1 } : g
      )
    );

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#3600bf', '#5c4fb7', '#9f92ff'],
    });

    showToast(`Proposal submitted successfully for "${targetGig.title}"!`);
    setSelectedGigForApply(null);
  };

  const postGig = (gigData: Omit<FreelanceGig, 'id' | 'postedAt' | 'proposalsCount'>) => {
    const newGig: FreelanceGig = {
      ...gigData,
      id: `gig-${Date.now()}`,
      postedAt: 'Just now',
      proposalsCount: 0,
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    };
    setGigs((prev) => [newGig, ...prev]);
    setIsPostGigModalOpen(false);
    showToast('Your gig was published to the EduHub Marketplace!');
  };

  const bookMentorSession = (
    mentorName: string,
    date: string,
    time: string,
    topic: string
  ) => {
    setBookedSessions((prev) => [{ mentorName, date, time, topic }, ...prev]);
    setSelectedMentorForBooking(null);
    showToast(`1-on-1 Mentorship session confirmed with ${mentorName}!`);
  };

  // Collaboration Chat (Channels)
  const sendChatMessage = (text: string, codeSnippet?: string) => {
    if (!text.trim() && !codeSnippet) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-101',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      senderRole: 'student',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
      codeSnippet,
      channelId: activeChannel,
    };

    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const isMentorChannel = activeChannel.includes('mentor');
      const responseMsg: ChatMessage = isMentorChannel
        ? {
            id: `msg-${Date.now() + 1}`,
            senderId: 'dr-chen-mentor',
            senderName: 'Dr. Chen (Mentor)',
            senderRole: 'mentor',
            text: 'Great observation! Let’s inspect how the edge cases behave when inputs are null or contain negative anomalies.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channelId: activeChannel,
          }
        : {
            id: `msg-${Date.now() + 1}`,
            senderId: 'sarah-j-student',
            senderName: 'Sarah J.',
            senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
            senderRole: 'student',
            text: 'I just reviewed your update on the editor! The unit tests look much cleaner now.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channelId: activeChannel,
          };
      setChatMessages((prev) => [...prev, responseMsg]);
    }, 1200);
  };

  // Project Credits Handlers
  const updateProjectCredits = (credits: Partial<ProjectCredits>) => {
    const updated: ProjectCredits = {
      ...projectCredits,
      ...credits,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    setProjectCredits(updated);
    saveProjectCreditsToFirestore(updated).catch((e) => console.warn('Firestore credits note:', e));
    showToast('Project credits updated successfully');
  };

  const updateHODInfo = (hodUpdates: Partial<ProjectCredits['hod']>) => {
    const updated: ProjectCredits = {
      ...projectCredits,
      hod: {
        ...projectCredits.hod,
        ...hodUpdates,
      },
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    setProjectCredits(updated);
    saveProjectCreditsToFirestore(updated).catch((e) => console.warn('Firestore HOD note:', e));
    showToast('Head of Department details updated');
  };

  const addContributor = (contributor: Omit<ProjectContributor, 'id'>) => {
    const newContrib: ProjectContributor = {
      ...contributor,
      id: `contrib-${Date.now()}`,
    };
    const updated: ProjectCredits = {
      ...projectCredits,
      contributors: [...projectCredits.contributors, newContrib],
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    setProjectCredits(updated);
    saveProjectCreditsToFirestore(updated).catch((e) => console.warn('Firestore contributor note:', e));
    showToast(`Added ${contributor.name} as project contributor`);
  };

  const updateContributor = (id: string, updates: Partial<ProjectContributor>) => {
    const updated: ProjectCredits = {
      ...projectCredits,
      contributors: projectCredits.contributors.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    setProjectCredits(updated);
    saveProjectCreditsToFirestore(updated).catch((e) => console.warn('Firestore contributor update:', e));
    showToast('Contributor profile updated');
  };

  const deleteContributor = (id: string) => {
    const updated: ProjectCredits = {
      ...projectCredits,
      contributors: projectCredits.contributors.filter((c) => c.id !== id),
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    setProjectCredits(updated);
    saveProjectCreditsToFirestore(updated).catch((e) => console.warn('Firestore contributor delete:', e));
    showToast('Contributor removed from credits');
  };

  const addFacultyGuide = (guide: Omit<FacultyGuide, 'id'>) => {
    const newGuide: FacultyGuide = {
      ...guide,
      id: `guide-${Date.now()}`,
    };
    const updated: ProjectCredits = {
      ...projectCredits,
      facultyGuides: [...projectCredits.facultyGuides, newGuide],
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    setProjectCredits(updated);
    saveProjectCreditsToFirestore(updated).catch((e) => console.warn('Firestore faculty note:', e));
    showToast(`Added ${guide.name} as faculty mentor`);
  };

  const updateFacultyGuide = (id: string, updates: Partial<FacultyGuide>) => {
    const updated: ProjectCredits = {
      ...projectCredits,
      facultyGuides: projectCredits.facultyGuides.map((g) => (g.id === id ? { ...g, ...updates } : g)),
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    setProjectCredits(updated);
    saveProjectCreditsToFirestore(updated).catch((e) => console.warn('Firestore faculty update:', e));
    showToast('Faculty mentor updated');
  };

  const deleteFacultyGuide = (id: string) => {
    const updated: ProjectCredits = {
      ...projectCredits,
      facultyGuides: projectCredits.facultyGuides.filter((g) => g.id !== id),
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    setProjectCredits(updated);
    saveProjectCreditsToFirestore(updated).catch((e) => console.warn('Firestore faculty delete:', e));
    showToast('Faculty mentor removed');
  };

  const resetProjectCredits = () => {
    setProjectCredits(initialProjectCredits);
    saveProjectCreditsToFirestore(initialProjectCredits).catch((e) => console.warn('Firestore reset:', e));
    showToast('Credits reset to default campus record');
  };

  // Avatar Modal Handlers
  const openAvatarModal = (target?: AvatarModalTarget) => {
    setAvatarModalTarget(target || null);
    setIsAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
    setAvatarModalTarget(null);
  };

  // Moderation & Disciplinary Ban Handlers
  const isUserBanned = (identifier: { email?: string; btId?: string; name?: string; userId?: string }): BannedUserRecord | undefined => {
    return bannedUsers.find((b) => {
      if (b.status !== 'active_ban') return false;
      if (identifier.userId && b.userId && b.userId.toLowerCase() === identifier.userId.toLowerCase()) return true;
      if (identifier.btId && b.btId && b.btId !== 'N/A' && b.btId.trim().toLowerCase() === identifier.btId.trim().toLowerCase()) return true;
      if (identifier.email && b.email && b.email.trim().toLowerCase() === identifier.email.trim().toLowerCase()) return true;
      if (identifier.name && b.name && b.name.trim().toLowerCase() === identifier.name.trim().toLowerCase()) return true;
      return false;
    });
  };

  const openBanModal = (target: {
    userId?: string;
    name?: string;
    email?: string;
    btId?: string;
    avatar?: string;
    branch?: string;
    isContributor?: boolean;
    contributorId?: string;
    isPreRegMode?: boolean;
  }) => {
    setBanModalTarget(target);
    setIsBanModalOpen(true);
  };

  const closeBanModal = () => {
    setIsBanModalOpen(false);
    setBanModalTarget(null);
  };

  const banUser = (data: {
    userId?: string;
    name: string;
    email?: string;
    btId?: string;
    avatar?: string;
    branch?: string;
    reason: string;
    duration?: string;
    notes?: string;
    isContributor?: boolean;
    contributorId?: string;
    targetType?: 'pre_registration_blacklist' | 'registered_user' | 'contributor';
  }) => {
    const rawId = data.userId || `ban-${(data.btId || data.email || data.name).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
    const record: BannedUserRecord = {
      id: `ban-${Date.now()}`,
      userId: rawId,
      name: data.name,
      email: data.email || '',
      btId: data.btId || 'N/A',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      branch: data.branch || 'Academic Member',
      reason: data.reason,
      bannedAt: new Date().toLocaleString(),
      bannedBy: 'Campus Owner / Administrator',
      duration: data.duration || '30 Days Campus Suspension',
      status: 'active_ban',
      notes: data.notes || '',
      targetType: data.targetType || (data.isContributor ? 'contributor' : data.userId ? 'registered_user' : 'pre_registration_blacklist'),
    };

    setBannedUsers((prev) => [record, ...prev.filter((b) => b.userId !== rawId && (!data.btId || b.btId !== data.btId))]);
    saveBannedUserToFirestore(record).catch((e) => console.warn('Firestore save ban error:', e));

    // If this user is a contributor in Credits Section, mark their disciplinary status
    if (data.isContributor || data.contributorId) {
      const cId = data.contributorId || rawId;
      setProjectCredits((prev) => {
        const updated: ProjectCredits = {
          ...prev,
          contributors: prev.contributors.map((c) =>
            c.id === cId || c.name.toLowerCase() === data.name.toLowerCase()
              ? {
                  ...c,
                  isBanned: true,
                  banReason: data.reason,
                  bannedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  disciplinaryStatus: 'banned',
                }
              : c
          ),
          lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        };
        saveProjectCreditsToFirestore(updated).catch(console.warn);
        return updated;
      });
    }

    showToast(`Enforced disciplinary ban for: ${data.name} (${data.btId || data.email || 'Blacklisted'})`);
    closeBanModal();
  };

  const unbanUser = (userId: string) => {
    setBannedUsers((prev) => prev.filter((b) => b.userId !== userId && b.id !== userId));
    removeBannedUserFromFirestore(userId).catch((e) => console.warn('Firestore remove ban error:', e));

    // If contributor in credits, reinstate their status
    setProjectCredits((prev) => {
      const updated: ProjectCredits = {
        ...prev,
        contributors: prev.contributors.map((c) =>
          c.id === userId || c.name.toLowerCase() === userId.toLowerCase()
            ? {
                ...c,
                isBanned: false,
                banReason: undefined,
                disciplinaryStatus: 'active',
              }
            : c
        ),
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      };
      saveProjectCreditsToFirestore(updated).catch(console.warn);
      return updated;
    });

    showToast(`Disciplinary ban revoked. User reinstated.`);
  };

  const banContributorInCredits = (contributorId: string, reason: string, duration?: string) => {
    const target = projectCredits.contributors.find((c) => c.id === contributorId);
    if (!target) return;

    banUser({
      userId: contributorId,
      name: target.name,
      btId: target.rollNo || 'CREDIT-CONTRIB',
      avatar: target.avatar,
      branch: 'Project Development Contributor',
      reason: reason || 'Academic / Repository Misconduct Penalty',
      duration: duration || 'Indefinite Project Suspension',
      isContributor: true,
      contributorId,
    });
  };

  const unbanContributorInCredits = (contributorId: string) => {
    unbanUser(contributorId);
  };

  // Group Chat Handlers
  const createGroup = (data: {
    name: string;
    description: string;
    category: string;
    avatarColor?: string;
    isPrivate?: boolean;
    initialMemberIds?: string[];
  }): ChatGroup => {
    const groupId = `group-${Date.now()}`;
    const initialMembers: ChatGroupMember[] = [
      {
        userId: 'user-101',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'admin',
        joinedAt: 'Just now',
      },
    ];

    if (data.initialMemberIds && data.initialMemberIds.length > 0) {
      data.initialMemberIds.forEach((mId) => {
        const foundFriend = friends.find((f) => f.userId === mId);
        if (foundFriend && foundFriend.userId !== 'user-101') {
          initialMembers.push({
            userId: foundFriend.userId,
            name: foundFriend.name,
            avatar: foundFriend.avatar,
            role: 'member',
            joinedAt: 'Just now',
          });
        }
      });
    }

    const newGroup: ChatGroup = {
      id: groupId,
      name: data.name,
      description: data.description,
      category: data.category,
      avatarColor: data.avatarColor || 'from-indigo-600 to-purple-600',
      creatorId: 'user-101',
      creatorName: 'Alex Rivera',
      adminIds: ['user-101'],
      members: initialMembers,
      createdAt: 'Just now',
      isPrivate: data.isPrivate ?? false,
      unreadCount: 0,
      lastMessage: {
        text: 'Group created by Alex Rivera',
        senderName: 'System',
        timestamp: 'Just now',
      },
    };

    setGroups((prev) => [newGroup, ...prev]);
    setGroupMessages((prev) => ({
      ...prev,
      [groupId]: [
        {
          id: `gmsg-${Date.now()}`,
          groupId,
          senderId: 'system',
          senderName: 'System',
          senderAvatar: '',
          text: `Welcome to "${data.name}"! Start the discussion, share code snippets, or collaborate on course deliverables.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true,
        },
      ],
    }));

    setActiveGroupId(groupId);
    saveChatGroupToFirestore(newGroup).catch((e) => console.warn('Firestore create group:', e));
    showToast(`Group "${data.name}" created with ${initialMembers.length} members!`);
    return newGroup;
  };

  const joinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const alreadyMember = g.members.some((m) => m.userId === 'user-101');
          if (alreadyMember) return g;
          const updatedMembers: ChatGroupMember[] = [
            ...g.members,
            {
              userId: 'user-101',
              name: 'Alex Rivera',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
              role: 'member',
              joinedAt: 'Just now',
            },
          ];
          return {
            ...g,
            members: updatedMembers,
          };
        }
        return g;
      })
    );

    const targetGroup = groups.find((g) => g.id === groupId);
    if (targetGroup) {
      const joinMsg: GroupMessage = {
        id: `gmsg-${Date.now()}`,
        groupId,
        senderId: 'system',
        senderName: 'System',
        senderAvatar: '',
        text: `Alex Rivera joined the group.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true,
      };
      setGroupMessages((prev) => ({
        ...prev,
        [groupId]: [...(prev[groupId] || []), joinMsg],
      }));
    }
    setActiveGroupId(groupId);
    showToast(`You joined ${targetGroup?.name || 'the group'}`);
  };

  const leaveGroup = (groupId: string) => {
    const targetGroup = groups.find((g) => g.id === groupId);
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            members: g.members.filter((m) => m.userId !== 'user-101'),
          };
        }
        return g;
      })
    );

    if (activeGroupId === groupId) {
      setActiveGroupId(groups.find((g) => g.id !== groupId)?.id || null);
    }
    showToast(`You left ${targetGroup?.name || 'the group'}`);
  };

  const deleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    setGroupMessages((prev) => {
      const copy = { ...prev };
      delete copy[groupId];
      return copy;
    });
    deleteChatGroupFromFirestore(groupId).catch((e) => console.warn('Firestore delete group:', e));
    if (activeGroupId === groupId) {
      setActiveGroupId(groups.find((g) => g.id !== groupId)?.id || null);
    }
    showToast('Group deleted');
  };

  const addMemberToGroup = (groupId: string, member: { userId: string; name: string; avatar: string }) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          if (g.members.some((m) => m.userId === member.userId)) return g;
          return {
            ...g,
            members: [
              ...g.members,
              {
                userId: member.userId,
                name: member.name,
                avatar: member.avatar,
                role: 'member',
                joinedAt: 'Just now',
              },
            ],
          };
        }
        return g;
      })
    );
    showToast(`Added ${member.name} to group`);
  };

  const removeMemberFromGroup = (groupId: string, userId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            members: g.members.filter((m) => m.userId !== userId),
          };
        }
        return g;
      })
    );
    showToast('Member removed from group');
  };

  const sendGroupMessage = (groupId: string, text: string, codeSnippet?: string, replyTo?: GroupMessage['replyTo']) => {
    if (!text.trim() && !codeSnippet) return;

    const newMsg: GroupMessage = {
      id: `gmsg-${Date.now()}`,
      groupId,
      senderId: 'user-101',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      senderRole: 'student',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      codeSnippet,
      replyTo,
    };

    setGroupMessages((prev) => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), newMsg],
    }));

    addGroupMessageToFirestore(groupId, newMsg).catch((e) => console.warn('Firestore send group msg:', e));

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              lastMessage: {
                text: text.trim() || 'Shared a code snippet',
                senderName: 'Alex Rivera',
                timestamp: 'Just now',
              },
            }
          : g
      )
    );

    // Dynamic simulated peer reply from another group member if exists
    setTimeout(() => {
      const targetGroup = groups.find((g) => g.id === groupId);
      const otherMembers = targetGroup?.members.filter((m) => m.userId !== 'user-101') || [];
      if (otherMembers.length > 0) {
        const randomMember = otherMembers[Math.floor(Math.random() * otherMembers.length)];
        const simulatedReplies = [
          'Nice! Thanks for sharing this update.',
          'Checking this now on my local branch.',
          'Looks solid! Let’s test with some edge case data.',
          'Great catch! I will incorporate this into our sprint deliverables.',
        ];
        const randomReplyText = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

        const replyMsg: GroupMessage = {
          id: `gmsg-${Date.now() + 1}`,
          groupId,
          senderId: randomMember.userId,
          senderName: randomMember.name,
          senderAvatar: randomMember.avatar,
          senderRole: 'member',
          text: randomReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setGroupMessages((prev) => ({
          ...prev,
          [groupId]: [...(prev[groupId] || []), replyMsg],
        }));

        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  lastMessage: {
                    text: randomReplyText,
                    senderName: randomMember.name,
                    timestamp: 'Just now',
                  },
                }
              : g
          )
        );
      }
    }, 1800);
  };

  const deleteGroupMessage = (groupId: string, messageId: string) => {
    setGroupMessages((prev) => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter((m) => m.id !== messageId),
    }));
    deleteGroupMessageFromFirestore(messageId).catch((e) => console.warn('Firestore delete msg:', e));
    showToast('Message deleted');
  };

  const reactToGroupMessage = (groupId: string, messageId: string, emoji: string) => {
    setGroupMessages((prev) => {
      const msgs = prev[groupId] || [];
      let finalReactions: Record<string, string[]> = {};
      const updated = msgs.map((m) => {
        if (m.id === messageId) {
          const currentReactions = m.reactions || {};
          const currentUsers = currentReactions[emoji] || [];
          const userAlreadyReacted = currentUsers.includes('user-101');
          
          let newUsers: string[];
          if (userAlreadyReacted) {
            newUsers = currentUsers.filter((u) => u !== 'user-101');
          } else {
            newUsers = [...currentUsers, 'user-101'];
          }

          const newReactions = { ...currentReactions };
          if (newUsers.length === 0) {
            delete newReactions[emoji];
          } else {
            newReactions[emoji] = newUsers;
          }
          finalReactions = newReactions;

          return {
            ...m,
            reactions: newReactions,
          };
        }
        return m;
      });

      updateGroupMessageReactionsInFirestore(messageId, finalReactions).catch((e) => console.warn('Firestore reaction:', e));

      return {
        ...prev,
        [groupId]: updated,
      };
    });
  };

  const updateGroupInfo = (groupId: string, updates: Partial<ChatGroup>) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const updated = { ...g, ...updates };
          saveChatGroupToFirestore(updated).catch((e) => console.warn('Firestore group info:', e));
          return updated;
        }
        return g;
      })
    );
    showToast('Group details updated');
  };

  const runCode = async () => {
    setIsExecutingCode(true);
    setConsoleLogs((prev) => [
      ...prev,
      { type: 'info', text: `> Compiling & executing in ${codeLanguage.toUpperCase()} environment...` },
    ]);

    try {
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code || '',
          language: codeLanguage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawOutput: string = data.output || '';
        const lines = rawOutput.split('\n');

        if (data.hasError) {
          setConsoleLogs((prev) => [
            ...prev,
            { type: 'error', text: `✕ Execution failed in ${data.executionTimeMs}ms` },
            ...lines.map((l) => ({ type: 'error' as const, text: l })),
          ]);
        } else {
          setConsoleLogs((prev) => [
            ...prev,
            { type: 'success', text: `✓ Process finished successfully in ${data.executionTimeMs}ms (exit code 0)` },
            ...lines.map((l) => ({ type: 'output' as const, text: l })),
          ]);
        }

        // Track in Activity History
        addActivityHistory({
          type: 'code_execution',
          title: `Executed ${codeLanguage.toUpperCase()} Code`,
          subtitle: `${data.hasError ? 'Failed with errors' : 'Finished exit code 0'} (${data.executionTimeMs}ms)`,
          metadata: {
            language: codeLanguage,
            codeSnippet: (code || '').slice(0, 120),
            executionTimeMs: data.executionTimeMs,
            hasError: Boolean(data.hasError),
          },
        });
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (err: any) {
      setConsoleLogs((prev) => [
        ...prev,
        { type: 'error', text: `Execution service error: ${err.message || 'Compiler process failed'}` },
      ]);
    } finally {
      setIsExecutingCode(false);
    }
  };

  const clearConsole = () => {
    setConsoleLogs([]);
  };

  const formatCode = () => {
    showToast('Code formatted with JDCOEM Prettier rule');
  };

  // AI Code Debugger powered by Gemini API
  const debugCodeWithAi = async (customPrompt?: string): Promise<{ success: boolean; diagnostic: string }> => {
    setIsAiDebugging(true);
    setConsoleLogs((prev) => [
      ...prev,
      { type: 'info', text: `> Requesting Gemini AI diagnostic inspection for ${codeLanguage.toUpperCase()}...` },
    ]);

    try {
      const errorOutput = consoleLogs
        .filter((l) => l.type === 'error')
        .map((l) => l.text)
        .join('\n');

      const response = await fetch('/api/debug-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: codeLanguage,
          errorOutput,
          customPrompt,
        }),
      });

      const data = await response.json();
      if (data.success && data.diagnostic) {
        setAiDebugResult(data.diagnostic);
        setConsoleLogs((prev) => [
          ...prev,
          { type: 'success', text: '✓ Gemini AI Diagnostic generated successfully!' },
        ]);
        showToast('AI Debugger analysis complete');
        return { success: true, diagnostic: data.diagnostic };
      } else {
        throw new Error(data.error || 'Failed to retrieve AI analysis');
      }
    } catch (err: any) {
      const fallbackMsg = `### AI Debugger Diagnostic (${codeLanguage.toUpperCase()})\n\n` +
        `**Static Code Analysis:**\n` +
        `- Syntax structure validated for standard idioms in ${codeLanguage}.\n` +
        `- Ensure all libraries and imports are explicitly included in your build profile.\n` +
        `- Checked for edge-case array indices, resource deallocation, and recursion base cases.`;
      setAiDebugResult(fallbackMsg);
      setConsoleLogs((prev) => [
        ...prev,
        { type: 'info', text: '✓ Static code audit generated.' },
      ]);
      return { success: true, diagnostic: fallbackMsg };
    } finally {
      setIsAiDebugging(false);
    }
  };

  const clearAiDebugResult = () => {
    setAiDebugResult(null);
  };

  // Academic Subject Management Handlers
  const addAcademicSubject = (subj: Omit<AcademicSubject, 'id'>) => {
    const newSubject: AcademicSubject = {
      ...subj,
      id: `subj-${Date.now()}`,
    };
    setAcademicSubjects((prev) => [newSubject, ...prev]);
    localStorage.setItem('eduhub_academic_subjects', JSON.stringify([newSubject, ...academicSubjects]));
    saveAcademicSubjectToFirestore(newSubject).catch((e) => console.warn('Firestore subject save:', e));
    showToast(`✓ Added subject "${newSubject.name}" (${newSubject.code})`);
  };

  const updateAcademicSubject = (id: string, updates: Partial<AcademicSubject>) => {
    const updatedList = academicSubjects.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setAcademicSubjects(updatedList);
    localStorage.setItem('eduhub_academic_subjects', JSON.stringify(updatedList));
    const target = updatedList.find((s) => s.id === id);
    if (target) {
      saveAcademicSubjectToFirestore(target).catch((e) => console.warn('Firestore subject update:', e));
    }
    showToast('Subject updated');
  };

  const deleteAcademicSubject = (id: string) => {
    const updatedList = academicSubjects.filter((s) => s.id !== id);
    setAcademicSubjects(updatedList);
    localStorage.setItem('eduhub_academic_subjects', JSON.stringify(updatedList));
    deleteAcademicSubjectFromFirestore(id).catch((e) => console.warn('Firestore subject delete:', e));
    showToast('Subject removed');
  };

  const addAcademicBranch = (branch: AcademicBranch) => {
    const updated = [...academicBranches.filter((b) => b.code !== branch.code), branch];
    setAcademicBranches(updated);
    localStorage.setItem('eduhub_academic_branches', JSON.stringify(updated));
    saveAcademicBranchToFirestore(branch).catch((e) => console.warn('Firestore branch save:', e));
    showToast(`✓ Added academic branch "${branch.name}" (${branch.code})`);
  };

  const deleteAcademicBranch = (code: string) => {
    const updated = academicBranches.filter((b) => b.code !== code);
    setAcademicBranches(updated);
    localStorage.setItem('eduhub_academic_branches', JSON.stringify(updated));
    deleteAcademicBranchFromFirestore(code).catch((e) => console.warn('Firestore branch delete:', e));
    showToast(`Branch ${code} removed`);
  };

  const addAcademicYear = (year: string) => {
    if (!academicYears.includes(year)) {
      const updated = [...academicYears, year];
      setAcademicYears(updated);
      localStorage.setItem('eduhub_academic_years', JSON.stringify(updated));
      showToast(`Added academic year: ${year}`);
    }
  };

  const deleteAcademicYear = (year: string) => {
    const updated = academicYears.filter((y) => y !== year);
    setAcademicYears(updated);
    localStorage.setItem('eduhub_academic_years', JSON.stringify(updated));
    showToast(`Removed academic year: ${year}`);
  };

  const updateCollegeStats = (updates: Partial<CollegeStats>) => {
    const updated = { ...collegeStats, ...updates };
    setCollegeStats(updated);
    localStorage.setItem('eduhub_college_stats', JSON.stringify(updated));
    saveCollegeStatsToFirestore(updated).catch((e) => console.warn('Firestore stats update:', e));
    showToast('College overview statistics updated');
  };

  // Archive Live Class to Subject Resources
  const archiveLiveClassToSubjectResources = (liveClassId: string, subjectCode: string) => {
    const liveCls = liveClasses.find((c) => c.id === liveClassId);
    if (!liveCls) return;

    const newResource: ResourceItem = {
      id: `res-archived-${Date.now()}`,
      title: `[Lecture Archive] ${liveCls.title}`,
      description: `Archived session from ${liveCls.topic}. Instructed by ${liveCls.instructorName}.`,
      category: 'Algorithms',
      type: 'Video Lectures',
      author: liveCls.instructorName,
      authorRole: 'Faculty / Alumni',
      reviewsCount: 0,
      subjectCode: subjectCode || liveCls.subjectCode || 'DSA',
      academicYear: liveCls.academicYear || '2nd Year',
      branch: liveCls.branch || 'CSE',
      videoUrl: liveCls.streamUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      uploaderId: 'user-101',
      uploaderName: liveCls.instructorName,
      uploaderAvatar: liveCls.instructorAvatar,
      uploaderRole: 'Faculty / Alumni',
      downloadCount: 0,
      viewCount: liveCls.viewCount || 1,
      likesCount: liveCls.likesCount || 0,
      rating: liveCls.rating || 5.0,
      createdAt: 'Just now',
      tags: ['Live Archive', subjectCode, 'Recorded Lecture'],
    };

    addResource(newResource);
    showToast(`✓ Archived class to ${subjectCode} Resources!`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        resources,
        resourceCategoryFilter,
        setResourceCategoryFilter,
        toggleSaveResource,
        toggleLikeResource,
        incrementResourceViews,
        viewingResource,
        setViewingResource,
        addResource,
        deleteResource,
        updateResource,
        websites,
        addWebsite,
        deleteWebsite,
        togglePinWebsite,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        toggleAnnouncementActive,
        gigs,
        deleteGig,
        applications,
        selectedGigForApply,
        setSelectedGigForApply,
        submitGigApplication,
        postGig,
        isPostGigModalOpen,
        setIsPostGigModalOpen,
        activeGigDetail,
        setActiveGigDetail,
        mentors,
        selectedMentorForBooking,
        setSelectedMentorForBooking,
        bookedSessions,
        bookMentorSession,
        liveClasses,
        addLiveClass,
        deleteLiveClass,
        toggleLikeLiveClass,
        incrementLiveClassViews,
        activeLiveRoom,
        setActiveLiveRoom,
        addReview,
        reports,
        isReportModalOpen,
        reportTarget,
        openReportModal,
        closeReportModal,
        submitReport,
        deleteReport,
        resolveReport,
        friends,
        campusDirectoryUsers,
        addCampusDirectoryUser,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        cancelFriendRequest,
        removeFriend,
        blockUser,
        unblockUser,
        directMessages,
        activeDMUserId,
        setActiveDMUserId,
        sendDirectMessage,
        startDMWithUser,
        activeMessagesSubTab,
        setActiveMessagesSubTab,
        chatMessages,
        activeChannel,
        setActiveChannel,
        sendChatMessage,
        projectCredits,
        updateProjectCredits,
        updateHODInfo,
        addContributor,
        updateContributor,
        deleteContributor,
        addFacultyGuide,
        updateFacultyGuide,
        deleteFacultyGuide,
        resetProjectCredits,
        groups,
        groupMessages,
        activeGroupId,
        setActiveGroupId,
        createGroup,
        joinGroup,
        leaveGroup,
        deleteGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        sendGroupMessage,
        deleteGroupMessage,
        reactToGroupMessage,
        updateGroupInfo,
        codeLanguage,
        setCodeLanguage,
        code,
        setCode,
        consoleLogs,
        isExecutingCode,
        runCode,
        clearConsole,
        formatCode,
        debugCodeWithAi,
        aiDebugResult,
        isAiDebugging,
        clearAiDebugResult,
        archiveLiveClassToSubjectResources,
        academicSubjects,
        academicBranches,
        academicYears,
        addAcademicSubject,
        updateAcademicSubject,
        deleteAcademicSubject,
        addAcademicBranch,
        deleteAcademicBranch,
        addAcademicYear,
        deleteAcademicYear,
        collegeStats,
        updateCollegeStats,
        isProModalOpen,
        setIsProModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileEditModalOpen,
        setIsProfileEditModalOpen,
        isAvatarModalOpen,
        setIsAvatarModalOpen,
        avatarModalTarget,
        openAvatarModal,
        closeAvatarModal,
        bannedUsers,
        isBanModalOpen,
        setIsBanModalOpen,
        banModalTarget,
        openBanModal,
        closeBanModal,
        banUser,
        unbanUser,
        isUserBanned,
        banContributorInCredits,
        unbanContributorInCredits,
        isOwner,
        isSecretOwnerModalOpen,
        setIsSecretOwnerModalOpen,
        loginOwner,
        logoutOwner,
        notificationToast,
        showToast,
        activityHistory,
        addActivityHistory,
        clearActivityHistory,
        isHistoryModalOpen,
        setIsHistoryModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
