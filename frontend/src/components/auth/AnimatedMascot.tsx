import React, { useState, useEffect } from 'react';

interface AnimatedMascotProps {
  isEmailFocused: boolean;
  isPasswordFocused: boolean;
  emailLength: number;
  showPassword: boolean;
}

export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
  isEmailFocused,
  isPasswordFocused,
  emailLength,
  showPassword,
}) => {
  const [blink, setBlink] = useState(false);

  // Natural blinking effect when idle or looking at email
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Calculate eye tracking position based on email text length
  const maxTrack = 14;
  const eyeOffset = Math.min(Math.max((emailLength - 8) * 1.2, -maxTrack), maxTrack);

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      {/* Animated Glowing Mascot Stage */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        
        {/* Soft Background Radial Aura Glow */}
        <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-500 ${
          isPasswordFocused 
            ? 'bg-[#9B7CFF]/25 scale-95' 
            : isEmailFocused 
              ? 'bg-[#38E8FF]/30 scale-110' 
              : 'bg-[#C7FF3D]/20 scale-100'
        }`} />

        {/* Interactive SVG Mascot Character */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-300"
        >
          <defs>
            <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38E8FF" />
              <stop offset="100%" stopColor="#0072FF" />
            </linearGradient>

            <linearGradient id="limeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C7FF3D" />
              <stop offset="100%" stopColor="#84CC16" />
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ears / Antennas */}
          <g className="transition-transform duration-300">
            {/* Left Ear */}
            <path
              d="M 45 65 Q 25 30 55 45 Z"
              fill="url(#cyanGrad)"
              className={`transition-all duration-300 origin-center ${
                isEmailFocused ? '-rotate-6 translate-y-[-2px]' : isPasswordFocused ? 'rotate-12' : ''
              }`}
            />
            {/* Right Ear */}
            <path
              d="M 155 65 Q 175 30 145 45 Z"
              fill="url(#cyanGrad)"
              className={`transition-all duration-300 origin-center ${
                isEmailFocused ? 'rotate-6 translate-y-[-2px]' : isPasswordFocused ? '-rotate-12' : ''
              }`}
            />
          </g>

          {/* Head Base Outer Border */}
          <rect
            x="30"
            y="45"
            width="140"
            height="125"
            rx="50"
            fill="url(#headGrad)"
            stroke={isPasswordFocused ? '#9B7CFF' : isEmailFocused ? '#38E8FF' : '#334155'}
            strokeWidth="4"
            className="transition-colors duration-300"
          />

          {/* Cheek Blush Dots */}
          <circle cx="55" cy="125" r="10" fill="#FF7A8A" opacity="0.35" />
          <circle cx="145" cy="125" r="10" fill="#FF7A8A" opacity="0.35" />

          {/* EYES SECTION */}
          {isPasswordFocused && !showPassword ? (
            /* CLOSED EYES MODE (Shy Hands Cover / Closed Curved Arcs) */
            <g filter="url(#glow)">
              {/* Left Closed Eye Arc */}
              <path
                d="M 55 98 Q 70 112 85 98"
                fill="none"
                stroke="#9B7CFF"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Right Closed Eye Arc */}
              <path
                d="M 115 98 Q 130 112 145 98"
                fill="none"
                stroke="#9B7CFF"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          ) : isPasswordFocused && showPassword ? (
            /* PEEKING EYE MODE (Toggled Show Password) */
            <g>
              {/* Left Eye Peeking Winking */}
              <path
                d="M 55 98 Q 70 112 85 98"
                fill="none"
                stroke="#38E8FF"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Right Eye Wide Open Peeking */}
              <circle cx="130" cy="98" r="16" fill="#05070B" stroke="#38E8FF" strokeWidth="3" />
              <circle cx="130" cy="98" r="8" fill="#38E8FF" filter="url(#glow)" />
              <circle cx="133" cy="95" r="3" fill="#FFFFFF" />
            </g>
          ) : (
            /* OPEN EYES MODE (Idle & Email Tracking) */
            <g className="transition-all duration-200">
              {/* Left Eye Socket */}
              <rect
                x="52"
                y="80"
                width="36"
                height={blink ? "4" : "36"}
                rx={blink ? "2" : "18"}
                fill="#05070B"
                stroke={isEmailFocused ? '#38E8FF' : '#1E293B'}
                strokeWidth="3"
                className="transition-all duration-150"
              />
              {/* Left Pupil */}
              {!blink && (
                <circle
                  cx={70 + (isEmailFocused ? eyeOffset : 0)}
                  cy={98}
                  r="9"
                  fill="#38E8FF"
                  filter="url(#glow)"
                  className="transition-all duration-150"
                />
              )}
              {!blink && (
                <circle
                  cx={73 + (isEmailFocused ? eyeOffset : 0)}
                  cy={95}
                  r="3"
                  fill="#FFFFFF"
                />
              )}

              {/* Right Eye Socket */}
              <rect
                x="112"
                y="80"
                width="36"
                height={blink ? "4" : "36"}
                rx={blink ? "2" : "18"}
                fill="#05070B"
                stroke={isEmailFocused ? '#38E8FF' : '#1E293B'}
                strokeWidth="3"
                className="transition-all duration-150"
              />
              {/* Right Pupil */}
              {!blink && (
                <circle
                  cx={130 + (isEmailFocused ? eyeOffset : 0)}
                  cy={98}
                  r="9"
                  fill="#38E8FF"
                  filter="url(#glow)"
                  className="transition-all duration-150"
                />
              )}
              {!blink && (
                <circle
                  cx={133 + (isEmailFocused ? eyeOffset : 0)}
                  cy={95}
                  r="3"
                  fill="#FFFFFF"
                />
              )}
            </g>
          )}

          {/* MOUTH SECTION */}
          {isPasswordFocused && !showPassword ? (
            /* Cute O-mouth / Shy Expression */
            <circle cx="100" cy="135" r="7" fill="#9B7CFF" />
          ) : isEmailFocused ? (
            /* Big Happy Smile */
            <path
              d="M 80 130 Q 100 150 120 130"
              fill="none"
              stroke="#C7FF3D"
              strokeWidth="4"
              strokeLinecap="round"
            />
          ) : (
            /* Gentle Idle Smile */
            <path
              d="M 85 132 Q 100 142 115 132"
              fill="none"
              stroke="#64748B"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* ANIMATED PAWS / HANDS (Rise up to cover eyes when typing password!) */}
          <g className={`transition-all duration-400 ease-out ${
            isPasswordFocused && !showPassword
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0 pointer-events-none'
          }`}>
            {/* Left Paw Covering Eye */}
            <circle cx="70" cy="100" r="18" fill="#1E293B" stroke="#9B7CFF" strokeWidth="3" />
            <circle cx="62" cy="92" r="5" fill="#9B7CFF" />
            <circle cx="72" cy="88" r="5" fill="#9B7CFF" />
            <circle cx="80" cy="93" r="5" fill="#9B7CFF" />

            {/* Right Paw Covering Eye */}
            <circle cx="130" cy="100" r="18" fill="#1E293B" stroke="#9B7CFF" strokeWidth="3" />
            <circle cx="120" cy="93" r="5" fill="#9B7CFF" />
            <circle cx="128" cy="88" r="5" fill="#9B7CFF" />
            <circle cx="138" cy="92" r="5" fill="#9B7CFF" />
          </g>
        </svg>
      </div>

      {/* Professional Tagline */}
      <div className="pt-2 text-center font-sans">
        <p className="text-sm font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-yellow-400 drop-shadow-[0_2px_10px_rgba(255,230,0,0.3)]">
          Work together. Deliver better.
        </p>
      </div>
    </div>
  );
};
