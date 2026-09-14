export type UserRole = 'student' | 'alumni';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  btId: string;
  role: UserRole;
  avatar: string;
  branch: string;
  semester?: string;
  yearOfStudy?: string;
  rollNo?: string;
  passoutYear?: string;
  academicTrack: string;
  bio: string;
  skills: string[];
  earnings: number;
  completedGigsCount: number;
  isPro: boolean;
  githubUrl?: string;
  linkedinUrl?: string;
  phone?: string;
  emailVerified?: boolean;
  hourlyRate?: number;
  // Alumni specific
  isTeachingMode?: boolean;
  achievements?: string[];
  // Banning & Punishment status
  isBanned?: boolean;
  banReason?: string;
  bannedAt?: string;
  bannedBy?: string;
  banDuration?: string;
}

export interface BannedUserRecord {
  id: string;
  userId: string;
  name: string;
  email?: string;
  btId: string;
  avatar: string;
  branch: string;
  reason: string;
  bannedAt: string;
  bannedBy: string;
  duration: string;
  status: 'active_ban' | 'revoked';
  notes?: string;
  targetType?: 'pre_registration_blacklist' | 'registered_user' | 'contributor';
}

export interface AvatarModalTarget {
  type: 'user' | 'contributor' | 'hod' | 'faculty';
  id?: string;
  name?: string;
  currentAvatar?: string;
  role?: string;
  designation?: string;
}

export type ResourceType =
  | 'pdf'
  | 'video'
  | 'article'
  | 'code'
  | 'Notes'
  | 'Video Lectures'
  | 'Articles';

export interface UserReview {
  id: string;
  targetId: string;
  targetType: 'resource' | 'live-class' | 'mentor';
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  likesCount?: number;
  isHelpful?: boolean;
}

