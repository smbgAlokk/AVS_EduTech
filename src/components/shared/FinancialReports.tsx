import { useState } from 'react';
import {
  TrendingUp, TrendingDown, CreditCard, AlertTriangle, ArrowUpRight,
  IndianRupee, PieChart as PieIcon, FileText, School, Receipt, Send, Plus, Edit, Building2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  revenueMonthly, schoolWiseCollection, expenseCategories,
  feeDefaulters, recentTransactions, feeStructureTemplates, type FeeTemplate
} from '../../data/finance';
import './FinancialReports.css';

type TabKey = 'overview' | 'collection' | 'expenses' | 'defaulters' | 'transactions' | 'fee-structure';
type Role = 'super-admin' | 'principal';

interface Props { role: Role; }

const collColor = (pct: number) => pct >= 90 ? 'fin-coll-fill--green' : pct >= 75 ? 'fin-coll-fill--amber' : 'fin-coll-fill--red';

export default function FinancialReports({ role }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const isSA = role === 'super-admin';

  const totalCollected = revenueMonthly.reduce((s, m) => s + m.collected, 0);
  const totalTarget = revenueMonthly.reduce((s, m) => s + m.target, 0);
  const totalExpenses = revenueMonthly.reduce((s, m) => s + m.expenses, 0);
  const netSurplus = totalCollected - totalExpenses;
  const pendingAmount = totalTarget - totalCollected;


  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: number; saOnly?: boolean }[] = [
    { key: 'overview', label: 'Overview', icon: <TrendingUp size={16} /> },
    { key: 'collection', label: isSA ? 'School-wise Collection' : 'Fee Collection', icon: <School size={16} />, saOnly: false },
    { key: 'expenses', label: 'Expenses', icon: <PieIcon size={16} /> },
    { key: 'defaulters', label: 'Defaulters', icon: <AlertTriangle size={16} />, badge: feeDefaulters.length },
    { key: 'transactions', label: 'Transactions', icon: <Receipt size={16} /> },
    { key: 'fee-structure', label: 'Fee Structure', icon: <FileText size={16} /> },
  ];

  return (
    <div className="fin">
      <div className="page-header" style={{ marginBottom: 'var(--space-5)' }}>
        <h1 className="page-title">Financial Reports</h1>
        <p className="page-subtitle">{isSA ? 'Network-wide financial overview across all branches' : 'School financial overview and fee management'}</p>
      </div>

      {/* KPIs */}
      <div className="fin-kpi-row">
        <div className="fin-kpi">
          <div className="fin-kpi-icon fin-kpi-icon--green"><IndianRupee size={24} /></div>
          <div>
            <div className="fin-kpi-value">₹{totalCollected.toFixed(1)}L</div>
            <div className="fin-kpi-label">Total Collected</div>
            <div className="fin-kpi-trend fin-kpi-trend--up"><ArrowUpRight size={12} /> 8.2% vs last year</div>
          </div>
        </div>
        <div className="fin-kpi">
          <div className="fin-kpi-icon fin-kpi-icon--red"><CreditCard size={24} /></div>
          <div>
            <div className="fin-kpi-value">₹{pendingAmount.toFixed(1)}L</div>
            <div className="fin-kpi-label">Pending Fees</div>
            <div className="fin-kpi-trend fin-kpi-trend--down"><TrendingDown size={12} /> Needs attention</div>
          </div>
        </div>
        <div className="fin-kpi">
          <div className="fin-kpi-icon fin-kpi-icon--blue"><Receipt size={24} /></div>
          <div>
            <div className="fin-kpi-value">₹{totalExpenses.toFixed(1)}L</div>
            <div className="fin-kpi-label">Total Expenses</div>
            <div className="fin-kpi-trend fin-kpi-trend--up"><ArrowUpRight size={12} /> 4.1% vs last year</div>
          </div>
        </div>
        <div className="fin-kpi">
          <div className="fin-kpi-icon fin-kpi-icon--green"><TrendingUp size={24} /></div>
          <div>
            <div className="fin-kpi-value">₹{netSurplus.toFixed(1)}L</div>
            <div className="fin-kpi-label">Net Surplus</div>
            <div className="fin-kpi-trend fin-kpi-trend--up"><ArrowUpRight size={12} /> Healthy</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="fin-tabs">
        {tabs.map(t => (
          <button key={t.key} className={`fin-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.icon} {t.label}
            {t.badge && <span className="fin-tab-badge">{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="fin-content" key={activeTab}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'collection' && <CollectionTab isSA={isSA} />}
        {activeTab === 'expenses' && <ExpensesTab />}
        {activeTab === 'defaulters' && <DefaultersTab />}
        {activeTab === 'transactions' && <TransactionsTab isSA={isSA} />}
        {activeTab === 'fee-structure' && <FeeStructureTab isSA={isSA} />}
      </div>
    </div>
  );
}

/* ═══ Overview Tab ═══ */
function OverviewTab() {
  return (
    <>
      <div className="fin-card">
        <div className="fin-card-header">
          <h3 className="fin-card-title"><TrendingUp size={18} /> Revenue vs Expenses Trend</h3>
          <span className="fin-card-sub">Monthly (₹ Lakhs) — AY 2025-26</span>
        </div>
        <div className="fin-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueMonthly} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="finGradCol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="finGradExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}L`} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '10px', fontSize: '13px', boxShadow: 'var(--shadow-lg)' }} formatter={(v: unknown) => [`₹${v}L`, '']} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              <Area type="monotone" dataKey="collected" name="Collected" stroke="#10B981" strokeWidth={2.5} fill="url(#finGradCol)" dot={{ r: 3, fill: '#10B981', stroke: 'white', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="target" name="Target" stroke="var(--grey-400)" strokeWidth={1.5} strokeDasharray="5 5" fill="none" dot={false} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={2} fill="url(#finGradExp)" dot={{ r: 3, fill: '#EF4444', stroke: 'white', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="fin-two-col">
        <div className="fin-card">
          <div className="fin-card-header">
            <h3 className="fin-card-title"><PieIcon size={18} /> Expense Breakdown</h3>
          </div>
          <div className="fin-chart--sm">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={2} dataKey="percent">
                  {expenseCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '10px' }} formatter={(v: unknown) => [`${v}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="fin-card">
          <div className="fin-card-header">
            <h3 className="fin-card-title"><AlertTriangle size={18} /> Top Defaulters</h3>
            <span className="fin-card-sub">{feeDefaulters.length} students</span>
          </div>
          {feeDefaulters.slice(0, 4).map(d => (
            <div key={d.id} className="fin-defaulter">
              <div className="fin-defaulter-info">
                <div className="fin-defaulter-name">{d.name}</div>
                <div className="fin-defaulter-meta">{d.school} • {d.class}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="fin-defaulter-amount">₹{(d.pending / 1000).toFixed(0)}K</div>
                <div className="fin-defaulter-months">{d.months} months</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══ Collection Tab ═══ */
function CollectionTab({ isSA }: { isSA: boolean }) {
  const data = isSA ? schoolWiseCollection : schoolWiseCollection.slice(0, 1);
  return (
    <>
      <div className="fin-card">
        <div className="fin-card-header">
          <h3 className="fin-card-title"><School size={18} /> {isSA ? 'School-wise Fee Collection' : 'Fee Collection Status'}</h3>
          <span className="fin-card-sub">AY 2025-26</span>
        </div>
        {isSA && (
          <div className="fin-chart" style={{ marginBottom: 'var(--space-5)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schoolWiseCollection} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="code" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '10px' }} />
                <Bar dataKey="collected" name="Collected %" fill="#10B981" radius={[4, 4, 0, 0]} barSize={28} />
                <Bar dataKey="pending" name="Pending %" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div style={{ overflowX: 'auto' }}>
          <table className="fin-school-table">
            <thead>
              <tr>
                <th>School</th><th>Students</th><th>Collection %</th><th>Pending</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s, i) => (
                <tr key={i}>
                  <td className="fin-school-name">{s.school}</td>
                  <td>{s.students.toLocaleString()}</td>
                  <td>
                    <div className="fin-coll-bar">
                      <div className="fin-coll-track"><div className={`fin-coll-fill ${collColor(s.collected)}`} style={{ width: `${s.collected}%` }} /></div>
                      <span className="fin-coll-pct">{s.collected}%</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{s.pending}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ═══ Expenses Tab ═══ */
function ExpensesTab() {
  const totalExp = expenseCategories.reduce((s, e) => s + e.amount, 0);
  return (
    <div className="fin-two-col">
      <div className="fin-card">
        <div className="fin-card-header">
          <h3 className="fin-card-title"><PieIcon size={18} /> Expense Distribution</h3>
          <span className="fin-card-sub">Total: ₹{totalExp.toFixed(1)}L</span>
        </div>
        <div className="fin-chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2} dataKey="amount">
                {expenseCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '10px' }} formatter={(v: unknown) => [`₹${v}L`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="fin-card">
        <div className="fin-card-header">
          <h3 className="fin-card-title"><FileText size={18} /> Category Breakdown</h3>
        </div>
        <div className="fin-expense-list">
          {expenseCategories.map((e, i) => (
            <div key={i} className="fin-expense-item">
              <div className="fin-expense-dot" style={{ background: e.color }} />
              <span className="fin-expense-name">{e.category}</span>
              <span className="fin-expense-amt">₹{e.amount}L</span>
              <span className="fin-expense-pct">{e.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ Defaulters Tab ═══ */
function DefaultersTab() {
  return (
    <div className="fin-card">
      <div className="fin-card-header">
        <h3 className="fin-card-title"><AlertTriangle size={18} /> Fee Defaulters</h3>
        <span className="fin-card-sub">{feeDefaulters.length} students • ₹{(feeDefaulters.reduce((s, d) => s + d.pending, 0) / 100000).toFixed(1)}L pending</span>
      </div>
      {feeDefaulters.map(d => (
        <div key={d.id} className="fin-defaulter">
          <div className="fin-defaulter-info">
            <div className="fin-defaulter-name">{d.name}</div>
            <div className="fin-defaulter-meta">{d.school} • {d.class} • Parent: {d.parent}</div>
          </div>
          <div style={{ textAlign: 'right', marginRight: 'var(--space-4)' }}>
            <div className="fin-defaulter-amount">₹{d.pending.toLocaleString()}</div>
            <div className="fin-defaulter-months">{d.months} month{d.months > 1 ? 's' : ''} overdue</div>
          </div>
          <button className="fin-defaulter-action"><Send size={12} /> Send Reminder</button>
        </div>
      ))}
    </div>
  );
}

/* ═══ Transactions Tab ═══ */
function TransactionsTab({ isSA }: { isSA: boolean }) {
  return (
    <div className="fin-card">
      <div className="fin-card-header">
        <h3 className="fin-card-title"><Receipt size={18} /> Recent Transactions</h3>
        <span className="fin-card-sub">Last 30 days</span>
      </div>
      <div style={{ overflowX: 'auto', maxHeight: 500, overflowY: 'auto' }}>
        <table className="fin-txn-table">
          <thead>
            <tr>
              <th>Txn ID</th><th>Student</th>{isSA && <th>School</th>}<th>Amount</th><th>Type</th><th>Mode</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map(t => (
              <tr key={t.id}>
                <td className="fin-txn-id">{t.id}</td>
                <td className="fin-txn-name">{t.student}</td>
                {isSA && <td>{t.school}</td>}
                <td className="fin-txn-amount">₹{t.amount.toLocaleString()}</td>
                <td>{t.type}</td>
                <td>{t.mode}</td>
                <td>{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td>
                  <span className={`fin-badge fin-badge--${t.status}`}>
                    <span className="fin-badge-dot" />{t.status}
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

/* ═══ Fee Structure Tab ═══ */
function FeeStructureTab({ isSA }: { isSA: boolean }) {
  const renderTemplate = (t: FeeTemplate) => {
    const totals = t.components.reduce((a, f) => ({ m: a.m + f.monthly, q: a.q + f.quarterly, y: a.y + f.annual }), { m: 0, q: 0, y: 0 });
    return (
      <div key={t.id} className="fin-card">
        <div className="fin-card-header" style={{ marginBottom: 'var(--space-4)' }}>
          <div>
            <h3 className="fin-card-title"><FileText size={18} /> {t.name}</h3>
            <span className="fin-card-sub">{t.description}</span>
          </div>
          {isSA && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="fin-btn-secondary"><Building2 size={14} /> Assign Schools</button>
              <button className="fin-btn-secondary"><Edit size={14} /> Edit</button>
            </div>
          )}
        </div>
        
        {isSA && (
          <div className="fin-schools-assigned">
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>ASSIGNED TO:</span>
            {t.assignedSchools.map(s => <span key={s} className="fin-school-tag">{s}</span>)}
          </div>
        )}

        <table className="fin-fee-table">
          <thead>
            <tr><th>Fee Component</th><th>Monthly</th><th>Quarterly</th><th>Annual</th></tr>
          </thead>
          <tbody>
            {t.components.map((f, i) => (
              <tr key={i}>
                <td>{f.name}</td>
                <td>{f.monthly ? `₹${f.monthly.toLocaleString()}` : '—'}</td>
                <td>{f.quarterly ? `₹${f.quarterly.toLocaleString()}` : '—'}</td>
                <td style={{ fontWeight: 600 }}>₹{f.annual.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>₹{totals.m.toLocaleString()}</td>
              <td>₹{totals.q.toLocaleString()}</td>
              <td>₹{totals.y.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  return (
    <div>
      {isSA && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Fee Structure Management</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Create and assign fee templates across branches.</p>
          </div>
          <button className="fin-btn-primary"><Plus size={16} /> Create Structure</button>
        </div>
      )}

      {!isSA && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Active Fee Structure</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>The current fee structure assigned to your branch by the Head Office.</p>
        </div>
      )}

      {isSA ? feeStructureTemplates.map(renderTemplate) : renderTemplate(feeStructureTemplates[0])}
    </div>
  );
}
