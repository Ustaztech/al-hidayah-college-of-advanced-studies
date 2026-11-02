'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  User,
  GraduationCap,
  Files,
  Activity,
  Bell,
  Settings,
  LogOut,
  X,
  Lock,
  ExternalLink,
  CreditCard,
  Award
} from 'lucide-react';
import { AuthSessionUser } from '../../lib/types';

interface ApplicantSidebarProps {
  user: AuthSessionUser;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  isAvailable: boolean;
  statusText?: string;
}

export const ApplicantSidebar: React.FC<ApplicantSidebarProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: 'Application Dashboard',
      href: '/application/dashboard',
      icon: LayoutDashboard,
      isAvailable: true
    },
    {
      name: 'Applicant Profile',
      href: '/application/profile',
      icon: User,
      isAvailable: true
    },
    {
      name: 'My Application',
      href: '#',
      icon: FileText,
      isAvailable: false,
      statusText: 'Phase 2'
    },
    {
      name: 'Personal Information',
      href: '#',
      icon: User,
      isAvailable: false,
      statusText: 'Phase 2'
    },
    {
      name: 'Academic Qualifications',
      href: '#',
      icon: GraduationCap,
      isAvailable: false,
      statusText: 'Phase 2'
    },
    {
      name: 'Documents & Credentials',
      href: '#',
      icon: Files,
      isAvailable: false,
      statusText: 'Phase 2'
    },
    {
      name: 'Application Status',
      href: '/application/dashboard',
      icon: Activity,
      isAvailable: true
    },
    {
      name: 'Acceptance & Payments',
      href: '/application/payments',
      icon: CreditCard,
      isAvailable: true
    },
    {
      name: 'Bursary Receipts',
      href: '/application/receipt',
      icon: FileText,
      isAvailable: true
    },
    {
      name: 'Registry Clearance',
      href: '/application/clearance',
      icon: Award,
      isAvailable: true
    },
    {
      name: 'Notifications',
      href: '#',
      icon: Bell,
      isAvailable: false,
      statusText: 'Phase 2'
    },
    {
      name: 'Account Settings',
      href: '/application/settings',
      icon: Settings,
      isAvailable: true
    }
  ];

  const applicant = user.applicant;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800`}
      >
        {/* Brand & Identity */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md">
              <Image
                src="/official-logo.jpg"
                alt="Al-Hidayah Logo"
                width={36}
                height={36}
                className="object-contain max-h-full"
              />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#e69912] font-serif">
                AL-HIDAYAH
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold tracking-tight uppercase">
                Application Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Applicant Identity Card */}
        <div className="p-3.5 mx-3 mt-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-900/70 border border-emerald-600/40 text-emerald-300 flex items-center justify-center font-bold text-xs">
              APP
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {applicant?.full_name || user.profile.full_name || 'Prospective Applicant'}
              </p>
              <p className="text-[10px] font-mono text-[#e69912] truncate">
                {applicant?.applicant_number || 'AHCAS/APP/2026/Pending'}
              </p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Programme</span>
            <span className="font-semibold text-emerald-400 truncate max-w-[130px]">
              {applicant?.application_type?.name || 'General Admission'}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Application Menu
          </p>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (!item.isAvailable) {
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-500 cursor-not-allowed select-none bg-slate-800/20"
                  title="This module will become available during subsequent application phases."
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className="text-slate-600" />
                    <span className="font-medium text-[11px]">{item.name}</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-800 text-slate-400 border border-slate-700">
                    {item.statusText || 'Unavailable'}
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors font-medium text-[11px] ${
                  isActive
                    ? 'bg-[#196855] text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    className={isActive ? 'text-[#e69912]' : 'text-slate-400'}
                  />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer with Help & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-[10px] text-slate-400">
            <p className="font-bold text-slate-300">Admission Help Desk</p>
            <p className="text-[9px] text-slate-400 mt-0.5">admissions@alhidayahcollege.com.ng</p>
            <p className="text-[9px] text-slate-400">+234 805 635 0078</p>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 border border-rose-900/40 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out of Portal</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};
