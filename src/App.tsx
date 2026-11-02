import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import { ScratchCardProvider } from './context/ScratchCardContext';
import { NotificationProvider } from './context/NotificationContext';

import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Management } from './pages/public/Management';
import { Staff } from './pages/public/Staff';
import { Programmes } from './pages/public/Programmes';
import { ProgrammeDetail } from './pages/public/ProgrammeDetail';
import { Admissions } from './pages/public/Admissions';
import { AdmissionRequirements } from './pages/public/AdmissionRequirements';
import { CheckStatus } from './pages/public/CheckStatus';
import { NewsList } from './pages/public/NewsList';
import { NewsDetail } from './pages/public/NewsDetail';
import { ElearningInfo } from './pages/public/ElearningInfo';
import { Library } from './pages/public/Library';
import { Laboratory } from './pages/public/Laboratory';
import { Contact } from './pages/public/Contact';
import { FAQsPage } from './pages/public/FAQsPage';
import { VirtualTour } from './pages/public/VirtualTour';
import { GalleryPage } from './pages/public/GalleryPage';
import { VerifyDocument } from './pages/public/VerifyDocument';
import { PortalsHub } from './pages/public/PortalsHub';
import { AcademicCalendar } from './pages/public/AcademicCalendar';
import { NotFound } from './pages/public/NotFound';

// Portals
import { ApplicationPortalHome } from './pages/apply/ApplicationPortalHome';
import { ApplicationRequirements } from './pages/apply/ApplicationRequirements';
import { ApplicantPortal } from './pages/apply/ApplicantPortal';
import { StudentPortal } from './pages/student/StudentPortal';
import { ELearningPage } from './pages/student/ELearningPage';
import { AdminPortal } from './pages/admin/AdminPortal';
import { BursaryWorkspace } from './pages/admin/BursaryWorkspace';
import { RegistryWorkspace } from './pages/admin/RegistryWorkspace';
import { ExaminationsWorkspace } from './pages/admin/ExaminationsWorkspace';
import { ProvostPortal } from './pages/executive/ProvostPortal';
import { CouncilPortal } from './pages/governance/CouncilPortal';
import { StaffPortal } from './pages/staff/StaffPortal';
import { AlumniPortal } from './pages/alumni/AlumniPortal';
import { ConvocationPortal } from './pages/convocation/ConvocationPortal';
import { AuthPage } from './pages/public/AuthPage';
import { Community } from './pages/public/Community';
import { StudentLife } from './pages/public/StudentLife';
import { ParentPortal } from './pages/public/ParentPortal';
import { QualityAssurancePortal } from './pages/governance/QualityAssurancePortal';
import { StudentAffairsWorkspace } from './pages/admin/StudentAffairsWorkspace';
import { ICTWorkspace } from './pages/admin/ICTWorkspace';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout wrapper for public pages
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
    <Navbar />
    <main className="flex-1 animate-fade-in">{children}</main>
    <Footer />
  </div>
);

