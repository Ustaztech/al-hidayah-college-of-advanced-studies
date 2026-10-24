import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { db, calculateIJMBGrade } from '../../services/db';
import { ScratchCard, ApplicationRecord, CBTQuestion, StudentRecord, PaymentReceipt } from '../../types';
import { INSTITUTION_INFO, TUITION_SCHEDULE } from '../../data/ijmbData';
import { RegistrationSlipModal } from '../../components/common/RegistrationSlipModal';
import { AdmissionLetterModal } from '../../components/common/AdmissionLetterModal';
import { StudentIDCardModal } from '../../components/common/StudentIDCardModal';
import {
  ShieldCheck,
  UserCheck,
  CreditCard,
  GraduationCap,
  Monitor,
  CheckCircle2,
  Plus,
  KeyRound,
  Trash2,
  AlertTriangle,
  FileSpreadsheet,
  Search,
  Printer,
  Eye,
  FileText,
  Award,
  BookOpen,
  Receipt,
  Users,
  Building,
  Check,
  HelpCircle
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'applications' | 'grading' | 'bursary' | 'students' | 'cards' | 'cbt' | 'audit'>('applications');

  // Database Data States
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => db.getApplications());
  const [students, setStudents] = useState<StudentRecord[]>(() => db.getStudents());
  const [cards, setCards] = useState<ScratchCard[]>(() => db.getCards());
  const [questions, setQuestions] = useState<CBTQuestion[]>(() => db.getCBTQuestions());
  const [auditLogs, setAuditLogs] = useState(() => db.getAuditLogs());
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(() => db.getReceipts());

  // Search & Filters
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState<'ALL' | 'Admitted' | 'Submitted' | 'Under Review'>('ALL');
  const [studentSearch, setStudentSearch] = useState('');

  // Modals State
  const [selectedAppForSlip, setSelectedAppForSlip] = useState<ApplicationRecord | null>(null);
  const [selectedAppForLetter, setSelectedAppForLetter] = useState<ApplicationRecord | null>(null);
  const [selectedStudentForID, setSelectedStudentForID] = useState<StudentRecord | null>(null);

  // Batch Generator Form State
  const [batchType, setBatchType] = useState<ScratchCard['card_type']>('APPLICATION');
  const [batchCount, setBatchCount] = useState<number>(25);
  const [batchPrice, setBatchPrice] = useState<number>(10500);
  const [batchSuccess, setBatchSuccess] = useState('');

  // CBT Question Form State
  const [newCourseCode, setNewCourseCode] = useState('IJMB-PHY');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [qSuccess, setQSuccess] = useState('');

  // Grading Desk State (Exam Officer Mall. Usman Saidu)
  const [selectedStudentMatric, setSelectedStudentMatric] = useState<string>(() => students[0]?.matric_number || '');
  const activeGradingStudent = students.find(s => s.matric_number === selectedStudentMatric) || students[0];

  const [caScores, setCaScores] = useState<Record<string, number>>({
    sub0: 18,
    sub1: 17,
    sub2: 16
  });
  const [examScores, setExamScores] = useState<Record<string, number>>({
    sub0: 64,
    sub1: 58,
    sub2: 55
  });
  const [gradingSuccess, setGradingSuccess] = useState('');

  // Bursary Payment Form State
  const [payStudentMatric, setPayStudentMatric] = useState<string>(() => students[0]?.matric_number || '');
  const [payFeeType, setPayFeeType] = useState<'1st Installment (₦154,000)' | '2nd Installment (₦105,500)' | 'Full Session (₦258,500)' | 'Application Form (₦10,500)' | 'Result Collection (₦17,000)'>('1st Installment (₦154,000)');
  const [payAmount, setPayAmount] = useState<number>(154000);
  const [payChannel, setPayChannel] = useState<'Bank Transfer' | 'Remita' | 'Paystack'>('Bank Transfer');
  const [paySuccess, setPaySuccess] = useState('');

  // Handlers
  const handleApproveAdmission = (refNumber: string) => {
    db.updateApplicationStatus(refNumber, 'Admitted');
    setApplications(db.getApplications());
    setStudents(db.getStudents());
    setAuditLogs(db.getAuditLogs());
    alert(`Admission authorized for applicant ${refNumber}! Student matriculation account provisioned.`);
  };

  const handleCommitGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradingStudent) return;

    const subjects = activeGradingStudent.subject_combination || ['Subject 1', 'Subject 2', 'Subject 3'];
    const payload = subjects.map((sub, idx) => ({
      subject: sub,
      caScore: Number(caScores[`sub${idx}`] ?? 15),
      examScore: Number(examScores[`sub${idx}`] ?? 50)
    }));

    db.updateStudentResults(activeGradingStudent.matric_number, payload);
    setStudents(db.getStudents());
    setAuditLogs(db.getAuditLogs());
    setGradingSuccess(`Official IJMB Statement of Results successfully recorded & certified for ${activeGradingStudent.full_name} (${activeGradingStudent.matric_number})!`);
    setTimeout(() => setGradingSuccess(''), 4000);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = students.find(s => s.matric_number === payStudentMatric);
    if (!targetStudent) {
      alert('Please select an active student.');
      return;
    }

    const receipt = db.recordPaymentReceipt({
      studentId: targetStudent.id,
      matricNumber: targetStudent.matric_number,
      studentName: targetStudent.full_name,
      feeType: payFeeType,
      amountNgn: payAmount,
      paymentMethod: payChannel
    });

    setReceipts(db.getReceipts());
    setStudents(db.getStudents());
    setAuditLogs(db.getAuditLogs());
    setPaySuccess(`Receipt #${receipt.receiptNumber} generated! ₦${payAmount.toLocaleString()} credited.`);
    setTimeout(() => setPaySuccess(''), 4000);
  };

  const handleGenerateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    db.generateCardBatch(batchType, batchCount, batchPrice);
    setCards(db.getCards());
    setAuditLogs(db.getAuditLogs());
    setBatchSuccess(`Successfully generated batch of ${batchCount} ${batchType} scratch cards!`);
    setTimeout(() => setBatchSuccess(''), 4000);
  };

  const handleVoidCard = (serialNumber: string) => {
    db.voidCard(serialNumber);
    setCards(db.getCards());
    setAuditLogs(db.getAuditLogs());
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !optionA || !optionB) {
      alert('Please fill out all question fields.');
      return;
    }

    db.addCBTQuestion({
      course_code: newCourseCode,
      question: newQuestionText,
      options: [optionA, optionB, optionC, optionD].filter(Boolean),
      correct_option: Number(correctOptionIndex)
    });

    setQuestions(db.getCBTQuestions());
    setAuditLogs(db.getAuditLogs());
    setNewQuestionText('');
    setOptionA(''); setOptionB(''); setOptionC(''); setOptionD('');
    setQSuccess('New CBT question added successfully!');
    setTimeout(() => setQSuccess(''), 3000);
  };

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.ref_number.toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.subject_combination_name && app.subject_combination_name.toLowerCase().includes(appSearch.toLowerCase()));
    const matchesFilter = appFilter === 'ALL' || app.status === appFilter;
    return matchesSearch && matchesFilter;
  });

  // Filtered students
  const filteredStudents = students.filter(std =>
    std.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    std.matric_number.toLowerCase().includes(studentSearch.toLowerCase()) ||
    (std.subject_combination && std.subject_combination.join(' ').toLowerCase().includes(studentSearch.toLowerCase()))
  );

  // Financial metrics
  const totalReconciledFees = receipts.reduce((sum, r) => sum + r.amountNgn, 0);
  const totalExpectedTuition = students.length * TUITION_SCHEDULE.ijmb.oneTimePayment;

  return (
    <PortalLayout portalTitle={`Staff Admin (${role})`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header Banner */}
        <div className="p-6 bg-slate-950 text-white rounded-3xl border-b-4 border-[#006B35] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/official-logo.jpg"
              alt="AHCAS Official Crest"
              className="w-16 h-16 rounded-2xl bg-white p-1 object-contain shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-amber-400" size={18} />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {INSTITUTION_INFO.shortName} Academic Administration & QA Management
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-serif mt-0.5 text-white">
                {currentUser?.name || 'Staff Executive'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Official Post: {currentUser?.subRole || role} • Doc Ref: {INSTITUTION_INFO.documentCode} • RC: {INSTITUTION_INFO.rcNumber}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-right">
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Study Centre</span>
              <span className="text-xs font-bold text-amber-400">JSS Agyana Rd, Abaji</span>
            </div>
            <div className="bg-emerald-950/80 border border-emerald-800 px-4 py-2 rounded-2xl">
              <span className="block text-[10px] uppercase font-bold text-emerald-400">Audit Status</span>
              <span className="text-xs font-bold text-emerald-300">Compliant (Aug 2025)</span>
            </div>
          </div>
        </div>

        {/* Quick Institutional Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Applicants</span>
            <p className="text-2xl font-black text-[#006B35] dark:text-emerald-400 mt-1">{applications.length}</p>
            <span className="text-[10px] text-slate-400">2026/2027 Session Intake</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Matriculated Students</span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{students.length}</p>
            <span className="text-[10px] text-slate-400">Pioneer & Current Cohorts</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Reconciled Collections</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">₦{totalReconciledFees.toLocaleString()}</p>
            <span className="text-[10px] text-slate-400">Bursary Verified Receipts</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Active Cards</span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{cards.filter(c => c.status === 'Active').length}</p>
            <span className="text-[10px] text-slate-400">Application & Result Pins</span>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'applications', label: 'Admissions Desk', icon: UserCheck, count: applications.length },
            { id: 'grading', label: 'IJMB Grading & Exam Desk', icon: Award, count: students.length },
            { id: 'bursary', label: 'Bursary & Fee Reconciliation', icon: Receipt, count: receipts.length },
            { id: 'students', label: 'Student Registry & ID Cards', icon: Users, count: students.length },
            { id: 'cards', label: 'Scratch Card Batch Engine', icon: CreditCard, count: cards.length },
            { id: 'cbt', label: 'CBT Question Bank', icon: Monitor, count: questions.length },
            { id: 'audit', label: 'Regulatory Audit Trails', icon: ShieldCheck, count: auditLogs.length }
          ].map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#006B35] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon size={16} className={active ? 'text-amber-300' : 'text-slate-400'} />
                <span>{t.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  active ? 'bg-black/30 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ADMISSIONS DESK */}
        {/* ========================================================================= */}
        {activeTab === 'applications' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-serif flex items-center gap-2">
                  <UserCheck className="text-[#006B35]" size={20} />
                  Candidate Application Review (2026/2027 Session)
                </h3>
                <p className="text-xs text-slate-500">
                  Review applicant details, O'Level submissions, assign combinations, and authorize matriculation.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search candidate name or ref..."
                    value={appSearch}
                    onChange={e => setAppSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <select
                  value={appFilter}
                  onChange={e => setAppFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                >
                  <option value="ALL">All Status</option>
                  <option value="Submitted">Submitted Only</option>
                  <option value="Admitted">Admitted Only</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
            </div>

            {/* Application Records Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3">Ref & Date</th>
                    <th className="p-3">Candidate Full Name</th>
                    <th className="p-3">IJMB Combination</th>
                    <th className="p-3">O'Level Summary</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredApps.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3">
                        <span className="font-mono font-bold text-[#006B35] dark:text-emerald-400 block">
                          {app.ref_number}
                        </span>
                        <span className="text-[10px] text-slate-400">{app.submitted_at}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 dark:text-white block text-sm">
                          {app.full_name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {app.phone} • {app.gender} • {app.state_of_origin} ({app.lga})
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          Code {app.subject_combination_code || '030'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {app.subject_combination_name || 'Biology, Chemistry, Physics'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-slate-700 dark:text-slate-300 text-[11px] font-mono block max-w-xs truncate" title={app.olevel_sitting_1}>
                          {app.olevel_sitting_1 || 'WAEC: 5 Credits'}
                        </span>
                        {app.nin_number && (
                          <span className="text-[10px] text-slate-400">NIN: {app.nin_number}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] inline-flex items-center gap-1 ${
                          app.status === 'Admitted'
                            ? 'bg-emerald-100 text-[#006B35] dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {app.status === 'Admitted' && <CheckCircle2 size={12} />}
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Official Registration Slip Preview */}
                          <button
                            onClick={() => setSelectedAppForSlip(app)}
                            title="Print Official Registration Slip (PDF Form Matching Page 6)"
                            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer transition-colors"
                          >
                            <FileText size={15} />
                          </button>

                          {/* Admission Letter Preview */}
                          <button
                            onClick={() => setSelectedAppForLetter(app)}
                            title="Preview / Print Official Admission Letter"
                            className="p-1.5 bg-amber-50 dark:bg-amber-950 hover:bg-amber-100 text-amber-700 dark:text-amber-400 rounded-lg cursor-pointer transition-colors"
                          >
                            <Award size={15} />
                          </button>

                          {/* Admission Action */}
                          {app.status !== 'Admitted' ? (
                            <button
                              onClick={() => handleApproveAdmission(app.ref_number)}
                              className="px-3 py-1.5 bg-[#006B35] hover:bg-[#004D26] text-white font-extrabold rounded-lg text-[11px] shadow-sm cursor-pointer transition-colors"
                            >
                              Authorize Admission
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                              Admitted & Matriculated
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredApps.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-500">
                        <FileText size={36} className="mx-auto text-slate-400 mb-2" />
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300 block">No Application Records Found</span>
                        <span className="text-xs text-slate-500 mt-1 block">Candidate application submissions will appear here in real time.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: IJMB GRADING & EXAMINATION DESK (Mall. Usman Saidu - Exam Officer) */}
        {/* ========================================================================= */}
        {activeTab === 'grading' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="text-[#D4A62A]" size={20} />
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-serif">
                      IJMB Continuous Assessment & Examination Grading Terminal
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Operated by: <span className="font-bold text-[#006B35]">Mall. Usman Saidu (Registrar & Examination Officer)</span>.
                    Grading standard: CA (20%) + Exam (80%) = 100%. One (+1) Bonus Point awarded if student passes all 3 A-level subjects.
                  </p>
                </div>

                {/* Student Selector */}
                <div className="w-full md:w-80">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Enrolled Candidate for Grading:
                  </label>
                  <select
                    value={selectedStudentMatric}
                    onChange={e => setSelectedStudentMatric(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
                  >
                    {students.map(std => (
                      <option key={std.matric_number} value={std.matric_number}>
                        {std.full_name} ({std.matric_number})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {gradingSuccess && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{gradingSuccess}</span>
                </div>
              )}

              {activeGradingStudent && (
                <form onSubmit={handleCommitGrading} className="space-y-6">
                  
                  {/* Student Summary Card */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Target Student</span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {activeGradingStudent.full_name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">
                        Matric: {activeGradingStudent.matric_number} • Subject Code: {activeGradingStudent.subject_combination_code || '030'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-[#006B35] text-white text-xs font-bold rounded-xl">
                        Study Centre: {INSTITUTION_INFO.studyCentre.split(',')[0]}
                      </span>
                    </div>
                  </div>

                  {/* 3 IJMB Subject Inputs */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Approved 3 A-Level Subjects (Continuous Assessment & IJMB Final Examination)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(activeGradingStudent.subject_combination || ['Subject 1', 'Subject 2', 'Subject 3']).map((subName, idx) => {
                        const ca = caScores[`sub${idx}`] ?? 16;
                        const exam = examScores[`sub${idx}`] ?? 55;
                        const gradeCalc = calculateIJMBGrade(ca, exam);

                        return (
                          <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                            <div className="flex justify-between items-center border-b pb-2">
                              <span className="text-xs font-black text-[#006B35] dark:text-emerald-400">
                                Subject {idx + 1}: {subName}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-black ${
                                gradeCalc.grade === 'A' ? 'bg-emerald-100 text-[#006B35]' :
                                gradeCalc.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                gradeCalc.grade === 'C' ? 'bg-amber-100 text-amber-700' :
                                gradeCalc.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                                Grade {gradeCalc.grade} ({gradeCalc.points} pts)
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                  CA Score (Max 20)
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  max={20}
                                  value={ca}
                                  onChange={e => setCaScores({ ...caScores, [`sub${idx}`]: Math.min(20, Math.max(0, Number(e.target.value))) })}
                                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                  Exam Score (Max 80)
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  max={80}
                                  value={exam}
                                  onChange={e => setExamScores({ ...examScores, [`sub${idx}`]: Math.min(80, Math.max(0, Number(e.target.value))) })}
                                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono font-bold"
                                />
                              </div>
                            </div>

                            <div className="pt-2 border-t flex justify-between items-center text-xs">
                              <span className="text-slate-500">Total Score:</span>
                              <span className="font-mono font-black text-slate-900 dark:text-white">
                                {gradeCalc.total}/100 ({gradeCalc.interpretation})
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary & Bonus Point Check */}
                  {(() => {
                    const subjects = activeGradingStudent.subject_combination || ['Subject 1', 'Subject 2', 'Subject 3'];
                    const calcs = subjects.map((_, idx) =>
                      calculateIJMBGrade(caScores[`sub${idx}`] ?? 16, examScores[`sub${idx}`] ?? 55)
                    );
                    const rawPoints = calcs.reduce((sum, c) => sum + c.points, 0);
                    const passesAll = calcs.length >= 3 && calcs.every(c => c.grade !== 'F');
                    const bonusPoint = passesAll ? 1 : 0;
                    const totalCumulative = rawPoints + bonusPoint;

                    return (
                      <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                            Grading Summary & Statutory Bonus Point Computation
                          </span>
                          <span className="text-[11px] text-slate-600 dark:text-slate-400">
                            Raw Points: <strong className="font-mono">{rawPoints}</strong> • 
                            Bonus Point Awarded: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">+{bonusPoint} pt</strong> (Status: {passesAll ? 'Qualified (3 Passes)' : 'Disqualified (F Grade present)'})
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Total Points</span>
                            <div className="text-2xl font-black font-mono text-[#006B35] dark:text-emerald-400">
                              {totalCumulative} / 16 Points
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-[#006B35] hover:bg-[#004D26] text-white font-extrabold rounded-xl text-xs shadow-md cursor-pointer transition-colors"
                          >
                            Certify & Publish Result
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                </form>
              )}

              {!activeGradingStudent && (
                <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <Award size={36} className="mx-auto text-slate-400 mb-2" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Enrolled Students for Grading</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    When candidate applications are authorized and admitted, their student records will automatically appear here for continuous assessment and final IJMB examination grading.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BURSARY & FINANCIAL RECONCILIATION */}
        {/* ========================================================================= */}
        {activeTab === 'bursary' && (
          <div className="space-y-6">
            
            {/* Tuition Breakdown Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-[#004D26] text-white p-6 rounded-3xl border-2 border-emerald-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Bursary & Accounts Directorate
                  </span>
                  <h3 className="text-xl font-black font-serif mt-1">
                    Approved IJMB Fee Schedule (Official Operations Manual Approved Aug 2025)
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase">One-Time Complete Clearance</span>
                  <p className="text-2xl font-black text-amber-400 font-mono">
                    ₦{TUITION_SCHEDULE.ijmb.oneTimePayment.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-black/40 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">1st Installment (Resumption)</span>
                  <span className="font-black text-emerald-300 text-sm font-mono">₦{TUITION_SCHEDULE.ijmb.firstInstallment.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 block">Acceptance + Part Tuition</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">2nd Installment (2nd Sem)</span>
                  <span className="font-black text-amber-300 text-sm font-mono">₦{TUITION_SCHEDULE.ijmb.secondInstallment.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 block">Tuition Bal + Mock + IJMB Final</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Application Form Fee</span>
                  <span className="font-black text-white text-sm font-mono">₦{TUITION_SCHEDULE.ijmb.applicationForm.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 block">Single payment</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Result Collection Fee</span>
                  <span className="font-black text-white text-sm font-mono">₦{TUITION_SCHEDULE.ijmb.resultCollection.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 block">Post-exam collection</span>
                </div>
              </div>
            </div>

            {/* Payment Recording Form */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h4 className="font-black text-base text-slate-900 dark:text-white font-serif flex items-center gap-2">
                <Receipt size={18} className="text-[#006B35]" />
                Record & Reconcile Official Student Tuition Receipt
              </h4>

              {paySuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                  {paySuccess}
                </div>
              )}

              <form onSubmit={handleRecordPayment} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Student</label>
                  <select
                    value={payStudentMatric}
                    onChange={e => setPayStudentMatric(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                  >
                    {students.map(std => (
                      <option key={std.matric_number} value={std.matric_number}>
                        {std.full_name} ({std.matric_number})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fee Category</label>
                  <select
                    value={payFeeType}
                    onChange={e => {
                      const val = e.target.value as any;
                      setPayFeeType(val);
                      if (val.includes('154,000')) setPayAmount(154000);
                      else if (val.includes('105,500')) setPayAmount(105500);
                      else if (val.includes('258,500')) setPayAmount(258500);
                      else if (val.includes('10,500')) setPayAmount(10500);
                      else if (val.includes('17,000')) setPayAmount(17000);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                  >
                    <option value="1st Installment (₦154,000)">1st Installment (₦154,000)</option>
                    <option value="2nd Installment (₦105,500)">2nd Installment (₦105,500)</option>
                    <option value="Full Session (₦258,500)">Full Session (₦258,500)</option>
                    <option value="Application Form (₦10,500)">Application Form (₦10,500)</option>
                    <option value="Result Collection (₦17,000)">Result Collection (₦17,000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Amount Reconciled (₦)</label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={e => setPayAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 bg-[#006B35] hover:bg-[#004D26] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
                >
                  <Plus size={16} />
                  <span>Issue Official Receipt</span>
                </button>
              </form>
            </div>

            {/* Issued Receipts Table */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h4 className="font-black text-base text-slate-900 dark:text-white font-serif border-b pb-3">
                Verified Payment Receipts & Audit Log ({receipts.length})
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b">
                      <th className="p-3">Receipt #</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Matric No.</th>
                      <th className="p-3">Fee Description</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Channel</th>
                      <th className="p-3">Date Reconciled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {receipts.map(rec => (
                      <tr key={rec.reference} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-mono font-bold text-[#006B35] dark:text-emerald-400">{rec.receiptNumber}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{rec.studentName}</td>
                        <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{rec.matricNumber}</td>
                        <td className="p-3 font-medium">{rec.feeType}</td>
                        <td className="p-3 font-mono font-bold">₦{rec.amountNgn.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded font-bold text-[10px]">
                            {rec.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{rec.paidAt}</td>
                      </tr>
                    ))}
                    {receipts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-500">
                          <Receipt size={36} className="mx-auto text-slate-400 mb-2" />
                          <span className="font-bold text-sm text-slate-700 dark:text-slate-300 block">No Reconciled Receipts Yet</span>
                          <span className="text-xs text-slate-500 mt-1 block">Tuition and fee payments logged through the bursary desk will appear here.</span>
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
        {/* TAB 4: STUDENT REGISTRY & ID CARDS */}
        {/* ========================================================================= */}
        {activeTab === 'students' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-serif flex items-center gap-2">
                  <Users className="text-[#006B35]" size={20} />
                  Enrolled Students Registry & Digital Identity Records
                </h3>
                <p className="text-xs text-slate-500">
                  Total Active Matriculated Students: {students.length} across Pioneer and Current Cohorts
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search matric or student name..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b">
                    <th className="p-3">Matriculation No.</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Programme & Centre</th>
                    <th className="p-3">Tuition Status</th>
                    <th className="p-3">IJMB Cumulative Pts</th>
                    <th className="p-3 text-right">Digital ID Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredStudents.map(std => (
                    <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-[#006B35] dark:text-emerald-400">
                        {std.matric_number}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 dark:text-white block text-sm">{std.full_name}</span>
                        <span className="text-[11px] text-slate-500">{std.email} • {std.phone}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block">{std.programme}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {std.study_centre || INSTITUTION_INFO.studyCentre}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          std.tuition_status === 'Paid'
                            ? 'bg-emerald-100 text-[#006B35] dark:bg-emerald-950 dark:text-emerald-300'
                            : std.tuition_status === 'Partial'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {std.tuition_status} (Bal: ₦{(std.outstanding_balance ?? 0).toLocaleString()})
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono font-extrabold text-[#006B35] dark:text-emerald-400 text-sm">
                          {std.cumulative_grade_points || 0} Points
                        </span>
                        {std.has_bonus_point && (
                          <span className="block text-[9px] text-emerald-600 font-bold">+1 Bonus Point</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedStudentForID(std)}
                          className="px-3 py-1.5 bg-[#D4A62A] hover:bg-[#b88d1d] text-black font-extrabold rounded-lg text-xs flex items-center gap-1.5 ml-auto cursor-pointer shadow-xs transition-colors"
                        >
                          <Eye size={13} />
                          <span>View Official ID</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-500">
                        <Users size={36} className="mx-auto text-slate-400 mb-2" />
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300 block">No Matriculated Students Found</span>
                        <span className="text-xs text-slate-500 mt-1 block">When candidate applications are admitted, their student records will appear here.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SCRATCH CARDS */}
        {/* ========================================================================= */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-serif border-b pb-3 flex items-center gap-2">
                <KeyRound size={18} className="text-[#D4A62A]" />
                Generate Secure Scratch Card Batch
              </h3>

              {batchSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                  {batchSuccess}
                </div>
              )}

              <form onSubmit={handleGenerateBatch} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Card Type</label>
                  <select
                    value={batchType}
                    onChange={e => {
                      const t = e.target.value as any;
                      setBatchType(t);
                      if (t === 'APPLICATION') setBatchPrice(10500);
                      else if (t === 'RESULT_CHECKING') setBatchPrice(2500);
                      else if (t === 'ADMISSION_STATUS') setBatchPrice(2000);
                      else if (t === 'TRANSCRIPT') setBatchPrice(5000);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                  >
                    <option value="APPLICATION">Application Card (₦10,500)</option>
                    <option value="RESULT_CHECKING">Result Checking Card (₦2,500)</option>
                    <option value="ADMISSION_STATUS">Admission Status Card (₦2,000)</option>
                    <option value="TRANSCRIPT">Transcript Processing Card (₦5,000)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Batch Count</label>
                  <input
                    type="number"
                    value={batchCount}
                    onChange={e => setBatchCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Price per Card (NGN)</label>
                  <input
                    type="number"
                    value={batchPrice}
                    onChange={e => setBatchPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <button type="submit" className="py-2.5 bg-[#006B35] hover:bg-[#004D26] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors">
                  <Plus size={16} />
                  <span>Generate Batch</span>
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-serif border-b pb-3">
                Scratch Cards Inventory ({cards.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b">
                      <th className="p-3">Serial Number</th>
                      <th className="p-3">Card Type</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">PIN Hash</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {cards.map(c => (
                      <tr key={c.serial_number} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-mono font-bold text-[#006B35] dark:text-emerald-400">{c.serial_number}</td>
                        <td className="p-3 font-bold">{c.card_type}</td>
                        <td className="p-3 font-mono">₦{c.price_ngn.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            c.status === 'Active' ? 'bg-emerald-100 text-[#006B35]' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-400">e82a...910b [SHA256]</td>
                        <td className="p-3">
                          {c.status === 'Active' && (
                            <button onClick={() => handleVoidCard(c.serial_number)} className="px-2.5 py-1 bg-red-800 text-white rounded-lg text-[10px] font-bold cursor-pointer">
                              Void Card
                            </button>
                          )}
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
        {/* TAB 6: CBT QUESTION BANK */}
        {/* ========================================================================= */}
        {activeTab === 'cbt' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-serif border-b pb-3 flex items-center gap-2">
                <Monitor size={18} className="text-[#006B35]" />
                Add New Question to IJMB CBT Bank
              </h3>

              {qSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                  {qSuccess}
                </div>
              )}

              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Course Code</label>
                    <input
                      type="text"
                      required
                      value={newCourseCode}
                      onChange={e => setNewCourseCode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs uppercase font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correct Option</label>
                    <select
                      value={correctOptionIndex}
                      onChange={e => setCorrectOptionIndex(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Question Statement</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter question statement..."
                    value={newQuestionText}
                    onChange={e => setNewQuestionText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Option A" value={optionA} onChange={e => setOptionA(e.target.value)} className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs" />
                  <input type="text" placeholder="Option B" value={optionB} onChange={e => setOptionB(e.target.value)} className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs" />
                  <input type="text" placeholder="Option C" value={optionC} onChange={e => setOptionC(e.target.value)} className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs" />
                  <input type="text" placeholder="Option D" value={optionD} onChange={e => setOptionD(e.target.value)} className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs" />
                </div>

                <button type="submit" className="px-6 py-2.5 bg-[#006B35] text-white font-extrabold rounded-xl text-xs shadow-md cursor-pointer">
                  Save Question to CBT Bank
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: REGULATORY AUDIT TRAILS */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-serif border-b pb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#006B35]" />
              Immutable Administrative Audit Trails ({auditLogs.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor / Staff</th>
                    <th className="p-3">Action Event</th>
                    <th className="p-3">Details</th>
                    <th className="p-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{log.actor}</td>
                      <td className="p-3 font-bold text-[#006B35] dark:text-emerald-400 font-mono">{log.action}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{log.details}</td>
                      <td className="p-3 font-mono text-slate-400">{log.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODALS */}
      {selectedAppForSlip && (
        <RegistrationSlipModal
          isOpen={true}
          onClose={() => setSelectedAppForSlip(null)}
          application={selectedAppForSlip}
        />
      )}

      {selectedAppForLetter && (
        <AdmissionLetterModal
          isOpen={true}
          onClose={() => setSelectedAppForLetter(null)}
          applicant={selectedAppForLetter}
        />
      )}

      {selectedStudentForID && (
        <StudentIDCardModal
          isOpen={true}
          onClose={() => setSelectedStudentForID(null)}
          student={selectedStudentForID}
        />
      )}

    </PortalLayout>
  );
};
