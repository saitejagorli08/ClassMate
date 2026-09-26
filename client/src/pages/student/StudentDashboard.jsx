import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService, attendanceService, assignmentService } from '../../services';
import {
  GraduationCap, ClipboardList, Award, BookOpen, CreditCard,
  Bot, Clock, AlertTriangle, ArrowRight, Sparkles, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [attendanceRate, setAttendanceRate] = useState(82);
  const [assignments, setAssignments] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    studentService.getMe()
      .then((res) => {
        setProfile(res.data?.data || null);
      })
      .catch(console.error);

    assignmentService.getAll()
      .then((res) => {
        const list = res.data?.data || res.data || [];
        setAssignments(list.slice(0, 3));
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Student Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-700 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
            Student Academic Portal
          </span>
          <h1 className="text-3xl font-black mt-3">Welcome, {user?.name || 'Scholar'}!</h1>
          <p className="text-primary-100 text-sm mt-2">
            Your semester performance is on track. You have upcoming assignment deadlines and your attendance is above the 75% examination threshold.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/student/attendance"
              className="px-4 py-2 bg-white text-primary-700 font-semibold rounded-xl text-sm shadow hover:bg-primary-50 transition-colors flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              Check Attendance
            </Link>
            <Link
              to="/student/ai-tutor"
              className="px-4 py-2 bg-primary-500/30 backdrop-blur-sm text-white font-semibold rounded-xl text-sm border border-white/20 hover:bg-primary-500/50 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Ask AI Study Assistant
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Attendance</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              attendanceRate >= 75 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-100 text-rose-700'
            }`}>
              {attendanceRate >= 75 ? 'Eligible' : 'Warning'}
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{attendanceRate}%</p>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                attendanceRate >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

        {/* Current CGPA */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cumulative GPA</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">3.82 <span className="text-sm font-medium text-slate-400">/ 4.0</span></p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 font-semibold">Top 10% in batch</p>
        </div>

        {/* Pending Assignments */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Tasks</span>
            <BookOpen className="w-4 h-4 text-primary-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">2 Tasks</p>
          <p className="text-xs text-slate-500 mt-3">Due this week</p>
        </div>

        {/* Fee Status */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tuition Fee</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600 mt-2">Paid</p>
          <p className="text-xs text-slate-500 mt-3">Receipt #2026-FEE-88</p>
        </div>
      </div>

      {/* Coursework & AI Tutor Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Assignments list */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Active Assignments</h3>
            <Link to="/student/assignments" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {assignments.length === 0 ? (
              <p className="text-sm text-slate-400">No pending assignments! You are all caught up.</p>
            ) : (
              assignments.map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{item.subject?.name || 'Coursework'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        Due {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Soon'}
                      </span>
                    </p>
                  </div>
                  <Link
                    to="/student/assignments"
                    className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Submit
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Study Assistant Banner */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 p-6 rounded-3xl text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary-300 mb-2">
              <Bot className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Study Partner</span>
            </div>
            <h3 className="text-lg font-bold">Stuck on a tricky concept?</h3>
            <p className="text-indigo-200 text-xs mt-2 leading-relaxed">
              Ask your personalized AI tutor to explain topics in simple terms, break down complex algorithms, or generate flashcards for your exams.
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/student/ai-tutor"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-semibold shadow-glow transition-all"
            >
              Open AI Tutor Chat
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
