import { useState, useEffect } from 'react';
import { attendanceService, classService } from '../../services';
import {
  ClipboardList, CheckCircle, XCircle, Clock,
  Calendar, RefreshCw, BarChart2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AttendanceAdmin = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    classService.getAll().then((res) => {
      const cls = res.data?.data || res.data || [];
      setClasses(cls);
      if (cls.length > 0) setSelectedClass(cls[0]._id);
    }).catch(console.error);
  }, []);

  const fetchAttendance = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const res = await attendanceService.getByClass(selectedClass, { date });
      setRecords(res.data?.data || res.data?.records || res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load attendance logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) fetchAttendance();
  }, [selectedClass, date]);

  // Aggregate stats
  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const total = records.length || 1;
  const attendanceRate = Math.round(((presentCount + lateCount * 0.5) / total) * 100) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-emerald-500" />
            Attendance Records
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor institutional attendance logs, calculate quotas, and flag at-risk absentees
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Attendance Rate</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{attendanceRate}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Present
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{presentCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Absent
          </p>
          <p className="text-2xl font-bold text-rose-500 mt-1">{absentCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-amber-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Late / Excused
          </p>
          <p className="text-2xl font-bold text-amber-500 mt-1">{lateCount}</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white"
          >
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} ({cls.academicYear})
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white"
          />
        </div>

        <button
          onClick={fetchAttendance}
          className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-slate-600 dark:text-slate-300"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Attendance List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading attendance...</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">No attendance records found for this date</h3>
            <p className="text-xs text-slate-500 mt-1">Select another date or take attendance from the faculty portal.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Roll No</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {records.map((rec) => {
                  const sName = rec.student?.personalInfo?.firstName
                    ? `${rec.student.personalInfo.firstName} ${rec.student.personalInfo.lastName || ''}`
                    : rec.student?.user?.name || 'Student';

                  return (
                    <tr key={rec._id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{sName}</td>
                      <td className="py-3.5 px-4 font-mono text-xs">{rec.student?.rollNo || '—'}</td>
                      <td className="py-3.5 px-4 text-slate-500">{new Date(rec.date).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            rec.status === 'present'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : rec.status === 'absent'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">{rec.remarks || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
