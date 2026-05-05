import { School, Users, GraduationCap, CreditCard, MapPin } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { superAdminData } from '../../data/dashboards';
import './SuperAdminDashboard.css';

const getBarColor = (value: number) => (value >= 85 ? '#10B981' : value >= 75 ? '#F59E0B' : '#EF4444');

export default function SuperAdminDashboard() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="sa-welcome">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, Rajesh. Here's your network overview.</p>
          </div>
          <div className="sa-welcome-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard title="Total Schools" value="45" subtitle="Active across India" icon={<School size={22} />} trend={{ value: 4.7, label: 'this year' }} color="primary" />
        <StatCard title="Total Students" value="22,547" subtitle="1,234 new admissions" icon={<GraduationCap size={22} />} trend={{ value: 5.8, label: 'vs last year' }} color="accent" />
        <StatCard title="Total Teachers" value="1,892" subtitle="98% active" icon={<Users size={22} />} trend={{ value: 2.1, label: 'vs last year' }} color="info" />
        <StatCard title="Fee Collection" value="₹4.2 Cr" subtitle="This quarter" icon={<CreditCard size={22} />} progress={{ current: 82, total: 100 }} color="success" />
      </div>

      {/* Charts Row */}
      <div className="two-col" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Attendance Chart */}
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">Attendance by School</h3>
            <span className="card-subtitle">Real-time today</span>
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={superAdminData.attendanceBySchool} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                    borderRadius: '8px', fontSize: '13px', boxShadow: 'var(--shadow-lg)'
                  }}
                  formatter={(value: any) => [`${value}%`, 'Attendance']}
                />
                <Bar dataKey="attendance" radius={[0, 6, 6, 0]} barSize={16}>
                  {superAdminData.attendanceBySchool.map((entry, index) => (
                    <Cell key={index} fill={getBarColor(entry.attendance)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts */}
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">Recent Alerts</h3>
            <button className="card-action">View All</button>
          </div>
          <div className="alerts-list">
            {superAdminData.alerts.map(alert => (
              <div key={alert.id} className={`alert-item alert-item--${alert.type}`}>
                <div className={`alert-dot alert-dot--${alert.type}`} />
                <div className="alert-content">
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-desc">{alert.desc}</div>
                </div>
                <span className="alert-time">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="three-col">
        {/* Fee Collection Trend */}
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h3 className="card-title">Fee Collection Trend</h3>
            <span className="card-subtitle">Monthly in ₹ Crores</span>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={superAdminData.feeCollectionTrend} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}Cr`} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                    borderRadius: '8px', fontSize: '13px', boxShadow: 'var(--shadow-lg)'
                  }}
                  formatter={(value: any) => [`₹${value} Cr`, 'Collection']}
                />
                <Area type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2.5} fill="url(#feeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* School Distribution */}
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">School Distribution</h3>
            <span className="card-subtitle">By region</span>
          </div>
          <div style={{ height: 200, display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={superAdminData.schoolDistribution}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {superAdminData.schoolDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                    borderRadius: '8px', fontSize: '13px'
                  }}
                  formatter={(value: any, name: any) => [value, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend">
            {superAdminData.schoolDistribution.map(item => (
              <div key={item.name} className="pie-legend-item">
                <div className="pie-legend-dot" style={{ background: item.color }} />
                <span>{item.name}</span>
                <span className="pie-legend-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Schools Table */}
      <div className="glass-card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header">
          <h3 className="card-title">Top Performing Schools</h3>
          <button className="card-action">View All Schools →</button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>School Name</th>
                <th>Students</th>
                <th>Rating</th>
                <th>Growth</th>
                <th>Region</th>
              </tr>
            </thead>
            <tbody>
              {superAdminData.topSchools.map((school, i) => (
                <tr key={school.name}>
                  <td><span className="rank-badge">{i + 1}</span></td>
                  <td>
                    <div className="school-name-cell">
                      <div className="school-avatar">{school.name.split(' ')[1]?.[0] ?? 'A'}</div>
                      <span>{school.name}</span>
                    </div>
                  </td>
                  <td>{school.students.toLocaleString()}</td>
                  <td>
                    <div className="rating-cell">
                      <span className="rating-star">★</span>
                      {school.rating}
                    </div>
                  </td>
                  <td><span className="trend-badge trend-badge--up">{school.trend}</span></td>
                  <td><span className="region-badge"><MapPin size={12} /> North</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
