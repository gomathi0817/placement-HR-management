import React, { useState } from 'react';
import { Bell, Phone, CheckCircle2, Calendar, X, Mail, MessageCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReminderModal = () => {
  const { activeReminder, setActiveReminder, markFollowUpComplete, rescheduleFollowUp } = useApp();
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:30 AM');
  const [showContactMenu, setShowContactMenu] = useState(false);

  if (!activeReminder) return null;

  const { followUp, hr } = activeReminder;

  const handleComplete = () => {
    markFollowUpComplete(followUp.id);
    setActiveReminder(null);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!newDate) return;
    rescheduleFollowUp(followUp.id, newDate, newTime);
    setActiveReminder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border-2 border-primary rounded-3xl max-w-md w-full overflow-hidden shadow-modal-custom transform transition-all animate-scaleUp">
        {/* Header Bar */}
        <div className="bg-primary text-darkText p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-darkText text-cream flex items-center justify-center font-bold animate-bounce shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Placement Follow-Up Reminder</h3>
              <span className="text-[11px] text-darkText/80 font-medium">Active Action Alert</span>
            </div>
          </div>
          <button
            onClick={() => setActiveReminder(null)}
            className="w-8 h-8 rounded-full bg-darkText/10 hover:bg-darkText/20 text-darkText flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 bg-gradient-to-b from-cream to-white">
          {/* HR Profile Banner */}
          <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-olive/30 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-primary text-darkText font-black text-xl flex items-center justify-center border-2 border-olive shadow-sm">
              {followUp.hrName ? followUp.hrName.charAt(0).toUpperCase() : 'H'}
            </div>
            <div>
              <h4 className="font-bold text-base text-darkText leading-tight">
                {followUp.hrName}
              </h4>
              <p className="text-xs font-semibold text-darkText/70">
                {followUp.companyName}
              </p>
              <span className="inline-block mt-1 text-[10px] font-bold bg-primary/30 text-darkText px-2 py-0.5 rounded-md">
                {hr?.designation || "Talent Acquisition Lead"}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="bg-cream border border-olive/40 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-olive/20">
              <span className="font-bold text-darkText/70 uppercase text-[10px]">Action Required</span>
              <span className="font-bold text-darkText bg-primary/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Phone className="w-3 h-3" /> Call HR
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-darkText/70">Scheduled Time:</span>
              <span className="font-bold text-darkText flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-accent" /> {followUp.time || "10:30 AM"}
              </span>
            </div>

            <div>
              <span className="font-bold text-darkText/70 block mb-1">Purpose:</span>
              <p className="text-sm font-semibold text-darkText bg-white p-2.5 rounded-xl border border-olive/30">
                "{followUp.purpose}"
              </p>
            </div>
          </div>

          {/* Reschedule Form Toggle */}
          {showReschedule ? (
            <form onSubmit={handleRescheduleSubmit} className="bg-white p-3 rounded-2xl border border-olive space-y-2">
              <span className="text-xs font-bold text-darkText block">Select New Date & Time</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full text-xs p-2 border border-olive rounded-lg bg-cream text-darkText focus:border-primary"
                />
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="10:30 AM"
                  className="w-full text-xs p-2 border border-olive rounded-lg bg-cream text-darkText focus:border-primary"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowReschedule(false)}
                  className="px-3 py-1.5 text-xs text-darkText/70 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-darkText text-xs font-bold rounded-lg shadow hover:bg-accent transition-colors"
                >
                  Save Reschedule
                </button>
              </div>
            </form>
          ) : showContactMenu ? (
            <div className="bg-white p-3.5 rounded-2xl border border-olive space-y-2 animate-fadeIn">
              <span className="text-xs font-bold text-darkText block">Choose Contact Method</span>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tel:${hr?.phone || '+919876543210'}`}
                  className="flex flex-col items-center justify-center p-2.5 bg-emerald-50 text-emerald-800 rounded-xl hover:bg-emerald-100 font-bold text-xs border border-emerald-200"
                >
                  <Phone className="w-4 h-4 mb-1" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${hr?.phone ? hr.phone.replace(/[^0-9]/g, '') : '919876543210'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center p-2.5 bg-emerald-50 text-emerald-800 rounded-xl hover:bg-emerald-100 font-bold text-xs border border-emerald-200"
                >
                  <MessageCircle className="w-4 h-4 mb-1 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`mailto:${hr?.email || 'hr@example.com'}`}
                  className="flex flex-col items-center justify-center p-2.5 bg-blue-50 text-blue-800 rounded-xl hover:bg-blue-100 font-bold text-xs border border-blue-200"
                >
                  <Mail className="w-4 h-4 mb-1 text-blue-600" />
                  <span>Email</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => setShowContactMenu(false)}
                className="w-full text-center text-xs font-semibold text-darkText/70 pt-1"
              >
                Back to options
              </button>
            </div>
          ) : null}

          {/* Action Buttons */}
          {!showReschedule && !showContactMenu && (
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowContactMenu(true)}
                className="py-3 px-2 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call HR</span>
              </button>

              <button
                type="button"
                onClick={handleComplete}
                className="py-3 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Done</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReschedule(true)}
                className="py-3 px-2 bg-cream border border-olive hover:bg-olive/30 text-darkText font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Reschedule</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
