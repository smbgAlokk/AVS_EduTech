import { useState } from 'react';
import {
  Inbox, Activity, Wallet, Plus, CheckCircle2, XCircle, Clock,
  MapPin, User, IndianRupee, Tag, AlertCircle
} from 'lucide-react';
import { sdfRequests, sdfAllocations, type SdfRequest } from '../../data/sdf';
import './SdfFundManagement.css';

type TabKey = 'inbox' | 'projects' | 'allocations';
type Role = 'super-admin' | 'principal';

interface Props { role: Role; }

export default function SdfFundManagement({ role }: Props) {
  const isSA = role === 'super-admin';
  const [activeTab, setActiveTab] = useState<TabKey>('inbox');

  const pendingRequests = sdfRequests.filter(r => r.status === 'pending' || r.status === 'under_review');
  const activeProjects = sdfRequests.filter(r => r.status === 'approved' || r.status === 'completed');

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: number; saOnly?: boolean }[] = [
    { key: 'inbox', label: isSA ? 'Requests Inbox' : 'My Requests', icon: <Inbox size={16} />, badge: isSA ? pendingRequests.length : undefined },
    { key: 'projects', label: 'Active Projects', icon: <Activity size={16} /> },
    { key: 'allocations', label: 'Budget Allocations', icon: <Wallet size={16} />, saOnly: true },
  ];

  return (
    <div className="sdf">
      <div className="page-header" style={{ marginBottom: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">SDF Fund Management</h1>
          <p className="page-subtitle">{isSA ? 'Review branch requests and manage capital allocations' : 'Request and track School Development Funds'}</p>
        </div>
        {!isSA && (
          <button className="sdf-btn sdf-btn--approve" style={{ width: 'auto' }}><Plus size={16} /> New Request</button>
        )}
      </div>

      <div className="sdf-tabs">
        {tabs.filter(t => isSA || !t.saOnly).map(t => (
          <button key={t.key} className={`sdf-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.icon} {t.label}
            {t.badge && t.badge > 0 && <span className="sdf-tab-badge">{t.badge}</span>}
          </button>
        ))}
      </div>

      <div className="sdf-content">
        {activeTab === 'inbox' && <RequestsTab isSA={isSA} data={pendingRequests} />}
        {activeTab === 'projects' && <ProjectsTab isSA={isSA} data={activeProjects} />}
        {activeTab === 'allocations' && isSA && <AllocationsTab />}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: SdfRequest['status'] }) {
  const map: Record<SdfRequest['status'], { label: string; icon: React.ReactNode; cls: string }> = {
    pending: { label: 'Pending', icon: <Clock size={12} />, cls: 'sdf-status--pending' },
    under_review: { label: 'Under Review', icon: <AlertCircle size={12} />, cls: 'sdf-status--under_review' },
    approved: { label: 'Approved', icon: <CheckCircle2 size={12} />, cls: 'sdf-status--approved' },
    rejected: { label: 'Rejected', icon: <XCircle size={12} />, cls: 'sdf-status--rejected' },
    completed: { label: 'Completed', icon: <CheckCircle2 size={12} />, cls: 'sdf-status--completed' },
  };
  const s = map[status];
  return <span className={`sdf-status ${s.cls}`}>{s.icon} {s.label}</span>;
}

function RequestsTab({ isSA, data }: { isSA: boolean; data: SdfRequest[] }) {
  // Principal only sees their own mock school (DEL) for demo
  const displayData = isSA ? data : data.filter(d => d.schoolCode === 'DEL');

  if (displayData.length === 0) return <div className="empty-state">No pending requests found.</div>;

  return (
    <div className="sdf-grid">
      {displayData.map(req => (
        <div key={req.id} className="sdf-card">
          <div className={`sdf-urgency sdf-urgency--${req.urgency}`} />
          <div className="sdf-req-header">
            <div>
              <h3 className="sdf-req-title">{req.title}</h3>
              <div className="sdf-req-meta">
                <span className="sdf-req-school"><MapPin size={10} /> {req.schoolCode}</span>
                <span>• {new Date(req.dateRequested).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
            <StatusBadge status={req.status} />
          </div>

          <div className="sdf-req-body">
            <div className="sdf-req-row">
              <span className="sdf-req-label"><Tag size={14} /> Category</span>
              <span className="sdf-req-value">{req.category}</span>
            </div>
            <div className="sdf-req-row">
              <span className="sdf-req-label"><User size={14} /> Principal</span>
              <span className="sdf-req-value">{req.principal}</span>
            </div>
            <div className="sdf-req-row" style={{ marginTop: '8px' }}>
              <span className="sdf-req-label"><IndianRupee size={14} /> Amount Requested</span>
              <span className="sdf-req-amt">₹{(req.requestedAmount / 100000).toFixed(2)}L</span>
            </div>
          </div>

          {isSA ? (
            <div className="sdf-req-footer">
              <button className="sdf-btn sdf-btn--reject">Reject</button>
              <button className="sdf-btn sdf-btn--approve">Review & Approve</button>
            </div>
          ) : (
            <div className="sdf-req-footer">
              <button className="sdf-btn sdf-btn--outline">Withdraw Request</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProjectsTab({ isSA, data }: { isSA: boolean; data: SdfRequest[] }) {
  const displayData = isSA ? data : data.filter(d => d.schoolCode === 'DEL');

  return (
    <div className="sdf-grid">
      {displayData.map(req => (
        <div key={req.id} className="sdf-card">
          <div className="sdf-req-header">
            <div>
              <h3 className="sdf-req-title">{req.title}</h3>
              <div className="sdf-req-meta">
                <span className="sdf-req-school"><MapPin size={10} /> {req.schoolCode}</span>
                <span>• Approved: ₹{(req.approvedAmount! / 100000).toFixed(2)}L</span>
              </div>
            </div>
            <StatusBadge status={req.status} />
          </div>
          
          <div className="sdf-progress-wrap">
            <div className="sdf-progress-header">
              <span>Execution Progress</span>
              <span>{req.progress}%</span>
            </div>
            <div className="sdf-progress-track">
              <div className="sdf-progress-fill" style={{ width: `${req.progress}%`, background: req.progress === 100 ? '#10B981' : 'var(--primary-500)' }} />
            </div>
          </div>

          <div className="sdf-req-footer" style={{ marginTop: 'var(--space-4)' }}>
            <button className="sdf-btn sdf-btn--outline">View Milestones</button>
            {isSA && req.progress! < 100 && <button className="sdf-btn sdf-btn--approve">Disburse Next Tranche</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

function AllocationsTab() {
  const totalAllocated = sdfAllocations.reduce((s, a) => s + a.allocated, 0);
  const totalUtilized = sdfAllocations.reduce((s, a) => s + a.utilized, 0);

  return (
    <div>
      <div className="sdf-grid" style={{ marginBottom: 'var(--space-5)', gridTemplateColumns: '1fr 1fr' }}>
        <div className="sdf-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={24} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>₹{(totalAllocated / 100000).toFixed(1)}L</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total Network Budget FY 25-26</div>
          </div>
        </div>
        <div className="sdf-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'rgba(59,130,246,0.1)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>₹{(totalUtilized / 100000).toFixed(1)}L</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Funds Utilized (Approved)</div>
          </div>
        </div>
      </div>

      <table className="sdf-table">
        <thead>
          <tr>
            <th>School Code</th>
            <th>School Name</th>
            <th>Allocated Budget</th>
            <th>Utilization Bar</th>
            <th>Utilized</th>
            <th>Pending Requests</th>
          </tr>
        </thead>
        <tbody>
          {sdfAllocations.map(a => {
            const utilizedPct = (a.utilized / a.allocated) * 100;
            const pendingPct = (a.pending / a.allocated) * 100;
            return (
              <tr key={a.code}>
                <td style={{ fontWeight: 600, color: 'var(--primary-600)' }}>{a.code}</td>
                <td style={{ fontWeight: 600 }}>{a.school}</td>
                <td>₹{(a.allocated / 100000).toFixed(1)}L</td>
                <td>
                  <div className="sdf-alloc-bar">
                    <div className="sdf-alloc-track">
                      <div className="sdf-alloc-used" style={{ width: `${utilizedPct}%` }} title={`Utilized: ₹${a.utilized}`} />
                      <div className="sdf-alloc-pending" style={{ width: `${pendingPct}%` }} title={`Pending Approval: ₹${a.pending}`} />
                    </div>
                    <span className="sdf-alloc-pct">{Math.round(utilizedPct)}%</span>
                  </div>
                </td>
                <td>₹{(a.utilized / 100000).toFixed(1)}L</td>
                <td style={{ color: a.pending > 0 ? 'var(--warning)' : 'var(--text-secondary)' }}>
                  {a.pending > 0 ? `₹${(a.pending / 100000).toFixed(1)}L` : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
