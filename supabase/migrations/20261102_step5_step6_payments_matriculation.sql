-- =============================================================================
-- AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
-- STEPS 5 & 6: ACCEPTANCE FEE PAYMENTS & STUDENT MATRICULATION MIGRATION
-- Reference: NSUK Integrated Undergraduate Portal Workflow
-- Domain: portal.alhidayahcollege.com.ng
-- =============================================================================

-- 1. FEE INVOICES TABLE (Remita / Electronic Billing)
CREATE TABLE IF NOT EXISTS fee_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  fee_type VARCHAR(50) NOT NULL CHECK (fee_type IN ('acceptance_fee', 'tuition_fee', 'screening_fee')),
  fee_name VARCHAR(150) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'NGN',
  rrr_number VARCHAR(50) UNIQUE NOT NULL,
  session_id UUID NOT NULL REFERENCES admission_sessions(id) ON DELETE RESTRICT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ DEFAULT NULL
);

-- 2. FEE PAYMENTS & BURSARY RECEIPTS TABLE
CREATE TABLE IF NOT EXISTS fee_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID UNIQUE NOT NULL REFERENCES fee_invoices(id) ON DELETE RESTRICT,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  payment_reference VARCHAR(100) UNIQUE NOT NULL,
  receipt_number VARCHAR(100) UNIQUE NOT NULL,
  amount_paid NUMERIC(12, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('card', 'bank_transfer', 'ussd', 'bank_branch')),
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(50) NOT NULL DEFAULT 'successful' CHECK (status IN ('successful', 'failed', 'pending')),
  payer_name VARCHAR(150) NOT NULL,
  payer_email VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MATRICULATION RECORDS TABLE
CREATE TABLE IF NOT EXISTS matriculation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID UNIQUE NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  student_id UUID UNIQUE NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  matric_number VARCHAR(50) UNIQUE NOT NULL,
  session_id UUID NOT NULL REFERENCES admission_sessions(id) ON DELETE RESTRICT,
  programme_id UUID NOT NULL REFERENCES programmes(id) ON DELETE RESTRICT,
  level VARCHAR(20) NOT NULL DEFAULT 'IJMB 1',
  cleared_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  matriculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_invoices_application_id ON fee_invoices(application_id);
CREATE INDEX IF NOT EXISTS idx_invoices_rrr ON fee_invoices(rrr_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON fee_invoices(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON fee_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_receipt ON fee_payments(receipt_number);
CREATE INDEX IF NOT EXISTS idx_matriculation_student ON matriculation_records(student_id);
CREATE INDEX IF NOT EXISTS idx_matriculation_number ON matriculation_records(matric_number);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE matriculation_records ENABLE ROW LEVEL SECURITY;

-- Applicants can view their own invoices & payments
CREATE POLICY applicant_view_own_invoices ON fee_invoices
  FOR SELECT
  USING (
    applicant_id IN (
      SELECT id FROM applicants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY applicant_view_own_payments ON fee_payments
  FOR SELECT
  USING (
    application_id IN (
      SELECT a.id FROM applications a
      JOIN applicants ap ON a.applicant_id = ap.id
      WHERE ap.user_id = auth.uid()
    )
  );

-- Bursary and Super Admin have full access to financial reconciliation
CREATE POLICY bursar_manage_invoices ON fee_invoices
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'college_admin', 'bursar')
    )
  );

CREATE POLICY bursar_manage_payments ON fee_payments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'college_admin', 'bursar')
    )
  );

-- Registry has full access to matriculation records
CREATE POLICY registry_manage_matriculation ON matriculation_records
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'college_admin', 'registrar')
    )
  );
