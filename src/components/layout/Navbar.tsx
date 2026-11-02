import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../common/AuthModal';
import {
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
  LogIn,
  LogOut,
  Building,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Laptop,
  CheckSquare,
  DollarSign
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const location = useLocation();
  const { currentUser, role, roleMetadata, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleDropdownToggle = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header className="relative z-50 font-sans shadow-md">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER (White bg, thin border, Phone, Email & Social Links)       */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-gray-200 text-gray-700 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left: Phone & Email */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-[13px]">
            <a
              href="tel:+2348056350078"
              className="flex items-center gap-1.5 text-gray-700 hover:text-[#e69912] transition-colors"
            >
              <Phone size={13} className="text-[#196855]" />
              <span className="font-bold">+234 805 635 0078</span>
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="mailto:support@alhidayahcollege.com.ng"
              className="flex items-center gap-1.5 text-gray-700 hover:text-[#e69912] transition-colors"
            >
              <Mail size={13} className="text-[#196855]" />
              <span className="font-medium">support@alhidayahcollege.com.ng</span>
            </a>
          </div>

          {/* Right: Social Media Icons */}
          <div className="flex items-center space-x-3 text-gray-500 text-sm">
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-[#196855] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
              </svg>
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-[#196855] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-[#196855] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="https://wa.me/2348056350078/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-[#25D366] hover:scale-110 transition-transform"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MIDDLE AREA (Logo, Large Title, Tagline, Red Portal Login Button)     */}
      {/* ========================================================================= */}
      <div className="bg-white py-4 px-4 sm:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & College Title */}
          <Link to="/" className="flex items-center gap-4 text-center md:text-left group">
            <img
              src="/official-logo.jpg"
              alt="Al-Hidayah College Logo"
              className="h-16 sm:h-20 w-auto object-contain rounded-md shadow-xs group-hover:scale-105 transition-transform"
            />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#196855] tracking-tight font-serif uppercase">
                AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 italic mt-0.5 font-serif">
                - “Enlightening Minds, Building Nations” -
              </p>
            </div>
          </Link>

          {/* Right Action: Portal Login & RBAC Identity */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-gray-800 block truncate max-w-[150px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-50 text-[#196855] border border-emerald-300">
                    {roleMetadata.label}
                  </span>
                </div>
                <Link
                  to={roleMetadata.portalHome}
                  className="px-3 py-1.5 bg-[#196855] hover:bg-[#145646] text-white text-xs font-bold rounded-lg shadow-xs transition-colors hidden md:inline-flex items-center gap-1"
                >
                  <span>My Portal</span>
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 transition-colors"
                  title="Sign out of portal"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="btn-fill-red px-5 py-2.5 rounded text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm flex items-center gap-2"
              >
                <LogIn size={15} />
                <span>Portal Login</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white bg-[#196855] rounded hover:bg-[#196855] transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM MENU BAR (Background #196855, white text, exact items)         */}
      {/* ========================================================================= */}
      <div className="bg-[#196855] text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <nav className="hidden md:flex items-center flex-wrap">
            {/* HOME */}
            <Link
              to="/"
              className={`relative px-3.5 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/') ? 'text-[#e69912]' : 'text-white hover:text-[#e69912]'
              }`}
            >
              HOME
              <span
                className={`absolute bottom-0 left-0 right-0 h-[3px] bg-white transition-transform duration-200 ${
                  isActive('/') ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'
                }`}
              />
            </Link>

            {/* ABOUT */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                  location.pathname.startsWith('/about') ? 'text-[#e69912]' : 'text-white hover:text-[#e69912]'
                }`}
              >
                <span>ABOUT</span>
                <ChevronDown size={12} className="opacity-80" />
              </button>
              {activeDropdown === 'about' && (
                <ul className="absolute top-full left-0 w-52 bg-[#196855] shadow-xl z-50 py-1 border-t-2 border-[#e69912]">
                  <li className="border-b border-emerald-800/40">
                    <Link to="/about" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/about" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Our History
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/about" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Our Values
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/about/management" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Management and Staff
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/about/management" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Management History
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Prefects & Student Body
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* ADMISSION */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('admission')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                  location.pathname.startsWith('/admissions') || location.pathname.startsWith('/apply')
                    ? 'text-[#e69912]'
                    : 'text-white hover:text-[#e69912]'
                }`}
              >
                <span>ADMISSION</span>
                <ChevronDown size={12} className="opacity-80" />
              </button>
              {activeDropdown === 'admission' && (
                <ul className="absolute top-full left-0 w-52 bg-[#196855] shadow-xl z-50 py-1 border-t-2 border-[#e69912]">
                  <li className="border-b border-emerald-800/40">
                    <Link to="/admissions/requirements" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Prospectus
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/admissions/procedure" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Application Procedure
                    </Link>
                  </li>
                  <li>
                    <Link to="/apply" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors font-bold text-amber-300">
                      Apply Here
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* ACADEMICS */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('academics')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                  location.pathname.startsWith('/programmes') ? 'text-[#e69912]' : 'text-white hover:text-[#e69912]'
                }`}
              >
                <span>ACADEMICS</span>
                <ChevronDown size={12} className="opacity-80" />
              </button>
              {activeDropdown === 'academics' && (
                <ul className="absolute top-full left-0 w-60 bg-[#196855] shadow-xl z-50 py-1 border-t-2 border-[#e69912]">
                  <li className="border-b border-emerald-800/40">
                    <Link to="/programmes/ijmb" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Curriculum
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/programmes/ijmb" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Departments
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/programmes/nd" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Courses & Combinations
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/campus-life/facilities" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Practicals & Labs
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/academic-calendar" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Timetables
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/academic-calendar" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      School Calendar
                    </Link>
                  </li>
                  <li>
                    <Link to="/programmes/ijmb" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      External Examinations (IJMB / DE)
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* FACILITIES */}
            <Link
              to="/campus-life/facilities"
              className={`px-3.5 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/campus-life/facilities') ? 'text-[#e69912]' : 'text-white hover:text-[#e69912]'
              }`}
            >
              FACILITIES
            </Link>

            {/* ICT */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('ict')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                  location.pathname.startsWith('/ict') ? 'text-[#e69912]' : 'text-white hover:text-[#e69912]'
                }`}
              >
                <span>ICT</span>
                <ChevronDown size={12} className="opacity-80" />
              </button>
              {activeDropdown === 'ict' && (
                <ul className="absolute top-full left-0 w-64 bg-[#196855] shadow-xl z-50 py-1 border-t-2 border-[#e69912]">
                  <li className="border-b border-emerald-800/40">
                    <Link to="/campus-life/facilities" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      ICT Education / Empowerment
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/portals" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      E Portals
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/parent/portal" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      E Payments
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/student/cbt" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Computer Based Testing / CBT
                    </Link>
                  </li>
                  <li>
                    <Link to="/verify" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      E Results & Verification
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* COMMUNITY */}
            <Link
              to="/community"
              className={`px-3.5 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/community') ? 'text-[#e69912]' : 'text-white hover:text-[#e69912]'
              }`}
            >
              COMMUNITY
            </Link>

            {/* ALUMNI */}
            <Link
              to="/alumni"
              className={`px-3.5 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/alumni') ? 'text-[#e69912]' : 'text-white hover:text-[#e69912]'
              }`}
            >
              ALUMNI
            </Link>

            {/* NEWS AND EVENTS */}
            <Link
              to="/news"
              className={`px-3.5 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/news') ? 'text-[#e69912]' : 'text-white hover:text-[#e69912]'
              }`}
            >
              NEWS AND EVENTS
            </Link>

            {/* MEDIA */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('media')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                  location.pathname.startsWith('/media') ? 'text-[#e69912]' : 'text-white hover:text-[#e69912]'
                }`}
              >
                <span>MEDIA</span>
                <ChevronDown size={12} className="opacity-80" />
              </button>
              {activeDropdown === 'media' && (
                <ul className="absolute top-full left-0 w-52 bg-[#196855] shadow-xl z-50 py-1 border-t-2 border-[#e69912]">
                  <li className="border-b border-emerald-800/40">
                    <Link to="/gallery" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Picture & Media Gallery
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/virtual-tour" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Campus Virtual Tour
                    </Link>
                  </li>
                  <li>
                    <Link to="/gallery" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Video & Circular Archives
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* CONTACT US */}
            <Link
              to="/contact"
              className={`px-3.5 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/contact') ? 'text-[#e69912]' : 'text-white hover:text-[#e69912]'
              }`}
            >
              CONTACT US
            </Link>

            {/* PORTAL LOGIN DROPDOWN (Styled with border outline) */}
            <div
              className="relative group ml-1"
              onMouseEnter={() => setActiveDropdown('portal')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-1.5 my-2 text-xs font-bold uppercase tracking-wider border border-white rounded hover:bg-white hover:text-[#196855] transition-all cursor-pointer">
                <span>PORTAL LOGIN</span>
                <ChevronDown size={12} />
              </button>
              {activeDropdown === 'portal' && (
                <ul className="absolute top-full right-0 w-48 bg-[#196855] shadow-xl z-50 py-1 border-t-2 border-[#e69912]">
                  <li className="border-b border-emerald-800/40">
                    <Link to="/student/dashboard" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Student Login
                    </Link>
                  </li>
                  <li className="border-b border-emerald-800/40">
                    <Link to="/parent/portal" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Parent Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/dashboard" className="block px-4 py-2.5 text-xs text-white hover:bg-[#e69912] transition-colors">
                      Staff Login
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE NAV DRAWER                                                         */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#196855] text-white border-t border-emerald-800 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="py-2 px-4 space-y-1 text-sm font-semibold">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-emerald-800/40 hover:text-[#e69912]"
            >
              HOME
            </Link>

            {/* Mobile About */}
            <div>
              <button
                onClick={() => handleDropdownToggle('m-about')}
                className="w-full flex justify-between items-center py-2.5 border-b border-emerald-800/40 hover:text-[#e69912]"
              >
                <span>ABOUT</span>
                <ChevronDown size={14} className={activeDropdown === 'm-about' ? 'rotate-180' : ''} />
              </button>
              {activeDropdown === 'm-about' && (
                <div className="pl-4 py-1 space-y-1 bg-[#145646] text-xs">
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2">About Us</Link>
                  <Link to="/about/management" onClick={() => setMobileMenuOpen(false)} className="block py-2">Management and Staff</Link>
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2">Our History & Values</Link>
                </div>
              )}
            </div>

            {/* Mobile Admission */}
            <div>
              <button
                onClick={() => handleDropdownToggle('m-admission')}
                className="w-full flex justify-between items-center py-2.5 border-b border-emerald-800/40 hover:text-[#e69912]"
              >
                <span>ADMISSION</span>
                <ChevronDown size={14} className={activeDropdown === 'm-admission' ? 'rotate-180' : ''} />
              </button>
              {activeDropdown === 'm-admission' && (
                <div className="pl-4 py-1 space-y-1 bg-[#145646] text-xs">
                  <Link to="/admissions/requirements" onClick={() => setMobileMenuOpen(false)} className="block py-2">Prospectus</Link>
                  <Link to="/admissions/procedure" onClick={() => setMobileMenuOpen(false)} className="block py-2">Application Procedure</Link>
                  <Link to="/apply" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-amber-300 font-bold">Apply Here</Link>
                </div>
              )}
            </div>

            {/* Mobile Academics */}
            <div>
              <button
                onClick={() => handleDropdownToggle('m-academics')}
                className="w-full flex justify-between items-center py-2.5 border-b border-emerald-800/40 hover:text-[#e69912]"
              >
                <span>ACADEMICS</span>
                <ChevronDown size={14} className={activeDropdown === 'm-academics' ? 'rotate-180' : ''} />
              </button>
              {activeDropdown === 'm-academics' && (
                <div className="pl-4 py-1 space-y-1 bg-[#145646] text-xs">
                  <Link to="/programmes/ijmb" onClick={() => setMobileMenuOpen(false)} className="block py-2">Curriculum & Departments</Link>
                  <Link to="/programmes/nd" onClick={() => setMobileMenuOpen(false)} className="block py-2">Courses</Link>
                  <Link to="/academic-calendar" onClick={() => setMobileMenuOpen(false)} className="block py-2">Timetables & Calendar</Link>
                  <Link to="/programmes/ijmb" onClick={() => setMobileMenuOpen(false)} className="block py-2">External Examinations</Link>
                </div>
              )}
            </div>

            <Link
              to="/campus-life/facilities"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-emerald-800/40 hover:text-[#e69912]"
            >
              FACILITIES
            </Link>

            {/* Mobile ICT */}
            <div>
              <button
                onClick={() => handleDropdownToggle('m-ict')}
                className="w-full flex justify-between items-center py-2.5 border-b border-emerald-800/40 hover:text-[#e69912]"
              >
                <span>ICT</span>
                <ChevronDown size={14} className={activeDropdown === 'm-ict' ? 'rotate-180' : ''} />
              </button>
              {activeDropdown === 'm-ict' && (
                <div className="pl-4 py-1 space-y-1 bg-[#145646] text-xs">
                  <Link to="/portals" onClick={() => setMobileMenuOpen(false)} className="block py-2">E Portals</Link>
                  <Link to="/parent/portal" onClick={() => setMobileMenuOpen(false)} className="block py-2">E Payments</Link>
                  <Link to="/student/cbt" onClick={() => setMobileMenuOpen(false)} className="block py-2">CBT Testing</Link>
                  <Link to="/verify" onClick={() => setMobileMenuOpen(false)} className="block py-2">E Results</Link>
                </div>
              )}
            </div>

            <Link
              to="/community"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-emerald-800/40 hover:text-[#e69912]"
            >
              COMMUNITY
            </Link>
            <Link
              to="/alumni"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-emerald-800/40 hover:text-[#e69912]"
            >
              ALUMNI
            </Link>
            <Link
              to="/news"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-emerald-800/40 hover:text-[#e69912]"
            >
              NEWS AND EVENTS
            </Link>
            <Link
              to="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-emerald-800/40 hover:text-[#e69912]"
            >
              PICTURE & MEDIA GALLERY
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-emerald-800/40 hover:text-[#e69912]"
            >
              CONTACT US
            </Link>

            {/* Mobile Portal Options */}
            <div className="pt-3 pb-2 border-t border-emerald-700">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold block mb-2">
                PORTALS
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                <Link to="/student/dashboard" onClick={() => setMobileMenuOpen(false)} className="bg-[#145646] p-2 rounded hover:bg-[#e69912]">
                  Student
                </Link>
                <Link to="/parent/portal" onClick={() => setMobileMenuOpen(false)} className="bg-[#145646] p-2 rounded hover:bg-[#e69912]">
                  Parent
                </Link>
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="bg-[#145646] p-2 rounded hover:bg-[#e69912]">
                  Staff
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </header>
  );
};

export default Navbar;
