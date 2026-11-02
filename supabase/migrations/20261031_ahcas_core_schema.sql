-- =============================================================================
-- AL-HIDAYAH COLLEGE OF ADVANCED STUDIES (AHCAS) DIGITAL CAMPUS
-- Master PostgreSQL / Supabase Schema & Security Migration
-- Version: 1.0.0
-- Document Code: AHC/IJMB/OQAM/2026
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. PROFILES & ROLE-BASED ACCESS CONTROL (RBAC)
-- =============================================================================

CREATE TYPE institutional_role AS ENUM (
  'SUPER_ADMIN',
  'PRINCIPAL',
  'PROVOST',
  'COUNCIL_MEMBER',
  'REGISTRAR',
  'ADMISSIONS_OFFICER',
  'FINANCE_OFFICER',
  'ACADEMIC_OFFICER',
  'LECTURER',
  'EXAMINATION_OFFICER',
  'LIBRARIAN',
  'ICT_OFFICER',
  'QUALITY_ASSURANCE_OFFICER',
  'STUDENT_AFFAIRS_OFFICER',
  'STUDENT',
  'APPLICANT',
  'ALUMNI',
  'PARENT_SPONSOR',
  'STAFF'
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  primary_role institutional_role NOT NULL DEFAULT 'APPLICANT',
  department TEXT,
  designation TEXT,
  matric_number TEXT UNIQUE,
  ref_number TEXT UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role institutional_role NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_by UUID REFERENCES public.profiles(id),
  UNIQUE (user_id, role)
);

-- =============================================================================
-- 2. ADMISSIONS & APPLICANT MANAGEMENT
-- =============================================================================

CREATE TYPE application_status AS ENUM (
  'Draft',
  'Submitted',
  'Under Review',
  'Shortlisted',
  'Admitted',
  'Rejected'
);

CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ref_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  date_of_birth DATE,
  state_of_origin TEXT NOT NULL,
  lga TEXT NOT NULL,
  nin_number TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_address TEXT,
  programme_id TEXT NOT NULL,
  programme_title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('IJMB', 'ND', 'HND', 'Professional')),
  subject_combination_code TEXT,
  subject_combination_name TEXT,
  target_university_course TEXT,
  jamb_reg_no TEXT,
  jamb_score INTEGER,
  olevel_sitting_1 JSONB NOT NULL,
  olevel_sitting_2 JSONB,
  status application_status NOT NULL DEFAULT 'Draft',
  scratch_card_serial TEXT,
  admission_letter_released BOOLEAN NOT NULL DEFAULT FALSE,
  study_centre TEXT DEFAULT 'JSS Agyana Road Study Centre, Abaji Abuja',
  form_fee_paid BOOLEAN NOT NULL DEFAULT FALSE,
  submitted_at TIMESTAMPTZ,
  decision_at TIMESTAMPTZ,
  decision_by UUID REFERENCES public.profiles(id),
  decision_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. STUDENT INFORMATION SYSTEM (SIS)
-- =============================================================================

CREATE TYPE student_status AS ENUM (
  'Enrolled',
  'Suspended',
  'Graduated',
  'Withdrawn',
  'Probation'
);

CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  application_id UUID UNIQUE REFERENCES public.applications(id),
  matric_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  programme TEXT NOT NULL,
  department TEXT NOT NULL,
  level TEXT NOT NULL,
  semester TEXT NOT NULL DEFAULT '1st Semester',
  study_centre TEXT NOT NULL DEFAULT 'JSS Agyana Road Study Centre, Abaji Abuja',
  subject_combination TEXT[],
  status student_status NOT NULL DEFAULT 'Enrolled',
  total_tuition NUMERIC(12,2) NOT NULL DEFAULT 258500.00,
  first_installment_paid BOOLEAN NOT NULL DEFAULT FALSE,
  second_installment_paid BOOLEAN NOT NULL DEFAULT FALSE,
  outstanding_balance NUMERIC(12,2) NOT NULL DEFAULT 258500.00,
  cumulative_grade_points INTEGER DEFAULT 0,
  has_bonus_point BOOLEAN DEFAULT FALSE,
  hostel_allocated TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_session TEXT NOT NULL DEFAULT '2026/2027',
  semester TEXT NOT NULL CHECK (semester IN ('1st Semester', '2nd Semester')),
  registered_courses JSONB NOT NULL,
  total_units INTEGER NOT NULL,
  approved_by_coordinator BOOLEAN NOT NULL DEFAULT FALSE,
  approved_by UUID REFERENCES public.profiles(id),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 4. LEARNING MANAGEMENT SYSTEM (LMS) & CBT
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  semester TEXT NOT NULL,
  credit_units INTEGER NOT NULL,
  description TEXT,
  lecturer_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_markdown TEXT,
  video_url TEXT,
  resource_file_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cbt_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option INTEGER NOT NULL,
  explanation TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cbt_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  score_percent NUMERIC(5,2) NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 5. EXAMINATIONS & RESULTS (16-POINT IJMB GRADING ENGINE)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_title TEXT NOT NULL,
  ca_score NUMERIC(5,2) NOT NULL CHECK (ca_score >= 0 AND ca_score <= 20),
  exam_score NUMERIC(5,2) NOT NULL CHECK (exam_score >= 0 AND exam_score <= 80),
  total_score NUMERIC(5,2) GENERATED ALWAYS AS (ca_score + exam_score) STORED,
  letter_grade TEXT NOT NULL CHECK (letter_grade IN ('A', 'B', 'C', 'D', 'E', 'F')),
  grade_point INTEGER NOT NULL CHECK (grade_point >= 0 AND grade_point <= 5),
  interpretation TEXT NOT NULL,
  academic_session TEXT NOT NULL DEFAULT '2026/2027',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  entered_by UUID REFERENCES public.profiles(id),
  moderated_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_code, academic_session)
);

