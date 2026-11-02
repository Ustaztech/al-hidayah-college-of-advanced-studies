import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSessionUser } from '@/lib/auth/session';
import { ApplicantPortalLayout } from '@/components/layout/ApplicantPortalLayout';
import { portalDb } from '@/lib/store/mockDb';
import { calculateCompletion } from '@/lib/application-utils';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  GraduationCap,
  Files,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Info,
  FileCheck,
  Send,
  BookOpen,
  Award,
  AlertTriangle,
  XCircle
} from 'lucide-react';

export default async function ApplicantDashboardPage() {
  const session = await getServerSessionUser();

  if (!session) {
    redirect('/application/login');
  }

  // Ensure applicant or admin
  const isApplicant = session.roles.includes('applicant') || session.roles.includes('super_admin') || session.roles.includes('college_admin');
  if (!isApplicant) {
    redirect('/portal/unauthorised');
  }

  let applicant = session.applicant;
  if (!applicant && (session.roles.includes('super_admin') || session.roles.includes('college_admin'))) {
    applicant = portalDb.getApplicantByUserId('usr-applicant-uuid') || undefined;
  }

  const applicantName = applicant?.full_name || session.profile.full_name || 'Prospective Applicant';
  const applicantNumber = applicant?.applicant_number || 'AHCAS/APP/2026/00001';
  const applicationType = applicant?.application_type?.name || 'IJMB Regular Admission';

  // Retrieve current application state from portalDb
  const application = applicant ? portalDb.getOrCreateApplicationForApplicant(applicant.id) : null;
  const isSubmitted = application?.status === 'submitted' || application?.status === 'under_review' || application?.status === 'action_required' || application?.status === 'accepted' || application?.status === 'rejected' || application?.status === 'matriculated';
  const isMatriculated = application?.status === 'matriculated' || Boolean(application?.matriculation_record);
  const hasOffer = (application?.status === 'accepted' || application?.status === 'matriculated') && application.admission_offer;
  const isActionRequired = application?.status === 'action_required';
  const isUnderReview = application?.status === 'under_review';
  const isRejected = application?.status === 'rejected';
  const paidInvoice = application?.invoices?.find(i => i.status === 'paid' && i.payment);
  const isAcceptedUnpaid = application?.status === 'accepted' && !paidInvoice && !isMatriculated;

  const { percentage, steps } = application ? calculateCompletion(application) : { percentage: 0, steps: {} as any };

  return (
    <ApplicantPortalLayout user={session} title="Applicant Dashboard">
      <div className="space-y-6">

        {/* STEP 6: MATRICULATION & STUDENT ENROLLMENT BANNER */}
        {isMatriculated && (
          <div className="bg-gradient-to-r from-emerald-900 via-[#196855] to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-emerald-400/50 relative overflow-hidden animate-in fade-in">
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                  <GraduationCap size={15} />
                  <span>Officially Matriculated & Enrolled</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-serif text-white">
                  Welcome to Al-Hidayah College, {applicantName}!
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
                  Your Acceptance Fee has been verified, your Registry Clearance is certified, and you have been matriculated into the College academic roll.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <div className="bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-emerald-300 font-medium">Matriculation No: </span>
                    <strong className="font-mono text-white text-sm tracking-wider">
                      {application?.matriculation_record?.matric_number || 'AHCAS/2026/002'}
                    </strong>
                  </div>
                  <span className="text-emerald-200">Level: {application?.matriculation_record?.level || 'IJMB 1'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/application/clearance"
                  className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-md"
                >
                  <FileText size={16} />
                  <span>Clearance Slip</span>
                </Link>
                <Link
                  href="/application/receipt"
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-2"
                >
                  <FileCheck size={16} />
                  <span>Bursary Receipt</span>
                </Link>
                <Link
                  href="/student/dashboard"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition flex items-center gap-2 border border-emerald-400/50"
                >
                  <GraduationCap size={16} />
                  <span>Student Academic Portal</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: ACCEPTANCE FEE PROMPT (WHEN ADMISSION ACCEPTED BUT UNPAID) */}
        {isAcceptedUnpaid && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-6 rounded-2xl shadow-lg border border-amber-400 relative overflow-hidden animate-in fade-in flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 text-slate-950">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950 text-white inline-block mb-1">
                Mandatory Step 5
              </span>
              <h3 className="text-lg font-black font-serif">
                Pay Acceptance Fee to Complete Matriculation
              </h3>
              <p className="text-xs text-slate-900 max-w-xl font-medium">
                You have accepted your provisional admission offer. Proceed to generate your Remita RRR and pay the institutional acceptance fee (₦25,000) to receive your Matriculation Number.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/application/payments"
                className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs shadow-xl transition flex items-center gap-2"
              >
                <span>Pay Acceptance Fee (₦25,000)</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* STEP 4: PROVISIONAL ADMISSION OFFER CELEBRATION BANNER */}
        {hasOffer && !isMatriculated && !isAcceptedUnpaid && (
          <div className="bg-gradient-to-r from-emerald-900 via-[#196855] to-slate-900 text-white p-6 rounded-2xl shadow-xl border-2 border-[#e69912]/50 relative overflow-hidden animate-in fade-in">
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#e69912]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e69912] text-slate-950 text-xs font-black uppercase tracking-wider">
                  <Award size={14} />
                  <span>Provisional Admission Offered</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-serif text-white">
                  Congratulations, {applicantName}!
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
                  The Academic Board has approved your admission into <strong>{application.admission_offer?.programme?.name || 'Academic Programme'}</strong> for the {application.admission_offer?.admission_session?.name || '2026/2027 Academic Session'}.
                </p>
                <div className="flex items-center gap-4 text-xs text-amber-200/90 pt-1 font-mono">
                  <span>Offer Ref: {application.admission_offer?.offer_letter_number}</span>
                  <span>•</span>
                  <span>Acceptance Deadline: {new Date(application.admission_offer?.acceptance_deadline || '').toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/application/admission-letter"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#e69912] hover:bg-amber-500 text-slate-950 font-black text-xs shadow-lg transition"
                >
                  <Award size={16} />
                  <span>Official Admission Letter</span>
                </Link>
                <Link
                  href="/application/slip"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
                >
                  <FileCheck size={16} />
                  <span>Application Slip</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ACTION REQUIRED (DEFICIENCY NOTICE BANNER) */}
        {isActionRequired && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  Admissions Screening Query — Action Required
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  {application.screening?.action_required_note ||
                    'The Admissions Directorate has issued a query regarding your submitted application documents. Please resolve to proceed.'}
                </p>
              </div>
            </div>
            <Link
              href="/application/apply"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-xs shrink-0 self-end md:self-auto"
            >
              Resolve Query in Form &rarr;
            </Link>
          </div>
        )}

        {/* STEP 4: UNDER ACTIVE REVIEW BANNER */}
        {isUnderReview && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-xs text-blue-900">
                <strong>Application Under Active Directorate Screening:</strong> Your submitted credentials and academic O-Level scores are currently being verified by the Academic Registrar.
              </div>
            </div>
            <Link
              href="/application/slip"
              className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-50 transition shrink-0"
            >
              View Slip
            </Link>
          </div>
        )}

        {/* STEP 4: REJECTED BANNER */}
        {isRejected && (
          <div className="bg-slate-100 border border-slate-300 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <XCircle className="w-5 h-5 text-slate-500 shrink-0" />
            <div className="text-xs text-slate-700">
              <strong>Admissions Decision:</strong> We regret to inform you that your application was not successful for this admission cohort. Please contact the Admissions Office for academic guidance on future intake opportunities.
            </div>
          </div>
        )}

        {/* Welcome Institutional Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#196855] via-[#145344] to-slate-900 text-white p-6 sm:p-8 shadow-xl">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#e69912]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
                <Sparkles size={14} className="text-[#e69912]" />
                <span>2026/2027 Academic Session Application</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-serif tracking-tight text-white">
                Welcome, {applicantName}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl leading-relaxed">
                {isMatriculated
                  ? 'You are officially cleared and enrolled as a student of Al-Hidayah College of Advanced Studies. Your matriculation slip and bursary receipt are ready.'
                  : isAcceptedUnpaid
                  ? 'Your admission offer has been accepted! Please proceed to pay your Acceptance Fee to complete registration and receive your Matriculation Number.'
                  : hasOffer
                  ? 'Your provisional offer of admission is ready. You can inspect your official admission letter and accept or decline your admission offer.'
                  : isSubmitted
                  ? 'Your admission application has been formally submitted and locked. You can view or download your official acknowledgement slip below.'
                  : 'Complete your multi-step admission application form, upload credentials, and submit before the application deadline.'}
              </p>

              {/* Primary Call to Action */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {isMatriculated ? (
                  <>
                    <Link
                      href="/student/dashboard"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition"
                    >
                      <GraduationCap size={16} />
                      <span>Student Academic Portal</span>
                      <ArrowRight size={14} />
                    </Link>
                    <Link
                      href="/application/clearance"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
                    >
                      <FileCheck size={16} />
                      <span>Matriculation Slip</span>
                    </Link>
                  </>
                ) : isAcceptedUnpaid ? (
                  <Link
                    href="/application/payments"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e69912] hover:bg-amber-500 text-slate-950 font-black text-xs shadow-lg transition"
                  >
                    <Award size={16} />
                    <span>Pay Acceptance Fee (₦25,000)</span>
                  </Link>
                ) : hasOffer ? (
                  <Link
                    href="/application/admission-letter"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e69912] hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg transition"
                  >
                    <Award size={16} />
                    <span>View Official Admission Letter</span>
                  </Link>
                ) : isSubmitted ? (
                  <Link
                    href="/application/slip"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e69912] hover:bg-amber-600 text-slate-900 font-bold text-xs shadow-lg transition"
                  >
                    <FileCheck size={16} />
                    <span>Download Application Slip</span>
                  </Link>
                ) : percentage > 0 ? (
                  <Link
                    href="/application/apply"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-[#196855] font-bold text-xs shadow-lg transition"
                  >
                    <span>Continue Application</span>
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <Link
                    href="/application/apply"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-[#196855] font-bold text-xs shadow-lg transition"
                  >
                    <span>Start Admission Application</span>
                    <ArrowRight size={14} />
                  </Link>
                )}

                {!isSubmitted && percentage >= 80 && (
                  <Link
                    href="/application/review"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold text-xs border border-emerald-600 transition"
                  >
                    <Send size={14} />
                    <span>Review & Submit</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Quick Identifier Pill Box */}
            <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-2 shrink-0 sm:min-w-[240px]">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Applicant Number</p>
                <p className="text-sm font-mono font-black text-[#e69912]">{applicantNumber}</p>
              </div>
              <div className="border-t border-white/10 pt-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Selected Programme</p>
                <p className="text-xs font-semibold text-white truncate max-w-[220px]">
                  {application?.selected_programme?.programme?.name || applicationType}
                </p>
              </div>
              <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize border ${
                  hasOffer
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : isActionRequired
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    : isSubmitted
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                    : 'bg-slate-500/20 text-slate-300 border-slate-400/30'
                }`}>
                  {application?.status.replace('_', ' ') || 'In Progress'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Application Progress */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#196855] flex items-center justify-center font-bold text-xs">
                {isSubmitted ? '100%' : `${percentage}%`}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-bold text-gray-900">
                {isSubmitted ? '100% Completed' : `${percentage}% Completed`}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {hasOffer ? 'Admission offered' : isSubmitted ? 'Application finalized' : 'Multi-step registration'}
              </p>
            </div>
            <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#196855] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${isSubmitted ? 100 : percentage}%` }}
              />
            </div>
          </div>

          {/* Card 2: Profile Completion */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profile</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <User size={16} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-bold text-gray-900">Personal & Contact</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {steps.personal && steps.contact ? 'Bio-data saved' : 'Incomplete'}
              </p>
            </div>
            <Link
              href="/application/apply"
              className="mt-3 text-[11px] font-bold text-[#196855] hover:text-[#e69912] flex items-center gap-1"
            >
              <span>{isSubmitted ? 'View Details' : 'Edit Details'}</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Card 3: Document Status */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Credentials</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Files size={16} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-bold text-gray-900">
                {steps.documents ? 'Uploaded & Verified' : 'Awaiting Upload'}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {application?.documents?.length || 0} document(s) filed
              </p>
            </div>
            <span className={`mt-3 text-[10px] font-bold ${steps.documents ? 'text-emerald-600' : 'text-amber-600'}`}>
              {steps.documents ? '● Complete' : '● Passport & O-Level'}
            </span>
          </div>

          {/* Card 4: Email Verification */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Verification</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-bold text-emerald-700">Email Verified</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{session.email}</p>
            </div>
            <span className="mt-3 text-[10px] text-emerald-600 font-bold">● Active & Secure</span>
          </div>

          {/* Card 5: Admission Offer / Submission Status */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Admission Offer</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                hasOffer ? 'bg-amber-50 text-amber-700' : isSubmitted ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {hasOffer ? <Award size={16} /> : isSubmitted ? <FileCheck size={16} /> : <Clock size={16} />}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-bold text-gray-900">
                {hasOffer ? 'Offer Issued' : isSubmitted ? 'Submitted' : 'In Progress'}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {hasOffer ? application.admission_offer?.offer_status : isSubmitted ? 'Under screening' : 'Form incomplete'}
              </p>
            </div>
            {hasOffer ? (
              <Link href="/application/admission-letter" className="mt-3 text-[10px] text-[#196855] font-bold hover:underline">
                View Letter &rarr;
              </Link>
            ) : isSubmitted ? (
              <Link href="/application/slip" className="mt-3 text-[10px] text-[#196855] font-bold hover:underline">
                View Slip &rarr;
              </Link>
            ) : (
              <span className="mt-3 text-[10px] text-gray-400 font-medium">Pending Final Submit</span>
            )}
          </div>

        </div>

        {/* Application Lifecycle Stages & Guidance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Academic Registration Roadmap */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 font-serif">
                Official Application Roadmap
              </h2>
              <span className="text-xs font-bold text-[#196855] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                {hasOffer ? 'Offer Phase' : isSubmitted ? 'Submitted Phase' : 'Registration Phase'}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Track the progress of your admission file through the Al-Hidayah College Admissions Directorate:
            </p>

            <div className="space-y-3 pt-1">
              
              {/* Step 1: Personal & Contact */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                steps.personal && steps.contact ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                  steps.personal && steps.contact ? 'bg-[#196855] text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {steps.personal && steps.contact ? '✓' : '1'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-900">
                      Step 1: Bio-Data & Contact Information
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      steps.personal && steps.contact ? 'text-emerald-700 bg-white border-emerald-200' : 'text-slate-500 bg-white border-slate-200'
                    }`}>
                      {steps.personal && steps.contact ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Candidate legal names, state of origin, and active telephone contacts.
                  </p>
                </div>
              </div>

              {/* Step 2: Academic Qualifications & Documents */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                steps.qualifications && steps.documents ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                  steps.qualifications && steps.documents ? 'bg-[#196855] text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {steps.qualifications && steps.documents ? '✓' : '2'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-900">
                      Step 2: O-Level Qualifications & Document Uploads
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      steps.qualifications && steps.documents ? 'text-emerald-700 bg-white border-emerald-200' : 'text-slate-500 bg-white border-slate-200'
                    }`}>
                      {steps.qualifications && steps.documents ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Verified O-Level results grid (5+ subjects) and digital credential uploads.
                  </p>
                </div>
              </div>

              {/* Step 3: Application Submission */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                isSubmitted ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                  isSubmitted ? 'bg-[#196855] text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {isSubmitted ? '✓' : '3'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-900">
                      Step 3: Formal Attestation & Submission
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      isSubmitted ? 'text-emerald-700 bg-white border-emerald-200' : 'text-slate-500 bg-white border-slate-200'
                    }`}>
                      {isSubmitted ? 'Submitted' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Application locked and Acknowledgement Slip reference issued.
                  </p>
                </div>
              </div>

              {/* Step 4: Directorate Screening & Offer */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                hasOffer ? 'bg-emerald-50/70 border-emerald-200' : isUnderReview ? 'bg-blue-50/70 border-blue-200' : isActionRequired ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                  hasOffer ? 'bg-emerald-700 text-white' : isUnderReview ? 'bg-blue-600 text-white' : isActionRequired ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {hasOffer ? '✓' : '4'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-900">
                      Step 4: Admissions Screening & Offer of Admission
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      hasOffer ? 'text-emerald-700 bg-white border-emerald-200' : isUnderReview ? 'text-blue-700 bg-white border-blue-200' : isActionRequired ? 'text-amber-700 bg-white border-amber-200' : 'text-slate-500 bg-white border-slate-200'
                    }`}>
                      {hasOffer ? 'Admitted' : isUnderReview ? 'Screening' : isActionRequired ? 'Action Required' : 'Upcoming'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Credential verification by Academic Registrar and issuance of Official Provisional Admission Letter.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Col: Applicant Identity Summary */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 font-serif border-b border-gray-100 pb-2">
              Applicant Profile Card
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Full Name</p>
                <p className="font-bold text-gray-900 mt-0.5">
                  {applicant?.full_name || session.profile.full_name || 'Not provided yet'}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Applicant ID</p>
                <p className="font-mono font-bold text-[#196855] mt-0.5">{applicantNumber}</p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Registered Email</p>
                <p className="text-gray-700 mt-0.5 break-all">{session.email}</p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Contact Phone</p>
                <p className="text-gray-700 mt-0.5">
                  {applicant?.phone_number || session.profile.phone || 'None provided'}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Application Type</p>
                <p className="font-semibold text-gray-800 mt-0.5">{applicationType}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-2">
                {hasOffer ? (
                  <Link
                    href="/application/admission-letter"
                    className="w-full py-2.5 px-3 rounded-xl bg-[#196855] hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Award size={14} />
                    <span>View Admission Letter</span>
                  </Link>
                ) : isSubmitted ? (
                  <Link
                    href="/application/slip"
                    className="w-full py-2.5 px-3 rounded-xl bg-[#196855] hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <FileCheck size={14} />
                    <span>View Official Slip</span>
                  </Link>
                ) : (
                  <Link
                    href="/application/apply"
                    className="w-full py-2.5 px-3 rounded-xl bg-[#196855] hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <User size={14} />
                    <span>Continue Application Form &rarr;</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <Info size={16} className="shrink-0 text-amber-600 mt-0.5" />
              <span>
                Keep your applicant number safe. You will require it for all subsequent admission correspondence and screening.
              </span>
            </div>
          </div>

        </div>

      </div>
    </ApplicantPortalLayout>
  );
}
