import { Users, GraduationCap, ClipboardCheck, CreditCard, Calendar, BookOpen, Clock } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line
} from 'recharts';
import { principalData } from '../../data/dashboards';
import './PrincipalDashboard.css';

const getActivityColor = (type: string) => {
  const colors: Record<string, string> = {
    attendance: 'var(--primary-500)',
    fee: 'var(--success)',
    homework: 'var(--info)',
    sdf: 'var(--warning)',
    meeting: 'var(--accent-500)',
    general: 'var(--text-tertiary)',
  };
  return colors[type] || 'var(--text-tertiary)';
};

export default function PrincipalDashboard() {
  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div className="principal-welcome">
        <div className="principal-welcome-left">
          <h1 className="page-title">Good Morning, Dr. Mehta 👋</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="principal-quick-stats">
          <div className="pqs-item">
            <GraduationCap size={16} />
            <span><strong>1,245</strong> Students</span>
          </div>
          <div className="pqs-divider" />
          <div className="pqs-item">
            <Users size={16} />
            <span><strong>89</strong> Teachers</span>
          </div>
          <div className="pqs-divider" />
          <div className="pqs-item">
            <ClipboardCheck size={16} />
            <span><strong>92%</strong> Attendance</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard title="Today's Attendance" value="92%" subtitle="1,146 out of 1,245 students" icon={<ClipboardCheck size={22} />} trend={{ value: 1.2, label: 'vs yesterday' }} color="primary" />
        <StatCard title="Fee Collection" value="₹18.5L" subtitle="This month" icon={<CreditCard size={22} />} progress={{ current: 18.5, total: 22 }} color="success" />
        <StatCard title="Pending Reviews" value="23" subtitle="Homework submissions" icon={<BookOpen size={22} />} color="warning" />
        <StatCard title="Upcoming Exams" value="3" subtitle="In next 2 weeks" icon={<Calendar size={22} />} color="accent" />
      </div>

      {/* Charts */}
      <div className="two-col" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">Class-wise Attendance Today</h3>
            <span className="card-subtitle">Present vs Absent</span>
          </div>
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={principalData.classAttendance} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="cls" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px' }} />
                <Bar dataKey="present" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} name="Present" />
                <Bar dataKey="absent" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">Today's Schedule</h3>
            <span className="card-subtitle">
              <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> School timeline
            </span>
          </div>
          <div className="schedule-timeline">
            {principalData.todaySchedule.map((item, i) => (
              <div key={i} className={`schedule-item schedule-item--${item.type}`}>
                <div className="schedule-time">{item.time}</div>
                <div className="schedule-dot" />
                <div className="schedule-event">{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fee Trend + Activity */}
      <div className="two-col">
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">Fee Collection vs Target</h3>
            <span className="card-subtitle">Monthly (₹ Lakhs)</span>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={principalData.feeMonthly} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}L`} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px' }} />
                <Line type="monotone" dataKey="target" stroke="var(--grey-400)" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Target" />
                <Line type="monotone" dataKey="collected" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} name="Collected" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <button className="card-action">View All</button>
          </div>
          <div className="activity-feed">
            {principalData.recentActivity.map((item, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{ background: getActivityColor(item.type) }} />
                <div className="activity-content">
                  <div className="activity-text">{item.text}</div>
                  <div className="activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
