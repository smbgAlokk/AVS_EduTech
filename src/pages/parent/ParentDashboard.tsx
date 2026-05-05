import { ClipboardCheck, CreditCard, Calendar, BookOpen, Megaphone } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { parentData } from '../../data/dashboards';
import './ParentDashboard.css';

export default function ParentDashboard() {
  return (
    <div className="page-container">
      {/* Child Card */}
      <div className="child-card">
        <div className="child-card-avatar">AP</div>
        <div className="child-card-info">
          <h2 className="child-card-name">Aarav Patel</h2>
          <p className="child-card-meta">Class 10-A • Roll No. 15 • AVS Delhi Public School</p>
        </div>
        <div className="child-card-stats">
          <div className="child-stat"><span className="child-stat-value">94%</span><span className="child-stat-label">Attendance</span></div>
          <div className="child-stat-divider" />
          <div className="child-stat"><span className="child-stat-value">5th</span><span className="child-stat-label">Rank</span></div>
          <div className="child-stat-divider" />
          <div className="child-stat"><span className="child-stat-value">A</span><span className="child-stat-label">Grade</span></div>
        </div>
      </div>

      {/* Stats */}
      <div className="three-col" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard title="Attendance This Month" value="22/24" subtitle="92% present" icon={<ClipboardCheck size={22} />} color="primary" progress={{ current: 22, total: 24 }} />
        <StatCard title="Pending Fees" value="₹15,000" subtitle="Due May 10" icon={<CreditCard size={22} />} color="warning" />
        <StatCard title="Upcoming Exams" value="2" subtitle="Half Yearly — May 20" icon={<Calendar size={22} />} color="accent" />
      </div>

      {/* Charts */}
      <div className="two-col" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="glass-card">
          <div className="card-header"><h3 className="card-title">Performance Trend</h3><span className="card-subtitle">Last 5 tests</span></div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={parentData.performanceTrend} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="test" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="marks" stroke="#10B981" strokeWidth={2.5} dot={{ r: 5, fill: '#10B981', stroke: 'white', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card">
          <div className="card-header"><h3 className="card-title">Subject-wise Performance</h3></div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={parentData.subjectPerformance} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="subject" type="category" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="#10B981" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Homework + Notices */}
      <div className="two-col-equal">
        <div className="glass-card">
          <div className="card-header"><h3 className="card-title"><BookOpen size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Today's Homework</h3></div>
          <div className="assignment-list">
            {parentData.homework.map((h, i) => (
              <div key={i} className="assignment-card">
                <div className="assignment-color" style={{ background: i === 0 ? '#10B981' : i === 1 ? '#3B82F6' : '#F59E0B' }} />
                <div className="assignment-info">
                  <div className="assignment-subject" style={{ color: i === 0 ? '#10B981' : i === 1 ? '#3B82F6' : '#F59E0B' }}>{h.subject}</div>
                  <div className="assignment-title">{h.title}</div>
                  <div className="assignment-due">📅 Due: {h.due}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card">
          <div className="card-header"><h3 className="card-title"><Megaphone size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />School Notices</h3></div>
          <div className="notices-list">
            {parentData.notices.map((n, i) => (
              <div key={i} className="notice-item">
                {n.pinned && <span className="notice-pin">📌</span>}
                <div className="notice-content">
                  <div className="notice-title">{n.title}</div>
                  <div className="notice-time">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
