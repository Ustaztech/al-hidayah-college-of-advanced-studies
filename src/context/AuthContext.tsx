import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, UserAccount } from '../services/db';
import { StudentRecord, ApplicationRecord, UserRole, InstitutionalRole } from '../types';
import { Permission, ROLE_PERMISSIONS, checkRolePermission, getRoleMetadata } from '../services/rbac';
import { logAuditEvent } from '../services/audit';

export type { UserRole, InstitutionalRole, Permission };

interface AuthContextType {
  currentUser: UserAccount | null;
  role: UserRole;
  permissions: Permission[];
  roleMetadata: ReturnType<typeof getRoleMetadata>;
  studentData: StudentRecord | null;
  applicantData: ApplicationRecord | null;
  login: (emailOrId: string, pass: string) => Promise<UserAccount>;
  register: (name: string, email: string, pass: string, role: 'APPLICANT' | 'STUDENT' | 'STAFF', subRole?: any, phone?: string) => Promise<void>;
  switchDemoView: (type: InstitutionalRole | 'BURSAR') => void;
  logout: () => void;
  authError: string;
  setAuthError: (err: string) => void;
  refreshUserData: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAllRoles: (roles: UserRole[]) => boolean;
  isAuthorized: (allowedRoles?: UserRole[], requiredPermission?: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => db.getSession());
  const [authError, setAuthError] = useState<string>('');
  const [studentData, setStudentData] = useState<StudentRecord | null>(null);
  const [applicantData, setApplicantData] = useState<ApplicationRecord | null>(null);

  const computeEffectiveRole = useCallback((): UserRole => {
    if (!currentUser) return 'GUEST';
    if (currentUser.role === 'STAFF') return (currentUser.subRole as UserRole) || 'SUPER_ADMIN';
    return (currentUser.role as UserRole) || 'GUEST';
  }, [currentUser]);

  const effectiveRole = computeEffectiveRole();

  const permissions: Permission[] = React.useMemo(() => {
    if (effectiveRole === 'GUEST') return [];
    if (effectiveRole === 'SUPER_ADMIN') return ROLE_PERMISSIONS.SUPER_ADMIN;
    return ROLE_PERMISSIONS[effectiveRole as InstitutionalRole | 'BURSAR'] || [];
  }, [effectiveRole]);

  const roleMetadata = React.useMemo(() => {
    return getRoleMetadata(effectiveRole);
  }, [effectiveRole]);

  const refreshUserData = useCallback(() => {
    const session = db.getSession();
    setCurrentUser(session);

    if (session) {
      if (session.role === 'STUDENT' || session.matricNumber) {
        const students = db.getStudents();
        const found = students.find((s: StudentRecord) => 
          s.email.toLowerCase() === session.email.toLowerCase() || 
          (session.matricNumber && s.matric_number.toLowerCase() === session.matricNumber.toLowerCase())
        ) || null;
        setStudentData(found);
      } else {
        setStudentData(null);
      }

      if (session.role === 'APPLICANT' || session.refNumber) {
        const apps = db.getApplications();
        const found = apps.find((a: ApplicationRecord) => 
          a.email.toLowerCase() === session.email.toLowerCase() || 
          (session.refNumber && a.ref_number.toLowerCase() === session.refNumber.toLowerCase())
        ) || null;
        setApplicantData(found);
      } else {
        setApplicantData(null);
      }
    } else {
      setStudentData(null);
      setApplicantData(null);
    }
  }, []);

