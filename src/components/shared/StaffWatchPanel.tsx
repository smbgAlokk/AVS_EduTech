import { useState, useMemo, useCallback, type ReactNode } from 'react';
import {
  Shield, ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon, Eye, Ban,
  FileWarning, Coins, MessageSquare, ArrowRightLeft, Clock, CheckCircle2,
  XCircle, X, Phone, Mail, Search, Filter, MapPin,
  Send, Hourglass, ChevronRight, Flame, BookOpen,
  CalendarOff, Sparkles, Target, ChevronDown, GraduationCap, BarChart3,
  Inbox, FileCheck, Activity, UserCheck, UserX, Lock, Globe2, Megaphone,
  CalendarPlus, Star, Zap,
} from 'lucide-react';
import {
  staffMembers as initialStaff, disciplinaryActions as initialActions,
  todayPeriodLog, surpriseVisits as initialVisits, summarize, ACTION_META, RISK_META,
  INSPECTOR_ROSTER, FOCUS_AREAS, CONFIDENTIALITY_META,
  type StaffMember, type DisciplinaryAction, type ActionType, type RiskLevel,
  type StaffRole, type PeriodLog, type SurpriseVisit, type Confidentiality, type VisitPriority,
} from '../../data/staff-watch';
import { schoolAttendance, DEMO_SCHOOL_CODE, DEMO_SCHOOL_NAME } from '../../data/attendance';
import './StaffWatchPanel.css';

type Scope = 'super-admin' | 'principal';
interface Props { scope: Scope; }

/* ═══════════════════════════════════════════════════════════════════════════
   ICON + PALETTE MAPS
   ═══════════════════════════════════════════════════════════════════════════ */

const ACTION_ICON: Record<ActionType, ReactNode> = {
  show_cause:        <FileWarning size={14} />,
  written_warning:   <AlertTriangle size={14} />,
  salary_hold:       <Coins size={14} />,
  salary_deduction:  <Coins size={14} />,
  suspension:        <Ban size={14} />,
  inspection:        <Eye size={14} />,
  transfer:          <ArrowRightLeft size={14} />,
  counseling:        <MessageSquare size={14} />,
};

const RISK_ICON: Record<RiskLevel, ReactNode> = {
  compliant: <ShieldCheck size={14} />,
  watch:     <Eye size={14} />,
  warning:   <ShieldAlert size={14} />,
  critical:  <AlertTriangle size={14} />,
  severe:    <AlertOctagon size={14} />,
};

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ═══════════════════════════════════════════════════════════════════════════ */

function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`sw-risk sw-risk--${level}`}>
      {RISK_ICON[level]} {RISK_META[level].label}
    </span>
  );
}

function SalaryBadge({ status }: { status: StaffMember['salaryStatus'] }) {
  if (status === 'normal') return null;
  const map = {
    hold:      { label: 'Salary Hold',      cls: 'sw-salary--hold' },
    docked:    { label: 'Salary Docked',    cls: 'sw-salary--docked' },
    suspended: { label: 'Suspended',        cls: 'sw-salary--suspended' },
  };
  const m = map[status];
  return <span className={`sw-salary ${m.cls}`}><Coins size={11} /> {m.label}</span>;
}

