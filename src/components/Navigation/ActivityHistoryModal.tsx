import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityHistoryItem, ActivityHistoryType } from '../../types';
import {
  History,
  X,
  Download,
  Code2,
  Tv,
  Trash2,
  ExternalLink,
  Clock,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';

export const ActivityHistoryModal: React.FC = () => {
  const {
    isHistoryModalOpen,
    setIsHistoryModalOpen,
    activityHistory,
    clearActivityHistory,
    setActiveTab,
    setViewingResource,
    resources,
    showToast,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isHistoryModalOpen) return null;

  const filteredHistory = activityHistory.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getIconForType = (type: ActivityHistoryType) => {
    switch (type) {
      case 'download':
        return <Download className="w-4 h-4 text-emerald-500" />;
      case 'code_execution':
        return <Code2 className="w-4 h-4 text-indigo-500" />;
      case 'live_class':
        return <Tv className="w-4 h-4 text-rose-500" />;
      default:
        return <History className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBadgeForType = (type: ActivityHistoryType) => {
    switch (type) {
      case 'download':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            Downloaded PDF
          </span>
        );
      case 'code_execution':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
            Compiler Execution
          </span>
        );
      case 'live_class':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
            Class Attended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="activity-history-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsHistoryModalOpen(false)}
    >
      <div
        id="activity-history-modal-content"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Learning & Activity History</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {activityHistory.length} total
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your downloaded academic materials, compiler executions & masterclasses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activityHistory.length > 0 && (
              <button
                type="button"
                onClick={clearActivityHistory}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear all recorded history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsHistoryModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3 sm:px-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Events ({activityHistory.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('download')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                filterType === 'download'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Download className="w-3 h-3" />
              <span>Downloads</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('code_execution')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                filterType === 'code_execution'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Code Executions</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('live_class')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                filterType === 'live_class'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Tv className="w-3 h-3" />
              <span>Classes</span>
            </button>
          </div>

          <div className="w-full sm:w-48">
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* History Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <History className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                No activity history found
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Download a study resource, run a program in Compile & Collab, or join a live class to start populating your track record.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex items-start justify-between gap-3 shadow-2xs group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-100 dark:border-slate-700 shrink-0 mt-0.5">
                    {getIconForType(item.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      {getBadgeForType(item.type)}
                    </div>

                    {item.subtitle && (
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {item.subtitle}
                      </p>
                    )}

                    {item.metadata?.codeSnippet && (
                      <pre className="text-[11px] font-mono bg-slate-100 dark:bg-slate-900/80 p-2 rounded-lg text-slate-700 dark:text-slate-300 overflow-x-auto max-w-lg mt-1.5">
                        <code>{item.metadata.codeSnippet}...</code>
                      </pre>
                    )}

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.timestamp}</span>
                      </span>
                      {item.metadata?.language && (
                        <span className="uppercase font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {item.metadata.language}
                        </span>
                      )}
                      {item.metadata?.executionTimeMs !== undefined && (
                        <span>{item.metadata.executionTimeMs}ms latency</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="shrink-0 flex items-center gap-1">
                  {item.type === 'download' && item.metadata?.fileUrl && (
                    <a
                      href={item.metadata.fileUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Re-download PDF"
                    >
                      <Download className="w-3 h-3" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  )}

                  {item.type === 'code_execution' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsHistoryModalOpen(false);
                        setActiveTab('code-editor');
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Code2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Editor</span>
                    </button>
                  )}

                  {item.type === 'live_class' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsHistoryModalOpen(false);
                        setActiveTab('live-classes');
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Tv className="w-3 h-3" />
                      <span className="hidden sm:inline">Classes</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:px-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-500">
          <span>Synced locally & preserved across browser sessions</span>
          <button
            type="button"
            onClick={() => setIsHistoryModalOpen(false)}
            className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
