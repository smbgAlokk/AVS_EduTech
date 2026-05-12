/* ============================================
   AVS EduConnect — Dashboard Mock Data
   ============================================
   Chart data, alerts, schedules, and other dashboard-specific
   mock data for all 5 role dashboards.
   ============================================ */

/* ─── Super Admin Dashboard ─── */
export const superAdminData = {
  attendanceBySchool: [
    { name: 'AVS Pub Mangaldoi', attendance: 94 },
    { name: 'AVS Bechimari', attendance: 91 },
    { name: 'AVS Dokuchi', attendance: 89 },
    { name: 'AVS Matia', attendance: 88 },
    { name: 'AVS Lakhipur', attendance: 92 },
    { name: 'AVS Paka Betbari', attendance: 95 },
    { name: 'AVS Tapatari', attendance: 87 },
    { name: 'AVS Rupsi', attendance: 86 },
    { name: 'AVS Diyungbra', attendance: 72 },
    { name: 'AVS New Sangbar', attendance: 83 },
  ],
  feeCollectionTrend: [
    { month: 'May', amount: 3.2 }, { month: 'Jun', amount: 3.8 },
    { month: 'Jul', amount: 4.1 }, { month: 'Aug', amount: 3.9 },
    { month: 'Sep', amount: 4.3 }, { month: 'Oct', amount: 4.5 },
    { month: 'Nov', amount: 4.0 }, { month: 'Dec', amount: 3.6 },
    { month: 'Jan', amount: 4.2 }, { month: 'Feb', amount: 4.4 },
    { month: 'Mar', amount: 4.7 }, { month: 'Apr', amount: 4.2 },
  ],
  schoolDistribution: [
    { name: 'North', value: 18, color: '#10B981' },
    { name: 'South', value: 10, color: '#F472B6' },
    { name: 'East', value: 8, color: '#3B82F6' },
    { name: 'West', value: 9, color: '#F59E0B' },
  ],
  alerts: [
    { id: 1, type: 'danger', title: 'Low attendance at AVS Diyungbra', desc: 'Attendance dropped to 72% — below 80% threshold', time: '2h ago' },
    { id: 2, type: 'warning', title: 'Fee defaulters > 50 at AVS New Sangbar', desc: '53 students with pending fees over 3 months', time: '4h ago' },
    { id: 3, type: 'info', title: 'SDF request pending — AVS Lakhipur', desc: '₹3.5L requested for computer lab upgrade', time: '6h ago' },
    { id: 4, type: 'success', title: 'AVS Pub Mangaldoi rated #1', desc: 'Highest academic performance this quarter', time: '1d ago' },
    { id: 5, type: 'warning', title: 'Teacher shortage at AVS Bechimari', desc: '3 positions unfilled for Science department', time: '1d ago' },
  ],
  topSchools: [
    { name: 'AVS Pub Mangaldoi', students: 1450, rating: 4.8, trend: '+5%' },
    { name: 'AVS Bechimari', students: 1245, rating: 4.7, trend: '+3%' },
    { name: 'AVS Dokuchi', students: 1180, rating: 4.6, trend: '+4%' },
    { name: 'AVS Lakhipur', students: 980, rating: 4.5, trend: '+2%' },
    { name: 'AVS Tapatari', students: 890, rating: 4.4, trend: '+1%' },
  ],
};

