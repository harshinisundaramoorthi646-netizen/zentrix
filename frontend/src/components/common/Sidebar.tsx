import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  PhoneCall,
  Briefcase,
  Building2,
  KanbanSquare,
  Users,
  FileText,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';
import { ZentrixLogo } from '../branding/ZentrixLogo';
import { useAuth } from '../../services/authContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, mobileOpen = false, setMobileOpen }) => {
  const { user, role, activeSection, setActiveSection, logout } = useAuth();

  const navItems = [
    { id: 'Overview', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'TEAM_A', 'TEAM_B', 'TEAM_C'] },
    { id: 'Team A', label: 'Team A', icon: TrendingUp, roles: ['ADMIN', 'TEAM_A'] },
    { id: 'Team B', label: 'Team B', icon: PhoneCall, roles: ['ADMIN', 'TEAM_B'] },
    { id: 'Team C', label: 'Team C', icon: Briefcase, roles: ['ADMIN', 'TEAM_C'] },
    { id: 'Clients', label: 'Clients', icon: Building2, roles: ['ADMIN', 'TEAM_B', 'TEAM_C'] },
    { id: 'Projects', label: 'Projects', icon: KanbanSquare, roles: ['ADMIN', 'TEAM_C'] },
    { id: 'Team', label: 'Team Members', icon: Users, roles: ['ADMIN'] },
    { id: 'Reports', label: 'Reports', icon: FileText, roles: ['ADMIN'] },
    { id: 'Activity History', label: 'Activity History', icon: ShieldCheck, roles: ['ADMIN'] },
    { id: 'Settings', label: 'Settings', icon: Settings, roles: ['ADMIN', 'TEAM_A', 'TEAM_B', 'TEAM_C'] },
  ];

  const filteredNavItems = navItems.filter(item => !role || item.roles.includes(role));

  const roleColors: Record<string, string> = {
    ADMIN: 'border-[#D4A017] text-[#D4A017] bg-[#D4A017]/10',
    TEAM_A: 'border-[#E8C766] text-[#E8C766] bg-[#E8C766]/10',
    TEAM_B: 'border-[#B8860B] text-[#B8860B] bg-[#B8860B]/10',
    TEAM_C: 'border-[#D4A017] text-[#D4A017] bg-[#D4A017]/10',
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
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#1F1117]/95 backdrop-blur-2xl border-r border-[#3A1F2B] transition-all duration-200 flex flex-col justify-between ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Top Branding */}
        <div className="p-4 border-b border-[#3A1F2B] flex items-center justify-between">
          <ZentrixLogo size="sm" />

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-7 h-7 rounded-lg bg-[#2B1720] border border-[#3A1F2B] items-center justify-center text-[#C9B8BE] hover:text-[#D4A017] hover:border-[#D4A017]/50 transition-all cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen?.(false)}
            className="flex md:hidden w-8 h-8 rounded-xl bg-[#2B1720] border border-[#3A1F2B] items-center justify-center text-[#FFF9F2] hover:bg-red-500/20 hover:text-red-400 transition-all cursor-pointer"
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
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-[#5A1833] text-[#D4A017] border border-[#D4A017]/50 shadow-[0_0_20px_rgba(212,160,23,0.3)] backdrop-blur-xl font-bold'
                    : 'text-[#C9B8BE] hover:text-[#FFF9F2] hover:bg-[#2B1720] hover:border-[#D4A017]/30 hover:shadow-[0_0_12px_rgba(212,160,23,0.2)] border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                  isActive
                    ? 'text-[#D4A017] scale-110'
                    : 'group-hover:text-[#D4A017] group-hover:scale-110'
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom User Card & Quick Logout */}
        <div className="p-3 border-t border-[#3A1F2B] bg-[#2B1720]/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#1F1117] border border-[#3A1F2B]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-[#D4A017]/40"
              />
              {!collapsed && (
                <div className="truncate text-left font-mono">
                  <div className="text-xs font-bold text-[#FFF9F2] truncate">{user?.name}</div>
                  <div className="text-[10px] text-[#C9B8BE] truncate">{user?.email}</div>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                onClick={logout}
                className="p-2 rounded-lg text-[#C9B8BE] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </aside>
    </>
  );
};
