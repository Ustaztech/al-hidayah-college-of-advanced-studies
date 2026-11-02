import React, { useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { db, PaymentReceipt, StudentCourseRegistration } from '../../services/db';
import { logAuditEvent } from '../../services/audit';
import { IJMBResultEntry } from '../../types';
import { StudentIDCardModal } from '../../components/common/StudentIDCardModal';
import { ExamPhotocardModal } from '../../components/common/ExamPhotocardModal';
import { TranscriptModal } from '../../components/common/TranscriptModal';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import { PaymentCheckoutModal } from '../../components/common/PaymentCheckoutModal';
import { CBTMockCenter } from '../../components/cbt/CBTMockCenter';
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
  AlertCircle,
  ShieldCheck,
  Layers,
  UserCheck,
  CheckSquare,
  X
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const { studentData, currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const activeTab = searchParams.get('tab') || (location.pathname.endsWith('/cbt') ? 'cbt' : 'overview');

  const [idModalOpen, setIdModalOpen] = useState(false);
  const [examPhotocardOpen, setExamPhotocardOpen] = useState(false);
  const [transcriptModalOpen, setTranscriptModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutParams, setCheckoutParams] = useState({ amount: 105500, description: '2nd Installment Tuition & Examination Fee' });
  const [academicSession, setAcademicSession] = useState('2026/2027');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);

  // Active student from DB or logged in session
  const enrolledStudents = db.getStudents();
  const currentStudent =
    studentData ||
    enrolledStudents.find(
      s =>
        s.email.toLowerCase() === currentUser?.email.toLowerCase() ||
        (currentUser?.matricNumber && s.matric_number === currentUser.matricNumber)
    );

  const student = currentStudent || {
    id: currentUser?.id || 'std-guest',
    matric_number: currentUser?.matricNumber || 'Pending Matriculation',
    full_name: currentUser?.name || 'Prospective Student',
    email: currentUser?.email || '',
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
    tuition_status: 'Unpaid' as const,
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

  // ---------------------------------------------------------------------------
  // COURSE REGISTRATION TOOL STATE
  // ---------------------------------------------------------------------------
  const [selectedSemester, setSelectedSemester] = useState<'1st Semester' | '2nd Semester'>('1st Semester');
  const existingCourseRegs = db.getCourseRegistrations().filter(r => r.matricNumber === student.matric_number);
  const activeCourseReg = existingCourseRegs.find(r => r.semester === selectedSemester);

  const defaultAvailableCourses = [
    { code: 'BIO 001', title: 'General Biology I (Cell & Genetics)', units: 4, isCompulsory: true },
    { code: 'CHM 001', title: 'Inorganic & Physical Chemistry', units: 4, isCompulsory: true },
    { code: 'PHY 001', title: 'Mechanics, Heat & Waves', units: 4, isCompulsory: true },
    { code: 'GST 001', title: 'Use of English & Communication', units: 2, isCompulsory: true },
    { code: 'MTH 001', title: 'General Mathematics for Sciences', units: 4, isCompulsory: false },
    { code: 'ICT 001', title: 'Computer Applications & Digital Literacy', units: 2, isCompulsory: false }
  ];

  const [selectedCourseCodes, setSelectedCourseCodes] = useState<string[]>(
    activeCourseReg ? activeCourseReg.registeredCourses : ['BIO 001', 'CHM 001', 'PHY 001', 'GST 001']
  );
  const [courseRegSubmittedNotice, setCourseRegSubmittedNotice] = useState(false);

  const toggleCourseSelection = (code: string) => {
    if (selectedCourseCodes.includes(code)) {
      setSelectedCourseCodes(selectedCourseCodes.filter(c => c !== code));
    } else {
      setSelectedCourseCodes([...selectedCourseCodes, code]);
    }
  };

  const totalRegisteredUnits = defaultAvailableCourses
    .filter(c => selectedCourseCodes.includes(c.code))
    .reduce((sum, c) => sum + c.units, 0);

  const handleSaveCourseRegistration = () => {
    const reg: StudentCourseRegistration = {
      studentId: student.id,
      matricNumber: student.matric_number,
      semester: selectedSemester,
      level: 'IJMB Cohort',
      registeredCourses: selectedCourseCodes,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      approvedByCoordinator: true
    };
    db.saveCourseRegistration(reg);

    logAuditEvent(
      student.full_name,
      'STUDENT',
      'COURSE_REGISTRATION_SUBMITTED',
      `Registered ${selectedCourseCodes.length} courses (${totalRegisteredUnits} units) for ${selectedSemester}`
    );

    setCourseRegSubmittedNotice(true);
    setTimeout(() => setCourseRegSubmittedNotice(false), 3000);
  };

  // ---------------------------------------------------------------------------
  // TIMETABLE TOOL STATE
  // ---------------------------------------------------------------------------
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const timetableSchedule = [
    { day: 'Monday', time: '09:00 – 11:00', code: 'BIO 001', title: 'General Biology I', venue: 'Science Lab A', lecturer: 'Dr. A. K. Mohammed' },
    { day: 'Monday', time: '11:30 – 13:30', code: 'GST 001', title: 'Communication Skills', venue: 'Lecture Hall 1', lecturer: 'Hajiya S. Ibrahim' },
    { day: 'Tuesday', time: '09:00 – 11:00', code: 'CHM 001', title: 'Inorganic Chemistry', venue: 'Science Lab B', lecturer: 'Mall. Ibrahim Idris' },
    { day: 'Tuesday', time: '13:00 – 15:00', code: 'PHY 001', title: 'Mechanics & Waves', venue: 'Lecture Hall 2', lecturer: 'Engr. D. O. Alabi' },
    { day: 'Wednesday', time: '09:00 – 12:00', code: 'BIO 001L', title: 'Biology Practical Lab', venue: 'Biology Lab', lecturer: 'Dr. A. K. Mohammed' },
    { day: 'Thursday', time: '10:00 – 12:00', code: 'MTH 001', title: 'General Mathematics', venue: 'Lecture Hall 1', lecturer: 'Ustaz Yahaya Zaid' },
    { day: 'Thursday', time: '14:00 – 16:00', code: 'ICT 001', title: 'Computer Lab Session', venue: 'ICT Computing Centre', lecturer: 'Engr. Y. Gambo' },
    { day: 'Friday', time: '09:00 – 11:00', code: 'CHM 001L', title: 'Chemistry Practical Lab', venue: 'Chemistry Lab', lecturer: 'Mall. Ibrahim Idris' }
  ];

  const filteredTimetable = selectedDay === 'All'
    ? timetableSchedule
    : timetableSchedule.filter(t => t.day === selectedDay);

  // ---------------------------------------------------------------------------
  // TUITION PAYMENT HANDLER VIA SECURED GATEWAY
  // ---------------------------------------------------------------------------
  const handlePayTuition = (amount: number, feeDescription: string) => {
    setCheckoutParams({ amount, description: feeDescription });
    setCheckoutModalOpen(true);
  };

  const handlePaymentSuccess = (receipt: PaymentReceipt) => {
    if (checkoutParams.description.includes('2nd Installment')) {
      db.updateStudentTuition(student.id, true);
    }
    setSelectedReceipt(receipt);
    setReceiptModalOpen(true);
    setCheckoutModalOpen(false);
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
        {/* STUDENT TOOLS TOP TAB NAVIGATION BAR */}
        {/* ========================================================================= */}
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-[#196855] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap size={15} />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-[#196855] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen size={15} />
            <span>Course Registration</span>
          </button>

          <button
            onClick={() => setTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'bg-[#196855] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar size={15} />
            <span>Class Timetable</span>
          </button>

          <button
            onClick={() => setTab('fees')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'fees'
                ? 'bg-[#196855] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard size={15} />
            <span>Fees & Bursary Desk</span>
          </button>

          <button
            onClick={() => setTab('results')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'results'
                ? 'bg-[#196855] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart2 size={15} />
            <span>Results & Transcript</span>
          </button>

          <button
            onClick={() => setTab('cbt')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'cbt'
                ? 'bg-[#196855] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers size={15} />
            <span>CBT Mock Centre</span>
          </button>

          <Link
            to="/student/elearning"
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 text-slate-600 hover:bg-slate-100"
          >
            <Laptop size={15} />
            <span>E-Learning Hub</span>
          </Link>

          <button
            onClick={() => setExamPhotocardOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 text-slate-600 hover:bg-slate-100"
          >
            <Award size={15} />
            <span>Exam Photocard</span>
          </button>

          <button
            onClick={() => setIdModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 text-slate-600 hover:bg-slate-100"
          >
            <Award size={15} />
            <span>Digital ID Card</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 1. OVERVIEW DASHBOARD VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Page Header Bar with Session Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
                  Student Portal Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Academic operations and student tools at AHCAS, Abaji Study Centre.
                </p>
              </div>

              {/* Academic Session Selector */}
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Session</span>
                <select
                  value={academicSession}
                  onChange={e => setAcademicSession(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="2026/2027">2026/2027</option>
                  <option value="2025/2026">2025/2026</option>
                </select>
              </div>
            </div>

            {/* Student Welcome Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-[#196855] via-[#196855] to-[#196855] text-white p-6 sm:p-8 overflow-hidden shadow-xs">
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-3 border-[#e69912] shadow-md overflow-hidden bg-emerald-950 shrink-0">
                    <img
                      src="/hero-graduate.jpg"
                      alt="Student Portrait"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-black text-[#e69912] tracking-wider font-mono">
                      AHCAS MATRICULATED STUDENT
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                      {student.full_name}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-emerald-100">
                      {student.programme}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-emerald-200 pt-0.5">
                      <span>Matric: <strong className="text-white">{student.matric_number}</strong></span>
                      <span>•</span>
                      <span>Study Centre: {student.study_centre}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    onClick={() => setIdModalOpen(true)}
                    className="px-3.5 py-2 bg-[#e69912] hover:bg-[#d48806] text-slate-950 font-black rounded-xl text-xs uppercase shadow-md cursor-pointer transition-colors inline-flex items-center gap-1.5"
                  >
                    <Award size={14} />
                    <span>ID Card</span>
                  </button>
                  <button
                    onClick={() => setExamPhotocardOpen(true)}
                    className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer border border-emerald-600 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Printer size={14} />
                    <span>Exam Photocard</span>
                  </button>
                  <button
                    onClick={() => setTranscriptModalOpen(true)}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs cursor-pointer border border-white/20 transition-colors inline-flex items-center gap-1.5"
                  >
                    <FileText size={14} />
                    <span>Transcript</span>
                  </button>
                  <button
                    onClick={() => setTab('cbt')}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs cursor-pointer transition-colors inline-flex items-center gap-1.5"
                  >
                    <Layers size={14} />
                    <span>CBT Test</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Student Tools Quick Access Grid */}
            <div className="space-y-3">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-700">
                Student Tools Suite
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Tool 1: Course Registration */}
                <button
                  onClick={() => setTab('courses')}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#196855] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#196855] flex items-center justify-center group-hover:bg-[#196855] group-hover:text-white transition-colors">
                      <BookOpen size={20} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-[#196855] rounded-full">
                      {activeCourseReg ? 'Registered' : 'Open'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 group-hover:text-[#196855] transition-colors">
                      Course Registration
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Register your semester courses and print official CRF slip.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#196855]">
                    <span>Access Tool</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Tool 2: Class Timetable */}
                <button
                  onClick={() => setTab('schedule')}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#196855] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#196855] flex items-center justify-center group-hover:bg-[#196855] group-hover:text-white transition-colors">
                      <Calendar size={20} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      Weekly
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 group-hover:text-[#196855] transition-colors">
                      Class Timetable
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      View Monday to Friday lecture slots, venues, and lecturers.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#196855]">
                    <span>View Schedule</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Tool 3: Fees & Bursary Desk */}
                <button
                  onClick={() => setTab('fees')}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-[#e69912] group-hover:text-slate-950 transition-colors">
                      <CreditCard size={20} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                      Installments
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 group-hover:text-amber-700 transition-colors">
                      Fees & Bursary Desk
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Pay tuition installments and download official receipts.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                    <span>Manage Fees</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Tool 4: Results Checker */}
                <button
                  onClick={() => setTab('results')}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#196855] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#196855] flex items-center justify-center group-hover:bg-[#196855] group-hover:text-white transition-colors">
                      <BarChart2 size={20} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-[#196855] rounded-full">
                      IJMB Grade
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 group-hover:text-[#196855] transition-colors">
                      Statement of Results
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Check CA 20% + Exam 80% marks and statutory bonus point.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#196855]">
                    <span>Check Results</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

              </div>
            </div>

            {/* Two Column Bottom: Today's Schedule & Recent Notices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              
              {/* Today's Schedule Preview */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-[#196855]" />
                    <h4 className="font-black text-sm text-slate-900">
                      Today's Lecture Schedule
                    </h4>
                  </div>
                  <button
                    onClick={() => setTab('schedule')}
                    className="text-xs font-bold text-[#196855] hover:underline"
                  >
                    Full Timetable →
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl border-l-4 border-[#196855] bg-slate-50">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700">
                        <span>09:00 – 11:00</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[#196855]">Science Lab A</span>
                      </div>
                      <h5 className="font-black text-xs sm:text-sm text-slate-900">
                        General Biology I (BIO 001)
                      </h5>
                      <span className="text-[11px] text-slate-500">
                        Dr. A. K. Mohammed • JSS Agyana Rd Study Centre
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-[#196855] rounded-lg text-[10px] font-extrabold">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl border-l-4 border-[#e69912] bg-slate-50">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700">
                        <span>11:30 – 13:30</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-amber-800">Lecture Hall 1</span>
                      </div>
                      <h5 className="font-black text-xs sm:text-sm text-slate-900">
                        Communication Skills (GST 001)
                      </h5>
                      <span className="text-[11px] text-slate-500">
                        Hajiya S. Ibrahim • Compulsory General Studies
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px] font-extrabold">
                      Upcoming
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Academic Notices */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-[#196855]" />
                    <h4 className="font-black text-sm text-slate-900">
                      Official College Notices
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">2026/2027</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-900">Course Registration for 2026/2027 Session</strong>
                      <span className="text-[10px] text-slate-400 font-mono">Registry</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Course registration is open. Ensure you confirm your 3 approved IJMB A-level subjects and compulsory GST modules.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-900">Tuition Installment Payment Guidelines</strong>
                      <span className="text-[10px] text-slate-400 font-mono">Bursary</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      First installment covers Acceptance and Laboratory fees. The second installment is due before Second Semester.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. COURSE REGISTRATION TOOL */}
        {/* ========================================================================= */}
        {activeTab === 'courses' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#196855] font-mono tracking-wider">
                  ACADEMIC REGISTRY TOOL
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Semester Course Registration
                </h3>
                <p className="text-xs text-slate-500">
                  Select and register your approved courses for Matric No: <strong>{student.matric_number}</strong>
                </p>
              </div>

              {/* Semester Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedSemester}
                  onChange={e => setSelectedSemester(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden"
                >
                  <option value="1st Semester">1st Semester (2026/2027)</option>
                  <option value="2nd Semester">2nd Semester (2026/2027)</option>
                </select>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer size={13} className="text-[#196855]" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

            {/* Course Registration Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                    <th className="p-3 w-12 text-center">Select</th>
                    <th className="p-3">Course Code</th>
                    <th className="p-3">Course Title</th>
                    <th className="p-3 text-center">Credit Units</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {defaultAvailableCourses.map(c => {
                    const isSelected = selectedCourseCodes.includes(c.code);
                    return (
                      <tr
                        key={c.code}
                        onClick={() => toggleCourseSelection(c.code)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCourseSelection(c.code)}
                            className="rounded text-[#196855] focus:ring-[#196855]"
                          />
                        </td>
                        <td className="p-3 font-mono font-bold text-[#196855]">{c.code}</td>
                        <td className="p-3 font-semibold text-slate-900">{c.title}</td>
                        <td className="p-3 text-center font-mono font-bold">{c.units} Units</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.isCompulsory
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {c.isCompulsory ? 'Core Compulsory' : 'Elective'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Credit Units & Submission Bar */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Total Registered Credit Units:</span>
                <span className="text-xl font-black text-[#196855] font-mono">
                  {totalRegisteredUnits} Units / 24 Max
                </span>
              </div>

              <div className="flex items-center gap-3">
                {courseRegSubmittedNotice && (
                  <span className="text-xs font-bold text-[#196855] flex items-center gap-1">
                    <CheckCircle2 size={15} />
                    <span>Registration Saved & Approved!</span>
                  </span>
                )}
                <button
                  onClick={handleSaveCourseRegistration}
                  className="px-6 py-2.5 bg-[#196855] hover:bg-[#196855] text-white font-extrabold rounded-xl text-xs uppercase shadow-md cursor-pointer transition-all inline-flex items-center gap-2"
                >
                  <CheckSquare size={15} />
                  <span>Submit Course Registration</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. CLASS TIMETABLE & SCHEDULE TOOL */}
        {/* ========================================================================= */}
        {activeTab === 'schedule' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#196855] font-mono tracking-wider">
                  STUDY CENTRE TIMETABLE
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Lecture Timetable & Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  Approved lecture timetable at JSS Agyana Road, Abaji Study Centre.
                </p>
              </div>

              {/* Day Filter */}
              <div className="flex items-center gap-2">
                {['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedDay === day
                        ? 'bg-[#196855] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Timetable Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTimetable.map((slot, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl border-2 border-slate-100 bg-slate-50/70 hover:bg-slate-50 hover:border-[#196855]/40 transition-all space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#196855] text-white font-mono">
                      {slot.day}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Clock size={13} className="text-[#196855]" />
                      <span>{slot.time}</span>
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">
                      {slot.title} ({slot.code})
                    </h4>
                    <p className="text-xs text-slate-500">
                      Venue: <strong className="text-slate-800">{slot.venue}</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      Facilitator: <strong className="text-slate-800">{slot.lecturer}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Printer size={14} className="text-[#196855]" />
                <span>Print Official Timetable</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. FEES & BURSARY DESK TOOL */}
        {/* ========================================================================= */}
        {activeTab === 'fees' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#196855] font-mono tracking-wider">
                  BURSARY DIRECTORATE
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Approved IJMB Tuition Schedule & Installment Desk
                </h3>
                <p className="text-xs text-slate-500">
                  Academic Session 2025/2026 Payment Breakdown
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-black ${
                  student.tuition_status === 'Paid'
                    ? 'bg-emerald-100 text-[#196855]'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                Tuition Status: {student.tuition_status}
              </span>
            </div>

            {/* Installment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1st Installment */}
              <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-slate-500 block">1st Installment (Resumption)</span>
                <p className="text-2xl font-black text-[#196855] font-mono">
                  ₦{TUITION_SCHEDULE.ijmb.firstInstallment.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500 block">
                  Acceptance, Lab, ID Card, Part-Tuition
                </span>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-[#196855]">
                  Cleared / Verified
                </span>
              </div>

              {/* 2nd Installment */}
              <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-slate-500 block">2nd Installment (2nd Semester)</span>
                <p className="text-2xl font-black text-amber-700 font-mono">
                  ₦{TUITION_SCHEDULE.ijmb.secondInstallment.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500 block">
                  Tuition Balance, Mock, Final Exam
                </span>
                {student.second_installment_paid ? (
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-[#196855]">
                    Cleared / Verified
                  </span>
                ) : (
                  <button
                    onClick={() => handlePayTuition(TUITION_SCHEDULE.ijmb.secondInstallment, '2nd Installment Tuition')}
                    disabled={paymentLoading}
                    className="mt-2 w-full py-2 bg-[#196855] hover:bg-[#196855] text-white font-extrabold rounded-xl text-xs shadow-xs cursor-pointer transition-colors"
                  >
                    {paymentLoading ? 'Verifying Payment...' : 'Pay 2nd Installment'}
                  </button>
                )}
              </div>

              {/* Full Tuition Clearance */}
              <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/50 space-y-2">
                <span className="text-xs font-bold text-amber-900 block">All-Inclusive Session Total</span>
                <p className="text-2xl font-black text-slate-900 font-mono">
                  ₦{TUITION_SCHEDULE.ijmb.oneTimePayment.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-600 block">
                  Comprehensive Academic & Examination Clearance
                </span>
                <span className="text-xs font-bold text-emerald-700 block mt-2">
                  Outstanding: ₦{(student.outstanding_balance ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Verified Payment Receipts Table */}
            <div className="space-y-3 pt-4">
              <h4 className="font-extrabold text-sm text-slate-900">
                Verified Bursary Payment Receipts
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                      <th className="p-3">Receipt No</th>
                      <th className="p-3">Fee Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Channel</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {receipts.map(r => (
                      <tr key={r.reference} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-[#196855]">{r.receiptNumber}</td>
                        <td className="p-3 font-semibold">{r.feeType}</td>
                        <td className="p-3 font-mono font-bold">₦{r.amountNgn.toLocaleString()}</td>
                        <td className="p-3">{r.paymentMethod}</td>
                        <td className="p-3 font-mono text-slate-500">{r.paidAt}</td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setSelectedReceipt(r);
                              setReceiptModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg font-bold text-[10px] cursor-pointer inline-flex items-center gap-1"
                          >
                            <Printer size={11} />
                            <span>View Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {receipts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-500">
                          No receipts generated yet. Make a payment above to generate an official bursary receipt.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. RESULTS CHECKER TOOL */}
        {/* ========================================================================= */}
        {activeTab === 'results' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#196855] font-mono tracking-wider">
                  EXAMINATION DIRECTORATE
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Official Statement of IJMB Results
                </h3>
                <p className="text-xs text-slate-500">
                  Moderated Grading: Continuous Assessment (20%) + Final Examination (80%) = 100%
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Score Points</span>
                <p className="text-2xl font-black text-[#196855] font-mono">
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
                      <td className="p-3 font-mono font-bold text-[#196855]">{r.totalScore}</td>
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

            {/* Bonus Point Statutory Verification */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-xs font-black text-amber-900 block">
                  Statutory IJMB Bonus Point Verification
                </span>
                <span className="text-[11px] text-slate-600">
                  A candidate passing all 3 registered subjects (Grade E or better) is granted +1 bonus point.
                </span>
              </div>
              <span className="px-3 py-1 bg-[#196855] text-white font-extrabold text-xs rounded-xl">
                +1 Bonus Point Qualified
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setTranscriptModalOpen(true)}
                className="px-6 py-2.5 bg-[#196855] hover:bg-[#124d3f] text-white font-extrabold rounded-xl text-xs shadow-md cursor-pointer inline-flex items-center gap-2 transition-colors"
              >
                <FileText size={15} />
                <span>Open Printable Official Transcript</span>
              </button>
              <button
                onClick={() => setTab('cbt')}
                className="px-6 py-2.5 bg-[#e69912] hover:bg-[#d48806] text-slate-950 font-black rounded-xl text-xs shadow-md cursor-pointer inline-flex items-center gap-2 transition-colors"
              >
                <Layers size={15} />
                <span>Practice CBT Mock Questions</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. CBT MOCK EXAMINATION CENTRE */}
        {/* ========================================================================= */}
        {activeTab === 'cbt' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs animate-fade-in">
            <CBTMockCenter
              studentName={student.full_name}
              matricNumber={student.matric_number}
            />
          </div>
        )}

      </div>

      {/* Official Digital Student ID Card Modal */}
      {idModalOpen && (
        <StudentIDCardModal
          isOpen={true}
          onClose={() => setIdModalOpen(false)}
          student={student as any}
        />
      )}

      {/* Official IJMB Exam Clearance Photocard Modal */}
      {examPhotocardOpen && (
        <ExamPhotocardModal
          isOpen={true}
          onClose={() => setExamPhotocardOpen(false)}
          student={student as any}
        />
      )}

      {/* Official Statement of Results & Transcript Modal */}
      {transcriptModalOpen && (
        <TranscriptModal
          isOpen={true}
          onClose={() => setTranscriptModalOpen(false)}
          student={student as any}
          results={results}
        />
      )}

      {/* Official Bursary Electronic Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          isOpen={receiptModalOpen}
          onClose={() => {
            setReceiptModalOpen(false);
            setSelectedReceipt(null);
          }}
          receipt={selectedReceipt}
        />
      )}

      {/* Secured Payment Gateway Checkout Modal */}
      <PaymentCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        amountNgn={checkoutParams.amount}
        feeDescription={checkoutParams.description}
        payerName={student.full_name}
        payerEmail={student.email}
        studentId={student.id}
        matricNumber={student.matric_number}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </PortalLayout>
  );
};
