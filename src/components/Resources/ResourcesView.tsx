import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ResourceItem, ResourceType } from '../../types';
import { Breadcrumb } from '../Navigation/Breadcrumb';
import { ManageAcademicStructureModal } from './ManageAcademicStructureModal';
import { AddAcademicResourceModal } from './AddAcademicResourceModal';
import {
  BookOpen,
  FileText,
  PlayCircle,
  Bookmark,
  BookmarkCheck,
  Search,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
  Eye,
  Star,
  Globe,
  PlusCircle,
  Crown,
  Trash2,
  Lock,
  Heart,
  ShieldAlert,
  Download,
  Settings2,
  Video,
  Code2,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const {
    resources,
    academicSubjects,
    academicBranches,
    academicYears,
    resourceCategoryFilter,
    setResourceCategoryFilter,
    toggleSaveResource,
    toggleLikeResource,
    setViewingResource,
    openReportModal,
    setActiveTab,
    isOwner,
    deleteResource,
    setIsSecretOwnerModalOpen,
    showToast,
  } = useApp();

  // Sequential Hierarchy Filters
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<'all' | ResourceType>('all');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'likes' | 'newest'>('popular');
  const [onlySaved, setOnlySaved] = useState<boolean>(false);

  // Modals state
  const [isStructureModalOpen, setIsStructureModalOpen] = useState<boolean>(false);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState<boolean>(false);

  // Subjects filtered by current year & branch selection
  const availableSubjects = useMemo(() => {
    return academicSubjects.filter((subj) => {
      const yearMatch = selectedYear === 'All' || subj.academicYear === selectedYear;
      const branchMatch = selectedBranch === 'All' || subj.branch === selectedBranch;
      return yearMatch && branchMatch;
    });
  }, [academicSubjects, selectedYear, selectedBranch]);

  // Overall filtering
  const filtered = resources.filter((item) => {
    // Academic hierarchy matching
    const matchesYear = selectedYear === 'All' || item.academicYear === selectedYear;
    const matchesBranch = selectedBranch === 'All' || item.branch === selectedBranch;
    const matchesSubject = selectedSubject === 'All' || item.subjectCode === selectedSubject;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesSaved = !onlySaved || item.saved;

    // Search text query
    const query = localSearch.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (item.title && item.title.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.subjectCode && item.subjectCode.toLowerCase().includes(query)) ||
      (item.author && item.author.toLowerCase().includes(query)) ||
      (item.tags && item.tags.some((t) => t && t.toLowerCase().includes(query)));

    return matchesYear && matchesBranch && matchesSubject && matchesType && matchesSaved && matchesSearch;
  });

  // Sorting
  const sortedResources = [...filtered].sort((a, b) => {
    if (sortBy === 'popular') return (b.viewCount || 0) - (a.viewCount || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'likes') return (b.likesCount || 0) - (a.likesCount || 0);
    return 0;
  });

  // Breadcrumb items calculation
  const breadcrumbItems = [
    { label: 'Resources' },
    ...(selectedYear !== 'All' ? [{ label: selectedYear, onClick: () => { setSelectedBranch('All'); setSelectedSubject('All'); } }] : []),
    ...(selectedBranch !== 'All' ? [{ label: `Branch ${selectedBranch}`, onClick: () => setSelectedSubject('All') }] : []),
    ...(selectedSubject !== 'All' ? [{ label: selectedSubject }] : []),
  ];

  return (
    <div id="resources-view" className="space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Explicit Breadcrumb Navigation */}
      <Breadcrumb category="Academic Portal" items={breadcrumbItems} />

      {/* Owner Mode Interactive Academic Control Toolbar */}
      {isOwner ? (
        <div
          id="owner-academic-control-toolbar"
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-amber-500/5 border border-amber-400/40 dark:border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Owner Academic Control Center
                </h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Add, edit, or configure course subjects (e.g. DSA, CAN, ISE), branch curricula, and upload verified study material.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="owner-manage-structure-btn"
              onClick={() => setIsStructureModalOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Manage Academic Structure</span>
            </button>

            <button
              id="owner-upload-material-btn"
              onClick={() => setIsAddResourceModalOpen(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Upload Course Material</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Academic Curriculum Repository
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Browse verified lecture notes, laboratory PDFs, and video sessions across all 4 engineering years.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddResourceModalOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Contribute Material</span>
            </button>

            <button
              onClick={() => setIsSecretOwnerModalOpen(true)}
              className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg transition-colors"
              title="Owner Mode Login"
            >
              <Crown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sequential Filter Architecture */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        {/* Level 1: Year Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>1. Select Academic Year</span>
            </span>
            {selectedYear !== 'All' && (
              <button
                onClick={() => setSelectedYear('All')}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Reset Year
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', ...academicYears].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedYear === yr
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {yr === 'All' ? 'All Years' : yr}
              </button>
            ))}
          </div>
        </div>

        {/* Level 2: Engineering Branch Selector */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              <span>2. Engineering Branch Department</span>
            </span>
            {selectedBranch !== 'All' && (
              <button
                onClick={() => setSelectedBranch('All')}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Reset Branch
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['All', ...academicBranches.map((b) => b.code)].map((bCode) => {
              const fullBranch = academicBranches.find((b) => b.code === bCode);
              return (
                <button
                  key={bCode}
                  onClick={() => setSelectedBranch(bCode)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedBranch === bCode
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={fullBranch?.name || 'All Branches'}
                >
                  {bCode === 'All' ? 'All Branches' : bCode}
                </button>
              );
            })}
          </div>
        </div>

        {/* Level 3: Subject Selection (DSA, CAN, ISE, etc.) */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>3. Course Subject (e.g. DSA, CAN, ISE)</span>
            </span>
            {isOwner && (
              <button
                onClick={() => setIsStructureModalOpen(true)}
                className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Add Subject</span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedSubject('All')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedSubject === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Subjects
            </button>
            {availableSubjects.map((subj) => (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.code)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedSubject === subj.code
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="font-mono">{subj.code}</span>
                <span className="font-normal text-[11px] opacity-80 hidden sm:inline truncate max-w-[120px]">
                  {subj.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Level 4: Search Bar & Format Tabs */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Format Tabs */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Formats', icon: Layers },
              { id: 'Notes', label: 'PDFs & Notes', icon: FileText },
              { id: 'Video Lectures', label: 'Video Lectures', icon: Video },
              { id: 'Articles', label: 'Code & Snippets', icon: Code2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = typeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Sort */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes, DSA, unit tests..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={() => setOnlySaved(!onlySaved)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                onlySaved
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title="Show Bookmarked Only"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Resources Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Course Material Library
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {sortedResources.length} items
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-700 dark:text-slate-300 font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>
        </div>

        {sortedResources.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No course materials found for this selection
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your Year, Branch, or Subject filters, or upload a new resource.
            </p>
            <button
              onClick={() => setIsAddResourceModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Resource Here</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedResources.map((item) => (
              <article
                key={item.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/90 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all shadow-xs hover:shadow-md flex flex-col overflow-hidden"
              >
                {/* Visual Top Banner */}
                <div className="p-4 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-50 dark:to-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-indigo-600 text-white shadow-xs">
                        {item.subjectCode || 'DSA'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {item.academicYear || '2nd Year'} • {item.branch || 'CY'}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                      {item.type === 'Video Lectures' ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      <span>{item.type}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isOwner && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${item.title}"?`)) {
                            deleteResource(item.id);
                            showToast(`Deleted resource: ${item.title}`);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Material (Owner Mode)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveResource(item.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {item.saved ? (
                        <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => setViewingResource(item)}
                      className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer line-clamp-2"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Format details pill */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      {item.type === 'Video Lectures' ? (
                        <span className="font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1">
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>{item.videoDuration || item.duration || '45 min'}</span>
                        </span>
                      ) : (
                        <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{item.fileSize || `${item.pageCount || 24} Pages`}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{item.rating || 5.0}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeResource(item.id);
                      }}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                        item.isLiked
                          ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 font-bold'
                          : 'text-slate-500 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.isLiked ? 'fill-rose-500' : ''}`} />
                      <span>{item.likesCount || 0}</span>
                    </button>

                    <button
                      onClick={() => setViewingResource(item)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs active:scale-98 cursor-pointer"
                    >
                      <span>{item.type === 'Video Lectures' ? 'Watch Lecture' : 'Open Material'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      <ManageAcademicStructureModal
        isOpen={isStructureModalOpen}
        onClose={() => setIsStructureModalOpen(false)}
      />

      <AddAcademicResourceModal
        isOpen={isAddResourceModalOpen}
        onClose={() => setIsAddResourceModalOpen(false)}
        defaultYear={selectedYear !== 'All' ? selectedYear : '2nd Year'}
        defaultBranch={selectedBranch !== 'All' ? selectedBranch : 'CY'}
        defaultSubject={selectedSubject !== 'All' ? selectedSubject : 'DSA'}
      />
    </div>
  );
};
