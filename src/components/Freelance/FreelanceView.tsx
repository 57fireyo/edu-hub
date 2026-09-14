import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { FreelanceGig } from '../../types';
import {
  Briefcase,
  Sparkles,
  Clock,
  DollarSign,
  PlusCircle,
  CheckCircle2,
  Filter,
  Search,
  ArrowRight,
  TrendingUp,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

export const FreelanceView: React.FC = () => {
  const {
    gigs,
    applications,
    setSelectedGigForApply,
    setIsProModalOpen,
    setIsPostGigModalOpen,
    setActiveGigDetail,
    searchQuery,
  } = useApp();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'my-proposals'>('marketplace');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredGigs = gigs.filter((gig) => {
    const matchesCat = categoryFilter === 'all' || gig.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featuredGig = filteredGigs.find((g) => g.featured) || filteredGigs[0];
  const regularGigs = filteredGigs.filter((g) => g.id !== featuredGig?.id);

  return (
    <div id="freelance-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <header className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Verified Academic & Client Marketplace
            </span>
            <span className="text-xs text-slate-500">0% Platform Fee for Students</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Freelance & Earning Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Apply your classroom coding, design, and technical writing skills to paid real-world projects. Build client references before graduating.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="post-gig-trigger-btn"
            onClick={() => setIsPostGigModalOpen(true)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Post a Gig</span>
          </button>
          <button
            id="freelance-go-pro-btn"
            onClick={() => setIsProModalOpen(true)}
            className="px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs active:scale-98 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>EduHub Pro Gigs</span>
          </button>
        </div>
      </header>

      {/* Tabs: Marketplace vs My Proposals */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-4">
          <button
            id="tab-all-gigs"
            onClick={() => setActiveTab('marketplace')}
            className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'marketplace'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse All Gigs ({gigs.length})</span>
          </button>
          <button
            id="tab-my-proposals"
            onClick={() => setActiveTab('my-proposals')}
            className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'my-proposals'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>My Submitted Proposals ({applications.length})</span>
          </button>
        </div>

        {/* Categories */}
        {activeTab === 'marketplace' && (
          <div className="hidden sm:flex items-center gap-1.5">
            {['all', 'Web Dev', 'Python', 'UI/UX', 'Writing', 'Mobile'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'marketplace' ? (
        /* Bento Grid Style Marketplace */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
          {/* Gig Card Large (Spans 2 columns on tablet/desktop) */}
          {featuredGig && (
            <article
              id={`featured-gig-card-${featuredGig.id}`}
              className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 px-2.5 py-1 rounded-md text-xs font-semibold">
                      Featured Project
                    </span>
                    {featuredGig.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <span className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {featuredGig.budgetType === 'fixed'
                      ? `$${featuredGig.budgetMin} – $${featuredGig.budgetMax}`
                      : `$${featuredGig.budgetMin}/hr`}
                  </span>
                </div>

                <div className="mb-4">
                  <h3
                    onClick={() => setActiveGigDetail(featuredGig)}
                    className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {featuredGig.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Client: {featuredGig.clientName} ({featuredGig.clientCompany})
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {featuredGig.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Posted {featuredGig.postedAt}
                  </span>
                  <span>•</span>
                  <span>Est. {featuredGig.estimatedDuration}</span>
                  <span>•</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    {featuredGig.proposalsCount} proposals
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveGigDetail(featuredGig)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Details
                  </button>
                  <button
                    id={`apply-btn-${featuredGig.id}`}
                    onClick={() => setSelectedGigForApply(featuredGig)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-98 flex items-center gap-1"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* Stats / Upsell Card */}
          <article
            id="freelance-pro-upsell-card"
            className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl p-6 flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <h3 className="text-lg font-bold mb-2">EduHub Pro Network</h3>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Unlock direct senior client introductions, priority proposal placement, and verified GitHub & LeetCode credential badges.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-indigo-100">Average Pro Gig Rate:</span>
                <span className="text-sm font-bold text-amber-300">$65/hr</span>
              </div>
              <button
                id="upsell-upgrade-btn"
                onClick={() => setIsProModalOpen(true)}
                className="w-full bg-white text-indigo-700 hover:bg-slate-50 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all text-center"
              >
                Upgrade to Pro
              </button>
            </div>
          </article>

          {/* Regular Gig Cards Grid */}
          {regularGigs.map((gig) => (
            <article
              key={gig.id}
              id={`gig-card-${gig.id}`}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                    {gig.category}
                  </span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {gig.budgetType === 'fixed' ? `$${gig.budgetMin} fixed` : `$${gig.budgetMin}/hr`}
                  </span>
                </div>

                <h3
                  onClick={() => setActiveGigDetail(gig)}
                  className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1 line-clamp-2 cursor-pointer"
                >
                  {gig.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {gig.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {gig.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md text-[10px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">
                  {gig.postedAt} • {gig.proposalsCount} bids
                </span>
                <button
                  id={`view-gig-btn-${gig.id}`}
                  onClick={() => setSelectedGigForApply(gig)}
                  className="border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  Apply
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* My Proposals Tracker */
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <FileCheck className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No active proposals submitted
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Browse our client marketplace and submit custom bids with your proposed rates.
              </p>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="mt-4 px-5 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Browse Marketplace Gigs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                          app.status === 'in_progress'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {app.status === 'in_progress' ? 'Contract Active (In Progress)' : 'Under Review'}
                      </span>
                      <span className="text-xs text-slate-500">Applied {app.appliedDate}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {app.gigTitle}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                      "{app.coverLetter}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Your Bid</span>
                      <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                        {app.proposedRate}
                      </span>
                    </div>
                    <button
                      onClick={() => alert(`Opening collaboration workspace with the client!`)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Open Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
