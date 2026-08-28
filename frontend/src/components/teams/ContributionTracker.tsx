import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Lead } from '../../types';
import { GitMerge, UserCheck, PhoneCall, Award, DollarSign } from 'lucide-react';

export const ContributionTracker: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    apiService.getLeads().then(setLeads).catch(console.error);
  }, []);

  const convertedLeads = leads.filter(l => l.status === 'Converted');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10">
        <h1 className="text-2xl font-extrabold text-white">Multi-Touch Contribution Tracking</h1>
        <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
          Audit every revenue milestone to attribute credit across Team A lead generation and Team B calling & conversion.
        </p>
      </div>

      <div className="space-y-4">
        {convertedLeads.map(l => (
          <div key={l.id} className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-[#C7FF3D]">{l.id}</span>
                <h2 className="text-lg font-bold text-white">{l.company} Deal Attribution</h2>
              </div>

              <div className="text-right font-mono">
                <div className="text-xs text-[#64748B]">TOTAL DEAL VALUE</div>
                <div className="text-xl font-extrabold text-[#C7FF3D]">
                  ₹{(l.convertedDealValue || 180000).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* 2-Column Attribution Flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              
              {/* TEAM A CREATOR */}
              <div className="p-4 rounded-xl bg-[#111722] border border-[#38E8FF]/30 space-y-2">
                <div className="flex items-center justify-between text-[#38E8FF] font-bold">
                  <span className="flex items-center gap-1"><GitMerge className="w-3.5 h-3.5" /> LEAD CREATOR</span>
                  <span>TEAM A</span>
                </div>
                <div className="text-sm font-bold font-sans text-white">{l.assignedTeamA || 'Priya S'}</div>
                <div className="text-[#9BA7B7]">Action: Lead Submission</div>
                <div className="text-[#C7FF3D] font-bold">Fixed Credit: ₹100</div>
              </div>

              {/* TEAM B CALLER & CONVERTER */}
              <div className="p-4 rounded-xl bg-[#111722] border border-[#9B7CFF]/30 space-y-2">
                <div className="flex items-center justify-between text-[#9B7CFF] font-bold">
                  <span className="flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5" /> QUALIFIER & CALLER</span>
                  <span>TEAM B</span>
                </div>
                <div className="text-sm font-bold font-sans text-white">{l.assignedTeamB || 'Sneha V'}</div>
                <div className="text-[#9BA7B7]">Action: Qualification & Follow-up</div>
                <div className="text-[#9B7CFF] font-bold">Fixed Credit: ₹200</div>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
