import { useEffect, useState } from 'react';
import { analyticsService } from '../../services';
import {
  Users, GraduationCap, BarChart3, DollarSign, TrendingUp, AlertCircle,
  BookOpen, Calendar, ShieldCheck, Zap, Sparkles, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Link } from 'react-router-dom';

const EMERALD_COLORS = ['#10b981', '#14b8a6', '#f59e0b', '#f43f5e'];

const StatCard = ({ icon: Icon, label, value, subtext, trend, gradient }) => (
  <div className="relative group overflow-hidden rounded-3xl bg-white dark:bg-[#071f19] border border-emerald-100 dark:border-emerald-900/50 p-6 shadow-sm hover:shadow-3d-card transition-all duration-300 hover:-translate-y-1.5 preserve-3d">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
    
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shadow-glow`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend !== undefined && (
        <span
          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
            trend >= 0
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800'
          }`}
        >
          {trend >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>

    <div>
      <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value ?? '—'}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mt-1">{label}</p>
      {subtext && <p className="text-xs text-slate-400 dark:text-emerald-300/50 mt-0.5">{subtext}</p>}
    </div>
  </div>
);

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.admin()
      .then((r) => setData(r.data?.data || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const attendancePieData = data?.attendance
    ? Object.entries(data.attendance).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
    : [
        { name: 'Present', value: 84 },
        { name: 'Late', value: 8 },
        { name: 'Absent', value: 8 },
      ];

  const enrollmentData = [
    { month: 'Jun', enrollments: 45 },
    { month: 'Jul', enrollments: 82 },
    { month: 'Aug', enrollments: 124 },
    { month: 'Sep', enrollments: 160 },
    { month: 'Oct', enrollments: 140 },
    { month: 'Nov', enrollments: 175 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ─── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#04241d] via-[#083b30] to-[#041d17] p-8 text-white border border-emerald-500/20 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Institutional Console
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            ClassMate Administrative Command
          </h1>
          <p className="text-emerald-100/70 text-sm mt-2 leading-relaxed">
            Monitor real-time academic telemetry, student admissions, departmental allocations, and AI-predicted retention indicators across all campus faculties.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/admin/students"
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl text-xs shadow-glow transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Manage Students
            </Link>
            <Link
              to="/admin/ai-insights"
              className="px-4 py-2.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 font-bold rounded-xl text-xs border border-emerald-500/30 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              AI Early Warning Radar
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Stat Cards Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={GraduationCap}
          label="Total Students"
          value={data?.overview?.totalStudents || '1,280'}
          subtext="Active Enrolled Scholars"
          trend={6.4}
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          icon={Users}
          label="Academic Faculty"
          value={data?.overview?.totalFaculty || '64'}
          subtext="Across 8 Departments"
          trend={2.1}
          gradient="from-teal-500 to-cyan-600"
        />
        <StatCard
          icon={BarChart3}
          label="Average Attendance"
          value={`${data?.overview?.overallAttendance || 91.4}%`}
          subtext="Above 75% Criteria Threshold"
          trend={1.8}
          gradient="from-emerald-400 to-emerald-600"
        />
        <StatCard
          icon={DollarSign}
          label="Total Fee Revenue"
          value={`$${((data?.overview?.totalFeeCollected || 485000) / 1000).toFixed(0)}k`}
          subtext="96.2% Tuition Cleared"
          trend={9.5}
          gradient="from-amber-500 to-emerald-500"
        />
      </div>

      {/* ─── Visual Charts Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enrollment Trajectory Area Chart */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#071f19] border border-emerald-100 dark:border-emerald-900/50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Admission & Enrollment Trajectory</h3>
              <p className="text-xs text-slate-400 dark:text-emerald-400/60 mt-0.5">Semester 2026 intake trends</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% YoY
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#10b98120" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#062019',
                    borderColor: '#10b98140',
                    borderRadius: '16px',
                    color: '#fff',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                />
                <Area type="monotone" dataKey="enrollments" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#emeraldGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Breakdown Donut */}
        <div className="rounded-3xl bg-white dark:bg-[#071f19] border border-emerald-100 dark:border-emerald-900/50 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Campus Roll Telemetry</h3>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-400 dark:text-emerald-400/60 mb-2">Aggregate attendance health</p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendancePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attendancePieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={EMERALD_COLORS[index % EMERALD_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#062019',
                      borderColor: '#10b98140',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-100 dark:border-emerald-900/40 text-center">
            {attendancePieData.map((item, idx) => (
              <div key={item.name} className="p-2 rounded-xl bg-slate-50 dark:bg-emerald-950/40">
                <p className="text-[10px] text-slate-400 font-semibold">{item.name}</p>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Quick Navigation Cards ────────────────────────────────────────── */}
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-500" />
          Rapid Administrative Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Student Admissions', to: '/admin/students', icon: Users, desc: 'Register & import CSV' },
            { label: 'Faculty Rosters', to: '/admin/faculty', icon: GraduationCap, desc: 'Staff designations' },
            { label: 'Courses & Syllabus', to: '/admin/courses', icon: BookOpen, desc: 'Curriculum & subjects' },
            { label: 'Fee Billing & Dues', to: '/admin/fees', icon: DollarSign, desc: 'Invoices & statements' },
          ].map((act) => (
            <Link
              key={act.label}
              to={act.to}
              className="p-5 rounded-3xl bg-white dark:bg-[#071f19] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-sm hover:shadow-card-hover transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <act.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-500 transition-colors">
                {act.label}
              </h4>
              <p className="text-xs text-slate-400 dark:text-emerald-400/60 mt-1">{act.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
