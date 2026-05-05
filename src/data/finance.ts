/* ============================================
   AVS EduConnect — Finance Data Layer
   ============================================ */

/* ─── Revenue Trend (Monthly) ─── */
export const revenueMonthly = [
  { month: 'Apr', collected: 42.5, target: 48, expenses: 28.1 },
  { month: 'May', collected: 45.2, target: 48, expenses: 30.4 },
  { month: 'Jun', collected: 38.8, target: 48, expenses: 27.6 },
  { month: 'Jul', collected: 46.1, target: 48, expenses: 31.2 },
  { month: 'Aug', collected: 44.3, target: 48, expenses: 29.8 },
  { month: 'Sep', collected: 47.8, target: 48, expenses: 32.5 },
  { month: 'Oct', collected: 43.6, target: 48, expenses: 30.1 },
  { month: 'Nov', collected: 41.9, target: 48, expenses: 28.7 },
  { month: 'Dec', collected: 39.4, target: 48, expenses: 26.9 },
  { month: 'Jan', collected: 46.7, target: 48, expenses: 31.8 },
  { month: 'Feb', collected: 48.2, target: 48, expenses: 33.4 },
  { month: 'Mar', collected: 47.1, target: 48, expenses: 32.0 },
];

/* ─── School-wise Collection (Super Admin) ─── */
export const schoolWiseCollection = [
  { school: 'AVS Delhi', code: 'DEL', collected: 91, target: 100, pending: 9, students: 1450 },
  { school: 'AVS Bangalore', code: 'BLR', collected: 96, target: 100, pending: 4, students: 1450 },
  { school: 'AVS Mumbai', code: 'MUM', collected: 93, target: 100, pending: 7, students: 1180 },
  { school: 'AVS Noida', code: 'NOI', collected: 90, target: 100, pending: 10, students: 1120 },
  { school: 'AVS Hyderabad', code: 'HYD', collected: 87, target: 100, pending: 13, students: 1050 },
  { school: 'AVS Pune', code: 'PUN', collected: 88, target: 100, pending: 12, students: 980 },
  { school: 'AVS Chandigarh', code: 'CHD', collected: 92, target: 100, pending: 8, students: 920 },
  { school: 'AVS Lucknow', code: 'LKO', collected: 85, target: 100, pending: 15, students: 890 },
  { school: 'AVS Chennai', code: 'CHN', collected: 82, target: 100, pending: 18, students: 860 },
  { school: 'AVS Ahmedabad', code: 'AMD', collected: 84, target: 100, pending: 16, students: 780 },
  { school: 'AVS Jaipur', code: 'JAI', collected: 79, target: 100, pending: 21, students: 720 },
  { school: 'AVS Kolkata', code: 'KOL', collected: 78, target: 100, pending: 22, students: 640 },
  { school: 'AVS Indore', code: 'IND', collected: 76, target: 100, pending: 24, students: 540 },
  { school: 'AVS Kanpur', code: 'KNP', collected: 68, target: 100, pending: 32, students: 520 },
  { school: 'AVS Patna', code: 'PAT', collected: 71, target: 100, pending: 29, students: 480 },
];

/* ─── Expense Categories ─── */
export const expenseCategories = [
  { category: 'Teacher Salaries', amount: 185.4, percent: 42, color: '#10B981' },
  { category: 'Non-Teaching Staff', amount: 68.2, percent: 15, color: '#3B82F6' },
  { category: 'Infrastructure', amount: 52.8, percent: 12, color: '#F59E0B' },
  { category: 'Utilities & Maintenance', amount: 39.6, percent: 9, color: '#EC4899' },
  { category: 'Transport', amount: 35.2, percent: 8, color: '#8B5CF6' },
  { category: 'Lab & Equipment', amount: 26.4, percent: 6, color: '#06B6D4' },
  { category: 'Events & Activities', amount: 17.6, percent: 4, color: '#F97316' },
  { category: 'Miscellaneous', amount: 17.6, percent: 4, color: '#6B7280' },
];

/* ─── Fee Defaulters ─── */
export const feeDefaulters = [
  { id: 1, name: 'Rahul Chauhan', school: 'AVS Kanpur', class: 'X-A', pending: 45000, months: 3, parent: 'Suresh Chauhan', phone: '+91 98390 12345' },
  { id: 2, name: 'Sneha Yadav', school: 'AVS Patna', class: 'VIII-B', pending: 38000, months: 3, parent: 'Ramesh Yadav', phone: '+91 98350 23456' },
  { id: 3, name: 'Vikash Tiwari', school: 'AVS Kanpur', class: 'XI-A', pending: 52000, months: 4, parent: 'Ashok Tiwari', phone: '+91 98390 34567' },
  { id: 4, name: 'Priyanka Singh', school: 'AVS Jaipur', class: 'IX-C', pending: 30000, months: 2, parent: 'Ravi Singh', phone: '+91 98290 45678' },
  { id: 5, name: 'Amit Das', school: 'AVS Kolkata', class: 'VII-A', pending: 25000, months: 2, parent: 'Sanjay Das', phone: '+91 98300 56789' },
  { id: 6, name: 'Neha Kumari', school: 'AVS Patna', class: 'X-B', pending: 42000, months: 3, parent: 'Vinod Kumar', phone: '+91 98350 67890' },
  { id: 7, name: 'Deepak Verma', school: 'AVS Chennai', class: 'XII-A', pending: 55000, months: 4, parent: 'Mohan Verma', phone: '+91 98400 78901' },
  { id: 8, name: 'Anjali Mehta', school: 'AVS Jaipur', class: 'VI-B', pending: 18000, months: 1, parent: 'Sunil Mehta', phone: '+91 98290 89012' },
  { id: 9, name: 'Ravi Pandey', school: 'AVS Lucknow', class: 'VIII-A', pending: 36000, months: 3, parent: 'Mahesh Pandey', phone: '+91 98390 90123' },
  { id: 10, name: 'Komal Agarwal', school: 'AVS Indore', class: 'IX-A', pending: 28000, months: 2, parent: 'Pankaj Agarwal', phone: '+91 98260 01234' },
];

