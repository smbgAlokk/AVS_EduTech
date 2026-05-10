import { useState, useMemo, useCallback, type ReactNode } from 'react';
import {
  Settings, GraduationCap, Bell, Clock, AlertTriangle, Building2, CalendarOff,
  Lock, Sparkles, RotateCcw, CheckCircle2, X, PlusCircle, Edit3, Trash2,
  Search, Calendar as CalendarIcon, Save,
} from 'lucide-react';
import {
  initialPolicies, POLICY_CATEGORIES,
  type Policy, type PolicyCategory, type PolicyType,
} from '../../data/policies';
import { holidays as initialHolidays, type Holiday } from '../../data/attendance';
import './PoliciesPanel.css';

const CATEGORY_ICON: Record<string, ReactNode> = {
  GraduationCap: <GraduationCap size={15} />,
  Bell: <Bell size={15} />,
  Clock: <Clock size={15} />,
  AlertTriangle: <AlertTriangle size={15} />,
  Building2: <Building2 size={15} />,
  CalendarOff: <CalendarOff size={15} />,
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PANEL
   ═══════════════════════════════════════════════════════════════════════════ */

export default function PoliciesPanel() {
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [activeCat, setActiveCat] = useState<PolicyCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const filtered = useMemo(() => {
    return policies.filter(p => {
      if (activeCat !== 'all' && p.category !== activeCat) return false;
      if (search && !`${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [policies, activeCat, search]);

  const grouped = useMemo(() => {
    const m = new Map<PolicyCategory, Policy[]>();
    filtered.forEach(p => m.set(p.category, [...(m.get(p.category) ?? []), p]));
    return Array.from(m.entries());
  }, [filtered]);

  const customCount = policies.filter(p => isCustomized(p)).length;
  const mandatoryCount = policies.filter(p => p.governance === 'mandatory').length;

  const handleChange = useCallback((id: string, value: Policy['value']) => {
    setPolicies(prev => prev.map(p => p.id === id ? {
      ...p, value,
      lastChangedBy: 'You',
      lastChangedOn: '2026-05-11',
    } : p));
    const p = policies.find(x => x.id === id);
    if (p) flashToast(`Updated: ${p.name}`);
  }, [policies, flashToast]);

  const handleReset = useCallback((id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? {
      ...p, value: p.defaultValue, lastChangedBy: undefined, lastChangedOn: undefined,
    } : p));
    const p = policies.find(x => x.id === id);
    if (p) flashToast(`Reset to default: ${p.name}`);
  }, [policies, flashToast]);

  const handleResetAll = useCallback(() => {
    setPolicies(prev => prev.map(p => ({ ...p, value: p.defaultValue, lastChangedBy: undefined, lastChangedOn: undefined })));
    flashToast(`All policies reset to defaults`);
  }, [flashToast]);

  const handleSaveHoliday = useCallback((h: Holiday, isEdit: boolean) => {
    if (isEdit) {
      setHolidays(prev => prev.map(x => x.date === h.date ? h : x));
      flashToast(`Updated: ${h.name}`);
    } else {
      setHolidays(prev => [...prev, h].sort((a, b) => a.date.localeCompare(b.date)));
      flashToast(`Added: ${h.name}`);
    }
    setShowHolidayModal(false);
    setEditingHoliday(null);
  }, [flashToast]);

  const handleDeleteHoliday = useCallback((h: Holiday) => {
    setHolidays(prev => prev.filter(x => x.date !== h.date));
    flashToast(`Removed: ${h.name}`);
  }, [flashToast]);

  return (
    <div className="pol">
      {/* Top header strip */}
      <div className="pol-head">
        <div className="pol-head-left">
          <div className="pol-head-icon"><Settings size={20} /></div>
          <div>
            <h2 className="pol-head-title">Attendance Policy & Calendar</h2>
            <p className="pol-head-sub">Network-wide rules. Changes take effect immediately across all schools.</p>
          </div>
        </div>
        <div className="pol-head-pills">
          <span className="pol-head-pill"><span className="pol-head-pill-num">{policies.length}</span> Total</span>
          <span className="pol-head-pill pol-head-pill--mandatory"><Lock size={11} /> <span className="pol-head-pill-num">{mandatoryCount}</span> Mandatory</span>
          <span className="pol-head-pill pol-head-pill--custom"><Sparkles size={11} /> <span className="pol-head-pill-num">{customCount}</span> Customized</span>
        </div>
      </div>

      {/* Two-pane layout: policies (left) + holidays (right) */}
      <div className="pol-grid">
        {/* ──── LEFT: POLICIES ──── */}
        <div className="pol-left">
          {/* Toolbar */}
          <div className="pol-toolbar">
            <div className="pol-search">
              <Search size={14} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search policies…" />
            </div>
            {customCount > 0 && (
              <button className="pol-btn pol-btn--ghost" onClick={handleResetAll}>
                <RotateCcw size={12} /> Reset all
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="pol-cats">
            <button
              className={`pol-cat ${activeCat === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCat('all')}
            >
              All <span className="pol-cat-count">{policies.length}</span>
            </button>
            {POLICY_CATEGORIES.map(c => {
              const count = policies.filter(p => p.category === c.key).length;
              return (
                <button
                  key={c.key}
                  className={`pol-cat ${activeCat === c.key ? 'active' : ''}`}
                  onClick={() => setActiveCat(c.key)}
                  title={c.description}
                >
                  {CATEGORY_ICON[c.iconKey]} {c.label}
                  <span className="pol-cat-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Sections */}
          {grouped.length === 0 ? (
            <div className="pol-empty"><Search size={28} /><p>No policies match your search.</p></div>
          ) : (
            grouped.map(([cat, items]) => {
              const catMeta = POLICY_CATEGORIES.find(c => c.key === cat)!;
              return (
                <div key={cat} className="pol-section">
                  <div className="pol-section-head">
                    <div className="pol-section-icon">{CATEGORY_ICON[catMeta.iconKey]}</div>
                    <div>
                      <h3 className="pol-section-title">{catMeta.label}</h3>
                      <p className="pol-section-desc">{catMeta.description}</p>
                    </div>
                  </div>
                  <div className="pol-rows">
                    {items.map(p => (
                      <PolicyRow key={p.id} policy={p} onChange={handleChange} onReset={handleReset} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ──── RIGHT: HOLIDAYS ──── */}
        <div className="pol-right">
          <HolidayPanel
            holidays={holidays}
            onAdd={() => { setEditingHoliday(null); setShowHolidayModal(true); }}
            onEdit={(h) => { setEditingHoliday(h); setShowHolidayModal(true); }}
            onDelete={handleDeleteHoliday}
          />
        </div>
      </div>

      {/* Holiday modal */}
      {showHolidayModal && (
        <HolidayModal
          existing={editingHoliday}
          onClose={() => { setShowHolidayModal(false); setEditingHoliday(null); }}
          onSave={handleSaveHoliday}
          onDelete={editingHoliday ? () => { handleDeleteHoliday(editingHoliday); setShowHolidayModal(false); setEditingHoliday(null); } : undefined}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="pol-toast" key={toast}>
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}
    </div>
  );
}

function isCustomized(p: Policy): boolean {
  if (Array.isArray(p.value) && Array.isArray(p.defaultValue)) {
    const def = p.defaultValue as string[];
    return p.value.length !== def.length || p.value.some(v => !def.includes(v));
  }
  return p.value !== p.defaultValue;
}

/* ═══════════════════════════════════════════════════════════════════════════
   POLICY ROW
   ═══════════════════════════════════════════════════════════════════════════ */

function PolicyRow({
  policy,
  onChange,
  onReset,
}: {
  policy: Policy;
  onChange: (id: string, value: Policy['value']) => void;
  onReset: (id: string) => void;
}) {
  const customized = isCustomized(policy);

  return (
    <div className={`pol-row ${customized ? 'pol-row--custom' : ''}`}>
      <div className="pol-row-body">
        <div className="pol-row-head">
          <div className="pol-row-name">{policy.name}</div>
          <div className="pol-row-tags">
            {policy.governance === 'mandatory' && (
              <span className="pol-tag pol-tag--mandatory" title="Govt mandate — value can be raised but not lowered.">
                <Lock size={10} /> Govt mandate
              </span>
            )}
            {policy.governance === 'recommended' && (
              <span className="pol-tag pol-tag--recommended">Recommended</span>
            )}
            {customized && (
              <span className="pol-tag pol-tag--custom"><Sparkles size={10} /> Customized</span>
            )}
          </div>
        </div>
        <p className="pol-row-desc">{policy.description}</p>
        {policy.helpText && (
          <p className="pol-row-help"><Lock size={10} /> {policy.helpText}</p>
        )}
        {customized && policy.lastChangedBy && (
          <p className="pol-row-changed">Changed by <strong>{policy.lastChangedBy}</strong> on {policy.lastChangedOn}</p>
        )}
      </div>

      <div className="pol-row-control">
        <PolicyControl policy={policy} onChange={(v) => onChange(policy.id, v)} />
        {customized && (
          <button
            className="pol-reset"
            onClick={() => onReset(policy.id)}
            title="Reset to default"
          >
            <RotateCcw size={11} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   POLICY CONTROL — handles all 6 input types
   ═══════════════════════════════════════════════════════════════════════════ */

function PolicyControl({ policy, onChange }: { policy: Policy; onChange: (value: Policy['value']) => void }) {
  switch (policy.type as PolicyType) {
    case 'toggle':
      return <Toggle checked={policy.value as boolean} onChange={onChange} />;
    case 'percent':
      return <PercentControl policy={policy} onChange={onChange} />;
    case 'number':
      return <NumberControl policy={policy} onChange={onChange} />;
    case 'time':
      return <TimeControl policy={policy} onChange={onChange} />;
    case 'select':
      return <SelectControl policy={policy} onChange={onChange} />;
    case 'multiselect':
      return <MultiSelectControl policy={policy} onChange={onChange} />;
  }
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="pol-toggle" onClick={e => e.stopPropagation()}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="pol-toggle-track"><span className="pol-toggle-thumb" /></span>
      <span className="pol-toggle-label">{checked ? 'Enabled' : 'Disabled'}</span>
    </label>
  );
}

function PercentControl({ policy, onChange }: { policy: Policy; onChange: (v: number) => void }) {
  const v = policy.value as number;
  const min = policy.min ?? 0;
  const max = policy.max ?? 100;
  const isFloor = policy.govtFloor !== undefined && v === policy.govtFloor;

  return (
    <div className="pol-percent">
      <div className="pol-percent-bar-wrap">
        <input
          type="range"
          className="pol-percent-bar"
          min={min}
          max={max}
          step={policy.step ?? 1}
          value={v}
          onChange={e => onChange(Number(e.target.value))}
        />
        <div className="pol-percent-markers">
          <span>{min}%</span>
          <span>{max}%</span>
        </div>
      </div>
      <div className="pol-percent-input-wrap">
        <input
          type="number"
          className="pol-percent-input"
          min={min}
          max={max}
          step={policy.step ?? 1}
          value={v}
          onChange={e => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
          }}
        />
        <span className="pol-percent-suffix">%</span>
      </div>
      {isFloor && policy.governance === 'mandatory' && (
        <span className="pol-floor-hint"><Lock size={10} /> at govt floor</span>
      )}
    </div>
  );
}

function NumberControl({ policy, onChange }: { policy: Policy; onChange: (v: number) => void }) {
  const v = policy.value as number;
  const min = policy.min ?? 0;
  const max = policy.max ?? 999;
  const step = policy.step ?? 1;
  return (
    <div className="pol-num">
      <button
        className="pol-num-step"
        onClick={() => onChange(Math.max(min, v - step))}
        disabled={v <= min}
        aria-label="Decrease"
      >−</button>
      <input
        type="number"
        className="pol-num-input"
        min={min}
        max={max}
        step={step}
        value={v}
        onChange={e => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
      />
      <button
        className="pol-num-step"
        onClick={() => onChange(Math.min(max, v + step))}
        disabled={v >= max}
        aria-label="Increase"
      >+</button>
      {policy.unit && <span className="pol-num-unit">{policy.unit}</span>}
    </div>
  );
}

function TimeControl({ policy, onChange }: { policy: Policy; onChange: (v: string) => void }) {
  return (
    <div className="pol-time">
      <Clock size={13} />
      <input
        type="time"
        className="pol-time-input"
        value={policy.value as string}
        onChange={e => onChange(e.target.value)}
      />
      <span className="pol-time-suffix">IST</span>
    </div>
  );
}

function SelectControl({ policy, onChange }: { policy: Policy; onChange: (v: string) => void }) {
  return (
    <select
      className="pol-select"
      value={policy.value as string}
      onChange={e => onChange(e.target.value)}
    >
      {(policy.options ?? []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function MultiSelectControl({ policy, onChange }: { policy: Policy; onChange: (v: string[]) => void }) {
  const value = policy.value as string[];
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter(x => x !== v));
    else onChange([...value, v]);
  };
  return (
    <div className="pol-multi">
      {(policy.options ?? []).map(o => {
        const active = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            className={`pol-multi-chip ${active ? 'active' : ''}`}
            onClick={() => toggle(o.value)}
          >
            {active && <CheckCircle2 size={11} />} {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOLIDAY PANEL + MODAL
   ═══════════════════════════════════════════════════════════════════════════ */

function HolidayPanel({
  holidays,
  onAdd,
  onEdit,
  onDelete,
}: {
  holidays: Holiday[];
  onAdd: () => void;
  onEdit: (h: Holiday) => void;
  onDelete: (h: Holiday) => void;
}) {
  const [filter, setFilter] = useState<'all' | Holiday['type']>('all');

  const filtered = useMemo(() => {
    const sorted = [...holidays].sort((a, b) => a.date.localeCompare(b.date));
    return filter === 'all' ? sorted : sorted.filter(h => h.type === filter);
  }, [holidays, filter]);

  const upcoming = useMemo(() => {
    const today = new Date('2026-05-11');
    return filtered.filter(h => new Date(h.date) >= today);
  }, [filtered]);

  const past = useMemo(() => {
    const today = new Date('2026-05-11');
    return filtered.filter(h => new Date(h.date) < today);
  }, [filtered]);

  const types: { key: 'all' | Holiday['type']; label: string }[] = [
    { key: 'all',         label: 'All' },
    { key: 'national',    label: 'National' },
    { key: 'state',       label: 'State' },
    { key: 'religious',   label: 'Religious' },
    { key: 'school',      label: 'School' },
    { key: 'examination', label: 'Exam' },
  ];

  return (
    <div className="pol-cal">
      <div className="pol-cal-head">
        <div className="pol-cal-head-left">
          <div className="pol-cal-icon"><CalendarIcon size={18} /></div>
          <div>
            <h3 className="pol-cal-title">Holiday Calendar</h3>
            <p className="pol-cal-sub">AY 2025-26 · {holidays.length} holidays</p>
          </div>
        </div>
        <button className="pol-btn pol-btn--primary" onClick={onAdd}>
          <PlusCircle size={13} /> Add Holiday
        </button>
      </div>

      <div className="pol-cal-filters">
        {types.map(t => (
          <button
            key={t.key}
            className={`pol-cal-filter ${filter === t.key ? 'active' : ''}`}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
            <span className="pol-cal-filter-count">{t.key === 'all' ? holidays.length : holidays.filter(h => h.type === t.key).length}</span>
          </button>
        ))}
      </div>

      {upcoming.length > 0 && (
        <>
          <div className="pol-cal-section-label">Upcoming · {upcoming.length}</div>
          <div className="pol-cal-list">
            {upcoming.map(h => <HolidayRow key={h.date} h={h} onEdit={() => onEdit(h)} onDelete={() => onDelete(h)} isPast={false} />)}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <div className="pol-cal-section-label">Past · {past.length}</div>
          <div className="pol-cal-list">
            {past.slice(0, 8).map(h => <HolidayRow key={h.date} h={h} onEdit={() => onEdit(h)} onDelete={() => onDelete(h)} isPast />)}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <div className="pol-empty"><CalendarOff size={24} /><p>No holidays in this category.</p></div>
      )}
    </div>
  );
}

function HolidayRow({
  h,
  onEdit,
  onDelete,
  isPast,
}: {
  h: Holiday;
  onEdit: () => void;
  onDelete: () => void;
  isPast: boolean;
}) {
  return (
    <div className={`pol-hday-row ${isPast ? 'past' : ''}`}>
      <div className={`pol-hday-tag pol-hday-tag--${h.type}`}>{h.type}</div>
      <div className="pol-hday-body">
        <div className="pol-hday-name">{h.name}</div>
        {h.description && <div className="pol-hday-desc">{h.description}</div>}
      </div>
      <div className="pol-hday-date">
        <div className="pol-hday-day">{new Date(h.date).getDate()}</div>
        <div className="pol-hday-mon">{new Date(h.date).toLocaleDateString('en-IN', { month: 'short' })}</div>
      </div>
      <div className="pol-hday-actions">
        <button className="pol-icon-btn" onClick={onEdit} title="Edit"><Edit3 size={11} /></button>
        <button className="pol-icon-btn pol-icon-btn--danger" onClick={onDelete} title="Delete"><Trash2 size={11} /></button>
      </div>
    </div>
  );
}

/* ─── Holiday Modal ─── */
function HolidayModal({
  existing,
  onClose,
  onSave,
  onDelete,
}: {
  existing: Holiday | null;
  onClose: () => void;
  onSave: (h: Holiday, isEdit: boolean) => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(existing?.name ?? '');
  const [date, setDate] = useState(existing?.date ?? '2026-06-15');
  const [type, setType] = useState<Holiday['type']>(existing?.type ?? 'school');
  const [description, setDescription] = useState(existing?.description ?? '');

  const types: { key: Holiday['type']; label: string; description: string }[] = [
    { key: 'national',    label: 'National',    description: 'India-wide statutory holiday' },
    { key: 'state',       label: 'State',       description: 'Govt of Assam declared holiday' },
    { key: 'religious',   label: 'Religious',   description: 'Religious festival' },
    { key: 'school',      label: 'School',      description: 'School-specific event or break' },
    { key: 'examination', label: 'Examination', description: 'Exam day — no regular classes' },
  ];

  const canSave = name.trim().length > 0 && date.length > 0;

  const handleSubmit = () => {
    if (!canSave) return;
    onSave({ date, name: name.trim(), type, description: description.trim() || undefined }, !!existing);
  };

  return (
    <div className="pol-modal-overlay" onClick={onClose}>
      <div className="pol-modal" onClick={e => e.stopPropagation()} role="dialog">
        <div className="pol-modal-head">
          <div className="pol-modal-head-icon"><CalendarIcon size={18} /></div>
          <div style={{ flex: 1 }}>
            <div className="pol-modal-title">{existing ? 'Edit Holiday' : 'Add Holiday'}</div>
            <div className="pol-modal-sub">{existing ? 'Edit or remove this calendar entry' : 'A new entry on the academic-year calendar'}</div>
          </div>
          <button className="pol-modal-close" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>

        <div className="pol-modal-body">
          <div className="pol-field">
            <label className="pol-field-label">Holiday Name <span className="pol-req">*</span></label>
            <input
              type="text"
              className="pol-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Independence Day"
              autoFocus
            />
          </div>

          <div className="pol-field-grid">
            <div className="pol-field">
              <label className="pol-field-label">Date <span className="pol-req">*</span></label>
              <input
                type="date"
                className="pol-input"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className="pol-field">
              <label className="pol-field-label">Day</label>
              <div className="pol-input pol-input--readonly">
                {date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'long' }) : '—'}
              </div>
            </div>
          </div>

          <div className="pol-field">
            <label className="pol-field-label">Category <span className="pol-req">*</span></label>
            <div className="pol-modal-types">
              {types.map(t => (
                <button
                  key={t.key}
                  type="button"
                  className={`pol-modal-type pol-modal-type--${t.key} ${type === t.key ? 'active' : ''}`}
                  onClick={() => setType(t.key)}
                >
                  <div className="pol-modal-type-name">{t.label}</div>
                  <div className="pol-modal-type-desc">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pol-field">
            <label className="pol-field-label">Description (optional)</label>
            <textarea
              className="pol-textarea"
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add a note for parents/students (e.g. 79th Independence Day — special programme)"
            />
          </div>
        </div>

        <div className="pol-modal-foot">
          {onDelete && (
            <button className="pol-btn pol-btn--danger" onClick={onDelete}>
              <Trash2 size={13} /> Delete
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button className="pol-btn pol-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="pol-btn pol-btn--primary" onClick={handleSubmit} disabled={!canSave}>
            <Save size={13} /> {existing ? 'Save Changes' : 'Add Holiday'}
          </button>
        </div>
      </div>
    </div>
  );
}
