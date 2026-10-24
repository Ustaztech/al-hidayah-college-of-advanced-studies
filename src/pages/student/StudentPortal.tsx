import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { db, PaymentReceipt } from '../../services/db';
import { IJMBResultEntry } from '../../types';
import { StudentIDCardModal } from '../../components/common/StudentIDCardModal';
import { INSTITUTION_INFO, TUITION_SCHEDULE } from '../../data/ijmbData';
import {
  GraduationCap,
  BookOpen,
  CreditCard,
  Award,
  ChevronRight,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  Laptop,
  Check,
  Printer,
  Sparkles,
  BarChart2,
  AlertCircle
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const { studentData } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [idModalOpen, setIdModalOpen] = useState(false);
  const [academicSession, setAcademicSession] = useState('2026/2027');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [receiptModal, setReceiptModal] = useState<PaymentReceipt | null>(null);
  const { currentUser } = useAuth();

  // Active student from DB or logged in session
  const enrolledStudents = db.getStudents();
  const currentStudent = studentData || enrolledStudents.find(s => s.email.toLowerCase() === currentUser?.email.toLowerCase() || s.matric_number === currentUser?.matricNumber) || enrolledStudents[0];

  const student = currentStudent || {
    id: currentUser?.id || 'std-user',
    matric_number: currentUser?.matricNumber || 'AHCAS/STUDENT/2026',
    full_name: currentUser?.name || 'Enrolled Student',
    email: currentUser?.email || 'student@alhidayahcollege.com.ng',
    phone: currentUser?.phone || INSTITUTION_INFO.phone,
    programme: 'IJMB Direct Entry Programme (A-Level)',
    department: 'IJMB Academic Directorate',
    level: 'IJMB Cohort',
    study_centre: INSTITUTION_INFO.studyCentre,
    subject_combination: ['Biology', 'Chemistry', 'Physics'],
    total_tuition: 258500,
    first_installment_paid: false,
    second_installment_paid: false,
    outstanding_balance: 258500,
    tuition_status: 'Pending' as const,
    cumulative_grade_points: 0,
    has_bonus_point: false,
    ijmb_results: []
  };

  const receipts = db.getReceipts().filter(r => r.matricNumber === student.matric_number);
  const results: IJMBResultEntry[] = student.ijmb_results || [];

  const totalPoints = results.reduce((sum, r) => sum + r.gradePoint, 0);
  const passedAllThree = results.length >= 3 && results.every(r => r.letterGrade !== 'F');
  const bonusPoint = passedAllThree ? 1 : 0;
  const cumulativePoints = totalPoints + bonusPoint;

  const handlePayTuition = (amount: number, feeDescription: string) => {
    setPaymentLoading(true);
    setTimeout(() => {
      const receipt = db.recordPaymentReceipt({
        studentId: student.id,
        matricNumber: student.matric_number,
        studentName: student.full_name,
        feeType: feeDescription,
        amountNgn: amount,
        paymentMethod: 'Bank Transfer'
      });
      setPaymentLoading(false);
      setReceiptModal(receipt);
    }, 1200);
  };

  const setTab = (tabName: string) => {
    if (tabName === 'overview') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabName });
    }
  };

  return (
    <PortalLayout activeNav="Dashboard" portalTitle="Student Information Portal">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ========================================================================= */}
        {/* TAB CONTROLS (IF NOT IN OVERVIEW) */}
        {/* ========================================================================= */}
        {activeTab !== 'overview' && (
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setTab('overview')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              ← Back to Dashboard Overview
            </button>
            <span className="text-xs font-black uppercase text-emerald-800">
              Active View: {activeTab.toUpperCase()}
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. OVERVIEW DASHBOARD VIEW (EXACT MATCH TO IMAGE 4) */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Page Header Bar with Session Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
                  Student dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Manage your academic journey at AHCAS, Abaji.
                </p>
              </div>

              {/* Academic Session Selector */}
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Academic Session</span>
                <select
                  value={academicSession}
                  onChange={e => setAcademicSession(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="2026/2027">2026/2027</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="2024/2025">2024/2025</option>
                </select>
              </div>
            </div>

            {/* Large Welcome Greeting Banner (Exact Match to Image 4) */}
            <div className="relative rounded-3xl bg-gradient-to-r from-[#D7EBDC] via-[#E8F5EB] to-[#F1F9F3] border border-emerald-200 p-6 sm:p-8 overflow-hidden shadow-xs">
              
              {/* Background Campus Illustration Silhouette */}
              <img
                src="/campus-gate.jpg"
                alt="AHCAS Campus Gate"
                className="absolute right-0 top-0 bottom-0 w-2/5 object-cover opacity-20 filter grayscale pointer-events-none"
              />

              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                
                {/* Student Avatar + Greeting */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-3 border-white shadow-md overflow-hidden bg-emerald-800 shrink-0">
                    <img
                      src="/hero-graduate.jpg"
                      alt="Student Portrait"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-sm sm:text-base font-bold text-[#006B35]">
                      Welcome back,
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
                      {student.full_name.split(' ')[0]}.
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700">
                      {student.programme || 'ND Computer Science / IJMB Sciences'}
                    </p>
                    <span className="text-[11px] font-mono font-bold text-slate-500 block">
                      Student ID: {student.matric_number}
                    </span>
                  </div>
                </div>

                {/* Right Crest Badge */}
                <div className="hidden lg:flex flex-col items-center p-3 bg-white/80 backdrop-blur-xs rounded-2xl border border-emerald-200 shadow-xs">
                  <img
                    src="/official-logo.jpg"
                    alt="AHCAS Official Crest"
                    className="h-12 w-auto object-contain"
                  />
                  <span className="text-[10px] font-bold text-emerald-900 mt-1 uppercase">
                    Al-Hidayah College
                  </span>
                </div>

              </div>
            </div>

            {/* 3 Stat Cards Row (Exact Match to Image 4) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Card 1: Registered Courses */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-[#006B35] shrink-0">
                  <BookOpen size={22} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">
                    Registered courses
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                    6
                  </p>
                  <span className="text-[11px] text-slate-400">
                    for {academicSession} session
                  </span>
                </div>
              </div>

              {/* Card 2: Learning Progress */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <BarChart2 size={22} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">
                    Learning progress
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                    68%
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Based on completed activities
                  </span>
                </div>
              </div>

              {/* Card 3: Upcoming Tasks */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-[#006B35] shrink-0">
                  <Calendar size={22} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">
                    Upcoming tasks
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                    3
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Due in the next 14 days
                  </span>
                </div>
              </div>

            </div>

            {/* Quick Links Section (Exact Match to Image 4) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-slate-900 tracking-tight font-sans">
                  Quick links
                </h3>
                <button
                  onClick={() => setTab('fees')}
                  className="text-xs font-bold text-[#006B35] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View all services</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Quick Link 1: Course Registration */}
                <button
                  onClick={() => setTab('courses')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006B35] flex items-center justify-center">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block group-hover:text-[#006B35]">
                        Course registration
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Register and manage your courses
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-[#006B35] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Quick Link 2: Fees */}
                <button
                  onClick={() => setTab('fees')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block group-hover:text-amber-700">
                        Fees
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Check your fees and make payments
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Quick Link 3: Results */}
                <button
                  onClick={() => setTab('results')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006B35] flex items-center justify-center">
                      <BarChart2 size={18} />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block group-hover:text-[#006B35]">
                        Results
                      </span>
                      <span className="text-[10px] text-slate-400">
                        View your academic results
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-[#006B35] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Quick Link 4: E-learning */}
                <Link
                  to="/student/elearning"
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-yellow-500 shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-800 flex items-center justify-center">
                      <Laptop size={18} />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block group-hover:text-yellow-800">
                        E-learning
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Access lecture materials and resources
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-yellow-800 group-hover:translate-x-0.5 transition-transform" />
                </Link>

              </div>
            </div>

            {/* Two Column Bottom: Today's Schedule & Recent Notices (Exact Match to Image 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              
              {/* Column 1: Today's Schedule */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-[#006B35]" />
                    <h4 className="font-black text-sm text-slate-900">
                      Today's schedule
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Tuesday, 14 January 2026
                  </span>
                </div>

                <div className="space-y-3">
                  
                  {/* Period 1 */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border-l-4 border-emerald-500 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700">
                        <span>09:00 – 11:00</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-emerald-800">LT 1</span>
                      </div>
                      <h5 className="font-black text-xs sm:text-sm text-slate-900">
                        Introduction to Computing
                      </h5>
                      <span className="text-[11px] text-slate-500">
                        CSC 101 • Dr. M. Bello
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-extrabold">
                      In progress
                    </span>
                  </div>

                  {/* Period 2 */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border-l-4 border-amber-400 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700">
                        <span>13:00 – 15:00</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-amber-800">LT 2</span>
                      </div>
                      <h5 className="font-black text-xs sm:text-sm text-slate-900">
                        Communication Skills
                      </h5>
                      <span className="text-[11px] text-slate-500">
                        GNS 102 • Hajiya S. Ibrahim
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px] font-extrabold">
                      Upcoming
                    </span>
                  </div>

                </div>
              </div>

              {/* Column 2: Recent Notices */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-[#006B35]" />
                    <h4 className="font-black text-sm text-slate-900">
                      Recent notices
                    </h4>
                  </div>
                  <Link to="/contact" className="text-xs font-bold text-[#006B35] hover:underline flex items-center gap-1">
                    <span>View all notices</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>

                <div className="space-y-3.5 text-xs">
                  
                  {/* Notice 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        Course registration for {academicSession} session
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">12 Jan 2026</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-4">
                      Registration is now open. Please complete your registration early to avoid late fees.
                    </p>
                  </div>

                  {/* Notice 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Payment deadline reminder
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">10 Jan 2026</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-4">
                      Second semester fees are due on or before 31 January 2026. Flexible installments apply.
                    </p>
                  </div>

                  {/* Notice 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        ND / IJMB Orientation Programme
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">08 Jan 2026</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-4">
                      The orientation programme for new and returning students will hold at the Main Auditorium.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Digital ID Card Preview Button */}
            <div className="p-4 bg-emerald-950 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Award className="text-[#D4A62A]" size={24} />
                <div>
                  <h4 className="font-black text-sm">Official Digital Student Identity Card</h4>
                  <p className="text-xs text-emerald-200">
                    Matric: {student.matric_number} • Study Centre: JSS Agyana Rd, Abaji
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIdModalOpen(true)}
                className="px-5 py-2 bg-[#D4A62A] hover:bg-[#b88d1d] text-slate-950 font-black rounded-xl text-xs uppercase shadow-md cursor-pointer transition-colors"
              >
                View Official ID Card
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. TUITION FEES & INSTALLMENTS VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'fees' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="border-b pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Approved IJMB Tuition Schedule & Installment Tracker
                </h3>
                <p className="text-xs text-slate-500">
                  Official QA Manual Doc Code: {INSTITUTION_INFO.documentCode}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black ${
                student.tuition_status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                Status: {student.tuition_status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-slate-500 block">1st Installment (Resumption)</span>
                <p className="text-2xl font-black text-[#006B35] font-mono">
                  ₦{TUITION_SCHEDULE.ijmb.firstInstallment.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500 block">
                  Acceptance, Lab, ID Card, Part-Tuition
                </span>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-[#006B35]">
                  Cleared / Verified
                </span>
              </div>

              <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-slate-500 block">2nd Installment (2nd Semester)</span>
                <p className="text-2xl font-black text-amber-700 font-mono">
                  ₦{TUITION_SCHEDULE.ijmb.secondInstallment.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500 block">
                  Tuition Balance, Mock, Final Exam
                </span>
                {student.second_installment_paid ? (
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-[#006B35]">
                    Cleared / Verified
                  </span>
                ) : (
                  <button
                    onClick={() => handlePayTuition(TUITION_SCHEDULE.ijmb.secondInstallment, '2nd Installment Tuition')}
                    disabled={paymentLoading}
                    className="mt-2 w-full py-2 bg-[#006B35] hover:bg-[#004D26] text-white font-extrabold rounded-xl text-xs shadow-xs"
                  >
                    {paymentLoading ? 'Processing...' : 'Pay 2nd Installment'}
                  </button>
                )}
              </div>

              <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/50 space-y-2">
                <span className="text-xs font-bold text-amber-900 block">Single Complete Clearance</span>
                <p className="text-2xl font-black text-slate-900 font-mono">
                  ₦{TUITION_SCHEDULE.ijmb.oneTimePayment.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-600 block">
                  All-inclusive session clearance
                </span>
                <span className="text-xs font-bold text-emerald-700 block mt-2">
                  Outstanding Balance: ₦{(student.outstanding_balance ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Issued Receipts */}
            <div className="space-y-3 pt-4">
              <h4 className="font-extrabold text-sm text-slate-900">Verified Payment Receipts</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                      <th className="p-3">Receipt No</th>
                      <th className="p-3">Fee Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Channel</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {receipts.map(r => (
                      <tr key={r.reference}>
                        <td className="p-3 font-mono font-bold text-[#006B35]">{r.receiptNumber}</td>
                        <td className="p-3 font-semibold">{r.feeType}</td>
                        <td className="p-3 font-mono font-bold">₦{r.amountNgn.toLocaleString()}</td>
                        <td className="p-3">{r.paymentMethod}</td>
                        <td className="p-3 font-mono text-slate-500">{r.paidAt}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. RESULTS CHECKER VIEW (CA 20% + EXAM 80% + BONUS POINT) */}
        {/* ========================================================================= */}
        {activeTab === 'results' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="border-b pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Official IJMB Statement of Results
                </h3>
                <p className="text-xs text-slate-500">
                  Moderated Grading: Continuous Assessment (20%) + Final Examination (80%) = 100%
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Score Points</span>
                <p className="text-2xl font-black text-[#006B35] font-mono">
                  {cumulativePoints} / 16 Points
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                    <th className="p-3">Subject</th>
                    <th className="p-3">CA (20)</th>
                    <th className="p-3">Exam (80)</th>
                    <th className="p-3">Total (100)</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Grade Point</th>
                    <th className="p-3">Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{r.subject}</td>
                      <td className="p-3 font-mono">{r.caScore}</td>
                      <td className="p-3 font-mono">{r.examScore}</td>
                      <td className="p-3 font-mono font-bold text-[#006B35]">{r.totalScore}</td>
                      <td className="p-3 font-extrabold">{r.letterGrade}</td>
                      <td className="p-3 font-mono font-bold">{r.gradePoint} pts</td>
                      <td className="p-3 text-slate-600">{r.interpretation}</td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                        No examination results certified for this student yet. Continuous assessment and examination scores will appear here once finalized by the Examination Officer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bonus Point Banner */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-amber-900 block">
                  Statutory IJMB Bonus Point Verification
                </span>
                <span className="text-[11px] text-slate-600">
                  A candidate passing all 3 registered subjects (Grade E or better) is granted +1 bonus point.
                </span>
              </div>
              <span className="px-3 py-1 bg-emerald-700 text-white font-extrabold text-xs rounded-xl">
                +1 Bonus Point Qualified
              </span>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-[#006B35] hover:bg-[#004D26] text-white font-extrabold rounded-xl text-xs shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <Printer size={15} />
                <span>Print Official Statement of Result</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ID Card Modal */}
      {idModalOpen && (
        <StudentIDCardModal
          isOpen={true}
          onClose={() => setIdModalOpen(false)}
          student={student as any}
        />
      )}

    </PortalLayout>
  );
};
