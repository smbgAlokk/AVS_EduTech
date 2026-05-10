/* ============================================
   AVS EduConnect — Development Works Data Layer
   ============================================
   Government school development project lifecycle:
   Proposal → Sanction → Tender → Work Order → Execution
   → Inspection → Completion → Utilization Certificate
   Mock data for the P0 prototype. Will be backed by an
   API in P1. Principal views are filtered to a single
   demo school code (PRINCIPAL_DEMO_CODE).
   ============================================ */

export type WorkStatus =
  | 'proposed'
  | 'under_review'
  | 'approved'
  | 'tendered'
  | 'work_order'
  | 'in_progress'
  | 'inspection'
  | 'completed'
  | 'on_hold'
  | 'rejected';

export type WorkCategory =
  | 'Civil Construction'
  | 'Renovation'
  | 'Furniture & Fixtures'
  | 'Sanitation & Water'
  | 'Electrical'
  | 'Solar / Green Energy'
  | 'Sports & Playground'
  | 'IT / Smart Classroom'
  | 'Boundary Wall'
  | 'Library';

export type WorkPriority = 'urgent' | 'high' | 'medium' | 'low';

export type FundingSource =
  | 'Samagra Shiksha'
  | 'School Development Fund'
  | 'PM SHRI Schools'
  | 'State Govt Grant'
  | 'CSR Initiative'
  | 'NABARD'
  | '14th FC Grant';

export interface WorkMilestone {
  id: string;
  name: string;
  expectedDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  paymentTranche?: number;
}

export interface DevWork {
  id: string;
  projectCode: string;
  title: string;
  description: string;
  category: WorkCategory;
  schoolCode: string;
  schoolName: string;
  district: string;
  estimatedCost: number;
  approvedAmount?: number;
  utilizedAmount?: number;
  status: WorkStatus;
  priority: WorkPriority;
  fundingSource: FundingSource;
  proposalDate: string;
  approvedDate?: string;
  startDate?: string;
  expectedCompletion?: string;
  actualCompletion?: string;
  contractor?: string;
  contractorId?: string;
  workOrderNo?: string;
  progress: number;
  proposedBy: string;
  sanctionedBy?: string;
  inspectionsCount: number;
  milestones: WorkMilestone[];
}

export interface Contractor {
  id: string;
  name: string;
  registrationNo: string;
  categories: WorkCategory[];
  rating: number;
  activeProjects: number;
  completedProjects: number;
  totalValueExecuted: number;
  status: 'empanelled' | 'expired' | 'blacklisted';
  contact: string;
  email: string;
  empanelmentValidUntil: string;
  city: string;
}

export interface Tender {
  id: string;
  tenderNo: string;
  projectId: string;
  projectTitle: string;
  schoolCode: string;
  schoolName: string;
  estimatedValue: number;
  emdAmount: number;
  publishedDate: string;
  bidDeadline: string;
  status: 'published' | 'bidding_open' | 'evaluation' | 'awarded' | 'cancelled';
  bidsReceived: number;
  type: 'open' | 'limited' | 'single_source';
  awardedTo?: string;
  awardedAmount?: number;
}

export interface Inspection {
  id: string;
  projectId: string;
  projectTitle: string;
  schoolCode: string;
  schoolName: string;
  scheduledDate: string;
  inspectionType: 'pre_work' | 'mid_term' | 'final' | 'quality_check' | 'audit';
  inspector: string;
  inspectorRole: string;
  status: 'scheduled' | 'completed' | 'rescheduled' | 'overdue';
  rating?: 1 | 2 | 3 | 4 | 5;
  remarks?: string;
}

export interface BudgetAllocation {
  schoolCode: string;
  schoolName: string;
  district: string;
  fyAllocation: number;
  sanctioned: number;
  utilized: number;
  pendingProposals: number;
  activeProjects: number;
}

export interface DocumentRecord {
  id: string;
  projectId: string;
  projectTitle: string;
  type: 'utilization_certificate' | 'completion_certificate' | 'work_order' | 'site_photo' | 'inspection_report' | 'invoice' | 'boq';
  filename: string;
  uploadedDate: string;
  uploadedBy: string;
  sizeKb: number;
}

/* The single mock school used by the Principal role for filtering. */
export const PRINCIPAL_DEMO_CODE = 'AVS-TML';
export const PRINCIPAL_DEMO_NAME = 'Adarsha Vidyalaya Tamulpur';

