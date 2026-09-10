import React, { useState } from 'react';
import { X, Mail, Copy, Check, Send, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmailComposerModal = ({ isOpen, onClose, hr }) => {
  const { showToast } = useApp();

  const templates = [
    {
      id: 'slot_request',
      title: 'Campus Drive Slot Confirmation Request',
      subject: `Campus Recruitment Drive 2026-27 — Slot Confirmation Request [GV College]`,
      body: `Dear ${hr?.name || 'HR Lead'},\n\nGreetings from the Training & Placement Cell, GV College of Engineering.\n\nWe would like to formally request your preferred dates for conducting the Campus Placement Drive for the 2026-27 passing out batch.\n\nWe have over 400+ eligible candidates in CSE, ECE, IT, and Mechanical branches. Our air-conditioned computing labs (300+ systems) and auditorium are fully reserved for your placement team.\n\nKindly confirm your preferred dates at your earliest convenience.\n\nWarm regards,\nProf. R. Venkatesh\nChief Placement Officer\nGV College of Engineering`
    },
    {
      id: 'ppt_booking',
      title: 'Pre-Placement Talk (PPT) Invitation',
      subject: `Invitation for Pre-Placement Talk (PPT) & Company Interaction — GV College`,
      body: `Dear ${hr?.name || 'Recruiter'},\n\nWe are delighted to invite ${hr?.companyName || 'your esteemed organization'} to conduct an interactive Pre-Placement Talk (PPT) with our final-year engineering students.\n\nWe can arrange full audio-visual facilities, guest accommodation, and student registration management.\n\nPlease let us know if 10:30 AM next Thursday suits your team's schedule.\n\nBest regards,\nPlacement Cell, GV College`
    },
    {
      id: 'mou_partnership',
      title: 'Annual Placement Partnership & MOU Request',
      subject: `Industry Placement Partnership & MOU Proposal — ${hr?.companyName || 'Company'} & GV College`,
      body: `Dear ${hr?.name || 'Talent Acquisition Manager'},\n\nThank you for your continued support in recruiting from GV College. We wish to finalize the annual placement partnership MOU for hiring full-time engineers and 6-month interns.\n\nAttached is the revised draft MOU approved by our leadership.\n\nLooking forward to hearing from you.\n\nSincerely,\nProf. R. Venkatesh\nGV Placement Office`
    }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [subject, setSubject] = useState(templates[0].subject);
  const [body, setBody] = useState(templates[0].body);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !hr) return null;

  const handleTemplateChange = (tpl) => {
    setSelectedTemplate(tpl);
    setSubject(tpl.subject);
    setBody(tpl.body);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    showToast("✓ Email draft copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSend = () => {
    window.location.href = `mailto:${hr.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast("✓ Opened mail client with pre-filled message!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border-2 border-primary rounded-3xl max-w-xl w-full overflow-hidden shadow-modal-custom flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-primary text-darkText p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-darkText text-cream flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Quick Email Composer</h3>
              <span className="text-[11px] text-darkText/80 font-medium">Pre-filled placement templates for {hr.name} ({hr.companyName})</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-darkText/10 text-darkText hover:bg-darkText/20 flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Selector Pills */}
        <div className="p-4 bg-cream border-b border-olive/30 flex items-center gap-2 overflow-x-auto">
          <Sparkles className="w-4 h-4 text-darkText flex-shrink-0" />
          {templates.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => handleTemplateChange(tpl)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                ${selectedTemplate.id === tpl.id 
                  ? 'bg-primary text-darkText border-primary' 
                  : 'bg-white text-darkText/70 border-olive/40 hover:bg-cream'
                }
              `}
            >
              {tpl.title}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-white">
          <div>
            <label className="block text-xs font-bold text-darkText mb-1">To Email</label>
            <input
              type="text"
              disabled
              value={`${hr.name} <${hr.email}>`}
              className="w-full text-xs p-2.5 bg-cream border border-olive/50 rounded-xl font-bold text-darkText"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-darkText mb-1">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full text-xs p-2.5 border border-olive/50 rounded-xl outline-none font-bold text-darkText focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-darkText mb-1">Message Body</label>
            <textarea
              rows={8}
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full text-xs p-3 border border-olive/50 rounded-xl outline-none leading-relaxed font-sans text-darkText focus:border-primary"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-cream border-t border-olive/30 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-white border border-olive text-darkText font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 hover:bg-olive/20 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Template'}</span>
          </button>

          <button
            type="button"
            onClick={handleSend}
            className="px-6 py-2.5 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Open Email Client & Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
