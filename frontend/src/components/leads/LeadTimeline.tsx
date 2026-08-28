import React from 'react';
import { Lead } from '../../types';
import { CheckCircle2, Circle, GitMerge, PhoneCall, Award, DollarSign, Clock, User } from 'lucide-react';

interface LeadTimelineProps {
  lead: Lead;
}

export const LeadTimeline: React.FC<LeadTimelineProps> = ({ lead }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[#0D1118] border border-white/10 space-y-2 text-xs">
        <div className="flex justify-between font-mono">
          <span className="text-[#9BA7B7]">Client Contact:</span>
          <span className="text-white font-bold">{lead.name} ({lead.email})</span>
        </div>
        <div className="flex justify-between font-mono">
          <span className="text-[#9BA7B7]">Requirement:</span>
          <span className="text-white font-medium">{lead.requirement}</span>
        </div>
        <div className="flex justify-between font-mono">
          <span className="text-[#9BA7B7]">Estimated Budget:</span>
          <span className="text-[#C7FF3D] font-bold">₹{lead.estimatedBudget.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Visual Vertical Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#38E8FF] before:via-[#9B7CFF] before:to-[#C7FF3D]">
        {lead.journey.map((step, idx) => (
          <div key={idx} className="relative space-y-1 group">
            
            {/* Animated Node Circle */}
            <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-[#080A0F] border-2 border-[#C7FF3D] flex items-center justify-center shadow-[0_0_10px_rgba(199,255,61,0.5)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C7FF3D]" />
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#C7FF3D] uppercase tracking-wider">{step.stage}</span>
              <span className="text-[#64748B]">{new Date(step.timestamp).toLocaleString()}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D1118] border border-white/5 space-y-1">
              <p className="text-xs text-white font-medium">{step.details}</p>
              <div className="text-[10px] text-[#9BA7B7] font-mono flex items-center gap-1">
                <User className="w-3 h-3 text-[#38E8FF]" /> Author: {step.author}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
