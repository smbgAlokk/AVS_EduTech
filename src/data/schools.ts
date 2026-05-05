/* ============================================
   AVS EduConnect — Schools Data Layer
   ============================================
   This file is the single source of truth for school data.
   During the prototype phase, it exports mock data.
   When the backend is ready, swap the getter functions
   to call your API endpoints — no component changes needed.
   ============================================ */

import type { School } from '../types';

/* ─── Mock Data ─── */
export const MOCK_SCHOOLS: School[] = [
  { id: 'SCH001', name: 'AVS Vidyalaya - Delhi', code: 'AVS-DEL', city: 'New Delhi', state: 'Delhi', principal: 'Dr. Ananya Sharma', totalStudents: 1450, totalTeachers: 82, attendanceRate: 94, feeCollectionRate: 91, status: 'active', address: 'Sector 14, Dwarka, New Delhi - 110075', phone: '+91 11 2804 5500', email: 'delhi@avsvidyalaya.edu.in', establishedYear: 2005 },
  { id: 'SCH002', name: 'AVS Vidyalaya - Lucknow', code: 'AVS-LKO', city: 'Lucknow', state: 'Uttar Pradesh', principal: 'Mr. Rajesh Tiwari', totalStudents: 890, totalTeachers: 54, attendanceRate: 91, feeCollectionRate: 85, status: 'active', address: 'Gomti Nagar, Lucknow - 226010', phone: '+91 522 271 0044', email: 'lucknow@avsvidyalaya.edu.in', establishedYear: 2008 },
  { id: 'SCH003', name: 'AVS Vidyalaya - Mumbai', code: 'AVS-MUM', city: 'Mumbai', state: 'Maharashtra', principal: 'Mrs. Priya Deshmukh', totalStudents: 1180, totalTeachers: 68, attendanceRate: 89, feeCollectionRate: 93, status: 'active', address: 'Andheri West, Mumbai - 400053', phone: '+91 22 2635 8800', email: 'mumbai@avsvidyalaya.edu.in', establishedYear: 2006 },
  { id: 'SCH004', name: 'AVS Vidyalaya - Jaipur', code: 'AVS-JAI', city: 'Jaipur', state: 'Rajasthan', principal: 'Mr. Vikram Singh', totalStudents: 720, totalTeachers: 42, attendanceRate: 88, feeCollectionRate: 79, status: 'active', address: 'Mansarovar, Jaipur - 302020', phone: '+91 141 278 0066', email: 'jaipur@avsvidyalaya.edu.in', establishedYear: 2010 },
  { id: 'SCH005', name: 'AVS Vidyalaya - Pune', code: 'AVS-PUN', city: 'Pune', state: 'Maharashtra', principal: 'Dr. Meera Kulkarni', totalStudents: 980, totalTeachers: 58, attendanceRate: 92, feeCollectionRate: 88, status: 'active', address: 'Kothrud, Pune - 411038', phone: '+91 20 2543 7700', email: 'pune@avsvidyalaya.edu.in', establishedYear: 2007 },
  { id: 'SCH006', name: 'AVS Vidyalaya - Bangalore', code: 'AVS-BLR', city: 'Bangalore', state: 'Karnataka', principal: 'Mrs. Lakshmi Rao', totalStudents: 1450, totalTeachers: 85, attendanceRate: 95, feeCollectionRate: 96, status: 'active', address: 'Koramangala, Bangalore - 560034', phone: '+91 80 4125 6600', email: 'bangalore@avsvidyalaya.edu.in', establishedYear: 2004 },
  { id: 'SCH007', name: 'AVS Vidyalaya - Chennai', code: 'AVS-CHN', city: 'Chennai', state: 'Tamil Nadu', principal: 'Mr. Karthik Subramanian', totalStudents: 860, totalTeachers: 50, attendanceRate: 87, feeCollectionRate: 82, status: 'active', address: 'T. Nagar, Chennai - 600017', phone: '+91 44 2434 7700', email: 'chennai@avsvidyalaya.edu.in', establishedYear: 2009 },
  { id: 'SCH008', name: 'AVS Vidyalaya - Kolkata', code: 'AVS-KOL', city: 'Kolkata', state: 'West Bengal', principal: 'Dr. Arup Banerjee', totalStudents: 640, totalTeachers: 38, attendanceRate: 86, feeCollectionRate: 78, status: 'active', address: 'Salt Lake, Kolkata - 700091', phone: '+91 33 2358 4400', email: 'kolkata@avsvidyalaya.edu.in', establishedYear: 2011 },
  { id: 'SCH009', name: 'AVS Vidyalaya - Kanpur', code: 'AVS-KNP', city: 'Kanpur', state: 'Uttar Pradesh', principal: 'Mr. Sanjay Verma', totalStudents: 520, totalTeachers: 32, attendanceRate: 72, feeCollectionRate: 68, status: 'active', address: 'Swaroop Nagar, Kanpur - 208002', phone: '+91 512 253 1100', email: 'kanpur@avsvidyalaya.edu.in', establishedYear: 2013 },
  { id: 'SCH010', name: 'AVS Vidyalaya - Patna', code: 'AVS-PAT', city: 'Patna', state: 'Bihar', principal: 'Mrs. Sunita Kumari', totalStudents: 480, totalTeachers: 28, attendanceRate: 83, feeCollectionRate: 71, status: 'active', address: 'Boring Road, Patna - 800001', phone: '+91 612 222 0055', email: 'patna@avsvidyalaya.edu.in', establishedYear: 2014 },
  { id: 'SCH011', name: 'AVS Vidyalaya - Noida', code: 'AVS-NOI', city: 'Noida', state: 'Uttar Pradesh', principal: 'Dr. Amit Gupta', totalStudents: 1120, totalTeachers: 65, attendanceRate: 93, feeCollectionRate: 90, status: 'active', address: 'Sector 62, Noida - 201301', phone: '+91 120 429 8800', email: 'noida@avsvidyalaya.edu.in', establishedYear: 2006 },
  { id: 'SCH012', name: 'AVS Vidyalaya - Hyderabad', code: 'AVS-HYD', city: 'Hyderabad', state: 'Telangana', principal: 'Mrs. Revathi Reddy', totalStudents: 1050, totalTeachers: 62, attendanceRate: 90, feeCollectionRate: 87, status: 'active', address: 'Banjara Hills, Hyderabad - 500034', phone: '+91 40 2355 7700', email: 'hyderabad@avsvidyalaya.edu.in', establishedYear: 2008 },
  { id: 'SCH013', name: 'AVS Vidyalaya - Ahmedabad', code: 'AVS-AMD', city: 'Ahmedabad', state: 'Gujarat', principal: 'Mr. Devendra Patel', totalStudents: 780, totalTeachers: 45, attendanceRate: 91, feeCollectionRate: 84, status: 'active', address: 'SG Highway, Ahmedabad - 380054', phone: '+91 79 2687 3300', email: 'ahmedabad@avsvidyalaya.edu.in', establishedYear: 2010 },
  { id: 'SCH014', name: 'AVS Vidyalaya - Indore', code: 'AVS-IND', city: 'Indore', state: 'Madhya Pradesh', principal: 'Mr. Ashok Joshi', totalStudents: 540, totalTeachers: 30, attendanceRate: 85, feeCollectionRate: 76, status: 'inactive', address: 'Vijay Nagar, Indore - 452010', phone: '+91 731 255 4400', email: 'indore@avsvidyalaya.edu.in', establishedYear: 2015 },
  { id: 'SCH015', name: 'AVS Vidyalaya - Chandigarh', code: 'AVS-CHD', city: 'Chandigarh', state: 'Chandigarh', principal: 'Dr. Harmeet Kaur', totalStudents: 920, totalTeachers: 55, attendanceRate: 94, feeCollectionRate: 92, status: 'active', address: 'Sector 17, Chandigarh - 160017', phone: '+91 172 274 6600', email: 'chandigarh@avsvidyalaya.edu.in', establishedYear: 2007 },
];

/* ─── Data Accessors ─── */
// When the backend arrives, replace the body of these functions
// with API calls. Every component that uses them will just work.

export function getSchools(): School[] {
  return MOCK_SCHOOLS;
}

export function getSchoolById(id: string): School | undefined {
  return MOCK_SCHOOLS.find(s => s.id === id);
}

export function getSchoolStates(): string[] {
  return [...new Set(MOCK_SCHOOLS.map(s => s.state))].sort();
}

/* ─── Derived Statistics ─── */
export function getSchoolNetworkStats() {
  const schools = getSchools();
  return {
    totalSchools: schools.length,
    activeSchools: schools.filter(s => s.status === 'active').length,
    totalStudents: schools.reduce((sum, s) => sum + s.totalStudents, 0),
    totalTeachers: schools.reduce((sum, s) => sum + s.totalTeachers, 0),
    avgAttendance: Math.round(schools.reduce((sum, s) => sum + s.attendanceRate, 0) / schools.length),
  };
}
