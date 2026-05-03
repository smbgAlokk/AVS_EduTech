import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, LayoutGrid, List, Plus, MapPin,
  Eye, MoreVertical, Phone, Mail, Users, GraduationCap,
  ChevronLeft, ChevronRight, School, X, Building2, Star
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import type { School as SchoolType } from '../../types';
import './SchoolsDirectory.css';

/* ─── Mock Data ─── */
const SCHOOLS: SchoolType[] = [
  { id: 'SCH001', name: 'AVS Vidyalaya - Delhi', code: 'AVS-DEL', city: 'New Delhi', state: 'Delhi', principal: 'Dr. Ananya Sharma', totalStudents: 1450, totalTeachers: 82, attendanceRate: 94, feeCollectionRate: 91, status: 'active', address: 'Sector 14, Dwarka, New Delhi - 110075', phone: '+91 11 2804 5500', email: 'delhi@avsvidyalaya.edu.in', establishedYear: 2005 },
  { id: 'SCH002', name: 'AVS Vidyalaya - Lucknow', code: 'AVS-LKO', city: 'Lucknow', state: 'Uttar Pradesh', principal: 'Mr. Rajesh Tiwari', totalStudents: 890, totalTeachers: 54, attendanceRate: 91, feeCollectionRate: 85, status: 'active', address: 'Gomti Nagar, Lucknow - 226010', phone: '+91 522 271 0044', email: 'lucknow@avsvidyalaya.edu.in', establishedYear: 2008 },
  { id: 'SCH003', name: 'AVS Vidyalaya - Mumbai', code: 'AVS-MUM', city: 'Mumbai', state: 'Maharashtra', principal: 'Mrs. Priya Deshmukh', totalStudents: 1180, totalTeachers: 68, attendanceRate: 89, feeCollectionRate: 93, status: 'active', address: 'Andheri West, Mumbai - 400053', phone: '+91 22 2635 8800', email: 'mumbai@avsvidyalaya.edu.in', establishedYear: 2006 },
  { id: 'SCH004', name: 'AVS Vidyalaya - Jaipur', code: 'AVS-JAI', city: 'Jaipur', state: 'Rajasthan', principal: 'Mr. Vikram Singh', totalStudents: 720, totalTeachers: 42, attendanceRate: 88, feeCollectionRate: 79, status: 'active', address: 'Mansarovar, Jaipur - 302020', phone: '+91 141 278 0066', email: 'jaipur@avsvidyalaya.edu.in', establishedYear: 2010 },
  { id: 'SCH005', name: 'AVS Vidyalaya - Pune', code: 'AVS-PUN', city: 'Pune', state: 'Maharashtra', principal: 'Dr. Meera Kulkarni', totalStudents: 980, totalTeachers: 58, attendanceRate: 92, feeCollectionRate: 88, status: 'active', address: 'Kothrud, Pune - 411038', phone: '+91 20 2543 7700', email: 'pune@avsvidyalaya.edu.in', establishedYear: 2007 },
  { id: 'SCH006', name: 'AVS Vidyalaya - Bangalore', code: 'AVS-BLR', city: 'Bangalore', state: 'Karnataka', principal: 'Mrs. Lakshmi Rao', totalStudents: 1450, totalTeachers: 85, attendanceRate: 95, feeCollectionRate: 96, status: 'active', address: 'Koramangala, Bangalore - 560034', phone: '+91 80 4125 6600', email: 'bangalore@avsvidyalaya.edu.in', establishedYear: 2004 },
  { id: 'SCH007', name: 'AVS Vidyalaya - Chennai', code: 'AVS-CHN', city: 'Chennai', state: 'Tamil Nadu', principal: 'Mr. Karthik Subramanian', totalStudents: 860, totalTeachers: 50, attendanceRate: 87, feeCollectionRate: 82, status: 'active', address: 'T. Nagar, Chennai - 600017', phone: '+91 44 2434 7700', email: 'chennai@avsvidyalaya.edu.in', establishedYear: 2009 },
  { id: 'SCH008', name: 'AVS Vidyalaya - Kolkata', code: 'AVS-KOL', city: 'Kolkata', state: 'West Bengal', principal: 'Dr. Arup Banerjee', totalStudents: 640, totalTeachers: 38, attendanceRate: 86, feeCollectionRate: 78, status: 'active', address: 'Salt Lake, Kolkata - 700091', phone: '+91 33 2358 4400', email: 'kolkata@avsvidyalaya.edu.in', establishedYear: 2011 },
  { id: 'SCH009', name: 'AVS Vidyalaya - Kanpur', code: 'AVS-KNP', city: 'Kanpur', state: 'Uttar Pradesh', principal: 'Mr. Sanjay Verma', totalStudents: 520, totalTeachers: 32, attendanceRate: 72, feeCollectionRate: 68, status: 'active', address: 'Swaroop Nagar, Kanpur - 208002', phone: '+91 512 253 1100', email: 'kanpur@avsvidyalaya.edu.in', establishedYear: 2013 },
  { id: 'SCH010', name: 'AVS Vidyalaya - Patna', code: 'AVS-PAT', city: 'Patna', state: 'Bihar', principal: 'Mrs. Sunita Kumari', totalStudents: 480, totalTeachers: 28, attendanceRate: 83, feeCollectionRate: 71, status: 'active', address: 'Boring Road, Patna - 800001', phone: '+91 612 222 0055', email: 'patna@avsvidyalaya.edu.in', establishedYear: 2014 },
  { id: 'SCH011', name: 'AVS Vidyalaya - Noida', code: 'AVS-NOI', city: 'Noida', state: 'Uttar Pradesh', principal: 'Dr. Amit Gupta', totalStudents: 1120, totalTeachers: 65, attendanceRate: 93, feeCollectionRate: 90, status: 'active', address: 'Sector 62, Noida - 201301', phone: '+91 120 429 8800', email: 'noida@avsvidyalaya.edu.in', establishedYear: 2006 },
  { id: 'SCH012', name: 'AVS Vidyalaya - Hyderabad', code: 'AVS-HYD', city: 'Hyderabad', state: 'Telangana', principal: 'Mrs. Revathi Reddy', totalStudents: 1050, totalTeachers: 62, attendanceRate: 90, feeCollectionRate: 87, status: 'active', address: 'Banjara Hills, Hyderabad - 500034', phone: '+91 40 2355 7700', email: 'hyderabad@avsvidyalaya.edu.in', establishedYear: 2008 },
  { id: 'SCH013', name: 'AVS Vidyalaya - Ahmedabad', code: 'AVS-AMD', city: 'Ahmedabad', state: 'Gujarat', principal: 'Mr. Devendra Patel', totalStudents: 780, totalTeachers: 45, attendanceRate: 91, feeCollectionRate: 84, status: 'active', address: 'SG Highway, Ahmedabad - 380054', phone: '+91 79 2687 3300', email: 'ahmedabad@avsvidyalaya.edu.in', establishedYear: 2010 },
  { id: 'SCH014', name: 'AVS Vidyalaya - Indore', code: 'AVS-IND', city: 'Indore', state: 'Madhya Pradesh', principal: 'Mr. Ashok Joshi', totalStudents: 540, totalTeachers: 30, attendanceRate: 85, feeCollectionRate: 76, status: 'inactive', address: 'Vijay Nagar, Indore - 452010', phone: '+91 731 255 4400', email: 'indore@avsvidyalaya.edu.in', establishedYear: 2015 },
  { id: 'SCH015', name: 'AVS Vidyalaya - Chandigarh', code: 'AVS-CHD', city: 'Chandigarh', state: 'Chandigarh', principal: 'Dr. Harmeet Kaur', totalStudents: 920, totalTeachers: 55, attendanceRate: 94, feeCollectionRate: 92, status: 'active', address: 'Sector 17, Chandigarh - 160017', phone: '+91 172 274 6600', email: 'chandigarh@avsvidyalaya.edu.in', establishedYear: 2007 },
];

