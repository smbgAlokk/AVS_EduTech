import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  GraduationCap,
  Search,
  Filter,
  IndianRupee,
  Award,
  BookOpen,
  AlertTriangle,
  Pencil,
  Trash2,
  BarChart3,
  Calculator,
  FlaskConical,
  Languages,
  BookOpenText,
  Atom,
  TestTube2,
} from "lucide-react";
import "./PrincipalTeachers.css";

type Teacher = {
  id: number;
  name: string;
  gender: "Male" | "Female";
  subject: string;
  classLevel: "Up to 10" | "Up to 12";
  qualification: "Bachelor" | "Master" | "PhD";
  salary: number;
  experience: number;
  attendance: number;
  status: "Active" | "On Leave" | "Needs Attention";
};

const teachersData: Teacher[] = [
  { id: 1, name: "Rahul Sharma", gender: "Male", subject: "Mathematics", classLevel: "Up to 12", qualification: "PhD", salary: 62000, experience: 9, attendance: 96, status: "Active" },
  { id: 2, name: "Priya Singh", gender: "Female", subject: "Science", classLevel: "Up to 10", qualification: "Master", salary: 52000, experience: 6, attendance: 94, status: "Active" },
  { id: 3, name: "Amit Verma", gender: "Male", subject: "English", classLevel: "Up to 12", qualification: "Master", salary: 50000, experience: 7, attendance: 91, status: "Active" },
  { id: 4, name: "Sneha Gupta", gender: "Female", subject: "Hindi", classLevel: "Up to 10", qualification: "Master", salary: 46000, experience: 5, attendance: 89, status: "Needs Attention" },
  { id: 5, name: "Vikram Yadav", gender: "Male", subject: "Physics", classLevel: "Up to 12", qualification: "PhD", salary: 68000, experience: 11, attendance: 97, status: "Active" },
  { id: 6, name: "Neha Kumari", gender: "Female", subject: "Chemistry", classLevel: "Up to 12", qualification: "Master", salary: 57000, experience: 8, attendance: 95, status: "Active" },
  { id: 7, name: "Rohit Mishra", gender: "Male", subject: "Biology", classLevel: "Up to 12", qualification: "Master", salary: 55000, experience: 7, attendance: 92, status: "Active" },
  { id: 8, name: "Anjali Patel", gender: "Female", subject: "Computer Science", classLevel: "Up to 12", qualification: "PhD", salary: 70000, experience: 10, attendance: 98, status: "Active" },
  { id: 9, name: "Manish Tiwari", gender: "Male", subject: "History", classLevel: "Up to 10", qualification: "Bachelor", salary: 39000, experience: 3, attendance: 86, status: "Needs Attention" },
  { id: 10, name: "Pooja Saxena", gender: "Female", subject: "Geography", classLevel: "Up to 10", qualification: "Master", salary: 48000, experience: 6, attendance: 93, status: "Active" },
  { id: 11, name: "Saurabh Singh", gender: "Male", subject: "Economics", classLevel: "Up to 12", qualification: "Master", salary: 53000, experience: 8, attendance: 90, status: "Active" },
  { id: 12, name: "Kavita Rani", gender: "Female", subject: "Political Science", classLevel: "Up to 12", qualification: "PhD", salary: 64000, experience: 12, attendance: 96, status: "Active" },
  { id: 13, name: "Deepak Kumar", gender: "Male", subject: "Physical Education", classLevel: "Up to 10", qualification: "Bachelor", salary: 37000, experience: 4, attendance: 88, status: "On Leave" },
  { id: 14, name: "Ritika Jain", gender: "Female", subject: "Arts", classLevel: "Up to 10", qualification: "Master", salary: 42000, experience: 5, attendance: 91, status: "Active" },
  { id: 15, name: "Arun Rajput", gender: "Male", subject: "Mathematics", classLevel: "Up to 12", qualification: "Master", salary: 58000, experience: 9, attendance: 94, status: "Active" },
  { id: 16, name: "Meena Devi", gender: "Female", subject: "Hindi", classLevel: "Up to 12", qualification: "Master", salary: 51000, experience: 10, attendance: 95, status: "Active" },
  { id: 17, name: "Nikhil Sinha", gender: "Male", subject: "Computer Science", classLevel: "Up to 12", qualification: "Master", salary: 60000, experience: 6, attendance: 89, status: "Active" },
  { id: 18, name: "Shalini Dubey", gender: "Female", subject: "English", classLevel: "Up to 10", qualification: "Bachelor", salary: 40000, experience: 4, attendance: 87, status: "Needs Attention" },
  { id: 19, name: "Harsh Pandey", gender: "Male", subject: "Physics", classLevel: "Up to 12", qualification: "PhD", salary: 72000, experience: 13, attendance: 98, status: "Active" },
  { id: 20, name: "Divya Agarwal", gender: "Female", subject: "Chemistry", classLevel: "Up to 12", qualification: "Master", salary: 56000, experience: 7, attendance: 93, status: "Active" },
  { id: 21, name: "Alok Srivastava", gender: "Male", subject: "Biology", classLevel: "Up to 12", qualification: "PhD", salary: 66000, experience: 12, attendance: 97, status: "Active" },
  { id: 22, name: "Nisha Khan", gender: "Female", subject: "Science", classLevel: "Up to 10", qualification: "Master", salary: 49000, experience: 5, attendance: 92, status: "Active" },
  { id: 23, name: "Ramesh Chandra", gender: "Male", subject: "History", classLevel: "Up to 12", qualification: "Master", salary: 52000, experience: 15, attendance: 94, status: "Active" },
  { id: 24, name: "Suman Lata", gender: "Female", subject: "Geography", classLevel: "Up to 12", qualification: "Master", salary: 54000, experience: 9, attendance: 95, status: "Active" },
  { id: 25, name: "Karan Mehta", gender: "Male", subject: "Economics", classLevel: "Up to 12", qualification: "Bachelor", salary: 45000, experience: 4, attendance: 85, status: "Needs Attention" },
  { id: 26, name: "Garima Joshi", gender: "Female", subject: "Political Science", classLevel: "Up to 12", qualification: "Master", salary: 55000, experience: 7, attendance: 93, status: "Active" },
  { id: 27, name: "Mohit Bansal", gender: "Male", subject: "Physical Education", classLevel: "Up to 10", qualification: "Bachelor", salary: 38000, experience: 5, attendance: 90, status: "Active" },
  { id: 28, name: "Tanvi Kapoor", gender: "Female", subject: "Arts", classLevel: "Up to 10", qualification: "Master", salary: 43000, experience: 6, attendance: 91, status: "On Leave" },
  { id: 29, name: "Abhishek Rai", gender: "Male", subject: "Mathematics", classLevel: "Up to 10", qualification: "Master", salary: 51000, experience: 6, attendance: 92, status: "Active" },
  { id: 30, name: "Swati Mishra", gender: "Female", subject: "Science", classLevel: "Up to 10", qualification: "PhD", salary: 61000, experience: 10, attendance: 96, status: "Active" },
  { id: 31, name: "Gaurav Tripathi", gender: "Male", subject: "English", classLevel: "Up to 12", qualification: "Master", salary: 53000, experience: 8, attendance: 93, status: "Active" },
  { id: 32, name: "Renu Bala", gender: "Female", subject: "Hindi", classLevel: "Up to 10", qualification: "Bachelor", salary: 39000, experience: 3, attendance: 86, status: "Needs Attention" },
  { id: 33, name: "Prakash Maurya", gender: "Male", subject: "Physics", classLevel: "Up to 12", qualification: "Master", salary: 57000, experience: 7, attendance: 94, status: "Active" },
  { id: 34, name: "Bhavna Sharma", gender: "Female", subject: "Chemistry", classLevel: "Up to 12", qualification: "PhD", salary: 69000, experience: 11, attendance: 97, status: "Active" },
  { id: 35, name: "Yogesh Pal", gender: "Male", subject: "Biology", classLevel: "Up to 10", qualification: "Master", salary: 47000, experience: 5, attendance: 89, status: "Active" },
  { id: 36, name: "Aarti Verma", gender: "Female", subject: "Computer Science", classLevel: "Up to 12", qualification: "Master", salary: 59000, experience: 6, attendance: 95, status: "Active" },
  { id: 37, name: "Siddharth Jain", gender: "Male", subject: "History", classLevel: "Up to 10", qualification: "Bachelor", salary: 40000, experience: 4, attendance: 88, status: "On Leave" },
  { id: 38, name: "Komal Singh", gender: "Female", subject: "Geography", classLevel: "Up to 10", qualification: "Master", salary: 46000, experience: 5, attendance: 90, status: "Active" },
  { id: 39, name: "Devendra Kumar", gender: "Male", subject: "Economics", classLevel: "Up to 12", qualification: "PhD", salary: 71000, experience: 14, attendance: 98, status: "Active" },
  { id: 40, name: "Mamta Yadav", gender: "Female", subject: "Political Science", classLevel: "Up to 12", qualification: "Master", salary: 52000, experience: 8, attendance: 93, status: "Active" },
  { id: 41, name: "Akash Gupta", gender: "Male", subject: "Physical Education", classLevel: "Up to 12", qualification: "Bachelor", salary: 41000, experience: 6, attendance: 91, status: "Active" },
  { id: 42, name: "Preeti Chauhan", gender: "Female", subject: "Arts", classLevel: "Up to 12", qualification: "Master", salary: 48000, experience: 7, attendance: 94, status: "Active" },
  { id: 43, name: "Ravi Shankar", gender: "Male", subject: "Mathematics", classLevel: "Up to 12", qualification: "PhD", salary: 73000, experience: 16, attendance: 97, status: "Active" },
  { id: 44, name: "Seema Thakur", gender: "Female", subject: "Science", classLevel: "Up to 10", qualification: "Master", salary: 50000, experience: 6, attendance: 92, status: "Active" },
  { id: 45, name: "Ankit Saxena", gender: "Male", subject: "English", classLevel: "Up to 10", qualification: "Bachelor", salary: 39000, experience: 3, attendance: 84, status: "Needs Attention" },
  { id: 46, name: "Monika Pandey", gender: "Female", subject: "Hindi", classLevel: "Up to 12", qualification: "Master", salary: 53000, experience: 9, attendance: 95, status: "Active" },
  { id: 47, name: "Jitendra Sahu", gender: "Male", subject: "Physics", classLevel: "Up to 12", qualification: "Master", salary: 56000, experience: 7, attendance: 91, status: "Active" },
  { id: 48, name: "Rashmi Tiwari", gender: "Female", subject: "Chemistry", classLevel: "Up to 12", qualification: "PhD", salary: 67000, experience: 10, attendance: 96, status: "Active" },
  { id: 49, name: "Naveen Dubey", gender: "Male", subject: "Computer Science", classLevel: "Up to 12", qualification: "Master", salary: 62000, experience: 8, attendance: 94, status: "Active" },
  { id: 50, name: "Payal Agarwal", gender: "Female", subject: "Biology", classLevel: "Up to 10", qualification: "Master", salary: 49000, experience: 6, attendance: 92, status: "Active" },
];

