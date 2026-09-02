import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  accentColor?: 'lime' | 'cyan' | 'violet' | 'coral' | 'blue' | 'teal' | 'indigo' | 'mint' | 'lavender' | 'sky' | 'pink' | 'emerald' | 'mauve' | 'gold';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle = 'vs last month',
  icon: Icon,
  accentColor = 'gold'
}) => {
  const accentStyles: Record<string, string> = {
    gold: 'text-[#D4A017] bg-[#D4A017]/10 border-[#D4A017]/30 group-hover:shadow-[0_0_20px_rgba(212,160,23,0.35)]',
    blue: 'text-[#D4A017] bg-[#D4A017]/10 border-[#D4A017]/30 group-hover:shadow-[0_0_20px_rgba(212,160,23,0.35)]',
    teal: 'text-[#E8C766] bg-[#E8C766]/10 border-[#E8C766]/30 group-hover:shadow-[0_0_20px_rgba(232,199,102,0.35)]',
    mint: 'text-[#E8C766] bg-[#E8C766]/10 border-[#E8C766]/30 group-hover:shadow-[0_0_20px_rgba(232,199,102,0.35)]',
    cyan: 'text-[#E8C766] bg-[#E8C766]/10 border-[#E8C766]/30 group-hover:shadow-[0_0_20px_rgba(232,199,102,0.35)]',
    emerald: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    lime: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    indigo: 'text-[#D4A017] bg-[#D4A017]/10 border-[#D4A017]/30 group-hover:shadow-[0_0_20px_rgba(212,160,23,0.35)]',
    violet: 'text-[#D4A017] bg-[#D4A017]/10 border-[#D4A017]/30 group-hover:shadow-[0_0_20px_rgba(212,160,23,0.35)]',
    mauve: 'text-[#D4A017] bg-[#D4A017]/10 border-[#D4A017]/30 group-hover:shadow-[0_0_20px_rgba(212,160,23,0.35)]',
    lavender: 'text-[#E8C766] bg-[#E8C766]/10 border-[#E8C766]/30 group-hover:shadow-[0_0_20px_rgba(232,199,102,0.35)]',
    sky: 'text-[#E8C766] bg-[#E8C766]/10 border-[#E8C766]/30 group-hover:shadow-[0_0_20px_rgba(232,199,102,0.35)]',
    coral: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    pink: 'text-[#D4A017] bg-[#D4A017]/10 border-[#D4A017]/30 group-hover:shadow-[0_0_20px_rgba(212,160,23,0.35)]',
  };

  const currentAccent = accentStyles[accentColor] || accentStyles.gold;

  const sparklineColor =
    accentColor === 'emerald' || accentColor === 'lime' ? '#22C55E' :
    accentColor === 'coral' ? '#EF4444' :
    accentColor === 'teal' || accentColor === 'mint' || accentColor === 'cyan' ? '#E8C766' : '#D4A017';

  return (
    <div className="group relative p-5 rounded-2xl bg-[#2B1720] backdrop-blur-xl border border-[#3A1F2B] hover:border-[#D4A017] hover:shadow-[0_10px_35px_rgba(212,160,23,0.3)] transition-all duration-200 transform hover:-translate-y-1 space-y-3 cursor-pointer">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C9B8BE] group-hover:text-[#FFF9F2] transition-colors">
          {title}
        </span>
        <div className={`p-2 rounded-xl border transition-all ${currentAccent}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Large Value Number & Trend Indicator */}
      <div className="flex items-baseline justify-between pt-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-[#FFF9F2] tracking-tight font-mono">
          {value}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-mono font-bold ${isPositive ? 'text-[#D4A017]' : 'text-[#EF4444]'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Bottom Sparkline SVG & Subtitle */}
      <div className="flex items-center justify-between pt-2 border-t border-[#3A1F2B]">
        <span className="text-[11px] text-[#C9B8BE] font-mono">{subtitle}</span>
        
        {/* Mini SVG Sparkline */}
        <svg className="w-16 h-5 stroke-current opacity-90" viewBox="0 0 50 15">
          <path
            d="M0 12 L10 8 L20 13 L30 5 L40 9 L50 2"
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

    </div>
  );
};
