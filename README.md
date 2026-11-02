# Al-Hidayah College of Advanced Studies (AHCAS)
## Integrated Digital Campus & Institutional Management System

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

---

## 🏛️ Executive Summary

**Al-Hidayah College of Advanced Studies (AHCAS)** is a premier tertiary institution and accredited Interim Joint Matriculation Board (IJMB) Study Centre located in Abaji, Federal Capital Territory (FCT) Abuja, Nigeria. 

The **AHCAS Digital Campus** is an enterprise-grade, full-stack institutional management portal designed to manage the entire educational lifecycle—from prospective student outreach and online admission applications to course registration, bursary fee settlements, student academic records, executive provost oversight, and governing council resolutions.

- **Campus Location:** JSS Agyana Road Study Centre, Abaji, FCT-Abuja, Nigeria.
- **Administrative Secretariat:** No. 3, Bungalow, MBS Close, Sabon Tasha Phase II, Abaji, FCT-Abuja.
- **Core Programme:** 12-Month IJMB A-Level Programme (Securing 200 Level Direct Entry into Nigerian and International Universities without JAMB UTME).

---

## 🚀 Key Modules & Capabilities

### 1. 🌐 Public Institutional Portal
- **Modern Responsive Landing Page:** Showcases institutional pillars, academic faculties, student testimonials, and tuition breakdowns.
- **Interactive Course & Combination Finder:** Dynamic filter for all 73 approved IJMB subject combinations mapped directly to university target faculties (Medicine, Engineering, Law, Social Sciences, Arts).
- **Tuition & Installment Calculator:** Transparent breakdown for single payments (₦258,500) and approved 2-installment plans (₦154,000 + ₦105,500).
- **Bilingual FAQs:** English and Hausa language support for regional accessibility.
- **Latest News & Official Bulletins:** Announcements from the Office of the Registrar and Provost.

### 2. 📝 Admissions & Candidate Lifecycle
- **Step-by-Step Online Application (`/apply/register`):** Multi-step candidate registration, O’Level subject entry, JAMB direct-entry target selection, and credential uploads.
- **Applicant Status Tracker (`/apply/portal`):** Candidates log in with their Reference Number (e.g., `AHCAS-2026-APP-001`) to inspect application review milestones in real time.
- **Instant Printable Admission Letters:** High-resolution printable letterheads featuring official crests, dynamic cryptographic QR verification codes, and formal academic board terms.
- **Registration & Course Enrolment Slips:** Official slips generated on-demand with barcode/QR validation.

### 3. 🎓 Student Management Portal (`/portal/student` or `/student`)
- **Academic Dashboard:** Overview of current semester, registered subject units, attendance rate, and grade averages.
- **Interactive CBT Examination Centre (`/student/cbt`):** Timed mock examination engine with 100+ past questions across 10 IJMB subjects (Biology, Chemistry, Physics, Mathematics, Economics, Government, Literature, Accounting, Islamic Studies, Christian Studies), on-screen scientific calculator, question palette, and detailed academic rationales.
- **Course & Examination Schedule:** Live timetable for lectures, laboratory sessions, and IJMB mock examinations.
- **Bursary & Installment Tracker:** Detailed ledger of paid installments, outstanding fees, and official receipt downloads.
- **Customized Printable Documents Suite:**
  - *Digital Student Identity Card:* Front and back print-ready ID card with photo badge and security verification QR code.
  - *Official Examination Photocard & Docket:* Centre Code 029 (Abaji) candidate clearance slip with passport photo, 3 registered subjects, CA clearance badge, and invigilator sign-off.
  - *Statement of Results & Academic Transcript:* Official 16-point scale transcript with CA (20%) + Exam (80%), bonus point calculation, and Provost/Registrar signature blocks.
  - *Electronic Payment Receipt:* Bursary Directorate payment slip with transaction reference, payer info, and validation QR.

### 4. 💳 Multi-Channel Payment Gateway Suite
- **Paystack Secured Gateway:** Real-time simulation of card checkout (Visa, Mastercard, Verve), 3D Secure verification, and instant cryptographic payment references.
- **Remita e-Collection (RRR):** Automated 12-digit Remita Retrieval Reference generation for commercial bank branch payments and online reconciliation.
- **Direct Institutional Bank Transfer:** Official institutional accounts (Moniepoint MFB, Jaiz Bank, Zenith Bank) with one-click account copying and teller reconciliation.
- **Integrated Clearance:** Connects to candidate screening fees (₦10,000), acceptance fees (₦25,000), and tuition installments (₦154,000 + ₦105,500).

