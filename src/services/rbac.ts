import { InstitutionalRole, UserRole } from '../types';

export type Permission =
  // Student Portal Permissions
  | 'VIEW_STUDENT_PORTAL'
  | 'REGISTER_COURSES'
  | 'TAKE_CBT_EXAM'
  | 'VIEW_MY_RESULTS'
  | 'MAKE_PAYMENT'
  | 'PRINT_EXAM_PHOTOCARD'
  | 'ACCESS_ELEARNING'
  
  // Applicant Portal Permissions
  | 'SUBMIT_APPLICATION'
  | 'VIEW_APPLICATION_STATUS'
  | 'PRINT_ADMISSION_LETTER'
  | 'PAY_APPLICATION_FEE'

  // Academic Registry Permissions
  | 'MANAGE_ADMISSIONS'
  | 'MANAGE_STUDENTS'
  | 'APPROVE_COURSE_REGISTRATION'
  | 'ISSUE_MATRIC_NUMBER'
  | 'GENERATE_TRANSCRIPT'
  | 'MANAGE_CIRCULARS'

  // Bursary & Finance Permissions
  | 'MANAGE_FINANCE'
  | 'RECONCILE_PAYMENTS'
  | 'RECORD_BANK_DRAFT'
  | 'GENERATE_RECEIPT'
  | 'SET_TUITION_FEES'

  // Examinations & Records Permissions
  | 'MANAGE_EXAMS'
  | 'UPLOAD_CA_SCORES'
  | 'UPLOAD_EXAM_SCORES'
  | 'VALIDATE_IJMB_RESULTS'
  | 'GENERATE_RESULT_SLIP'
  | 'MANAGE_SCRATCH_CARDS'

  // Faculty & Lecturer Permissions
  | 'MANAGE_LECTURES'
  | 'UPLOAD_COURSE_MATERIALS'
  | 'GRADE_STUDENT_ASSIGNMENTS'
  | 'RECORD_CLASS_ATTENDANCE'

  // Student Affairs Permissions
  | 'MANAGE_STUDENT_AFFAIRS'
  | 'ALLOCATE_HOSTEL'
  | 'MANAGE_ORIENTATION'
  | 'HANDLE_STUDENT_WELFARE'

  // Quality Assurance Permissions
  | 'MANAGE_QA'
  | 'AUDIT_CURRICULUM'
  | 'INSPECT_ACCREDITATION'
  | 'VERIFY_ABU_COMPLIANCE'

  // ICT Infrastructure Permissions
  | 'MANAGE_ICT'
  | 'MANAGE_CBT_BANK'
  | 'RESET_USER_PASSWORDS'
  | 'VIEW_SYSTEM_HEALTH'
  | 'SYNC_DATABASE'

  // Executive & Governance Permissions
  | 'EXECUTIVE_OVERSIGHT'
  | 'VIEW_ENROLMENT_ANALYTICS'
  | 'VIEW_COUNCIL_BOARDROOM'
  | 'ISSUE_EXECUTIVE_DIRECTIVES'

  // Master Administration Permissions
  | 'MANAGE_USERS'
  | 'ASSIGN_ROLES'
  | 'VIEW_AUDIT_LOGS'
  | 'MANAGE_SYSTEM_SETTINGS';

/**
 * Role-Based Access Control (RBAC) Permissions Matrix
 * Mapping each InstitutionalRole (and legacy BURSAR) to its authorized granular permissions.
 */
