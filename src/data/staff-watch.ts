/* ============================================
   AVS EduConnect — Staff Watch (Teacher + Principal Compliance)
   ============================================
   Government schools' #1 problem: staff present in
   register but classes not actually conducted, or
   AWOL with paid salary. Sangathan HQ needs
   superpowers to monitor + take disciplinary action
   across the network. Principals need the same for
   their school's teachers.
   ============================================ */

export type StaffRole = 'teacher' | 'principal';
export type StaffDesignation = 'Principal' | 'Vice Principal' | 'PGT' | 'TGT' | 'PRT';
export type RiskLevel = 'compliant' | 'watch' | 'warning' | 'critical' | 'severe';
export type SalaryStatus = 'normal' | 'hold' | 'docked' | 'suspended';

export type ActionType =
  | 'show_cause'
  | 'written_warning'
  | 'salary_hold'
  | 'salary_deduction'
  | 'suspension'
  | 'inspection'
  | 'transfer'
  | 'counseling';

export type ActionStatus = 'pending' | 'responded' | 'closed' | 'escalated' | 'completed';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  designation: StaffDesignation;
  schoolCode: string;
  schoolName: string;
  district: string;
  joiningYear: number;
  phone: string;
  email: string;
  classesAssigned?: string[];
  subjectsTaught?: string[];

  // Attendance numbers (this term to date)
  totalWorkingDays: number;
  daysPresent: number;
  daysAbsent: number;
  daysOnLeave: number;
  attendancePercent: number;

  // Punctuality (current month)
  lateArrivals: number;
  earlyDepartures: number;
  avgArrivalTime: string;
  avgDepartureTime: string;

  // Teaching specifics (teachers)
  scheduledPeriods: number;
  conductedPeriods: number;
  missedPeriods: number;
  classCoverageRate: number;

  // Compliance flags
  awolIncidents: number;
  unjustifiedLeaves: number;
  consecutiveAbsentDays: number;

  // Risk & status
  riskLevel: RiskLevel;
  riskScore: number;
  salaryStatus: SalaryStatus;
  lastActionType?: ActionType;
  lastActionDate?: string;
}

export interface DisciplinaryAction {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: StaffRole;
  staffDesignation: StaffDesignation;
  schoolCode: string;
  schoolName: string;
  type: ActionType;
  reason: string;
  issuedBy: string;
  issuedByRole: 'super_admin' | 'principal';
  issuedOn: string;
  dueDate?: string;
  status: ActionStatus;
  response?: string;
  responseDate?: string;
  notifyStaff: boolean;
}

export interface PeriodLog {
  id: string;
  date: string;
  period: number;
  startTime: string;
  endTime: string;
  className: string;
  section: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  status: 'conducted' | 'missed' | 'substituted' | 'cancelled';
  substituteName?: string;
  notes?: string;
}

export type Confidentiality = 'inspector_only' | 'inspector_hq' | 'announced';
export type VisitPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface SurpriseVisit {
  id: string;
  schoolCode: string;
  schoolName: string;
  date: string;
  time: string;
  inspector: string;
  inspectorDesignation: string;
  staffPresent: number;
  staffExpected: number;
  classesActive: number;
  classesScheduled: number;
  rating: 1 | 2 | 3 | 4 | 5;
  status: 'scheduled' | 'completed';
  findings?: string;
  focusAreas?: string[];
  confidentiality?: Confidentiality;
  priority?: VisitPriority;
  specificConcerns?: string;
}

export const INSPECTOR_ROSTER: { name: string; designation: string }[] = [
  { name: 'Rajesh Sharma',          designation: 'Sangathan Head Office' },
  { name: 'Dr. Lakhi Kalita',        designation: 'Sangathan Director — Academics' },
  { name: 'Er. Pranab Choudhury',   designation: 'Sangathan Engg. Wing' },
  { name: 'Mrs. Reshmi Talukdar',   designation: 'Sangathan HR' },
  { name: 'Mr. Sanjib Das',          designation: 'State Edu Audit Cell' },
  { name: 'Dr. Hiranya Saikia',     designation: 'NABARD Technical Cell' },
  { name: 'Er. Manoranjan Das',      designation: 'Sangathan Engg. Wing' },
];

export const FOCUS_AREAS: string[] = [
  'Staff presence verification',
  'Class running verification',
  'Infrastructure check',
  'Cleanliness & hygiene',
  'Student attendance',
  'Teaching quality observation',
  'Books & registers audit',
  'Anti-corruption check',
];

export const CONFIDENTIALITY_META: Record<Confidentiality, { label: string; description: string }> = {
  inspector_only: { label: 'Inspector only',  description: 'Recommended — staff get zero notice. Inspector receives sealed brief.' },
  inspector_hq:   { label: 'Inspector + HQ',  description: 'HQ leadership is informed of the schedule. Staff still in the dark.' },
  announced:      { label: 'Announced visit', description: 'Principal informed in advance. Use for follow-up audits, not surprise checks.' },
};

