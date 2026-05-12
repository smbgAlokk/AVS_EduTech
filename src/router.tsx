import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Login from './pages/auth/Login';
import ComingSoon from './components/ui/ComingSoon';

// Lazy loaded routes and shared components
const SuperAdminDashboard = React.lazy(() => import('./pages/super-admin/SuperAdminDashboard'));
const SchoolsDirectory = React.lazy(() => import('./pages/super-admin/SchoolsDirectory'));
const SchoolDetails = React.lazy(() => import('./pages/super-admin/SchoolDetails'));
const StudentDatabase = React.lazy(() => import('./pages/super-admin/StudentDatabase'));
const PrincipalDashboard = React.lazy(() => import('./pages/principal/PrincipalDashboard'));
const TeacherDashboard = React.lazy(() => import('./pages/teacher/TeacherDashboard'));
const StudentDashboard = React.lazy(() => import('./pages/student/StudentDashboard'));
const ParentDashboard = React.lazy(() => import('./pages/parent/ParentDashboard'));
const PrincipalStudents = React.lazy(() => import('./pages/principal/PrincipalStudents'));
const FinancialReports = React.lazy(() => import('./components/shared/FinancialReports'));
const SdfFundManagement = React.lazy(() => import('./components/shared/SdfFundManagement'));
const DevelopmentWorks = React.lazy(() => import('./components/shared/DevelopmentWorks'));
const AttendanceModule = React.lazy(() => import('./components/shared/AttendanceModule'));
const InitiativesModule = React.lazy(() => import('./components/shared/InitiativesModule'));
const CompetitionsModule = React.lazy(() => import('./components/shared/CompetitionsModule'));
const PrincipalTeachers = React.lazy(() => import('./pages/principal/PrincipalTeachers'));

const p = (title: string) => <ComingSoon title={title} />;

// Helper to wrap lazy components in Suspense
const withSuspense = (Component: React.LazyExoticComponent<any>, props: any = {}) => (
  <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>}>
    <Component {...props} />
  </Suspense>
);

export const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/login', element: <Login /> },

  // Super Admin
  {
    element: <AppShell />, children: [
      { path: '/super-admin', element: withSuspense(SuperAdminDashboard) },
      { path: '/super-admin/schools', element: withSuspense(SchoolsDirectory) },
      { path: '/super-admin/schools/:id', element: withSuspense(SchoolDetails) },
      { path: '/super-admin/students', element: withSuspense(StudentDatabase) },
      { path: '/super-admin/finance', element: withSuspense(FinancialReports, { role: 'super-admin' }) },
      { path: '/super-admin/attendance', element: withSuspense(AttendanceModule, { role: 'super-admin' }) },
      { path: '/super-admin/sdf', element: withSuspense(SdfFundManagement, { role: 'super-admin' }) },
      { path: '/super-admin/development', element: withSuspense(DevelopmentWorks, { role: 'super-admin' }) },
      { path: '/super-admin/initiatives', element: withSuspense(InitiativesModule, { role: 'super-admin' }) },
      { path: '/super-admin/competitions', element: withSuspense(CompetitionsModule, { role: 'super-admin' }) },
      { path: '/super-admin/notifications', element: p('Notifications') },
      { path: '/super-admin/settings', element: p('Settings') },
    ]
  },

  // Principal
  {
    element: <AppShell />, children: [
      { path: '/principal', element: withSuspense(PrincipalDashboard) },
      { path: '/principal/students', element: withSuspense(PrincipalStudents) },
      { path: '/principal/students/:id', element: p('Student Profile') },
      { path: '/principal/teachers', element: withSuspense(PrincipalTeachers) },
      { path: '/principal/attendance', element: withSuspense(AttendanceModule, { role: 'principal' }) },
      { path: '/principal/fees', element: withSuspense(FinancialReports, { role: 'principal' }) },
      { path: '/principal/exams', element: p('Exam Schedule') },
      { path: '/principal/allotment', element: p('Class Allotment') },
      { path: '/principal/accounts', element: withSuspense(FinancialReports, { role: 'principal' }) },
      { path: '/principal/sdf', element: withSuspense(SdfFundManagement, { role: 'principal' }) },
      { path: '/principal/development', element: withSuspense(DevelopmentWorks, { role: 'principal' }) },
      { path: '/principal/initiatives', element: withSuspense(InitiativesModule, { role: 'principal' }) },
      { path: '/principal/competitions', element: withSuspense(CompetitionsModule, { role: 'principal' }) },
      { path: '/principal/announcements', element: p('Announcements') },
      { path: '/principal/gallery', element: p('Photo Gallery') },
      { path: '/principal/reports', element: p('Reports') },
    ]
  },

  // Teacher
  {
    element: <AppShell />, children: [
      { path: '/teacher', element: withSuspense(TeacherDashboard) },
      { path: '/teacher/attendance', element: withSuspense(AttendanceModule, { role: 'teacher' }) },
      { path: '/teacher/initiatives', element: withSuspense(InitiativesModule, { role: 'teacher' }) },
      { path: '/teacher/competitions', element: withSuspense(CompetitionsModule, { role: 'teacher' }) },
      { path: '/teacher/homework', element: p('Homework & Assignments') },
      { path: '/teacher/marks', element: p('Marks Entry') },
      { path: '/teacher/timetable', element: p('My Timetable') },
      { path: '/teacher/materials', element: p('Study Materials') },
      { path: '/teacher/activities', element: p('Student Activities') },
      { path: '/teacher/chat', element: p('Parent Chat') },
      { path: '/teacher/tests', element: p('Weekly Tests') },
      { path: '/teacher/profile', element: p('My Profile') },
    ]
  },

  // Student
  {
    element: <AppShell />, children: [
      { path: '/student', element: withSuspense(StudentDashboard) },
      { path: '/student/attendance', element: withSuspense(AttendanceModule, { role: 'student' }) },
      { path: '/student/initiatives', element: withSuspense(InitiativesModule, { role: 'student' }) },
      { path: '/student/competitions', element: withSuspense(CompetitionsModule, { role: 'student' }) },
      { path: '/student/timetable', element: p('My Timetable') },
      { path: '/student/assignments', element: p('Assignments') },
      { path: '/student/results', element: p('Results & Marks') },
      { path: '/student/materials', element: p('Study Materials') },
      { path: '/student/activities', element: p('Activities') },
      { path: '/student/chat', element: p('Chat with Teacher') },
      { path: '/student/profile', element: p('My Profile') },
    ]
  },

  // Parent
  {
    element: <AppShell />, children: [
      { path: '/parent', element: withSuspense(ParentDashboard) },
      { path: '/parent/performance', element: p('Performance Report') },
      { path: '/parent/attendance', element: withSuspense(AttendanceModule, { role: 'parent' }) },
      { path: '/parent/initiatives', element: withSuspense(InitiativesModule, { role: 'parent' }) },
      { path: '/parent/competitions', element: withSuspense(CompetitionsModule, { role: 'parent' }) },
      { path: '/parent/fees', element: p('Fee Payment') },
      { path: '/parent/homework', element: p('Homework Monitor') },
      { path: '/parent/chat', element: p('Chat with Teacher') },
      { path: '/parent/notices', element: p('School Notices') },
      { path: '/parent/events', element: p('Events & Gallery') },
      { path: '/parent/child', element: p('Child Profile') },
    ]
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
