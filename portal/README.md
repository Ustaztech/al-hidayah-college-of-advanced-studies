# AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
## Integrated Student, Staff & Applicant Portal — Steps 1, 2, 3, 4, 5 & 6 Complete

This application is the institutional Student, Staff and Application Registration Portal for **Al-Hidayah College of Advanced Studies** (IJMB Study Centre 029, Abaji, FCT-Abuja, Nigeria). It is built as a production Next.js App Router application in `portal/`, engineered to work with Supabase PostgreSQL, Supabase Authentication, and Row Level Security (RLS).

---

## 1. Technology Stack
- **Framework**: Next.js 15 (App Router with Server Components and API Route Handlers)
- **Language**: TypeScript (Strict typing)
- **Styling**: Tailwind CSS & shadcn/ui design patterns (Custom institutional theme `#196855` Emerald & `#e69912` Gold)
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form with Zod schemas
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) policies
- **Deployment**: Vercel-compatible

---

## 2. Complete Route Architecture

### Public & Institutional Gateway
| Route | Access Level | Description |
|---|---|---|
| `/portal` | Public Gateway | Redirects unauthenticated users to `/portal/login`, authenticated users to their role dashboard |
| `/portal/login` | Public | Institutional login gateway with student/staff mode toggle, matric/staff/email identifier resolution |
| `/portal/forgot-password` | Public | Password reset request with Zod email validation |
| `/portal/reset-password` | Public | Secure password update interface |
| `/portal/unauthorised` | Authenticated | 403 Forbidden page with "Return to My Dashboard" and "Switch Account" |

### Application Registration & Multi-Step Admission System (Steps 2, 3, 5 & 6 — Inspired by NSUK)
| Route | Access Level | Description |
|---|---|---|
| `/application` | Public | Candidate application registration page with active programme dropdown, email, password validation |
| `/application/login` | Public | Applicant portal sign-in gateway with remember session and email verification guard |
| `/application/verify-email` | Public | Secure email verification gateway handling 24-hr tokens, resend link, and status updates |
| `/application/forgot-password` | Public | Applicant-specific password recovery request |
| `/application/reset-password` | Public | Applicant password update interface |
| `/application/dashboard` | Role: `applicant` | Applicant workspace with dynamic % progress, status cards, offer celebration banner, acceptance fee card, and matriculation banner |
| `/application/apply` | Role: `applicant` | 6-step responsive admission registration wizard (Personal, Contact, Guardian, O-Level Grid, Programme, Document Upload) |
| `/application/review` | Role: `applicant` | Complete pre-submission dossier summary with section edit triggers, attestation checkbox, and locking modal |
| `/application/slip` | Role: `applicant` | Official printable Acknowledgement Slip with college crest, barcode/ref, bio-data, course, and screening instructions |
| `/application/admission-letter` | Role: `applicant` | Official Provisional Admission Letter generator with institutional seal, registrar sign-off, acceptance countdown, and accept/decline triggers |
| `/application/payments` | Roles: `applicant`, `student` | **Step 5**: Remita Acceptance Fee Electronic Billing Desk (RRR: `2408-XXXX-XXXX`, ₦25,000 levy, Card, Transfer, USSD, Bank Branch slip) |
| `/application/receipt` | Roles: `applicant`, `student` | **Step 5**: Official College Bursary Payment Receipt with barcode, reference (`AHCAS/REC/2026/XXXXX`), and clean `@media print` layout |
| `/application/clearance` | Roles: `applicant`, `student` | **Step 6**: Official Registry Matriculation & Enrollment Clearance Slip with issued Matric Number (`AHCAS/2026/XXX`), Registrar endorsement |
| `/application/profile` | Role: `applicant` | Candidate profile management (full name, phone) and audit lifecycle trail |
| `/application/settings` | Role: `applicant` | Applicant account password change and active session sign-out |

### Administrative Admissions Directorate & Operations Desks (Steps 3, 4, 5 & 6)
| Route | Access Level | Description |
|---|---|---|
| `/admin/dashboard` | Roles: `super_admin`, `college_admin` | Administrative executive dashboard with live metrics, quick control links, and user provisioning |
| `/admin/bursary` | Roles: `super_admin`, `college_admin`, `bursar` | **Step 5**: Bursary Reconciliation Desk for Remita RRRs, collections ledger, and offline commercial bank branch teller records |
| `/admin/matriculation` | Roles: `super_admin`, `college_admin`, `registrar` | **Step 6**: Registry Matriculation Desk for cohort registers, active matriculation numbers, and official clearance slips |
| `/admin/admission-processing` | Roles: `super_admin`, `college_admin`, `registrar` | Admissions screening queue, O-Level credential verification stamps, deficiency queries, provisional offer issuance, and rejection tracking |
| `/admin/applications` | Roles: `super_admin`, `college_admin` | Candidate applications directory with search, session/status filters, and full dossier inspection drawer |
| `/admin/admission-sessions` | Roles: `super_admin`, `college_admin` | Manage college academic sessions, calendar ranges, and active admission session toggle |
| `/admin/admission-programmes` | Roles: `super_admin`, `college_admin` | Configure available admission programmes, deadlines, entry requirements, and open/close controls |
| `/admin/application-types` | Roles: `super_admin`, `college_admin` | Manage application categories, add types, toggle active state, protected deletion |
| `/admin/applicants` | Roles: `super_admin`, `college_admin` | Registered candidate directory with search, programme filters, and verification badges |

