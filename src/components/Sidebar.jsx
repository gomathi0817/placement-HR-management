import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Calendar, 
  Clock, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  Plus, 
  Briefcase 
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';

export const Sidebar = () => {
  const { user, logout, setIsQuickAddOpen, notifications } = useApp();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/hr', label: 'HR Contacts', icon: Users },
    { path: '/companies', label: 'Companies', icon: Building2 },
    { path: '/follow-ups', label: 'Follow-Ups', icon: Clock },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-cream border-r-2 border-olive/50 h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-olive/30 bg-cream">
        <Logo size="md" showSubtitle={true} />
      </div>

      {/* Quick Add Action Button */}
      <div className="px-6 pt-5 pb-2">
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="w-full py-3 px-4 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
        >
          <div className="w-5 h-5 rounded-full bg-darkText text-cream flex items-center justify-center font-bold text-xs group-hover:rotate-90 transition-transform">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span>+ Quick Add Record</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition-all
                ${isActive 
                  ? 'bg-primary text-darkText shadow-sm border border-primary' 
                  : 'text-darkText hover:bg-olive/30 hover:text-darkText'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>

              {item.badge > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer User Profile Card */}
      <div className="p-4 border-t border-olive/30 bg-cream">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-olive/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-darkText font-bold flex items-center justify-center text-xs shadow">
              PO
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-darkText truncate">
                {user.name}
              </h4>
              <p className="text-[10px] text-darkText/70 truncate font-medium">
                {user.title}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Logout"
            className="w-8 h-8 rounded-lg text-darkText/70 hover:text-red-700 hover:bg-red-50 flex items-center justify-center transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
