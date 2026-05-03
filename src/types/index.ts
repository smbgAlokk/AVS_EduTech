/* ============================================
   AVS EduConnect — TypeScript Types
   ============================================ */

export type UserRole = 'super-admin' | 'principal' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  school?: string;
  schoolId?: string;
  designation?: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  principal: string;
  totalStudents: number;
  totalTeachers: number;
  attendanceRate: number;
  feeCollectionRate: number;
  status: 'active' | 'inactive';
  address: string;
  phone: string;
  email: string;
  establishedYear: number;
}

export interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  rollNumber: string;
  className: string;
  section: string;
  schoolId: string;
  schoolName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  parentName: string;
  parentPhone: string;
  attendanceRate: number;
  overallGrade: string;
  rank?: number;
  status: 'active' | 'transferred' | 'graduated' | 'withdrawn';
  bloodGroup?: string;
  address?: string;
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  schoolId: string;
  schoolName: string;
  designation: 'PGT' | 'TGT' | 'PRT';
  qualification: string;
  specialization: string;
  subjects: string[];
  classes: string[];
  joiningDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave' | 'holiday';
  markedBy?: string;
  remarks?: string;
}

export interface Exam {
  id: string;
  name: string;
  examType: 'unit_test' | 'half_yearly' | 'annual';
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  className?: string;
}

export interface ExamScheduleItem {
  id: string;
  examId: string;
  className: string;
  subject: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passingMarks: number;
}

export interface MarksEntry {
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  subject: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  percentage: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  className: string;
  section?: string;
  subject: string;
  teacherName: string;
  dueDate: string;
  type: 'homework' | 'classwork' | 'project' | 'weekly_test';
  status: 'active' | 'closed';
  submissionsCount?: number;
  totalStudents?: number;
}

export interface FeeStructure {
  id: string;
  feeType: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'half_yearly' | 'annual' | 'one_time';
  className?: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  amountPaid: number;
  paymentMethod?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDate?: string;
  receiptNumber?: string;
  monthYear: string;
  dueDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'teachers' | 'parents' | 'students' | 'classes';
  createdBy: string;
  createdAt: string;
  isPinned: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'attendance' | 'fee_reminder' | 'exam' | 'homework' | 'announcement' | 'general';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface SDFund {
  id: string;
  projectName: string;
  fundType: string;
  amountAllocated: number;
  amountUtilized: number;
  purpose: string;
  status: 'requested' | 'approved' | 'utilized' | 'rejected';
  schoolName: string;
  approvedBy?: string;
  createdAt: string;
}

export interface DevelopmentWork {
  id: string;
  title: string;
  description: string;
  workType: string;
  estimatedCost: number;
  actualCost?: number;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'on_hold';
  startDate?: string;
  expectedCompletion?: string;
  actualCompletion?: string;
  schoolName: string;
  progress: number;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: number;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  className: string;
  section: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: 'cultural' | 'sports' | 'academic' | 'competition' | 'other';
  eventDate: string;
  location: string;
}

export interface Activity {
  id: string;
  activityType: 'quiz' | 'olympiad' | 'sports' | 'cultural' | 'career';
  title: string;
  description: string;
  activityDate: string;
  participantsCount?: number;
  registrationDeadline?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface StudyMaterial {
  id: string;
  title: string;
  description?: string;
  className: string;
  subject: string;
  fileType: 'pdf' | 'video' | 'link' | 'document';
  uploadedBy: string;
  createdAt: string;
  fileUrl: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  expenseDate: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  type: 'inter_school' | 'intra_school';
  category: 'quiz' | 'sports' | 'cultural' | 'academic' | 'olympiad';
  date: string;
  registrationDeadline: string;
  participatingSchools: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

// Navigation types
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}
