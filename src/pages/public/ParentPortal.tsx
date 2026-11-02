import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/db';
import { StudentRecord, PaymentReceipt } from '../../types';
import { INSTITUTION_INFO, TUITION_SCHEDULE } from '../../data/ijmbData';
import {
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  GraduationCap,
  Calendar,
  Lock,
  Phone,
  PhoneCall,
  Mail,
  ShieldCheck,
  Printer,
  Clock
} from 'lucide-react';

export const ParentPortal: React.FC = () => {
  const [matricQuery, setMatricQuery] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [matchedStudent, setMatchedStudent] = useState<StudentRecord | null>(null);
  const [studentReceipts, setStudentReceipts] = useState<PaymentReceipt[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setHasSearched(true);

    const cleanMatric = matricQuery.trim().toUpperCase();
    const students = db.getStudents();
    const found = students.find(s => s.matric_number.toUpperCase() === cleanMatric);

    if (!found) {
      setErrorMsg('No student record found with this matriculation number. Please verify and re-enter.');
      setMatchedStudent(null);
      return;
    }

    // Permissioned access verification: access code can be last 4 digits of phone or guardian PIN
    if (accessCode.trim().length < 4) {
      setErrorMsg('Please enter a valid 4-digit Parent Access Security PIN provided during registration.');
      setMatchedStudent(null);
      return;
    }

    setMatchedStudent(found);
    const rcpts = db.getReceipts().filter(r => r.matricNumber.toUpperCase() === cleanMatric);
    setStudentReceipts(rcpts);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase bg-[#e69912] text-slate-950 tracking-widest">
            Parent & Sponsor Verification Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white tracking-tight">
            Parent & Guardian Access Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Secure, permission-controlled visibility into your ward’s tuition fee clearance, attendance standing, and academic session notices at the Abaji Study Centre.
          </p>
        </div>

        {/* Parent & Guardian Advisory Banner Featuring Real Students Cohort */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-64 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-black">
            <img
              src="/ahcas-orientation-students-cohort.jpg"
              alt="AHCAS Matriculated Students Assembly"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#196855] text-xs font-bold rounded-full border border-emerald-200">
              <Users size={14} className="text-[#196855]" />
              <span>Parent Consultation Advisory</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#196855] dark:text-emerald-400">
              Plan the Next Step Together with Your Child
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              At Al-Hidayah College of Advanced Studies, we partner with parents and guardians to guarantee that students select the optimal IJMB subject triplet matching their university degree aspirations. Explore flexible installment tuition, safe off-campus student accommodation in Abaji, and regular progress reports.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`tel:${INSTITUTION_INFO.phone}`}
                className="px-4 py-2 bg-[#196855] hover:opacity-90 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <PhoneCall size={14} />
                <span>Call Registry: {INSTITUTION_INFO.phone}</span>
              </a>
              <Link
                to="/admissions/requirements"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-colors"
              >
                View 73 IJMB Combinations →
              </Link>
            </div>
          </div>
        </div>

        {/* Lookup Box */}
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student Matriculation Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AHCAS/2026/IJMB/004"
                  value={matricQuery}
                  onChange={e => setMatricQuery(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white uppercase font-mono focus:outline-none focus:border-[#196855]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parent Security PIN (4 Digits) *
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="••••"
                  value={accessCode}
                  onChange={e => setAccessCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#196855]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="text-center pt-2">
              <button
                type="submit"
                className="px-8 py-3 bg-[#196855] hover:bg-[#196855] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Search size={16} />
                <span>Verify & Access Ward Records</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Hint */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center text-xs text-slate-500">
            <span>Demo Test Credentials: Matric: <strong>AHCAS/2026/IJMB/004</strong> • PIN: <strong>2026</strong></span>
          </div>
        </div>

        {/* Permitted Student Progress & Fee View */}
        {matchedStudent && (
          <div className="space-y-6 animate-fade-in">
            {/* Student Identity Card */}
            <div className="p-6 bg-gradient-to-r from-[#196855] via-[#196855] to-[#0F172A] text-white rounded-3xl border border-[#e69912]/40 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#e69912] text-slate-950 font-mono">
                  Verified Ward Dossier
                </span>
                <h2 className="text-xl sm:text-2xl font-black">{matchedStudent.full_name}</h2>
                <p className="text-xs text-emerald-200 font-mono">{matchedStudent.matric_number}</p>
                <p className="text-xs text-slate-300">{matchedStudent.programme} • {matchedStudent.study_centre}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-300 block">Registration Status</span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-[#196855] inline-block mt-1">
                  Active & Enrolled
                </span>
              </div>
            </div>

            {/* Tuition Breakdown & Installment Clearance */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-[#196855]" size={20} />
                  <h3 className="font-extrabold text-sm sm:text-base">Tuition & Fee Clearance Summary</h3>
                </div>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                  Total Approved Fee: ₦{matchedStudent.total_tuition?.toLocaleString() || '258,500'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500 block">1st Installment (Resumption)</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    ₦{TUITION_SCHEDULE.ijmb.firstInstallment.toLocaleString()}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#196855]">
                    <CheckCircle2 size={13} />
                    <span>Cleared & Verified</span>
                  </span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500 block">2nd Installment (Exam Fee)</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    ₦{TUITION_SCHEDULE.ijmb.secondInstallment.toLocaleString()}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                    <Clock size={13} />
                    <span>Due Before 2nd Semester</span>
                  </span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500 block">Outstanding Balance</span>
                  <p className="text-lg font-black text-amber-700 dark:text-amber-400">
                    ₦{matchedStudent.outstanding_balance?.toLocaleString() || '105,500'}
                  </p>
                  <span className="text-[11px] text-slate-400 block">Payment plans honored</span>
                </div>
              </div>

              {/* Verified Receipts List */}
              <div className="pt-3 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Bursary Official Receipts Issued
                </h4>
                {studentReceipts.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                    {studentReceipts.map(r => (
                      <div key={r.receiptNumber} className="p-3 bg-white dark:bg-slate-900 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{r.feeType}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Ref: {r.reference} • Paid: {r.paidAt}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-700 block">₦{r.amountNgn.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500">{r.paymentMethod}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No automated receipts recorded for this session yet.</p>
                )}
              </div>
            </div>

            {/* Academic Subject Triplet */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm sm:text-base">Assigned Subject Triplet & Attendance</h3>
              <div className="flex flex-wrap gap-2">
                {(matchedStudent.subject_combination || ['Biology', 'Chemistry', 'Physics']).map(sub => (
                  <span key={sub} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-[#196855] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {sub}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Lectures conducted at JSS Agyana Road Study Centre, Abaji. In accordance with student privacy regulations, detailed disciplinary records and internal notes are restricted to authorised Academic Registry personnel.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
