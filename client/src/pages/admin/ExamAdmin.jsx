import { useState, useEffect } from 'react';
import { examinationService, courseService } from '../../services';
import { FileText, Plus, Calendar, Award, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ExamAdmin = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'midterm',
    course: '',
    semester: 1,
    academicYear: '2026-2027',
    startDate: '',
    endDate: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [exRes, cRes] = await Promise.all([
        examinationService.getAll(),
        courseService.getAll(),
      ]);
      setExams(exRes.data?.data || exRes.data || []);
      setCourses(cRes.data?.data || cRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load examinations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await examinationService.create(formData);
      toast.success('Examination scheduled!');
      setShowModal(false);
      setFormData({
        title: '',
        type: 'midterm',
        course: '',
        semester: 1,
        academicYear: '2026-2027',
        startDate: '',
        endDate: '',
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule exam');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-violet-500" />
            Examinations & Results
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Schedule terms, midterms, final examinations and record grading rubrics
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-glow font-medium text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Schedule Exam
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading examinations...</div>
      ) : exams.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700 dark:text-slate-300">No examinations scheduled</h3>
          <p className="text-xs text-slate-500 mt-1">Create an exam to publish timetable and enter grades.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400 uppercase tracking-wide">
                  {exam.type || 'Exam'}
                </span>
                <span className="text-xs text-slate-500 font-medium">Sem {exam.semester || 1}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{exam.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{exam.course?.name || 'Academic Degree'}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{exam.startDate ? new Date(exam.startDate).toLocaleDateString() : 'TBD'}</span>
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                  {exam.status || 'Scheduled'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Schedule New Examination</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Exam Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End Semester Finals 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Exam Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  >
                    <option value="midterm">Midterm</option>
                    <option value="final">Final Exam</option>
                    <option value="quiz">Class Quiz</option>
                    <option value="practical">Practical / Lab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Semester</label>
                  <input
                    type="number"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Course</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                >
                  <option value="">Select Degree Course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold shadow-glow">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
