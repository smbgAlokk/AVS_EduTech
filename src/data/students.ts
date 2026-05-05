/* ============================================
   AVS EduConnect — Students Data Layer
   ============================================ */

import type { Student } from '../types';

/* ─── Name pools for realistic Indian student data ─── */
const FIRST_NAMES_M = ['Aarav','Arjun','Kabir','Rohan','Vivaan','Aditya','Reyansh','Arnav','Dhruv','Vihaan','Ishaan','Sai','Rudra','Atharv','Advait','Ayaan','Krishna','Shaurya','Tanay','Yash','Devansh','Parth','Aarush','Ritvik','Pranav','Nikhil','Harsh','Kunal','Manav','Sahil'];
const FIRST_NAMES_F = ['Priya','Ananya','Meera','Diya','Ishita','Saanvi','Tara','Navya','Myra','Anika','Kiara','Riya','Sara','Zara','Avni','Pari','Siya','Nisha','Kavya','Ira','Aisha','Trisha','Mahi','Sneha','Pooja','Simran','Anvi','Jiya','Khushi','Aditi'];
const LAST_NAMES = ['Sharma','Patel','Reddy','Iyer','Singh','Nair','Gupta','Deshmukh','Joshi','Banerjee','Verma','Kulkarni','Kumar','Kaur','Tiwari','Rao','Saxena','Choudhury','Mishra','Das','Mehta','Bose','Pillai','Chauhan','Agarwal','Thakur','Pandey','Srinivasan','Hegde','Kapoor'];
const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const CLASSES = ['V','VI','VII','VIII','IX','X','XI','XII'];
const SECTIONS = ['A','B','C'];

const SCHOOL_MAP: Record<string, string> = {
  SCH001: 'AVS Delhi', SCH002: 'AVS Lucknow', SCH003: 'AVS Mumbai',
  SCH004: 'AVS Jaipur', SCH005: 'AVS Pune', SCH006: 'AVS Bangalore',
  SCH007: 'AVS Chennai', SCH008: 'AVS Kolkata', SCH009: 'AVS Kanpur',
  SCH010: 'AVS Patna', SCH011: 'AVS Noida', SCH012: 'AVS Hyderabad',
  SCH013: 'AVS Ahmedabad', SCH014: 'AVS Indore', SCH015: 'AVS Chandigarh',
};

/* ─── Deterministic pseudo-random from seed ─── */
function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 11) % 2147483647; return (s - 1) / 2147483646; };
}

/* ─── Generator ─── */
function generateStudents(): Student[] {
  const students: Student[] = [];
  const rand = seededRand(42);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const schoolIds = Object.keys(SCHOOL_MAP);
  let counter = 1;

  for (const schoolId of schoolIds) {
    const schoolName = SCHOOL_MAP[schoolId];
    // 10-14 students per school
    const count = 10 + Math.floor(rand() * 5);

    for (let s = 0; s < count; s++) {
      const isMale = rand() > 0.48;
      const firstName = isMale ? pick(FIRST_NAMES_M) : pick(FIRST_NAMES_F);
      const lastName = pick(LAST_NAMES);
      const cls = pick(CLASSES);
      const section = pick(SECTIONS);
      const attendance = Math.round(65 + rand() * 34);
      const grade = attendance >= 90 ? (rand() > 0.3 ? 'A+' : 'A') : attendance >= 80 ? (rand() > 0.5 ? 'A' : 'B+') : attendance >= 70 ? (rand() > 0.5 ? 'B' : 'B+') : (rand() > 0.5 ? 'C' : 'C+');
      const rank = Math.floor(1 + rand() * 40);
      const year = 2008 + Math.floor(rand() * 8);
      const month = 1 + Math.floor(rand() * 12);
      const day = 1 + Math.floor(rand() * 28);
      const statusRoll = rand();
      const status: Student['status'] = statusRoll > 0.92 ? 'graduated' : statusRoll > 0.87 ? 'transferred' : statusRoll > 0.84 ? 'withdrawn' : 'active';

      const parentFirstM = pick(FIRST_NAMES_M);
      const parentFirstF = pick(FIRST_NAMES_F);
      const parentName = rand() > 0.45 ? `${parentFirstM} ${lastName}` : `${parentFirstF} ${lastName}`;

      const id = `STU${String(counter).padStart(4, '0')}`;
      const admNum = `ADM-${2021 + Math.floor(rand() * 4)}-${String(counter).padStart(3, '0')}`;
      const phone = `+91 ${String(98000 + Math.floor(rand() * 1999))} ${String(10000 + Math.floor(rand() * 89999))}`;

      students.push({
        id,
        name: `${firstName} ${lastName}`,
        admissionNumber: admNum,
        rollNumber: String(s + 1).padStart(2, '0'),
        className: cls,
        section,
        schoolId,
        schoolName,
        dateOfBirth: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        gender: isMale ? 'male' : 'female',
        parentName,
        parentPhone: phone,
        attendanceRate: attendance,
        overallGrade: grade,
        rank,
        status,
        bloodGroup: pick(BLOOD_GROUPS),
      });
      counter++;
    }
  }
  return students;
}

export const MOCK_STUDENTS: Student[] = generateStudents();

export function getStudents(): Student[] { return MOCK_STUDENTS; }
export function getStudentById(id: string): Student | undefined { return MOCK_STUDENTS.find(s => s.id === id); }
export function getStudentSchoolNames(): string[] { return [...new Set(MOCK_STUDENTS.map(s => s.schoolName))].sort(); }
export function getStudentClassOptions(): string[] {
  const rom: Record<string, number> = { 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10, 'XI': 11, 'XII': 12 };
  return [...new Set(MOCK_STUDENTS.map(s => s.className))].sort((a, b) => (rom[a] || 0) - (rom[b] || 0));
}

export function getStudentNetworkStats() {
  const students = getStudents();
  return {
    statusCounts: {
      all: students.length,
      active: students.filter(s => s.status === 'active').length,
      transferred: students.filter(s => s.status === 'transferred').length,
      graduated: students.filter(s => s.status === 'graduated').length,
      withdrawn: students.filter(s => s.status === 'withdrawn').length,
    },
    avgAttendance: Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length),
    topGradeCount: students.filter(s => s.overallGrade.startsWith('A')).length,
    schoolCount: getStudentSchoolNames().length,
  };
}
