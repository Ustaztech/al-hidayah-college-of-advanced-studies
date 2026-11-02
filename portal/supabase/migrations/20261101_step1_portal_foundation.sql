-- =============================================================================
-- AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
-- STEP 1: INTEGRATED STUDENT & STAFF PORTAL FOUNDATION MIGRATION
-- Database: Supabase PostgreSQL with Row Level Security (RLS)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  avatar_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Roles
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL CHECK (
    name IN (
      'super_admin',
      'college_admin',
      'student',
      'lecturer',
      'staff',
      'hod',
      'registrar',
      'examination_officer',
      'bursar'
    )
  ),
  description text NOT NULL
);

INSERT INTO public.roles (name, description) VALUES
  ('super_admin', 'Supreme Institutional Governance & Systems Controller'),
  ('college_admin', 'College Academic Operations & Administrative Oversight'),
  ('student', 'Matriculated Candidate Enrolled in Academic Programmes'),
  ('lecturer', 'Academic Faculty Member Responsible for Instruction & Assessment'),
  ('staff', 'Non-Teaching / General College Support Personnel'),
  ('hod', 'Head of Academic Department'),
  ('registrar', 'Chief Custodian of Admissions, Student Records & Transcripts'),
  ('examination_officer', 'Directorate of External & Internal Examinations'),
  ('bursar', 'College Bursary, Tuitions & Financial Reconciliations')
ON CONFLICT (name) DO NOTHING;

-- 3. User Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  assigned_by uuid REFERENCES public.profiles(id),
  CONSTRAINT uq_user_role UNIQUE (user_id, role_id)
);

-- 4. Departments
CREATE TABLE IF NOT EXISTS public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.departments (name, code, status) VALUES
  ('Department of Biological & Life Sciences', 'DEPT-BIO', 'active'),
  ('Department of Chemical & Physical Sciences', 'DEPT-CHM-PHY', 'active'),
  ('Department of Mathematics & Computing', 'DEPT-MTH-COMP', 'active'),
  ('Department of Arts, Languages & Humanities', 'DEPT-ARTS', 'active'),
  ('Department of Social & Management Sciences', 'DEPT-SMS', 'active'),
  ('Registry & Academic Affairs Directorate', 'DEPT-REGISTRY', 'active'),
  ('Bursary & Financial Services', 'DEPT-BURSARY', 'active')
ON CONFLICT (code) DO NOTHING;

-- 5. Programmes
CREATE TABLE IF NOT EXISTS public.programmes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Students
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matric_number text UNIQUE NOT NULL,
  programme_id uuid REFERENCES public.programmes(id) ON DELETE RESTRICT,
  level text NOT NULL DEFAULT '100' CHECK (level IN ('100', '200', 'IJMB 1', 'IJMB 2', 'ND 1', 'ND 2')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'suspended')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Staff
CREATE TABLE IF NOT EXISTS public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  staff_number text UNIQUE NOT NULL,
  department_id uuid REFERENCES public.departments(id) ON DELETE RESTRICT,
  designation text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.profiles(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_students_matric ON public.students(matric_number);
CREATE INDEX IF NOT EXISTS idx_students_user ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_number ON public.staff(staff_number);
CREATE INDEX IF NOT EXISTS idx_staff_user ON public.staff(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_composite ON public.user_roles(user_id, role_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id, created_at);

-- Helper functions
CREATE OR REPLACE FUNCTION public.current_user_has_role(required_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND (r.name = required_role OR r.name = 'super_admin')
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND r.name IN ('super_admin', 'college_admin')
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.resolve_login_identifier(identifier_input text)
RETURNS TABLE (resolved_email text, identifier_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_input text := trim(identifier_input);
BEGIN
  IF clean_input LIKE '%@%' THEN
    IF EXISTS (SELECT 1 FROM public.profiles WHERE lower(email) = lower(clean_input)) THEN
      RETURN QUERY SELECT lower(clean_input), 'email'::text;
      RETURN;
    END IF;
  END IF;

  SELECT p.email INTO resolved_email
  FROM public.students s
  JOIN public.profiles p ON s.user_id = p.id
  WHERE lower(s.matric_number) = lower(clean_input)
  LIMIT 1;

  IF resolved_email IS NOT NULL THEN
    RETURN QUERY SELECT resolved_email, 'matric_number'::text;
    RETURN;
  END IF;

  SELECT p.email INTO resolved_email
  FROM public.staff st
  JOIN public.profiles p ON st.user_id = p.id
  WHERE lower(st.staff_number) = lower(clean_input)
  LIMIT 1;

  IF resolved_email IS NOT NULL THEN
    RETURN QUERY SELECT resolved_email, 'staff_number'::text;
    RETURN;
  END IF;

  RETURN;
END;
$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.current_user_is_admin());
CREATE POLICY "Users can update own contact details" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.current_user_is_admin()) WITH CHECK (id = auth.uid() OR public.current_user_is_admin());
CREATE POLICY "Authenticated users can view roles" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read own assigned roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.current_user_is_admin());
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL TO authenticated USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());
CREATE POLICY "Anyone authenticated can view departments" ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL TO authenticated USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());
CREATE POLICY "Anyone authenticated can view programmes" ON public.programmes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage programmes" ON public.programmes FOR ALL TO authenticated USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());
CREATE POLICY "Student can view own record or admins view all" ON public.students FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.current_user_is_admin() OR public.current_user_has_role('registrar') OR public.current_user_has_role('examination_officer'));
CREATE POLICY "Admins and Registrar can manage students" ON public.students FOR ALL TO authenticated USING (public.current_user_is_admin() OR public.current_user_has_role('registrar')) WITH CHECK (public.current_user_is_admin() OR public.current_user_has_role('registrar'));
CREATE POLICY "Staff can view own record or admins view all" ON public.staff FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.current_user_is_admin());
CREATE POLICY "Admins can manage staff" ON public.staff FOR ALL TO authenticated USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.current_user_is_admin());
CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());
