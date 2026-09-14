import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Gavel,
  X,
  AlertTriangle,
  Clock,
  FileText,
  UserX,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const COMMON_REASONS = [
  'Academic Integrity & Code Plagiarism Violation',
  'Unauthorized Project Credits Alteration or Defacement',
  'Inappropriate or Toxic Conduct in Group/Direct Chats',
  'Distribution of Unauthorized Exam & Solution Materials',
  'Commercial Spamming & Resource Link Flooding',
  'Credential Impersonation & Student Identity Fraud',
];

const BAN_DURATIONS = [
  '24 Hours Warning Lockout',
  '7 Days Academic Suspension',
  '30 Days Campus Disciplinary Ban',
  'Semester Suspension (90 Days)',
  'Permanent Campus Blacklist / Expulsion',
];

export const BanUserModal: React.FC = () => {
  const {
    isBanModalOpen,
    closeBanModal,
    banModalTarget,
    banUser,
    isOwner,
  } = useApp();

  const [reason, setReason] = useState<string>(COMMON_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [duration, setDuration] = useState<string>(BAN_DURATIONS[2]);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (banModalTarget) {
      setReason(COMMON_REASONS[0]);
      setCustomReason('');
      setAdminNotes('');
    }
  }, [banModalTarget]);

  if (!isBanModalOpen || !banModalTarget) return null;

  const handleConfirmBan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalReason = reason === 'Other' ? (customReason.trim() || 'Administrative Disciplinary Action') : reason;

    banUser({
      userId: banModalTarget.userId,
      name: banModalTarget.name,
      btId: banModalTarget.btId || 'N/A',
      avatar: banModalTarget.avatar,
      branch: banModalTarget.branch,
      reason: finalReason,
      duration,
      notes: adminNotes,
      isContributor: banModalTarget.isContributor,
      contributorId: banModalTarget.contributorId,
    });

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Warning Atmosphere */}
        <div className="p-5 sm:p-6 bg-red-500/10 border-b border-red-200 dark:border-red-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-red-900 dark:text-red-200">
                  Campus Disciplinary Action & Ban
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                  OWNER AUTHORITY
                </span>
              </div>
              <p className="text-xs text-red-700/80 dark:text-red-400">
                Enforce disciplinary penalties, suspend permissions, and document student infractions.
              </p>
            </div>
          </div>

          <button
            onClick={closeBanModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Profile Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
          <img
            src={banModalTarget.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
            alt={banModalTarget.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-red-400"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {banModalTarget.name}
              </h3>
              {banModalTarget.isContributor && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                  Project Contributor
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              BT ID: {banModalTarget.btId || 'Unregistered'} • {banModalTarget.branch || 'Campus Student'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmBan} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Reason selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Disciplinary Offense / Violation Reason</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-red-500"
            >
              {COMMON_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              <option value="Other">Other Custom Administrative Penalty...</option>
            </select>
          </div>

          {reason === 'Other' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Specify Custom Reason
              </label>
              <input
                type="text"
                required
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="e.g. Repeated violation of campus forum rules"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Punishment Suspension Period</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BAN_DURATIONS.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDuration(dur)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    duration === dur
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Memo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Administrative Memo / Disciplinary Notes (Optional)</span>
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Provide context or evidence references for the campus disciplinary committee..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          {/* Consequences Alert */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Punishment Enforcement Effects:
            </p>
            <p>
              • Account flagged as <strong>BANNED</strong> across Cloud Firestore and EduHub servers.
            </p>
            <p>• Immediate restriction on posting resources, hosting live rooms, and chatting in groups.</p>
            {banModalTarget.isContributor && (
              <p>
                • Contributor card in <strong>Project Credits</strong> will display a prominent disciplinary suspension badge.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeBanModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30 flex items-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              <Gavel className="w-4 h-4" />
              <span>{isSubmitting ? 'Enforcing...' : 'Enforce Ban & Punishment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
