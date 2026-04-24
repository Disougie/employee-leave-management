import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Calendar as CalendarIcon, FileText, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    leaveType: 'Annual',
    reason: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/leaves', formData);
      setStatus({ type: 'success', message: 'Leave request submitted successfully!' });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to submit leave request' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CalendarIcon size={20} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-color)]">Apply for Leave</h2>
          </div>
          <p className="text-[var(--text-muted)] mb-8 ml-13">Fill out the form below to request time off.</p>

          {status.message && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${status.type === 'success'
              ? 'bg-emerald-50 border border-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'
              : 'bg-red-50 border border-red-100 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
              }`}>
              {status.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-color)]">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-color)]">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text-color)]">Leave Type</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="Annual">Annual Leave (Balance: {user?.annualLeaveBalance})</option>
                <option value="illness">Sick Leave</option>
                <option value="none_paid">Unpaid Leave</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text-color)]">Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                placeholder="Briefly explain the reason for your leave..."
              ></textarea>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2.5 rounded-xl font-medium text-[var(--text-muted)] hover:bg-[var(--bg-color)] hover:text-[var(--text-color)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || status.type === 'success'}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md shadow-blue-500/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FileText size={18} />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-t border-blue-100 dark:border-blue-800/30 flex items-start gap-3">
          <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Leaves are subject to manager approval. Annual leave balances will only be deducted once the request is approved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