/* ─── Mock Projects (16) ─── */
export const devWorks: DevWork[] = [
  {
    id: 'DW-2026-001', projectCode: 'AVS/DW/26/001',
    title: 'Construction of 6 Additional Classrooms',
    description: 'Single-storey extension to handle increased Class IX–X enrolment. RCC structure with 6 rooms, corridor and toilet block.',
    category: 'Civil Construction', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    estimatedCost: 4850000, approvedAmount: 4720000, utilizedAmount: 2125000,
    status: 'in_progress', priority: 'high', fundingSource: 'Samagra Shiksha',
    proposalDate: '2026-01-15', approvedDate: '2026-02-08', startDate: '2026-03-12',
    expectedCompletion: '2026-09-30',
    contractor: 'M.K. Constructions Pvt. Ltd.', contractorId: 'CON-001', workOrderNo: 'WO/2026/AVS/0042',
    progress: 45, proposedBy: 'Mr. Bipul Basumatary', sanctionedBy: 'Sangathan Director — Engg. Wing', inspectionsCount: 2,
    milestones: [
      { id: 'M1', name: 'Foundation & Plinth', expectedDate: '2026-04-15', completedDate: '2026-04-20', status: 'completed', paymentTranche: 944000 },
      { id: 'M2', name: 'Walls & Lintel', expectedDate: '2026-06-10', status: 'in_progress', paymentTranche: 1416000 },
      { id: 'M3', name: 'Roof Slab Casting', expectedDate: '2026-07-25', status: 'pending', paymentTranche: 1180000 },
      { id: 'M4', name: 'Finishing & Handover', expectedDate: '2026-09-30', status: 'pending', paymentTranche: 1180000 },
    ],
  },
  {
    id: 'DW-2026-002', projectCode: 'AVS/DW/26/002',
    title: 'Solar Rooftop Installation (15 kW)',
    description: 'Grid-connected rooftop solar PV system to reduce electricity bills and ensure uninterrupted power for smart classrooms.',
    category: 'Solar / Green Energy', schoolCode: 'AVS-BPT', schoolName: 'AVS Barpeta', district: 'Barpeta',
    estimatedCost: 1850000, approvedAmount: 1820000, utilizedAmount: 1820000,
    status: 'completed', priority: 'medium', fundingSource: 'PM SHRI Schools',
    proposalDate: '2025-11-22', approvedDate: '2025-12-14', startDate: '2026-01-20',
    expectedCompletion: '2026-03-15', actualCompletion: '2026-03-08',
    contractor: 'GreenTech Solar Pvt. Ltd.', contractorId: 'CON-004', workOrderNo: 'WO/2026/AVS/0028',
    progress: 100, proposedBy: 'Dr. Hiranya Goswami', sanctionedBy: 'PM SHRI Cell — MoE', inspectionsCount: 3,
    milestones: [
      { id: 'M1', name: 'Site Survey & Design', expectedDate: '2026-01-25', completedDate: '2026-01-22', status: 'completed' },
      { id: 'M2', name: 'Panel Installation', expectedDate: '2026-02-25', completedDate: '2026-02-20', status: 'completed', paymentTranche: 1092000 },
      { id: 'M3', name: 'Grid Sync & Commissioning', expectedDate: '2026-03-15', completedDate: '2026-03-08', status: 'completed', paymentTranche: 728000 },
    ],
  },
  {
    id: 'DW-2026-003', projectCode: 'AVS/DW/26/003',
    title: 'Smart Classroom Setup — 8 Rooms',
    description: 'Interactive Flat Panel Displays (75"), document cameras, networking and pre-loaded NCERT digital content for Classes VI–X.',
    category: 'IT / Smart Classroom', schoolCode: 'AVS-KKR', schoolName: 'AVS Kokrajhar', district: 'Kokrajhar',
    estimatedCost: 2400000,
    status: 'tendered', priority: 'high', fundingSource: 'Samagra Shiksha',
    proposalDate: '2026-02-10', approvedDate: '2026-03-22',
    progress: 0, proposedBy: 'Dr. Anil Brahma', sanctionedBy: 'Sangathan IT Cell', inspectionsCount: 0,
    milestones: [],
  },
  {
    id: 'DW-2026-004', projectCode: 'AVS/DW/26/004',
    title: 'Renovation of Toilet Block & RO Water Plant',
    description: 'Refurbishment of existing toilet blocks (boys/girls) with new fittings, tiling, and installation of 1000 LPH RO water plant with cooler.',
    category: 'Sanitation & Water', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    estimatedCost: 950000, approvedAmount: 920000, utilizedAmount: 460000,
    status: 'in_progress', priority: 'urgent', fundingSource: 'School Development Fund',
    proposalDate: '2026-02-28', approvedDate: '2026-03-18', startDate: '2026-04-02',
    expectedCompletion: '2026-06-15',
    contractor: 'Borah Brothers Engineering', contractorId: 'CON-002', workOrderNo: 'WO/2026/AVS/0051',
    progress: 50, proposedBy: 'Mr. Bipul Basumatary', sanctionedBy: 'Sangathan Director — Admin', inspectionsCount: 1,
    milestones: [
      { id: 'M1', name: 'Demolition & Plumbing', expectedDate: '2026-04-20', completedDate: '2026-04-25', status: 'completed', paymentTranche: 230000 },
      { id: 'M2', name: 'Tiling & Fixtures', expectedDate: '2026-05-15', status: 'in_progress', paymentTranche: 460000 },
      { id: 'M3', name: 'RO Plant Commissioning', expectedDate: '2026-06-15', status: 'pending', paymentTranche: 230000 },
    ],
  },
  {
    id: 'DW-2026-005', projectCode: 'AVS/DW/26/005',
    title: 'Boundary Wall Construction (380 m)',
    description: 'New brick masonry boundary wall along the south and west perimeter to secure school premises and prevent encroachment.',
    category: 'Boundary Wall', schoolCode: 'AVS-DGS', schoolName: 'AVS Dalgaon Sialmari', district: 'Darrang',
    estimatedCost: 1450000,
    status: 'under_review', priority: 'high', fundingSource: 'State Govt Grant',
    proposalDate: '2026-04-25',
    progress: 0, proposedBy: 'Mrs. Farzana Begum', inspectionsCount: 0,
    milestones: [],
  },
  {
    id: 'DW-2026-006', projectCode: 'AVS/DW/26/006',
    title: 'Library Renovation & E-Resource Setup',
    description: 'Modernisation of existing library: new shelving, reading carrels, 5,000 new titles, e-book stations and digital catalogue system.',
    category: 'Library', schoolCode: 'AVS-PMD', schoolName: 'AVS Pub Mangaldoi', district: 'Darrang',
    estimatedCost: 850000, approvedAmount: 825000, utilizedAmount: 825000,
    status: 'completed', priority: 'medium', fundingSource: 'CSR Initiative',
    proposalDate: '2025-10-12', approvedDate: '2025-11-04', startDate: '2025-12-01',
    expectedCompletion: '2026-02-28', actualCompletion: '2026-02-18',
    contractor: 'Heritage Builders Assam', contractorId: 'CON-007', workOrderNo: 'WO/2025/AVS/0089',
    progress: 100, proposedBy: 'Dr. Tilak Kalita', sanctionedBy: 'CSR Coordinator — Sangathan', inspectionsCount: 2,
    milestones: [],
  },
  {
    id: 'DW-2026-007', projectCode: 'AVS/DW/26/007',
    title: 'Procurement of Classroom Furniture (200 sets)',
    description: 'Bench-desk combo sets for newly constructed classrooms; ergonomic design conforming to BIS school furniture norms.',
    category: 'Furniture & Fixtures', schoolCode: 'AVS-NGJ', schoolName: 'AVS Nagrijuli', district: 'Baksa',
    estimatedCost: 480000,
    status: 'proposed', priority: 'medium', fundingSource: 'Samagra Shiksha',
    proposalDate: '2026-05-02',
    progress: 0, proposedBy: 'Mrs. Reema Brahma', inspectionsCount: 0,
    milestones: [],
  },
  {
    id: 'DW-2026-008', projectCode: 'AVS/DW/26/008',
    title: 'Multipurpose Sports Court Construction',
    description: 'Concrete sports court (basketball + volleyball markings) with chain-link fencing and floodlight poles for evening practice.',
    category: 'Sports & Playground', schoolCode: 'AVS-BCM', schoolName: 'AVS Bechimari', district: 'Darrang',
    estimatedCost: 1750000, approvedAmount: 1700000, utilizedAmount: 850000,
    status: 'in_progress', priority: 'medium', fundingSource: 'NABARD',
    proposalDate: '2026-01-28', approvedDate: '2026-02-25', startDate: '2026-03-22',
    expectedCompletion: '2026-08-10',
    contractor: 'Northeast Infrabuild Ltd.', contractorId: 'CON-003', workOrderNo: 'WO/2026/AVS/0046',
    progress: 50, proposedBy: 'Mr. Faruk Ahmed', sanctionedBy: 'NABARD Coordinator', inspectionsCount: 2,
    milestones: [],
  },
  {
    id: 'DW-2026-009', projectCode: 'AVS/DW/26/009',
    title: 'Electrical Wiring Upgrade & 25kVA Transformer',
    description: 'Complete re-wiring of academic block, new MCB panels, and dedicated transformer to support computer lab + smart classes.',
    category: 'Electrical', schoolCode: 'AVS-LKP', schoolName: 'AVS Lakhipur', district: 'Goalpara',
    estimatedCost: 1280000, approvedAmount: 1250000,
    status: 'work_order', priority: 'high', fundingSource: 'State Govt Grant',
    proposalDate: '2026-03-08', approvedDate: '2026-04-12',
    progress: 5, proposedBy: 'Mr. Hari Prasad Rabha', sanctionedBy: 'PWD — Electrical Division', inspectionsCount: 0,
    milestones: [],
    contractor: 'Brahmaputra Electricals', contractorId: 'CON-005', workOrderNo: 'WO/2026/AVS/0058',
  },
  {
    id: 'DW-2026-010', projectCode: 'AVS/DW/26/010',
    title: 'Computer Lab Setup (30 systems + UPS)',
    description: '30 desktop systems with networking, server room AC, 10 kVA online UPS, and ICT lab furniture.',
    category: 'IT / Smart Classroom', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    estimatedCost: 2150000, approvedAmount: 2080000,
    status: 'tendered', priority: 'high', fundingSource: 'PM SHRI Schools',
    proposalDate: '2026-02-15', approvedDate: '2026-03-30',
    progress: 10, proposedBy: 'Mr. Bipul Basumatary', sanctionedBy: 'PM SHRI Cell — MoE', inspectionsCount: 0,
    milestones: [],
  },
  {
    id: 'DW-2026-011', projectCode: 'AVS/DW/26/011',
    title: 'Painting & Whitewashing — Entire Campus',
    description: 'Annual painting cycle: external walls, classrooms, corridors, and signage refresh as per Sangathan colour code.',
    category: 'Renovation', schoolCode: 'AVS-MTA', schoolName: 'AVS Matia', district: 'Goalpara',
    estimatedCost: 320000,
    status: 'rejected', priority: 'low', fundingSource: 'School Development Fund',
    proposalDate: '2026-04-08',
    progress: 0, proposedBy: 'Mrs. Pranati Saha', inspectionsCount: 0,
    milestones: [],
  },
  {
    id: 'DW-2026-012', projectCode: 'AVS/DW/26/012',
    title: 'Construction of School Auditorium (Phase 1)',
    description: 'Phase 1 — RCC frame and roofing for a 400-seat auditorium for assembly, functions and inter-school events.',
    category: 'Civil Construction', schoolCode: 'AVS-KKR', schoolName: 'AVS Kokrajhar', district: 'Kokrajhar',
    estimatedCost: 8500000,
    status: 'on_hold', priority: 'medium', fundingSource: '14th FC Grant',
    proposalDate: '2025-09-14', approvedDate: '2025-10-22', startDate: '2025-11-30',
    expectedCompletion: '2027-03-31',
    contractor: 'M.K. Constructions Pvt. Ltd.', contractorId: 'CON-001', workOrderNo: 'WO/2025/AVS/0073',
    progress: 22, proposedBy: 'Dr. Anil Brahma', sanctionedBy: 'Finance Commission Cell', inspectionsCount: 1,
    milestones: [],
  },
  {
    id: 'DW-2026-013', projectCode: 'AVS/DW/26/013',
    title: 'Science Lab Equipment Procurement',
    description: 'Physics, Chemistry and Biology lab apparatus refresh as per CBSE syllabus norms for Classes IX–XII.',
    category: 'Furniture & Fixtures', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    estimatedCost: 685000,
    status: 'approved', priority: 'medium', fundingSource: 'Samagra Shiksha',
    proposalDate: '2026-03-22', approvedDate: '2026-04-30',
    progress: 0, proposedBy: 'Mr. Bipul Basumatary', sanctionedBy: 'Sangathan Director — Academics', inspectionsCount: 0,
    milestones: [],
  },
  {
    id: 'DW-2026-014', projectCode: 'AVS/DW/26/014',
    title: 'Compound Drainage & Rainwater Harvesting',
    description: 'Storm-water drainage along all four sides of the compound and rainwater harvesting pit (8m³) connected to main building.',
    category: 'Sanitation & Water', schoolCode: 'AVS-CNG', schoolName: 'AVS Chenga', district: 'Barpeta',
    estimatedCost: 540000,
    status: 'under_review', priority: 'medium', fundingSource: 'Samagra Shiksha',
    proposalDate: '2026-04-18',
    progress: 0, proposedBy: 'Mr. Abdul Rahim Ahmed', inspectionsCount: 0,
    milestones: [],
  },
  {
    id: 'DW-2026-015', projectCode: 'AVS/DW/26/015',
    title: 'Annual Maintenance — Roofing Repairs',
    description: 'Replacement of damaged GI sheets and waterproofing of RCC roof prior to monsoon. Affects 4 classroom blocks.',
    category: 'Renovation', schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa',
    estimatedCost: 380000, approvedAmount: 365000, utilizedAmount: 365000,
    status: 'completed', priority: 'urgent', fundingSource: 'School Development Fund',
    proposalDate: '2026-02-04', approvedDate: '2026-02-10', startDate: '2026-02-22',
    expectedCompletion: '2026-04-05', actualCompletion: '2026-04-02',
    contractor: 'Borah Brothers Engineering', contractorId: 'CON-002', workOrderNo: 'WO/2026/AVS/0036',
    progress: 100, proposedBy: 'Mr. Bipul Basumatary', sanctionedBy: 'Sangathan Director — Admin', inspectionsCount: 1,
    milestones: [],
  },
  {
    id: 'DW-2026-016', projectCode: 'AVS/DW/26/016',
    title: 'Outdoor Playground Equipment',
    description: 'Installation of slides, swings, see-saw and merry-go-round for primary section. EN-1176 safety compliant.',
    category: 'Sports & Playground', schoolCode: 'AVS-NGJ', schoolName: 'AVS Nagrijuli', district: 'Baksa',
    estimatedCost: 285000,
    status: 'proposed', priority: 'low', fundingSource: 'CSR Initiative',
    proposalDate: '2026-05-01',
    progress: 0, proposedBy: 'Mrs. Reema Brahma', inspectionsCount: 0,
    milestones: [],
  },
];

