/* ============================================
   AVS EduConnect — Attendance Data Layer
   ============================================
   Shared data for SA / Principal / Teacher / Student / Parent.
   Mock for the P0 prototype. Demo school is AVS-TML, demo student
   is "Aarav Patel" (Class 10-A) — matches the AuthContext mock user.
   ============================================ */

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'holiday' | 'weekend' | 'no_school';

export type LeaveCategory = 'medical' | 'family' | 'personal' | 'casual' | 'sick' | 'maternity' | 'sports' | 'official' | 'other';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type ApplicantRole = 'student' | 'teacher' | 'parent_for_child';

/* ─── Core types ─── */

export interface DayAttendance {
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface SchoolAttendanceRow {
  schoolCode: string;
  schoolName: string;
  district: string;
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  todayPercent: number;
  weekAverage: number;
  monthAverage: number;
  yearAverage: number;
  trend: number;
  status: 'good' | 'warning' | 'critical';
}

export interface ClassAttendanceRow {
  className: string;
  section: string;
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  attendancePercent: number;
  classTeacher: string;
  marked: boolean;
  markedAt?: string;
}

export interface StudentRoll {
  studentId: string;
  rollNumber: string;
  name: string;
  className: string;
  section: string;
  gender: 'male' | 'female';
  parentName: string;
  parentPhone: string;
  status?: AttendanceStatus;
  remarks?: string;
}

export interface DefaulterStudent {
  studentId: string;
  rollNumber: string;
  name: string;
  className: string;
  section: string;
  schoolCode: string;
  schoolName: string;
  parentName: string;
  parentPhone: string;
  attendancePercent: number;
  daysPresent: number;
  daysAbsent: number;
  lastAbsent: string;
  consecutiveAbsent: number;
  riskLevel: 'warning' | 'critical' | 'severe';
}

export interface LeaveApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantRole: ApplicantRole;
  applicantClass?: string;
  applicantPhotoInitials?: string;
  schoolCode: string;
  schoolName: string;
  fromDate: string;
  toDate: string;
  numDays: number;
  category: LeaveCategory;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewedOn?: string;
  remarks?: string;
  attachmentName?: string;
}

export interface Holiday {
  date: string;
  name: string;
  type: 'national' | 'state' | 'religious' | 'school' | 'examination';
  description?: string;
}

export interface MonthlyTrendPoint {
  month: string;
  percent: number;
  prevYearPercent?: number;
}

export interface DailyTrendPoint {
  date: string;
  percent: number;
}

export interface SubjectAttendance {
  subject: string;
  classesHeld: number;
  classesAttended: number;
  percent: number;
}

export interface NetworkSnapshot {
  totalStudents: number;
  totalPresentToday: number;
  totalAbsentToday: number;
  totalOnLeaveToday: number;
  networkPercent: number;
  schoolsTracked: number;
  schoolsBelowThreshold: number;
  pendingLeaveApprovals: number;
  policyThreshold: number;
}

/* ─── Demo identity constants ─── */
export const DEMO_SCHOOL_CODE = 'AVS-TML';
export const DEMO_SCHOOL_NAME = 'Adarsha Vidyalaya Tamulpur';
export const DEMO_STUDENT_ID = 'st-001';
export const DEMO_STUDENT_NAME = 'Aarav Patel';
export const DEMO_STUDENT_CLASS = '10';
export const DEMO_STUDENT_SECTION = 'A';
export const DEMO_STUDENT_ROLL = '14';
export const DEMO_TEACHER_ID = 'tr-001';
export const DEMO_TEACHER_NAME = 'Mrs. Anita Sharma';
export const DEMO_TEACHER_CLASSES: { className: string; section: string }[] = [
  { className: '10', section: 'A' },
  { className: '10', section: 'B' },
  { className: '9', section: 'A' },
];

export const ATTENDANCE_THRESHOLD = 75;

