import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ApplicationRecord } from '../../types';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import { Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RegistrationSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationRecord;
}

export const RegistrationSlipModal: React.FC<RegistrationSlipModalProps> = ({
  isOpen,
  onClose,
  application
}) => {
  if (!isOpen) return null;

  const securityCode = `${INSTITUTION_INFO.securityCodePrefix}/${application.ref_number.split('/').pop() || '00142'}`;
  const verificationUrl = `${INSTITUTION_INFO.website}/verify?ref=${application.ref_number}&sec=${securityCode}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-6 border-4 border-[#006B35] flex flex-col max-h-[95vh]">
        
        {/* Modal Controls (No Print) */}
        <div className="bg-[#0B132B] text-white p-3.5 px-6 flex justify-between items-center no-print shrink-0 border-b-2 border-[#D4A62A]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#D4A62A]" size={18} />
            <span className="font-bold text-xs sm:text-sm">Official AHCAS Examination Registration Slip (PDF Form Standard)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D4A62A] hover:bg-[#b88d1d] text-black font-extrabold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Registration Slip</span>
            </button>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-300">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Form Matching Page 6 of Official PDF */}
        <div className="p-6 sm:p-8 space-y-4 printable-document bg-white font-sans overflow-y-auto text-[11px] leading-tight text-slate-800">
          
          {/* Header Section */}
          <div className="border-2 border-[#006B35] p-3 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 relative">
            
            <div className="flex items-center gap-3">
              <img
                src="/official-logo.jpg"
                alt="AHCAS Official Logo"
                className="h-16 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#006B35] tracking-tight font-serif">
                  AL-HIDAYAH
                </h1>
                <p className="text-xs font-black uppercase tracking-wider text-slate-900">
                  COLLEGE OF ADVANCED STUDIES
                </p>
                <p className="text-[10px] text-slate-600">
                  {INSTITUTION_INFO.address}
                </p>
                <div className="text-[9px] text-slate-600 flex flex-wrap gap-2 pt-0.5 font-mono">
                  <span>✉ {INSTITUTION_INFO.email}</span>
                  <span>🌐 {INSTITUTION_INFO.website}</span>
                  <span>📞 {INSTITUTION_INFO.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-700 block">RC: {INSTITUTION_INFO.rcNumber}</span>
                <span className="text-[9px] font-bold text-emerald-800 block">“Developing the best minds for the future”</span>
              </div>
              <div className="p-1 border border-slate-300 rounded bg-white shadow-xs">
                <QRCodeSVG value={verificationUrl} size={60} />
              </div>
            </div>

          </div>

          {/* Banner Strip */}
          <div className="grid grid-cols-12 gap-2 text-center text-xs font-bold items-center">
            <div className="col-span-12 sm:col-span-8 bg-[#006B35] text-white py-1.5 px-3 rounded-lg flex justify-between items-center">
              <span>STUDY CENTRE: {INSTITUTION_INFO.studyCentre.toUpperCase()}</span>
              <span className="text-[10px] text-amber-300 font-mono">CENTRE NUMBER: AHCAS/ABJ/01</span>
            </div>
            <div className="col-span-6 sm:col-span-2 bg-[#D4A62A] text-black py-1.5 px-2 rounded-lg font-black text-[10px] uppercase">
              REGISTRATION FORM
            </div>
            <div className="col-span-6 sm:col-span-2 bg-slate-100 border border-slate-300 text-slate-800 py-1.5 px-2 rounded-lg text-[10px]">
              Form Fee: <strong>₦{INSTITUTION_INFO.formFeeNgn.toLocaleString()}</strong>
            </div>
          </div>

          {/* SECTION A: PROGRAMME DETAILS */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-slate-100 font-bold px-3 py-1 text-slate-800 text-[10px] uppercase tracking-wider border-b border-slate-300">
              SECTION A: PROGRAMME DETAILS
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">PROGRAMME:</span>
                <strong className="text-slate-900">{application.programme_title}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">DEPARTMENT:</span>
                <strong className="text-slate-900">IJMB Academic Studies</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ACADEMIC SESSION:</span>
                <strong className="text-slate-900">2026 / 2027</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">DURATION:</span>
                <strong className="text-slate-900">12 Months (2 Semesters)</strong>
              </div>
            </div>
          </div>

          {/* SECTION B: APPLICANT INFORMATION */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-slate-100 font-bold px-3 py-1 text-slate-800 text-[10px] uppercase tracking-wider border-b border-slate-300 flex justify-between items-center">
              <span>SECTION B: APPLICANT INFORMATION</span>
              <span className="text-[9px] text-slate-500 font-normal">Our Ref: <strong className="font-mono text-[#006B35]">{application.ref_number}</strong></span>
            </div>

            <div className="p-3 grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
              
              <div className="sm:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">(i) Full Legal Name:</span>
                  <strong className="text-slate-900 text-xs block">{application.full_name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(ii) Gender:</span>
                  <strong className="text-slate-900">{application.gender}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(iii) State of Origin:</span>
                  <strong className="text-slate-900">{application.state_of_origin}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(iv) Local Govt Area:</span>
                  <strong className="text-slate-900">{application.lga || 'Abaji Area Council'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(v) Student Phone Number:</span>
                  <strong className="text-slate-900 font-mono">{application.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(vi) National NIN Number:</span>
                  <strong className="text-slate-900 font-mono">{application.nin_number || '74618290142'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(vii) Email Address:</span>
                  <strong className="text-slate-900">{application.email}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(viii) Parent/Guardian Phone:</span>
                  <strong className="text-slate-900 font-mono">{application.guardian_phone || application.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(ix) Date of Submission:</span>
                  <strong className="text-slate-900">{application.submitted_at}</strong>
                </div>
              </div>

              {/* Passport Box */}
              <div className="sm:col-span-3 flex justify-center">
                <div className="w-28 h-32 border-2 border-dashed border-slate-400 rounded-lg flex flex-col items-center justify-center bg-slate-50 p-1 text-center">
                  <img
                    src="/provost-mbsuleiman.jpg"
                    alt="Applicant Passport"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              </div>

            </div>

            {/* Direct Entry Proposed University Course */}
            <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-slate-500">Proposed Course of Study (Direct Entry):</span>
                <strong className="block text-slate-900 text-xs">{application.target_university_course || 'Medicine & Surgery / Engineering'}</strong>
              </div>
              <div>
                <span className="text-slate-500">Target University Destination:</span>
                <strong className="block text-slate-900 text-xs">Ahmadu Bello University (ABU) / University of Abuja</strong>
              </div>
            </div>
          </div>

          {/* SECTION C: SUBJECT COMBINATIONS & O'LEVEL RESULTS */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-slate-100 font-bold px-3 py-1 text-slate-800 text-[10px] uppercase tracking-wider border-b border-slate-300">
              SECTION C: O’LEVEL SUBJECT CODES & APPROVED COMBINATION
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-300 p-3 gap-3">
              <div>
                <h4 className="font-bold text-xs text-[#006B35] mb-1">
                  Selected IJMB Combinable Subject Code: <span className="font-mono text-sm underline">{application.subject_combination_code || '030'}</span>
                </h4>
                <p className="text-[11px] text-slate-700 font-semibold mb-2">
                  Subjects: {application.subject_combination_name || 'Biology, Chemistry, Physics'}
                </p>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-600">
                  <span>HOD / Coordinator Certification:</span>
                  <div className="pt-2 flex justify-between items-end">
                    <span className="font-serif italic font-bold text-slate-800">Mall. Ibrahim Idris Gambo</span>
                    <span className="text-[9px] font-mono text-emerald-800">Sign & Stamp Approved</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-800 mb-1">
                  Verified O’Level Examination Record:
                </h4>
                <p className="text-[11px] text-slate-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-mono">
                  {application.olevel_sitting_1}
                </p>
                <p className="text-[9px] text-slate-500 mt-1">
                  Status: 5 Credits verified in accordance with national IJMB entry regulations.
                </p>
              </div>
            </div>
          </div>

          {/* ATTESTATION SECTION */}
          <div className="border border-slate-300 rounded-xl p-3 bg-slate-50 space-y-2 text-[10px]">
            <div className="font-bold uppercase text-slate-800">ATTESTATION (PARENT / SPONSOR / GUARDIAN)</div>
            <p className="text-slate-600 leading-normal">
              I hereby certify that the above-given information in respect of the candidate is genuine and that I shall be responsible for his/her financial obligations and conduct throughout the duration of the IJMB programme.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <span className="text-slate-500 block">Guardian Name:</span>
                <strong className="text-slate-900">{application.guardian_name || 'Alhaji Usman Abdullahi'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Phone Number:</span>
                <strong className="text-slate-900 font-mono">{application.guardian_phone || application.phone}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Endorsement:</span>
                <strong className="text-emerald-800 font-serif italic text-xs">Attested & Accepted</strong>
              </div>
            </div>
          </div>

          {/* FOOTER & SECURITY CODE (Matching PDF Page 6 bottom) */}
          <div className="border-t-2 border-[#006B35] pt-3 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-950 text-white rounded-lg text-center font-bold text-[9px] font-mono">
                OFFICIAL SEAL<br />AHCAS VALID
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase block font-bold">SECURITY CODE:</span>
                <span className="font-mono font-black text-xs text-[#006B35] tracking-widest">{securityCode}</span>
              </div>
            </div>

            <div className="text-center sm:text-right text-[9px] text-slate-500">
              <span className="block font-bold text-slate-700">THIS DOCUMENT IS THE PROPERTY OF AL-HIDAYAH COLLEGE OF ADVANCED STUDIES</span>
              <span>ANY UNAUTHORIZED COPYING, ALTERATION OR DUPLICATION IS STRICTLY PROHIBITED</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
