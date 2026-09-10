import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Calendar, CheckCircle2, AlertTriangle, Filter, Phone, Plus, RefreshCw, X } from 'lucide-react';
import { ScheduleFollowUpModal } from '../components/modals/ScheduleFollowUpModal';
import { getTodayDateString, formatNiceDate } from '../utils/dateUtils';

export const FollowUps = () => {
  const { followUps, hrs, markFollowUpComplete, rescheduleFollowUp } = useApp();

  const todayStr = getTodayDateString();
  const [activeTab, setActiveTab] = useState('All'); // All, Today, Upcoming, Missed, Completed
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDate, setNewDate] = useState(todayStr);
  const [newTime, setNewTime] = useState('10:30 AM');
  const [rescheduleError, setRescheduleError] = useState('');

  // Filter Follow-Ups
  const filteredFollowUps = followUps.filter(item => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Today') return item.date === todayStr && item.status !== 'MISSED';
    if (activeTab === 'Upcoming') return item.status === 'Pending' || item.status === 'Upcoming';
    if (activeTab === 'Missed') return item.status === 'MISSED' || item.status === 'Overdue';
    if (activeTab === 'Completed') return item.status === 'Completed';
    return true;
  });

  const getStatusChip = (status) => {
    switch (status) {
      case 'MISSED':
      case 'Overdue':
        return { bg: 'bg-red-100 text-red-900 border-red-300 font-black', label: '🔴 MISSED' };
      case 'Pending':
      case 'Follow-Up Due':
        return { bg: 'bg-accent/20 text-darkText border-accent font-bold', label: '🟡 Follow-Up Due' };
      case 'Contacted':
        return { bg: 'bg-olive/30 text-darkText border-olive font-bold', label: '🟢 Contacted' };
      case 'Waiting for HR Response':
        return { bg: 'bg-primary/20 text-darkText border-primary font-bold', label: '🟠 Waiting Response' };
      case 'Completed':
        return { bg: 'bg-olive/40 text-darkText border-olive font-bold', label: '✅ Completed' };
      default:
        return { bg: 'bg-cream text-darkText/70 border-olive/40 font-bold', label: '⚪ Pending' };
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    setRescheduleError('');
    if (!rescheduleTarget || !newDate) return;

    try {
      await rescheduleFollowUp(rescheduleTarget.id, newDate, newTime);
      setRescheduleTarget(null);
    } catch (err) {
      setRescheduleError(err.response?.data?.message || 'Follow-up date and time cannot be in the past.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-darkText">
            Follow-Up Management Center
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-darkText/70 mt-1">
            Track scheduled recruiter check-ins, reminders, and resolution statuses.
          </p>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="px-5 py-3 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Schedule Follow-Up</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-2 border-olive/40">
        {['All', 'Today', 'Upcoming', 'Missed', 'Completed'].map(tab => {
          const isSelected = activeTab === tab;
          let badgeCount = 0;
          if (tab === 'All') badgeCount = followUps.length;
          if (tab === 'Today') badgeCount = followUps.filter(f => f.date === todayStr && f.status !== 'MISSED').length;
          if (tab === 'Upcoming') badgeCount = followUps.filter(f => f.status === 'Pending' || f.status === 'Upcoming').length;
          if (tab === 'Missed') badgeCount = followUps.filter(f => f.status === 'MISSED' || f.status === 'Overdue').length;
          if (tab === 'Completed') badgeCount = followUps.filter(f => f.status === 'Completed').length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all border
                ${isSelected
                  ? 'bg-primary text-darkText border-primary shadow-sm'
                  : 'bg-white text-darkText/70 border-olive/40 hover:bg-cream'
                }
              `}
            >
              <span>{tab}</span>
              <span className={`
                text-[10px] px-2 py-0.5 rounded-full font-extrabold
                ${isSelected ? 'bg-darkText text-cream' : 'bg-cream text-darkText/70 border border-olive/30'}
              `}>
                {badgeCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Follow Up Cards List */}
      {filteredFollowUps.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-olive/60 rounded-3xl p-12 text-center my-6 space-y-3">
          <Clock className="w-12 h-12 text-primary mx-auto opacity-80" />
          <h3 className="text-base font-bold text-darkText">No Follow-Ups in "{activeTab}"</h3>
          <p className="text-xs text-darkText/70">
            {activeTab === 'Today' ? 'Your schedule is clear today. Great work!' : 'No follow-up records found matching this filter.'}
          </p>
          <button
            onClick={() => setActiveTab('All')}
            className="px-4 py-2 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-xl shadow transition-colors"
          >
            View All Follow-Ups
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFollowUps.map(item => {
            const statusStyle = getStatusChip(item.status);
            const hr = hrs.find(h => h.id === item.hrId) || { name: item.hrName, companyName: item.companyName };

            return (
              <div
                key={item.id}
                className="bg-white hover:bg-cream border-2 border-olive/50 hover:border-primary rounded-3xl p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top Status & Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full border ${statusStyle.bg}`}>
                      {statusStyle.label}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-darkText">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{formatNiceDate(item.date)} ({item.time || '10:30 AM'})</span>
                    </div>
                  </div>

                  {/* HR & Company */}
                  <h3 className="font-extrabold text-base text-darkText">
                    {item.hrName}
                  </h3>
                  <p className="text-xs font-bold text-darkText/70 mb-2">
                    {item.companyName}
                  </p>

                  {/* Purpose Box */}
                  <p className="text-xs text-darkText font-medium bg-cream p-3 rounded-2xl border border-olive/40 leading-relaxed italic">
                    "{item.purpose}"
                  </p>

                  {/* Priority Pill */}
                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-darkText/70 font-bold">Priority Level:</span>
                    <span className={`
                      font-bold px-2 py-0.5 rounded-md text-[10px] uppercase
                      ${item.priority === 'High' ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-olive/30 text-darkText border border-olive/50'}
                    `}>
                      {item.priority || 'Medium'} Priority
                    </span>
                  </div>
                </div>

                {/* Quick Actions Footer */}
                <div className="pt-3 border-t border-olive/40 grid grid-cols-2 gap-2">
                  {item.status !== 'Completed' && item.status !== 'MISSED' && (
                    <button
                      onClick={() => markFollowUpComplete(item.id)}
                      className="py-2.5 px-3 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Done</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setRescheduleTarget(item);
                      setNewDate(todayStr);
                      setNewTime(item.time || '10:30 AM');
                    }}
                    className={`
                      py-2.5 px-3 bg-cream border border-olive hover:bg-olive/30 text-darkText font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors
                      ${item.status === 'Completed' || item.status === 'MISSED' ? 'col-span-2' : ''}
                    `}
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

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-primary rounded-3xl max-w-sm w-full p-6 shadow-modal-custom space-y-4">
            <div className="flex items-center justify-between border-b border-olive/40 pb-3">
              <div>
                <h3 className="font-bold text-base text-darkText">Reschedule Follow-Up</h3>
                <span className="text-xs text-darkText/70">{rescheduleTarget.hrName} ({rescheduleTarget.companyName})</span>
              </div>
              <button onClick={() => setRescheduleTarget(null)} className="text-xs font-bold text-darkText/70 hover:text-darkText">✕</button>
            </div>

            {rescheduleError && (
              <div className="p-3 bg-red-100 text-red-900 text-xs font-bold rounded-xl border border-red-300">
                ⚠️ {rescheduleError}
              </div>
            )}

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-darkText mb-1">New Date (Must be today or future)</label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={newDate}
                  onChange={e => {
                    setNewDate(e.target.value);
                    setRescheduleError('');
                  }}
                  className="w-full text-xs p-3 bg-cream border border-olive/50 rounded-xl outline-none font-bold text-darkText focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-darkText mb-1">New Time</label>
                <input
                  type="text"
                  required
                  value={newTime}
                  onChange={e => {
                    setNewTime(e.target.value);
                    setRescheduleError('');
                  }}
                  placeholder="10:30 AM"
                  className="w-full text-xs p-3 bg-cream border border-olive/50 rounded-xl outline-none font-bold text-darkText focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleTarget(null)}
                  className="px-3 py-2 text-xs font-bold text-darkText/70 hover:text-darkText transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-accent text-darkText text-xs font-bold rounded-xl shadow transition-all"
                >
                  ✓ Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <ScheduleFollowUpModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
};
