import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Crown, Building2, BookOpen, GraduationCap, Users,
  Eye, EyeOff, Sun, Moon, ArrowRight, School, Mail, Lock, CheckCircle2, Shield
} from 'lucide-react';
import type { UserRole } from '../../types';
import './Login.css';

const roles: { role: UserRole; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { role: 'super-admin', label: 'Super Admin', desc: 'HQ Control Center', icon: Crown, color: 'var(--primary-500)' },
  { role: 'principal', label: 'Principal', desc: 'School Management', icon: Building2, color: 'var(--accent-500)' },
  { role: 'teacher', label: 'Teacher', desc: 'Classroom Operations', icon: BookOpen, color: '#3B82F6' },
  { role: 'student', label: 'Student', desc: 'My Learning Space', icon: GraduationCap, color: '#F59E0B' },
  { role: 'parent', label: 'Parent', desc: "Child's Progress", icon: Users, color: '#8B5CF6' },
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
        <div className="login-hero-bg">
          <div className="mesh-gradient-1"></div>
          <div className="mesh-gradient-2"></div>
        </div>
        
        <div className="login-hero-content">
          <div className="login-hero-badge">
            <School size={14} />
            <span>Trusted by 45+ Institutions</span>
          </div>
          
          <h1 className="login-hero-title">
            The Operating System for
            <br />
            <span className="gradient-text">Modern Education.</span>
          </h1>
          
          <p className="login-hero-subtitle">
            An enterprise-grade platform unifying administration, academics, and communication across your entire school network.
          </p>

          <div className="login-hero-glass-card">
            <div className="glass-stats-grid">
              <div className="glass-stat">
                <div className="glass-stat-value">45+</div>
                <div className="glass-stat-label">Campuses</div>
              </div>
              <div className="glass-stat-divider" />
              <div className="glass-stat">
                <div className="glass-stat-value">22k+</div>
                <div className="glass-stat-label">Active Users</div>
              </div>
              <div className="glass-stat-divider" />
              <div className="glass-stat">
                <div className="glass-stat-value">99.9%</div>
                <div className="glass-stat-label">Uptime SLA</div>
              </div>
            </div>
            
            <div className="glass-features-list">
              <div className="glass-feature"><CheckCircle2 size={16} className="feature-icon" /> Multi-Tenant Architecture</div>
              <div className="glass-feature"><Shield size={16} className="feature-icon" /> DPDPA 2023 Compliant</div>
              <div className="glass-feature"><CheckCircle2 size={16} className="feature-icon" /> Role-Based Access Control</div>
              <div className="glass-feature"><CheckCircle2 size={16} className="feature-icon" /> Real-time Analytics Engine</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="login-form-panel">
        <div className="login-form-container">
          
          <div className="login-header-group">
            <div className="login-logo-icon">AE</div>
            <div>
              <h2 className="login-welcome-title">Welcome back</h2>
              <p className="login-welcome-desc">Enter your credentials to access your workspace</p>
            </div>
          </div>

          <div className="login-form">
            <div className="login-field">
              <label className="login-label">Work Email</label>
              <div className="login-input-wrapper">
                <div className="login-input-icon"><Mail size={18} /></div>
                <input
                  type="email"
                  className="login-input has-icon"
                  placeholder="name@school.edu.in"
                  defaultValue="admin@avseduconnect.com"
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <div className="login-input-icon"><Lock size={18} /></div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input has-icon"
                  placeholder="••••••••"
                  defaultValue="password123"
                />
                <button className="login-input-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-checkbox">
                <input type="checkbox" defaultChecked />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">Keep me signed in</span>
              </label>
              <a href="#" className="login-forgot">Forgot password?</a>
            </div>

            <button className="login-submit" onClick={() => handleRoleLogin('super-admin')}>
              <span>Sign In to Workspace</span>
              <ArrowRight size={18} className="submit-arrow" />
            </button>
          </div>

          <div className="login-divider">
            <span>Or securely demo as</span>
          </div>

          <div className="login-roles-grid">
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
                  <Icon size={20} />
                </div>
                <div className="login-role-info">
                  <span className="login-role-name">{label}</span>
                  <span className="login-role-desc">{desc}</span>
                </div>
                <div className="login-role-hover-arrow">
                   <ArrowRight size={16} />
                </div>
              </button>
            ))}
          </div>
          
          <div className="login-footer">
             &copy; {new Date().getFullYear()} AVS EduConnect. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