-- =============================================================================
-- 6. FINANCE, INVOICES & PAYMENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  fee_type TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  balance NUMERIC(12,2) NOT NULL,
  academic_session TEXT NOT NULL DEFAULT '2026/2027',
  status TEXT NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Unpaid', 'Partially Paid', 'Paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id),
  student_id UUID REFERENCES public.students(id),
  matric_number TEXT,
  student_name TEXT NOT NULL,
  reference TEXT UNIQUE NOT NULL,
  receipt_number TEXT UNIQUE NOT NULL,
  fee_type TEXT NOT NULL,
  amount_ngn NUMERIC(12,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Paystack', 'Remita', 'Bank Transfer', 'Scratch Card')),
  status TEXT NOT NULL DEFAULT 'Successful' CHECK (status IN ('Successful', 'Pending', 'Failed')),
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.scratch_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number TEXT UNIQUE NOT NULL,
  pin_hash TEXT UNIQUE NOT NULL,
  card_type TEXT NOT NULL CHECK (card_type IN ('APPLICATION', 'ADMISSION_STATUS', 'RESULT_CHECKING', 'TRANSCRIPT')),
  price_ngn NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Consumed', 'Voided')),
  usage_count INTEGER NOT NULL DEFAULT 0,
  max_usage INTEGER NOT NULL DEFAULT 5,
  consumed_by TEXT,
  consumed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 7. COUNCIL & GOVERNANCE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.council_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  meeting_date TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Adjourned', 'Concluded')),
  agenda_items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.board_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.council_meetings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_ref TEXT UNIQUE NOT NULL,
  classification TEXT NOT NULL DEFAULT 'Confidential' CHECK (classification IN ('Standard', 'Confidential', 'Secret')),
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.council_meetings(id) ON DELETE CASCADE,
  resolution_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Adopted' CHECK (status IN ('Draft', 'Adopted', 'Rejected', 'Implemented')),
  adopted_date DATE NOT NULL,
  action_assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 8. NOTIFICATIONS & IMMUTABLE AUDIT LOGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role institutional_role,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Admissions', 'Finance', 'Academic', 'Council', 'System', 'Examinations', 'Welfare')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  action_url TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id),
  actor_email TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user has given role
CREATE OR REPLACE FUNCTION public.has_role(checked_role institutional_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = checked_role
  ) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND primary_role IN ('SUPER_ADMIN', checked_role)
  );
$$;

-- Profiles: Users see own profile, Staff see profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR public.has_role('SUPER_ADMIN') OR public.has_role('REGISTRAR'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Applications: Applicants see own application; Admissions officers manage all
CREATE POLICY "Applicants see own applications" ON public.applications
  FOR SELECT USING (applicant_id = auth.uid() OR public.has_role('ADMISSIONS_OFFICER') OR public.has_role('REGISTRAR') OR public.has_role('SUPER_ADMIN'));

CREATE POLICY "Applicants insert own application" ON public.applications
  FOR INSERT WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Admissions staff manage applications" ON public.applications
  FOR UPDATE USING (applicant_id = auth.uid() OR public.has_role('ADMISSIONS_OFFICER') OR public.has_role('REGISTRAR') OR public.has_role('SUPER_ADMIN'));

-- Students: Students see own records; Academic staff manage students
CREATE POLICY "Students see own record" ON public.students
  FOR SELECT USING (profile_id = auth.uid() OR public.has_role('REGISTRAR') OR public.has_role('ACADEMIC_OFFICER') OR public.has_role('SUPER_ADMIN'));

-- Results: Students view ONLY their published results
CREATE POLICY "Students see published results" ON public.results
  FOR SELECT USING (
    (student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) AND is_published = TRUE)
    OR public.has_role('EXAMINATION_OFFICER')
    OR public.has_role('REGISTRAR')
    OR public.has_role('SUPER_ADMIN')
  );

-- Board Papers: Accessible ONLY to Council Members, Provost & Registrar
CREATE POLICY "Council members access board papers" ON public.board_papers
  FOR SELECT USING (
    public.has_role('COUNCIL_MEMBER')
    OR public.has_role('PROVOST')
    OR public.has_role('PRINCIPAL')
    OR public.has_role('REGISTRAR')
    OR public.has_role('SUPER_ADMIN')
  );

-- Notifications: Targeted to user or target role
CREATE POLICY "Users view own notifications" ON public.notifications
  FOR SELECT USING (
    user_id = auth.uid()
    OR target_role = 'ALL'
    OR public.has_role(target_role)
  );

-- Audit logs: Viewable only by SUPER_ADMIN, PROVOST, and QUALITY_ASSURANCE_OFFICER
CREATE POLICY "Audit logs restricted view" ON public.audit_logs
  FOR SELECT USING (
    public.has_role('SUPER_ADMIN')
    OR public.has_role('PROVOST')
    OR public.has_role('QUALITY_ASSURANCE_OFFICER')
  );

-- =============================================================================
-- 10. STORAGE BUCKETS SPECIFICATION
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('applicant-documents', 'applicant-documents', false),
  ('student-documents', 'student-documents', false),
  ('admission-letters', 'admission-letters', false),
  ('council-papers', 'council-papers', false),
  ('financial-records', 'financial-records', false),
  ('lms-learning-assets', 'lms-learning-assets', false)
ON CONFLICT (id) DO NOTHING;
