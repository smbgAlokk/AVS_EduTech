import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, LayoutGrid, List, Plus, MapPin,
  Eye, MoreVertical, Users, GraduationCap,
  ChevronLeft, ChevronRight, School, X, Building2, Star, Video
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import InspectionModal from '../../components/ui/InspectionModal';
import { getSchools, getSchoolStates, getSchoolNetworkStats } from '../../data/schools';
import { useSchoolsFilter } from '../../hooks/useSchoolsFilter';
import { usePagination } from '../../hooks/usePagination';
import type { School as SchoolType } from '../../types';
import './SchoolsDirectory.css';

/* ─── Data from centralised data layer ─── */
const schools = getSchools();
const STATES = getSchoolStates();
const AVATAR_COLORS = ['', 'sd-card-avatar--pink', 'sd-card-avatar--blue', 'sd-card-avatar--amber'];

export default function SchoolsDirectory() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [inspectionSchool, setInspectionSchool] = useState<SchoolType | null>(null);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);

  /* ─── Hooks for filtering + pagination ─── */
  const filter = useSchoolsFilter(schools);
  const pagination = usePagination(filter.filtered, 9);

  const handleInspection = (school: SchoolType, e: React.MouseEvent) => {
    e.stopPropagation();
    setInspectionSchool(school);
    setIsInspectionOpen(true);
  };

  /* Reset page to 1 when filters change */
  const handleFilterChange = (fn: () => void) => { fn(); pagination.resetPage(); };

  const getRateColor = (rate: number) => rate >= 85 ? 'sd-rate-fill--green' : rate >= 75 ? 'sd-rate-fill--yellow' : 'sd-rate-fill--red';

  const stats = getSchoolNetworkStats();

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="sa-welcome">
          <div>
            <h1 className="page-title">Schools Directory</h1>
            <p className="page-subtitle">Manage and monitor all {stats.totalSchools} schools across the AVS network.</p>
          </div>
          <div className="sa-welcome-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard title="Total Schools" value={stats.totalSchools.toString()} subtitle={`${stats.activeSchools} active`} icon={<School size={22} />} trend={{ value: 4.7, label: 'this year' }} color="primary" />
        <StatCard title="Total Students" value={stats.totalStudents.toLocaleString()} subtitle="Across all branches" icon={<GraduationCap size={22} />} trend={{ value: 5.8, label: 'vs last year' }} color="accent" />
        <StatCard title="Total Teachers" value={stats.totalTeachers.toLocaleString()} subtitle="98% active" icon={<Users size={22} />} trend={{ value: 2.1, label: 'vs last year' }} color="info" />
        <StatCard title="Avg. Attendance" value={`${stats.avgAttendance}%`} subtitle="Network wide" icon={<Star size={22} />} progress={{ current: stats.avgAttendance, total: 100 }} color="success" />
      </div>

      {/* Toolbar */}
      <div className="sd-toolbar">
        <div className="sd-search">
          <Search size={16} className="sd-search-icon" />
          <input
            type="text"
            placeholder="Search by name, code, city, or principal..."
            value={filter.searchQuery}
            onChange={e => handleFilterChange(() => filter.setSearchQuery(e.target.value))}
          />
        </div>

        <button className={`sd-filter-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={15} />
          Filters
          {filter.hasActiveFilters && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-500)' }} />}
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
          <select className="sd-filter-select" value={filter.statusFilter} onChange={e => handleFilterChange(() => filter.setStatusFilter(e.target.value as 'all' | 'active' | 'inactive'))}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select className="sd-filter-select" value={filter.stateFilter} onChange={e => handleFilterChange(() => filter.setStateFilter(e.target.value))}>
            <option value="all">All States</option>
            {STATES.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
          <select className="sd-filter-select" value={filter.sortBy} onChange={e => filter.setSortBy(e.target.value as typeof filter.sortBy)}>
            <option value="name">Sort: Name</option>
            <option value="students">Sort: Most Students</option>
            <option value="attendance">Sort: Best Attendance</option>
            <option value="fee">Sort: Highest Fee Collection</option>
          </select>
          {filter.hasActiveFilters && (
            <button className="sd-clear-filters" onClick={() => { filter.clearFilters(); pagination.resetPage(); }}>
              <X size={14} style={{ verticalAlign: -2, marginRight: 4 }} />
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Results info */}
      <div className="sd-results-info">
        <div className="sd-results-count">
          Showing <span>{pagination.paginated.length}</span> of <span>{filter.filtered.length}</span> schools
        </div>
      </div>

      {/* Empty State */}
      {filter.filtered.length === 0 ? (
        <div className="sd-empty">
          <div className="sd-empty-icon"><Building2 size={28} /></div>
          <h3>No schools found</h3>
          <p>Try adjusting your search or filter criteria to find what you're looking for.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ─── Grid View ─── */
        <div className="sd-grid">
          {pagination.paginated.map((school, i) => (
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
                  <button className="sd-card-action-btn" title="Surprise Inspection" onClick={e => handleInspection(school, e)} style={{ color: 'var(--primary-500)' }}>
                    <Video size={15} />
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
                {pagination.paginated.map((school, i) => (
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
                        <button className="sd-card-action-btn" title="Surprise Inspection" onClick={e => handleInspection(school, e)} style={{ color: 'var(--primary-500)' }}>
                          <Video size={15} />
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
      {pagination.totalPages > 1 && (
        <div className="sd-pagination">
          <div className="sd-pagination-info">
            Page <span>{pagination.currentPage}</span> of <span>{pagination.totalPages}</span>
          </div>
          <div className="sd-pagination-btns">
            <button className="sd-page-btn" disabled={!pagination.hasPrev} onClick={pagination.prevPage}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} className={`sd-page-btn ${page === pagination.currentPage ? 'active' : ''}`} onClick={() => pagination.goToPage(page)}>
                {page}
              </button>
            ))}
            <button className="sd-page-btn" disabled={!pagination.hasNext} onClick={pagination.nextPage}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <InspectionModal 
        isOpen={isInspectionOpen} 
        onClose={() => setIsInspectionOpen(false)} 
        school={inspectionSchool} 
      />
    </div>
  );
}
