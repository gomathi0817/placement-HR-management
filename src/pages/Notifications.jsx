import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, AlertTriangle, Clock, CheckCircle2, Phone, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Notifications = () => {
  const { notifications, followUps, hrs, setActiveReminder } = useApp();
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-darkText">
            Notification & Action Alerts
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-darkText/70 mt-1">
            Real-time alerts for scheduled follow-ups, overdue items, and recruiter responses.
          </p>
        </div>

        <div className="bg-accent/20 text-darkText border border-accent px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto">
          <Bell className="w-4 h-4" />
          <span>{notifications.length} Active Alerts</span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Bell className="w-12 h-12 text-primary mx-auto opacity-70" />
            <h3 className="font-bold text-base text-darkText">No Notifications Right Now</h3>
            <p className="text-xs text-darkText/70">You're all caught up with your placement follow-up reminders.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notif => {
              const isOverdue = notif.type === 'overdue';
              const relatedFollowUp = followUps.find(f => f.hrName === notif.hrName) || followUps[0];
              const hr = hrs.find(h => h.name === notif.hrName) || { name: notif.hrName, companyName: notif.companyName };

              return (
                <div
                  key={notif.id}
                  className={`
                    p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all
                    ${isOverdue 
                      ? 'bg-red-50 border-red-300 text-red-950' 
                      : 'bg-cream border-olive/50 text-darkText'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 mt-0.5
                      ${isOverdue ? 'bg-red-600 text-white' : 'bg-primary text-darkText'}
                    `}>
                      {isOverdue ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-olive/40 text-darkText">
                          {notif.time}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-darkText/70 mt-0.5">
                        <span className="font-bold text-darkText">{notif.hrName}</span> — {notif.companyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0 self-end sm:self-auto">
                    {relatedFollowUp && (
                      <button
                        onClick={() => setActiveReminder({ followUp: relatedFollowUp, hr })}
                        className="px-4 py-2 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Action Now</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