/* ─── School Details Page ─── */
export const schoolDetailsData = {
  performanceTrend: [
    { month: 'Jul', attendance: 92, fees: 85 },
    { month: 'Aug', attendance: 94, fees: 88 },
    { month: 'Sep', attendance: 91, fees: 90 },
    { month: 'Oct', attendance: 95, fees: 92 },
    { month: 'Nov', attendance: 96, fees: 95 },
    { month: 'Dec', attendance: 93, fees: 96 },
  ],
  gradeDistribution: [
    { name: 'Primary (1-5)', students: 650 },
    { name: 'Middle (6-8)', students: 420 },
    { name: 'High (9-10)', students: 250 },
    { name: 'Senior (11-12)', students: 130 },
  ],
  alerts: [
    { id: 1, type: 'critical', title: 'Security Camera Offline', desc: 'Main Gate Camera #2 has been offline for 4 hours.', time: '2 hours ago' },
    { id: 2, type: 'warning', title: 'Staff Absenteeism Spike', desc: '5 teachers reported absent in the Science department today.', time: '5 hours ago' },
    { id: 3, type: 'info', title: 'Upcoming Inspection', desc: 'Annual CBSE compliance check scheduled for next week.', time: '1 day ago' },
  ],
  facilities: [
    { name: 'Science Labs', status: 'operational', count: 4 },
    { name: 'Computer Labs', status: 'operational', count: 3 },
    { name: 'Library', status: 'operational', count: 1 },
    { name: 'Sports Ground', status: 'maintenance', count: 1 },
    { name: 'Smart Classrooms', status: 'operational', count: 45 },
    { name: 'Transport Buses', status: 'operational', count: 12 },
  ],
};

/* ─── Principal Dashboard ─── */
export const principalData = {
  classAttendance: [
    { cls: 'Class 1', present: 38, absent: 2 },
    { cls: 'Class 2', present: 36, absent: 4 },
    { cls: 'Class 3', present: 39, absent: 1 },
    { cls: 'Class 4', present: 35, absent: 5 },
    { cls: 'Class 5', present: 37, absent: 3 },
    { cls: 'Class 6', present: 34, absent: 6 },
    { cls: 'Class 7', present: 40, absent: 0 },
    { cls: 'Class 8', present: 36, absent: 4 },
    { cls: 'Class 9', present: 38, absent: 2 },
    { cls: 'Class 10', present: 33, absent: 7 },
    { cls: 'Class 11', present: 30, absent: 5 },
    { cls: 'Class 12', present: 32, absent: 3 },
  ],
  feeMonthly: [
    { month: 'Jan', collected: 18.2, target: 22 },
    { month: 'Feb', collected: 19.5, target: 22 },
    { month: 'Mar', collected: 20.1, target: 22 },
    { month: 'Apr', collected: 18.5, target: 22 },
  ],
  todaySchedule: [
    { time: '8:00 AM', event: 'Assembly', type: 'event' },
    { time: '8:30 AM', event: 'Classes Begin', type: 'class' },
    { time: '10:30 AM', event: 'Break', type: 'break' },
    { time: '11:00 AM', event: 'Classes Resume', type: 'class' },
    { time: '1:00 PM', event: 'Lunch Break', type: 'break' },
    { time: '2:00 PM', event: 'Afternoon Session', type: 'class' },
    { time: '3:00 PM', event: 'Staff Meeting', type: 'meeting' },
    { time: '4:00 PM', event: 'Parent Consultation', type: 'meeting' },
  ],
  recentActivity: [
    { time: '9:15 AM', text: 'Class 10-A attendance marked by Mrs. Sharma', type: 'attendance' },
    { time: '10:30 AM', text: 'Fee payment ₹12,500 received from Rahul\'s parent', type: 'fee' },
    { time: '11:00 AM', text: 'New homework uploaded: Math Ch-5 (Class 8)', type: 'homework' },
    { time: '11:45 AM', text: 'Science lab equipment inventory updated', type: 'general' },
    { time: '1:30 PM', text: 'SDF fund request submitted: ₹2.5L for lab equipment', type: 'sdf' },
    { time: '2:15 PM', text: 'Parent meeting scheduled with Arjun\'s mother', type: 'meeting' },
  ],
};

