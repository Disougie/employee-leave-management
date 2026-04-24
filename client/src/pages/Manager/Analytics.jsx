import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Users, CheckCircle, Clock, XCircle } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const Analytics = () => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leavesRes, usersRes] = await Promise.all([
          api.get('/leaves'),
          api.get('/users')
        ]);
        setLeaves(leavesRes.data);
        setEmployees(usersRes.data);
      } catch (error) {
        console.error('Failed to fetch analytics data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare data for charts
  const statusCount = { Approved: 0, Pending: 0, Rejected: 0 };
  const typeCount = {};
  
  leaves.forEach(l => {
    statusCount[l.status]++;
    typeCount[l.leaveType] = (typeCount[l.leaveType] || 0) + 1;
  });

  const pieData = Object.keys(statusCount).map(key => ({
    name: key, value: statusCount[key]
  }));

  const barData = Object.keys(typeCount).map(key => ({
    name: key, count: typeCount[key]
  }));

  const calendarEvents = leaves
    .filter(l => l.status === 'Approved')
    .map(leave => {
      const end = new Date(leave.endDate);
      end.setDate(end.getDate() + 1);
      return {
        id: leave._id,
        title: `${leave.user?.name} (${leave.leaveType})`,
        start: leave.startDate,
        end: end.toISOString().split('T')[0],
        backgroundColor: '#3b82f6',
        borderColor: 'transparent',
      };
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
         <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--text-color)]">{employees.length}</div>
            <div className="text-sm text-[var(--text-muted)] font-medium">Total Employees</div>
          </div>
        </div>
        
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--text-color)]">{statusCount.Approved}</div>
            <div className="text-sm text-[var(--text-muted)] font-medium">Approved Leaves</div>
          </div>
        </div>

        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--text-color)]">{statusCount.Pending}</div>
            <div className="text-sm text-[var(--text-muted)] font-medium">Pending Requests</div>
          </div>
        </div>

        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center">
            <XCircle size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--text-color)]">{statusCount.Rejected}</div>
            <div className="text-sm text-[var(--text-muted)] font-medium">Rejected Leaves</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-color)] mb-6">Leave Requests by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-color)] mb-6">Requests by Leave Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{fill: 'var(--bg-color)'}}
                  contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[var(--text-color)] mb-6">Team Leave Calendar (Approved)</h3>
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
            plugins={[dayGridPlugin]}
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
    </div>
  );
};

export default Analytics;
