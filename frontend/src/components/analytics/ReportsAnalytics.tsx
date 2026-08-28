import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { FileText, TrendingUp, DollarSign, Award, GitMerge } from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const revenueData = [
    { month: 'Apr', revenue: 420000, leads: 24, conversions: 6 },
    { month: 'May', revenue: 580000, leads: 32, conversions: 9 },
    { month: 'Jun', revenue: 740000, leads: 45, conversions: 12 },
    { month: 'Jul', revenue: 950000, leads: 58, conversions: 15 },
    { month: 'Aug', revenue: 1248000, leads: 72, conversions: 19 },
  ];

  const teamData = [
    { name: 'Team A (Lead Gen)', leads: 72, target: 60, color: '#38E8FF' },
    { name: 'Team B (Outreach)', calls: 128, qualified: 48, color: '#9B7CFF' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10">
        <h1 className="text-2xl font-extrabold text-white">Agency Reports & Analytics</h1>
        <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
          Executive performance metrics, monthly revenue trajectories, conversion efficiency, and team output.
        </p>
      </div>

      {/* 2 Big Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Revenue Area Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C7FF3D]" />
              <span>Monthly Revenue Growth (₹ INR)</span>
            </h2>
            <span className="text-xs font-mono text-[#54E38E]">+31.4% MoM</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C7FF3D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C7FF3D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="JetBrains Mono" tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111722', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C7FF3D" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Generation & Conversion Bar Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-[#38E8FF]" />
              <span>Pipeline Leads Volume</span>
            </h2>
            <span className="text-xs font-mono text-[#38E8FF]">72 Active</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111722', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="leads" name="Total Leads" fill="#38E8FF" radius={[6, 6, 0, 0]} />
                <Bar dataKey="conversions" name="Converted" fill="#C7FF3D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