### 5. 💼 Administrative & Registry Workspace (`/portal/admin`)
- **Candidate Application Review:** Filter, approve, defer, or reject applicant submissions with automated notification logging.
- **Student Roster & Verification:** Search and manage enrolled students, matriculation number assignments, and academic standing.
- **System Audit Logs:** Comprehensive logging of all registry and governance actions.

### 6. 💳 Bursary & Finance Workspace (`/portal/admin/bursary` or `/bursary`)
- **Payment Reconciliation Ledger:** Real-time visibility into all tuition payments, acceptance fees, and laboratory levies across Paystack, Remita, and Bank Transfer channels.
- **Manual Payment Recording:** Bursars can record verified bank drafts, generate printable official institutional receipts, and flag completed clearances.
- **Financial Analytics & Export:** Track revenue targets, outstanding candidate balances, and export CSV reports.

### 7. 🏛️ Executive & Governance Portals
- **Provost Executive Suite (`/portal/provost` or `/provost`):** Strategic executive overview for the Provost / Executive Chairman (Dr. Muhammad Baba Suleiman, PhD). Displays live institutional KPIs, faculty load, enrollment capacity, and urgent administrative directives.
- **Governing Council Portal (`/portal/council` or `/council`):** Secure governance repository for Council Members to review board papers, resolutions, committee charters, and statutory audit reports.

### 8. 🔍 Public Document Verification Engine (`/verify/:id`)
- Anyone scanning the QR code on an admission letter, course slip, student ID card, exam photocard, transcript, or payment receipt is routed to the verification engine.
- Instantly verifies authenticity against the database, preventing certificate forgery.

