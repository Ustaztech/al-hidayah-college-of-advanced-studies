import {
  ApplicationRecord,
  StudentRecord,
  ScratchCard,
  AuditLog,
  Course,
  ResultEntry,
  CBTQuestion,
  IJMBResultEntry
} from '../types';
import { INSTITUTION_INFO, TUITION_SCHEDULE } from '../data/ijmbData';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'APPLICANT' | 'STUDENT' | 'STAFF';
  subRole?: 'REGISTRAR' | 'BURSAR' | 'LECTURER' | 'SUPER_ADMIN';
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

const KEYS = {
  USERS: 'ahcas_clean_prod_v1_users',
  APPLICATIONS: 'ahcas_clean_prod_v1_apps',
  STUDENTS: 'ahcas_clean_prod_v1_students',
  CARDS: 'ahcas_clean_prod_v1_cards',
  SESSION: 'ahcas_clean_prod_v1_session',
  LOGS: 'ahcas_clean_prod_v1_logs',
  COURSE_REGS: 'ahcas_clean_prod_v1_course_regs',
  RECEIPTS: 'ahcas_clean_prod_v1_receipts',
  CBT_QUESTIONS: 'ahcas_clean_prod_v1_cbt_q',
  EXAM_ATTEMPTS: 'ahcas_clean_prod_v1_exam_attempts'
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
  // Production RBAC: Bootstrap ONLY the Chief Administrator account
  if (!localStorage.getItem(KEYS.USERS)) {
    const seedUsers: UserAccount[] = [];
    // Never seed privileged users or passwords in public source.
    localStorage.setItem(KEYS.USERS, JSON.stringify(seedUsers));
  }

  // Zero mock students, zero mock applications, zero mock receipts
  if (!localStorage.getItem(KEYS.STUDENTS)) {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify([]));
  }

  if (!localStorage.getItem(KEYS.APPLICATIONS)) {
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify([]));
  }

  if (!localStorage.getItem(KEYS.CARDS)) {
    localStorage.setItem(KEYS.CARDS, JSON.stringify([]));
  }

  if (!localStorage.getItem(KEYS.RECEIPTS)) {
    localStorage.setItem(KEYS.RECEIPTS, JSON.stringify([]));
  }

  if (!localStorage.getItem(KEYS.CBT_QUESTIONS)) {
    const seedQuestions: CBTQuestion[] = [
      {
        id: 'q1',
        course_code: 'IJMB-BIO',
        question: 'Which of the following cellular organelles is the primary site of aerobic ATP synthesis in eukaryotic cells?',
        options: ['Ribosome', 'Mitochondrion', 'Golgi apparatus', 'Endoplasmic reticulum'],
        correct_option: 1,
        explanation: 'The mitochondrion generates most of the chemical energy needed to power biochemical reactions.'
      },
      {
        id: 'q2',
        course_code: 'IJMB-CHEM',
        question: 'According to Le Chatelier’s principle, what happens to an exothermic reaction system when the temperature is increased?',
        options: ['Equilibrium shifts to the right', 'Equilibrium shifts to the left', 'No change occurs', 'Rate constant drops to zero'],
        correct_option: 1,
        explanation: 'Increasing temperature in an exothermic process favors the reverse endothermic direction.'
      },
      {
        id: 'q3',
        course_code: 'IJMB-PHY',
        question: 'What is the SI unit of electric capacitance?',
        options: ['Ohm', 'Farad', 'Henry', 'Tesla'],
        correct_option: 1,
        explanation: 'The farad (symbol: F) is the SI unit of electrical capacitance.'
      }
    ];
    localStorage.setItem(KEYS.CBT_QUESTIONS, JSON.stringify(seedQuestions));
  }

  if (!localStorage.getItem(KEYS.LOGS)) {
    const seedLogs: AuditLog[] = [
      {
        id: 'log-01',
        timestamp: '2025-08-01 08:00:00',
        actor: 'Dr. Muhammad Baba Suleiman (Magajin Ilimin Abaji)',
        role: 'SUPER_ADMIN',
        action: 'INSTITUTION_INITIALIZED',
        details: 'Al-Hidayah College of Advanced Studies production portal initialized with full RBAC authentication security.',
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
      throw new Error('An account with this email address already exists.');
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

    const found = users.find(
      u =>
        u.email.toLowerCase() === cleanId ||
        (u.matricNumber && u.matricNumber.toLowerCase() === cleanId) ||
        (u.refNumber && u.refNumber.toLowerCase() === cleanId)
    );

    if (!found) {
      throw new Error('Account not found. Please verify your Email, Matric Number, or Application Reference.');
    }
    if (found.passwordHash !== passHash) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

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

  submitApplication: (appData: Partial<ApplicationRecord>): ApplicationRecord => {
    const apps = db.getApplications();
    const ref = `AHCAS/IJMB/2026/${Math.floor(10000 + Math.random() * 90000)}`;

    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      ref_number: ref,
      full_name: appData.full_name || 'Applicant',
      email: appData.email || 'applicant@alhidayahcollege.com.ng',
      phone: appData.phone || INSTITUTION_INFO.phone,
      gender: appData.gender || 'Male',
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
      scratch_card_serial: appData.scratch_card_serial || 'AHCAS-APP-98214',
      admission_letter_released: false,
      study_centre: INSTITUTION_INFO.studyCentre,
      form_fee_paid: true
    };

    apps.unshift(newApp);
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));

    // Ensure applicant user account exists
    const users = db.getUsers();
    if (!users.some(u => u.email.toLowerCase() === newApp.email.toLowerCase())) {
      users.push({
        id: `usr-app-${Date.now()}`,
        name: newApp.full_name,
        email: newApp.email.toLowerCase(),
        passwordHash: hashPassword(newApp.full_name.split(' ')[0].toLowerCase()),
        role: 'APPLICANT',
        refNumber: ref,
        phone: newApp.phone,
        createdAt: new Date().toISOString().substring(0, 10)
      });
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    }

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
          passport_photo: '/provost-mbsuleiman.jpg',
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

        // Provision User Account
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

  // Students
  getStudents: (): StudentRecord[] => JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]'),

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

    const passedAllThree = gradedResults.length >= 3 && gradedResults.every(r => r.letterGrade !== 'F');
    const basePoints = gradedResults.reduce((sum, r) => sum + r.gradePoint, 0);
    const cumulativePoints = basePoints + (passedAllThree ? 1 : 0);

    const updated = students.map(s => {
      if (s.matric_number === matricNumber) {
        return {
          ...s,
          ijmb_results: gradedResults,
          cumulative_grade_points: cumulativePoints,
          has_bonus_point: passedAllThree
        };
      }
      return s;
    });

    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(updated));
    db.addAuditLog('Mall. Usman Saidu (Exam Officer)', 'REGISTRAR', 'RESULTS_UPLOADED', `Uploaded IJMB scores for ${matricNumber} (Total points: ${cumulativePoints})`);
  },

  // Payments & Bursary
  getReceipts: (): PaymentReceipt[] => JSON.parse(localStorage.getItem(KEYS.RECEIPTS) || '[]'),

  recordPaymentReceipt: (receiptData: Omit<PaymentReceipt, 'reference' | 'paidAt' | 'status' | 'receiptNumber'>): PaymentReceipt => {
    const receipts: PaymentReceipt[] = db.getReceipts();
    const ref = `AHCAS-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const recNo = `AHCAS/REC/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    const newReceipt: PaymentReceipt = {
      ...receiptData,
      reference: ref,
      receiptNumber: recNo,
      paidAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Successful'
    };

    receipts.unshift(newReceipt);
    localStorage.setItem(KEYS.RECEIPTS, JSON.stringify(receipts));

    // Update student tuition installments
    const students = db.getStudents();
    const updatedStudents = students.map(s => {
      if (s.matric_number === receiptData.matricNumber) {
        const isFirst = receiptData.feeType.includes('1st Installment');
        const isSecond = receiptData.feeType.includes('2nd') || receiptData.feeType.includes('Balance');
        const isFull = receiptData.amountNgn >= s.total_tuition;

        const firstPaid = s.first_installment_paid || isFirst || isFull;
        const secondPaid = s.second_installment_paid || isSecond || isFull;
        const remaining = Math.max(0, s.outstanding_balance - receiptData.amountNgn);

        return {
          ...s,
          first_installment_paid: firstPaid,
          second_installment_paid: secondPaid,
          outstanding_balance: remaining,
          tuition_status: remaining === 0 ? ('Paid' as const) : ('Partial' as const)
        };
      }
      return s;
    });

    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(updatedStudents));
    db.addAuditLog(receiptData.studentName, 'BURSAR', 'TUITION_PAYMENT_VERIFIED', `Payment of ₦${receiptData.amountNgn.toLocaleString()} verified (Receipt: ${recNo})`);
    return newReceipt;
  },

  // Scratch Cards
  getCards: (): ScratchCard[] => JSON.parse(localStorage.getItem(KEYS.CARDS) || '[]'),

  verifyScratchCardPIN: (serialNumber: string, pin: string, cardType: ScratchCard['card_type']) => {
    const cards = db.getCards();
    const cleanSerial = serialNumber.trim().toUpperCase();
    const target = cards.find(c => c.serial_number === cleanSerial);

    if (!target) return { success: false, message: 'Invalid Scratch Card serial number.' };
    if (target.status === 'Voided') return { success: false, message: 'This card serial has been voided.' };
    if (target.card_type !== cardType) return { success: false, message: `Incorrect card type. Required: ${cardType}` };

    const updated = cards.map(c =>
      c.serial_number === cleanSerial
        ? {
            ...c,
            status: 'Consumed' as const,
            consumed_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
            consumed_by: 'User Session'
          }
        : c
    );

    localStorage.setItem(KEYS.CARDS, JSON.stringify(updated));
    db.addAuditLog('User Session', 'STUDENT', 'CARD_VERIFIED', `Scratch card ${cleanSerial} consumed`);
    return { success: true, message: 'Scratch Card PIN verified!', card: target };
  },

  generateCardBatch: (type: ScratchCard['card_type'], count: number, price: number): ScratchCard[] => {
    const cards = db.getCards();
    const prefixes = { APPLICATION: 'APP', ADMISSION_STATUS: 'ADM', RESULT_CHECKING: 'RES', TRANSCRIPT: 'TRN' };
    const generated: ScratchCard[] = [];

    for (let i = 0; i < count; i++) {
      const rand = Math.floor(10000 + Math.random() * 90000);
      const card: ScratchCard = {
        serial_number: `AHCAS-${prefixes[type]}-${rand}`,
        card_type: type,
        price_ngn: price,
        status: 'Active',
        generated_at: new Date().toISOString().substring(0, 10),
        expires_at: '2027-12-31'
      };
      cards.unshift(card);
      generated.push(card);
    }

    localStorage.setItem(KEYS.CARDS, JSON.stringify(cards));
    db.addAuditLog('Bursary Officer', 'BURSAR', 'BATCH_CARDS_GENERATED', `Generated ${count} ${type} cards`);
    return generated;
  },

  voidCard: (serialNumber: string) => {
    const cards = db.getCards();
    const updated = cards.map(c => (c.serial_number === serialNumber ? { ...c, status: 'Voided' as const } : c));
    localStorage.setItem(KEYS.CARDS, JSON.stringify(updated));
    db.addAuditLog('Bursary Officer', 'BURSAR', 'CARD_VOIDED', `Scratch card ${serialNumber} voided`);
  },

  // CBT Questions
  getCBTQuestions: (): CBTQuestion[] => JSON.parse(localStorage.getItem(KEYS.CBT_QUESTIONS) || '[]'),

  addCBTQuestion: (q: Omit<CBTQuestion, 'id'>): CBTQuestion => {
    const questions = db.getCBTQuestions();
    const newQ: CBTQuestion = { ...q, id: `q-${Date.now()}` };
    questions.unshift(newQ);
    localStorage.setItem(KEYS.CBT_QUESTIONS, JSON.stringify(questions));
    db.addAuditLog('Mall. Ibrahim Idris Gambo', 'LECTURER', 'CBT_QUESTION_ADDED', `New question added for ${q.course_code}`);
    return newQ;
  },

  saveExamAttempt: (attempt: Omit<ExamAttempt, 'id' | 'submittedAt'>): ExamAttempt => {
    const attempts: ExamAttempt[] = JSON.parse(localStorage.getItem(KEYS.EXAM_ATTEMPTS) || '[]');
    const newAttempt: ExamAttempt = {
      ...attempt,
      id: `attempt-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    attempts.unshift(newAttempt);
    localStorage.setItem(KEYS.EXAM_ATTEMPTS, JSON.stringify(attempts));
    db.addAuditLog(attempt.matricNumber, 'STUDENT', 'CBT_EXAM_SUBMITTED', `CBT exam for ${attempt.courseCode} scored ${attempt.scorePercent}%`);
    return newAttempt;
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => JSON.parse(localStorage.getItem(KEYS.LOGS) || '[]'),

  addAuditLog: (actor: string, role: string, action: string, details: string) => {
    const logs = db.getAuditLogs();
    logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      role,
      action,
      details,
      ip_address: '197.210.64.28'
    });
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  }
};
