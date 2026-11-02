import { ScratchCard, ApplicationRecord, StudentRecord, ResultEntry, CBTQuestion, AuditLog } from '../types';

// Clean production datasets - No fabricated candidate records
export const INITIAL_SCRATCH_CARDS: ScratchCard[] = [];
export const INITIAL_APPLICANTS: ApplicationRecord[] = [];
export const MOCK_STUDENT: StudentRecord | null = null;
export const MOCK_STUDENT_RESULTS: ResultEntry[] = [];

// Standard academic questions for IJMB CBT practice
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
  },
  {
    id: 'q4',
    course_code: 'IJMB-MTH',
    question: 'Evaluate the limit of (sin x)/x as x approaches 0 in radian measure.',
    options: ['0', '1', 'Infinity', 'Undefined'],
    correct_option: 1,
    explanation: 'By standard calculus limit theorems, lim (x->0) sin(x)/x = 1.'
  },
  {
    id: 'q5',
    course_code: 'IJMB-GOV',
    question: 'The supreme law from which all government authority is derived in a constitutional democracy is the:',
    options: ['Manifesto', 'Constitution', 'Decree', 'Gazette'],
    correct_option: 1,
    explanation: 'The Constitution represents the grundnorm and supreme legal framework of a democratic state.'
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
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
