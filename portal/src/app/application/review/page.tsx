'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileCheck,
  User,
  Phone,
  Users,
  GraduationCap,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Edit,
  ShieldAlert,
  Send
} from 'lucide-react';
import { Application } from '@/lib/types';

export default function ApplicationReviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [application, setApplication] = useState<Application | null>(null);
  const [declarationConfirmed, setDeclarationConfirmed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

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
          if (data.application.status === 'submitted') {
            router.push('/application/slip');
          }
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error loading application summary.');
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [router]);

  const handleFinalSubmit = async () => {
    if (!declarationConfirmed) {
      setErrorMessage('You must read and check the declaration of truthfulness before submitting.');
      setShowConfirmModal(false);
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const res = await fetch('/api/application/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ declarationConfirmed: true })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed. Please check all required sections.');
      }

      // Success -> Redirect to Application Slip
      router.push('/application/slip');
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission error');
      setShowConfirmModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#196855] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">Compiling your application review...</p>
      </div>
    );
  }

  const p = application?.personal_details;
  const c = application?.contact_details;
  const guardians = application?.guardians || [];
  const quals = application?.qualifications || [];
  const docs = application?.documents || [];
  const prog = application?.selected_programme;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Banner & Header */}
      <div className="bg-[#196855] text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold leading-tight">AL-HIDAYAH COLLEGE OF ADVANCED STUDIES</h1>
              <p className="text-xs text-emerald-100">Review Application Dossier Before Final Submission</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end md:self-auto">
            <Link
              href="/application/apply"
              className="text-xs font-medium text-emerald-100 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Form
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 mt-6">
        {/* Verification Warning Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 shadow-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-semibold block mb-0.5">Please review your submission carefully.</strong>
            Ensure all names, dates of birth, examination numbers, and grades match your official certificates exactly. Once submitted, your application will be permanently locked and forwarded to the Admissions Directorate for screening.
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-3 rounded-md flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* SECTION 1: PERSONAL DETAILS */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#196855]" /> 1. Personal Information
              </h2>
              <Link
                href="/application/apply"
                className="text-xs font-medium text-[#196855] hover:underline flex items-center gap-1"
              >
                <Edit className="w-3 h-3" /> Edit
              </Link>
            </div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Surname</span>
                <span className="font-semibold text-slate-800 uppercase">{p?.surname || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">First Name</span>
                <span className="font-semibold text-slate-800 uppercase">{p?.first_name || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Middle Name</span>
                <span className="font-semibold text-slate-800 uppercase">{p?.middle_name || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Gender</span>
                <span className="font-semibold text-slate-800 capitalize">{p?.gender || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Date of Birth</span>
                <span className="font-semibold text-slate-800">{p?.date_of_birth || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Nationality</span>
                <span className="font-semibold text-slate-800">{p?.nationality || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">State of Origin</span>
                <span className="font-semibold text-slate-800">{p?.state_of_origin || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">LGA of Origin</span>
                <span className="font-semibold text-slate-800">{p?.lga_of_origin || '—'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTACT DETAILS */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#196855]" /> 2. Contact Information
              </h2>
              <Link
                href="/application/apply"
                className="text-xs font-medium text-[#196855] hover:underline flex items-center gap-1"
              >
                <Edit className="w-3 h-3" /> Edit
              </Link>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Phone Number</span>
                <span className="font-semibold text-slate-800">{c?.phone_number || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Alternative Phone</span>
                <span className="font-semibold text-slate-800">{c?.alternative_phone || 'None'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">State of Residence</span>
                <span className="font-semibold text-slate-800">{c?.state_of_residence || '—'}</span>
              </div>
              <div className="md:col-span-3">
                <span className="text-slate-500 block">Permanent Residential Address</span>
                <span className="font-semibold text-slate-800">{c?.residential_address || '—'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: GUARDIANS */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#196855]" /> 3. Parent / Guardian (Next of Kin)
              </h2>
              <Link
                href="/application/apply"
                className="text-xs font-medium text-[#196855] hover:underline flex items-center gap-1"
              >
                <Edit className="w-3 h-3" /> Edit
              </Link>
            </div>
            <div className="p-5 text-xs">
              {guardians.length === 0 ? (
                <span className="text-red-500 italic">No parent / guardian details entered.</span>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-500 block">Full Name</span>
                    <span className="font-semibold text-slate-800">{guardians[0].full_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Relationship</span>
                    <span className="font-semibold text-slate-800">{guardians[0].relationship}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Telephone</span>
                    <span className="font-semibold text-slate-800">{guardians[0].phone_number}</span>
                  </div>
                  <div className="md:col-span-3">
                    <span className="text-slate-500 block">Residential Address</span>
                    <span className="font-semibold text-slate-800">{guardians[0].address || '—'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: QUALIFICATIONS */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#196855]" /> 4. Academic Qualifications (O-Level)
              </h2>
              <Link
                href="/application/apply"
                className="text-xs font-medium text-[#196855] hover:underline flex items-center gap-1"
              >
                <Edit className="w-3 h-3" /> Edit
              </Link>
            </div>
            <div className="p-5 text-xs space-y-4">
              {quals.map((q, idx) => (
                <div key={q.id || idx} className="border border-slate-200 rounded p-4 bg-slate-50/50">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-800">{q.exam_name} ({q.exam_year})</span>
                    <span className="font-mono text-slate-600">Exam No: {q.exam_number || '—'}</span>
                    <span className="text-slate-500">{q.exam_sitting}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {(q.subjects || []).map((sub, sIdx) => (
                      <div key={sIdx} className="bg-white p-2 rounded border border-slate-200 flex justify-between items-center">
                        <span className="truncate pr-1 text-slate-700 font-medium">{sub.subject}</span>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {sub.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: PROGRAMME SELECTION */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#196855]" /> 5. Selected Programme
              </h2>
              <Link
                href="/application/apply"
                className="text-xs font-medium text-[#196855] hover:underline flex items-center gap-1"
              >
                <Edit className="w-3 h-3" /> Edit
              </Link>
            </div>
            <div className="p-5 text-xs">
              {prog ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{prog.programme?.name}</h3>
                    <p className="text-slate-600 mt-1">{prog.entry_requirements}</p>
                    <div className="flex items-center gap-3 mt-2 text-slate-500">
                      <span>Duration: {prog.duration}</span>
                      <span>•</span>
                      <span>Session: {application?.admission_session?.name || '2026/2027'}</span>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold">
                    Approved
                  </span>
                </div>
              ) : (
                <span className="text-red-500 italic">No programme selected yet.</span>
              )}
            </div>
          </div>

          {/* SECTION 6: DOCUMENTS */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#196855]" /> 6. Uploaded Documents
              </h2>
              <Link
                href="/application/apply"
                className="text-xs font-medium text-[#196855] hover:underline flex items-center gap-1"
              >
                <Edit className="w-3 h-3" /> Edit
              </Link>
            </div>
            <div className="p-5 text-xs">
              {docs.length === 0 ? (
                <span className="text-red-500 italic">No documents uploaded.</span>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {docs.map((d, idx) => (
                    <div key={d.id || idx} className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 capitalize block">
                          {d.document_type.replace('_', ' ')}
                        </span>
                        <span className="text-slate-500 text-[11px] font-mono">{d.file_name}</span>
                      </div>
                      <span className="text-emerald-700 bg-emerald-100 text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Uploaded
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DECLARATION & SUBMISSION */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Applicant Attestation & Declaration
            </h3>
            <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 leading-relaxed mb-4">
              "I hereby declare and affirm that all the statements and documents submitted in this online admission application are true, complete and correct. I understand that any false declaration or forged academic credentials will result in immediate disqualification, nullification of admission, and possible prosecution by lawful authorities."
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={declarationConfirmed}
                onChange={e => setDeclarationConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-[#196855] rounded border-slate-300 focus:ring-[#196855]"
              />
              <span className="text-xs font-medium text-slate-800">
                I have verified all entries above and confirm that this information is complete and accurate.
              </span>
            </label>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <Link
                href="/application/apply"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                ← Return to Edit
              </Link>

              <button
                type="button"
                disabled={!declarationConfirmed || submitting}
                onClick={() => setShowConfirmModal(true)}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-xs font-bold transition shadow-sm ${
                  declarationConfirmed && !submitting
                    ? 'bg-[#196855] text-white hover:bg-emerald-800 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-base font-bold text-center text-slate-900 mb-1">
              Final Submission Confirmation
            </h3>
            <p className="text-xs text-center text-slate-600 mb-6">
              Are you sure you want to finalize your application? Once submitted, your profile will be locked and you cannot make further alterations.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Review Again
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="flex-1 px-4 py-2 bg-[#196855] text-white rounded text-xs font-semibold hover:bg-emerald-800 transition"
              >
                {submitting ? 'Submitting...' : 'Yes, Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
