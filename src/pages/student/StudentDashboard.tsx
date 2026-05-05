import { BookOpen, Trophy, Calendar, Target } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { studentData } from '../../data/dashboards';
import './StudentDashboard.css';

export default function StudentDashboard() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Welcome back, Aarav! 🎒</h1>
        <p className="page-subtitle">You have 3 assignments due this week • Class 10-A</p>
      </div>

      <div className="glass-card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header"><h3 className="card-title">Today's Schedule</h3></div>
        <div className="timetable-strip">
          {studentData.schedule.map((s, i) => (
            <div key={i} className={`timetable-slot ${s.current ? 'timetable-slot--current' : ''}`}>
              <div className="ts-period">{s.time}</div>
              <div className="ts-subject">{s.subject}</div>
              <div className="ts-class">{s.teacher}</div>
              {s.current && <div className="ts-current-badge">NOW</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="mini-stat mini-stat--green"><div className="mini-stat-icon"><Target size={20} /></div><div className="mini-stat-value">94%</div><div className="mini-stat-label">Attendance</div></div>
        <div className="mini-stat mini-stat--gold"><div className="mini-stat-icon"><Trophy size={20} /></div><div className="mini-stat-value">5th</div><div className="mini-stat-label">Class Rank</div></div>
        <div className="mini-stat mini-stat--pink"><div className="mini-stat-icon"><BookOpen size={20} /></div><div className="mini-stat-value">3</div><div className="mini-stat-label">Pending</div></div>
        <div className="mini-stat mini-stat--blue"><div className="mini-stat-icon"><Calendar size={20} /></div><div className="mini-stat-value">15d</div><div className="mini-stat-label">Next Exam</div></div>
      </div>

      <div className="two-col">
        <div className="glass-card">
          <div className="card-header"><h3 className="card-title">Assignments</h3></div>
          <div className="assignment-list">
            {studentData.assignments.map((a, i) => (
              <div key={i} className="assignment-card">
                <div className="assignment-color" style={{ background: a.color }} />
                <div className="assignment-info">
                  <div className="assignment-subject" style={{ color: a.color }}>{a.subject}</div>
                  <div className="assignment-title">{a.title}</div>
                  <div className={`assignment-due ${a.urgent ? 'assignment-due--urgent' : ''}`}>📅 Due: {a.due}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card">
          <div className="card-header"><h3 className="card-title">My Performance</h3></div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={studentData.performance} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="var(--border-light)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <PolarRadiusAxis tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} domain={[0, 100]} />
                <Radar dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
