import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../common/AuthModal';
import {
  ChevronDown,
  BookOpen,
  UserCheck,
  ShieldCheck,
  Menu,
  X,
  LogIn,
  LogOut,
  GraduationCap,
  Building,
  Phone,
  Mail,
  Search,
  FlaskConical,
  Award,
  FileText
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const location = useLocation();
  const { setIsSearchOpen } = useAccessibility();
  const { currentUser, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const openLogin = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalTab('register');
    setAuthModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      
      {/* ========================================================================= */}
      {/* TOP HEADER BAR (EXACT MATCH TO IMAGE 1 SAMPLE) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#B47B14] via-[#C98B18] to-[#9E690B] text-white text-xs py-1.5 px-4 sm:px-8 relative shadow-inner">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative min-h-[34px]">
          
          {/* Left: Phone */}
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <Phone size={14} className="text-amber-200" />
            <a href="tel:08056350078" className="hover:text-amber-200 transition-colors font-mono font-bold">
              +234 805 635 0078
            </a>
          </div>

          {/* Center: Prominent Curved Institutional Badge Matching Official Brand Colors */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 z-20">
            <div className="bg-gradient-to-b from-[#006B35] to-[#004D26] text-white font-extrabold text-xs px-8 py-2 rounded-b-2xl shadow-lg border-x-2 border-b-2 border-[#D4A62A]/70 flex items-center gap-3 tracking-wide">
              <Link to="/about" className="hover:text-amber-300 transition-colors">SDG Impact</Link>
              <span className="text-amber-400/60 font-light">|</span>
              <Link to="/admin/dashboard" className="hover:text-amber-300 transition-colors">Staff Portal</Link>
              <span className="text-amber-400/60 font-light">|</span>
              <Link to="/admissions/requirements" className="hover:text-amber-300 transition-colors">Faculties</Link>
              <span className="text-amber-400/60 font-light">|</span>
              <Link to="/programmes/ijmb" className="hover:text-amber-300 transition-colors">Departments A-Z</Link>
            </div>
          </div>

          {/* Right: Email */}
          <div className="flex items-center gap-2 font-medium">
            <Mail size={14} className="text-amber-200" />
            <a href="mailto:support@alhidayahcollege.com.ng" className="hover:text-amber-200 transition-colors font-mono font-medium">
              support@alhidayahcollege.com.ng
            </a>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN NAVIGATION BAR (CLEAN, PROFESSIONAL, VISIBLE LINKS) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & College Brand */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <img
              src="/official-logo.jpg"
              alt="Al-Hidayah College of Advanced Studies Crest"
              className="h-14 w-auto object-contain bg-white p-0.5 rounded-lg border border-slate-200 shadow-xs group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 font-serif leading-none group-hover:text-[#006B35] transition-colors">
                AL-HIDAYAH COLLEGE
              </span>
              <span className="text-[11px] sm:text-xs font-black tracking-widest text-slate-700 uppercase">
                OF ADVANCED STUDIES
              </span>
              <span className="text-[10px] text-amber-700 font-semibold italic">
                Abaji, FCT-Abuja • RC: {INSTITUTION_INFO.rcNumber}
              </span>
            </div>
          </Link>

          {/* Desktop Clean Visible Links Matching Sample Image 1 */}
          <nav className="hidden lg:flex items-center space-x-1 tracking-wider uppercase text-xs font-black text-slate-800">
            
            {/* THE COLLEGE */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('college')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  location.pathname.startsWith('/about')
                    ? 'text-[#006B35] bg-emerald-50'
                    : 'text-slate-900 hover:text-[#006B35] hover:bg-slate-50'
                }`}
              >
                <span>THE COLLEGE</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === 'college' ? 'rotate-180 text-[#006B35]' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'college' && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 animate-fade-in space-y-1 z-30">
                  <Link to="/about" className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#006B35]">
                    <Building size={15} className="text-[#006B35]" />
                    <span>About Us & Institutional Profile</span>
                  </Link>
                  <Link to="/about/management" className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#006B35]">
                    <Award size={15} className="text-amber-600" />
                    <span>Management & Governing Council</span>
                  </Link>
                  <Link to="/virtual-tour" className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#006B35]">
                    <Building size={15} className="text-[#006B35]" />
                    <span>JSS Agyana Road Study Centre</span>
                  </Link>
                </div>
              )}
            </div>

            {/* FACULTIES & DIRECTORATES */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('programmes')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  location.pathname.startsWith('/programmes')
                    ? 'text-[#006B35] bg-emerald-50'
                    : 'text-slate-900 hover:text-[#006B35] hover:bg-slate-50'
                }`}
              >
                <span>FACULTIES & DIRECTORATES</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === 'programmes' ? 'rotate-180 text-[#006B35]' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'programmes' && (
                <div className="absolute top-full left-0 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-2 animate-fade-in space-y-1 z-30">
                  <Link to="/programmes/ijmb" className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-emerald-50">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006B35] mt-1 shrink-0"></span>
                    <div>
                      <span className="font-extrabold text-xs text-[#006B35] block">IJMB Direct Entry (A-Level)</span>
                      <span className="text-[10px] text-slate-500 normal-case font-normal">73 Approved Subject Combinations</span>
                    </div>
                  </Link>
                  <Link to="/admissions/requirements" className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-emerald-50">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0"></span>
                    <div>
                      <span className="font-extrabold text-xs text-amber-700 block">73 Combinations Catalog (001-073)</span>
                      <span className="text-[10px] text-slate-500 normal-case font-normal">Medicine, Law, Engineering, Sciences</span>
                    </div>
                  </Link>
                  <Link to="/programmes/nd" className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-emerald-50">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shrink-0"></span>
                    <div>
                      <span className="font-extrabold text-xs text-blue-700 block">Citi Polytechnic Affiliated ND/HND</span>
                      <span className="text-[10px] text-slate-500 normal-case font-normal">Full-Time & Part-Time Diplomas</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* STUDENTS */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('students')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  location.pathname.startsWith('/student')
                    ? 'text-[#006B35] bg-emerald-50'
                    : 'text-slate-900 hover:text-[#006B35] hover:bg-slate-50'
                }`}
              >
                <span>STUDENTS</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === 'students' ? 'rotate-180 text-[#006B35]' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'students' && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 animate-fade-in space-y-1 z-30">
                  <Link to="/student/dashboard" className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#006B35]">
                    <GraduationCap size={15} className="text-[#006B35]" />
                    <span>Student Dashboard</span>
                  </Link>
                  <Link to="/student/elearning" className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#006B35]">
                    <BookOpen size={15} className="text-[#D4A62A]" />
                    <span>E-Learning (My Learning)</span>
                  </Link>
                  <Link to="/student/dashboard" className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#006B35]">
                    <FileText size={15} className="text-blue-600" />
                    <span>Course Registration</span>
                  </Link>
                  <Link to="/admissions/status" className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#006B35]">
                    <Award size={15} className="text-emerald-700" />
                    <span>Check Result & Admission Status</span>
                  </Link>
                </div>
              )}
            </div>

            {/* ACADEMICS & RESEARCH */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('academics')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  location.pathname === '/library' || location.pathname === '/laboratory'
                    ? 'text-[#006B35] bg-emerald-50'
                    : 'text-slate-900 hover:text-[#006B35] hover:bg-slate-50'
                }`}
              >
                <span>ACADEMICS & RESEARCH</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === 'academics' ? 'rotate-180 text-[#006B35]' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'academics' && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 animate-fade-in space-y-1 z-30">
                  <Link to="/library" className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#006B35]">
                    <BookOpen size={15} className="text-[#006B35]" />
                    <span>Digital E-Library (OER)</span>
                  </Link>
                  <Link to="/laboratory" className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#006B35]">
                    <FlaskConical size={15} className="text-[#F58220]" />
                    <span>E-Laboratory (JavaLab)</span>
                  </Link>
                  <Link to="/admissions" className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#006B35]">
                    <FileText size={15} className="text-[#006B35]" />
                    <span>Admissions Guide & Screening</span>
                  </Link>
                </div>
              )}
            </div>

            {/* REACH US */}
            <Link
              to="/contact"
              className={`px-3.5 py-2.5 rounded-lg transition-colors ${
                isActive('/contact') ? 'text-[#006B35] bg-emerald-50' : 'text-slate-900 hover:text-[#006B35] hover:bg-slate-50'
              }`}
            >
              REACH US
            </Link>

            {/* Search Icon (Exact Image 1 "Search Q") */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-700 hover:text-[#006B35] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Search the College Website"
            >
              <Search size={15} className="text-slate-800" />
              <span>Search</span>
            </button>

          </nav>

          {/* Quick Action Portal Buttons */}
          <div className="hidden xl:flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to={currentUser.role === 'STUDENT' ? '/student/dashboard' : currentUser.role === 'APPLICANT' ? '/apply' : '/admin/dashboard'}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#006B35] hover:bg-[#004D26] text-white text-xs font-extrabold rounded-lg shadow-sm transition-all"
                >
                  <GraduationCap size={15} />
                  <span>Portal ({currentUser.name.split(' ')[0]})</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/apply"
                  className="px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-[#D4A62A] to-[#E5A823] hover:from-[#c29623] hover:to-[#d49617] rounded-lg shadow-sm transition-all tracking-wide uppercase"
                >
                  Apply Online
                </Link>

                <button
                  onClick={openLogin}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006B35] hover:bg-[#004D26] rounded-lg shadow-sm transition-all uppercase tracking-wide cursor-pointer"
                >
                  <LogIn size={14} />
                  <span>Portal Login</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={openLogin}
              className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-[#D4A62A] rounded-lg shadow-xs"
            >
              Login
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between border-l border-slate-200">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <img src="/official-logo.jpg" alt="AHCAS Logo" className="h-10 w-auto bg-white p-0.5 rounded-lg border border-slate-200" />
                  <div>
                    <span className="font-extrabold text-sm text-[#006B35] block font-serif">AHCAS Abaji</span>
                    <span className="text-[10px] text-slate-500">RC: {INSTITUTION_INFO.rcNumber}</span>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <div className="py-4 space-y-1 text-xs font-extrabold uppercase tracking-wider text-slate-800">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-slate-100">
                  Home
                </Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-slate-100">
                  The College
                </Link>
                <Link to="/programmes/ijmb" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-slate-100">
                  Faculties & 73 Combinations
                </Link>
                <Link to="/student/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-[#006B35] hover:bg-emerald-50">
                  Students Portal
                </Link>
                <Link to="/student/elearning" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-amber-700 hover:bg-amber-50">
                  E-Learning (My Learning)
                </Link>
                <Link to="/library" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-slate-100">
                  Academics & E-Library
                </Link>
                <Link to="/laboratory" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-slate-100">
                  E-Laboratory (JavaLab)
                </Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-slate-100">
                  Reach Us
                </Link>
              </div>

              {/* Portal Links in Drawer */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <Link
                  to="/apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#D4A62A] text-black font-extrabold rounded-lg text-xs shadow-sm uppercase tracking-wider"
                >
                  <UserCheck size={15} />
                  Apply Online (₦10,500)
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); openLogin(); }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#006B35] text-white font-extrabold rounded-lg text-xs shadow-sm uppercase tracking-wider cursor-pointer"
                >
                  <LogIn size={15} />
                  Sign In to Account
                </button>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 text-slate-800 font-extrabold rounded-lg text-xs uppercase tracking-wider"
                >
                  <ShieldCheck size={15} className="text-[#D4A62A]" />
                  Staff Administration
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} AHCAS Abaji, FCT. RC: {INSTITUTION_INFO.rcNumber}
            </div>
          </div>
        </div>
      )}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />

    </header>
  );
};