### 9. 🌐 Centralized E-Portals Directory Hub (`/portals`) & Academic Calendar (`/academic-calendar`)
- Single-sign-on directory categorizing all institutional portals for students, prospective applicants, staff, bursary, and executive governance.
- Dedicated 2026/2027 Academic Session calendar with activity filters and printable schedule.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) | Modern component architecture with functional hooks |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict type-safety across all entities, portals, and props |
| **Bundler & Dev Server** | [Vite 8](https://vitejs.dev/) | Lightning-fast HMR and optimized production bundling |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Theme-driven design system with dark mode and custom typography |
| **Icons** | [Lucide React](https://lucide.dev/) | Crisp, modern vector icon set |
| **QR Code Engine** | [qrcode.react](https://github.com/zpao/qrcode.react) | SVG-based cryptographic document validation QR generation |
| **Routing** | [React Router v7](https://reactrouter.com/) | Client-side routing with nested layouts and route protection |
| **Database & Auth** | [Supabase](https://supabase.com/) & [PostgreSQL](https://www.postgresql.org/) | Relational database, Row Level Security (RLS), and schema migrations |
| **Code Quality** | [Oxlint](https://oxc.rs/) | High-performance JavaScript/TypeScript linter |

---

## 📂 Project Structure

```text
├── public/                     # Static institutional assets (logos, crests, portraits)
│   ├── official-logo.jpg       # Institutional crest & logo
│   └── provost-mbsuleiman.jpg  # Official portrait of the Executive Chairman
├── src/
│   ├── components/
│   │   ├── common/             # Reusable modals (AdmissionLetter, RegistrationSlip, StudentIDCard)
│   │   ├── home/               # Homepage sections (Hero, WhyAHCAS, AdmissionsGuide, Calculator)
│   │   └── layout/             # Master layout, Navbar, Footer, and PortalLayout navigation
│   ├── data/
│   │   ├── ijmbData.ts         # 73 Approved IJMB Combinations, Governance, and Tuition Schedules
│   │   ├── mockData.ts         # Resilient offline-first mock dataset for all portals
│   │   ├── news.ts             # Official campus news releases and circulars
│   │   └── faqs.ts             # English/Hausa bilingual FAQ knowledge base
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client initialization & connection status
│   │   └── utils.ts            # Formatting, currency, and utility helpers
│   ├── pages/
│   │   ├── admin/              # Central Admin & Bursary Workspace
│   │   ├── apply/              # Candidate Application Forms & Status Portal
│   │   ├── executive/          # Provost Executive Dashboard
│   │   ├── governance/         # Governing Council Board Portal
│   │   ├── public/             # About, Academic Structure, Requirements, Contact, Verify
│   │   └── student/            # Student Dashboard, Course Registration, Tuition Desk
│   ├── types/
│   │   └── index.ts            # TypeScript definitions (Applicant, Student, Receipt, Combinations)
│   ├── App.tsx                 # Master routing configuration
│   ├── index.css               # Design system tokens and Tailwind CSS rules
│   └── main.tsx                # Application bootstrap
├── supabase/
│   └── migrations/
│       └── 20261031_ahcas_core_schema.sql  # Complete PostgreSQL DDL, tables, views & RLS policies
├── package.json
└── vite.config.ts
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ustaztech/al-hidayah-college-of-advanced-studies.git
   cd al-hidayah-college-of-advanced-studies
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables *(Optional for local demo)*:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
   ```
   > **Note:** The application includes a self-healing offline mock fallback. If Supabase credentials are not supplied, all features (application tracking, student portals, bursary receipts, and document verification) will operate smoothly in simulated demonstration mode.

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

---

## 🧪 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with HMR |
| `npm run build` | Compiles TypeScript and builds production bundles into `dist/` |
| `npm run lint` | Runs Oxlint across the codebase for fast static analysis |
| `npm run preview` | Previews the production build locally |

---

## 🔐 Demo Portals & Quick Navigation

Use the top navigation bar or quick links to test different institutional user journeys:

| Role | Route | Sample Identifier | Purpose |
| :--- | :--- | :--- | :--- |
| **Prospective Candidate** | `/apply/portal` | `AHCAS-2026-APP-001` | Check provisional admission offer, print admission letter |
| **Enrolled Student** | `/portal/student` | `AHCAS/2026/IJMB/004` | Course timetable, ID card generator, tuition balance |
| **Academic Registry** | `/portal/admin` | Select "Admin" at `/login` | Approve/reject candidate applications, manage student statuses |
| **Bursary Department** | `/portal/admin/bursary` | Direct Link | View receipts, record new cash/bank payments, reconcile ledger |
| **College Provost** | `/portal/provost` | Direct Link | Review high-level enrollment stats, send administrative directives |
| **Governing Council** | `/portal/council` | Direct Link | Review confidential board resolutions and meeting archives |
| **Document Verification** | `/verify/AHCAS-2026-APP-001` | Direct Link | Real-time QR security verification |

---

## 🗄️ Database Schema & Architecture

The database is built on **PostgreSQL** via **Supabase**. The core migration script is located at:
[`supabase/migrations/20261031_ahcas_core_schema.sql`](file:///c:/Users/THE%20DIGITAL%20USTAZ/Documents/dev/Al-Hidayah%20College%20of%20Advance%20Studies/supabase/migrations/20261031_ahcas_core_schema.sql)

### Core Tables:
1. `applications`: Candidate records, O'Level qualifications, assigned subject combinations, and admission decisions.
2. `students`: Enrolled students, matriculation numbers, study centres, and academic standings.
3. `payment_receipts`: Financial ledger, payment methods, transaction references, and clearance receipts.
4. `course_registrations`: Registered course units and semester enrollment details.
5. `notifications`: Real-time candidate, student, and staff announcement dispatch.
6. `audit_logs`: Governance tracking and audit readiness logs.

---

## 🛡️ Security & Privacy Standards

- **Row Level Security (RLS):** Data access is strictly restricted by user role in PostgreSQL.
- **No Hardcoded Credentials:** Environment-driven API keys.
- **Tamper-Evident Verification:** Public verification hashes generated dynamically to protect academic records from falsification.

---

## 📞 Institutional Contacts & Support

- **Study Centre:** JSS Agyana Road Study Centre, Abaji, FCT-Abuja, Nigeria.
- **Administrative Secretariat:** No. 3, Bungalow, MBS Close, Sabon Tasha Phase II, Abaji, FCT-Abuja.
- **Executive Chairman / Provost:** Dr. Muhammad Baba Suleiman, PhD (*Magajin Ilimin Abaji*)
- **Centre Coordinator:** Mall. Ibrahim Idris Gambo
- **Admissions Enquiries:** info@alhidayahcollege.edu.ng | +234 803 000 0000

---

*© 2026 Al-Hidayah College of Advanced Studies (AHCAS). All rights reserved.*
