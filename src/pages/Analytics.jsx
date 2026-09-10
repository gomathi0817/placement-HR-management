import React from 'react';
import { MOCK_ANALYTICS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Phone, MessageCircle, Mail, Users, CheckCircle2, AlertTriangle, Clock, Building2, Award, BarChart3 } from 'lucide-react';

export const Analytics = () => {
  const { hrs, companies, followUps, interactions } = useApp();

  const totalInteractions = interactions.length + 35;
  const callsCount = 18;
  const whatsappCount = 12;
  const emailCount = 7;
  const meetingCount = 3;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-darkText">
            Placement Communication Analytics
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-darkText/70 mt-1">
            Performance metrics for recruiter outreach, follow-up resolutions, and campus placement drives.
          </p>
        </div>

        <div className="bg-cream p-3 rounded-2xl border border-olive/40 font-bold text-xs text-darkText flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span>Academic Year 2026-27</span>
        </div>
      </div>

      {/* Analytics Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 1: HR Communication breakdown */}
        <div className="bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom space-y-4">
          <div className="border-b border-olive/40 pb-3">
            <h2 className="font-extrabold text-base text-darkText">
              HR Communication Channels
            </h2>
            <span className="text-xs text-darkText/70 font-semibold">
              Total {totalInteractions} Interactions Logged
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: "Phone Calls", count: callsCount, pct: 45, icon: Phone, color: "bg-primary text-darkText" },
              { label: "WhatsApp Messages", count: whatsappCount, pct: 30, icon: MessageCircle, color: "bg-accent text-darkText" },
              { label: "Official Emails", count: emailCount, pct: 17, icon: Mail, color: "bg-olive text-darkText" },
              { label: "Campus Meetings", count: meetingCount, pct: 8, icon: Users, color: "bg-primary/60 text-darkText" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-darkText">
                      <Icon className="w-3.5 h-3.5 text-primary" /> {item.label}
                    </span>
                    <span className="text-darkText/70">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-3 bg-cream rounded-full overflow-hidden border border-olive/40">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Follow-Up Performance */}
        <div className="bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom space-y-4">
          <div className="border-b border-olive/40 pb-3">
            <h2 className="font-extrabold text-base text-darkText">
              Follow-Up Resolutions
            </h2>
            <span className="text-xs text-darkText/70 font-semibold">
              Action Status Breakdown
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: "Completed Follow-Ups", count: 26, color: "bg-olive" },
              { label: "Upcoming Scheduled", count: 8, color: "bg-primary" },
              { label: "Waiting for Response", count: 7, color: "bg-accent" },
              { label: "Pending Action", count: 5, color: "bg-olive/60" },
              { label: "Overdue Needs Attention", count: 3, color: "bg-red-600" }
            ].map((st, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-cream rounded-2xl border border-olive/40 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${st.color}`} />
                  <span className="text-darkText">{st.label}</span>
                </div>
                <span className="text-darkText bg-white px-2.5 py-0.5 rounded-lg border border-olive/40 font-black">
                  {st.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Recruitment Outcome Analytics */}
        <div className="bg-primary text-darkText rounded-3xl p-6 shadow-card-custom flex flex-col justify-between space-y-4">
          <div>
            <div className="border-b border-darkText/20 pb-3 mb-4">
              <h2 className="font-extrabold text-base text-darkText">
                Campus Drive Impact
              </h2>
              <span className="text-xs text-darkText/80 font-semibold">
                Placement Targets & Hiring
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center mb-4">
              <div className="bg-cream/40 p-3 rounded-2xl border border-olive/40">
                <span className="text-2xl font-black text-darkText block">195</span>
                <span className="text-[10px] font-bold uppercase text-darkText/80">Students Required</span>
              </div>

              <div className="bg-cream/40 p-3 rounded-2xl border border-olive/40">
                <span className="text-2xl font-black text-accent block">84</span>
                <span className="text-[10px] font-bold uppercase text-darkText/80">Selected So Far</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between py-1 border-b border-darkText/20">
                <span>Active Participating Companies:</span>
                <span className="font-bold text-darkText">18 Companies</span>
              </div>
              <div className="flex justify-between py-1 border-b border-darkText/20">
                <span>Completed Placement Drives:</span>
                <span className="font-bold text-darkText">12 Drives</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Average Package (CTC):</span>
                <span className="font-extrabold text-accent">5.8 LPA</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-cream/50 rounded-2xl border border-olive/40 text-center text-xs font-bold text-darkText">
            Placement Rate: 43.1% (In Progress)
          </div>
        </div>
      </div>
    </div>
  );
};
