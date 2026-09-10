import React from 'react';
import { Calendar, ArrowRight, Clock, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

export const HRRelationshipPulse = ({ hr }) => {
  if (!hr) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle2, label: 'Active Relationship' };
      case 'Waiting for Response':
        return { bg: 'bg-purple-100 text-purple-800 border-purple-300', icon: Clock, label: 'Waiting for HR' };
      case 'Follow-Up Scheduled':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-300', icon: Calendar, label: 'Follow-Up Scheduled' };
      default:
        return { bg: 'bg-blue-100 text-blue-800 border-blue-300', icon: Activity, label: status || 'Active' };
    }
  };

  const statusStyle = getStatusBadge(hr.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div className="bg-white border-2 border-olive/50 rounded-2xl p-4 shadow-card-custom my-4">
      <div className="flex items-center justify-between mb-3 border-b border-olive/20 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-darkText" />
          <span className="text-xs font-bold uppercase tracking-wider text-darkText">
            HR Relationship Pulse
          </span>
        </div>
        <span className="text-[11px] font-semibold text-darkText bg-primary/30 px-2 py-0.5 rounded-full">
          Live Status
        </span>
      </div>

      {/* Pulse Flow Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center relative">
        {/* Step 1: Last Contact */}
        <div className="flex items-center gap-3 bg-cream p-3 rounded-xl border border-olive/30">
          <div className="w-9 h-9 rounded-lg bg-olive/30 text-darkText flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-darkText/70 uppercase tracking-wider block">
              Last Contact
            </span>
            <span className="text-sm font-bold text-darkText">
              {hr.lastContactDate || 'No recent log'}
            </span>
          </div>
        </div>

        {/* Transition Arrow Desktop */}
        <div className="hidden md:flex justify-center text-darkText">
          <ArrowRight className="w-5 h-5 text-olive animate-pulse" />
        </div>

        {/* Step 2: Current Status */}
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${statusStyle.bg}`}>
          <div className="w-9 h-9 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
            <StatusIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
              Current Status
            </span>
            <span className="text-sm font-bold">
              {hr.status || 'Active'}
            </span>
          </div>
        </div>

        {/* Transition Arrow Desktop */}
        <div className="hidden md:flex justify-center text-darkText">
          <ArrowRight className="w-5 h-5 text-olive animate-pulse" />
        </div>

        {/* Step 3: Next Follow-Up / Action */}
        <div className="flex items-center gap-3 bg-primary text-darkText p-3 rounded-xl shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-darkText/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-darkText" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-darkText/80 block">
              Next Action
            </span>
            <span className="text-sm font-bold text-darkText">
              {hr.nextFollowUpDate ? `${hr.nextFollowUpDate} (${hr.nextFollowUpTime || '10:00 AM'})` : 'Schedule Action'}
            </span>
          </div>
        </div>
      </div>

      {hr.nextFollowUpPurpose && (
        <div className="mt-3 pt-2 border-t border-olive/20 text-xs text-darkText font-medium flex items-center gap-2">
          <span className="font-bold text-darkText">Target Goal:</span>
          <span className="italic">{hr.nextFollowUpPurpose}</span>
        </div>
      )}
    </div>
  );
};
