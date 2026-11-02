-- =============================================================================
-- AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
-- STEP 4: ADMISSION PROCESSING, SCREENING & DECISION MANAGEMENT MIGRATION
-- Reference: NSUK Undergraduate Application Portal Workflow
-- Domain: portal.alhidayahcollege.com.ng
-- =============================================================================

CREATE TABLE IF NOT EXISTS admission_screenings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  screened_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  screening_status VARCHAR(50) NOT NULL CHECK (screening_status IN ('under_review', 'action_required', 'recommended_for_admission', 'not_recommended')),
  screening_score NUMERIC(5,2) DEFAULT NULL,
  olevel_verified BOOLEAN DEFAULT FALSE,
  credentials_verified BOOLEAN DEFAULT FALSE,
  action_required_note TEXT DEFAULT NULL,
  internal_notes TEXT DEFAULT NULL,
  screened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admission_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID UNIQUE NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  programme_id UUID NOT NULL REFERENCES programmes(id) ON DELETE RESTRICT,
  admission_session_id UUID NOT NULL REFERENCES admission_sessions(id) ON DELETE RESTRICT,
  offer_letter_number VARCHAR(100) UNIQUE NOT NULL,
  offer_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acceptance_deadline TIMESTAMPTZ NOT NULL,
  offer_status VARCHAR(50) NOT NULL DEFAULT 'offered' CHECK (offer_status IN ('offered', 'accepted', 'declined', 'lapsed')),
  responded_at TIMESTAMPTZ DEFAULT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_screenings_application_id ON admission_screenings(application_id);
CREATE INDEX IF NOT EXISTS idx_screenings_status ON admission_screenings(screening_status);
CREATE INDEX IF NOT EXISTS idx_offers_application_id ON admission_offers(application_id);
CREATE INDEX IF NOT EXISTS idx_offers_letter_number ON admission_offers(offer_letter_number);
CREATE INDEX IF NOT EXISTS idx_offers_status ON admission_offers(offer_status);

ALTER TABLE admission_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_offers ENABLE ROW LEVEL SECURITY;