export function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <NotificationProvider>
          <ScratchCardProvider>
            <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/about/management" element={<PublicLayout><Management /></PublicLayout>} />
              <Route path="/about/staff" element={<PublicLayout><Staff /></PublicLayout>} />
              <Route path="/programmes" element={<PublicLayout><Programmes /></PublicLayout>} />
              <Route path="/programmes/:category" element={<PublicLayout><Programmes /></PublicLayout>} />
              <Route path="/programmes/detail/:slug" element={<PublicLayout><ProgrammeDetail /></PublicLayout>} />
              <Route path="/admissions" element={<PublicLayout><Admissions /></PublicLayout>} />
              <Route path="/admissions/requirements" element={<PublicLayout><AdmissionRequirements /></PublicLayout>} />
              <Route path="/admissions/status" element={<PublicLayout><CheckStatus /></PublicLayout>} />
              <Route path="/news" element={<PublicLayout><NewsList /></PublicLayout>} />
              <Route path="/news/:slug" element={<PublicLayout><NewsDetail /></PublicLayout>} />
              <Route path="/elearning" element={<PublicLayout><ElearningInfo /></PublicLayout>} />
              <Route path="/library" element={<PublicLayout><Library /></PublicLayout>} />
              <Route path="/laboratory" element={<PublicLayout><Laboratory /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/community" element={<PublicLayout><Community /></PublicLayout>} />
              <Route path="/student-life" element={<PublicLayout><StudentLife /></PublicLayout>} />
              <Route path="/campus-life/facilities" element={<PublicLayout><StudentLife /></PublicLayout>} />
              <Route path="/parent" element={<PublicLayout><ParentPortal /></PublicLayout>} />
              <Route path="/parent-portal" element={<PublicLayout><ParentPortal /></PublicLayout>} />
              <Route path="/parent/portal" element={<PublicLayout><ParentPortal /></PublicLayout>} />
              <Route path="/portals" element={<PublicLayout><PortalsHub /></PublicLayout>} />
              <Route path="/academic-calendar" element={<PublicLayout><AcademicCalendar /></PublicLayout>} />
              <Route path="/admissions/procedure" element={<PublicLayout><Admissions /></PublicLayout>} />
              <Route path="/lms" element={<PublicLayout><ElearningInfo /></PublicLayout>} />
              <Route path="/faqs" element={<PublicLayout><FAQsPage /></PublicLayout>} />
              <Route path="/virtual-tour" element={<PublicLayout><VirtualTour /></PublicLayout>} />
              <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
              <Route path="/media" element={<PublicLayout><GalleryPage /></PublicLayout>} />
              <Route path="/media/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
              <Route path="/verify" element={<PublicLayout><VerifyDocument /></PublicLayout>} />
              <Route path="/verify/:docType/:docRef" element={<PublicLayout><VerifyDocument /></PublicLayout>} />

              {/* Authentication Split Screen (Exact Match to Image 5) */}
              <Route path="/signin" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />

              {/* Application Portal Routes (RBAC Protected for Applicants) */}
              <Route
                path="/apply"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT', 'SUPER_ADMIN', 'STUDENT']}>
                    <ApplicantPortal />
                  </ProtectedRoute>
                }
              />
              <Route path="/apply/home" element={<ApplicationPortalHome />} />
              <Route path="/apply/requirements" element={<ApplicationRequirements />} />
              <Route
                path="/apply/register"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT', 'SUPER_ADMIN', 'STUDENT']}>
                    <ApplicantPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/apply/status"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT', 'SUPER_ADMIN', 'STUDENT']}>
                    <ApplicantPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT', 'SUPER_ADMIN', 'STUDENT']}>
                    <ApplicantPortal />
                  </ProtectedRoute>
                }
              />
              <Route path="/applications/home" element={<ApplicationPortalHome />} />
              <Route path="/applications/requirements" element={<ApplicationRequirements />} />

              {/* Student Information Portal Routes (Protected) */}
              <Route
                path="/student/elearning"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
                    <ELearningPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
                    <StudentPortal />
                  </ProtectedRoute>
                }
              />

              {/* Staff Administration & CMS Routes (Protected) */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'REGISTRAR', 'BURSAR', 'FINANCE_OFFICER', 'LECTURER', 'EXAMINATION_OFFICER', 'PROVOST']}>
                    <AdminPortal />
                  </ProtectedRoute>
                }
              />

              {/* Provost Executive Portal */}
              <Route
                path="/provost"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'PROVOST', 'PRINCIPAL']}>
                    <ProvostPortal />
                  </ProtectedRoute>
                }
              />

              {/* Council & Governance Boardroom */}
              <Route
                path="/council"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COUNCIL_MEMBER', 'PROVOST', 'REGISTRAR']}>
                    <CouncilPortal />
                  </ProtectedRoute>
                }
              />

              {/* Staff Self-Service & Work Management */}
              <Route
                path="/staff"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STAFF', 'LECTURER', 'REGISTRAR', 'BURSAR', 'FINANCE_OFFICER']}>
                    <StaffPortal />
                  </ProtectedRoute>
                }
              />

              {/* Convocation & Alumni Public/Portal Routes */}
              <Route path="/convocation" element={<ConvocationPortal />} />
              <Route path="/alumni" element={<AlumniPortal />} />

              {/* Bursary, Registry & Exams Dedicated Workspaces */}
              <Route
                path="/bursary"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'BURSAR', 'FINANCE_OFFICER', 'PROVOST']}>
                    <BursaryWorkspace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/registry"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'REGISTRAR', 'PROVOST']}>
                    <RegistryWorkspace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exams"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAMINATION_OFFICER', 'REGISTRAR', 'LECTURER']}>
                    <ExaminationsWorkspace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/qa"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'QUALITY_ASSURANCE_OFFICER', 'PROVOST']}>
                    <QualityAssurancePortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-affairs"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STUDENT_AFFAIRS_OFFICER', 'REGISTRAR', 'PROVOST']}>
                    <StudentAffairsWorkspace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ict"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ICT_OFFICER']}>
                    <ICTWorkspace />
                  </ProtectedRoute>
                }
              />

              {/* Institutional Portal Route Aliases */}
              <Route
                path="/portal/student/*"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
                    <StudentPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'REGISTRAR', 'BURSAR', 'FINANCE_OFFICER', 'LECTURER', 'EXAMINATION_OFFICER', 'PROVOST']}>
                    <AdminPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/admin/bursary"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'BURSAR', 'FINANCE_OFFICER', 'PROVOST']}>
                    <BursaryWorkspace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/provost"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'PROVOST', 'PRINCIPAL']}>
                    <ProvostPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/council"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COUNCIL_MEMBER', 'PROVOST', 'REGISTRAR']}>
                    <CouncilPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/apply/portal"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT', 'SUPER_ADMIN', 'STUDENT']}>
                    <ApplicantPortal />
                  </ProtectedRoute>
                }
              />

              {/* 404 Not Found Catch-All */}
              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>

            {/* Global Search Overlay */}
            <SearchModal />

          </BrowserRouter>
        </ScratchCardProvider>
      </NotificationProvider>
    </AuthProvider>
  </AccessibilityProvider>
  );
}

export default App;
