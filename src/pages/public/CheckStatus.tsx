import React, { useState } from 'react';
import { db } from '../../services/db';
import { ApplicationRecord } from '../../types';
import { AdmissionLetterModal } from '../../components/common/AdmissionLetterModal';
import { RegistrationSlipModal } from '../../components/common/RegistrationSlipModal';
import { ScratchCardModal } from '../../components/common/ScratchCardModal';
import { Search, FileCheck, CheckCircle2, ShieldCheck, Download, AlertCircle, Printer, Award } from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const CheckStatus: React.FC = () => {
  const [refInput, setRefInput] = useState('');
  const [applicant, setApplicant] = useState<ApplicationRecord | null>(null);
  const [error, setError] = useState('');
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [scratchModalOpen, setScratchModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const apps = db.getApplications();
    const cleanRef = refInput.trim().toLowerCase();

    const found = apps.find(
      a =>
        a.ref_number.toLowerCase() === cleanRef ||
        a.email.toLowerCase() === cleanRef ||
        (a.phone && a.phone.toLowerCase() === cleanRef)
    );

    if (found) {
      setApplicant(found);
    } else {
      setApplicant(null);
      setError('No application record found matching this reference number or email address. Please verify your details.');
    }
  };

  return (
    <div className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black text-[#006B35] dark:text-emerald-400 uppercase tracking-widest block">
            Admissions Screening & Decision Portal
          </span>
          <h1 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
            Check Admission Status & Print Letter
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Enter your Application Reference Number (e.g. <code>AHCAS/IJMB/2026/00142</code>) or registered email address.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#F8FAFC] dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Application Reference No. or Email Address
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  placeholder="AHCAS/IJMB/2026/00142"
                  value={refInput}
                  onChange={e => setRefInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono tracking-wider focus:ring-2 focus:ring-[#006B35]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#006B35] hover:bg-[#004D26] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0 shadow-md"
                >
                  <Search size={16} />
                  <span>Verify Status</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-end items-center text-xs pt-1 gap-2">
              <button
                type="button"
                onClick={() => setScratchModalOpen(true)}
                className="text-[#D4A62A] hover:underline font-bold"
              >
                Verify Scratch Card PIN
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-red-700 dark:text-red-300 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Admission Result Card */}
        {applicant && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-emerald-500 p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Verification Report
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                  {applicant.full_name}
                </h3>
                <p className="text-xs font-mono text-[#006B35] dark:text-emerald-400">
                  Ref: {applicant.ref_number} • State: {applicant.state_of_origin}
                </p>
              </div>

              <div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                  applicant.status === 'Admitted'
                    ? 'bg-emerald-100 text-[#006B35] dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-400'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-400'
                }`}>
                  <CheckCircle2 size={14} />
                  <span>Status: {applicant.status}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block">Programme Offered:</span>
                <strong className="text-slate-900 dark:text-white text-sm">{applicant.programme_title}</strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block">Study Centre:</span>
                <strong className="text-[#006B35] dark:text-emerald-400 font-bold">{applicant.study_centre || INSTITUTION_INFO.studyCentre}</strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block">Assigned Subject Combination:</span>
                <strong className="text-slate-900 dark:text-white">{applicant.subject_combination_code || '030'} — {applicant.subject_combination_name || 'Biology, Chemistry, Physics'}</strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block">Security Verification Code:</span>
                <strong className="text-amber-600 dark:text-amber-400 font-mono">{INSTITUTION_INFO.securityCodePrefix}/{applicant.ref_number.split('/').pop()}</strong>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-3">
              <button
                onClick={() => setSlipModalOpen(true)}
                className="px-5 py-2.5 bg-[#D4A62A] hover:bg-[#b88d1d] text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
              >
                <Printer size={15} />
                <span>View / Print Registration Slip</span>
              </button>

              {applicant.status === 'Admitted' && (
                <button
                  onClick={() => setLetterModalOpen(true)}
                  className="px-5 py-2.5 bg-[#006B35] hover:bg-[#004D26] text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Award size={15} />
                  <span>Download Official Admission Letter</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      {applicant && (
        <>
          <AdmissionLetterModal
            isOpen={letterModalOpen}
            onClose={() => setLetterModalOpen(false)}
            applicant={applicant}
          />
          <RegistrationSlipModal
            isOpen={slipModalOpen}
            onClose={() => setSlipModalOpen(false)}
            application={applicant}
          />
        </>
      )}

      <ScratchCardModal
        isOpen={scratchModalOpen}
        onClose={() => setScratchModalOpen(false)}
        expectedType="ADMISSION_STATUS"
        title="Admission Status Scratch Card PIN Verification"
        onSuccessUnlock={() => {
          setScratchModalOpen(false);
          setError('');
        }}
      />

    </div>
  );
};
