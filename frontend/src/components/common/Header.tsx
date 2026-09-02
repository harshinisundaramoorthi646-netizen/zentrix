import React, { useState } from 'react';
import { Search, Bell, Shield, Menu } from 'lucide-react';
import { useAuth } from '../../services/authContext';
import { mockNotifications } from '../../services/mockData';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenCommandPalette
}) => {
  const { user, role, activeSection } = useAuth();
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#1F1117]/90 backdrop-blur-xl border-b border-[#3A1F2B] px-4 sm:px-8 flex items-center justify-between">
      
      {/* Left Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="flex md:hidden items-center gap-2 p-2 rounded-xl bg-[#5A1833]/40 border border-[#D4A017]/30 text-[#D4A017] hover:bg-[#5A1833] hover:border-[#D4A017] hover:shadow-[0_0_15px_rgba(212,160,23,0.3)] transition-all cursor-pointer"
            title="Open Options Menu"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase">Menu</span>
          </button>
        )}

        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#FFF9F2] tracking-tight flex items-center gap-2">
            <span>{activeSection}</span>
            <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-full bg-[#2B1720] border border-[#3A1F2B] text-[#C9B8BE] font-mono font-normal">
              ZENTRIX Platform
            </span>
          </h1>
        </div>
      </div>

      {/* Right Actions Header */}
      <div className="flex items-center gap-3">
        
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#2B1720] border border-[#3A1F2B] hover:border-[#D4A017]/50 text-[#C9B8BE] hover:text-[#FFF9F2] hover:shadow-[0_0_15px_rgba(212,160,23,0.25)] transition-all text-xs font-mono cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#D4A017]" />
          <span>Quick search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#1F1117] border border-[#3A1F2B] text-[10px] text-[#FFF9F2]">
            Ctrl + K
          </kbd>
        </button>

        {/* Notifications Icon & Drawer Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDrawer(!showNotifDrawer)}
            className="relative p-2 rounded-xl bg-[#2B1720] border border-[#3A1F2B] text-[#C9B8BE] hover:text-[#D4A017] hover:border-[#D4A017]/40 hover:shadow-[0_0_15px_rgba(212,160,23,0.25)] transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4A017] text-[#1F1117] font-bold text-[10px] flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(212,160,23,0.5)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifDrawer && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#2B1720] border border-[#3A1F2B] shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-2">
                <span className="text-xs font-bold font-mono text-[#FFF9F2] uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#D4A017]" /> Zentrix Activity Stream
                </span>
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-mono text-[#D4A017] hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs space-y-1 transition-colors ${
                      n.read ? 'bg-[#1F1117] border-[#3A1F2B] opacity-70' : 'bg-[#1F1117] border-[#D4A017]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-[#FFF9F2]">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-[#C9B8BE] font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-[#C9B8BE]">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Role Switcher */}
        <div className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-xl bg-[#2B1720] border border-[#3A1F2B] hover:border-[#D4A017]/40 transition-all text-xs">
          <Shield className="w-3.5 h-3.5 text-[#D4A017]" />
          <span className="text-[#FFF9F2] font-mono font-semibold truncate max-w-[90px] sm:max-w-none">{user?.name}</span>
          <select
            value={role || 'ADMIN'}
            onChange={(e) => {
              const newRole = e.target.value;
              const targetEmail =
                newRole === 'ADMIN'
                  ? 'admin@zentrix.com'
                  : newRole === 'TEAM_A'
                  ? 'priya.s@zentrix.com'
                  : newRole === 'TEAM_B'
                  ? 'rahul.m@zentrix.com'
                  : 'suresh.k@zentrix.com';
              useAuth().login(targetEmail, 'password');
            }}
            className="bg-[#1F1117] text-[#D4A017] text-[11px] font-mono font-bold py-0.5 px-2 rounded-lg border border-[#D4A017]/40 outline-none cursor-pointer hover:border-[#D4A017] transition-all"
            title="Switch User Role to test different dashboards"
          >
            <option value="ADMIN">👑 ADMIN</option>
            <option value="TEAM_A">🚀 TEAM A</option>
            <option value="TEAM_B">📞 TEAM B</option>
            <option value="TEAM_C">⚡ TEAM C</option>
          </select>
        </div>

      </div>
    </header>
  );
};
