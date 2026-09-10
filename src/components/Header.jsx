import React from 'react';
import { Bell, Search, Plus, User, Calendar, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const Header = ({ onSearchClick }) => {
  const { user, notifications, setIsQuickAddOpen, logout } = useApp();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-20 bg-cream/90 backdrop-blur-md border-b-2 border-olive/40 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
      {/* Mobile Logo & Desktop Greeting */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <Logo size="sm" showSubtitle={false} />
        </div>
        <div className="hidden lg:block">
          <span className="text-xs font-bold uppercase tracking-wider text-darkText/70">
            Placement Communication Hub
          </span>
          <h2 className="text-lg font-extrabold text-darkText leading-tight">
            GV HR Relationship Management
          </h2>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search button trigger */}
        <button
          onClick={onSearchClick}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-olive/20 text-darkText border border-olive/30 font-semibold text-xs flex items-center gap-2"
        >
          <Search className="w-4 h-4 text-darkText" />
          <span className="hidden sm:inline">Search HR / Company...</span>
        </button>

        {/* Quick Add trigger desktop */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl bg-white hover:bg-olive/20 text-darkText border border-olive/30"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Mobile Profile Link */}
        <div className="lg:hidden">
          <button
            onClick={() => navigate('/settings')}
            className="w-8 h-8 rounded-full bg-primary text-darkText font-bold text-xs flex items-center justify-center shadow"
          >
            PO
          </button>
        </div>
      </div>
    </header>
  );
};