/* ─── Principal Students ─── */
export const principalStudentsData = {
  overview: {
    totalStudents: 1245,
    averageAttendance: 92,
    feesSubmitted: 1086,
    totalFeeStudents: 1245,
    growthThisYear: 14.8,
  },
  students: [
    { rank: 1, name: 'Aarav Patel', class: 'Class 10-A', percentage: 96.8, attendance: 98, feeStatus: 'Paid' },
    { rank: 2, name: 'Ananya Sharma', class: 'Class 9-B', percentage: 95.4, attendance: 97, feeStatus: 'Paid' },
    { rank: 3, name: 'Rahul Verma', class: 'Class 12-A', percentage: 94.9, attendance: 96, feeStatus: 'Paid' },
    { rank: 4, name: 'Priya Singh', class: 'Class 8-C', percentage: 94.1, attendance: 95, feeStatus: 'Paid' },
    { rank: 5, name: 'Kabir Mehta', class: 'Class 11-B', percentage: 93.7, attendance: 91, feeStatus: 'Pending' },
    { rank: 6, name: 'Sneha Gupta', class: 'Class 10-B', percentage: 92.9, attendance: 94, feeStatus: 'Paid' },
    { rank: 7, name: 'Rohan Das', class: 'Class 7-A', percentage: 92.3, attendance: 89, feeStatus: 'Paid' },
    { rank: 8, name: 'Meera Iyer', class: 'Class 6-B', percentage: 91.8, attendance: 93, feeStatus: 'Paid' },
    { rank: 9, name: 'Aditya Kumar', class: 'Class 12-C', percentage: 91.2, attendance: 82, feeStatus: 'Pending' },
    { rank: 10, name: 'Nisha Khan', class: 'Class 9-A', percentage: 90.6, attendance: 94, feeStatus: 'Paid' },
    { rank: 11, name: 'Aryan Bora', class: 'Class 10-A', percentage: 89.8, attendance: 88, feeStatus: 'Pending' },
    { rank: 12, name: 'Simran Kaur', class: 'Class 8-B', percentage: 88.9, attendance: 92, feeStatus: 'Paid' },
    { rank: 13, name: 'Vikram Nath', class: 'Class 11-A', percentage: 87.4, attendance: 79, feeStatus: 'Pending' },
    { rank: 14, name: 'Pooja Das', class: 'Class 7-B', percentage: 86.9, attendance: 90, feeStatus: 'Paid' },
    { rank: 15, name: 'Harsh Singh', class: 'Class 6-A', percentage: 85.7, attendance: 76, feeStatus: 'Pending' },
    { rank: 16, name: 'Tanvi Sharma', class: 'Class 12-B', percentage: 84.6, attendance: 86, feeStatus: 'Paid' },
    { rank: 17, name: 'Manish Roy', class: 'Class 9-C', percentage: 83.9, attendance: 72, feeStatus: 'Pending' },
    { rank: 18, name: 'Riya Sen', class: 'Class 10-C', percentage: 82.5, attendance: 84, feeStatus: 'Paid' },
    { rank: 19, name: 'Dev Kumar', class: 'Class 8-A', percentage: 81.8, attendance: 69, feeStatus: 'Pending' },
    { rank: 20, name: 'Ishita Paul', class: 'Class 11-C', percentage: 80.9, attendance: 91, feeStatus: 'Paid' },
  ],
};

