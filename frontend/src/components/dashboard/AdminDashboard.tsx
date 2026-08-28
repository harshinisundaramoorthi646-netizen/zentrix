import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { StatCard } from '../common/StatCard';
import { VisualWorkflowBuilder } from '../workflow/VisualWorkflowBuilder';
import { apiService } from '../../services/api';
import { Lead, User } from '../../types';
import { Users, DollarSign, Award, TrendingUp, Sparkles, CheckCircle2, Zap, ArrowUpRight, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    Promise.all([
      apiService.getLeads(),
      apiService.getUsers()
    ]).then(([lData, uData]) => {
      setLeads(lData);
      setUsers(uData);
    }).catch(console.error);
  }, []);

  const totalLeads = leads.length;
  const activeLeads = leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').length;
  const qualifiedLeads = leads.filter(l => l.status === 'Qualified' || l.status === 'Negotiation').length;
  const convertedDeals = leads.filter(l => l.status === 'Converted').length;

  const totalRevenue = leads
    .filter(l => l.status === 'Converted')
    .reduce((sum, l) => sum + (l.convertedDealValue || 0), 530000);

  const pendingCommission = 14500;
  const expenses = 158000;
  const netProfit = totalRevenue - expenses;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Sleek Hero Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0D1118] via-[#111722] to-[#0A0D14] border border-white/15 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        
        {/* Decorative Background Lighting Orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#38E8FF]/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#C7FF3D]/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#38E8FF]/10 border border-[#38E8FF]/30 text-[#38E8FF] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#38E8FF]" /> ZENTRIX CONTROL DASHBOARD
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38E8FF] via-[#0072FF] to-[#C7FF3D]">{user?.name || 'User'}</span> 👋
          </h1>
          <p className="text-[#9BA7B7] text-sm sm:text-base max-w-xl font-normal leading-relaxed">
            Real-time analytics across your active operations, client conversions, and team revenue metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-4 rounded-2xl bg-[#05070B]/90 border border-white/10 text-right backdrop-blur-md shadow-lg">
            <div className="text-[11px] font-mono text-[#9BA7B7] uppercase tracking-wider flex items-center justify-end gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#54E38E]" /> NET PROFIT (Q3)
            </div>
            <div className="text-2xl font-extrabold font-mono text-[#54E38E] mt-1 flex items-center justify-end gap-1">
              ₹{netProfit.toLocaleString('en-IN')}
              <ArrowUpRight className="w-5 h-5 text-[#54E38E]" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pipeline Volume"
          value={totalLeads}
          change="+14.2%"
          isPositive={true}
          icon={Zap}
          accentColor="cyan"
        />
        <StatCard
          title="Active Deal Pipeline"
          value={activeLeads}
          change="+8.5%"
          isPositive={true}
          icon={TrendingUp}
          accentColor="lime"
        />
        <StatCard
          title="Qualified Conversions"
          value={qualifiedLeads}
          change="+12.0%"
          isPositive={true}
          icon={CheckCircle2}
          accentColor="violet"
        />
        <StatCard
          title="Deals Closed"
          value={convertedDeals}
          change="+18.4%"
          isPositive={true}
          icon={Award}
          accentColor="cyan"
        />
        <StatCard
          title="Gross Platform Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          change="+22.1%"
          isPositive={true}
          icon={DollarSign}
          accentColor="lime"
        />
        <StatCard
          title="Pending Commission"
          value={`₹${pendingCommission.toLocaleString('en-IN')}`}
          change="-4.2%"
          isPositive={true}
          icon={Award}
          accentColor="coral"
        />
        <StatCard
          title="Net Operating Profit"
          value={`₹${netProfit.toLocaleString('en-IN')}`}
          change="+24.6%"
          isPositive={true}
          icon={TrendingUp}
          accentColor="cyan"
        />
        <StatCard
          title="Active Team Operations"
          value={users.length}
          change="Online"
          isPositive={true}
          icon={Users}
          accentColor="violet"
        />
      </div>

      {/* Visual Workflow Stage Builder */}
      <VisualWorkflowBuilder leads={leads} />

      {/* Team Roster & Converted Deals Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0D1118]/90 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-[#38E8FF]" />
              <span>Zentrix Active Team</span>
            </h2>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#38E8FF]/10 text-[#38E8FF] border border-[#38E8FF]/30">
              {users.length} Active Members
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {users.map(u => (
              <div
                key={u.id}
                className="p-3.5 rounded-2xl bg-[#111722] border border-white/5 flex items-center justify-between hover:border-[#38E8FF]/40 transition-all hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-white/15 shadow-md" />
                  <div>
                    <div className="text-sm font-bold text-white">{u.name}</div>
                    <div className="text-xs text-[#9BA7B7] font-mono">{u.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-right font-mono text-xs">
                  <div>
                    <div className="text-[#9BA7B7]">Score</div>
                    <div className="text-[#38E8FF] font-bold">{u.performanceScore || 90}%</div>
                  </div>
                  <div>
                    <div className="text-[#9BA7B7]">Commission</div>
                    <div className="text-white font-bold">₹{(u.earnedCommission || 0).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0D1118]/90 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#C7FF3D]" />
              <span>Converted Deals</span>
            </h2>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#C7FF3D]/10 text-[#C7FF3D] border border-[#C7FF3D]/30">
              Verified Revenue
            </span>
          </div>

          <div className="space-y-3">
            {leads.filter(l => l.status === 'Converted').map(l => (
              <div key={l.id} className="p-3.5 rounded-2xl bg-[#111722] border border-[#38E8FF]/30 space-y-1.5 hover:border-[#38E8FF] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#38E8FF]">{l.id}</span>
                  <span className="text-xs font-mono text-[#54E38E] font-bold">
                    ₹{(l.convertedDealValue || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{l.company}</div>
                <div className="text-xs text-[#9BA7B7] flex items-center justify-between font-mono pt-1 border-t border-white/5">
                  <span>Owner: Admin conversion desk</span>
                  <span className="text-[#C7FF3D]">Commission Awarded</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
