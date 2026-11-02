import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export default function UnauthorisedPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F5]">
      <header className="bg-white border-b border-gray-200 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#e69912]/40 shadow-xs p-1 flex items-center justify-center">
              <img src="/official-logo.jpg" alt="AHCAS Crest" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#196855] uppercase font-serif">
                AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Access Control & Authorization</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 border-2 border-red-200 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              HTTP 403 Forbidden
            </span>
            <h2 className="text-2xl font-bold font-serif text-gray-900 pt-1">
              Unauthorised Portal Sector
            </h2>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              Your authenticated credentials do not possess the required security clearances for this institutional workspace. Access attempts are audited in accordance with college academic data policies.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/portal"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#196855] hover:bg-[#135344] text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Return to My Dashboard</span>
            </Link>

            <form action="/api/auth/logout" method="POST" className="w-full sm:w-auto">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                <span>Switch Account</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-500">
        AL-HIDAYAH COLLEGE OF ADVANCED STUDIES • Student & Staff Information Management
      </footer>
    </div>
  );
}
