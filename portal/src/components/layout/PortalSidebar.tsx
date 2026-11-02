'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Settings,
  GraduationCap,
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  Users,
  Building,
  Award,
  Layers,
  X,
  Lock,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { AuthSessionUser } from '../../lib/types';

interface PortalSidebarProps {
  user: AuthSessionUser;
  isOpen: boolean;
  onClose: () => void;
  portalType: 'student' | 'staff' | 'admin';
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  available: boolean;
  badge?: string;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  user,
  isOpen,
  onClose,
  portalType
}) => {
  const pathname = usePathname();

  // Navigation Items per Portal Type
  const getNavItems = (): NavItem[] => {
    if (portalType === 'student') {
      return [
        { label: 'Student Dashboard', href: '/student/dashboard', icon: LayoutDashboard, available: true },
        { label: 'Bursary Fee History', href: '/application/receipt', icon: CreditCard, available: true },
        { label: 'Registry Clearance', href: '/application/clearance', icon: Award, available: true },
        { label: 'Course Registration', href: '#', icon: BookOpen, available: false, badge: 'Step 7' },
        { label: 'Examination Timetable', href: '#', icon: Calendar, available: false, badge: 'Step 7' },
        { label: 'Statement of Results', href: '#', icon: FileText, available: false, badge: 'Step 7' },
        { label: 'Student Identity Card', href: '#', icon: FileText, available: false, badge: 'Step 7' },
      ];
    }

    if (portalType === 'staff') {
      return [
        { label: 'Staff Dashboard', href: '/staff/dashboard', icon: LayoutDashboard, available: true },
        { label: 'Course Allocation', href: '#', icon: BookOpen, available: false, badge: 'Step 2' },
        { label: 'Continuous Assessment', href: '#', icon: Award, available: false, badge: 'Step 2' },
        { label: 'Attendance Register', href: '#', icon: Calendar, available: false, badge: 'Step 2' },
        { label: 'Departmental Roster', href: '#', icon: Users, available: false, badge: 'Step 2' },
      ];
    }

    // Admin
    return [
      { label: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, available: true },
      { label: 'Screening & Offers', href: '/admin/admission-processing', icon: Award, available: true },
      { label: 'Bursary & Payments', href: '/admin/bursary', icon: CreditCard, available: true },
      { label: 'Matriculation Desk', href: '/admin/matriculation', icon: GraduationCap, available: true },
      { label: 'Admission Applications', href: '/admin/applications', icon: FileText, available: true },
      { label: 'Admission Sessions', href: '/admin/admission-sessions', icon: Calendar, available: true },
      { label: 'Admission Programmes', href: '/admin/admission-programmes', icon: BookOpen, available: true },
      { label: 'Application Types', href: '/admin/application-types', icon: Layers, available: true },
      { label: 'Registered Applicants', href: '/admin/applicants', icon: Users, available: true },
      { label: 'Account Provisioning', href: '#provision-desk', icon: Users, available: true },
      { label: 'Academic Departments', href: '#departments-desk', icon: Building, available: true },
      { label: 'Programmes Directory', href: '#programmes-desk', icon: Layers, available: true },
      { label: 'System Audit Logs', href: '#audit-desk', icon: FileText, available: true },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#196855] text-white flex flex-col justify-between shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto">
          {/* Top Brand Strip */}
          <div className="p-4 border-b border-emerald-900/60 flex items-center justify-between">
            <Link href="/portal" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border-2 border-[#e69912] shadow-sm">
                <img src="/official-logo.jpg" alt="AHCAS Crest" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-xs tracking-tight text-white uppercase block leading-tight">
                  AL-HIDAYAH
                </span>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                  COLLEGE PORTAL
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          {/* User Profile Mini Card */}
          <div className="p-3 mx-3 mt-3 bg-emerald-950/60 rounded-xl border border-emerald-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#e69912] text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {user.profile.full_name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-white truncate block">
                  {user.profile.full_name}
                </span>
                <span className="text-[10px] font-mono text-emerald-200 truncate block">
                  {user.student?.matric_number || user.staff?.staff_number || user.email}
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-300/80">
              Navigation Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              if (!item.available) {
                return (
                  <div
                    key={item.label}
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-300/60 flex items-center justify-between opacity-70 cursor-not-allowed select-none group"
                    title="This module will be activated in Step 2"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className="text-emerald-400/50" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/20 text-emerald-300 font-mono">
                      Unavailable
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => onClose()}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-white text-[#196855] shadow-sm font-extrabold'
                      : 'text-emerald-100 hover:bg-emerald-900/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-[#196855]' : 'text-emerald-300'} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Strip */}
        <div className="p-3 border-t border-emerald-900/60 space-y-1">
          <Link
            href="/portal/profile"
            onClick={() => onClose()}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-emerald-100 hover:bg-emerald-900/60 flex items-center gap-2.5 transition-colors"
          >
            <User size={15} />
            <span>My Profile</span>
          </Link>

          <Link
            href="/portal/settings"
            onClick={() => onClose()}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-emerald-100 hover:bg-emerald-900/60 flex items-center gap-2.5 transition-colors"
          >
            <Settings size={15} />
            <span>Account Security</span>
          </Link>

          <form action="/api/auth/logout" method="POST" className="pt-1">
            <button
              type="submit"
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-red-200 bg-red-950/40 hover:bg-red-900/60 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};
