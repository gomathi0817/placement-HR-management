import React, { useState } from 'react';
import { X, Mic, Phone, MessageCircle, Mail, Users, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VoiceNoteRecorder } from '../VoiceNoteRecorder';

export const AddInteractionModal = ({ isOpen, onClose, defaultHrId = '' }) => {
  const { hrs, addInteraction } = useApp();

  const [selectedHrId, setSelectedHrId] = useState(defaultHrId || (hrs[0] ? hrs[0].id : ''));
  const [method, setMethod] = useState('Call'); // Call, WhatsApp, Email, Meeting
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('Campus Recruitment Discussion');
  const [summary, setSummary] = useState('');
  const [studentsRequired, setStudentsRequired] = useState(25);
  const [recruitmentProcess, setRecruitmentProcess] = useState('');
  const [importantNotes, setImportantNotes] = useState('');
  const [nextAction, setNextAction] = useState('Call HR regarding interview schedule');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('10:30 AM');

  if (!isOpen) return null;

  const currentHR = hrs.find(h => h.id === selectedHrId) || hrs[0];

  const handleVoiceNoteConverted = (text) => {
    setSummary(prev => prev ? `${prev}\n\n${text}` : text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!summary.trim()) return;

    addInteraction({
      hrId: currentHR ? currentHR.id : '',
      hrName: currentHR ? currentHR.name : '',
      companyName: currentHR ? currentHR.companyName : '',
      date,
      method,
      title,
      summary,
      studentsRequired,
      recruitmentProcess,
      importantNotes,
      nextAction,
      followUpDate,
      followUpTime
    });

    onClose();
  };

  const methods = [
    { id: 'Call', icon: Phone, label: 'Call' },
    { id: 'WhatsApp', icon: MessageCircle, label: 'WhatsApp' },
    { id: 'Email', icon: Mail, label: 'Email' },
    { id: 'Meeting', icon: Users, label: 'Meeting' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border-2 border-primary rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-modal-custom flex flex-col">
        {/* Header */}
        <div className="bg-primary text-darkText p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-darkText text-cream flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h3 className="font-bold text-base">Record HR Interaction</h3>
              <span className="text-[11px] text-darkText/80 font-medium">Log conversation notes & process details</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-darkText/10 text-darkText flex items-center justify-center hover:bg-darkText/20 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto bg-cream/40 flex-1">
          {/* HR & Company Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-darkText mb-1">
                Select HR Contact <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedHrId}
                onChange={e => setSelectedHrId(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-olive/50 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-darkText"
              >
                {hrs.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name} — {h.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-darkText mb-1">
                Company (Auto-populated)
              </label>
              <input
                type="text"
                disabled
                value={currentHR ? currentHR.companyName : ''}
                className="w-full text-xs p-3 bg-cream border border-olive/40 rounded-xl font-bold text-darkText"
              />
            </div>
          </div>

          {/* Interaction Date & Communication Method Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-bold text-darkText mb-1">
                Interaction Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-olive/50 rounded-xl outline-none text-darkText"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-darkText mb-1">
                Communication Method
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {methods.map(m => {
                  const Icon = m.icon;
                  const isSelected = method === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`
                        p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 border transition-all
                        ${isSelected
                          ? 'bg-primary text-darkText border-primary shadow-xs'
                          : 'bg-white text-darkText/70 border-olive/50 hover:bg-cream'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Integrated Voice Note Component */}
          <VoiceNoteRecorder onTextConverted={handleVoiceNoteConverted} />

          {/* Discussion Summary */}
          <div>
            <label className="block text-xs font-bold text-darkText mb-1">
              Discussion Summary <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Record main topics, requirements, candidate profiles requested..."
              value={summary}
              onChange={e => setSummary(e.target.value)}
              className="w-full text-xs p-3 bg-white border border-olive/50 rounded-xl focus:ring-2 focus:ring-primary outline-none text-darkText"
            />
          </div>

          {/* Detailed Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-darkText mb-1">
                Students Required
              </label>
              <input
                type="number"
                value={studentsRequired}
                onChange={e => setStudentsRequired(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-olive/50 rounded-xl outline-none text-darkText"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-darkText mb-1">
                Next Action / Follow-Up Goal
              </label>
              <input
                type="text"
                placeholder="e.g. Call HR regarding interview schedule"
                value={nextAction}
                onChange={e => setNextAction(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-olive/50 rounded-xl outline-none text-darkText"
              />
            </div>
          </div>

          {/* Next Action Follow Up Scheduling */}
          <div className="p-3 bg-cream border border-olive/60 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-darkText block">Schedule Next Follow-Up Date (Optional)</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-olive/50 rounded-lg text-darkText"
              />
              <input
                type="text"
                value={followUpTime}
                onChange={e => setFollowUpTime(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-olive/50 rounded-lg text-darkText"
                placeholder="10:30 AM"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-darkText/70 hover:text-darkText"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              ✓ Save Interaction & Timeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
