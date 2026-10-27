import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import { ScratchCardProvider } from './context/ScratchCardContext';

import { LoadingScreen } from './components/common/LoadingScreen';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AHCASChatbot } from './components/common/AHCASChatbot';
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

// Portals
import { ApplicationPortalHome } from './pages/apply/ApplicationPortalHome';
import { ApplicationRequirements } from './pages/apply/ApplicationRequirements';
import { ApplicantPortal } from './pages/apply/ApplicantPortal';
import { StudentPortal } from './pages/student/StudentPortal';
import { ELearningPage } from './pages/student/ELearningPage';
import { AdminPortal } from './pages/admin/AdminPortal';
import { AuthPage } from './pages/public/AuthPage';

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
  const [appReady, setAppReady] = useState(false);

  return (
    <AccessibilityProvider>
      <AuthProvider>
        <ScratchCardProvider>
          {/* Smooth Loading Screen */}
          <LoadingScreen onLoaded={() => setAppReady(true)} />

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
              <Route path="/faqs" element={<PublicLayout><FAQsPage /></PublicLayout>} />
              <Route path="/virtual-tour" element={<PublicLayout><VirtualTour /></PublicLayout>} />

              {/* Authentication Split Screen (Exact Match to Image 5) */}
              <Route path="/signin" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />

              {/* Application Portal Routes (Exact Match to Image 3) */}
              <Route path="/apply" element={<ProtectedRoute allowedRoles={['APPLICANT']}><ApplicantPortal /></ProtectedRoute>} />
              <Route path="/apply/home" element={<ProtectedRoute allowedRoles={['APPLICANT']}><ApplicationPortalHome /></ProtectedRoute>} />
              <Route path="/apply/requirements" element={<ProtectedRoute allowedRoles={['APPLICANT']}><ApplicationRequirements /></ProtectedRoute>} />
              <Route path="/apply/register" element={<ApplicantPortal />} />
              <Route path="/apply/status" element={<ApplicantPortal />} />
              <Route path="/applications" element={<ApplicantPortal />} />
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
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'REGISTRAR', 'BURSAR', 'LECTURER']}>
                    <AdminPortal />
                  </ProtectedRoute>
                }
              />
            </Routes>

            {/* Global Chatbot & Search Overlay */}
            <AHCASChatbot />
            <SearchModal />

          </BrowserRouter>
        </ScratchCardProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
