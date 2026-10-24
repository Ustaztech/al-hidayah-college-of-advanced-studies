import { ScratchCard, ApplicationRecord, StudentRecord, ResultEntry, CBTQuestion, AuditLog } from '../types';
import { INSTITUTION_INFO } from './ijmbData';

export const INITIAL_SCRATCH_CARDS: ScratchCard[] = [
  {
    serial_number: 'AHCAS-APP-98214',
    card_type: 'APPLICATION',
    price_ngn: 10500,
    status: 'Consumed',
    generated_at: '2026-08-01',
    expires_at: '2027-08-01',
    consumed_by: 'Zainab Usman Abdullahi',
    consumed_at: '2026-09-02'
  },
  {
    serial_number: 'AHCAS-APP-44102',
    card_type: 'APPLICATION',
    price_ngn: 10500,
    status: 'Consumed',
    generated_at: '2026-08-01',
    expires_at: '2027-08-01',
    consumed_by: 'Haruna Mohammed Bello',
    consumed_at: '2026-10-04'
  },
  {
    serial_number: 'AHCAS-ADM-11204',
    card_type: 'ADMISSION_STATUS',
    price_ngn: 2500,
    status: 'Active',
    generated_at: '2026-08-01',
    expires_at: '2027-08-01'
  },
  {
    serial_number: 'AHCAS-RES-88291',
    card_type: 'RESULT_CHECKING',
    price_ngn: 2000,
    status: 'Active',
    generated_at: '2026-08-01',
    expires_at: '2027-08-01'
  },
  {
    serial_number: 'AHCAS-TRN-77312',
    card_type: 'TRANSCRIPT',
    price_ngn: 17000,
    status: 'Active',
    generated_at: '2026-08-01',
    expires_at: '2027-08-01'
  }
];

export const INITIAL_APPLICANTS: ApplicationRecord[] = [
  {
    id: 'app-00142',
    ref_number: 'AHCAS/IJMB/2026/00142',
    full_name: 'Zainab Usman Abdullahi',
    email: 'applicant@alhidayahcollege.com.ng',
    phone: '08056350078',
    gender: 'Female',
    state_of_origin: 'FCT Abuja',
    lga: 'Abaji',
    programme_id: 'ijmb-programme',
    programme_title: 'IJMB Direct Entry Programme (A-Level)',
    category: 'IJMB',
    subject_combination_code: '043',
    subject_combination_name: 'Chemistry, Physics, A/L Maths',
    target_university_course: 'Computer Engineering (10 points)',
    nin_number: '74618290142',
    guardian_name: 'Alhaji Usman Abdullahi',
    guardian_phone: '08056350078',
    guardian_address: 'Sabon Tasha Phase II, Abaji FCT Abuja',
    olevel_sitting_1: 'WAEC 2025: Eng(B3), Math(A1), Phys(B2), Chem(B3), Bio(B2)',
    status: 'Admitted',
    submitted_at: '2026-09-02 11:20',
    scratch_card_serial: 'AHCAS-APP-98214',
    admission_letter_released: true,
    study_centre: 'JSS Agyana Road Study Centre, Abaji Abuja',
    form_fee_paid: true
  },
  {
    id: 'app-00189',
    ref_number: 'AHCAS/IJMB/2026/00189',
    full_name: 'Haruna Mohammed Bello',
    email: 'haruna.bello@gmail.com',
    phone: '08129876543',
    gender: 'Male',
    state_of_origin: 'FCT Abuja',
    lga: 'Abaji',
    programme_id: 'ijmb-programme',
    programme_title: 'IJMB Direct Entry Programme (A-Level)',
    category: 'IJMB',
    subject_combination_code: '030',
    subject_combination_name: 'Biology, Chemistry, Physics',
    target_university_course: 'Medicine & Surgery MBBS (15 points)',
    nin_number: '89102374612',
    guardian_name: 'Mallam Mohammed Bello',
    guardian_phone: '08129876543',
    guardian_address: 'MBS Close, Sabon Tasha, Abaji',
    olevel_sitting_1: 'NECO 2025: Eng(B2), Math(A1), Phys(B3), Chem(A1), Bio(A1)',
    status: 'Under Review',
    submitted_at: '2026-10-04 14:30',
    scratch_card_serial: 'AHCAS-APP-44102',
    admission_letter_released: false,
    study_centre: 'JSS Agyana Road Study Centre, Abaji Abuja',
    form_fee_paid: true
  }
];

export const MOCK_STUDENT: StudentRecord = {
  id: 'std-pioneer-001',
  matric_number: 'AHCAS/IJMB/2025/001',
  full_name: 'Abubakar Umar Sadiq',
  email: 'pioneer.student@alhidayahcollege.com.ng',
  phone: '08056350078',
  passport_photo: '/provost-mbsuleiman.jpg',
  programme: 'IJMB Direct Entry Programme (A-Level)',
  department: 'IJMB Academic Directorate',
  level: 'IJMB Pioneer Cohort',
  semester: 'Second Semester',
  study_centre: 'JSS Agyana Road Study Centre, Abaji Abuja',
  subject_combination_code: '030',
  subject_combination: ['Biology', 'Chemistry', 'Physics'],
  cgpa: 5.0,
  total_credits: 16,
  registration_status: 'Completed',
  tuition_status: 'Paid',
  total_tuition: 258500,
  first_installment_paid: true,
  second_installment_paid: true,
  outstanding_balance: 0,
  has_bonus_point: true,
  cumulative_grade_points: 16,
  ijmb_results: [
    { subject: 'Biology', caScore: 18, examScore: 64, totalScore: 82, letterGrade: 'A', gradePoint: 5, interpretation: 'Excellent' },
    { subject: 'Chemistry', caScore: 17, examScore: 58, totalScore: 75, letterGrade: 'A', gradePoint: 5, interpretation: 'Excellent' },
    { subject: 'Physics', caScore: 16, examScore: 55, totalScore: 71, letterGrade: 'A', gradePoint: 5, interpretation: 'Excellent' }
  ]
};

export const MOCK_STUDENT_RESULTS: ResultEntry[] = [
  { course_code: 'IJMB-BIO', course_title: 'Advanced Level Biology (Paper I, II & Practical)', units: 5, score: 82, grade: 'A', grade_point: 5.0 },
  { course_code: 'IJMB-CHM', course_title: 'Advanced Level Chemistry (Inorganic, Organic & Physical)', units: 5, score: 75, grade: 'A', grade_point: 5.0 },
  { course_code: 'IJMB-PHY', course_title: 'Advanced Level Physics (Mechanics, Optics & Lab Practical)', units: 5, score: 71, grade: 'A', grade_point: 5.0 }
];

export const MOCK_CBT_QUESTIONS: CBTQuestion[] = [
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

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2025-08-01 08:00:00',
    actor: 'Dr. Muhammad Baba Suleiman (Magajin Ilimin Abaji)',
    role: 'SUPER_ADMIN',
    action: 'INSTITUTION_FOUNDED',
    details: 'Al-Hidayah College of Advanced Studies IJMB Study Centre formally established at JSS Agyana Road, Abaji.',
    ip_address: '197.210.64.12'
  },
  {
    id: 'log-02',
    timestamp: '2025-08-15 10:30:00',
    actor: 'Mall. Usman Saidu (Registrar)',
    role: 'REGISTRAR',
    action: 'PIONEER_STUDENTS_ENROLLED',
    details: 'Pioneering cohort of 6 students matriculated under Sam Ale College of Advanced Studies collaboration.',
    ip_address: '197.210.64.15'
  }
];