/* ─── Mock Contractors (8) ─── */
export const contractors: Contractor[] = [
  {
    id: 'CON-001', name: 'M.K. Constructions Pvt. Ltd.', registrationNo: 'AS/PWD/CL-A/2018/142',
    categories: ['Civil Construction', 'Renovation', 'Boundary Wall'], rating: 4.6,
    activeProjects: 3, completedProjects: 18, totalValueExecuted: 142500000,
    status: 'empanelled', contact: '+91 98640 22141', email: 'projects@mkconst.in',
    empanelmentValidUntil: '2027-03-31', city: 'Guwahati',
  },
  {
    id: 'CON-002', name: 'Borah Brothers Engineering', registrationNo: 'AS/PWD/CL-B/2019/088',
    categories: ['Renovation', 'Sanitation & Water', 'Electrical'], rating: 4.4,
    activeProjects: 2, completedProjects: 24, totalValueExecuted: 86200000,
    status: 'empanelled', contact: '+91 94350 11502', email: 'borah.bros@bbeng.in',
    empanelmentValidUntil: '2026-12-31', city: 'Barpeta',
  },
  {
    id: 'CON-003', name: 'Northeast Infrabuild Ltd.', registrationNo: 'AS/PWD/CL-A/2017/065',
    categories: ['Civil Construction', 'Sports & Playground'], rating: 4.7,
    activeProjects: 1, completedProjects: 32, totalValueExecuted: 218900000,
    status: 'empanelled', contact: '+91 98548 33024', email: 'tenders@neinfra.com',
    empanelmentValidUntil: '2027-09-30', city: 'Guwahati',
  },
  {
    id: 'CON-004', name: 'GreenTech Solar Pvt. Ltd.', registrationNo: 'MNRE/EMP/2020/0312',
    categories: ['Solar / Green Energy', 'Electrical'], rating: 4.8,
    activeProjects: 0, completedProjects: 14, totalValueExecuted: 28400000,
    status: 'empanelled', contact: '+91 78960 21847', email: 'projects@greentechsolar.in',
    empanelmentValidUntil: '2026-08-31', city: 'Tezpur',
  },
  {
    id: 'CON-005', name: 'Brahmaputra Electricals', registrationNo: 'AS/PWD-E/CL-B/2018/049',
    categories: ['Electrical', 'IT / Smart Classroom'], rating: 4.2,
    activeProjects: 1, completedProjects: 11, totalValueExecuted: 32100000,
    status: 'empanelled', contact: '+91 99540 18762', email: 'admin@brahmaelec.in',
    empanelmentValidUntil: '2026-06-30', city: 'Guwahati',
  },
  {
    id: 'CON-006', name: 'Assam Furniture House', registrationNo: 'AS/COM/2019/2241',
    categories: ['Furniture & Fixtures', 'Library'], rating: 4.1,
    activeProjects: 0, completedProjects: 22, totalValueExecuted: 18750000,
    status: 'empanelled', contact: '+91 94350 76512', email: 'sales@assamfurniture.com',
    empanelmentValidUntil: '2026-11-15', city: 'Nagaon',
  },
  {
    id: 'CON-007', name: 'Heritage Builders Assam', registrationNo: 'AS/PWD/CL-B/2016/121',
    categories: ['Civil Construction', 'Renovation', 'Library'], rating: 4.3,
    activeProjects: 0, completedProjects: 19, totalValueExecuted: 64200000,
    status: 'empanelled', contact: '+91 98640 33871', email: 'pmo@heritageassam.in',
    empanelmentValidUntil: '2026-04-30', city: 'Jorhat',
  },
  {
    id: 'CON-008', name: 'Goswami Builders & Co.', registrationNo: 'AS/PWD/CL-C/2020/305',
    categories: ['Renovation', 'Boundary Wall'], rating: 3.4,
    activeProjects: 0, completedProjects: 6, totalValueExecuted: 9200000,
    status: 'expired', contact: '+91 91270 41258', email: 'goswami.bldrs@gmail.com',
    empanelmentValidUntil: '2025-12-31', city: 'Mangaldoi',
  },
];

