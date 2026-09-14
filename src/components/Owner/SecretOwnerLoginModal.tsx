import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  KeyRound,
  Lock,
  ArrowRight,
  X,
  Sparkles,
  CheckCircle2,
  FileText,
  Video,
  Globe,
  Radio,
} from 'lucide-react';

export const SecretOwnerLoginModal: React.FC = () => {
  const { isSecretOwnerModalOpen, setIsSecretOwnerModalOpen, loginOwner, showToast } = useApp();
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isSecretOwnerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Please enter your secret owner key.');
      return;
    }
    const success = loginOwner(passcode);
    if (success) {
      setPasscode('');
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Owner Passcode. Try "owner2026" or "admin123"');
    }
  };

  const handleQuickUnlock = () => {
    loginOwner('owner2026');
    setPasscode('');
    setErrorMsg('');
  };

  return (
    <div
      id="secret-owner-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="secret-owner-card"
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-indigo-200 dark:border-slate-800 overflow-hidden relative my-6 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setIsSecretOwnerModalOpen(false);
            setErrorMsg('');
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Visual */}
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-6 text-white relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded">
                RESTRICTED GATEWAY
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Secret Owner & Admin Login
              </h2>
            </div>
          </div>
          <p className="text-xs text-indigo-100/90 leading-relaxed mt-1">
            Authenticate to publish course PDFs, upload tutorial videos, add external web portals, and manage platform listings.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 block mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Owner Capabilities Unlocked:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-emerald-500" /> Publish PDFs & Notes
              </span>
              <span className="flex items-center gap-1">
                <Video className="w-3 h-3 text-rose-500" /> Upload Video Tutorials
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-500" /> Add Website Portals
              </span>
              <span className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-amber-500" /> Live Stream Broadcasts
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Secret Master Key / Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="secret-passcode-input"
                  type="password"
                  placeholder="Enter secret owner passcode..."
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  autoFocus
                  className="w-full pl-9.5 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              {errorMsg ? (
                <p className="text-rose-500 text-[11px] mt-1.5 font-medium flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {errorMsg}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  Default developer key: <code className="text-indigo-600 dark:text-indigo-400 font-mono font-semibold">owner2026</code>
                </p>
              )}
            </div>

            <button
              id="secret-login-submit-btn"
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Authenticate as Platform Owner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick One-Click Unlock for convenience */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              id="quick-owner-unlock-btn"
              onClick={handleQuickUnlock}
              className="w-full py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors text-center flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>⚡ Quick 1-Click Owner Bypass (Test Mode)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
