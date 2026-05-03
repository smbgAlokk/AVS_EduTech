import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  selectedSchoolId: string | null;
  setSelectedSchoolId: (id: string | null) => void;
}

const mockUsers: Record<UserRole, User> = {
  'super-admin': {
    id: 'sa-001',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@avseduconnect.com',
    role: 'super-admin',
    designation: 'Head Office Administrator',
    avatar: '',
  },
  principal: {
    id: 'pr-001',
    name: 'Dr. Priya Mehta',
    email: 'priya.mehta@avs-delhi.edu.in',
    role: 'principal',
    school: 'AVS Delhi Public School',
    schoolId: 'sch-001',
    designation: 'Principal',
    avatar: '',
  },
  teacher: {
    id: 'tr-001',
    name: 'Mrs. Anita Sharma',
    email: 'anita.sharma@avs-delhi.edu.in',
    role: 'teacher',
    school: 'AVS Delhi Public School',
    schoolId: 'sch-001',
    designation: 'PGT Mathematics',
    avatar: '',
  },
  student: {
    id: 'st-001',
    name: 'Aarav Patel',
    email: 'aarav.patel@avs-delhi.edu.in',
    role: 'student',
    school: 'AVS Delhi Public School',
    schoolId: 'sch-001',
    designation: 'Class 10-A',
    avatar: '',
  },
  parent: {
    id: 'pa-001',
    name: 'Mr. Vikram Patel',
    email: 'vikram.patel@gmail.com',
    role: 'parent',
    school: 'AVS Delhi Public School',
    schoolId: 'sch-001',
    designation: 'Parent of Aarav Patel',
    avatar: '',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  const login = useCallback((role: UserRole) => {
    const mockUser = mockUsers[role];
    setUser(mockUser);
    if (mockUser.schoolId) {
      setSelectedSchoolId(mockUser.schoolId);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSelectedSchoolId(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const mockUser = mockUsers[role];
    setUser(mockUser);
    if (mockUser.schoolId) {
      setSelectedSchoolId(mockUser.schoolId);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        selectedSchoolId,
        setSelectedSchoolId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { mockUsers };
