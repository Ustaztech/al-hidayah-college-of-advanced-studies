import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSessionUser } from '../../../lib/auth/session';
import { getPrimaryDashboardForRoles, ROLE_DISPLAY_NAMES } from '../../../lib/auth/roles';
import { User, Mail, Phone, ShieldCheck, Award, ArrowLeft, Calendar, Building, GraduationCap, Briefcase } from 'lucide-react';

export default async function ProfilePage() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect('/portal/login');
  }

  const dashboardUrl = getPrimaryDashboardForRoles(user.roles);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F5]">
      <header className="bg-white border-b border-gray-200 py-3.5 px-4 sm:px-8 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#e69912]/40 shadow-xs p-1 flex items-center justify-center">
              <img src="/official-logo.jpg" alt="AHCAS Crest" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#196855] uppercase font-serif">
                AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">User Identity Profile</p>
            </div>
          </div>
          <Link
            href={dashboardUrl}
            className="text-xs font-bold text-[#196855] hover:text-[#e69912] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 my-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          {/* Cover Header */}
          <div className="h-32 bg-gradient-to-r from-[#196855] via-[#1f7e67] to-[#e69912] relative">
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg border-2 border-white">
                <div className="w-full h-full rounded-xl bg-[#196855] text-white flex items-center justify-center font-bold text-2xl font-serif">
                  {user.profile.full_name.charAt(0)}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Bio Details */}
          <div className="pt-16 pb-8 px-6 sm:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-gray-900 leading-tight">
                  {user.profile.full_name}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-[#196855] border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Account {user.profile.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Grid of Profile Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Assigned Institutional Role
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {user.roles.map(r => (
                    <span
                      key={r}
                      className="px-2.5 py-0.5 bg-[#196855] text-white text-xs font-bold rounded-md"
                    >
                      {ROLE_DISPLAY_NAMES[r] || r}
                    </span>
                  ))}
                </div>
              </div>

              {user.student && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Matriculation Number
                  </span>
                  <p className="font-mono font-bold text-sm text-[#196855]">
                    {user.student.matric_number}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Academic Level: {user.student.level} • {user.student.programme?.name || 'IJMB Programme'}
                  </p>
                </div>
              )}

              {user.staff && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Staff Identity Number
                  </span>
                  <p className="font-mono font-bold text-sm text-[#196855]">
                    {user.staff.staff_number}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Designation: {user.staff.designation} • {user.staff.department?.name || 'College Academic Directorate'}
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Contact Phone
                </span>
                <p className="text-xs font-bold text-gray-800 font-mono">
                  {user.profile.phone || '+234 805 635 0078'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Enrolment & Creation Date
                </span>
                <p className="text-xs font-medium text-gray-600">
                  {new Date(user.profile.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
              <Link
                href="/portal/settings"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors"
              >
                Security & Account Settings
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-500">
        AL-HIDAYAH COLLEGE OF ADVANCED STUDIES • Student & Staff Information Management
      </footer>
    </div>
  );
}
