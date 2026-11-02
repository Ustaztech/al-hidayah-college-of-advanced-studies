import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { StudentRecord } from '../../types';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import { Printer, X, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

interface ExamPhotocardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord;
}

export const ExamPhotocardModal: React.FC<ExamPhotocardModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  if (!isOpen) return null;

  const securityRef = `AHCAS-EXM-${student.matric_number.replace(/\//g, '-')}`;
  const verificationUrl = `${INSTITUTION_INFO.website}/verify/EXAM_PHOTOCARD/${student.matric_number.replace(/\//g, '-')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-6 border-4 border-[#196855] flex flex-col max-h-[95vh]">

        {/* Modal Controls Bar */}
        <div className="bg-[#0B132B] text-white p-3.5 px-6 flex justify-between items-center no-print shrink-0 border-b-2 border-[#e69912]">
          <div className="flex items-center gap-2">
            <Award className="text-[#e69912]" size={18} />
            <span className="font-bold text-xs sm:text-sm">
              Official IJMB Examination Clearance Photocard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e69912] hover:bg-[#d48806] text-slate-950 font-extrabold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Examination Slip</span>
            </button>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-300">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Examination Photocard */}
        <div className="p-8 sm:p-10 space-y-6 printable-document bg-white font-serif overflow-y-auto text-xs text-slate-900 leading-normal">

          {/* Institutional Top Crest & Header */}
          <div className="flex items-center justify-between border-b-2 border-[#196855] pb-4">
            <div className="flex items-center gap-4">
              <img src="/official-logo.jpg" alt="AHCAS Crest" className="h-20 w-auto object-contain" />
              <div>
                <span className="text-[10px] font-black uppercase text-[#e69912] tracking-widest font-sans block">
                  INTERIM JOINT MATRICULATION BOARD (IJMB) EXAMINATION
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#196855] uppercase tracking-tight">
                  AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
                </h1>
                <p className="text-xs font-bold text-slate-800 uppercase font-sans">
                  Approved IJMB Examination Study Centre 029 • Abaji, FCT-Abuja
                </p>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                  Administrative Secretariat: No. 3 Bungalow, MBS Close, Sabon Tasha Phase II, Abaji, FCT
                </p>
              </div>
            </div>

            <div className="text-right border-l-2 border-slate-200 pl-4 shrink-0">
              <QRCodeSVG value={verificationUrl} size={70} />
              <span className="text-[9px] font-mono text-slate-500 block mt-1">
                Security ID: {securityRef}
              </span>
            </div>
          </div>

          {/* Document Title Banner */}
          <div className="bg-[#196855] text-white py-2 px-4 rounded-lg flex items-center justify-between text-center font-sans">
            <span className="text-[11px] font-black uppercase tracking-wider">
              2026/2027 CANDIDATE EXAMINATION PHOTOCARD & ADMISSION DOCKET
            </span>
            <span className="text-[11px] font-bold bg-[#e69912] text-slate-950 px-2 py-0.5 rounded">
              CENTRE CODE: 029 (ABAJI)
            </span>
          </div>

          {/* Candidate Profile Details & Passport Photo */}
          <div className="grid grid-cols-4 gap-6 items-start bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans">
            <div className="col-span-3 grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Candidate Full Name:</span>
                <span className="font-black text-slate-900 text-sm">{student.full_name.toUpperCase()}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">IJMB Examination Number:</span>
                <span className="font-mono font-black text-[#196855] text-sm">{student.matric_number}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Academic Faculty / Discipline:</span>
                <span className="font-bold text-slate-800">{student.programme || 'IJMB A-Level Sciences'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Assigned Study Centre:</span>
                <span className="font-bold text-slate-800">{student.study_centre || 'JSS Agyana Road Centre'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Session / Semester:</span>
                <span className="font-bold text-slate-800">2026/2027 Academic Session (Semester II)</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Bursary Clearance Status:</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700">
                  <CheckCircle2 size={13} />
                  <span>Tuition Fully Cleared (₦258,500 Reconciled)</span>
                </span>
              </div>
            </div>

            {/* Candidate Photo */}
            <div className="col-span-1 flex flex-col items-center justify-center text-center">
              <div className="w-28 h-32 border-2 border-[#196855] rounded-lg overflow-hidden bg-white shadow-sm p-1 relative">
                <img
                  src={student.passport_photo || '/assets/images/coordinator-ibrahim-gambo.jpg'}
                  alt={student.full_name}
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute bottom-1 left-1 right-1 bg-[#196855]/90 text-[8px] text-white font-mono uppercase tracking-wider py-0.5">
                  AHCAS VERIFIED
                </div>
              </div>
              <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Official Passport</span>
            </div>
          </div>

          {/* Registered IJMB Principal Subjects & Papers */}
          <div className="space-y-2 font-sans">
            <h3 className="text-xs font-black uppercase text-[#196855] tracking-wider border-b border-slate-200 pb-1">
              Registered Principal Subjects & Examination Papers
            </h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-[#196855] text-white text-[11px] font-bold">
                <tr>
                  <th className="p-2 border border-slate-300">S/N</th>
                  <th className="p-2 border border-slate-300">Course Code</th>
                  <th className="p-2 border border-slate-300">Subject Title</th>
                  <th className="p-2 border border-slate-300">Registered Papers</th>
                  <th className="p-2 border border-slate-300 text-center">Continuous Assessment (CA 20%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(student.subject_combination && student.subject_combination.length > 0
                  ? student.subject_combination
                  : ['BIO 001 - Biology', 'CHM 001 - Chemistry', 'PHY 001 - Physics']
                ).map((course: string, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-2 font-bold border border-slate-200">{idx + 1}</td>
                    <td className="p-2 font-mono font-bold text-[#196855] border border-slate-200">
                      {course.split(' - ')[0] || `IJMB-00${idx + 1}`}
                    </td>
                    <td className="p-2 font-bold border border-slate-200">
                      {course.split(' - ')[1] || course}
                    </td>
                    <td className="p-2 border border-slate-200 text-slate-700">
                      Paper I (Objective), Paper II (Essay), Paper III (Practical)
                    </td>
                    <td className="p-2 border border-slate-200 text-center font-bold text-emerald-700">
                      18.5 / 20 (Approved)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statutory Examination Hall Regulations */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] space-y-1 font-sans text-slate-700">
            <h4 className="font-black text-slate-900 uppercase">Statutory Examination Directives:</h4>
            <ol className="list-decimal pl-4 space-y-0.5">
              <li>Candidates must arrive at the examination venue at least 30 minutes before commencement.</li>
              <li>This clearance photocard and student identity card must be displayed on the candidate desk at all times.</li>
              <li>Mobile phones, programmable smartwatches, and unauthorized electronics are strictly prohibited inside the hall.</li>
              <li>Candidates must not leave the examination hall within the first 45 minutes or during the last 15 minutes of the session.</li>
            </ol>
          </div>

          {/* Signatures & Certification Block */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t-2 border-slate-300 font-sans text-center">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center">
                <span className="font-serif italic text-slate-600 font-bold">{student.full_name}</span>
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-600 block mt-1">
                Candidate Signature & Date
              </span>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center">
                <span className="font-serif italic text-[#196855] font-bold">Mall. Ibrahim Idris Gambo</span>
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-600 block mt-1">
                Centre Coordinator / Registry
              </span>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center">
                <span className="font-mono text-slate-400 text-[10px]">Verification Stamp</span>
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-600 block mt-1">
                Chief Invigilator Sign-Off
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
