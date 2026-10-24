import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, UserAccount } from '../services/db';
import { StudentRecord, ApplicationRecord } from '../types';

export type UserRole = 'GUEST' | 'APPLICANT' | 'STUDENT' | 'LECTURER' | 'BURSAR' | 'REGISTRAR' | 'SUPER_ADMIN';

interface AuthContextType {
  currentUser: UserAccount | null;
  role: UserRole;
  studentData: StudentRecord | null;
  applicantData: ApplicationRecord | null;
  login: (emailOrId: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, role: 'APPLICANT' | 'STUDENT' | 'STAFF', subRole?: any, phone?: string) => Promise<void>;
  switchDemoView: (type: 'STUDENT' | 'APPLICANT' | 'REGISTRAR' | 'BURSAR' | 'SUPER_ADMIN') => void;
  logout: () => void;
  authError: string;
  setAuthError: (err: string) => void;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => db.getSession());
  const [authError, setAuthError] = useState<string>('');
  const [studentData, setStudentData] = useState<StudentRecord | null>(null);
  const [applicantData, setApplicantData] = useState<ApplicationRecord | null>(null);

  const refreshUserData = () => {
    const session = db.getSession();
    setCurrentUser(session);

    if (session) {
      if (session.role === 'STUDENT') {
        const students = db.getStudents();
        const found = students.find((s: StudentRecord) => s.email.toLowerCase() === session.email.toLowerCase() || s.matric_number === session.matricNumber) || students[0];
        setStudentData(found);
      } else if (session.role === 'APPLICANT') {
        const apps = db.getApplications();
        const found = apps.find((a: ApplicationRecord) => a.email.toLowerCase() === session.email.toLowerCase() || a.ref_number === session.refNumber) || apps[0];
        setApplicantData(found);
      }
    } else {
      setStudentData(null);
      setApplicantData(null);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, [currentUser?.id]);

  const login = async (emailOrId: string, pass: string) => {
    setAuthError('');
    try {
      const user = db.authenticateUser(emailOrId, pass);
      db.setSession(user);
      setCurrentUser(user);
      refreshUserData();
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
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const switchDemoView = (type: 'STUDENT' | 'APPLICANT' | 'REGISTRAR' | 'BURSAR' | 'SUPER_ADMIN') => {
    const users = db.getUsers();
    let target: UserAccount | undefined;

    if (type === 'STUDENT') {
      target = users.find((u: UserAccount) => u.role === 'STUDENT');
    } else if (type === 'APPLICANT') {
      target = users.find((u: UserAccount) => u.role === 'APPLICANT');
    } else {
      target = users.find((u: UserAccount) => u.role === 'STAFF' && u.subRole === type);
    }

    if (target) {
      db.setSession(target);
      setCurrentUser(target);
      refreshUserData();
    }
  };

  const logout = () => {
    db.setSession(null);
    setCurrentUser(null);
    setStudentData(null);
    setApplicantData(null);
  };

  const computeEffectiveRole = (): UserRole => {
    if (!currentUser) return 'GUEST';
    if (currentUser.role === 'STAFF') return (currentUser.subRole as UserRole) || 'SUPER_ADMIN';
    return currentUser.role as UserRole;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      role: computeEffectiveRole(),
      studentData,
      applicantData,
      login,
      register,
      switchDemoView,
      logout,
      authError,
      setAuthError,
      refreshUserData
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