/* ─── Mock Tenders (6) ─── */
export const tenders: Tender[] = [
  {
    id: 'TND-2026-014', tenderNo: 'AVS/TND/26/014',
    projectId: 'DW-2026-003', projectTitle: 'Smart Classroom Setup — 8 Rooms',
    schoolCode: 'AVS-KKR', schoolName: 'AVS Kokrajhar',
    estimatedValue: 2400000, emdAmount: 60000,
    publishedDate: '2026-04-02', bidDeadline: '2026-05-15',
    status: 'evaluation', bidsReceived: 7, type: 'open',
  },
  {
    id: 'TND-2026-018', tenderNo: 'AVS/TND/26/018',
    projectId: 'DW-2026-010', projectTitle: 'Computer Lab Setup (30 systems + UPS)',
    schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur',
    estimatedValue: 2150000, emdAmount: 55000,
    publishedDate: '2026-04-12', bidDeadline: '2026-05-22',
    status: 'bidding_open', bidsReceived: 4, type: 'open',
  },
  {
    id: 'TND-2026-021', tenderNo: 'AVS/TND/26/021',
    projectId: 'DW-2026-005', projectTitle: 'Boundary Wall Construction (380 m)',
    schoolCode: 'AVS-DGS', schoolName: 'AVS Dalgaon Sialmari',
    estimatedValue: 1450000, emdAmount: 36000,
    publishedDate: '2026-05-04', bidDeadline: '2026-05-30',
    status: 'published', bidsReceived: 0, type: 'limited',
  },
  {
    id: 'TND-2026-009', tenderNo: 'AVS/TND/26/009',
    projectId: 'DW-2026-006', projectTitle: 'Library Renovation & E-Resource Setup',
    schoolCode: 'AVS-PMD', schoolName: 'AVS Pub Mangaldoi',
    estimatedValue: 850000, emdAmount: 21000,
    publishedDate: '2025-11-18', bidDeadline: '2025-11-30',
    status: 'awarded', bidsReceived: 6, type: 'open',
    awardedTo: 'Heritage Builders Assam', awardedAmount: 825000,
  },
  {
    id: 'TND-2026-011', tenderNo: 'AVS/TND/26/011',
    projectId: 'DW-2026-002', projectTitle: 'Solar Rooftop Installation (15 kW)',
    schoolCode: 'AVS-BPT', schoolName: 'AVS Barpeta',
    estimatedValue: 1850000, emdAmount: 46000,
    publishedDate: '2025-12-22', bidDeadline: '2026-01-12',
    status: 'awarded', bidsReceived: 5, type: 'open',
    awardedTo: 'GreenTech Solar Pvt. Ltd.', awardedAmount: 1820000,
  },
  {
    id: 'TND-2026-023', tenderNo: 'AVS/TND/26/023',
    projectId: 'DW-2026-013', projectTitle: 'Science Lab Equipment Procurement',
    schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur',
    estimatedValue: 685000, emdAmount: 17000,
    publishedDate: '2026-05-06', bidDeadline: '2026-06-04',
    status: 'published', bidsReceived: 0, type: 'open',
  },
];

