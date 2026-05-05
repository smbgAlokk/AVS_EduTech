/* ============================================
   AVS EduConnect — Students Filter Hook
   ============================================
   Encapsulates all filtering logic for StudentDatabase.
   ============================================ */

import { useState, useMemo } from 'react';
import type { Student } from '../types';

export function useStudentsFilter(students: Student[]) {
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusChip, setStatusChip] = useState<string>('all');

  const filtered = useMemo(() => {
    let data = [...students];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.admissionNumber.toLowerCase().includes(q) ||
        s.schoolName.toLowerCase().includes(q) ||
        s.parentName.toLowerCase().includes(q)
      );
    }
    if (statusChip !== 'all') data = data.filter(s => s.status === statusChip);
    if (schoolFilter !== 'all') data = data.filter(s => s.schoolName === schoolFilter);
    if (classFilter !== 'all') data = data.filter(s => s.className === classFilter);
    if (genderFilter !== 'all') data = data.filter(s => s.gender === genderFilter);
    data.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }, [students, search, statusChip, schoolFilter, classFilter, genderFilter]);

  const clearAll = () => {
    setSearch('');
    setSchoolFilter('all');
    setClassFilter('all');
    setGenderFilter('all');
    setStatusChip('all');
  };

  const hasFilters = schoolFilter !== 'all' || classFilter !== 'all' || genderFilter !== 'all' || search.trim() !== '';

  return {
    search, setSearch,
    schoolFilter, setSchoolFilter,
    classFilter, setClassFilter,
    genderFilter, setGenderFilter,
    statusChip, setStatusChip,
    filtered,
    clearAll,
    hasFilters,
  };
}
