import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { FriendConnection, DirectMessage } from '../../types';
import {
  MessageSquare,
  Send,
  Users2,
  UserCheck,
  UserPlus,
  ShieldAlert,
  ShieldBan,
  Search,
  Check,
  X,
  Sparkles,
  Code,
  User,
  Radio,
  Lock,
  Hash,
  Clock,
  MessagesSquare,
} from 'lucide-react';
import { GroupChatTab } from './GroupChatTab';

export const MessagesView: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    activeChannel,
    setActiveChannel,
    friends,
    directMessages,
    activeDMUserId,
    setActiveDMUserId,
    groups,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    removeFriend,
    blockUser,
    unblockUser,
    sendDirectMessage,
    openReportModal,
    setIsProfileEditModalOpen,
    showToast,
  } = useApp();

  const { user } = useAuth();

  // Navigation mode: 'groups' | 'dms' | 'friends' | 'channels' | 'blocked'
  const [activeTabMode, setActiveTabMode] = useState<'groups' | 'dms' | 'friends' | 'channels' | 'blocked'>('groups');

  // DM Input State
  const [dmInput, setDmInput] = useState<string>('');
  const [includeCodeSnippet, setIncludeCodeSnippet] = useState<boolean>(false);
  const [codeSnippetText, setCodeSnippetText] = useState<string>('');

  // Channel Input
  const [channelInput, setChannelInput] = useState<string>('');

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [directorySearch, setDirectorySearch] = useState<string>('');

  // Campus directory discovery dataset
  const campusDirectory = [
    {
      id: 'user-elena',
      name: 'Elena Rostova',
      role: 'alumni' as const,
      branch: 'Computer Science & Engineering',
      academicTrack: 'Distributed Systems & Cloud',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      bio: 'Senior Backend Engineer @ CloudScale. Available for mentorship and code reviews.',
      skills: ['Distributed Systems', 'Go', 'Kubernetes', 'gRPC'],
      isOnline: true,
    },
    {
      id: 'user-david',
      name: 'David Kalu',
      role: 'student' as const,
      branch: 'Information Technology',
      academicTrack: 'Full Stack & DevOps',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      bio: '3rd Year IT student passionate about React, TypeScript, and open source tooling.',
      skills: ['React', 'Next.js', 'PostgreSQL', 'Docker'],
      isOnline: true,
    },
    {
      id: 'user-priya',
      name: 'Priya Sharma',
      role: 'student' as const,
      branch: 'AI & Data Science',
      academicTrack: 'Deep Learning & NLP',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      bio: 'Working on LLM fine-tuning and transformer quantization research.',
      skills: ['PyTorch', 'Transformers', 'Python', 'FastAPI'],
      isOnline: false,
    },
    {
      id: 'user-marcus',
      name: 'Marcus Vance',
      role: 'student' as const,
      branch: 'Cybersecurity',
      academicTrack: 'Network Defense & Cryptography',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      bio: 'CTF enthusiast and pentesting explorer. Looking for freelance security audit gigs.',
      skills: ['Pen Testing', 'Network Security', 'Linux', 'Rust'],
      isOnline: true,
    },
    {
      id: 'user-mentor-chen',
      name: 'Dr. Michael Chen',
      role: 'alumni' as const,
      branch: 'Computer Science & Engineering',
      academicTrack: 'Algorithms & Computational Theory',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      bio: 'Faculty Lead and former principal researcher. Mentoring students on algorithmic proof systems.',
      skills: ['Algorithms', 'System Design', 'Compiler Optimization'],
      isOnline: true,
    },
  ];

  // Channels
  const studyChannels = [
    { id: 'study-group-cs2024', name: 'cs-2024-general', title: 'CS 2024 Study Group', members: 58 },
    { id: 'algorithms-grind', name: 'algorithms-and-dsa', title: 'LeetCode & DSA Discussion', members: 114 },
    { id: 'web-dev-freelance', name: 'web-dev-freelance', title: 'Freelance & Client Gigs', members: 89 },
    { id: 'ai-ml-research', name: 'ai-ml-compendium', title: 'AI & Deep Learning Sync', members: 72 },
  ];

  // Friends categories
  const activeFriends = friends.filter((f) => f.status === 'friend');
  const incomingRequests = friends.filter((f) => f.status === 'pending_incoming');
  const outgoingRequests = friends.filter((f) => f.status === 'pending_outgoing');
  const blockedFriends = friends.filter((f) => f.status === 'blocked');

  // Currently selected DM user
  const effectiveActiveUserId = activeDMUserId || (activeFriends.length > 0 ? activeFriends[0].userId : null);
  const currentDmPartner = friends.find((f) => f.userId === effectiveActiveUserId) || activeFriends[0] || null;

  // Active message stream
  const activeDmList: DirectMessage[] = currentDmPartner && directMessages[currentDmPartner.userId]
    ? directMessages[currentDmPartner.userId]
    : [];

  const handleSendDM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmInput.trim() && !codeSnippetText.trim()) return;
    if (!currentDmPartner) {
      showToast('Select a friend to start direct messaging');
      return;
    }

    sendDirectMessage(
      currentDmPartner.userId,
      dmInput.trim(),
      includeCodeSnippet ? codeSnippetText.trim() : undefined
    );

    setDmInput('');
    setCodeSnippetText('');
    setIncludeCodeSnippet(false);
  };

  const handleSendChannelMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelInput.trim()) return;
    sendChatMessage(channelInput.trim());
    setChannelInput('');
  };

  const currentChannelObj = studyChannels.find((c) => c.id === activeChannel) || studyChannels[0];

  return (
    <div
      id="messages-view"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden h-[calc(100vh-130px)] min-h-[580px] flex flex-col animate-in fade-in duration-200"
    >
      {/* Top Header Mode Bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTabMode('groups')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTabMode === 'groups'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <MessagesSquare className="w-3.5 h-3.5" />
            <span>Chat Groups</span>
            {groups.length > 0 && (
              <span className="px-1.5 py-0.2 bg-white/20 text-white text-[10px] rounded-full font-bold">
                {groups.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTabMode('dms')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTabMode === 'dms'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Messages</span>
            {activeFriends.some((f) => (f.unreadDMsCount || 0) > 0) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTabMode('friends')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTabMode === 'friends'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Friends & Directory</span>
            {incomingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] rounded-full font-bold">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTabMode('channels')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTabMode === 'channels'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Study Channels</span>
          </button>

          {blockedFriends.length > 0 && (
            <button
              onClick={() => setActiveTabMode('blocked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTabMode === 'blocked'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
              }`}
            >
              <ShieldBan className="w-3.5 h-3.5" />
              <span>Blocked ({blockedFriends.length})</span>
            </button>
          )}
        </div>

        {/* Profile Card Trigger */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setIsProfileEditModalOpen(true)}
            className="flex items-center gap-2 text-xs cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="hidden sm:block text-left">
              <span className="font-bold text-slate-900 dark:text-white block text-[11px] leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-emerald-500 font-medium">● {user.btId}</span>
            </div>
          </div>
          <button
            onClick={() => setIsProfileEditModalOpen(true)}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
          >
            <User className="w-3 h-3" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Mode 0: WhatsApp-style Group Chats */}
      {activeTabMode === 'groups' && <GroupChatTab />}

      {/* Mode 1: Direct Messages */}
      {activeTabMode === 'dms' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Direct Message Friends */}
          <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/60 dark:bg-slate-900/60">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter classmate chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Direct message contact list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {activeFriends.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 space-y-2">
                  <UserPlus className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No Connected Friends</p>
                  <p className="text-[11px]">Add classmates from the Friends directory to start chatting personally.</p>
                  <button
                    onClick={() => setActiveTabMode('friends')}
                    className="mt-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold text-xs"
                  >
                    Browse Students
                  </button>
                </div>
              ) : (
                activeFriends
                  .filter((f) =>
                    !searchQuery || (f.name && f.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((friend) => {
                    const isSelected = currentDmPartner?.userId === friend.userId;
                    const partnerMsgs = directMessages[friend.userId] || [];
                    const lastMsg = partnerMsgs[partnerMsgs.length - 1];

                    return (
                      <button
                        key={friend.id}
                        onClick={() => setActiveDMUserId(friend.userId)}
                        className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 relative ${
                          isSelected
                            ? 'bg-white dark:bg-slate-800 border border-indigo-500 shadow-xs'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                              friend.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          ></span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`text-xs font-bold truncate ${
                                isSelected
                                  ? 'text-indigo-600 dark:text-indigo-400'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {friend.name}
                            </h4>
                            <span className="text-[10px] text-slate-400">
                              {lastMsg?.timestamp || friend.lastSeen || 'Active'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {lastMsg?.text || `${friend.branch} • ${friend.academicTrack}`}
                          </p>
                        </div>

                        {(friend.unreadDMsCount || 0) > 0 && (
                          <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full">
                            {friend.unreadDMsCount}
                          </span>
                        )}
                      </button>
                    );
                  })
              )}
            </div>
          </aside>

          {/* Right Column: Active DM Chat Canvas */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            {currentDmPartner ? (
              <>
                {/* Chat Top Banner */}
                <div className="p-3.5 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/60">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={currentDmPartner.avatar}
                        alt={currentDmPartner.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                          currentDmPartner.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      ></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                          {currentDmPartner.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold capitalize">
                          {currentDmPartner.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {currentDmPartner.branch} • {currentDmPartner.academicTrack}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        openReportModal({
                          id: currentDmPartner.userId,
                          title: `Student User & Chat: ${currentDmPartner.name}`,
                          type: 'user',
                        })
                      }
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors text-xs flex items-center gap-1"
                      title="Report inappropriate user or message"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Report</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Block ${currentDmPartner.name}? They will no longer be able to message you.`)) {
                          blockUser(currentDmPartner.userId, currentDmPartner.name);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors text-xs flex items-center gap-1"
                      title="Block user"
                    >
                      <ShieldBan className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Block</span>
                    </button>
                  </div>
                </div>

                {/* Message Stream */}
                <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-slate-950/40">
                  <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl text-center text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    <span>Direct Message Channel • Campus Verified Peer Identity</span>
                  </div>

                  {activeDmList.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-500">
                      <p>Start a conversation with {currentDmPartner.name}!</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Discuss coursework, collaboration on freelance gigs, or share code snippets.
                      </p>
                    </div>
                  ) : (
                    activeDmList.map((msg) => {
                      const isMe = msg.isCurrentUser;
                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <img
                            src={msg.senderAvatar}
                            alt={msg.senderName}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {isMe ? 'You' : msg.senderName}
                              </span>
                              <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                            </div>

                            <div
                              className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                                isMe
                                  ? 'bg-indigo-600 text-white shadow-xs rounded-tr-xs'
                                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xs rounded-tl-xs'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.text}</p>

                              {msg.codeSnippet && (
                                <div className="mt-2 pt-2 border-t border-white/20 dark:border-slate-700">
                                  <div className="flex items-center justify-between text-[10px] mb-1 font-mono opacity-80">
                                    <span>Code Attachment:</span>
                                    <span>TypeScript / Python</span>
                                  </div>
                                  <pre className="p-2.5 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto">
                                    {msg.codeSnippet}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* DM Composer */}
                <form
                  onSubmit={handleSendDM}
                  className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
                >
                  {includeCodeSnippet && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-mono font-semibold text-indigo-400">
                          <Code className="w-3.5 h-3.5" /> Attach Code Snippet
                        </span>
                        <button
                          type="button"
                          onClick={() => setIncludeCodeSnippet(false)}
                          className="hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={codeSnippetText}
                        onChange={(e) => setCodeSnippetText(e.target.value)}
                        placeholder="Paste functions, schemas, or algorithms..."
                        className="w-full text-xs font-mono bg-transparent text-emerald-400 placeholder:text-slate-600 focus:outline-hidden resize-none"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIncludeCodeSnippet(!includeCodeSnippet)}
                      className={`p-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                        includeCodeSnippet
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                      }`}
                      title="Attach code snippet"
                    >
                      <Code className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      placeholder={`Send direct message to ${currentDmPartner.name}...`}
                      value={dmInput}
                      onChange={(e) => setDmInput(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
                    />

                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors active:scale-98"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
                <Users2 className="w-12 h-12 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Select a Classmate to Chat
                </h3>
                <p className="text-xs max-w-xs">
                  Connect with students and alumni from your department to exchange project insights.
                </p>
                <button
                  onClick={() => setActiveTabMode('friends')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                >
                  Explore Campus Directory
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Friends & Campus Directory */}
      {activeTabMode === 'friends' && (
        <div className="flex-1 p-6 overflow-y-auto space-y-8 bg-slate-50/50 dark:bg-slate-950/40">
          {/* Section 1: Incoming Friend Requests */}
          {incomingRequests.length > 0 && (
            <div className="p-5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
                <UserPlus className="w-4 h-4" />
                <span>Pending Incoming Friend Requests ({incomingRequests.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={req.avatar}
                        alt={req.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {req.name}
                        </h4>
                        <p className="text-[10px] text-slate-500">{req.role} • {req.branch}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => acceptFriendRequest(req.userId)}
                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => declineFriendRequest(req.userId)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-600 dark:text-slate-300 hover:text-rose-600 rounded-lg text-xs font-semibold"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Active Friends */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Connected Friends & Study Partners ({activeFriends.length})</span>
              </h3>
              <span className="text-xs text-slate-500">Peer Collaboration</span>
            </div>

            {activeFriends.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                You have no connected friends yet. Explore students in the directory below and send requests!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {activeFriends.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={f.avatar}
                            alt={f.name}
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                              f.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          ></span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {f.name}
                          </h4>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block capitalize">
                            {f.role}
                          </span>
                          <span className="text-[10px] text-slate-500">{f.branch}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setActiveDMUserId(f.userId);
                          setActiveTabMode('dms');
                        }}
                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Direct Chat</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove ${f.name} from friends?`)) {
                            removeFriend(f.userId);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                        title="Remove Friend"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Block ${f.name}?`)) {
                            blockUser(f.userId, f.name);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                        title="Block User"
                      >
                        <ShieldBan className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Campus Directory Discovery */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Campus Student & Alumni Directory</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Connect with peer developers and alumni mentors across engineering branches
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, skill, branch..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {campusDirectory
                .filter((p) => {
                  if (!directorySearch) return true;
                  const q = directorySearch.toLowerCase();
                  return (
                    (p.name && p.name.toLowerCase().includes(q)) ||
                    (p.skills && p.skills.some((s) => s && s.toLowerCase().includes(q))) ||
                    (p.branch && p.branch.toLowerCase().includes(q))
                  );
                })
                .map((peer) => {
                  const existingConn = friends.find((f) => f.userId === peer.id);
                  const isFriend = existingConn?.status === 'friend';
                  const isPendingOut = existingConn?.status === 'pending_outgoing';
                  const isBlocked = existingConn?.status === 'blocked';

                  return (
                    <div
                      key={peer.id}
                      className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-start gap-3 mb-2">
                          <img
                            src={peer.avatar}
                            alt={peer.name}
                            className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {peer.name}
                            </h4>
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block capitalize">
                              {peer.role} • {peer.academicTrack}
                            </span>
                            <span className="text-[10px] text-slate-400">{peer.branch}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                          {peer.bio}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {peer.skills.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Available
                        </span>

                        {isFriend ? (
                          <button
                            onClick={() => {
                              setActiveDMUserId(peer.id);
                              setActiveTabMode('dms');
                            }}
                            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-xl flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Chat</span>
                          </button>
                        ) : isPendingOut ? (
                          <button
                            onClick={() => cancelFriendRequest(peer.id)}
                            className="px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-xl"
                          >
                            Cancel Request
                          </button>
                        ) : isBlocked ? (
                          <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl">
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
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs active:scale-98 transition-transform"
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
          </div>
        </div>
      )}

      {/* Mode 3: Channels */}
      {activeTabMode === 'channels' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/60 dark:bg-slate-900/60">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-indigo-600" />
                <span>Campus Study Rooms</span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {studyChannels.map((ch) => {
                const isActive = activeChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 border border-indigo-500 shadow-xs'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        #{ch.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">{ch.title}</p>
                    </div>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {ch.members} peers
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            <div className="p-3.5 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/60">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{currentChannelObj.name}</span>
                </h3>
                <p className="text-[11px] text-slate-500">{currentChannelObj.title}</p>
              </div>
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {currentChannelObj.members} Active Online
              </span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30 dark:bg-slate-950/40">
              {chatMessages
                .filter((m) => m.channelId === activeChannel || m.senderRole === 'system')
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.isCurrentUser ? 'flex-row-reverse' : ''}`}
                  >
                    <img
                      src={
                        msg.senderAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                      }
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-indigo-500"
                    />
                    <div
                      className={`flex flex-col max-w-[80%] ${
                        msg.isCurrentUser ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      </div>
                      <div
                        className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                          msg.isCurrentUser
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <form
              onSubmit={handleSendChannelMsg}
              className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2"
            >
              <input
                type="text"
                placeholder={`Message #${currentChannelObj.name}...`}
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors active:scale-98"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mode 4: Blocked Users */}
      {activeTabMode === 'blocked' && (
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="p-4 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center gap-3">
            <ShieldBan className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            <div className="text-xs">
              <h3 className="font-bold text-rose-900 dark:text-rose-300">
                Blocked Students & Restricted Contacts
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Blocked users cannot view your online presence, send friend requests, or exchange direct messages with you.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {blockedFriends.map((blocked) => (
              <div
                key={blocked.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={blocked.avatar}
                    alt={blocked.name}
                    className="w-10 h-10 rounded-full object-cover grayscale"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {blocked.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">{blocked.branch}</span>
                  </div>
                </div>

                <button
                  onClick={() => unblockUser(blocked.userId)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
