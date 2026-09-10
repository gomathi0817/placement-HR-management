import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HRRelationshipPulse } from '../components/HRRelationshipPulse';
import { ConversationTimeline } from '../components/ConversationTimeline';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Plus, 
  Clock, 
  Building2, 
  Briefcase, 
  Users, 
  MapPin, 
  ChevronLeft, 
  Award, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AddInteractionModal } from '../components/modals/AddInteractionModal';
import { ScheduleFollowUpModal } from '../components/modals/ScheduleFollowUpModal';
import { formatNiceDate } from '../utils/dateUtils';

export const HRProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hrs, interactions, followUps } = useApp();

  const [isAddInteractionOpen, setIsAddInteractionOpen] = useState(false);
  const [isScheduleFollowUpOpen, setIsScheduleFollowUpOpen] = useState(false);

  const hr = hrs.find(h => h.id === id) || hrs[0];

  const getHRInitial = (name) => {
    const trimmedName = (name || '').trim();
    if (!trimmedName) return '?';
    return trimmedName.charAt(0).toUpperCase();
  };

  if (!hr) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-darkText">HR Contact Not Found</h2>
        <button onClick={() => navigate('/hr')} className="px-4 py-2 bg-primary text-darkText rounded-xl text-xs font-bold hover:bg-accent transition-colors">
          Back to HR Contacts
        </button>
      </div>
    );
  }

  // Filter timeline items for this specific HR
  const hrInteractions = interactions.filter(i => i.hrId === hr.id || i.hrName === hr.name);
  const hrFollowUps = followUps.filter(f => f.hrId === hr.id || f.hrName === hr.name);
  const missedCount = hrFollowUps.filter(f => f.status === 'MISSED' || f.status === 'Overdue').length;
  const latestFollowUp = hrFollowUps[0] || null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">
      {/* Top Back Navigation */}
      <button
        onClick={() => navigate('/hr')}
        className="inline-flex items-center gap-1 text-xs font-bold text-darkText/70 hover:text-darkText transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to HR Contacts Directory</span>
      </button>

      {/* HR Profile Header Card */}
      <div className="bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-olive/40 pb-5">
          {/* Profile details */}
          <div className="flex items-start sm:items-center gap-4">
            <div
              className="
                w-16 h-16 sm:w-20 sm:h-20
                rounded-2xl
                flex-shrink-0
                flex items-center justify-center
                bg-primary
                text-darkText
                border-2 border-olive
                font-black
                text-2xl sm:text-3xl
                uppercase
                shadow-sm
              "
              aria-label={`Profile of ${hr.name || 'Unknown HR'}`}
            >
              {getHRInitial(hr.name)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-darkText">
                  {hr.name}
                </h1>
                <span className={`
                  text-xs font-extrabold px-3 py-0.5 rounded-full border
                  ${hr.status === 'Active' ? 'bg-olive/30 text-darkText border-olive' : 'bg-accent/20 text-darkText border-accent'}
                `}>
                  {hr.status}
                </span>

                {missedCount > 0 && (
                  <span className="text-xs font-black px-3 py-0.5 rounded-full bg-red-100 text-red-900 border border-red-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-700" />
                    <span>Missed Follow-Ups: {missedCount}</span>
                  </span>
                )}
              </div>

              <h2 className="text-sm font-bold text-darkText/70">
                {hr.companyName}
              </h2>
              <p className="text-xs text-darkText/70 font-semibold mt-0.5">
                {hr.designation}
              </p>
            </div>
          </div>

          {/* Quick Outreach Action Triggers */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <a
              href={`tel:${hr.phone}`}
              className="px-4 py-2.5 bg-olive hover:bg-olive/80 text-darkText font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call HR</span>
            </a>

            <a
              href={`https://wa.me/${hr.phone ? hr.phone.replace(/[^0-9]/g, '') : ''}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-accent hover:bg-accent/80 text-darkText font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`mailto:${hr.email}`}
              className="px-4 py-2.5 bg-cream hover:bg-olive/30 text-darkText border border-olive font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email HR</span>
            </a>

            <button
              onClick={() => setIsAddInteractionOpen(true)}
              className="px-4 py-2.5 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Interaction</span>
            </button>
          </div>
        </div>

        {/* Contact Info Pills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="bg-cream p-3 rounded-2xl border border-olive/40 text-xs space-y-1">
            <span className="font-bold text-darkText/70 uppercase text-[10px] block">Phone Number</span>
            <div className="font-extrabold text-darkText">{hr.phone}</div>
          </div>

          <div className="bg-cream p-3 rounded-2xl border border-olive/40 text-xs space-y-1">
            <span className="font-bold text-darkText/70 uppercase text-[10px] block">Email Address</span>
            <div className="font-extrabold text-darkText truncate">{hr.email}</div>
          </div>

          <div className="bg-cream p-3 rounded-2xl border border-olive/40 text-xs space-y-1">
            <span className="font-bold text-darkText/70 uppercase text-[10px] block">Missed Follow-Ups</span>
            <div className="font-extrabold text-red-700">{missedCount} Missed</div>
          </div>

          <div className="bg-cream p-3 rounded-2xl border border-olive/40 text-xs space-y-1">
            <span className="font-bold text-darkText/70 uppercase text-[10px] block">Latest Follow-Up</span>
            <div className="font-extrabold text-darkText">
              {latestFollowUp ? `${formatNiceDate(latestFollowUp.date)} (${latestFollowUp.status})` : 'None'}
            </div>
          </div>
        </div>

        {/* Company & Recruitment Requirements Section */}
        {hr.companyInfo && (
          <div className="bg-cream/60 border-2 border-olive/40 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-olive/40 pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <h3 className="font-extrabold text-sm text-darkText">
                  Recruitment Requirements & Package Details
                </h3>
              </div>
              <span className="text-[11px] font-bold text-darkText bg-olive/30 border border-olive px-2.5 py-0.5 rounded-full">
                {hr.companyInfo.currentStatus || 'Active Drive'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-darkText/70 uppercase block">Recruitment Type</span>
                <span className="font-bold text-darkText">{hr.companyInfo.recruitmentType}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-darkText/70 uppercase block">Students Required</span>
                <span className="font-black text-darkText text-sm">{hr.companyInfo.studentsRequired} Candidates</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-darkText/70 uppercase block">Job Location</span>
                <span className="font-bold text-darkText">{hr.companyInfo.location}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-darkText/70 uppercase block">Package / Stipend</span>
                <span className="font-bold text-accent">{hr.companyInfo.pkgDetails || 'Competitive CTC'}</span>
              </div>
            </div>

            {hr.companyInfo.jobRoles && (
              <div className="pt-2 border-t border-olive/30 text-xs">
                <span className="font-bold text-darkText block mb-1">Offered Job Roles:</span>
                <div className="flex flex-wrap gap-1.5">
                  {hr.companyInfo.jobRoles.map((role, rIdx) => (
                    <span key={rIdx} className="bg-white text-darkText font-bold px-2.5 py-1 rounded-lg border border-olive/40 text-[11px]">
                      🎯 {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* HR RELATIONSHIP PULSE SIGNATURE COMPONENT */}
      <HRRelationshipPulse hr={hr} />

      {/* CONVERSATION TIMELINE SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-darkText">
            Relationship History
          </h2>

          <button
            onClick={() => setIsScheduleFollowUpOpen(true)}
            className="px-4 py-2 bg-cream border-2 border-olive hover:border-primary text-darkText font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Schedule Follow-Up</span>
          </button>
        </div>

        <ConversationTimeline interactions={hrInteractions} followUps={hrFollowUps} />
      </div>

      {/* Modals */}
      <AddInteractionModal
        isOpen={isAddInteractionOpen}
        onClose={() => setIsAddInteractionOpen(false)}
        defaultHrId={hr.id}
      />

      <ScheduleFollowUpModal
        isOpen={isScheduleFollowUpOpen}
        onClose={() => setIsScheduleFollowUpOpen(false)}
        defaultHrId={hr.id}
      />
    </div>
  );
};