/* ─── Mock Inspections (10) ─── */
export const inspections: Inspection[] = [
  {
    id: 'INS-2026-031', projectId: 'DW-2026-001', projectTitle: 'Construction of 6 Additional Classrooms',
    schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur',
    scheduledDate: '2026-05-12', inspectionType: 'mid_term',
    inspector: 'Er. Pranab Choudhury', inspectorRole: 'PWD Junior Engineer',
    status: 'scheduled',
  },
  {
    id: 'INS-2026-029', projectId: 'DW-2026-001', projectTitle: 'Construction of 6 Additional Classrooms',
    schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur',
    scheduledDate: '2026-04-18', inspectionType: 'pre_work',
    inspector: 'Er. Pranab Choudhury', inspectorRole: 'PWD Junior Engineer',
    status: 'completed', rating: 4,
    remarks: 'Foundation work as per IS-456. Minor concerns on curing schedule documented and rectified on-site.',
  },
  {
    id: 'INS-2026-026', projectId: 'DW-2026-002', projectTitle: 'Solar Rooftop Installation (15 kW)',
    schoolCode: 'AVS-BPT', schoolName: 'AVS Barpeta',
    scheduledDate: '2026-03-08', inspectionType: 'final',
    inspector: 'Mr. Sanjib Kalita', inspectorRole: 'MNRE Empanelled Inspector',
    status: 'completed', rating: 5,
    remarks: 'Commissioning successful. Generation 18% above projection in first 30 days.',
  },
  {
    id: 'INS-2026-034', projectId: 'DW-2026-004', projectTitle: 'Renovation of Toilet Block & RO Water Plant',
    schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur',
    scheduledDate: '2026-05-08', inspectionType: 'quality_check',
    inspector: 'Er. Manoranjan Das', inspectorRole: 'Sangathan Engg. Wing',
    status: 'completed', rating: 4,
    remarks: 'Tile work and plumbing as per BOQ. Recommend additional ventilation.',
  },
  {
    id: 'INS-2026-035', projectId: 'DW-2026-008', projectTitle: 'Multipurpose Sports Court Construction',
    schoolCode: 'AVS-BCM', schoolName: 'AVS Bechimari',
    scheduledDate: '2026-05-15', inspectionType: 'mid_term',
    inspector: 'Er. Hiranya Saikia', inspectorRole: 'NABARD Technical Cell',
    status: 'scheduled',
  },
  {
    id: 'INS-2026-022', projectId: 'DW-2026-006', projectTitle: 'Library Renovation & E-Resource Setup',
    schoolCode: 'AVS-PMD', schoolName: 'AVS Pub Mangaldoi',
    scheduledDate: '2026-02-15', inspectionType: 'final',
    inspector: 'Dr. Lakhi Kalita', inspectorRole: 'Sangathan Director — Academics',
    status: 'completed', rating: 5,
    remarks: 'Excellent execution. Suggest replicating model across other branches.',
  },
  {
    id: 'INS-2026-036', projectId: 'DW-2026-012', projectTitle: 'Construction of School Auditorium (Phase 1)',
    schoolCode: 'AVS-KKR', schoolName: 'AVS Kokrajhar',
    scheduledDate: '2026-04-30', inspectionType: 'audit',
    inspector: 'CA Rajiv Bhattacharyya', inspectorRole: 'Govt Auditor — Edu Dept',
    status: 'overdue',
  },
  {
    id: 'INS-2026-018', projectId: 'DW-2026-015', projectTitle: 'Annual Maintenance — Roofing Repairs',
    schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur',
    scheduledDate: '2026-04-04', inspectionType: 'final',
    inspector: 'Er. Manoranjan Das', inspectorRole: 'Sangathan Engg. Wing',
    status: 'completed', rating: 4,
    remarks: 'Waterproofing complete; roof tested with monsoon simulation.',
  },
  {
    id: 'INS-2026-038', projectId: 'DW-2026-001', projectTitle: 'Construction of 6 Additional Classrooms',
    schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur',
    scheduledDate: '2026-05-22', inspectionType: 'quality_check',
    inspector: 'Er. Pranab Choudhury', inspectorRole: 'PWD Junior Engineer',
    status: 'scheduled',
  },
  {
    id: 'INS-2026-040', projectId: 'DW-2026-008', projectTitle: 'Multipurpose Sports Court Construction',
    schoolCode: 'AVS-BCM', schoolName: 'AVS Bechimari',
    scheduledDate: '2026-04-22', inspectionType: 'pre_work',
    inspector: 'Er. Hiranya Saikia', inspectorRole: 'NABARD Technical Cell',
    status: 'completed', rating: 4,
    remarks: 'Site clearing done. Ground compaction certificate received.',
  },
];

