import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { User, Calendar, Check, X, Clock, MessageSquare } from 'lucide-react';

const ManagerDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [managerComments, setManagerComments] = useState({});

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/leaves');
      setLeaves(res.data);
    } catch (error) {
      console.error('Failed to fetch all leaves', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setProcessingId(id);
    try {
      await api.put(`/leaves/${id}/status`, { 
        status, 
        managerComments: managerComments[id] || '' 
      });
      await fetchLeaves();
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${status.toLowerCase()} leave`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCommentChange = (id, value) => {
    setManagerComments(prev => ({ ...prev, [id]: value }));
  };

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Manager Dashboard</h2>
            <p className="text-slate-300 text-lg">Review and manage team leave requests.</p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="text-4xl font-black text-amber-400">{pendingLeaves.length}</div>
            <div className="text-sm text-slate-300 uppercase tracking-wider font-semibold mt-1">Pending</div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)] flex items-center gap-2">
          <Clock className="text-amber-500" size={20} />
          <h3 className="text-lg font-bold text-[var(--text-color)]">Action Required</h3>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : pendingLeaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[var(--text-muted)]">
            <Check className="mb-4 opacity-30 text-emerald-500" size={48} />
            <p>You're all caught up! No pending requests.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {pendingLeaves.map(leave => (
              <div key={leave._id} className="p-6 transition-colors hover:bg-[var(--bg-color)]">
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  
                  {/* Left info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--text-color)] text-lg">{leave.user.name}</div>
                        <div className="text-sm text-[var(--text-muted)]">{leave.user.email}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg p-3">
                        <div className="text-xs text-[var(--text-muted)] uppercase font-semibold mb-1">Leave Type</div>
                        <div className="font-medium text-[var(--text-color)] flex items-center gap-2">
                          <Calendar size={16} className="text-blue-500" />
                          {leave.leaveType}
                        </div>
                      </div>
                      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg p-3">
                        <div className="text-xs text-[var(--text-muted)] uppercase font-semibold mb-1">Duration</div>
                        <div className="font-medium text-[var(--text-color)]">
                          {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                          <span className="text-sm font-normal text-[var(--text-muted)] ml-1">({leave.totalDays}d)</span>
                        </div>
                      </div>
                    </div>

                    {leave.reason && (
                      <div className="text-sm text-[var(--text-color)] bg-[var(--bg-color)] p-3 rounded-lg border border-[var(--border-color)]">
                        <span className="font-semibold text-[var(--text-muted)] block mb-1">Reason:</span>
                        {leave.reason}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 w-full md:w-72 space-y-3">
                    <div className="relative">
                      <MessageSquare size={16} className="absolute top-3 left-3 text-[var(--text-muted)]" />
                      <textarea
                        placeholder="Add comments (optional)"
                        value={managerComments[leave._id] || ''}
                        onChange={(e) => handleCommentChange(leave._id, e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] text-sm text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-20"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                        disabled={processingId === leave._id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50"
                      >
                        {processingId === leave._id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                        disabled={processingId === leave._id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50"
                      >
                        {processingId === leave._id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <X size={16} />}
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
