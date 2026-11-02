import React, { useState, useEffect } from 'react';
import {
  CBT_SUBJECTS,
  CBTSubject
} from '../../data/cbtQuestions';
import { CBTQuestion } from '../../types';
import { db } from '../../services/db';
import { logAuditEvent } from '../../services/audit';
import { sendNotification } from '../../services/notifications';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Award,
  Layers,
  Calculator,
  Compass,
  ArrowRight
} from 'lucide-react';

interface CBTMockCenterProps {
  studentName?: string;
  matricNumber?: string;
}

export const CBTMockCenter: React.FC<CBTMockCenterProps> = ({
  studentName = 'AHCAS Student',
  matricNumber = 'AHCAS/2026/IJMB/004'
}) => {
  // Navigation & Mode
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');
  const [activeSubject, setActiveSubject] = useState<CBTSubject | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Exam Questions & State
  const [questions, setQuestions] = useState<CBTQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  // Scientific Calculator Tool Toggle
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcInput, setCalcInput] = useState('');

  // Start Exam
  const handleStartExam = (subject: CBTSubject) => {
    setActiveSubject(subject);
    const loadedQuestions = db.getCBTQuestions(subject.code);
    setQuestions(loadedQuestions.length > 0 ? loadedQuestions : db.getCBTQuestions());
    setCurrentIdx(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeLeft(subject.durationMinutes * 60);
    setTimeSpentSeconds(0);
    setExamStarted(true);
    setExamSubmitted(false);

    logAuditEvent(
      studentName,
      'STUDENT',
      'CBT_EXAM_STARTED',
      `Commenced timed CBT examination for ${subject.name} (${subject.code})`
    );
  };

  // Timer Effect
  useEffect(() => {
    if (!examStarted || examSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpentSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [examStarted, examSubmitted]);

  // Answer selection
  const handleSelectOption = (optionIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [currentIdx]: optionIdx }));
  };

  // Flag toggle
  const handleToggleFlag = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentIdx]: !prev[currentIdx]
    }));
  };

  // Submit Exam
  const handleSubmitExam = () => {
    setExamSubmitted(true);

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_option) {
        correctCount++;
      }
    });

    const percent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    logAuditEvent(
      studentName,
      'STUDENT',
      'CBT_EXAM_SUBMITTED',
      `Completed CBT mock for ${activeSubject?.name}: Scored ${percent}% (${correctCount}/${questions.length}) in ${Math.round(timeSpentSeconds / 60)} mins`
    );

    sendNotification({
      recipient_id: matricNumber,
      recipient_role: 'STUDENT',
      title: 'CBT Examination Result Published',
      message: `Your CBT mock test for ${activeSubject?.name} has been graded: ${percent}% (${correctCount}/${questions.length}). Check the review tab for rationales.`,
      type: 'ACADEMIC'
    });
  };

  // Calculation of Results
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  let scoreCount = 0;
  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correct_option) {
      scoreCount++;
    }
  });
  const scorePercent = totalQuestions > 0 ? Math.round((scoreCount / totalQuestions) * 100) : 0;

  // Grade estimation on IJMB scale
  let ijmbGrade = 'F';
  let ijmbPoints = 0;
  if (scorePercent >= 70) { ijmbGrade = 'A'; ijmbPoints = 5; }
  else if (scorePercent >= 60) { ijmbGrade = 'B'; ijmbPoints = 4; }
  else if (scorePercent >= 50) { ijmbGrade = 'C'; ijmbPoints = 3; }
  else if (scorePercent >= 45) { ijmbGrade = 'D'; ijmbPoints = 2; }
  else if (scorePercent >= 40) { ijmbGrade = 'E'; ijmbPoints = 1; }

  // Filtered Subject List
  const filteredSubjects = CBT_SUBJECTS.filter(s =>
    selectedFaculty === 'ALL' || s.faculty === selectedFaculty
  );

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ========================================================================= */}
      {/* 1. SUBJECT SELECTION SCREEN (When Not in Active Exam) */}
      {/* ========================================================================= */}
      {!examStarted && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#196855] to-[#124d3f] text-white p-6 sm:p-8 rounded-3xl border-b-4 border-[#e69912] shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-[#e69912] text-slate-950 font-black text-xs uppercase tracking-wider rounded-full">
                Interactive IJMB CBT Examination Centre
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-serif">
                A-Level Mock Tests & Continuous Assessments
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                Select your registered IJMB principal subjects to practice simulated computer-based tests with real-time scoring, instant explanations, and 16-point scale evaluation.
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/20 text-center shrink-0">
              <span className="text-[10px] text-amber-300 uppercase font-black block">Available Question Bank</span>
              <span className="text-2xl font-black font-mono">100+</span>
              <span className="text-[10px] text-emerald-200 block">Across 10 Subjects</span>
            </div>
          </div>

          {/* Faculty Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Faculty:</span>
            {['ALL', 'Sciences', 'Arts & Humanities', 'Social Sciences & Management'].map(fac => (
              <button
                key={fac}
                onClick={() => setSelectedFaculty(fac)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFaculty === fac
                    ? 'bg-[#196855] text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {fac === 'ALL' ? 'All Subjects' : fac}
              </button>
            ))}
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map(sub => (
              <div
                key={sub.code}
                className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#196855] hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-mono font-bold text-[#196855] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                      {sub.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {sub.faculty}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                      {sub.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Layers size={13} />
                        <span>{sub.questionCount} Questions</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        <span>{sub.durationMinutes} Minutes</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                  <button
                    onClick={() => handleStartExam(sub)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#196855] hover:bg-[#124d3f] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <span>Launch CBT Test</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LIVE TIMED CBT TEST ENVIRONMENT */}
      {/* ========================================================================= */}
      {examStarted && !examSubmitted && activeSubject && (
        <div className="space-y-6">

          {/* Test Control Header */}
          <div className="bg-[#196855] text-white p-4 sm:p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4 shadow-md">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-300 block">
                {activeSubject.code} • IJMB COMPUTER-BASED ASSESSMENT
              </span>
              <h3 className="text-lg font-bold font-serif">
                {activeSubject.name}
              </h3>
            </div>

            {/* Live Countdown Clock */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setCalcOpen(!calcOpen)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calculator size={15} />
                <span className="hidden sm:inline">Calculator</span>
              </button>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm shadow-inner ${
                timeLeft < 180 ? 'bg-rose-600 text-white animate-pulse' : 'bg-black/30 text-amber-300'
              }`}>
                <Clock size={16} />
                <span>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-4 py-2 bg-[#e69912] hover:bg-[#d48806] text-slate-950 font-black text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Optional Scientific Calculator Widget */}
          {calcOpen && (
            <div className="p-4 bg-slate-800 text-white rounded-2xl border border-slate-700 shadow-xl max-w-sm mx-auto space-y-3">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-xs font-bold flex items-center gap-1.5 text-amber-300">
                  <Calculator size={14} />
                  <span>AHCAS On-Screen Calculator</span>
                </span>
                <button onClick={() => setCalcOpen(false)} className="text-slate-400 hover:text-white text-xs">Close</button>
              </div>
              <input
                type="text"
                value={calcInput}
                onChange={e => setCalcInput(e.target.value)}
                placeholder="Type expression (e.g. 15 * 8.5)"
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-right font-mono text-sm text-emerald-400"
              />
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono font-bold">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === '=') {
                        try {
                          // Safe mathematical evaluation for simple expressions
                          const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '');
                          // eslint-disable-next-line no-eval
                          const res = Function(`"use strict"; return (${sanitized})`)();
                          setCalcInput(String(res));
                        } catch {
                          setCalcInput('Error');
                        }
                      } else {
                        setCalcInput(prev => prev + btn);
                      }
                    }}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-center cursor-pointer"
                  >
                    {btn}
                  </button>
                ))}
                <button onClick={() => setCalcInput('')} className="col-span-4 p-1.5 bg-rose-900/60 hover:bg-rose-800 text-white rounded-lg text-center">Clear</button>
              </div>
            </div>
          )}

          {/* Main Question Display & Answer Options */}
          {questions[currentIdx] && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

              {/* Question Body (3 Cols) */}
              <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                  <span className="text-xs font-bold text-[#196855] dark:text-emerald-400 font-mono">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleFlag}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      flaggedQuestions[currentIdx]
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Bookmark size={13} />
                    <span>{flaggedQuestions[currentIdx] ? 'Flagged for Review' : 'Flag Question'}</span>
                  </button>
                </div>

                <div className="text-base sm:text-lg font-serif text-slate-900 dark:text-white leading-relaxed">
                  {questions[currentIdx].question}
                </div>

                {/* Option Radio Cards */}
                <div className="space-y-3 pt-2">
                  {questions[currentIdx].options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-sans flex items-center gap-4 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-[#196855] text-slate-900 dark:text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-[#196855] text-white'
                            : 'bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Question Bottom Navigation */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                    className="flex items-center gap-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    disabled={currentIdx === questions.length - 1}
                    onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-1 px-4 py-2 bg-[#196855] hover:bg-[#124d3f] text-white rounded-xl text-xs font-bold disabled:opacity-30 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Question Palette Sidebar (1 Col) */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 block border-b border-slate-100 dark:border-slate-700 pb-2">
                  Question Palette
                </span>

                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, idx) => {
                    const isAnswered = userAnswers[idx] !== undefined;
                    const isFlagged = flaggedQuestions[idx];
                    const isCurrent = currentIdx === idx;

                    let btnClass = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200';
                    if (isAnswered) {
                      btnClass = 'bg-emerald-600 text-white';
                    }
                    if (isFlagged) {
                      btnClass = 'bg-amber-500 text-white';
                    }
                    if (isCurrent) {
                      btnClass += ' ring-2 ring-blue-500 ring-offset-2';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-9 rounded-xl font-bold font-mono text-xs transition-all cursor-pointer ${btnClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-emerald-600 inline-block" />
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-amber-500 inline-block" />
                    <span>Flagged for Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-slate-100 border inline-block" />
                    <span>Unanswered ({totalQuestions - answeredCount})</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PERFORMANCE REPORT & STEP-BY-STEP REVIEW SCREEN */}
      {/* ========================================================================= */}
      {examSubmitted && activeSubject && (
        <div className="space-y-6">

          {/* Result Banner */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-[#196855] dark:text-emerald-300 rounded-full text-xs font-black uppercase">
              <CheckCircle2 size={16} />
              <span>CBT Mock Examination Completed</span>
            </div>

            <h2 className="text-3xl font-black font-serif text-slate-900 dark:text-white">
              {activeSubject.name} Assessment Report
            </h2>

            {/* Score Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-slate-200 dark:border-slate-600">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Percentage</span>
                <span className="text-3xl font-black font-mono text-[#196855] dark:text-emerald-400">
                  {scorePercent}%
                </span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-slate-200 dark:border-slate-600">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Correct Answers</span>
                <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {scoreCount} / {totalQuestions}
                </span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-slate-200 dark:border-slate-600">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Estimated IJMB Grade</span>
                <span className="text-3xl font-black font-serif text-amber-600">
                  Grade {ijmbGrade}
                </span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-slate-200 dark:border-slate-600">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Subject Points</span>
                <span className="text-3xl font-black font-mono text-purple-600">
                  {ijmbPoints} pts
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => handleStartExam(activeSubject)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#196855] hover:bg-[#124d3f] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <RotateCcw size={14} />
                <span>Retake This Subject</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <Printer size={14} />
                <span>Print Performance Slip</span>
              </button>

              <button
                type="button"
                onClick={() => setExamStarted(false)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <Compass size={14} />
                <span>Select Another Subject</span>
              </button>
            </div>
          </div>

          {/* Question-by-Question Review with Rationales */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
              Question-by-Question Academic Rationales
            </h3>

            {questions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correct_option;

              return (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <span className="text-xs font-black font-mono text-slate-500">
                      Question {idx + 1}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isCorrect ? 'Correct' : userAns === undefined ? 'Unattempted' : 'Incorrect'}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                    {q.question}
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isOptionSelected = userAns === oIdx;
                      const isOptionCorrect = q.correct_option === oIdx;

                      let optClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                      if (isOptionCorrect) {
                        optClass = 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-400 text-emerald-950 dark:text-emerald-100 font-bold';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        optClass = 'bg-rose-100 dark:bg-rose-900/60 border-rose-400 text-rose-950 dark:text-rose-100 font-bold';
                      }

                      return (
                        <div key={oIdx} className={`p-2.5 rounded-xl border flex items-center gap-2 ${optClass}`}>
                          <span className="w-5 h-5 rounded-md bg-black/10 flex items-center justify-center font-bold text-[10px]">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Academic Explanation */}
                  {q.explanation && (
                    <div className="mt-3 p-3 bg-white/70 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-white font-sans">Official Explanation: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
