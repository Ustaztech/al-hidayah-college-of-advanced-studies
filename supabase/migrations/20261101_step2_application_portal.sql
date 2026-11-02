-- =============================================================================
-- AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
-- STEP 2 MIGRATION: APPLICATION REGISTRATION PORTAL
-- Extends the Step 1 Foundation without breaking existing structures
-- =============================================================================

-- 1. Ensure 'applicant' role exists in roles table
INSERT INTO public.roles (name, description)
VALUES ('applicant', 'Prospective College Applicant')
ON CONFLICT (name) DO NOTHING;

-- 2. Create application_types table
CREATE TABLE IF NOT EXISTS public.application_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial approved application types (configurable by administration)
INSERT INTO public.application_types (name, code, description, is_active)
VALUES
    ('IJMB Regular Admission', 'IJMB_REG', 'One-year intensive Cambridge/ABU A-Level direct entry programme', true),
    ('Direct Entry Programme', 'DE_PROG', 'Advanced level direct entry into 200-level university degree', true),
    ('Diploma Programme', 'DIP_PROG', 'Professional diploma in Management, Science and Information Technology', true),
    ('Certificate Programme', 'CERT_PROG', 'Specialized vocational and pre-university remedial certificate', true)
ON CONFLICT (code) DO NOTHING;

-- 3. Create sequence and generator for applicant numbers
-- Format: AHCAS/APP/{YEAR}/{00001}
CREATE SEQUENCE IF NOT EXISTS public.applicant_number_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION public.generate_applicant_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_year TEXT;
    v_seq INT;
    v_number TEXT;
BEGIN
    v_year := to_char(CURRENT_DATE, 'YYYY');
    v_seq := nextval('public.applicant_number_seq');
    v_number := 'AHCAS/APP/' || v_year || '/' || LPAD(v_seq::TEXT, 5, '0');
    RETURN v_number;
END;
$$;

-- 4. Create applicants table
CREATE TABLE IF NOT EXISTS public.applicants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    applicant_number TEXT NOT NULL UNIQUE DEFAULT public.generate_applicant_number(),
    application_type_id UUID NOT NULL REFERENCES public.application_types(id) ON DELETE RESTRICT,
    full_name TEXT,
    phone_number TEXT,
    registration_status TEXT NOT NULL DEFAULT 'pending_verification' 
        CHECK (registration_status IN ('pending_verification', 'verified', 'in_progress', 'submitted', 'under_review', 'admitted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applicants_user_id ON public.applicants(user_id);
CREATE INDEX IF NOT EXISTS idx_applicants_number ON public.applicants(applicant_number);
CREATE INDEX IF NOT EXISTS idx_applicants_type_id ON public.applicants(application_type_id);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON public.applicants(registration_status);

-- 5. Create applicant_events table (audit log for applicant lifecycle)
CREATE TABLE IF NOT EXISTS public.applicant_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID NOT NULL REFERENCES public.applicants(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_applicant_events_applicant ON public.applicant_events(applicant_id);

-- 6. Row Level Security (RLS) Setup
ALTER TABLE public.application_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicant_events ENABLE ROW LEVEL SECURITY;

-- 6.1 Policies for application_types
-- Public and authenticated users can view active application types
DROP POLICY IF EXISTS "Public can view active application types" ON public.application_types;
CREATE POLICY "Public can view active application types"
    ON public.application_types FOR SELECT
    USING (is_active = true OR public.current_user_is_admin());

-- Administrators can insert, update and delete application types
DROP POLICY IF EXISTS "Admins manage application types" ON public.application_types;
CREATE POLICY "Admins manage application types"
    ON public.application_types FOR ALL
    USING (public.current_user_is_admin())
    WITH CHECK (public.current_user_is_admin());

-- 6.2 Policies for applicants
-- Applicants can view only their own record, admins can view all
DROP POLICY IF EXISTS "Applicants view own record" ON public.applicants;
CREATE POLICY "Applicants view own record"
    ON public.applicants FOR SELECT
    USING (user_id = auth.uid() OR public.current_user_is_admin());

-- Applicants can update their own profile details
DROP POLICY IF EXISTS "Applicants update own record" ON public.applicants;
CREATE POLICY "Applicants update own record"
    ON public.applicants FOR UPDATE
    USING (user_id = auth.uid() OR public.current_user_is_admin())
    WITH CHECK (user_id = auth.uid() OR public.current_user_is_admin());

-- System or authenticated user can insert applicant profile
DROP POLICY IF EXISTS "Users can insert own applicant record" ON public.applicants;
CREATE POLICY "Users can insert own applicant record"
    ON public.applicants FOR INSERT
    WITH CHECK (user_id = auth.uid() OR public.current_user_is_admin());

-- 6.3 Policies for applicant_events
DROP POLICY IF EXISTS "Applicants view own events" ON public.applicant_events;
CREATE POLICY "Applicants view own events"
    ON public.applicant_events FOR SELECT
    USING (
        applicant_id IN (SELECT id FROM public.applicants WHERE user_id = auth.uid())
        OR public.current_user_is_admin()
    );

DROP POLICY IF EXISTS "System insert applicant events" ON public.applicant_events;
CREATE POLICY "System insert applicant events"
    ON public.applicant_events FOR INSERT
    WITH CHECK (
        applicant_id IN (SELECT id FROM public.applicants WHERE user_id = auth.uid())
        OR public.current_user_is_admin()
    );
