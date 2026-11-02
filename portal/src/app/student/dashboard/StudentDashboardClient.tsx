'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  ShieldCheck,
  Award,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { AuthSessionUser } from '../../../lib/types';
import { PortalHeader } from '../../../components/layout/PortalHeader';
import { PortalSidebar } from '../../../components/layout/PortalSidebar';

interface StudentDashboardClientProps {
  user: AuthSessionUser;
}

export const StudentDashboardClient: React.FC<StudentDashboardClientProps> = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const student = user.student || {
    matric_number: 'AHCAS/2026/001',
    level: 'IJMB 1',
    status: 'active' as const,
    programme: {
      name: 'IJMB Direct Entry Sciences (Biology / Chemistry / Physics)',
      code: 'IJMB-SCI-01'
    }
  };

  return (
    <>
      <PortalSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        portalType="student"
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <PortalHeader
          user={user}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          portalTitle="Student Information System"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Welcome Banner Card */}
          <div className="bg-gradient-to-r from-[#196855] to-[#135344] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 pointer-events-none transform skew-x-12" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 border-2 border-[#e69912] shadow-md shrink-0 flex items-center justify-center text-[#196855] text-2xl font-bold font-serif">
                  {user.profile.full_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950">
                      Matriculated Candidate
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200">
                      Status: {user.profile.status.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
                    Welcome back, {user.profile.full_name}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-mono">
                    Matric No: <strong className="text-white">{student.matric_number}</strong> • Academic Level: <strong className="text-amber-300">{student.level}</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/portal/profile"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20"
                >
                  View Full Profile
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

          {/* Genuine Academic Records Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Academic Programme
              </span>
              <p className="text-sm font-bold text-[#196855] leading-snug">
                {student.programme?.name || 'IJMB A-Level Direct Entry'}
              </p>
              <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                Code: {student.programme?.code || 'IJMB-SCI-01'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Current Level
              </span>
              <p className="text-2xl font-black text-gray-800 font-serif">
                {student.level}
              </p>
              <p className="text-[11px] text-gray-500">
                Session: 2026/2027 Academic Year
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Study Centre
              </span>
              <p className="text-xs font-bold text-gray-800 leading-snug">
                JSS Agyana Road Study Centre, Abaji
              </p>
              <p className="text-[11px] text-gray-500 font-mono">
                Centre Code: Centre 029
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Account Status
              </span>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                <CheckCircle2 size={16} />
                <span>Verified Active Student</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Direct Entry Clearance Validated
              </p>
            </div>

          </div>

          {/* Academic Modules Overview (Step 2 Future Modules marked clearly) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-serif text-gray-900">
                Academic Modules & Student Services
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                Step 1 Foundation Shell
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Online Course Registration', desc: 'Select approved 3 IJMB A-Level subject combinations and generate registration slip.', icon: BookOpen, status: 'Unavailable (Step 2)' },
                { title: 'Examination Timetable & Venues', desc: 'Access moderated continuous assessment and final examination hall schedules.', icon: Calendar, status: 'Unavailable (Step 2)' },
                { title: 'Official Statement of Results', desc: 'Download verified statement of IJMB points and grade transcripts with QR seal.', icon: Award, status: 'Unavailable (Step 2)' },
                { title: 'Bursary Clearance & Receipts', desc: 'View payment records, tuition installment balance, and download verified receipts.', icon: CreditCard, status: 'Unavailable (Step 2)' },
                { title: 'Digital Student ID Card', desc: 'Preview and generate the official college plastic identity credential.', icon: FileText, status: 'Unavailable (Step 2)' },
                { title: 'Academic Advising & Support', desc: 'Connect with study centre course coordinators and student affairs officers.', icon: GraduationCap, status: 'Unavailable (Step 2)' },
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
