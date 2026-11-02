import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { db, calculateIJMBGrade } from '../../services/db';
import { logAuditEvent } from '../../services/audit';
import { StudentRecord, CBTQuestion } from '../../types';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import {
  Award,
  BookOpen,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Printer,
  Search,
  ShieldCheck,
  BrainCircuit,
  Sliders,
  Sparkles
} from 'lucide-react';

export const ExaminationsWorkspace: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { addNotification } = useNotifications();

  // State
  const [students, setStudents] = useState<StudentRecord[]>(() => db.getStudents());
  const [questions, setQuestions] = useState<CBTQuestion[]>(() => db.getCBTQuestions());
  const [activeTab, setActiveTab] = useState<'grading' | 'broadsheet' | 'cbtBank'>('grading');

  // Active Grading Student
  const [selectedStudentMatric, setSelectedStudentMatric] = useState<string>(() => students[0]?.matric_number || '');
  const activeStudent = students.find(s => s.matric_number === selectedStudentMatric) || students[0];

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

  // CBT Question Form State
  const [newCourseCode, setNewCourseCode] = useState('IJMB-PHY');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [qSuccess, setQSuccess] = useState('');

  // Handle Score Updates
  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;

    const subjects = activeStudent.subject_combination || ['Subject 1', 'Subject 2', 'Subject 3'];

    const payload = subjects.map((sub, idx) => ({
      subject: sub,
      caScore: Number(caScores[`sub${idx}`] ?? 15),
      examScore: Number(examScores[`sub${idx}`] ?? 50)
    }));

    db.updateStudentResults(activeStudent.matric_number, payload);
    setStudents(db.getStudents());

    logAuditEvent(
      currentUser?.name || 'Examination Officer',
      role,
      'RESULTS_UPLOADED',
      `Computed and certified IJMB Statement of Results for ${activeStudent.full_name} (${activeStudent.matric_number}).`
    );

    addNotification({
      target_role: 'STUDENT',
      title: 'Examination Result Approved & Computed',
      message: `${activeStudent.full_name} (${activeStudent.matric_number}) statement of results certified.`,
      category: 'Examinations',
      priority: 'high',
      action_url: '/student/dashboard'
    });

    setGradingSuccess(`Result computation successful! ${activeStudent.full_name}'s statement of results certified.`);
    setTimeout(() => setGradingSuccess(''), 4500);
  };

  // CBT Question Handlers
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !optionA || !optionB) return;

    db.addCBTQuestion({
      course_code: newCourseCode,
      question: newQuestionText,
      options: [optionA, optionB, optionC || 'Option C', optionD || 'Option D'].filter(Boolean),
      correct_option: Number(correctOptionIndex)
    });

    setQuestions(db.getCBTQuestions());

    logAuditEvent(
      currentUser?.name || 'Examination Officer',
      role,
      'QUESTION_ADDED',
      `Added CBT examination question for ${newCourseCode}.`
    );

    setQSuccess('CBT Examination Question successfully added to bank!');
    setNewQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setTimeout(() => setQSuccess(''), 3000);
  };

  return (
    <PortalLayout activeNav="Examinations" portalTitle="AHCAS Directorate of Examinations & CBT Secretariat">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>Examination Officer</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-2">
              {INSTITUTION_INFO.examOfficer}
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              Accredited IJMB Assessment Desk
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>IJMB Grading Standard</span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              16-Point Scale
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              A=5, B=4, C=3, D=2, E=1, F=0 (+1 Bonus Point)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>CBT Question Pool</span>
              <BrainCircuit className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {questions.length} Items
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Across Science, Arts & Management
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'grading', label: 'Continuous Assessment & Exam Grading', icon: Award },
            { id: 'broadsheet', label: 'Academic Board Master Broadsheet', icon: FileSpreadsheet },
            { id: 'cbtBank', label: 'CBT Examination Question Bank', icon: BrainCircuit }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: CA & Exam Score Entry */}
        {activeTab === 'grading' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                Direct Entry Score Entry & IJMB 16-Point Computation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Examination Directorate Grading Desk. CA is evaluated out of 20; Examination is evaluated out of 80.
              </p>
            </div>

            {gradingSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{gradingSuccess}</span>
              </div>
            )}

            <div className="max-w-md">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Candidate
              </label>
              <select
                value={selectedStudentMatric}
                onChange={(e) => setSelectedStudentMatric(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                {students.map(s => (
                  <option key={s.matric_number} value={s.matric_number}>
                    {s.matric_number} - {s.full_name} ({s.department})
                  </option>
                ))}
              </select>
            </div>

            {activeStudent && (
              <form onSubmit={handleScoreSubmit} className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="text-xs text-slate-500">Candidate Information</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeStudent.full_name} ({activeStudent.matric_number})
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Faculty: <strong>{activeStudent.department}</strong> • Combination: <strong className="font-mono">{activeStudent.subject_combination?.join(', ') || 'Biology, Chemistry, Physics'}</strong>
                  </div>
                </div>

                <div className="space-y-4">
                  {(activeStudent.subject_combination || ['Biology', 'Chemistry', 'Physics']).map((sub: string, idx: number) => {
                    const key = `sub${idx}`;
                    const ca = caScores[key] || 0;
                    const exam = examScores[key] || 0;
                    const gradeCalc = calculateIJMBGrade(ca, exam);

                    return (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                        <div className="sm:col-span-2">
                          <div className="text-xs text-slate-500 uppercase font-semibold">Subject #{idx + 1}</div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{sub}</div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                            CA Score (Max 20)
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={ca}
                            onChange={(e) => setCaScores({ ...caScores, [key]: Number(e.target.value) })}
                            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                            Exam Score (Max 80)
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={80}
                            value={exam}
                            onChange={(e) => setExamScores({ ...examScores, [key]: Number(e.target.value) })}
                            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                            required
                          />
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-slate-500">Total & Grade</div>
                          <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                            {gradeCalc.total}/100 ({gradeCalc.grade} - {gradeCalc.points} Pts)
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" /> Compute & Publish IJMB Official Result
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Academic Board Master Broadsheet */}
        {activeTab === 'broadsheet' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                  Official Academic Board Examination Broadsheet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Moderated result broadsheet for the 2025/2026 IJMB Direct Entry session.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Export / Print Broadsheet
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    <th className="py-3 px-3">Matric No</th>
                    <th className="py-3 px-3">Candidate Name</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Subject 1</th>
                    <th className="py-3 px-3">Subject 2</th>
                    <th className="py-3 px-3">Subject 3</th>
                    <th className="py-3 px-3 text-center">Bonus Point</th>
                    <th className="py-3 px-3 text-center">Total Points</th>
                    <th className="py-3 px-3 text-right">Academic Board Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students.map((s) => {
                    const subs = s.ijmb_results || [];
                    const hasPassedAll = subs.length === 3 && subs.every((sub: any) => sub.letterGrade !== 'F');
                    const totalPts = s.cumulative_grade_points || 0;

                    return (
                      <tr key={s.matric_number} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {s.matric_number}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                          {s.full_name}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                          {s.department}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {subs[0] ? `${subs[0].subject}: ${subs[0].totalScore} (${subs[0].letterGrade})` : '—'}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {subs[1] ? `${subs[1].subject}: ${subs[1].totalScore} (${subs[1].letterGrade})` : '—'}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {subs[2] ? `${subs[2].subject}: ${subs[2].totalScore} (${subs[2].letterGrade})` : '—'}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-600">
                          {hasPassedAll ? '+1 Point' : '0'}
                        </td>
                        <td className="py-3 px-3 text-center font-extrabold text-sm text-slate-900 dark:text-white">
                          {totalPts} / 16
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            totalPts >= 5
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {totalPts >= 5 ? 'PASSED & CERTIFIED' : 'PENDING REMEDIATION'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: CBT Question Bank */}
        {activeTab === 'cbtBank' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                Author & Deploy Computer-Based Testing (CBT) Questions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create verified examination and continuous assessment questions for student online assessment tests.
              </p>

              {qSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  {qSuccess}
                </div>
              )}

              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Course / Discipline Code
                    </label>
                    <select
                      value={newCourseCode}
                      onChange={(e) => setNewCourseCode(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    >
                      <option value="IJMB-PHY">IJMB-PHY (Advanced Physics)</option>
                      <option value="IJMB-CHM">IJMB-CHM (Advanced Chemistry)</option>
                      <option value="IJMB-BIO">IJMB-BIO (Advanced Biology)</option>
                      <option value="IJMB-MTH">IJMB-MTH (Pure & Applied Mathematics)</option>
                      <option value="IJMB-ECN">IJMB-ECN (Advanced Economics)</option>
                      <option value="IJMB-GOV">IJMB-GOV (Government & Political Science)</option>
                      <option value="IJMB-LIT">IJMB-LIT (Literature in English)</option>
                      <option value="IJMB-ACC">IJMB-ACC (Principles of Accounting)</option>
                      <option value="IJMB-BUS">IJMB-BUS (Business Management)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Designated Correct Option
                    </label>
                    <select
                      value={correctOptionIndex}
                      onChange={(e) => setCorrectOptionIndex(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Question Stem
                  </label>
                  <textarea
                    rows={2}
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Enter examination question text here..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Option A
                    </label>
                    <input
                      type="text"
                      value={optionA}
                      onChange={(e) => setOptionA(e.target.value)}
                      placeholder="Enter option A..."
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Option B
                    </label>
                    <input
                      type="text"
                      value={optionB}
                      onChange={(e) => setOptionB(e.target.value)}
                      placeholder="Enter option B..."
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Option C
                    </label>
                    <input
                      type="text"
                      value={optionC}
                      onChange={(e) => setOptionC(e.target.value)}
                      placeholder="Enter option C..."
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Option D
                    </label>
                    <input
                      type="text"
                      value={optionD}
                      onChange={(e) => setOptionD(e.target.value)}
                      placeholder="Enter option D..."
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save Question to CBT Pool
                </button>
              </form>
            </div>

            {/* List of Questions */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Examination Questions Pool ({questions.length} Items)</h4>
              <div className="space-y-3">
                {questions.map((q) => (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold">
                        {q.course_code}
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{q.question}</div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                        {q.options.map((opt: string, oIdx: number) => (
                          <div key={oIdx} className={oIdx === q.correct_option ? 'text-emerald-600 font-bold' : ''}>
                            {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correct_option ? '(Correct)' : ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};
export default ExaminationsWorkspace;
