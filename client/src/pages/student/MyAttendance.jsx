import { useState, useEffect } from 'react';
import { attendanceService } from '../../services';
import { ClipboardList, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const MyAttendance = () => {
  const [subjectsAttendance, setSubjectsAttendance] = useState([
    { subject: 'Data Structures & Algorithms', code: 'CS301', attended: 24, total: 28, percentage: 86 },
    { subject: 'Database Management Systems', code: 'CS302', attended: 22, total: 26, percentage: 85 },
    { subject: 'Operating Systems', code: 'CS303', attended: 18, total: 26, percentage: 69 },
    { subject: 'Computer Networks', code: 'CS304', attended: 25, total: 28, percentage: 89 },
    { subject: 'Software Engineering', code: 'CS305', attended: 20, total: 24, percentage: 83 },
  ]);

  const overallAttended = subjectsAttendance.reduce((a, b) => a + b.attended, 0);
  const overallTotal = subjectsAttendance.reduce((a, b) => a + b.total, 0);
  const overallPercentage = Math.round((overallAttended / overallTotal) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-primary-500" />
            My Attendance Record
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Subject-wise attendance percentage and exam eligibility criteria (Minimum 75% required)
          </p>
        </div>
      </div>

      {/* Warning banner if low attendance */}
      {subjectsAttendance.some((s) => s.percentage < 75) && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm">Attendance Alert: Action Required</p>
            <p>
              Your attendance in <strong>Operating Systems (CS303)</strong> is currently 69%, which is below the mandatory 75% examination eligibility limit. Please attend upcoming lectures to avoid exam disqualification.
            </p>
          </div>
        </div>
      )}

      {/* Aggregate Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Cumulative Attendance</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{overallPercentage}%</h2>
          <p className="text-xs text-slate-400 mt-2">{overallAttended} of {overallTotal} sessions attended</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Total Courses Enrolled</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{subjectsAttendance.length}</h2>
          <p className="text-xs text-slate-400 mt-2">Current Semester (Sem 5)</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Eligible Exam Papers</p>
          <h2 className="text-3xl font-black text-emerald-600 mt-1">
            {subjectsAttendance.filter((s) => s.percentage >= 75).length} / {subjectsAttendance.length}
          </h2>
          <p className="text-xs text-slate-400 mt-2">Based on current attendance</p>
        </div>
      </div>

      {/* Subject-wise Cards */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Subject Attendance Breakdown</h3>
        <div className="space-y-4">
          {subjectsAttendance.map((sub, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{sub.subject}</h4>
                  <p className="text-xs text-slate-400 font-mono">{sub.code}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">
                    {sub.attended} / {sub.total} Classes
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      sub.percentage >= 75
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${sub.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
