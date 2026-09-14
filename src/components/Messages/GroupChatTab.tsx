import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users2,
  Send,
  Code,
  Sparkles,
  Plus,
  Search,
  MoreVertical,
  Smile,
  Reply,
  Trash2,
  UserPlus,
  LogOut,
  Info,
  Check,
  CheckCheck,
  Lock,
  Globe,
  Hash,
  ShieldCheck,
  Crown,
  ChevronRight,
  Copy,
  X,
} from 'lucide-react';
import { ChatGroup, GroupMessage } from '../../types';
import { CreateGroupModal } from './CreateGroupModal';

const POPULAR_EMOJIS = ['👍', '❤️', '🔥', '🚀', '💡', '🎉'];

export const GroupChatTab: React.FC = () => {
  const {
    groups,
    groupMessages,
    activeGroupId,
    setActiveGroupId,
    sendGroupMessage,
    deleteGroupMessage,
    reactToGroupMessage,
    joinGroup,
    leaveGroup,
    deleteGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    friends,
    showToast,
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showGroupInfoDrawer, setShowGroupInfoDrawer] = useState(false);
  const [showAddMemberDropdown, setShowAddMemberDropdown] = useState(false);

  // Message input state
  const [inputText, setInputText] = useState('');
  const [includeCode, setIncludeCode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [replyingTo, setReplyingTo] = useState<GroupMessage | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active group
  const effectiveActiveGroupId = activeGroupId || (groups.length > 0 ? groups[0].id : null);
  const currentGroup = groups.find((g) => g.id === effectiveActiveGroupId) || groups[0] || null;

  const currentMessages: GroupMessage[] = currentGroup
    ? groupMessages[currentGroup.id] || []
    : [];

  const isUserMember = currentGroup?.members.some((m) => m.userId === 'user-101') ?? false;
  const isUserAdmin = currentGroup?.adminIds.includes('user-101') || currentGroup?.creatorId === 'user-101';

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, activeGroupId]);

  // Filter groups
  const filteredGroups = groups.filter((g) => {
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch =
      !q ||
      (g.name && g.name.toLowerCase().includes(q)) ||
      (g.description && g.description.toLowerCase().includes(q)) ||
      (g.category && g.category.toLowerCase().includes(q));
    const matchesCat = categoryFilter === 'all' || (g.category && g.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    return matchesSearch && matchesCat;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGroup) return;
    if (!inputText.trim() && !codeSnippet.trim()) return;

    sendGroupMessage(
      currentGroup.id,
      inputText.trim(),
      includeCode ? codeSnippet.trim() : undefined,
      replyingTo
        ? {
            messageId: replyingTo.id,
            senderName: replyingTo.senderName,
            text: replyingTo.text,
          }
        : undefined
    );

    setInputText('');
    setCodeSnippet('');
    setIncludeCode(false);
    setReplyingTo(null);
  };

  const copySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    showToast('Code copied to clipboard!');
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* LEFT: Groups List & Discovery Sidebar */}
      <div className="w-80 md:w-88 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
        {/* Search & Actions Header */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Campus Groups ({groups.length})</span>
            </h3>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Group</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat groups..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Quick Category Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
            {['all', 'project', 'hackathon', 'study'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-0.5 rounded-md font-semibold capitalize whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Groups List Stream */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredGroups.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Users2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">No groups matching "{searchQuery}"</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                + Create the first group
              </button>
            </div>
          ) : (
            filteredGroups.map((group) => {
              const isSelected = currentGroup?.id === group.id;
              const isMember = group.members.some((m) => m.userId === 'user-101');

              return (
                <div
                  key={group.id}
                  onClick={() => {
                    setActiveGroupId(group.id);
                    if (!isMember && !group.isPrivate) {
                      // auto select to preview
                    }
                  }}
                  className={`p-3 cursor-pointer transition-all flex items-start gap-3 relative ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800/90 border-l-4 border-emerald-500 shadow-xs'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Group Avatar Gradient */}
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${group.avatarColor} text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0`}
                  >
                    {group.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {group.name}
                        </span>
                        {group.isPrivate && (
                          <Lock className="w-3 h-3 text-amber-500 shrink-0" title="Private Group" />
                        )}
                      </div>
                      {group.lastMessage && (
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {group.lastMessage.timestamp}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {group.lastMessage
                        ? `${group.lastMessage.senderName}: ${group.lastMessage.text}`
                        : group.description}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium truncate">
                        {group.category} • {group.members.length} members
                      </span>

                      {!isMember && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Join &gt;
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT: Active Group Chat Window */}
      {currentGroup ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden relative">
          {/* WhatsApp style Chat Top Bar */}
          <div className="p-3 px-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setShowGroupInfoDrawer(!showGroupInfoDrawer)}
            >
              <div
                className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${currentGroup.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}
              >
                {currentGroup.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {currentGroup.name}
                  </h3>
                  {currentGroup.isPrivate ? (
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[10px] font-semibold flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      Private
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold flex items-center gap-0.5">
                      <Globe className="w-2.5 h-2.5" />
                      Public
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500">
                  {currentGroup.members.length} members • {currentGroup.category}
                </p>
              </div>
            </div>

            {/* Top Right Controls */}
            <div className="flex items-center gap-2">
              {!isUserMember ? (
                <button
                  onClick={() => joinGroup(currentGroup.id)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Users2 className="w-3.5 h-3.5" />
                  <span>Join Group</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowGroupInfoDrawer(!showGroupInfoDrawer)}
                  className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                    showGroupInfoDrawer
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Group Info & Members"
                >
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">Group Info</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Messages Scrollable Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40 dark:bg-slate-950/40">
            {/* Group Introduction Card */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-2 shadow-xs">
              <div
                className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${currentGroup.avatarColor} text-white flex items-center justify-center font-bold text-xl shadow-md`}
              >
                {currentGroup.name.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentGroup.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentGroup.description}
              </p>
              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
                <span>Created {currentGroup.createdAt}</span>
                <span>•</span>
                <span>{currentGroup.members.length} participants</span>
              </div>
            </div>

            {/* Messages List */}
            {currentMessages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="text-center my-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium border border-slate-300/60 dark:border-slate-700/60">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isMe = msg.senderId === 'user-101';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  {!isMe && (
                    <img
                      src={msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 border border-slate-200 dark:border-slate-700"
                    />
                  )}

                  {/* Message Bubble */}
                  <div className="max-w-[85%] sm:max-w-[70%] space-y-1">
                    {/* Sender Name for other members */}
                    {!isMe && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 pl-1">
                        <span>{msg.senderName}</span>
                        {msg.senderRole === 'admin' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 font-bold uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs relative shadow-xs ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-tr-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-xs'
                      }`}
                    >
                      {/* Reply Quoted Block */}
                      {msg.replyTo && (
                        <div
                          className={`mb-2 p-2 rounded-xl text-[11px] border-l-3 ${
                            isMe
                              ? 'bg-emerald-700/60 border-white text-emerald-100'
                              : 'bg-slate-100 dark:bg-slate-900/80 border-emerald-500 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <p className="font-bold text-[10px]">{msg.replyTo.senderName}</p>
                          <p className="truncate">{msg.replyTo.text}</p>
                        </div>
                      )}

                      {/* Main Message Text */}
                      {msg.text && (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {/* Code Snippet Attachment */}
                      {msg.codeSnippet && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 font-mono text-[11px]">
                          <div className="px-3 py-1.5 bg-slate-900 flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800">
                            <span className="flex items-center gap-1">
                              <Code className="w-3 h-3 text-emerald-400" />
                              <span>Code Snippet</span>
                            </span>
                            <button
                              onClick={() => copySnippet(msg.codeSnippet!)}
                              className="hover:text-white transition-colors flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </button>
                          </div>
                          <pre className="p-3 overflow-x-auto whitespace-pre">
                            {msg.codeSnippet}
                          </pre>
                        </div>
                      )}

                      {/* Timestamp & Status */}
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                          isMe ? 'text-emerald-200' : 'text-slate-400'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                      </div>

                      {/* Live Emoji Reactions on the Bubble */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5 pt-1 border-t border-black/10 dark:border-white/10">
                          {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <button
                              key={emoji}
                              onClick={() => reactToGroupMessage(currentGroup.id, msg.id, emoji)}
                              className={`px-1.5 py-0.5 rounded-full text-[11px] flex items-center gap-1 transition-transform active:scale-95 ${
                                users.includes('user-101')
                                  ? 'bg-emerald-500/30 text-white font-bold border border-emerald-400'
                                  : 'bg-black/10 dark:bg-white/10 text-slate-300'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span className="text-[10px]">{users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Hover Actions (Reply, React, Delete) */}
                    <div
                      className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isMe ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {/* Emoji Bar Picker */}
                      <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 rounded-full shadow-xs">
                        {POPULAR_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => reactToGroupMessage(currentGroup.id, msg.id, emoji)}
                            className="p-1 hover:scale-125 transition-transform text-xs"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                        title="Reply"
                      >
                        <Reply className="w-3.5 h-3.5" />
                      </button>

                      {(isMe || isUserAdmin) && (
                        <button
                          onClick={() => deleteGroupMessage(currentGroup.id, msg.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          {isUserMember ? (
            <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
              {/* Active Reply Banner */}
              {replyingTo && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <Reply className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold text-emerald-900 dark:text-emerald-200">
                        Replying to {replyingTo.senderName}:
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 truncate text-[11px]">
                        {replyingTo.text}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Code Snippet Input Box */}
              {includeCode && (
                <div className="space-y-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
                    <span className="font-mono flex items-center gap-1 text-emerald-400">
                      <Code className="w-3.5 h-3.5" />
                      <span>Attach Code Snippet</span>
                    </span>
                    <button
                      onClick={() => setIncludeCode(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="Paste code or algorithmic function here..."
                    className="w-full bg-slate-950 text-slate-200 font-mono text-xs p-2 rounded-lg border border-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Text Input Row */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIncludeCode(!includeCode)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    includeCode
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Attach code snippet"
                >
                  <Code className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${currentGroup.name}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !codeSnippet.trim()}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-xl shadow-xs transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-500">
                You are currently viewing {currentGroup.name} as a guest.
              </p>
              <button
                onClick={() => joinGroup(currentGroup.id)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
              >
                Join this Group to Chat
              </button>
            </div>
          )}

          {/* Members & Info Right Drawer */}
          {showGroupInfoDrawer && (
            <div className="absolute top-0 right-0 bottom-0 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-20 flex flex-col animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Group Information
                </h4>
                <button
                  onClick={() => setShowGroupInfoDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {/* Avatar & Title */}
                <div className="text-center space-y-2">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${currentGroup.avatarColor} text-white flex items-center justify-center font-bold text-2xl shadow-md`}
                  >
                    {currentGroup.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentGroup.name}
                  </h3>
                  <p className="text-xs text-slate-500">{currentGroup.description}</p>
                </div>

                {/* Info Pills */}
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {currentGroup.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Privacy</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {currentGroup.isPrivate ? 'Private' : 'Public'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Created by</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {currentGroup.creatorName}
                    </span>
                  </div>
                </div>

                {/* Members List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Participants ({currentGroup.members.length})
                    </h5>
                    {isUserAdmin && (
                      <button
                        onClick={() => setShowAddMemberDropdown(!showAddMemberDropdown)}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Add Member</span>
                      </button>
                    )}
                  </div>

                  {/* Add friend dropdown */}
                  {showAddMemberDropdown && (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-2 border border-slate-200 dark:border-slate-700">
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Select a friend to invite:
                      </p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {friends
                          .filter(
                            (f) =>
                              f.status === 'friend' &&
                              !currentGroup.members.some((m) => m.userId === f.userId)
                          )
                          .map((f) => (
                            <div
                              key={f.userId}
                              onClick={() => {
                                addMemberToGroup(currentGroup.id, {
                                  userId: f.userId,
                                  name: f.name,
                                  avatar: f.avatar,
                                });
                                setShowAddMemberDropdown(false);
                              }}
                              className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 cursor-pointer text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={f.avatar}
                                  alt={f.name}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {f.name}
                                </span>
                              </div>
                              <Plus className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Member items */}
                  <div className="space-y-2">
                    {currentGroup.members.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {member.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {member.role === 'admin' ? 'Group Admin' : 'Member'}
                            </p>
                          </div>
                        </div>

                        {member.role === 'admin' ? (
                          <span className="p-1 rounded-md bg-amber-500/10 text-amber-500">
                            <Crown className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          isUserAdmin &&
                          member.userId !== 'user-101' && (
                            <button
                              onClick={() =>
                                removeMemberFromGroup(currentGroup.id, member.userId)
                              }
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="Remove member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Group Action Buttons */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  {isUserMember && (
                    <button
                      onClick={() => leaveGroup(currentGroup.id)}
                      className="w-full py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Leave Group</span>
                    </button>
                  )}

                  {isUserAdmin && (
                    <button
                      onClick={() => deleteGroup(currentGroup.id)}
                      className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Group</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900">
          <Users2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Active Group Selected
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
            Select an existing team group from the left or create a new WhatsApp-style group to collaborate with friends.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Group</span>
          </button>
        </div>
      )}

      {/* Modal to Create Group */}
      {isCreateModalOpen && (
        <CreateGroupModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};
