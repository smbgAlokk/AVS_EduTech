/* ============================================
   AVS EduConnect — SDF (School Development Fund) Data Layer
   ============================================ */

export type SdfStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed';

export interface SdfRequest {
  id: string;
  schoolCode: string;
  schoolName: string;
  title: string;
  category: 'Infrastructure' | 'Technology' | 'Sports' | 'Facilities' | 'Academic';
  requestedAmount: number;
  approvedAmount?: number;
  dateRequested: string;
  status: SdfStatus;
  urgency: 'high' | 'medium' | 'low';
  principal: string;
  progress?: number;
}

export const sdfRequests: SdfRequest[] = [
  { id: 'SDF-2026-001', schoolCode: 'DEL', schoolName: 'AVS Delhi', title: 'New Robotics Lab Installation', category: 'Technology', requestedAmount: 1850000, approvedAmount: 1800000, dateRequested: '2026-04-10', status: 'approved', urgency: 'high', principal: 'Dr. Ananya Sharma', progress: 45 },
  { id: 'SDF-2026-002', schoolCode: 'MUM', schoolName: 'AVS Mumbai', title: 'Library Renovation & E-books', category: 'Academic', requestedAmount: 950000, dateRequested: '2026-04-28', status: 'pending', urgency: 'medium', principal: 'Mrs. Priya Deshmukh' },
  { id: 'SDF-2026-003', schoolCode: 'BLR', schoolName: 'AVS Bangalore', title: 'Basketball Court Resurfacing', category: 'Sports', requestedAmount: 1200000, approvedAmount: 1200000, dateRequested: '2026-03-15', status: 'completed', urgency: 'medium', principal: 'Mrs. Lakshmi Rao', progress: 100 },
  { id: 'SDF-2026-004', schoolCode: 'LKO', schoolName: 'AVS Lucknow', title: 'Solar Panel Installation', category: 'Infrastructure', requestedAmount: 2500000, dateRequested: '2026-05-02', status: 'under_review', urgency: 'high', principal: 'Mr. Rajesh Tiwari' },
  { id: 'SDF-2026-005', schoolCode: 'PUN', schoolName: 'AVS Pune', title: 'Auditorium Audio System Upgrade', category: 'Facilities', requestedAmount: 850000, dateRequested: '2026-05-04', status: 'pending', urgency: 'low', principal: 'Dr. Meera Kulkarni' },
  { id: 'SDF-2026-006', schoolCode: 'CHN', schoolName: 'AVS Chennai', title: 'Smart Boards for Middle School', category: 'Technology', requestedAmount: 1400000, approvedAmount: 1400000, dateRequested: '2026-04-20', status: 'approved', urgency: 'high', principal: 'Mr. Karthik Subramanian', progress: 15 },
  { id: 'SDF-2026-007', schoolCode: 'NOI', schoolName: 'AVS Noida', title: 'Cafeteria Seating Expansion', category: 'Facilities', requestedAmount: 600000, approvedAmount: 0, dateRequested: '2026-04-18', status: 'rejected', urgency: 'low', principal: 'Dr. Amit Gupta' },
  { id: 'SDF-2026-008', schoolCode: 'HYD', schoolName: 'AVS Hyderabad', title: 'Physics Lab Equipment', category: 'Academic', requestedAmount: 750000, dateRequested: '2026-05-01', status: 'under_review', urgency: 'medium', principal: 'Mrs. Revathi Reddy' },
];

export const sdfAllocations = [
  { school: 'AVS Delhi', code: 'DEL', allocated: 5000000, utilized: 1800000, pending: 0 },
  { school: 'AVS Bangalore', code: 'BLR', allocated: 4500000, utilized: 2800000, pending: 0 },
  { school: 'AVS Mumbai', code: 'MUM', allocated: 4000000, utilized: 1200000, pending: 950000 },
  { school: 'AVS Noida', code: 'NOI', allocated: 3500000, utilized: 1500000, pending: 0 },
  { school: 'AVS Lucknow', code: 'LKO', allocated: 3000000, utilized: 500000, pending: 2500000 },
];
