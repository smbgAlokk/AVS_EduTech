import { useState, useMemo } from 'react';
import {
  Search, SlidersHorizontal, Download, Plus, Eye, X,
  ChevronLeft, ChevronRight, GraduationCap, Users, School, Award
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import type { Student } from '../../types';
import './StudentDatabase.css';

/* ─── Mock Data ─── */
const STUDENTS: Student[] = [
  { id: 'STU001', name: 'Aarav Sharma', admissionNumber: 'ADM-2024-001', rollNumber: '01', className: 'X', section: 'A', schoolId: 'SCH001', schoolName: 'AVS Delhi', dateOfBirth: '2010-03-15', gender: 'male', parentName: 'Rajesh Sharma', parentPhone: '+91 98100 12345', attendanceRate: 96, overallGrade: 'A+', rank: 1, status: 'active', bloodGroup: 'B+' },
  { id: 'STU002', name: 'Priya Patel', admissionNumber: 'ADM-2024-002', rollNumber: '02', className: 'X', section: 'A', schoolId: 'SCH001', schoolName: 'AVS Delhi', dateOfBirth: '2010-07-22', gender: 'female', parentName: 'Vikram Patel', parentPhone: '+91 98100 23456', attendanceRate: 94, overallGrade: 'A+', rank: 2, status: 'active', bloodGroup: 'O+' },
  { id: 'STU003', name: 'Arjun Reddy', admissionNumber: 'ADM-2024-003', rollNumber: '03', className: 'IX', section: 'B', schoolId: 'SCH006', schoolName: 'AVS Bangalore', dateOfBirth: '2011-01-10', gender: 'male', parentName: 'Suresh Reddy', parentPhone: '+91 98800 34567', attendanceRate: 91, overallGrade: 'A', rank: 5, status: 'active', bloodGroup: 'A+' },
  { id: 'STU004', name: 'Ananya Iyer', admissionNumber: 'ADM-2024-004', rollNumber: '04', className: 'VIII', section: 'A', schoolId: 'SCH003', schoolName: 'AVS Mumbai', dateOfBirth: '2012-05-18', gender: 'female', parentName: 'Ramesh Iyer', parentPhone: '+91 98200 45678', attendanceRate: 98, overallGrade: 'A+', rank: 1, status: 'active', bloodGroup: 'AB+' },
  { id: 'STU005', name: 'Kabir Singh', admissionNumber: 'ADM-2024-005', rollNumber: '05', className: 'X', section: 'B', schoolId: 'SCH001', schoolName: 'AVS Delhi', dateOfBirth: '2010-11-03', gender: 'male', parentName: 'Harpreet Singh', parentPhone: '+91 98100 56789', attendanceRate: 78, overallGrade: 'B', rank: 18, status: 'active', bloodGroup: 'O-' },
  { id: 'STU006', name: 'Meera Nair', admissionNumber: 'ADM-2023-006', rollNumber: '06', className: 'XII', section: 'A', schoolId: 'SCH007', schoolName: 'AVS Chennai', dateOfBirth: '2008-09-25', gender: 'female', parentName: 'Gopinath Nair', parentPhone: '+91 98400 67890', attendanceRate: 95, overallGrade: 'A', rank: 3, status: 'active', bloodGroup: 'B-' },
  { id: 'STU007', name: 'Rohan Gupta', admissionNumber: 'ADM-2024-007', rollNumber: '07', className: 'VII', section: 'C', schoolId: 'SCH002', schoolName: 'AVS Lucknow', dateOfBirth: '2013-02-14', gender: 'male', parentName: 'Alok Gupta', parentPhone: '+91 98390 78901', attendanceRate: 88, overallGrade: 'B+', rank: 8, status: 'active', bloodGroup: 'A-' },
  { id: 'STU008', name: 'Diya Deshmukh', admissionNumber: 'ADM-2024-008', rollNumber: '08', className: 'IX', section: 'A', schoolId: 'SCH005', schoolName: 'AVS Pune', dateOfBirth: '2011-06-30', gender: 'female', parentName: 'Anil Deshmukh', parentPhone: '+91 98500 89012', attendanceRate: 92, overallGrade: 'A', rank: 4, status: 'active', bloodGroup: 'O+' },
  { id: 'STU009', name: 'Vivaan Joshi', admissionNumber: 'ADM-2022-009', rollNumber: '09', className: 'XI', section: 'A', schoolId: 'SCH004', schoolName: 'AVS Jaipur', dateOfBirth: '2009-08-08', gender: 'male', parentName: 'Prakash Joshi', parentPhone: '+91 98290 90123', attendanceRate: 72, overallGrade: 'C', rank: 32, status: 'active', bloodGroup: 'B+' },
  { id: 'STU010', name: 'Ishita Banerjee', admissionNumber: 'ADM-2024-010', rollNumber: '10', className: 'VI', section: 'B', schoolId: 'SCH008', schoolName: 'AVS Kolkata', dateOfBirth: '2014-12-01', gender: 'female', parentName: 'Soumya Banerjee', parentPhone: '+91 98300 01234', attendanceRate: 97, overallGrade: 'A+', rank: 1, status: 'active', bloodGroup: 'AB-' },
  { id: 'STU011', name: 'Aditya Verma', admissionNumber: 'ADM-2023-011', rollNumber: '11', className: 'X', section: 'A', schoolId: 'SCH009', schoolName: 'AVS Kanpur', dateOfBirth: '2010-04-20', gender: 'male', parentName: 'Sanjay Verma', parentPhone: '+91 98390 11234', attendanceRate: 68, overallGrade: 'C', rank: 35, status: 'active', bloodGroup: 'A+' },
  { id: 'STU012', name: 'Saanvi Kulkarni', admissionNumber: 'ADM-2024-012', rollNumber: '12', className: 'VIII', section: 'A', schoolId: 'SCH005', schoolName: 'AVS Pune', dateOfBirth: '2012-10-12', gender: 'female', parentName: 'Mahesh Kulkarni', parentPhone: '+91 98500 22345', attendanceRate: 93, overallGrade: 'A', rank: 3, status: 'active', bloodGroup: 'O+' },
  { id: 'STU013', name: 'Reyansh Kumar', admissionNumber: 'ADM-2021-013', rollNumber: '13', className: 'XII', section: 'B', schoolId: 'SCH001', schoolName: 'AVS Delhi', dateOfBirth: '2008-07-05', gender: 'male', parentName: 'Manoj Kumar', parentPhone: '+91 98100 33456', attendanceRate: 90, overallGrade: 'B+', rank: 10, status: 'graduated', bloodGroup: 'B+' },
  { id: 'STU014', name: 'Tara Kaur', admissionNumber: 'ADM-2024-014', rollNumber: '14', className: 'V', section: 'A', schoolId: 'SCH015', schoolName: 'AVS Chandigarh', dateOfBirth: '2015-03-28', gender: 'female', parentName: 'Gurpreet Kaur', parentPhone: '+91 98720 44567', attendanceRate: 99, overallGrade: 'A+', rank: 1, status: 'active', bloodGroup: 'O+' },
  { id: 'STU015', name: 'Arnav Tiwari', admissionNumber: 'ADM-2023-015', rollNumber: '15', className: 'IX', section: 'A', schoolId: 'SCH002', schoolName: 'AVS Lucknow', dateOfBirth: '2011-11-17', gender: 'male', parentName: 'Rakesh Tiwari', parentPhone: '+91 98390 55678', attendanceRate: 85, overallGrade: 'B', rank: 14, status: 'active', bloodGroup: 'A+' },
  { id: 'STU016', name: 'Navya Rao', admissionNumber: 'ADM-2024-016', rollNumber: '16', className: 'VII', section: 'A', schoolId: 'SCH012', schoolName: 'AVS Hyderabad', dateOfBirth: '2013-09-09', gender: 'female', parentName: 'Venkat Rao', parentPhone: '+91 98490 66789', attendanceRate: 94, overallGrade: 'A', rank: 2, status: 'active', bloodGroup: 'B+' },
  { id: 'STU017', name: 'Dhruv Saxena', admissionNumber: 'ADM-2022-017', rollNumber: '17', className: 'XI', section: 'A', schoolId: 'SCH011', schoolName: 'AVS Noida', dateOfBirth: '2009-01-30', gender: 'male', parentName: 'Nitin Saxena', parentPhone: '+91 98180 77890', attendanceRate: 91, overallGrade: 'A', rank: 5, status: 'active', bloodGroup: 'AB+' },
  { id: 'STU018', name: 'Myra Choudhury', admissionNumber: 'ADM-2023-018', rollNumber: '18', className: 'X', section: 'A', schoolId: 'SCH003', schoolName: 'AVS Mumbai', dateOfBirth: '2010-06-14', gender: 'female', parentName: 'Debashish Choudhury', parentPhone: '+91 98200 88901', attendanceRate: 87, overallGrade: 'B+', rank: 9, status: 'transferred', bloodGroup: 'O-' },
  { id: 'STU019', name: 'Vihaan Patel', admissionNumber: 'ADM-2024-019', rollNumber: '19', className: 'VI', section: 'A', schoolId: 'SCH013', schoolName: 'AVS Ahmedabad', dateOfBirth: '2014-04-05', gender: 'male', parentName: 'Ketan Patel', parentPhone: '+91 98790 99012', attendanceRate: 93, overallGrade: 'A', rank: 3, status: 'active', bloodGroup: 'B+' },
  { id: 'STU020', name: 'Anika Mishra', admissionNumber: 'ADM-2024-020', rollNumber: '20', className: 'VIII', section: 'B', schoolId: 'SCH010', schoolName: 'AVS Patna', dateOfBirth: '2012-08-22', gender: 'female', parentName: 'Sunil Mishra', parentPhone: '+91 98350 10123', attendanceRate: 81, overallGrade: 'B', rank: 15, status: 'active', bloodGroup: 'A-' },
];

const SCHOOL_NAMES = [...new Set(STUDENTS.map(s => s.schoolName))].sort();
const CLASS_OPTIONS = [...new Set(STUDENTS.map(s => s.className))].sort((a, b) => {
  const rom: Record<string, number> = { 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10, 'XI': 11, 'XII': 12 };
  return (rom[a] || 0) - (rom[b] || 0);
});
const AVATAR_COLORS = ['stdb-avatar--green', 'stdb-avatar--pink', 'stdb-avatar--blue', 'stdb-avatar--amber', 'stdb-avatar--purple'];
const PER_PAGE = 10;

export default function StudentDatabase() {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusChip, setStatusChip] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const statusCounts = useMemo(() => ({
    all: STUDENTS.length,
    active: STUDENTS.filter(s => s.status === 'active').length,
    transferred: STUDENTS.filter(s => s.status === 'transferred').length,
    graduated: STUDENTS.filter(s => s.status === 'graduated').length,
    withdrawn: STUDENTS.filter(s => s.status === 'withdrawn').length,
  }), []);

  const filtered = useMemo(() => {
    let data = [...STUDENTS];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(s => s.name.toLowerCase().includes(q) || s.admissionNumber.toLowerCase().includes(q) || s.schoolName.toLowerCase().includes(q) || s.parentName.toLowerCase().includes(q));
    }
    if (statusChip !== 'all') data = data.filter(s => s.status === statusChip);
    if (schoolFilter !== 'all') data = data.filter(s => s.schoolName === schoolFilter);
    if (classFilter !== 'all') data = data.filter(s => s.className === classFilter);
    if (genderFilter !== 'all') data = data.filter(s => s.gender === genderFilter);
    data.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }, [search, statusChip, schoolFilter, classFilter, genderFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetPage = (fn: () => void) => { fn(); setPage(1); };
  const attColor = (r: number) => r >= 85 ? 'stdb-att-fill--green' : r >= 75 ? 'stdb-att-fill--yellow' : 'stdb-att-fill--red';
  const gradeClass = (g: string) => g.startsWith('A') ? 'stdb-grade--A' : g.startsWith('B') ? 'stdb-grade--B' : g.startsWith('C') ? 'stdb-grade--C' : 'stdb-grade--D';

  const hasFilters = schoolFilter !== 'all' || classFilter !== 'all' || genderFilter !== 'all' || search.trim() !== '';

  const clearAll = () => { setSearch(''); setSchoolFilter('all'); setClassFilter('all'); setGenderFilter('all'); setStatusChip('all'); setPage(1); };

  const avgAtt = Math.round(STUDENTS.reduce((s, st) => s + st.attendanceRate, 0) / STUDENTS.length);
  const topGrade = STUDENTS.filter(s => s.overallGrade.startsWith('A')).length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="sa-welcome">
          <div>
            <h1 className="page-title">Student Database</h1>
            <p className="page-subtitle">Centralised student records across all {SCHOOL_NAMES.length} schools in the AVS network.</p>
          </div>
          <div className="sa-welcome-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard title="Total Students" value={STUDENTS.length.toLocaleString()} subtitle={`${statusCounts.active} active`} icon={<GraduationCap size={22} />} trend={{ value: 5.8, label: 'vs last year' }} color="primary" />
        <StatCard title="Schools Covered" value={SCHOOL_NAMES.length.toString()} subtitle="Across India" icon={<School size={22} />} color="accent" />
        <StatCard title="Avg. Attendance" value={`${avgAtt}%`} subtitle="Network wide" icon={<Users size={22} />} progress={{ current: avgAtt, total: 100 }} color="success" />
        <StatCard title="A-Grade Students" value={topGrade.toString()} subtitle={`${Math.round((topGrade / STUDENTS.length) * 100)}% of total`} icon={<Award size={22} />} trend={{ value: 3.2, label: 'this term' }} color="info" />
      </div>

      {/* Toolbar */}
      <div className="stdb-toolbar">
        <div className="stdb-search">
          <Search size={16} className="stdb-search-icon" />
          <input placeholder="Search by name, admission no, school or parent..." value={search} onChange={e => resetPage(() => setSearch(e.target.value))} />
        </div>
        <button className={`stdb-filter-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={15} /> Filters
          {hasFilters && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-500)' }} />}
        </button>
        <div className="stdb-toolbar-right">
          <button className="stdb-export-btn"><Download size={15} /> Export</button>
          <button className="stdb-add-btn"><Plus size={16} /> Add Student</button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="stdb-filter-bar">
          <select className="stdb-filter-select" value={schoolFilter} onChange={e => resetPage(() => setSchoolFilter(e.target.value))}>
            <option value="all">All Schools</option>
            {SCHOOL_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="stdb-filter-select" value={classFilter} onChange={e => resetPage(() => setClassFilter(e.target.value))}>
            <option value="all">All Classes</option>
            {CLASS_OPTIONS.map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
          <select className="stdb-filter-select" value={genderFilter} onChange={e => resetPage(() => setGenderFilter(e.target.value))}>
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {hasFilters && <button className="stdb-clear-filters" onClick={clearAll}><X size={14} style={{ verticalAlign: -2, marginRight: 4 }} />Clear All</button>}
        </div>
      )}

      {/* Status Chips */}
      <div className="stdb-chips">
        {(['all', 'active', 'transferred', 'graduated', 'withdrawn'] as const).map(st => (
          <button key={st} className={`stdb-chip ${statusChip === st ? 'active' : ''}`} onClick={() => resetPage(() => setStatusChip(st))}>
            {st === 'all' ? 'All Students' : st.charAt(0).toUpperCase() + st.slice(1)}
            <span className="stdb-chip-count">{statusCounts[st]}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="stdb-results-info">
        <div>Showing <span>{paginated.length}</span> of <span>{filtered.length}</span> students</div>
      </div>

      {filtered.length === 0 ? (
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
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>School</th>
                  <th>Gender</th>
                  <th>Attendance</th>
                  <th>Grade</th>
                  <th>Rank</th>
                  <th>Status</th>
                  <th>Parent</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((st, i) => (
                  <tr key={st.id} onClick={() => setSelectedStudent(st)}>
                    <td>
                      <div className="stdb-student-cell">
                        <div className={`stdb-student-avatar ${AVATAR_COLORS[i % 5]}`}>
                          {st.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="stdb-student-info">
                          <div className="stdb-student-name">{st.name}</div>
                          <div className="stdb-student-adm">{st.admissionNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{st.className}-{st.section}</td>
                    <td>{st.schoolName}</td>
                    <td><span className="stdb-gender">{st.gender === 'male' ? '♂' : '♀'} {st.gender}</span></td>
                    <td>
                      <div className="stdb-att-cell">
                        <div className="stdb-att-bar"><div className={`stdb-att-fill ${attColor(st.attendanceRate)}`} style={{ width: `${st.attendanceRate}%` }} /></div>
                        {st.attendanceRate}%
                      </div>
                    </td>
                    <td><span className={`stdb-grade ${gradeClass(st.overallGrade)}`}>{st.overallGrade}</span></td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>#{st.rank}</td>
                    <td><span className={`stdb-status stdb-status--${st.status}`}><span className="stdb-status-dot" />{st.status}</span></td>
                    <td style={{ fontSize: 'var(--text-xs)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.parentName}</td>
                    <td>
                      <button className="stdb-action-btn" title="View Profile" onClick={e => { e.stopPropagation(); setSelectedStudent(st); }}>
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="stdb-pagination">
          <div className="stdb-pagination-info">Page <span>{page}</span> of <span>{totalPages}</span></div>
          <div className="stdb-pagination-btns">
            <button className="stdb-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`stdb-page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="stdb-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="stdb-modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="stdb-modal" onClick={e => e.stopPropagation()}>
            <div className="stdb-modal-header">
              <div className="stdb-modal-profile">
                <div className="stdb-modal-avatar">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="stdb-modal-name">{selectedStudent.name}</div>
                  <div className="stdb-modal-sub">{selectedStudent.admissionNumber} · {selectedStudent.schoolName}</div>
                </div>
              </div>
              <button className="stdb-modal-close" onClick={() => setSelectedStudent(null)}><X size={16} /></button>
            </div>

            <div className="stdb-modal-body">
              <div className="stdb-modal-stats">
                <div className="stdb-modal-stat">
                  <div className="stdb-modal-stat-value">{selectedStudent.attendanceRate}%</div>
                  <div className="stdb-modal-stat-label">Attendance</div>
                </div>
                <div className="stdb-modal-stat">
                  <div className="stdb-modal-stat-value">{selectedStudent.overallGrade}</div>
                  <div className="stdb-modal-stat-label">Grade</div>
                </div>
                <div className="stdb-modal-stat">
                  <div className="stdb-modal-stat-value">#{selectedStudent.rank}</div>
                  <div className="stdb-modal-stat-label">Class Rank</div>
                </div>
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
