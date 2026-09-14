import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { X, DollarSign, Clock, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export const ApplyGigModal: React.FC = () => {
  const { selectedGigForApply, setSelectedGigForApply, submitGigApplication } = useApp();
  const { user } = useAuth();

  const [proposedRate, setProposedRate] = useState('');
  const [coverLetter, setCoverLetter] = useState(
    "Hi there, I'm a CS junior with verified coursework and hands-on React/Node.js experience. I can deliver this project cleanly with test coverage."
  );

  if (!selectedGigForApply) return null;

  const defaultSuggestedRate =
    selectedGigForApply.budgetType === 'fixed'
      ? `$${selectedGigForApply.budgetMin} Fixed`
      : `$${selectedGigForApply.budgetMin}/hr`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitGigApplication(
      selectedGigForApply.id,
      proposedRate || defaultSuggestedRate,
      coverLetter
    );
  };

  return (
    <div
      id="apply-gig-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="apply-gig-card"
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-6 animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={() => setSelectedGigForApply(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-indigo-600 dark:bg-indigo-700 p-6 text-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md">
            Submit Proposal
          </span>
          <h2 className="text-lg font-bold mt-2">{selectedGigForApply.title}</h2>
          <p className="text-xs text-indigo-100 mt-0.5">
            Client: {selectedGigForApply.clientName} • Budget:{' '}
            {selectedGigForApply.budgetType === 'fixed'
              ? `$${selectedGigForApply.budgetMin}–$${selectedGigForApply.budgetMax}`
              : `$${selectedGigForApply.budgetMin}/hr`}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Proposed Bid / Rate
            </label>
            <input
              type="text"
              required
              placeholder={`e.g. ${defaultSuggestedRate}`}
              value={proposedRate}
              onChange={(e) => setProposedRate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cover Letter & Technical Approach
            </label>
            <textarea
              rows={4}
              required
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 block">
              Applicant Verified Profile
            </span>
            <p className="text-slate-500">
              {user.name} ({user.btId}) • {user.branch} • {user.skills.slice(0, 4).join(', ')}
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Bid Proposal</span>
          </button>
        </form>
      </div>
    </div>
  );
};
