import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LiveClass } from '../../types';
import {
  Tv,
  Users2,
  Clock,
  PlayCircle,
  MessageSquare,
  Sparkles,
  Download,
  Share2,
  Hand,
  CheckCircle2,
  Search,
  Star,
  Heart,
  ShieldAlert,
  Flame,
  X,
  Send,
  Eye,
  Filter,
} from 'lucide-react';

export const LiveClassesView: React.FC = () => {
  const {
    liveClasses,
    toggleLikeLiveClass,
    incrementLiveClassViews,
    addReview,
    openReportModal,
    showToast,
  } = useApp();

  const [activeStreamId, setActiveStreamId] = useState<string>(liveClasses[0]?.id || 'class-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'all' | 'live' | 'popular' | 'rating' | 'likes'>('all');
  const [raisedHand, setRaisedHand] = useState(false);
  const [activePlayerTab, setActivePlayerTab] = useState<'chat' | 'reviews'>('chat');

  // Chat State
  const [streamComment, setStreamComment] = useState('');
  const [comments, setComments] = useState<Array<{ user: string; text: string; time: string }>>([
    { user: 'Sarah Jenkins', text: 'Protocol buffers reduce network payload by over 60% compared to REST JSON!', time: '18:02' },
    { user: 'Alex Rivera', text: 'Can we inspect how the Docker healthcheck probe binds with Kubernetes liveness?', time: '18:04' },
    { user: 'Dr. Chen', text: 'Yes, David is about to show the multi-stage Dockerfile definition on line 24.', time: '18:05' },
    { user: 'Elena Rostova', text: 'The binary gRPC wire protocol handles multiplexed bidirectional streams seamlessly!', time: '18:08' },
  ]);

  // Review State for Live Class
  const [classRating, setClassRating] = useState<number>(5);
  const [classReviewComment, setClassReviewComment] = useState<string>('');

  const activeStream = liveClasses.find((c) => c.id === activeStreamId) || liveClasses[0];

  const categories = ['All', 'Backend', 'Algorithms', 'Career', 'System Design', 'Frontend'];

  // Search and Filtering
  const filtered = liveClasses.filter((cls) => {
    const matchesCat = categoryFilter === 'All' || cls.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSortTab = sortBy === 'live' ? cls.isLiveNow : true;
    return matchesCat && matchesQuery && matchesSortTab;
  });

  // Sorting
  const sortedClasses = [...filtered].sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.attendeesCount || b.viewCount || 0) - (a.attendeesCount || a.viewCount || 0);
    }
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'likes') {
      return (b.likesCount || 0) - (a.likesCount || 0);
    }
    return 0;
  });

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        user: 'You',
        text: streamComment.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setStreamComment('');
  };

  const handleClassReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classReviewComment.trim()) {
      showToast('Please enter your review feedback');
      return;
    }
    addReview(activeStream.id, 'live-class', classRating, classReviewComment.trim());
    setClassReviewComment('');
  };

  const currentReviews = activeStream.reviews || [];

  return (
    <div id="live-classes-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Active Live Stream Player */}
      <div className="bg-slate-950 text-white rounded-2xl overflow-hidden shadow-xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12">
        {/* Stream Canvas (Span 8) */}
        <div className="lg:col-span-8 bg-slate-950 flex flex-col justify-between relative min-h-[380px] sm:min-h-[480px]">
          {/* Top Stream Overlay */}
          <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent z-10">
            <div className="flex items-center gap-2 flex-wrap">
              {activeStream.isLiveNow ? (
                <span className="bg-rose-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  LIVE NOW
                </span>
              ) : (
                <span className="bg-slate-800 text-slate-300 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                  RECORDED MASTERCLASS
                </span>
              )}
              <span className="text-xs font-medium text-slate-200 bg-black/60 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                <Users2 className="w-3 h-3 text-indigo-400" />
                <span>{activeStream.attendeesCount} Students Attending</span>
              </span>
              <span className="text-xs font-medium text-amber-400 bg-black/60 px-3 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{activeStream.rating} ({currentReviews.length} reviews)</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Like Button */}
              <button
                onClick={() => toggleLikeLiveClass(activeStream.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeStream.isLiked
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                title="Like this lecture"
              >
                <Heart className={`w-3.5 h-3.5 ${activeStream.isLiked ? 'fill-white' : ''}`} />
                <span>{activeStream.likesCount || 0}</span>
              </button>

              {/* Hand Raise */}
              <button
                onClick={() => {
                  setRaisedHand(!raisedHand);
                  showToast(raisedHand ? 'Hand lowered' : 'Hand raised! Instructor notified for Q&A queue.');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                  raisedHand
                    ? 'bg-amber-400 text-slate-900 shadow-xs'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span>{raisedHand ? 'Hand Raised' : 'Raise Hand'}</span>
              </button>

              {/* Report Stream */}
              <button
                onClick={() =>
                  openReportModal({
                    id: activeStream.id,
                    title: activeStream.title,
                    type: 'live-class',
                  })
                }
                className="p-1.5 bg-white/10 hover:bg-rose-600/80 rounded-xl text-slate-300 hover:text-white transition-colors"
                title="Report live class session"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stream Video Center Simulator */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
            <div
              onClick={() => {
                incrementLiveClassViews(activeStream.id);
                showToast(`Streaming ${activeStream.title} in 1080p HD`);
              }}
              className="w-20 h-20 rounded-full bg-indigo-600/40 border border-indigo-400/50 flex items-center justify-center mb-3 animate-pulse cursor-pointer hover:scale-105 transition-transform shadow-lg"
            >
              <PlayCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white max-w-xl mb-1.5 tracking-tight">
              {activeStream.title}
            </h2>
            <p className="text-xs text-slate-300 max-w-lg mb-2">
              {activeStream.summary}
            </p>
            <p className="text-xs text-slate-400">
              Instructor: <span className="font-semibold text-white">{activeStream.instructor}</span> •{' '}
              {activeStream.instructorRole}
            </p>
          </div>

          {/* Bottom Stream Controls */}
          <div className="p-4 bg-gradient-to-t from-black/90 to-transparent flex flex-wrap justify-between items-center z-10 text-xs gap-3">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                1080p HD 60fps
              </span>
              <span className="text-slate-400">• Low Latency Audio</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Lecture companion handout downloaded (.pdf)')}
                className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1 text-white font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Slides & Code</span>
              </button>
            </div>
          </div>

          {/* Background Poster Overlay */}
          <img
            src={activeStream.thumbnail}
            alt={activeStream.title}
            className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
          />
        </div>

        {/* Right Side: Tabbed Interactive Chat & Reviews (Span 4) */}
        <div className="lg:col-span-4 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-[480px]">
          {/* Tabs */}
          <div className="p-2 bg-slate-950 border-b border-slate-800 flex gap-2">
            <button
              onClick={() => setActivePlayerTab('chat')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activePlayerTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Q&A</span>
            </button>
            <button
              onClick={() => setActivePlayerTab('reviews')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activePlayerTab === 'reviews'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Reviews ({currentReviews.length})</span>
            </button>
          </div>

          {activePlayerTab === 'chat' ? (
            /* Live Chat Panel */
            <>
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs font-sans">
                {comments.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-semibold text-indigo-300 text-[11px]">{c.user}</span>
                      <span className="text-[9px] text-slate-500">{c.time}</span>
                    </div>
                    <p className="text-slate-200 text-xs leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendComment} className="p-2.5 bg-slate-900 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask instructor a question..."
                  value={streamComment}
                  onChange={(e) => setStreamComment(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            /* Lecture Reviews Panel */
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs flex flex-col justify-between">
              <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
                {currentReviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    No reviews yet for this live masterclass.
                  </p>
                ) : (
                  currentReviews.map((rev) => (
                    <div key={rev.id} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-300 text-xs">{rev.userName}</span>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-2.5 h-2.5 ${
                                s <= rev.rating ? 'fill-amber-400' : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Review input */}
              <form onSubmit={handleClassReviewSubmit} className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">Rate this class:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setClassRating(star)}
                        className="text-amber-400 p-0.5"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            star <= classRating ? 'fill-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Feedback for instructor..."
                    value={classReviewComment}
                    onChange={(e) => setClassReviewComment(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl"
                  >
                    Rate
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Discovery, Search & Filtering Hub */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="live-class-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search live classes, guest instructors, microservices, dynamic programming..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter & Sort Options */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setSortBy('all')}
              className={`px-2.5 py-1 rounded-md font-medium ${
                sortBy === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSortBy('live')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 ${
                sortBy === 'live'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Live Now</span>
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 ${
                sortBy === 'popular'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Most Watched</span>
            </button>
            <button
              onClick={() => setSortBy('likes')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 ${
                sortBy === 'likes'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Heart className="w-3 h-3 text-rose-500" />
              <span>Most Liked</span>
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 ${
                sortBy === 'rating'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>Top Rated</span>
            </button>
          </div>
        </div>
      </div>

      {/* Class Schedule Grid */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Upcoming Schedule & Masterclasses ({sortedClasses.length})
          </h2>
          <span className="text-xs text-slate-500">Live Campus Interactive Streaming</span>
        </div>

        {sortedClasses.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Tv className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching live classes found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try changing your search terms or category selection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedClasses.map((cls) => (
              <div
                key={cls.id}
                onClick={() => {
                  setActiveStreamId(cls.id);
                  incrementLiveClassViews(cls.id);
                  showToast(`Switched stream to: ${cls.title}`);
                }}
                className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col group shadow-xs relative ${
                  activeStream.id === cls.id
                    ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                <div className="h-40 relative overflow-hidden">
                  <img
                    src={cls.thumbnail}
                    alt={cls.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>

                  {/* Top Left Status & Most Watched badge */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    {cls.isLiveNow ? (
                      <span className="bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        LIVE NOW
                      </span>
                    ) : (
                      <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                        {cls.date} • {cls.time}
                      </span>
                    )}

                    {(cls.attendeesCount || cls.viewCount || 0) >= 300 && (
                      <span className="bg-amber-500 text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" />
                        Most Watched
                      </span>
                    )}
                  </div>

                  {/* Top Right Action: Report */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openReportModal({
                        id: cls.id,
                        title: cls.title,
                        type: 'live-class',
                      });
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors z-10"
                    title="Report session"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1 gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {cls.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{cls.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({cls.reviews?.length ?? cls.reviewsCount ?? 0})
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {cls.title}
                  </h3>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {cls.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 mt-auto">
                    <span className="truncate max-w-[130px] font-medium">
                      {cls.instructor}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Users2 className="w-3 h-3" />
                        <span>{cls.attendeesCount}</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeLiveClass(cls.id);
                        }}
                        className={`flex items-center gap-1 transition-colors ${
                          cls.isLiked ? 'text-rose-600 font-semibold' : 'text-slate-400 hover:text-rose-600'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${cls.isLiked ? 'fill-rose-500' : ''}`} />
                        <span>{cls.likesCount || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
