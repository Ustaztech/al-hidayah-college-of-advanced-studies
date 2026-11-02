'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  XCircle,
  Award
} from 'lucide-react';
import { Application, AdmissionOffer } from '@/lib/types';

export default function AdmissionLetterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [offer, setOffer] = useState<AdmissionOffer | null>(null);
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/application/offer');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/application/login');
          return;
        }
        throw new Error('Failed to load admission offer');
      }

      const data = await res.json();
      if (data.success) {
        setApplication(data.application);
        setOffer(data.offer || null);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error loading admission offer' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  const handleRespond = async (decision: 'accept' | 'decline') => {
    try {
      setIsResponding(true);
      setFeedback(null);

      const res = await fetch('/api/application/offer/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: decision })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit decision');
      }

      setFeedback({
        type: 'success',
        message: decision === 'accept'
          ? 'Provisional Admission Offer formally accepted! Congratulations.'
          : 'You have declined this provisional admission offer.'
      });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsResponding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#196855] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">Retrieving official admission credentials...</p>
      </div>
    );
  }

  // If no offer has been issued yet
  if (!offer || application?.status !== 'accepted') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-xl border border-slate-200 shadow-md text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-2">Admission Screening In Progress</h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            Your application dossier is currently undergoing institutional screening by the Directorate of Admissions. Official Provisional Admission Letters will be issued to successful candidates upon conclusion of evaluation.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/application/dashboard"
              className="w-full py-2.5 px-4 bg-[#196855] text-white text-xs font-semibold rounded-md hover:bg-emerald-800 transition"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const p = application?.personal_details;
  const c = application?.contact_details;
  const candidateName = [p?.surname, p?.first_name, p?.middle_name].filter(Boolean).join(' ') || application?.applicant?.full_name || 'Candidate';
  const offerDate = new Date(offer.offer_date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const deadlineDate = new Date(offer.acceptance_deadline).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const isLapsed = new Date() > new Date(offer.acceptance_deadline) && offer.offer_status === 'offered';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 py-6 px-2 sm:px-4 print:p-0 print:bg-white">
      {/* Non-print Action Header */}
      <div className="max-w-4xl mx-auto mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <Link
          href="/application/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm transition self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {offer.offer_status === 'offered' && !isLapsed && (
            <button
              onClick={() => handleRespond('accept')}
              disabled={isResponding}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-md shadow transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Accept Offer
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#196855] hover:bg-emerald-800 px-4 py-2 rounded-md shadow transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Save Letter (PDF)
          </button>
        </div>
      </div>

      {feedback && (
        <div className="max-w-4xl mx-auto mb-4 print:hidden">
          <div
            className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Official Admission Letter Document */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 shadow-md p-8 sm:p-12 print:border-none print:shadow-none print:p-0 print:m-0 font-serif leading-relaxed">
        {/* Institutional Header */}
        <div className="border-b-2 border-[#196855] pb-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-slate-200 flex items-center justify-center p-1 bg-white shrink-0">
              <img src="/logo.jpg" alt="AHCAS Logo" className="w-16 h-16 rounded-full object-cover" />
            </div>

            <div className="text-center flex-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-wide uppercase font-sans">
                AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
              </h1>
              <p className="text-xs font-bold text-[#196855] uppercase tracking-wider mt-0.5 font-sans">
                Directorate of Admissions & Academic Planning
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
                P.O. Box 102, Keffi / Abuja Expressway • admissions@alhidayahcollege.com.ng • portal.alhidayahcollege.com.ng
              </p>
            </div>

            <div className="w-20 shrink-0 text-right font-sans">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                OFFICIAL
              </span>
            </div>
          </div>
        </div>

        {/* Letter Metadata & Addressing */}
        <div className="flex justify-between items-start text-xs font-sans mb-6">
          <div className="space-y-1">
            <div>
              <span className="text-slate-500 text-[11px]">Letter Reference:</span>
              <span className="font-bold text-slate-900 font-mono ml-1">{offer.offer_letter_number}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px]">Application Number:</span>
              <span className="font-bold text-[#196855] font-mono ml-1">{application?.application_number}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-slate-500 text-[11px]">Date of Issue:</span>
            <span className="font-bold text-slate-900 ml-1">{offerDate}</span>
          </div>
        </div>

        {/* Candidate Recipient Block */}
        <div className="mb-6 text-xs font-sans bg-slate-50 p-4 rounded border border-slate-200">
          <div className="font-bold text-slate-900 uppercase text-sm mb-0.5">{candidateName}</div>
          <div className="text-slate-600">{c?.residential_address || 'Candidate Residential Address'}</div>
          <div className="text-slate-600">{c?.city || 'City'}, {c?.state_of_residence || 'State'}</div>
          <div className="text-slate-500 font-mono text-[11px] mt-1">{c?.phone_number} • {application?.applicant?.email}</div>
        </div>

        {/* Formal Title */}
        <div className="text-center mb-6">
          <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase underline tracking-wider font-sans">
            OFFER OF PROVISIONAL ADMISSION FOR THE {offer.admission_session?.name?.toUpperCase() || '2026/2027 ACADEMIC SESSION'}
          </h2>
        </div>

        {/* Letter Content */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-800 text-justify">
          <p>
            I am pleased to convey the decision of the Academic Board of <strong>Al-Hidayah College of Advanced Studies</strong> that you have been offered <strong>PROVISIONAL ADMISSION</strong> to pursue an academic programme of study as detailed below:
          </p>

          {/* Admitted Programme Details Table */}
          <div className="my-4 border border-slate-300 rounded font-sans text-xs bg-slate-50/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-300">
              <div className="p-3">
                <span className="text-[11px] text-slate-500 block uppercase font-semibold">Programme / Course of Study:</span>
                <span className="font-bold text-slate-900 text-sm">{offer.programme?.name || 'Academic Programme'}</span>
              </div>
              <div className="p-3">
                <span className="text-[11px] text-slate-500 block uppercase font-semibold">Academic Session:</span>
                <span className="font-bold text-slate-900">{offer.admission_session?.name || '2026/2027'}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-300 border-t border-slate-300">
              <div className="p-3">
                <span className="text-[11px] text-slate-500 block uppercase font-semibold">Level of Entry:</span>
                <span className="font-semibold text-slate-900">IJMB Year 1 (Direct Entry to 200-Level)</span>
              </div>
              <div className="p-3">
                <span className="text-[11px] text-slate-500 block uppercase font-semibold">Acceptance Deadline:</span>
                <span className="font-bold text-red-700 font-mono">{deadlineDate}</span>
              </div>
            </div>
          </div>

          <p>
            This offer of provisional admission is subject to your fulfillment of the following institutional conditions:
          </p>

          <ol className="list-decimal list-inside space-y-1.5 pl-2 font-sans text-xs text-slate-700">
            <li>
              <strong>Credential Verification:</strong> You must present the original copies of your O-Level certificates (WAEC, NECO, or NABTEB), Primary School Certificate, Local Government Certificate of Origin, and National Population Commission (NPC) Birth Certificate at the Directorate of Admissions during physical screening.
            </li>
            <li>
              <strong>Acceptance of Offer:</strong> You must indicate your acceptance of this provisional admission offer on the applicant portal on or before <strong>{deadlineDate}</strong>. Failure to accept within the stipulated timeframe shall be interpreted as forfeiture of the admission offer.
            </li>
            <li>
              <strong>Institutional Regulations:</strong> You are expected to abide strictly by the Code of Conduct, Academic Regulations, and Statutes of Al-Hidayah College of Advanced Studies.
            </li>
            <li>
              <strong>Revocation:</strong> The College reserves the right to withdraw this offer at any time should it be discovered that you do not possess the minimum entry qualifications or submitted forged or falsified credentials.
            </li>
          </ol>

          <p className="pt-2">
            On behalf of the Rector, Management, and Academic Staff, I congratulate you on your provisional admission and welcome you to a rewarding academic journey at Al-Hidayah College of Advanced Studies.
          </p>
        </div>

        {/* Signatures & Seal */}
        <div className="mt-8 pt-6 border-t-2 border-slate-300 flex justify-between items-end text-xs font-sans">
          <div>
            <div className="border-b border-slate-400 pb-10 w-48 mb-1" />
            <div className="font-bold text-slate-900">Mall. Usman Saidu</div>
            <div className="text-slate-500 text-[11px]">Academic Registrar & Secretary to Board</div>
            <div className="text-[#196855] text-[10px] font-bold mt-0.5">AL-HIDAYAH COLLEGE OF ADVANCED STUDIES</div>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#196855] flex flex-col items-center justify-center p-2 text-center text-[#196855] opacity-80">
              <span className="text-[9px] font-black uppercase">OFFICIAL REGISTRAR</span>
              <span className="text-[10px] font-extrabold">SEAL</span>
              <span className="text-[8px] font-mono">{offerDate}</span>
            </div>
          </div>
        </div>

        {/* Offer Acceptance Status Stamp */}
        <div className="mt-6 p-3 rounded border font-sans text-xs flex items-center justify-between print:hidden bg-slate-50">
          <div>
            <span className="text-slate-500 text-[11px] block">Current Offer Acceptance Status:</span>
            <span className={`font-bold capitalize ${
              offer.offer_status === 'accepted' ? 'text-emerald-700' : offer.offer_status === 'declined' ? 'text-red-700' : 'text-amber-700'
            }`}>
              {offer.offer_status === 'accepted' ? '✓ Accepted by Candidate' : offer.offer_status === 'declined' ? '✗ Declined by Candidate' : '● Pending Candidate Acceptance'}
            </span>
          </div>

          {offer.offer_status === 'offered' && !isLapsed && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRespond('decline')}
                disabled={isResponding}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-100 transition"
              >
                Decline Offer
              </button>
              <button
                onClick={() => handleRespond('accept')}
                disabled={isResponding}
                className="px-4 py-1.5 bg-[#196855] text-white rounded text-xs font-bold hover:bg-emerald-800 transition"
              >
                Accept Offer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