/* ─── Mock Budget Allocations ─── */
export const budgetAllocations: BudgetAllocation[] = [
  { schoolCode: 'AVS-TML', schoolName: 'AVS Tamulpur', district: 'Baksa', fyAllocation: 8500000, sanctioned: 7165000, utilized: 2950000, pendingProposals: 0, activeProjects: 3 },
  { schoolCode: 'AVS-BPT', schoolName: 'AVS Barpeta', district: 'Barpeta', fyAllocation: 6000000, sanctioned: 1820000, utilized: 1820000, pendingProposals: 0, activeProjects: 0 },
  { schoolCode: 'AVS-KKR', schoolName: 'AVS Kokrajhar', district: 'Kokrajhar', fyAllocation: 12000000, sanctioned: 10900000, utilized: 1870000, pendingProposals: 0, activeProjects: 2 },
  { schoolCode: 'AVS-PMD', schoolName: 'AVS Pub Mangaldoi', district: 'Darrang', fyAllocation: 4500000, sanctioned: 825000, utilized: 825000, pendingProposals: 0, activeProjects: 0 },
  { schoolCode: 'AVS-DGS', schoolName: 'AVS Dalgaon Sialmari', district: 'Darrang', fyAllocation: 5500000, sanctioned: 0, utilized: 0, pendingProposals: 1, activeProjects: 0 },
  { schoolCode: 'AVS-NGJ', schoolName: 'AVS Nagrijuli', district: 'Baksa', fyAllocation: 4200000, sanctioned: 0, utilized: 0, pendingProposals: 2, activeProjects: 0 },
  { schoolCode: 'AVS-LKP', schoolName: 'AVS Lakhipur', district: 'Goalpara', fyAllocation: 4800000, sanctioned: 1250000, utilized: 0, pendingProposals: 0, activeProjects: 1 },
  { schoolCode: 'AVS-BCM', schoolName: 'AVS Bechimari', district: 'Darrang', fyAllocation: 5200000, sanctioned: 1700000, utilized: 850000, pendingProposals: 0, activeProjects: 1 },
  { schoolCode: 'AVS-CNG', schoolName: 'AVS Chenga', district: 'Barpeta', fyAllocation: 3800000, sanctioned: 0, utilized: 0, pendingProposals: 1, activeProjects: 0 },
  { schoolCode: 'AVS-MTA', schoolName: 'AVS Matia', district: 'Goalpara', fyAllocation: 3500000, sanctioned: 0, utilized: 0, pendingProposals: 0, activeProjects: 0 },
];