export const ROLE_PERMISSIONS: Record<InstitutionalRole | 'BURSAR', Permission[]> = {
  SUPER_ADMIN: [
    // Full system authorization across all sectors
    'VIEW_STUDENT_PORTAL', 'REGISTER_COURSES', 'TAKE_CBT_EXAM', 'VIEW_MY_RESULTS', 'MAKE_PAYMENT', 'PRINT_EXAM_PHOTOCARD', 'ACCESS_ELEARNING',
    'SUBMIT_APPLICATION', 'VIEW_APPLICATION_STATUS', 'PRINT_ADMISSION_LETTER', 'PAY_APPLICATION_FEE',
    'MANAGE_ADMISSIONS', 'MANAGE_STUDENTS', 'APPROVE_COURSE_REGISTRATION', 'ISSUE_MATRIC_NUMBER', 'GENERATE_TRANSCRIPT', 'MANAGE_CIRCULARS',
    'MANAGE_FINANCE', 'RECONCILE_PAYMENTS', 'RECORD_BANK_DRAFT', 'GENERATE_RECEIPT', 'SET_TUITION_FEES',
    'MANAGE_EXAMS', 'UPLOAD_CA_SCORES', 'UPLOAD_EXAM_SCORES', 'VALIDATE_IJMB_RESULTS', 'GENERATE_RESULT_SLIP', 'MANAGE_SCRATCH_CARDS',
    'MANAGE_LECTURES', 'UPLOAD_COURSE_MATERIALS', 'GRADE_STUDENT_ASSIGNMENTS', 'RECORD_CLASS_ATTENDANCE',
    'MANAGE_STUDENT_AFFAIRS', 'ALLOCATE_HOSTEL', 'MANAGE_ORIENTATION', 'HANDLE_STUDENT_WELFARE',
    'MANAGE_QA', 'AUDIT_CURRICULUM', 'INSPECT_ACCREDITATION', 'VERIFY_ABU_COMPLIANCE',
    'MANAGE_ICT', 'MANAGE_CBT_BANK', 'RESET_USER_PASSWORDS', 'VIEW_SYSTEM_HEALTH', 'SYNC_DATABASE',
    'EXECUTIVE_OVERSIGHT', 'VIEW_ENROLMENT_ANALYTICS', 'VIEW_COUNCIL_BOARDROOM', 'ISSUE_EXECUTIVE_DIRECTIVES',
    'MANAGE_USERS', 'ASSIGN_ROLES', 'VIEW_AUDIT_LOGS', 'MANAGE_SYSTEM_SETTINGS'
  ],

  PROVOST: [
    'EXECUTIVE_OVERSIGHT', 'VIEW_ENROLMENT_ANALYTICS', 'VIEW_COUNCIL_BOARDROOM', 'ISSUE_EXECUTIVE_DIRECTIVES',
    'MANAGE_ADMISSIONS', 'MANAGE_STUDENTS', 'MANAGE_CIRCULARS', 'MANAGE_FINANCE',
    'VALIDATE_IJMB_RESULTS', 'AUDIT_CURRICULUM', 'INSPECT_ACCREDITATION', 'VERIFY_ABU_COMPLIANCE',
    'VIEW_AUDIT_LOGS'
  ],

  COUNCIL_MEMBER: [
    'VIEW_COUNCIL_BOARDROOM', 'EXECUTIVE_OVERSIGHT', 'VIEW_ENROLMENT_ANALYTICS', 'VIEW_AUDIT_LOGS'
  ],

  REGISTRAR: [
    'MANAGE_ADMISSIONS', 'MANAGE_STUDENTS', 'APPROVE_COURSE_REGISTRATION', 'ISSUE_MATRIC_NUMBER',
    'GENERATE_TRANSCRIPT', 'MANAGE_CIRCULARS', 'PRINT_ADMISSION_LETTER', 'VIEW_AUDIT_LOGS',
    'MANAGE_STUDENT_AFFAIRS', 'MANAGE_ORIENTATION'
  ],

  ADMISSIONS_OFFICER: [
    'MANAGE_ADMISSIONS', 'PRINT_ADMISSION_LETTER', 'APPROVE_COURSE_REGISTRATION', 'VIEW_APPLICATION_STATUS'
  ],

  BURSAR: [
    'MANAGE_FINANCE', 'RECONCILE_PAYMENTS', 'RECORD_BANK_DRAFT', 'GENERATE_RECEIPT',
    'SET_TUITION_FEES', 'VIEW_ENROLMENT_ANALYTICS'
  ],

  FINANCE_OFFICER: [
    'MANAGE_FINANCE', 'RECONCILE_PAYMENTS', 'RECORD_BANK_DRAFT', 'GENERATE_RECEIPT'
  ],

  EXAMINATION_OFFICER: [
    'MANAGE_EXAMS', 'UPLOAD_CA_SCORES', 'UPLOAD_EXAM_SCORES', 'VALIDATE_IJMB_RESULTS',
    'GENERATE_RESULT_SLIP', 'MANAGE_SCRATCH_CARDS', 'GENERATE_TRANSCRIPT'
  ],

  LECTURER: [
    'MANAGE_LECTURES', 'UPLOAD_COURSE_MATERIALS', 'GRADE_STUDENT_ASSIGNMENTS',
    'RECORD_CLASS_ATTENDANCE', 'UPLOAD_CA_SCORES', 'ACCESS_ELEARNING'
  ],

  ACADEMIC_OFFICER: [
    'MANAGE_LECTURES', 'AUDIT_CURRICULUM', 'APPROVE_COURSE_REGISTRATION'
  ],

  STUDENT_AFFAIRS_OFFICER: [
    'MANAGE_STUDENT_AFFAIRS', 'ALLOCATE_HOSTEL', 'MANAGE_ORIENTATION', 'HANDLE_STUDENT_WELFARE'
  ],

  QUALITY_ASSURANCE_OFFICER: [
    'MANAGE_QA', 'AUDIT_CURRICULUM', 'INSPECT_ACCREDITATION', 'VERIFY_ABU_COMPLIANCE'
  ],

  ICT_OFFICER: [
    'MANAGE_ICT', 'MANAGE_CBT_BANK', 'RESET_USER_PASSWORDS', 'VIEW_SYSTEM_HEALTH', 'SYNC_DATABASE'
  ],

  LIBRARIAN: [
    'ACCESS_ELEARNING', 'UPLOAD_COURSE_MATERIALS'
  ],

  STUDENT: [
    'VIEW_STUDENT_PORTAL', 'REGISTER_COURSES', 'TAKE_CBT_EXAM', 'VIEW_MY_RESULTS',
    'MAKE_PAYMENT', 'PRINT_EXAM_PHOTOCARD', 'ACCESS_ELEARNING'
  ],

  APPLICANT: [
    'SUBMIT_APPLICATION', 'VIEW_APPLICATION_STATUS', 'PRINT_ADMISSION_LETTER', 'PAY_APPLICATION_FEE'
  ],

  PARENT_SPONSOR: [
    'MAKE_PAYMENT', 'VIEW_MY_RESULTS'
  ],

  ALUMNI: [
    'GENERATE_TRANSCRIPT', 'VIEW_MY_RESULTS'
  ],

  PRINCIPAL: [
    'EXECUTIVE_OVERSIGHT', 'VIEW_ENROLMENT_ANALYTICS', 'VIEW_COUNCIL_BOARDROOM', 'ISSUE_EXECUTIVE_DIRECTIVES'
  ],

  STAFF: [
    'ACCESS_ELEARNING', 'RECORD_CLASS_ATTENDANCE'
  ]
};

