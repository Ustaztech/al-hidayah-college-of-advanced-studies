-- =============================================================================
-- AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
-- STEP 3 MIGRATION: ONLINE ADMISSION APPLICATION SYSTEM
-- Integrates multi-step application workflow, qualifications, document uploads,
-- and administrative admission session controls with Row Level Security (RLS)
-- =============================================================================

-- 1. Create admission_sessions table
CREATE TABLE IF NOT EXISTS public.admission_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g. "2026/2027 Academic Session"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial active 2026/2027 admission session
INSERT INTO public.admission_sessions (name, start_date, end_date, is_active)
VALUES ('2026/2027 Academic Session', '2026-09-01', '2027-08-31', true)
ON CONFLICT (name) DO NOTHING;

-- 2. Create admission_programmes table
CREATE TABLE IF NOT EXISTS public.admission_programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_session_id UUID NOT NULL REFERENCES public.admission_sessions(id) ON DELETE CASCADE,
    programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE RESTRICT,
    application_type_id UUID NOT NULL REFERENCES public.application_types(id) ON DELETE RESTRICT,
    application_open BOOLEAN NOT NULL DEFAULT true,
    application_deadline TIMESTAMPTZ NOT NULL,
    duration TEXT DEFAULT '1 Academic Session (9 Months)',
    entry_requirements TEXT DEFAULT 'Minimum 5 O-Level Credit passes including English Language & Mathematics in not more than 2 sittings.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(admission_session_id, programme_id, application_type_id)
);

CREATE INDEX IF NOT EXISTS idx_admission_prog_session ON public.admission_programmes(admission_session_id);
CREATE INDEX IF NOT EXISTS idx_admission_prog_open ON public.admission_programmes(application_open);

-- 3. Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID NOT NULL UNIQUE REFERENCES public.applicants(id) ON DELETE CASCADE,
    admission_session_id UUID NOT NULL REFERENCES public.admission_sessions(id) ON DELETE RESTRICT,
    admission_programme_id UUID REFERENCES public.admission_programmes(id) ON DELETE SET NULL,
    application_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'in_progress', 'submitted', 'under_review', 'action_required', 'accepted', 'rejected')),
    submitted_at TIMESTAMPTZ,
    submission_reference TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_applications_applicant ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_session ON public.applications(admission_session_id);

