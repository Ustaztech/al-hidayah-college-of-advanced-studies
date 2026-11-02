'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  QrCode,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Application } from '@/lib/types';

export default function ApplicationSlipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);
        const res = await fetch('/api/application/current');
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/application/login');
            return;
          }
          throw new Error('Failed to load application');
        }

        const data = await res.json();
        if (data.success && data.application) {
          setApplication(data.application);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error loading slip');
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#196855] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">Generating Official Application Slip...</p>
      </div>
    );
  }

  // If application is not yet submitted
  if (!application || application.status !== 'submitted') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-xl border border-slate-200 shadow-md text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-2">Application Incomplete</h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            Your admission application has not been formally submitted yet. You must complete all required sections and submit your application to generate an official acknowledgement slip.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/application/apply"
              className="w-full py-2.5 px-4 bg-[#196855] text-white text-xs font-semibold rounded-md hover:bg-emerald-800 transition"
            >
              Continue Application
            </Link>
            <Link
              href="/application/dashboard"
              className="w-full py-2.5 px-4 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-200 transition"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const p = application.personal_details;
  const c = application.contact_details;
  const guardians = application.guardians || [];
  const quals = application.qualifications || [];
  const prog = application.selected_programme;
  const session = application.admission_session?.name || '2026/2027 Academic Session';
  const subDate = application.submitted_at
    ? new Date(application.submitted_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 py-6 px-2 sm:px-4 print:p-0 print:bg-white">
      {/* Non-print Action Header */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between print:hidden">
        <Link
          href="/application/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#196855] hover:bg-emerald-800 px-4 py-2 rounded-md shadow transition cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print / Save Slip (PDF)
        </button>
      </div>

      {/* Slip Document Sheet */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 shadow-md p-6 sm:p-10 print:border-none print:shadow-none print:p-0 print:m-0 font-sans">
        {/* Institutional Header */}
        <div className="border-b-2 border-[#196855] pb-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-slate-200 flex items-center justify-center p-1 bg-white shrink-0">
              <img src="/logo.jpg" alt="AHCAS Logo" className="w-16 h-16 rounded-full object-cover" />
            </div>

            <div className="text-center flex-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-wide uppercase">
                AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
              </h1>
              <p className="text-xs font-bold text-[#196855] uppercase tracking-wider mt-0.5">
                Directorate of Admissions & Academic Records
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                P.O. Box 102, Keffi / Abuja Expressway • admissions@alhidayahcollege.com.ng • portal.alhidayahcollege.com.ng
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-slate-100 rounded border border-slate-300">
                <span className="text-xs font-black uppercase text-slate-800 tracking-widest">
                  ONLINE ADMISSION APPLICATION ACKNOWLEDGEMENT SLIP
                </span>
              </div>
            </div>

            {/* Passport Photograph Box */}
            <div className="w-24 h-28 border border-slate-400 rounded bg-slate-50 flex flex-col items-center justify-center text-center p-1 shrink-0 overflow-hidden">
              {p?.passport_url ? (
                <img src={p.passport_url} alt="Passport" className="w-full h-full object-cover rounded" />
              ) : (
                <div className="text-[10px] text-slate-400 font-medium leading-tight">
                  AFFIX OFFICIAL PASSPORT PHOTO
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification & Reference Barcode Block */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div>
            <div className="text-slate-500 text-[11px]">Submission Reference Number:</div>
            <div className="font-mono text-sm font-extrabold text-[#196855]">
              {application.submission_reference || 'AHCAS/SUB/2026/00101'}
            </div>
          </div>

          <div>
            <div className="text-slate-500 text-[11px]">Application Number:</div>
            <div className="font-mono text-xs font-bold text-slate-800">
              {application.application_number}
            </div>
          </div>

          <div>
            <div className="text-slate-500 text-[11px]">Submission Date & Time:</div>
            <div className="font-bold text-slate-800">{subDate}</div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Submission
          </div>
        </div>

        {/* 1. CANDIDATE PERSONAL INFORMATION */}
        <div className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase bg-slate-100 px-3 py-1.5 rounded-t border-l-4 border-[#196855]">
            1. Candidate Bio-Data
          </h2>
          <div className="border border-t-0 border-slate-200 p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Surname:</span>
              <span className="font-bold text-slate-800 uppercase">{p?.surname || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">First Name:</span>
              <span className="font-bold text-slate-800 uppercase">{p?.first_name || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Middle Name:</span>
              <span className="font-bold text-slate-800 uppercase">{p?.middle_name || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Gender / Marital:</span>
              <span className="font-bold text-slate-800 capitalize">{p?.gender || '—'} / {p?.marital_status || 'Single'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Date of Birth:</span>
              <span className="font-bold text-slate-800">{p?.date_of_birth || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Nationality:</span>
              <span className="font-bold text-slate-800">{p?.nationality || 'Nigerian'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">State of Origin:</span>
              <span className="font-bold text-slate-800">{p?.state_of_origin || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">LGA of Origin:</span>
              <span className="font-bold text-slate-800">{p?.lga_of_origin || '—'}</span>
            </div>
          </div>
        </div>

        {/* 2. PROGRAMME & ACADEMIC SESSION */}
        <div className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase bg-slate-100 px-3 py-1.5 rounded-t border-l-4 border-[#196855]">
            2. Applied Academic Programme
          </h2>
          <div className="border border-t-0 border-slate-200 p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[11px]">Course of Study:</span>
              <span className="font-bold text-slate-800 text-sm">{prog?.programme?.name || 'Academic Programme'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Academic Session:</span>
              <span className="font-bold text-slate-800">{session}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Programme Duration:</span>
              <span className="font-semibold text-slate-800">{prog?.duration || '1 Academic Session'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[11px]">Application Category:</span>
              <span className="font-semibold text-slate-800">{prog?.application_type?.name || 'Direct Entry / Regular'}</span>
            </div>
          </div>
        </div>

        {/* 3. CONTACT & NEXT OF KIN */}
        <div className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase bg-slate-100 px-3 py-1.5 rounded-t border-l-4 border-[#196855]">
            3. Contact Details & Next of Kin
          </h2>
          <div className="border border-t-0 border-slate-200 p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Candidate Telephone:</span>
              <span className="font-bold text-slate-800">{c?.phone_number || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Alternative Phone:</span>
              <span className="font-bold text-slate-800">{c?.alternative_phone || 'None'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">State of Residence:</span>
              <span className="font-bold text-slate-800">{c?.state_of_residence || '—'}</span>
            </div>
            <div className="sm:col-span-3">
              <span className="text-slate-500 block text-[11px]">Permanent Address:</span>
              <span className="font-medium text-slate-800">{c?.residential_address || '—'}</span>
            </div>
            {guardians.length > 0 && (
              <>
                <div>
                  <span className="text-slate-500 block text-[11px]">Next of Kin / Guardian:</span>
                  <span className="font-bold text-slate-800">{guardians[0].full_name} ({guardians[0].relationship})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Guardian Phone:</span>
                  <span className="font-bold text-slate-800">{guardians[0].phone_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Guardian Address:</span>
                  <span className="font-medium text-slate-800">{guardians[0].address || 'Same as candidate'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 4. ACADEMIC QUALIFICATIONS (O-LEVEL RESULTS) */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-slate-900 uppercase bg-slate-100 px-3 py-1.5 rounded-t border-l-4 border-[#196855]">
            4. O-Level Examination Results
          </h2>
          <div className="border border-t-0 border-slate-200 p-3 text-xs">
            {quals.map((q, idx) => (
              <div key={idx} className="mb-3 last:mb-0">
                <div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-slate-700 pb-1 mb-2 border-b border-slate-200">
                  <span>Examination: {q.exam_name} ({q.exam_year})</span>
                  <span>Exam No: {q.exam_number}</span>
                  <span>Sitting: {q.exam_sitting}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(q.subjects || []).map((sub, sIdx) => (
                    <div key={sIdx} className="border border-slate-200 p-1.5 rounded flex justify-between items-center text-[11px]">
                      <span className="truncate pr-1 text-slate-700 font-medium">{sub.subject}</span>
                      <span className="font-mono font-bold text-slate-900">{sub.grade}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Screening Instructions & Signatures */}
        <div className="border-t-2 border-slate-300 pt-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-6">
            <h3 className="font-bold text-slate-800 uppercase text-[11px] mb-1">
              Important Instructions for Physical Screening:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
              <li>Print two (2) clear copies of this acknowledgement slip.</li>
              <li>Present this slip along with original copies of your O-Level certificates, state of origin certificate, and birth certificate at the College Admissions Office.</li>
              <li>Bring four (4) recent passport-sized photographs on a plain background.</li>
              <li>Any falsification of documents or credentials will result in instant cancellation of application and possible prosecution.</li>
            </ol>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="text-center">
              <div className="border-b border-slate-400 pb-8 mb-1" />
              <span className="text-[11px] font-semibold text-slate-700">Candidate's Signature & Date</span>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-400 pb-8 mb-1" />
              <span className="text-[11px] font-semibold text-slate-700">Admissions Officer / Stamp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
