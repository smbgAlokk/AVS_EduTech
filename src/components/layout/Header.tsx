import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Search, Bell, Sun, Moon, Menu, ChevronDown,
  Crown, Building2, BookOpen, GraduationCap, Users
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setShowRoleDropdown(false);
    navigate(rolePaths[newRole]);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-mobile-toggle" onClick={onMobileMenuToggle}>
          <Menu size={20} />
        </button>
        <div className="header-search">
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search students, teachers, classes..."
          />
          <span className="header-search-kbd">⌘K</span>
        </div>
      </div>

      <div className="header-right">
        {/* Academic Year */}
        <button className="header-year">
          <Calendar size={14} />
          <span>AY 2025-26</span>
        </button>

        {/* Theme Toggle */}
        <button className="header-theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="header-notification">
          <Bell size={18} />
          <span className="header-notification-badge">5</span>
        </button>

        {/* Role Switcher */}
        <div className="header-role-switcher" ref={dropdownRef}>
          <button className="header-role-btn" onClick={() => setShowRoleDropdown(!showRoleDropdown)}>
            <div className="header-role-avatar">{initials}</div>
            <div className="header-role-info">
              <div className="header-role-name">{user.name}</div>
              <div className="header-role-label">{user.designation}</div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
          </button>

          {showRoleDropdown && (
            <div className="role-dropdown">
              <div className="role-dropdown-title">Switch Role</div>
              {roleConfig.map(({ role: r, label, desc, icon: Icon }) => (
                <div
                  key={r}
                  className={`role-dropdown-item ${role === r ? 'active' : ''}`}
                  onClick={() => handleRoleSwitch(r)}
                >
                  <div className="role-dropdown-icon">
                    <Icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Calendar icon import needed
function Calendar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
