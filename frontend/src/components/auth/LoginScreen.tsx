import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../services/authContext';
import { ZentrixLogo } from '../branding/ZentrixLogo';
import { AnimatedMascot } from './AnimatedMascot';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

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
      color: Math.random() > 0.4 ? '#D4A017' : '#E8C766'
    }));

    // Moving laser beam y-position
    let beamY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render moving grid scanner beam line
      beamY = (beamY + 1.2) % height;
      const grad = ctx.createLinearGradient(0, beamY - 40, 0, beamY + 40);
      grad.addColorStop(0, 'rgba(212, 160, 23, 0)');
      grad.addColorStop(0.5, 'rgba(212, 160, 23, 0.15)');
      grad.addColorStop(1, 'rgba(212, 160, 23, 0)');
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
            ctx.strokeStyle = '#D4A017';
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden bg-[#1F1117] font-sans">
      
      {/* BACKGROUND MOVING PARTICLES & GRADIENTS */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />

      <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-gradient-to-br from-[#5A1833]/40 via-[#D4A017]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[650px] h-[650px] bg-gradient-to-tl from-[#D4A017]/15 via-transparent to-transparent rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl border border-[#3A1F2B] bg-[#2B1720]/95 backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">

        {/* LEFT COLUMN: Animated Mascot */}
        <div className="lg:col-span-6 relative p-8 sm:p-12 lg:p-14 flex flex-col justify-between overflow-hidden bg-[#1F1117] border-b lg:border-b-0 lg:border-r border-[#3A1F2B]">
          
          {/* Top Brand Header */}
          <div className="relative z-10">
            <ZentrixLogo size="lg" />
          </div>

          {/* Center Mascot */}
          <div className="relative z-10 my-4 flex items-center justify-center">
            <AnimatedMascot
              isEmailFocused={isEmailFocused}
              isPasswordFocused={isPasswordFocused}
              emailLength={email.length}
              showPassword={showPassword}
            />
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 flex items-center justify-between text-xs text-[#C9B8BE] font-mono pt-6 border-t border-[#3A1F2B]">
            <span className="flex items-center gap-1.5 text-[#D4A017]">
              <ShieldCheck className="w-4 h-4 text-[#D4A017]" /> Encrypted Workspace Access
            </span>
            <span>v3.0 Secure</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-[#2B1720] backdrop-blur-2xl relative">
          
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <h2 className="text-2xl font-black text-[#FFF9F2] tracking-wide">
                System Authentication
              </h2>
              <p className="text-xs text-[#C9B8BE] mt-1 font-mono">
                Enter your credentials to sign in to your Zentrix workspace.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C9B8BE] block">
                  EMAIL / USER ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9B8BE]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    placeholder="teama@zentrix.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] placeholder-[#C9B8BE] focus:border-[#D4A017] transition-all text-sm font-mono outline-none"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C9B8BE]">
                    PASSWORD
                  </label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Contact system administrator to reset password."); }} className="text-xs font-mono text-[#D4A017] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9B8BE]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] placeholder-[#C9B8BE] focus:border-[#D4A017] transition-all text-sm font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C9B8BE] hover:text-[#FFF9F2] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#C9B8BE]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#1F1117] border-[#3A1F2B] text-[#D4A017] focus:ring-0 cursor-pointer"
                  />
                  <span className="font-mono">Remember session</span>
                </label>
              </div>

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#D4A017] text-[#1F1117] font-extrabold text-xs font-mono tracking-widest uppercase hover:bg-[#B8860B] transition-all shadow-[0_0_25px_rgba(212,160,23,0.35)] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#1F1117] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>SIGN IN / ENTER WORKSPACE</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-[#3A1F2B] w-full" />
              <span className="absolute bg-[#2B1720] px-3 text-[10px] font-mono text-[#C9B8BE] uppercase">OR</span>
            </div>

            {/* GOOGLE SIGN IN BUTTON */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1F1117] border border-[#3A1F2B] hover:border-[#D4A017]/50 text-[#FFF9F2] font-medium text-xs font-mono flex items-center justify-center gap-3 transition-all cursor-pointer group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.04 0 12s.47 3.79 1.29 5.42l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span className="group-hover:text-[#D4A017] transition-colors">Sign up with Google</span>
            </button>

            <div className="pt-2 text-center text-xs text-[#C9B8BE] font-mono">
              Protected by <span className="text-[#FFF9F2] font-semibold">Zentrix Security System</span>
            </div>
          </div>
        </div>

      </div>

      {/* GOOGLE OAUTH SIGN-IN SIMULATED MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#2B1720] border border-[#3A1F2B] p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.04 0 12s.47 3.79 1.29 5.42l3.99-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span className="font-bold text-[#FFF9F2] text-sm">Sign in with Google</span>
              </div>
              <button onClick={() => setShowGoogleModal(false)} className="text-[#C9B8BE] hover:text-[#FFF9F2] font-bold">✕</button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <p className="text-[#C9B8BE]">Choose a Google Account to sign in to <strong className="text-[#FFF9F2]">Zentrix Platform</strong>:</p>

              <div
                onClick={handleGoogleLogin}
                className="p-3.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] hover:border-[#D4A017] transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#D4A017]/20 text-[#D4A017] font-bold flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#FFF9F2] group-hover:text-[#D4A017]">Alex Developer</div>
                    <div className="text-[11px] text-[#C9B8BE] font-mono">{googleAccount}</div>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#D4A017]" />
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-[10px] font-mono text-[#C9B8BE] uppercase">OR USE ANOTHER GOOGLE EMAIL</label>
                <input
                  type="email"
                  value={googleAccount}
                  onChange={(e) => setGoogleAccount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] text-xs font-mono outline-none focus:border-[#D4A017]"
                />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full py-3 rounded-xl bg-[#D4A017] text-[#1F1117] font-bold text-xs font-mono tracking-wider uppercase hover:bg-[#B8860B] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(212,160,23,0.35)]"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-[#1F1117] border-t-transparent rounded-full animate-spin" />
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
