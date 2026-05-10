import { useState, useMemo, type ReactNode } from 'react';
import {
  LayoutDashboard, Hammer, Inbox, PlusCircle, FileText, ClipboardCheck, Wallet, FolderOpen,
  Building2, Wrench, Sofa, Droplet, Zap, Sun, Trophy, Cpu, Square, BookOpen,
  IndianRupee, TrendingUp, CheckCircle2, Clock, AlertTriangle, XCircle, Search,
  Filter, MapPin, Calendar, User, ArrowUpRight, Star, Download, FileCheck, Camera,
  Receipt, ChevronRight, ShieldCheck, Activity, PauseCircle, ListChecks
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import {
  devWorks, contractors, tenders, inspections, budgetAllocations, documents,
  PRINCIPAL_DEMO_CODE, PRINCIPAL_DEMO_NAME,
  type DevWork, type WorkStatus, type WorkCategory, type WorkPriority, type Tender,
  type Inspection, type Contractor, type DocumentRecord
} from '../../data/development';
import './DevelopmentWorks.css';

type TabKey = 'overview' | 'projects' | 'proposals' | 'submit' | 'tenders' | 'inspections' | 'budget' | 'documents';
type Role = 'super-admin' | 'principal';

interface Props { role: Role; }

/* ═══════════════════════════════════════════
   Shared maps / helpers
   ═══════════════════════════════════════════ */

const STATUS_META: Record<WorkStatus, { label: string; cls: string; icon: ReactNode }> = {
  proposed:      { label: 'Proposed',       cls: 'dev-status--proposed',      icon: <FileText size={11} /> },
  under_review:  { label: 'Under Review',   cls: 'dev-status--review',        icon: <ClipboardCheck size={11} /> },
  approved:      { label: 'Sanctioned',     cls: 'dev-status--approved',      icon: <ShieldCheck size={11} /> },
  tendered:      { label: 'In Tender',      cls: 'dev-status--tendered',      icon: <FileText size={11} /> },
  work_order:    { label: 'Work Order',     cls: 'dev-status--work-order',    icon: <FileCheck size={11} /> },
  in_progress:   { label: 'In Progress',    cls: 'dev-status--progress',      icon: <Activity size={11} /> },
  inspection:    { label: 'Inspection',     cls: 'dev-status--inspection',    icon: <ClipboardCheck size={11} /> },
  completed:     { label: 'Completed',      cls: 'dev-status--completed',     icon: <CheckCircle2 size={11} /> },
  on_hold:       { label: 'On Hold',        cls: 'dev-status--on-hold',       icon: <PauseCircle size={11} /> },
  rejected:      { label: 'Rejected',       cls: 'dev-status--rejected',      icon: <XCircle size={11} /> },
};

const CATEGORY_ICON: Record<WorkCategory, ReactNode> = {
  'Civil Construction':    <Building2 size={14} />,
  'Renovation':            <Wrench size={14} />,
  'Furniture & Fixtures':  <Sofa size={14} />,
  'Sanitation & Water':    <Droplet size={14} />,
  'Electrical':            <Zap size={14} />,
  'Solar / Green Energy':  <Sun size={14} />,
  'Sports & Playground':   <Trophy size={14} />,
  'IT / Smart Classroom':  <Cpu size={14} />,
  'Boundary Wall':         <Square size={14} />,
  'Library':               <BookOpen size={14} />,
};

const PRIORITY_META: Record<WorkPriority, { label: string; cls: string }> = {
  urgent: { label: 'Urgent', cls: 'dev-prio--urgent' },
  high:   { label: 'High',   cls: 'dev-prio--high' },
  medium: { label: 'Medium', cls: 'dev-prio--medium' },
  low:    { label: 'Low',    cls: 'dev-prio--low' },
};

const STATUS_PIE_COLORS: Record<WorkStatus, string> = {
  proposed:     '#94A3B8',
  under_review: '#3B82F6',
  approved:     '#10B981',
  tendered:     '#8B5CF6',
  work_order:   '#06B6D4',
  in_progress:  '#F59E0B',
  inspection:   '#EC4899',
  completed:    '#059669',
  on_hold:      '#A1A1AA',
  rejected:     '#EF4444',
};

const fmtINR = (n: number): string => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
};

const fmtDate = (d?: string): string => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const fmtDateShort = (d?: string): string => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—';

const daysUntil = (d: string): number => Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