/* ─── Action type meta ─── */
export const ACTION_META: Record<ActionType, { label: string; short: string; severity: 1 | 2 | 3 | 4 | 5; description: string }> = {
  show_cause:        { label: 'Show-Cause Notice',      short: 'Show Cause',     severity: 2, description: 'Formal request for written explanation. Staff must reply within 7 days.' },
  written_warning:   { label: 'Written Warning',         short: 'Warning',        severity: 1, description: 'Documented warning entered in the service book.' },
  salary_hold:       { label: 'Salary Hold',             short: 'Hold Salary',    severity: 4, description: 'Withhold full salary pending inquiry. Requires HQ approval.' },
  salary_deduction:  { label: 'Salary Deduction',        short: 'Dock Pay',       severity: 3, description: 'Pro-rata deduction for unjustified absent days.' },
  suspension:        { label: 'Suspension Recommendation', short: 'Suspend',      severity: 5, description: 'Escalates to State Education Department for formal suspension.' },
  inspection:        { label: 'Surprise Inspection',     short: 'Inspect',        severity: 2, description: 'Schedule unannounced visit to verify staff presence and classes running.' },
  transfer:          { label: 'Transfer Recommendation', short: 'Transfer',       severity: 3, description: 'Recommend transfer to another school.' },
  counseling:        { label: 'Counseling Session',      short: 'Counsel',        severity: 1, description: 'Mandatory meeting to discuss performance.' },
};

/* ─── Risk level meta ─── */
export const RISK_META: Record<RiskLevel, { label: string; description: string; range: string }> = {
  compliant: { label: 'Compliant',  description: 'No issues — exemplary attendance and class coverage.', range: '≥ 92% attendance · 0 AWOL' },
  watch:     { label: 'Watch',       description: 'Minor irregularities — monitor closely.',              range: '85–92% · ≤2 late arrivals' },
  warning:   { label: 'Warning',     description: 'Pattern emerging — informal counseling needed.',       range: '78–85% · 1 AWOL or chronic late' },
  critical:  { label: 'Critical',    description: 'Serious lapses — formal action required.',             range: '70–78% · 2+ AWOL or missed periods' },
  severe:    { label: 'Severe',      description: 'Egregious — escalate immediately.',                    range: '< 70% · 3+ AWOL or chronic class skip' },
};