export interface ContentReport {
  id: string;
  targetId: string;
  targetTitle: string;
  targetType: 'resource' | 'live-class' | 'user' | 'message';
  reporterId: string;
  reporterName: string;
  reason: 'Inappropriate Content' | 'Misinformation / Outdated' | 'Copyright / Plagiarism' | 'Broken Link / Audio Issue' | 'Spam / Harassment' | 'Other';
  details?: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export type ConnectionStatus = 'friend' | 'pending_incoming' | 'pending_outgoing' | 'blocked' | 'none';

export interface FriendConnection {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  role: UserRole;
  branch: string;
  academicTrack: string;
  status: ConnectionStatus;
  isOnline?: boolean;
  lastSeen?: string;
  bio?: string;
  skills?: string[];
  unreadDMsCount?: number;
}

export interface DirectMessage {
  id: string;
  conversationPartnerId: string;
  senderId: string;
  receiverId?: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  createdAt?: number;
  codeSnippet?: string;
  isCurrentUser: boolean;
}

export interface ExternalWebsite {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  iconName?: string;
  isPinned?: boolean;
  addedAt: string;
}

export interface PlatformAnnouncement {
  id: string;
  text: string;
  title?: string;
  content?: string;
  type: 'info' | 'alert' | 'success';
  active: boolean;
  linkText?: string;
  linkTab?: string;
  createdAt: string;
}

export interface AcademicBranch {
  code: string; // e.g., 'CY', 'DS', 'AI', 'ETC', 'EE', 'CIVIL', 'ME', 'IT', 'CSE'
  name: string; // e.g., 'Cyber Security', 'Data Science', 'Artificial Intelligence'
  description?: string;
}

export interface AcademicSubject {
  id: string;
  code: string; // e.g., 'DSA', 'CAN', 'ISE', 'DBMS', 'OS', 'OOP', 'MATH-1'
  name: string; // e.g., 'Data Structures & Algorithms', 'Computer Architecture & Networking'
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | string;
  branches?: string[]; // e.g. ['CY', 'DS', 'AI', 'CSE', 'IT']
  semester?: string; // e.g., 'Semester 3', 'Semester 5'
  description?: string;
  department?: string;
  color?: 'indigo' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan' | string;
  isOwnerCreated?: boolean;
  order?: number;
  units?: string[]; // e.g. ['Unit 1: Arrays & Stacks', 'Unit 2: Trees & Graphs']
}

export interface VideoTimestamp {
  time: string;
  label: string;
  seconds?: number;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: 'Algorithms' | 'System Design' | 'Web Dev' | 'AI & ML' | 'Data Science' | 'Mobile Dev' | string;
  type: ResourceType;
  author: string;
  authorRole?: string;
  subjectId?: string;
  subjectCode?: string; // e.g. 'DSA', 'CAN', 'ISE'
  year?: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | string;
  academicYear?: string;
  branch?: string; // e.g. 'CY', 'DS', 'AI', 'ETC', 'EE', 'CIVIL', 'ME', 'IT', 'CSE' or 'All'
  semester?: string;
  unitOrModule?: string; // e.g. 'Unit 1: Fundamentals', 'Unit 2: Trees & Graphs'
  thumbnail?: string;
  pages?: number;
  pageCount?: number;
  duration?: string;
  size?: string;
  fileSize?: string;
  views?: string;
  viewCount: number;
  likesCount: number;
  isLiked?: boolean;
  rating: number;
  reviewsCount: number;
  reviews?: UserReview[];
  url?: string;
  fileUrl?: string;
  fileDataUrl?: string; // Direct uploaded file data
  fileName?: string;
  downloadUrl?: string;
  videoUrl?: string;
  videoDuration?: string;
  videoTimestamps?: { time: string; label: string; seconds?: number }[];
  timestamps?: VideoTimestamp[];
  notesMarkdown?: string;
  markdownContent?: string;
  contentSnippet?: string;
  saved?: boolean;
  isOwnerUploaded?: boolean;
  uploaderId?: string;
  uploaderName?: string;
  uploaderAvatar?: string;
  uploaderRole?: string;
  tags?: string[];
  readTime?: string;
  downloadCount?: number;
  createdAt?: string | number;
}

export interface CollegeCourseFee {
  id: string;
  level: 'UG' | 'PG' | 'Diploma';
  courseName: string;
  branch: string;
  duration: string;
  annualFee: string;
  intake: number;
  eligibility: string;
}

export interface CollegeStats {
  collegeName: string;
  shortName: string;
  tagline: string;
  naacGrade: string; // 'A'
  autonomousStatus: string;
  industryPartners: string; // '90+'
  placementRate: string; // '~77%'
  alumniCount: string; // '8,000+'
  highestPackage: string; // '₹63 LPA'
  averagePackage: string; // '₹6.5 LPA'
  recruiters: Array<{ name: string; logoUrl?: string; packageOffered?: string; sector?: string }>;
  infrastructure: Array<{ title: string; description: string; imageUrl: string }>;
  coursesAndFees: CollegeCourseFee[];
  totalStudents?: number;
  activeProjects?: number;
  liveStreams?: number;
}

export interface FreelanceGig {
  id: string;
  title: string;
  clientName: string;
  clientCompany?: string;
  clientAvatar?: string;
  description: string;
  skills: string[];
  budgetType: 'fixed' | 'hourly';
  budgetMin: number;
  budgetMax?: number;
  estimatedDuration: string;
  postedAt: string;
  proposalsCount: number;
  category: 'Web Dev' | 'Python' | 'UI/UX' | 'Writing' | 'Mobile' | 'AI/Data';
  featured?: boolean;
}

export interface GigApplication {
  id: string;
  gigId: string;
  gigTitle: string;
  studentName: string;
  proposedRate: string;
  coverLetter: string;
  appliedDate: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
  expertise: string[];
  rating: number;
  reviewsCount: number;
  hourlyRate: string;
  availableDays: string[];
  availableHours: string;
}

export interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  instructorRole: string;
  date: string;
  time: string;
  duration: string;
  attendeesCount: number;
  viewCount: number;
  likesCount: number;
  isLiked?: boolean;
  rating: number;
  reviewsCount: number;
  reviews?: UserReview[];
  thumbnail: string;
  isLiveNow?: boolean;
  category: string;
  summary: string;
  streamUrl?: string;
  streamType?: 'webrtc' | 'youtube' | 'simulator';
  subjectId?: string;
  subjectCode?: string;
  year?: string;
  branch?: string;
  slidesUrl?: string;
  codeSnippet?: string;
  isArchivedToResources?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole?: 'mentor' | 'student' | 'system' | 'client';
  text: string;
  timestamp: string;
  isCurrentUser?: boolean;
  codeSnippet?: string;
  channelId: string;
}

export type SupportedCodeLanguage = 'python' | 'javascript' | 'typescript' | 'cpp' | 'java' | 'c' | 'htmlcss';

export interface CodeEditorState {
  filename: string;
  language: SupportedCodeLanguage;
  code: string;
}

export interface ProjectContributor {
  id: string;
  name: string;
  rollNo?: string;
  role: string;
  contribution: string;
  avatar?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  // Punishment & Disciplinary status
  isBanned?: boolean;
  banReason?: string;
  bannedAt?: string;
  disciplinaryStatus?: 'active' | 'suspended' | 'banned' | 'under_review';
}

export interface FacultyGuide {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatar?: string;
  email?: string;
}

export interface ProjectCredits {
  institutionName: string;
  departmentName: string;
  projectTitle: string;
  academicYear: string;
  hod: {
    name: string;
    title: string;
    department: string;
    avatar?: string;
    message?: string;
    email?: string;
  };
  facultyGuides: FacultyGuide[];
  contributors: ProjectContributor[];
  acknowledgements: string;
  lastUpdated: string;
}

export interface ChatGroupMember {
  userId: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  avatarColor?: string;
  category: string;
  creatorId: string;
  creatorName: string;
  adminIds: string[];
  members: ChatGroupMember[];
  createdAt: string;
  isPrivate?: boolean;
  unreadCount?: number;
  lastMessage?: {
    text: string;
    senderName: string;
    timestamp: string;
  };
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string;
  text: string;
  timestamp: string;
  createdAt?: number;
  codeSnippet?: string;
  reactions?: Record<string, string[]>;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  isSystem?: boolean;
}
