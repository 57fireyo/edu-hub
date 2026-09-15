import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  BookOpen,
  FileText,
  PlayCircle,
  Download,
  Bookmark,
  BookmarkCheck,
  Star,
  Heart,
  Eye,
  ShieldAlert,
  MessageSquare,
  Send,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';

export const ResourceViewerModal: React.FC = () => {
  const {
    viewingResource,
    setViewingResource,
    toggleSaveResource,
    toggleLikeResource,
    incrementResourceViews,
    openReportModal,
    addReview,
    showToast,
    resources,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'content' | 'reviews'>('content');
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState<string>('');

  // Find up-to-date resource from list
  const currentResource = viewingResource
    ? resources.find((r) => r.id === viewingResource.id) || viewingResource
    : null;

  useEffect(() => {
    if (viewingResource) {
      incrementResourceViews(viewingResource.id);
    }
  }, [viewingResource?.id]);

  if (!currentResource) return null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please enter your review feedback');
      return;
    }
    addReview(currentResource.id, 'resource', userRating, reviewComment.trim());
    setReviewComment('');
  };

  const reviewsList = currentResource.reviews || [];

  return (
    <div
      id="resource-viewer-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="resource-viewer-card"
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-6 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-semibold uppercase tracking-wider rounded-md">
              {currentResource.category}
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>{currentResource.views || `${currentResource.viewCount || 1} views`}</span>
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">{currentResource.rating}</span>
              <span>({reviewsList.length} reviews)</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Like Button */}
            <button
              onClick={() => toggleLikeResource(currentResource.id)}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
                currentResource.isLiked
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600'
              }`}
              title="Like this material"
            >
              <Heart
                className={`w-4 h-4 ${currentResource.isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
              />
              <span>{currentResource.likesCount || 0}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleSaveResource(currentResource.id)}
              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Bookmark"
            >
              {currentResource.saved ? (
                <BookmarkCheck className="w-5 h-5 fill-current" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>

            {/* Report Content */}
            <button
              onClick={() =>
                openReportModal({
                  id: currentResource.id,
                  title: currentResource.title,
                  type: 'resource',
                })
              }
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              title="Report inappropriate or broken material"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={() => setViewingResource(null)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher: Material View vs Reviews */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'content'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Document & Extract</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Peer Reviews & Ratings ({reviewsList.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex-1">
          {activeTab === 'content' ? (
            <>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">
                  {currentResource.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    By {currentResource.author} • {currentResource.authorRole}
                  </span>
                  <span>•</span>
                  <span>
                    {currentResource.type === 'pdf'
                      ? `PDF Compendium (${currentResource.pages || 80} Pages, ${currentResource.size || '5MB'})`
                      : `Video Lecture (${currentResource.duration || '45m'})`}
                  </span>
                </div>
              </div>

              {/* Video Preview or Document Banner */}
              {currentResource.type === 'Video Lectures' || currentResource.videoUrl ? (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800 shadow-md">
                    {currentResource.videoUrl?.includes('youtube.com') || currentResource.videoUrl?.includes('youtu.be') ? (
                      <iframe
                        src={currentResource.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                        title={currentResource.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
                        <PlayCircle className="w-16 h-16 text-indigo-500 mb-2" />
                        <h4 className="text-sm font-bold text-white mb-1">
                          Lecture Video Stream Ready
                        </h4>
                        <p className="text-xs text-slate-400 max-w-sm mb-4">
                          Instructed by {currentResource.uploaderName || currentResource.author}. Duration: {currentResource.videoDuration || '45m'}
                        </p>
                        <a
                          href={currentResource.videoUrl || currentResource.url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Launch Fullscreen Player</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Video Timestamps & Chapter Markers */}
                  {currentResource.videoTimestamps && currentResource.videoTimestamps.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Interactive Lecture Chapters & Timestamp Markers</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentResource.videoTimestamps.map((ts, idx) => (
                          <div
                            key={idx}
                            onClick={() => showToast(`Skipping video playback to ${ts.time} (${ts.label})`)}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 cursor-pointer transition-colors text-xs"
                          >
                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950">
                              {ts.time}
                            </span>
                            <span className="text-slate-800 dark:text-slate-200 truncate">
                              {ts.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-indigo-50/50 dark:bg-slate-800/60 rounded-xl border border-indigo-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-xs">
                      <FileText className="w-4 h-4" />
                      <span>Verified Academic Summary • {currentResource.academicYear || 'All Years'} • {currentResource.subjectCode || 'General'}</span>
                    </div>
                    {currentResource.fileSize && (
                      <span className="text-[11px] font-mono text-slate-500 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {currentResource.fileSize} • {currentResource.pageCount || 24} Pages
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {currentResource.description}
                  </p>
                  {(currentResource.fileUrl || currentResource.url) && (
                    <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {currentResource.fileName || `${currentResource.title}.pdf`}
                      </span>
                      <a
                        href={currentResource.fileUrl || currentResource.url || "https://slosofqdfxelmonorspt.supabase.co/storage/v1/object/public/BHAVESH%20RAVINDRA%20DHAWALE/dsa%20all%20practicals.pdf"}
                        download="academic-compendium.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>Download PDF</span>
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Snippet / Notes Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Syllabus Extracts & Code Theorems
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Read-only preview</span>
                </div>
                <div className="p-4 bg-slate-950 text-slate-300 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                  <pre className="whitespace-pre-wrap">
                    {currentResource.markdownContent ||
                      currentResource.contentSnippet ||
                      'Key architectural patterns, proofs, and syntax diagrams published for this semester.'}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            /* Peer Reviews Tab */
            <div className="space-y-6">
              {/* Rating Summary Bar */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                    <span>{currentResource.rating}</span>
                    <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(currentResource.rating)
                              ? 'fill-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Based on {reviewsList.length} verified student reviews
                    </span>
                  </div>
                </div>
              </div>

              {/* Write Review Form */}
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Write Your Academic Review & Feedback</span>
                </h3>

                {/* Star Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (hoverRating ?? userRating)
                              ? 'fill-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {userRating} Stars
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How did this material help with your assignments or exam prep? Mention specific chapters..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Student & Alumni Feedback ({reviewsList.length})
                </h3>

                {reviewsList.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    No reviews yet. Be the first student to review this material!
                  </p>
                ) : (
                  reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.userName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            • {rev.userRole}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= rev.rating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 ml-1">{rev.createdAt}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 pl-8 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Resource link copied to clipboard!');
                }
              }}
              className="p-2 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Share resource"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-500">
              Verified Academic Compendium • EduHub
            </span>
          </div>

          <a
            href={currentResource?.downloadUrl || currentResource?.fileUrl || "https://slosofqdfxelmonorspt.supabase.co/storage/v1/object/public/BHAVESH%20RAVINDRA%20DHAWALE/dsa%20all%20practicals.pdf"}
            download="academic-compendium.pdf"
            target="_blank"
            rel="noreferrer"
          >
            <button
              type="button"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};