const STATES = [...new Set(SCHOOLS.map(s => s.state))].sort();
const AVATAR_COLORS = ['', 'sd-card-avatar--pink', 'sd-card-avatar--blue', 'sd-card-avatar--amber'];
const ITEMS_PER_PAGE = 9;

export default function SchoolsDirectory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'students' | 'attendance' | 'fee'>('name');
  const [currentPage, setCurrentPage] = useState(1);

  /* ─── Filtered + sorted data ─── */
  const filtered = useMemo(() => {
    let data = [...SCHOOLS];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.principal.toLowerCase().includes(q)
      );
    }

    // Status
    if (statusFilter !== 'all') data = data.filter(s => s.status === statusFilter);

    // State
    if (stateFilter !== 'all') data = data.filter(s => s.state === stateFilter);

    // Sort
    data.sort((a, b) => {
      switch (sortBy) {
        case 'students': return b.totalStudents - a.totalStudents;
        case 'attendance': return b.attendanceRate - a.attendanceRate;
        case 'fee': return b.feeCollectionRate - a.feeCollectionRate;
        default: return a.name.localeCompare(b.name);
      }
    });

    return data;
  }, [searchQuery, statusFilter, stateFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset to page 1 on filter change
  const handleFilterChange = (fn: () => void) => { fn(); setCurrentPage(1); };

  const getRateColor = (rate: number) => rate >= 85 ? 'sd-rate-fill--green' : rate >= 75 ? 'sd-rate-fill--yellow' : 'sd-rate-fill--red';

  const totalStudents = SCHOOLS.reduce((s, sc) => s + sc.totalStudents, 0);
  const totalTeachers = SCHOOLS.reduce((s, sc) => s + sc.totalTeachers, 0);
  const avgAttendance = Math.round(SCHOOLS.reduce((s, sc) => s + sc.attendanceRate, 0) / SCHOOLS.length);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setStateFilter('all');
    setSortBy('name');
    setCurrentPage(1);
  };

  const hasActiveFilters = statusFilter !== 'all' || stateFilter !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="sa-welcome">
          <div>
            <h1 className="page-title">Schools Directory</h1>
            <p className="page-subtitle">Manage and monitor all {SCHOOLS.length} schools across the AVS network.</p>
          </div>
          <div className="sa-welcome-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard title="Total Schools" value={SCHOOLS.length.toString()} subtitle={`${SCHOOLS.filter(s => s.status === 'active').length} active`} icon={<School size={22} />} trend={{ value: 4.7, label: 'this year' }} color="primary" />
        <StatCard title="Total Students" value={totalStudents.toLocaleString()} subtitle="Across all branches" icon={<GraduationCap size={22} />} trend={{ value: 5.8, label: 'vs last year' }} color="accent" />
        <StatCard title="Total Teachers" value={totalTeachers.toLocaleString()} subtitle="98% active" icon={<Users size={22} />} trend={{ value: 2.1, label: 'vs last year' }} color="info" />
        <StatCard title="Avg. Attendance" value={`${avgAttendance}%`} subtitle="Network wide" icon={<Star size={22} />} progress={{ current: avgAttendance, total: 100 }} color="success" />
      </div>

      {/* Toolbar */}
      <div className="sd-toolbar">
        <div className="sd-search">
          <Search size={16} className="sd-search-icon" />
          <input
            type="text"
            placeholder="Search by name, code, city, or principal..."
            value={searchQuery}
            onChange={e => handleFilterChange(() => setSearchQuery(e.target.value))}
          />
        </div>

        <button className={`sd-filter-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-500)' }} />}
        </button>

        <div className="sd-toolbar-right">
          <div className="sd-view-toggle">
            <button className={`sd-view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} title="Grid View">
              <LayoutGrid size={16} />
            </button>
            <button className={`sd-view-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')} title="Table View">
              <List size={16} />
            </button>
          </div>
          <button className="sd-add-btn">
            <Plus size={16} />
            Add School
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="sd-filter-bar">
          <select className="sd-filter-select" value={statusFilter} onChange={e => handleFilterChange(() => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive'))}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select className="sd-filter-select" value={stateFilter} onChange={e => handleFilterChange(() => setStateFilter(e.target.value))}>
            <option value="all">All States</option>
            {STATES.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
          <select className="sd-filter-select" value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
            <option value="name">Sort: Name</option>
            <option value="students">Sort: Most Students</option>
            <option value="attendance">Sort: Best Attendance</option>
            <option value="fee">Sort: Highest Fee Collection</option>
          </select>
          {hasActiveFilters && (
            <button className="sd-clear-filters" onClick={clearFilters}>
              <X size={14} style={{ verticalAlign: -2, marginRight: 4 }} />
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Results info */}
      <div className="sd-results-info">
        <div className="sd-results-count">
          Showing <span>{paginated.length}</span> of <span>{filtered.length}</span> schools
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="sd-empty">
          <div className="sd-empty-icon"><Building2 size={28} /></div>
          <h3>No schools found</h3>
          <p>Try adjusting your search or filter criteria to find what you're looking for.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ─── Grid View ─── */
        <div className="sd-grid">
          {paginated.map((school, i) => (
            <div
              key={school.id}
              className="sd-school-card"
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => navigate(`/super-admin/schools/${school.id}`)}
            >
              <div className="sd-card-header">
                <div className={`sd-card-avatar ${AVATAR_COLORS[i % 4]}`}>
                  {school.code.split('-')[1]?.[0] ?? 'A'}
                </div>
                <div className="sd-card-info">
                  <div className="sd-card-name">{school.name}</div>
                  <span className="sd-card-code">{school.code}</span>
                  <div className="sd-card-location">
                    <MapPin size={11} />
                    {school.city}, {school.state}
                  </div>
                </div>
                <div className="sd-card-status">
                  <span className={`sd-status sd-status--${school.status}`}>
                    <span className="sd-status-dot" />
                    {school.status}
                  </span>
                </div>
              </div>

              <div className="sd-card-stats">
                <div className="sd-card-stat">
                  <div className="sd-card-stat-value">{school.totalStudents.toLocaleString()}</div>
                  <div className="sd-card-stat-label">Students</div>
                </div>
                <div className="sd-card-stat">
                  <div className="sd-card-stat-value">{school.totalTeachers}</div>
                  <div className="sd-card-stat-label">Teachers</div>
                </div>
                <div className="sd-card-stat">
                  <div className="sd-card-stat-value">{school.attendanceRate}%</div>
                  <div className="sd-card-stat-label">Attendance</div>
                </div>
                <div className="sd-card-stat">
                  <div className="sd-card-stat-value">{school.feeCollectionRate}%</div>
                  <div className="sd-card-stat-label">Fee Collection</div>
                </div>
              </div>

              <div className="sd-card-footer">
                <div className="sd-card-principal">
                  <div className="sd-card-principal-avatar">
                    {school.principal.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  {school.principal}
                </div>
                <div className="sd-card-actions">
                  <button className="sd-card-action-btn" title="View Details" onClick={e => { e.stopPropagation(); navigate(`/super-admin/schools/${school.id}`); }}>
                    <Eye size={15} />
                  </button>
                  <button className="sd-card-action-btn" title="More Options" onClick={e => e.stopPropagation()}>
                    <MoreVertical size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ─── Table View ─── */
        <div className="sd-table-card">
          <div className="table-container">
            <table className="sd-table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Code</th>
                  <th>City</th>
                  <th>Students</th>
                  <th>Teachers</th>
                  <th>Attendance</th>
                  <th>Fee Collection</th>
                  <th>Status</th>
                  <th>Principal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((school, i) => (
                  <tr key={school.id} onClick={() => navigate(`/super-admin/schools/${school.id}`)}>
                    <td>
                      <div className="sd-table-name">
                        <div className={`sd-table-avatar`} style={i % 3 === 1 ? { background: 'linear-gradient(135deg, var(--accent-400), var(--accent-600))' } : i % 3 === 2 ? { background: 'linear-gradient(135deg, #60A5FA, #3B82F6)' } : undefined}>
                          {school.code.split('-')[1]?.[0] ?? 'A'}
                        </div>
                        {school.name}
                      </div>
                    </td>
                    <td><span className="sd-card-code">{school.code}</span></td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{school.city}</span></td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{school.totalStudents.toLocaleString()}</td>
                    <td>{school.totalTeachers}</td>
                    <td>
                      <div className="sd-rate">
                        <div className="sd-rate-bar">
                          <div className={`sd-rate-fill ${getRateColor(school.attendanceRate)}`} style={{ width: `${school.attendanceRate}%` }} />
                        </div>
                        {school.attendanceRate}%
                      </div>
                    </td>
                    <td>
                      <div className="sd-rate">
                        <div className="sd-rate-bar">
                          <div className={`sd-rate-fill ${getRateColor(school.feeCollectionRate)}`} style={{ width: `${school.feeCollectionRate}%` }} />
                        </div>
                        {school.feeCollectionRate}%
                      </div>
                    </td>
                    <td>
                      <span className={`sd-status sd-status--${school.status}`}>
                        <span className="sd-status-dot" />
                        {school.status}
                      </span>
                    </td>
                    <td>{school.principal}</td>
                    <td>
                      <div className="sd-table-actions">
                        <button className="sd-card-action-btn" title="View" onClick={e => { e.stopPropagation(); navigate(`/super-admin/schools/${school.id}`); }}>
                          <Eye size={15} />
                        </button>
                      </div>
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
        <div className="sd-pagination">
          <div className="sd-pagination-info">
            Page <span>{currentPage}</span> of <span>{totalPages}</span>
          </div>
          <div className="sd-pagination-btns">
            <button className="sd-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} className={`sd-page-btn ${page === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>
                {page}
              </button>
            ))}
            <button className="sd-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
