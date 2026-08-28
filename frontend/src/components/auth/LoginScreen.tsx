import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../services/authContext';
import { ZentrixLogo } from '../branding/ZentrixLogo';
import { AnimatedMascot } from './AnimatedMascot';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, UserCheck, ShieldAlert, PhoneCall } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('teama@zentrix.com');
  const [password, setPassword] = useState('TeamA@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Focus tracking for interactive mascot reaction
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Google OAuth Popup Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleAccount, setGoogleAccount] = useState('alex.developer@gmail.com');

  // Canvas ref for interactive moving particles animation on login page
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Floating particles pool
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.4 ? '#38E8FF' : '#C7FF3D'
    }));

    // Moving laser beam y-position
    let beamY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render moving grid scanner beam line
      beamY = (beamY + 1.2) % height;
      const grad = ctx.createLinearGradient(0, beamY - 40, 0, beamY + 40);
      grad.addColorStop(0, 'rgba(56, 232, 255, 0)');
      grad.addColorStop(0.5, 'rgba(56, 232, 255, 0.15)');
      grad.addColorStop(1, 'rgba(56, 232, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, beamY - 40, width, 80);

      // Render particles & connecting lines
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 100) * 0.15;
            ctx.strokeStyle = '#38E8FF';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const loginEmail = email.trim() || 'teama@zentrix.com';
    const loginPass = password.trim() || 'TeamA@123';

    try {
      const result = await login(loginEmail, loginPass);
      if (!result.success) {
        setError(result.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = async (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError(null);
    setLoading(true);
    try {
      await login(accEmail, accPass);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await login(googleAccount || 'admin@zentrix.com', 'Admin@123');
    } catch {
    } finally {
      setGoogleLoading(false);
      setShowGoogleModal(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden bg-[#05070B] font-sans selection:bg-[#38E8FF] selection:text-black">
      
      {/* BRUTALIST VOID MOVING BACKGROUND: Particles Canvas + Pulsing Orbs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />

      <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-gradient-to-br from-[#38E8FF]/20 via-[#0072FF]/10 to-transparent rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute -bottom-40 -right-40 w-[650px] h-[650px] bg-gradient-to-tl from-[#C7FF3D]/15 via-transparent to-transparent rounded-full blur-[150px] pointer-events-none animate-glow-pulse" />

      {/* Main Brutalist Void Container with Hover Glow */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl border border-white/15 bg-[#0D1118]/90 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">

        {/* LEFT COLUMN: Interactive Animated Face Mascot */}
        <div className="lg:col-span-6 relative p-8 sm:p-12 lg:p-14 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#05070B] via-[#0D1118] to-[#111722] border-b lg:border-b-0 lg:border-r border-white/10">
          
          {/* Top Brand Header */}
          <div className="relative z-10">
            <ZentrixLogo size="lg" />
          </div>

          {/* Center Interactive Animated Mascot */}
          <div className="relative z-10 my-4 flex items-center justify-center">
            <AnimatedMascot
              isEmailFocused={isEmailFocused}
              isPasswordFocused={isPasswordFocused}
              emailLength={email.length}
              showPassword={showPassword}
            />
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 flex items-center justify-between text-xs text-[#64748B] font-mono pt-6 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-[#38E8FF]">
              <ShieldCheck className="w-4 h-4 text-[#38E8FF]" /> Encrypted Workspace Access
            </span>
            <span>v3.0 Interactive</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Minimalist Void Login Form + Google Auth */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-[#111722]/95 backdrop-blur-2xl relative">
          
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <h2 className="text-2xl font-black text-white tracking-wide">
                System Authentication
              </h2>
              <p className="text-xs text-[#9BA7B7] mt-1 font-mono">
                Enter your credentials to sign in to your workspace.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              
              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-shake font-mono">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* EMAIL / USER ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#9BA7B7] block">
                  EMAIL / USER ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    placeholder="teama@zentrix.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#05070B] border border-white/15 text-white placeholder-[#64748B] focus:border-[#38E8FF] focus:ring-1 focus:ring-[#38E8FF] transition-all text-sm font-mono"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#9BA7B7]">
                    PASSWORD
                  </label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Contact system administrator to reset password."); }} className="text-xs font-mono text-[#38E8FF] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#05070B] border border-white/15 text-white placeholder-[#64748B] focus:border-[#38E8FF] focus:ring-1 focus:ring-[#38E8FF] transition-all text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#9BA7B7]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#05070B] border-white/20 text-[#38E8FF] focus:ring-0 cursor-pointer"
                  />
                  <span className="font-mono">Remember session</span>
                </label>
              </div>

              {/* SIGN UP / SIGN IN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#38E8FF] text-black font-extrabold text-xs font-mono tracking-widest uppercase hover:bg-[#22d6ed] transition-all shadow-[0_0_25px_rgba(56,232,255,0.4)] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>SIGN UP / SIGN IN</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-white/10 w-full" />
              <span className="absolute bg-[#111722] px-3 text-[10px] font-mono text-[#64748B] uppercase">OR</span>
            </div>

            {/* SIGN UP WITH GOOGLE BUTTON */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-white/5 border border-white/15 hover:border-white/30 text-white font-medium text-xs font-mono flex items-center justify-center gap-3 transition-all hover:bg-white/10 shadow-lg cursor-pointer group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.04 0 12s.47 3.79 1.29 5.42l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span className="group-hover:text-[#38E8FF] transition-colors">Sign up with Google</span>
            </button>

            <div className="pt-2 text-center text-xs text-[#64748B] font-mono">
              Protected by <span className="text-white font-semibold">Zentrix Security System</span>
            </div>
          </div>
        </div>

      </div>

      {/* GOOGLE OAUTH SIGN-IN SIMULATED MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#111722] border border-white/20 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.04 0 12s.47 3.79 1.29 5.42l3.99-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span className="font-bold text-white text-sm">Sign in with Google</span>
              </div>
              <button onClick={() => setShowGoogleModal(false)} className="text-[#64748B] hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#9BA7B7]">Choose a Google Account to sign in to <strong className="text-white">Zentrix Platform</strong>:</p>

              <div
                onClick={handleGoogleLogin}
                className="p-3.5 rounded-xl bg-[#05070B] border border-white/10 hover:border-[#38E8FF] transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#38E8FF]/20 text-[#38E8FF] font-bold flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#38E8FF]">Alex Developer</div>
                    <div className="text-[11px] text-[#9BA7B7] font-mono">{googleAccount}</div>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#38E8FF]" />
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-[10px] font-mono text-[#64748B] uppercase">OR USE ANOTHER GOOGLE EMAIL</label>
                <input
                  type="email"
                  value={googleAccount}
                  onChange={(e) => setGoogleAccount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#05070B] border border-white/10 text-white text-xs font-mono outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full py-3 rounded-xl bg-[#38E8FF] text-black font-bold text-xs font-mono tracking-wider uppercase hover:bg-[#22d6ed] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>AUTHENTICATE VIA GOOGLE</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
