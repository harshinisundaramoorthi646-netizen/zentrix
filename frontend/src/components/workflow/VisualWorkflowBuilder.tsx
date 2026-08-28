import React from 'react';
import { Lead } from '../../types';
import { GitMerge, PhoneCall, Calendar, CheckCircle2, DollarSign, Building2, Briefcase, Receipt, ArrowRight } from 'lucide-react';

interface VisualWorkflowBuilderProps {
  leads: Lead[];
}

export const VisualWorkflowBuilder: React.FC<VisualWorkflowBuilderProps> = ({ leads }) => {
  const counts = {
    leadGen: leads.length,
    calling: leads.filter(l => l.status === 'Calling' || l.status === 'Submitted' || l.status === 'Accepted').length,
    followUp: leads.filter(l => l.status === 'Follow-up').length,
    qualified: leads.filter(l => l.status === 'Qualified' || l.status === 'Negotiation').length,
    converted: leads.filter(l => l.status === 'Converted').length,
  };

  const stages = [
    { name: 'Lead Generation', count: counts.leadGen, team: 'TEAM A', icon: GitMerge, color: '#38E8FF' },
    { name: 'Calling & Outreach', count: counts.calling, team: 'TEAM B', icon: PhoneCall, color: '#9B7CFF' },
    { name: 'Follow-up Scheduler', count: counts.followUp, team: 'TEAM B', icon: Calendar, color: '#9B7CFF' },
    { name: 'Qualified Prospects', count: counts.qualified, team: 'TEAM B', icon: CheckCircle2, color: '#FFC857' },
    { name: 'Converted Deals', count: counts.converted, team: 'TEAM B', icon: DollarSign, color: '#C7FF3D' },
    { name: 'Active Clients', count: 2, team: 'OPERATIONS', icon: Building2, color: '#54E38E' },
    { name: 'Projects & Tasks', count: 1, team: 'DEVELOPMENT', icon: Briefcase, color: '#38E8FF' },
    { name: 'Billing & Invoices', count: 1, team: 'FINANCE', icon: Receipt, color: '#FFC857' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-[#38E8FF]" />
            <span>ZENTRIX Visual Workflow Architecture</span>
          </h2>
          <p className="text-xs text-[#9BA7B7] mt-0.5 font-mono">
            Live pipeline flow across Lead Generation ➔ Calling ➔ Qualification ➔ Conversion ➔ Revenue
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#38E8FF]/10 border border-[#38E8FF]/30 text-[#38E8FF] text-xs font-mono font-semibold">
          8 Pipeline Stages
        </span>
      </div>

      {/* Workflow Stage Map */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {stages.map((stg, idx) => {
          const Icon = stg.icon;
          return (
            <div
              key={idx}
              className="relative p-4 rounded-xl bg-[#111722] border border-white/10 hover:border-white/20 transition-all duration-300 space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-white/10 text-[#9BA7B7]">
                  Stage 0{idx + 1}
                </span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stg.color}20`, color: stg.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-white group-hover:text-[#38E8FF] transition-colors">
                  {stg.name}
                </div>
                <div className="text-2xl font-extrabold font-mono text-white mt-1">
                  {stg.count} <span className="text-xs text-[#64748B] font-sans font-normal">active items</span>
                </div>
              </div>

              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (stg.count / (counts.leadGen || 1)) * 100)}%`,
                    backgroundColor: stg.color,
                  }}
                />
              </div>

              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-4 h-4 text-[#64748B]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
