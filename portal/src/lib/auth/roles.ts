import { UserRoleName } from '../types';

export const ALL_ROLES: UserRoleName[] = [
  'super_admin',
  'college_admin',
  'student',
  'lecturer',
  'staff',
  'hod',
  'registrar',
  'examination_officer',
  'bursar',
  'applicant'
];

export const ROLE_DISPLAY_NAMES: Record<UserRoleName, string> = {
  super_admin: 'Super Administrator',
  college_admin: 'College Administrator',
  student: 'Matriculated Student',
  lecturer: 'Academic Faculty / Lecturer',
  staff: 'Administrative Staff',
  hod: 'Head of Department (HOD)',
  registrar: 'Academic Registrar',
  examination_officer: 'Examinations Officer',
  bursar: 'College Bursar',
  applicant: 'Prospective College Applicant'
};

export const ROLE_DASHBOARD_MAP: Record<UserRoleName, string> = {
  super_admin: '/admin/dashboard',
  college_admin: '/admin/dashboard',
  student: '/student/dashboard',
  lecturer: '/staff/dashboard',
  staff: '/staff/dashboard',
  hod: '/staff/dashboard',
  registrar: '/staff/dashboard',
  examination_officer: '/staff/dashboard',
  bursar: '/staff/dashboard',
  applicant: '/application/dashboard'
};

export function getPrimaryDashboardForRoles(roles: UserRoleName[]): string {
  if (roles.includes('super_admin') || roles.includes('college_admin')) {
    return '/admin/dashboard';
  }
  if (
    roles.some(r =>
      ['lecturer', 'staff', 'hod', 'registrar', 'examination_officer', 'bursar'].includes(r)
    )
  ) {
    return '/staff/dashboard';
  }
  if (roles.includes('student')) {
    return '/student/dashboard';
  }
  if (roles.includes('applicant')) {
    return '/application/dashboard';
  }
  return '/portal/profile';
}

export function canAccessRoute(roles: UserRoleName[], pathname: string): boolean {
  if (!roles || roles.length === 0) return false;

  // Super admin has full access to all dashboards
  if (roles.includes('super_admin')) return true;

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (pathname.startsWith('/admin/bursary')) {
      return roles.includes('super_admin') || roles.includes('college_admin') || roles.includes('bursar');
    }
    if (pathname.startsWith('/admin/matriculation')) {
      return roles.includes('super_admin') || roles.includes('college_admin') || roles.includes('registrar');
    }
    return roles.includes('super_admin') || roles.includes('college_admin');
  }

  // Staff routes: staff roles and college_admin
  if (pathname.startsWith('/staff')) {
    return (
      roles.includes('college_admin') ||
      roles.some(r =>
        ['lecturer', 'staff', 'hod', 'registrar', 'examination_officer', 'bursar'].includes(r)
      )
    );
  }

  // Student routes: student and college_admin only
  if (pathname.startsWith('/student')) {
    return roles.includes('college_admin') || roles.includes('student');
  }

  // Applicant & Matriculation documents (receipt, clearance slip)
  if (
    pathname.startsWith('/application/receipt') ||
    pathname.startsWith('/application/clearance')
  ) {
    return roles.includes('college_admin') || roles.includes('applicant') || roles.includes('student');
  }

  // Applicant protected routes: applicant and college_admin only
  // Students and regular staff cannot access applicant protected routes
  if (
    pathname.startsWith('/application/dashboard') ||
    pathname.startsWith('/application/profile') ||
    pathname.startsWith('/application/settings') ||
    pathname.startsWith('/application/apply') ||
    pathname.startsWith('/application/review') ||
    pathname.startsWith('/application/slip') ||
    pathname.startsWith('/application/admission-letter') ||
    pathname.startsWith('/application/payments')
  ) {
    return roles.includes('college_admin') || roles.includes('applicant');
  }

  // Shared portal routes: /portal/profile, /portal/settings accessible by all authenticated users
  if (pathname.startsWith('/portal/profile') || pathname.startsWith('/portal/settings')) {
    return roles.length > 0;
  }

  return true;
}
