import React, { useState } from 'react';
import { HelpCircle, BookOpen, Code2, Users2, ShieldCheck, Mail, Award } from 'lucide-react';
import { CreditsSection } from '../Credits/CreditsSection';

export const HelpView: React.FC = () => {
  const [activeHelpTab, setActiveHelpTab] = useState<'faq' | 'credits'>('faq');

  const faqs = [
    {
      q: 'How do student freelance earnings work on EduHub?',
      a: 'EduHub provides a 0% commission direct escrow platform for enrolled university students. Once a client approves your milestone deliverable, funds are deposited directly into your verified account balance.',
    },
    {
      q: 'How can I schedule a 1-on-1 session with an alumni mentor?',
      a: 'Navigate to the Mentorship tab, choose an available mentor based on your career track (e.g. System Design, AI/ML, Interview prep), and select an available time slot. Mentorship sessions are faculty-sponsored for CS students.',
    },
    {
      q: 'How does the in-browser Code Workspace operate?',
      a: 'Our collaborative IDE supports Python 3.10, Node.js, and TypeScript with real-time execution in sandboxed Web Workers and remote micro-containers with sub-50ms latency.',
    },
    {
      q: 'Can alumni post freelance gigs or hire junior students?',
      a: 'Yes! Alumni can switch to Alumni mode via the top profile menu and click "Post a Gig" to recruit motivated student developers for startup projects and research initiatives.',
    },
    {
      q: 'How do WhatsApp-style group chats work?',
      a: 'Students can create custom study and project groups in the Chat Groups tab, invite classmates, share code snippets with copy shortcuts, react with live emojis, and coordinate milestones.',
    },
  ];

  return (
    <div id="help-view" className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      <header className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-semibold mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          EduHub Knowledge Base & Acknowledgements
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Help, FAQ & Project Credits
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Explore student guides, platform FAQs, and project acknowledgements honoring our Department Head, Guides, and Student Contributors.
        </p>

        {/* Tab switch */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveHelpTab('faq')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeHelpTab === 'faq'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Platform FAQs & Guide</span>
          </button>
          <button
            onClick={() => setActiveHelpTab('credits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeHelpTab === 'credits'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Project Credits & Contributors</span>
          </button>
        </div>
      </header>

      {/* Tab: FAQs */}
      {activeHelpTab === 'faq' && (
        <div className="space-y-4">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Need Faculty or Technical Support?</h3>
              <p className="text-xs text-slate-500 mt-0.5">Reach out to our campus student coordinators 24/7.</p>
            </div>
            <a
              href="mailto:support@eduhub.edu"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors active:scale-98"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Campus Support</span>
            </a>
          </div>
        </div>
      )}

      {/* Tab: Project Credits */}
      {activeHelpTab === 'credits' && (
        <div className="space-y-6">
          <CreditsSection showOwnerEditButton={true} />
        </div>
      )}
    </div>
  );
};

