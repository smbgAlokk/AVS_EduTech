import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Search, Bell, Sun, Moon, Menu, ChevronDown, X,
  Crown, Building2, BookOpen, GraduationCap, Users, CalendarDays
} from 'lucide-react';
import type { UserRole } from '../../types';
import './Header.css';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

const roleConfig: { role: UserRole; label: string; desc: string; icon: React.ElementType }[] = [
  { role: 'super-admin', label: 'Super Admin', desc: 'Head Office', icon: Crown },
  { role: 'principal', label: 'Principal', desc: 'School Admin', icon: Building2 },
  { role: 'teacher', label: 'Teacher', desc: 'Classroom', icon: BookOpen },
  { role: 'student', label: 'Student', desc: 'Learning', icon: GraduationCap },
  { role: 'parent', label: 'Parent', desc: 'My Child', icon: Users },
];

const rolePaths: Record<UserRole, string> = {
  'super-admin': '/super-admin',
  principal: '/principal',
  teacher: '/teacher',
  student: '/student',
  parent: '/parent',
};

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const { user, switchRole, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search: Ctrl/Cmd + K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setShowRoleDropdown(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleRoleSwitch = useCallback((newRole: UserRole) => {
    switchRole(newRole);
    setShowRoleDropdown(false);
    navigate(rolePaths[newRole]);
  }, [switchRole, navigate]);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const notificationCount = 5; // TODO: replace with real count from API

  return (
    <header className="header" role="banner">
      {/* Left Section */}
      <div className="header-left">
        <button
          className="header-mobile-toggle"
          onClick={onMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} />
        </button>

        {/* Search Icon + Expandable Search */}
        <div className="header-search-wrapper" ref={searchRef}>
          <button
            className={`header-icon-btn header-search-trigger ${searchOpen ? 'active' : ''}`}
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
            title="Search (Ctrl+K)"
          >
            <Search size={18} />
          </button>

          {searchOpen && (
            <div className="header-search-popover">
              <div className="header-search-popover-inner">
                <Search size={16} className="header-search-popover-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="header-search-popover-input"
                  placeholder="Search students, teachers, classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search across the platform"
                />
                <button
                  className="header-search-close"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  aria-label="Close search"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="header-search-hint">
                <kbd>Esc</kbd> to close
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Academic Year Pill */}
        <button className="header-year" aria-label="Academic Year">
          <CalendarDays size={14} />
          <span>AY 2025-26</span>
        </button>

        {/* Divider */}
        <div className="header-divider" aria-hidden="true" />

        {/* Theme Toggle */}
        <button
          className="header-icon-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="header-icon-btn header-notification-btn" aria-label="Notifications">
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="header-notification-badge" aria-label={`${notificationCount} notifications`}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="header-divider" aria-hidden="true" />

        {/* User Profile + Role Switcher */}
        <div className="header-role-switcher" ref={dropdownRef}>
          <button
            className={`header-profile-btn ${showRoleDropdown ? 'active' : ''}`}
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            aria-expanded={showRoleDropdown}
            aria-haspopup="true"
            aria-label="User menu"
          >
            <div className="header-profile-info">
              <span className="header-profile-name">{user.name}</span>
              <span className="header-profile-role">{user.designation}</span>
            </div>
            <div className="header-profile-avatar">{initials}</div>
            <ChevronDown
              size={14}
              className={`header-profile-chevron ${showRoleDropdown ? 'rotated' : ''}`}
            />
          </button>

          {showRoleDropdown && (
            <div className="role-dropdown" role="menu">
              <div className="role-dropdown-title">Switch Role</div>
              {roleConfig.map(({ role: r, label, desc, icon: Icon }) => (
                <button
                  key={r}
                  className={`role-dropdown-item ${role === r ? 'active' : ''}`}
                  onClick={() => handleRoleSwitch(r)}
                  role="menuitem"
                  aria-current={role === r ? 'true' : undefined}
                >
                  <div className="role-dropdown-icon">
                    <Icon size={16} />
                  </div>
                  <div className="role-dropdown-text">
                    <div className="role-dropdown-label">{label}</div>
                    <div className="role-dropdown-desc">{desc}</div>
                  </div>
                  {role === r && (
                    <div className="role-dropdown-check" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
