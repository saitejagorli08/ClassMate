import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { classService, assignmentService } from '../../services';
import {
  Users, BookOpen, ClipboardList, Bot, Calendar,
  ArrowRight, Award, Clock, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FacultyDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    classService.getAll().then((res) => {
      setClasses(res.data?.data || res.data || []);
    }).catch(console.error);

    assignmentService.getAll().then((res) => {
      setAssignments(res.data?.data || res.data || []);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
            Faculty Teaching Workspace
          </span>
          <h1 className="text-3xl font-black mt-3">Welcome back, Prof. {user?.name || 'Instructor'}!</h1>
          <p className="text-indigo-100 text-sm mt-2">
            You have active classes scheduled today. Mark attendance, review student submissions, or use AI to generate quizzes in seconds.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/faculty/attendance"
              className="px-4 py-2 bg-white text-indigo-700 font-semibold rounded-xl text-sm shadow hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              Take Attendance
            </Link>
            <Link
              to="/faculty/ai-tools"
              className="px-4 py-2 bg-indigo-500/30 backdrop-blur-sm text-white font-semibold rounded-xl text-sm border border-white/20 hover:bg-indigo-500/50 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Quiz Generator
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">My Assigned Classes</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{classes.length || 3}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Active Coursework</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{assignments.length || 4}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Avg. Attendance Rate</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-0.5">88.5%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Class Schedule & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Sections</h2>
            <Link to="/faculty/attendance" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Mark Roll Call →
            </Link>
          </div>
          <div className="space-y-3">
            {classes.length === 0 ? (
              <p className="text-sm text-slate-400">No classes assigned yet.</p>
            ) : (
              classes.map((cls) => (
                <div
                  key={cls._id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{cls.name}</h4>
                    <p className="text-xs text-slate-500">
                      Section {cls.section || 'A'} • Semester {cls.semester}
                    </p>
                  </div>
                  <Link
                    to="/faculty/attendance"
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs rounded-lg transition-colors"
                  >
                    Attendance
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Teaching Copilot Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Bot className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Teaching Copilot</span>
            </div>
            <h3 className="text-xl font-bold">Generate Quiz in 10 Seconds</h3>
            <p className="text-indigo-200 text-xs mt-2 leading-relaxed">
              Feed any syllabus topic to our AI engine to automatically construct multiple choice questions, correct keys, and rubric grading suggestions for your students.
            </p>
          </div>
          <div className="mt-6 relative z-10">
            <Link
              to="/faculty/ai-tools"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-glow"
            >
              Open AI Generator
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
