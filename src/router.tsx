import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Login from './pages/auth/Login';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import SchoolsDirectory from './pages/super-admin/SchoolsDirectory';
import StudentDatabase from './pages/super-admin/StudentDatabase';
import PrincipalDashboard from './pages/principal/PrincipalDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import ComingSoon from './components/ui/ComingSoon';

const p = (title: string) => <ComingSoon title={title} />;

export const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/login', element: <Login /> },

  // Super Admin
  { element: <AppShell />, children: [
    { path: '/super-admin', element: <SuperAdminDashboard /> },
    { path: '/super-admin/schools', element: <SchoolsDirectory /> },
    { path: '/super-admin/schools/:id', element: p('School Details') },
    { path: '/super-admin/students', element: <StudentDatabase /> },
    { path: '/super-admin/finance', element: p('Financial Reports') },
    { path: '/super-admin/attendance', element: p('Attendance Overview') },
    { path: '/super-admin/sdf', element: p('SDF Fund Management') },
    { path: '/super-admin/development', element: p('Development Works') },
    { path: '/super-admin/initiatives', element: p('Initiatives') },
    { path: '/super-admin/competitions', element: p('Competitions') },
    { path: '/super-admin/notifications', element: p('Notifications') },
    { path: '/super-admin/settings', element: p('Settings') },
  ]},

  // Principal
  { element: <AppShell />, children: [
    { path: '/principal', element: <PrincipalDashboard /> },
    { path: '/principal/students', element: p('Student Management') },
    { path: '/principal/students/:id', element: p('Student Profile') },
    { path: '/principal/teachers', element: p('Teacher Management') },
    { path: '/principal/attendance', element: p('Attendance Monitor') },
    { path: '/principal/fees', element: p('Fee Management') },
    { path: '/principal/exams', element: p('Exam Schedule') },
    { path: '/principal/allotment', element: p('Class Allotment') },
    { path: '/principal/accounts', element: p('Accounts & Expenses') },
    { path: '/principal/sdf', element: p('SDF Fund') },
    { path: '/principal/development', element: p('Development Works') },
    { path: '/principal/announcements', element: p('Announcements') },
    { path: '/principal/gallery', element: p('Photo Gallery') },
    { path: '/principal/reports', element: p('Reports') },
  ]},

  // Teacher
  { element: <AppShell />, children: [
    { path: '/teacher', element: <TeacherDashboard /> },
    { path: '/teacher/attendance', element: p('Mark Attendance') },
    { path: '/teacher/homework', element: p('Homework & Assignments') },
    { path: '/teacher/marks', element: p('Marks Entry') },
    { path: '/teacher/timetable', element: p('My Timetable') },
    { path: '/teacher/materials', element: p('Study Materials') },
    { path: '/teacher/activities', element: p('Student Activities') },
    { path: '/teacher/chat', element: p('Parent Chat') },
    { path: '/teacher/tests', element: p('Weekly Tests') },
    { path: '/teacher/profile', element: p('My Profile') },
  ]},

  // Student
  { element: <AppShell />, children: [
    { path: '/student', element: <StudentDashboard /> },
    { path: '/student/timetable', element: p('My Timetable') },
    { path: '/student/assignments', element: p('Assignments') },
    { path: '/student/results', element: p('Results & Marks') },
    { path: '/student/materials', element: p('Study Materials') },
    { path: '/student/activities', element: p('Activities') },
    { path: '/student/chat', element: p('Chat with Teacher') },
    { path: '/student/profile', element: p('My Profile') },
  ]},

  // Parent
  { element: <AppShell />, children: [
    { path: '/parent', element: <ParentDashboard /> },
    { path: '/parent/performance', element: p('Performance Report') },
    { path: '/parent/attendance', element: p('Attendance Tracking') },
    { path: '/parent/fees', element: p('Fee Payment') },
    { path: '/parent/homework', element: p('Homework Monitor') },
    { path: '/parent/chat', element: p('Chat with Teacher') },
    { path: '/parent/notices', element: p('School Notices') },
    { path: '/parent/events', element: p('Events & Gallery') },
    { path: '/parent/child', element: p('Child Profile') },
  ]},

  { path: '*', element: <Navigate to="/" replace /> },
]);
