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
import { TrendingUp, DollarSign, Calendar, Clock, GitMerge } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const ReportsAnalytics: React.FC = () => {
  const revenueData = [
    { month: 'Apr', revenue: 420000, leads: 24, conversions: 6 },
    { month: 'May', revenue: 580000, leads: 32, conversions: 9 },
    { month: 'Jun', revenue: 740000, leads: 45, conversions: 12 },
    { month: 'Jul', revenue: 950000, leads: 58, conversions: 15 },
    { month: 'Aug', revenue: 1248000, leads: 72, conversions: 19 },
  ];

  const todayRevenue = '₹45,000';
  const weeklyRevenue = '₹2,85,000';
  const monthlyRevenue = '₹12,48,000';

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#2B1720] border border-[#3A1F2B]">
        <h1 className="text-2xl font-extrabold text-[#FFF9F2]">Agency Revenue Reports & Analytics</h1>
        <p className="text-xs text-[#C9B8BE] font-mono mt-0.5">
          Real-time financial performance: Today, Weekly, and Monthly revenue breakdown & lead pipeline velocity.
        </p>
      </div>

      {/* REVENUE STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Today Revenue"
          value={todayRevenue}
          change="+12.5% vs yesterday"
          isPositive={true}
          icon={Clock}
          accentColor="gold"
        />
        <StatCard
          title="Weekly Revenue"
          value={weeklyRevenue}
          change="+18.2% vs last week"
          isPositive={true}
          icon={Calendar}
          accentColor="gold"
        />
        <StatCard
          title="Monthly Revenue"
          value={monthlyRevenue}
          change="+31.4% vs last month"
          isPositive={true}
          icon={DollarSign}
          accentColor="gold"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Revenue Area Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#2B1720] border border-[#3A1F2B] space-y-4 hover:border-[#D4A017]/40 transition-all">
          <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
            <h2 className="text-base font-bold text-[#FFF9F2] flex items-center gap-2 font-mono">
              <TrendingUp className="w-4 h-4 text-[#D4A017]" />
              <span>Monthly Revenue Growth (₹ INR)</span>
            </h2>
            <span className="text-xs font-mono text-[#D4A017] font-bold">+31.4% MoM</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A017" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4A017" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A1F2B" />
                <XAxis dataKey="month" stroke="#C9B8BE" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#C9B8BE" fontSize={11} fontFamily="JetBrains Mono" tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F1117', borderColor: '#D4A017', borderRadius: '12px', color: '#FFF9F2' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4A017" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Bar Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#2B1720] border border-[#3A1F2B] space-y-4 hover:border-[#D4A017]/40 transition-all">
          <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
            <h2 className="text-base font-bold text-[#FFF9F2] flex items-center gap-2 font-mono">
              <GitMerge className="w-4 h-4 text-[#E8C766]" />
              <span>Pipeline Leads Volume</span>
            </h2>
            <span className="text-xs font-mono text-[#D4A017] font-bold">72 Active</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A1F2B" />
                <XAxis dataKey="month" stroke="#C9B8BE" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#C9B8BE" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F1117', borderColor: '#D4A017', borderRadius: '12px', color: '#FFF9F2' }}
                />
                <Bar dataKey="leads" name="Total Leads" fill="#D4A017" radius={[6, 6, 0, 0]} />
                <Bar dataKey="conversions" name="Converted" fill="#E8C766" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
