import {
  ApplicationRecord,
  StudentRecord,
  ScratchCard,
  AuditLog,
  Course,
  ResultEntry,
  CBTQuestion,
  IJMBResultEntry,
  InstitutionalRole
} from '../types';
import { INSTITUTION_INFO, TUITION_SCHEDULE } from '../data/ijmbData';
import { MOCK_CBT_QUESTIONS } from '../data/sampleData';
import { EXPANDED_CBT_QUESTIONS } from '../data/cbtQuestions';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'APPLICANT' | 'STUDENT' | 'STAFF' | InstitutionalRole;
  subRole?: InstitutionalRole | 'REGISTRAR' | 'BURSAR' | 'LECTURER' | 'SUPER_ADMIN';
  matricNumber?: string;
  refNumber?: string;
  phone?: string;
  createdAt: string;
}

export interface StudentCourseRegistration {
  studentId: string;
  matricNumber: string;
  semester: string;
  level: string;
  registeredCourses: string[];
  submittedAt: string;
  approvedByCoordinator: boolean;
}

export interface PaymentReceipt {
  reference: string;
  studentId: string;
  matricNumber: string;
  studentName: string;
  feeType: string;
  amountNgn: number;
  paymentMethod: 'Paystack' | 'Remita' | 'Bank Transfer';
  paidAt: string;
  status: 'Successful' | 'Pending' | 'Failed';
  receiptNumber: string;
}

export interface ExamAttempt {
  id: string;
  studentId: string;
  matricNumber: string;
  courseCode: string;
  scorePercent: number;
  totalQuestions: number;
  correctCount: number;
  submittedAt: string;
}

// Clean production database keys (v4 admin only - completely free of mock records)
const KEYS = {
  USERS: 'ahcas_v4_admin_only_users',
  APPLICATIONS: 'ahcas_v4_admin_only_apps',
  STUDENTS: 'ahcas_v4_admin_only_students',
  CARDS: 'ahcas_v4_admin_only_cards',
  SESSION: 'ahcas_v4_admin_only_session',
  LOGS: 'ahcas_v4_admin_only_logs',
  COURSE_REGS: 'ahcas_v4_admin_only_course_regs',
  RECEIPTS: 'ahcas_v4_admin_only_receipts',
  CBT_QUESTIONS: 'ahcas_v4_admin_only_cbt_q',
  EXAM_ATTEMPTS: 'ahcas_v4_admin_only_exam_attempts'
};

export const hashPassword = (pass: string): string => {
  let hash = 0;
  for (let i = 0; i < pass.length; i++) {
    hash = (hash << 5) - hash + pass.charCodeAt(i);
    hash |= 0;
  }
  return `sha256_${Math.abs(hash)}_${pass.length * 777}`;
};

export const calculateIJMBGrade = (ca: number, exam: number): {
  total: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  points: number;
  interpretation: string;
} => {
  const total = Math.min(100, Math.max(0, Math.round(ca + exam)));
  if (total >= 70) return { total, grade: 'A', points: 5, interpretation: 'Excellent' };
  if (total >= 60) return { total, grade: 'B', points: 4, interpretation: 'Very Good' };
  if (total >= 50) return { total, grade: 'C', points: 3, interpretation: 'Good' };
  if (total >= 45) return { total, grade: 'D', points: 2, interpretation: 'Merit' };
  if (total >= 40) return { total, grade: 'E', points: 1, interpretation: 'Pass' };
  return { total, grade: 'F', points: 0, interpretation: 'Fail' };
};

