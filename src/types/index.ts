export type ProgrammeCategory = 'ND' | 'HND' | 'IJMB' | 'Professional';

export interface Programme {
  id: string;
  title: string;
  slug: string;
  category: ProgrammeCategory;
  department: string;
  duration: string;
  description: string;
  entryRequirements: string[];
  curriculumHighlights: string[];
  careerPathways: string[];
  feeEstimate: string;
  accreditationStatus: 'NBTE Approved' | 'Fully Accredited' | 'Institutional Approval Pending';
  affiliation?: string;
}

export interface IJMBSubjectCombination {
  code: string;
  subjects: string;
  possibleCourses: string;
}

export interface UniversityRequirement {
  faculty: string;
  course: string;
  points: number;
}

export interface IJMBResultEntry {
  subject: string;
  caScore: number;    // out of 20 (Continuous Assessment)
  examScore: number;  // out of 80 (Examination)
  totalScore: number; // caScore + examScore
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  gradePoint: number; // A=5, B=4, C=3, D=2, E=1, F=0
  interpretation: string; // Excellent, Very Good, Good, Merit, Pass, Fail
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: 'Academic' | 'Admissions' | 'Events' | 'Campus Life' | 'Press Release';
  summary: string;
  content: string;
  publishDate: string;
  image: string;
  author: string;
  featured?: boolean;
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

export interface FAQItem {
  id: string;
  category: 'General' | 'Admissions' | 'Tuition & Fees' | 'E-Learning' | 'Scratch Cards' | 'Hostel & Clearance' | 'Study Centre & Lectures' | 'IJMB Direct Entry' | 'Subject Combinations' | 'E-Library & Laboratory';
  question: string;
  questionHa?: string;
  answer: string;
  answerHa?: string;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  date: string;
  category: 'Admission' | 'Registration' | 'Lectures' | 'Exams' | 'Break';
  semester: string;
}

export type ApplicationStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Shortlisted' | 'Admitted' | 'Rejected';

export interface ApplicationRecord {
  id: string;
  ref_number: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  state_of_origin: string;
  lga?: string;
  programme_id: string;
  programme_title: string;
  category: ProgrammeCategory;
  subject_combination_code?: string;
  subject_combination_name?: string;
  target_university_course?: string;
  jamb_reg_no?: string;
  jamb_score?: number;
  nin_number?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_address?: string;
  olevel_sitting_1: string;
  olevel_sitting_2?: string;
  status: ApplicationStatus;
  submitted_at: string;
  scratch_card_serial?: string;
  admission_letter_released: boolean;
  passport_photo?: string;
  study_centre?: string;
  form_fee_paid?: boolean;
}

export interface StudentRecord {
  id: string;
  matric_number: string;
  full_name: string;
  email: string;
  phone: string;
  passport_photo: string;
  programme: string;
  department: string;
  level: string; // e.g. "IJMB Year 1", "ND I", "ND II", "HND I"
  semester: string; // "First Semester" | "Second Semester"
  cgpa: number;
  total_credits: number;
  study_centre: string;
  subject_combination_code?: string;
  subject_combination?: string[];
  registration_status: 'Completed' | 'Pending Approval' | 'Not Started';
  tuition_status: 'Paid' | 'Partial' | 'Unpaid';
  total_tuition: number;
  first_installment_paid: boolean;
  second_installment_paid: boolean;
  outstanding_balance: number;
  hostel_allocated?: string;
  siwes_status?: 'Not Eligible' | 'Eligible' | 'Placement Confirmed' | 'Logbook Submitted';
  nycs_status?: 'Not Eligible' | 'Mobilization Pending' | 'Cleared for NYSC';
  ijmb_results?: IJMBResultEntry[];
  cumulative_grade_points?: number;
  has_bonus_point?: boolean;
}

export interface Course {
  code: string;
  title: string;
  units: number;
  semester: 'First' | 'Second';
  level: string;
  type: 'Core' | 'Elective';
  lecturer: string;
}

export interface ResultEntry {
  course_code: string;
  course_title: string;
  units: number;
  score: number;
  grade: 'A' | 'AB' | 'B' | 'BC' | 'C' | 'CD' | 'D' | 'F';
  grade_point: number;
}

export type ScratchCardType = 'APPLICATION' | 'ADMISSION_STATUS' | 'RESULT_CHECKING' | 'TRANSCRIPT';

export interface ScratchCard {
  serial_number: string;
  card_type: ScratchCardType;
  price_ngn: number;
  status: 'Active' | 'Consumed' | 'Voided';
  generated_at: string;
  expires_at: string;
  consumed_by?: string;
  consumed_at?: string;
}

export interface CBTQuestion {
  id: string;
  course_code: string;
  question: string;
  options: string[];
  correct_option: number; // 0-indexed
  explanation?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  ip_address: string;
}

export interface AccessibilitySettings {
  theme: 'light' | 'dark';
  textScale: 'small' | 'normal' | 'large';
  highContrast: boolean;
  language: 'en' | 'ha';
  motionReduced: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  qualification: string;
  bio: string;
  photoUrl: string;
  duties: string;
  email?: string;
}
