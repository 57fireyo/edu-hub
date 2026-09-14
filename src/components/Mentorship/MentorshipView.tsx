import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Mentor } from '../../types';
import {
  Users2,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Building,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

export const MentorshipView: React.FC = () => {
  const { mentors, setSelectedMentorForBooking, bookedSessions, setActiveTab, setActiveChannel } =
    useApp();
  const { user } = useAuth();

  return (
    <div id="mentorship-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <header className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <Users2 className="w-3.5 h-3.5" />
            Alumni & Faculty 1-on-1 Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Mentorship & Career Guidance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Get personalized advice on technical interviews, distributed systems architecture, research publications, and landing your first high-paying tech gig.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center min-w-[200px]">
          <span className="text-xs text-slate-500 block">Your Booked Sessions</span>
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            {bookedSessions.length} Upcoming
          </span>
        </div>
      </header>

      {/* Booked Sessions Alert Banner */}
      {bookedSessions.length > 0 && (
        <section className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Upcoming Confirmed Sessions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bookedSessions.map((session, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    1-on-1 with {session.mentorName}
                  </h3>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                    {session.date} • {session.time}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{session.topic}</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('code-editor');
                    setActiveChannel('mentor-dr-chen');
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-[11px] font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Join Room
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mentors Directory Cards */}
      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Verified Alumni & Faculty Mentors ({mentors.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              id={`mentor-card-dir-${mentor.id}`}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {mentor.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {mentor.role} @ {mentor.company}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{mentor.rating}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({mentor.reviewsCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {mentor.bio}
                </p>

                <div className="space-y-2 mb-4">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Core Expertise
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-md text-[10px] font-semibold"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1 mb-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Availability:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {mentor.availableDays.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Timing:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {mentor.availableHours}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('code-editor');
                    setActiveChannel('mentor-dr-chen');
                  }}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
                  title="Direct Message"
                >
                  <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </button>
                <button
                  id={`book-mentor-btn-${mentor.id}`}
                  onClick={() => setSelectedMentorForBooking(mentor)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-98 text-center flex items-center justify-center gap-1.5"
                >
                  <span>Schedule 1-on-1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