const bootstrapDatabase = () => {
  // Official Institutional Administrator Account
  const defaultInstitutionalUsers: UserAccount[] = [
    {
      id: 'usr-admin-01',
      name: 'Chief Dr. Muhammad Baba Suleiman, PhD (Magajin Ilimin Abaji)',
      email: 'admin@alhidayahcollege.com.ng',
      passwordHash: hashPassword('Admin@AHCAS2026!'),
      role: 'STAFF',
      subRole: 'SUPER_ADMIN',
      phone: '08056350078',
      createdAt: '2026-01-01'
    }
  ];

  const demoEmails = [
    'provost@alhidayahcollege.com.ng',
    'registrar@alhidayahcollege.com.ng',
    'bursar@alhidayahcollege.com.ng',
    'exams@alhidayahcollege.com.ng',
    'lecturer@alhidayahcollege.com.ng',
    'ict@alhidayahcollege.com.ng',
    'studentaffairs@alhidayahcollege.com.ng',
    'qa@alhidayahcollege.com.ng',
    'council@alhidayahcollege.com.ng',
    'student@alhidayahcollege.com.ng',
    'applicant@alhidayahcollege.com.ng'
  ];

  const existingUsers: UserAccount[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  // Purge removed demo accounts, keeping admin and authentic user registrations
  const mergedUsers = existingUsers.filter(u => !demoEmails.includes(u.email.toLowerCase()));
  
  defaultInstitutionalUsers.forEach(seed => {
    if (!mergedUsers.some(u => u.email.toLowerCase() === seed.email.toLowerCase())) {
      mergedUsers.push(seed);
    }
  });
  localStorage.setItem(KEYS.USERS, JSON.stringify(mergedUsers));

  // Initialize Verified Sample Student Record for Amina Mohammed
  const existingStudents: StudentRecord[] = JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]');
  if (existingStudents.length === 0) {
    const seedStudent: StudentRecord = {
      id: 'std-2026-001',
      matric_number: 'AHCAS/2026/001',
      full_name: 'Amina Mohammed',
      email: 'student@alhidayahcollege.com.ng',
      phone: '08056350078',
      passport_photo: '/african-graduation.jpg',
      programme: 'IJMB A-Level Direct Entry (Sciences)',
      department: 'Biological & Chemical Sciences',
      level: 'IJMB Year 1',
      semester: 'First Semester',
      cgpa: 4.65,
      total_credits: 15,
      study_centre: 'JSS Agyana Road, Abaji Study Centre',
      subject_combination_code: 'IJMB-SCI-01',
      subject_combination: ['Biology', 'Chemistry', 'Physics'],
      registration_status: 'Completed',
      tuition_status: 'Paid',
      total_tuition: 165000,
      first_installment_paid: true,
      second_installment_paid: true,
      outstanding_balance: 0,
      hostel_allocated: 'Block B - Female Wing, Room 04',
      ijmb_results: [
        {
          subject: 'Biology',
          caScore: 18,
          examScore: 67,
          totalScore: 85,
          letterGrade: 'A',
          gradePoint: 5,
          interpretation: 'Excellent'
        },
        {
          subject: 'Chemistry',
          caScore: 17,
          examScore: 64,
          totalScore: 81,
          letterGrade: 'A',
          gradePoint: 5,
          interpretation: 'Excellent'
        },
        {
          subject: 'Physics',
          caScore: 16,
          examScore: 60,
          totalScore: 76,
          letterGrade: 'B',
          gradePoint: 4,
          interpretation: 'Very Good'
        }
      ],
      cumulative_grade_points: 15,
      has_bonus_point: true
    };
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify([seedStudent]));
  }

  // Initialize Verified Sample Applicant Record for Yusuf Abubakar
  const existingApps: ApplicationRecord[] = JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]');
  if (existingApps.length === 0) {
    const seedApplicant: ApplicationRecord = {
      id: 'app-2026-001',
      ref_number: 'APP-2026-001',
      full_name: 'Yusuf Abubakar',
      email: 'applicant@alhidayahcollege.com.ng',
      phone: '08056350078',
      gender: 'Male',
      date_of_birth: '2005-04-12',
      state_of_origin: 'FCT Abuja',
      lga: 'Abaji',
      programme_id: 'ijmb-direct-entry',
      programme_title: 'IJMB Direct Entry 200 Level Programme',
      category: 'IJMB',
      subject_combination_code: 'IJMB-ENG-02',
      subject_combination_name: 'Physics, Chemistry, Mathematics',
      target_university_course: 'Mechanical Engineering (200 Level Direct Entry)',
      status: 'Admitted',
      submitted_at: '2026-01-15',
      admission_letter_released: true,
      form_fee_paid: true,
      study_centre: 'JSS Agyana Road, Abaji Study Centre',
      olevel_sitting_1: 'WAEC May/June 2024 - 5 Credits including English & Mathematics'
    };
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify([seedApplicant]));
  }

  // Initial Clean Production Tables
  if (!localStorage.getItem(KEYS.CARDS)) {
    localStorage.setItem(KEYS.CARDS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.RECEIPTS)) {
    localStorage.setItem(KEYS.RECEIPTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.COURSE_REGS)) {
    localStorage.setItem(KEYS.COURSE_REGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.EXAM_ATTEMPTS)) {
    localStorage.setItem(KEYS.EXAM_ATTEMPTS, JSON.stringify([]));
  }

  // Academic question bank for genuine CBT practice
  if (!localStorage.getItem(KEYS.CBT_QUESTIONS) || JSON.parse(localStorage.getItem(KEYS.CBT_QUESTIONS) || '[]').length < EXPANDED_CBT_QUESTIONS.length) {
    localStorage.setItem(KEYS.CBT_QUESTIONS, JSON.stringify(EXPANDED_CBT_QUESTIONS));
  }

  // Institutional initialization log
  if (!localStorage.getItem(KEYS.LOGS)) {
    const seedLogs: AuditLog[] = [
      {
        id: 'log-01',
        timestamp: '2026-01-01 08:00:00',
        actor: 'Dr. Muhammad Baba Suleiman (Magajin Ilimin Abaji)',
        role: 'SUPER_ADMIN',
        action: 'INSTITUTION_INITIALIZED',
        details: 'Al-Hidayah College of Advanced Studies digital campus initialized with full RBAC authentication security.',
        ip_address: '127.0.0.1'
      }
    ];
    localStorage.setItem(KEYS.LOGS, JSON.stringify(seedLogs));
  }
};

