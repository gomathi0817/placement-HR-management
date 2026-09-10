import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, User, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav = () => {
  const { setIsQuickAddOpen } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-md border-t-2 border-olive/50 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around relative">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `
            flex flex-col items-center justify-center text-[10px] font-bold py-1 px-3 transition-colors
            ${isActive ? 'text-primary' : 'text-darkText/70 hover:text-darkText'}
          `}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </NavLink>

        {/* HR Contacts */}
        <NavLink
          to="/hr"
          className={({ isActive }) => `
            flex flex-col items-center justify-center text-[10px] font-bold py-1 px-3 transition-colors
            ${isActive ? 'text-primary' : 'text-darkText/70 hover:text-darkText'}
          `}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>HR</span>
        </NavLink>

        {/* Central Emphasized Floating Add Button */}
        <div className="-mt-7 relative z-10">
          <button
            onClick={() => setIsQuickAddOpen(true)}
            aria-label="Add Record"
            className="w-14 h-14 rounded-full bg-primary text-darkText flex items-center justify-center shadow-lg border-4 border-cream hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>

        {/* Follow-Ups */}
        <NavLink
          to="/follow-ups"
          className={({ isActive }) => `
            flex flex-col items-center justify-center text-[10px] font-bold py-1 px-3 transition-colors
            ${isActive ? 'text-primary' : 'text-darkText/70 hover:text-darkText'}
          `}
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span>Follow-Ups</span>
        </NavLink>

        {/* Profile / Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) => `
            flex flex-col items-center justify-center text-[10px] font-bold py-1 px-3 transition-colors
            ${isActive ? 'text-primary' : 'text-darkText/70 hover:text-darkText'}
          `}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </NavLink>
      </div>
    </div>
  );
};
