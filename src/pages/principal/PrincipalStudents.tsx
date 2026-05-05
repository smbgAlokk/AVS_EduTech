import { useMemo, useState } from 'react';
import {
  GraduationCap, ClipboardCheck, UserCheck, TrendingUp, Trophy,
  Search, Filter, Upload, Pencil, Trash2, User, BarChart3, DollarSign, AlertTriangle,
} from 'lucide-react';
import { principalStudentsData } from '../../data/dashboards';
import './PrincipalStudents.css';

const { overview: studentOverview, students } = principalStudentsData;

export default function PrincipalStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [classFilter, setClassFilter] = useState('All');
  const [feeFilter, setFeeFilter] = useState('All');
  const [attendanceFilter, setAttendanceFilter] = useState('All');

  const feePercentage = Math.round(
    (studentOverview.feesSubmitted / studentOverview.totalFeeStudents) * 100
  );

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchMatch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.feeStatus.toLowerCase().includes(searchTerm.toLowerCase());

      const classMatch = classFilter === 'All' || student.class === classFilter;
      const feeMatch = feeFilter === 'All' || student.feeStatus === feeFilter;

      const attendanceMatch =
        attendanceFilter === 'All' ||
        (attendanceFilter === 'Above 90%' && student.attendance >= 90) ||
        (attendanceFilter === '75% - 90%' && student.attendance >= 75 && student.attendance < 90) ||
        (attendanceFilter === 'Below 75%' && student.attendance < 75);

      return searchMatch && classMatch && feeMatch && attendanceMatch;
    });
  }, [searchTerm, classFilter, feeFilter, attendanceFilter]);

  return (
    <div className="principal-students-page">
      <div className="principal-students-header">
        <div>
          <h1>Student Management</h1>
          <p>Monitor student strength, attendance, fee status and growth.</p>
        </div>

        <div className="header-actions">
          <button className="import-btn">
            <Upload size={16} />
            Import Bulk
          </button>

          <button className="add-student-btn">+ Add Student</button>
        </div>
      </div>

      <div className="student-summary-grid">
        <div className="student-summary-card">
          <div className="student-summary-icon green">
            <GraduationCap size={22} />
          </div>
          <div>
            <h3>{studentOverview.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="student-summary-card">
          <div className="student-summary-icon blue">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <h3>{studentOverview.averageAttendance}%</h3>
            <p>Average Attendance</p>
          </div>
        </div>

        <div className="student-summary-card">
          <div className="student-summary-icon pink">
            <UserCheck size={22} />
          </div>
          <div>
            <h3>{studentOverview.feesSubmitted}/{studentOverview.totalFeeStudents}</h3>
            <p>Fee Submitted</p>
            <span>{feePercentage}% completed</span>
          </div>
        </div>

        <div className="student-summary-card">
          <div className="student-summary-icon orange">
            <TrendingUp size={22} />
          </div>
          <div>
            <h3>+{studentOverview.growthThisYear}%</h3>
            <p>Student Growth</p>
          </div>
        </div>
      </div>

      <div className="student-insight-grid">
        <div className="student-insight-card present">
          <div className="student-insight-icon"><BarChart3 size={18} /></div>
          <h4>Today Present</h4>
          <p>1,142</p>
          <span>91.7% attendance today</span>
        </div>

        <div className="student-insight-card fee">
          <div className="student-insight-icon"><DollarSign size={18} /></div>
          <h4>Fee Pending</h4>
          <p>159</p>
          <span>Requires follow-up</span>
        </div>

        <div className="student-insight-card admission">
          <div className="student-insight-icon"><GraduationCap size={18} /></div>
          <h4>New Admissions</h4>
          <p>84</p>
          <span>This academic year</span>
        </div>

        <div className="student-insight-card attention">
          <div className="student-insight-icon"><AlertTriangle size={18} /></div>
          <h4>Needs Attention</h4>
          <p>37</p>
          <span>Low attendance/performance</span>
        </div>
      </div>

      {/* FILTER SECTION NOW COMES JUST BEFORE STUDENTS LIST */}
      <div className="student-tools-card">
        <div className="student-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search students by name, class or fee status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>
          <Filter size={17} />
          Filter
        </button>
      </div>

      {showFilter && (
        <div className="filter-panel">
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="All">All Classes</option>
            {[...new Set(students.map((s) => s.class))].map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          <select value={feeFilter} onChange={(e) => setFeeFilter(e.target.value)}>
            <option value="All">All Fee Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>

          <select value={attendanceFilter} onChange={(e) => setAttendanceFilter(e.target.value)}>
            <option value="All">All Attendance</option>
            <option value="Above 90%">Above 90%</option>
            <option value="75% - 90%">75% - 90%</option>
            <option value="Below 75%">Below 75%</option>
          </select>

          <button
            className="clear-filter-btn"
            onClick={() => {
              setClassFilter('All');
              setFeeFilter('All');
              setAttendanceFilter('All');
              setSearchTerm('');
            }}
          >
            Clear Filter
          </button>
        </div>
      )}

      <div className="top-students-card">
        <div className="top-students-header">
          <div>
            <h2>
              <Trophy size={20} />
              Students List
            </h2>
            <p>Showing {filteredStudents.length} student records</p>
          </div>
        </div>

        <div className="top-students-table">
          <div className="top-students-row table-head">
            <span>Rank</span>
            <span>Student</span>
            <span>Class</span>
            <span>Percentage</span>
            <span>Attendance</span>
            <span>Fee Status</span>
            <span>Actions</span>
          </div>

          {filteredStudents.map((student) => (
            <div className="top-students-row" key={student.rank}>
              <span className="rank-badge">#{student.rank}</span>

              <span className="student-info">
                <div className="avatar">
                  <User size={14} />
                </div>
                {student.name}
              </span>

              <span>{student.class}</span>
              <span className="percentage">{student.percentage}%</span>
              <span>{student.attendance}%</span>

              <span className={student.feeStatus === 'Paid' ? 'status-badge paid' : 'status-badge pending'}>
                {student.feeStatus}
              </span>

              <span className="action-buttons">
                <button className="edit-btn"><Pencil size={14} /></button>
                <button className="delete-btn"><Trash2 size={14} /></button>
              </span>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="no-students-found">
              No student found for selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}