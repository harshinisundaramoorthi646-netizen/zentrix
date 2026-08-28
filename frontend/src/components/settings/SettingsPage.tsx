import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { AuditLogViewer } from './AuditLogViewer';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'audit'>('profile');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Platform Settings & Audit Logs</h1>
          <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
            Configure Zentrix company profile, security policies, and system audit trails.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 bg-[#111722] p-1 rounded-xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg ${activeTab === 'profile' ? 'bg-[#38E8FF] text-black font-bold' : 'text-[#9BA7B7]'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`px-3 py-1.5 rounded-lg ${activeTab === 'company' ? 'bg-[#38E8FF] text-black font-bold' : 'text-[#9BA7B7]'}`}
          >
            Company
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg ${activeTab === 'audit' ? 'bg-[#38E8FF] text-black font-bold' : 'text-[#9BA7B7]'}`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <AuditLogViewer />
      ) : (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-6">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <img src={user?.avatar} alt={user?.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#38E8FF]" />
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-xs text-[#38E8FF] font-mono">{user?.email} • {user?.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-[#64748B]">COMPANY PLATFORM NAME</label>
              <input type="text" readOnly value="ZENTRIX Freelancer Operating System" className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white" />
            </div>

            <div className="space-y-1">
              <label className="text-[#64748B]">CURRENCY CODE</label>
              <input type="text" readOnly value="INR (₹ Indian Rupee)" className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
