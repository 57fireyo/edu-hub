import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, CheckCircle2, X, ShieldCheck, Zap, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProUpgradeModal: React.FC = () => {
  const { isProModalOpen, setIsProModalOpen, showToast } = useApp();
  const { user, upgradeToPro } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isProModalOpen) return null;

  const handleActivatePro = () => {
    upgradeToPro();
    setIsProModalOpen(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    showToast('🎉 Congratulations! EduHub Pro membership activated successfully.');
  };

  return (
    <div
      id="pro-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="pro-modal-card"
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={() => setIsProModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner */}
        <div className="bg-indigo-600 dark:bg-indigo-700 p-8 text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">EduHub Pro Membership</h2>
          <p className="text-xs text-indigo-100 mt-1 max-w-sm mx-auto">
            Supercharge your academic trajectory and unlock high-paying client contracts.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex p-1 bg-black/20 backdrop-blur-md rounded-xl mt-5 border border-white/20 text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                billingCycle === 'monthly' ? 'bg-white text-indigo-600 shadow-xs' : 'text-white/80'
              }`}
            >
              Monthly ($8/mo)
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                billingCycle === 'annual' ? 'bg-white text-indigo-600 shadow-xs' : 'text-white/80'
              }`}
            >
              <span>Annual ($4.99/mo)</span>
              <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded-md">
                -40%
              </span>
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-3">
            {[
              '0% Platform Commission on all student freelance earnings',
              'Verified "EduHub Pro Developer" badge on bids & proposals',
              'Priority 1-on-1 scheduling with FAANG Alumni mentors',
              'Unlimited instant cloud sandbox executions & compilation',
              'Full offline access & direct PDF download for all course compendiums',
              'Exclusive access to $1,000+ enterprise freelance contracts',
            ].map((perk, i) => (
              <div key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{perk}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              id="activate-pro-btn"
              onClick={handleActivatePro}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{user.isPro ? 'Renew Pro Membership' : 'Activate Pro Access Now'}</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Cancel anytime with 1-click. Institutional college discounts applied.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
