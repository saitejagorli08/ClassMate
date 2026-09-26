import { useState, useEffect } from 'react';
import { classService, subjectService, studentService, attendanceService } from '../../services';
import { ClipboardList, CheckCircle, XCircle, Clock, Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const MarkAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusMap, setStatusMap] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([classService.getAll(), subjectService.getAll()])
      .then(([cRes, sRes]) => {
        const clsList = cRes.data?.data || cRes.data || [];
        setClasses(clsList);
        if (clsList.length > 0) setSelectedClass(clsList[0]._id);

        const subList = sRes.data?.data || sRes.data || [];
        setSubjects(subList);
        if (subList.length > 0) setSelectedSubject(subList[0]._id);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    studentService.getAll({ limit: 50 })
      .then((res) => {
        const stList = res.data?.data || res.data?.students || res.data || [];
        setStudents(stList);
        // Default everyone to present
        const initial = {};
        stList.forEach((s) => {
          initial[s._id] = 'present';
        });
        setStatusMap(initial);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedClass]);

  const handleStatusChange = (studentId, status) => {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s._id] = status;
    });
    setStatusMap(updated);
    toast.success(`Marked all students as ${status}`);
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSubject) {
      toast.error('Please select class and subject');
      return;
    }

    try {
      setSubmitting(true);
      const records = students.map((s) => ({
        student: s._id,
        status: statusMap[s._id] || 'present',
      }));

      await attendanceService.markBulk({
        classId: selectedClass,
        subjectId: selectedSubject,
        date,
        records,
      });

      toast.success('Attendance recorded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-indigo-500" />
            Daily Roll Call
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Record attendance for your current lecture and notify absentees
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || students.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-glow font-medium text-sm transition-all"
        >
          <Save className="w-4 h-4" />
          {submitting ? 'Submitting...' : 'Save Attendance'}
        </button>
      </div>

      {/* Selector Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white"
          >
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} (Sec {cls.section || 'A'})
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white"
          >
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name} ({sub.code})
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMarkAll('present')}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold text-xs rounded-lg hover:bg-emerald-100"
          >
            All Present
          </button>
          <button
            onClick={() => handleMarkAll('absent')}
            className="px-3 py-1.5 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 font-semibold text-xs rounded-lg hover:bg-rose-100"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading student roster...</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">No students enrolled in this section</h3>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {students.map((student) => {
              const name = student.personalInfo?.firstName
                ? `${student.personalInfo.firstName} ${student.personalInfo.lastName || ''}`
                : student.user?.name || student.name || 'Student';
              const currentStatus = statusMap[student._id] || 'present';

              return (
                <div
                  key={student._id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-sm">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{student.rollNo || 'Roll No —'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(student._id, 'present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        currentStatus === 'present'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Present
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(student._id, 'absent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        currentStatus === 'absent'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Absent
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(student._id, 'late')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        currentStatus === 'late'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Late
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
