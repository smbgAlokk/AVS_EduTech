import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Crown, Building2, BookOpen, GraduationCap, Users,
  Eye, EyeOff, Sun, Moon, ArrowRight, School
} from 'lucide-react';
import type { UserRole } from '../../types';
import './Login.css';

const roles: { role: UserRole; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { role: 'super-admin', label: 'Super Admin', desc: 'Head Office Control Center', icon: Crown, color: 'var(--primary-500)' },
  { role: 'principal', label: 'Principal', desc: 'School Management Hub', icon: Building2, color: 'var(--accent-500)' },
  { role: 'teacher', label: 'Teacher', desc: 'Classroom Operations', icon: BookOpen, color: '#3B82F6' },
  { role: 'student', label: 'Student', desc: 'My Learning Space', icon: GraduationCap, color: '#F59E0B' },
  { role: 'parent', label: 'Parent', desc: "My Child's Progress", icon: Users, color: '#8B5CF6' },
];

const rolePaths: Record<UserRole, string> = {
  'super-admin': '/super-admin',
  principal: '/principal',
  teacher: '/teacher',
  student: '/student',
  parent: '/parent',
};

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null);

  const handleRoleLogin = (role: UserRole) => {
    login(role);
    navigate(rolePaths[role]);
  };

  return (
    <div className="login-page">
      {/* Theme toggle */}
      <button className="login-theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Left Panel — Hero */}
      <div className="login-hero">
        <div className="login-hero-bg" />
        <div className="login-hero-content">
          <div className="login-hero-badge">
            <School size={14} />
            <span>Trusted by 45+ Schools</span>
          </div>
          <h1 className="login-hero-title">
            Empowering Education,
            <br />
            <span className="gradient-text">One Platform.</span>
          </h1>
          <p className="login-hero-subtitle">
            End-to-end school management for franchises.
            From attendance to analytics, all under one roof.
          </p>

          <div className="login-hero-stats">
            <div className="login-hero-stat">
              <span className="login-hero-stat-value">45+</span>
              <span className="login-hero-stat-label">Schools</span>
            </div>
            <div className="login-hero-stat-divider" />
            <div className="login-hero-stat">
              <span className="login-hero-stat-value">22,500+</span>
              <span className="login-hero-stat-label">Users</span>
            </div>
            <div className="login-hero-stat-divider" />
            <div className="login-hero-stat">
              <span className="login-hero-stat-value">5</span>
              <span className="login-hero-stat-label">Roles</span>
            </div>
            <div className="login-hero-stat-divider" />
            <div className="login-hero-stat">
              <span className="login-hero-stat-value">99.9%</span>
              <span className="login-hero-stat-label">Uptime</span>
            </div>
          </div>

          <div className="login-hero-features">
            <div className="login-hero-feature">✓ Multi-Tenant Architecture</div>
            <div className="login-hero-feature">✓ DPDPA 2023 Compliant</div>
            <div className="login-hero-feature">✓ Real-time Analytics</div>
            <div className="login-hero-feature">✓ Razorpay Integration</div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="login-hero-orb login-hero-orb--1" />
        <div className="login-hero-orb login-hero-orb--2" />
        <div className="login-hero-orb login-hero-orb--3" />
      </div>

      {/* Right Panel — Login Form */}
      <div className="login-form-panel">
        <div className="login-form-container">
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-icon">AE</div>
            <div>
              <div className="login-logo-name">AVS EduConnect</div>
              <div className="login-logo-tagline">School Management Platform</div>
            </div>
          </div>

          {/* Form */}
          <div className="login-form">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-desc">Sign in to your account to continue</p>

            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                type="email"
                className="login-input"
                placeholder="admin@avseduconnect.com"
                defaultValue="admin@avseduconnect.com"
              />
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••"
                  defaultValue="password123"
                />
                <button className="login-input-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a href="#" className="login-forgot">Forgot password?</a>
            </div>

            <button className="login-submit" onClick={() => handleRoleLogin('super-admin')}>
              Sign In
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Divider */}
          <div className="login-divider">
            <span>Quick Demo Access</span>
          </div>

          {/* Role Cards */}
          <div className="login-roles">
            {roles.map(({ role, label, desc, icon: Icon, color }) => (
              <button
                key={role}
                className={`login-role-card ${hoveredRole === role ? 'hovered' : ''}`}
                onClick={() => handleRoleLogin(role)}
                onMouseEnter={() => setHoveredRole(role)}
                onMouseLeave={() => setHoveredRole(null)}
                style={{ '--role-color': color } as React.CSSProperties}
              >
                <div className="login-role-icon">
                  <Icon size={18} />
                </div>
                <div className="login-role-info">
                  <span className="login-role-name">{label}</span>
                  <span className="login-role-desc">{desc}</span>
                </div>
                <ArrowRight size={14} className="login-role-arrow" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
