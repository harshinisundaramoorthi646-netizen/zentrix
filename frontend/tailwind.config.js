/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#080A0F',
          deep: '#080A0F',
          bg: '#0D1118',
          surface: '#111722',
          elevated: '#161D29',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-bright': 'rgba(255, 255, 255, 0.16)',
        },
        lime: {
          accent: '#C7FF3D',
          glow: 'rgba(199, 255, 61, 0.15)',
        },
        cyan: {
          accent: '#38E8FF',
          glow: 'rgba(56, 232, 255, 0.15)',
        },
        violet: {
          accent: '#9B7CFF',
          glow: 'rgba(155, 124, 255, 0.15)',
        },
        coral: {
          accent: '#FF7A8A',
        },
        success: '#54E38E',
        warning: '#FFC857',
        text: {
          primary: '#F5F7FA',
          secondary: '#9BA7B7',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%': { opacity: '0.4', filter: 'blur(30px)' },
          '100%': { opacity: '0.8', filter: 'blur(45px)' },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'lime-glow': '0 0 25px -5px rgba(199, 255, 61, 0.3)',
        'cyan-glow': '0 0 25px -5px rgba(56, 232, 255, 0.3)',
        'violet-glow': '0 0 25px -5px rgba(155, 124, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
