import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  AlertOctagon,
  Clock,
  Mail,
  Lock,
  ExternalLink,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export const BannedNoticeModal: React.FC = () => {
  const { user, logout } = useAuth();
  const { bannedUsers, showToast, isOwner } = useApp();

  // Check if current user is banned
  const activeBan = bannedUsers.find(
    (b) =>
      b.status === 'active_ban' &&
      (b.userId === user?.id ||
        (b.btId && b.btId !== 'N/A' && user?.btId && b.btId.toLowerCase() === user.btId.toLowerCase()) ||
        (b.name && user?.name && b.name.toLowerCase() === user.name.toLowerCase()))
  );

  // If user is owner or not banned, do not show lockout modal
  if (isOwner || (!activeBan && !user.isBanned)) {
    return null;
  }

  const banReason = activeBan?.reason || user.banReason || 'Academic & Campus Disciplinary Violation';
  const banDuration = activeBan?.duration || user.banDuration || 'Indefinite Campus Lockout';
  const bannedAt = activeBan?.bannedAt || user.bannedAt || 'Recent Action';
  const bannedBy = activeBan?.bannedBy || 'Office of the Academic Dean & Platform Owner';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-2 border-red-500/80 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-center p-6 sm:p-8 space-y-5">
        {/* Emblem */}
        <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-950/80 border-2 border-red-400 dark:border-red-700 mx-auto flex items-center justify-center text-red-600 dark:text-red-400 shadow-lg">
          <AlertOctagon className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 border border-red-300 dark:border-red-700">
            CAMPUS DISCIPLINARY SANCTION
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Account Under Disciplinary Suspension
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Administrative action taken for repository/campus misconduct.
          </p>
        </div>

        {/* Detailed Box */}
        <div className="bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-4 text-left space-y-2.5 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 block">
              Stated Infraction
            </span>
            <p className="font-semibold text-red-900 dark:text-red-200">{banReason}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-red-200/60 dark:border-red-900/40 text-[11px]">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Duration:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{banDuration}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Disciplined By:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{bannedBy}</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          While under active punishment, you cannot send messages, alter project resources, or interact in live classes. If you believe this is a clerical error, submit a grievance to the Head of Department.
        </p>

        {/* Actions */}
        <div className="pt-2 flex flex-col gap-2">
          <a
            href="mailto:hod.cse@eduhub.edu?subject=Academic%20Disciplinary%20Appeal"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Submit Formal Appeal to HOD</span>
          </a>

          <button
            onClick={() => {
              logout();
              showToast('Logged out of suspended session.');
            }}
            className="w-full py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out & Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
