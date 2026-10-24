import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UserCheck,
  BookOpen,
  GraduationCap,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  HelpCircle,
  Settings,
  ChevronDown,
  Sparkles,
  BarChart2,
  FileText
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

interface PortalLayoutProps {
  children: React.ReactNode;
  portalTitle?: string;
  activeNav?: 'Dashboard' | 'Admissions' | 'Course Registration' | 'E-Learning' | 'Results' | 'Fees' | 'Profile';
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  portalTitle = 'Student Portal',
  activeNav
}) => {
  const { currentUser, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Navigation Items matching Image 2, 3, 4
  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Admissions', path: '/apply', icon: UserCheck },
    { label: 'Course Registration', path: '/student/dashboard?tab=courses', icon: FileText },
    { label: 'E-Learning', path: '/student/elearning', icon: BookOpen },
    { label: 'Results', path: '/student/dashboard?tab=results', icon: BarChart2 },
    { label: 'Fees', path: '/student/dashboard?tab=fees', icon: CreditCard },
    { label: 'Profile', path: '/student/dashboard?tab=profile', icon: User }
  ];

  // Helper to determine active state
  const isItemActive = (itemLabel: string, itemPath: string) => {
    if (activeNav) return activeNav === itemLabel;
    if (itemLabel === 'E-Learning' && location.pathname === '/student/elearning') return true;
    if (itemLabel === 'Admissions' && (location.pathname.startsWith('/apply') || location.pathname.startsWith('/admissions'))) return true;
    if (itemLabel === 'Dashboard' && location.pathname === '/student/dashboard' && !location.search) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] text-slate-900 flex flex-col md:flex-row font-sans">
      
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR (EXACT MATCH TO IMAGE 2, 3, 4 SAMPLES) */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#034426] text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl select-none`}
      >
        <div>
          
          {/* Top Crest & Institutional Brand Title */}
          <div className="p-5 text-center flex flex-col items-center border-b border-emerald-900/60 relative">
            <Link to="/" className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md mb-2 flex items-center justify-center border-2 border-[#D4A62A]">
                <img
                  src="/official-logo.jpg"
                  alt="AHCAS Crest"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="font-black text-xs sm:text-sm tracking-tight text-white uppercase font-sans leading-tight">
                AL-HIDAYAH COLLEGE
              </h2>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                OF ADVANCED STUDIES
              </span>
              <span className="text-[10px] text-emerald-200 mt-0.5">
                (AHCAS) Abaji, Nigeria
              </span>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden absolute top-4 right-4 text-emerald-200 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items (Exact Vertical Stack from Images 2, 3, 4) */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.label, item.path);

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    active
                      ? 'bg-[#E5A823] text-slate-950 font-black shadow-md'
                      : 'text-emerald-100 hover:bg-emerald-900/50 hover:text-white'
                  }`}
                >
                  <Icon
                    size={18}
                    className={active ? 'text-slate-950 stroke-[2.5]' : 'text-emerald-300'}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom Sidebar: Gate Outline & Motto */}
        <div className="p-4 space-y-3 border-t border-emerald-900/60">
          
          {/* Architectural Gate Sketch Background */}
          <div className="relative rounded-xl overflow-hidden h-20 bg-emerald-950/40 border border-emerald-800/60 flex items-end justify-center p-2 text-center">
            <img
              src="/campus-gate.jpg"
              alt="Campus Gate Silhouette"
              className="absolute inset-0 w-full h-full object-cover opacity-25 filter grayscale"
            />
            <span className="relative z-10 text-[10px] text-amber-300 font-serif italic font-bold">
              “Developing the Best Minds for the Future”
            </span>
          </div>

          {/* Help & Support */}
          <div className="space-y-1 text-xs text-emerald-200">
            <Link
              to="/contact"
              className="flex items-center gap-2.5 px-3 py-1.5 hover:text-white hover:bg-emerald-900/40 rounded-lg transition-colors"
            >
              <HelpCircle size={15} />
              <span>Help & Support</span>
            </Link>
          </div>

        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEW AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header Bar Matching Images 2, 3, 4 */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-8 flex justify-between items-center sticky top-0 z-30 shadow-xs">
          
          {/* Mobile Menu Button + Search Input */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Menu size={22} />
            </button>

            {/* Search Input (Exact Match to Images 2, 3, 4) */}
            <div className="relative w-full max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, topics or resources..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006B35] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right: Notifications & User Avatar Pill */}
          <div className="flex items-center gap-4">
            
            {/* Notification Bell with Red Badge */}
            <div className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </div>

            {/* User Avatar Pill */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-extrabold flex items-center justify-center text-xs shadow-xs overflow-hidden border border-emerald-700">
                <img
                  src="/hero-graduate.jpg"
                  alt="Student Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block text-left">
                <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                  {currentUser?.name || 'Portal User'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  {role === 'STUDENT' ? 'Matriculated Student' : currentUser?.role === 'STAFF' || role === 'SUPER_ADMIN' ? 'Staff Administrator' : 'Applicant'}
                </span>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>

          </div>

        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
          <span>Official Institutional Portal</span>
          <span className="mx-2">•</span>
          <span>AL-HIDAYAH COLLEGE OF ADVANCED STUDIES (AHCAS), ABAJI, NIGERIA</span>
        </footer>

      </div>

    </div>
  );
};