/* ─── Network — School-wise ─── */
export const schoolAttendance: SchoolAttendanceRow[] = [
  { schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',     totalStudents: 478, presentToday: 432, absentToday: 38, onLeaveToday: 8,  todayPercent: 90.4, weekAverage: 89.2, monthAverage: 88.6, yearAverage: 87.4, trend: 1.2,  status: 'good' },
  { schoolCode: 'AVS-BPT', schoolName: 'AVS Barpeta',  district: 'Barpeta',   totalStudents: 624, presentToday: 562, absentToday: 51, onLeaveToday: 11, todayPercent: 90.1, weekAverage: 91.0, monthAverage: 90.4, yearAverage: 89.8, trend: -0.9, status: 'good' },
  { schoolCode: 'AVS-NGJ', schoolName: 'AVS Nagrijuli',district: 'Baksa',     totalStudents: 412, presentToday: 354, absentToday: 49, onLeaveToday: 9,  todayPercent: 85.9, weekAverage: 86.2, monthAverage: 86.0, yearAverage: 85.5, trend: -0.3, status: 'good' },
  { schoolCode: 'AVS-CNG', schoolName: 'AVS Chenga',   district: 'Barpeta',   totalStudents: 528, presentToday: 449, absentToday: 65, onLeaveToday: 14, todayPercent: 85.0, weekAverage: 85.8, monthAverage: 84.6, yearAverage: 84.1, trend: -0.8, status: 'good' },
  { schoolCode: 'AVS-MND', schoolName: 'AVS Mandia',   district: 'Barpeta',   totalStudents: 487, presentToday: 419, absentToday: 56, onLeaveToday: 12, todayPercent: 86.0, weekAverage: 86.4, monthAverage: 86.2, yearAverage: 85.9, trend: -0.4, status: 'good' },
  { schoolCode: 'AVS-PMD', schoolName: 'AVS Pub Mangaldoi', district: 'Darrang', totalStudents: 612, presentToday: 562, absentToday: 41, onLeaveToday: 9, todayPercent: 91.8, weekAverage: 91.3, monthAverage: 91.5, yearAverage: 90.9, trend: 0.5, status: 'good' },
  { schoolCode: 'AVS-DGS', schoolName: 'AVS Dalgaon Sialmari', district: 'Darrang', totalStudents: 478, presentToday: 392, absentToday: 72, onLeaveToday: 14, todayPercent: 82.0, weekAverage: 83.5, monthAverage: 84.1, yearAverage: 83.8, trend: -1.5, status: 'warning' },
  { schoolCode: 'AVS-BCM', schoolName: 'AVS Bechimari', district: 'Darrang', totalStudents: 542, presentToday: 478, absentToday: 52, onLeaveToday: 12, todayPercent: 88.2, weekAverage: 87.9, monthAverage: 88.0, yearAverage: 87.6, trend: 0.3, status: 'good' },
  { schoolCode: 'AVS-RPS', schoolName: 'AVS Rupsi',    district: 'Barpeta',   totalStudents: 365, presentToday: 268, absentToday: 84, onLeaveToday: 13, todayPercent: 73.4, weekAverage: 74.1, monthAverage: 75.2, yearAverage: 76.8, trend: -1.7, status: 'critical' },
  { schoolCode: 'AVS-DKC', schoolName: 'AVS Dokuchi',  district: 'Kamrup',    totalStudents: 458, presentToday: 412, absentToday: 38, onLeaveToday: 8,  todayPercent: 90.0, weekAverage: 89.6, monthAverage: 89.8, yearAverage: 89.4, trend: 0.4, status: 'good' },
  { schoolCode: 'AVS-LKP', schoolName: 'AVS Lakhipur', district: 'Goalpara',  totalStudents: 478, presentToday: 388, absentToday: 76, onLeaveToday: 14, todayPercent: 81.2, weekAverage: 82.0, monthAverage: 82.5, yearAverage: 83.1, trend: -0.8, status: 'warning' },
  { schoolCode: 'AVS-MTA', schoolName: 'AVS Matia',    district: 'Goalpara',  totalStudents: 425, presentToday: 308, absentToday: 96, onLeaveToday: 21, todayPercent: 72.5, weekAverage: 73.8, monthAverage: 75.0, yearAverage: 76.2, trend: -1.3, status: 'critical' },
];

/* ─── Network snapshot (aggregated) ─── */
export const networkSnapshot: NetworkSnapshot = {
  totalStudents: schoolAttendance.reduce((s, r) => s + r.totalStudents, 0),
  totalPresentToday: schoolAttendance.reduce((s, r) => s + r.presentToday, 0),
  totalAbsentToday: schoolAttendance.reduce((s, r) => s + r.absentToday, 0),
  totalOnLeaveToday: schoolAttendance.reduce((s, r) => s + r.onLeaveToday, 0),
  networkPercent: parseFloat(((schoolAttendance.reduce((s, r) => s + r.presentToday, 0) / schoolAttendance.reduce((s, r) => s + r.totalStudents, 0)) * 100).toFixed(1)),
  schoolsTracked: schoolAttendance.length,
  schoolsBelowThreshold: schoolAttendance.filter(s => s.todayPercent < ATTENDANCE_THRESHOLD).length,
  pendingLeaveApprovals: 14,
  policyThreshold: ATTENDANCE_THRESHOLD,
};

/* ─── Class-wise (for Principal of demo school) ─── */
export const classAttendance: ClassAttendanceRow[] = [
  { className: '6',  section: 'A', totalStudents: 38, presentToday: 36, absentToday: 2, attendancePercent: 94.7, classTeacher: 'Mr. Nayan Das',         marked: true, markedAt: '08:42' },
  { className: '6',  section: 'B', totalStudents: 36, presentToday: 32, absentToday: 4, attendancePercent: 88.9, classTeacher: 'Mrs. Sushmita Borah',  marked: true, markedAt: '08:45' },
  { className: '7',  section: 'A', totalStudents: 41, presentToday: 38, absentToday: 3, attendancePercent: 92.7, classTeacher: 'Mr. Pranab Kalita',    marked: true, markedAt: '08:40' },
  { className: '7',  section: 'B', totalStudents: 40, presentToday: 35, absentToday: 5, attendancePercent: 87.5, classTeacher: 'Mrs. Reshmi Saikia',   marked: true, markedAt: '08:48' },
  { className: '8',  section: 'A', totalStudents: 42, presentToday: 39, absentToday: 3, attendancePercent: 92.9, classTeacher: 'Mr. Ranjit Bhuyan',    marked: true, markedAt: '08:38' },
  { className: '8',  section: 'B', totalStudents: 39, presentToday: 33, absentToday: 6, attendancePercent: 84.6, classTeacher: 'Mrs. Lakhi Pegu',      marked: true, markedAt: '08:50' },
  { className: '9',  section: 'A', totalStudents: 44, presentToday: 40, absentToday: 4, attendancePercent: 90.9, classTeacher: 'Mrs. Anita Sharma',    marked: true, markedAt: '08:35' },
  { className: '9',  section: 'B', totalStudents: 42, presentToday: 36, absentToday: 6, attendancePercent: 85.7, classTeacher: 'Mr. Manash Talukdar',  marked: false },
  { className: '10', section: 'A', totalStudents: 46, presentToday: 43, absentToday: 3, attendancePercent: 93.5, classTeacher: 'Mrs. Anita Sharma',    marked: true, markedAt: '08:32' },
  { className: '10', section: 'B', totalStudents: 44, presentToday: 38, absentToday: 6, attendancePercent: 86.4, classTeacher: 'Mr. Hemanta Goswami',  marked: true, markedAt: '08:44' },
  { className: '11', section: 'A', totalStudents: 36, presentToday: 32, absentToday: 4, attendancePercent: 88.9, classTeacher: 'Mrs. Pooja Deka',      marked: true, markedAt: '08:36' },
  { className: '12', section: 'A', totalStudents: 32, presentToday: 30, absentToday: 2, attendancePercent: 93.8, classTeacher: 'Mr. Suresh Choudhury', marked: true, markedAt: '08:30' },
];

/* ─── Roll for Teacher's class 10-A (44 mocked) ─── */
const NAMES_10A = [
  'Aaditya Hazarika', 'Anushka Basumatary', 'Arjun Brahma', 'Aarav Patel', 'Bhargav Saikia',
  'Chayanika Das', 'Devjit Kalita', 'Diksha Tamuli', 'Dhruv Choudhury', 'Esha Bordoloi',
  'Farhan Ahmed', 'Gaurav Boro', 'Hemanga Talukdar', 'Hridoy Goswami', 'Ishan Bharali',
  'Jyotishman Deka', 'Kabir Sarma', 'Krisha Borah', 'Lakhinandan Bora', 'Mahima Pegu',
  'Manash Rabha', 'Nabajit Hazarika', 'Niharika Saikia', 'Nilav Bhuyan', 'Parag Tamuli',
  'Pratiksha Das', 'Rahul Mohanta', 'Riya Goswami', 'Rituparna Boro', 'Sagarika Sarma',
  'Sahil Khan', 'Saurav Choudhury', 'Smrita Bordoloi', 'Soumyajit Kalita', 'Suhani Pegu',
  'Tanvi Kakati', 'Tushar Deka', 'Utpal Bharali', 'Varun Goswami', 'Vidisha Boro',
  'Yash Talukdar', 'Yashwant Bora', 'Zara Begum', 'Zenith Saikia',
];

export const classRoll10A: StudentRoll[] = NAMES_10A.map((name, i) => ({
  studentId: `STU-10A-${String(i + 1).padStart(3, '0')}`,
  rollNumber: String(i + 1),
  name,
  className: '10',
  section: 'A',
  gender: i % 3 === 0 ? 'female' : 'male',
  parentName: `Mr. ${name.split(' ')[1]}`,
  parentPhone: `+91 9${String(700000000 + i * 1234567).slice(0, 9)}`,
  // pre-marked status: ~93% present, 4 absent, 3 leave
  status: i === 5 ? 'absent' : i === 12 ? 'absent' : i === 19 ? 'leave' : i === 26 ? 'late' : i === 33 ? 'absent' : i === 40 ? 'leave' : 'present',
  remarks: i === 12 ? 'Fever — informed by parent' : undefined,
}));

/* ─── Defaulters (cross-school) ─── */
export const defaulters: DefaulterStudent[] = [
  { studentId: 'STU-MTA-027', rollNumber: '27', name: 'Bhaskar Rabha',     className: '8',  section: 'B', schoolCode: 'AVS-MTA', schoolName: 'AVS Matia',     parentName: 'Mr. Hemanta Rabha',    parentPhone: '+91 94350 22118', attendancePercent: 58.4, daysPresent: 51, daysAbsent: 36, lastAbsent: '2026-05-08', consecutiveAbsent: 6, riskLevel: 'severe' },
  { studentId: 'STU-MTA-014', rollNumber: '14', name: 'Pranjal Saha',      className: '9',  section: 'A', schoolCode: 'AVS-MTA', schoolName: 'AVS Matia',     parentName: 'Mr. Sanjib Saha',      parentPhone: '+91 99540 31142', attendancePercent: 62.1, daysPresent: 54, daysAbsent: 33, lastAbsent: '2026-05-07', consecutiveAbsent: 4, riskLevel: 'severe' },
  { studentId: 'STU-RPS-008', rollNumber: '8',  name: 'Mahesh Roy',        className: '10', section: 'A', schoolCode: 'AVS-RPS', schoolName: 'AVS Rupsi',     parentName: 'Mr. Bipin Roy',        parentPhone: '+91 98640 14563', attendancePercent: 64.8, daysPresent: 56, daysAbsent: 30, lastAbsent: '2026-05-08', consecutiveAbsent: 3, riskLevel: 'severe' },
  { studentId: 'STU-DGS-021', rollNumber: '21', name: 'Karishma Begum',    className: '7',  section: 'B', schoolCode: 'AVS-DGS', schoolName: 'AVS Dalgaon Sialmari', parentName: 'Mr. Wahid Ali', parentPhone: '+91 78960 22841', attendancePercent: 67.2, daysPresent: 58, daysAbsent: 28, lastAbsent: '2026-05-08', consecutiveAbsent: 2, riskLevel: 'critical' },
  { studentId: 'STU-LKP-019', rollNumber: '19', name: 'Joydeep Boro',      className: '8',  section: 'A', schoolCode: 'AVS-LKP', schoolName: 'AVS Lakhipur',  parentName: 'Mr. Sankar Boro',      parentPhone: '+91 99570 33421', attendancePercent: 70.5, daysPresent: 61, daysAbsent: 25, lastAbsent: '2026-05-06', consecutiveAbsent: 1, riskLevel: 'critical' },
  { studentId: 'STU-MTA-041', rollNumber: '41', name: 'Tara Pegu',         className: '6',  section: 'A', schoolCode: 'AVS-MTA', schoolName: 'AVS Matia',     parentName: 'Mrs. Mina Pegu',       parentPhone: '+91 94350 71182', attendancePercent: 71.2, daysPresent: 62, daysAbsent: 25, lastAbsent: '2026-05-08', consecutiveAbsent: 2, riskLevel: 'critical' },
  { studentId: 'STU-RPS-033', rollNumber: '33', name: 'Devjit Sarma',      className: '11', section: 'A', schoolCode: 'AVS-RPS', schoolName: 'AVS Rupsi',     parentName: 'Mr. Ratan Sarma',      parentPhone: '+91 98640 41782', attendancePercent: 72.8, daysPresent: 63, daysAbsent: 23, lastAbsent: '2026-05-05', consecutiveAbsent: 0, riskLevel: 'critical' },
  { studentId: 'STU-TML-006', rollNumber: '6',  name: 'Chayanika Das',     className: '10', section: 'A', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur',  parentName: 'Mr. Pranab Das',       parentPhone: '+91 94350 11521', attendancePercent: 73.4, daysPresent: 64, daysAbsent: 22, lastAbsent: '2026-05-08', consecutiveAbsent: 1, riskLevel: 'critical' },
  { studentId: 'STU-TML-014', rollNumber: '14', name: 'Nilav Bhuyan',      className: '9',  section: 'B', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur',  parentName: 'Mr. Hemanta Bhuyan',   parentPhone: '+91 94350 33214', attendancePercent: 73.9, daysPresent: 65, daysAbsent: 21, lastAbsent: '2026-05-07', consecutiveAbsent: 2, riskLevel: 'critical' },
  { studentId: 'STU-DGS-040', rollNumber: '40', name: 'Sweety Begum',      className: '11', section: 'A', schoolCode: 'AVS-DGS', schoolName: 'AVS Dalgaon Sialmari', parentName: 'Mr. Akram Hussain', parentPhone: '+91 78960 99412', attendancePercent: 74.5, daysPresent: 66, daysAbsent: 21, lastAbsent: '2026-05-08', consecutiveAbsent: 2, riskLevel: 'warning' },
];

/* ─── Leave applications ─── */
export const leaveApplications: LeaveApplication[] = [
  { id: 'LA-2026-101', applicantId: 'st-001',  applicantName: 'Aarav Patel',         applicantRole: 'student',          applicantClass: 'Class 10-A', applicantPhotoInitials: 'AP', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', fromDate: '2026-05-12', toDate: '2026-05-14', numDays: 3, category: 'medical',   reason: 'Down with viral fever; doctor has advised 3 days of bed rest. Medical certificate attached.', status: 'pending',  appliedOn: '2026-05-08', attachmentName: 'Medical_Certificate_Aarav.pdf' },
  { id: 'LA-2026-100', applicantId: 'STU-TML-019', applicantName: 'Mahima Pegu',     applicantRole: 'student',          applicantClass: 'Class 9-B',  applicantPhotoInitials: 'MP', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', fromDate: '2026-05-15', toDate: '2026-05-15', numDays: 1, category: 'family',    reason: 'Brother\'s wedding ceremony in Guwahati. Will return same evening.', status: 'pending',  appliedOn: '2026-05-08' },
  { id: 'LA-2026-099', applicantId: 'tr-001',  applicantName: 'Mrs. Anita Sharma',   applicantRole: 'teacher',          applicantClass: 'PGT Mathematics', applicantPhotoInitials: 'AS', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', fromDate: '2026-05-20', toDate: '2026-05-22', numDays: 3, category: 'casual',    reason: 'Pre-planned family visit to Shillong. Substitute arrangements made with Mr. Talukdar.', status: 'pending',  appliedOn: '2026-05-07' },
  { id: 'LA-2026-098', applicantId: 'pa-001',  applicantName: 'Mr. Vikram Patel',    applicantRole: 'parent_for_child', applicantClass: 'For Aarav Patel — 10-A', applicantPhotoInitials: 'VP', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', fromDate: '2026-05-09', toDate: '2026-05-09', numDays: 1, category: 'medical',  reason: 'Aarav has dental appointment in the morning; will attend school after lunch break.', status: 'pending',  appliedOn: '2026-05-07' },
  { id: 'LA-2026-097', applicantId: 'STU-TML-021', applicantName: 'Krisha Borah',    applicantRole: 'student',          applicantClass: 'Class 10-A', applicantPhotoInitials: 'KB', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', fromDate: '2026-05-13', toDate: '2026-05-13', numDays: 1, category: 'sports',    reason: 'Selected for state-level badminton tournament at Guwahati. Coach\'s letter attached.',         status: 'pending',  appliedOn: '2026-05-06', attachmentName: 'Sports_Selection_Krisha.pdf' },
  { id: 'LA-2026-095', applicantId: 'st-001',  applicantName: 'Aarav Patel',         applicantRole: 'student',          applicantClass: 'Class 10-A', applicantPhotoInitials: 'AP', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', fromDate: '2026-04-22', toDate: '2026-04-23', numDays: 2, category: 'medical',   reason: 'Stomach infection, doctor advised rest.',                                                       status: 'approved', appliedOn: '2026-04-21', reviewedBy: 'Mrs. Anita Sharma', reviewedOn: '2026-04-21', remarks: 'Approved. Take care.' },
  { id: 'LA-2026-094', applicantId: 'st-001',  applicantName: 'Aarav Patel',         applicantRole: 'student',          applicantClass: 'Class 10-A', applicantPhotoInitials: 'AP', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', fromDate: '2026-04-08', toDate: '2026-04-08', numDays: 1, category: 'personal',   reason: 'Cousin\'s birthday celebration.',                                                                 status: 'rejected', appliedOn: '2026-04-07', reviewedBy: 'Mrs. Anita Sharma', reviewedOn: '2026-04-07', remarks: 'Not a sufficient reason. Please reserve leave for genuine emergencies.' },
  { id: 'LA-2026-093', applicantId: 'tr-001',  applicantName: 'Mrs. Anita Sharma',   applicantRole: 'teacher',          applicantClass: 'PGT Mathematics', applicantPhotoInitials: 'AS', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', fromDate: '2026-03-18', toDate: '2026-03-18', numDays: 1, category: 'official',  reason: 'CBSE evaluation duty at AVS Barpeta.',                                                          status: 'approved', appliedOn: '2026-03-15', reviewedBy: 'Dr. Priya Mehta', reviewedOn: '2026-03-15' },
  { id: 'LA-2026-091', applicantId: 'STU-TML-002', applicantName: 'Anushka Basumatary', applicantRole: 'student',      applicantClass: 'Class 10-A', applicantPhotoInitials: 'AB', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', fromDate: '2026-04-15', toDate: '2026-04-19', numDays: 5, category: 'family',    reason: 'Family relocating temporarily to maternal village for grandmother\'s funeral.',                  status: 'approved', appliedOn: '2026-04-14', reviewedBy: 'Dr. Priya Mehta', reviewedOn: '2026-04-14' },
  { id: 'LA-2026-088', applicantId: 'pa-001',  applicantName: 'Mr. Vikram Patel',    applicantRole: 'parent_for_child', applicantClass: 'For Aarav Patel — 10-A', applicantPhotoInitials: 'VP', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', fromDate: '2026-03-04', toDate: '2026-03-04', numDays: 1, category: 'medical',  reason: 'Routine dental check-up.',                                                                       status: 'approved', appliedOn: '2026-03-03', reviewedBy: 'Dr. Priya Mehta', reviewedOn: '2026-03-03' },
];

/* ─── Holidays / school calendar ─── */
export const holidays: Holiday[] = [
  { date: '2026-01-26', name: 'Republic Day',                type: 'national',    description: '77th Republic Day of India' },
  { date: '2026-02-19', name: 'Shivaji Jayanti',              type: 'state' },
  { date: '2026-03-13', name: 'Bohag Bihu (Rongali Bihu)',    type: 'state',       description: 'Assamese New Year — 3 day break' },
  { date: '2026-03-14', name: 'Bohag Bihu — Day 2',           type: 'state' },
  { date: '2026-03-15', name: 'Bohag Bihu — Day 3',           type: 'state' },
  { date: '2026-03-29', name: 'Holi',                          type: 'religious' },
  { date: '2026-04-10', name: 'Good Friday',                   type: 'religious' },
  { date: '2026-04-14', name: 'Ambedkar Jayanti',              type: 'national' },
  { date: '2026-05-01', name: 'Labour Day',                    type: 'national' },
  { date: '2026-05-13', name: 'Buddha Purnima',                type: 'religious' },
  { date: '2026-05-22', name: 'Eid-ul-Fitr',                   type: 'religious' },
  { date: '2026-05-25', name: 'Half-yearly Examination Begins', type: 'examination', description: 'Class 6-12 half-yearly exams' },
  { date: '2026-06-15', name: 'Summer Vacation Begins',        type: 'school',      description: 'School reopens 15 July' },
  { date: '2026-08-15', name: 'Independence Day',              type: 'national',    description: '79th Independence Day' },
  { date: '2026-09-05', name: 'Teachers\' Day',                type: 'school',      description: 'Special programme by students' },
  { date: '2026-10-02', name: 'Gandhi Jayanti',                type: 'national' },
  { date: '2026-10-19', name: 'Durga Puja Holiday Begins',     type: 'religious',   description: '6 day break — Maha Saptami onwards' },
  { date: '2026-11-04', name: 'Diwali',                         type: 'religious' },
  { date: '2026-11-15', name: 'Birsa Munda Jayanti',           type: 'national' },
  { date: '2026-12-25', name: 'Christmas Day',                 type: 'religious' },
];

/* ─── Daily trend (last 30 days for SA / Principal) ─── */
function generateDailyTrend(seed: number, base: number): DailyTrendPoint[] {
  const days: DailyTrendPoint[] = [];
  const today = new Date('2026-05-08');
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const wd = d.getDay();
    const noise = Math.sin((i + seed) * 0.7) * 4 + Math.cos((i + seed) * 0.3) * 2;
    const percent = wd === 0 ? 0 : parseFloat(Math.max(60, Math.min(98, base + noise)).toFixed(1));
    days.push({ date: d.toISOString().slice(0, 10), percent });
  }
  return days;
}
export const dailyTrendNetwork = generateDailyTrend(1, 87.4);
export const dailyTrendSchool  = generateDailyTrend(3, 88.6);

/* ─── Monthly trend (12 months, current vs previous year) ─── */
export const monthlyTrend: MonthlyTrendPoint[] = [
  { month: 'Apr',   percent: 88.4, prevYearPercent: 86.2 },
  { month: 'May',   percent: 87.2, prevYearPercent: 85.8 },
  { month: 'Jun',   percent: 86.5, prevYearPercent: 84.6 },
  { month: 'Jul',   percent: 89.1, prevYearPercent: 86.9 },
  { month: 'Aug',   percent: 90.3, prevYearPercent: 87.4 },
  { month: 'Sep',   percent: 89.7, prevYearPercent: 87.0 },
  { month: 'Oct',   percent: 88.2, prevYearPercent: 86.1 },
  { month: 'Nov',   percent: 87.6, prevYearPercent: 85.4 },
  { month: 'Dec',   percent: 84.8, prevYearPercent: 82.9 },
  { month: 'Jan',   percent: 86.5, prevYearPercent: 84.2 },
  { month: 'Feb',   percent: 88.9, prevYearPercent: 86.7 },
  { month: 'Mar',   percent: 89.4, prevYearPercent: 87.1 },
];

/* ─── Demo student / parent — month-wise day-by-day attendance for current month ─── */
export const demoStudentMonth: DayAttendance[] = (() => {
  const days: DayAttendance[] = [];
  for (let d = 1; d <= 31; d++) {
    const date = new Date(2026, 4, d);
    if (date.getMonth() !== 4) break;
    const iso = date.toISOString().slice(0, 10);
    const wd = date.getDay();
    const today = new Date('2026-05-08');
    const isFuture = date > today;

    const holiday = holidays.find(h => h.date === iso);
    if (holiday) { days.push({ date: iso, status: 'holiday', remarks: holiday.name }); continue; }
    if (wd === 0) { days.push({ date: iso, status: 'weekend' }); continue; }
    if (isFuture) { days.push({ date: iso, status: 'no_school' }); continue; }

    if (d === 6 || d === 7) days.push({ date: iso, status: 'absent', remarks: d === 6 ? 'Family wedding' : 'Continued — informed by parent' });
    else if (d === 2) days.push({ date: iso, status: 'late', remarks: 'Reached at 9:15 AM' });
    else days.push({ date: iso, status: 'present' });
  }
  return days;
})();

export const demoStudentSubjectAttendance: SubjectAttendance[] = [
  { subject: 'Mathematics',         classesHeld: 64, classesAttended: 60, percent: 93.8 },
  { subject: 'Science',             classesHeld: 60, classesAttended: 55, percent: 91.7 },
  { subject: 'English',             classesHeld: 56, classesAttended: 53, percent: 94.6 },
  { subject: 'Social Science',      classesHeld: 52, classesAttended: 47, percent: 90.4 },
  { subject: 'Hindi',               classesHeld: 48, classesAttended: 44, percent: 91.7 },
  { subject: 'Assamese',            classesHeld: 48, classesAttended: 46, percent: 95.8 },
  { subject: 'Computer Science',    classesHeld: 32, classesAttended: 31, percent: 96.9 },
  { subject: 'Physical Education',  classesHeld: 28, classesAttended: 25, percent: 89.3 },
];

export const demoStudentSummary = {
  studentId: DEMO_STUDENT_ID,
  studentName: DEMO_STUDENT_NAME,
  className: `${DEMO_STUDENT_CLASS}-${DEMO_STUDENT_SECTION}`,
  rollNumber: DEMO_STUDENT_ROLL,
  schoolName: DEMO_SCHOOL_NAME,
  yearlyPercent: 92.4,
  monthlyPercent: 90.5,
  daysPresent: 152,
  daysAbsent: 9,
  daysLate: 3,
  daysOnLeave: 5,
  totalSchoolDays: 169,
  currentStreak: 8,
  longestStreak: 24,
};

/* ─── Aggregations ─── */
export function getDefaultersForSchool(schoolCode: string): DefaulterStudent[] {
  return defaulters.filter(d => d.schoolCode === schoolCode);
}

export function getLeaveApplicationsForSchool(schoolCode: string): LeaveApplication[] {
  return leaveApplications.filter(l => l.schoolCode === schoolCode);
}

export function getMyLeaveApplications(applicantId: string): LeaveApplication[] {
  return leaveApplications.filter(l => l.applicantId === applicantId);
}
