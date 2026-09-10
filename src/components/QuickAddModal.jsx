import React, { useState } from 'react';
import { UserPlus, MessageSquarePlus, CalendarPlus, Building2, X, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickAddModal = ({ isOpen, onClose, onSelectOption }) => {
  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'addHR',
      title: 'Add HR Contact',
      subtitle: 'Register new HR lead & recruiter profile',
      icon: UserPlus,
      color: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      id: 'addInteraction',
      title: 'Add Interaction Log',
      subtitle: 'Record call, email, or voice note discussion',
      icon: MessageSquarePlus,
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    {
      id: 'scheduleFollowUp',
      title: 'Schedule Follow-Up',
      subtitle: 'Set date, time & priority alert reminder',
      icon: CalendarPlus,
      color: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    {
      id: 'addCompany',
      title: 'Add Company Profile',
      subtitle: 'Create company recruitment record & specs',
      icon: Building2,
      color: 'bg-purple-100 text-purple-900 border-purple-300'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border-2 border-primary rounded-t-3xl sm:rounded-3xl max-w-md w-full overflow-hidden shadow-modal-custom transform transition-all animate-slideUp sm:animate-scaleUp">
        {/* Header */}
        <div className="bg-primary text-darkText p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-darkText text-cream flex items-center justify-center font-black">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Quick Action Center</h3>
              <span className="text-[11px] text-darkText/80 font-medium">Create Placement Record</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-darkText/10 hover:bg-darkText/20 text-darkText flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-5 space-y-3 bg-cream">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => {
                  onSelectOption(action.id);
                  onClose();
                }}
                className="w-full bg-white hover:bg-olive/20 border-2 border-olive/40 hover:border-primary rounded-2xl p-4 text-left flex items-center gap-4 transition-all shadow-xs hover:shadow-md group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${action.color} group-hover:scale-105 transition-transform flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-darkText group-hover:text-accent">
                    {action.title}
                  </h4>
                  <p className="text-xs text-darkText/70">
                    {action.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
