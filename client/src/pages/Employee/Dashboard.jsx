import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Calendar, Clock, CheckCircle, XCircle, Plus, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await api.get('/leaves/my');
        // Get only top 5 recent
        setRecentLeaves(res.data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch leaves', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle className="text-emerald-500" size={18} />;
      case 'Rejected': return <XCircle className="text-red-500" size={18} />;
      default: return <Clock className="text-amber-500" size={18} />;
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
      default: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name.split(' ')[0]}! 👋</h2>
          <p className="text-blue-100 text-lg">Here is your leave summary for the year.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="md:col-span-1 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
            <Calendar size={32} />
          </div>
          <h3 className="text-[var(--text-muted)] font-medium mb-1">Annual Leave Balance</h3>
          <div className="text-5xl font-extrabold text-[var(--text-color)]">{user?.annualLeaveBalance}</div>
          <p className="text-sm text-[var(--text-muted)] mt-2">Days available</p>
          
          <Link 
            to="/apply" 
            className="mt-6 w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Apply Leave
          </Link>
        </div>

        {/* Recent Leaves List */}
        <div className="md:col-span-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--text-color)]">Recent Requests</h3>
            <Link to="/history" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group">
              View all
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48">
               <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : recentLeaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-[var(--text-muted)]">
              <Calendar size={48} className="mb-4 opacity-20" />
              <p>No recent leave requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeaves.map((leave) => (
                <div key={leave._id} className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                  <div>
                    <div className="font-semibold text-[var(--text-color)]">{leave.leaveType} Leave</div>
                    <div className="text-sm text-[var(--text-muted)]">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()} ({leave.totalDays} days)
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(leave.status)}`}>
                    {getStatusIcon(leave.status)}
                    {leave.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
