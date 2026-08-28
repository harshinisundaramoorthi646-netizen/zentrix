import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { User, CommissionRulesConfig } from '../../types';
import { CircleDollarSign, CheckCircle2, Clock, AlertCircle, Settings, ArrowUpRight } from 'lucide-react';

export const CommissionTracker: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [rules, setRules] = useState<CommissionRulesConfig>({
    teamA: { type: 'FIXED', amount: 100, unit: 'per valid lead' },
    teamB: { type: 'FIXED', amount: 200, unit: 'per qualified follow-up' },
  });

  useEffect(() => {
    apiService.getUsers().then(setUsers).catch(console.error);
  }, []);

  const totalEarned = users.reduce((sum, u) => sum + (u.earnedCommission || 0), 0);
  const totalPaid = 112000;
  const totalPending = Math.max(0, totalEarned - totalPaid);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0D1118] via-[#111722] to-[#161D29] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7FF3D]/10 border border-[#C7FF3D]/30 text-[#C7FF3D] text-xs font-mono font-semibold">
            AUTOMATED COMMISSION ENGINE
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Commission & Payout Management</h1>
          <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
            Rule-based real-time commission calculations per team role with payout status tracking.
          </p>
        </div>

        <div className="flex gap-4 font-mono text-right">
          <div className="px-4 py-2 rounded-xl bg-[#080A0F] border border-white/10">
            <div className="text-[10px] text-[#9BA7B7]">TOTAL EARNED</div>
            <div className="text-lg font-bold text-[#C7FF3D]">₹{totalEarned.toLocaleString('en-IN')}</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#080A0F] border border-white/10">
            <div className="text-[10px] text-[#9BA7B7]">PAID OUT</div>
            <div className="text-lg font-bold text-[#54E38E]">₹{totalPaid.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Configured Rules Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="p-5 rounded-xl bg-[#0D1118]/80 border border-[#38E8FF]/30 space-y-2">
          <div className="text-xs font-mono font-bold text-[#38E8FF]">TEAM A RULE (LEAD GEN)</div>
          <div className="text-2xl font-extrabold text-white font-mono">₹100 <span className="text-xs text-[#9BA7B7] font-sans font-normal">/ valid lead</span></div>
          <p className="text-xs text-[#9BA7B7]">Awarded automatically upon non-duplicate lead submission.</p>
        </div>

        <div className="p-5 rounded-xl bg-[#0D1118]/80 border border-[#9B7CFF]/30 space-y-2">
          <div className="text-xs font-mono font-bold text-[#9B7CFF]">TEAM B RULE (CALLING & QUALIFICATION)</div>
          <div className="text-2xl font-extrabold text-white font-mono">₹200 <span className="text-xs text-[#9BA7B7] font-sans font-normal">/ qualified lead</span></div>
          <p className="text-xs text-[#9BA7B7]">Awarded when Team B completes qualification call.</p>
        </div>

      </div>

      {/* Member Commission Breakdown Table */}
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <CircleDollarSign className="w-4 h-4 text-[#C7FF3D]" />
          <span>Freelancer Member Commission Ledger</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-[#64748B]">
                <th className="py-3 px-3">MEMBER NAME</th>
                <th className="py-3 px-3">TEAM ROLE</th>
                <th className="py-3 px-3">RULE APPLIED</th>
                <th className="py-3 px-3">TOTAL EARNED</th>
                <th className="py-3 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/5 text-white hover:bg-white/5">
                  <td className="py-3.5 px-3 font-sans font-bold flex items-center gap-2">
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3.5 px-3 text-[#38E8FF]">{u.role}</td>
                  <td className="py-3.5 px-3 text-[#9BA7B7]">
                    {u.role === 'TEAM_A' ? '₹100 / lead' : u.role === 'TEAM_B' ? '₹200 / qual' : 'Management'}
                  </td>
                  <td className="py-3.5 px-3 text-[#C7FF3D] font-bold">₹{(u.earnedCommission || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#54E38E]/20 text-[#54E38E] border border-[#54E38E]/40 font-bold">
                      Calculated
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