/* ─── Mock staff data ─── */
export const staffMembers: StaffMember[] = [
  /* Demo school principal — generally good record */
  { id: 'STAFF-001', name: 'Dr. Priya Mehta',     role: 'principal', designation: 'Principal',     schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    joiningYear: 2018, phone: '+91 94350 12345', email: 'priya.mehta@avs-tamulpur.edu.in', classesAssigned: [],
    totalWorkingDays: 90, daysPresent: 85, daysAbsent: 2, daysOnLeave: 3, attendancePercent: 94.4,
    lateArrivals: 1, earlyDepartures: 0, avgArrivalTime: '08:48', avgDepartureTime: '16:32',
    scheduledPeriods: 0, conductedPeriods: 0, missedPeriods: 0, classCoverageRate: 100,
    awolIncidents: 0, unjustifiedLeaves: 0, consecutiveAbsentDays: 0,
    riskLevel: 'compliant', riskScore: 8, salaryStatus: 'normal' },

  /* Demo teacher — good record (Anita Sharma) */
  { id: 'STAFF-002', name: 'Mrs. Anita Sharma',   role: 'teacher',   designation: 'PGT',           schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    joiningYear: 2016, phone: '+91 94350 67890', email: 'anita.sharma@avs-tamulpur.edu.in', classesAssigned: ['9-A', '10-A', '10-B'], subjectsTaught: ['Mathematics'],
    totalWorkingDays: 90, daysPresent: 86, daysAbsent: 1, daysOnLeave: 3, attendancePercent: 95.6,
    lateArrivals: 1, earlyDepartures: 0, avgArrivalTime: '08:35', avgDepartureTime: '16:28',
    scheduledPeriods: 432, conductedPeriods: 422, missedPeriods: 10, classCoverageRate: 97.7,
    awolIncidents: 0, unjustifiedLeaves: 0, consecutiveAbsentDays: 0,
    riskLevel: 'compliant', riskScore: 6, salaryStatus: 'normal' },

  /* Watch — minor late arrivals */
  { id: 'STAFF-003', name: 'Mr. Pranab Kalita',   role: 'teacher',   designation: 'TGT',           schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    joiningYear: 2019, phone: '+91 99540 22118', email: 'pranab.kalita@avs-tamulpur.edu.in', classesAssigned: ['7-A', '8-A'], subjectsTaught: ['Science'],
    totalWorkingDays: 90, daysPresent: 81, daysAbsent: 5, daysOnLeave: 4, attendancePercent: 90.0,
    lateArrivals: 6, earlyDepartures: 2, avgArrivalTime: '09:12', avgDepartureTime: '16:10',
    scheduledPeriods: 360, conductedPeriods: 332, missedPeriods: 28, classCoverageRate: 92.2,
    awolIncidents: 0, unjustifiedLeaves: 1, consecutiveAbsentDays: 0,
    riskLevel: 'watch', riskScore: 28, salaryStatus: 'normal' },

  /* Warning — chronic late + missed periods */
  { id: 'STAFF-004', name: 'Mr. Ranjit Bhuyan',   role: 'teacher',   designation: 'TGT',           schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    joiningYear: 2017, phone: '+91 78960 44213', email: 'ranjit.bhuyan@avs-tamulpur.edu.in', classesAssigned: ['8-A', '8-B', '9-B'], subjectsTaught: ['Social Science'],
    totalWorkingDays: 90, daysPresent: 76, daysAbsent: 9, daysOnLeave: 5, attendancePercent: 84.4,
    lateArrivals: 14, earlyDepartures: 6, avgArrivalTime: '09:32', avgDepartureTime: '15:48',
    scheduledPeriods: 432, conductedPeriods: 386, missedPeriods: 46, classCoverageRate: 89.4,
    awolIncidents: 1, unjustifiedLeaves: 2, consecutiveAbsentDays: 0,
    riskLevel: 'warning', riskScore: 48, salaryStatus: 'normal',
    lastActionType: 'counseling', lastActionDate: '2026-04-12' },

  /* Critical — AWOL incidents */
  { id: 'STAFF-005', name: 'Mr. Manash Talukdar', role: 'teacher',   designation: 'PGT',           schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    joiningYear: 2020, phone: '+91 99570 55334', email: 'manash.talukdar@avs-tamulpur.edu.in', classesAssigned: ['9-B', '11-A'], subjectsTaught: ['English'],
    totalWorkingDays: 90, daysPresent: 68, daysAbsent: 18, daysOnLeave: 4, attendancePercent: 75.6,
    lateArrivals: 22, earlyDepartures: 11, avgArrivalTime: '09:48', avgDepartureTime: '15:32',
    scheduledPeriods: 288, conductedPeriods: 224, missedPeriods: 64, classCoverageRate: 77.8,
    awolIncidents: 3, unjustifiedLeaves: 4, consecutiveAbsentDays: 2,
    riskLevel: 'critical', riskScore: 72, salaryStatus: 'normal',
    lastActionType: 'show_cause', lastActionDate: '2026-04-28' },

  /* Severe — chronic absentee, salary hold */
  { id: 'STAFF-006', name: 'Mr. Hemanta Goswami', role: 'teacher',   designation: 'PGT',           schoolCode: 'AVS-MTA', schoolName: 'AVS Matia', district: 'Goalpara',
    joiningYear: 2014, phone: '+91 94350 99014', email: 'hemanta.g@avs-matia.edu.in', classesAssigned: ['10-A', '10-B', '11-A'], subjectsTaught: ['Physics'],
    totalWorkingDays: 90, daysPresent: 54, daysAbsent: 28, daysOnLeave: 8, attendancePercent: 60.0,
    lateArrivals: 28, earlyDepartures: 19, avgArrivalTime: '10:15', avgDepartureTime: '14:42',
    scheduledPeriods: 432, conductedPeriods: 268, missedPeriods: 164, classCoverageRate: 62.0,
    awolIncidents: 6, unjustifiedLeaves: 7, consecutiveAbsentDays: 4,
    riskLevel: 'severe', riskScore: 92, salaryStatus: 'hold',
    lastActionType: 'salary_hold', lastActionDate: '2026-05-02' },

  /* Severe — principal of low-performing school */
  { id: 'STAFF-007', name: 'Mr. Bipin Roy',       role: 'principal', designation: 'Principal',     schoolCode: 'AVS-MTA', schoolName: 'AVS Matia', district: 'Goalpara',
    joiningYear: 2015, phone: '+91 78960 71125', email: 'bipin.roy@avs-matia.edu.in', classesAssigned: [],
    totalWorkingDays: 90, daysPresent: 62, daysAbsent: 22, daysOnLeave: 6, attendancePercent: 68.9,
    lateArrivals: 24, earlyDepartures: 18, avgArrivalTime: '10:22', avgDepartureTime: '14:55',
    scheduledPeriods: 0, conductedPeriods: 0, missedPeriods: 0, classCoverageRate: 100,
    awolIncidents: 4, unjustifiedLeaves: 5, consecutiveAbsentDays: 3,
    riskLevel: 'severe', riskScore: 88, salaryStatus: 'hold',
    lastActionType: 'show_cause', lastActionDate: '2026-04-30' },

  /* Critical — Rupsi school principal */
  { id: 'STAFF-008', name: 'Mr. Sanjib Saha',     role: 'principal', designation: 'Principal',     schoolCode: 'AVS-RPS', schoolName: 'AVS Rupsi', district: 'Barpeta',
    joiningYear: 2017, phone: '+91 99540 38221', email: 'sanjib.saha@avs-rupsi.edu.in', classesAssigned: [],
    totalWorkingDays: 90, daysPresent: 70, daysAbsent: 14, daysOnLeave: 6, attendancePercent: 77.8,
    lateArrivals: 16, earlyDepartures: 12, avgArrivalTime: '09:55', avgDepartureTime: '15:24',
    scheduledPeriods: 0, conductedPeriods: 0, missedPeriods: 0, classCoverageRate: 100,
    awolIncidents: 2, unjustifiedLeaves: 3, consecutiveAbsentDays: 1,
    riskLevel: 'critical', riskScore: 64, salaryStatus: 'normal',
    lastActionType: 'written_warning', lastActionDate: '2026-04-18' },

  /* Critical — chronic late arrival teacher */
  { id: 'STAFF-009', name: 'Mr. Wahid Ali',       role: 'teacher',   designation: 'TGT',           schoolCode: 'AVS-DGS', schoolName: 'AVS Dalgaon Sialmari', district: 'Darrang',
    joiningYear: 2018, phone: '+91 94350 73182', email: 'wahid.ali@avs-dgs.edu.in', classesAssigned: ['6-A', '7-B'], subjectsTaught: ['Hindi', 'Sanskrit'],
    totalWorkingDays: 90, daysPresent: 71, daysAbsent: 14, daysOnLeave: 5, attendancePercent: 78.9,
    lateArrivals: 19, earlyDepartures: 14, avgArrivalTime: '09:52', avgDepartureTime: '15:18',
    scheduledPeriods: 360, conductedPeriods: 274, missedPeriods: 86, classCoverageRate: 76.1,
    awolIncidents: 2, unjustifiedLeaves: 4, consecutiveAbsentDays: 1,
    riskLevel: 'critical', riskScore: 68, salaryStatus: 'normal' },

  /* Watch — Mostly compliant teachers from various schools */
  { id: 'STAFF-010', name: 'Dr. Hiranya Goswami', role: 'principal', designation: 'Principal',     schoolCode: 'AVS-BPT', schoolName: 'AVS Barpeta', district: 'Barpeta',
    joiningYear: 2014, phone: '+91 94350 11421', email: 'h.goswami@avs-barpeta.edu.in', classesAssigned: [],
    totalWorkingDays: 90, daysPresent: 88, daysAbsent: 1, daysOnLeave: 1, attendancePercent: 97.8,
    lateArrivals: 0, earlyDepartures: 0, avgArrivalTime: '08:32', avgDepartureTime: '16:48',
    scheduledPeriods: 0, conductedPeriods: 0, missedPeriods: 0, classCoverageRate: 100,
    awolIncidents: 0, unjustifiedLeaves: 0, consecutiveAbsentDays: 0,
    riskLevel: 'compliant', riskScore: 2, salaryStatus: 'normal' },

  { id: 'STAFF-011', name: 'Mrs. Reshmi Saikia',  role: 'teacher',   designation: 'TGT',           schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    joiningYear: 2019, phone: '+91 94350 47632', email: 'reshmi.s@avs-tamulpur.edu.in', classesAssigned: ['7-B', '8-B'], subjectsTaught: ['English'],
    totalWorkingDays: 90, daysPresent: 82, daysAbsent: 4, daysOnLeave: 4, attendancePercent: 91.1,
    lateArrivals: 5, earlyDepartures: 1, avgArrivalTime: '08:58', avgDepartureTime: '16:22',
    scheduledPeriods: 360, conductedPeriods: 338, missedPeriods: 22, classCoverageRate: 93.9,
    awolIncidents: 0, unjustifiedLeaves: 0, consecutiveAbsentDays: 0,
    riskLevel: 'watch', riskScore: 22, salaryStatus: 'normal' },

  { id: 'STAFF-012', name: 'Mr. Nayan Das',       role: 'teacher',   designation: 'PRT',           schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    joiningYear: 2021, phone: '+91 78960 22156', email: 'nayan.das@avs-tamulpur.edu.in', classesAssigned: ['6-A'], subjectsTaught: ['General'],
    totalWorkingDays: 90, daysPresent: 87, daysAbsent: 1, daysOnLeave: 2, attendancePercent: 96.7,
    lateArrivals: 2, earlyDepartures: 0, avgArrivalTime: '08:42', avgDepartureTime: '16:30',
    scheduledPeriods: 360, conductedPeriods: 354, missedPeriods: 6, classCoverageRate: 98.3,
    awolIncidents: 0, unjustifiedLeaves: 0, consecutiveAbsentDays: 0,
    riskLevel: 'compliant', riskScore: 5, salaryStatus: 'normal' },

  { id: 'STAFF-013', name: 'Mrs. Sushmita Borah', role: 'teacher',   designation: 'TGT',           schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    joiningYear: 2018, phone: '+91 99540 71218', email: 'sushmita.b@avs-tamulpur.edu.in', classesAssigned: ['6-B'], subjectsTaught: ['Mathematics'],
    totalWorkingDays: 90, daysPresent: 84, daysAbsent: 3, daysOnLeave: 3, attendancePercent: 93.3,
    lateArrivals: 3, earlyDepartures: 1, avgArrivalTime: '08:52', avgDepartureTime: '16:25',
    scheduledPeriods: 288, conductedPeriods: 276, missedPeriods: 12, classCoverageRate: 95.8,
    awolIncidents: 0, unjustifiedLeaves: 0, consecutiveAbsentDays: 0,
    riskLevel: 'compliant', riskScore: 9, salaryStatus: 'normal' },

  { id: 'STAFF-014', name: 'Mrs. Lakhi Pegu',     role: 'teacher',   designation: 'TGT',           schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    joiningYear: 2017, phone: '+91 94350 88521', email: 'lakhi.pegu@avs-tamulpur.edu.in', classesAssigned: ['8-B'], subjectsTaught: ['Assamese'],
    totalWorkingDays: 90, daysPresent: 80, daysAbsent: 5, daysOnLeave: 5, attendancePercent: 88.9,
    lateArrivals: 4, earlyDepartures: 2, avgArrivalTime: '09:02', avgDepartureTime: '16:18',
    scheduledPeriods: 216, conductedPeriods: 196, missedPeriods: 20, classCoverageRate: 90.7,
    awolIncidents: 0, unjustifiedLeaves: 1, consecutiveAbsentDays: 0,
    riskLevel: 'watch', riskScore: 24, salaryStatus: 'normal' },

  { id: 'STAFF-015', name: 'Mr. Faruk Ahmed',     role: 'principal', designation: 'Principal',     schoolCode: 'AVS-BCM', schoolName: 'AVS Bechimari', district: 'Darrang',
    joiningYear: 2014, phone: '+91 99540 21218', email: 'faruk.ahmed@avs-bcm.edu.in', classesAssigned: [],
    totalWorkingDays: 90, daysPresent: 84, daysAbsent: 3, daysOnLeave: 3, attendancePercent: 93.3,
    lateArrivals: 2, earlyDepartures: 1, avgArrivalTime: '08:54', avgDepartureTime: '16:35',
    scheduledPeriods: 0, conductedPeriods: 0, missedPeriods: 0, classCoverageRate: 100,
    awolIncidents: 0, unjustifiedLeaves: 0, consecutiveAbsentDays: 0,
    riskLevel: 'compliant', riskScore: 12, salaryStatus: 'normal' },

  { id: 'STAFF-016', name: 'Mrs. Pranati Saha',   role: 'principal', designation: 'Principal',     schoolCode: 'AVS-MTA', schoolName: 'AVS Matia', district: 'Goalpara',
    joiningYear: 2020, phone: '+91 78960 31221', email: 'pranati.s@avs-matia.edu.in', classesAssigned: [],
    totalWorkingDays: 90, daysPresent: 76, daysAbsent: 8, daysOnLeave: 6, attendancePercent: 84.4,
    lateArrivals: 9, earlyDepartures: 4, avgArrivalTime: '09:18', avgDepartureTime: '15:52',
    scheduledPeriods: 0, conductedPeriods: 0, missedPeriods: 0, classCoverageRate: 100,
    awolIncidents: 1, unjustifiedLeaves: 1, consecutiveAbsentDays: 0,
    riskLevel: 'warning', riskScore: 42, salaryStatus: 'normal' },

  { id: 'STAFF-017', name: 'Mr. Ratan Sarma',     role: 'teacher',   designation: 'PGT',           schoolCode: 'AVS-RPS', schoolName: 'AVS Rupsi', district: 'Barpeta',
    joiningYear: 2016, phone: '+91 94350 81427', email: 'ratan.s@avs-rupsi.edu.in', classesAssigned: ['11-A', '12-A'], subjectsTaught: ['Chemistry'],
    totalWorkingDays: 90, daysPresent: 64, daysAbsent: 18, daysOnLeave: 8, attendancePercent: 71.1,
    lateArrivals: 21, earlyDepartures: 14, avgArrivalTime: '09:58', avgDepartureTime: '15:08',
    scheduledPeriods: 288, conductedPeriods: 218, missedPeriods: 70, classCoverageRate: 75.7,
    awolIncidents: 4, unjustifiedLeaves: 5, consecutiveAbsentDays: 2,
    riskLevel: 'severe', riskScore: 84, salaryStatus: 'docked',
    lastActionType: 'salary_deduction', lastActionDate: '2026-04-25' },

  { id: 'STAFF-018', name: 'Mr. Sankar Boro',     role: 'teacher',   designation: 'TGT',           schoolCode: 'AVS-LKP', schoolName: 'AVS Lakhipur', district: 'Goalpara',
    joiningYear: 2019, phone: '+91 99570 14821', email: 'sankar.boro@avs-lakhipur.edu.in', classesAssigned: ['8-A', '9-A'], subjectsTaught: ['Mathematics'],
    totalWorkingDays: 90, daysPresent: 73, daysAbsent: 12, daysOnLeave: 5, attendancePercent: 81.1,
    lateArrivals: 14, earlyDepartures: 8, avgArrivalTime: '09:35', avgDepartureTime: '15:42',
    scheduledPeriods: 360, conductedPeriods: 308, missedPeriods: 52, classCoverageRate: 85.6,
    awolIncidents: 1, unjustifiedLeaves: 2, consecutiveAbsentDays: 0,
    riskLevel: 'warning', riskScore: 52, salaryStatus: 'normal',
    lastActionType: 'written_warning', lastActionDate: '2026-04-22' },
];

