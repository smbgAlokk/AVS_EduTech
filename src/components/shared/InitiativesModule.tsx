import { useState, useMemo, useCallback, type ReactNode } from 'react';
import {
  Lightbulb, Building2, Heart, GraduationCap, BookOpen, Trophy, Megaphone,
  Users, Wrench, Music, Activity, Plus, Search, Filter, Calendar as CalendarIcon,
  IndianRupee, Sparkles, ChevronRight, ChevronLeft, X, CheckCircle2, Clock,
  PauseCircle, AlertOctagon, FileText, Send, Award, Star,
  Hash, Target, Zap, TrendingUp,
} from 'lucide-react';
import {
  initiatives as initialInitiatives, schoolParticipations as initialParticipations,
  NETWORK_SCHOOLS, CATEGORY_META, FUNDING_LABEL, PRIORITY_META,
  STATUS_META, PARTICIPATION_META, summarizeNetwork,
  getInitiativesForStudent,
  type Initiative, type InitiativeCategory, type InitiativeStatus,
  type InitiativePriority, type InitiativeFundingSource, type ParticipationStatus,
  type SchoolParticipation,
} from '../../data/initiatives';
import { DEMO_SCHOOL_CODE, DEMO_SCHOOL_NAME } from '../../data/attendance';
import './InitiativesModule.css';

type Role = 'super-admin' | 'principal' | 'teacher' | 'student' | 'parent';
interface Props { role: Role; }

const CAT_ICON: Record<string, ReactNode> = {
  Building2:     <Building2 size={14} />,
  Heart:         <Heart size={14} />,
  GraduationCap: <GraduationCap size={14} />,
  BookOpen:      <BookOpen size={14} />,
  Trophy:        <Trophy size={14} />,
  Megaphone:     <Megaphone size={14} />,
  Users:         <Users size={14} />,
  Wrench:        <Wrench size={14} />,
  Music:         <Music size={14} />,
  Activity:      <Activity size={14} />,
};

const STATUS_ICON: Record<InitiativeStatus, ReactNode> = {
  draft:     <FileText size={11} />,
  scheduled: <Clock size={11} />,
  active:    <Activity size={11} />,
  paused:    <PauseCircle size={11} />,
  completed: <CheckCircle2 size={11} />,
  cancelled: <AlertOctagon size={11} />,
};

const fmtINR = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)} L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
};

const fmtCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

/* ═══════════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ═══════════════════════════════════════════════════════════════════════════ */

function CategoryChip({ category, size = 'md' }: { category: InitiativeCategory; size?: 'sm' | 'md' }) {
  const m = CATEGORY_META[category];
  return (
    <span className={`ini-cat ini-cat--${size}`} style={{ background: `${m.tone}1a`, color: m.tone }}>
      {CAT_ICON[m.iconKey]} {m.label}
    </span>
  );
}

function StatusBadge({ status }: { status: InitiativeStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`ini-status ini-status--${status}`} style={{ color: m.tone }}>
      {STATUS_ICON[status]} {m.label}
    </span>
  );
}

function PriorityFlag({ priority }: { priority: InitiativePriority }) {
  if (priority === 'low') return null;
  const m = PRIORITY_META[priority];
  return (
    <span className={`ini-prio ini-prio--${priority}`}>
      {priority === 'flagship' && <Star size={10} fill="currentColor" />}
      {m.label}
    </span>
  );
}

function ProgressBar({ value, tone }: { value: number; tone?: string }) {
  return (
    <div className="ini-bar-track">
      <div className="ini-bar-fill" style={{ width: `${value}%`, background: tone ?? 'var(--primary-500)' }} />
    </div>
  );
}

function KpiTile({ label, value, hint, icon, tone = 'primary' }: {
  label: string; value: ReactNode; hint?: ReactNode; icon: ReactNode;
  tone?: 'primary' | 'accent' | 'info' | 'warning' | 'success' | 'danger';
}) {
  return (
    <div className="ini-kpi">
      <div className={`ini-kpi-icon ini-kpi-icon--${tone}`}>{icon}</div>
      <div>
        <div className="ini-kpi-value">{value}</div>
        <div className="ini-kpi-label">{label}</div>
        {hint && <div className="ini-kpi-hint">{hint}</div>}
      </div>
    </div>
  );
}

