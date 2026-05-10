import { useState, useMemo, useCallback, type ReactNode } from 'react';
import {
  LayoutDashboard, School as SchoolIcon, TrendingUp, AlertTriangle, Settings,
  ClipboardCheck, Users, Inbox, Calendar as CalendarIcon, CheckCircle2, Clock,
  BookCheck, FileEdit, BarChart3, PlusCircle, ChevronLeft, ChevronRight,
  Search, MapPin, Phone, Send, FileText, Heart, Stethoscope, Plane, Trophy,
  Briefcase, AlertCircle, XCircle, Sparkles, ArrowUpRight, ArrowDownRight,
  CalendarOff, Flame, GraduationCap, Hourglass, Save, Star, X, Shield
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, BarChart, Bar, Cell, LineChart, Line
} from 'recharts';
import {
  schoolAttendance, networkSnapshot, classAttendance, classRoll10A, defaulters,
  leaveApplications, holidays, dailyTrendNetwork, dailyTrendSchool, monthlyTrend,
  demoStudentMonth, demoStudentSubjectAttendance, demoStudentSummary,
  DEMO_SCHOOL_CODE, DEMO_SCHOOL_NAME, DEMO_STUDENT_NAME, DEMO_STUDENT_CLASS,
  DEMO_STUDENT_SECTION, DEMO_TEACHER_NAME, DEMO_TEACHER_CLASSES,
  ATTENDANCE_THRESHOLD,
  type AttendanceStatus, type LeaveApplication, type LeaveCategory, type StudentRoll,
  type DefaulterStudent, type DayAttendance, type ApplicantRole,
} from '../../data/attendance';
import StaffWatchPanel from './StaffWatchPanel';
import PoliciesPanel from './PoliciesPanel';
import './AttendanceModule.css';

type Role = 'super-admin' | 'principal' | 'teacher' | 'student' | 'parent';

interface Props { role: Role; }

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES — used across multiple roles
   ═══════════════════════════════════════════════════════════════════════════ */

interface KpiTileProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: ReactNode;
  tone?: 'primary' | 'accent' | 'info' | 'warning' | 'success' | 'danger';
  trend?: { value: number; label?: string };
}

