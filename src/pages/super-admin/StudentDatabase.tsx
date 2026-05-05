import { useState, useMemo } from 'react';
import {
  Search, SlidersHorizontal, Download, Plus, Eye, X,
  ChevronLeft, ChevronRight, GraduationCap, Users, School, Award, MapPin, Building2
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { getStudents, getStudentClassOptions, getStudentNetworkStats } from '../../data/students';
import { getSchools } from '../../data/schools';
import { usePagination } from '../../hooks/usePagination';
import type { Student } from '../../types';
import './StudentDatabase.css';

/* ─── Data ─── */
const allStudents = getStudents();
const allSchools = getSchools();
const CLASS_OPTIONS = getStudentClassOptions();
const AVATAR_COLORS = ['stdb-avatar--green', 'stdb-avatar--pink', 'stdb-avatar--blue', 'stdb-avatar--amber', 'stdb-avatar--purple'];

export default function StudentDatabase() {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [classFilter, setClassFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusChip, setStatusChip] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const stats = getStudentNetworkStats();

  /* ─── Global search: find students across all schools ─── */
  const globalResults = useMemo(() => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    return allStudents.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.admissionNumber.toLowerCase().includes(q) ||
      s.parentName.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [globalSearch]);

  /* ─── School-scoped students ─── */
  const selectedSchool = selectedSchoolId ? allSchools.find(s => s.id === selectedSchoolId) : null;

  const schoolStudents = useMemo(() => {
    if (!selectedSchoolId) return [];
    let data = allStudents.filter(s => s.schoolId === selectedSchoolId);

    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      data = data.filter(s => s.name.toLowerCase().includes(q) || s.admissionNumber.toLowerCase().includes(q));
    }
    if (statusChip !== 'all') data = data.filter(s => s.status === statusChip);
    if (classFilter !== 'all') data = data.filter(s => s.className === classFilter);
    if (genderFilter !== 'all') data = data.filter(s => s.gender === genderFilter);

    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedSchoolId, localSearch, statusChip, classFilter, genderFilter]);

  const pagination = usePagination(schoolStudents, 10);

  const resetPage = (fn: () => void) => { fn(); pagination.resetPage(); };

  const handleSelectSchool = (id: string) => {
    setSelectedSchoolId(id);
    setLocalSearch('');
    setClassFilter('all');
    setGenderFilter('all');
    setStatusChip('all');
    setShowFilters(false);
  };

  const handleClearSchool = () => {
    setSelectedSchoolId(null);
    setLocalSearch('');
  };

  const attColor = (r: number) => r >= 85 ? 'stdb-att-fill--green' : r >= 75 ? 'stdb-att-fill--yellow' : 'stdb-att-fill--red';
  const gradeClass = (g: string) => g.startsWith('A') ? 'stdb-grade--A' : g.startsWith('B') ? 'stdb-grade--B' : g.startsWith('C') ? 'stdb-grade--C' : 'stdb-grade--D';

  const schoolStudentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allStudents.forEach(s => { counts[s.schoolId] = (counts[s.schoolId] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="sa-welcome">
          <div>
            <h1 className="page-title">Student Database</h1>
            <p className="page-subtitle">Centralised student records across all {allSchools.length} schools in the AVS network.</p>
          </div>
          <div className="sa-welcome-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Network Stats */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard title="Total Students" value={stats.statusCounts.all.toLocaleString()} subtitle={`${stats.statusCounts.active} active`} icon={<GraduationCap size={22} />} trend={{ value: 5.8, label: 'vs last year' }} color="primary" />
        <StatCard title="Schools Covered" value={allSchools.length.toString()} subtitle="Across India" icon={<School size={22} />} color="accent" />
        <StatCard title="Avg. Attendance" value={`${stats.avgAttendance}%`} subtitle="Network wide" icon={<Users size={22} />} progress={{ current: stats.avgAttendance, total: 100 }} color="success" />
        <StatCard title="A-Grade Students" value={stats.topGradeCount.toString()} subtitle={`${Math.round((stats.topGradeCount / stats.statusCounts.all) * 100)}% of total`} icon={<Award size={22} />} trend={{ value: 3.2, label: 'this term' }} color="info" />
      </div>

      {/* Global Quick Search */}
      <div className="stdb-global-search">
        <Search size={18} className="stdb-global-search-icon" />
        <input
          placeholder="Quick search any student across all schools..."
          value={globalSearch}
          onChange={e => { setGlobalSearch(e.target.value); if (e.target.value) setSelectedSchoolId(null); }}
        />
      </div>

      {/* Global Search Results */}
      {globalSearch.trim() && (
        <div style={{ marginBottom: 'var(--space-6)' }}>
          {globalResults.length > 0 ? (
            <div className="stdb-table-card">
              <div className="stdb-table-scroll">
                <table className="stdb-table">
                  <thead>
                    <tr>
                      <th>Student</th><th>Class</th><th>School</th><th>Attendance</th><th>Grade</th><th>Status</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {globalResults.map((st, i) => (
                      <tr key={st.id} onClick={() => setSelectedStudent(st)}>
                        <td>
                          <div className="stdb-student-cell">
                            <div className={`stdb-student-avatar ${AVATAR_COLORS[i % 5]}`}>{st.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                            <div className="stdb-student-info">
                              <div className="stdb-student-name">{st.name}</div>
                              <div className="stdb-student-adm">{st.admissionNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{st.className}-{st.section}</td>
                        <td>{st.schoolName}</td>
                        <td><div className="stdb-att-cell"><div className="stdb-att-bar"><div className={`stdb-att-fill ${attColor(st.attendanceRate)}`} style={{ width: `${st.attendanceRate}%` }} /></div>{st.attendanceRate}%</div></td>
                        <td><span className={`stdb-grade ${gradeClass(st.overallGrade)}`}>{st.overallGrade}</span></td>
                        <td><span className={`stdb-status stdb-status--${st.status}`}><span className="stdb-status-dot" />{st.status}</span></td>
                        <td><button className="stdb-action-btn" onClick={e => { e.stopPropagation(); setSelectedStudent(st); }}><Eye size={15} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="stdb-empty" style={{ padding: 'var(--space-8)' }}>
              <div className="stdb-empty-icon"><Search size={24} /></div>
              <h3>No students found</h3>
              <p>No results for "{globalSearch}" across all schools.</p>
            </div>
          )}
        </div>
      )}

      {/* School Selection or Student Table */}
      {!globalSearch.trim() && !selectedSchoolId && (
        <>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={18} style={{ color: 'var(--primary-500)' }} />
            Select a School to View Students
          </h3>
          <div className="stdb-school-grid">
            {allSchools.map((sch, i) => (
              <div key={sch.id} className="stdb-school-item" onClick={() => handleSelectSchool(sch.id)}>
                <div className={`stdb-school-avatar stdb-school-avatar--${i % 5}`}>
                  {sch.code.split('-')[1]?.[0] ?? 'A'}
                </div>
                <div className="stdb-school-info">
                  <div className="stdb-school-name">{sch.name}</div>
                  <div className="stdb-school-meta"><MapPin size={11} />{sch.city}, {sch.state}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="stdb-school-count">{(schoolStudentCounts[sch.id] || sch.totalStudents).toLocaleString()}</div>
                  <div className="stdb-school-count-label">students</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* School-Scoped Student View */}
      {!globalSearch.trim() && selectedSchool && (
        <>
          {/* Context Bar */}
          <div className="stdb-context-bar">
            <School size={18} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
            <span className="stdb-context-name">{selectedSchool.name} — {selectedSchool.city}</span>
            <button className="stdb-context-clear" onClick={handleClearSchool}><X size={12} /> All Schools</button>
          </div>

          {/* Toolbar */}
          <div className="stdb-toolbar">
            <div className="stdb-search">
              <Search size={16} className="stdb-search-icon" />
              <input placeholder="Search within this school..." value={localSearch} onChange={e => resetPage(() => setLocalSearch(e.target.value))} />
            </div>
            <button className={`stdb-filter-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={15} /> Filters
            </button>
            <div className="stdb-toolbar-right">
              <button className="stdb-export-btn"><Download size={15} /> Export</button>
              <button className="stdb-add-btn"><Plus size={16} /> Add Student</button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="stdb-filter-bar">
              <select className="stdb-filter-select" value={classFilter} onChange={e => resetPage(() => setClassFilter(e.target.value))}>
                <option value="all">All Classes</option>
                {CLASS_OPTIONS.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <select className="stdb-filter-select" value={genderFilter} onChange={e => resetPage(() => setGenderFilter(e.target.value))}>
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          )}

          {/* Status Chips */}
          <div className="stdb-chips">
            {(['all', 'active', 'transferred', 'graduated', 'withdrawn'] as const).map(st => {
              const cnt = st === 'all' ? schoolStudents.length : schoolStudents.filter(s => s.status === st).length;
              return (
                <button key={st} className={`stdb-chip ${statusChip === st ? 'active' : ''}`} onClick={() => resetPage(() => setStatusChip(st))}>
                  {st === 'all' ? 'All' : st.charAt(0).toUpperCase() + st.slice(1)}
                  <span className="stdb-chip-count">{cnt}</span>
                </button>
              );
            })}
          </div>

          {/* Results */}
          <div className="stdb-results-info">
            <div>Showing <span>{pagination.paginated.length}</span> of <span>{schoolStudents.length}</span> students</div>
          </div>

          {schoolStudents.length === 0 ? (
            <div className="stdb-empty">
              <div className="stdb-empty-icon"><GraduationCap size={28} /></div>
              <h3>No students found</h3>
              <p>Adjust your search or filter criteria.</p>
            </div>
          ) : (
            <div className="stdb-table-card">
              <div className="stdb-table-scroll">
                <table className="stdb-table">
                  <thead>
                    <tr><th>Student</th><th>Class</th><th>Gender</th><th>Attendance</th><th>Grade</th><th>Rank</th><th>Status</th><th>Parent</th><th></th></tr>
                  </thead>
                  <tbody>
                    {pagination.paginated.map((st, i) => (
                      <tr key={st.id} onClick={() => setSelectedStudent(st)}>
                        <td>
                          <div className="stdb-student-cell">
                            <div className={`stdb-student-avatar ${AVATAR_COLORS[i % 5]}`}>{st.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                            <div className="stdb-student-info">
                              <div className="stdb-student-name">{st.name}</div>
                              <div className="stdb-student-adm">{st.admissionNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{st.className}-{st.section}</td>
                        <td><span className="stdb-gender">{st.gender === 'male' ? '♂' : '♀'} {st.gender}</span></td>
                        <td><div className="stdb-att-cell"><div className="stdb-att-bar"><div className={`stdb-att-fill ${attColor(st.attendanceRate)}`} style={{ width: `${st.attendanceRate}%` }} /></div>{st.attendanceRate}%</div></td>
                        <td><span className={`stdb-grade ${gradeClass(st.overallGrade)}`}>{st.overallGrade}</span></td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>#{st.rank}</td>
                        <td><span className={`stdb-status stdb-status--${st.status}`}><span className="stdb-status-dot" />{st.status}</span></td>
                        <td style={{ fontSize: 'var(--text-xs)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.parentName}</td>
                        <td><button className="stdb-action-btn" onClick={e => { e.stopPropagation(); setSelectedStudent(st); }}><Eye size={15} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="stdb-pagination">
              <div className="stdb-pagination-info">Page <span>{pagination.currentPage}</span> of <span>{pagination.totalPages}</span></div>
              <div className="stdb-pagination-btns">
                <button className="stdb-page-btn" disabled={!pagination.hasPrev} onClick={pagination.prevPage}><ChevronLeft size={16} /></button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`stdb-page-btn ${p === pagination.currentPage ? 'active' : ''}`} onClick={() => pagination.goToPage(p)}>{p}</button>
                ))}
                <button className="stdb-page-btn" disabled={!pagination.hasNext} onClick={pagination.nextPage}><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="stdb-modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="stdb-modal" onClick={e => e.stopPropagation()}>
            <div className="stdb-modal-header">
              <div className="stdb-modal-profile">
                <div className="stdb-modal-avatar">{selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                <div>
                  <div className="stdb-modal-name">{selectedStudent.name}</div>
                  <div className="stdb-modal-sub">{selectedStudent.admissionNumber} · {selectedStudent.schoolName}</div>
                </div>
              </div>
              <button className="stdb-modal-close" onClick={() => setSelectedStudent(null)}><X size={16} /></button>
            </div>
            <div className="stdb-modal-body">
              <div className="stdb-modal-stats">
                <div className="stdb-modal-stat"><div className="stdb-modal-stat-value">{selectedStudent.attendanceRate}%</div><div className="stdb-modal-stat-label">Attendance</div></div>
                <div className="stdb-modal-stat"><div className="stdb-modal-stat-value">{selectedStudent.overallGrade}</div><div className="stdb-modal-stat-label">Grade</div></div>
                <div className="stdb-modal-stat"><div className="stdb-modal-stat-value">#{selectedStudent.rank}</div><div className="stdb-modal-stat-label">Class Rank</div></div>
              </div>
              <div className="stdb-modal-section">
                <div className="stdb-modal-section-title">Academic Info</div>
                <div className="stdb-detail-grid">
                  <div className="stdb-detail-item"><label>Class & Section</label><span>{selectedStudent.className}-{selectedStudent.section}</span></div>
                  <div className="stdb-detail-item"><label>Roll Number</label><span>{selectedStudent.rollNumber}</span></div>
                  <div className="stdb-detail-item"><label>School</label><span>{selectedStudent.schoolName}</span></div>
                  <div className="stdb-detail-item"><label>Status</label><span className={`stdb-status stdb-status--${selectedStudent.status}`}><span className="stdb-status-dot" />{selectedStudent.status}</span></div>
                </div>
              </div>
              <div className="stdb-modal-section">
                <div className="stdb-modal-section-title">Personal Info</div>
                <div className="stdb-detail-grid">
                  <div className="stdb-detail-item"><label>Date of Birth</label><span>{new Date(selectedStudent.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                  <div className="stdb-detail-item"><label>Gender</label><span style={{ textTransform: 'capitalize' }}>{selectedStudent.gender}</span></div>
                  <div className="stdb-detail-item"><label>Blood Group</label><span>{selectedStudent.bloodGroup || '—'}</span></div>
                  <div className="stdb-detail-item"><label>Admission No</label><span style={{ fontFamily: 'var(--font-mono)' }}>{selectedStudent.admissionNumber}</span></div>
                </div>
              </div>
              <div className="stdb-modal-section">
                <div className="stdb-modal-section-title">Parent / Guardian</div>
                <div className="stdb-detail-grid">
                  <div className="stdb-detail-item"><label>Name</label><span>{selectedStudent.parentName}</span></div>
                  <div className="stdb-detail-item"><label>Phone</label><span>{selectedStudent.parentPhone}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
