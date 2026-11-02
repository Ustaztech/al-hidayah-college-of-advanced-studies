import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useAccessibility } from '../../context/AccessibilityContext';
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
  FileText,
  Shield,
  Briefcase,
  FileSpreadsheet,
  Award,
  Layers,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';
import { InstitutionalRole } from '../../types';

interface PortalLayoutProps {
  children: React.ReactNode;
  portalTitle?: string;
  activeNav?: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  portalTitle,
  activeNav,
  breadcrumbs
}) => {
  const { currentUser, role, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { theme, setTheme, setIsSearchOpen } = useAccessibility();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const location = useLocation();

  // Dynamic portal title fallback
  const resolvedPortalTitle = portalTitle || (() => {
    switch (role) {
      case 'STUDENT': return 'Student Information System';
      case 'APPLICANT': return 'Applicant & Admissions Portal';
      case 'REGISTRAR': return 'Registry & Academic Administration';
      case 'BURSAR':
      case 'FINANCE_OFFICER': return 'Finance & Bursary Directorate';
      case 'LECTURER': return 'Lecturer Academic & LMS Workspace';
      case 'EXAMINATION_OFFICER': return 'Examinations & Records Portal';
      case 'PROVOST':
      case 'PRINCIPAL': return 'Provost Executive Governance';
      case 'COUNCIL_MEMBER': return 'Governing Council Boardroom';
      case 'QUALITY_ASSURANCE_OFFICER': return 'Quality Assurance & Academic Standards';
      case 'STUDENT_AFFAIRS_OFFICER': return 'Student Affairs & Welfare Directorate';
      case 'ICT_OFFICER': return 'ICT & Systems Infrastructure';
      case 'SUPER_ADMIN': return 'Chief Institutional Administration';
      default: return 'AHCAS Digital Campus';
    }
  })();

  // Role-specific navigation items
  const getNavItems = () => {
    if (role === 'STUDENT') {
      return [
        { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { label: 'Admissions', path: '/apply', icon: UserCheck },
        { label: 'Course Registration', path: '/student/dashboard?tab=courses', icon: FileText },
        { label: 'E-Learning (LMS)', path: '/student/elearning', icon: BookOpen },
        { label: 'Results & Transcript', path: '/student/dashboard?tab=results', icon: BarChart2 },
        { label: 'Fees & Receipts', path: '/student/dashboard?tab=fees', icon: CreditCard },
        { label: 'Student Profile', path: '/student/dashboard?tab=profile', icon: User }
      ];
    }

    if (role === 'APPLICANT') {
      return [
        { label: 'My Application', path: '/apply', icon: FileText },
        { label: 'Entry Requirements', path: '/apply/requirements', icon: BookOpen },
        { label: 'Admission Status', path: '/admissions/status', icon: Award },
        { label: 'Application Home', path: '/apply/home', icon: LayoutDashboard }
      ];
    }

    if (role === 'LECTURER') {
      return [
        { label: 'Assigned Courses', path: '/student/elearning', icon: BookOpen },
        { label: 'CA & Grading Desk', path: '/admin/dashboard?tab=grading', icon: Award },
        { label: 'CBT Question Bank', path: '/admin/dashboard?tab=cbt', icon: FileSpreadsheet },
        { label: 'Class Enrolment', path: '/admin/dashboard?tab=students', icon: GraduationCap }
      ];
    }

    if (role === 'REGISTRAR') {
      return [
        { label: 'Applications Review', path: '/admin/dashboard?tab=applications', icon: UserCheck },
        { label: 'Student Registry', path: '/admin/dashboard?tab=students', icon: GraduationCap },
        { label: 'Scratch Cards Batch', path: '/admin/dashboard?tab=cards', icon: KeyRound },
        { label: 'Audit Trail Logs', path: '/admin/dashboard?tab=audit', icon: Shield }
      ];
    }

    if (role === 'BURSAR' || role === 'FINANCE_OFFICER') {
      return [
        { label: 'Bursary Collections', path: '/admin/dashboard?tab=bursary', icon: CreditCard },
        { label: 'Student Directory', path: '/admin/dashboard?tab=students', icon: GraduationCap },
        { label: 'Scratch Card Sales', path: '/admin/dashboard?tab=cards', icon: KeyRound },
        { label: 'Financial Audit Logs', path: '/admin/dashboard?tab=audit', icon: Shield }
      ];
    }

    if (role === 'EXAMINATION_OFFICER') {
      return [
        { label: 'IJMB Grading Desk', path: '/admin/dashboard?tab=grading', icon: Award },
        { label: 'CBT Examination Engine', path: '/admin/dashboard?tab=cbt', icon: FileSpreadsheet },
        { label: 'Candidate Records', path: '/admin/dashboard?tab=students', icon: GraduationCap },
        { label: 'Audit Trail', path: '/admin/dashboard?tab=audit', icon: Shield }
      ];
    }

    if (role === 'COUNCIL_MEMBER') {
      return [
        { label: 'Governance Overview', path: '/admin/dashboard?tab=audit', icon: Shield },
        { label: 'Student Statistics', path: '/admin/dashboard?tab=students', icon: GraduationCap },
        { label: 'Financial Summary', path: '/admin/dashboard?tab=bursary', icon: CreditCard }
      ];
    }

    if (role === 'QUALITY_ASSURANCE_OFFICER') {
      return [
        { label: 'Quality Indicators', path: '/qa', icon: Shield },
        { label: 'Findings Register', path: '/qa', icon: AlertTriangle },
        { label: 'Audit Trail Logs', path: '/admin/dashboard?tab=audit', icon: Shield }
      ];
    }

    if (role === 'STUDENT_AFFAIRS_OFFICER') {
      return [
        { label: 'Welfare Cases', path: '/student-affairs', icon: Briefcase },
        { label: 'Student Directory', path: '/admin/dashboard?tab=students', icon: GraduationCap },
        { label: 'Admissions Desk', path: '/admin/dashboard?tab=applications', icon: UserCheck }
      ];
    }

    if (role === 'ICT_OFFICER') {
      return [
        { label: 'System Health', path: '/ict', icon: Layers },
        { label: 'User Directory', path: '/ict', icon: User },
        { label: 'Security Audit', path: '/ict', icon: Shield },
        { label: 'Scratch Cards', path: '/admin/dashboard?tab=cards', icon: KeyRound }
      ];
    }

    // Default for SUPER_ADMIN, PROVOST, PRINCIPAL
    return [
      { label: 'Admissions Desk', path: '/admin/dashboard?tab=applications', icon: UserCheck },
      { label: 'IJMB Grading Desk', path: '/admin/dashboard?tab=grading', icon: Award },
      { label: 'Bursary & Payments', path: '/admin/dashboard?tab=bursary', icon: CreditCard },
      { label: 'Student Directory', path: '/admin/dashboard?tab=students', icon: GraduationCap },
      { label: 'Quality Assurance', path: '/qa', icon: Shield },
      { label: 'Student Affairs', path: '/student-affairs', icon: Briefcase },
      { label: 'ICT Systems', path: '/ict', icon: Layers },
      { label: 'CBT Question Bank', path: '/admin/dashboard?tab=cbt', icon: FileSpreadsheet },
      { label: 'Scratch Cards', path: '/admin/dashboard?tab=cards', icon: KeyRound },
      { label: 'Audit Trail & Logs', path: '/admin/dashboard?tab=audit', icon: Shield }
    ];
  };

  const navItems = getNavItems();

  const isItemActive = (itemLabel: string, itemPath: string) => {
    if (activeNav) return activeNav.toLowerCase() === itemLabel.toLowerCase();
    if (location.pathname + location.search === itemPath) return true;
    if (location.pathname === itemPath) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
      
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#196855] text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl select-none`}
      >
        <div className="overflow-y-auto">
          
          {/* Top Crest & Institutional Brand Title */}
          <div className="p-5 text-center flex flex-col items-center border-b border-emerald-900/60 relative">
            <Link to="/" className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md mb-2 flex items-center justify-center border-2 border-[#e69912]">
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

          {/* Current Workspace Pill */}
          <div className="px-4 pt-3 pb-1">
            <div className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 font-mono truncate">
                {role.replace(/_/g, ' ')}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>

          {/* Dynamic Navigation Items */}
          <nav className="p-3 space-y-1.5 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.label, item.path);

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    active
                      ? 'bg-[#e69912] text-white font-black shadow-md'
                      : 'text-emerald-100 hover:bg-emerald-900/50 hover:text-white'
                  }`}
                >
                  <Icon
                    size={17}
                    className={active ? 'text-white stroke-[2.5]' : 'text-emerald-300'}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom Sidebar: Gate Outline & Quick Help */}
        <div className="p-4 space-y-3 border-t border-emerald-900/60">
          <div className="relative rounded-xl overflow-hidden h-16 bg-emerald-950/40 border border-emerald-800/60 flex items-end justify-center p-2 text-center">
            <img
              src="/campus-gate.jpg"
              alt="Campus Gate Silhouette"
              className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale"
            />
            <span className="relative z-10 text-[9px] text-amber-300 font-serif italic font-bold">
              “Developing the Best Minds for the Future”
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-200">
            <button
              onClick={() => setHelpModalOpen(true)}
              className="flex items-center gap-2 hover:text-white hover:bg-emerald-900/40 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <HelpCircle size={15} />
              <span>Helpdesk</span>
            </button>
            <Link
              to="/"
              className="flex items-center gap-1.5 hover:text-white hover:bg-emerald-900/40 px-2 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink size={13} />
              <span>Website</span>
            </Link>
          </div>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEW AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-8 flex justify-between items-center sticky top-0 z-30 shadow-xs transition-colors">
          
          {/* Mobile Menu Button + Search Input + Portal Title */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <Menu size={22} />
            </button>

            {/* Portal Title & Search Trigger */}
            <div className="hidden lg:block text-left mr-3">
              <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase font-sans">
                {resolvedPortalTitle}
              </h1>
            </div>

            {/* Search Input Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="relative w-full max-w-xs flex items-center gap-2.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-400 hover:border-[#196855] transition-all cursor-pointer text-left"
            >
              <Search size={15} className="text-slate-400" />
              <span className="truncate">Search records, courses, resources...</span>
            </button>
          </div>

          {/* Right Header: Theme Toggle, Notifications, Demo Role Switcher, Avatar */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications Bell with Floating Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#196855] text-white font-extrabold text-[9px] rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Tray Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-slate-900 dark:text-white">
                      Institutional Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] text-[#196855] hover:underline font-bold cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-slate-400">
                        No notifications currently.
                      </p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          className={`p-3 text-xs transition-colors ${
                            !n.read ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-slate-900 dark:text-white truncate">
                              {n.title}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-snug">
                            {n.message}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              {n.category}
                            </span>
                            {!n.read && (
                              <button
                                onClick={() => markAsRead(n.id)}
                                className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold cursor-pointer hover:underline"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Active User Role Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-900 dark:text-emerald-200">
              <Shield size={14} className="text-[#196855]" />
              <span className="text-[11px] font-mono">{role.replace(/_/g, ' ')}</span>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-black flex items-center justify-center text-xs shadow-xs overflow-hidden border border-emerald-700">
                <img
                  src="/hero-graduate.jpg"
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:block text-left">
                <span className="font-black text-xs text-slate-900 dark:text-white block leading-tight truncate max-w-[130px]">
                  {currentUser?.name || 'Authorized User'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  {role}
                </span>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>

          </div>

        </header>

        {/* Dynamic Breadcrumbs Bar */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-2 flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-emerald-800">Home</Link>
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={idx}>
                <span>/</span>
                {bc.path ? (
                  <Link to={bc.path} className="hover:text-emerald-800 font-medium">
                    {bc.label}
                  </Link>
                ) : (
                  <span className="font-bold text-slate-800 dark:text-slate-200">{bc.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span>Official Institutional Portal</span>
          <span className="mx-2">•</span>
          <span>AL-HIDAYAH COLLEGE OF ADVANCED STUDIES (AHCAS), ABAJI, FCT ABUJA</span>
        </footer>

      </div>

      {/* Helpdesk Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={18} className="text-[#196855]" />
                Institutional Helpdesk
              </h3>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              For technical support, credential verification, or admissions inquiries, contact the Academic Registry at JSS Agyana Road Study Centre, Abaji Abuja.
            </p>
            <div className="space-y-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <p><strong>Hotline:</strong> +234 805 635 0078</p>
              <p><strong>Email:</strong> support@alhidayahcollege.com.ng</p>
              <p><strong>Registry Hours:</strong> Mon - Fri, 8:00 AM - 4:00 PM</p>
            </div>
            <button
              onClick={() => setHelpModalOpen(false)}
              className="w-full py-2.5 bg-[#196855] text-white font-bold rounded-xl text-xs shadow-md cursor-pointer hover:bg-[#196855]"
            >
              Close Helpdesk
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
