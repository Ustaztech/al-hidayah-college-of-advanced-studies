import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/db';
import { IJMB_SUBJECT_COMBINATIONS, INSTITUTION_INFO } from '../../data/ijmbData';
import { ApplicationRecord } from '../../types';
import { AdmissionLetterModal } from '../../components/common/AdmissionLetterModal';
import { RegistrationSlipModal } from '../../components/common/RegistrationSlipModal';
import {
  Check,
  UploadCloud,
  FileText,
  AlertCircle,
  Bookmark,
  ChevronRight,
  CheckCircle2,
  Printer,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const ApplicantPortal: React.FC = () => {
  const { currentUser, applicantData } = useAuth();
  const existingApp = applicantData || (currentUser ? db.getApplications().find(a => a.email.toLowerCase() === currentUser.email.toLowerCase() || a.ref_number === currentUser.refNumber) : null);
  const [activeStep, setActiveStep] = useState(existingApp ? 3 : 1);
  const [programmeType, setProgrammeType] = useState<'ND' | 'HND' | 'IJMB'>((existingApp?.category as any) || 'IJMB');
  const [selectedCourse, setSelectedCourse] = useState(existingApp?.programme_title || 'IJMB Direct Entry Programme (A-Level)');
  const [jambRegNo, setJambRegNo] = useState(existingApp?.jamb_reg_no || '');
  const [jambScore, setJambScore] = useState(existingApp?.jamb_score ? String(existingApp.jamb_score) : '');
  const [uploadedFile, setUploadedFile] = useState<string | null>(existingApp ? 'olevel_certificate.pdf' : null);
  const [saveDraftNotice, setSaveDraftNotice] = useState(false);
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);

  // Application Data
  const [appRecord, setAppRecord] = useState<ApplicationRecord>(() => {
    return existingApp || {
      id: `app-${Date.now()}`,
      ref_number: currentUser?.refNumber || `AHCAS/IJMB/2026/${Math.floor(10000 + Math.random() * 90000)}`,
      full_name: currentUser?.name || 'Prospective Applicant',
      email: currentUser?.email || 'applicant@alhidayahcollege.com.ng',
      phone: currentUser?.phone || INSTITUTION_INFO.phone,
      gender: 'Male',
      state_of_origin: 'FCT Abuja',
      lga: 'Abaji',
      programme_id: 'ijmb-programme',
      programme_title: 'IJMB Direct Entry Programme (A-Level)',
      category: 'IJMB',
      subject_combination_code: '030',
      subject_combination_name: 'Biology, Chemistry, Physics',
      target_university_course: 'Medicine & Surgery MBBS',
      nin_number: '',
      guardian_name: '',
      guardian_phone: '',
      guardian_address: '',
      olevel_sitting_1: 'WAEC: 5 Credits including Maths & English',
      status: 'Submitted',
      submitted_at: new Date().toISOString().substring(0, 10),
      scratch_card_serial: 'AHCAS-APP-98214',
      admission_letter_released: false,
      study_centre: INSTITUTION_INFO.studyCentre,
      form_fee_paid: true
    };
  });

  const handleSaveDraft = () => {
    const updated = db.submitApplication({
      ...appRecord,
      programme_title: selectedCourse,
      category: programmeType,
      jamb_reg_no: jambRegNo,
      jamb_score: jambScore ? Number(jambScore) : undefined,
      full_name: currentUser?.name || appRecord.full_name || 'Prospective Candidate',
      email: currentUser?.email || appRecord.email
    });
    setAppRecord(updated);
    setSaveDraftNotice(true);
    setTimeout(() => setSaveDraftNotice(false), 3000);
  };

  const handleContinue = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    } else {
      const updated = db.submitApplication({
        ...appRecord,
        programme_title: selectedCourse,
        category: programmeType,
        jamb_reg_no: jambRegNo,
        jamb_score: jambScore ? Number(jambScore) : undefined,
        full_name: currentUser?.name || appRecord.full_name || 'Prospective Candidate',
        email: currentUser?.email || appRecord.email
      });
      setAppRecord(updated);
      setSlipModalOpen(true);
    }
  };

  return (
    <PortalLayout activeNav="Admissions" portalTitle="Admissions Application Portal">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar Matching Image 3 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[11px] uppercase font-black tracking-wider text-emerald-800 font-mono block">
              ADMISSIONS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              Your application
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Complete the steps below to submit your application to AL-HIDAYAH COLLEGE OF ADVANCED STUDIES (AHCAS), Abaji.
            </p>
          </div>

          {/* Progress Indicator Matching Image 3 */}
          <div className="w-full sm:w-56 text-right space-y-1.5">
            <span className="text-xs font-black text-slate-700 font-mono">
              60% complete
            </span>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-[#006B35] h-full rounded-full transition-all duration-500 w-3/5" />
            </div>
          </div>
        </div>

        {/* 4-Step Horizontal Stepper (Exact Match to Image 3) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            
            {/* Step 1: Personal details (Completed) */}
            <div className="flex flex-col items-center gap-1.5 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#006B35] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                <Check size={16} className="stroke-[3]" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">
                Personal details
              </span>
            </div>

            <div className="flex-1 h-0.5 bg-[#006B35] mx-2 -mt-5" />

            {/* Step 2: Qualifications (Completed) */}
            <div className="flex flex-col items-center gap-1.5 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#006B35] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                <Check size={16} className="stroke-[3]" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">
                Qualifications
              </span>
            </div>

            <div className="flex-1 h-0.5 bg-[#006B35] mx-2 -mt-5" />

            {/* Step 3: Documents (Active) */}
            <div className="flex flex-col items-center gap-1.5 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#006B35] text-white flex items-center justify-center text-xs font-black ring-4 ring-emerald-100 shadow-xs">
                3
              </div>
              <span className="text-[11px] font-black text-slate-900">
                Documents
              </span>
            </div>

            <div className="flex-1 h-0.5 bg-slate-200 mx-2 -mt-5" />

            {/* Step 4: Review (Pending) */}
            <div className="flex flex-col items-center gap-1.5 relative z-10">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold">
                4
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Review
              </span>
            </div>

          </div>
        </div>

        {/* Main Grid: Left Form Cards & Right Summary Cards (Exact Match to Image 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: FORM SECTIONS */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Card 1: Programme Selection (Exact Match to Image 3) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006B35] flex items-center justify-center">
                  <img src="/official-logo.jpg" alt="Crest" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Programme selection
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose the programme you are applying for.
                  </p>
                </div>
              </div>

              {/* Radio Cards for ND / HND / IJMB */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* ND Option */}
                <button
                  type="button"
                  onClick={() => { setProgrammeType('ND'); setSelectedCourse('Computer Science (ND)'); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    programmeType === 'ND'
                      ? 'border-[#006B35] bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      programmeType === 'ND' ? 'border-[#006B35]' : 'border-slate-300'
                    }`}>
                      {programmeType === 'ND' && <span className="w-2 h-2 rounded-full bg-[#006B35]" />}
                    </span>
                    <span className="font-black text-sm text-slate-900">ND</span>
                  </div>
                  <span className="text-xs text-slate-600 block mt-1">National Diploma</span>
                  <span className="text-[10px] text-slate-400">2 Years</span>
                </button>

                {/* HND Option */}
                <button
                  type="button"
                  onClick={() => { setProgrammeType('HND'); setSelectedCourse('Computer Science (HND)'); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    programmeType === 'HND'
                      ? 'border-[#006B35] bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      programmeType === 'HND' ? 'border-[#006B35]' : 'border-slate-300'
                    }`}>
                      {programmeType === 'HND' && <span className="w-2 h-2 rounded-full bg-[#006B35]" />}
                    </span>
                    <span className="font-black text-sm text-slate-900">HND</span>
                  </div>
                  <span className="text-xs text-slate-600 block mt-1">Higher National Diploma</span>
                  <span className="text-[10px] text-slate-400">2 Years (Post ND)</span>
                </button>

                {/* IJMB Option */}
                <button
                  type="button"
                  onClick={() => { setProgrammeType('IJMB'); setSelectedCourse('IJMB Science Combination 030 (Biology, Chemistry, Physics)'); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    programmeType === 'IJMB'
                      ? 'border-[#006B35] bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      programmeType === 'IJMB' ? 'border-[#006B35]' : 'border-slate-300'
                    }`}>
                      {programmeType === 'IJMB' && <span className="w-2 h-2 rounded-full bg-[#006B35]" />}
                    </span>
                    <span className="font-black text-sm text-slate-900">IJMB</span>
                  </div>
                  <span className="text-xs text-slate-600 block mt-1">Interim Joint Matriculation Board</span>
                  <span className="text-[10px] text-slate-400">1 Year Direct Entry</span>
                </button>

              </div>

              {/* Course Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Choose a course <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCourse}
                  onChange={e => setSelectedCourse(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#006B35]"
                >
                  {programmeType === 'ND' ? (
                    <>
                      <option value="Computer Science (ND)">Computer Science (ND)</option>
                      <option value="Science Laboratory Technology (ND)">Science Laboratory Technology (ND)</option>
                      <option value="Business Administration & Management (ND)">Business Administration & Management (ND)</option>
                      <option value="Mass Communication (ND)">Mass Communication (ND)</option>
                      <option value="Accountancy (ND)">Accountancy (ND)</option>
                    </>
                  ) : programmeType === 'HND' ? (
                    <>
                      <option value="Computer Science (HND)">Computer Science (HND)</option>
                      <option value="Science Laboratory Technology (HND)">Science Laboratory Technology (HND)</option>
                      <option value="Business Administration & Management (HND)">Business Administration & Management (HND)</option>
                      <option value="Mass Communication (HND)">Mass Communication (HND)</option>
                    </>
                  ) : (
                    IJMB_SUBJECT_COMBINATIONS.slice(0, 15).map(c => (
                      <option key={c.code} value={`Code ${c.code}: ${c.subjects}`}>
                        Code {c.code}: {c.subjects} (Direct Entry)
                      </option>
                    ))
                  )}
                </select>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  The {selectedCourse} programme provides a strong foundation in practical skills, modern computing, laboratory analysis, and problem solving for a successful tertiary academic career.
                </p>
              </div>

            </div>

            {/* Card 2: O'Level Results (WAEC / NECO) (Exact Match to Image 3) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006B35] flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    O'Level Results (WAEC / NECO)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload your WAEC or NECO result slip (at least 5 credits including English Language and Mathematics).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Drag and Drop Box */}
                <div className="md:col-span-8 p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center space-y-2 hover:bg-slate-100/60 transition-colors cursor-pointer">
                  <UploadCloud size={36} className="mx-auto text-slate-400" />
                  <p className="text-xs font-bold text-slate-700">
                    Drag and drop your result slip here, or <span className="text-[#006B35] underline">click to browse</span>
                  </p>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    PDF, JPG or PNG (Max 5MB)
                  </span>
                  {uploadedFile && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-mono font-bold mt-2">
                      <CheckCircle2 size={13} />
                      <span>{uploadedFile} (Attached)</span>
                    </div>
                  )}
                </div>

                {/* Accepted Results Checklist */}
                <div className="md:col-span-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="font-black text-slate-800 block text-[11px] uppercase tracking-wide">
                    Accepted results
                  </span>
                  <ul className="space-y-1.5 text-slate-600 text-[11px]">
                    <li className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Check size={14} className="text-emerald-600 stroke-[3]" />
                      WAEC (SSCE)
                    </li>
                    <li className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Check size={14} className="text-emerald-600 stroke-[3]" />
                      NECO (SSCE)
                    </li>
                    <li className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Check size={14} className="text-emerald-600 stroke-[3]" />
                      At least 5 credits
                    </li>
                    <li className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Check size={14} className="text-emerald-600 stroke-[3]" />
                      Must include English Language and Mathematics
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Card 3: JAMB Details (Exact Match to Image 3) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006B35] flex items-center justify-center">
                  <Bookmark size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    JAMB Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provide your JAMB information (if you sat for UTME).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    JAMB Registration Number
                  </label>
                  <input
                    type="text"
                    value={jambRegNo}
                    onChange={e => setJambRegNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#006B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    JAMB Score
                  </label>
                  <input
                    type="text"
                    value={jambScore}
                    onChange={e => setJambScore(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#006B35]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: APPLICATION STATUS & SUMMARY (EXACT MATCH TO IMAGE 3) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Card 1: Application Status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-slate-700" />
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Application status
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  Draft
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Your application has been saved as a draft. Complete all sections and submit when you are ready.
              </p>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-2">
                <AlertCircle size={15} className="text-[#006B35] shrink-0 mt-0.5" />
                <span>You can save your progress and continue later at any time before the application deadline.</span>
              </div>
            </div>

            {/* Card 2: Application Summary */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText size={18} className="text-slate-700" />
                <h4 className="font-extrabold text-sm text-slate-900">
                  Application summary
                </h4>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Programme:</span>
                  <span className="font-bold text-slate-900 text-right">{selectedCourse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Entry session:</span>
                  <span className="font-mono font-bold text-slate-900">2026/2027</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Study mode:</span>
                  <span className="font-bold text-slate-900">Full Time</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Application date:</span>
                  <span className="font-mono text-slate-700">12 Mar 2026</span>
                </div>
              </div>

              {/* Important Alert Box */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle size={14} className="text-amber-700" />
                  <span>Important</span>
                </div>
                <p className="text-slate-600 leading-tight">
                  Ensure all information and documents are correct before submitting. Incomplete applications may not be considered.
                </p>
              </div>

            </div>

            {/* Action Buttons Matching Image 3 */}
            <div className="space-y-2.5 pt-1">
              {saveDraftNotice && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center">
                  Application draft saved successfully!
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveDraft}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 font-extrabold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                <FileText size={15} />
                <span>Save draft</span>
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#E5A823] hover:bg-[#c99015] text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Print Slip Shortcut */}
            <div className="pt-2 text-center">
              <button
                onClick={() => setSlipModalOpen(true)}
                className="text-xs font-bold text-[#006B35] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={13} />
                <span>Preview Official Registration Slip (PDF Form)</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Official Registration Slip Modal Matching Page 6 of Manual */}
      {slipModalOpen && (
        <RegistrationSlipModal
          isOpen={true}
          onClose={() => setSlipModalOpen(false)}
          application={appRecord}
        />
      )}

      {/* Official Admission Letter Modal */}
      {letterModalOpen && (
        <AdmissionLetterModal
          isOpen={true}
          onClose={() => setLetterModalOpen(false)}
          applicant={appRecord}
        />
      )}

    </PortalLayout>
  );
};
