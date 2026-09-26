import { useEffect, useState } from 'react';
import { departmentService, courseService, subjectService, classService } from '../../services';
import {
  BookOpen, Building2, Layers, Calendar, Plus, RefreshCw,
  Clock, Hash
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CourseManagement = () => {
  const [activeTab, setActiveTab] = useState('courses'); // 'departments' | 'courses' | 'subjects' | 'classes'
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Forms
  const [deptForm, setDeptForm] = useState({ name: '', code: '', description: '' });
  const [courseForm, setCourseForm] = useState({ name: '', code: '', department: '', durationYears: 4, totalSemesters: 8 });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', department: '', credits: 3, type: 'theory' });
  const [classForm, setClassForm] = useState({ name: '', code: '', course: '', semester: 1, section: 'A', academicYear: '2026-2027' });

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [dRes, cRes, sRes, clRes] = await Promise.all([
        departmentService.getAll(),
        courseService.getAll(),
        subjectService.getAll(),
        classService.getAll(),
      ]);

      setDepartments(dRes.data?.data || dRes.data || []);
      setCourses(cRes.data?.data || cRes.data || []);
      setSubjects(sRes.data?.data || sRes.data || []);
      setClasses(clRes.data?.data || clRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load academic data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreateDept = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await departmentService.create(deptForm);
      toast.success('Department created!');
      setShowModal(false);
      setDeptForm({ name: '', code: '', description: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await courseService.create(courseForm);
      toast.success('Course created!');
      setShowModal(false);
      setCourseForm({ name: '', code: '', department: '', durationYears: 4, totalSemesters: 8 });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await subjectService.create(subjectForm);
      toast.success('Subject created!');
      setShowModal(false);
      setSubjectForm({ name: '', code: '', department: '', credits: 3, type: 'theory' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create subject');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await classService.create(classForm);
      toast.success('Class created!');
      setShowModal(false);
      setClassForm({ name: '', code: '', course: '', semester: 1, section: 'A', academicYear: '2026-2027' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create class');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-emerald-500" />
            Academics & Curriculum
          </h1>
          <p className="text-sm text-slate-500 dark:text-emerald-400/60">
            Configure departments, degree courses, syllabus subjects, and class sections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-glow font-bold text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-emerald-100 dark:border-emerald-900/50">
        {[
          { id: 'courses', label: 'Courses & Programs', icon: BookOpen, count: courses.length },
          { id: 'departments', label: 'Departments', icon: Building2, count: departments.length },
          { id: 'subjects', label: 'Subjects', icon: Layers, count: subjects.length },
          { id: 'classes', label: 'Classes & Batches', icon: Calendar, count: classes.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all capitalize ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-emerald-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content Panes */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading curriculum details...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeTab === 'departments' &&
            departments.map((dept) => (
              <div
                key={dept._id}
                className="bg-white dark:bg-[#071f19] p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-3d-card transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {dept.code}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{dept.name}</h3>
                <p className="text-xs text-slate-500 dark:text-emerald-300/60 mt-1 line-clamp-2">{dept.description || 'Academic department'}</p>
              </div>
            ))}

          {activeTab === 'courses' &&
            courses.map((c) => (
              <div
                key={c._id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 rounded-lg">
                    {c.code}
                  </span>
                  <span className="text-xs text-slate-500">{c.durationYears} Years ({c.totalSemesters} Sem)</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{c.department?.name || 'Department'}</p>
              </div>
            ))}

          {activeTab === 'subjects' &&
            subjects.map((s) => (
              <div
                key={s._id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 rounded-lg">
                    {s.code}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 capitalize">
                    {s.credits} Credits • {s.type || 'Theory'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{s.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{s.department?.name || 'Department'}</p>
              </div>
            ))}

          {activeTab === 'classes' &&
            classes.map((cls) => (
              <div
                key={cls._id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-lg">
                    Section {cls.section || 'A'}
                  </span>
                  <span className="text-xs text-slate-500">{cls.academicYear}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{cls.name || `Semester ${cls.semester}`}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {cls.course?.name || 'Degree'} — Semester {cls.semester}
                </p>
              </div>
            ))}
        </div>
      )}

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">Add {activeTab.slice(0, -1)}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold">
                ✕
              </button>
            </div>

            {activeTab === 'departments' && (
              <form onSubmit={handleCreateDept} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Code * (e.g. CSE)</label>
                  <input
                    type="text"
                    required
                    value={deptForm.code}
                    onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl text-sm">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold shadow-glow">Create</button>
                </div>
              </form>
            )}

            {activeTab === 'courses' && (
              <form onSubmit={handleCreateCourse} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Course Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech Computer Science"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Code * (e.g. BT-CSE)</label>
                  <input
                    type="text"
                    required
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Department</label>
                  <select
                    value={courseForm.department}
                    onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl text-sm">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold shadow-glow">Create</button>
                </div>
              </form>
            )}

            {activeTab === 'subjects' && (
              <form onSubmit={handleCreateSubject} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Code *</label>
                    <input
                      type="text"
                      required
                      value={subjectForm.code}
                      onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Credits</label>
                    <input
                      type="number"
                      value={subjectForm.credits}
                      onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl text-sm">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold shadow-glow">Create</button>
                </div>
              </form>
            )}

            {activeTab === 'classes' && (
              <form onSubmit={handleCreateClass} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Class / Section Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS 6th Sem - Section A"
                    value={classForm.name}
                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Course</label>
                    <select
                      value={classForm.course}
                      onChange={(e) => setClassForm({ ...classForm, course: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    >
                      <option value="">Select Course</option>
                      {courses.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Semester</label>
                    <input
                      type="number"
                      value={classForm.semester}
                      onChange={(e) => setClassForm({ ...classForm, semester: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl text-sm">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold shadow-glow">Create</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