/* ─── Mock Documents (filtered to principal demo school) ─── */
export const documents: DocumentRecord[] = [
  { id: 'DOC-001', projectId: 'DW-2026-015', projectTitle: 'Annual Maintenance — Roofing Repairs', type: 'utilization_certificate', filename: 'UC_DW-2026-015_Roofing.pdf', uploadedDate: '2026-04-08', uploadedBy: 'Mr. Bipul Basumatary', sizeKb: 412 },
  { id: 'DOC-002', projectId: 'DW-2026-015', projectTitle: 'Annual Maintenance — Roofing Repairs', type: 'completion_certificate', filename: 'CC_DW-2026-015_Roofing.pdf', uploadedDate: '2026-04-04', uploadedBy: 'Er. Manoranjan Das', sizeKb: 386 },
  { id: 'DOC-003', projectId: 'DW-2026-001', projectTitle: 'Construction of 6 Additional Classrooms', type: 'work_order', filename: 'WO_2026_AVS_0042.pdf', uploadedDate: '2026-03-10', uploadedBy: 'Sangathan Engg. Wing', sizeKb: 524 },
  { id: 'DOC-004', projectId: 'DW-2026-001', projectTitle: 'Construction of 6 Additional Classrooms', type: 'boq', filename: 'BOQ_DW-2026-001.xlsx', uploadedDate: '2026-02-08', uploadedBy: 'Er. Pranab Choudhury', sizeKb: 218 },
  { id: 'DOC-005', projectId: 'DW-2026-001', projectTitle: 'Construction of 6 Additional Classrooms', type: 'inspection_report', filename: 'INS_2026-029_Foundation.pdf', uploadedDate: '2026-04-20', uploadedBy: 'Er. Pranab Choudhury', sizeKb: 1248 },
  { id: 'DOC-006', projectId: 'DW-2026-001', projectTitle: 'Construction of 6 Additional Classrooms', type: 'site_photo', filename: 'Site_Photos_April_2026.zip', uploadedDate: '2026-04-22', uploadedBy: 'Mr. Bipul Basumatary', sizeKb: 8642 },
  { id: 'DOC-007', projectId: 'DW-2026-004', projectTitle: 'Renovation of Toilet Block & RO Water Plant', type: 'work_order', filename: 'WO_2026_AVS_0051.pdf', uploadedDate: '2026-04-01', uploadedBy: 'Sangathan Engg. Wing', sizeKb: 498 },
  { id: 'DOC-008', projectId: 'DW-2026-004', projectTitle: 'Renovation of Toilet Block & RO Water Plant', type: 'invoice', filename: 'Invoice_BorahBros_T1.pdf', uploadedDate: '2026-04-26', uploadedBy: 'Mr. Bipul Basumatary', sizeKb: 142 },
  { id: 'DOC-009', projectId: 'DW-2026-010', projectTitle: 'Computer Lab Setup (30 systems + UPS)', type: 'boq', filename: 'BOQ_DW-2026-010.xlsx', uploadedDate: '2026-03-30', uploadedBy: 'PM SHRI Cell', sizeKb: 187 },
  { id: 'DOC-010', projectId: 'DW-2026-013', projectTitle: 'Science Lab Equipment Procurement', type: 'work_order', filename: 'WO_2026_AVS_0064.pdf', uploadedDate: '2026-04-30', uploadedBy: 'Sangathan Director — Academics', sizeKb: 376 },
];

/* ─── Aggregations ─── */
export function getDevWorksForSchool(schoolCode: string): DevWork[] {
  return devWorks.filter(w => w.schoolCode === schoolCode);
}

export function getDocumentsForSchool(schoolCode: string): DocumentRecord[] {
  return documents.filter(d => devWorks.find(w => w.id === d.projectId)?.schoolCode === schoolCode);
}
