import { useEffect, useState } from 'react';
import { facultyService, departmentService } from '../../services';
import {
  Users, Plus, Search, Mail, Phone, Building2,
  Trash2, RefreshCw, Award
} from 'lucide-react';
import toast from 'react-hot-toast';

export const FacultyManagement = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    phone: '',
    designation: 'Assistant Professor',
    department: '',
    qualification: '',
    specialization: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facRes, deptRes] = await Promise.all([
        facultyService.getAll({ search }),
        departmentService.getAll(),
      ]);

      const fData = facRes.data?.data || facRes.data?.faculty || facRes.data || [];
      setFacultyList(Array.isArray(fData) ? fData : []);

      const dData = deptRes.data?.data || deptRes.data?.departments || deptRes.data || [];
      setDepartments(Array.isArray(dData) ? dData : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.employeeId) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      setSubmitting(true);
      await facultyService.create({
        user: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          role: 'faculty',
        },
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
        employeeId: formData.employeeId,
        designation: formData.designation,
        department: formData.department || undefined,
        qualification: formData.qualification,
        specialization: formData.specialization,
      });

      toast.success('Faculty member added successfully');
      setShowAddModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        employeeId: '',
        phone: '',
        designation: 'Assistant Professor',
        department: '',
        qualification: '',
        specialization: '',
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add faculty');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this faculty record?')) return;
    try {
      await facultyService.delete(id);
      toast.success('Faculty removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete faculty');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-500" />
            Faculty Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-emerald-400/60">
            Manage academic staff, designations, and departmental assignments
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-glow font-bold text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Faculty
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#071f19] p-4 rounded-3xl shadow-sm border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/60" />
          <input
            type="text"
            placeholder="Search by name, employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-emerald-500/50"
          />
        </div>
        <button
          onClick={fetchData}
          title="Refresh"
          className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 transition-colors border border-emerald-200 dark:border-emerald-800"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Faculty Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading faculty directory...</div>
      ) : facultyList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#071f19] rounded-3xl border border-emerald-100 dark:border-emerald-900/50">
          <Users className="w-12 h-12 text-slate-300 dark:text-emerald-800 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">No faculty members found</h3>
          <p className="text-sm text-slate-500 mt-1">Add your first faculty member to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {facultyList.map((fac) => {
            const name = fac.personalInfo?.firstName
              ? `${fac.personalInfo.firstName} ${fac.personalInfo.lastName || ''}`
              : fac.user?.name || fac.name || 'Faculty Member';
            const email = fac.personalInfo?.email || fac.user?.email || 'N/A';
            const dept = fac.department?.name || fac.department || 'Department';

            return (
              <div
                key={fac._id}
                className="bg-white dark:bg-[#071f19] rounded-3xl p-6 border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-3d-card transition-all duration-300 hover:-translate-y-1 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{name}</h3>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {fac.designation || 'Faculty'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(fac._id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-100 dark:border-emerald-900/40 space-y-2 text-xs text-slate-600 dark:text-emerald-200/80">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>ID: <strong className="text-slate-800 dark:text-white font-mono">{fac.employeeId || '—'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{dept}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{email}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Faculty Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Faculty Member</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FAC-001"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Designation</label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Lab Instructor">Lab Instructor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-glow"
                >
                  {submitting ? 'Adding...' : 'Add Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
