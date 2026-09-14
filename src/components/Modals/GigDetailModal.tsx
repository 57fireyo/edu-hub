import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Briefcase, Clock, DollarSign, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const GigDetailModal: React.FC = () => {
  const { activeGigDetail, setActiveGigDetail, setSelectedGigForApply } = useApp();

  if (!activeGigDetail) return null;

  return (
    <div
      id="gig-detail-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="gig-detail-card"
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-6 animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={() => setActiveGigDetail(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-indigo-600 dark:bg-indigo-700 p-6 text-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md">
            {activeGigDetail.category}
          </span>
          <h2 className="text-xl font-bold mt-2">{activeGigDetail.title}</h2>
          <div className="flex items-center gap-2 mt-2 text-xs text-indigo-100">
            <span className="font-semibold">{activeGigDetail.clientName}</span>
            <span>•</span>
            <span>{activeGigDetail.clientCompany}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-slate-500 block">Budget</span>
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                {activeGigDetail.budgetType === 'fixed'
                  ? `$${activeGigDetail.budgetMin} – $${activeGigDetail.budgetMax}`
                  : `$${activeGigDetail.budgetMin}/hr`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Timeline</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {activeGigDetail.estimatedDuration}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Project Description & Requirements
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {activeGigDetail.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-2">
              Required Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {activeGigDetail.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Posted {activeGigDetail.postedAt} • {activeGigDetail.proposalsCount} proposals
            </span>
            <button
              onClick={() => {
                setSelectedGigForApply(activeGigDetail);
                setActiveGigDetail(null);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 active:scale-98 transition-all"
            >
              <span>Submit Proposal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
