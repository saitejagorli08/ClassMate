import { useState } from 'react';
import { CreditCard, CheckCircle, Download, Clock, DollarSign, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const MyFees = () => {
  const [feeInvoices, setFeeInvoices] = useState([
    {
      id: 'INV-2026-001',
      title: 'Semester 5 Tuition & Laboratory Fee',
      dueDate: '2026-10-15',
      totalAmount: 2400,
      paidAmount: 2400,
      status: 'paid',
      paidDate: '2026-08-20',
      breakdown: [
        { item: 'Tuition Fee', amount: 1800 },
        { item: 'Laboratory & Computing Resources', amount: 400 },
        { item: 'Library & Digital Subscriptions', amount: 200 },
      ],
    },
    {
      id: 'INV-2025-002',
      title: 'Semester 4 Tuition Fee',
      dueDate: '2025-02-10',
      totalAmount: 2200,
      paidAmount: 2200,
      status: 'paid',
      paidDate: '2025-01-25',
      breakdown: [
        { item: 'Tuition Fee', amount: 1800 },
        { item: 'Laboratory Fee', amount: 400 },
      ],
    },
  ]);

  const handleDownloadReceipt = (invoiceId) => {
    toast.success(`Receipt for ${invoiceId} generated and ready for print!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-emerald-500" />
            Tuition & Fee Statements
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View term invoices, payment receipts, and balance status
          </p>
        </div>
      </div>

      {/* Summary card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Current Balance Due</p>
          <h2 className="text-3xl font-black text-emerald-600 mt-1">$0.00</h2>
          <p className="text-xs text-slate-400 mt-2">All dues cleared for Sem 5</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Total Paid (Academic Year)</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">$4,600</h2>
          <p className="text-xs text-slate-400 mt-2">2 Invoices settled</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Payment Status</p>
          <h2 className="text-xl font-bold text-emerald-600 mt-2 flex items-center gap-1.5">
            <CheckCircle className="w-5 h-5" /> In Good Standing
          </h2>
          <p className="text-xs text-slate-400 mt-1">Eligible for registration</p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Payment Invoices & Receipts</h3>
        <div className="space-y-4">
          {feeInvoices.map((inv) => (
            <div
              key={inv.id}
              className="p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {inv.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 uppercase">
                    {inv.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1.5">{inv.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paid on {new Date(inv.paidDate).toLocaleDateString()} • Amount: <strong>${inv.totalAmount}</strong>
                </p>
              </div>

              <button
                onClick={() => handleDownloadReceipt(inv.id)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Receipt PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
