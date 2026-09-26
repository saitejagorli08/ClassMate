import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  GraduationCap, Eye, EyeOff, Mail, Lock, ArrowRight,
  Sparkles, CheckCircle2, Shield, Award, Users, Bot, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const demoAccounts = [
  { role: 'Admin', email: 'admin@sms.edu', password: 'Admin@123!', badge: 'Full Access', color: 'from-emerald-500 to-teal-600' },
  { role: 'Faculty', email: 'rajesh@sms.edu', password: 'Faculty@123!', badge: 'Teacher Portal', color: 'from-teal-500 to-cyan-600' },
  { role: 'Student', email: 'arjun@student.sms.edu', password: 'Student@123!', badge: 'Scholar Portal', color: 'from-emerald-400 to-emerald-600' },
];

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // 3D Tilt calculation
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Max rotation 12 degrees
    const rotateY = (x / (rect.width / 2)) * 12;
    const rotateX = -(y / (rect.height / 2)) * 12;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@sms.edu',
      password: 'Admin@123!',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin' || user.role === 'superadmin') navigate('/admin');
      else if (user.role === 'faculty') navigate('/faculty');
      else navigate('/student');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setValue('email', acc.email);
    setValue('password', acc.password);
    toast.success(`Loaded ${acc.role} demo credentials!`, { icon: '✨' });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen bg-[#04120e] relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-12 perspective-1000"
    >
      {/* ─── 3D Glowing Ambient Lights (Background) ────────────────────── */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/25 rounded-full blur-[128px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid Pattern with perspective overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* ─── Left Section: 3D Isometric Visual Showcase ────────────────── */}
        <div
          className="lg:col-span-7 preserve-3d transition-transform duration-300 ease-out flex flex-col justify-center space-y-6"
          style={{
            transform: `rotateX(${tilt.x * 0.7}deg) rotateY(${tilt.y * 0.7}deg)`,
          }}
        >
          {/* Logo & Header */}
          <div className="flex items-center gap-3.5 translate-z-20">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center shadow-glow text-white font-black text-xl">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white">ClassMate</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                  AI v2.4
                </span>
              </div>
              <p className="text-xs text-emerald-400/80 font-medium">Next-Gen Intelligent Student Management System</p>
            </div>
          </div>

          {/* Hero Headline */}
          <div className="space-y-3 translate-z-30">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              Empowering Minds with <br />
              <span className="gradient-text">3D Intelligence</span>
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/70 max-w-lg leading-relaxed">
              Experience automated institutional workflows, real-time student attendance telemetry, predictive GPA models, and seamless grading copilot.
            </p>
          </div>

          {/* ─── 3D Floating Stage with Realistic Depth Layers ─────────── */}
          <div className="relative h-64 sm:h-72 w-full preserve-3d mt-4">
            
            {/* Center Main Stage Card */}
            <div
              className="absolute left-4 sm:left-8 top-6 right-4 sm:right-16 glass-card-3d rounded-3xl p-6 text-white border border-emerald-400/20 shadow-3d-card transition-all duration-300"
              style={{
                transform: `translateZ(30px) rotateX(${tilt.x * 0.3}deg) rotateY(${tilt.y * 0.3}deg)`,
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-semibold text-emerald-300 ml-2">ClassMate Analytics Engine</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Live Sync
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20">
                  <p className="text-[11px] text-emerald-300/80 font-medium">Avg Attendance</p>
                  <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">94.8%</p>
                  <span className="text-[10px] text-emerald-300 font-semibold">+3.2% vs target</span>
                </div>
                <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-500/20">
                  <p className="text-[11px] text-teal-300/80 font-medium">Batch Retention</p>
                  <p className="text-xl sm:text-2xl font-black text-teal-300 mt-1">98.2%</p>
                  <span className="text-[10px] text-teal-400 font-semibold">Risk: Low</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-900/30 border border-emerald-500/20">
                  <p className="text-[11px] text-emerald-300/80 font-medium">AI Inquiries</p>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">1,420</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">Tutor Active</span>
                </div>
              </div>
            </div>

            {/* Floating 3D Satellite Card 1: Attendance Badge */}
            <div
              className="absolute -top-3 right-0 sm:right-6 glass-card-3d p-3.5 rounded-2xl border border-emerald-400/40 shadow-glow animate-float-slow hidden sm:flex items-center gap-3 z-30"
              style={{
                transform: `translateZ(65px)`,
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">Eligible for Finals</p>
                <p className="text-[10px] text-emerald-300 font-semibold">Attendance: 88.5%</p>
              </div>
            </div>

            {/* Floating 3D Satellite Card 2: AI Copilot */}
            <div
              className="absolute -bottom-4 left-0 sm:left-4 glass-card-3d p-3.5 rounded-2xl border border-teal-400/40 shadow-glow animate-float-reverse hidden sm:flex items-center gap-3 z-30"
              style={{
                transform: `translateZ(80px)`,
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">AI Study Copilot</p>
                <p className="text-[10px] text-teal-300 font-semibold">Personalized Revision Ready</p>
              </div>
            </div>
          </div>

          {/* Quick Demo Role Selector Pills */}
          <div className="pt-2 translate-z-20">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              One-Click Instant Role Preview:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/30 hover:border-emerald-400 text-xs font-bold text-emerald-200 transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${acc.color}`} />
                  <span>{acc.role}</span>
                  <span className="text-[10px] opacity-60">({acc.badge})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Right Section: 3D Interactive Sign-In Card ─────────────────── */}
        <div
          className="lg:col-span-5 preserve-3d transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${-tilt.x * 0.5}deg) rotateY(${-tilt.y * 0.5}deg) translateZ(20px)`,
          }}
        >
          <div className="glass-card-3d rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-3d-card relative overflow-hidden backdrop-blur-2xl bg-[#062019]/90">
            
            {/* Top Sheen */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

            <div className="mb-6">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Secure Portal
              </span>
              <h2 className="text-2xl font-black text-white mt-2">Sign in to ClassMate</h2>
              <p className="text-xs text-emerald-200/70 mt-1">
                Enter your institutional credentials or click a demo account above
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="name@sms.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white placeholder-emerald-600/60 transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white placeholder-emerald-600/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-sm shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 group mt-2"
              >
                {loading ? (
                  'Verifying Credentials...'
                ) : (
                  <>
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-emerald-500/20 text-center">
              <p className="text-[11px] text-emerald-300/60 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Protected by 256-bit HTTP-Only Cookie Authentication
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
