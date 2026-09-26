import { useState, useEffect } from 'react';
import { feeService, studentService } from '../../services';
import { CreditCard, DollarSign, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const FeeManagement = () => {
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await feeService.getAll();
      setFeeRecords(res.data?.data || res.data?.fees || res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load fee records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const totalCollected = feeRecords.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
  const totalPending = feeRecords.reduce((sum, f) => sum + (f.totalAmount - (f.paidAmount || 0)), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-emerald-500" />
            Fees & Billing
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track student fee balances, tuition receipts, and overdue collections
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Total Collections</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">${totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Outstanding Balance</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Total Invoices</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{feeRecords.length}</p>
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading fee records...</div>
        ) : feeRecords.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">No fee records found</h3>
            <p className="text-xs text-slate-500 mt-1">Fee accounts will appear once student invoices are generated.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Fee Type</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Paid</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {feeRecords.map((fee) => {
                  const sName = fee.student?.personalInfo?.firstName
                    ? `${fee.student.personalInfo.firstName} ${fee.student.personalInfo.lastName || ''}`
                    : fee.student?.user?.name || 'Student';

                  return (
                    <tr key={fee._id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{sName}</td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 capitalize">{fee.feeType || 'Tuition Fee'}</td>
                      <td className="py-3.5 px-4 font-semibold">${fee.totalAmount || 0}</td>
                      <td className="py-3.5 px-4 text-emerald-600 font-medium">${fee.paidAmount || 0}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            fee.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : fee.status === 'partial'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          }`}
                        >
                          {fee.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
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
