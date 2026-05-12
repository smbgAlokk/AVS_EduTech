/* ============================================
   AVS EduConnect — Initiatives Data Layer
   ============================================
   Network-wide programs / campaigns / drives launched
   from Sangathan HQ. Distinct from Competitions —
   initiatives are ongoing programs (PM POSHAN, NISHTHA
   training, health camps), not single contest events.
   ============================================ */

export type InitiativeCategory =
  | 'government_scheme'
  | 'health_wellness'
  | 'academic'
  | 'capacity_building'
  | 'awards_recognition'
  | 'awareness'
  | 'community'
  | 'infrastructure'
  | 'cultural'
  | 'sports';

export type InitiativeStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';

export type InitiativePriority = 'flagship' | 'high' | 'medium' | 'low';

export type InitiativeFundingSource = 'central_govt' | 'state_govt' | 'sangathan' | 'csr' | 'mixed';

export type ParticipationStatus = 'invited' | 'opted_in' | 'in_progress' | 'completed' | 'opted_out';

export interface InitiativeKPI {
  id: string;
  label: string;
  target: number;
  current: number;
  unit: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Initiative {
  id: string;
  code: string;
  title: string;
  description: string;
  category: InitiativeCategory;
  status: InitiativeStatus;
  priority: InitiativePriority;

  /* Source */
  fundingSource: InitiativeFundingSource;
  governmentScheme?: string;

  /* Timeline */
  startDate: string;
  endDate: string;
  launchedOn: string;

  /* Owner */
  ownerName: string;
  ownerRole: string;

  /* Targeting */
  targetingType: 'all_schools' | 'selected_schools' | 'class_specific';
  targetSchools: string[];
  targetClasses?: string[];

  /* Budget */
  budgetAllocated: number;
  budgetUtilized: number;

  /* Reach */
  totalSchools: number;
  enrolledSchools: number;
  totalBeneficiaries: number;
  reachedBeneficiaries: number;

  /* KPIs */
  kpis: InitiativeKPI[];

  /* Progress */
  progressPercent: number;
  milestones: Milestone[];

  /* Resources */
  resourceCount: number;

  /* Visual */
  bannerKey: string;     /* maps to a colour gradient at component level */

  /* Engagement */
  hashtags?: string[];
}

export interface SchoolParticipation {
  initiativeId: string;
  schoolCode: string;
  schoolName: string;
  status: ParticipationStatus;
  enrolledOn?: string;
  contribution: number;     /* 0-100 */
  beneficiariesLocal: number;
  lastUpdate?: string;
}

export interface StudentEnrollment {
  initiativeId: string;
  studentId: string;
  studentName: string;
  schoolCode: string;
  className: string;
  enrolledOn: string;
  status: 'enrolled' | 'active' | 'completed' | 'awarded';
  badgeEarned?: string;
  certificate?: boolean;
  progressPercent: number;
}

/* ─── Category meta (icon key + visual tone) ─── */
export const CATEGORY_META: Record<InitiativeCategory, { label: string; iconKey: string; tone: string; gradient: string }> = {
  government_scheme:  { label: 'Govt Scheme',         iconKey: 'Building2',     tone: '#10B981', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
  health_wellness:    { label: 'Health & Wellness',   iconKey: 'Heart',          tone: '#EC4899', gradient: 'linear-gradient(135deg, #F472B6, #EC4899)' },
  academic:           { label: 'Academic',             iconKey: 'GraduationCap', tone: '#3B82F6', gradient: 'linear-gradient(135deg, #60A5FA, #3B82F6)' },
  capacity_building:  { label: 'Capacity Building',   iconKey: 'BookOpen',       tone: '#8B5CF6', gradient: 'linear-gradient(135deg, #A78BFA, #8B5CF6)' },
  awards_recognition: { label: 'Awards & Recognition', iconKey: 'Trophy',         tone: '#F59E0B', gradient: 'linear-gradient(135deg, #FBBF24, #F59E0B)' },
  awareness:          { label: 'Awareness Drive',      iconKey: 'Megaphone',      tone: '#F97316', gradient: 'linear-gradient(135deg, #FB923C, #F97316)' },
  community:          { label: 'Community',            iconKey: 'Users',          tone: '#06B6D4', gradient: 'linear-gradient(135deg, #22D3EE, #06B6D4)' },
  infrastructure:     { label: 'Infrastructure',       iconKey: 'Wrench',         tone: '#64748B', gradient: 'linear-gradient(135deg, #94A3B8, #64748B)' },
  cultural:           { label: 'Cultural',             iconKey: 'Music',          tone: '#A855F7', gradient: 'linear-gradient(135deg, #C084FC, #A855F7)' },
  sports:             { label: 'Sports & Fitness',    iconKey: 'Activity',       tone: '#14B8A6', gradient: 'linear-gradient(135deg, #2DD4BF, #14B8A6)' },
};

export const FUNDING_LABEL: Record<InitiativeFundingSource, string> = {
  central_govt: 'Central Govt',
  state_govt:   'State Govt of Assam',
  sangathan:    'Sangathan Internal',
  csr:          'CSR Partnership',
  mixed:        'Mixed Funding',
};

export const PRIORITY_META: Record<InitiativePriority, { label: string; tone: string }> = {
  flagship: { label: 'Flagship', tone: '#10B981' },
  high:     { label: 'High',     tone: '#F59E0B' },
  medium:   { label: 'Medium',   tone: '#3B82F6' },
  low:      { label: 'Low',      tone: '#94A3B8' },
};

export const STATUS_META: Record<InitiativeStatus, { label: string; tone: string }> = {
  draft:     { label: 'Draft',     tone: '#94A3B8' },
  scheduled: { label: 'Scheduled', tone: '#3B82F6' },
  active:    { label: 'Active',    tone: '#10B981' },
  paused:    { label: 'Paused',    tone: '#F59E0B' },
  completed: { label: 'Completed', tone: '#7C3AED' },
  cancelled: { label: 'Cancelled', tone: '#EF4444' },
};

export const PARTICIPATION_META: Record<ParticipationStatus, { label: string; tone: string; bg: string }> = {
  invited:     { label: 'Invited',      tone: '#94A3B8', bg: 'rgba(148, 163, 184, 0.16)' },
  opted_in:    { label: 'Opted in',     tone: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)' },
  in_progress: { label: 'In progress',  tone: '#F59E0B', bg: 'rgba(245, 158, 11, 0.14)' },
  completed:   { label: 'Completed',    tone: '#10B981', bg: 'rgba(16, 185, 129, 0.14)' },
  opted_out:   { label: 'Opted out',    tone: '#EF4444', bg: 'rgba(239, 68, 68, 0.10)' },
};

/* ─── 12 schools used in matrix ─── */
export const NETWORK_SCHOOLS: { code: string; name: string; district: string; students: number }[] = [
  { code: 'AVS-TML', name: 'AVS Tamulpur',           district: 'Baksa',     students: 478 },
  { code: 'AVS-BPT', name: 'AVS Barpeta',            district: 'Barpeta',   students: 624 },
  { code: 'AVS-NGJ', name: 'AVS Nagrijuli',          district: 'Baksa',     students: 412 },
  { code: 'AVS-CNG', name: 'AVS Chenga',             district: 'Barpeta',   students: 528 },
  { code: 'AVS-PMD', name: 'AVS Pub Mangaldoi',      district: 'Darrang',   students: 612 },
  { code: 'AVS-DGS', name: 'AVS Dalgaon Sialmari',   district: 'Darrang',   students: 478 },
  { code: 'AVS-BCM', name: 'AVS Bechimari',          district: 'Darrang',   students: 542 },
  { code: 'AVS-RPS', name: 'AVS Rupsi',              district: 'Barpeta',   students: 365 },
  { code: 'AVS-DKC', name: 'AVS Dokuchi',            district: 'Kamrup',    students: 458 },
  { code: 'AVS-LKP', name: 'AVS Lakhipur',           district: 'Goalpara',  students: 478 },
  { code: 'AVS-MTA', name: 'AVS Matia',              district: 'Goalpara',  students: 425 },
  { code: 'AVS-KKR', name: 'AVS Kokrajhar',          district: 'Kokrajhar', students: 562 },
];

/* ─── 15 mock initiatives ─── */
export const initiatives: Initiative[] = [
  {
    id: 'INI-001', code: 'AVS/INI/26/POSHAN',
    title: 'PM POSHAN — Mid-Day Meal Programme',
    description: 'Daily nutritious mid-day meal for all enrolled students. Compliance audits, kitchen hygiene, supply chain monitoring across the network.',
    category: 'government_scheme', status: 'active', priority: 'flagship',
    fundingSource: 'central_govt', governmentScheme: 'Pradhan Mantri Poshan Shakti Nirman',
    startDate: '2025-04-01', endDate: '2026-03-31', launchedOn: '2025-04-01',
    ownerName: 'Mrs. Reshmi Talukdar', ownerRole: 'Sangathan HR — Nutrition Cell',
    targetingType: 'all_schools', targetSchools: [],
    budgetAllocated: 18500000, budgetUtilized: 11200000,
    totalSchools: 12, enrolledSchools: 12, totalBeneficiaries: 5962, reachedBeneficiaries: 5824,
    kpis: [
      { id: 'K1', label: 'Hot meals served (this month)', target: 178000, current: 168420, unit: 'meals' },
      { id: 'K2', label: 'Schools at full compliance',     target: 12,     current: 11,     unit: 'schools' },
      { id: 'K3', label: 'Avg. hygiene rating',            target: 5,      current: 4.4,    unit: '/5' },
      { id: 'K4', label: 'Beneficiary attendance lift',    target: 5,      current: 3.2,    unit: '%' },
    ],
    progressPercent: 65,
    milestones: [
      { id: 'M1', title: 'Q1 audit visit cycle', date: '2025-07-15', status: 'completed' },
      { id: 'M2', title: 'Q2 audit visit cycle', date: '2025-10-15', status: 'completed' },
      { id: 'M3', title: 'Q3 supply renegotiation', date: '2026-01-20', status: 'completed' },
      { id: 'M4', title: 'Q4 final compliance + UC submission', date: '2026-03-25', status: 'in_progress' },
    ],
    resourceCount: 14,
    bannerKey: 'government_scheme',
    hashtags: ['#PMPoshan', '#MidDayMeal', '#Nutrition'],
  },
  {
    id: 'INI-002', code: 'AVS/INI/26/NIPUN',
    title: 'NIPUN Bharat — Foundational Literacy & Numeracy',
    description: 'National Initiative for Proficiency in Reading with Understanding and Numeracy. Class 1–3 assessment, teacher training, learning material distribution.',
    category: 'academic', status: 'active', priority: 'flagship',
    fundingSource: 'central_govt', governmentScheme: 'NIPUN Bharat (NEP 2020)',
    startDate: '2025-06-01', endDate: '2026-05-31', launchedOn: '2025-05-25',
    ownerName: 'Dr. Lakhi Kalita', ownerRole: 'Sangathan Director — Academics',
    targetingType: 'all_schools', targetSchools: [], targetClasses: ['1', '2', '3'],
    budgetAllocated: 4800000, budgetUtilized: 3100000,
    totalSchools: 12, enrolledSchools: 12, totalBeneficiaries: 1842, reachedBeneficiaries: 1654,
    kpis: [
      { id: 'K1', label: 'Students at grade level',  target: 1842, current: 1420, unit: 'students' },
      { id: 'K2', label: 'Teachers trained on FLN',   target: 96,   current: 88,   unit: 'teachers' },
      { id: 'K3', label: 'Learning kits distributed', target: 1842, current: 1842, unit: 'kits' },
      { id: 'K4', label: 'Schools certified NIPUN-ready', target: 12, current: 7, unit: 'schools' },
    ],
    progressPercent: 78,
    milestones: [
      { id: 'M1', title: 'Baseline assessment',     date: '2025-07-30', status: 'completed' },
      { id: 'M2', title: 'Teacher cohort training', date: '2025-10-15', status: 'completed' },
      { id: 'M3', title: 'Mid-line assessment',     date: '2026-01-20', status: 'completed' },
      { id: 'M4', title: 'Endline + certification', date: '2026-05-15', status: 'in_progress' },
    ],
    resourceCount: 22,
    bannerKey: 'academic',
    hashtags: ['#NIPUNBharat', '#FLN', '#NEP2020'],
  },
  {
    id: 'INI-003', code: 'AVS/INI/26/NISHTHA',
    title: 'NISHTHA 4.0 — Teacher Capacity Building',
    description: 'National Initiative for School Heads and Teachers Holistic Advancement. Online + on-ground training for 1,892 teachers across the network.',
    category: 'capacity_building', status: 'active', priority: 'high',
    fundingSource: 'central_govt', governmentScheme: 'NISHTHA — DIKSHA Platform',
    startDate: '2025-09-01', endDate: '2026-08-31', launchedOn: '2025-08-28',
    ownerName: 'Mr. Pranab Choudhury', ownerRole: 'Sangathan — Teacher Development',
    targetingType: 'all_schools', targetSchools: [],
    budgetAllocated: 2850000, budgetUtilized: 1620000,
    totalSchools: 12, enrolledSchools: 12, totalBeneficiaries: 1892, reachedBeneficiaries: 1418,
    kpis: [
      { id: 'K1', label: 'Teachers enrolled',     target: 1892, current: 1842, unit: 'teachers' },
      { id: 'K2', label: 'Modules completed',     target: 18,   current: 11,   unit: 'modules' },
      { id: 'K3', label: 'Teachers certified',    target: 1892, current: 1102, unit: 'teachers' },
      { id: 'K4', label: 'Avg. assessment score', target: 80,   current: 73,   unit: '%' },
    ],
    progressPercent: 58,
    milestones: [
      { id: 'M1', title: 'Cohort 1 enrolment',      date: '2025-09-15', status: 'completed' },
      { id: 'M2', title: 'Modules 1–6 completion',  date: '2025-12-15', status: 'completed' },
      { id: 'M3', title: 'Modules 7–12 completion', date: '2026-04-15', status: 'in_progress' },
      { id: 'M4', title: 'Final certification',     date: '2026-08-25', status: 'pending' },
    ],
    resourceCount: 36,
    bannerKey: 'capacity_building',
  },
  {
    id: 'INI-004', code: 'AVS/INI/26/HEALTH',
    title: 'Vidyalaya Annual Health Camp 2026',
    description: 'Annual school health screening covering general check-up, eye/dental, BMI tracking, immunisation status, mental wellness counselling.',
    category: 'health_wellness', status: 'active', priority: 'high',
    fundingSource: 'state_govt', governmentScheme: 'Rashtriya Bal Swasthya Karyakram',
    startDate: '2026-04-01', endDate: '2026-07-31', launchedOn: '2026-03-25',
    ownerName: 'Dr. Anjali Bordoloi', ownerRole: 'Sangathan — Health Coordinator',
    targetingType: 'all_schools', targetSchools: [],
    budgetAllocated: 1450000, budgetUtilized: 624000,
    totalSchools: 12, enrolledSchools: 12, totalBeneficiaries: 5962, reachedBeneficiaries: 2340,
    kpis: [
      { id: 'K1', label: 'Students screened', target: 5962, current: 2340, unit: 'students' },
      { id: 'K2', label: 'Camps conducted',    target: 12,   current: 5,    unit: 'camps' },
      { id: 'K3', label: 'Referrals raised',   target: 0,    current: 184,  unit: 'cases' },
      { id: 'K4', label: 'Spectacles issued',  target: 240,  current: 96,   unit: 'pairs' },
    ],
    progressPercent: 40,
    milestones: [
      { id: 'M1', title: 'Camp 1 — AVS Tamulpur',      date: '2026-04-08', status: 'completed' },
      { id: 'M2', title: 'Camp 2 — AVS Barpeta',       date: '2026-04-22', status: 'completed' },
      { id: 'M3', title: 'Camps 6–12 (June batch)',    date: '2026-06-30', status: 'pending' },
      { id: 'M4', title: 'Network report submission',  date: '2026-07-25', status: 'pending' },
    ],
    resourceCount: 8,
    bannerKey: 'health_wellness',
  },
  {
    id: 'INI-005', code: 'AVS/INI/26/SVP',
    title: 'Swachh Vidyalaya Puraskar 2026',
    description: 'National school cleanliness award. Self-assessment + district verification + state nomination. Sangathan target — 5 nominations from network.',
    category: 'awards_recognition', status: 'active', priority: 'medium',
    fundingSource: 'central_govt', governmentScheme: 'Ministry of Education — SVP',
    startDate: '2026-02-01', endDate: '2026-07-15', launchedOn: '2026-01-28',
    ownerName: 'Mr. Bipul Basumatary', ownerRole: 'Principal — AVS Tamulpur (lead)',
    targetingType: 'all_schools', targetSchools: [],
    budgetAllocated: 280000, budgetUtilized: 84000,
    totalSchools: 12, enrolledSchools: 9, totalBeneficiaries: 5962, reachedBeneficiaries: 4280,
    kpis: [
      { id: 'K1', label: 'Self-assessments submitted', target: 12, current: 9, unit: 'schools' },
      { id: 'K2', label: 'District verified',           target: 12, current: 6, unit: 'schools' },
      { id: 'K3', label: 'State nominations',           target: 5,  current: 0, unit: 'schools' },
      { id: 'K4', label: 'Avg. cleanliness score',      target: 90, current: 78, unit: '%' },
    ],
    progressPercent: 45,
    milestones: [
      { id: 'M1', title: 'Self-assessment window', date: '2026-03-15', status: 'completed' },
      { id: 'M2', title: 'District verification',  date: '2026-05-10', status: 'in_progress' },
      { id: 'M3', title: 'State nomination',       date: '2026-06-30', status: 'pending' },
      { id: 'M4', title: 'Award ceremony',         date: '2026-08-15', status: 'pending' },
    ],
    resourceCount: 6,
    bannerKey: 'awards_recognition',
  },
  {
    id: 'INI-006', code: 'AVS/INI/26/READ50',
    title: 'Reading Challenge — 50 Books in 50 Days',
    description: 'Library mobilisation drive. Each Class 4–10 student reads 5+ books across 50 days. Tracking via reading log + comprehension quiz.',
    category: 'academic', status: 'active', priority: 'medium',
    fundingSource: 'sangathan',
    startDate: '2026-04-15', endDate: '2026-06-04', launchedOn: '2026-04-10',
    ownerName: 'Mrs. Pooja Deka', ownerRole: 'Sangathan — Library Cell',
    targetingType: 'all_schools', targetSchools: [],
    budgetAllocated: 320000, budgetUtilized: 98000,
    totalSchools: 12, enrolledSchools: 11, totalBeneficiaries: 4242, reachedBeneficiaries: 3680,
    kpis: [
      { id: 'K1', label: 'Students enrolled',  target: 4242, current: 3680, unit: 'students' },
      { id: 'K2', label: 'Books read (network)', target: 21210, current: 12420, unit: 'books' },
      { id: 'K3', label: 'Quizzes completed',  target: 4242, current: 2864, unit: 'students' },
      { id: 'K4', label: 'Avg. quiz score',    target: 75,   current: 72,   unit: '%' },
    ],
    progressPercent: 55,
    milestones: [
      { id: 'M1', title: 'Launch + library audit', date: '2026-04-15', status: 'completed' },
      { id: 'M2', title: 'Mid-point assessment',    date: '2026-05-09', status: 'in_progress' },
      { id: 'M3', title: 'Final quiz + awards',     date: '2026-06-04', status: 'pending' },
    ],
    resourceCount: 4,
    bannerKey: 'academic',
    hashtags: ['#Read50', '#LibraryMonth'],
  },
  {
    id: 'INI-007', code: 'AVS/INI/26/MATHOLY',
    title: 'Inter-School Math Olympiad — Selection Phase',
    description: 'Sangathan-wide selection contest for Class 6–12. Phase 1 — school-level. Phase 2 — district. Phase 3 — Sangathan finals + state representation.',
    category: 'academic', status: 'active', priority: 'medium',
    fundingSource: 'sangathan',
    startDate: '2026-04-20', endDate: '2026-06-15', launchedOn: '2026-04-10',
    ownerName: 'Mr. Hemanta Goswami', ownerRole: 'Sangathan — Academics PGT-Math',
    targetingType: 'class_specific', targetSchools: [], targetClasses: ['6', '7', '8', '9', '10', '11', '12'],
    budgetAllocated: 240000, budgetUtilized: 86000,
    totalSchools: 12, enrolledSchools: 12, totalBeneficiaries: 3850, reachedBeneficiaries: 2840,
    kpis: [
      { id: 'K1', label: 'Students registered', target: 3850, current: 2840, unit: 'students' },
      { id: 'K2', label: 'Phase 1 completed',   target: 12,   current: 8,    unit: 'schools' },
      { id: 'K3', label: 'Top scorers shortlist', target: 60, current: 0,    unit: 'students' },
    ],
    progressPercent: 35,
    milestones: [
      { id: 'M1', title: 'Registration opens',  date: '2026-04-20', status: 'completed' },
      { id: 'M2', title: 'Phase 1 — school',    date: '2026-05-15', status: 'in_progress' },
      { id: 'M3', title: 'Phase 2 — district',  date: '2026-05-30', status: 'pending' },
      { id: 'M4', title: 'Sangathan finals',    date: '2026-06-15', status: 'pending' },
    ],
    resourceCount: 9,
    bannerKey: 'academic',
  },
  {
    id: 'INI-008', code: 'AVS/INI/26/SMARTCLASS',
    title: 'Smart Classroom Rollout — Phase 2',
    description: '60 smart classrooms across 8 schools — interactive flat panel displays, Khan-ed-Lite content, network connectivity, teacher training.',
    category: 'infrastructure', status: 'active', priority: 'high',
    fundingSource: 'mixed',
    startDate: '2026-02-01', endDate: '2026-09-30', launchedOn: '2026-01-22',
    ownerName: 'Er. Pranab Choudhury', ownerRole: 'Sangathan Engg. Wing',
    targetingType: 'selected_schools', targetSchools: ['AVS-TML', 'AVS-BPT', 'AVS-PMD', 'AVS-KKR', 'AVS-NGJ', 'AVS-CNG', 'AVS-DKC', 'AVS-MND'],
    budgetAllocated: 14400000, budgetUtilized: 7200000,
    totalSchools: 8, enrolledSchools: 8, totalBeneficiaries: 4112, reachedBeneficiaries: 1840,
    kpis: [
      { id: 'K1', label: 'Classrooms equipped',    target: 60,   current: 28,   unit: 'rooms' },
      { id: 'K2', label: 'Teachers trained',        target: 180,  current: 86,   unit: 'teachers' },
      { id: 'K3', label: 'Content modules uploaded', target: 320, current: 198,  unit: 'modules' },
      { id: 'K4', label: 'Avg. utilisation rate',   target: 80,   current: 64,   unit: '%' },
    ],
    progressPercent: 50,
    milestones: [],
    resourceCount: 12,
    bannerKey: 'infrastructure',
  },
  {
    id: 'INI-009', code: 'AVS/INI/26/BETI',
    title: 'Beti Padhao Awareness Week',
    description: 'Network-wide awareness drive for girl-child education. Special assemblies, parent engagement, scholarship announcements.',
    category: 'awareness', status: 'scheduled', priority: 'high',
    fundingSource: 'central_govt', governmentScheme: 'Beti Bachao Beti Padhao',
    startDate: '2026-06-01', endDate: '2026-06-07', launchedOn: '2026-05-08',
    ownerName: 'Mrs. Reshmi Talukdar', ownerRole: 'Sangathan HR',
    targetingType: 'all_schools', targetSchools: [],
    budgetAllocated: 360000, budgetUtilized: 0,
    totalSchools: 12, enrolledSchools: 12, totalBeneficiaries: 5962, reachedBeneficiaries: 0,
    kpis: [
      { id: 'K1', label: 'Assemblies organised',       target: 12,   current: 0, unit: 'schools' },
      { id: 'K2', label: 'Parent sessions',             target: 24,   current: 0, unit: 'sessions' },
      { id: 'K3', label: 'Scholarships disbursed',      target: 60,   current: 0, unit: 'students' },
    ],
    progressPercent: 0,
    milestones: [],
    resourceCount: 5,
    bannerKey: 'awareness',
    hashtags: ['#BetiPadhao'],
  },
  {
    id: 'INI-010', code: 'AVS/INI/26/STATESPORTS',
    title: 'State Sports Meet 2026 — District Selections',
    description: 'Athletes selection for state-level meet — athletics, kabaddi, badminton, kho-kho, volleyball, football. District-wise selection trials.',
    category: 'sports', status: 'scheduled', priority: 'medium',
    fundingSource: 'state_govt',
    startDate: '2026-07-01', endDate: '2026-09-30', launchedOn: '2026-05-04',
    ownerName: 'Mr. Sanjib Kalita', ownerRole: 'Sangathan — Physical Education',
    targetingType: 'all_schools', targetSchools: [], targetClasses: ['9', '10', '11', '12'],
    budgetAllocated: 850000, budgetUtilized: 0,
    totalSchools: 12, enrolledSchools: 0, totalBeneficiaries: 1840, reachedBeneficiaries: 0,
    kpis: [
      { id: 'K1', label: 'Athletes registered', target: 600,  current: 0, unit: 'athletes' },
      { id: 'K2', label: 'District qualifiers', target: 120,  current: 0, unit: 'athletes' },
      { id: 'K3', label: 'State medals',         target: 12,   current: 0, unit: 'medals' },
    ],
    progressPercent: 0,
    milestones: [],
    resourceCount: 3,
    bannerKey: 'sports',
  },
  {
    id: 'INI-011', code: 'AVS/INI/26/EYECARE',
    title: 'Eye Check-up Camp Series — 12 Schools',
    description: 'Tie-up with Sankaradev Nethralaya. Vision screening + free spectacles for refractive errors. Referrals for further treatment.',
    category: 'health_wellness', status: 'active', priority: 'medium',
    fundingSource: 'csr',
    startDate: '2026-04-01', endDate: '2026-06-15', launchedOn: '2026-03-20',
    ownerName: 'Dr. Anjali Bordoloi', ownerRole: 'Sangathan — Health Coordinator',
    targetingType: 'all_schools', targetSchools: [],
    budgetAllocated: 0, budgetUtilized: 0,
    totalSchools: 12, enrolledSchools: 12, totalBeneficiaries: 5962, reachedBeneficiaries: 3220,
    kpis: [
      { id: 'K1', label: 'Children screened',  target: 5962, current: 3220, unit: 'children' },
      { id: 'K2', label: 'Spectacles issued',  target: 480,  current: 218,  unit: 'pairs' },
      { id: 'K3', label: 'Referrals raised',   target: 0,    current: 36,   unit: 'cases' },
      { id: 'K4', label: 'Schools covered',     target: 12,   current: 8,    unit: 'schools' },
    ],
    progressPercent: 65,
    milestones: [],
    resourceCount: 4,
    bannerKey: 'health_wellness',
  },
  {
    id: 'INI-012', code: 'AVS/INI/26/ANTIBULLY',
    title: 'Anti-Bullying & Mental Wellness Drive',
    description: 'School-wide assemblies, counsellor sessions, anonymous reporting system, parent workshops on emotional safety.',
    category: 'awareness', status: 'active', priority: 'medium',
    fundingSource: 'sangathan',
    startDate: '2026-04-01', endDate: '2026-08-31', launchedOn: '2026-03-28',
    ownerName: 'Mrs. Pooja Deka', ownerRole: 'Sangathan — Counselling Cell',
    targetingType: 'all_schools', targetSchools: [],
    budgetAllocated: 240000, budgetUtilized: 64000,
    totalSchools: 12, enrolledSchools: 12, totalBeneficiaries: 5962, reachedBeneficiaries: 4080,
    kpis: [
      { id: 'K1', label: 'Assemblies conducted', target: 24,  current: 14, unit: 'sessions' },
      { id: 'K2', label: 'Counsellor sessions',   target: 60, current: 26, unit: 'sessions' },
      { id: 'K3', label: 'Posters displayed',     target: 240, current: 240, unit: 'posters' },
    ],
    progressPercent: 42,
    milestones: [],
    resourceCount: 6,
    bannerKey: 'awareness',
  },
  {
    id: 'INI-013', code: 'AVS/INI/26/BESTTEACH',
    title: 'Best Teacher of the Year 2025-26',
    description: 'Annual awards programme. Nominations from principals + students. Multi-tier evaluation. State-level recognition for top 3.',
    category: 'awards_recognition', status: 'active', priority: 'medium',
    fundingSource: 'sangathan',
    startDate: '2026-04-15', endDate: '2026-09-05', launchedOn: '2026-04-10',
    ownerName: 'Dr. Lakhi Kalita', ownerRole: 'Sangathan Director — Academics',
    targetingType: 'all_schools', targetSchools: [],
    budgetAllocated: 180000, budgetUtilized: 12000,
    totalSchools: 12, enrolledSchools: 10, totalBeneficiaries: 1892, reachedBeneficiaries: 156,
    kpis: [
      { id: 'K1', label: 'Nominations received',     target: 60, current: 24, unit: 'teachers' },
      { id: 'K2', label: 'Schools participated',       target: 12, current: 10, unit: 'schools' },
      { id: 'K3', label: 'Final shortlist',            target: 12, current: 0, unit: 'teachers' },
    ],
    progressPercent: 25,
    milestones: [],
    resourceCount: 3,
    bannerKey: 'awards_recognition',
  },
  {
    id: 'INI-014', code: 'AVS/INI/26/BIHU',
    title: 'Bohag Bihu Cultural Festival 2026',
    description: 'Three-day cultural festival across all schools — Bihu dance competitions, jhumur, traditional cuisine, husori, art exhibitions.',
    category: 'cultural', status: 'completed', priority: 'medium',
    fundingSource: 'sangathan',
    startDate: '2026-04-12', endDate: '2026-04-14', launchedOn: '2026-03-15',
    ownerName: 'Mrs. Sushmita Borah', ownerRole: 'Sangathan — Cultural Wing',
    targetingType: 'all_schools', targetSchools: [],
    budgetAllocated: 480000, budgetUtilized: 462000,
    totalSchools: 12, enrolledSchools: 12, totalBeneficiaries: 5962, reachedBeneficiaries: 5840,
    kpis: [
      { id: 'K1', label: 'Schools participated', target: 12, current: 12, unit: 'schools' },
      { id: 'K2', label: 'Performers',           target: 600, current: 728, unit: 'students' },
      { id: 'K3', label: 'Audience reached',     target: 8000, current: 9420, unit: 'people' },
    ],
    progressPercent: 100,
    milestones: [],
    resourceCount: 8,
    bannerKey: 'cultural',
    hashtags: ['#BohagBihu2026'],
  },
  {
    id: 'INI-015', code: 'AVS/INI/26/VVS',
    title: 'Vidyalaya Vikas Samiti — Q2 Convene',
    description: 'Quarterly meeting of school management committees. Each VVS reviews academic + financial + development progress with HQ representatives.',
    category: 'community', status: 'scheduled', priority: 'low',
    fundingSource: 'sangathan',
    startDate: '2026-06-15', endDate: '2026-06-30', launchedOn: '2026-05-05',
    ownerName: 'Rajesh Sharma', ownerRole: 'Sangathan Head Office',
    targetingType: 'all_schools', targetSchools: [],
    budgetAllocated: 120000, budgetUtilized: 0,
    totalSchools: 12, enrolledSchools: 12, totalBeneficiaries: 240, reachedBeneficiaries: 0,
    kpis: [
      { id: 'K1', label: 'Meetings scheduled',  target: 12,  current: 12, unit: 'meetings' },
      { id: 'K2', label: 'Members attended',     target: 240, current: 0,  unit: 'members' },
      { id: 'K3', label: 'Action items captured', target: 72, current: 0, unit: 'items' },
    ],
    progressPercent: 5,
    milestones: [],
    resourceCount: 2,
    bannerKey: 'community',
  },
];

/* ─── School participation matrix (sparse — cell defaults to 'invited' if not listed) ─── */
export const schoolParticipations: SchoolParticipation[] = [
  /* PM POSHAN — universal, all in_progress */
  ...NETWORK_SCHOOLS.map(s => ({
    initiativeId: 'INI-001', schoolCode: s.code, schoolName: s.name,
    status: 'in_progress' as ParticipationStatus,
    enrolledOn: '2025-04-01', contribution: 80 + (s.code === 'AVS-TML' ? 12 : 0),
    beneficiariesLocal: s.students, lastUpdate: '2026-05-08',
  })),
  /* NIPUN — most done, 2 still progressing */
  ...NETWORK_SCHOOLS.map(s => ({
    initiativeId: 'INI-002', schoolCode: s.code, schoolName: s.name,
    status: (['AVS-MTA', 'AVS-RPS', 'AVS-DGS'].includes(s.code) ? 'in_progress' : 'completed') as ParticipationStatus,
    enrolledOn: '2025-06-01', contribution: ['AVS-MTA', 'AVS-RPS', 'AVS-DGS'].includes(s.code) ? 60 : 95,
    beneficiariesLocal: Math.round(s.students * 0.18), lastUpdate: '2026-05-06',
  })),
  /* NISHTHA — all in_progress */
  ...NETWORK_SCHOOLS.map(s => ({
    initiativeId: 'INI-003', schoolCode: s.code, schoolName: s.name,
    status: 'in_progress' as ParticipationStatus,
    enrolledOn: '2025-09-01', contribution: 50 + (s.code === 'AVS-TML' ? 20 : 0),
    beneficiariesLocal: Math.round(s.students * 0.05),
    lastUpdate: '2026-05-08',
  })),
  /* Health camps — split between done + in_progress */
  ...NETWORK_SCHOOLS.map(s => ({
    initiativeId: 'INI-004', schoolCode: s.code, schoolName: s.name,
    status: (['AVS-TML', 'AVS-BPT', 'AVS-PMD', 'AVS-DKC', 'AVS-NGJ'].includes(s.code) ? 'completed' :
            ['AVS-MTA', 'AVS-RPS'].includes(s.code) ? 'invited' : 'in_progress') as ParticipationStatus,
    enrolledOn: '2026-04-01', contribution: ['AVS-TML', 'AVS-BPT', 'AVS-PMD'].includes(s.code) ? 100 : 50,
    beneficiariesLocal: ['AVS-TML', 'AVS-BPT', 'AVS-PMD', 'AVS-DKC', 'AVS-NGJ'].includes(s.code) ? s.students : 0,
    lastUpdate: '2026-05-04',
  })),
  /* Swachh Vidyalaya — 9 enrolled, 3 invited */
  ...NETWORK_SCHOOLS.map(s => {
    const optedOut = ['AVS-MTA', 'AVS-RPS'].includes(s.code);
    const invited = ['AVS-DGS'].includes(s.code);
    return {
      initiativeId: 'INI-005', schoolCode: s.code, schoolName: s.name,
      status: (optedOut ? 'opted_out' : invited ? 'invited' : 'in_progress') as ParticipationStatus,
      enrolledOn: optedOut ? undefined : '2026-02-01', contribution: optedOut ? 0 : invited ? 0 : 60,
      beneficiariesLocal: optedOut ? 0 : Math.round(s.students * 0.7), lastUpdate: '2026-05-04',
    };
  }),
  /* Reading Challenge — 11 enrolled */
  ...NETWORK_SCHOOLS.map(s => ({
    initiativeId: 'INI-006', schoolCode: s.code, schoolName: s.name,
    status: (s.code === 'AVS-MTA' ? 'invited' : 'in_progress') as ParticipationStatus,
    enrolledOn: '2026-04-15', contribution: s.code === 'AVS-MTA' ? 0 : 55,
    beneficiariesLocal: s.code === 'AVS-MTA' ? 0 : Math.round(s.students * 0.62),
    lastUpdate: '2026-05-08',
  })),
  /* Math Olympiad — all enrolled, varying contribution */
  ...NETWORK_SCHOOLS.map(s => ({
    initiativeId: 'INI-007', schoolCode: s.code, schoolName: s.name,
    status: 'in_progress' as ParticipationStatus,
    enrolledOn: '2026-04-20', contribution: 30 + Math.round(Math.random() * 30),
    beneficiariesLocal: Math.round(s.students * 0.45),
    lastUpdate: '2026-05-07',
  })),
  /* Smart Classroom — only 8 schools targeted */
  ...['AVS-TML', 'AVS-BPT', 'AVS-PMD', 'AVS-KKR', 'AVS-NGJ', 'AVS-CNG', 'AVS-DKC'].map(code => {
    const s = NETWORK_SCHOOLS.find(x => x.code === code)!;
    return {
      initiativeId: 'INI-008', schoolCode: s.code, schoolName: s.name,
      status: 'in_progress' as ParticipationStatus,
      enrolledOn: '2026-02-01', contribution: 50,
      beneficiariesLocal: Math.round(s.students * 0.4), lastUpdate: '2026-05-05',
    };
  }),
  /* Beti Padhao — scheduled, all invited */
  ...NETWORK_SCHOOLS.map(s => ({
    initiativeId: 'INI-009', schoolCode: s.code, schoolName: s.name,
    status: 'opted_in' as ParticipationStatus,
    enrolledOn: '2026-05-08', contribution: 0,
    beneficiariesLocal: 0, lastUpdate: '2026-05-08',
  })),
  /* Bihu — completed, all done */
  ...NETWORK_SCHOOLS.map(s => ({
    initiativeId: 'INI-014', schoolCode: s.code, schoolName: s.name,
    status: 'completed' as ParticipationStatus,
    enrolledOn: '2026-03-15', contribution: 100,
    beneficiariesLocal: s.students, lastUpdate: '2026-04-14',
  })),
];

/* Demo student enrollments (matches Auth context Aarav Patel @ 10-A @ AVS-TML) */
export const studentEnrollments: StudentEnrollment[] = [
  { initiativeId: 'INI-006', studentId: 'st-001', studentName: 'Aarav Patel', schoolCode: 'AVS-TML', className: '10-A', enrolledOn: '2026-04-15', status: 'active',    progressPercent: 60, badgeEarned: 'Bookworm — 3 books done' },
  { initiativeId: 'INI-007', studentId: 'st-001', studentName: 'Aarav Patel', schoolCode: 'AVS-TML', className: '10-A', enrolledOn: '2026-04-20', status: 'enrolled',  progressPercent: 0 },
  { initiativeId: 'INI-012', studentId: 'st-001', studentName: 'Aarav Patel', schoolCode: 'AVS-TML', className: '10-A', enrolledOn: '2026-04-01', status: 'active',    progressPercent: 50 },
  { initiativeId: 'INI-014', studentId: 'st-001', studentName: 'Aarav Patel', schoolCode: 'AVS-TML', className: '10-A', enrolledOn: '2026-03-15', status: 'completed', progressPercent: 100, certificate: true, badgeEarned: 'Cultural Performer' },
  { initiativeId: 'INI-011', studentId: 'st-001', studentName: 'Aarav Patel', schoolCode: 'AVS-TML', className: '10-A', enrolledOn: '2026-04-08', status: 'completed', progressPercent: 100 },
  { initiativeId: 'INI-001', studentId: 'st-001', studentName: 'Aarav Patel', schoolCode: 'AVS-TML', className: '10-A', enrolledOn: '2025-04-01', status: 'active',    progressPercent: 65 },
];

/* ─── Helpers ─── */
export function getParticipationFor(initiativeId: string, schoolCode: string): SchoolParticipation | null {
  return schoolParticipations.find(p => p.initiativeId === initiativeId && p.schoolCode === schoolCode) ?? null;
}

export function getInitiativesForSchool(schoolCode: string): { initiative: Initiative; participation: SchoolParticipation }[] {
  return schoolParticipations
    .filter(p => p.schoolCode === schoolCode && p.status !== 'invited')
    .map(p => ({
      initiative: initiatives.find(i => i.id === p.initiativeId)!,
      participation: p,
    }))
    .filter(x => x.initiative);
}

export function getInitiativesForStudent(studentId: string): { initiative: Initiative; enrollment: StudentEnrollment }[] {
  return studentEnrollments
    .filter(e => e.studentId === studentId)
    .map(e => ({
      initiative: initiatives.find(i => i.id === e.initiativeId)!,
      enrollment: e,
    }))
    .filter(x => x.initiative);
}

export function summarizeNetwork() {
  const active = initiatives.filter(i => i.status === 'active').length;
  const totalBeneficiaries = initiatives.reduce((s, i) => s + i.reachedBeneficiaries, 0);
  const totalBudget = initiatives.reduce((s, i) => s + i.budgetAllocated, 0);
  const totalUtilized = initiatives.reduce((s, i) => s + i.budgetUtilized, 0);
  return {
    totalInitiatives: initiatives.length,
    activeInitiatives: active,
    completedThisYear: initiatives.filter(i => i.status === 'completed').length,
    flagshipCount: initiatives.filter(i => i.priority === 'flagship').length,
    totalBeneficiaries,
    totalBudget,
    totalUtilized,
    participationRate: Math.round((schoolParticipations.filter(p => p.status === 'in_progress' || p.status === 'completed').length / (schoolParticipations.length || 1)) * 100),
  };
}
