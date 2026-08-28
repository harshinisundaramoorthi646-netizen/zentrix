import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { Search, GitMerge, Building2, Briefcase, FileText, CircleDollarSign, Settings, LogOut, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { setActiveSection, logout } = useAuth();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { label: 'Go to Leads Pipeline', icon: GitMerge, section: 'Leads' },
    { label: 'View Calling & Follow-ups', icon: GitMerge, section: 'Follow-ups' },
    { label: 'View Clients Directory', icon: Building2, section: 'Clients' },
    { label: 'Manage Projects', icon: Briefcase, section: 'Projects' },
    { label: 'Check Commission Engine', icon: CircleDollarSign, section: 'Commission' },
    { label: 'Open Reports & Analytics', icon: FileText, section: 'Analytics' },
    { label: 'System Settings', icon: Settings, section: 'Settings' },
  ];

  const filteredActions = actions.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (section: string) => {
    setActiveSection(section);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-[#111722] border border-white/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Search Input Bar */}
        <div className="relative p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#38E8FF]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Zentrix leads, clients, projects, or command actions..."
            className="w-full bg-transparent text-white placeholder-[#64748B] text-base border-none outline-none font-mono"
          />
          <button onClick={onClose} className="text-[#9BA7B7] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-[#64748B]">
            System Navigation
          </div>

          {filteredActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(action.section)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm text-[#9BA7B7] hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#38E8FF]" />
                  <span>{action.label}</span>
                </div>
                <span className="text-xs font-mono text-[#64748B]">Jump to →</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-white/5">
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left font-mono"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out of Zentrix System</span>
            </button>
          </div>
        </div>

        <div className="px-4 py-2 bg-[#0D1118] border-t border-white/10 flex items-center justify-between text-[11px] text-[#64748B] font-mono">
          <span>Zentrix Command Palette</span>
          <span>Press ESC to exit</span>
        </div>

      </div>
    </div>
  );
};
