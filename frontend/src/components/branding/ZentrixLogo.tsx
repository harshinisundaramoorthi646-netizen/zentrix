import React from 'react';

interface ZentrixLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const ZentrixLogo: React.FC<ZentrixLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[12px]',
    xl: 'text-[14px]'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-Tech Interlocking Geometric Emblem (Zentrix 'Z' Emblem) */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(56,232,255,0.4)]">
          <defs>
            <linearGradient id="zentrixGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38E8FF" />
              <stop offset="50%" stopColor="#0072FF" />
              <stop offset="100%" stopColor="#C7FF3D" />
            </linearGradient>
            <linearGradient id="zentrixGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C7FF3D" />
              <stop offset="100%" stopColor="#38E8FF" />
            </linearGradient>
            <filter id="glowZ" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background hexagonal node frame */}
          <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="#0D1118" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="3" />
          
          {/* Main Interlocking Zentrix 'Z' ribbon shape matching uploaded image reference */}
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

          {/* Central Pulsing Node Core */}
          <circle cx="50" cy="50" r="5" fill="#38E8FF" className="animate-pulse" />
        </svg>
      </div>

      {/* Brand Name & Subtitle */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-wider leading-none flex items-center font-sans ${textSizes[size]}`}>
          <span className="text-white">ZENT</span>
          <span className="text-[#38E8FF] drop-shadow-[0_0_10px_rgba(56,232,255,0.4)]">RIX</span>
        </div>
        {showSubtitle && (
          <span className={`font-mono font-medium tracking-[0.25em] text-[#9BA7B7] uppercase mt-1 ${subtitleSizes[size]}`}>
            FREELANCER PLATFORM
          </span>
        )}
      </div>
    </div>
  );
};

export const NexoraLogo = ZentrixLogo;
