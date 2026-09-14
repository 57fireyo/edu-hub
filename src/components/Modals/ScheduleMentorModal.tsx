import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { X, Calendar, Clock, CheckCircle2, Star } from 'lucide-react';

export const ScheduleMentorModal: React.FC = () => {
  const { selectedMentorForBooking, setSelectedMentorForBooking, bookMentorSession } = useApp();
  const { user } = useAuth();

  const [date, setDate] = useState('Tomorrow');
  const [time, setTime] = useState('5:30 PM EST');
  const [topic, setTopic] = useState('System Design & Technical Mock Interview Breakdown');

  if (!selectedMentorForBooking) return null;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    bookMentorSession(selectedMentorForBooking.name, date, time, topic);
  };

  return (
    <div
      id="schedule-mentor-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="schedule-mentor-card"
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-6 animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={() => setSelectedMentorForBooking(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-indigo-600 dark:bg-indigo-700 p-6 text-white flex items-center gap-4">
          <img
            src={selectedMentorForBooking.avatar}
            alt={selectedMentorForBooking.name}
            className="w-14 h-14 rounded-xl object-cover border-2 border-white/40"
          />
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md">
              1-on-1 Guidance
            </span>
            <h2 className="text-lg font-bold mt-1">{selectedMentorForBooking.name}</h2>
            <p className="text-xs text-indigo-100">
              {selectedMentorForBooking.role} @ {selectedMentorForBooking.company}
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBooking} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Date
              </label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Tomorrow">Tomorrow</option>
                <option value="Wednesday, Aug 23">Wednesday, Aug 23</option>
                <option value="Saturday, Aug 26">Saturday, Aug 26</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Time Slot
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="5:30 PM EST">5:30 PM EST</option>
                <option value="6:30 PM EST">6:30 PM EST</option>
                <option value="7:30 PM EST">7:30 PM EST</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Discussion Topic & Focus
            </label>
            <textarea
              rows={3}
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block">
              EduHub Faculty Sponsored
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              This session is free of cost for enrolled students under the CS 2024 academic track.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Confirm 1-on-1 Session</span>
          </button>
        </form>
      </div>
    </div>
  );
};