/* Initiative card — consistent across all role views */
function InitiativeCard({
  initiative,
  variant = 'full',
  onClick,
  participation,
  onActSchool,
}: {
  initiative: Initiative;
  variant?: 'full' | 'compact';
  onClick?: () => void;
  participation?: SchoolParticipation;
  onActSchool?: (i: Initiative, p: SchoolParticipation) => void;
}) {
  const cat = CATEGORY_META[initiative.category];
  const i = initiative;

  return (
    <div className="ini-card" onClick={onClick}>
      <div className="ini-card-banner" style={{ background: cat.gradient }}>
        <div className="ini-card-banner-icon">{CAT_ICON[cat.iconKey]}</div>
        <CategoryChip category={i.category} size="sm" />
        <div className="ini-card-banner-flags">
          <PriorityFlag priority={i.priority} />
          <StatusBadge status={i.status} />
        </div>
      </div>

      <div className="ini-card-body">
        <div className="ini-card-code">{i.code}</div>
        <h3 className="ini-card-title">{i.title}</h3>
        <p className="ini-card-desc">{i.description}</p>

        {variant === 'full' && (
          <>
            <div className="ini-card-progress-wrap">
              <div className="ini-card-progress-head">
                <span className="ini-card-progress-label">Progress</span>
                <span className="ini-card-progress-pct" style={{ color: i.progressPercent === 100 ? 'var(--success)' : 'var(--primary-600)' }}>
                  {i.progressPercent}%
                </span>
              </div>
              <ProgressBar value={i.progressPercent} tone={i.progressPercent === 100 ? '#10B981' : cat.tone} />
            </div>

            <div className="ini-card-stats">
              <div className="ini-card-stat">
                <div className="ini-card-stat-num">{i.enrolledSchools}<span className="ini-card-stat-of">/{i.totalSchools}</span></div>
                <div className="ini-card-stat-lbl">Schools</div>
              </div>
              <div className="ini-card-stat">
                <div className="ini-card-stat-num">{fmtCount(i.reachedBeneficiaries)}<span className="ini-card-stat-of">/{fmtCount(i.totalBeneficiaries)}</span></div>
                <div className="ini-card-stat-lbl">Beneficiaries</div>
              </div>
              <div className="ini-card-stat">
                <div className="ini-card-stat-num">{i.budgetAllocated > 0 ? fmtINR(i.budgetUtilized) : '—'}</div>
                <div className="ini-card-stat-lbl">Spent</div>
              </div>
            </div>
          </>
        )}

        {participation && (
          <div className="ini-card-part" style={{ background: PARTICIPATION_META[participation.status].bg, color: PARTICIPATION_META[participation.status].tone }}>
            <strong>Your school:</strong> {PARTICIPATION_META[participation.status].label}
            {participation.contribution > 0 && <> · {participation.contribution}% contribution</>}
            {onActSchool && participation.status !== 'completed' && (
              <button className="ini-card-part-btn" onClick={(e) => { e.stopPropagation(); onActSchool(i, participation); }}>
                Update <ChevronRight size={11} />
              </button>
            )}
          </div>
        )}

        <div className="ini-card-foot">
          <span className="ini-card-foot-item"><CalendarIcon size={11} /> {new Date(i.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          {i.governmentScheme && (
            <span className="ini-card-foot-item ini-card-foot-scheme"><Building2 size={11} /> {i.governmentScheme}</span>
          )}
          {i.hashtags && i.hashtags.length > 0 && (
            <span className="ini-card-foot-item ini-card-foot-tag"><Hash size={10} />{i.hashtags[0].replace('#', '')}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN MODULE
   ═══════════════════════════════════════════════════════════════════════════ */

interface TabDef { key: string; label: string; icon: ReactNode; render: () => ReactNode; badge?: number; }

export default function InitiativesModule({ role }: Props) {
  const isSA = role === 'super-admin';
  const [items, setItems] = useState<Initiative[]>(initialInitiatives);
  const [parts, setParts] = useState<SchoolParticipation[]>(initialParticipations);
  const [showLaunch, setShowLaunch] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  }, []);

  const handleLaunch = useCallback((init: Initiative) => {
    setItems(prev => [init, ...prev]);
    /* Auto-create 'invited' participation for all schools targeted */
    const targets = init.targetingType === 'all_schools' ? NETWORK_SCHOOLS.map(s => s.code) : init.targetSchools;
    const newParts: SchoolParticipation[] = targets.map(code => {
      const s = NETWORK_SCHOOLS.find(x => x.code === code)!;
      return {
        initiativeId: init.id, schoolCode: code, schoolName: s.name,
        status: 'invited', enrolledOn: undefined, contribution: 0,
        beneficiariesLocal: 0, lastUpdate: '2026-05-12',
      };
    });
    setParts(prev => [...newParts, ...prev]);
    setHighlightId(init.id);
    setShowLaunch(false);
    flashToast(`"${init.title}" launched · ${targets.length} schools invited`);
    window.setTimeout(() => setHighlightId(null), 2400);
  }, [flashToast]);

  /* Role-aware tabs */
  const tabs: TabDef[] = useMemo(() => {
    if (isSA) {
      const summary = summarizeNetwork();
      return [
        { key: 'overview',   label: 'Overview',        icon: <TrendingUp size={15} />, render: () => <SAOverview items={items} parts={parts} /> },
        { key: 'all',        label: 'All Initiatives', icon: <Lightbulb size={15} />, render: () => <SAAllInitiatives items={items} highlightId={highlightId} />, badge: summary.activeInitiatives },
        { key: 'matrix',     label: 'Schools Matrix',  icon: <Target size={15} />,    render: () => <SchoolsMatrix items={items} parts={parts} /> },
      ];
    }
    if (role === 'principal') {
      const schoolItems = parts
        .filter(p => p.schoolCode === DEMO_SCHOOL_CODE && p.status !== 'invited')
        .map(p => ({ initiative: items.find(i => i.id === p.initiativeId)!, participation: p }))
        .filter(x => x.initiative);
      return [
        { key: 'active',    label: 'Active Programs', icon: <Activity size={15} />,
          render: () => <PrincipalView pairs={schoolItems.filter(x => x.initiative.status !== 'completed')} flashToast={flashToast} setParts={setParts} />,
          badge: schoolItems.filter(x => x.initiative.status !== 'completed').length },
        { key: 'completed', label: 'Completed',        icon: <CheckCircle2 size={15} />,
          render: () => <PrincipalView pairs={schoolItems.filter(x => x.initiative.status === 'completed')} flashToast={flashToast} setParts={setParts} /> },
      ];
    }
    if (role === 'teacher') {
      return [
        { key: 'class',      label: "My Class' Programs", icon: <GraduationCap size={15} />, render: () => <TeacherView items={items} /> },
      ];
    }
    if (role === 'student') {
      return [
        { key: 'me',         label: 'My Participation',  icon: <Award size={15} />, render: () => <StudentView studentId="st-001" items={items} /> },
      ];
    }
    return [
      { key: 'child',      label: "Child's Programs",    icon: <Award size={15} />, render: () => <StudentView studentId="st-001" items={items} forParent /> },
    ];
  }, [isSA, role, items, parts, highlightId, flashToast]);

  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find(t => t.key === active) ?? tabs[0];

  const headerTitleMap: Record<Role, { title: string; sub: string }> = {
    'super-admin': { title: 'Initiatives — Network Programs', sub: `Cross-school campaigns, govt schemes and Sangathan-led drives` },
    principal:     { title: 'School Initiatives',                sub: `${DEMO_SCHOOL_NAME} — programs your school is enrolled in` },
    teacher:       { title: 'Class Initiatives',                  sub: 'Programs your assigned classes participate in' },
    student:       { title: 'My Initiatives',                     sub: 'Programs you are enrolled in + earned recognition' },
    parent:        { title: "Child's Initiatives",                sub: "Programs your child participates in + certificates" },
  };
  const head = headerTitleMap[role];

  return (
    <div className="ini">
      {/* Page header */}
      <div className="page-header ini-page-head">
        <div>
          <h1 className="page-title">{head.title}</h1>
          <p className="page-subtitle">{head.sub}</p>
        </div>
        {isSA && (
          <button className="ini-btn ini-btn--primary ini-btn--lg" onClick={() => setShowLaunch(true)}>
            <Plus size={16} /> Launch Initiative
          </button>
        )}
      </div>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="ini-tabs" role="tablist">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`ini-tab ${active === t.key ? 'active' : ''}`}
              onClick={() => setActive(t.key)}
              role="tab"
              aria-selected={active === t.key}
            >
              {t.icon} <span>{t.label}</span>
              {t.badge !== undefined && t.badge > 0 && <span className="ini-tab-badge">{t.badge}</span>}
            </button>
          ))}
        </div>
      )}

      <div className="ini-body" key={active}>
        {current.render()}
      </div>

      {/* Launch wizard */}
      {showLaunch && (
        <LaunchInitiativeModal
          existingCount={items.length}
          onClose={() => setShowLaunch(false)}
          onLaunch={handleLaunch}
        />
      )}

      {/* Toast */}
      {toast && <div className="ini-toast" key={toast}><CheckCircle2 size={14} /> {toast}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUPER ADMIN — Overview
   ═══════════════════════════════════════════════════════════════════════════ */

function SAOverview({ items, parts }: { items: Initiative[]; parts: SchoolParticipation[] }) {
  const summary = useMemo(() => {
    const active = items.filter(i => i.status === 'active').length;
    const reached = items.reduce((s, i) => s + i.reachedBeneficiaries, 0);
    const budget = items.reduce((s, i) => s + i.budgetAllocated, 0);
    const utilized = items.reduce((s, i) => s + i.budgetUtilized, 0);
    const flagship = items.filter(i => i.priority === 'flagship');
    const upcoming = items.filter(i => i.status === 'scheduled');
    const recent = [...items].sort((a, b) => new Date(b.launchedOn).getTime() - new Date(a.launchedOn).getTime()).slice(0, 5);

    /* Category breakdown */
    const catCounts = new Map<InitiativeCategory, number>();
    items.forEach(i => catCounts.set(i.category, (catCounts.get(i.category) ?? 0) + 1));
    const topCats = Array.from(catCounts.entries())
      .map(([cat, count]) => ({ cat, count }))
      .sort((a, b) => b.count - a.count);

    return { active, reached, budget, utilized, flagship, upcoming, recent, topCats };
  }, [items]);

  return (
    <>
      <div className="ini-kpi-row">
        <KpiTile label="Active Initiatives"        value={summary.active}                     icon={<Activity size={20} />} tone="primary" hint={`${items.length} total · ${summary.flagship.length} flagship`} />
        <KpiTile label="Beneficiaries Reached"     value={fmtCount(summary.reached)}          icon={<Users size={20} />}    tone="info"    hint="Across all active programs" />
        <KpiTile label="Total Budget Allocated"    value={fmtINR(summary.budget)}             icon={<IndianRupee size={20} />} tone="accent" hint={`${fmtINR(summary.utilized)} utilised`} />
        <KpiTile label="Schools Engaged"            value={`${parts.filter(p => p.status === 'in_progress' || p.status === 'completed').length}`} icon={<Target size={20} />} tone="success" hint={`Across ${NETWORK_SCHOOLS.length} schools`} />
      </div>

      {/* Flagship spotlight */}
      {summary.flagship.length > 0 && (
        <div className="ini-section">
          <div className="ini-section-head">
            <div className="ini-section-title"><Star size={14} fill="currentColor" /> Flagship Initiatives</div>
            <div className="ini-section-sub">{summary.flagship.length} top-priority programs</div>
          </div>
          <div className="ini-flagship-grid">
            {summary.flagship.map(i => <FlagshipCard key={i.id} i={i} />)}
          </div>
        </div>
      )}

      <div className="ini-grid-2">
        {/* Upcoming launches */}
        <div className="ini-card-plain">
          <div className="ini-card-plain-head">
            <h3 className="ini-card-plain-title"><Clock size={15} /> Scheduled — Going Live Soon</h3>
            <span className="ini-card-plain-sub">{summary.upcoming.length} upcoming</span>
          </div>
          {summary.upcoming.length === 0 ? (
            <div className="ini-empty"><Clock size={20} /><p>No scheduled launches.</p></div>
          ) : (
            <div className="ini-list">
              {summary.upcoming.map(i => {
                const days = Math.ceil((new Date(i.startDate).getTime() - new Date('2026-05-12').getTime()) / 86400000);
                return (
                  <div key={i.id} className="ini-list-row">
                    <div className="ini-list-icon" style={{ background: CATEGORY_META[i.category].gradient, color: 'white' }}>
                      {CAT_ICON[CATEGORY_META[i.category].iconKey]}
                    </div>
                    <div className="ini-list-body">
                      <div className="ini-list-title">{i.title}</div>
                      <div className="ini-list-meta">{CATEGORY_META[i.category].label} · {FUNDING_LABEL[i.fundingSource]}</div>
                    </div>
                    <span className="ini-list-tag" style={{ color: days <= 7 ? 'var(--warning)' : 'var(--info)' }}>
                      {days <= 0 ? 'Today' : days === 1 ? 'Tomorrow' : `in ${days}d`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="ini-card-plain">
          <div className="ini-card-plain-head">
            <h3 className="ini-card-plain-title"><Hash size={15} /> By Category</h3>
            <span className="ini-card-plain-sub">{summary.topCats.length} categories</span>
          </div>
          <div className="ini-cat-list">
            {summary.topCats.map(({ cat, count }) => {
              const m = CATEGORY_META[cat];
              const pct = (count / items.length) * 100;
              return (
                <div key={cat} className="ini-cat-row">
                  <span className="ini-cat-row-icon" style={{ background: `${m.tone}1a`, color: m.tone }}>
                    {CAT_ICON[m.iconKey]}
                  </span>
                  <span className="ini-cat-row-name">{m.label}</span>
                  <div className="ini-cat-row-bar">
                    <div className="ini-cat-row-bar-fill" style={{ width: `${pct}%`, background: m.tone }} />
                  </div>
                  <span className="ini-cat-row-num">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="ini-card-plain">
        <div className="ini-card-plain-head">
          <h3 className="ini-card-plain-title"><Sparkles size={15} /> Recent Activity</h3>
        </div>
        <div className="ini-list">
          {summary.recent.map(i => (
            <div key={i.id} className="ini-list-row">
              <div className="ini-list-icon" style={{ background: CATEGORY_META[i.category].gradient, color: 'white' }}>
                {CAT_ICON[CATEGORY_META[i.category].iconKey]}
              </div>
              <div className="ini-list-body">
                <div className="ini-list-title">{i.title}</div>
                <div className="ini-list-meta">Launched {new Date(i.launchedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {i.ownerName}</div>
              </div>
              <StatusBadge status={i.status} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function FlagshipCard({ i }: { i: Initiative }) {
  const cat = CATEGORY_META[i.category];
  return (
    <div className="ini-flagship">
      <div className="ini-flagship-stripe" style={{ background: cat.gradient }} />
      <div className="ini-flagship-head">
        <div className="ini-flagship-icon" style={{ background: cat.gradient }}>{CAT_ICON[cat.iconKey]}</div>
        <div className="ini-flagship-id">
          <div className="ini-flagship-code">{i.code}</div>
          <div className="ini-flagship-title">{i.title}</div>
        </div>
        <PriorityFlag priority={i.priority} />
      </div>
      <div className="ini-flagship-progress">
        <div className="ini-flagship-progress-head">
          <span>Progress</span>
          <span style={{ color: cat.tone, fontWeight: 700 }}>{i.progressPercent}%</span>
        </div>
        <ProgressBar value={i.progressPercent} tone={cat.tone} />
      </div>
      <div className="ini-flagship-kpis">
        {i.kpis.slice(0, 2).map(k => {
          const pct = Math.min(100, Math.round((k.current / Math.max(1, k.target)) * 100));
          return (
            <div key={k.id} className="ini-flagship-kpi">
              <div className="ini-flagship-kpi-num">{fmtCount(k.current)}<span className="ini-flagship-kpi-of"> / {fmtCount(k.target)}</span></div>
              <div className="ini-flagship-kpi-label">{k.label}</div>
              <div className="ini-flagship-kpi-bar">
                <div className="ini-flagship-kpi-fill" style={{ width: `${pct}%`, background: cat.tone }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUPER ADMIN — All Initiatives (filterable grid)
   ═══════════════════════════════════════════════════════════════════════════ */

function SAAllInitiatives({ items, highlightId }: { items: Initiative[]; highlightId: string | null }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InitiativeStatus>('all');
  const [catFilter, setCatFilter] = useState<'all' | InitiativeCategory>('all');

  const filtered = useMemo(() => items.filter(i => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (catFilter !== 'all' && i.category !== catFilter) return false;
    if (search && !`${i.title} ${i.code} ${i.description}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [items, search, statusFilter, catFilter]);

  const statusOptions: { key: 'all' | InitiativeStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'completed', label: 'Completed' },
    { key: 'paused', label: 'Paused' },
  ];

  return (
    <>
      <div className="ini-toolbar">
        <div className="ini-search">
          <Search size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search initiatives, codes, descriptions…" />
        </div>
        <div className="ini-select">
          <Filter size={13} />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value as 'all' | InitiativeCategory)}>
            <option value="all">All categories</option>
            {(Object.keys(CATEGORY_META) as InitiativeCategory[]).map(c => (
              <option key={c} value={c}>{CATEGORY_META[c].label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ini-chip-row">
        {statusOptions.map(s => (
          <button
            key={s.key}
            className={`ini-chip ${statusFilter === s.key ? 'active' : ''}`}
            onClick={() => setStatusFilter(s.key)}
          >
            {s.label}
            <span className="ini-chip-count">{s.key === 'all' ? items.length : items.filter(i => i.status === s.key).length}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="ini-empty ini-empty--lg"><Lightbulb size={32} /><p>No initiatives match these filters.</p></div>
      ) : (
        <div className="ini-card-grid">
          {filtered.map(i => (
            <div key={i.id} className={highlightId === i.id ? 'ini-card-wrap ini-card-wrap--new' : 'ini-card-wrap'}>
              <InitiativeCard initiative={i} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUPER ADMIN — Schools Matrix (heatmap)
   ═══════════════════════════════════════════════════════════════════════════ */

function SchoolsMatrix({ items, parts }: { items: Initiative[]; parts: SchoolParticipation[] }) {
  const visibleItems = items.filter(i => i.status === 'active' || i.status === 'scheduled');
  const cellFor = (initId: string, code: string): ParticipationStatus | null => {
    return parts.find(p => p.initiativeId === initId && p.schoolCode === code)?.status ?? null;
  };

  return (
    <div className="ini-matrix-card">
      <div className="ini-matrix-head">
        <div>
          <h3 className="ini-matrix-title"><Target size={15} /> School × Initiative Participation Matrix</h3>
          <p className="ini-matrix-sub">{NETWORK_SCHOOLS.length} schools × {visibleItems.length} active/scheduled initiatives. Click any cell to drill in.</p>
        </div>
        <div className="ini-matrix-legend">
          {(['completed', 'in_progress', 'opted_in', 'invited', 'opted_out'] as ParticipationStatus[]).map(s => {
            const m = PARTICIPATION_META[s];
            return (
              <span key={s} className="ini-matrix-legend-item">
                <span className="ini-matrix-legend-dot" style={{ background: m.tone }} />
                {m.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="ini-matrix-wrap">
        <table className="ini-matrix">
          <thead>
            <tr>
              <th className="ini-matrix-corner">School</th>
              {visibleItems.map(i => (
                <th key={i.id} className="ini-matrix-th" title={i.title}>
                  <div className="ini-matrix-th-icon" style={{ background: `${CATEGORY_META[i.category].tone}1a`, color: CATEGORY_META[i.category].tone }}>
                    {CAT_ICON[CATEGORY_META[i.category].iconKey]}
                  </div>
                  <div className="ini-matrix-th-code">{i.code.split('/').pop()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NETWORK_SCHOOLS.map(s => {
              const enrolled = visibleItems.filter(i => {
                const c = cellFor(i.id, s.code);
                return c === 'in_progress' || c === 'completed' || c === 'opted_in';
              }).length;
              return (
                <tr key={s.code}>
                  <th className="ini-matrix-row-head">
                    <div className="ini-matrix-row-name">{s.name}</div>
                    <div className="ini-matrix-row-meta">{s.district} · {enrolled}/{visibleItems.length} programs</div>
                  </th>
                  {visibleItems.map(i => {
                    const status = cellFor(i.id, s.code);
                    if (!status) return <td key={i.id} className="ini-matrix-cell ini-matrix-cell--none" />;
                    const m = PARTICIPATION_META[status];
                    const part = parts.find(p => p.initiativeId === i.id && p.schoolCode === s.code);
                    return (
                      <td
                        key={i.id}
                        className={`ini-matrix-cell ini-matrix-cell--${status}`}
                        style={{ background: m.bg, color: m.tone }}
                        title={`${s.name} · ${i.title} — ${m.label}${part?.contribution ? ` (${part.contribution}%)` : ''}`}
                      >
                        {status === 'completed'    && <CheckCircle2 size={13} />}
                        {status === 'in_progress'  && <Activity size={13} />}
                        {status === 'opted_in'     && <Sparkles size={13} />}
                        {status === 'invited'      && <span className="ini-matrix-cell-dot">·</span>}
                        {status === 'opted_out'    && <X size={13} />}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRINCIPAL VIEW
   ═══════════════════════════════════════════════════════════════════════════ */

function PrincipalView({
  pairs,
  flashToast,
  setParts,
}: {
  pairs: { initiative: Initiative; participation: SchoolParticipation }[];
  flashToast: (m: string) => void;
  setParts: React.Dispatch<React.SetStateAction<SchoolParticipation[]>>;
}) {
  const updateContribution = useCallback((initId: string, schoolCode: string, delta: number) => {
    setParts(prev => prev.map(p => {
      if (p.initiativeId !== initId || p.schoolCode !== schoolCode) return p;
      const next = Math.max(0, Math.min(100, p.contribution + delta));
      const status: ParticipationStatus = next === 100 ? 'completed' : next > 0 ? 'in_progress' : p.status;
      return { ...p, contribution: next, status, lastUpdate: '2026-05-12' };
    }));
    flashToast(`Progress updated`);
  }, [setParts, flashToast]);

  if (pairs.length === 0) {
    return <div className="ini-empty ini-empty--lg"><Lightbulb size={32} /><p>No initiatives in this category yet.</p></div>;
  }

  return (
    <>
      <div className="ini-kpi-row">
        <KpiTile label="Programs Enrolled" value={pairs.length} icon={<Activity size={20} />} tone="primary" />
        <KpiTile label="In Progress"        value={pairs.filter(x => x.participation.status === 'in_progress').length} icon={<Clock size={20} />} tone="warning" />
        <KpiTile label="Completed"          value={pairs.filter(x => x.participation.status === 'completed').length} icon={<CheckCircle2 size={20} />} tone="success" />
        <KpiTile label="Total Beneficiaries" value={fmtCount(pairs.reduce((s, x) => s + x.participation.beneficiariesLocal, 0))} icon={<Users size={20} />} tone="info" />
      </div>

      <div className="ini-card-grid">
        {pairs.map(({ initiative, participation }) => (
          <div key={initiative.id} className="ini-card-wrap">
            <InitiativeCard
              initiative={initiative}
              participation={participation}
              onActSchool={(_, p) => {
                updateContribution(p.initiativeId, p.schoolCode, 10);
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEACHER VIEW
   ═══════════════════════════════════════════════════════════════════════════ */

function TeacherView({ items }: { items: Initiative[] }) {
  /* Teacher's classes — relevant initiatives are those targeting their classes or all */
  const teacherClasses = ['9', '10'];
  const relevant = items.filter(i =>
    i.targetingType === 'all_schools' ||
    (i.targetClasses && i.targetClasses.some(c => teacherClasses.includes(c)))
  ).filter(i => i.status === 'active' || i.status === 'scheduled');

  return (
    <>
      <div className="ini-kpi-row">
        <KpiTile label="Active Programs"          value={relevant.filter(i => i.status === 'active').length} icon={<Activity size={20} />} tone="primary" />
        <KpiTile label="Class 10-A involvement"  value="6 of 8" icon={<GraduationCap size={20} />} tone="info" hint="6 programs touch this class" />
        <KpiTile label="My students enrolled"    value="38 / 44" icon={<Users size={20} />} tone="success" hint="Class 10-A enrolment rate" />
        <KpiTile label="Pending action"           value="2" icon={<AlertOctagon size={20} />} tone="warning" hint="Need attendance for 2 events" />
      </div>

      <div className="ini-card-grid">
        {relevant.map(i => <InitiativeCard key={i.id} initiative={i} />)}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STUDENT / PARENT VIEW
   ═══════════════════════════════════════════════════════════════════════════ */

function StudentView({ studentId, forParent }: { studentId: string; items: Initiative[]; forParent?: boolean }) {
  const enrollments = getInitiativesForStudent(studentId);

  const earnedBadges = enrollments.filter(e => e.enrollment.badgeEarned);
  const certificates = enrollments.filter(e => e.enrollment.certificate);
  const active = enrollments.filter(e => e.enrollment.status === 'active' || e.enrollment.status === 'enrolled');
  const completed = enrollments.filter(e => e.enrollment.status === 'completed' || e.enrollment.status === 'awarded');

  return (
    <>
      <div className="ini-kpi-row">
        <KpiTile label="Active Programs"      value={active.length}      icon={<Activity size={20} />}   tone="primary" hint="Currently participating" />
        <KpiTile label="Completed"             value={completed.length}   icon={<CheckCircle2 size={20} />} tone="success" />
        <KpiTile label="Badges Earned"         value={earnedBadges.length} icon={<Award size={20} />}     tone="accent" />
        <KpiTile label="Certificates"          value={certificates.length} icon={<FileText size={20} />}  tone="info" />
      </div>

      {earnedBadges.length > 0 && (
        <div className="ini-section">
          <div className="ini-section-head">
            <div className="ini-section-title"><Award size={14} /> {forParent ? "Child's Recognition" : 'Your Recognition'}</div>
            <div className="ini-section-sub">{earnedBadges.length} earned</div>
          </div>
          <div className="ini-badges-row">
            {earnedBadges.map(({ initiative, enrollment }) => {
              const cat = CATEGORY_META[initiative.category];
              return (
                <div key={initiative.id} className="ini-badge-card">
                  <div className="ini-badge-medal" style={{ background: cat.gradient }}>
                    <Trophy size={20} />
                  </div>
                  <div className="ini-badge-body">
                    <div className="ini-badge-name">{enrollment.badgeEarned}</div>
                    <div className="ini-badge-meta">{initiative.title}</div>
                    {enrollment.certificate && <span className="ini-badge-cert"><FileText size={10} /> Certificate available</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="ini-section">
        <div className="ini-section-head">
          <div className="ini-section-title"><Activity size={14} /> {forParent ? "Currently Participating" : "I'm Participating In"}</div>
        </div>
        {active.length === 0 ? (
          <div className="ini-empty"><Sparkles size={20} /><p>No active programs yet. Talk to your class teacher about ongoing initiatives!</p></div>
        ) : (
          <div className="ini-card-grid">
            {active.map(({ initiative, enrollment }) => (
              <div key={initiative.id} className="ini-student-card">
                <div className="ini-student-card-banner" style={{ background: CATEGORY_META[initiative.category].gradient }}>
                  {CAT_ICON[CATEGORY_META[initiative.category].iconKey]}
                </div>
                <div className="ini-student-card-body">
                  <CategoryChip category={initiative.category} size="sm" />
                  <h4 className="ini-student-card-title">{initiative.title}</h4>
                  <p className="ini-student-card-desc">{initiative.description}</p>
                  <div className="ini-student-card-progress-head">
                    <span>Your progress</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{enrollment.progressPercent}%</span>
                  </div>
                  <ProgressBar value={enrollment.progressPercent} />
                  {enrollment.badgeEarned && (
                    <div className="ini-student-card-earned">
                      <Award size={11} /> {enrollment.badgeEarned}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {completed.length > 0 && (
        <div className="ini-section">
          <div className="ini-section-head">
            <div className="ini-section-title"><CheckCircle2 size={14} /> Completed Programs</div>
          </div>
          <div className="ini-card-grid">
            {completed.map(({ initiative, enrollment }) => (
              <div key={initiative.id} className="ini-student-card ini-student-card--done">
                <div className="ini-student-card-banner" style={{ background: CATEGORY_META[initiative.category].gradient }}>
                  {CAT_ICON[CATEGORY_META[initiative.category].iconKey]}
                </div>
                <div className="ini-student-card-body">
                  <CategoryChip category={initiative.category} size="sm" />
                  <h4 className="ini-student-card-title">{initiative.title}</h4>
                  <div className="ini-student-card-completed">
                    <CheckCircle2 size={13} /> Completed on {new Date(enrollment.enrolledOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  {enrollment.certificate && (
                    <button className="ini-btn ini-btn--ghost ini-btn--sm" style={{ marginTop: 8 }}>
                      <FileText size={12} /> Download Certificate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAUNCH INITIATIVE WIZARD — 2 steps
   ═══════════════════════════════════════════════════════════════════════════ */

function LaunchInitiativeModal({
  existingCount,
  onClose,
  onLaunch,
}: {
  existingCount: number;
  onClose: () => void;
  onLaunch: (i: Initiative) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<InitiativeCategory>('academic');
  const [priority, setPriority] = useState<InitiativePriority>('medium');
  const [fundingSource, setInitiativeFundingSource] = useState<InitiativeFundingSource>('sangathan');
  const [governmentScheme, setGovernmentScheme] = useState('');
  const [budget, setBudget] = useState(500000);
  const [startDate, setStartDate] = useState('2026-05-15');
  const [endDate, setEndDate] = useState('2026-08-15');
  const [targetingType, setTargetingType] = useState<Initiative['targetingType']>('all_schools');
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const [kpis, setKpis] = useState<{ label: string; target: number; unit: string }[]>([
    { label: '', target: 0, unit: '' },
  ]);
  const [notify, setNotify] = useState(true);

  const canProceed1 = title.trim().length > 3 && description.trim().length > 10;
  const canLaunch = canProceed1 && (targetingType !== 'selected_schools' || selectedSchools.size > 0);

  const handleSubmit = () => {
    if (!canLaunch) return;
    const id = `INI-${String(existingCount + 1).padStart(3, '0')}`;
    const code = `AVS/INI/26/${title.toUpperCase().split(/\s+/).slice(0, 2).join('')}`;
    const targets = targetingType === 'all_schools' ? [] : Array.from(selectedSchools);
    const totalSchools = targetingType === 'all_schools' ? NETWORK_SCHOOLS.length : selectedSchools.size;
    const totalBenef = targetingType === 'all_schools'
      ? NETWORK_SCHOOLS.reduce((s, x) => s + x.students, 0)
      : Array.from(selectedSchools).reduce((s, c) => s + (NETWORK_SCHOOLS.find(x => x.code === c)?.students ?? 0), 0);

    const init: Initiative = {
      id, code, title: title.trim(), description: description.trim(),
      category, status: new Date(startDate) > new Date('2026-05-12') ? 'scheduled' : 'active',
      priority, fundingSource, governmentScheme: governmentScheme.trim() || undefined,
      startDate, endDate, launchedOn: '2026-05-12',
      ownerName: 'Rajesh Sharma', ownerRole: 'Sangathan Head Office',
      targetingType, targetSchools: targets,
      budgetAllocated: budget, budgetUtilized: 0,
      totalSchools, enrolledSchools: 0, totalBeneficiaries: totalBenef, reachedBeneficiaries: 0,
      kpis: kpis.filter(k => k.label.trim()).map((k, idx) => ({
        id: `K${idx + 1}`, label: k.label.trim(), target: k.target, current: 0, unit: k.unit.trim() || 'count',
      })),
      progressPercent: 0,
      milestones: [],
      resourceCount: 0,
      bannerKey: category,
    };
    onLaunch(init);
  };

  const toggleSchool = (code: string) => {
    setSelectedSchools(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const addKpi = () => setKpis(prev => prev.length < 4 ? [...prev, { label: '', target: 0, unit: '' }] : prev);
  const removeKpi = (idx: number) => setKpis(prev => prev.filter((_, i) => i !== idx));
  const updateKpi = (idx: number, k: Partial<{ label: string; target: number; unit: string }>) => {
    setKpis(prev => prev.map((x, i) => i === idx ? { ...x, ...k } : x));
  };

  return (
    <div className="ini-modal-overlay" onClick={onClose}>
      <div className="ini-modal" onClick={e => e.stopPropagation()} role="dialog">
        <div className="ini-modal-head">
          <div className="ini-modal-head-icon"><Lightbulb size={20} /></div>
          <div style={{ flex: 1 }}>
            <div className="ini-modal-title">Launch New Initiative</div>
            <div className="ini-modal-sub">Step {step} of 2 — {step === 1 ? 'Basics, targeting & timeline' : 'KPIs and confirmation'}</div>
          </div>
          <button className="ini-modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <div className="ini-stepper">
          <div className={`ini-stepper-step ${step >= 1 ? 'active' : ''}`}>
            <div className="ini-stepper-dot">1</div><span>Basics & Targeting</span>
          </div>
          <div className="ini-stepper-line" />
          <div className={`ini-stepper-step ${step >= 2 ? 'active' : ''}`}>
            <div className="ini-stepper-dot">2</div><span>Goals & Confirm</span>
          </div>
        </div>

        <div className="ini-modal-body">
          {step === 1 && (
            <div className="ini-modal-step">
              <div className="ini-field">
                <label className="ini-field-label">Initiative Title <span className="ini-req">*</span></label>
                <input
                  className="ini-input"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Annual Science Fair Network Series"
                  autoFocus
                />
              </div>

              <div className="ini-field">
                <label className="ini-field-label">Description <span className="ini-req">*</span></label>
                <textarea
                  className="ini-textarea"
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What is the initiative? Who benefits? What's the expected outcome?"
                />
              </div>

              <div className="ini-field">
                <label className="ini-field-label">Category <span className="ini-req">*</span></label>
                <div className="ini-cat-grid">
                  {(Object.keys(CATEGORY_META) as InitiativeCategory[]).map(c => {
                    const m = CATEGORY_META[c];
                    return (
                      <button
                        key={c}
                        type="button"
                        className={`ini-cat-tile ${category === c ? 'active' : ''}`}
                        style={category === c ? { borderColor: m.tone } : undefined}
                        onClick={() => setCategory(c)}
                      >
                        <span className="ini-cat-tile-icon" style={{ background: `${m.tone}1a`, color: m.tone }}>
                          {CAT_ICON[m.iconKey]}
                        </span>
                        <span className="ini-cat-tile-label">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="ini-field-grid">
                <div className="ini-field">
                  <label className="ini-field-label">Priority</label>
                  <div className="ini-prio-row">
                    {(['low', 'medium', 'high', 'flagship'] as InitiativePriority[]).map(p => (
                      <button
                        key={p}
                        type="button"
                        className={`ini-prio-pill ini-prio-pill--${p} ${priority === p ? 'active' : ''}`}
                        onClick={() => setPriority(p)}
                      >
                        {p === 'flagship' && <Star size={11} fill="currentColor" />}
                        {PRIORITY_META[p].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ini-field">
                  <label className="ini-field-label">Funding Source</label>
                  <select className="ini-input" value={fundingSource} onChange={e => setInitiativeFundingSource(e.target.value as InitiativeFundingSource)}>
                    {(Object.keys(FUNDING_LABEL) as InitiativeFundingSource[]).map(f => (
                      <option key={f} value={f}>{FUNDING_LABEL[f]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(fundingSource === 'central_govt' || fundingSource === 'state_govt') && (
                <div className="ini-field">
                  <label className="ini-field-label">Govt Scheme Reference (optional)</label>
                  <input
                    className="ini-input"
                    type="text"
                    value={governmentScheme}
                    onChange={e => setGovernmentScheme(e.target.value)}
                    placeholder="e.g. PM POSHAN, NIPUN Bharat, NISHTHA"
                  />
                </div>
              )}

              <div className="ini-field-grid">
                <div className="ini-field">
                  <label className="ini-field-label">Start date <span className="ini-req">*</span></label>
                  <input className="ini-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="ini-field">
                  <label className="ini-field-label">End date <span className="ini-req">*</span></label>
                  <input className="ini-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} />
                </div>
              </div>

              <div className="ini-field">
                <label className="ini-field-label">Budget (₹ allocated)</label>
                <input className="ini-input" type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} step={50000} min={0} />
                <div className="ini-field-hint">{fmtINR(budget)} earmarked. Leave 0 for no-budget initiatives (assemblies, awareness drives).</div>
              </div>

              <div className="ini-field">
                <label className="ini-field-label">Targeting</label>
                <div className="ini-target-row">
                  {([
                    { key: 'all_schools',     label: 'All schools',  desc: 'Network-wide rollout' },
                    { key: 'selected_schools',label: 'Selected schools', desc: 'Pick specific schools below' },
                    { key: 'class_specific',  label: 'Class specific', desc: 'Targets specific classes' },
                  ] as { key: Initiative['targetingType']; label: string; desc: string }[]).map(t => (
                    <button
                      key={t.key}
                      type="button"
                      className={`ini-target-tile ${targetingType === t.key ? 'active' : ''}`}
                      onClick={() => setTargetingType(t.key)}
                    >
                      <div className="ini-target-tile-name">{t.label}</div>
                      <div className="ini-target-tile-desc">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {targetingType === 'selected_schools' && (
                <div className="ini-field">
                  <label className="ini-field-label">Select schools <span className="ini-req">*</span></label>
                  <div className="ini-school-grid">
                    {NETWORK_SCHOOLS.map(s => (
                      <button
                        key={s.code}
                        type="button"
                        className={`ini-school-tile ${selectedSchools.has(s.code) ? 'active' : ''}`}
                        onClick={() => toggleSchool(s.code)}
                      >
                        {selectedSchools.has(s.code) ? <CheckCircle2 size={12} /> : <span className="ini-school-tile-dot" />}
                        <div>
                          <div className="ini-school-tile-name">{s.name}</div>
                          <div className="ini-school-tile-meta">{s.district} · {s.students} students</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="ini-field-hint">{selectedSchools.size} of {NETWORK_SCHOOLS.length} selected</div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="ini-modal-step">
              <div className="ini-summary">
                <div className="ini-summary-row">
                  <span className="ini-summary-label">Initiative</span>
                  <span className="ini-summary-val">{title}</span>
                </div>
                <div className="ini-summary-row">
                  <span className="ini-summary-label">Category · Priority</span>
                  <span className="ini-summary-val">{CATEGORY_META[category].label} · {PRIORITY_META[priority].label}</span>
                </div>
                <div className="ini-summary-row">
                  <span className="ini-summary-label">Targeting</span>
                  <span className="ini-summary-val">
                    {targetingType === 'all_schools' && `All ${NETWORK_SCHOOLS.length} schools`}
                    {targetingType === 'selected_schools' && `${selectedSchools.size} schools`}
                    {targetingType === 'class_specific' && `Class-specific (configure later)`}
                  </span>
                </div>
                <div className="ini-summary-row">
                  <span className="ini-summary-label">Timeline</span>
                  <span className="ini-summary-val">
                    {new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} →{' '}
                    {new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="ini-summary-row">
                  <span className="ini-summary-label">Budget · Funding</span>
                  <span className="ini-summary-val">{fmtINR(budget)} · {FUNDING_LABEL[fundingSource]}</span>
                </div>
              </div>

              <div className="ini-field">
                <label className="ini-field-label">Track these KPIs</label>
                <div className="ini-field-hint" style={{ marginTop: 0, marginBottom: 8 }}>
                  Up to 4 measurable goals. Schools will report against these.
                </div>
                <div className="ini-kpi-form">
                  {kpis.map((k, idx) => (
                    <div key={idx} className="ini-kpi-form-row">
                      <input
                        className="ini-input ini-kpi-form-label"
                        type="text"
                        placeholder={`KPI ${idx + 1} — e.g. Students enrolled`}
                        value={k.label}
                        onChange={e => updateKpi(idx, { label: e.target.value })}
                      />
                      <input
                        className="ini-input ini-kpi-form-target"
                        type="number"
                        placeholder="Target"
                        value={k.target || ''}
                        onChange={e => updateKpi(idx, { target: Number(e.target.value) })}
                      />
                      <input
                        className="ini-input ini-kpi-form-unit"
                        type="text"
                        placeholder="Unit (e.g. students)"
                        value={k.unit}
                        onChange={e => updateKpi(idx, { unit: e.target.value })}
                      />
                      {kpis.length > 1 && (
                        <button className="ini-icon-btn" onClick={() => removeKpi(idx)} aria-label="Remove KPI"><X size={13} /></button>
                      )}
                    </div>
                  ))}
                  {kpis.length < 4 && (
                    <button className="ini-btn ini-btn--ghost ini-btn--sm" onClick={addKpi}><Plus size={11} /> Add KPI</button>
                  )}
                </div>
              </div>

              <label className="ini-toggle">
                <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} />
                <span className="ini-toggle-track"><span className="ini-toggle-thumb" /></span>
                <span className="ini-toggle-label">Notify all targeted schools immediately on launch</span>
              </label>

              <div className="ini-final">
                <div className="ini-final-head"><Zap size={13} /> <strong>What happens when you launch</strong></div>
                <ul className="ini-final-list">
                  <li>Initiative created with auto-generated code <strong>{`AVS/INI/26/${title.toUpperCase().split(/\s+/).slice(0, 2).join('') || '...'}`}</strong></li>
                  <li>{targetingType === 'all_schools' ? `All ${NETWORK_SCHOOLS.length} schools` : `${selectedSchools.size} selected school(s)`} added to participation matrix</li>
                  {notify && <li>SMS + in-app notification sent to all targeted principals</li>}
                  <li>Sangathan dashboard begins tracking KPI fulfilment from day 1</li>
                  {priority === 'flagship' && <li><Star size={11} /> Tagged FLAGSHIP — appears in network spotlight</li>}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="ini-modal-foot">
          {step === 2 && <button className="ini-btn ini-btn--ghost" onClick={() => setStep(1)}><ChevronLeft size={13} /> Back</button>}
          <div style={{ flex: 1 }} />
          <button className="ini-btn ini-btn--ghost" onClick={onClose}>Cancel</button>
          {step === 1 ? (
            <button className="ini-btn ini-btn--primary" onClick={() => setStep(2)} disabled={!canProceed1 || (targetingType === 'selected_schools' && selectedSchools.size === 0)}>
              Continue <ChevronRight size={13} />
            </button>
          ) : (
            <button className="ini-btn ini-btn--primary" onClick={handleSubmit} disabled={!canLaunch}>
              <Send size={13} /> Launch Initiative
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