-- 4. Create application_personal_details table
CREATE TABLE IF NOT EXISTS public.application_personal_details (
    application_id UUID PRIMARY KEY REFERENCES public.applications(id) ON DELETE CASCADE,
    surname TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    marital_status TEXT DEFAULT 'Single',
    nationality TEXT NOT NULL DEFAULT 'Nigerian',
    state_of_origin TEXT NOT NULL,
    lga_of_origin TEXT NOT NULL,
    passport_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Create application_contact_details table
CREATE TABLE IF NOT EXISTS public.application_contact_details (
    application_id UUID PRIMARY KEY REFERENCES public.applications(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    alternative_phone TEXT,
    residential_address TEXT NOT NULL,
    state_of_residence TEXT NOT NULL,
    lga_of_residence TEXT NOT NULL,
    city TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Create application_guardians table (Next of Kin / Parent)
CREATE TABLE IF NOT EXISTS public.application_guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_app_guardians_app_id ON public.application_guardians(application_id);

-- 7. Create academic_qualifications table
CREATE TABLE IF NOT EXISTS public.academic_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    qualification_type TEXT NOT NULL CHECK (qualification_type IN ('WAEC', 'NECO', 'NABTEB', 'DIPLOMA', 'NCE', 'OTHER')),
    institution TEXT,
    examination_year INT NOT NULL,
    examination_number TEXT NOT NULL,
    sitting TEXT NOT NULL CHECK (sitting IN ('First Sitting', 'Second Sitting')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_academic_qual_app_id ON public.academic_qualifications(application_id);

-- 8. Create qualification_subjects table (Subjects & Grades)
CREATE TABLE IF NOT EXISTS public.qualification_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qualification_id UUID NOT NULL REFERENCES public.academic_qualifications(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    grade TEXT NOT NULL CHECK (grade IN ('A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9', 'PASS', 'CREDIT', 'DISTINCTION', 'MERIT')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_qual_subj_qual_id ON public.qualification_subjects(qualification_id);

-- 9. Create application_documents table
CREATE TABLE IF NOT EXISTS public.application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('passport_photo', 'olevel_result', 'birth_certificate', 'origin_certificate', 'previous_transcript', 'other')),
    file_name TEXT NOT NULL,
    file_size INT NOT NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(application_id, document_type)
);

CREATE INDEX IF NOT EXISTS idx_app_docs_app_id ON public.application_documents(application_id);

-- 10. Create application_status_history table
CREATE TABLE IF NOT EXISTS public.application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_app_status_hist_app_id ON public.application_status_history(application_id);

-- 11. Row Level Security (RLS) Setup
ALTER TABLE public.admission_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_personal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_contact_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualification_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;

-- 11.1 Admission Sessions & Programmes (Public read, Admin manage)
CREATE POLICY "Public view active admission sessions" ON public.admission_sessions
    FOR SELECT USING (is_active = true OR public.current_user_is_admin());

CREATE POLICY "Admin manage admission sessions" ON public.admission_sessions
    FOR ALL USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());

CREATE POLICY "Public view open admission programmes" ON public.admission_programmes
    FOR SELECT USING (application_open = true OR public.current_user_is_admin());

CREATE POLICY "Admin manage admission programmes" ON public.admission_programmes
    FOR ALL USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());

-- 11.2 Helper function to check if current auth user owns application
CREATE OR REPLACE FUNCTION public.current_user_owns_application(p_application_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.applications app
        JOIN public.applicants a ON app.applicant_id = a.id
        WHERE app.id = p_application_id AND a.user_id = auth.uid()
    );
$$;

-- 11.3 Applications Policies
CREATE POLICY "Applicants view own application" ON public.applications
    FOR SELECT USING (
        applicant_id IN (SELECT id FROM public.applicants WHERE user_id = auth.uid())
        OR public.current_user_is_admin()
    );

CREATE POLICY "Applicants update own draft application" ON public.applications
    FOR UPDATE USING (
        (applicant_id IN (SELECT id FROM public.applicants WHERE user_id = auth.uid()) AND status IN ('draft', 'in_progress'))
        OR public.current_user_is_admin()
    )
    WITH CHECK (
        (applicant_id IN (SELECT id FROM public.applicants WHERE user_id = auth.uid()))
        OR public.current_user_is_admin()
    );

CREATE POLICY "Applicants insert own application" ON public.applications
    FOR INSERT WITH CHECK (
        applicant_id IN (SELECT id FROM public.applicants WHERE user_id = auth.uid())
        OR public.current_user_is_admin()
    );

-- 11.4 Child Entities Policies (Personal, Contact, Guardians, Qualifications, Documents)
CREATE POLICY "Applicants manage personal details" ON public.application_personal_details
    FOR ALL USING (public.current_user_owns_application(application_id) OR public.current_user_is_admin())
    WITH CHECK (public.current_user_owns_application(application_id) OR public.current_user_is_admin());

CREATE POLICY "Applicants manage contact details" ON public.application_contact_details
    FOR ALL USING (public.current_user_owns_application(application_id) OR public.current_user_is_admin())
    WITH CHECK (public.current_user_owns_application(application_id) OR public.current_user_is_admin());

CREATE POLICY "Applicants manage guardians" ON public.application_guardians
    FOR ALL USING (public.current_user_owns_application(application_id) OR public.current_user_is_admin())
    WITH CHECK (public.current_user_owns_application(application_id) OR public.current_user_is_admin());

CREATE POLICY "Applicants manage qualifications" ON public.academic_qualifications
    FOR ALL USING (public.current_user_owns_application(application_id) OR public.current_user_is_admin())
    WITH CHECK (public.current_user_owns_application(application_id) OR public.current_user_is_admin());

CREATE POLICY "Applicants manage subjects" ON public.qualification_subjects
    FOR ALL USING (
        qualification_id IN (
            SELECT q.id FROM public.academic_qualifications q
            WHERE public.current_user_owns_application(q.application_id)
        ) OR public.current_user_is_admin()
    )
    WITH CHECK (
        qualification_id IN (
            SELECT q.id FROM public.academic_qualifications q
            WHERE public.current_user_owns_application(q.application_id)
        ) OR public.current_user_is_admin()
    );

CREATE POLICY "Applicants manage documents" ON public.application_documents
    FOR ALL USING (public.current_user_owns_application(application_id) OR public.current_user_is_admin())
    WITH CHECK (public.current_user_owns_application(application_id) OR public.current_user_is_admin());

CREATE POLICY "View application status history" ON public.application_status_history
    FOR SELECT USING (public.current_user_owns_application(application_id) OR public.current_user_is_admin());
