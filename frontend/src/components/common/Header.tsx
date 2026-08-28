import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { Search, Bell, Shield } from 'lucide-react';
import { apiService } from '../../services/api';
import { NotificationItem } from '../../types';

interface HeaderProps {
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  const { user, role, activeSection } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  useEffect(() => {
    apiService.getNotifications().then(setNotifications).catch(() => {});
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0D1118]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 flex items-center justify-between">
      
      {/* Left Title & Subtitle */}
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span>{activeSection}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#9BA7B7] font-mono font-normal">
            ZENTRIX Core
          </span>
        </h1>
      </div>

      {/* Right Actions Header */}
      <div className="flex items-center gap-3">
        
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-[#9BA7B7] hover:text-white transition-all text-xs font-mono"
        >
          <Search className="w-3.5 h-3.5 text-[#38E8FF]" />
          <span>Quick search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-white">
            Ctrl + K
          </kbd>
        </button>

        {/* Notifications Icon & Drawer Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDrawer(!showNotifDrawer)}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-[#9BA7B7] hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF7A8A] text-black font-bold text-[10px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifDrawer && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#111722] border border-white/15 shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#38E8FF]" /> Zentrix Activity Stream
                </span>
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-mono text-[#38E8FF] hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs space-y-1 transition-colors ${
                      n.read ? 'bg-white/5 border-white/5 opacity-70' : 'bg-[#0D1118] border-[#38E8FF]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-[#64748B] font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-[#9BA7B7]">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#0D1118] border border-white/10 text-xs">
          <Shield className="w-3.5 h-3.5 text-[#38E8FF]" />
          <span className="text-white font-mono font-semibold">{user?.name}</span>
          <span className="text-[10px] text-[#38E8FF] font-mono font-bold">({role})</span>
        </div>

      </div>
    </header>
  );
};
