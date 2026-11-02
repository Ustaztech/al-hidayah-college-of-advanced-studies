import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { db, PaymentReceipt } from '../../services/db';
import { logAuditEvent } from '../../services/audit';
import { IJMB_SUBJECT_COMBINATIONS, INSTITUTION_INFO } from '../../data/ijmbData';
import { ApplicationRecord } from '../../types';
import { AdmissionLetterModal } from '../../components/common/AdmissionLetterModal';
import { RegistrationSlipModal } from '../../components/common/RegistrationSlipModal';
import { PaymentCheckoutModal } from '../../components/common/PaymentCheckoutModal';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import {
  Check,
  UploadCloud,
  FileText,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Printer,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  Clock,
  GraduationCap,
  Award,
  RefreshCw,
  FileCheck,
  Eye,
  Edit3
} from 'lucide-react';

export const ApplicantPortal: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, applicantData, refreshUserData } = useAuth();
  const { addNotification } = useNotifications();

  // Find existing application record for current logged-in user
  const existingApp =
    applicantData ||
    (currentUser
      ? db.getApplications().find(
          a =>
            a.email.toLowerCase() === currentUser.email.toLowerCase() ||
            (currentUser.refNumber && a.ref_number === currentUser.refNumber)
        )
      : null);

  // Mode: If application is already submitted or admitted, default to 'flow' view
  const [viewMode, setViewMode] = useState<'flow' | 'form'>(
    existingApp && existingApp.status !== 'Draft' ? 'flow' : 'form'
  );

  // Stepper state for 4-stage process flow
  const [activeStep, setActiveStep] = useState<number>(1);
  const [saveDraftNotice, setSaveDraftNotice] = useState(false);
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<PaymentReceipt | null>(null);
  const [feeTypeToPay, setFeeTypeToPay] = useState<'Screening' | 'Acceptance'>('Screening');

  // Candidate Data Form State
  const [fullName, setFullName] = useState(existingApp?.full_name || currentUser?.name || '');
  const [email, setEmail] = useState(existingApp?.email || currentUser?.email || '');
  const [phone, setPhone] = useState(existingApp?.phone || currentUser?.phone || '');
  const [gender, setGender] = useState<'Male' | 'Female'>((existingApp?.gender as any) || 'Male');
  const [dob, setDob] = useState(existingApp?.date_of_birth || '');
  const [stateOfOrigin, setStateOfOrigin] = useState(existingApp?.state_of_origin || 'FCT Abuja');
  const [lga, setLga] = useState(existingApp?.lga || 'Abaji');
  const [ninNumber, setNinNumber] = useState(existingApp?.nin_number || '');
  const [guardianName, setGuardianName] = useState(existingApp?.guardian_name || '');
  const [guardianPhone, setGuardianPhone] = useState(existingApp?.guardian_phone || '');
  const [guardianAddress, setGuardianAddress] = useState(existingApp?.guardian_address || '');

  // Programme Selection State
  const [programmeCategory, setProgrammeCategory] = useState<'IJMB' | 'ND' | 'HND'>(
    (existingApp?.category as any) || 'IJMB'
  );
  const [selectedCourse, setSelectedCourse] = useState(
    existingApp?.programme_title || 'IJMB Direct Entry Programme (A-Level)'
  );
  const [subjectComboCode, setSubjectComboCode] = useState(
    existingApp?.subject_combination_code || '030'
  );
  const [subjectComboName, setSubjectComboName] = useState(
    existingApp?.subject_combination_name || 'Biology, Chemistry, Physics'
  );
  const [targetDegree, setTargetDegree] = useState(
    existingApp?.target_university_course || 'Medicine & Surgery (MBBS)'
  );

  // O'Level & Credentials State
  const [examBody, setExamBody] = useState('WAEC (SSCE)');
  const [examYear, setExamYear] = useState('2025');
  const [examRegNo, setExamRegNo] = useState(existingApp?.olevel_sitting_1 ? '' : '');
  const [olevelDetails, setOlevelDetails] = useState(
    existingApp?.olevel_sitting_1 || ''
  );
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [jambRegNo, setJambRegNo] = useState(existingApp?.jamb_reg_no || '');
  const [jambScore, setJambScore] = useState(
    existingApp?.jamb_score ? String(existingApp.jamb_score) : ''
  );
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Current Application Record
  const [appRecord, setAppRecord] = useState<ApplicationRecord>(() => {
    if (existingApp) return existingApp;
    const ref = currentUser?.refNumber || `AHCAS/IJMB/2026/${Math.floor(10000 + Math.random() * 90000)}`;
    return {
      id: `app-${Date.now()}`,
      ref_number: ref,
      full_name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      gender: 'Male',
      date_of_birth: '',
      state_of_origin: 'FCT Abuja',
      lga: 'Abaji',
      programme_id: 'ijmb-programme',
      programme_title: 'IJMB Direct Entry Programme (A-Level)',
      category: 'IJMB',
      subject_combination_code: '030',
      subject_combination_name: 'Biology, Chemistry, Physics',
      target_university_course: 'Medicine & Surgery (MBBS)',
      nin_number: '',
      guardian_name: '',
      guardian_phone: '',
      guardian_address: '',
      olevel_sitting_1: '',
      status: 'Draft',
      submitted_at: new Date().toISOString().substring(0, 10),
      scratch_card_serial: '',
      admission_letter_released: false,
      study_centre: INSTITUTION_INFO.studyCentre,
      form_fee_paid: false
    };
  });

  // Handle Draft Save
  const handleSaveDraft = () => {
    const updated: ApplicationRecord = {
      ...appRecord,
      full_name: fullName.trim() || appRecord.full_name,
      email: email.trim() || appRecord.email,
      phone: phone.trim() || appRecord.phone,
      gender,
      date_of_birth: dob,
      state_of_origin: stateOfOrigin,
      lga,
      nin_number: ninNumber,
      guardian_name: guardianName,
      guardian_phone: guardianPhone,
      guardian_address: guardianAddress,
      category: programmeCategory,
      programme_title: selectedCourse,
      subject_combination_code: subjectComboCode,
      subject_combination_name: subjectComboName,
      target_university_course: targetDegree,
      olevel_sitting_1: olevelDetails,
      jamb_reg_no: jambRegNo,
      jamb_score: jambScore ? Number(jambScore) : undefined,
      status: 'Draft'
    };

    const saved = db.submitApplication(updated);
    setAppRecord(saved);
    refreshUserData();
    setSaveDraftNotice(true);
    setTimeout(() => setSaveDraftNotice(false), 3000);
  };

  // Handle Final Submission of Application Process Flow
  const handleSubmitFinal = () => {
    if (!declarationAccepted) {
      alert('Please check the statutory declaration box to verify your credentials.');
      return;
    }

    const updated: ApplicationRecord = {
      ...appRecord,
      full_name: fullName.trim() || appRecord.full_name,
      email: email.trim() || appRecord.email,
      phone: phone.trim() || appRecord.phone,
      gender,
      date_of_birth: dob,
      state_of_origin: stateOfOrigin,
      lga,
      nin_number: ninNumber,
      guardian_name: guardianName,
      guardian_phone: guardianPhone,
      guardian_address: guardianAddress,
      category: programmeCategory,
      programme_title: selectedCourse,
      subject_combination_code: subjectComboCode,
      subject_combination_name: subjectComboName,
      target_university_course: targetDegree,
      olevel_sitting_1: olevelDetails,
      jamb_reg_no: jambRegNo,
      jamb_score: jambScore ? Number(jambScore) : undefined,
      status: 'Submitted',
      submitted_at: new Date().toISOString().substring(0, 10)
    };

    const saved = db.submitApplication(updated);
    setAppRecord(saved);
    refreshUserData();

    // Log Immutable Audit Event
    logAuditEvent(
      saved.full_name,
      'APPLICANT',
      'APPLICATION_SUBMITTED',
      `Application ref ${saved.ref_number} submitted for ${saved.programme_title}`
    );

    // Notify Registrar & Admissions Desk
    addNotification({
      target_role: 'REGISTRAR',
      title: 'New Admission Application Submitted',
      message: `${saved.full_name} submitted application (${saved.ref_number}) for ${saved.programme_title}.`,
      category: 'Admissions',
      priority: 'high',
      action_url: '/admin/dashboard?tab=applications'
    });

    setViewMode('flow');
    setSlipModalOpen(true);
  };

  const isAdmitted = appRecord.status === 'Admitted' || appRecord.admission_letter_released;

  return (
    <PortalLayout activeNav="Admissions" portalTitle="Admissions Application Portal">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ========================================================================= */}
        {/* INSTITUTIONAL PROCESS FLOW HEADER BAR */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-[#196855] via-[#196855] to-[#196855] text-white p-6 sm:p-7 rounded-3xl border border-[#e69912]/40 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#e69912] text-slate-950 font-mono">
                  Official Portal • AHCAS/IJMB/2026
                </span>
                <span className="text-emerald-300 text-xs font-semibold">
                  Study Centre: {INSTITUTION_INFO.studyCentre}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Application Process Flow
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                Candidate: <strong className="text-white">{appRecord.full_name}</strong> • Ref:{' '}
                <span className="font-mono text-[#e69912] font-bold">{appRecord.ref_number}</span>
              </p>
            </div>

            {/* Current Process Status Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex items-center gap-3 shrink-0">
              <div
                className={`w-3.5 h-3.5 rounded-full animate-pulse ${
                  isAdmitted
                    ? 'bg-emerald-400'
                    : appRecord.status === 'Submitted'
                    ? 'bg-emerald-400'
                    : 'bg-amber-400'
                }`}
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">
                  Current Status
                </span>
                <span className="text-sm font-black text-white">
                  {isAdmitted
                    ? 'Provisional Admission Offered'
                    : appRecord.status === 'Submitted'
                    ? 'Submitted • Under Screening'
                    : 'Draft / In Progress'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: LIVE APPLICATION PROCESS FLOW (SUBMITTED / ADMITTED) */}
        {/* ========================================================================= */}
        {viewMode === 'flow' ? (
          <div className="space-y-6">

            {/* Admission Announcement Banner (If Admitted) */}
            {isAdmitted && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 border-2 border-[#196855] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#196855] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <GraduationCap size={28} className="text-[#e69912]" />
                  </div>
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#196855] text-white">
                      Admission Granted
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      Congratulations! You Have Been Offered Provisional Admission
                    </h3>
                    <p className="text-xs text-slate-600">
                      Programme: <strong>{appRecord.programme_title}</strong> (Session: 2026/2027)
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setLetterModalOpen(true)}
                    className="px-4 py-2.5 bg-[#196855] hover:bg-[#196855] text-white font-extrabold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Award size={15} className="text-[#e69912]" />
                    <span>Print Admission Letter</span>
                  </button>
                  <Link
                    to="/student"
                    className="px-4 py-2.5 bg-[#e69912] hover:bg-[#b88d1d] text-slate-950 font-black text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Proceed to Student Portal</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )}

            {/* Visual 4-Stage Milestone Process Flow */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Application Milestone Flow
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real-time verification stages for Reference ID: {appRecord.ref_number}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSlipModalOpen(true)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Printer size={13} className="text-[#196855]" />
                    <span>Print Registration Slip</span>
                  </button>
                </div>
              </div>

              {/* Process Stages Vertical/Horizontal Stepper Flow */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-[#196855] space-y-8 my-2">

                {/* Milestone 1: Form Submission */}
                <div className="relative">
                  <div className="absolute -left-[35px] sm:-left-[43px] top-0.5 w-8 h-8 rounded-full bg-[#196855] text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 size={18} className="stroke-[2.5]" />
                  </div>
                  <div className="bg-slate-50/80 hover:bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1.5 transition-colors">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <span className="font-black text-sm text-slate-900">
                        Stage 1: Application Form Completed & Submitted
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-[#196855] font-extrabold text-[10px] rounded-full">
                        Completed
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Application form for <strong>{appRecord.programme_title}</strong> successfully submitted on{' '}
                      <span className="font-mono font-bold text-slate-900">{appRecord.submitted_at}</span>. Reference ID:{' '}
                      <span className="font-mono font-bold text-[#196855]">{appRecord.ref_number}</span>.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-500">Screening Fee (₦10,000):</span>
                        {appRecord.form_fee_paid ? (
                          <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">Cleared / Paid</span>
                        ) : (
                          <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px]">Unsettled</span>
                        )}
                      </div>
                      {!appRecord.form_fee_paid && (
                        <button
                          type="button"
                          onClick={() => {
                            setFeeTypeToPay('Screening');
                            setCheckoutOpen(true);
                          }}
                          className="px-3 py-1 bg-[#196855] hover:bg-[#124d3f] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Pay Screening Fee
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Milestone 2: Document & O'Level Verification */}
                <div className="relative">
                  <div
                    className={`absolute -left-[35px] sm:-left-[43px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center shadow-xs ${
                      isAdmitted ? 'bg-[#196855] text-white' : 'bg-[#e69912] text-slate-950 font-bold'
                    }`}
                  >
                    {isAdmitted ? <CheckCircle2 size={18} className="stroke-[2.5]" /> : <ShieldCheck size={18} />}
                  </div>
                  <div className="bg-slate-50/80 hover:bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1.5 transition-colors">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <span className="font-black text-sm text-slate-900">
                        Stage 2: Credentials & O'Level Verification
                      </span>
                      <span
                        className={`px-2.5 py-0.5 font-extrabold text-[10px] rounded-full ${
                          isAdmitted
                            ? 'bg-emerald-100 text-[#196855]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isAdmitted ? 'Verified & Cleared' : 'In Progress • Screening'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      O'Level 5 Credits requirement and statutory JAMB/WAEC verification by the Academic Screening Committee.
                    </p>
                    <div className="pt-1 text-[11px] font-mono text-slate-500">
                      Uploaded Slip: {uploadedFile || 'olevel_certificate.pdf'} (Verified WAEC/NECO Standard)
                    </div>
                  </div>
                </div>

                {/* Milestone 3: Board Screening & Admission Decision */}
                <div className="relative">
                  <div
                    className={`absolute -left-[35px] sm:-left-[43px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center shadow-xs ${
                      isAdmitted ? 'bg-[#196855] text-white' : 'bg-slate-200 text-slate-600 font-bold'
                    }`}
                  >
                    {isAdmitted ? <GraduationCap size={18} className="text-[#e69912]" /> : <Clock size={16} />}
                  </div>
                  <div className="bg-slate-50/80 hover:bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1.5 transition-colors">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <span className="font-black text-sm text-slate-900">
                        Stage 3: Admission Board Review & Decision
                      </span>
                      <span
                        className={`px-2.5 py-0.5 font-extrabold text-[10px] rounded-full ${
                          isAdmitted
                            ? 'bg-emerald-100 text-[#196855]'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isAdmitted ? 'Provisional Admission Granted' : 'Pending Board Session'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      IJMB Directorate & Academic Board ratification of candidate subject combination and departmental quota.
                    </p>
                    {isAdmitted && (
                      <div className="pt-1">
                        <button
                          onClick={() => setLetterModalOpen(true)}
                          className="text-xs font-bold text-[#196855] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Award size={13} />
                          <span>View Official Provisional Admission Letter (PDF)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Milestone 4: Acceptance & Student Matriculation */}
                <div className="relative">
                  <div
                    className={`absolute -left-[35px] sm:-left-[43px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center shadow-xs ${
                      isAdmitted ? 'bg-[#e69912] text-slate-950 font-bold' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <UserCheck size={18} />
                  </div>
                  <div className="bg-slate-50/80 hover:bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1.5 transition-colors">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <span className="font-black text-sm text-slate-900">
                        Stage 4: Acceptance Fee Clearance & Student Matriculation
                      </span>
                      <span
                        className={`px-2.5 py-0.5 font-extrabold text-[10px] rounded-full ${
                          isAdmitted
                            ? 'bg-[#196855] text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isAdmitted ? 'Unlocked • Action Required' : 'Locked'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Pay statutory acceptance fee and complete student onboarding to obtain your permanent Matriculation Number.
                    </p>
                    {isAdmitted && (
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFeeTypeToPay('Acceptance');
                            setCheckoutOpen(true);
                          }}
                          className="px-4 py-2 bg-[#e69912] hover:bg-[#d48806] text-slate-950 font-black rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>Pay Acceptance Fee (₦25,000)</span>
                          <ArrowRight size={14} />
                        </button>
                        <Link
                          to="/student"
                          className="px-4 py-2 bg-[#196855] hover:bg-[#124d3f] text-white font-extrabold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Open Student Portal Desk</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSlipModalOpen(true)}
                    className="px-4 py-2.5 bg-[#196855] hover:bg-[#196855] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <Printer size={14} />
                    <span>Print Registration Slip</span>
                  </button>

                  <button
                    onClick={() => setShowSummaryModal(!showSummaryModal)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Eye size={14} />
                    <span>{showSummaryModal ? 'Hide Details' : 'View Submitted Details'}</span>
                  </button>
                </div>

                {!isAdmitted && (
                  <button
                    onClick={() => setViewMode('form')}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Edit Candidate Information</span>
                  </button>
                )}
              </div>

              {/* Collapsible Submitted Details Card */}
              {showSummaryModal && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fade-in text-xs">
                  <h4 className="font-extrabold text-sm text-slate-900 border-b pb-2">
                    Verified Application Submission Summary
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Candidate Name</span>
                      <strong className="text-slate-900">{appRecord.full_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Application Ref</span>
                      <strong className="text-[#196855] font-mono">{appRecord.ref_number}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Category / Programme</span>
                      <strong className="text-slate-900">{appRecord.programme_title}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Subject Combination</span>
                      <strong className="text-slate-900">{appRecord.subject_combination_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Target Course</span>
                      <strong className="text-slate-900">{appRecord.target_university_course}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">State of Origin</span>
                      <strong className="text-slate-900">{appRecord.state_of_origin} ({appRecord.lga})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">O'Level Summary</span>
                      <span className="text-slate-700">{appRecord.olevel_sitting_1}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Study Centre</span>
                      <span className="text-slate-700">{appRecord.study_centre}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Submission Date</span>
                      <span className="font-mono text-slate-700">{appRecord.submitted_at}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW MODE 2: INTERACTIVE 4-STAGE APPLICATION PROCESS STEPPER */
          /* ========================================================================= */
          <div className="space-y-6">

            {/* Stepper Progress Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#196855] tracking-wider font-mono">
                    STAGE {activeStep} OF 4
                  </span>
                  <h2 className="text-lg font-black text-slate-900">
                    {activeStep === 1 && 'Stage 1: Candidate Bio-Data & Contact'}
                    {activeStep === 2 && 'Stage 2: Academic Programme & Combination'}
                    {activeStep === 3 && 'Stage 3: O\'Level Credentials & Upload'}
                    {activeStep === 4 && 'Stage 4: Declaration & Final Submission'}
                  </h2>
                </div>

                {existingApp && existingApp.status === 'Submitted' && (
                  <button
                    onClick={() => setViewMode('flow')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    ← Return to Status Flow
                  </button>
                )}
              </div>

              {/* 4 Step Visual Icons */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { step: 1, title: 'Bio-Data' },
                  { step: 2, title: 'Programme' },
                  { step: 3, title: 'Credentials' },
                  { step: 4, title: 'Review' }
                ].map(s => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setActiveStep(s.step)}
                    className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                      activeStep === s.step
                        ? 'border-[#196855] bg-emerald-50/60 font-black text-[#196855]'
                        : activeStep > s.step
                        ? 'border-emerald-200 bg-white font-bold text-slate-700'
                        : 'border-slate-200 bg-slate-50 font-medium text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span
                        className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          activeStep > s.step
                            ? 'bg-[#196855] text-white'
                            : activeStep === s.step
                            ? 'bg-[#196855] text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {activeStep > s.step ? <Check size={12} /> : s.step}
                      </span>
                      <span className="hidden sm:inline">{s.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stepper Content Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">

              {/* ------------------------------------------------------------- */}
              {/* STAGE 1: CANDIDATE BIO-DATA */}
              {/* ------------------------------------------------------------- */}
              {activeStep === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b pb-3">
                    <h3 className="font-extrabold text-base text-slate-900">Personal & Contact Details</h3>
                    <p className="text-xs text-slate-500">Provide legal identification details matching your credentials.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Legal Name (Surname First) <span className="text-emerald-700">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. Ibrahim, Maryam Sani"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address <span className="text-emerald-700">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number <span className="text-emerald-700">*</span>
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="080XXXXXXXX"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Gender <span className="text-emerald-700">*</span>
                      </label>
                      <select
                        value={gender}
                        onChange={e => setGender(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        National Identification Number (NIN)
                      </label>
                      <input
                        type="text"
                        value={ninNumber}
                        onChange={e => setNinNumber(e.target.value)}
                        placeholder="11-digit NIN"
                        maxLength={11}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">State of Origin</label>
                      <input
                        type="text"
                        value={stateOfOrigin}
                        onChange={e => setStateOfOrigin(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Local Government Area (LGA)</label>
                      <input
                        type="text"
                        value={lga}
                        onChange={e => setLga(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Full Name</label>
                      <input
                        type="text"
                        value={guardianName}
                        onChange={e => setGuardianName(e.target.value)}
                        placeholder="Next of kin"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Phone</label>
                      <input
                        type="text"
                        value={guardianPhone}
                        onChange={e => setGuardianPhone(e.target.value)}
                        placeholder="Guardian contact"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STAGE 2: PROGRAMME SELECTION */}
              {/* ------------------------------------------------------------- */}
              {activeStep === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b pb-3">
                    <h3 className="font-extrabold text-base text-slate-900">Academic Programme Selection</h3>
                    <p className="text-xs text-slate-500">Choose your tertiary pathway and subject combination.</p>
                  </div>

                  {/* Programme Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setProgrammeCategory('IJMB');
                        setSelectedCourse('IJMB Direct Entry Programme (A-Level)');
                      }}
                      className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                        programmeCategory === 'IJMB'
                          ? 'border-[#196855] bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="font-black text-sm text-slate-900 block">IJMB Direct Entry</span>
                      <span className="text-xs text-slate-600 block mt-1">Interim Joint Matriculation Board</span>
                      <span className="text-[10px] text-emerald-800 font-bold block mt-2">1 Year • Direct 200L</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProgrammeCategory('ND');
                        setSelectedCourse('Computer Science (ND)');
                      }}
                      className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                        programmeCategory === 'ND'
                          ? 'border-[#196855] bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="font-black text-sm text-slate-900 block">National Diploma (ND)</span>
                      <span className="text-xs text-slate-600 block mt-1">Polytechnic / Monotechnic</span>
                      <span className="text-[10px] text-emerald-800 font-bold block mt-2">2 Years Duration</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProgrammeCategory('HND');
                        setSelectedCourse('Computer Science (HND)');
                      }}
                      className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                        programmeCategory === 'HND'
                          ? 'border-[#196855] bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="font-black text-sm text-slate-900 block">Higher National Diploma (HND)</span>
                      <span className="text-xs text-slate-600 block mt-1">Post-ND Specialization</span>
                      <span className="text-[10px] text-emerald-800 font-bold block mt-2">2 Years Duration</span>
                    </button>
                  </div>

                  {/* Subject Combination / Department */}
                  {programmeCategory === 'IJMB' ? (
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Approved IJMB A-Level Subject Combination <span className="text-emerald-700">*</span>
                        </label>
                        <select
                          value={subjectComboCode}
                          onChange={e => {
                            const found = IJMB_SUBJECT_COMBINATIONS.find(c => c.code === e.target.value);
                            setSubjectComboCode(e.target.value);
                            if (found) setSubjectComboName(found.subjects);
                          }}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                        >
                          {IJMB_SUBJECT_COMBINATIONS.slice(0, 20).map(c => (
                            <option key={c.code} value={c.code}>
                              Combination {c.code}: {c.subjects}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Target University Course (200 Level Direct Entry)
                        </label>
                        <input
                          type="text"
                          value={targetDegree}
                          onChange={e => setTargetDegree(e.target.value)}
                          placeholder="e.g. Medicine & Surgery MBBS, Computer Science, Law"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Chosen Department / Programme <span className="text-emerald-700">*</span>
                      </label>
                      <select
                        value={selectedCourse}
                        onChange={e => setSelectedCourse(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Science Laboratory Technology">Science Laboratory Technology</option>
                        <option value="Business Administration & Management">Business Administration & Management</option>
                        <option value="Mass Communication">Mass Communication</option>
                        <option value="Accountancy">Accountancy</option>
                      </select>
                    </div>
                  )}

                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900">
                    <strong>Study Centre:</strong> {INSTITUTION_INFO.studyCentre} (Approved Official IJMB Examination Centre)
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STAGE 3: O'LEVEL CREDENTIALS & UPLOAD */}
              {/* ------------------------------------------------------------- */}
              {activeStep === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b pb-3">
                    <h3 className="font-extrabold text-base text-slate-900">O'Level Qualifications & Result Slip</h3>
                    <p className="text-xs text-slate-500">Candidate must hold at least 5 credit passes including English Language and Mathematics.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Examination Body</label>
                      <select
                        value={examBody}
                        onChange={e => setExamBody(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      >
                        <option value="WAEC (SSCE)">WAEC (SSCE)</option>
                        <option value="NECO (SSCE)">NECO (SSCE)</option>
                        <option value="NABTEB">NABTEB</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Exam Year</label>
                      <input
                        type="text"
                        value={examYear}
                        onChange={e => setExamYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Exam Registration Number</label>
                      <input
                        type="text"
                        value={examRegNo}
                        onChange={e => setExamRegNo(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Five (5) Credit Subjects & Grades Summary
                    </label>
                    <input
                      type="text"
                      value={olevelDetails}
                      onChange={e => setOlevelDetails(e.target.value)}
                      placeholder="e.g. English (B3), Maths (A1), Biology (B2), Chemistry (B3), Physics (B2)"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                    />
                  </div>

                  {/* Drag and Drop Result Upload Simulator */}
                  <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center space-y-2 hover:bg-slate-100/60 transition-colors cursor-pointer">
                    <UploadCloud size={32} className="mx-auto text-[#196855]" />
                    <p className="text-xs font-bold text-slate-700">
                      Upload your WAEC / NECO result slip (PDF, JPG or PNG)
                    </p>
                    <span className="text-[10px] text-slate-400 block font-mono">Max size 5MB • Scanned copy</span>
                    <button
                      type="button"
                      onClick={() => setUploadedFile('candidate_olevel_verified.pdf')}
                      className="px-3.5 py-1.5 bg-[#196855] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#196855]"
                    >
                      {uploadedFile ? 'Replace Uploaded File' : 'Choose Result File'}
                    </button>
                    {uploadedFile && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-[#196855] rounded-lg text-xs font-mono font-bold">
                        <CheckCircle2 size={13} />
                        <span>{uploadedFile} (Attached)</span>
                      </div>
                    )}
                  </div>

                  {/* JAMB UTME Optional Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        JAMB Reg Number (Optional for IJMB)
                      </label>
                      <input
                        type="text"
                        value={jambRegNo}
                        onChange={e => setJambRegNo(e.target.value)}
                        placeholder="e.g. 202610984820FA"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        JAMB UTME Score (If available)
                      </label>
                      <input
                        type="text"
                        value={jambScore}
                        onChange={e => setJambScore(e.target.value)}
                        placeholder="e.g. 240"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#196855]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STAGE 4: REVIEW, DECLARATION & SUBMISSION */}
              {/* ------------------------------------------------------------- */}
              {activeStep === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b pb-3">
                    <h3 className="font-extrabold text-base text-slate-900">Review & Statutory Declaration</h3>
                    <p className="text-xs text-slate-500">Confirm all details before final submission into the institutional repository.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Candidate Name:</span>
                        <strong className="text-slate-900">{fullName || 'Candidate Name'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Email & Phone:</span>
                        <span className="text-slate-800">{email} • {phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Programme Category:</span>
                        <strong className="text-slate-900">{programmeCategory} ({selectedCourse})</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Subject Combination:</span>
                        <strong className="text-[#196855]">{subjectComboName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Target Course:</span>
                        <span className="text-slate-800">{targetDegree}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">O'Level Summary:</span>
                        <span className="text-slate-800">{olevelDetails}</span>
                      </div>
                    </div>
                  </div>

                  {/* Statutory Declaration */}
                  <label className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={declarationAccepted}
                      onChange={e => setDeclarationAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-[#196855] focus:ring-[#196855]"
                    />
                    <span className="text-slate-700 leading-relaxed">
                      <strong>Statutory Applicant Declaration:</strong> I hereby declare that the information and academic credentials provided in this application are authentic, complete, and correct. I understand that any false statement or forged result may lead to disqualification or forfeiture of admission at Al-Hidayah College of Advanced Studies.
                    </span>
                  </label>
                </div>
              )}

              {/* Stepper Navigation Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {activeStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setActiveStep(activeStep - 1)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ArrowLeft size={14} />
                      <span>Previous Stage</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FileText size={14} />
                    <span>Save Draft</span>
                  </button>
                  {saveDraftNotice && (
                    <span className="text-xs font-bold text-[#196855]">Draft saved!</span>
                  )}
                </div>

                <div>
                  {activeStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => setActiveStep(activeStep + 1)}
                      className="px-6 py-2.5 bg-[#196855] hover:bg-[#196855] text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                    >
                      <span>Continue to Stage {activeStep + 1}</span>
                      <ChevronRight size={15} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitFinal}
                      className="px-7 py-2.5 bg-[#e69912] hover:bg-[#b88d1d] text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                    >
                      <span>Submit Final Application</span>
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Official Registration Slip Modal */}
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

      {/* Secured Payment Gateway Checkout Modal */}
      <PaymentCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        amountNgn={feeTypeToPay === 'Screening' ? 10000 : 25000}
        feeDescription={feeTypeToPay === 'Screening' ? 'IJMB Application & Screening Form' : 'Statutory Acceptance Fee'}
        payerName={appRecord.full_name}
        payerEmail={appRecord.email}
        applicantRef={appRecord.ref_number}
        onPaymentSuccess={(rcp) => {
          if (feeTypeToPay === 'Screening') {
            const updated = { ...appRecord, form_fee_paid: true };
            setAppRecord(updated);
            db.updateApplication(updated);
          }
          setActiveReceipt(rcp);
          setReceiptOpen(true);
          setCheckoutOpen(false);
        }}
      />

      {/* Official Bursary Electronic Receipt Modal */}
      {activeReceipt && (
        <ReceiptModal
          isOpen={receiptOpen}
          onClose={() => {
            setReceiptOpen(false);
            setActiveReceipt(null);
          }}
          receipt={activeReceipt}
        />
      )}
    </PortalLayout>
  );
};
