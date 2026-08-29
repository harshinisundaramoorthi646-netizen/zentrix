import React from 'react';
import { useAuth } from '../../services/authContext';
import { ZentrixLogo } from '../branding/ZentrixLogo';
import {
  LayoutDashboard,
  Users,
  GitMerge,
  KanbanSquare,
  Clock,
  CircleDollarSign,
  Receipt,
  FileText,
  Building2,
  Briefcase,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, mobileOpen = false, setMobileOpen }) => {
  const { user, role, activeSection, setActiveSection, logout } = useAuth();

  const navItems = [
    { id: 'Overview', label: 'Overview', icon: LayoutDashboard, roles: ['ADMIN'] },
    { id: 'Lead Journey', label: 'Lead Journey', icon: TrendingUp, roles: ['ADMIN', 'TEAM_A'] },
    { id: 'Follow-ups', label: 'Calling & Follow-ups', icon: PhoneCall, roles: ['ADMIN', 'TEAM_B'] },
    { id: 'Clients', label: 'Clients', icon: Building2, roles: ['ADMIN'] },
    { id: 'Projects', label: 'Projects', icon: Briefcase, roles: ['ADMIN'] },
    { id: 'Tasks', label: 'Task Kanban', icon: KanbanSquare, roles: ['ADMIN', 'TEAM_A', 'TEAM_B'] },
    { id: 'Time Tracker', label: 'Time Tracking', icon: Clock, roles: ['ADMIN', 'TEAM_A', 'TEAM_B'] },
    { id: 'Team', label: 'Team Rosters', icon: Users, roles: ['ADMIN'] },
    { id: 'Contributions', label: 'Contributions', icon: GitMerge, roles: ['ADMIN'] },
    { id: 'Commission', label: 'Commission Engine', icon: CircleDollarSign, roles: ['ADMIN'] },
    { id: 'Billing', label: 'Billing & Revenue', icon: Receipt, roles: ['ADMIN'] },
    { id: 'Analytics', label: 'Reports & Analytics', icon: FileText, roles: ['ADMIN'] },
    { id: 'AI Intelligence', label: 'AI Intelligence', icon: Sparkles, roles: ['ADMIN'] },
    { id: 'Audit Log', label: 'Audit Logs', icon: ShieldCheck, roles: ['ADMIN'] },
    { id: 'Settings', label: 'Settings', icon: Settings, roles: ['ADMIN', 'TEAM_A', 'TEAM_B'] },
  ];

  const filteredNavItems = navItems.filter(item => !role || item.roles.includes(role));

  const roleColors: Record<string, string> = {
    ADMIN: 'border-[#38E8FF] text-[#38E8FF] bg-[#38E8FF]/10',
    TEAM_A: 'border-[#C7FF3D] text-[#C7FF3D] bg-[#C7FF3D]/10',
    TEAM_B: 'border-[#3B82F6] text-[#3B82F6] bg-[#3B82F6]/10',
  };

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen?.(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Component */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0D1118]/98 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 flex flex-col justify-between ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Top Branding */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <ZentrixLogo size="sm" />

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-7 h-7 rounded-lg bg-white/5 border border-white/10 items-center justify-center text-[#9BA7B7] hover:text-[#38E8FF] hover:border-[#38E8FF]/50 hover:bg-white/10 transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen?.(false)}
            className="flex md:hidden w-8 h-8 rounded-xl bg-white/5 border border-white/10 items-center justify-center text-white hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectSection(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-300 group ${
                  isActive
                    ? 'bg-[#38E8FF]/15 text-[#38E8FF] border border-[#38E8FF]/50 shadow-[0_0_20px_rgba(56,232,255,0.25)] backdrop-blur-xl font-bold'
                    : 'text-[#9BA7B7] hover:text-[#38E8FF] hover:bg-white/10 hover:backdrop-blur-xl hover:border-[#38E8FF]/40 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                  isActive
                    ? 'text-[#38E8FF] scale-110'
                    : 'group-hover:text-[#38E8FF] group-hover:scale-110'
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Profile & Role Info Footer */}
        <div className="p-3 border-t border-white/10 bg-[#05070B]/80">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover border border-white/20 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                <div className={`mt-0.5 inline-block text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full border ${roleColors[role || 'ADMIN']}`}>
                  {role}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-[#64748B] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
