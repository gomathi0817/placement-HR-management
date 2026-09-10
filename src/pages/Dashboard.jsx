import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

import {
  Clock,
  Calendar,
  AlertTriangle,
  Users,
  Building2,
  MessageSquare,
  CheckCircle2,
  History,
  Phone,
  Mail,
  MessageCircle,
  Plus,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

import {
  getTodayDateString,
  formatNiceDate
} from '../utils/dateUtils';

export const Dashboard = () => {
  const {
    user,
    hrs,
    companies,
    followUps,
    interactions,
    markFollowUpComplete,
    rescheduleFollowUp,
    setIsQuickAddOpen
  } = useApp();

  const navigate = useNavigate();

  const todayStr = getTodayDateString();

  const [selectedContactHR, setSelectedContactHR] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDate, setNewDate] = useState(todayStr);
  const [newTime, setNewTime] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');

  // ==========================================
  // CURRENT TIME / GREETING
  // ==========================================

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    }

    if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    }

    if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    }

    return 'Good Night';
  };

  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting());
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // USER NAME
  // ==========================================

  const userName =
    user?.name ||
    user?.Name ||
    user?.email?.split('@')[0] ||
    'User';

  // ==========================================
  // FOLLOW-UP METRICS
  // ==========================================

  const todayFollowUps = followUps.filter(
    f =>
      f.date === todayStr &&
      f.status !== 'MISSED' &&
      f.status !== 'Overdue' &&
      f.status !== 'Completed'
  );

  const upcomingCount = followUps.filter(
    f =>
      f.status === 'Pending' ||
      f.status === 'Upcoming'
  ).length;

  const missedItems = followUps.filter(
    f =>
      f.status === 'MISSED' ||
      f.status === 'Overdue'
  );

  const missedCount = missedItems.length;

  // ==========================================
  // REAL DATABASE VALUES
  // ==========================================

  const totalHRs = hrs.length;

  const activeCompanies = companies.filter(
    company => {
      const status = String(
        company.status || ''
      ).toLowerCase();

      return (
        !status ||
        status === 'active' ||
        status === 'ongoing'
      );
    }
  ).length;

  const pendingResponses = hrs.filter(
    hr =>
      hr.status === 'Waiting for Response' ||
      hr.status === 'Pending' ||
      hr.status === 'waiting'
  ).length;

  const completedActivities =
    followUps.filter(
      f => f.status === 'Completed'
    ).length;

  const recentInteractionsCount =
    interactions.length;

  // ==========================================
  // SUMMARY CARDS
  // ==========================================

  const summaryCards = [
    {
      label: "Today's Follow-Ups",
      value: todayFollowUps.length.toString().padStart(2, '0'),
      icon: Clock,
      color: 'bg-amber-100 text-amber-900 border-amber-300',
      path: '/follow-ups'
    },
    {
      label: 'Upcoming',
      value: upcomingCount.toString().padStart(2, '0'),
      icon: Calendar,
      color: 'bg-blue-100 text-blue-900 border-blue-300',
      path: '/follow-ups'
    },
    {
      label: 'Missed Follow-Ups',
      value: missedCount.toString().padStart(2, '0'),
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-900 border-red-300',
      path: '/follow-ups'
    },
    {
      label: 'Total HR Contacts',
      value: totalHRs.toString().padStart(2, '0'),
      icon: Users,
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      path: '/hr'
    },
    {
      label: 'Active Companies',
      value: activeCompanies.toString().padStart(2, '0'),
      icon: Building2,
      color: 'bg-purple-100 text-purple-900 border-purple-300',
      path: '/companies'
    },
    {
      label: 'Pending Responses',
      value: pendingResponses.toString().padStart(2, '0'),
      icon: MessageSquare,
      color: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      path: '/hr'
    },
    {
      label: 'Completed Activities',
      value: completedActivities.toString().padStart(2, '0'),
      icon: CheckCircle2,
      color: 'bg-teal-100 text-teal-900 border-teal-300',
      path: '/follow-ups'
    },
    {
      label: 'Recent Interactions',
      value: recentInteractionsCount.toString().padStart(2, '0'),
      icon: History,
      color: 'bg-rose-100 text-rose-900 border-rose-300',
      path: '/analytics'
    }
  ];

  // ==========================================
  // RESCHEDULE
  // ==========================================

  const handleRescheduleSubmit = async e => {
    e.preventDefault();
    setRescheduleError('');

    if (!rescheduleTarget || !newDate) {
      return;
    }

    try {
      await rescheduleFollowUp(
        rescheduleTarget.id,
        newDate,
        newTime
      );

      setRescheduleTarget(null);
    } catch (err) {
      setRescheduleError(
        err?.response?.data?.message ||
          'Follow-up date and time cannot be in the past.'
      );
    }
  };

  // ==========================================
  // RECENT ACTIVITY
  // ==========================================

  const recentActivities = [
    ...interactions.map(item => ({
      id: `interaction-${item.id}`,
      text:
        item.description ||
        item.notes ||
        item.purpose ||
        `${item.hrName || 'HR'} interaction recorded`,
      date:
        item.date ||
        item.createdAt ||
        item.created_at ||
        '',
      type: 'interaction'
    })),

    ...followUps.map(item => ({
      id: `followup-${item.id}`,
      text:
        item.purpose ||
        `Follow-up scheduled with ${
          item.hrName || 'HR'
        }`,
      date:
        item.date ||
        item.createdAt ||
        item.created_at ||
        '',
      type: 'followup'
    }))
  ]
    .filter(item => item.date)
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 4);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12 bg-cream">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-darkText">
              {greeting}, {userName} 👋
            </h1>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-darkText/70 mt-1">
            Here’s your recruitment communication overview for{' '}
            <span className="font-extrabold text-darkText">
              {formatNiceDate(todayStr)}
            </span>
            .
          </p>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="px-5 py-3 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add HR / Interaction</span>
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;

          return (
            <div
              key={idx}
              onClick={() => navigate(card.path)}
              className="bg-white hover:bg-cream border-2 border-olive/40 hover:border-primary rounded-2xl p-4 cursor-pointer transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-darkText/70 truncate">
                  {card.label}
                </span>

                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${card.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-darkText">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* TODAY'S ACTION CENTER */}
      <div className="bg-white border-2 border-primary rounded-3xl p-5 sm:p-6 shadow-card-custom space-y-4">
        <div className="flex items-center justify-between border-b border-olive/30 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-darkText">
                Today's Action Center
              </h2>

              <span className="text-xs font-semibold text-darkText/70">
                Scheduled HR Calls & Interactions for Today ({formatNiceDate(todayStr)})
              </span>
            </div>
          </div>

          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full">
            {todayFollowUps.length} Scheduled Today
          </span>
        </div>

        {todayFollowUps.length === 0 ? (
          <div className="p-6 bg-cream border border-olive/30 rounded-2xl text-center space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />

            <h4 className="font-bold text-sm text-darkText">
              No Pending Follow-Ups For Today
            </h4>

            <p className="text-xs text-darkText/70">
              Today's follow-up schedule is clear.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayFollowUps.map(item => {
              const hr = hrs.find(h => h.id === item.hrId) || {
                name: item.hrName,
                companyName: item.companyName,
                phone: item.phone,
                email: item.email
              };

              return (
                <div
                  key={item.id}
                  className="bg-cream border-2 border-olive/50 hover:border-primary rounded-2xl p-4 transition-all shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-extrabold text-base text-darkText">
                          {item.hrName || hr.name || 'HR Contact'}
                        </h3>

                        <span className="text-xs font-bold text-darkText/70">
                          {item.companyName || hr.companyName || ''}
                        </span>
                      </div>

                      <div className="text-right">
                        {item.time && (
                          <span className="inline-block bg-white text-darkText font-black text-xs px-2.5 py-1 rounded-lg border border-olive/40">
                            {item.time}
                          </span>
                        )}

                        {item.priority && (
                          <span className="block text-[10px] font-bold text-red-700 uppercase tracking-wider mt-1">
                            Priority: {item.priority}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.purpose && (
                      <p className="text-xs text-darkText font-medium bg-white p-3 rounded-xl border border-olive/30 italic">
                        "{item.purpose}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-olive/30">
                    <button
                      onClick={() => setSelectedContactHR(hr)}
                      className="px-4 py-2 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact HR</span>
                    </button>

                    <button
                      onClick={() => markFollowUpComplete(item.id)}
                      className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Mark Done</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MISSED FOLLOW-UPS */}
      <div className="bg-white border-2 border-red-300 rounded-3xl p-5 sm:p-6 shadow-card-custom space-y-4">
        <div className="flex items-center justify-between border-b border-red-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-900 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-red-900 flex items-center gap-2">
                <span>Missed Follow-Ups</span>
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              </h2>

              <span className="text-xs font-semibold text-red-700">
                Scheduled recruiter check-ins whose date/time passed without completion
              </span>
            </div>
          </div>

          <span className="bg-red-100 text-red-900 font-black text-xs px-3 py-1 rounded-full border border-red-300">
            🔴 {missedCount} Missed
          </span>
        </div>

        {missedItems.length === 0 ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
            <p className="text-xs font-bold text-emerald-900">
              ✓ No missed follow-ups! All recruiter actions are up to date.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {missedItems.map(item => {
              const hr = hrs.find(h => h.id === item.hrId) || {
                name: item.hrName,
                companyName: item.companyName,
                phone: item.phone,
                email: item.email
              };

              return (
                <div
                  key={item.id}
                  className="bg-red-50/70 border-2 border-red-200 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-300">
                        🔴 MISSED
                      </span>

                      <span className="text-[11px] font-bold text-red-800">
                        Due: {formatNiceDate(item.date)}
                        {item.time && `, ${item.time}`}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-darkText">
                      {item.hrName || hr.name || 'HR Contact'}
                      {item.companyName && (
                        <>
                          {' — '}
                          <span className="text-darkText/70">
                            {item.companyName}
                          </span>
                        </>
                      )}
                    </h3>

                    {item.purpose && (
                      <p className="text-xs text-darkText font-medium mt-2 bg-white p-2.5 rounded-xl border border-red-200">
                        "{item.purpose}"
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setSelectedContactHR(hr)}
                      className="py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact HR</span>
                    </button>

                    <button
                      onClick={() => {
                        setRescheduleTarget(item);
                        setNewDate(todayStr);
                        setNewTime(item.time || '');
                      }}
                      className="py-2.5 bg-white border border-olive hover:bg-cream text-darkText font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-xs transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RECENT ACTIVITY & NETWORK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border-2 border-olive/50 rounded-3xl p-5 sm:p-6 shadow-card-custom space-y-4">
          <div className="flex items-center justify-between border-b border-olive/30 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-darkText" />
              <h3 className="font-extrabold text-base text-darkText">
                Recent Activity Log
              </h3>
            </div>

            <button
              onClick={() => navigate('/analytics')}
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <div className="p-5 bg-cream rounded-xl border border-olive/30 text-center">
                <History className="w-7 h-7 mx-auto mb-2 text-darkText/70" />
                <p className="text-xs font-bold text-darkText">No recent activity</p>
                <p className="text-[11px] text-darkText/70 mt-1">
                  Your HR interactions and follow-ups will appear here.
                </p>
              </div>
            ) : (
              recentActivities.map((act, i) => (
                <div
                  key={act.id || i}
                  className="flex items-start gap-3 p-3 bg-cream rounded-xl border border-olive/30 text-xs"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div className="flex-1 font-semibold text-darkText">
                    {act.text}
                  </div>
                  <span className="text-[10px] font-bold text-darkText/70 whitespace-nowrap">
                    {act.date}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* HR NETWORK */}
        <div className="bg-primary text-darkText rounded-3xl p-6 shadow-card-custom flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-darkText text-cream font-black flex items-center justify-center text-lg mb-4 shadow">
              GV
            </div>
            <h3 className="font-extrabold text-lg text-darkText mb-1">
              Active HR Contacts Network
            </h3>
            <p className="text-xs text-darkText/80 leading-relaxed mb-4 font-medium">
              Access complete recruiter directory, past conversation timelines, and company requirement sheets.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-darkText/20">
            <button
              onClick={() => navigate('/hr')}
              className="w-full py-3 bg-darkText hover:bg-darkText/90 text-cream font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Browse HR Contacts</span>
            </button>

            <button
              onClick={() => navigate('/companies')}
              className="w-full py-3 bg-white/40 hover:bg-white/60 text-darkText font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>Company Profiles</span>
            </button>
          </div>
        </div>
      </div>

      {/* RESCHEDULE MODAL */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-primary rounded-3xl max-w-sm w-full p-6 shadow-modal-custom space-y-4">
            <div className="flex items-center justify-between border-b border-olive/30 pb-3">
              <div>
                <h3 className="font-bold text-base text-darkText">Reschedule Follow-Up</h3>
                <span className="text-xs text-darkText/70">
                  {rescheduleTarget.hrName}
                  {rescheduleTarget.companyName && ` (${rescheduleTarget.companyName})`}
                </span>
              </div>
              <button
                onClick={() => setRescheduleTarget(null)}
                className="text-xs font-bold text-darkText/70"
              >
                ✕
              </button>
            </div>

            {rescheduleError && (
              <div className="p-3 bg-red-100 text-red-900 text-xs font-bold rounded-xl border border-red-300">
                ⚠️ {rescheduleError}
              </div>
            )}

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-darkText mb-1">
                  New Date (Must be today or future)
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full text-xs p-3 bg-cream border border-olive rounded-xl outline-none font-bold text-darkText"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-darkText mb-1">New Time</label>
                <input
                  type="text"
                  required
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  placeholder="Enter time"
                  className="w-full text-xs p-3 bg-cream border border-olive rounded-xl outline-none font-bold text-darkText"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleTarget(null)}
                  className="px-3 py-2 text-xs font-bold text-darkText/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-accent text-darkText text-xs font-bold rounded-xl shadow transition-colors"
                >
                  ✓ Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK CONTACT MODAL */}
      {selectedContactHR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-primary rounded-3xl max-w-sm w-full p-6 shadow-modal-custom space-y-4">
            <div className="flex items-center justify-between border-b border-olive/30 pb-3">
              <div>
                <h3 className="font-bold text-base text-darkText">
                  {selectedContactHR.name || 'HR Contact'}
                </h3>
                <span className="text-xs text-darkText/70">
                  {selectedContactHR.companyName || ''}
                </span>
              </div>
              <button
                onClick={() => setSelectedContactHR(null)}
                className="text-xs font-bold text-darkText/70"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-darkText/70">Select action to initiate recruiter outreach:</p>

            <div className="space-y-2">
              {selectedContactHR.phone && (
                <a
                  href={`tel:${selectedContactHR.phone}`}
                  className="w-full py-3 px-4 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {selectedContactHR.phone}</span>
                </a>
              )}

              {selectedContactHR.phone && (
                <a
                  href={`https://wa.me/${selectedContactHR.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Message</span>
                </a>
              )}

              {selectedContactHR.email && (
                <a
                  href={`mailto:${selectedContactHR.email}`}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Official Email</span>
                </a>
              )}

              {!selectedContactHR.phone && !selectedContactHR.email && (
                <div className="p-3 bg-cream border border-olive/30 rounded-xl text-xs font-semibold text-darkText/70 text-center">
                  No phone number or email is available for this HR contact.
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedContactHR(null)}
              className="w-full text-center text-xs font-bold text-darkText/70 pt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};