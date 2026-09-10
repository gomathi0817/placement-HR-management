import React from 'react';
import { Phone, MessageCircle, Mail, Users, Calendar, Clock, CheckCircle2, FileText, ChevronRight, AlertTriangle } from 'lucide-react';
import { formatNiceDate } from '../utils/dateUtils';

export const ConversationTimeline = ({ interactions = [], followUps = [] }) => {
  const combinedTimeline = [
    ...interactions.map(item => ({
      ...item,
      timelineType: 'interaction',
      sortDate: new Date(item.date).getTime() || 0
    })),
    ...followUps.map(item => ({
      ...item,
      timelineType: 'followUp',
      sortDate: new Date(item.date).getTime() || 0
    }))
  ].sort((a, b) => b.sortDate - a.sortDate);

  const getMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'call':
        return { icon: Phone, color: 'bg-emerald-100 text-emerald-800 border-emerald-300', badge: '📞 Call' };
      case 'whatsapp':
        return { icon: MessageCircle, color: 'bg-emerald-50 text-emerald-700 border-emerald-300', badge: '💬 WhatsApp' };
      case 'email':
        return { icon: Mail, color: 'bg-blue-100 text-blue-800 border-blue-300', badge: '✉ Email' };
      case 'meeting':
        return { icon: Users, color: 'bg-purple-100 text-purple-800 border-purple-300', badge: '👥 Meeting' };
      default:
        return { icon: Calendar, color: 'bg-amber-100 text-amber-800 border-amber-300', badge: '📅 Scheduled' };
    }
  };

  if (combinedTimeline.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-olive/50 rounded-2xl p-8 text-center my-4">
        <FileText className="w-10 h-10 text-olive mx-auto mb-2 opacity-60" />
        <h4 className="font-bold text-sm text-darkText">No Timeline Entries Yet</h4>
        <p className="text-xs text-darkText/70 mt-1">Log calls, emails, or WhatsApp messages to start building the HR relationship history.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-olive/40 rounded-2xl p-5 shadow-card-custom my-4">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-olive/20">
        <div>
          <h3 className="font-bold text-base text-darkText">Conversation Timeline</h3>
          <p className="text-xs text-darkText/70">Complete chronologic relationship & follow-up record</p>
        </div>
        <span className="text-xs font-bold bg-cream text-darkText border border-olive/40 px-3 py-1 rounded-full">
          {combinedTimeline.length} Entries
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-olive before:to-transparent">
        {combinedTimeline.map((item, index) => {
          const isInteraction = item.timelineType === 'interaction';
          const methodInfo = getMethodIcon(isInteraction ? item.method : 'scheduled');
          const Icon = methodInfo.icon;
          const isMissed = item.status === 'MISSED' || item.status === 'Overdue';

          return (
            <div key={item.id || index} className="relative group">
              {/* Timeline Bullet Node */}
              <div className={`
                absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110 z-10
                ${isMissed
                  ? 'bg-red-600 text-white'
                  : isInteraction
                    ? 'bg-primary text-darkText'
                    : 'bg-olive text-darkText'
                }
              `}>
                {isMissed ? <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" /> : <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
              </div>

              {/* Item Card */}
              <div className={`
                border rounded-2xl p-4 transition-all shadow-xs hover:shadow-md
                ${isMissed ? 'bg-red-50/70 border-red-300' : 'bg-cream/60 hover:bg-cream border-olive/30'}
              `}>
                {/* Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-darkText bg-white px-2.5 py-0.5 rounded-md border border-olive/30">
                      {formatNiceDate(item.date)}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${methodInfo.color}`}>
                      {methodInfo.badge}
                    </span>
                  </div>

                  {!isInteraction && (
                    <span className={`
                      text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md
                      ${item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : isMissed ? 'bg-red-200 text-red-900 font-black' : 'bg-amber-100 text-amber-800'}
                    `}>
                      {item.status === 'Completed' ? '🟢 Completed' : isMissed ? '🔴 Follow-Up Missed' : '🟡 Follow-Up Due'}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-bold text-sm text-darkText mb-1">
                  {isInteraction ? (item.title || "HR Discussion") : `Scheduled Follow-Up: ${item.purpose}`}
                </h4>

                {/* Content text */}
                {isInteraction ? (
                  <p className="text-xs text-darkText leading-relaxed mb-2 font-medium">
                    "{item.summary}"
                  </p>
                ) : (
                  <p className="text-xs text-darkText/70 italic mb-2">
                    Target Goal: {item.purpose} {item.time && `at ${item.time}`}
                  </p>
                )}

                {/* Details Pills */}
                {isInteraction && (item.studentsRequired > 0 || item.recruitmentProcess || item.nextAction) && (
                  <div className="mt-3 pt-2.5 border-t border-olive/20 space-y-1.5 text-[11px]">
                    {item.studentsRequired > 0 && (
                      <div className="flex items-center gap-1.5 text-darkText">
                        <span className="font-bold">Students Required:</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-olive/30 font-semibold">{item.studentsRequired} Candidates</span>
                      </div>
                    )}
                    {item.recruitmentProcess && (
                      <div className="text-darkText">
                        <span className="font-bold text-darkText">Process:</span> {item.recruitmentProcess}
                      </div>
                    )}
                    {item.nextAction && (
                      <div className="text-accent font-semibold flex items-center gap-1">
                        <span>Next Step:</span> {item.nextAction}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