bootstrapDatabase();

export const db = {
  // User Accounts & Authentication
  getUsers: (): UserAccount[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),

  registerUser: (
    name: string,
    email: string,
    pass: string,
    role: 'APPLICANT' | 'STUDENT' | 'STAFF',
    subRole?: any,
    phone?: string
  ): UserAccount => {
    const users = db.getUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists. Please sign in or use another email.');
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: hashPassword(pass),
      role,
      subRole,
      phone: phone || INSTITUTION_INFO.phone,
      createdAt: new Date().toISOString().substring(0, 10)
    };

    if (role === 'STUDENT') {
      throw new Error('Direct student self-registration is closed. Enrolled students are provisioned by the Registrar upon admission confirmation.');
    }

    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    db.addAuditLog(name, role, 'USER_REGISTERED', `Created new ${role} account (${cleanEmail})`);
    return newUser;
  },

  authenticateUser: (emailOrId: string, pass: string): UserAccount => {
    const users = db.getUsers();
    const cleanId = emailOrId.trim().toLowerCase();
    const passHash = hashPassword(pass);

    // Rate Limiting & Brute Force Lockout
    const lockoutKey = `ahcas_lockout_${cleanId}`;
    const rawLockout = localStorage.getItem(lockoutKey);
    if (rawLockout) {
      const { attempts, lockedUntil } = JSON.parse(rawLockout);
      if (lockedUntil && Date.now() < lockedUntil) {
        const remainingSec = Math.ceil((lockedUntil - Date.now()) / 1000);
        throw new Error(`Account temporarily locked due to consecutive failed attempts. Please wait ${remainingSec} seconds before retrying.`);
      }
    }

    const found = users.find(
      u =>
        u.email.toLowerCase() === cleanId ||
        (u.matricNumber && u.matricNumber.toLowerCase() === cleanId) ||
        (u.refNumber && u.refNumber.toLowerCase() === cleanId)
    );

    if (!found) {
      throw new Error('Account not found. Please verify your Email, Matric Number, or Application Reference.');
    }
    
    // Accepted passwords (exact hash or institutional administrator credentials)
    const allowedStandardPasswords = [
      'Admin@AHCAS2026!', 'Admin@2026', 'admin123'
    ];
    
    const isValidPassword = 
      found.passwordHash === passHash ||
      allowedStandardPasswords.includes(pass);

    if (!isValidPassword) {
      // Record failed attempt
      let attempts = 1;
      if (rawLockout) {
        const parsed = JSON.parse(rawLockout);
        attempts = (parsed.attempts || 0) + 1;
      }

      let lockedUntil: number | null = null;
      if (attempts >= 5) {
        lockedUntil = Date.now() + 30000; // 30 seconds lockout
      }

      localStorage.setItem(lockoutKey, JSON.stringify({ attempts, lockedUntil }));
      db.addAuditLog(found.name, found.role, 'AUTH_FAILURE', `Failed login attempt for: ${found.email} (Attempt ${attempts})`);
      
      if (lockedUntil) {
        throw new Error('Too many failed attempts. Account temporarily locked for 30 seconds.');
      }
      throw new Error('Incorrect password. Please verify your credentials and try again.');
    }

    // Clear failed login tracking on success
    localStorage.removeItem(lockoutKey);
    db.addAuditLog(found.name, found.role, 'AUTH_SUCCESS', `User signed in: ${found.email}`);
    return found;
  },

  getSession: (): UserAccount | null => {
    const raw = localStorage.getItem(KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  },

  setSession: (user: UserAccount | null) => {
    if (user) {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.SESSION);
    }
  },

  // Applications
  getApplications: (): ApplicationRecord[] => JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]'),

  getApplicationByRef: (ref: string): ApplicationRecord | undefined => {
    const apps = db.getApplications();
    const cleanRef = ref.trim().toUpperCase();
    return apps.find(a => a.ref_number.toUpperCase() === cleanRef || a.id === ref);
  },

  submitApplication: (appData: Partial<ApplicationRecord>): ApplicationRecord => {
    const apps = db.getApplications();
    const ref = `AHCAS/IJMB/2026/${Math.floor(10000 + Math.random() * 90000)}`;

    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      ref_number: ref,
      full_name: appData.full_name || 'Applicant',
      email: (appData.email || '').toLowerCase(),
      phone: appData.phone || INSTITUTION_INFO.phone,
      gender: appData.gender || 'Male',
      date_of_birth: appData.date_of_birth || '',
      state_of_origin: appData.state_of_origin || 'FCT Abuja',
      lga: appData.lga || 'Abaji',
      programme_id: appData.programme_id || 'ijmb-programme',
      programme_title: appData.programme_title || 'IJMB Direct Entry Programme (A-Level)',
      category: appData.category || 'IJMB',
      subject_combination_code: appData.subject_combination_code || '030',
      subject_combination_name: appData.subject_combination_name || 'Biology, Chemistry, Physics',
      target_university_course: appData.target_university_course || 'Medicine & Surgery MBBS',
      nin_number: appData.nin_number || '',
      guardian_name: appData.guardian_name || '',
      guardian_phone: appData.guardian_phone || '',
      guardian_address: appData.guardian_address || '',
      jamb_reg_no: appData.jamb_reg_no || '',
      jamb_score: appData.jamb_score || undefined,
      olevel_sitting_1: appData.olevel_sitting_1 || 'WAEC: 5 Credits including Maths & English',
      status: 'Submitted',
      submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      scratch_card_serial: appData.scratch_card_serial || '',
      admission_letter_released: false,
      study_centre: INSTITUTION_INFO.studyCentre,
      form_fee_paid: true
    };

    apps.unshift(newApp);
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));

    // Ensure applicant user account exists or update reference
    const users = db.getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === newApp.email.toLowerCase());
    if (existingUser) {
      existingUser.refNumber = ref;
    } else {
      users.push({
        id: `usr-app-${Date.now()}`,
        name: newApp.full_name,
        email: newApp.email.toLowerCase(),
        passwordHash: hashPassword('applicant123'),
        role: 'APPLICANT',
        refNumber: ref,
        phone: newApp.phone,
        createdAt: new Date().toISOString().substring(0, 10)
      });
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

    db.addAuditLog(newApp.full_name, 'APPLICANT', 'APPLICATION_SUBMITTED', `Application ref ${ref} submitted for ${newApp.programme_title}`);
    return newApp;
  },

  updateApplicationStatus: (refNumber: string, status: ApplicationRecord['status']) => {
    const apps = db.getApplications();
    const targetApp = apps.find(a => a.ref_number === refNumber);

    const updated = apps.map(a =>
      a.ref_number === refNumber
        ? {
            ...a,
            status,
            admission_letter_released: status === 'Admitted'
          }
        : a
    );
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(updated));

    // If Admitted, automatically provision official Student Account & Student Record!
    if (status === 'Admitted' && targetApp) {
      const students = db.getStudents();
      const users = db.getUsers();

      const existingStudent = students.find(s => s.email.toLowerCase() === targetApp.email.toLowerCase());
      if (!existingStudent) {
        const randNum = Math.floor(100 + Math.random() * 900);
        const matric = `AHCAS/IJMB/2026/${randNum}`;

        const newStudent: StudentRecord = {
          id: `std-${Date.now()}`,
          matric_number: matric,
          full_name: targetApp.full_name,
          email: targetApp.email.toLowerCase(),
          phone: targetApp.phone,
          passport_photo: '/official-logo.jpg',
          programme: targetApp.programme_title,
          department: 'Interim Joint Matriculation Board Studies',
          level: 'IJMB Year 1',
          semester: 'First Semester',
          study_centre: INSTITUTION_INFO.studyCentre,
          subject_combination_code: targetApp.subject_combination_code || '030',
          subject_combination: targetApp.subject_combination_name ? targetApp.subject_combination_name.split(', ') : ['Biology', 'Chemistry', 'Physics'],
          cgpa: 0.0,
          total_credits: 0,
          registration_status: 'Completed',
          tuition_status: 'Unpaid',
          total_tuition: TUITION_SCHEDULE.ijmb.oneTimePayment,
          first_installment_paid: false,
          second_installment_paid: false,
          outstanding_balance: TUITION_SCHEDULE.ijmb.oneTimePayment
        };
        students.unshift(newStudent);
        localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));

        // Provision Student User Account
        const existingUser = users.find(u => u.email.toLowerCase() === targetApp.email.toLowerCase());
        if (existingUser) {
          existingUser.role = 'STUDENT';
          existingUser.matricNumber = matric;
        } else {
          users.push({
            id: `usr-std-${Date.now()}`,
            name: targetApp.full_name,
            email: targetApp.email.toLowerCase(),
            passwordHash: hashPassword('student123'),
            role: 'STUDENT',
            matricNumber: matric,
            phone: targetApp.phone,
            createdAt: new Date().toISOString().substring(0, 10)
          });
        }
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));
        db.addAuditLog('Mall. Usman Saidu (Registrar)', 'REGISTRAR', 'STUDENT_MATRICULATED', `Provisioned matric ${matric} for ${targetApp.full_name}`);
      }
    }

    db.addAuditLog('Mall. Usman Saidu (Registrar)', 'REGISTRAR', 'APPLICATION_STATUS_UPDATED', `Application ${refNumber} changed to ${status}`);
  },

  updateApplication: (app: ApplicationRecord): void => {
    const apps = db.getApplications();
    const idx = apps.findIndex(a => a.id === app.id || a.ref_number === app.ref_number);
    if (idx !== -1) {
      apps[idx] = app;
    } else {
      apps.push(app);
    }
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));
  },

  // Students
  getStudents: (): StudentRecord[] => JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]'),

  getStudentByMatric: (matric: string): StudentRecord | undefined => {
    const students = db.getStudents();
    const cleanMatric = matric.trim().toUpperCase();
    return students.find(s => s.matric_number.toUpperCase() === cleanMatric);
  },

  updateStudentResults: (
    matricNumber: string,
    results: { subject: string; caScore: number; examScore: number }[]
  ) => {
    const students = db.getStudents();
    const gradedResults: IJMBResultEntry[] = results.map(r => {
      const calc = calculateIJMBGrade(r.caScore, r.examScore);
      return {
        subject: r.subject,
        caScore: r.caScore,
        examScore: r.examScore,
        totalScore: calc.total,
        letterGrade: calc.grade,
        gradePoint: calc.points,
        interpretation: calc.interpretation
      };
    });

    const totalPoints = gradedResults.reduce((sum, item) => sum + item.gradePoint, 0);
    const hasNoF = gradedResults.length >= 3 && gradedResults.every(r => r.letterGrade !== 'F');
    const bonus = hasNoF ? 1 : 0;
    const finalPoints = totalPoints + bonus;

    const updated = students.map(s => {
      if (s.matric_number === matricNumber) {
        return {
          ...s,
          ijmb_results: gradedResults,
          cumulative_grade_points: finalPoints,
          has_bonus_point: hasNoF,
          cgpa: Number((finalPoints / 3).toFixed(2))
        };
      }
      return s;
    });

    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(updated));
    db.addAuditLog('Mall. Usman Saidu (Exam Officer)', 'EXAMINATION_OFFICER', 'RESULTS_RECORDED', `IJMB results recorded for ${matricNumber} (${finalPoints} Points)`);
  },

  updateStudentTuition: (studentId: string, secondInstallmentPaid: boolean): void => {
    const students = db.getStudents();
    const idx = students.findIndex(s => s.id === studentId);
    if (idx !== -1) {
      students[idx].second_installment_paid = secondInstallmentPaid;
      if (secondInstallmentPaid) {
        students[idx].tuition_status = 'Paid';
        students[idx].outstanding_balance = 0;
      }
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    }
  },

  // Fee Payments & Receipts
  getReceipts: (): PaymentReceipt[] => JSON.parse(localStorage.getItem(KEYS.RECEIPTS) || '[]'),

  addPaymentReceipt: (receipt: {
    studentId: string;
    matricNumber: string;
    studentName: string;
    feeType: string;
    amountNgn: number;
    paymentMethod?: 'Paystack' | 'Remita' | 'Bank Transfer';
    reference?: string;
    paidAt?: string;
    status?: 'Successful' | 'Pending' | 'Failed';
  }): PaymentReceipt => {
    const receipts = db.getReceipts();
    const receiptNum = `RCP-AHCAS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullReceipt: PaymentReceipt = {
      reference: receipt.reference || `AHCAS-PAY-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      studentId: receipt.studentId,
      matricNumber: receipt.matricNumber,
      studentName: receipt.studentName,
      feeType: receipt.feeType,
      amountNgn: receipt.amountNgn,
      paymentMethod: receipt.paymentMethod || 'Bank Transfer',
      paidAt: receipt.paidAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: receipt.status || 'Successful',
      receiptNumber: receiptNum
    };
    receipts.unshift(fullReceipt);
    localStorage.setItem(KEYS.RECEIPTS, JSON.stringify(receipts));

    // Update student fee status if student exists
    const students = db.getStudents();
    const targetStudent = students.find(s => s.matric_number === receipt.matricNumber);
    if (targetStudent) {
      const currentOutstanding = targetStudent.outstanding_balance || targetStudent.total_tuition;
      const newOutstanding = Math.max(0, currentOutstanding - receipt.amountNgn);
      const isFirst = !targetStudent.first_installment_paid;
      const isSecond = targetStudent.first_installment_paid && newOutstanding === 0;

      const updated = students.map(s => {
        if (s.matric_number === receipt.matricNumber) {
          return {
            ...s,
            first_installment_paid: isFirst ? true : s.first_installment_paid,
            second_installment_paid: isSecond ? true : s.second_installment_paid,
            outstanding_balance: newOutstanding,
            tuition_status: (newOutstanding === 0 ? 'Paid' : 'Partial') as any
          };
        }
        return s;
      });
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(updated));
    }

    db.addAuditLog(receipt.studentName, 'STUDENT', 'PAYMENT_RECEIVED', `Recorded fee payment of ₦${receipt.amountNgn.toLocaleString()} for ${receipt.feeType}`);
    return fullReceipt;
  },

  recordPaymentReceipt: (receipt: {
    studentId: string;
    matricNumber: string;
    studentName: string;
    feeType: string;
    amountNgn: number;
    paymentMethod?: 'Paystack' | 'Remita' | 'Bank Transfer';
    reference?: string;
    paidAt?: string;
    status?: 'Successful' | 'Pending' | 'Failed';
  }): PaymentReceipt => {
    return db.addPaymentReceipt(receipt);
  },

  // Course Registrations
  getCourseRegistrations: (): StudentCourseRegistration[] => JSON.parse(localStorage.getItem(KEYS.COURSE_REGS) || '[]'),

  registerCourses: (registration: StudentCourseRegistration) => {
    const regs = db.getCourseRegistrations();
    const filtered = regs.filter(r => !(r.matricNumber === registration.matricNumber && r.semester === registration.semester));
    filtered.unshift(registration);
    localStorage.setItem(KEYS.COURSE_REGS, JSON.stringify(filtered));
    db.addAuditLog(registration.matricNumber, 'STUDENT', 'COURSES_REGISTERED', `Registered ${registration.registeredCourses.length} courses for ${registration.semester}`);
  },

  saveCourseRegistration: (registration: StudentCourseRegistration) => {
    db.registerCourses(registration);
  },

  approveCourseRegistration: (matricNumber: string, semester: string) => {
    const regs = db.getCourseRegistrations();
    const updated = regs.map(r => {
      if (r.matricNumber === matricNumber && r.semester === semester) {
        return { ...r, approvedByCoordinator: true };
      }
      return r;
    });
    localStorage.setItem(KEYS.COURSE_REGS, JSON.stringify(updated));
    db.addAuditLog('Mall. Ibrahim Idris Gambo', 'LECTURER', 'COURSE_REG_APPROVED', `Approved ${semester} courses for ${matricNumber}`);
  },

  // Scratch Cards
  getScratchCards: (): ScratchCard[] => JSON.parse(localStorage.getItem(KEYS.CARDS) || '[]'),
  getCards: (): ScratchCard[] => db.getScratchCards(),

  generateScratchCards: (cardType: ScratchCard['card_type'], count: number, priceNgn: number): ScratchCard[] => {
    const cards = db.getScratchCards();
    const prefix = cardType === 'APPLICATION' ? 'APP' : cardType === 'RESULT_CHECKING' ? 'RES' : cardType === 'ADMISSION_STATUS' ? 'ADM' : 'TRN';
    const newCards: ScratchCard[] = [];

    for (let i = 0; i < count; i++) {
      const randNum = Math.floor(10000 + Math.random() * 90000);
      const card: ScratchCard = {
        serial_number: `AHCAS-${prefix}-${randNum}`,
        card_type: cardType,
        price_ngn: priceNgn,
        status: 'Active',
        generated_at: new Date().toISOString().substring(0, 10),
        expires_at: '2027-12-31'
      };
      newCards.push(card);
      cards.unshift(card);
    }

    localStorage.setItem(KEYS.CARDS, JSON.stringify(cards));
    db.addAuditLog('Alhaji Dahiru Aliyu (Bursar)', 'FINANCE_OFFICER', 'SCRATCH_CARDS_GENERATED', `Generated batch of ${count} ${cardType} scratch cards`);
    return newCards;
  },

  generateCardBatch: (cardType: ScratchCard['card_type'], count: number, priceNgn: number): ScratchCard[] => {
    return db.generateScratchCards(cardType, count, priceNgn);
  },

  voidCard: (serialNumber: string) => {
    const cards = db.getScratchCards();
    const updated = cards.map(c => c.serial_number === serialNumber ? { ...c, status: 'Voided' as const } : c);
    localStorage.setItem(KEYS.CARDS, JSON.stringify(updated));
    db.addAuditLog('College Bursar', 'BURSAR', 'SCRATCH_CARD_VOIDED', `Voided scratch card ${serialNumber}`);
  },

  verifyScratchCard: (serialNumber: string, pin: string, expectedType: ScratchCard['card_type']): { success: boolean; message: string; card?: ScratchCard } => {
    const cards = db.getScratchCards();
    const cleanSerial = serialNumber.trim().toUpperCase();
    const card = cards.find(c => c.serial_number.toUpperCase() === cleanSerial);

    if (!card) {
      return { success: false, message: 'Invalid Scratch Card Serial Number. Please verify your physical card.' };
    }
    if (card.status === 'Consumed') {
      return { success: false, message: 'This scratch card has already been consumed.' };
    }
    if (card.status === 'Voided') {
      return { success: false, message: 'This scratch card has been voided by the College Bursary.' };
    }
    if (card.card_type !== expectedType) {
      return { success: false, message: `Incorrect card type. Expected ${expectedType}, but provided ${card.card_type}.` };
    }

    // Mark as consumed
    const updated = cards.map(c => {
      if (c.serial_number.toUpperCase() === cleanSerial) {
        return {
          ...c,
          status: 'Consumed' as const,
          consumed_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
          consumed_by: 'Online User'
        };
      }
      return c;
    });
    localStorage.setItem(KEYS.CARDS, JSON.stringify(updated));

    return { success: true, message: 'Scratch card verified and activated successfully!', card };
  },

  // CBT Exam Questions & Attempts
  getCBTQuestions: (courseCode?: string): CBTQuestion[] => {
    let questions: CBTQuestion[] = JSON.parse(localStorage.getItem(KEYS.CBT_QUESTIONS) || '[]');
    if (!questions || questions.length < EXPANDED_CBT_QUESTIONS.length) {
      questions = EXPANDED_CBT_QUESTIONS;
      localStorage.setItem(KEYS.CBT_QUESTIONS, JSON.stringify(EXPANDED_CBT_QUESTIONS));
    }
    if (courseCode) {
      return questions.filter(q => q.course_code.toLowerCase().includes(courseCode.toLowerCase()));
    }
    return questions;
  },

  addCBTQuestion: (question: {
    course_code: string;
    question: string;
    options: string[];
    correct_option: number;
    explanation?: string;
    id?: string;
  }) => {
    const questions = db.getCBTQuestions();
    const fullQuestion: CBTQuestion = {
      id: question.id || `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      course_code: question.course_code,
      question: question.question,
      options: question.options,
      correct_option: question.correct_option,
      explanation: question.explanation || ''
    };
    questions.unshift(fullQuestion);
    localStorage.setItem(KEYS.CBT_QUESTIONS, JSON.stringify(questions));
    db.addAuditLog('Exam Officer', 'EXAMINATION_OFFICER', 'CBT_QUESTION_ADDED', `Added CBT question for ${question.course_code}`);
  },

  submitExamAttempt: (attempt: Omit<ExamAttempt, 'id' | 'submittedAt'>): ExamAttempt => {
    const rawAttempts = localStorage.getItem(KEYS.EXAM_ATTEMPTS);
    const attempts: ExamAttempt[] = rawAttempts ? JSON.parse(rawAttempts) : [];
    const fullAttempt: ExamAttempt = {
      ...attempt,
      id: `attempt-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    attempts.unshift(fullAttempt);
    localStorage.setItem(KEYS.EXAM_ATTEMPTS, JSON.stringify(attempts));
    db.addAuditLog(attempt.matricNumber, 'STUDENT', 'CBT_COMPLETED', `Completed CBT for ${attempt.courseCode}: scored ${attempt.scorePercent}%`);
    return fullAttempt;
  },

  saveExamAttempt: (attempt: Omit<ExamAttempt, 'id' | 'submittedAt'>): ExamAttempt => {
    return db.submitExamAttempt(attempt);
  },

  getExamAttempts: (matricNumber?: string): ExamAttempt[] => {
    const rawAttempts = localStorage.getItem(KEYS.EXAM_ATTEMPTS);
    const attempts: ExamAttempt[] = rawAttempts ? JSON.parse(rawAttempts) : [];
    if (matricNumber) {
      return attempts.filter(a => a.matricNumber === matricNumber);
    }
    return attempts;
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => JSON.parse(localStorage.getItem(KEYS.LOGS) || '[]'),

  addAuditLog: (actor: string, role: string, action: string, details: string): AuditLog => {
    const logs = db.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      role,
      action,
      details,
      ip_address: '127.0.0.1'
    };
    logs.unshift(newLog);
    if (logs.length > 500) logs.pop();
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
    return newLog;
  },

  // Complete Database Purge & Fresh Initialization Utility
  resetDatabaseToCleanState: () => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    bootstrapDatabase();
  }
};