export default function DevelopmentWorks({ role }: Props) {
  const isSA = role === 'super-admin';
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const works = useMemo(
    () => isSA ? devWorks : devWorks.filter(w => w.schoolCode === PRINCIPAL_DEMO_CODE),
    [isSA]
  );

  const filteredInspections = useMemo(
    () => isSA ? inspections : inspections.filter(i => i.schoolCode === PRINCIPAL_DEMO_CODE),
    [isSA]
  );

  const filteredDocs = useMemo(
    () => documents.filter(d => devWorks.find(w => w.id === d.projectId)?.schoolCode === PRINCIPAL_DEMO_CODE),
    []
  );

  /* KPIs */
  const totalProjects = works.length;
  const activeProjects = works.filter(w => ['in_progress', 'work_order', 'inspection'].includes(w.status)).length;
  const completedProjects = works.filter(w => w.status === 'completed').length;
  const totalSanctioned = works.reduce((s, w) => s + (w.approvedAmount ?? 0), 0);
  const totalUtilized = works.reduce((s, w) => s + (w.utilizedAmount ?? 0), 0);
  const pendingProposals = works.filter(w => w.status === 'proposed' || w.status === 'under_review').length;
  const utilizationPct = totalSanctioned > 0 ? Math.round((totalUtilized / totalSanctioned) * 100) : 0;

  const tabs: { key: TabKey; label: string; icon: ReactNode; saOnly?: boolean; principalOnly?: boolean; badge?: number }[] = [
    { key: 'overview',    label: 'Overview',                       icon: <LayoutDashboard size={16} /> },
    { key: 'projects',    label: isSA ? 'All Projects' : 'My Projects', icon: <Hammer size={16} /> },
    { key: 'proposals',   label: 'Proposals',                       icon: <Inbox size={16} />, saOnly: true, badge: devWorks.filter(w => w.status === 'proposed' || w.status === 'under_review').length },
    { key: 'submit',      label: 'New Proposal',                   icon: <PlusCircle size={16} />, principalOnly: true },
    { key: 'tenders',     label: 'Tenders & Vendors',              icon: <FileText size={16} />, saOnly: true, badge: tenders.filter(t => t.status === 'bidding_open' || t.status === 'evaluation').length },
    { key: 'inspections', label: 'Inspections',                    icon: <ClipboardCheck size={16} />, badge: filteredInspections.filter(i => i.status === 'overdue').length || undefined },
    { key: 'budget',      label: 'Budget',                          icon: <Wallet size={16} />, saOnly: true },
    { key: 'documents',   label: 'Documents',                       icon: <FolderOpen size={16} />, principalOnly: true },
  ];

  const visibleTabs = tabs.filter(t => (!t.saOnly || isSA) && (!t.principalOnly || !isSA));

  return (
    <div className="dev">
      {/* Header */}
      <div className="page-header dev-header">
        <div>
          <h1 className="page-title">Development Works</h1>
          <p className="page-subtitle">
            {isSA
              ? 'Network-wide infrastructure, civil works and capital project oversight'
              : `${PRINCIPAL_DEMO_NAME} — infrastructure projects and capital works`}
          </p>
        </div>
        {!isSA && (
          <button className="dev-btn dev-btn--primary" onClick={() => setActiveTab('submit')}>
            <PlusCircle size={16} /> New Proposal
          </button>
        )}
        {isSA && (
          <button className="dev-btn dev-btn--primary" onClick={() => setActiveTab('proposals')}>
            <Inbox size={16} /> Review Proposals
            {pendingProposals > 0 && <span className="dev-btn-badge">{pendingProposals}</span>}
          </button>
        )}
      </div>

      {/* KPI Strip */}
      <div className="dev-kpi-row">
        <div className="dev-kpi">
          <div className="dev-kpi-icon dev-kpi-icon--primary"><Hammer size={22} /></div>
          <div className="dev-kpi-body">
            <div className="dev-kpi-value">{totalProjects}</div>
            <div className="dev-kpi-label">{isSA ? 'Total Projects FY 25-26' : 'My Projects'}</div>
            <div className="dev-kpi-sub"><Activity size={11} /> {activeProjects} active</div>
          </div>
        </div>
        <div className="dev-kpi">
          <div className="dev-kpi-icon dev-kpi-icon--accent"><IndianRupee size={22} /></div>
          <div className="dev-kpi-body">
            <div className="dev-kpi-value">{fmtINR(totalSanctioned)}</div>
            <div className="dev-kpi-label">Sanctioned Amount</div>
            <div className="dev-kpi-sub"><TrendingUp size={11} /> {utilizationPct}% utilised</div>
          </div>
        </div>
        <div className="dev-kpi">
          <div className="dev-kpi-icon dev-kpi-icon--info"><ListChecks size={22} /></div>
          <div className="dev-kpi-body">
            <div className="dev-kpi-value">{pendingProposals}</div>
            <div className="dev-kpi-label">Pending Proposals</div>
            <div className="dev-kpi-sub"><Clock size={11} /> awaiting sanction</div>
          </div>
        </div>
        <div className="dev-kpi">
          <div className="dev-kpi-icon dev-kpi-icon--success"><CheckCircle2 size={22} /></div>
          <div className="dev-kpi-body">
            <div className="dev-kpi-value">{completedProjects}</div>
            <div className="dev-kpi-label">Completed This Year</div>
            <div className="dev-kpi-sub"><ArrowUpRight size={11} /> on schedule</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dev-tabs" role="tablist">
        {visibleTabs.map(t => (
          <button
            key={t.key}
            role="tab"
            aria-selected={activeTab === t.key}
            className={`dev-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.badge ? <span className="dev-tab-badge">{t.badge}</span> : null}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="dev-content" key={activeTab}>
        {activeTab === 'overview' && <OverviewTab isSA={isSA} works={works} />}
        {activeTab === 'projects' && <ProjectsTab isSA={isSA} works={works} />}
        {activeTab === 'proposals' && isSA && <ProposalsTab />}
        {activeTab === 'submit' && !isSA && <SubmitProposalTab works={works} />}
        {activeTab === 'tenders' && isSA && <TendersTab />}
        {activeTab === 'inspections' && <InspectionsTab isSA={isSA} data={filteredInspections} />}
        {activeTab === 'budget' && isSA && <BudgetTab />}
        {activeTab === 'documents' && !isSA && <DocumentsTab data={filteredDocs} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Reusable bits
   ═══════════════════════════════════════════ */

function StatusBadge({ status }: { status: WorkStatus }) {
  const m = STATUS_META[status];
  return <span className={`dev-status ${m.cls}`}>{m.icon} {m.label}</span>;
}

function PriorityChip({ priority }: { priority: WorkPriority }) {
  const m = PRIORITY_META[priority];
  return <span className={`dev-prio ${m.cls}`}>{m.label}</span>;
}

function ProgressBar({ value, color }: { value: number; color?: string }) {
  return (
    <div className="dev-progress">
      <div
        className="dev-progress-fill"
        style={{ width: `${value}%`, background: color ?? (value === 100 ? '#10B981' : 'var(--primary-500)') }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Overview Tab
   ═══════════════════════════════════════════ */

function OverviewTab({ isSA, works }: { isSA: boolean; works: DevWork[] }) {
  const statusCounts = useMemo(() => {
    const m = new Map<WorkStatus, number>();
    works.forEach(w => m.set(w.status, (m.get(w.status) ?? 0) + 1));
    return Array.from(m.entries()).map(([status, count]) => ({ status, count, name: STATUS_META[status].label }));
  }, [works]);

  const categorySpend = useMemo(() => {
    const m = new Map<WorkCategory, number>();
    works.forEach(w => m.set(w.category, (m.get(w.category) ?? 0) + (w.approvedAmount ?? w.estimatedCost)));
    return Array.from(m.entries())
      .map(([category, value]) => ({ category, value: Math.round(value / 100000) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [works]);

  const upcomingMilestones = useMemo(() => {
    const items: { project: string; milestone: string; date: string; status: string; school: string }[] = [];
    works.forEach(w => w.milestones.forEach(m => {
      if (m.status === 'in_progress' || m.status === 'pending') {
        items.push({ project: w.title, milestone: m.name, date: m.expectedDate, status: m.status, school: w.schoolCode });
      }
    }));
    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);
  }, [works]);

  const recentActivity = useMemo(() => {
    return [...works]
      .sort((a, b) => new Date(b.proposalDate).getTime() - new Date(a.proposalDate).getTime())
      .slice(0, 5);
  }, [works]);

  return (
    <div className="dev-overview">
      <div className="dev-grid-2">
        {/* Status distribution */}
        <div className="dev-card">
          <div className="dev-card-header">
            <h3 className="dev-card-title"><PieChartLikeIcon /> Project Status Distribution</h3>
            <span className="dev-card-sub">{works.length} total projects</span>
          </div>
          <div className="dev-pie-wrap">
            <div className="dev-pie">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusCounts} dataKey="count" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {statusCounts.map(s => <Cell key={s.status} fill={STATUS_PIE_COLORS[s.status]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 10, fontSize: 12, boxShadow: 'var(--shadow-lg)' }}
                    formatter={(v: unknown, _n, p) => [`${v} projects`, (p as { payload: { name: string } }).payload.name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="dev-pie-legend">
              {statusCounts.map(s => (
                <div key={s.status} className="dev-pie-legend-item">
                  <span className="dev-pie-dot" style={{ background: STATUS_PIE_COLORS[s.status] }} />
                  <span className="dev-pie-name">{s.name}</span>
                  <span className="dev-pie-val">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category-wise spend */}
        <div className="dev-card">
          <div className="dev-card-header">
            <h3 className="dev-card-title"><Wallet size={18} /> Spend by Category</h3>
            <span className="dev-card-sub">Sanctioned amount (₹ Lakhs)</span>
          </div>
          <div style={{ height: 248 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySpend} layout="vertical" margin={{ left: 10, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={140} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 10, fontSize: 12, boxShadow: 'var(--shadow-lg)' }}
                  formatter={(v: unknown) => [`₹${v}L`, 'Sanctioned']}
                />
                <Bar dataKey="value" fill="var(--primary-500)" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dev-grid-2">
        {/* Upcoming milestones */}
        <div className="dev-card">
          <div className="dev-card-header">
            <h3 className="dev-card-title"><Calendar size={18} /> Upcoming Milestones</h3>
            <span className="dev-card-sub">{upcomingMilestones.length} due soon</span>
          </div>
          {upcomingMilestones.length === 0 ? (
            <div className="dev-empty">No upcoming milestones.</div>
          ) : (
            <div className="dev-milestone-list">
              {upcomingMilestones.map((m, i) => {
                const days = daysUntil(m.date);
                return (
                  <div key={i} className="dev-milestone">
                    <div className={`dev-milestone-dot ${m.status === 'in_progress' ? 'in-progress' : ''}`} />
                    <div className="dev-milestone-body">
                      <div className="dev-milestone-name">{m.milestone}</div>
                      <div className="dev-milestone-meta">
                        {isSA && <><MapPin size={10} /> {m.school} • </>}{m.project}
                      </div>
                    </div>
                    <div className={`dev-milestone-days ${days < 7 ? 'urgent' : ''}`}>
                      {days < 0 ? `${Math.abs(days)}d late` : days === 0 ? 'Today' : `${days}d`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="dev-card">
          <div className="dev-card-header">
            <h3 className="dev-card-title"><Activity size={18} /> Recent Activity</h3>
            <span className="dev-card-sub">Latest proposals & updates</span>
          </div>
          <div className="dev-activity-list">
            {recentActivity.map(w => (
              <div key={w.id} className="dev-activity">
                <div className="dev-activity-icon">{CATEGORY_ICON[w.category]}</div>
                <div className="dev-activity-body">
                  <div className="dev-activity-title">{w.title}</div>
                  <div className="dev-activity-meta">
                    {isSA && <><MapPin size={10} /> {w.schoolCode} • </>}
                    {fmtDate(w.proposalDate)} • {fmtINR(w.estimatedCost)}
                  </div>
                </div>
                <StatusBadge status={w.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PieChartLikeIcon() {
  return <span style={{ width: 18, height: 18, display: 'inline-block', borderRadius: '50%', background: 'conic-gradient(var(--primary-500) 0 35%, var(--accent-500) 35% 60%, var(--info) 60% 80%, var(--warning) 80% 100%)', boxShadow: '0 0 0 2px var(--bg-card)' }} />;
}

/* ═══════════════════════════════════════════
   Projects Tab
   ═══════════════════════════════════════════ */

function ProjectsTab({ isSA, works }: { isSA: boolean; works: DevWork[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<WorkCategory | 'all'>('all');

  const categories = useMemo(() => Array.from(new Set(works.map(w => w.category))), [works]);

  const filtered = useMemo(() => {
    return works.filter(w => {
      if (statusFilter !== 'all' && w.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && w.category !== categoryFilter) return false;
      if (search && !`${w.title} ${w.projectCode} ${w.schoolName}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [works, search, statusFilter, categoryFilter]);

  const allStatusChips: { key: WorkStatus | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: works.length },
    { key: 'in_progress', label: 'In Progress', count: works.filter(w => w.status === 'in_progress').length },
    { key: 'approved', label: 'Sanctioned', count: works.filter(w => w.status === 'approved').length },
    { key: 'tendered', label: 'In Tender', count: works.filter(w => w.status === 'tendered').length },
    { key: 'completed', label: 'Completed', count: works.filter(w => w.status === 'completed').length },
    { key: 'on_hold', label: 'On Hold', count: works.filter(w => w.status === 'on_hold').length },
  ];
  const statusChips = allStatusChips.filter(c => c.key === 'all' || c.count > 0);

  return (
    <div className="dev-projects">
      {/* Toolbar */}
      <div className="dev-toolbar">
        <div className="dev-search">
          <Search size={15} />
          <input
            type="text"
            placeholder={isSA ? 'Search projects, schools or codes…' : 'Search projects…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="dev-toolbar-right">
          <div className="dev-select-wrap">
            <Filter size={14} />
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as WorkCategory | 'all')}>
              <option value="all">All categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Status chip row */}
      <div className="dev-chip-row">
        {statusChips.map(c => (
          <button
            key={c.key}
            className={`dev-chip ${statusFilter === c.key ? 'active' : ''}`}
            onClick={() => setStatusFilter(c.key)}
          >
            {c.label}
            <span className="dev-chip-count">{c.count}</span>
          </button>
        ))}
      </div>

      {/* Project Grid */}
      {filtered.length === 0 ? (
        <div className="dev-empty dev-empty--lg">
          <Hammer size={32} />
          <p>No projects match your filters.</p>
        </div>
      ) : (
        <div className="dev-grid">
          {filtered.map(w => <ProjectCard key={w.id} w={w} isSA={isSA} />)}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ w, isSA }: { w: DevWork; isSA: boolean }) {
  const showProgress = ['in_progress', 'inspection', 'completed', 'work_order', 'on_hold'].includes(w.status);

  return (
    <div className="dev-proj-card">
      <div className={`dev-proj-stripe ${PRIORITY_META[w.priority].cls.replace('dev-prio--', 'dev-stripe--')}`} />

      <div className="dev-proj-head">
        <div className="dev-proj-cat">
          <span className="dev-cat-icon">{CATEGORY_ICON[w.category]}</span>
          <span className="dev-cat-text">{w.category}</span>
        </div>
        <StatusBadge status={w.status} />
      </div>

      <h3 className="dev-proj-title">{w.title}</h3>
      <div className="dev-proj-code">{w.projectCode}</div>

      {isSA && (
        <div className="dev-proj-school">
          <MapPin size={11} /> {w.schoolName} <span className="dev-dot-sep">•</span> {w.district}
        </div>
      )}

      <div className="dev-proj-grid">
        <div className="dev-proj-cell">
          <div className="dev-cell-label">Estimated</div>
          <div className="dev-cell-value">{fmtINR(w.estimatedCost)}</div>
        </div>
        <div className="dev-proj-cell">
          <div className="dev-cell-label">Sanctioned</div>
          <div className="dev-cell-value dev-cell-value--primary">{w.approvedAmount ? fmtINR(w.approvedAmount) : '—'}</div>
        </div>
        <div className="dev-proj-cell">
          <div className="dev-cell-label">Funding</div>
          <div className="dev-cell-value dev-cell-value--small">{w.fundingSource}</div>
        </div>
        <div className="dev-proj-cell">
          <div className="dev-cell-label">{w.actualCompletion ? 'Completed' : 'Target'}</div>
          <div className="dev-cell-value dev-cell-value--small">{fmtDateShort(w.actualCompletion ?? w.expectedCompletion ?? w.proposalDate)}</div>
        </div>
      </div>

      {showProgress && (
        <div className="dev-proj-progress">
          <div className="dev-proj-progress-head">
            <span>Execution</span>
            <span className="dev-proj-progress-pct">{w.progress}%</span>
          </div>
          <ProgressBar value={w.progress} />
        </div>
      )}

      {w.contractor && (
        <div className="dev-proj-contractor">
          <User size={11} /> {w.contractor}
          {w.workOrderNo && <span className="dev-wo">{w.workOrderNo}</span>}
        </div>
      )}

      <div className="dev-proj-footer">
        <PriorityChip priority={w.priority} />
        <button className="dev-link-btn">Details <ChevronRight size={13} /></button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Proposals Inbox Tab (SA only)
   ═══════════════════════════════════════════ */

function ProposalsTab() {
  const proposals = useMemo(
    () => devWorks.filter(w => w.status === 'proposed' || w.status === 'under_review')
      .sort((a, b) => {
        const order: Record<WorkPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority] || new Date(a.proposalDate).getTime() - new Date(b.proposalDate).getTime();
      }),
    []
  );

  if (proposals.length === 0) {
    return <div className="dev-empty dev-empty--lg"><Inbox size={32} /><p>No pending proposals.</p></div>;
  }

  return (
    <div className="dev-proposals">
      <div className="dev-proposals-banner">
        <div>
          <h3>Sanctioning Authority — Inbox</h3>
          <p>{proposals.length} proposal(s) awaiting your review. Review BOQ, fund availability and priority before sanctioning.</p>
        </div>
      </div>

      <div className="dev-grid">
        {proposals.map(p => (
          <div key={p.id} className="dev-proposal-card">
            <div className={`dev-proj-stripe ${PRIORITY_META[p.priority].cls.replace('dev-prio--', 'dev-stripe--')}`} />

            <div className="dev-proj-head">
              <div className="dev-proj-cat">
                <span className="dev-cat-icon">{CATEGORY_ICON[p.category]}</span>
                <span className="dev-cat-text">{p.category}</span>
              </div>
              <PriorityChip priority={p.priority} />
            </div>

            <h3 className="dev-proj-title">{p.title}</h3>
            <div className="dev-proposal-school">
              <MapPin size={11} /> {p.schoolName} • {p.district}
            </div>

            <p className="dev-proposal-desc">{p.description}</p>

            <div className="dev-proposal-meta">
              <div className="dev-proposal-meta-row">
                <span className="dev-cell-label"><User size={11} /> Proposed by</span>
                <span className="dev-cell-value dev-cell-value--small">{p.proposedBy}</span>
              </div>
              <div className="dev-proposal-meta-row">
                <span className="dev-cell-label"><Calendar size={11} /> Submitted</span>
                <span className="dev-cell-value dev-cell-value--small">{fmtDate(p.proposalDate)}</span>
              </div>
              <div className="dev-proposal-meta-row">
                <span className="dev-cell-label"><IndianRupee size={11} /> Estimated cost</span>
                <span className="dev-cell-value dev-cell-value--primary dev-cell-value--lg">{fmtINR(p.estimatedCost)}</span>
              </div>
              <div className="dev-proposal-meta-row">
                <span className="dev-cell-label"><Wallet size={11} /> Funding source</span>
                <span className="dev-cell-value dev-cell-value--small">{p.fundingSource}</span>
              </div>
            </div>

            <div className="dev-proposal-actions">
              <button className="dev-btn dev-btn--ghost">View BOQ</button>
              <button className="dev-btn dev-btn--reject">Reject</button>
              <button className="dev-btn dev-btn--primary">Sanction</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Submit Proposal Tab (Principal only)
   ═══════════════════════════════════════════ */

function SubmitProposalTab({ works }: { works: DevWork[] }) {
  const [formOpen, setFormOpen] = useState(true);
  const myProposals = works.filter(w => ['proposed', 'under_review', 'rejected', 'approved'].includes(w.status))
    .sort((a, b) => new Date(b.proposalDate).getTime() - new Date(a.proposalDate).getTime());

  return (
    <div className="dev-submit">
      {/* Form */}
      <div className="dev-card">
        <div className="dev-card-header">
          <h3 className="dev-card-title"><PlusCircle size={18} /> Submit New Development Proposal</h3>
          <button className="dev-link-btn" onClick={() => setFormOpen(o => !o)}>
            {formOpen ? 'Collapse' : 'Expand'} <ChevronRight size={13} style={{ transform: formOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 200ms' }} />
          </button>
        </div>

        {formOpen && (
          <form className="dev-form" onSubmit={e => e.preventDefault()}>
            <div className="dev-form-grid">
              <div className="dev-field dev-field--full">
                <label>Project Title <span className="dev-req">*</span></label>
                <input type="text" placeholder="e.g. Construction of Smart Classroom Block — Phase 2" />
              </div>

              <div className="dev-field">
                <label>Category <span className="dev-req">*</span></label>
                <select defaultValue="">
                  <option value="" disabled>Select category…</option>
                  {(Object.keys(CATEGORY_ICON) as WorkCategory[]).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="dev-field">
                <label>Priority <span className="dev-req">*</span></label>
                <select defaultValue="medium">
                  <option value="urgent">Urgent — work cannot wait</option>
                  <option value="high">High — within this quarter</option>
                  <option value="medium">Medium — within this FY</option>
                  <option value="low">Low — next FY acceptable</option>
                </select>
              </div>

              <div className="dev-field">
                <label>Estimated Cost (₹) <span className="dev-req">*</span></label>
                <input type="number" placeholder="e.g. 1850000" />
              </div>

              <div className="dev-field">
                <label>Preferred Funding Source <span className="dev-req">*</span></label>
                <select defaultValue="Samagra Shiksha">
                  <option>Samagra Shiksha</option>
                  <option>School Development Fund</option>
                  <option>PM SHRI Schools</option>
                  <option>State Govt Grant</option>
                  <option>CSR Initiative</option>
                  <option>NABARD</option>
                  <option>14th FC Grant</option>
                </select>
              </div>

              <div className="dev-field">
                <label>Expected Completion</label>
                <input type="date" />
              </div>

              <div className="dev-field">
                <label>BOQ / Estimate Document</label>
                <div className="dev-upload">
                  <FileText size={14} /> <span>Click or drop PDF / XLSX</span>
                </div>
              </div>

              <div className="dev-field dev-field--full">
                <label>Project Description & Justification <span className="dev-req">*</span></label>
                <textarea rows={4} placeholder="Describe the scope, current condition, beneficiaries (students/staff), expected outcome, and why this is needed." />
              </div>

              <div className="dev-field dev-field--full">
                <label>Site Photos</label>
                <div className="dev-upload">
                  <Camera size={14} /> <span>Upload up to 5 photos (JPG / PNG)</span>
                </div>
              </div>
            </div>

            <div className="dev-form-actions">
              <button type="button" className="dev-btn dev-btn--ghost">Save as Draft</button>
              <button type="submit" className="dev-btn dev-btn--primary"><PlusCircle size={14} /> Submit to Sangathan HQ</button>
            </div>
          </form>
        )}
      </div>

      {/* My recent proposals */}
      <div className="dev-card" style={{ marginTop: 'var(--space-5)' }}>
        <div className="dev-card-header">
          <h3 className="dev-card-title"><Inbox size={18} /> My Recent Proposals</h3>
          <span className="dev-card-sub">Track sanction status of your submissions</span>
        </div>

        {myProposals.length === 0 ? (
          <div className="dev-empty">No proposals submitted yet.</div>
        ) : (
          <div className="dev-table-wrap">
            <table className="dev-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Submitted</th>
                  <th>Estimate</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {myProposals.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="dev-table-title">{p.title}</div>
                      <div className="dev-table-sub">{p.projectCode}</div>
                    </td>
                    <td>
                      <span className="dev-table-cat">{CATEGORY_ICON[p.category]} {p.category}</span>
                    </td>
                    <td>{fmtDateShort(p.proposalDate)}</td>
                    <td className="dev-table-amt">{fmtINR(p.estimatedCost)}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td><button className="dev-link-btn">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Tenders & Vendors Tab (SA only)
   ═══════════════════════════════════════════ */

function TendersTab() {
  const [view, setView] = useState<'tenders' | 'vendors'>('tenders');

  return (
    <div className="dev-tenders">
      <div className="dev-subtab-row">
        <button className={`dev-subtab ${view === 'tenders' ? 'active' : ''}`} onClick={() => setView('tenders')}>
          <FileText size={14} /> Active Tenders
          <span className="dev-subtab-count">{tenders.filter(t => t.status !== 'cancelled').length}</span>
        </button>
        <button className={`dev-subtab ${view === 'vendors' ? 'active' : ''}`} onClick={() => setView('vendors')}>
          <User size={14} /> Empanelled Vendors
          <span className="dev-subtab-count">{contractors.length}</span>
        </button>
      </div>

      {view === 'tenders' ? <TenderList /> : <VendorList />}
    </div>
  );
}

function TenderList() {
  const ordered = [...tenders].sort((a, b) => {
    const order = { bidding_open: 0, evaluation: 1, published: 2, awarded: 3, cancelled: 4 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="dev-grid">
      {ordered.map(t => <TenderCard key={t.id} t={t} />)}
    </div>
  );
}

function TenderCard({ t }: { t: Tender }) {
  const days = daysUntil(t.bidDeadline);
  const isLive = t.status === 'bidding_open' || t.status === 'published';

  const statusMeta: Record<Tender['status'], { label: string; cls: string }> = {
    published:    { label: 'Published',     cls: 'dev-tender-status--published' },
    bidding_open: { label: 'Bidding Open',  cls: 'dev-tender-status--open' },
    evaluation:   { label: 'In Evaluation', cls: 'dev-tender-status--eval' },
    awarded:      { label: 'Awarded',       cls: 'dev-tender-status--awarded' },
    cancelled:    { label: 'Cancelled',     cls: 'dev-tender-status--cancelled' },
  };

  return (
    <div className="dev-tender-card">
      <div className="dev-tender-head">
        <div>
          <div className="dev-tender-no">{t.tenderNo}</div>
          <h3 className="dev-tender-title">{t.projectTitle}</h3>
        </div>
        <span className={`dev-tender-status ${statusMeta[t.status].cls}`}>{statusMeta[t.status].label}</span>
      </div>

      <div className="dev-tender-school"><MapPin size={11} /> {t.schoolName}</div>

      <div className="dev-tender-grid">
        <div><div className="dev-cell-label">Estimated Value</div><div className="dev-cell-value dev-cell-value--primary">{fmtINR(t.estimatedValue)}</div></div>
        <div><div className="dev-cell-label">EMD</div><div className="dev-cell-value">{fmtINR(t.emdAmount)}</div></div>
        <div><div className="dev-cell-label">Type</div><div className="dev-cell-value dev-cell-value--small">{t.type === 'open' ? 'Open Tender' : t.type === 'limited' ? 'Limited' : 'Single Source'}</div></div>
        <div><div className="dev-cell-label">Bids Received</div><div className="dev-cell-value">{t.bidsReceived}</div></div>
      </div>

      {isLive && (
        <div className={`dev-tender-countdown ${days < 7 ? 'urgent' : ''}`}>
          <Clock size={12} />
          {days < 0 ? `Closed ${Math.abs(days)} days ago` : days === 0 ? 'Closes today' : `${days} day(s) to bid deadline (${fmtDateShort(t.bidDeadline)})`}
        </div>
      )}

      {t.status === 'awarded' && t.awardedTo && (
        <div className="dev-tender-awarded">
          <CheckCircle2 size={12} /> Awarded to <strong>{t.awardedTo}</strong> — {fmtINR(t.awardedAmount ?? 0)}
        </div>
      )}

      <div className="dev-tender-footer">
        <button className="dev-btn dev-btn--ghost">View Bid Document</button>
        {t.status === 'evaluation' && <button className="dev-btn dev-btn--primary">Open Bids</button>}
        {t.status === 'bidding_open' && <button className="dev-btn dev-btn--primary">Manage</button>}
      </div>
    </div>
  );
}

function VendorList() {
  return (
    <div className="dev-grid">
      {contractors.map(c => <VendorCard key={c.id} c={c} />)}
    </div>
  );
}

function VendorCard({ c }: { c: Contractor }) {
  const stars = Math.round(c.rating);
  return (
    <div className="dev-vendor-card">
      <div className="dev-vendor-head">
        <div className="dev-vendor-avatar">{c.name.split(' ').map(s => s[0]).slice(0, 2).join('')}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="dev-vendor-name">{c.name}</h3>
          <div className="dev-vendor-reg">{c.registrationNo}</div>
        </div>
        <span className={`dev-vendor-status dev-vendor-status--${c.status}`}>{c.status}</span>
      </div>

      <div className="dev-vendor-rating">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} fill={i < stars ? '#F59E0B' : 'none'} stroke={i < stars ? '#F59E0B' : 'var(--text-tertiary)'} />
        ))}
        <span className="dev-vendor-rating-num">{c.rating.toFixed(1)}</span>
      </div>

      <div className="dev-vendor-tags">
        {c.categories.map(cat => <span key={cat} className="dev-vendor-tag">{CATEGORY_ICON[cat]} {cat}</span>)}
      </div>

      <div className="dev-vendor-stats">
        <div><div className="dev-cell-label">Active</div><div className="dev-cell-value">{c.activeProjects}</div></div>
        <div><div className="dev-cell-label">Completed</div><div className="dev-cell-value">{c.completedProjects}</div></div>
        <div><div className="dev-cell-label">Total Value</div><div className="dev-cell-value dev-cell-value--small">{fmtINR(c.totalValueExecuted)}</div></div>
      </div>

      <div className="dev-vendor-foot">
        <span><MapPin size={11} /> {c.city}</span>
        <span>Valid till {fmtDateShort(c.empanelmentValidUntil)}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Inspections Tab
   ═══════════════════════════════════════════ */

function InspectionsTab({ isSA, data }: { isSA: boolean; data: Inspection[] }) {
  const overdue = data.filter(i => i.status === 'overdue').sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  const upcoming = data.filter(i => i.status === 'scheduled').sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  const completed = data.filter(i => i.status === 'completed').sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());

  if (data.length === 0) return <div className="dev-empty dev-empty--lg"><ClipboardCheck size={32} /><p>No inspections scheduled.</p></div>;

  return (
    <div className="dev-inspections">
      {overdue.length > 0 && (
        <div className="dev-card dev-card--alert">
          <div className="dev-card-header">
            <h3 className="dev-card-title"><AlertTriangle size={18} color="var(--danger)" /> Overdue Inspections</h3>
            <span className="dev-card-sub">{overdue.length} requiring immediate action</span>
          </div>
          <div className="dev-insp-list">
            {overdue.map(i => <InspectionRow key={i.id} i={i} isSA={isSA} variant="overdue" />)}
          </div>
        </div>
      )}

      <div className="dev-card">
        <div className="dev-card-header">
          <h3 className="dev-card-title"><Calendar size={18} /> Upcoming Inspections</h3>
          <span className="dev-card-sub">{upcoming.length} scheduled</span>
        </div>
        {upcoming.length === 0 ? (
          <div className="dev-empty">No upcoming inspections.</div>
        ) : (
          <div className="dev-insp-list">
            {upcoming.map(i => <InspectionRow key={i.id} i={i} isSA={isSA} variant="upcoming" />)}
          </div>
        )}
      </div>

      <div className="dev-card">
        <div className="dev-card-header">
          <h3 className="dev-card-title"><CheckCircle2 size={18} /> Recent Inspection Reports</h3>
          <span className="dev-card-sub">{completed.length} completed</span>
        </div>
        {completed.length === 0 ? (
          <div className="dev-empty">No completed inspections yet.</div>
        ) : (
          <div className="dev-insp-list">
            {completed.map(i => <InspectionRow key={i.id} i={i} isSA={isSA} variant="completed" />)}
          </div>
        )}
      </div>
    </div>
  );
}

function InspectionRow({ i, isSA, variant }: { i: Inspection; isSA: boolean; variant: 'overdue' | 'upcoming' | 'completed' }) {
  const typeMeta: Record<Inspection['inspectionType'], { label: string }> = {
    pre_work:      { label: 'Pre-Work' },
    mid_term:      { label: 'Mid-Term' },
    final:         { label: 'Final' },
    quality_check: { label: 'Quality Check' },
    audit:         { label: 'Audit' },
  };

  return (
    <div className={`dev-insp-row dev-insp-row--${variant}`}>
      <div className="dev-insp-date">
        <div className="dev-insp-day">{new Date(i.scheduledDate).getDate()}</div>
        <div className="dev-insp-mon">{new Date(i.scheduledDate).toLocaleDateString('en-IN', { month: 'short' })}</div>
      </div>

      <div className="dev-insp-body">
        <div className="dev-insp-row-head">
          <h4 className="dev-insp-title">{i.projectTitle}</h4>
          <span className="dev-insp-type">{typeMeta[i.inspectionType].label}</span>
        </div>
        <div className="dev-insp-meta">
          {isSA && <><MapPin size={11} /> {i.schoolName} <span className="dev-dot-sep">•</span></>}
          <User size={11} /> {i.inspector} <span className="dev-dot-sep">•</span> {i.inspectorRole}
        </div>
        {i.remarks && <p className="dev-insp-remarks">"{i.remarks}"</p>}
      </div>

      <div className="dev-insp-right">
        {variant === 'completed' && i.rating && (
          <div className="dev-insp-rating">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} size={11} fill={idx < i.rating! ? '#F59E0B' : 'none'} stroke={idx < i.rating! ? '#F59E0B' : 'var(--text-tertiary)'} />
            ))}
          </div>
        )}
        {variant === 'overdue' && (
          <span className="dev-insp-overdue-tag">{Math.abs(daysUntil(i.scheduledDate))}d overdue</span>
        )}
        {variant === 'upcoming' && (
          <span className="dev-insp-upcoming-tag">in {daysUntil(i.scheduledDate)}d</span>
        )}
        <button className="dev-link-btn">{variant === 'completed' ? 'Report' : 'Details'} <ChevronRight size={11} /></button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Budget Tab (SA only)
   ═══════════════════════════════════════════ */

function BudgetTab() {
  const totalAlloc = budgetAllocations.reduce((s, b) => s + b.fyAllocation, 0);
  const totalSanc  = budgetAllocations.reduce((s, b) => s + b.sanctioned, 0);
  const totalUtil  = budgetAllocations.reduce((s, b) => s + b.utilized, 0);

  const chartData = budgetAllocations.map(b => ({
    name: b.schoolCode.replace('AVS-', ''),
    allocated: Math.round(b.fyAllocation / 100000),
    sanctioned: Math.round(b.sanctioned / 100000),
    utilized: Math.round(b.utilized / 100000),
  }));

  return (
    <div className="dev-budget">
      {/* Top KPIs */}
      <div className="dev-budget-tops">
        <div className="dev-budget-top">
          <div className="dev-budget-top-label">Total FY Allocation</div>
          <div className="dev-budget-top-val">{fmtINR(totalAlloc)}</div>
          <div className="dev-budget-top-sub">{budgetAllocations.length} schools • FY 2025-26</div>
        </div>
        <div className="dev-budget-top">
          <div className="dev-budget-top-label">Sanctioned</div>
          <div className="dev-budget-top-val">{fmtINR(totalSanc)}</div>
          <div className="dev-budget-top-sub">{Math.round((totalSanc / totalAlloc) * 100)}% of allocation</div>
        </div>
        <div className="dev-budget-top">
          <div className="dev-budget-top-label">Actually Utilised</div>
          <div className="dev-budget-top-val">{fmtINR(totalUtil)}</div>
          <div className="dev-budget-top-sub">{Math.round((totalUtil / totalSanc) * 100) || 0}% of sanctioned</div>
        </div>
        <div className="dev-budget-top">
          <div className="dev-budget-top-label">Unused Headroom</div>
          <div className="dev-budget-top-val">{fmtINR(totalAlloc - totalSanc)}</div>
          <div className="dev-budget-top-sub">Available for sanction</div>
        </div>
      </div>

      {/* Chart */}
      <div className="dev-card">
        <div className="dev-card-header">
          <h3 className="dev-card-title"><TrendingUp size={18} /> School-wise Budget vs Utilisation</h3>
          <span className="dev-card-sub">All values in ₹ Lakhs</span>
        </div>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}L`} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 10, fontSize: 12, boxShadow: 'var(--shadow-lg)' }} formatter={(v: unknown) => [`₹${v}L`, '']} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="allocated" name="Allocated" fill="#A7F3D0" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="sanctioned" name="Sanctioned" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="utilized" name="Utilised" fill="#059669" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="dev-card">
        <div className="dev-card-header">
          <h3 className="dev-card-title"><Wallet size={18} /> Budget Allocation Detail</h3>
          <button className="dev-btn dev-btn--ghost">Export CSV</button>
        </div>
        <div className="dev-table-wrap">
          <table className="dev-table">
            <thead>
              <tr>
                <th>School</th>
                <th>District</th>
                <th>Allocation</th>
                <th>Sanctioned</th>
                <th>Utilised</th>
                <th>Utilisation</th>
                <th>Pending</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {budgetAllocations.map(b => {
                const sancPct = b.fyAllocation > 0 ? (b.sanctioned / b.fyAllocation) * 100 : 0;
                const utilPct = b.sanctioned > 0 ? (b.utilized / b.sanctioned) * 100 : 0;
                return (
                  <tr key={b.schoolCode}>
                    <td>
                      <div className="dev-table-title">{b.schoolName}</div>
                      <div className="dev-table-sub">{b.schoolCode}</div>
                    </td>
                    <td>{b.district}</td>
                    <td className="dev-table-amt">{fmtINR(b.fyAllocation)}</td>
                    <td className="dev-table-amt">{fmtINR(b.sanctioned)}</td>
                    <td className="dev-table-amt">{fmtINR(b.utilized)}</td>
                    <td>
                      <div className="dev-budget-bar">
                        <div className="dev-budget-bar-track">
                          <div className="dev-budget-bar-util" style={{ width: `${utilPct}%` }} />
                          <div className="dev-budget-bar-sanc" style={{ width: `${Math.max(0, sancPct - utilPct)}%` }} />
                        </div>
                        <span className="dev-budget-bar-pct">{Math.round(sancPct)}%</span>
                      </div>
                    </td>
                    <td>{b.pendingProposals > 0 ? <span className="dev-pending-pill">{b.pendingProposals}</span> : '—'}</td>
                    <td>{b.activeProjects}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Documents Tab (Principal only)
   ═══════════════════════════════════════════ */

function DocumentsTab({ data }: { data: DocumentRecord[] }) {
  const [filter, setFilter] = useState<DocumentRecord['type'] | 'all'>('all');

  const filtered = filter === 'all' ? data : data.filter(d => d.type === filter);

  const typeMeta: Record<DocumentRecord['type'], { label: string; icon: ReactNode; cls: string }> = {
    utilization_certificate: { label: 'Utilisation Certificate', icon: <FileCheck size={20} />, cls: 'dev-doc-icon--uc' },
    completion_certificate:  { label: 'Completion Certificate',  icon: <CheckCircle2 size={20} />, cls: 'dev-doc-icon--cc' },
    work_order:              { label: 'Work Order',              icon: <FileText size={20} />, cls: 'dev-doc-icon--wo' },
    site_photo:              { label: 'Site Photos',              icon: <Camera size={20} />, cls: 'dev-doc-icon--photo' },
    inspection_report:       { label: 'Inspection Report',        icon: <ClipboardCheck size={20} />, cls: 'dev-doc-icon--insp' },
    invoice:                 { label: 'Invoice',                  icon: <Receipt size={20} />, cls: 'dev-doc-icon--inv' },
    boq:                     { label: 'Bill of Quantities',       icon: <FileText size={20} />, cls: 'dev-doc-icon--boq' },
  };

  const filters: { key: DocumentRecord['type'] | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: data.length },
    ...(Object.keys(typeMeta) as DocumentRecord['type'][]).map(k => ({
      key: k, label: typeMeta[k].label, count: data.filter(d => d.type === k).length,
    })).filter(f => f.count > 0),
  ];

  return (
    <div className="dev-documents">
      <div className="dev-chip-row">
        {filters.map(f => (
          <button key={f.key} className={`dev-chip ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
            <span className="dev-chip-count">{f.count}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="dev-empty dev-empty--lg"><FolderOpen size={32} /><p>No documents in this category yet.</p></div>
      ) : (
        <div className="dev-doc-grid">
          {filtered.map(d => {
            const meta = typeMeta[d.type];
            return (
              <div key={d.id} className="dev-doc-card">
                <div className={`dev-doc-icon ${meta.cls}`}>{meta.icon}</div>
                <div className="dev-doc-body">
                  <div className="dev-doc-type">{meta.label}</div>
                  <div className="dev-doc-name">{d.filename}</div>
                  <div className="dev-doc-project">{d.projectTitle}</div>
                  <div className="dev-doc-meta">
                    {fmtDateShort(d.uploadedDate)} • {d.uploadedBy} • {(d.sizeKb / 1024).toFixed(1)} MB
                  </div>
                </div>
                <button className="dev-doc-download" title="Download"><Download size={15} /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
