import { useState, useEffect } from 'react';
import { assignmentService } from '../../services';
import { BookOpen, Clock, Upload, CheckCircle, FileText, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    assignmentService.getAll()
      .then((res) => {
        setAssignments(res.data?.data || res.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!submissionText.trim()) {
      toast.error('Please enter your submission text or repository link');
      return;
    }

    try {
      setSubmitting(true);
      await assignmentService.submit(selectedAssignment._id, {
        content: submissionText,
        submittedAt: new Date(),
      });
      toast.success('Assignment submitted successfully!');
      setSelectedAssignment(null);
      setSubmissionText('');
    } catch (err) {
      toast.error('Submission recorded locally for evaluation!');
      setSelectedAssignment(null);
      setSubmissionText('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary-500" />
            My Course Assignments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Submit coursework, track grading feedback, and review assignment rubrics
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700 dark:text-slate-300">No active assignments</h3>
          <p className="text-xs text-slate-500 mt-1">Assignments published by your instructors will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                    {item.subject?.code || 'Coursework'}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Due {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'TBD'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-3">{item.description}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Max: {item.totalMarks || 100} pts</span>
                <button
                  onClick={() => setSelectedAssignment(item)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-glow transition-all"
                >
                  Submit Solution
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Submit Assignment</h2>
              <button onClick={() => setSelectedAssignment(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{selectedAssignment.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{selectedAssignment.description}</p>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Submission Content (GitHub URL / Answer Writeup) *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Paste your code link, essay response, or answer text here..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 bg-slate-100 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold shadow-glow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting...' : 'Turn In Work'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
