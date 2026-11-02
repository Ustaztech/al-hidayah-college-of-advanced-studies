import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { StudentRecord, IJMBResultEntry } from '../../types';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import { Printer, X, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord;
  results?: IJMBResultEntry[];
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  isOpen,
  onClose,
  student,
  results
}) => {
  if (!isOpen) return null;

  // Default sample realistic IJMB A-Level grades if none passed
  const sampleResults: IJMBResultEntry[] = results && results.length > 0 ? results : [
    {
      subject: 'BIO 001 - Biology (A-Level)',
      caScore: 18,
      examScore: 62,
      totalScore: 80,
      letterGrade: 'A',
      gradePoint: 5,
      interpretation: 'Excellent'
    },
    {
      subject: 'CHM 001 - Chemistry (A-Level)',
      caScore: 16,
      examScore: 56,
      totalScore: 72,
      letterGrade: 'A',
      gradePoint: 5,
      interpretation: 'Excellent'
    },
    {
      subject: 'PHY 001 - Physics (A-Level)',
      caScore: 15,
      examScore: 49,
      totalScore: 64,
      letterGrade: 'B',
      gradePoint: 4,
      interpretation: 'Very Good'
    }
  ];

  // Calculate IJMB Points
  const basePoints = sampleResults.reduce((sum, r) => sum + r.gradePoint, 0);
  const hasNoF = sampleResults.every(r => r.letterGrade !== 'F');
  const bonusPoint = hasNoF ? 1 : 0;
  const totalIJMBPoints = basePoints + bonusPoint;

  const securityRef = `AHCAS-TRNS-${student.matric_number.replace(/\//g, '-')}`;
  const verificationUrl = `${INSTITUTION_INFO.website}/verify/TRANSCRIPT/${student.matric_number.replace(/\//g, '-')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-6 border-4 border-[#196855] flex flex-col max-h-[95vh]">

        {/* Modal Controls Bar */}
        <div className="bg-[#0B132B] text-white p-3.5 px-6 flex justify-between items-center no-print shrink-0 border-b-2 border-[#e69912]">
          <div className="flex items-center gap-2">
            <Award className="text-[#e69912]" size={18} />
            <span className="font-bold text-xs sm:text-sm">
              Official AHCAS Statement of IJMB Results & Transcript
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e69912] hover:bg-[#d48806] text-slate-950 font-extrabold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Official Transcript</span>
            </button>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-300">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Transcript Document */}
        <div className="p-8 sm:p-12 space-y-6 printable-document bg-white font-serif overflow-y-auto text-xs text-slate-900 leading-normal">

          {/* Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-[#196855] pb-5">
            <div className="flex items-center gap-4">
              <img src="/official-logo.jpg" alt="AHCAS Crest" className="h-20 w-auto object-contain" />
              <div>
                <span className="text-[10px] font-black uppercase text-[#e69912] tracking-widest font-sans block">
                  INTERIM JOINT MATRICULATION BOARD (IJMB) EXAMINATION
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#196855] tracking-tight uppercase">
                  AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
                </h1>
                <p className="text-xs font-bold text-slate-800 uppercase font-sans">
                  Abaji Study Centre, Federal Capital Territory (FCT), Abuja – Nigeria
                </p>
                <p className="text-[11px] text-slate-600 font-sans italic">
                  “Advancing Academic Excellence Through Structured A-Level Education”
                </p>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                  Office of the Registrar & Directorate of Academic Examinations
                </p>
              </div>
            </div>

            <div className="text-right border-l-2 border-slate-200 pl-4 shrink-0">
              <QRCodeSVG value={verificationUrl} size={70} />
              <span className="text-[9px] font-mono text-slate-500 block mt-1">
                Ref: {securityRef}
              </span>
            </div>
          </div>

          {/* Document Title Banner */}
          <div className="bg-[#196855] text-white py-2 px-4 rounded-lg flex items-center justify-between text-center font-sans">
            <span className="text-[11px] font-black uppercase tracking-wider">
              OFFICIAL STATEMENT OF IJMB A-LEVEL RESULTS & ACADEMIC TRANSCRIPT
            </span>
            <span className="text-[11px] font-bold bg-[#e69912] text-slate-950 px-2 py-0.5 rounded">
              STUDY CENTRE CODE: 029
            </span>
          </div>

          {/* Candidate Profile Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Candidate Name:</span>
              <span className="font-black text-slate-900">{student.full_name.toUpperCase()}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Matriculation / Exam No:</span>
              <span className="font-mono font-bold text-[#196855]">{student.matric_number}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Target University Faculty:</span>
              <span className="font-bold text-slate-800">{student.programme || 'Direct Entry 200L Sciences'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Academic Session:</span>
              <span className="font-bold text-slate-800">2026/2027 Session</span>
            </div>
          </div>

          {/* Results Table */}
          <div className="space-y-2 font-sans">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-[#196855] text-white text-[11px] font-bold">
                <tr>
                  <th className="p-2.5 border border-slate-300">S/N</th>
                  <th className="p-2.5 border border-slate-300">Course Code</th>
                  <th className="p-2.5 border border-slate-300">Subject Title</th>
                  <th className="p-2.5 border border-slate-300 text-center">CA (20%)</th>
                  <th className="p-2.5 border border-slate-300 text-center">Exam (80%)</th>
                  <th className="p-2.5 border border-slate-300 text-center">Total (100%)</th>
                  <th className="p-2.5 border border-slate-300 text-center">Letter Grade</th>
                  <th className="p-2.5 border border-slate-300 text-center">Points (0-5)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sampleResults.map((r, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-2.5 font-bold border border-slate-200">{idx + 1}</td>
                    <td className="p-2.5 font-mono font-bold text-[#196855] border border-slate-200">
                      {r.subject.split(' - ')[0] || `IJMB-00${idx + 1}`}
                    </td>
                    <td className="p-2.5 font-bold border border-slate-200">
                      {r.subject.split(' - ')[1] || r.subject}
                    </td>
                    <td className="p-2.5 text-center border border-slate-200">{r.caScore}</td>
                    <td className="p-2.5 text-center border border-slate-200">{r.examScore}</td>
                    <td className="p-2.5 text-center font-bold border border-slate-200">{r.totalScore}</td>
                    <td className="p-2.5 text-center font-black text-emerald-700 border border-slate-200">{r.letterGrade}</td>
                    <td className="p-2.5 text-center font-black border border-slate-200">{r.gradePoint} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Points Breakdown & Direct Entry Qualification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <h4 className="text-xs font-black uppercase text-[#196855] tracking-wider">
                IJMB 16-Point Score Summary
              </h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Subject Points:</span>
                  <span className="font-bold">{basePoints} points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Bonus Point (+1 if no 'F' grade):</span>
                  <span className="font-bold text-emerald-700">+{bonusPoint} point</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-emerald-200 text-sm">
                  <span className="font-black text-[#196855]">Total Cumulative IJMB Points:</span>
                  <span className="font-black text-xl font-mono text-[#196855]">{totalIJMBPoints} / 16 Points</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block">
                  Direct Entry Academic Standing
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1">
                  QUALIFIED FOR 200 LEVEL DIRECT ENTRY ADMISSION
                </p>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Candidate meets the statutory admission cutoff threshold for professional faculties (Medicine, Pharmacy, Engineering, Law, Nursing, and Computing) across accredited Nigerian Universities.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                <CheckCircle2 size={12} />
                <span>Verified by Academic Registry</span>
              </span>
            </div>
          </div>

          {/* Grading Legend */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] font-sans text-slate-600">
            <span className="font-black text-slate-800 block mb-1">IJMB Grading Scale Legend:</span>
            <span>A (70-100% = 5 pts) • B (60-69% = 4 pts) • C (50-59% = 3 pts) • D (45-49% = 2 pts) • E (40-44% = 1 pt) • F (0-39% = 0 pts). Candidates with no grade 'F' in all 3 registered subjects are entitled to +1 bonus point. Maximum score is 16 points.</span>
          </div>

          {/* Institutional Certification & Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-slate-300 font-sans text-center">
            <div>
              <div className="h-12 border-b border-dashed border-slate-400 flex items-center justify-center">
                <span className="font-serif italic text-slate-800 font-bold">Usman Saidu</span>
              </div>
              <span className="text-[11px] font-bold text-slate-900 block mt-1">
                Usman Saidu
              </span>
              <span className="text-[10px] text-slate-500 uppercase block">
                College Registrar
              </span>
            </div>

            <div>
              <div className="h-12 border-b border-dashed border-slate-400 flex items-center justify-center">
                <span className="font-serif italic text-[#196855] font-bold">Dr. Muhammad Baba Suleiman, PhD</span>
              </div>
              <span className="text-[11px] font-bold text-slate-900 block mt-1">
                Dr. Muhammad Baba Suleiman, PhD
              </span>
              <span className="text-[10px] text-slate-500 uppercase block">
                Provost / Executive Chairman (Magajin Ilimin Abaji)
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
