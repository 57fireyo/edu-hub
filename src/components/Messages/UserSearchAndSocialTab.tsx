import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  MessageSquare,
  UserCheck,
  Clock,
  Sparkles,
  X,
  Filter,
  Check,
  User,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldBan,
  ExternalLink,
  Plus,
  BookOpen,
  Send,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CampusDirectoryUser, UserRole } from '../../types';

interface UserSearchAndSocialTabProps {
  onOpenDM?: (userId: string) => void;
}

export const UserSearchAndSocialTab: React.FC<UserSearchAndSocialTabProps> = ({ onOpenDM }) => {
  const {
    friends,
    campusDirectoryUsers,
    addCampusDirectoryUser,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    removeFriend,
    blockUser,
    startDMWithUser,
  } = useApp();

  const { user: currentUser } = useAuth();

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unconnected' | 'friends' | 'pending'>('all');

  // Modal states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [viewingProfileUser, setViewingProfileUser] = useState<CampusDirectoryUser | null>(null);

  // New user registration form
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
  const [newUserBranch, setNewUserBranch] = useState('Computer Science & Engineering');
  const [newUserYear, setNewUserYear] = useState('3rd Year');
  const [newUserBtId, setNewUserBtId] = useState('');
  const [newUserBio, setNewUserBio] = useState('');
  const [newUserSkills, setNewUserSkills] = useState('React, TypeScript, Python');
  const [newUserAvatar, setNewUserAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  );

  // Quick popular search names
  const popularPeerNames = [
    'Elena Rostova',
    'Bhavesh Joshi',
    'Priya Sharma',
    'David Kalu',
    'Marcus Vance',
    'Dr. Michael Chen',
    'Sneha Kulkarni',
    'Arjun Patel',
    'Devon Vance',
    'Maya Lin',
    'Rohan Deshmukh',
  ];

  // Incoming requests
  const incomingRequests = friends.filter((f) => f.status === 'pending_incoming');

  // Filtered directory list
  const filteredUsers = useMemo(() => {
    return campusDirectoryUsers.filter((u) => {
      // Search query match (name, skills, branch, bio, btId)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesBranch = u.branch.toLowerCase().includes(q);
        const matchesBio = (u.bio || '').toLowerCase().includes(q);
        const matchesBtId = (u.btId || '').toLowerCase().includes(q);
        const matchesSkills = u.skills.some((s) => s.toLowerCase().includes(q));

        if (!matchesName && !matchesBranch && !matchesBio && !matchesBtId && !matchesSkills) {
          return false;
        }
      }

      // Role filter
      if (selectedRole !== 'All') {
        if (selectedRole === 'student' && u.role !== 'student') return false;
        if (selectedRole === 'alumni' && u.role !== 'alumni') return false;
        if (selectedRole === 'mentor' && u.role !== 'mentor') return false;
      }

      // Branch filter
      if (selectedBranch !== 'All') {
        if (!u.branch.toLowerCase().includes(selectedBranch.toLowerCase())) {
          return false;
        }
      }

      // Online status
      if (onlyOnline && !u.isOnline) {
        return false;
      }

      // Connection status filter
      if (statusFilter !== 'all') {
        const conn = friends.find((f) => f.userId === u.id);
        if (statusFilter === 'friends') {
          return conn?.status === 'friend';
        }
        if (statusFilter === 'pending') {
          return conn?.status === 'pending_outgoing' || conn?.status === 'pending_incoming';
        }
        if (statusFilter === 'unconnected') {
          return !conn || conn.status === 'none';
        }
      }

      return true;
    });
  }, [campusDirectoryUsers, searchQuery, selectedRole, selectedBranch, onlyOnline, statusFilter, friends]);

  // Handle Start Private Chat
  const handleStartChat = (targetUser: CampusDirectoryUser) => {
    startDMWithUser(targetUser.id, {
      name: targetUser.name,
      avatar: targetUser.avatar,
      role: targetUser.role,
      branch: targetUser.branch,
      academicTrack: targetUser.academicTrack,
      bio: targetUser.bio,
    });
    if (onOpenDM) onOpenDM(targetUser.id);
  };

  // Handle register user
  const handleRegisterUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const skillsArray = newUserSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addCampusDirectoryUser({
      name: newUserName.trim(),
      role: newUserRole,
      branch: newUserBranch,
      academicTrack: `${newUserBranch} (${newUserYear})`,
      year: newUserYear,
      btId: newUserBtId.trim() || `BT23${newUserBranch.substring(0, 2).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
      avatar: newUserAvatar,
      bio: newUserBio.trim() || `Passionate ${newUserRole} at JDCOEM learning ${skillsArray.slice(0, 3).join(', ')}.`,
      skills: skillsArray.length > 0 ? skillsArray : ['Engineering', 'Coding'],
      isOnline: true,
      lastSeen: 'Active now',
      email: `${newUserName.toLowerCase().replace(/\s+/g, '.') || 'student'}@jdcoem.ac.in`,
      mutualFriendsCount: Math.floor(3 + Math.random() * 12),
    });

    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserBio('');
    setNewUserBtId('');
  };

  // Pre-fill user with current profile
  const handlePreFillCurrentProfile = () => {
    if (!currentUser) return;
    setNewUserName(currentUser.name);
    setNewUserRole(currentUser.role || 'student');
    setNewUserBranch(currentUser.branch || 'Computer Science & Engineering');
    setNewUserBtId(currentUser.btId || 'BT22CS099');
    setNewUserBio(currentUser.bio || 'JDCOEM developer and learner.');
    if (currentUser.avatar) setNewUserAvatar(currentUser.avatar);
  };

  // Highlight matched search text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={index}
              className="bg-amber-200 dark:bg-amber-900/60 text-slate-900 dark:text-amber-100 rounded-xs px-0.5"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
      {/* 1. Header & Search Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Find Classmates & Connect
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Search students, alumni mentors, and peers by their name to make friends and start 1-on-1 private chats.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handlePreFillCurrentProfile();
                setIsAddUserModalOpen(true);
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Join / Add Student</span>
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name (e.g. Elena, Bhavesh, Priya, Marcus), branch, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-xs md:text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular Name Quick Search Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Search Classmates:</span>
          </span>
          {popularPeerNames.map((name) => {
            const isSelected = searchQuery.toLowerCase() === name.toLowerCase();
            return (
              <button
                key={name}
                onClick={() => setSearchQuery(isSelected ? '' : name)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Segmented Control */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All Classmates
              </button>
              <button
                onClick={() => setStatusFilter('unconnected')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === 'unconnected'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Make Friends
              </button>
              <button
                onClick={() => setStatusFilter('friends')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === 'friends'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Connected ({friends.filter((f) => f.status === 'friend').length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Pending Requests
              </button>
            </div>

            {/* Department Dropdown */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="AI & Data Science">AI & Data Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="IoT">IoT & Robotics</option>
              <option value="Design">Design & UI/UX</option>
            </select>

            {/* Role Dropdown */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="All">All Roles</option>
              <option value="student">Students</option>
              <option value="alumni">Alumni</option>
              <option value="mentor">Mentors & Faculty</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* Online Only Toggle */}
            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyOnline}
                onChange={(e) => setOnlyOnline(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active Now</span>
              </span>
            </label>

            <span className="text-xs text-slate-500">
              Showing <strong className="text-slate-900 dark:text-white">{filteredUsers.length}</strong> peers
            </span>
          </div>
        </div>
      </div>

      {/* 2. Incoming Requests Alert Banner (if any) */}
      {incomingRequests.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs">
              <UserPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Incoming Friend Requests ({incomingRequests.length})</span>
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-400">
              Classmates who want to connect and chat with you
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-amber-900/40 shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={req.avatar}
                    alt={req.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-amber-400/50 shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {req.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate">{req.branch}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => acceptFriendRequest(req.userId)}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs transition-colors"
                    title="Accept Friend Request"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => declineFriendRequest(req.userId)}
                    className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 rounded-lg text-xs transition-colors"
                    title="Decline"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Main Results Grid */}
      {filteredUsers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No classmates found matching "{searchQuery}"
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try searching by first or last name, or try one of the popular names like "Elena", "Bhavesh", "Priya", or "David".
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBranch('All');
                setSelectedRole('All');
                setOnlyOnline(false);
                setStatusFilter('all');
              }}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
            <button
              onClick={() => {
                setNewUserName(searchQuery);
                setIsAddUserModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add "{searchQuery}" to Directory</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((peer) => {
            const existingConn = friends.find((f) => f.userId === peer.id);
            const isFriend = existingConn?.status === 'friend';
            const isPendingOut = existingConn?.status === 'pending_outgoing';
            const isPendingIn = existingConn?.status === 'pending_incoming';
            const isBlocked = existingConn?.status === 'blocked';

            return (
              <div
                key={peer.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all flex flex-col justify-between gap-4 group"
              >
                <div>
                  {/* Card Header: Avatar, Name, Role, Online Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center justify-center ${
                            peer.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                          title={peer.isOnline ? 'Online now' : `Last seen: ${peer.lastSeen || 'Offline'}`}
                        >
                          {peer.isOnline && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75"></span>}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{highlightMatch(peer.name, searchQuery)}</span>
                          {peer.role === 'mentor' && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold rounded-md">
                              Guide
                            </span>
                          )}
                        </h4>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize ${
                              peer.role === 'alumni'
                                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300'
                                : peer.role === 'mentor'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300'
                                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                            }`}
                          >
                            {peer.role}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {peer.year || 'Student'}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {peer.branch}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setViewingProfileUser(peer)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-md transition-colors"
                      title="View Student Details"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bio */}
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {highlightMatch(peer.bio, searchQuery)}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {peer.skills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => setSearchQuery(skill)}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition-colors"
                        title={`Filter by ${skill}`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>

                  {/* Meta info: BT ID & mutual count */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="font-mono">{peer.btId || 'JDCOEM Campus'}</span>
                    <span>{peer.mutualFriendsCount || 5} mutual peers</span>
                  </div>
                </div>

                {/* Card Action Buttons: Private Chat + Friend Connection */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  {/* Primary: 1-on-1 Private Chat Button */}
                  <button
                    onClick={() => handleStartChat(peer)}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    title={`Start private chat with ${peer.name}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Private Chat</span>
                  </button>

                  {/* Secondary: Friend Connection Action */}
                  {isFriend ? (
                    <div className="flex items-center gap-1">
                      <span className="px-2.5 py-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Friends</span>
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${peer.name} from friends?`)) {
                            removeFriend(peer.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Remove Friend"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : isPendingOut ? (
                    <button
                      onClick={() => cancelFriendRequest(peer.id)}
                      className="px-3 py-2 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 hover:bg-amber-100 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                      title="Click to cancel request"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Sent (Cancel)</span>
                    </button>
                  ) : isPendingIn ? (
                    <button
                      onClick={() => acceptFriendRequest(peer.id)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                  ) : isBlocked ? (
                    <span className="px-3 py-2 bg-rose-50 dark:bg-rose-950/60 text-rose-600 text-xs font-semibold rounded-xl">
                      Blocked
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        sendFriendRequest({
                          id: peer.id,
                          name: peer.name,
                          avatar: peer.avatar,
                          role: peer.role,
                          branch: peer.branch,
                          academicTrack: peer.academicTrack,
                          bio: peer.bio,
                        })
                      }
                      className="px-3 py-2 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add Friend</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Add / Register Student Profile Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Add Student to Campus Directory
                </h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterUserSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                    Fast-Fill My Current Profile
                  </span>
                  <span className="text-[11px] text-indigo-700 dark:text-indigo-400">
                    Use your authenticated student details ({currentUser?.name || 'Alex Rivera'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handlePreFillCurrentProfile}
                  className="px-2.5 py-1 bg-indigo-600 text-white text-[11px] font-semibold rounded-lg hover:bg-indigo-700"
                >
                  Use My Info
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova, Tanmay Verma"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Role
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="student">Student</option>
                    <option value="alumni">Alumni</option>
                    <option value="mentor">Peer Mentor / Faculty</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Year / Standing
                  </label>
                  <select
                    value={newUserYear}
                    onChange={(e) => setNewUserYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Branch / Department
                  </label>
                  <select
                    value={newUserBranch}
                    onChange={(e) => setNewUserBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="IoT & Robotics">IoT & Robotics</option>
                    <option value="Design & Interaction">Design & Interaction</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    BT ID / Roll Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BT22CS088"
                    value={newUserBtId}
                    onChange={(e) => setNewUserBtId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Python, Machine Learning, Docker"
                  value={newUserSkills}
                  onChange={(e) => setNewUserSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Short Bio / Academic Interests
                </label>
                <textarea
                  rows={3}
                  placeholder="What projects or topics are you focusing on this semester?"
                  value={newUserBio}
                  onChange={(e) => setNewUserBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Expanded Profile View Modal */}
      {viewingProfileUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="relative p-6 text-center border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewingProfileUser(null)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative inline-block mx-auto mb-3">
                <img
                  src={viewingProfileUser.avatar}
                  alt={viewingProfileUser.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                    viewingProfileUser.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                ></span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {viewingProfileUser.name}
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium capitalize mt-0.5">
                {viewingProfileUser.role} • {viewingProfileUser.academicTrack}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {viewingProfileUser.btId} • {viewingProfileUser.email || `${viewingProfileUser.id}@jdcoem.ac.in`}
              </p>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  About & Research
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {viewingProfileUser.bio}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Technical Skills & Tools
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {viewingProfileUser.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => {
                    handleStartChat(viewingProfileUser);
                    setViewingProfileUser(null);
                  }}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Start Private Chat</span>
                </button>
                <button
                  onClick={() => {
                    sendFriendRequest({
                      id: viewingProfileUser.id,
                      name: viewingProfileUser.name,
                      avatar: viewingProfileUser.avatar,
                      role: viewingProfileUser.role,
                      branch: viewingProfileUser.branch,
                      academicTrack: viewingProfileUser.academicTrack,
                      bio: viewingProfileUser.bio,
                    });
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Friend</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