/* ─── Disciplinary actions log ─── */
export const disciplinaryActions: DisciplinaryAction[] = [
  { id: 'DA-2026-0014', staffId: 'STAFF-006', staffName: 'Mr. Hemanta Goswami',  staffRole: 'teacher',   staffDesignation: 'PGT',       schoolCode: 'AVS-MTA', schoolName: 'AVS Matia',     type: 'salary_hold',      reason: 'Continued unauthorized absence (6 AWOL incidents) and class coverage rate below 65%. Pending response to show-cause notice DA-2026-0009.', issuedBy: 'Rajesh Sharma',     issuedByRole: 'super_admin', issuedOn: '2026-05-02', dueDate: '2026-05-16', status: 'pending',  notifyStaff: true },
  { id: 'DA-2026-0013', staffId: 'STAFF-007', staffName: 'Mr. Bipin Roy',         staffRole: 'principal', staffDesignation: 'Principal', schoolCode: 'AVS-MTA', schoolName: 'AVS Matia',     type: 'show_cause',       reason: 'AVS Matia school-wide attendance dropped to 72.5% — lowest in network. Multiple staff under your supervision have AWOL incidents. Explain the absence of corrective action.', issuedBy: 'Rajesh Sharma',     issuedByRole: 'super_admin', issuedOn: '2026-04-30', dueDate: '2026-05-07', status: 'pending',  notifyStaff: true },
  { id: 'DA-2026-0012', staffId: 'STAFF-005', staffName: 'Mr. Manash Talukdar',   staffRole: 'teacher',   staffDesignation: 'PGT',       schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', type: 'show_cause',       reason: '3 AWOL incidents in the past 30 days. Class coverage rate at 77.8% (target: 90%+). Submit written explanation within 7 days.', issuedBy: 'Dr. Priya Mehta',   issuedByRole: 'principal',   issuedOn: '2026-04-28', dueDate: '2026-05-05', status: 'responded', responseDate: '2026-05-04', response: 'Health issues — undergoing treatment. Doctor\'s certificate for partial recovery period attached. Will compensate missed classes through extra periods.', notifyStaff: true },
  { id: 'DA-2026-0011', staffId: 'STAFF-017', staffName: 'Mr. Ratan Sarma',       staffRole: 'teacher',   staffDesignation: 'PGT',       schoolCode: 'AVS-RPS', schoolName: 'AVS Rupsi',     type: 'salary_deduction', reason: 'Pro-rata salary deduction for 18 days unauthorized absence. As per Service Rules Sec 4(2)(c).', issuedBy: 'Rajesh Sharma',     issuedByRole: 'super_admin', issuedOn: '2026-04-25', status: 'completed', notifyStaff: true },
  { id: 'DA-2026-0010', staffId: 'STAFF-018', staffName: 'Mr. Sankar Boro',       staffRole: 'teacher',   staffDesignation: 'TGT',       schoolCode: 'AVS-LKP', schoolName: 'AVS Lakhipur', type: 'written_warning',  reason: '14 late arrivals and 8 early departures this term. Coverage rate 85.6%. Improvement expected by end of month.', issuedBy: 'Rajesh Sharma',     issuedByRole: 'super_admin', issuedOn: '2026-04-22', status: 'closed',    notifyStaff: true },
  { id: 'DA-2026-0009', staffId: 'STAFF-006', staffName: 'Mr. Hemanta Goswami',  staffRole: 'teacher',   staffDesignation: 'PGT',       schoolCode: 'AVS-MTA', schoolName: 'AVS Matia',     type: 'show_cause',       reason: 'Persistent absenteeism, classes regularly skipped, students complain of no Physics teaching for weeks. Submit written explanation within 7 days.', issuedBy: 'Rajesh Sharma',     issuedByRole: 'super_admin', issuedOn: '2026-04-20', dueDate: '2026-04-27', status: 'escalated', notifyStaff: true },
  { id: 'DA-2026-0008', staffId: 'STAFF-008', staffName: 'Mr. Sanjib Saha',       staffRole: 'principal', staffDesignation: 'Principal', schoolCode: 'AVS-RPS', schoolName: 'AVS Rupsi',     type: 'written_warning',  reason: 'School attendance below 75% threshold for 2 consecutive months. Strengthen monitoring and report fortnightly.', issuedBy: 'Rajesh Sharma',     issuedByRole: 'super_admin', issuedOn: '2026-04-18', status: 'closed',    notifyStaff: true },
  { id: 'DA-2026-0007', staffId: 'STAFF-004', staffName: 'Mr. Ranjit Bhuyan',     staffRole: 'teacher',   staffDesignation: 'TGT',       schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', type: 'counseling',       reason: 'Pattern of late arrivals (14 in last month). Mandatory counseling session with Vice Principal scheduled for 15 April.', issuedBy: 'Dr. Priya Mehta',   issuedByRole: 'principal',   issuedOn: '2026-04-12', status: 'completed', notifyStaff: false },
];

/* ─── Today's period log (demo school 10-A) ─── */
export const todayPeriodLog: PeriodLog[] = [
  { id: 'PL-001', date: '2026-05-08', period: 1, startTime: '08:30', endTime: '09:15', className: '10', section: 'A', subject: 'Mathematics',     teacherId: 'STAFF-002', teacherName: 'Mrs. Anita Sharma',    status: 'conducted' },
  { id: 'PL-002', date: '2026-05-08', period: 2, startTime: '09:15', endTime: '10:00', className: '10', section: 'A', subject: 'Science',         teacherId: 'STAFF-003', teacherName: 'Mr. Pranab Kalita',    status: 'conducted' },
  { id: 'PL-003', date: '2026-05-08', period: 3, startTime: '10:00', endTime: '10:45', className: '10', section: 'A', subject: 'English',         teacherId: 'STAFF-005', teacherName: 'Mr. Manash Talukdar',  status: 'missed', notes: 'Teacher absent without notice' },
  { id: 'PL-004', date: '2026-05-08', period: 4, startTime: '11:00', endTime: '11:45', className: '10', section: 'A', subject: 'Social Science', teacherId: 'STAFF-004', teacherName: 'Mr. Ranjit Bhuyan',    status: 'conducted' },
  { id: 'PL-005', date: '2026-05-08', period: 5, startTime: '11:45', endTime: '12:30', className: '10', section: 'A', subject: 'Hindi',           teacherId: 'STAFF-009', teacherName: 'Mr. Wahid Ali',        status: 'substituted', substituteName: 'Mr. Nayan Das' },
  { id: 'PL-006', date: '2026-05-08', period: 6, startTime: '13:15', endTime: '14:00', className: '10', section: 'A', subject: 'Assamese',        teacherId: 'STAFF-014', teacherName: 'Mrs. Lakhi Pegu',      status: 'conducted' },
  { id: 'PL-007', date: '2026-05-08', period: 7, startTime: '14:00', endTime: '14:45', className: '10', section: 'A', subject: 'Mathematics',     teacherId: 'STAFF-002', teacherName: 'Mrs. Anita Sharma',    status: 'conducted' },
  { id: 'PL-008', date: '2026-05-08', period: 8, startTime: '14:45', endTime: '15:30', className: '10', section: 'A', subject: 'Computer Sci.',  teacherId: 'STAFF-013', teacherName: 'Mrs. Sushmita Borah',  status: 'conducted' },

  { id: 'PL-101', date: '2026-05-08', period: 1, startTime: '08:30', endTime: '09:15', className: '9',  section: 'B', subject: 'Mathematics',     teacherId: 'STAFF-002', teacherName: 'Mrs. Anita Sharma',    status: 'conducted' },
  { id: 'PL-102', date: '2026-05-08', period: 2, startTime: '09:15', endTime: '10:00', className: '9',  section: 'B', subject: 'English',         teacherId: 'STAFF-005', teacherName: 'Mr. Manash Talukdar',  status: 'missed', notes: 'No teacher present' },
  { id: 'PL-103', date: '2026-05-08', period: 3, startTime: '10:00', endTime: '10:45', className: '9',  section: 'B', subject: 'Science',         teacherId: 'STAFF-003', teacherName: 'Mr. Pranab Kalita',    status: 'conducted' },
  { id: 'PL-104', date: '2026-05-08', period: 4, startTime: '11:00', endTime: '11:45', className: '9',  section: 'B', subject: 'Hindi',           teacherId: 'STAFF-009', teacherName: 'Mr. Wahid Ali',        status: 'cancelled', notes: 'Wahid Ali on leave; no substitute available' },
];

/* ─── Surprise inspection visits ─── */
export const surpriseVisits: SurpriseVisit[] = [
  { id: 'SV-2026-006', schoolCode: 'AVS-MTA', schoolName: 'AVS Matia',     date: '2026-05-12', time: '11:30', inspector: 'Dr. Lakhi Kalita',     inspectorDesignation: 'Sangathan Director — Academics', staffPresent: 0, staffExpected: 0, classesActive: 0, classesScheduled: 0, rating: 1, status: 'scheduled' },
  { id: 'SV-2026-005', schoolCode: 'AVS-RPS', schoolName: 'AVS Rupsi',     date: '2026-05-10', time: '10:15', inspector: 'Er. Pranab Choudhury', inspectorDesignation: 'Sangathan Engg. Wing',           staffPresent: 0, staffExpected: 0, classesActive: 0, classesScheduled: 0, rating: 1, status: 'scheduled' },
  { id: 'SV-2026-004', schoolCode: 'AVS-MTA', schoolName: 'AVS Matia',     date: '2026-04-29', time: '11:00', inspector: 'Dr. Lakhi Kalita',     inspectorDesignation: 'Sangathan Director — Academics', staffPresent: 14, staffExpected: 22, classesActive: 8, classesScheduled: 16, rating: 2, status: 'completed', findings: 'Significant absenteeism. Principal arrived 11:24 AM. 4 classrooms unattended. Show-cause notices issued on the spot.' },
  { id: 'SV-2026-003', schoolCode: 'AVS-DGS', schoolName: 'AVS Dalgaon Sialmari', date: '2026-04-22', time: '13:45', inspector: 'Mrs. Reshmi Talukdar', inspectorDesignation: 'Sangathan HR',          staffPresent: 18, staffExpected: 21, classesActive: 14, classesScheduled: 16, rating: 3, status: 'completed', findings: 'Generally satisfactory. Two teachers found chatting during scheduled periods — verbal warning given.' },
  { id: 'SV-2026-002', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur',  date: '2026-04-15', time: '09:30', inspector: 'Rajesh Sharma',         inspectorDesignation: 'Sangathan Head Office',          staffPresent: 24, staffExpected: 26, classesActive: 12, classesScheduled: 12, rating: 5, status: 'completed', findings: 'Excellent. All scheduled classes running. Principal proactive. Recommended as model school.' },
  { id: 'SV-2026-001', schoolCode: 'AVS-RPS', schoolName: 'AVS Rupsi',     date: '2026-04-08', time: '14:15', inspector: 'Dr. Lakhi Kalita',     inspectorDesignation: 'Sangathan Director — Academics', staffPresent: 12, staffExpected: 18, classesActive: 7, classesScheduled: 14, rating: 2, status: 'completed', findings: 'Below standard. 6 staff absent without leave. Half the scheduled periods not running. Show-cause issued to Principal.' },
];

/* ─── Aggregations ─── */
export interface StaffWatchSummary {
  totalStaff: number;
  compliantCount: number;
  watchCount: number;
  warningCount: number;
  criticalCount: number;
  severeCount: number;
  pendingActions: number;
  classCoverageRate: number;
  awolIncidentsThisMonth: number;
  salaryHoldCount: number;
}

export function summarize(staff: StaffMember[]): StaffWatchSummary {
  const totalScheduled = staff.reduce((s, x) => s + x.scheduledPeriods, 0);
  const totalConducted = staff.reduce((s, x) => s + x.conductedPeriods, 0);
  return {
    totalStaff: staff.length,
    compliantCount: staff.filter(s => s.riskLevel === 'compliant').length,
    watchCount:     staff.filter(s => s.riskLevel === 'watch').length,
    warningCount:   staff.filter(s => s.riskLevel === 'warning').length,
    criticalCount:  staff.filter(s => s.riskLevel === 'critical').length,
    severeCount:    staff.filter(s => s.riskLevel === 'severe').length,
    pendingActions: disciplinaryActions.filter(a => a.status === 'pending').length,
    classCoverageRate: totalScheduled > 0 ? parseFloat(((totalConducted / totalScheduled) * 100).toFixed(1)) : 100,
    awolIncidentsThisMonth: staff.reduce((s, x) => s + x.awolIncidents, 0),
    salaryHoldCount: staff.filter(s => s.salaryStatus !== 'normal').length,
  };
}
