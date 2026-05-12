import { useState } from 'react';
import {
  Trophy, Activity, Users, Target, Calendar as CalendarIcon, CheckCircle2, 
  MapPin, IndianRupee, Medal, School, PlusCircle, Send, Globe
} from 'lucide-react';
import PageHeader from '../ui/PageHeader';
import {
  mockCompetitions, mockParticipationMatrix, mockAchievements
} from '../../data/competitions';
import { NETWORK_SCHOOLS } from '../../data/initiatives';
import './CompetitionsModule.css';

export type Role = 'super-admin' | 'principal' | 'teacher' | 'student' | 'parent';

interface Props {
  role: Role;
}

export default function CompetitionsModule({ role }: Props) {
  const isSA = role === 'super-admin';
  const [activeTab, setActiveTab] = useState(isSA ? 'overview' : 'events');
  const [isInitiating, setIsInitiating] = useState(false);

  let tabs: any[] = [];
  let headerConfig = { title: '', subtitle: '' };

  if (role === 'super-admin') {
    tabs = [
      { key: 'overview', label: 'Overview', icon: <Activity size={16} /> },
      { key: 'matrix', label: 'Schools Matrix', icon: <Target size={16} /> },
      { key: 'approvals', label: 'Approvals', icon: <CheckCircle2 size={16} /> },
    ];
    headerConfig = { title: 'Competitions — Network', subtitle: 'Inter-school events and state-wide sports meets' };
  } else if (role === 'principal') {
    tabs = [
      { key: 'events', label: 'Events', icon: <Trophy size={16} /> },
      { key: 'hosting', label: 'Hosting', icon: <School size={16} /> },
      { key: 'cabinet', label: 'Trophy Cabinet', icon: <Medal size={16} /> },
    ];
    headerConfig = { title: 'School Competitions', subtitle: 'Participate, nominate, and track achievements' };
  } else if (role === 'teacher') {
    tabs = [
      { key: 'events', label: 'Active Events', icon: <Trophy size={16} /> },
      { key: 'nominations', label: 'My Nominations', icon: <Users size={16} /> },
      { key: 'cabinet', label: 'School Cabinet', icon: <Medal size={16} /> },
    ];
    headerConfig = { title: 'Competitions', subtitle: 'Mentorship and student nominations' };
  } else {
    tabs = [
      { key: 'events', label: 'Upcoming Events', icon: <CalendarIcon size={16} /> },
      { key: 'participations', label: 'My Participations', icon: <Target size={16} /> },
      { key: 'cabinet', label: 'School Cabinet', icon: <Medal size={16} /> },
    ];
    headerConfig = { title: 'Competitions', subtitle: 'Participate and track your achievements' };
  }

  return (
    <div className="page-wrapper">
      <PageHeader 
        title={headerConfig.title} 
        subtitle={headerConfig.subtitle} 
        rightContent={
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)' }}>
              <CalendarIcon size={14} />
              {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </div>
            {isSA && !isInitiating && (
              <button className="comp-btn comp-btn--primary" onClick={() => setIsInitiating(true)}>
                <PlusCircle size={14} /> Sanction Event
              </button>
            )}
          </div>
        }
      />

      <div className="comp">
        {role === 'super-admin' && <SAKpiStrip />}
        {role === 'principal' && <PrincipalKpiStrip />}
        {role === 'teacher' && <TeacherKpiStrip />}
        {(role === 'student' || role === 'parent') && <StudentKpiStrip />}

        {isInitiating ? (
          <SAInitiateEvent onCancel={() => setIsInitiating(false)} />
        ) : (
          <>
            <div className="comp-tabs-container">
              <div className="comp-tabs" role="tablist">
                {tabs.map(t => (
                  <button
                    key={t.key}
                    className={`comp-tab ${activeTab === t.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(t.key)}
                    role="tab"
                    aria-selected={activeTab === t.key}
                  >
                    {t.icon} <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="comp-content" key={activeTab}>
              {role === 'super-admin' && activeTab === 'overview' && <SAOverview />}
              {role === 'super-admin' && activeTab === 'matrix' && <SAMatrix />}
              {role === 'super-admin' && activeTab === 'approvals' && <SAApprovals />}

              {role !== 'super-admin' && activeTab === 'events' && <RoleEvents role={role} />}
              {role === 'principal' && activeTab === 'hosting' && <PrincipalHosting />}
              {role === 'teacher' && activeTab === 'nominations' && <TeacherNominations />}
              {(role === 'student' || role === 'parent') && activeTab === 'participations' && <StudentParticipations />}
              {role !== 'super-admin' && activeTab === 'cabinet' && <SchoolCabinet />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function KpiTile({ label, value, hint, icon, tone = 'primary' }: any) {
  return (
    <div className="comp-kpi">
      <div className={`comp-kpi-icon comp-kpi-icon--${tone}`}>{icon}</div>
      <div className="comp-kpi-body">
        <div className="comp-kpi-value">{value}</div>
        <div className="comp-kpi-label">{label}</div>
        {hint && <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{hint}</div>}
      </div>
    </div>
  );
}

function SAKpiStrip() {
  const activeCount = mockCompetitions.filter(c => c.status === 'Active').length;
  const totalParticipants = mockCompetitions.reduce((sum, c) => sum + c.participants, 0);
  const budgetSanctioned = mockCompetitions.reduce((sum, c) => sum + (c.status === 'Sanctioned' || c.status === 'Active' ? c.budget : 0), 0);
  
  const engagedSchools = new Set<string>();
  Object.values(mockParticipationMatrix).forEach(schoolMap => {
    Object.keys(schoolMap).forEach(schoolId => engagedSchools.add(schoolId));
  });

  return (
    <div className="comp-kpi-row">
      <KpiTile label="Active Events" value={activeCount} icon={<Activity size={20} />} tone="primary" hint="Currently ongoing" />
      <KpiTile label="Participants" value={totalParticipants} icon={<Users size={20} />} tone="info" hint="Registered students" />
      <KpiTile label="Budget (INR)" value={`${(budgetSanctioned / 100000).toFixed(1)}L`} icon={<IndianRupee size={20} />} tone="accent" hint="Sanctioned so far" />
      <KpiTile label="Schools Engaged" value={engagedSchools.size} icon={<School size={20} />} tone="success" hint="Active in network" />
    </div>
  );
}

function PrincipalKpiStrip() {
  return (
    <div className="comp-kpi-row">
      <KpiTile label="Active Registrations" value="3" icon={<Users size={20} />} tone="primary" hint="Upcoming events" />
      <KpiTile label="Pending Approvals" value="1" icon={<CheckCircle2 size={20} />} tone="warning" hint="Awaiting HQ sanction" />
      <KpiTile label="Trophies Won" value="4" icon={<Medal size={20} />} tone="success" hint="This academic year" />
      <KpiTile label="Hosting Requests" value="0" icon={<School size={20} />} tone="info" hint="Submitted this year" />
    </div>
  );
}

function TeacherKpiStrip() {
  return (
    <div className="comp-kpi-row">
      <KpiTile label="Active Events" value="2" icon={<Trophy size={20} />} tone="primary" hint="Open for nominations" />
      <KpiTile label="Students Mentored" value="14" icon={<Users size={20} />} tone="info" hint="Across all events" />
      <KpiTile label="Pending Approvals" value="0" icon={<CheckCircle2 size={20} />} tone="success" hint="From Principal" />
      <KpiTile label="Medals Won (Class)" value="2" icon={<Medal size={20} />} tone="accent" hint="This academic year" />
    </div>
  );
}

function StudentKpiStrip() {
  return (
    <div className="comp-kpi-row">
      <KpiTile label="Upcoming Events" value="3" icon={<CalendarIcon size={20} />} tone="primary" hint="Open for registration" />
      <KpiTile label="Active Participations" value="1" icon={<Activity size={20} />} tone="info" hint="Currently competing" />
      <KpiTile label="Certificates" value="4" icon={<Target size={20} />} tone="success" hint="Digital certificates earned" />
      <KpiTile label="Medals Won" value="1" icon={<Medal size={20} />} tone="accent" hint="Total count" />
    </div>
  );
}

function SAOverview() {
  return (
    <div className="comp-card-grid">
      {mockCompetitions.map(c => (
        <div key={c.id} className="comp-card">
          <div className="comp-card-head">
            <h3 className="comp-card-title">{c.title}</h3>
            <span className={`comp-badge comp-badge--${c.status.toLowerCase()}`}>{c.status}</span>
          </div>
          
          <div className="comp-card-meta-row">
            <span className="comp-badge comp-badge--category">{c.category}</span>
          </div>
          
          <div className="comp-card-meta-row" style={{ marginTop: '12px' }}>
            {c.venue.toLowerCase().includes('online') || c.venue.toLowerCase().includes('virtual') ? <Globe size={14} /> : <MapPin size={14} />} <span>{c.venue}</span>
          </div>
          <div className="comp-card-meta-row">
            <CalendarIcon size={14} /> <span>{c.dates}</span>
          </div>
          <div className="comp-card-meta-row">
            <Users size={14} /> <span>{c.participants} Registered</span>
          </div>

          <div className="comp-card-foot">
            <button className="comp-btn comp-btn--ghost-sm">View Details</button>
            <span style={{ fontSize: '11px', fontWeight: 'var(--fw-bold)', color: 'var(--text-secondary)' }}>
              ₹{(c.budget / 1000).toFixed(0)}k Budget
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SAMatrix() {
  const competitions = mockCompetitions.filter(c => c.status === 'Active' || c.status === 'Sanctioned');
  const schools = NETWORK_SCHOOLS.slice(0, 10); 

  return (
    <div className="comp-matrix-card">
      <div className="comp-card-head" style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--border-light)', marginBottom: 0 }}>
        <div>
          <h3 className="comp-card-title"><Target size={18} /> Participation Matrix</h3>
          <span className="comp-card-meta">Cross-school engagement heatmap for sanctioned network events</span>
        </div>
        <button className="comp-btn comp-btn--ghost-sm">Export CSV</button>
      </div>
      <div className="comp-matrix-wrap">
        <table className="comp-matrix">
          <thead>
            <tr>
              <th className="row-head">School / Branch</th>
              {competitions.map(c => <th key={c.id}>{c.title}</th>)}
            </tr>
          </thead>
          <tbody>
            {schools.map((s, i) => {
              const schoolId = `sch-${i+1}`;
              return (
                <tr key={s.code}>
                  <td className="row-head">
                    <div style={{ fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{s.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.district}</div>
                  </td>
                  {competitions.map(c => {
                    const status = mockParticipationMatrix[c.id]?.[schoolId] || null;
                    const cssClass = status ? `comp-cell--${status.toLowerCase()}` : 'comp-cell--none';
                    return (
                      <td key={c.id} className={cssClass}>
                        {status ? status : '—'}
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

function SAApprovals() {
  return (
    <div className="comp-empty">
      <CheckCircle2 size={48} />
      <h3>Queue is Empty</h3>
      <p>There are no pending requests from Principals requiring HQ sanctioning. You are all caught up.</p>
    </div>
  );
}

function RoleEvents({ role }: { role: Role }) {
  const [nominating, setNominating] = useState<string | null>(null);
  const [studentCount, setStudentCount] = useState(0);

  const activeEvents = mockCompetitions.filter(c => c.status === 'Active' || c.status === 'Sanctioned');

  if (activeEvents.length === 0) {
    return (
      <div className="comp-empty">
        <Trophy size={48} />
        <h3>No Active Competitions</h3>
        <p>There are no state-wide competitions currently active. Announcements will be posted here when a new event is sanctioned.</p>
      </div>
    );
  }

  const handleNominate = (_compId: string) => {
    if (studentCount > 50) {
      alert("Validation Error: Cannot nominate more than 50 students per competition rule.");
      return;
    }
    if (studentCount <= 0) {
      alert("Please enter a valid number of students.");
      return;
    }
    alert(`Successfully nominated ${studentCount} students.`);
    setNominating(null);
    setStudentCount(0);
  };

  const handleRegisterInterest = () => {
    alert("Interest registered! The organizing school will review your request.");
  };

  const isStudentOrParent = role === 'student' || role === 'parent';

  return (
    <div className="comp-card-grid">
      {activeEvents.map(c => (
        <div key={c.id} className="comp-card">
          <div className="comp-card-head">
            <h3 className="comp-card-title">{c.title}</h3>
            <span className={`comp-badge comp-badge--${c.status.toLowerCase()}`}>{c.status}</span>
          </div>
          
          <div className="comp-card-meta-row">
            <span className="comp-badge comp-badge--category">{c.category}</span>
          </div>
          
          <div className="comp-card-meta-row" style={{ marginTop: '12px' }}>
            {c.venue.toLowerCase().includes('online') || c.venue.toLowerCase().includes('virtual') ? <Globe size={14} /> : <MapPin size={14} />} <span>{c.venue}</span>
          </div>
          <div className="comp-card-meta-row">
            <CalendarIcon size={14} /> <span>{c.dates}</span>
          </div>

          <div className="comp-card-foot">
            {isStudentOrParent ? (
              <button className="comp-btn comp-btn--primary" onClick={handleRegisterInterest} style={{ width: '100%' }}>
                Register Interest
              </button>
            ) : nominating === c.id ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                <input 
                  type="number" 
                  value={studentCount} 
                  onChange={e => setStudentCount(Number(e.target.value))}
                  placeholder="Qty"
                  style={{ width: '80px', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', outline: 'none', background: 'var(--bg-input)', fontSize: 'var(--text-sm)' }} 
                />
                <button className="comp-btn comp-btn--primary" onClick={() => handleNominate(c.id)}>Confirm</button>
                <button className="comp-btn comp-btn--ghost" onClick={() => setNominating(null)}>Cancel</button>
              </div>
            ) : (
              <button className="comp-btn comp-btn--primary" onClick={() => setNominating(c.id)} style={{ width: '100%' }}>
                Nominate Students
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function TeacherNominations() {
  return (
    <div className="comp-empty">
      <Users size={48} />
      <h3>No Active Nominations</h3>
      <p>You haven't nominated any students for the upcoming events. Check the Active Events tab to submit names.</p>
    </div>
  );
}

function StudentParticipations() {
  return (
    <div className="comp-empty">
      <Target size={48} />
      <h3>No Active Participations</h3>
      <p>You are not currently registered to compete in any active events. Check the Upcoming Events tab to register your interest.</p>
    </div>
  );
}

function PrincipalHosting() {
  const [isDrafting, setIsDrafting] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  if (isDrafting) {
    return <DraftHostingForm onCancel={() => setIsDrafting(false)} onSubmit={(req) => {
      setRequests([...requests, req]);
      setIsDrafting(false);
    }} />
  }

  if (requests.length > 0) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>My Hosting Proposals</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Track the status of your submitted campus hosting requests.</p>
          </div>
          <button className="comp-btn comp-btn--primary" onClick={() => setIsDrafting(true)}><PlusCircle size={14} /> New Request</button>
        </div>
        <div className="comp-card-grid">
           {requests.map((r, i) => (
             <div key={i} className="comp-card">
               <div className="comp-card-head">
                 <h3 className="comp-card-title">{r.title}</h3>
                 <span className="comp-badge comp-badge--proposed">Pending HQ Review</span>
               </div>
               <div className="comp-card-meta-row" style={{ marginTop: '8px' }}>
                 <CalendarIcon size={14} /> <span>Proposed for {r.month}</span>
               </div>
               <div className="comp-card-meta-row">
                 <Users size={14} /> <span>Capacity: {r.capacity}</span>
               </div>
               <div className="comp-card-meta-row">
                 <IndianRupee size={14} /> <span>Est. Budget: ₹{r.budget || '0'}</span>
               </div>
             </div>
           ))}
        </div>
      </>
    );
  }

  return (
    <div className="comp-empty">
      <School size={48} />
      <h3>Host an Event</h3>
      <p>Send a formal request to HQ to host a state-level or district-level event at your school campus. Requests are reviewed monthly.</p>
      <button className="comp-btn comp-btn--primary" style={{ marginTop: 'var(--space-4)' }} onClick={() => setIsDrafting(true)}>Draft Hosting Request</button>
    </div>
  );
}

function DraftHostingForm({ onCancel, onSubmit }: { onCancel: () => void, onSubmit: (req: any) => void }) {
  const [format, setFormat] = useState<'in-person'|'virtual'>('in-person');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      title: formData.get('title'),
      month: formData.get('startDate'),
      capacity: formData.get('capacity') || 'N/A (Virtual)',
      budget: formData.get('budget'),
    });
    alert("Inter-school competition proposal submitted to HQ successfully.");
  };

  return (
    <div className="comp-card">
      <div className="comp-card-head" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div>
          <h3 className="comp-card-title"><School size={18} /> Initiate Inter-School Event</h3>
          <span className="comp-card-meta">Propose an event and challenge other branches to participate</span>
        </div>
      </div>

      <form className="comp-form" onSubmit={handleSubmit}>
        <div className="comp-form-grid">
          <div className="comp-field comp-field--full">
            <label>Proposed Event Theme / Title <span className="req">*</span></label>
            <input type="text" name="title" placeholder="e.g. Annual Inter-School Tech Symposium" required />
          </div>

          <div className="comp-field">
            <label>Event Format <span className="req">*</span></label>
            <div className="comp-checkbox-group" style={{ gap: '24px' }}>
              <label className="comp-checkbox">
                <input type="radio" name="format" checked={format === 'in-person'} onChange={() => setFormat('in-person')} /> In-Person
              </label>
              <label className="comp-checkbox">
                <input type="radio" name="format" checked={format === 'virtual'} onChange={() => setFormat('virtual')} /> Virtual / Online
              </label>
            </div>
          </div>
          
          <div className="comp-field">
            <label>Proposed Start Date <span className="req">*</span></label>
            <input type="date" name="startDate" required />
          </div>

          <div className="comp-field comp-field--full">
            <label>Invite Network Schools (Challenge) <span className="req">*</span></label>
            <div className="comp-checkbox-group" style={{ maxHeight: '140px', overflowY: 'auto', border: '1px solid var(--border-light)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <label className="comp-checkbox" style={{ width: '100%', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px dashed var(--border-medium)', fontWeight: 'var(--fw-semibold)' }}>
                <input type="checkbox" /> Invite All Network Branches
              </label>
              {NETWORK_SCHOOLS.map(s => (
                <label key={s.code} className="comp-checkbox" style={{ width: '48%', marginBottom: '4px' }}>
                  <input type="checkbox" name="invitedSchools" value={s.code} /> {s.name}
                </label>
              ))}
            </div>
          </div>

          {format === 'in-person' && (
            <>
              <div className="comp-field">
                <label>Expected Capacity <span className="req">*</span></label>
                <input type="number" name="capacity" placeholder="Total students/guests" required />
              </div>
              
              <div className="comp-field comp-field--full">
                <label>Available Campus Facilities <span className="req">*</span></label>
                <div className="comp-checkbox-group">
                  <label className="comp-checkbox"><input type="checkbox" /> Main Auditorium (500+ seats)</label>
                  <label className="comp-checkbox"><input type="checkbox" /> Indoor Sports Complex</label>
                  <label className="comp-checkbox"><input type="checkbox" /> Computer Labs</label>
                  <label className="comp-checkbox"><input type="checkbox" /> Guest Accommodations</label>
                </div>
              </div>
            </>
          )}

          {format === 'virtual' && (
            <div className="comp-field">
              <label>Virtual Platform</label>
              <input type="text" placeholder="e.g. MS Teams, Zoom Webinar" required />
            </div>
          )}

          <div className="comp-field">
            <label>Requested Budget from HQ (INR)</label>
            <input type="number" name="budget" placeholder="e.g. 75000" />
          </div>

          <div className="comp-field comp-field--full">
            <label>Proposal Justification & Objective</label>
            <textarea rows={3} placeholder="Briefly explain the objective of the competition and why these schools are invited..." />
          </div>
        </div>

        <div className="comp-form-actions">
          <button type="button" className="comp-btn comp-btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="comp-btn comp-btn--primary"><Send size={14} /> Submit Proposal</button>
        </div>
      </form>
    </div>
  );
}

function SchoolCabinet() {
  const schoolAchievements = mockAchievements.filter(a => a.schoolId === 'sch-1');

  if (schoolAchievements.length === 0) {
    return (
      <div className="comp-empty">
        <Medal size={48} />
        <h3>Cabinet Empty</h3>
        <p>Your school hasn't won any network-wide awards yet. Participate in upcoming competitions to earn trophies.</p>
      </div>
    );
  }

  return (
    <div className="comp-card-grid">
      {schoolAchievements.map(a => (
        <div key={a.id} className="comp-card" style={{ alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            {a.medal === 'Trophy' ? <Trophy size={32} /> : <Medal size={32} />}
          </div>
          <h3 className="comp-card-title" style={{ justifyContent: 'center', marginBottom: '4px' }}>{a.medal}</h3>
          <div className="comp-card-meta-row" style={{ marginTop: '0', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 'var(--fw-semibold)' }}>
            {a.title} ({a.year})
          </div>
          <span className="comp-badge comp-badge--category" style={{ marginTop: '12px' }}>{a.category}</span>
        </div>
      ))}
    </div>
  );
}

function SAInitiateEvent({ onCancel }: { onCancel: () => void }) {
  const [format, setFormat] = useState<'in-person'|'virtual'>('in-person');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Event initiated successfully. Branch principals will be notified to nominate students.");
    onCancel();
  };

  return (
    <div className="comp-card">
      <div className="comp-card-head" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div>
          <h3 className="comp-card-title"><PlusCircle size={18} /> Initiate New Competition</h3>
          <span className="comp-card-meta">Define event rules, budget, and participating branches</span>
        </div>
      </div>

      <form className="comp-form" onSubmit={handleSubmit}>
        <div className="comp-form-grid">
          <div className="comp-field">
            <label>Event Title <span className="req">*</span></label>
            <input type="text" placeholder="e.g. State Science Decathlon" required />
          </div>
          
          <div className="comp-field">
            <label>Category <span className="req">*</span></label>
            <select required>
              <option value="">Select Category</option>
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Innovation">Innovation</option>
            </select>
          </div>

          <div className="comp-field">
            <label>Start Date <span className="req">*</span></label>
            <input type="date" required />
          </div>

          <div className="comp-field">
            <label>End Date <span className="req">*</span></label>
            <input type="date" required />
          </div>

          <div className="comp-field comp-field--full">
            <label>Event Format <span className="req">*</span></label>
            <div className="comp-checkbox-group" style={{ gap: '24px' }}>
              <label className="comp-checkbox">
                <input type="radio" name="format" checked={format === 'in-person'} onChange={() => setFormat('in-person')} /> In-Person
              </label>
              <label className="comp-checkbox">
                <input type="radio" name="format" checked={format === 'virtual'} onChange={() => setFormat('virtual')} /> Virtual / Online
              </label>
            </div>
          </div>

          {format === 'in-person' ? (
            <div className="comp-field">
              <label>Host Venue</label>
              <select>
                <option value="hq">AVS Headquarters (Main Stadium)</option>
                {NETWORK_SCHOOLS.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="comp-field">
              <label>Virtual Platform / Link</label>
              <input type="text" placeholder="e.g. Google Meet link or Platform name" />
            </div>
          )}

          <div className="comp-field">
            <label>Sanctioned Budget (INR)</label>
            <input type="number" placeholder="e.g. 50000" />
          </div>

          <div className="comp-field comp-field--full">
            <label>Participating Branches <span className="req">*</span></label>
            <div className="comp-checkbox-group">
              <label className="comp-checkbox"><input type="checkbox" defaultChecked /> All Network Schools</label>
              <label className="comp-checkbox"><input type="checkbox" /> North District Only</label>
              <label className="comp-checkbox"><input type="checkbox" /> South District Only</label>
            </div>
          </div>

          <div className="comp-field comp-field--full">
            <label>Rules & Guidelines</label>
            <textarea rows={4} placeholder="Detail the event structure, max participants per school, etc." />
          </div>
        </div>

        <div className="comp-form-actions">
          <button type="button" className="comp-btn comp-btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="comp-btn comp-btn--primary"><Send size={14} /> Send Invitations</button>
        </div>
      </form>
    </div>
  );
}
