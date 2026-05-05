import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MapPin, Phone, Mail, Calendar, Users, GraduationCap,
  AlertTriangle, ShieldAlert, Video, Activity, Building2,
  BookOpen, CreditCard, Settings, Globe, Microscope, Monitor, Library,
  Bus, LayoutDashboard, Dumbbell, Download, Share2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { getSchoolById } from '../../data/schools';
import { schoolDetailsData } from '../../data/dashboards';
import InspectionModal from '../../components/ui/InspectionModal';
import './SchoolDetails.css';

type TabKey = 'overview' | 'infrastructure' | 'about';

const facilityIcons: Record<string, React.ReactNode> = {
  'Science Labs': <Microscope size={18} />,
  'Computer Labs': <Monitor size={18} />,
  'Library': <Library size={18} />,
  'Sports Ground': <Dumbbell size={18} />,
  'Smart Classrooms': <LayoutDashboard size={18} />,
  'Transport Buses': <Bus size={18} />,
};

export default function SchoolDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const school = useMemo(() => getSchoolById(id || '') || getSchoolById('SCH001')!, [id]);

  if (!school) {
    return <div style={{ padding: 'var(--space-8)', color: 'var(--text-primary)' }}>School not found.</div>;
  }

  const initials = school.code.split('-')[1]?.slice(0, 3) ?? 'AVS';
  const principalInitials = school.principal.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();


  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <Activity size={16} /> },
    { key: 'infrastructure', label: 'Infrastructure', icon: <Building2 size={16} /> },
    { key: 'about', label: 'About & Contact', icon: <Globe size={16} /> },
  ];

  return (
    <div className="sdp">
      {/* Top Bar */}
      <div className="sdp-topbar">
        <button className="sdp-back" onClick={() => navigate('/super-admin/schools')}>
          <ChevronLeft size={16} /> Back to Directory
        </button>
        <div className="sdp-topbar-actions">
          <button className="sdp-action-btn sdp-action-btn--outline"><Download size={15} /> Export</button>
          <button className="sdp-action-btn sdp-action-btn--outline"><Share2 size={15} /> Share</button>
          <button className="sdp-action-btn sdp-action-btn--primary" onClick={() => setIsInspectionOpen(true)}>
            <Video size={16} /> Surprise Inspection
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="sdp-hero">
        <div className="sdp-hero-top">
          <div className="sdp-hero-identity">
            <div className="sdp-hero-logo">{initials}</div>
            <div className="sdp-hero-info">
              <div className="sdp-hero-name-row">
                <h1 className="sdp-hero-name">{school.name}</h1>
                <span className="sdp-hero-code">{school.code}</span>
                <span className={`sdp-hero-badge sdp-hero-badge--${school.status}`}>
                  <span className="sdp-hero-badge-dot" />
                  {school.status}
                </span>
              </div>
              <div className="sdp-hero-meta">
                <span className="sdp-hero-meta-item"><MapPin size={14} />{school.city}, {school.state}</span>
                <span className="sdp-hero-meta-item"><Calendar size={14} />Est. {school.establishedYear}</span>
                <span className="sdp-hero-meta-item"><Users size={14} />Principal: {school.principal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="sdp-kpi-strip">
          <div className="sdp-kpi">
            <div className="sdp-kpi-icon sdp-kpi-icon--emerald"><GraduationCap size={22} /></div>
            <div>
              <div className="sdp-kpi-value">{school.totalStudents.toLocaleString()}</div>
              <div className="sdp-kpi-label">Total Students</div>
            </div>
          </div>
          <div className="sdp-kpi">
            <div className="sdp-kpi-icon sdp-kpi-icon--blue"><Users size={22} /></div>
            <div>
              <div className="sdp-kpi-value">{school.totalTeachers}</div>
              <div className="sdp-kpi-label">Teaching Staff</div>
            </div>
          </div>
          <div className="sdp-kpi">
            <div className="sdp-kpi-icon sdp-kpi-icon--pink"><BookOpen size={22} /></div>
            <div>
              <div className="sdp-kpi-value">{school.attendanceRate}%</div>
              <div className="sdp-kpi-label">Attendance Rate</div>
            </div>
          </div>
          <div className="sdp-kpi">
            <div className="sdp-kpi-icon sdp-kpi-icon--amber"><CreditCard size={22} /></div>
            <div>
              <div className="sdp-kpi-value">{school.feeCollectionRate}%</div>
              <div className="sdp-kpi-label">Fee Collection</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sdp-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`sdp-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="sdp-tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="sdp-tab-content" key={activeTab}>
        {activeTab === 'overview' && <OverviewTab school={school} principalInitials={principalInitials} />}
        {activeTab === 'infrastructure' && <InfrastructureTab />}
        {activeTab === 'about' && <AboutTab school={school} principalInitials={principalInitials} />}
      </div>

      <InspectionModal isOpen={isInspectionOpen} onClose={() => setIsInspectionOpen(false)} school={school} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   TAB: Overview
   ═══════════════════════════════════════════ */
function OverviewTab({ school, principalInitials }: { school: ReturnType<typeof getSchoolById> & {}; principalInitials: string }) {
  return (
    <div className="sdp-content-grid">
      {/* Main Column */}
      <div>
        {/* Performance Chart */}
        <div className="sdp-card">
          <div className="sdp-card-header">
            <h3 className="sdp-card-title"><Activity size={18} /> Performance Trend</h3>
            <span className="sdp-card-subtitle">Last 6 months</span>
          </div>
          <div className="sdp-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={schoolDetailsData.performanceTrend} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="sdpGradAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sdpGradFee" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} domain={[70, 100]} width={40} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '10px', fontSize: '13px', boxShadow: 'var(--shadow-lg)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#10B981" strokeWidth={2.5} fill="url(#sdpGradAtt)" dot={{ r: 4, fill: '#10B981', stroke: 'white', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="fees" name="Fee Collection %" stroke="#3B82F6" strokeWidth={2.5} fill="url(#sdpGradFee)" dot={{ r: 4, fill: '#3B82F6', stroke: 'white', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Distribution */}
        <div className="sdp-card">
          <div className="sdp-card-header">
            <h3 className="sdp-card-title"><GraduationCap size={18} /> Student Distribution</h3>
            <span className="sdp-card-subtitle">By grade level</span>
          </div>
          <div className="sdp-perf-bars">
            {schoolDetailsData.gradeDistribution.map((g, i) => {
              const max = Math.max(...schoolDetailsData.gradeDistribution.map(x => x.students));
              const colors = ['sdp-perf-bar-fill--green', 'sdp-perf-bar-fill--blue', 'sdp-perf-bar-fill--amber', 'sdp-perf-bar-fill--pink'];
              return (
                <div key={i} className="sdp-perf-bar">
                  <span className="sdp-perf-bar-label">{g.name}</span>
                  <div className="sdp-perf-bar-track">
                    <div className={`sdp-perf-bar-fill ${colors[i % 4]}`} style={{ width: `${(g.students / max) * 100}%` }} />
                  </div>
                  <span className="sdp-perf-bar-value">{g.students}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div>
        {/* Principal */}
        <div className="sdp-card">
          <div className="sdp-card-header">
            <h3 className="sdp-card-title"><Users size={18} /> Administration</h3>
          </div>
          <div className="sdp-principal">
            <div className="sdp-principal-avatar">{principalInitials}</div>
            <div>
              <div className="sdp-principal-name">{school.principal}</div>
              <div className="sdp-principal-role">Principal</div>
              <div className="sdp-principal-status"><span className="sdp-dot" /> On Campus</div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="sdp-card">
          <div className="sdp-card-header">
            <h3 className="sdp-card-title"><AlertTriangle size={18} /> Recent Alerts</h3>
            <span className="sdp-card-subtitle">{schoolDetailsData.alerts.length} active</span>
          </div>
          <div className="sdp-alerts">
            {schoolDetailsData.alerts.map(a => (
              <div key={a.id} className={`sdp-alert sdp-alert--${a.type}`}>
                <div className="sdp-alert-icon">
                  {a.type === 'critical' ? <ShieldAlert size={16} /> : a.type === 'warning' ? <AlertTriangle size={16} /> : <Activity size={16} />}
                </div>
                <div>
                  <div className="sdp-alert-title">{a.title}</div>
                  <p className="sdp-alert-desc">{a.desc}</p>
                  <div className="sdp-alert-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TAB: Infrastructure
   ═══════════════════════════════════════════ */
function InfrastructureTab() {
  return (
    <div>
      <div className="sdp-card">
        <div className="sdp-card-header">
          <h3 className="sdp-card-title"><Building2 size={18} /> Facilities & Infrastructure</h3>
          <span className="sdp-card-subtitle">{schoolDetailsData.facilities.filter(f => f.status === 'operational').length} of {schoolDetailsData.facilities.length} operational</span>
        </div>
        <div className="sdp-facilities">
          {schoolDetailsData.facilities.map((fac, i) => (
            <div key={i} className="sdp-facility">
              <div className={`sdp-facility-icon ${fac.status === 'operational' ? 'sdp-facility-icon--green' : 'sdp-facility-icon--amber'}`}>
                {facilityIcons[fac.name] || <Settings size={18} />}
              </div>
              <div>
                <div className="sdp-facility-name">{fac.name}</div>
                <div className={`sdp-facility-status ${fac.status === 'operational' ? 'sdp-facility-status--ok' : 'sdp-facility-status--warn'}`}>
                  <span className="sdp-dot" />
                  {fac.status === 'operational' ? `Operational · ${fac.count} units` : 'Under Maintenance'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capacity Chart */}
      <div className="sdp-card">
        <div className="sdp-card-header">
          <h3 className="sdp-card-title"><GraduationCap size={18} /> Capacity by Grade Level</h3>
        </div>
        <div className="sdp-dist-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={schoolDetailsData.gradeDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '10px', fontSize: '13px' }} />
              <Bar dataKey="students" name="Students" fill="var(--primary-500)" radius={[6, 6, 0, 0]} barSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TAB: About & Contact
   ═══════════════════════════════════════════ */
function AboutTab({ school, principalInitials }: { school: ReturnType<typeof getSchoolById> & {}; principalInitials: string }) {
  return (
    <div className="sdp-content-grid">
      <div>
        <div className="sdp-card">
          <div className="sdp-card-header">
            <h3 className="sdp-card-title"><Globe size={18} /> School Information</h3>
          </div>
          <div className="sdp-info-grid">
            <div className="sdp-info-item"><div className="sdp-info-label">School Name</div><div className="sdp-info-value">{school.name}</div></div>
            <div className="sdp-info-item"><div className="sdp-info-label">School Code</div><div className="sdp-info-value" style={{ fontFamily: 'var(--font-mono)' }}>{school.code}</div></div>
            <div className="sdp-info-item"><div className="sdp-info-label">Established</div><div className="sdp-info-value">{school.establishedYear}</div></div>
            <div className="sdp-info-item"><div className="sdp-info-label">Status</div><div className="sdp-info-value" style={{ textTransform: 'capitalize' }}>{school.status}</div></div>
            <div className="sdp-info-item"><div className="sdp-info-label">City</div><div className="sdp-info-value">{school.city}</div></div>
            <div className="sdp-info-item"><div className="sdp-info-label">State</div><div className="sdp-info-value">{school.state}</div></div>
            <div className="sdp-info-item" style={{ gridColumn: 'span 2' }}><div className="sdp-info-label">Full Address</div><div className="sdp-info-value">{school.address}</div></div>
          </div>
        </div>
      </div>

      <div>
        <div className="sdp-card">
          <div className="sdp-card-header">
            <h3 className="sdp-card-title"><Phone size={18} /> Contact Details</h3>
          </div>
          <div className="sdp-contact-list">
            <div className="sdp-contact-item"><Phone size={16} /><span className="sdp-contact-value">{school.phone}</span></div>
            <div className="sdp-contact-item"><Mail size={16} /><span className="sdp-contact-value">{school.email}</span></div>
            <div className="sdp-contact-item"><MapPin size={16} /><span className="sdp-contact-value">{school.address}</span></div>
          </div>
          <hr className="sdp-sidebar-sep" style={{ margin: 'var(--space-4) 0' }} />
          <div className="sdp-principal">
            <div className="sdp-principal-avatar">{principalInitials}</div>
            <div>
              <div className="sdp-principal-name">{school.principal}</div>
              <div className="sdp-principal-role">Principal</div>
              <div className="sdp-principal-status"><span className="sdp-dot" /> On Campus</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
