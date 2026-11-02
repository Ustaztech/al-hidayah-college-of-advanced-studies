export type UserRoleName =
  | 'super_admin'
  | 'college_admin'
  | 'student'
  | 'lecturer'
  | 'staff'
  | 'hod'
  | 'registrar'
  | 'examination_officer'
  | 'bursar'
  | 'applicant';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface Profile {
  id: string; // references auth.users(id)
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: UserRoleName;
  description: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  assigned_by: string | null;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface Programme {
  id: string;
  department_id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface Student {
  id: string;
  user_id: string;
  matric_number: string;
  programme_id: string | null;
  level: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  created_at: string;
}

export interface Staff {
  id: string;
  user_id: string;
  staff_number: string;
  department_id: string | null;
  designation: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  created_at: string;
}

export interface ApplicationType {
  id: string;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export type ApplicantRegistrationStatus =
  | 'pending_verification'
  | 'verified'
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'admitted'
  | 'rejected';

export interface Applicant {
  id: string;
  user_id: string;
  applicant_number: string;
  application_type_id: string;
  full_name: string | null;
  phone_number: string | null;
  registration_status: ApplicantRegistrationStatus;
  created_at: string;
  updated_at: string;
  // Joined fields for display
  application_type?: ApplicationType | null;
  email?: string;
}

export interface ApplicantEvent {
  id: string;
  applicant_id: string;
  event_type: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}

// =============================================================================
// STEP 3: ADMISSION APPLICATION SYSTEM DATA MODELS
// =============================================================================

export type ApplicationStatus =
  | 'draft'
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'action_required'
  | 'accepted'
  | 'rejected'
  | 'matriculated';

export interface AdmissionSession {
  id: string;
  name: string; // e.g. "2026/2027 Academic Session"
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface AdmissionProgramme {
  id: string;
  admission_session_id: string;
  programme_id: string;
  application_type_id: string;
  application_open: boolean;
  application_deadline: string;
  duration?: string;
  entry_requirements?: string;
  created_at: string;
  // Joined
  programme?: Programme;
  admission_session?: AdmissionSession;
  application_type?: ApplicationType;
}

export interface ApplicationPersonalDetails {
  application_id: string;
  surname: string;
  first_name: string;
  middle_name?: string | null;
  date_of_birth: string;
  gender: 'male' | 'female' | string;
  marital_status?: string | null;
  nationality: string;
  state_of_origin: string;
  lga_of_origin: string;
  passport_url?: string | null;
}

export interface ApplicationContactDetails {
  application_id: string;
  phone_number: string;
  alternative_phone?: string | null;
  residential_address: string;
  state_of_residence: string;
  lga_of_residence: string;
  city: string;
}

export interface ApplicationGuardian {
  id: string;
  application_id: string;
  full_name: string;
  relationship: string;
  phone_number: string;
  email?: string | null;
  address: string;
}

export interface QualificationSubject {
  id: string;
  qualification_id: string;
  subject: string;
  grade: string;
}

export interface AcademicQualification {
  id: string;
  application_id: string;
  qualification_type?: 'WAEC' | 'NECO' | 'NABTEB' | 'DIPLOMA' | string;
  exam_name?: string;
  institution?: string | null;
  examination_year?: number;
  exam_year?: string | number;
  examination_number?: string;
  exam_number?: string;
  sitting?: 'First Sitting' | 'Second Sitting' | string;
  exam_sitting?: string;
  centre_number?: string | null;
  subjects?: QualificationSubject[];
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  document_type: 'passport_photo' | 'olevel_result' | 'birth_certificate' | 'origin_certificate' | 'state_origin' | 'previous_transcript' | 'other';
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  uploaded_at: string;
}

export interface ApplicationStatusHistory {
  id: string;
  application_id: string;
  previous_status: ApplicationStatus;
  new_status: ApplicationStatus;
  changed_by: string;
  created_at: string;
}

export interface Application {
  id: string;
  applicant_id: string;
  admission_session_id: string;
  admission_programme_id?: string | null;
  application_number: string;
  status: ApplicationStatus;
  submitted_at?: string | null;
  submission_reference?: string | null;
  created_at: string;
  updated_at: string;
  // Nested relation entities
  personal_details?: ApplicationPersonalDetails | null;
  contact_details?: ApplicationContactDetails | null;
  guardians?: ApplicationGuardian[];
  qualifications?: AcademicQualification[];
  documents?: ApplicationDocument[];
  selected_programme?: AdmissionProgramme | null;
  admission_session?: AdmissionSession | null;
  applicant?: Applicant | null;
  screening?: AdmissionScreening | null;
  admission_offer?: AdmissionOffer | null;
  invoices?: FeeInvoice[];
  matriculation_record?: MatriculationRecord | null;
}

export type ScreeningStatus = 'under_review' | 'action_required' | 'recommended_for_admission' | 'not_recommended';
export type OfferStatus = 'offered' | 'accepted' | 'declined' | 'lapsed';

export interface AdmissionScreening {
  id: string;
  application_id: string;
  screened_by: string;
  screening_status: ScreeningStatus;
  screening_score?: number | null;
  olevel_verified: boolean;
  credentials_verified: boolean;
  action_required_note?: string | null;
  internal_notes?: string | null;
  screened_at: string;
  updated_at: string;
  screener_profile?: Profile | null;
}

export interface AdmissionOffer {
  id: string;
  application_id: string;
  programme_id: string;
  admission_session_id: string;
  offer_letter_number: string;
  offer_date: string;
  acceptance_deadline: string;
  offer_status: OfferStatus;
  responded_at?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  programme?: Programme | null;
  admission_session?: AdmissionSession | null;
}

export type FeeType = 'acceptance_fee' | 'tuition_fee' | 'screening_fee';
export type InvoiceStatus = 'pending' | 'paid' | 'cancelled';
export type PaymentStatus = 'successful' | 'failed' | 'pending';

export interface FeeInvoice {
  id: string;
  application_id: string;
  applicant_id: string;
  fee_type: FeeType;
  fee_name: string;
  amount: number;
  currency: string;
  rrr_number: string;
  session_id: string;
  session_name?: string;
  status: InvoiceStatus;
  created_at: string;
  paid_at?: string | null;
  payment?: FeePayment | null;
}

export interface FeePayment {
  id: string;
  invoice_id: string;
  application_id: string;
  payment_reference: string;
  receipt_number: string;
  amount_paid: number;
  payment_method: 'card' | 'bank_transfer' | 'ussd' | 'bank_branch';
  transaction_date: string;
  status: PaymentStatus;
  payer_name: string;
  payer_email: string;
  rrr_number: string;
}

export interface MatriculationRecord {
  id: string;
  application_id: string;
  student_id: string;
  matric_number: string;
  session_id: string;
  programme_id: string;
  level: string;
  cleared_by: string;
  matriculated_at: string;
  programme?: Programme | null;
}

export interface AuthSessionUser {
  id: string;
  email: string;
  profile: Profile;
  roles: UserRoleName[];
  student?: Student & { programme?: Programme | null };
  staff?: Staff & { department?: Department | null };
  applicant?: Applicant & { application_type?: ApplicationType | null };
  application?: Application | null;
}