### Student & Staff Dashboards
| Route | Access Level | Description |
|---|---|---|
| `/student/dashboard` | Role: `student` | Student academic dashboard displaying matric number, level, programme, and upcoming modules |
| `/staff/dashboard` | Roles: `lecturer`, `staff`, `hod`, `registrar`, `bursar`, `examination_officer` | Shared staff dashboard displaying staff number, designation, and department |
| `/portal/profile` | Authenticated | Institutional user profile showing verified database records |
| `/portal/settings` | Authenticated | Account preferences and session security settings |

---

## 3. Database Schema & Migrations

### Step 1 Migration: `supabase/migrations/20261101_step1_portal_foundation.sql`
- `profiles`, `roles`, `user_roles`, `departments`, `programmes`, `students`, `staff`, `audit_logs`.

### Step 2 Migration: `supabase/migrations/20261101_step2_application_portal.sql`
- `application_types`, `applicants`, `applicant_events`, `generate_applicant_number()`.

### Step 3 Migration: `supabase/migrations/20261101_step3_admission_application_system.sql`
- `admission_sessions`, `admission_programmes`, `applications`, `application_personal_details`, `application_contact_details`, `application_guardians`, `academic_qualifications`, `qualification_subjects`, `application_documents`, `application_status_history`.

### Step 4 Migration: `supabase/migrations/20261101_step4_admission_processing.sql`
- `admission_screenings`: tracks officer evaluations, screening score, credential and O-Level checkmarks, deficiency query notes, and internal remarks.
- `admission_offers`: provisional admission offer records with official reference numbers (`AHCAS/ADM/2026/XXXXX`), offer date, acceptance deadline, and candidate acceptance/decline responses.

### Steps 5 & 6 Migration: `supabase/migrations/20261102_step5_step6_payments_matriculation.sql`
- `fee_invoices`: Remita electronic billing records with unique RRR (`2408-XXXX-XXXX`), ₦25,000 levy, due dates, and statuses.
- `fee_payments`: College Bursary electronic payments ledger, transaction references, channel types, and receipt numbers (`AHCAS/REC/2026/XXXXX`).
- `matriculation_records`: Registry official matriculation records with unique student matriculation numbers (`AHCAS/2026/XXX`), study level, clearing officer, and timestamps.
- **Row Level Security (RLS)**: Candidate self-access to their own invoices, payments, and matriculation records; full administrative financial reconciliation for `bursar`, `registrar`, `super_admin`, and `college_admin`.

---

## 4. Verification & Testing

### Running the Automated Test Suites
```bash
# 1. Steps 5 & 6 Acceptance Payments & Student Matriculation Tests (20 Scenarios)
node portal/scripts/test_payments_and_matriculation.cjs
# Result: 20 Passed, 0 Failed (100% Success Rate)

# 2. Step 4 Admission Processing & Decisions Tests (20 Scenarios)
node portal/scripts/test_admission_processing.cjs
# Result: 20 Passed, 0 Failed (100% Success Rate)

# 3. Step 3 Online Admission Application System Tests (20 Scenarios)
node portal/scripts/test_admission_system.cjs
# Result: 20 Passed, 0 Failed (100% Success Rate)

# 4. Step 2 Application Registration Portal Tests (20 Scenarios)
node portal/scripts/test_application_portal.cjs
# Result: 20 Passed, 0 Failed (100% Success Rate)

# 5. Step 1 Student/Staff Portal Foundation Tests (13 Scenarios)
node portal/scripts/test_portal.cjs
# Result: 13 Passed, 0 Failed (100% Success Rate)
```
**Total Test Coverage: 93 Automated Integration Tests Passing at 100%.**

# 4. Step 1 Student/Staff Portal Tests (13 Scenarios)
node portal/scripts/test_portal.cjs
# Result: 13 Passed, 0 Failed (100% Success Rate)
```

### Production Build Verification
```bash
# Build Next.js Portal App
npm --prefix portal run build
# Result: Exit code 0 (All 59 static & dynamic routes compiled cleanly)

# Verify Root Public Website App
npm run build
# Result: Exit code 0 (Vite build fully intact)
```
