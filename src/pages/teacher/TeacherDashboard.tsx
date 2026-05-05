import { ClipboardCheck, PenTool, BarChart3, MessageSquare, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { teacherData } from '../../data/dashboards';
import './TeacherDashboard.css';

export default function TeacherDashboard() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Good Morning, Mrs. Sharma 👋</h1>
        <p className="page-subtitle">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} • PGT Mathematics
        </p>
      </div>

      {/* Quick Actions */}
      <div className="three-col" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="quick-action-card quick-action-card--primary">
          <div className="qa-icon"><ClipboardCheck size={24} /></div>
          <div className="qa-info">
            <h3 className="qa-title">Mark Attendance</h3>
            <p className="qa-desc">2 classes pending today</p>
          </div>
          <button className="qa-btn">Mark Now →</button>
        </div>
        <div className="quick-action-card quick-action-card--accent">
          <div className="qa-icon"><PenTool size={24} /></div>
          <div className="qa-info">
            <h3 className="qa-title">Create Assignment</h3>
            <p className="qa-desc">Last created: 2 days ago</p>
          </div>
          <button className="qa-btn">Create →</button>
        </div>
        <div className="quick-action-card quick-action-card--warning">
          <div className="qa-icon"><BarChart3 size={24} /></div>
          <div className="qa-info">
            <h3 className="qa-title">Enter Marks</h3>
            <p className="qa-desc">Unit Test 2 — 28 papers pending</p>
          </div>
          <button className="qa-btn">Enter →</button>
        </div>
      </div>

      {/* Timetable */}
      <div className="glass-card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h3 className="card-title"><Clock size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />Today's Timetable</h3>
        </div>
        <div className="timetable-strip">
          {teacherData.timetable.map(slot => (
            <div key={slot.period} className={`timetable-slot ${slot.current ? 'timetable-slot--current' : ''} ${!slot.class ? 'timetable-slot--free' : ''}`}>
              <div className="ts-period">Period {slot.period}</div>
              <div className="ts-time">{slot.time}</div>
              <div className="ts-subject">{slot.subject}</div>
              {slot.class && <div className="ts-class">{slot.class}</div>}
              {slot.current && <div className="ts-current-badge">NOW</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Submissions + Performance */}
      <div className="two-col" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">Recent Submissions</h3>
            <button className="card-action">View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Assignment</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {teacherData.recentSubmissions.map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{s.student}</td>
                  <td>{s.assignment}</td>
                  <td>{s.date}</td>
                  <td>
                    <span className={`status-badge status-badge--${s.status === 'Graded' ? 'success' : 'warning'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">Class 10-A Performance</h3>
            <span className="card-subtitle">Grade distribution</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={teacherData.classPerformance} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {teacherData.classPerformance.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="performance-legend">
            {teacherData.classPerformance.map(item => (
              <div key={item.name} className="perf-legend-item">
                <div className="perf-legend-dot" style={{ background: item.color }} />
                <span className="perf-legend-label">{item.name}</span>
                <span className="perf-legend-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parent Messages */}
      <div className="glass-card">
        <div className="card-header">
          <h3 className="card-title"><MessageSquare size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />Parent Messages</h3>
          <span className="card-subtitle">3 unread</span>
        </div>
        <div className="messages-list">
          {teacherData.parentMessages.map((msg, i) => (
            <div key={i} className={`message-item ${msg.unread ? 'message-item--unread' : ''}`}>
              <div className="message-avatar">{msg.from[0]}</div>
              <div className="message-content">
                <div className="message-from">{msg.from}</div>
                <div className="message-text">{msg.message}</div>
              </div>
              <div className="message-time">{msg.time}</div>
              {msg.unread && <div className="message-unread-dot" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
