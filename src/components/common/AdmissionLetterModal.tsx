import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ApplicationRecord } from '../../types';
import { INSTITUTION_INFO, TUITION_SCHEDULE } from '../../data/ijmbData';
import { Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AdmissionLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicationRecord;
}

export const AdmissionLetterModal: React.FC<AdmissionLetterModalProps> = ({
  isOpen,
  onClose,
  applicant
}) => {
  if (!isOpen) return null;

  const securityCode = `${INSTITUTION_INFO.securityCodePrefix}/${applicant.ref_number.split('/').pop() || '00142'}`;
  const verificationUrl = `${INSTITUTION_INFO.website}/verify/letter?ref=${applicant.ref_number}&sec=${securityCode}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-6 border-4 border-[#006B35] flex flex-col max-h-[95vh]">
        
        {/* Controls Bar (No Print) */}
        <div className="bg-[#0B132B] text-white p-3.5 px-6 flex justify-between items-center no-print shrink-0 border-b-2 border-[#D4A62A]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#D4A62A]" size={18} />
            <span className="font-bold text-xs sm:text-sm">Official AHCAS Provisional Admission Letter</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D4A62A] hover:bg-[#b88d1d] text-black font-extrabold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Admission Letter</span>
            </button>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-300">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Official Printable Admission Letter Document */}
        <div className="p-8 sm:p-12 space-y-6 printable-document bg-white font-serif overflow-y-auto text-xs text-slate-900 leading-normal">
          
          {/* Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-[#006B35] pb-5">
            <div className="flex items-center gap-4">
              <img src="/official-logo.jpg" alt="AHCAS Official Crest" className="h-20 w-auto object-contain" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#006B35] tracking-tight uppercase">
                  AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
                </h1>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Abaji Study Centre, Federal Capital Territory (FCT), Abuja – Nigeria
                </p>
                <p className="text-[11px] text-slate-600 font-sans italic">
                  “Advancing Academic Excellence Through Structured A-Level Education”
                </p>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                  RC: {INSTITUTION_INFO.rcNumber} • Email: {INSTITUTION_INFO.email} • Web: {INSTITUTION_INFO.website}
                </p>
              </div>
            </div>

            {/* Verification QR Code */}
            <div className="text-center shrink-0">
              <div className="p-1.5 border border-slate-300 rounded bg-white shadow-xs">
                <QRCodeSVG value={verificationUrl} size={65} />
              </div>
              <span className="text-[9px] font-mono text-slate-500 block mt-1 font-sans">QR Verified</span>
            </div>
          </div>

          {/* Letter Metadata */}
          <div className="flex justify-between text-xs font-sans text-slate-700 border-b border-slate-200 pb-2">
            <div>
              <span className="font-bold block text-slate-900 uppercase">OFFICE OF THE REGISTRAR & ADMISSIONS DIRECTORATE</span>
              <span>Our Ref: <strong className="font-mono text-[#006B35]">{applicant.ref_number}</strong></span>
            </div>
            <div className="text-right">
              <span>Date: <strong>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
            </div>
          </div>

          {/* Recipient Details */}
          <div className="text-xs font-sans space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="font-bold text-sm text-slate-900">{applicant.full_name.toUpperCase()}</p>
            <p>Application Ref: <strong>{applicant.ref_number}</strong></p>
            <p>State of Origin: {applicant.state_of_origin} {applicant.lga ? `(${applicant.lga})` : ''}</p>
            <p>Study Centre: <strong>{INSTITUTION_INFO.studyCentre}</strong></p>
          </div>

          {/* Salutation & Subject */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
            <p className="font-bold">Dear Candidate,</p>

            <div className="py-2.5 text-center border-y-2 border-slate-900 bg-emerald-50/60 my-2">
              <h2 className="text-sm sm:text-base font-black text-[#006B35] uppercase font-serif tracking-wide">
                OFFER OF PROVISIONAL ADMISSION FOR 2026/2027 ACADEMIC SESSION
              </h2>
              <p className="text-xs font-bold text-slate-700 mt-0.5">
                PROGRAMME: {applicant.programme_title.toUpperCase()} (DIRECT ENTRY 200L PATHWAY)
              </p>
            </div>

            <p>
              I am pleased to inform you that following the review of your academic credentials and O’Level submissions, the Academic Board of <strong>Al-Hidayah College of Advanced Studies</strong> has offered you provisional admission into the 12-Month Interim Joint Matriculation Board (IJMB) Programme for the 2026/2027 Academic Session.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-sans">
              <div>
                <span className="text-slate-500 block">Assigned Subject Combination:</span>
                <strong className="text-slate-900">{applicant.subject_combination_code || '030'} — {applicant.subject_combination_name || 'Biology, Chemistry, Physics'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Target University Course:</span>
                <strong className="text-slate-900">{applicant.target_university_course || 'Medicine & Surgery MBBS / Engineering'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">1st Semester Tuition Installment:</span>
                <strong className="text-amber-700 font-mono font-bold">₦{TUITION_SCHEDULE.ijmb.firstInstallment.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">2nd Semester Tuition Balance:</span>
                <strong className="text-amber-700 font-mono font-bold">₦{TUITION_SCHEDULE.ijmb.secondInstallment.toLocaleString()}</strong>
              </div>
            </div>

            <p>
              This admission is subject to your presenting original copies of your WAEC/NECO/NABTEB certificates and complying with the <strong>Student Documentation Policy</strong> (minimum 12 mandatory physical files) as stipulated in Document Code <code>{INSTITUTION_INFO.documentCode}</code>.
            </p>

            <p>
              Lectures run for a minimum period of 12 months in strict adherence to the IJMB calendar of activities. Candidates must maintain the minimum six (6) lecture hours per week per subject and three (3) hours of laboratory practical sessions.
            </p>

            <p>
              Congratulations on taking this decisive step toward securing direct 200 Level university admission.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-6 font-sans">
            <div>
              <div className="h-10 flex items-end">
                <span className="font-serif italic font-bold text-sm text-slate-800 underline decoration-slate-400">
                  Mall. Usman Saidu
                </span>
              </div>
              <p className="font-bold text-xs text-slate-900">Mall. Usman Saidu</p>
              <p className="text-[10px] text-slate-500">Registrar / Examination Officer</p>
            </div>

            <div className="text-right">
              <div className="h-10 flex items-end justify-end">
                <span className="font-serif italic font-bold text-sm text-[#006B35] underline decoration-emerald-400">
                  Dr. MB Suleiman, PhD
                </span>
              </div>
              <p className="font-bold text-xs text-slate-900">Dr. MB Suleiman, PhD (Magajin Ilimin Abaji)</p>
              <p className="text-[10px] text-slate-500">Executive Chairman / Director</p>
            </div>
          </div>

          {/* Security Footer */}
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono text-slate-500 font-sans">
            <span>Security Code: <strong>{securityCode}</strong></span>
            <span>Al-Hidayah College • Official Document Sealed</span>
          </div>

        </div>

      </div>
    </div>
  );
};