const PrincipalTeachers = () => {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [gender, setGender] = useState("");
  const [qualification, setQualification] = useState("");
  const [classLevel, setClassLevel] = useState("");

  const subjects = Array.from(new Set(teachersData.map((t) => t.subject)));

  const filteredTeachers = useMemo(() => {
    return teachersData.filter((teacher) => {
      const searchMatch =
        teacher.name.toLowerCase().includes(search.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(search.toLowerCase());

      const subjectMatch = subject === "" || teacher.subject === subject;
      const genderMatch = gender === "" || teacher.gender === gender;
      const qualificationMatch =
        qualification === "" || teacher.qualification === qualification;
      const classMatch = classLevel === "" || teacher.classLevel === classLevel;

      return searchMatch && subjectMatch && genderMatch && qualificationMatch && classMatch;
    });
  }, [search, subject, gender, qualification, classLevel]);

  const totalTeachers = teachersData.length;
  const maleTeachers = teachersData.filter((t) => t.gender === "Male").length;
  const femaleTeachers = teachersData.filter((t) => t.gender === "Female").length;
  const phdTeachers = teachersData.filter((t) => t.qualification === "PhD").length;
  const masterTeachers = teachersData.filter((t) => t.qualification === "Master").length;
  const needsAttention = teachersData.filter((t) => t.status === "Needs Attention").length;

  const avgSalary = Math.round(
    teachersData.reduce((sum, t) => sum + t.salary, 0) / teachersData.length
  );

  const avgAttendance = Math.round(
    teachersData.reduce((sum, t) => sum + t.attendance, 0) / teachersData.length
  );

  const subjectWise = subjects.slice(0, 6).map((s) => ({
    subject: s,
    count: teachersData.filter((t) => t.subject === s).length,
  }));

  const resetFilters = () => {
    setSearch("");
    setSubject("");
    setGender("");
    setQualification("");
    setClassLevel("");
  };

  const subjectIcons: Record<string, React.ReactNode> = {
    Mathematics: <Calculator size={18} />,
    Science: <FlaskConical size={18} />,
    English: <Languages size={18} />,
    Hindi: <BookOpenText size={18} />,
    Physics: <Atom size={18} />,
    Chemistry: <TestTube2 size={18} />,
  };

  return (
    <div className="principal-teachers-page">
      <div className="teachers-header">
        <div>
          <h1>Teacher Management</h1>
          <p>Monitor teacher strength, qualifications, attendance, subject allocation and salary insights.</p>
        </div>

        <div className="teachers-header-actions">
          <button className="secondary-btn">Export Report</button>
          <button className="primary-btn">+ Add Teacher</button>
        </div>
      </div>

      <div className="teacher-stats-grid">
        <div className="teacher-stat-card">
          <div className="stat-icon green"><Users size={22} /></div>
          <div>
            <h2>{totalTeachers}</h2>
            <p>Total Teachers</p>
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="stat-icon blue"><UserCheck size={22} /></div>
          <div>
            <h2>{maleTeachers}/{femaleTeachers}</h2>
            <p>Male / Female</p>
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="stat-icon pink"><GraduationCap size={22} /></div>
          <div>
            <h2>{masterTeachers}</h2>
            <p>Master Degree Holders</p>
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="stat-icon purple"><Award size={22} /></div>
          <div>
            <h2>{phdTeachers}</h2>
            <p>PhD Holders</p>
          </div>
        </div>
      </div>

      <div className="teacher-stats-grid second-row">
        <div className="teacher-mini-card border-green">
          <p>Average Attendance</p>
          <h2>{avgAttendance}%</h2>
          <span>Overall staff attendance</span>
        </div>

        <div className="teacher-mini-card border-orange">
          <p>Average Salary</p>
          <h2>₹{avgSalary.toLocaleString("en-IN")}</h2>
          <span>Monthly average salary</span>
        </div>

        <div className="teacher-mini-card border-red">
          <p>Needs Attention</p>
          <h2>{needsAttention}</h2>
          <span>Low attendance or performance</span>
        </div>
      </div>

      <div className="insight-card subject-wise-card">
        <div className="insight-title">
          <BarChart3 size={18} />
          <h3>Subject-wise Teachers</h3>
        </div>

        <div className="subject-card-grid">
          {subjectWise.map((item) => (
            <div className="subject-mini-card" key={item.subject}>
              <div className="subject-mini-icon">
                {subjectIcons[item.subject] || <BookOpen size={18} />}
              </div>

              <div className="subject-mini-info">
                <h4>{item.subject}</h4>
                <p>{item.count} Teachers</p>
              </div>

              <div className="subject-mini-count">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="teacher-filter-card">
        <div className="teacher-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search teachers by name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Subject</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select value={qualification} onChange={(e) => setQualification(e.target.value)}>
          <option value="">Qualification</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Master">Master</option>
          <option value="PhD">PhD</option>
        </select>

        <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)}>
          <option value="">Classes</option>
          <option value="Up to 10">Up to 10</option>
          <option value="Up to 12">Up to 12</option>
        </select>

        <button className="filter-btn" onClick={resetFilters}>
          <Filter size={16} />
          Reset
        </button>
      </div>

      <div className="teacher-list-card">
        <div className="teacher-list-header">
          <div>
            <h2>
              <BookOpen size={22} />
              Teachers List
            </h2>
            <p>Showing {filteredTeachers.length} out of {totalTeachers} teacher records</p>
          </div>
        </div>

        <div className="teacher-table-wrapper">
          <table className="teacher-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Teacher</th>
                <th>Subject</th>
                <th>Gender</th>
                <th>Class</th>
                <th>Qualification</th>
                <th>Salary</th>
                <th>Attendance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTeachers.map((teacher, index) => (
                <tr key={teacher.id}>
                  <td><span className="rank-badge">#{index + 1}</span></td>

                  <td>
                    <div className="teacher-name-cell">
                      <div className="teacher-avatar">{teacher.name.charAt(0)}</div>
                      <div>
                        <strong>{teacher.name}</strong>
                        <p>{teacher.experience} yrs experience</p>
                      </div>
                    </div>
                  </td>

                  <td>{teacher.subject}</td>
                  <td>{teacher.gender}</td>
                  <td>{teacher.classLevel}</td>

                  <td>
                    <span className="qualification-badge">{teacher.qualification}</span>
                  </td>

                  <td>
                    <div className="salary-cell">
                      <IndianRupee size={14} />
                      {teacher.salary.toLocaleString("en-IN")}
                    </div>
                  </td>

                  <td>
                    <span className={teacher.attendance >= 90 ? "attendance-good" : "attendance-low"}>
                      {teacher.attendance}%
                    </span>
                  </td>

                  <td>
                    <span className={`status-badge ${teacher.status.toLowerCase().replaceAll(" ", "-")}`}>
                      {teacher.status === "Needs Attention" && <AlertTriangle size={13} />}
                      {teacher.status}
                    </span>
                  </td>

                  <td>
                    <div className="action-icons">
                      <Pencil size={16} />
                      <Trash2 size={16} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTeachers.length === 0 && (
            <div className="empty-state">No teachers found for selected filters.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrincipalTeachers;