import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  accentColor?: 'lime' | 'cyan' | 'violet' | 'coral';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle = 'vs last month',
  icon: Icon,
  accentColor = 'lime'
}) => {
  const accentStyles = {
    lime: 'text-[#C7FF3D] bg-[#C7FF3D]/10 border-[#C7FF3D]/30 group-hover:shadow-[0_0_20px_rgba(199,255,61,0.2)]',
    cyan: 'text-[#38E8FF] bg-[#38E8FF]/10 border-[#38E8FF]/30 group-hover:shadow-[0_0_20px_rgba(56,232,255,0.2)]',
    violet: 'text-[#9B7CFF] bg-[#9B7CFF]/10 border-[#9B7CFF]/30 group-hover:shadow-[0_0_20px_rgba(155,124,255,0.2)]',
    coral: 'text-[#FF7A8A] bg-[#FF7A8A]/10 border-[#FF7A8A]/30 group-hover:shadow-[0_0_20px_rgba(255,122,138,0.2)]',
  };

  return (
    <div className="group relative p-5 rounded-2xl bg-gradient-to-b from-[#161D29]/90 to-[#0D1118]/90 backdrop-blur-xl border border-white/10 hover:border-yellow-400/60 hover:bg-white/10 hover:shadow-[0_10px_35px_rgba(255,215,0,0.3)] transition-all duration-300 transform hover:-translate-y-1 space-y-3">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#9BA7B7] group-hover:text-yellow-300 transition-colors">
          {title}
        </span>
        <div className={`p-2 rounded-xl border transition-all ${accentStyles[accentColor]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Large Value Number & Trend Indicator */}
      <div className="flex items-baseline justify-between pt-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
          {value}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-mono font-bold ${isPositive ? 'text-[#54E38E]' : 'text-[#FF7A8A]'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Bottom Sparkline SVG & Subtitle */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <span className="text-[11px] text-[#64748B] font-mono">{subtitle}</span>
        
        {/* Mini SVG Sparkline */}
        <svg className="w-16 h-5 stroke-current opacity-80" viewBox="0 0 50 15">
          <path
            d="M0 12 L10 8 L20 13 L30 5 L40 9 L50 2"
            fill="none"
            stroke={accentColor === 'lime' ? '#C7FF3D' : accentColor === 'cyan' ? '#38E8FF' : accentColor === 'violet' ? '#9B7CFF' : '#FF7A8A'}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

    </div>
  );
};