function KpiTile({ label, value, hint, icon, tone = 'primary', trend }: KpiTileProps) {
  return (
    <div className="att-kpi">
      <div className={`att-kpi-icon att-kpi-icon--${tone}`}>{icon}</div>
      <div className="att-kpi-body">
        <div className="att-kpi-value">{value}</div>
        <div className="att-kpi-label">{label}</div>
        {hint && <div className="att-kpi-hint">{hint}</div>}
        {trend && (
          <div className={`att-kpi-trend ${trend.value >= 0 ? 'up' : 'down'}`}>
            {trend.value >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {Math.abs(trend.value).toFixed(1)}% {trend.label ?? ''}
          </div>
        )}
      </div>
    </div>
  );
}

const STATUS_TONE: Record<AttendanceStatus, { color: string; bg: string; label: string }> = {
  present:   { color: 'var(--primary-700)', bg: 'rgba(16, 185, 129, 0.15)',  label: 'Present' },
  absent:    { color: 'var(--danger)',      bg: 'rgba(239, 68, 68, 0.12)',    label: 'Absent' },
  late:      { color: 'var(--warning)',     bg: 'rgba(245, 158, 11, 0.14)',   label: 'Late' },
  leave:     { color: 'var(--info)',        bg: 'rgba(59, 130, 246, 0.12)',   label: 'Leave' },
  holiday:   { color: 'var(--accent-600)',  bg: 'rgba(244, 114, 182, 0.12)',  label: 'Holiday' },
  weekend:   { color: '#94A3B8',            bg: 'rgba(148, 163, 184, 0.14)',  label: 'Weekend' },
  no_school: { color: '#94A3B8',            bg: 'transparent',                label: '—' },
};

function StatusPill({ status, size = 'sm' }: { status: AttendanceStatus; size?: 'sm' | 'md' }) {
  const m = STATUS_TONE[status];
  return (
    <span className={`att-pill att-pill--${size}`} style={{ background: m.bg, color: m.color }}>
      {m.label}
    </span>
  );
}

/* ─── Attendance Donut (SVG, no library) ─── */
function AttendanceDonut({
  percent,
  size = 160,
  stroke = 14,
  label,
  sublabel,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  const tone = percent >= 90 ? '#10B981' : percent >= ATTENDANCE_THRESHOLD ? '#F59E0B' : '#EF4444';

  return (
    <div className="att-donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-light)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={tone} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </svg>
      <div className="att-donut-center">
        <div className="att-donut-pct" style={{ color: tone }}>{percent.toFixed(1)}%</div>
        {label && <div className="att-donut-label">{label}</div>}
        {sublabel && <div className="att-donut-sub">{sublabel}</div>}
      </div>
    </div>
  );
}

/* ─── Attendance Calendar (month grid) ─── */
function AttendanceCalendar({
  data,
  initialMonth = new Date('2026-05-01'),
}: {
  data: DayAttendance[];
  initialMonth?: Date;
}) {
  const [viewMonth, setViewMonth] = useState(initialMonth);

  const monthDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const first = new Date(year, month, 1);
    const startWeekday = first.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days: { iso: string | null; day: number | null; status?: AttendanceStatus; remarks?: string }[] = [];

    for (let i = 0; i < startWeekday; i++) days.push({ iso: null, day: null });
    for (let d = 1; d <= totalDays; d++) {
      const iso = new Date(year, month, d).toISOString().slice(0, 10);
      const found = data.find(rec => rec.date === iso);
      days.push({ iso, day: d, status: found?.status, remarks: found?.remarks });
    }
    while (days.length % 7 !== 0) days.push({ iso: null, day: null });
    return days;
  }, [viewMonth, data]);

  const monthLabel = viewMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="att-cal">
      <div className="att-cal-head">
        <button
          className="att-cal-nav"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="att-cal-title">{monthLabel}</div>
        <button
          className="att-cal-nav"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="att-cal-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="att-cal-weekday">{d}</div>
        ))}
        {monthDays.map((c, i) => {
          if (c.day === null) return <div key={i} className="att-cal-cell att-cal-cell--empty" />;
          const tone = c.status ? STATUS_TONE[c.status] : null;
          return (
            <div
              key={i}
              className={`att-cal-cell att-cal-cell--${c.status ?? 'unknown'}`}
              style={tone && c.status !== 'no_school' ? { background: tone.bg, color: tone.color } : undefined}
              title={c.remarks ? `${c.day}: ${c.remarks}` : undefined}
            >
              <span className="att-cal-day">{c.day}</span>
              {c.status && c.status !== 'no_school' && (
                <span className="att-cal-tag">{tone?.label}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="att-cal-legend">
        {(['present', 'absent', 'late', 'leave', 'holiday', 'weekend'] as AttendanceStatus[]).map(s => (
          <span key={s} className="att-cal-legend-item">
            <span className="att-cal-legend-dot" style={{ background: STATUS_TONE[s].color }} />
            {STATUS_TONE[s].label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Trend Chart wrapper ─── */
function AttendanceTrendChart({
  daily,
}: {
  daily: { date: string; percent: number }[];
}) {
  return (
    <div className="att-chart-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={daily} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
            axisLine={false} tickLine={false}
            tickFormatter={(d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            interval={3}
          />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={v => `${v}%`} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 10, fontSize: 12, boxShadow: 'var(--shadow-lg)' }}
            labelFormatter={(d: unknown) => new Date(String(d)).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            formatter={(v: unknown) => [`${v}%`, 'Attendance']}
          />
          <Area type="monotone" dataKey="percent" stroke="#10B981" strokeWidth={2.5} fill="url(#attGrad)" dot={false} activeDot={{ r: 4, fill: '#10B981', stroke: 'white', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Leave category icon helper ─── */
const LEAVE_CAT: Record<LeaveCategory, { label: string; icon: ReactNode }> = {
  medical:   { label: 'Medical',   icon: <Stethoscope size={13} /> },
  sick:      { label: 'Sick',      icon: <Heart size={13} /> },
  family:    { label: 'Family',    icon: <Users size={13} /> },
  personal:  { label: 'Personal',  icon: <Sparkles size={13} /> },
  casual:    { label: 'Casual',    icon: <Plane size={13} /> },
  maternity: { label: 'Maternity', icon: <Heart size={13} /> },
  sports:    { label: 'Sports',    icon: <Trophy size={13} /> },
  official:  { label: 'Official',  icon: <Briefcase size={13} /> },
  other:     { label: 'Other',     icon: <FileText size={13} /> },
};

/* ─── Leave application card (for inbox + outbox) ─── */
function LeaveApplicationCard({
  app,
  variant,
  onApprove,
  onReject,
}: {
  app: LeaveApplication;
  variant: 'inbox' | 'outbox';
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const cat = LEAVE_CAT[app.category];

  return (
    <div className="att-leave-card">
      <div className={`att-leave-stripe att-leave-stripe--${app.status}`} />

      <div className="att-leave-head">
        <div className="att-leave-applicant">
          <div className="att-leave-avatar">{app.applicantPhotoInitials ?? app.applicantName.slice(0, 2).toUpperCase()}</div>
          <div>
            <div className="att-leave-name">{app.applicantName}</div>
            <div className="att-leave-meta">
              {app.applicantClass && <span>{app.applicantClass}</span>}
              <span className="att-dot-sep">•</span>
              <span className="att-leave-id">{app.id}</span>
            </div>
          </div>
        </div>
        <span className={`att-leave-status att-leave-status--${app.status}`}>
          {app.status === 'pending' && <Hourglass size={11} />}
          {app.status === 'approved' && <CheckCircle2 size={11} />}
          {app.status === 'rejected' && <XCircle size={11} />}
          {app.status === 'cancelled' && <X size={11} />}
          {app.status}
        </span>
      </div>

      <div className="att-leave-body">
        <div className="att-leave-cat">
          <span className="att-leave-cat-icon">{cat.icon}</span>
          <span>{cat.label} Leave</span>
        </div>

        <div className="att-leave-dates">
          <div className="att-leave-date-block">
            <div className="att-leave-date-label">From</div>
            <div className="att-leave-date-val">{new Date(app.fromDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
          </div>
          <div className="att-leave-date-arrow">→</div>
          <div className="att-leave-date-block">
            <div className="att-leave-date-label">To</div>
            <div className="att-leave-date-val">{new Date(app.toDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
          </div>
          <div className="att-leave-days">{app.numDays} day{app.numDays > 1 ? 's' : ''}</div>
        </div>

        <p className="att-leave-reason">"{app.reason}"</p>

        {app.attachmentName && (
          <div className="att-leave-attach">
            <FileText size={12} /> {app.attachmentName}
          </div>
        )}

        {app.remarks && (
          <div className={`att-leave-remarks att-leave-remarks--${app.status}`}>
            <span className="att-leave-remarks-label">{app.status === 'approved' ? 'Approved' : 'Reviewer note'}:</span> {app.remarks}
            {app.reviewedBy && <span className="att-leave-reviewer"> — {app.reviewedBy}</span>}
          </div>
        )}
      </div>

      {variant === 'inbox' && app.status === 'pending' && (
        <div className="att-leave-actions">
          <button className="att-btn att-btn--reject" onClick={onReject}><XCircle size={13} /> Reject</button>
          <button className="att-btn att-btn--primary" onClick={onApprove}><CheckCircle2 size={13} /> Approve</button>
        </div>
      )}
      {variant === 'outbox' && app.status === 'pending' && (
        <div className="att-leave-actions">
          <span className="att-leave-applied">Applied {new Date(app.appliedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          <button className="att-btn att-btn--ghost-sm">Withdraw</button>
        </div>
      )}
    </div>
  );
}

/* ─── Leave application form (Student / Parent / Teacher) ─── */
function LeaveForm({ applicantRole }: { applicantRole: ApplicantRole }) {
  const categories: LeaveCategory[] =
    applicantRole === 'teacher'
      ? ['medical', 'casual', 'sick', 'maternity', 'official', 'personal', 'other']
      : ['medical', 'sick', 'family', 'personal', 'sports', 'other'];

  return (
    <form className="att-form" onSubmit={e => e.preventDefault()}>
      <div className="att-form-grid">
        <div className="att-field">
          <label>From <span className="att-req">*</span></label>
          <input type="date" defaultValue="2026-05-12" />
        </div>
        <div className="att-field">
          <label>To <span className="att-req">*</span></label>
          <input type="date" defaultValue="2026-05-13" />
        </div>
        <div className="att-field att-field--full">
          <label>Category <span className="att-req">*</span></label>
          <div className="att-cat-row">
            {categories.map(c => (
              <button type="button" key={c} className="att-cat-pill">
                {LEAVE_CAT[c].icon} {LEAVE_CAT[c].label}
              </button>
            ))}
          </div>
        </div>
        <div className="att-field att-field--full">
          <label>Reason <span className="att-req">*</span></label>
          <textarea rows={3} placeholder={
            applicantRole === 'parent_for_child'
              ? 'Briefly explain why your child needs leave (so the class teacher can plan accordingly).'
              : applicantRole === 'teacher'
              ? 'Reason and substitute arrangements (if any).'
              : 'Briefly explain why you need leave.'
          } />
        </div>
        <div className="att-field att-field--full">
          <label>Supporting Document (optional)</label>
          <div className="att-upload">
            <FileText size={14} /> <span>Click or drop PDF / image (e.g. medical certificate)</span>
          </div>
        </div>
      </div>

      <div className="att-form-actions">
        <button type="button" className="att-btn att-btn--ghost">Save Draft</button>
        <button type="submit" className="att-btn att-btn--primary"><Send size={13} /> Submit Application</button>
      </div>
    </form>
  );
}

/* ─── Defaulter row (used by SA + Principal) ─── */
function DefaulterRow({ d, showSchool = true }: { d: DefaulterStudent; showSchool?: boolean }) {
  const tone =
    d.riskLevel === 'severe'   ? { color: 'var(--danger)',  bg: 'rgba(239, 68, 68, 0.1)' } :
    d.riskLevel === 'critical' ? { color: '#EA580C',         bg: 'rgba(234, 88, 12, 0.1)' } :
                                  { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.12)' };

  return (
    <div className="att-def-row">
      <div className="att-def-avatar" style={{ background: tone.bg, color: tone.color }}>
        {d.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
      </div>
      <div className="att-def-body">
        <div className="att-def-name">{d.name}</div>
        <div className="att-def-meta">
          Class {d.className}-{d.section} • Roll {d.rollNumber}
          {showSchool && <> <span className="att-dot-sep">•</span> <MapPin size={10} /> {d.schoolName}</>}
          <span className="att-dot-sep">•</span> Parent: {d.parentName} ({d.parentPhone})
        </div>
      </div>
      <div className="att-def-pct">
        <div className="att-def-pct-num" style={{ color: tone.color }}>{d.attendancePercent.toFixed(1)}%</div>
        <div className="att-def-pct-label">{d.daysPresent}/{d.daysPresent + d.daysAbsent} days</div>
      </div>
      <div className="att-def-stats">
        <div className="att-def-stat">
          <div className="att-def-stat-label">Last Absent</div>
          <div className="att-def-stat-val">{new Date(d.lastAbsent).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
        </div>
        <div className="att-def-stat">
          <div className="att-def-stat-label">Streak</div>
          <div className="att-def-stat-val att-def-stat-val--accent">
            {d.consecutiveAbsent > 0 ? <><Flame size={11} /> {d.consecutiveAbsent}d</> : '—'}
          </div>
        </div>
      </div>
      <div className="att-def-actions">
        <button className="att-icon-btn" title="Call parent"><Phone size={13} /></button>
        <button className="att-btn att-btn--ghost-sm">Notice</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB CONTENT — composed from primitives
   ═══════════════════════════════════════════════════════════════════════════ */

/* ──────── SUPER ADMIN — Network Overview ──────── */
function SANetworkOverview() {
  const top = [...schoolAttendance].sort((a, b) => b.todayPercent - a.todayPercent).slice(0, 4);
  const bot = [...schoolAttendance].sort((a, b) => a.todayPercent - b.todayPercent).slice(0, 4);

  return (
    <>
      <div className="att-grid-2">
        <div className="att-card">
          <div className="att-card-head">
            <h3 className="att-card-title"><TrendingUp size={18} /> Network Attendance — Last 30 Days</h3>
            <span className="att-card-sub">Daily % across {networkSnapshot.schoolsTracked} schools</span>
          </div>
          <div className="att-chart-h">
            <AttendanceTrendChart daily={dailyTrendNetwork} />
          </div>
        </div>

        <div className="att-card">
          <div className="att-card-head">
            <h3 className="att-card-title"><BarChart3 size={18} /> Schools — Today</h3>
            <span className="att-card-sub">% present</span>
          </div>
          <div className="att-chart-h">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schoolAttendance} layout="vertical" margin={{ left: 4, right: 16, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" horizontal={false} />
                <XAxis type="number" domain={[60, 100]} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="schoolCode" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 10, fontSize: 12 }}
                  formatter={(v: unknown) => [`${v}%`, 'Today']}
                  labelFormatter={(l: unknown) => schoolAttendance.find(s => s.schoolCode === String(l))?.schoolName ?? String(l)}
                />
                <Bar dataKey="todayPercent" radius={[0, 4, 4, 0]} barSize={12}>
                  {schoolAttendance.map(s => (
                    <Cell key={s.schoolCode} fill={s.todayPercent >= 90 ? '#10B981' : s.todayPercent >= ATTENDANCE_THRESHOLD ? '#F59E0B' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="att-grid-2">
        <div className="att-card">
          <div className="att-card-head">
            <h3 className="att-card-title"><Star size={18} /> Top Performers</h3>
            <span className="att-card-sub">Schools above 90%</span>
          </div>
          <div className="att-leaderboard">
            {top.map((s, i) => (
              <div key={s.schoolCode} className="att-lb-row">
                <div className="att-lb-rank att-lb-rank--top">{i + 1}</div>
                <div className="att-lb-body">
                  <div className="att-lb-name">{s.schoolName}</div>
                  <div className="att-lb-meta">{s.district} • {s.totalStudents} students</div>
                </div>
                <div className="att-lb-pct att-lb-pct--good">{s.todayPercent.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="att-card att-card--alert">
          <div className="att-card-head">
            <h3 className="att-card-title"><AlertTriangle size={18} color="var(--danger)" /> Needs Intervention</h3>
            <span className="att-card-sub">Schools below {ATTENDANCE_THRESHOLD}%</span>
          </div>
          <div className="att-leaderboard">
            {bot.map(s => (
              <div key={s.schoolCode} className="att-lb-row">
                <div className="att-lb-rank att-lb-rank--bot">!</div>
                <div className="att-lb-body">
                  <div className="att-lb-name">{s.schoolName}</div>
                  <div className="att-lb-meta">{s.district} • {s.absentToday} absent today</div>
                </div>
                <div className={`att-lb-pct ${s.todayPercent < ATTENDANCE_THRESHOLD ? 'att-lb-pct--bad' : 'att-lb-pct--warn'}`}>
                  {s.todayPercent.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ──────── SUPER ADMIN — Schools Table ──────── */
function SASchoolsTable() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'good' | 'warning' | 'critical'>('all');

  const filtered = useMemo(() => schoolAttendance.filter(s => {
    if (filter !== 'all' && s.status !== filter) return false;
    if (search && !`${s.schoolName} ${s.schoolCode} ${s.district}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [search, filter]);

  return (
    <div className="att-card">
      <div className="att-toolbar">
        <div className="att-search">
          <Search size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by school, code, district…" />
        </div>
        <div className="att-chip-row">
          {(['all', 'good', 'warning', 'critical'] as const).map(f => (
            <button key={f} className={`att-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'good' ? 'Healthy' : f === 'warning' ? 'Watch' : 'Critical'}
              <span className="att-chip-count">{f === 'all' ? schoolAttendance.length : schoolAttendance.filter(s => s.status === f).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="att-table-wrap">
        <table className="att-table">
          <thead>
            <tr>
              <th>School</th>
              <th>District</th>
              <th>Students</th>
              <th>Present / Absent</th>
              <th>Today</th>
              <th>Week Avg</th>
              <th>Month Avg</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.schoolCode}>
                <td>
                  <div className="att-table-title">{s.schoolName}</div>
                  <div className="att-table-sub">{s.schoolCode}</div>
                </td>
                <td>{s.district}</td>
                <td>{s.totalStudents.toLocaleString('en-IN')}</td>
                <td>
                  <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>{s.presentToday}</span>
                  <span style={{ color: 'var(--text-tertiary)' }}> / </span>
                  <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{s.absentToday}</span>
                </td>
                <td>
                  <div className="att-bar-cell">
                    <div className="att-bar-track">
                      <div
                        className="att-bar-fill"
                        style={{
                          width: `${s.todayPercent}%`,
                          background: s.todayPercent >= 90 ? '#10B981' : s.todayPercent >= ATTENDANCE_THRESHOLD ? '#F59E0B' : '#EF4444',
                        }}
                      />
                    </div>
                    <span className="att-bar-pct">{s.todayPercent.toFixed(1)}%</span>
                  </div>
                </td>
                <td>{s.weekAverage.toFixed(1)}%</td>
                <td>{s.monthAverage.toFixed(1)}%</td>
                <td>
                  <span className={`att-trend ${s.trend >= 0 ? 'up' : 'down'}`}>
                    {s.trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(s.trend).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ──────── Trends (SA — year-over-year) ──────── */
function SATrendsTab() {
  return (
    <>
      <div className="att-card">
        <div className="att-card-head">
          <h3 className="att-card-title"><TrendingUp size={18} /> Year-over-Year Comparison</h3>
          <span className="att-card-sub">Monthly average attendance — Current AY vs Previous AY</span>
        </div>
        <div className="att-chart-h att-chart-h--lg">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} domain={[80, 95]} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 10, fontSize: 12 }} formatter={(v: unknown) => [`${v}%`, '']} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="percent" name="AY 2025-26" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981', stroke: 'white', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="prevYearPercent" name="AY 2024-25" stroke="#94A3B8" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 3, fill: '#94A3B8', stroke: 'white', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="att-grid-2">
        <div className="att-card">
          <div className="att-card-head">
            <h3 className="att-card-title"><BarChart3 size={18} /> District-wise (Today)</h3>
          </div>
          <DistrictBars />
        </div>
        <div className="att-card">
          <div className="att-card-head">
            <h3 className="att-card-title"><CalendarOff size={18} /> Lowest-attendance days (last 30)</h3>
          </div>
          <LowestDays />
        </div>
      </div>
    </>
  );
}

function DistrictBars() {
  const data = useMemo(() => {
    const map = new Map<string, { sum: number; count: number; students: number; absent: number }>();
    schoolAttendance.forEach(s => {
      const cur = map.get(s.district) ?? { sum: 0, count: 0, students: 0, absent: 0 };
      cur.sum += s.todayPercent;
      cur.count++;
      cur.students += s.totalStudents;
      cur.absent += s.absentToday;
      map.set(s.district, cur);
    });
    return Array.from(map.entries()).map(([district, v]) => ({
      district, percent: parseFloat((v.sum / v.count).toFixed(1)), students: v.students, absent: v.absent,
    })).sort((a, b) => b.percent - a.percent);
  }, []);

  return (
    <div className="att-district-list">
      {data.map(d => (
        <div key={d.district} className="att-district-row">
          <div className="att-district-name">{d.district}</div>
          <div className="att-bar-cell" style={{ flex: 1 }}>
            <div className="att-bar-track">
              <div className="att-bar-fill" style={{ width: `${d.percent}%`, background: d.percent >= 88 ? '#10B981' : d.percent >= 80 ? '#F59E0B' : '#EF4444' }} />
            </div>
            <span className="att-bar-pct">{d.percent}%</span>
          </div>
          <div className="att-district-meta">{d.students.toLocaleString('en-IN')} students</div>
        </div>
      ))}
    </div>
  );
}

function LowestDays() {
  const lowest = [...dailyTrendNetwork].filter(d => d.percent > 0).sort((a, b) => a.percent - b.percent).slice(0, 5);
  return (
    <div className="att-low-list">
      {lowest.map(d => (
        <div key={d.date} className="att-low-row">
          <div className="att-low-date">
            <div className="att-low-date-day">{new Date(d.date).getDate()}</div>
            <div className="att-low-date-mon">{new Date(d.date).toLocaleDateString('en-IN', { month: 'short' })}</div>
          </div>
          <div className="att-low-body">
            <div className="att-low-day">{new Date(d.date).toLocaleDateString('en-IN', { weekday: 'long' })}</div>
            <div className="att-low-meta">{Math.round((100 - d.percent) * networkSnapshot.totalStudents / 100)} students absent</div>
          </div>
          <div className="att-low-pct">{d.percent.toFixed(1)}%</div>
        </div>
      ))}
    </div>
  );
}

/* ──────── Defaulters (SA + Principal) ──────── */
function DefaultersListPanel({ scope }: { scope: 'network' | 'school' }) {
  const [filter, setFilter] = useState<'all' | 'severe' | 'critical' | 'warning'>('all');
  const data = scope === 'network' ? defaulters : defaulters.filter(d => d.schoolCode === DEMO_SCHOOL_CODE);
  const filtered = filter === 'all' ? data : data.filter(d => d.riskLevel === filter);

  return (
    <div className="att-defaulters">
      <div className="att-banner att-banner--alert">
        <AlertTriangle size={20} />
        <div>
          <h3>{filtered.length} student(s) below {ATTENDANCE_THRESHOLD}% threshold</h3>
          <p>Govt mandate requires <strong>{ATTENDANCE_THRESHOLD}%</strong> attendance for exam eligibility. Reach out to parents and document interventions.</p>
        </div>
        <button className="att-btn att-btn--primary"><Send size={13} /> Notify All Parents</button>
      </div>

      <div className="att-chip-row">
        {(['all', 'severe', 'critical', 'warning'] as const).map(f => (
          <button key={f} className={`att-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'severe' ? 'Severe (<65%)' : f === 'critical' ? 'Critical (65–72%)' : 'Watch (72–75%)'}
            <span className="att-chip-count">{f === 'all' ? data.length : data.filter(d => d.riskLevel === f).length}</span>
          </button>
        ))}
      </div>

      <div className="att-card">
        {filtered.length === 0 ? (
          <div className="att-empty"><CheckCircle2 size={28} /><p>No students below threshold. </p></div>
        ) : (
          filtered.map(d => <DefaulterRow key={d.studentId} d={d} showSchool={scope === 'network'} />)
        )}
      </div>
    </div>
  );
}

/* ──────── PRINCIPAL — Today's Pulse ──────── */
function PrincipalPulse() {
  const school = schoolAttendance.find(s => s.schoolCode === DEMO_SCHOOL_CODE)!;
  const totalMarked = classAttendance.filter(c => c.marked).length;

  return (
    <>
      <div className="att-grid-pulse">
        <div className="att-card att-pulse-hero">
          <div className="att-pulse-donut">
            <AttendanceDonut percent={school.todayPercent} size={200} stroke={18} label="present" sublabel={`${school.presentToday}/${school.totalStudents}`} />
          </div>
          <div className="att-pulse-meta">
            <div>
              <div className="att-pulse-label">Today's School Attendance</div>
              <div className="att-pulse-date">{new Date('2026-05-08').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            <div className="att-pulse-stats">
              <div><div className="att-pulse-stat-val" style={{ color: 'var(--primary-600)' }}>{school.presentToday}</div><div className="att-pulse-stat-label">Present</div></div>
              <div><div className="att-pulse-stat-val" style={{ color: 'var(--danger)' }}>{school.absentToday}</div><div className="att-pulse-stat-label">Absent</div></div>
              <div><div className="att-pulse-stat-val" style={{ color: 'var(--info)' }}>{school.onLeaveToday}</div><div className="att-pulse-stat-label">On Leave</div></div>
              <div><div className="att-pulse-stat-val">{totalMarked}/{classAttendance.length}</div><div className="att-pulse-stat-label">Classes Marked</div></div>
            </div>
          </div>
        </div>

        <div className="att-card">
          <div className="att-card-head">
            <h3 className="att-card-title"><TrendingUp size={18} /> 30-Day Trend</h3>
            <span className="att-card-sub">{school.schoolName}</span>
          </div>
          <div className="att-chart-h">
            <AttendanceTrendChart daily={dailyTrendSchool} />
          </div>
        </div>
      </div>

      <div className="att-card">
        <div className="att-card-head">
          <h3 className="att-card-title"><Users size={18} /> Class-wise Status — Today</h3>
          <span className="att-card-sub">Click a class to drill into student-level</span>
        </div>
        <div className="att-class-grid">
          {classAttendance.map(c => (
            <div key={`${c.className}-${c.section}`} className={`att-class-tile ${!c.marked ? 'unmarked' : ''}`}>
              <div className="att-class-tile-head">
                <div className="att-class-name">Class {c.className}-{c.section}</div>
                {!c.marked && <span className="att-class-pending">Not marked</span>}
                {c.marked && <span className="att-class-marked"><CheckCircle2 size={11} /> {c.markedAt}</span>}
              </div>
              <div className="att-class-pct" style={{
                color: c.attendancePercent >= 90 ? 'var(--primary-600)' : c.attendancePercent >= 80 ? 'var(--warning)' : 'var(--danger)'
              }}>
                {c.marked ? `${c.attendancePercent.toFixed(0)}%` : '—'}
              </div>
              <div className="att-class-bar-track">
                <div className="att-class-bar-fill" style={{
                  width: c.marked ? `${c.attendancePercent}%` : '0%',
                  background: c.attendancePercent >= 90 ? '#10B981' : c.attendancePercent >= 80 ? '#F59E0B' : '#EF4444',
                }} />
              </div>
              <div className="att-class-foot">
                <span><GraduationCap size={11} /> {c.totalStudents}</span>
                <span style={{ color: 'var(--primary-600)' }}>P {c.presentToday}</span>
                <span style={{ color: 'var(--danger)' }}>A {c.absentToday}</span>
              </div>
              <div className="att-class-teacher">{c.classTeacher}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ──────── PRINCIPAL — Classes (drill-down) ──────── */
function PrincipalClasses() {
  const [selected, setSelected] = useState(`10-A`);
  const cls = classAttendance.find(c => `${c.className}-${c.section}` === selected) ?? classAttendance[0];

  return (
    <div className="att-classes-pane">
      <aside className="att-classes-side">
        <div className="att-classes-side-head">All Classes</div>
        {classAttendance.map(c => {
          const key = `${c.className}-${c.section}`;
          const active = key === selected;
          return (
            <button
              key={key}
              className={`att-classes-side-btn ${active ? 'active' : ''}`}
              onClick={() => setSelected(key)}
            >
              <div>
                <div className="att-classes-side-name">Class {c.className}-{c.section}</div>
                <div className="att-classes-side-sub">{c.classTeacher}</div>
              </div>
              <span className="att-classes-side-pct" style={{
                color: c.marked ? (c.attendancePercent >= 90 ? 'var(--primary-600)' : c.attendancePercent >= 80 ? 'var(--warning)' : 'var(--danger)') : 'var(--text-tertiary)'
              }}>
                {c.marked ? `${c.attendancePercent.toFixed(0)}%` : '—'}
              </span>
            </button>
          );
        })}
      </aside>

      <div className="att-classes-main">
        <div className="att-card">
          <div className="att-card-head">
            <div>
              <h3 className="att-card-title">Class {cls.className}-{cls.section}</h3>
              <span className="att-card-sub">{cls.classTeacher} • {cls.totalStudents} students</span>
            </div>
            <button className="att-btn att-btn--ghost-sm"><FileText size={12} /> Export Roll</button>
          </div>

          <div className="att-class-stats">
            <KpiTile label="Present today" value={cls.presentToday} icon={<CheckCircle2 size={20} />} tone="primary" />
            <KpiTile label="Absent today" value={cls.absentToday} icon={<XCircle size={20} />} tone="danger" />
            <KpiTile label="Today's attendance" value={`${cls.attendancePercent.toFixed(1)}%`} icon={<BarChart3 size={20} />} tone="info" />
            <KpiTile label="Status" value={cls.marked ? 'Marked' : 'Pending'} hint={cls.marked ? `at ${cls.markedAt}` : 'Not yet submitted'} icon={<ClipboardCheck size={20} />} tone={cls.marked ? 'success' : 'warning'} />
          </div>

          <h4 className="att-section-title">Student Roll</h4>
          <div className="att-table-wrap">
            <table className="att-table">
              <thead>
                <tr>
                  <th>Roll</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Parent</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {classRoll10A.slice(0, 16).map(s => (
                  <tr key={s.studentId}>
                    <td>{s.rollNumber}</td>
                    <td>
                      <div className="att-table-title">{s.name}</div>
                      <div className="att-table-sub">{s.studentId}</div>
                    </td>
                    <td>{s.status && <StatusPill status={s.status} />}</td>
                    <td>
                      <div>{s.parentName}</div>
                      <div className="att-table-sub">{s.parentPhone}</div>
                    </td>
                    <td>{s.remarks ? <span className="att-table-remarks">"{s.remarks}"</span> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────── PRINCIPAL — Leave Approvals ──────── */
function LeaveApprovalsPanel() {
  const [filter, setFilter] = useState<'all' | ApplicantRole>('all');
  const schoolApps = leaveApplications.filter(l => l.schoolCode === DEMO_SCHOOL_CODE);
  const pending = schoolApps.filter(l => l.status === 'pending');
  const filtered = filter === 'all' ? pending : pending.filter(l => l.applicantRole === filter);

  const tabs: { key: 'all' | ApplicantRole; label: string }[] = [
    { key: 'all',                label: 'All' },
    { key: 'student',            label: 'Students' },
    { key: 'teacher',            label: 'Teachers' },
    { key: 'parent_for_child',   label: 'Parents' },
  ];

  return (
    <>
      <div className="att-banner">
        <Inbox size={20} />
        <div>
          <h3>{pending.length} pending application(s)</h3>
          <p>Review carefully — approving leave affects classroom planning and exam eligibility.</p>
        </div>
      </div>

      <div className="att-chip-row">
        {tabs.map(t => (
          <button key={t.key} className={`att-chip ${filter === t.key ? 'active' : ''}`} onClick={() => setFilter(t.key)}>
            {t.label}
            <span className="att-chip-count">{t.key === 'all' ? pending.length : pending.filter(l => l.applicantRole === t.key).length}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="att-empty att-empty--lg"><Inbox size={32} /><p>No pending applications in this category.</p></div>
      ) : (
        <div className="att-leave-grid">
          {filtered.map(app => <LeaveApplicationCard key={app.id} app={app} variant="inbox" />)}
        </div>
      )}
    </>
  );
}

/* ──────── PRINCIPAL — Calendar (school-wide) ──────── */
function PrincipalCalendarTab() {
  return (
    <>
      <div className="att-grid-2">
        <div className="att-card">
          <div className="att-card-head">
            <h3 className="att-card-title"><CalendarIcon size={18} /> School Calendar — May 2026</h3>
          </div>
          <AttendanceCalendar data={demoStudentMonth} />
        </div>
        <div className="att-card">
          <div className="att-card-head">
            <h3 className="att-card-title"><CalendarOff size={18} /> Upcoming Holidays</h3>
          </div>
          <div className="att-holiday-list">
            {holidays.filter(h => new Date(h.date) >= new Date('2026-05-08')).slice(0, 8).map(h => (
              <div key={h.date} className="att-holiday-row">
                <div className={`att-holiday-tag att-holiday-tag--${h.type}`}>{h.type}</div>
                <div className="att-holiday-body">
                  <div className="att-holiday-name">{h.name}</div>
                  {h.description && <div className="att-holiday-desc">{h.description}</div>}
                </div>
                <div className="att-holiday-date">
                  <div className="att-holiday-date-day">{new Date(h.date).getDate()}</div>
                  <div className="att-holiday-date-mon">{new Date(h.date).toLocaleDateString('en-IN', { month: 'short' })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ──────── TEACHER — Mark Attendance ──────── */
function TeacherMarkAttendance() {
  const [activeClass, setActiveClass] = useState(`${DEMO_TEACHER_CLASSES[0].className}-${DEMO_TEACHER_CLASSES[0].section}`);
  const [roll, setRoll] = useState<StudentRoll[]>(classRoll10A);

  const setStatus = useCallback((studentId: string, status: AttendanceStatus) => {
    setRoll(prev => prev.map(s => s.studentId === studentId ? { ...s, status } : s));
  }, []);

  const markAll = useCallback((status: AttendanceStatus) => {
    setRoll(prev => prev.map(s => ({ ...s, status })));
  }, []);

  const counts = useMemo(() => {
    return roll.reduce((acc, s) => {
      const k = (s.status ?? 'present') as AttendanceStatus;
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {} as Record<AttendanceStatus, number>);
  }, [roll]);

  const presentPct = ((counts.present ?? 0) / roll.length) * 100;

  return (
    <>
      <div className="att-banner">
        <ClipboardCheck size={20} />
        <div>
          <h3>Today's Roll-Call — {new Date('2026-05-08').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
          <p>Mark each student. Bulk-mark all as present, then flip individual exceptions — typical workflow.</p>
        </div>
      </div>

      <div className="att-teacher-classes">
        {DEMO_TEACHER_CLASSES.map(c => {
          const key = `${c.className}-${c.section}`;
          return (
            <button key={key} className={`att-teacher-class-pill ${activeClass === key ? 'active' : ''}`} onClick={() => setActiveClass(key)}>
              Class {c.className}-{c.section}
            </button>
          );
        })}
      </div>

      <div className="att-card">
        <div className="att-mark-head">
          <div>
            <h3 className="att-card-title">Class {activeClass}</h3>
            <span className="att-card-sub">{roll.length} students</span>
          </div>
          <div className="att-mark-bulk">
            <span className="att-mark-bulk-label">Mark all:</span>
            <button className="att-btn att-btn--ghost-sm" onClick={() => markAll('present')}>All Present</button>
            <button className="att-btn att-btn--ghost-sm" onClick={() => markAll('absent')}>All Absent</button>
          </div>
        </div>

        <div className="att-mark-summary">
          <div className="att-mark-summary-pct" style={{ color: presentPct >= 90 ? 'var(--primary-600)' : 'var(--warning)' }}>
            {presentPct.toFixed(0)}%
          </div>
          <div className="att-mark-summary-stats">
            <span className="att-mark-stat" style={{ color: 'var(--primary-600)' }}><CheckCircle2 size={11} /> P {counts.present ?? 0}</span>
            <span className="att-mark-stat" style={{ color: 'var(--danger)' }}><XCircle size={11} /> A {counts.absent ?? 0}</span>
            <span className="att-mark-stat" style={{ color: 'var(--warning)' }}><Clock size={11} /> L {counts.late ?? 0}</span>
            <span className="att-mark-stat" style={{ color: 'var(--info)' }}><CalendarOff size={11} /> Lv {counts.leave ?? 0}</span>
          </div>
        </div>

        <div className="att-roll-grid">
          {roll.map(s => (
            <div key={s.studentId} className="att-roll-row">
              <div className="att-roll-num">{s.rollNumber}</div>
              <div className="att-roll-avatar">{s.name.split(' ').map(p => p[0]).slice(0, 2).join('')}</div>
              <div className="att-roll-body">
                <div className="att-roll-name">{s.name}</div>
                {s.remarks && <div className="att-roll-remarks">{s.remarks}</div>}
              </div>
              <div className="att-roll-actions">
                {(['present', 'absent', 'late', 'leave'] as const).map(st => (
                  <button
                    key={st}
                    className={`att-roll-btn att-roll-btn--${st} ${s.status === st ? 'active' : ''}`}
                    onClick={() => setStatus(s.studentId, st)}
                    aria-label={`Mark ${s.name} ${st}`}
                  >
                    {st === 'present' ? 'P' : st === 'absent' ? 'A' : st === 'late' ? 'L' : 'Lv'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="att-mark-foot">
          <div className="att-mark-foot-info">
            <Hourglass size={12} /> Auto-saved as draft 2 mins ago
          </div>
          <div className="att-mark-foot-actions">
            <button className="att-btn att-btn--ghost"><Save size={13} /> Save Draft</button>
            <button className="att-btn att-btn--primary"><Send size={13} /> Submit Attendance</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ──────── TEACHER — History ──────── */
function TeacherHistory() {
  return (
    <div className="att-card">
      <div className="att-card-head">
        <h3 className="att-card-title"><Clock size={18} /> Attendance History — Class 10-A</h3>
        <span className="att-card-sub">Last 10 working days</span>
      </div>
      <div className="att-table-wrap">
        <table className="att-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>%</th>
              <th>Marked At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dailyTrendSchool.slice(-12).filter(d => d.percent > 0).reverse().map(d => {
              const date = new Date(d.date);
              const total = 44;
              const present = Math.round((d.percent / 100) * total);
              return (
                <tr key={d.date}>
                  <td>{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td>{date.toLocaleDateString('en-IN', { weekday: 'long' })}</td>
                  <td style={{ color: 'var(--primary-600)', fontWeight: 600 }}>{present}</td>
                  <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{total - present - 1}</td>
                  <td style={{ color: 'var(--warning)', fontWeight: 600 }}>1</td>
                  <td>
                    <div className="att-bar-cell">
                      <div className="att-bar-track">
                        <div className="att-bar-fill" style={{ width: `${d.percent}%`, background: d.percent >= 90 ? '#10B981' : '#F59E0B' }} />
                      </div>
                      <span className="att-bar-pct">{d.percent.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td>08:35 AM</td>
                  <td><button className="att-btn att-btn--ghost-sm">View</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ──────── TEACHER — Class Register (month grid) ──────── */
function TeacherRegister() {
  const days = Array.from({ length: 8 }, (_, i) => i + 1);
  const sample = classRoll10A.slice(0, 12);

  const cellStatus = (rollIdx: number, day: number): AttendanceStatus => {
    if (day % 7 === 0) return 'weekend';
    if (rollIdx === 5 && (day === 6 || day === 7)) return 'absent';
    if (rollIdx === 12 && day === 8) return 'absent';
    if (rollIdx === 19 && day === 5) return 'leave';
    if (rollIdx === 2 && day === 4) return 'late';
    return 'present';
  };

  return (
    <div className="att-card">
      <div className="att-card-head">
        <h3 className="att-card-title"><BookCheck size={18} /> Class Register — Class 10-A</h3>
        <span className="att-card-sub">May 2026 (showing first week)</span>
      </div>
      <div className="att-register-wrap">
        <table className="att-register">
          <thead>
            <tr>
              <th className="att-reg-roll">Roll</th>
              <th className="att-reg-name">Student</th>
              {days.map(d => <th key={d} className="att-reg-day">{d}</th>)}
              <th className="att-reg-pct">%</th>
            </tr>
          </thead>
          <tbody>
            {sample.map((s, idx) => {
              const present = days.filter(d => cellStatus(idx, d) === 'present').length;
              const working = days.filter(d => cellStatus(idx, d) !== 'weekend').length;
              const pct = (present / working) * 100;
              return (
                <tr key={s.studentId}>
                  <td className="att-reg-roll">{s.rollNumber}</td>
                  <td className="att-reg-name">{s.name}</td>
                  {days.map(d => {
                    const st = cellStatus(idx, d);
                    return (
                      <td key={d} className={`att-reg-cell att-reg-cell--${st}`} title={`${d} May — ${STATUS_TONE[st].label}`}>
                        {st === 'present' ? 'P' : st === 'absent' ? 'A' : st === 'late' ? 'L' : st === 'leave' ? 'Lv' : '—'}
                      </td>
                    );
                  })}
                  <td className="att-reg-pct" style={{ color: pct >= 90 ? 'var(--primary-600)' : pct >= ATTENDANCE_THRESHOLD ? 'var(--warning)' : 'var(--danger)' }}>
                    {pct.toFixed(0)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ──────── Personal-leave panel (Teacher / Student / Parent) ──────── */
function ApplyLeavePanel({ applicantRole, applicantId }: { applicantRole: ApplicantRole; applicantId: string }) {
  const [open, setOpen] = useState(true);
  const my = leaveApplications.filter(l => l.applicantRole === applicantRole && l.applicantId === applicantId);
  const pending = my.filter(l => l.status === 'pending');
  const past = my.filter(l => l.status !== 'pending');

  return (
    <>
      <div className="att-card">
        <div className="att-card-head">
          <h3 className="att-card-title">
            <PlusCircle size={18} />
            {applicantRole === 'parent_for_child' ? 'Apply Leave for Your Child' : applicantRole === 'teacher' ? 'Apply Personal Leave' : 'Request Leave'}
          </h3>
          <button className="att-btn att-btn--ghost-sm" onClick={() => setOpen(o => !o)}>
            {open ? 'Collapse' : 'Expand'} <ChevronRight size={12} style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 200ms' }} />
          </button>
        </div>
        {open && <LeaveForm applicantRole={applicantRole} />}
      </div>

      {pending.length > 0 && (
        <>
          <h4 className="att-section-title">Pending Applications</h4>
          <div className="att-leave-grid">
            {pending.map(app => <LeaveApplicationCard key={app.id} app={app} variant="outbox" />)}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <h4 className="att-section-title" style={{ marginTop: 'var(--space-5)' }}>Past Applications</h4>
          <div className="att-leave-grid">
            {past.map(app => <LeaveApplicationCard key={app.id} app={app} variant="outbox" />)}
          </div>
        </>
      )}

      {my.length === 0 && <div className="att-empty att-empty--lg"><FileEdit size={28} /><p>No leave applications yet.</p></div>}
    </>
  );
}

/* ──────── STUDENT / PARENT — Personal Attendance Hero ──────── */
function PersonalAttendanceHero({ forParent = false }: { forParent?: boolean }) {
  const s = demoStudentSummary;

  return (
    <>
      <div className="att-personal-hero att-card">
        <div className="att-personal-hero-left">
          <div className="att-personal-hero-meta">
            <div className="att-personal-hero-label">{forParent ? 'Your Child' : 'Welcome back'}</div>
            <div className="att-personal-hero-name">{s.studentName}</div>
            <div className="att-personal-hero-sub">Class {s.className} • Roll {s.rollNumber} • {s.schoolName}</div>
          </div>
          <div className="att-personal-hero-stats">
            <div><div className="att-personal-stat-val" style={{ color: 'var(--primary-600)' }}>{s.daysPresent}</div><div className="att-personal-stat-label">Days Present</div></div>
            <div><div className="att-personal-stat-val" style={{ color: 'var(--danger)' }}>{s.daysAbsent}</div><div className="att-personal-stat-label">Days Absent</div></div>
            <div><div className="att-personal-stat-val" style={{ color: 'var(--warning)' }}>{s.daysLate}</div><div className="att-personal-stat-label">Late Arrivals</div></div>
            <div><div className="att-personal-stat-val" style={{ color: 'var(--info)' }}>{s.daysOnLeave}</div><div className="att-personal-stat-label">On Leave</div></div>
          </div>
        </div>
        <div className="att-personal-hero-donut">
          <AttendanceDonut percent={s.yearlyPercent} size={210} stroke={18} label="overall" sublabel={`${s.daysPresent} of ${s.totalSchoolDays} days`} />
        </div>
      </div>

      <div className="att-grid-2">
        <div className="att-card">
          <div className="att-card-head">
            <h3 className="att-card-title"><BookCheck size={18} /> Subject-wise Attendance</h3>
            <span className="att-card-sub">Counted from period-wise registers</span>
          </div>
          <div className="att-subject-list">
            {demoStudentSubjectAttendance.map(sub => (
              <div key={sub.subject} className="att-subject-row">
                <div className="att-subject-name">{sub.subject}</div>
                <div className="att-bar-cell" style={{ flex: 1 }}>
                  <div className="att-bar-track">
                    <div className="att-bar-fill" style={{
                      width: `${sub.percent}%`,
                      background: sub.percent >= 90 ? '#10B981' : sub.percent >= ATTENDANCE_THRESHOLD ? '#F59E0B' : '#EF4444',
                    }} />
                  </div>
                  <span className="att-bar-pct">{sub.percent.toFixed(0)}%</span>
                </div>
                <div className="att-subject-meta">{sub.classesAttended}/{sub.classesHeld}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="att-card">
          <div className="att-card-head">
            <h3 className="att-card-title"><Flame size={18} /> Streaks & Recognition</h3>
          </div>
          <div className="att-streak-row">
            <div className="att-streak-tile att-streak-tile--current">
              <Flame size={26} />
              <div>
                <div className="att-streak-num">{s.currentStreak}</div>
                <div className="att-streak-label">Day Current Streak</div>
              </div>
            </div>
            <div className="att-streak-tile">
              <Trophy size={26} />
              <div>
                <div className="att-streak-num">{s.longestStreak}</div>
                <div className="att-streak-label">Longest This Year</div>
              </div>
            </div>
          </div>

          <div className="att-policy-banner">
            <ClipboardCheck size={16} />
            <div>
              <strong>{ATTENDANCE_THRESHOLD}% required for exam eligibility.</strong>
              <p>You are at <strong style={{ color: 'var(--primary-600)' }}>{s.yearlyPercent}%</strong> — comfortably above. Keep it up!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ──────── STUDENT / PARENT — Calendar tab ──────── */
function PersonalCalendarTab({ forParent = false }: { forParent?: boolean }) {
  return (
    <div className="att-grid-2">
      <div className="att-card">
        <AttendanceCalendar data={demoStudentMonth} />
      </div>
      <div className="att-card">
        <div className="att-card-head">
          <h3 className="att-card-title"><AlertCircle size={18} /> {forParent ? "Child's" : 'Your'} Recent Absences</h3>
        </div>
        <div className="att-absence-list">
          {demoStudentMonth.filter(d => d.status === 'absent' || d.status === 'late' || d.status === 'leave').map(d => (
            <div key={d.date} className="att-absence-row">
              <div className="att-absence-date">
                <div className="att-absence-day">{new Date(d.date).getDate()}</div>
                <div className="att-absence-mon">{new Date(d.date).toLocaleDateString('en-IN', { month: 'short' })}</div>
              </div>
              <div className="att-absence-body">
                <StatusPill status={d.status} />
                {d.remarks && <div className="att-absence-note">{d.remarks}</div>}
              </div>
            </div>
          ))}
          {demoStudentMonth.filter(d => d.status === 'absent' || d.status === 'late').length === 0 && (
            <div className="att-empty"><CheckCircle2 size={24} /><p>Spotless this month! </p></div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROLE → TAB CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════════ */

interface TabDef { key: string; label: string; icon: ReactNode; render: () => ReactNode; badge?: number; }

const TAB_CONFIG: Record<Role, TabDef[]> = {
  'super-admin': [
    { key: 'overview',    label: 'Network Overview', icon: <LayoutDashboard size={16} />, render: () => <SANetworkOverview /> },
    { key: 'schools',     label: 'Schools',           icon: <SchoolIcon size={16} />,      render: () => <SASchoolsTable /> },
    { key: 'trends',      label: 'Trends',            icon: <TrendingUp size={16} />,      render: () => <SATrendsTab /> },
    { key: 'defaulters',  label: 'Defaulters',        icon: <AlertTriangle size={16} />,   render: () => <DefaultersListPanel scope="network" />, badge: defaulters.length },
    { key: 'staff-watch', label: 'Staff Watch',       icon: <Shield size={16} />,          render: () => <StaffWatchPanel scope="super-admin" /> },
    { key: 'policies',    label: 'Policies & Calendar', icon: <Settings size={16} />,      render: () => <PoliciesPanel /> },
  ],
  principal: [
    { key: 'pulse',       label: "Today's Pulse",     icon: <ClipboardCheck size={16} />,  render: () => <PrincipalPulse /> },
    { key: 'classes',     label: 'Classes',           icon: <Users size={16} />,           render: () => <PrincipalClasses /> },
    { key: 'defaulters',  label: 'Defaulters',        icon: <AlertTriangle size={16} />,   render: () => <DefaultersListPanel scope="school" />, badge: defaulters.filter(d => d.schoolCode === DEMO_SCHOOL_CODE).length },
    { key: 'staff-watch', label: 'Staff Watch',       icon: <Shield size={16} />,          render: () => <StaffWatchPanel scope="principal" /> },
    { key: 'leaves',      label: 'Leave Approvals',   icon: <Inbox size={16} />,           render: () => <LeaveApprovalsPanel />, badge: leaveApplications.filter(l => l.schoolCode === DEMO_SCHOOL_CODE && l.status === 'pending').length },
    { key: 'calendar',    label: 'Calendar',          icon: <CalendarIcon size={16} />,    render: () => <PrincipalCalendarTab /> },
  ],
  teacher: [
    { key: 'mark',        label: 'Mark Attendance',   icon: <ClipboardCheck size={16} />,  render: () => <TeacherMarkAttendance /> },
    { key: 'history',     label: 'History',           icon: <Clock size={16} />,           render: () => <TeacherHistory /> },
    { key: 'register',    label: 'Class Register',    icon: <BookCheck size={16} />,       render: () => <TeacherRegister /> },
    { key: 'my-leave',    label: 'My Leave',          icon: <FileEdit size={16} />,        render: () => <ApplyLeavePanel applicantRole="teacher" applicantId="tr-001" /> },
  ],
  student: [
    { key: 'me',          label: 'My Attendance',     icon: <BarChart3 size={16} />,       render: () => <PersonalAttendanceHero /> },
    { key: 'cal',         label: 'Calendar',          icon: <CalendarIcon size={16} />,    render: () => <PersonalCalendarTab /> },
    { key: 'leave',       label: 'Apply Leave',       icon: <PlusCircle size={16} />,      render: () => <ApplyLeavePanel applicantRole="student" applicantId="st-001" /> },
  ],
  parent: [
    { key: 'child',       label: "Child's Attendance", icon: <BarChart3 size={16} />,      render: () => <PersonalAttendanceHero forParent /> },
    { key: 'cal',         label: 'Calendar',           icon: <CalendarIcon size={16} />,   render: () => <PersonalCalendarTab forParent /> },
    { key: 'leave',       label: 'Apply Leave',        icon: <PlusCircle size={16} />,     render: () => <ApplyLeavePanel applicantRole="parent_for_child" applicantId="pa-001" /> },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   HEADER + KPI STRIP — role-aware
   ═══════════════════════════════════════════════════════════════════════════ */

function ModuleHeader({ role }: { role: Role }) {
  const titleMap: Record<Role, { title: string; sub: string }> = {
    'super-admin': { title: 'Attendance — Network',    sub: `Live oversight across ${networkSnapshot.schoolsTracked} schools • ${networkSnapshot.totalStudents.toLocaleString('en-IN')} students` },
    principal:     { title: 'Attendance Monitor',       sub: `${DEMO_SCHOOL_NAME} • Real-time school-wide attendance` },
    teacher:       { title: 'Attendance',               sub: `${DEMO_TEACHER_NAME} • Daily roll-call & class register` },
    student:       { title: 'My Attendance',            sub: `${DEMO_STUDENT_NAME} — Class ${DEMO_STUDENT_CLASS}-${DEMO_STUDENT_SECTION}` },
    parent:        { title: 'Attendance',               sub: `Tracking ${DEMO_STUDENT_NAME} — Class ${DEMO_STUDENT_CLASS}-${DEMO_STUDENT_SECTION}` },
  };
  const { title, sub } = titleMap[role];

  return (
    <div className="page-header att-header">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{sub}</p>
      </div>
      <div className="att-header-date">
        <CalendarIcon size={14} />
        {new Date('2026-05-08').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </div>
  );
}

function KpiStrip({ role }: { role: Role }) {
  if (role === 'super-admin') {
    const s = networkSnapshot;
    return (
      <div className="att-kpi-row">
        <KpiTile label="Network Attendance Today" value={`${s.networkPercent}%`} icon={<ClipboardCheck size={20} />} tone="primary" hint={`${s.totalPresentToday.toLocaleString('en-IN')} of ${s.totalStudents.toLocaleString('en-IN')} present`} />
        <KpiTile label="Schools Below Threshold" value={s.schoolsBelowThreshold} icon={<AlertTriangle size={20} />} tone={s.schoolsBelowThreshold > 0 ? 'warning' : 'success'} hint={`Out of ${s.schoolsTracked} schools`} />
        <KpiTile label="Total Absent Today" value={s.totalAbsentToday.toLocaleString('en-IN')} icon={<XCircle size={20} />} tone="danger" hint={`${s.totalOnLeaveToday} on approved leave`} />
        <KpiTile label="Pending Leave Approvals" value={s.pendingLeaveApprovals} icon={<Inbox size={20} />} tone="info" hint="Across the network" />
      </div>
    );
  }
  if (role === 'principal') {
    const sc = schoolAttendance.find(s => s.schoolCode === DEMO_SCHOOL_CODE)!;
    const pendingHere = leaveApplications.filter(l => l.schoolCode === DEMO_SCHOOL_CODE && l.status === 'pending').length;
    const defHere = defaulters.filter(d => d.schoolCode === DEMO_SCHOOL_CODE).length;
    return (
      <div className="att-kpi-row">
        <KpiTile label="School Attendance Today" value={`${sc.todayPercent.toFixed(1)}%`} icon={<ClipboardCheck size={20} />} tone="primary" hint={`${sc.presentToday} present, ${sc.absentToday} absent`} />
        <KpiTile label="Classes Marked" value={`${classAttendance.filter(c => c.marked).length}/${classAttendance.length}`} icon={<Users size={20} />} tone={classAttendance.filter(c => !c.marked).length > 0 ? 'warning' : 'success'} hint={`${classAttendance.filter(c => !c.marked).length} pending submission`} />
        <KpiTile label="Pending Approvals" value={pendingHere} icon={<Inbox size={20} />} tone="info" hint="Leave applications" />
        <KpiTile label="Below Threshold" value={defHere} icon={<AlertTriangle size={20} />} tone={defHere > 0 ? 'danger' : 'success'} hint={`Below ${ATTENDANCE_THRESHOLD}%`} />
      </div>
    );
  }
  if (role === 'teacher') {
    const my = leaveApplications.filter(l => l.applicantId === 'tr-001');
    return (
      <div className="att-kpi-row">
        <KpiTile label="My Classes" value={DEMO_TEACHER_CLASSES.length} icon={<Users size={20} />} tone="primary" hint="Classes 9-A, 10-A, 10-B" />
        <KpiTile label="Today — 10-A" value="93%" icon={<CheckCircle2 size={20} />} tone="success" hint="40 of 44 present" />
        <KpiTile label="Today — 10-B" value="86%" icon={<ClipboardCheck size={20} />} tone="warning" hint="38 of 44 present" />
        <KpiTile label="My Leave Balance" value="14d" icon={<FileEdit size={20} />} tone="info" hint={`${my.filter(l => l.status === 'pending').length} pending applications`} />
      </div>
    );
  }
  // student / parent
  const s = demoStudentSummary;
  return (
    <div className="att-kpi-row">
      <KpiTile label="Yearly Attendance" value={`${s.yearlyPercent}%`} icon={<BarChart3 size={20} />} tone="primary" hint={`${s.daysPresent} of ${s.totalSchoolDays} days`} />
      <KpiTile label="This Month" value={`${s.monthlyPercent}%`} icon={<CalendarIcon size={20} />} tone="success" hint="May 2026" />
      <KpiTile label="Current Streak" value={`${s.currentStreak} days`} icon={<Flame size={20} />} tone="accent" hint={`Best this year: ${s.longestStreak} days`} />
      <KpiTile label="Threshold Status" value={s.yearlyPercent >= ATTENDANCE_THRESHOLD ? 'Eligible' : 'At risk'} icon={<ClipboardCheck size={20} />} tone={s.yearlyPercent >= ATTENDANCE_THRESHOLD ? 'success' : 'danger'} hint={`${ATTENDANCE_THRESHOLD}% required`} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function AttendanceModule({ role }: Props) {
  const tabs = TAB_CONFIG[role];
  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find(t => t.key === active) ?? tabs[0];

  return (
    <div className="att">
      <ModuleHeader role={role} />
      <KpiStrip role={role} />

      <div className="att-tabs" role="tablist">
        {tabs.map(t => (
          <button
            key={t.key}
            role="tab"
            aria-selected={active === t.key}
            className={`att-tab ${active === t.key ? 'active' : ''}`}
            onClick={() => setActive(t.key)}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.badge ? <span className="att-tab-badge">{t.badge}</span> : null}
          </button>
        ))}
      </div>

      <div className="att-content" key={active}>
        {current.render()}
      </div>
    </div>
  );
}
