import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { announcementService } from '../../services';
import { Megaphone, Plus, Bell, Calendar, Tag, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const AnnouncementsPage = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'academic',
    priority: 'normal',
    targetAudience: 'all',
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await announcementService.getAll();
      setAnnouncements(res.data?.data || res.data?.announcements || res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await announcementService.create(formData);
      toast.success('Announcement broadcasted!');
      setShowModal(false);
      setFormData({
        title: '',
        content: '',
        category: 'academic',
        priority: 'normal',
        targetAudience: 'all',
      });
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish');
    } finally {
      setSubmitting(false);
    }
  };

  const isStaff = user?.role === 'admin' || user?.role === 'faculty' || user?.role === 'superadmin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-primary-500" />
            Notice Board & Broadcasts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Institutional bulletins, exam alerts, holiday circulars, and departmental updates
          </p>
        </div>
        {isStaff && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-glow font-medium text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Publish Notice
          </button>
        )}
      </div>

      {/* Announcements Stream */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700 dark:text-slate-300">No active notices</h3>
          <p className="text-xs text-slate-500 mt-1">Official circulars and announcements will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      item.priority === 'high' || item.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                        : 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-400'
                    }`}
                  >
                    {item.priority || 'Normal'}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
                    {item.category || 'General'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-lg">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              <div className="pt-2 text-xs text-slate-400">
                Audience: <span className="capitalize font-medium text-slate-600 dark:text-slate-300">{item.targetAudience || 'All Members'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Publish Notice</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End Semester Examination Schedule Announcement"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Notice Body *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Enter full notice content..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  >
                    <option value="academic">Academic</option>
                    <option value="exam">Examination</option>
                    <option value="event">Campus Event</option>
                    <option value="holiday">Holiday Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold shadow-glow">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
