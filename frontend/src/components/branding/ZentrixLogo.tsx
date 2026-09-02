import React from 'react';

interface ZentrixLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const ZentrixLogo: React.FC<ZentrixLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-Tech Interlocking Geometric Emblem (Zentrix 'Z' Emblem) */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(212,160,23,0.4)]">
          <defs>
            <linearGradient id="zentrixGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5A1833" />
              <stop offset="50%" stopColor="#D4A017" />
              <stop offset="100%" stopColor="#E8C766" />
            </linearGradient>
            <linearGradient id="zentrixGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E8C766" />
              <stop offset="100%" stopColor="#D4A017" />
            </linearGradient>
            <filter id="glowZ" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background hexagonal node frame */}
          <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="#2B1720" stroke="#3A1F2B" strokeWidth="3" />
          
          {/* Main Interlocking Zentrix 'Z' ribbon shape */}
          <path
            d="M 25 28 L 75 28 L 35 72 L 75 72"
            stroke="url(#zentrixGrad1)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowZ)"
          />
          <path
            d="M 32 36 L 68 36 L 40 64 L 68 64"
            stroke="url(#zentrixGrad2)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Central Pulsing Gold Core */}
          <circle cx="50" cy="50" r="5" fill="#D4A017" className="animate-pulse" />
        </svg>
      </div>

      {/* Brand Name & Subtitle */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-wider leading-none flex items-center font-sans ${textSizes[size]}`}>
          <span className="text-[#FFF9F2]">ZENT</span>
          <span className="text-[#D4A017] drop-shadow-[0_0_10px_rgba(212,160,23,0.4)]">RIX</span>
        </div>
        {showSubtitle && (
          <span className={`font-mono font-medium tracking-[0.25em] text-[#C9B8BE] uppercase mt-1 ${subtitleSizes[size]}`}>
            FREELANCER PLATFORM
          </span>
        )}
      </div>
    </div>
  );
};
