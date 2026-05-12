
export type CompetitionCategory = 'Academic' | 'Sports' | 'Cultural';
export type CompetitionStatus = 'Proposed' | 'Sanctioned' | 'Active' | 'Judging' | 'Completed';

export interface Competition {
  id: string;
  title: string;
  category: CompetitionCategory;
  status: CompetitionStatus;
  venue: string;
  budget: number;
  dates: string;
  participants: number;
}

export type ParticipationStatus = 'Registered' | 'Qualified' | 'Eliminated' | 'Winner';

export interface ParticipationMatrix {
  [competitionId: string]: {
    [schoolId: string]: ParticipationStatus;
  };
}

export interface SchoolAchievement {
  id: string;
  schoolId: string;
  title: string;
  year: string;
  medal: 'Gold' | 'Silver' | 'Bronze' | 'Trophy';
  category: CompetitionCategory;
}

export const mockCompetitions: Competition[] = [
  { id: 'c1', title: 'State Science Decathlon', category: 'Academic', status: 'Active', venue: 'AVS HQ - Guwahati', budget: 150000, dates: '2026-06-15', participants: 45 },
  { id: 'c2', title: 'AVS Inter-School Sports Meet', category: 'Sports', status: 'Sanctioned', venue: 'AVS Stadium - Jorhat', budget: 500000, dates: '2026-08-10 - 2026-08-14', participants: 800 },
  { id: 'c3', title: 'Assam Cultural Fest', category: 'Cultural', status: 'Proposed', venue: 'TBD', budget: 75000, dates: '2026-09-05', participants: 0 },
  { id: 'c4', title: 'Mathematics Olympiad', category: 'Academic', status: 'Completed', venue: 'Online', budget: 20000, dates: '2026-03-20', participants: 120 },
];

export const mockParticipationMatrix: ParticipationMatrix = {
  'c1': { 'sch-1': 'Registered', 'sch-2': 'Qualified' },
  'c2': { 'sch-1': 'Registered', 'sch-3': 'Registered' },
};

export const mockAchievements: SchoolAchievement[] = [
  { id: 'a1', schoolId: 'sch-1', title: 'State Science Decathlon 2025', year: '2025', medal: 'Gold', category: 'Academic' },
  { id: 'a2', schoolId: 'sch-1', title: 'AVS Inter-School Sports Meet 2025', year: '2025', medal: 'Trophy', category: 'Sports' },
  { id: 'a3', schoolId: 'sch-2', title: 'Mathematics Olympiad 2025', year: '2025', medal: 'Silver', category: 'Academic' },
];
