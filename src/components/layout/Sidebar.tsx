import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, School, Users, GraduationCap, BookOpen, ClipboardCheck,
  CreditCard, Calendar, UserCog, Building2, Megaphone, Image, BarChart3,
  Trophy, Bell, Settings, MessageSquare, BookOpenCheck, FileText,
  PenTool, Clock, Folder, Activity, Briefcase, ChevronLeft, ChevronRight,
  LogOut, Wallet, Wrench, Lightbulb, Star, Target, Heart
} from 'lucide-react';
import type { UserRole, NavItem } from '../../types';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, School, Users, GraduationCap, BookOpen, ClipboardCheck,
  CreditCard, Calendar, UserCog, Building2, Megaphone, Image, BarChart3,
  Trophy, Bell, Settings, MessageSquare, BookOpenCheck, FileText,
  PenTool, Clock, Folder, Activity, Briefcase, Wallet, Wrench,
  Lightbulb, Star, Target, Heart,
};

const navConfig: Record<UserRole, { sections: { label?: string; items: NavItem[] }[] }> = {
  'super-admin': {
    sections: [
      {
        label: 'Overview',
        items: [
          { label: 'Dashboard', path: '/super-admin', icon: 'LayoutDashboard' },
          { label: 'Schools', path: '/super-admin/schools', icon: 'School' },
          { label: 'Student Database', path: '/super-admin/students', icon: 'GraduationCap' },
        ],
      },
      {
        label: 'Analytics',
        items: [
          { label: 'Financial Reports', path: '/super-admin/finance', icon: 'CreditCard' },
          { label: 'Attendance', path: '/super-admin/attendance', icon: 'ClipboardCheck' },
          { label: 'SDF Fund', path: '/super-admin/sdf', icon: 'Wallet' },
        ],
      },
      {
        label: 'Management',
        items: [
          { label: 'Development', path: '/super-admin/development', icon: 'Wrench' },
          { label: 'Initiatives', path: '/super-admin/initiatives', icon: 'Lightbulb' },
          { label: 'Competitions', path: '/super-admin/competitions', icon: 'Trophy', badge: 3 },
          { label: 'Notifications', path: '/super-admin/notifications', icon: 'Bell', badge: 12 },
        ],
      },
      {
        items: [
          { label: 'Settings', path: '/super-admin/settings', icon: 'Settings' },
        ],
      },
    ],
  },
  principal: {
    sections: [
      {
        label: 'Overview',
        items: [
          { label: 'Dashboard', path: '/principal', icon: 'LayoutDashboard' },
          { label: 'Students', path: '/principal/students', icon: 'GraduationCap' },
          { label: 'Teachers', path: '/principal/teachers', icon: 'Users' },
        ],
      },
      {
        label: 'Academics',
        items: [
          { label: 'Attendance', path: '/principal/attendance', icon: 'ClipboardCheck' },
          { label: 'Exams', path: '/principal/exams', icon: 'Calendar' },
          { label: 'Class Allotment', path: '/principal/allotment', icon: 'UserCog' },
        ],
      },
      {
        label: 'Finance',
        items: [
          { label: 'Fee Management', path: '/principal/fees', icon: 'CreditCard' },
          { label: 'Accounts', path: '/principal/accounts', icon: 'Wallet' },
          { label: 'SDF Fund', path: '/principal/sdf', icon: 'Briefcase' },
        ],
      },
      {
        label: 'Infrastructure',
        items: [
          { label: 'Development', path: '/principal/development', icon: 'Wrench' },
          { label: 'Announcements', path: '/principal/announcements', icon: 'Megaphone', badge: 2 },
          { label: 'Gallery', path: '/principal/gallery', icon: 'Image' },
          { label: 'Reports', path: '/principal/reports', icon: 'BarChart3' },
        ],
      },
    ],
  },
  teacher: {
    sections: [
      {
        items: [
          { label: 'Dashboard', path: '/teacher', icon: 'LayoutDashboard' },
          { label: 'Attendance', path: '/teacher/attendance', icon: 'ClipboardCheck' },
          { label: 'Homework', path: '/teacher/homework', icon: 'BookOpen', badge: 5 },
          { label: 'Marks Entry', path: '/teacher/marks', icon: 'PenTool' },
          { label: 'Timetable', path: '/teacher/timetable', icon: 'Clock' },
          { label: 'Study Materials', path: '/teacher/materials', icon: 'Folder' },
          { label: 'Activities', path: '/teacher/activities', icon: 'Activity' },
          { label: 'Chat', path: '/teacher/chat', icon: 'MessageSquare', badge: 3 },
          { label: 'Weekly Tests', path: '/teacher/tests', icon: 'FileText' },
          { label: 'My Profile', path: '/teacher/profile', icon: 'UserCog' },
        ],
      },
    ],
  },
  student: {
    sections: [
      {
        items: [
          { label: 'Dashboard', path: '/student', icon: 'LayoutDashboard' },
          { label: 'Timetable', path: '/student/timetable', icon: 'Clock' },
          { label: 'Assignments', path: '/student/assignments', icon: 'BookOpen' },
          { label: 'Results', path: '/student/results', icon: 'BarChart3' },
          { label: 'Study Materials', path: '/student/materials', icon: 'Folder' },
          { label: 'Activities', path: '/student/activities', icon: 'Activity', badge: 2 },
          { label: 'Chat', path: '/student/chat', icon: 'MessageSquare' },
          { label: 'My Profile', path: '/student/profile', icon: 'UserCog' },
        ],
      },
    ],
  },
  parent: {
    sections: [
      {
        items: [
          { label: 'Dashboard', path: '/parent', icon: 'LayoutDashboard' },
          { label: 'Performance', path: '/parent/performance', icon: 'BarChart3' },
          { label: 'Attendance', path: '/parent/attendance', icon: 'ClipboardCheck' },
          { label: 'Fee Payment', path: '/parent/fees', icon: 'CreditCard' },
          { label: 'Homework', path: '/parent/homework', icon: 'BookOpen' },
          { label: 'Chat', path: '/parent/chat', icon: 'MessageSquare', badge: 1 },
          { label: 'Notices', path: '/parent/notices', icon: 'Megaphone' },
          { label: 'Events', path: '/parent/events', icon: 'Calendar' },
          { label: 'Child Profile', path: '/parent/child', icon: 'Heart' },
        ],
      },
    ],
  },
};

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const config = navConfig[user.role];
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} onClick={onMobileClose} />

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">AE</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-name">AVS EduConnect</span>
            <span className="sidebar-logo-tagline">School Management</span>
          </div>
        </div>

        {/* Toggle */}
        <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {config.sections.map((section, sIdx) => (
            <div key={sIdx}>
              {section.label && <div className="sidebar-section-label">{section.label}</div>}
              {section.items.map(item => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isActive = location.pathname === item.path ||
                  (item.path !== '/' && item.path.length > 1 && location.pathname.startsWith(item.path + '/'));

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={onMobileClose}
                  >
                    <span className="sidebar-link-icon"><Icon size={18} /></span>
                    <span className="sidebar-link-label">{item.label}</span>
                    {item.badge && <span className="sidebar-link-badge">{item.badge}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={logout} title="Logout">
            <div className="sidebar-user-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">{user.designation}</div>
            </div>
            <LogOut size={16} style={{ flexShrink: 0, color: 'var(--text-tertiary)' }} className={collapsed ? '' : ''} />
          </div>
        </div>
      </aside>
    </>
  );
}
