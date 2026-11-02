'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthSessionUser } from '../../lib/types';
import { ApplicantSidebar } from './ApplicantSidebar';
import { Menu, User, Settings, LogOut, ShieldCheck } from 'lucide-react';

interface ApplicantPortalLayoutProps {
  user: AuthSessionUser;
  title: string;
  children: React.ReactNode;
}

export const ApplicantPortalLayout: React.FC<ApplicantPortalLayoutProps> = ({
  user,
  title,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const applicant = user.applicant;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Applicant Sidebar */}
        <ApplicantSidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-2xs select-none">
            <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
              
              {/* Left: Mobile Toggle & Page Title */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors lg:hidden cursor-pointer"
                  aria-label="Toggle navigation menu"
                >
                  <Menu size={20} />
                </button>

                <div>
                  <h1 className="text-sm font-black uppercase tracking-tight text-[#196855] font-serif leading-none">
                    {title}
                  </h1>
                  <p className="text-[10px] text-gray-400 font-medium hidden sm:block mt-0.5">
                    Al-Hidayah College of Advanced Studies • Application Gateway
                  </p>
                </div>
              </div>

              {/* Right: Applicant Identifier Badge, Profile & Logout */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-800 leading-tight">
                    {applicant?.full_name || user.profile.full_name || user.email}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#196855]">
                    {applicant?.applicant_number || 'Application Pending'}
                  </span>
                </div>

                <div className="h-6 w-px bg-gray-200 hidden sm:block" />

                <Link
                  href="/application/profile"
                  className="p-1.5 rounded-lg text-gray-600 hover:text-[#196855] hover:bg-emerald-50 transition-colors"
                  title="My Profile"
                >
                  <User size={18} />
                </Link>

                <Link
                  href="/application/settings"
                  className="p-1.5 rounded-lg text-gray-600 hover:text-[#196855] hover:bg-emerald-50 transition-colors"
                  title="Account Settings"
                >
                  <Settings size={18} />
                </Link>

                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </form>
              </div>

            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-3 px-4 text-center text-xs text-gray-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
              <span>
                © 2026 <strong>AL-HIDAYAH COLLEGE OF ADVANCED STUDIES</strong> • Integrated Portal
              </span>
              <span className="text-[11px] text-gray-400">
                Support: admissions@alhidayahcollege.com.ng • IJMB Centre 029
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
