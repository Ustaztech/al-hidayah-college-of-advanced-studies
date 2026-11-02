'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  BookOpen,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Lock,
  Building,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  CreditCard,
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { AuthSessionUser } from '../../../lib/types';
import { PortalHeader } from '../../../components/layout/PortalHeader';
import { PortalSidebar } from '../../../components/layout/PortalSidebar';
import { ROLE_DISPLAY_NAMES } from '../../../lib/auth/roles';

interface StaffDashboardClientProps {
  user: AuthSessionUser;
}

export const StaffDashboardClient: React.FC<StaffDashboardClientProps> = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const primaryRole = user.roles[0] || 'staff';

  const staff = user.staff || {
    staff_number: 'AHCAS/STF/2026/001',
    designation: 'Academic Faculty & Study Centre Coordinator',
    status: 'active' as const,
    department: {
      name: 'Registry & Academic Affairs Directorate',
      code: 'DEPT-REGISTRY'
    }
  };

  return (
    <>
      <PortalSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        portalType="staff"
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <PortalHeader
          user={user}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          portalTitle="Staff & Academic Faculty Portal"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Welcome Banner Card */}
          <div className="bg-gradient-to-r from-[#196855] via-[#1b735e] to-[#135344] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 pointer-events-none transform skew-x-12" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 border-2 border-[#e69912] shadow-md shrink-0 flex items-center justify-center text-[#196855] text-2xl font-bold font-serif">
                  {user.profile.full_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950">
                      {ROLE_DISPLAY_NAMES[primaryRole] || 'Staff Member'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200">
                      Status: {user.profile.status.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
                    {user.profile.full_name}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-mono">
                    Staff ID: <strong className="text-white">{staff.staff_number}</strong> • Designation: <strong className="text-amber-300">{staff.designation}</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/portal/profile"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20"
                >
                  View Profile
                </Link>
                <Link
                  href="/portal/settings"
                  className="px-4 py-2 bg-[#e69912] hover:bg-[#c98207] text-slate-950 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Security
                </Link>
              </div>
            </div>
          </div>

          {/* Genuine Staff Profile Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Primary Department
              </span>
              <p className="text-sm font-bold text-[#196855] leading-snug">
                {staff.department?.name || 'College Academic Directorate'}
              </p>
              <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                Code: {staff.department?.code || 'DEPT-REGISTRY'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Designation & Post
              </span>
              <p className="text-sm font-bold text-gray-800 leading-snug">
                {staff.designation}
              </p>
              <p className="text-[11px] text-gray-500">
                Official Institutional Cadre
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Official Campus
              </span>
              <p className="text-xs font-bold text-gray-800 leading-snug">
                JSS Agyana Road, Abaji Study Centre
              </p>
              <p className="text-[11px] text-gray-500 font-mono">
                Secretariat: No. 3, Bungalow MBS Close
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Authentication Status
              </span>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                <CheckCircle2 size={16} />
                <span>Active Verified Staff</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Authorized for Academic Roster
              </p>
            </div>
          </div>

          {/* Role-Specific Specialised Desk Access */}
          {(user.roles.includes('bursar') || user.roles.includes('registrar') || user.roles.includes('super_admin') || user.roles.includes('college_admin')) && (
            <div className="bg-gradient-to-br from-slate-900 to-[#196855] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-900">
                  Specialised Institutional Desk
                </span>
              </div>
              <h3 className="text-lg font-bold font-serif mb-4">Your Assigned Administrative Desks</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(user.roles.includes('bursar') || user.roles.includes('super_admin') || user.roles.includes('college_admin')) && (
                  <Link
                    href="/admin/bursary"
                    className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#e69912]/20 text-[#e69912] flex items-center justify-center">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">Bursary & Payments Desk</p>
                        <p className="text-[11px] text-emerald-200">Remita RRR reconciliation & invoicing</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                {(user.roles.includes('registrar') || user.roles.includes('super_admin') || user.roles.includes('college_admin')) && (
                  <Link
                    href="/admin/matriculation"
                    className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">Registry Matriculation Desk</p>
                        <p className="text-[11px] text-emerald-200">Matriculation numbers & clearance slips</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Academic Modules Overview for Staff (Step 2 Future Modules marked clearly) */}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-serif text-gray-900">
                Faculty Workspace & Teaching Portfolios
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                Step 1 Foundation Shell
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Lecture Course Allocation', desc: 'View assigned IJMB subjects, student enrolment counts, and lecture hall locations.', icon: BookOpen, status: 'Unavailable (Step 2)' },
                { title: 'Continuous Assessment (CA 20%)', desc: 'Input test scores and laboratory practical marks directly into the moderated grading sheet.', icon: Award, status: 'Unavailable (Step 2)' },
                { title: 'Student Attendance Register', desc: 'Track class participation and syllabus milestone completion across academic sessions.', icon: Calendar, status: 'Unavailable (Step 2)' },
                { title: 'Departmental Faculty Directory', desc: 'Access colleague contact details and academic committee allocations.', icon: Users, status: 'Unavailable (Step 2)' },
                { title: 'Syllabus & OER Library', desc: 'Manage lecture handouts, laboratory manuals, and JavaLab simulation links.', icon: FileSpreadsheet, status: 'Unavailable (Step 2)' },
                { title: 'Academic Board Communications', desc: 'Official administrative notices from the Provost and Academic Registrar.', icon: Layers, status: 'Unavailable (Step 2)' },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.title}
                    className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between space-y-3 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                          <Icon size={18} />
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {m.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 leading-snug">
                        {m.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 select-none">
                      <span className="flex items-center gap-1 font-medium">
                        <Lock size={12} />
                        Module Pending Step 2
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>
    </>
  );
};
