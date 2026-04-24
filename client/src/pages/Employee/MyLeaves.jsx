import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar, List, CheckCircle, XCircle, Clock } from 'lucide-react';

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await api.get('/leaves/my');
        setLeaves(res.data);
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
      case 'Approved': return <CheckCircle className="text-emerald-500" size={16} />;
      case 'Rejected': return <XCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-amber-500" size={16} />;
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
      default: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
    }
  };

  const calendarEvents = leaves.map(leave => {
    // FullCalendar end date is exclusive, so we add 1 day to visually span correctly
    const end = new Date(leave.endDate);
    end.setDate(end.getDate() + 1);

    return {
      id: leave._id,
      title: `${leave.leaveType} (${leave.status})`,
      start: leave.startDate,
      end: end.toISOString().split('T')[0],
      backgroundColor: leave.status === 'Approved' ? '#10b981' : leave.status === 'Rejected' ? '#ef4444' : '#f59e0b',
      borderColor: 'transparent',
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-color)]">Leave History</h2>
          <p className="text-[var(--text-muted)]">Track all your past and upcoming time off.</p>
        </div>
        
        <div className="flex bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg p-1">
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'list' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-color)]'}`}
          >
            <List size={16} />
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'calendar' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-color)]'}`}
          >
            <Calendar size={16} />
            Calendar
          </button>
        </div>
      </div>

      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : view === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-color)] border-b border-[var(--border-color)]">
                  <th className="py-4 px-6 font-semibold text-sm text-[var(--text-muted)]">Type</th>
                  <th className="py-4 px-6 font-semibold text-sm text-[var(--text-muted)]">Duration</th>
                  <th className="py-4 px-6 font-semibold text-sm text-[var(--text-muted)]">Days</th>
                  <th className="py-4 px-6 font-semibold text-sm text-[var(--text-muted)]">Status</th>
                  <th className="py-4 px-6 font-semibold text-sm text-[var(--text-muted)]">Applied On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-[var(--text-muted)]">No leave history found.</td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-[var(--bg-color)] transition-colors">
                      <td className="py-4 px-6 font-medium text-[var(--text-color)]">{leave.leaveType}</td>
                      <td className="py-4 px-6 text-[var(--text-color)]">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-[var(--text-color)]">{leave.totalDays}</td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(leave.status)}`}>
                          {getStatusIcon(leave.status)}
                          {leave.status}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[var(--text-muted)] text-sm">
                        {new Date(leave.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <div className="calendar-container">
              <style>{`
                .fc { --fc-page-bg-color: transparent; --fc-neutral-bg-color: var(--bg-color); --fc-border-color: var(--border-color); color: var(--text-color); }
                .fc-theme-standard td, .fc-theme-standard th { border-color: var(--border-color); }
                .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 600; }
                .fc .fc-button-primary { background-color: var(--primary); border-color: var(--primary); }
                .fc .fc-button-primary:not(:disabled):active, .fc .fc-button-primary:not(:disabled).fc-button-active { background-color: var(--color-primary-dark); border-color: var(--color-primary-dark); }
                .fc-event { cursor: pointer; border-radius: 4px; padding: 2px; font-size: 0.75rem; font-weight: 500; }
              `}</style>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                height="auto"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLeaves;