/**
 * Check if a given institutional role has a specific permission.
 */
export const checkRolePermission = (role: UserRole | undefined, permission: Permission): boolean => {
  if (!role || role === 'GUEST') return false;
  if (role === 'SUPER_ADMIN') return true; // Super Admin has universal access
  const permissions = ROLE_PERMISSIONS[role as InstitutionalRole | 'BURSAR'] || [];
  return permissions.includes(permission);
};

/**
 * Returns human-readable role metadata for badges and authorization cards.
 */
export const getRoleMetadata = (role: UserRole | string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return {
        label: 'Super Administrator',
        department: 'Executive ICT & Governance',
        clearanceLevel: 'Level 1 - Master Authority',
        badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-300 dark:border-red-800',
        portalHome: '/admin/dashboard'
      };
    case 'PROVOST':
    case 'PRINCIPAL':
      return {
        label: 'College Provost',
        department: 'Academic Directorate',
        clearanceLevel: 'Level 2 - Executive Director',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        portalHome: '/provost'
      };
    case 'REGISTRAR':
      return {
        label: 'Academic Registrar',
        department: 'Academic Registry & Records',
        clearanceLevel: 'Level 2 - Secretariat Authority',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        portalHome: '/registry'
      };
    case 'BURSAR':
    case 'FINANCE_OFFICER':
      return {
        label: 'Bursar & Finance Officer',
        department: 'Bursary & Accounts Division',
        clearanceLevel: 'Level 2 - Bursary Authority',
        badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        portalHome: '/bursary'
      };
    case 'EXAMINATION_OFFICER':
      return {
        label: 'Examinations Officer',
        department: 'IJMB Examinations Secretariat',
        clearanceLevel: 'Level 2 - Assessment Authority',
        badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800',
        portalHome: '/exams'
      };
    case 'LECTURER':
      return {
        label: 'Senior Faculty Lecturer',
        department: 'Departmental Faculty',
        clearanceLevel: 'Level 3 - Academic Staff',
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800',
        portalHome: '/staff'
      };
    case 'ICT_OFFICER':
      return {
        label: 'ICT & Systems Officer',
        department: 'ICT & Digital Infrastructure',
        clearanceLevel: 'Level 2 - Technical Authority',
        badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
        portalHome: '/ict'
      };
    case 'STUDENT_AFFAIRS_OFFICER':
      return {
        label: 'Student Affairs Officer',
        department: 'Student Affairs & Welfare',
        clearanceLevel: 'Level 2 - Welfare Directorate',
        badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-300 dark:border-teal-800',
        portalHome: '/student-affairs'
      };
    case 'QUALITY_ASSURANCE_OFFICER':
      return {
        label: 'Quality Assurance Officer',
        department: 'Academic Compliance & Standards',
        clearanceLevel: 'Level 2 - Compliance Directorate',
        badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
        portalHome: '/qa'
      };
    case 'COUNCIL_MEMBER':
      return {
        label: 'Governing Council Member',
        department: 'College Governing Board',
        clearanceLevel: 'Level 1 - Governance Oversight',
        badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/80 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
        portalHome: '/council'
      };
    case 'STUDENT':
      return {
        label: 'Matriculated Student',
        department: 'IJMB Direct Entry Programme',
        clearanceLevel: 'Level 4 - Enrolled Scholar',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        portalHome: '/student/dashboard'
      };
    case 'APPLICANT':
      return {
        label: 'Prospective Candidate',
        department: 'Admissions & Screening',
        clearanceLevel: 'Level 5 - Candidate Portal',
        badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300 dark:border-orange-800',
        portalHome: '/apply'
      };
    case 'PARENT_SPONSOR':
      return {
        label: 'Parent & Sponsor',
        department: 'Community Advisory',
        clearanceLevel: 'Level 5 - Ward Monitor',
        badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
        portalHome: '/parent/portal'
      };
    default:
      return {
        label: typeof role === 'string' ? role.replace(/_/g, ' ') : 'Guest User',
        department: 'Public Visitor',
        clearanceLevel: 'Level 6 - Public Access',
        badgeColor: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700',
        portalHome: '/'
      };
  }
};
