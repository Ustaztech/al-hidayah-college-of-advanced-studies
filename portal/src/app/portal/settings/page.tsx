import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSessionUser } from '../../../lib/auth/session';
import { getPrimaryDashboardForRoles } from '../../../lib/auth/roles';
import { Lock, ShieldCheck, ArrowLeft, KeyRound, Smartphone, AlertTriangle } from 'lucide-react';

export default async function SettingsPage() {
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
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Account & Security Settings</p>
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

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 my-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold font-serif text-gray-900">
              Account Security & Credentials
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Manage your authenticated access tokens and password configuration.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-[#196855] shrink-0 mt-0.5">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Portal Password</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your password protects your academic records and bursary profiles.
                  </p>
                </div>
              </div>
              <Link
                href="/portal/reset-password"
                className="px-3.5 py-1.5 bg-[#196855] hover:bg-[#135344] text-white text-xs font-bold rounded-lg transition-colors shrink-0 shadow-xs"
              >
                Change Password
              </Link>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Active Authentication Session</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">
                    Identity: {user.email} • Status: Active Session
                  </p>
                </div>
              </div>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  Terminate Session
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