/* ─── Teacher Dashboard ─── */
export const teacherData = {
  timetable: [
    { period: 1, time: '8:30 – 9:15', class: 'Class 10-A', subject: 'Mathematics', current: false },
    { period: 2, time: '9:15 – 10:00', class: 'Class 9-B', subject: 'Mathematics', current: true },
    { period: 3, time: '10:15 – 11:00', class: '', subject: 'Free Period', current: false },
    { period: 4, time: '11:00 – 11:45', class: 'Class 10-A', subject: 'Mathematics (Lab)', current: false },
    { period: 5, time: '12:00 – 12:45', class: 'Class 9-B', subject: 'Mathematics', current: false },
    { period: 6, time: '1:30 – 2:15', class: 'Class 8-A', subject: 'Mathematics', current: false },
  ],
  recentSubmissions: [
    { student: 'Aarav Patel', assignment: 'Exercise 5.3', date: 'Today', status: 'Pending' },
    { student: 'Priya Singh', assignment: 'Exercise 5.3', date: 'Today', status: 'Graded' },
    { student: 'Rohan Kumar', assignment: 'Weekly Test 4', date: 'Yesterday', status: 'Pending' },
    { student: 'Meera Gupta', assignment: 'Exercise 5.2', date: 'Yesterday', status: 'Graded' },
    { student: 'Arjun Reddy', assignment: 'Exercise 5.3', date: 'Today', status: 'Pending' },
  ],
  classPerformance: [
    { name: 'A+ (90-100)', value: 8, color: '#10B981' },
    { name: 'A (80-89)', value: 14, color: '#34D399' },
    { name: 'B (70-79)', value: 12, color: '#F59E0B' },
    { name: 'C (60-69)', value: 5, color: '#F472B6' },
    { name: 'Below 60', value: 3, color: '#EF4444' },
  ],
  parentMessages: [
    { from: "Rahul's Father", message: 'Wanted to discuss Rahul\'s math performance...', time: '10:30 AM', unread: true },
    { from: "Priya's Mother", message: 'Will Priya be able to take the re-test?', time: '9:15 AM', unread: true },
    { from: "Arjun's Father", message: 'Thank you for the feedback on the project.', time: 'Yesterday', unread: true },
  ],
};

/* ─── Student Dashboard ─── */
export const studentData = {
  schedule: [
    { time: '8:30', subject: 'Mathematics', teacher: 'Mrs. Sharma', current: false },
    { time: '9:15', subject: 'Science', teacher: 'Mr. Verma', current: true },
    { time: '10:15', subject: 'English', teacher: 'Ms. D\'souza', current: false },
    { time: '11:00', subject: 'Hindi', teacher: 'Mrs. Gupta', current: false },
    { time: '12:00', subject: 'Social Studies', teacher: 'Mr. Kapoor', current: false },
    { time: '1:30', subject: 'Computer', teacher: 'Mr. Singh', current: false },
  ],
  performance: [
    { subject: 'Math', score: 88 }, { subject: 'Science', score: 82 },
    { subject: 'English', score: 91 }, { subject: 'Hindi', score: 78 },
    { subject: 'SST', score: 85 }, { subject: 'Computer', score: 92 },
  ],
  assignments: [
    { subject: 'Mathematics', title: 'Exercise 5.3 — Quadratic Equations', due: 'Tomorrow', color: '#10B981', urgent: true },
    { subject: 'English', title: 'Essay — Climate Change', due: 'In 3 days', color: '#3B82F6', urgent: false },
    { subject: 'Science', title: 'Lab Report — Photosynthesis', due: 'In 2 days', color: '#F59E0B', urgent: false },
  ],
};

/* ─── Parent Dashboard ─── */
export const parentData = {
  performanceTrend: [
    { test: 'Unit 1', marks: 85 }, { test: 'Unit 2', marks: 78 },
    { test: 'Mid-term', marks: 82 }, { test: 'Unit 3', marks: 88 }, { test: 'Unit 4', marks: 91 },
  ],
  subjectPerformance: [
    { subject: 'Math', score: 88 }, { subject: 'Science', score: 82 },
    { subject: 'English', score: 91 }, { subject: 'Hindi', score: 78 }, { subject: 'SST', score: 85 },
  ],
  homework: [
    { subject: 'Mathematics', title: 'Complete Exercise 5.3', due: 'Tomorrow', status: 'pending' },
    { subject: 'English', title: 'Essay on Climate Change', due: 'In 3 days', status: 'pending' },
    { subject: 'Science', title: 'Lab Report — Photosynthesis', due: 'In 2 days', status: 'pending' },
  ],
  notices: [
    { title: 'Half Yearly Exam Schedule Released', time: 'Today', pinned: true },
    { title: 'Annual Day Celebration on Dec 15', time: 'Yesterday', pinned: false },
    { title: 'Fee payment deadline extended to May 15', time: '2 days ago', pinned: false },
    { title: 'PTM scheduled for May 8', time: '3 days ago', pinned: false },
  ],
};