  // Sync across tabs and on mount
  useEffect(() => {
    refreshUserData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ahcas_v4_admin_only_session') {
        refreshUserData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshUserData]);

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (effectiveRole === 'SUPER_ADMIN') return true;
    return checkRolePermission(effectiveRole, permission);
  }, [effectiveRole]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    if (effectiveRole === 'SUPER_ADMIN') return true;
    return roles.includes(effectiveRole);
  }, [effectiveRole]);

  const hasAllRoles = useCallback((roles: UserRole[]): boolean => {
    if (effectiveRole === 'SUPER_ADMIN') return true;
    return roles.every(r => r === effectiveRole);
  }, [effectiveRole]);

  const isAuthorized = useCallback((allowedRoles?: UserRole[], requiredPermission?: Permission): boolean => {
    if (effectiveRole === 'SUPER_ADMIN') return true;
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(effectiveRole)) {
      return false;
    }
    if (requiredPermission && !hasPermission(requiredPermission)) {
      return false;
    }
    return true;
  }, [effectiveRole, hasPermission]);

  const login = async (emailOrId: string, pass: string): Promise<UserAccount> => {
    setAuthError('');
    try {
      const user = db.authenticateUser(emailOrId, pass);
      db.setSession(user);
      setCurrentUser(user);
      refreshUserData();
      await logAuditEvent(
        user.email,
        user.subRole || user.role,
        'USER_LOGIN',
        `User ${user.name} logged into digital campus.`
      );
      return user;
    } catch (err: any) {
      setAuthError(err.message || 'Login failed.');
      throw err;
    }
  };

  const register = async (name: string, email: string, pass: string, role: 'APPLICANT' | 'STUDENT' | 'STAFF', subRole?: any, phone?: string) => {
    setAuthError('');
    try {
      const newUser = db.registerUser(name, email, pass, role, subRole, phone);
      db.setSession(newUser);
      setCurrentUser(newUser);
      refreshUserData();
      await logAuditEvent(
        newUser.email,
        newUser.subRole || newUser.role,
        'USER_REGISTER',
        `New account created for ${newUser.name}.`
      );
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const switchDemoView = (type: InstitutionalRole | 'BURSAR') => {
    const users = db.getUsers();
    let target: UserAccount | undefined;

    if (type === 'STUDENT') {
      target = users.find((u: UserAccount) => u.role === 'STUDENT' || u.email === 'student@alhidayahcollege.com.ng');
    } else if (type === 'APPLICANT') {
      target = users.find((u: UserAccount) => u.role === 'APPLICANT' || u.email === 'applicant@alhidayahcollege.com.ng');
    } else if (type === 'BURSAR' || type === 'FINANCE_OFFICER') {
      target = users.find((u: UserAccount) => u.role === 'FINANCE_OFFICER' || u.subRole === 'FINANCE_OFFICER' || u.subRole === 'BURSAR');
    } else {
      target = users.find((u: UserAccount) => u.role === type || u.subRole === type);
    }

    if (!target) {
      // Create verified ad-hoc demo user
      target = {
        id: `usr-demo-${type.toLowerCase()}`,
        name: `${type.replace(/_/g, ' ')} Officer`,
        email: `${type.toLowerCase()}@alhidayahcollege.com.ng`,
        passwordHash: 'demo_pass',
        role: type as any,
        subRole: type as any,
        phone: '08056350078',
        createdAt: new Date().toISOString()
      };
    }

    if (target) {
      db.setSession(target);
      setCurrentUser(target);
      refreshUserData();
      logAuditEvent(
        target.email,
        target.subRole || target.role,
        'ROLE_SWITCH',
        `Switched active session view to: ${target.name} (${type})`
      );
    }
  };

  const logout = () => {
    if (currentUser) {
      logAuditEvent(
        currentUser.email,
        currentUser.subRole || currentUser.role,
        'USER_LOGOUT',
        `User ${currentUser.name} logged out.`
      );
    }
    db.setSession(null);
    setCurrentUser(null);
    setStudentData(null);
    setApplicantData(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      role: effectiveRole,
      permissions,
      roleMetadata,
      studentData,
      applicantData,
      login,
      register,
      switchDemoView,
      logout,
      authError,
      setAuthError,
      refreshUserData,
      hasPermission,
      hasAnyRole,
      hasAllRoles,
      isAuthorized
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
