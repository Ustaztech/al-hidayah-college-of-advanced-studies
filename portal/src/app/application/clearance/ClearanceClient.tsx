'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Printer,
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowRight,
  UserCheck,
  Calendar,
  BookOpen
} from 'lucide-react';
import { MatriculationRecord, Application, AuthSessionUser, Student } from '@/lib/types';

interface ClearanceClientProps {
  user: AuthSessionUser;
  matriculation: MatriculationRecord;
  application: Application;
  student?: Student | null;
}

export const ClearanceClient: React.FC<ClearanceClientProps> = ({
  user,
  matriculation,
  application,
  student
}) => {
  const personal = application.personal_details;
  const candidateName = personal
    ? `${personal.surname} ${personal.first_name} ${personal.middle_name || ''}`.trim()
    : user.profile.full_name;

  const programmeName =
    matriculation.programme?.name ||
    application.selected_programme?.programme?.name ||
    'IJMB Regular Programme (Sciences)';

  const clearanceDate = new Date(matriculation.matriculated_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const passportUrl = personal?.passport_url || user.profile.avatar_url;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Action Bar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-xs print:hidden">
        <Link
          href="/application/dashboard"
          className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Application Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/application/receipt"
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Bursary Receipt</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Printer size={15} />
            <span>Print Clearance Slip</span>
          </button>

          <Link
            href="/student/dashboard"
            className="px-5 py-2 rounded-xl bg-[#196855] hover:bg-[#124d3f] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <GraduationCap size={15} />
            <span>Proceed to Student Portal</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* PRINTABLE OFFICIAL REGISTRY CLEARANCE SLIP */}
      <div className="bg-white rounded-2xl border border-gray-300 p-8 md:p-12 shadow-md print:shadow-none print:border-none print:p-0 space-y-8 relative overflow-hidden">
        {/* Institutional Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <GraduationCap size={520} />
        </div>

        {/* Header */}
        <div className="text-center border-b-2 border-[#196855] pb-6 space-y-2 relative z-10">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-xl bg-emerald-50 border border-emerald-200 p-1 flex items-center justify-center shadow-xs">
              <Image
                src="/official-logo.jpg"
                alt="Al-Hidayah Logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight font-serif uppercase">
            AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Affiliated to Interim Joint Matriculation Board (IJMB Study Centre 029) • Abaji, FCT-Abuja, Nigeria
          </p>
          <div className="pt-1">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 text-white font-serif">
              DIRECTORATE OF ACADEMIC AFFAIRS & REGISTRY
            </span>
          </div>
          <p className="text-xs font-bold text-[#196855] tracking-wide uppercase pt-1">
            Official Matriculation & Enrollment Clearance Slip
          </p>
        </div>

        {/* MATRICULATION NUMBER CALLOUT BADGE */}
        <div className="bg-gradient-to-r from-emerald-900 via-[#196855] to-emerald-800 text-white p-5 rounded-2xl shadow-sm text-center relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block mb-1">
            Official Institutional Identifier
          </span>
          <span className="text-2xl md:text-3xl font-mono font-black tracking-widest block text-white select-all">
            {matriculation.matric_number}
          </span>
          <span className="text-xs text-emerald-100 font-medium mt-1 block">
            Matriculation Number • Valid for All College Academic Transactions
          </span>
        </div>

        {/* CANDIDATE PARTICULARS & PASSPORT */}
        <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10 border-b border-gray-200 pb-6 text-xs">
          {/* Passport Photograph */}
          <div className="w-28 h-36 rounded-xl border-2 border-gray-300 bg-gray-50 shrink-0 overflow-hidden flex flex-col items-center justify-center text-gray-400 p-1">
            {passportUrl ? (
              <img
                src={passportUrl}
                alt={candidateName}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center p-2">
                <UserCheck size={36} className="mx-auto text-gray-300 mb-1" />
                <span className="text-[9px] font-medium text-gray-400 leading-none block">
                  Passport Photograph
                </span>
              </div>
            )}
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <div>
              <span className="text-gray-500 block">Candidate Full Name:</span>
              <span className="text-sm font-bold text-gray-900 uppercase block">{candidateName}</span>
            </div>

            <div>
              <span className="text-gray-500 block">Application Number:</span>
              <span className="text-sm font-bold font-mono text-gray-900 block">{application.application_number}</span>
            </div>

            <div>
              <span className="text-gray-500 block">School / Directorate:</span>
              <span className="text-sm font-bold text-gray-900 block">
                School of Basic and Remedial Studies (IJMB)
              </span>
            </div>

            <div>
              <span className="text-gray-500 block">Enrolled Programme:</span>
              <span className="text-sm font-bold text-gray-900 block">{programmeName}</span>
            </div>

            <div>
              <span className="text-gray-500 block">Study Level:</span>
              <span className="text-sm font-bold text-[#196855] font-mono block">{matriculation.level}</span>
            </div>

            <div>
              <span className="text-gray-500 block">Academic Session:</span>
              <span className="text-sm font-bold text-gray-900 block">
                {application.admission_session?.name || '2026/2027 Academic Session'}
              </span>
            </div>
          </div>
        </div>

        {/* REGISTRY CLEARANCE VERIFICATION AUDIT */}
        <div className="relative z-10 space-y-3 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-gray-500 text-[11px] border-b pb-1">
            Registry Statutory Clearance Verifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-[#196855] shrink-0" />
              <div>
                <span className="font-bold text-gray-900 block">O-Level Verification</span>
                <span className="text-[10px] text-emerald-700">Verified & Screened</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-[#196855] shrink-0" />
              <div>
                <span className="font-bold text-gray-900 block">Admission Offer</span>
                <span className="text-[10px] text-emerald-700">Formally Accepted</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-[#196855] shrink-0" />
              <div>
                <span className="font-bold text-gray-900 block">Acceptance Fee</span>
                <span className="text-[10px] text-emerald-700">Paid & Reconciled (₦25,000)</span>
              </div>
            </div>
          </div>
        </div>

        {/* FORMAL INSTITUTIONAL CERTIFICATION */}
        <div className="relative z-10 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 leading-relaxed space-y-2">
          <p className="font-serif italic text-gray-900 font-medium">
            &quot;This is to certify that <strong>{candidateName}</strong> has satisfied all academic entry requirements, accepted the provisional offer of admission, fulfilled all prescribed institutional financial liabilities, and is hereby formally matriculated into the College Academic Register as a fully registered student of Al-Hidayah College of Advanced Studies for the <strong>2026/2027 Academic Session</strong>.&quot;
          </p>
        </div>

        {/* REGISTRY SEALS & SIGNATURES */}
        <div className="pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 items-end gap-6 relative z-10 text-xs">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
              <ShieldCheck size={16} />
              <span>Certified Registry Instrument</span>
            </div>
            <p className="text-[10px] text-gray-400">
              Clearance Date: {clearanceDate} • Cleared By: {matriculation.cleared_by}
            </p>
            <p className="text-[10px] text-gray-400">
              Direct Student Academic Portal login active via Matriculation Number.
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-block text-center border-b border-gray-400 pb-1 px-8">
              <span className="font-serif italic text-base text-gray-700 font-bold block">
                Dr. A. A. Bello (PhD, MNIM)
              </span>
            </div>
            <span className="block font-bold text-gray-900 uppercase text-[11px]">
              Academic Registrar & Secretary to Academic Board
            </span>
            <span className="block text-[10px] text-gray-500">
              Al-Hidayah College of Advanced Studies, Abaji
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
