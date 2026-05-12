import { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, School, Users, GraduationCap, BookOpen, ClipboardCheck,
  CreditCard, Calendar, UserCog, Building2, Megaphone, Image, BarChart3,
  Trophy, Bell, Settings, MessageSquare, BookOpenCheck, FileText,
  PenTool, Clock, Folder, Activity, Briefcase, ChevronLeft, ChevronRight,
  LogOut, Wallet, Wrench, Lightbulb, Star, Target, Heart, ChevronDown,
  User, X
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
          { label: 'Initiatives', path: '/principal/initiatives', icon: 'Lightbulb' },
          { label: 'Competitions', path: '/principal/competitions', icon: 'Trophy' },
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
          { label: 'Initiatives', path: '/teacher/initiatives', icon: 'Lightbulb' },
          { label: 'Competitions', path: '/teacher/competitions', icon: 'Trophy' },
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
          { label: 'My Attendance', path: '/student/attendance', icon: 'ClipboardCheck' },
          { label: 'Timetable', path: '/student/timetable', icon: 'Clock' },
          { label: 'Assignments', path: '/student/assignments', icon: 'BookOpen' },
          { label: 'Results', path: '/student/results', icon: 'BarChart3' },
          { label: 'Study Materials', path: '/student/materials', icon: 'Folder' },
          { label: 'Activities', path: '/student/activities', icon: 'Activity', badge: 2 },
          { label: 'Initiatives', path: '/student/initiatives', icon: 'Lightbulb' },
          { label: 'Competitions', path: '/student/competitions', icon: 'Trophy' },
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
          { label: 'Initiatives', path: '/parent/initiatives', icon: 'Lightbulb' },
          { label: 'Competitions', path: '/parent/competitions', icon: 'Trophy' },
          { label: 'Events', path: '/parent/events', icon: 'Calendar' },
          { label: 'Child Profile', path: '/parent/child', icon: 'Heart' },
        ],
      },
    ],
  },
};

/** Role-specific profile routes */
const profilePaths: Record<UserRole, string | null> = {
  'super-admin': '/super-admin/settings',
  principal: null,
  teacher: '/teacher/profile',
  student: '/student/profile',
  parent: '/parent/child',
};

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close user menu on route change
  useEffect(() => {
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    setUserMenuOpen(false);
    logout();
  }, [logout]);

  const handleProfileClick = useCallback(() => {
    if (!user) return;
    const profilePath = profilePaths[user.role];
    if (profilePath) {
      setUserMenuOpen(false);
      onMobileClose();
      navigate(profilePath);
    }
  }, [user, navigate, onMobileClose]);

  if (!user) return null;

  const config = navConfig[user.role];
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const profilePath = profilePaths[user.role];
  const isExpanded = !collapsed || mobileOpen;

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} onClick={onMobileClose} />

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">AE</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-name">AVS EduConnect</span>
            <span className="sidebar-logo-tagline">School Management</span>
          </div>
          {mobileOpen && (
            <button
              className="sidebar-mobile-close"
              onClick={onMobileClose}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {config.sections.map((section, sIdx) => (
            <div key={sIdx}>
              {section.label && <div className="sidebar-section-label">{section.label}</div>}
              {section.items.map(item => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isBaseRolePath = ['/super-admin', '/principal', '/teacher', '/student', '/parent'].includes(item.path);
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={isBaseRolePath}
                    className={({ isActive }) => {
                      // Custom strict matching in addition to router's active state
                      const customIsActive = isBaseRolePath
                        ? location.pathname === item.path || location.pathname === `${item.path}/`
                        : location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(`${item.path}/`));
                        
                      return `sidebar-link ${isActive || customIsActive ? 'active' : ''}`;
                    }}
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

        {/* User Profile Footer */}
        <div className="sidebar-footer" ref={userMenuRef}>
          {/* Upward Dropdown Menu */}
          {userMenuOpen && isExpanded && (
            <div className="sidebar-user-menu">
              <div className="sidebar-user-menu-header">
                <p className="sidebar-user-menu-name">{user.name}</p>
                <p className="sidebar-user-menu-email">{user.email || user.designation}</p>
              </div>

              <div className="sidebar-user-menu-actions">
                {profilePath && (
                  <button
                    className="sidebar-user-menu-item"
                    onClick={handleProfileClick}
                    type="button"
                  >
                    <div className="sidebar-user-menu-item-icon">
                      <User size={14} />
                    </div>
                    <div className="sidebar-user-menu-item-text">
                      <span className="sidebar-user-menu-item-label">My Profile</span>
                      <span className="sidebar-user-menu-item-desc">View details</span>
                    </div>
                  </button>
                )}

                <button
                  className="sidebar-user-menu-item sidebar-user-menu-item--danger"
                  onClick={handleLogout}
                  type="button"
                >
                  <div className="sidebar-user-menu-item-icon sidebar-user-menu-item-icon--danger">
                    <LogOut size={14} />
                  </div>
                  <div className="sidebar-user-menu-item-text">
                    <span className="sidebar-user-menu-item-label">Sign Out</span>
                    <span className="sidebar-user-menu-item-desc">End session</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* User Card */}
          <div
            className={`sidebar-user ${userMenuOpen ? 'menu-open' : ''}`}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            role="button"
            tabIndex={0}
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setUserMenuOpen(!userMenuOpen);
              }
            }}
          >
            <div className="sidebar-user-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">{user.designation}</div>
            </div>
            {isExpanded && (
              <ChevronDown
                size={14}
                className={`sidebar-user-chevron ${userMenuOpen ? 'rotated' : ''}`}
              />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
