/* ============================================
   AVS EduConnect — Schools Filter Hook
   ============================================
   Encapsulates all filtering, sorting, and search logic
   for the Schools Directory. Keeps the page component lean.
   ============================================ */

import { useState, useMemo } from 'react';
import type { School } from '../types';

export type SchoolSortKey = 'name' | 'students' | 'attendance' | 'fee';
export type SchoolStatusFilter = 'all' | 'active' | 'inactive';

export function useSchoolsFilter(schools: School[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SchoolStatusFilter>('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SchoolSortKey>('name');

  const filtered = useMemo(() => {
    let data = [...schools];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.principal.toLowerCase().includes(q)
      );
    }

    // Status
    if (statusFilter !== 'all') data = data.filter(s => s.status === statusFilter);

    // State
    if (stateFilter !== 'all') data = data.filter(s => s.state === stateFilter);

    // Sort
    data.sort((a, b) => {
      switch (sortBy) {
        case 'students': return b.totalStudents - a.totalStudents;
        case 'attendance': return b.attendanceRate - a.attendanceRate;
        case 'fee': return b.feeCollectionRate - a.feeCollectionRate;
        default: return a.name.localeCompare(b.name);
      }
    });

    return data;
  }, [schools, searchQuery, statusFilter, stateFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setStateFilter('all');
    setSortBy('name');
  };

  const hasActiveFilters = statusFilter !== 'all' || stateFilter !== 'all' || searchQuery.trim() !== '';

  return {
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    stateFilter, setStateFilter,
    sortBy, setSortBy,
    filtered,
    clearFilters,
    hasActiveFilters,
  };
}