/* ─── Recent Transactions ─── */
export const recentTransactions = [
  { id: 'TXN001', student: 'Aarav Sharma', school: 'AVS Delhi', amount: 15000, type: 'Tuition Fee', mode: 'UPI', date: '2026-05-05', status: 'success' },
  { id: 'TXN002', student: 'Priya Patel', school: 'AVS Delhi', amount: 15000, type: 'Tuition Fee', mode: 'Net Banking', date: '2026-05-05', status: 'success' },
  { id: 'TXN003', student: 'Arjun Reddy', school: 'AVS Bangalore', amount: 18000, type: 'Tuition Fee', mode: 'UPI', date: '2026-05-04', status: 'success' },
  { id: 'TXN004', student: 'Meera Nair', school: 'AVS Chennai', amount: 12000, type: 'Transport Fee', mode: 'Cash', date: '2026-05-04', status: 'success' },
  { id: 'TXN005', student: 'Kabir Singh', school: 'AVS Delhi', amount: 15000, type: 'Tuition Fee', mode: 'Cheque', date: '2026-05-03', status: 'pending' },
  { id: 'TXN006', student: 'Diya Deshmukh', school: 'AVS Pune', amount: 14000, type: 'Tuition Fee', mode: 'UPI', date: '2026-05-03', status: 'success' },
  { id: 'TXN007', student: 'Ishita Banerjee', school: 'AVS Kolkata', amount: 8500, type: 'Exam Fee', mode: 'Net Banking', date: '2026-05-02', status: 'success' },
  { id: 'TXN008', student: 'Rohan Gupta', school: 'AVS Lucknow', amount: 13000, type: 'Tuition Fee', mode: 'UPI', date: '2026-05-02', status: 'failed' },
  { id: 'TXN009', student: 'Navya Rao', school: 'AVS Hyderabad', amount: 16000, type: 'Tuition Fee', mode: 'Card', date: '2026-05-01', status: 'success' },
  { id: 'TXN010', student: 'Tara Kaur', school: 'AVS Chandigarh', amount: 15500, type: 'Tuition Fee', mode: 'UPI', date: '2026-05-01', status: 'success' },
  { id: 'TXN011', student: 'Vihaan Patel', school: 'AVS Ahmedabad', amount: 14500, type: 'Tuition Fee', mode: 'Net Banking', date: '2026-04-30', status: 'success' },
  { id: 'TXN012', student: 'Saanvi Kulkarni', school: 'AVS Pune', amount: 5000, type: 'Activity Fee', mode: 'Cash', date: '2026-04-30', status: 'success' },
];

/* ─── Fee Structure Templates ─── */
export type FeeComponent = { name: string; monthly: number; quarterly: number; annual: number; };
export type FeeTemplate = { id: string; name: string; description: string; assignedSchools: string[]; components: FeeComponent[]; };

export const feeStructureTemplates: FeeTemplate[] = [
  {
    id: 'FST001',
    name: 'Tier 1 Metro (Premium)',
    description: 'Standard fee structure for metro branches with premium facilities.',
    assignedSchools: ['DEL', 'BLR', 'MUM', 'HYD'],
    components: [
      { name: 'Tuition Fee', monthly: 12500, quarterly: 37500, annual: 150000 },
      { name: 'Transport Fee', monthly: 4500, quarterly: 13500, annual: 54000 },
      { name: 'Lab Fee', monthly: 0, quarterly: 2500, annual: 10000 },
      { name: 'Activity Fee', monthly: 0, quarterly: 1500, annual: 6000 },
      { name: 'Exam Fee', monthly: 0, quarterly: 0, annual: 8500 },
      { name: 'Library Fee', monthly: 0, quarterly: 500, annual: 2000 },
    ]
  },
  {
    id: 'FST002',
    name: 'Tier 2 City (Standard)',
    description: 'Standard fee structure for non-metro branches.',
    assignedSchools: ['NOI', 'PUN', 'CHD', 'LKO', 'CHN', 'AMD', 'JAI', 'KOL'],
    components: [
      { name: 'Tuition Fee', monthly: 9500, quarterly: 28500, annual: 114000 },
      { name: 'Transport Fee', monthly: 3000, quarterly: 9000, annual: 36000 },
      { name: 'Lab Fee', monthly: 0, quarterly: 1500, annual: 6000 },
      { name: 'Activity Fee', monthly: 0, quarterly: 1000, annual: 4000 },
      { name: 'Exam Fee', monthly: 0, quarterly: 0, annual: 6500 },
      { name: 'Library Fee', monthly: 0, quarterly: 400, annual: 1600 },
    ]
  },
  {
    id: 'FST003',
    name: 'Emerging Branch',
    description: 'Discounted fee structure for newly established branches.',
    assignedSchools: ['IND', 'KNP', 'PAT'],
    components: [
      { name: 'Tuition Fee', monthly: 7500, quarterly: 22500, annual: 90000 },
      { name: 'Transport Fee', monthly: 2500, quarterly: 7500, annual: 30000 },
      { name: 'Lab Fee', monthly: 0, quarterly: 1000, annual: 4000 },
      { name: 'Activity Fee', monthly: 0, quarterly: 800, annual: 3200 },
      { name: 'Exam Fee', monthly: 0, quarterly: 0, annual: 5000 },
      { name: 'Library Fee', monthly: 0, quarterly: 300, annual: 1200 },
    ]
  }
];