function MiniBar({ value, max = 100, tone }: { value: number; max?: number; tone: 'good' | 'warn' | 'bad' }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = tone === 'good' ? '#10B981' : tone === 'warn' ? '#F59E0B' : '#EF4444';
  return (
    <div className="sw-minibar">
      <div className="sw-minibar-track"><div className="sw-minibar-fill" style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <div className="sw-toast" onAnimationEnd={onDone}>
      <CheckCircle2 size={16} /> {message}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION MODAL — fully working form
   ═══════════════════════════════════════════════════════════════════════════ */

interface ActionModalProps {
  staff: StaffMember;
  defaultType?: ActionType;
  issuerName: string;
  issuerRole: 'super_admin' | 'principal';
  onClose: () => void;
  onIssue: (action: DisciplinaryAction) => void;
}

function ActionModal({ staff, defaultType, issuerName, issuerRole, onClose, onIssue }: ActionModalProps) {
  const allowed: ActionType[] = issuerRole === 'super_admin'
    ? ['show_cause', 'written_warning', 'salary_hold', 'salary_deduction', 'suspension', 'inspection', 'transfer', 'counseling']
    : ['show_cause', 'written_warning', 'counseling'];

  const [type, setType] = useState<ActionType>(defaultType ?? allowed[0]);
  const [reason, setReason] = useState(prefilledReason(type, staff));
  const [notify, setNotify] = useState(true);
  const [dueDate, setDueDate] = useState(defaultDueDate(type));

  const handleType = (t: ActionType) => {
    setType(t);
    setReason(prefilledReason(t, staff));
    setDueDate(defaultDueDate(t));
  };

  const handleSubmit = () => {
    if (!reason.trim()) return;
    const id = `DA-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const newAction: DisciplinaryAction = {
      id, staffId: staff.id, staffName: staff.name, staffRole: staff.role,
      staffDesignation: staff.designation, schoolCode: staff.schoolCode, schoolName: staff.schoolName,
      type, reason: reason.trim(), issuedBy: issuerName, issuedByRole: issuerRole,
      issuedOn: '2026-05-09',
      dueDate: ['show_cause'].includes(type) ? dueDate : undefined,
      status: 'pending',
      notifyStaff: notify,
    };
    onIssue(newAction);
  };

  const meta = ACTION_META[type];

  return (
    <div className="sw-modal-overlay" onClick={onClose}>
      <div className="sw-modal" onClick={e => e.stopPropagation()} role="dialog">
        <div className="sw-modal-head">
          <div>
            <div className="sw-modal-title">Issue Disciplinary Action</div>
            <div className="sw-modal-sub">Against {staff.name} — {staff.designation} at {staff.schoolName}</div>
          </div>
          <button className="sw-modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <div className="sw-modal-body">
          <div className="sw-modal-staff">
            <div className="sw-modal-avatar">{staff.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
            <div className="sw-modal-staff-meta">
              <div className="sw-modal-staff-name">{staff.name}</div>
              <div className="sw-modal-staff-stats">
                <span><MapPin size={11} /> {staff.schoolName}</span>
                <span className="sw-dot-sep">•</span>
                <span>Attendance <strong>{staff.attendancePercent.toFixed(1)}%</strong></span>
                <span className="sw-dot-sep">•</span>
                <span>{staff.awolIncidents} AWOL</span>
                {staff.role === 'teacher' && (
                  <>
                    <span className="sw-dot-sep">•</span>
                    <span>Coverage <strong>{staff.classCoverageRate.toFixed(1)}%</strong></span>
                  </>
                )}
              </div>
            </div>
            <RiskBadge level={staff.riskLevel} />
          </div>

          <div className="sw-field">
            <label className="sw-field-label">Action Type <span className="sw-req">*</span></label>
            <div className="sw-action-grid">
              {allowed.map(t => {
                const m = ACTION_META[t];
                return (
                  <button
                    key={t}
                    type="button"
                    className={`sw-action-tile ${type === t ? 'active' : ''} sw-action-tile--sev${m.severity}`}
                    onClick={() => handleType(t)}
                  >
                    <div className="sw-action-tile-icon">{ACTION_ICON[t]}</div>
                    <div className="sw-action-tile-body">
                      <div className="sw-action-tile-name">{m.label}</div>
                      <div className="sw-action-tile-desc">{m.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sw-field">
            <label className="sw-field-label">Reason / Citation <span className="sw-req">*</span></label>
            <textarea
              className="sw-textarea"
              rows={4}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Cite the relevant facts, dates, and service-rule provisions…"
            />
            <div className="sw-field-hint">
              <Sparkles size={11} /> Pre-filled based on staff record. Edit before issuing.
            </div>
          </div>

          {type === 'show_cause' && (
            <div className="sw-field">
              <label className="sw-field-label">Response due by</label>
              <input
                type="date"
                className="sw-input"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          )}

          <div className="sw-field-row">
            <label className="sw-toggle">
              <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} />
              <span className="sw-toggle-track"><span className="sw-toggle-thumb" /></span>
              <span className="sw-toggle-label">Notify staff via SMS + email</span>
            </label>
          </div>

          <div className={`sw-modal-preview sw-modal-preview--sev${meta.severity}`}>
            <div className="sw-modal-preview-head">
              {ACTION_ICON[type]} <strong>{meta.label}</strong> will be issued.
            </div>
            <ul className="sw-modal-preview-list">
              <li>Logged in disciplinary record (action ID auto-generated)</li>
              {notify && <li>SMS + email sent to {staff.phone} / {staff.email}</li>}
              {type === 'show_cause' && <li>Written response required by {new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</li>}
              {type === 'salary_hold' && <li>Payroll team flagged — full salary withheld pending inquiry</li>}
              {type === 'salary_deduction' && <li>Pro-rata deduction applied at next payroll cycle</li>}
              {type === 'suspension' && <li>Escalated to State Education Department for formal action</li>}
              {type === 'inspection' && <li>Surprise visit scheduled — date will be communicated only to inspector</li>}
              {type === 'transfer' && <li>Transfer recommendation forwarded to HR Wing</li>}
            </ul>
          </div>
        </div>

        <div className="sw-modal-foot">
          <button className="sw-btn sw-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="sw-btn sw-btn--primary" onClick={handleSubmit} disabled={!reason.trim()}>
            <Send size={13} /> Issue {meta.short}
          </button>
        </div>
      </div>
    </div>
  );
}

function prefilledReason(type: ActionType, s: StaffMember): string {
  const r = s.role === 'teacher' ? `Class ${s.classesAssigned?.join(', ') ?? '—'}` : 'Principal';
  switch (type) {
    case 'show_cause':
      return `${s.awolIncidents} AWOL incident(s), attendance at ${s.attendancePercent.toFixed(1)}% (target ≥ 92%)${s.role === 'teacher' ? `, class coverage at ${s.classCoverageRate.toFixed(1)}% (target ≥ 90%)` : ''}. Submit written explanation citing reasons for absence and proposed remedial measures within 7 days. Failure to respond will lead to escalation. (${r})`;
    case 'written_warning':
      return `Performance review identifies ${s.lateArrivals} late arrivals and ${s.unjustifiedLeaves} unjustified leaves this term. Warning entered into service book. Sustained improvement required by end of month. (${r})`;
    case 'salary_hold':
      return `Salary withheld pending inquiry into ${s.awolIncidents} AWOL incidents and overall attendance of ${s.attendancePercent.toFixed(1)}%. Full salary will be released upon satisfactory response to show-cause notice and verifiable improvement. (${r})`;
    case 'salary_deduction':
      return `Pro-rata salary deduction for ${s.daysAbsent - s.daysOnLeave} days unauthorized absence. As per Service Rules Section 4(2)(c). (${r})`;
    case 'suspension':
      return `Recommendation for suspension forwarded to State Education Department on grounds of persistent absenteeism (${s.daysAbsent} days absent), ${s.awolIncidents} AWOL incidents, and class coverage below 70%. (${r})`;
    case 'inspection':
      return `Schedule unannounced visit at ${s.schoolName} to verify staff presence and class running. Focus areas: presence of ${s.name}, condition of ${s.classesAssigned?.join('/') ?? 'classrooms'}, and morning assembly punctuality.`;
    case 'transfer':
      return `Transfer recommendation owing to persistent non-performance: attendance ${s.attendancePercent.toFixed(1)}%, ${s.awolIncidents} AWOL, ${s.unjustifiedLeaves} unjustified leaves. Forwarded to HR Wing. (${r})`;
    case 'counseling':
      return `Mandatory counseling session scheduled to address ${s.lateArrivals} late arrivals and pattern of irregularity. Vice Principal will conduct the session. (${r})`;
  }
}

function defaultDueDate(type: ActionType): string {
  if (type === 'show_cause') {
    const d = new Date('2026-05-09');
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }
  return '2026-05-16';
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PANEL — Staff Watch
   ═══════════════════════════════════════════════════════════════════════════ */

type SubTab = 'overview' | 'teachers' | 'principals' | 'periods' | 'actions' | 'inspections';

export default function StaffWatchPanel({ scope }: Props) {
  const isSA = scope === 'super-admin';
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [actions, setActions] = useState<DisciplinaryAction[]>(initialActions);
  const [visits, setVisits] = useState<SurpriseVisit[]>(initialVisits);
  const [activeSub, setActiveSub] = useState<SubTab>('overview');
  const [modalStaff, setModalStaff] = useState<{ s: StaffMember; defaultType?: ActionType } | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [highlightVisitId, setHighlightVisitId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const visibleStaff = useMemo(
    () => isSA ? staff : staff.filter(s => s.schoolCode === DEMO_SCHOOL_CODE && s.role === 'teacher'),
    [isSA, staff]
  );

  const visibleActions = useMemo(
    () => isSA ? actions : actions.filter(a => a.schoolCode === DEMO_SCHOOL_CODE),
    [isSA, actions]
  );

  const summary = useMemo(() => summarize(visibleStaff), [visibleStaff]);

  const issuerName = isSA ? 'Rajesh Sharma' : 'Dr. Priya Mehta';
  const issuerRole: 'super_admin' | 'principal' = isSA ? 'super_admin' : 'principal';

  const handleScheduleVisit = useCallback((visit: SurpriseVisit) => {
    setVisits(prev => [visit, ...prev]);
    setHighlightVisitId(visit.id);
    setShowSchedule(false);
    setToastMsg(`Inspection scheduled at ${visit.schoolName} for ${new Date(visit.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`);
    window.setTimeout(() => setHighlightVisitId(null), 2400);
  }, []);

  const handleIssue = useCallback((action: DisciplinaryAction) => {
    setActions(prev => [action, ...prev]);
    /* Update staff record's lastAction + risk-level escalation */
    setStaff(prev => prev.map(s => {
      if (s.id !== action.staffId) return s;
      const updated: StaffMember = { ...s, lastActionType: action.type, lastActionDate: action.issuedOn };
      if (action.type === 'salary_hold') updated.salaryStatus = 'hold';
      if (action.type === 'salary_deduction') updated.salaryStatus = 'docked';
      if (action.type === 'suspension') updated.salaryStatus = 'suspended';
      if (s.riskLevel === 'compliant') updated.riskLevel = 'watch';
      else if (s.riskLevel === 'watch') updated.riskLevel = 'warning';
      else if (s.riskLevel === 'warning' && ['salary_hold', 'salary_deduction', 'suspension'].includes(action.type)) updated.riskLevel = 'critical';
      return updated;
    }));
    setModalStaff(null);
    setToastMsg(`${ACTION_META[action.type].label} issued to ${action.staffName}`);
  }, []);

  const subTabs: { key: SubTab; label: string; icon: ReactNode; saOnly?: boolean; principalOnly?: boolean; badge?: number }[] = [
    { key: 'overview',    label: 'Overview',          icon: <BarChart3 size={15} /> },
    { key: 'teachers',    label: 'Teachers',          icon: <GraduationCap size={15} />, badge: visibleStaff.filter(s => s.role === 'teacher' && (s.riskLevel === 'critical' || s.riskLevel === 'severe')).length },
    { key: 'principals',  label: 'Principals',        icon: <UserCheck size={15} />, saOnly: true, badge: staff.filter(s => s.role === 'principal' && (s.riskLevel === 'critical' || s.riskLevel === 'severe')).length },
    { key: 'periods',     label: "Today's Periods",   icon: <Clock size={15} />, principalOnly: true, badge: todayPeriodLog.filter(p => p.status === 'missed').length },
    { key: 'actions',     label: 'Action Log',        icon: <Inbox size={15} />, badge: visibleActions.filter(a => a.status === 'pending').length },
    { key: 'inspections', label: 'Surprise Visits',   icon: <Eye size={15} />, saOnly: true },
  ];
  const visibleSubs = subTabs.filter(t => (!t.saOnly || isSA) && (!t.principalOnly || !isSA));

  return (
    <div className="sw">
      {/* Header strip — slim, clean */}
      <div className="sw-head">
        <div className="sw-head-left">
          <div className="sw-head-icon"><Shield size={20} /></div>
          <div>
            <h2 className="sw-head-title">{isSA ? 'Network Staff Watch' : 'School Staff Watch'}</h2>
            <p className="sw-head-sub">
              {isSA
                ? 'Monitor teacher and principal compliance. Take corrective action with one click.'
                : `Track every teacher's class coverage and issue corrective action when needed.`}
            </p>
          </div>
        </div>
        <div className="sw-head-pills">
          <span className="sw-head-pill sw-head-pill--good"><span className="sw-head-pill-num">{summary.compliantCount}</span> Compliant</span>
          <span className="sw-head-pill sw-head-pill--warn"><span className="sw-head-pill-num">{summary.warningCount + summary.watchCount}</span> Watch</span>
          <span className="sw-head-pill sw-head-pill--bad"><span className="sw-head-pill-num">{summary.criticalCount + summary.severeCount}</span> Critical</span>
          <span className="sw-head-pill sw-head-pill--info"><span className="sw-head-pill-num">{summary.pendingActions}</span> Pending</span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="sw-subtabs">
        {visibleSubs.map(t => (
          <button
            key={t.key}
            className={`sw-subtab ${activeSub === t.key ? 'active' : ''}`}
            onClick={() => setActiveSub(t.key)}
          >
            {t.icon} <span>{t.label}</span>
            {t.badge ? <span className="sw-subtab-badge">{t.badge}</span> : null}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="sw-body" key={activeSub}>
        {activeSub === 'overview'    && <OverviewSub summary={summary} staff={visibleStaff} actions={visibleActions} isSA={isSA} />}
        {activeSub === 'teachers'    && <StaffGrid staff={visibleStaff.filter(s => s.role === 'teacher')} isSA={isSA} onAct={(s, t) => setModalStaff({ s, defaultType: t })} />}
        {activeSub === 'principals'  && isSA && <StaffGrid staff={staff.filter(s => s.role === 'principal')} isSA={isSA} onAct={(s, t) => setModalStaff({ s, defaultType: t })} />}
        {activeSub === 'periods'     && !isSA && <PeriodTracker />}
        {activeSub === 'actions'     && <ActionLog actions={visibleActions} />}
        {activeSub === 'inspections' && isSA && <InspectionsSub visits={visits} onSchedule={() => setShowSchedule(true)} highlightId={highlightVisitId} />}
      </div>

      {/* Modal */}
      {modalStaff && (
        <ActionModal
          staff={modalStaff.s}
          defaultType={modalStaff.defaultType}
          issuerName={issuerName}
          issuerRole={issuerRole}
          onClose={() => setModalStaff(null)}
          onIssue={handleIssue}
        />
      )}

      {/* Schedule Inspection modal */}
      {showSchedule && (
        <ScheduleInspectionModal
          onClose={() => setShowSchedule(false)}
          onSchedule={handleScheduleVisit}
        />
      )}

      {/* Toast */}
      {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg(null)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-TAB: Overview
   ═══════════════════════════════════════════════════════════════════════════ */

function OverviewSub({
  summary,
  staff,
  actions,
  isSA,
}: {
  summary: ReturnType<typeof summarize>;
  staff: StaffMember[];
  actions: DisciplinaryAction[];
  isSA: boolean;
}) {
  const worstStaff = [...staff].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
  const recentActions = actions.slice(0, 5);
  const total = summary.totalStaff;

  return (
    <>
      <div className="sw-grid-3">
        <div className="sw-card sw-card--stat">
          <div className="sw-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}><UserCheck size={22} /></div>
          <div>
            <div className="sw-stat-num">{summary.classCoverageRate}%</div>
            <div className="sw-stat-label">Avg Class Coverage</div>
            <div className="sw-stat-hint">Periods conducted vs scheduled</div>
          </div>
        </div>
        <div className="sw-card sw-card--stat">
          <div className="sw-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444' }}><UserX size={22} /></div>
          <div>
            <div className="sw-stat-num">{summary.awolIncidentsThisMonth}</div>
            <div className="sw-stat-label">AWOL Incidents</div>
            <div className="sw-stat-hint">Unauthorized absences this term</div>
          </div>
        </div>
        <div className="sw-card sw-card--stat">
          <div className="sw-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.14)', color: '#F59E0B' }}><Coins size={22} /></div>
          <div>
            <div className="sw-stat-num">{summary.salaryHoldCount}</div>
            <div className="sw-stat-label">Salary Actions</div>
            <div className="sw-stat-hint">Hold / docked / suspended</div>
          </div>
        </div>
      </div>

      <div className="sw-card">
        <div className="sw-card-head">
          <h3 className="sw-card-title"><Target size={17} /> Compliance Distribution</h3>
          <span className="sw-card-sub">{total} staff members</span>
        </div>
        <div className="sw-dist-bar">
          {(['compliant', 'watch', 'warning', 'critical', 'severe'] as RiskLevel[]).map(lvl => {
            const count = staff.filter(s => s.riskLevel === lvl).length;
            const pct = total > 0 ? (count / total) * 100 : 0;
            if (count === 0) return null;
            return (
              <div
                key={lvl}
                className={`sw-dist-seg sw-dist-seg--${lvl}`}
                style={{ width: `${pct}%` }}
                title={`${RISK_META[lvl].label}: ${count} (${pct.toFixed(0)}%)`}
              >
                {pct > 8 && <span className="sw-dist-seg-num">{count}</span>}
              </div>
            );
          })}
        </div>
        <div className="sw-dist-legend">
          {(['compliant', 'watch', 'warning', 'critical', 'severe'] as RiskLevel[]).map(lvl => {
            const count = staff.filter(s => s.riskLevel === lvl).length;
            return (
              <div key={lvl} className="sw-dist-legend-item">
                <span className={`sw-dist-dot sw-dist-dot--${lvl}`} />
                <span className="sw-dist-name">{RISK_META[lvl].label}</span>
                <span className="sw-dist-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sw-grid-2">
        <div className="sw-card sw-card--alert">
          <div className="sw-card-head">
            <h3 className="sw-card-title"><Flame size={17} color="var(--danger)" /> Top Risk Staff</h3>
            <span className="sw-card-sub">Sorted by risk score</span>
          </div>
          <div className="sw-worst-list">
            {worstStaff.map((s, i) => (
              <div key={s.id} className="sw-worst-row">
                <div className="sw-worst-rank">{i + 1}</div>
                <div className="sw-worst-avatar">{s.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                <div className="sw-worst-body">
                  <div className="sw-worst-name">{s.name}</div>
                  <div className="sw-worst-meta">
                    {s.designation} {isSA && <>• <MapPin size={9} /> {s.schoolName}</>}
                  </div>
                </div>
                <div className="sw-worst-stats">
                  <div className="sw-worst-stat">
                    <div className="sw-worst-stat-val">{s.attendancePercent.toFixed(0)}%</div>
                    <div className="sw-worst-stat-lbl">Att.</div>
                  </div>
                  <div className="sw-worst-stat">
                    <div className="sw-worst-stat-val" style={{ color: 'var(--danger)' }}>{s.awolIncidents}</div>
                    <div className="sw-worst-stat-lbl">AWOL</div>
                  </div>
                </div>
                <RiskBadge level={s.riskLevel} />
              </div>
            ))}
          </div>
        </div>

        <div className="sw-card">
          <div className="sw-card-head">
            <h3 className="sw-card-title"><Activity size={17} /> Recent Actions</h3>
          </div>
          <div className="sw-recent-list">
            {recentActions.map(a => (
              <div key={a.id} className="sw-recent-row">
                <div className={`sw-recent-icon sw-recent-icon--sev${ACTION_META[a.type].severity}`}>{ACTION_ICON[a.type]}</div>
                <div className="sw-recent-body">
                  <div className="sw-recent-title">
                    <strong>{ACTION_META[a.type].label}</strong> — {a.staffName}
                  </div>
                  <div className="sw-recent-meta">
                    {a.schoolName} <span className="sw-dot-sep">•</span> {new Date(a.issuedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} <span className="sw-dot-sep">•</span> by {a.issuedBy}
                  </div>
                </div>
                <span className={`sw-action-status sw-action-status--${a.status}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-TAB: Staff Grid (Teachers / Principals)
   ═══════════════════════════════════════════════════════════════════════════ */

function StaffGrid({
  staff,
  isSA,
  onAct,
}: {
  staff: StaffMember[];
  isSA: boolean;
  onAct: (s: StaffMember, type?: ActionType) => void;
}) {
  const [search, setSearch] = useState('');
  const [risk, setRisk] = useState<'all' | RiskLevel>('all');
  const [sort, setSort] = useState<'risk' | 'attendance' | 'awol' | 'coverage'>('risk');

  const filtered = useMemo(() => {
    return staff
      .filter(s => {
        if (risk !== 'all' && s.riskLevel !== risk) return false;
        if (search && !`${s.name} ${s.schoolName} ${s.designation}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'risk')        return b.riskScore - a.riskScore;
        if (sort === 'attendance')  return a.attendancePercent - b.attendancePercent;
        if (sort === 'awol')        return b.awolIncidents - a.awolIncidents;
        return a.classCoverageRate - b.classCoverageRate;
      });
  }, [staff, search, risk, sort]);

  return (
    <>
      <div className="sw-toolbar">
        <div className="sw-search">
          <Search size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff, school, designation…" />
        </div>
        <div className="sw-toolbar-right">
          <div className="sw-select">
            <Filter size={13} />
            <select value={risk} onChange={e => setRisk(e.target.value as 'all' | RiskLevel)}>
              <option value="all">All risk levels</option>
              <option value="severe">Severe only</option>
              <option value="critical">Critical only</option>
              <option value="warning">Warning only</option>
              <option value="watch">Watch only</option>
              <option value="compliant">Compliant only</option>
            </select>
          </div>
          <div className="sw-select">
            <ChevronDown size={13} />
            <select value={sort} onChange={e => setSort(e.target.value as 'risk' | 'attendance' | 'awol' | 'coverage')}>
              <option value="risk">Sort: Risk Score</option>
              <option value="attendance">Sort: Lowest Attendance</option>
              <option value="awol">Sort: Most AWOL</option>
              <option value="coverage">Sort: Lowest Coverage</option>
            </select>
          </div>
        </div>
      </div>

      <div className="sw-chip-row">
        {(['all', 'severe', 'critical', 'warning', 'watch', 'compliant'] as const).map(r => (
          <button key={r} className={`sw-chip ${risk === r ? 'active' : ''}`} onClick={() => setRisk(r)}>
            {r === 'all' ? 'All' : RISK_META[r as RiskLevel].label}
            <span className="sw-chip-count">{r === 'all' ? staff.length : staff.filter(s => s.riskLevel === r).length}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="sw-empty"><ShieldCheck size={32} /><p>No staff match these filters.</p></div>
      ) : (
        <div className="sw-staff-grid">
          {filtered.map(s => <StaffCard key={s.id} s={s} isSA={isSA} onAct={onAct} />)}
        </div>
      )}
    </>
  );
}

function StaffCard({ s, isSA, onAct }: { s: StaffMember; isSA: boolean; onAct: (s: StaffMember, type?: ActionType) => void }) {
  const attendanceTone = s.attendancePercent >= 92 ? 'good' : s.attendancePercent >= 78 ? 'warn' : 'bad';
  const coverageTone   = s.classCoverageRate >= 92 ? 'good' : s.classCoverageRate >= 80 ? 'warn' : 'bad';
  const toneColor = (t: 'good' | 'warn' | 'bad') => t === 'good' ? '#059669' : t === 'warn' ? '#F59E0B' : '#EF4444';

  return (
    <div className={`sw-card2 sw-card2--${s.riskLevel}`}>
      {/* Top row: identity */}
      <div className="sw-card2-top">
        <div className="sw-card2-avatar">{s.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
        <div className="sw-card2-id">
          <div className="sw-card2-name">{s.name}</div>
          <div className="sw-card2-meta">
            {s.designation}
            {s.subjectsTaught && s.subjectsTaught.length > 0 && ` · ${s.subjectsTaught.join(', ')}`}
            {isSA && <> · <span className="sw-card2-school">{s.schoolName}</span></>}
          </div>
        </div>
        <RiskBadge level={s.riskLevel} />
      </div>

      {/* Twin metric blocks */}
      <div className="sw-card2-mets">
        <div className="sw-card2-met">
          <div className="sw-card2-met-num" style={{ color: toneColor(attendanceTone) }}>{s.attendancePercent.toFixed(1)}<span className="sw-card2-met-pct">%</span></div>
          <div className="sw-card2-met-label">Attendance</div>
          <MiniBar value={s.attendancePercent} tone={attendanceTone} />
          <div className="sw-card2-met-sub">{s.daysPresent} of {s.totalWorkingDays} days</div>
        </div>
        {s.role === 'teacher' ? (
          <div className="sw-card2-met">
            <div className="sw-card2-met-num" style={{ color: toneColor(coverageTone) }}>{s.classCoverageRate.toFixed(1)}<span className="sw-card2-met-pct">%</span></div>
            <div className="sw-card2-met-label">Class Coverage</div>
            <MiniBar value={s.classCoverageRate} tone={coverageTone} />
            <div className="sw-card2-met-sub">{s.conductedPeriods} of {s.scheduledPeriods} periods</div>
          </div>
        ) : (
          <div className="sw-card2-met">
            <div className="sw-card2-met-num" style={{ color: 'var(--text-primary)' }}>{s.avgArrivalTime}</div>
            <div className="sw-card2-met-label">Avg Arrival</div>
            <div className="sw-card2-met-sub" style={{ marginTop: 14 }}>Out by {s.avgDepartureTime}</div>
          </div>
        )}
      </div>

      {/* Compact stats row */}
      <div className="sw-card2-stats">
        <span className={`sw-card2-stat ${s.awolIncidents > 0 ? 'sw-card2-stat--bad' : ''}`}>
          <span className="sw-card2-stat-num">{s.awolIncidents}</span> AWOL
        </span>
        <span className={`sw-card2-stat ${s.lateArrivals > 5 ? 'sw-card2-stat--warn' : ''}`}>
          <span className="sw-card2-stat-num">{s.lateArrivals}</span> late
        </span>
        <span className={`sw-card2-stat ${s.earlyDepartures > 5 ? 'sw-card2-stat--warn' : ''}`}>
          <span className="sw-card2-stat-num">{s.earlyDepartures}</span> early-out
        </span>
        {s.consecutiveAbsentDays > 0 && (
          <span className="sw-card2-stat sw-card2-stat--bad">
            <Flame size={10} /> <span className="sw-card2-stat-num">{s.consecutiveAbsentDays}</span>d streak
          </span>
        )}
      </div>

      {/* Footer: status tags + primary action */}
      <div className="sw-card2-foot">
        <div className="sw-card2-tags">
          <SalaryBadge status={s.salaryStatus} />
          {s.lastActionType && (
            <span className="sw-card2-last">
              {ACTION_ICON[s.lastActionType]} Last: {ACTION_META[s.lastActionType].short}
            </span>
          )}
        </div>
        <div className="sw-card2-actions">
          <a className="sw-icon-only" href={`tel:${s.phone}`} title={`Call ${s.phone}`}><Phone size={13} /></a>
          <a className="sw-icon-only" href={`mailto:${s.email}`} title={`Email ${s.email}`}><Mail size={13} /></a>
          <button className="sw-card2-cta" onClick={() => onAct(s)}>
            {s.riskLevel === 'compliant' ? 'Review' : 'Take Action'} <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-TAB: Action Log
   ═══════════════════════════════════════════════════════════════════════════ */

function ActionLog({ actions }: { actions: DisciplinaryAction[] }) {
  const [filter, setFilter] = useState<'all' | DisciplinaryAction['status']>('all');
  const filtered = filter === 'all' ? actions : actions.filter(a => a.status === filter);

  return (
    <>
      <div className="sw-chip-row">
        {(['all', 'pending', 'responded', 'closed', 'escalated', 'completed'] as const).map(f => (
          <button key={f} className={`sw-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="sw-chip-count">{f === 'all' ? actions.length : actions.filter(a => a.status === f).length}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="sw-empty"><Inbox size={32} /><p>No actions in this category.</p></div>
      ) : (
        <div className="sw-action-list">
          {filtered.map(a => <ActionLogItem key={a.id} a={a} />)}
        </div>
      )}
    </>
  );
}

function ActionLogItem({ a }: { a: DisciplinaryAction }) {
  const meta = ACTION_META[a.type];
  return (
    <div className={`sw-action-item sw-action-item--sev${meta.severity}`}>
      <div className="sw-action-item-icon">{ACTION_ICON[a.type]}</div>
      <div className="sw-action-item-body">
        <div className="sw-action-item-head">
          <div>
            <div className="sw-action-item-title">{meta.label} — {a.staffName}</div>
            <div className="sw-action-item-meta">
              <span className="sw-action-item-id">{a.id}</span>
              <span className="sw-dot-sep">•</span>
              <span>{a.staffDesignation} at {a.schoolName}</span>
              <span className="sw-dot-sep">•</span>
              <span>Issued by {a.issuedBy}</span>
              <span className="sw-dot-sep">•</span>
              <span>{new Date(a.issuedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
          <span className={`sw-action-status sw-action-status--${a.status}`}>{a.status}</span>
        </div>
        <p className="sw-action-item-reason">"{a.reason}"</p>
        {a.dueDate && a.status === 'pending' && (
          <div className="sw-action-item-due">
            <Hourglass size={11} /> Response due by {new Date(a.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        )}
        {a.response && (
          <div className="sw-action-item-response">
            <div className="sw-action-item-response-label">Response ({a.responseDate && new Date(a.responseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}):</div>
            <p>{a.response}</p>
          </div>
        )}
      </div>
      {a.status === 'pending' && (
        <div className="sw-action-item-buttons">
          <button className="sw-btn sw-btn--ghost-sm"><FileCheck size={12} /> Mark Closed</button>
          <button className="sw-btn sw-btn--warn-sm">Escalate</button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-TAB: Period Tracker (Principal)
   ═══════════════════════════════════════════════════════════════════════════ */

function PeriodTracker() {
  const [classFilter, setClassFilter] = useState<string>('all');
  const classes = useMemo(() => Array.from(new Set(todayPeriodLog.map(p => `${p.className}-${p.section}`))), []);
  const filtered = classFilter === 'all' ? todayPeriodLog : todayPeriodLog.filter(p => `${p.className}-${p.section}` === classFilter);
  const grouped = useMemo(() => {
    const m = new Map<string, PeriodLog[]>();
    filtered.forEach(p => {
      const key = `${p.className}-${p.section}`;
      m.set(key, [...(m.get(key) ?? []), p]);
    });
    return Array.from(m.entries());
  }, [filtered]);

  const total = filtered.length;
  const conducted = filtered.filter(p => p.status === 'conducted').length;
  const missed = filtered.filter(p => p.status === 'missed').length;
  const substituted = filtered.filter(p => p.status === 'substituted').length;
  const cancelled = filtered.filter(p => p.status === 'cancelled').length;

  return (
    <>
      <div className="sw-banner">
        <Clock size={20} />
        <div>
          <h3>Today's Period Tracker — {DEMO_SCHOOL_NAME}</h3>
          <p>Real-time view of which classes are running and which teachers skipped their periods. Take action directly from here.</p>
        </div>
      </div>

      <div className="sw-grid-4">
        <div className="sw-card sw-card--mini">
          <div className="sw-mini-num" style={{ color: 'var(--primary-600)' }}>{conducted}</div>
          <div className="sw-mini-label">Conducted</div>
        </div>
        <div className="sw-card sw-card--mini">
          <div className="sw-mini-num" style={{ color: 'var(--danger)' }}>{missed}</div>
          <div className="sw-mini-label">Missed</div>
        </div>
        <div className="sw-card sw-card--mini">
          <div className="sw-mini-num" style={{ color: 'var(--info)' }}>{substituted}</div>
          <div className="sw-mini-label">Substituted</div>
        </div>
        <div className="sw-card sw-card--mini">
          <div className="sw-mini-num" style={{ color: 'var(--text-tertiary)' }}>{cancelled}</div>
          <div className="sw-mini-label">Cancelled</div>
        </div>
      </div>

      <div className="sw-chip-row">
        <button className={`sw-chip ${classFilter === 'all' ? 'active' : ''}`} onClick={() => setClassFilter('all')}>
          All Classes <span className="sw-chip-count">{todayPeriodLog.length}</span>
        </button>
        {classes.map(c => (
          <button key={c} className={`sw-chip ${classFilter === c ? 'active' : ''}`} onClick={() => setClassFilter(c)}>
            Class {c}
            <span className="sw-chip-count">{todayPeriodLog.filter(p => `${p.className}-${p.section}` === c).length}</span>
          </button>
        ))}
      </div>

      {grouped.map(([key, periods]) => (
        <div key={key} className="sw-card">
          <div className="sw-card-head">
            <h3 className="sw-card-title"><BookOpen size={17} /> Class {key}</h3>
            <span className="sw-card-sub">{periods.filter(p => p.status === 'conducted' || p.status === 'substituted').length} of {periods.length} periods covered</span>
          </div>
          <div className="sw-period-list">
            {periods.map(p => <PeriodRow key={p.id} p={p} />)}
          </div>
        </div>
      ))}

      {grouped.length === 0 && (
        <div className="sw-empty"><CalendarOff size={28} /><p>No periods scheduled.</p></div>
      )}

      <div className="sw-summary-meta">
        <span><CheckCircle2 size={11} color="var(--primary-600)" /> Coverage rate: <strong>{((conducted + substituted) / total * 100).toFixed(0)}%</strong></span>
        <span className="sw-dot-sep">•</span>
        <span>Updated automatically as teachers mark attendance</span>
      </div>
    </>
  );
}

function PeriodRow({ p }: { p: PeriodLog }) {
  const meta: Record<PeriodLog['status'], { color: string; bg: string; label: string; icon: ReactNode }> = {
    conducted:    { color: 'var(--primary-700)', bg: 'rgba(16, 185, 129, 0.12)', label: 'Conducted',   icon: <CheckCircle2 size={12} /> },
    missed:       { color: 'var(--danger)',      bg: 'rgba(239, 68, 68, 0.12)',  label: 'Missed',      icon: <XCircle size={12} /> },
    substituted:  { color: 'var(--info)',        bg: 'rgba(59, 130, 246, 0.12)', label: 'Substituted', icon: <ArrowRightLeft size={12} /> },
    cancelled:    { color: 'var(--text-tertiary)', bg: 'var(--bg-tertiary)',     label: 'Cancelled',   icon: <X size={12} /> },
  };
  const m = meta[p.status];

  return (
    <div className={`sw-period-row sw-period-row--${p.status}`}>
      <div className="sw-period-num">P{p.period}</div>
      <div className="sw-period-time">
        <div>{p.startTime}</div>
        <div className="sw-period-time-sub">{p.endTime}</div>
      </div>
      <div className="sw-period-body">
        <div className="sw-period-subject">{p.subject}</div>
        <div className="sw-period-teacher">
          {p.status === 'substituted' ? (
            <>
              <span className="sw-period-strike">{p.teacherName}</span>
              <ArrowRightLeft size={11} />
              <strong>{p.substituteName}</strong>
            </>
          ) : (
            <span>{p.teacherName}</span>
          )}
        </div>
        {p.notes && <div className="sw-period-note">"{p.notes}"</div>}
      </div>
      <span className="sw-period-status" style={{ color: m.color, background: m.bg }}>
        {m.icon} {m.label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-TAB: Surprise Inspections
   ═══════════════════════════════════════════════════════════════════════════ */

function InspectionsSub({
  visits,
  onSchedule,
  highlightId,
}: {
  visits: SurpriseVisit[];
  onSchedule: () => void;
  highlightId: string | null;
}) {
  const scheduled = useMemo(() => visits.filter(v => v.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [visits]);
  const completed = useMemo(() => visits.filter(v => v.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [visits]);

  return (
    <>
      {/* Lighter banner with primary CTA */}
      <div className="sw-insp-banner">
        <div className="sw-insp-banner-head">
          <div className="sw-insp-banner-icon"><Eye size={18} /></div>
          <div className="sw-insp-banner-body">
            <h3>Surprise Inspections</h3>
            <p>Schedule unannounced visits. Date is shared only with the inspector — staff get zero notice.</p>
          </div>
          <button className="sw-btn sw-btn--primary" onClick={onSchedule}>
            <CalendarPlus size={14} /> Schedule Inspection
          </button>
        </div>
      </div>

      {/* Section: Scheduled */}
      <div className="sw-section">
        <div className="sw-section-head">
          <h3 className="sw-section-title"><Clock size={15} /> Scheduled</h3>
          <span className="sw-section-sub">{scheduled.length} upcoming</span>
        </div>
        {scheduled.length === 0 ? (
          <div className="sw-empty sw-empty--mini">
            <Clock size={20} />
            <p>No inspections scheduled. Click <strong>Schedule Inspection</strong> to set one up.</p>
          </div>
        ) : (
          <div className="sw-visit-grid">
            {scheduled.map(v => <VisitCard key={v.id} v={v} highlight={v.id === highlightId} />)}
          </div>
        )}
      </div>

      {/* Section: Reports */}
      <div className="sw-section">
        <div className="sw-section-head">
          <h3 className="sw-section-title"><FileCheck size={15} /> Recent Reports</h3>
          <span className="sw-section-sub">{completed.length} completed</span>
        </div>
        <div className="sw-visit-grid">
          {completed.map(v => <VisitCard key={v.id} v={v} />)}
        </div>
      </div>
    </>
  );
}

function VisitCard({ v, highlight }: { v: SurpriseVisit; highlight?: boolean }) {
  const date = new Date(v.date);
  const isCompleted = v.status === 'completed';
  const ratingTone = v.rating >= 4 ? 'good' : v.rating >= 3 ? 'warn' : 'bad';
  const ratingColor = ratingTone === 'good' ? 'var(--primary-600)' : ratingTone === 'warn' ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className={`sw-visit-card ${isCompleted ? 'sw-visit-card--done' : 'sw-visit-card--scheduled'} ${highlight ? 'sw-visit-card--new' : ''}`}>
      <div className="sw-visit-card-head">
        <div className={`sw-visit-card-date sw-visit-card-date--${v.status}`}>
          <div className="sw-visit-card-day">{date.getDate()}</div>
          <div className="sw-visit-card-mon">{date.toLocaleDateString('en-IN', { month: 'short' })}</div>
        </div>
        <div className="sw-visit-card-id">
          <div className="sw-visit-card-school">{v.schoolName}</div>
          <div className="sw-visit-card-time">
            <Clock size={11} /> {v.time}
            {v.priority && v.priority !== 'normal' && (
              <>
                <span className="sw-dot-sep">·</span>
                <span className={`sw-visit-prio sw-visit-prio--${v.priority}`}>{v.priority}</span>
              </>
            )}
          </div>
        </div>
        {isCompleted ? (
          <div className="sw-visit-card-rating" style={{ color: ratingColor }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} fill={i < v.rating ? ratingColor : 'transparent'} stroke={ratingColor} />
            ))}
          </div>
        ) : (
          <span className="sw-visit-card-tag sw-visit-card-tag--scheduled">
            <Lock size={10} /> Scheduled
          </span>
        )}
      </div>

      <div className="sw-visit-card-body">
        <div className="sw-visit-card-inspector">
          <UserCheck size={11} /> <strong>{v.inspector}</strong>
          <span className="sw-visit-card-desig"> · {v.inspectorDesignation}</span>
        </div>

        {v.focusAreas && v.focusAreas.length > 0 && (
          <div className="sw-visit-card-focus">
            <span className="sw-visit-card-focus-label">Focus:</span>
            {v.focusAreas.slice(0, 3).map(f => <span key={f} className="sw-visit-card-focus-tag">{f}</span>)}
            {v.focusAreas.length > 3 && <span className="sw-visit-card-focus-more">+{v.focusAreas.length - 3} more</span>}
          </div>
        )}

        {v.specificConcerns && (
          <p className="sw-visit-card-note">"{v.specificConcerns}"</p>
        )}

        {isCompleted && (
          <>
            <div className="sw-visit-card-stats">
              <div className="sw-visit-card-stat">
                <span className="sw-visit-card-stat-num">{v.staffPresent}<span className="sw-visit-card-stat-of">/{v.staffExpected}</span></span>
                <span className="sw-visit-card-stat-lbl">Staff present</span>
              </div>
              <div className="sw-visit-card-stat">
                <span className="sw-visit-card-stat-num">{v.classesActive}<span className="sw-visit-card-stat-of">/{v.classesScheduled}</span></span>
                <span className="sw-visit-card-stat-lbl">Classes active</span>
              </div>
            </div>
            {v.findings && <p className="sw-visit-card-findings">"{v.findings}"</p>}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCHEDULE INSPECTION MODAL — full working flow
   ═══════════════════════════════════════════════════════════════════════════ */

function ScheduleInspectionModal({
  onClose,
  onSchedule,
}: {
  onClose: () => void;
  onSchedule: (v: SurpriseVisit) => void;
}) {
  /* Sort schools by lowest attendance — these are the most likely candidates */
  const sortedSchools = useMemo(() => [...schoolAttendance].sort((a, b) => a.todayPercent - b.todayPercent), []);

  const [step, setStep] = useState<1 | 2>(1);
  const [schoolCode, setSchoolCode] = useState(sortedSchools[0]?.schoolCode ?? '');
  const [date, setDate] = useState(() => {
    const d = new Date('2026-05-10');
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState('10:30');
  const [inspector, setInspector] = useState(INSPECTOR_ROSTER[0].name);
  const [focus, setFocus] = useState<Set<string>>(new Set(['Staff presence verification', 'Class running verification']));
  const [confidentiality, setConfidentiality] = useState<Confidentiality>('inspector_only');
  const [priority, setPriority] = useState<VisitPriority>('high');
  const [concerns, setConcerns] = useState('');

  const school = sortedSchools.find(s => s.schoolCode === schoolCode);
  const inspectorMeta = INSPECTOR_ROSTER.find(i => i.name === inspector);

  const toggleFocus = (f: string) => {
    setFocus(prev => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f); else next.add(f);
      return next;
    });
  };

  const handleSchedule = () => {
    if (!school || !inspectorMeta) return;
    const id = `SV-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    const visit: SurpriseVisit = {
      id, schoolCode: school.schoolCode, schoolName: school.schoolName,
      date, time,
      inspector: inspectorMeta.name, inspectorDesignation: inspectorMeta.designation,
      staffPresent: 0, staffExpected: 0, classesActive: 0, classesScheduled: 0, rating: 1,
      status: 'scheduled',
      focusAreas: Array.from(focus), confidentiality, priority,
      specificConcerns: concerns.trim() || undefined,
    };
    onSchedule(visit);
  };

  const canProceed = !!schoolCode && !!date && !!time && !!inspector;
  const canSchedule = canProceed && focus.size > 0;
  const days = Math.max(0, Math.ceil((new Date(date).getTime() - new Date('2026-05-10').getTime()) / 86400000));

  const TIME_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30'];

  return (
    <div className="sw-modal-overlay" onClick={onClose}>
      <div className="sw-modal sw-modal--wide" onClick={e => e.stopPropagation()} role="dialog">
        {/* Compact header */}
        <div className="sw-sched-head">
          <div className="sw-sched-head-icon"><Eye size={20} /></div>
          <div style={{ flex: 1 }}>
            <div className="sw-modal-title">Schedule Surprise Inspection</div>
            <div className="sw-modal-sub">Step {step} of 2 — {step === 1 ? 'Choose location, time and inspector' : 'Brief the inspector and confirm'}</div>
          </div>
          <button className="sw-modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        {/* Stepper bar */}
        <div className="sw-stepper">
          <div className={`sw-stepper-step ${step >= 1 ? 'active' : ''}`}>
            <div className="sw-stepper-dot">1</div>
            <span>Where & When</span>
          </div>
          <div className="sw-stepper-line" />
          <div className={`sw-stepper-step ${step >= 2 ? 'active' : ''}`}>
            <div className="sw-stepper-dot">2</div>
            <span>Brief & Confirm</span>
          </div>
        </div>

        {/* Body */}
        <div className="sw-sched-body">
          {step === 1 && (
            <div className="sw-sched-step">
              {/* School picker — visual cards */}
              <div className="sw-field">
                <label className="sw-field-label">School <span className="sw-req">*</span></label>
                <div className="sw-field-hint" style={{ marginTop: 0, marginBottom: 8 }}>
                  <Sparkles size={11} /> Schools sorted by lowest attendance — most likely to need a check.
                </div>
                <div className="sw-school-grid">
                  {sortedSchools.slice(0, 6).map(s => (
                    <button
                      key={s.schoolCode}
                      type="button"
                      className={`sw-school-tile ${schoolCode === s.schoolCode ? 'active' : ''}`}
                      onClick={() => setSchoolCode(s.schoolCode)}
                    >
                      <div className="sw-school-tile-head">
                        <div className="sw-school-tile-name">{s.schoolName}</div>
                        <div className="sw-school-tile-pct" style={{ color: s.todayPercent >= 88 ? 'var(--primary-600)' : s.todayPercent >= 75 ? 'var(--warning)' : 'var(--danger)' }}>
                          {s.todayPercent.toFixed(0)}%
                        </div>
                      </div>
                      <div className="sw-school-tile-meta">{s.district} · {s.totalStudents} students</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="sw-field-grid">
                <div className="sw-field">
                  <label className="sw-field-label">Date <span className="sw-req">*</span></label>
                  <input type="date" className="sw-input" value={date} onChange={e => setDate(e.target.value)} min="2026-05-10" />
                  <div className="sw-field-hint">{days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`}</div>
                </div>
                <div className="sw-field">
                  <label className="sw-field-label">Time <span className="sw-req">*</span></label>
                  <div className="sw-time-slots">
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        type="button"
                        className={`sw-time-slot ${time === t ? 'active' : ''}`}
                        onClick={() => setTime(t)}
                      >{t}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sw-field">
                <label className="sw-field-label">Inspector <span className="sw-req">*</span></label>
                <div className="sw-inspector-list">
                  {INSPECTOR_ROSTER.map(i => (
                    <button
                      key={i.name}
                      type="button"
                      className={`sw-inspector-row ${inspector === i.name ? 'active' : ''}`}
                      onClick={() => setInspector(i.name)}
                    >
                      <div className="sw-inspector-avatar">{i.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                      <div className="sw-inspector-body">
                        <div className="sw-inspector-name">{i.name}</div>
                        <div className="sw-inspector-desig">{i.designation}</div>
                      </div>
                      {inspector === i.name && <CheckCircle2 size={16} className="sw-inspector-check" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="sw-sched-step">
              {/* Selection summary */}
              <div className="sw-sched-summary">
                <div className="sw-sched-summary-row">
                  <span className="sw-sched-summary-label"><MapPin size={11} /> School</span>
                  <span className="sw-sched-summary-val">{school?.schoolName} <span className="sw-sched-summary-meta">· {school?.district}</span></span>
                </div>
                <div className="sw-sched-summary-row">
                  <span className="sw-sched-summary-label"><Clock size={11} /> When</span>
                  <span className="sw-sched-summary-val">{new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} at {time}</span>
                </div>
                <div className="sw-sched-summary-row">
                  <span className="sw-sched-summary-label"><UserCheck size={11} /> Inspector</span>
                  <span className="sw-sched-summary-val">{inspector} <span className="sw-sched-summary-meta">· {inspectorMeta?.designation}</span></span>
                </div>
              </div>

              {/* Focus areas */}
              <div className="sw-field">
                <label className="sw-field-label">Focus Areas <span className="sw-req">*</span></label>
                <div className="sw-field-hint" style={{ marginTop: 0, marginBottom: 8 }}>What should the inspector verify? (Pick at least one)</div>
                <div className="sw-focus-grid">
                  {FOCUS_AREAS.map(f => (
                    <button
                      key={f}
                      type="button"
                      className={`sw-focus-chip ${focus.has(f) ? 'active' : ''}`}
                      onClick={() => toggleFocus(f)}
                    >
                      {focus.has(f) ? <CheckCircle2 size={12} /> : <span className="sw-focus-dot" />}
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confidentiality */}
              <div className="sw-field">
                <label className="sw-field-label">Confidentiality</label>
                <div className="sw-confid-options">
                  {(Object.keys(CONFIDENTIALITY_META) as Confidentiality[]).map(c => {
                    const m = CONFIDENTIALITY_META[c];
                    const Icon = c === 'inspector_only' ? Lock : c === 'inspector_hq' ? Globe2 : Megaphone;
                    return (
                      <button
                        key={c}
                        type="button"
                        className={`sw-confid-tile ${confidentiality === c ? 'active' : ''}`}
                        onClick={() => setConfidentiality(c)}
                      >
                        <Icon size={16} className="sw-confid-icon" />
                        <div>
                          <div className="sw-confid-name">{m.label}</div>
                          <div className="sw-confid-desc">{m.description}</div>
                        </div>
                        {confidentiality === c && <CheckCircle2 size={14} className="sw-confid-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority */}
              <div className="sw-field">
                <label className="sw-field-label">Priority</label>
                <div className="sw-prio-row">
                  {(['low', 'normal', 'high', 'urgent'] as VisitPriority[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      className={`sw-prio-pill sw-prio-pill--${p} ${priority === p ? 'active' : ''}`}
                      onClick={() => setPriority(p)}
                    >
                      {p === 'urgent' && <Zap size={11} />}
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="sw-field">
                <label className="sw-field-label">Specific Concerns (optional)</label>
                <textarea
                  className="sw-textarea"
                  rows={3}
                  value={concerns}
                  onChange={e => setConcerns(e.target.value)}
                  placeholder="e.g. Pattern of teachers leaving early on Wednesdays. Verify class 9 and 10 periods after lunch."
                />
              </div>

              {/* Final preview */}
              <div className="sw-sched-final">
                <div className="sw-sched-final-head">
                  <CalendarPlus size={14} /> <strong>What happens after you confirm</strong>
                </div>
                <ul className="sw-sched-final-list">
                  <li>Sealed brief sent to {inspector} only — staff get zero notice.</li>
                  <li>Visit added to your schedule on {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}.</li>
                  <li>Inspector files report with findings within 24h of visit.</li>
                  {priority === 'urgent' && <li><Zap size={11} /> Marked URGENT — inspector pings phone within 30 minutes.</li>}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sw-modal-foot">
          {step === 2 && <button className="sw-btn sw-btn--ghost" onClick={() => setStep(1)}><ChevronRight size={13} style={{ transform: 'rotate(180deg)' }} /> Back</button>}
          <div style={{ flex: 1 }} />
          <button className="sw-btn sw-btn--ghost" onClick={onClose}>Cancel</button>
          {step === 1 ? (
            <button className="sw-btn sw-btn--primary" onClick={() => setStep(2)} disabled={!canProceed}>
              Continue <ChevronRight size={13} />
            </button>
          ) : (
            <button className="sw-btn sw-btn--primary" onClick={handleSchedule} disabled={!canSchedule}>
              <CalendarPlus size={13} /> Schedule Inspection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export type { StaffRole };
