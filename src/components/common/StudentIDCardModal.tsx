import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { StudentRecord } from '../../types';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import { Printer, X, Shield, Award } from 'lucide-react';

interface StudentIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  if (!isOpen) return null;

  const verificationUrl = `${INSTITUTION_INFO.website}/verify/student?matric=${encodeURIComponent(student.matric_number)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white text-slate-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border-2 border-emerald-800">
        
        {/* Header Bar */}
        <div className="bg-[#0B132B] text-white p-3 px-5 flex justify-between items-center no-print border-b-2 border-[#D4A62A]">
          <div className="flex items-center gap-2">
            <Award className="text-[#D4A62A]" size={18} />
            <span className="font-bold text-xs sm:text-sm">Official Digital Student Identity Card</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 px-3 py-1 bg-[#D4A62A] text-black font-extrabold rounded-lg text-xs hover:bg-[#b88d1d] shadow-xs cursor-pointer"
            >
              <Printer size={13} />
              <span>Print ID Card</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Dual-Sided ID Card Container */}
        <div className="p-6 bg-slate-100 dark:bg-slate-900 space-y-6 flex flex-col items-center printable-document">
          
          {/* Front Side Card */}
          <div className="w-[340px] h-[215px] bg-gradient-to-br from-[#006B35] via-[#004D26] to-[#0B132B] text-white rounded-2xl shadow-xl p-4 flex flex-col justify-between relative border-2 border-[#D4A62A] overflow-hidden">
            
            {/* Header branding */}
            <div className="flex items-center gap-2 border-b border-emerald-600/60 pb-2">
              <img src="/official-logo.jpg" alt="Official Logo" className="h-9 w-auto bg-white p-0.5 rounded-lg shadow-xs" />
              <div>
                <span className="font-black text-xs tracking-wider block font-serif leading-none text-white">
                  AL-HIDAYAH COLLEGE
                </span>
                <span className="text-[8px] text-amber-300 uppercase tracking-widest font-sans font-bold">
                  OF ADVANCED STUDIES, ABAJI
                </span>
              </div>
              <span className="ml-auto text-[7px] bg-[#D4A62A] text-black font-black px-1.5 py-0.5 rounded uppercase">
                STUDENT
              </span>
            </div>

            {/* Card Content */}
            <div className="flex items-center gap-3 my-1">
              <img
                src={student.passport_photo || '/provost-mbsuleiman.jpg'}
                alt={student.full_name}
                className="w-16 h-20 object-cover rounded-xl border-2 border-[#D4A62A] bg-white shadow-xs"
              />
              <div className="space-y-0.5 text-[10px] font-sans">
                <span className="text-amber-300 text-[8px] uppercase font-bold block">STUDENT NAME</span>
                <p className="font-extrabold text-xs leading-tight text-white">{student.full_name}</p>
                
                <span className="text-amber-300 text-[8px] uppercase font-bold block pt-1">MATRIC NO.</span>
                <p className="font-mono text-amber-200 font-bold">{student.matric_number}</p>
                
                <span className="text-amber-300 text-[8px] uppercase font-bold block pt-1">STUDY CENTRE</span>
                <p className="text-[9px] truncate w-36 text-emerald-200">{student.study_centre || INSTITUTION_INFO.studyCentre}</p>
              </div>
            </div>

            {/* Footer Card */}
            <div className="flex justify-between items-center text-[8px] border-t border-emerald-600/60 pt-1 text-emerald-200">
              <span>RC: <strong>{INSTITUTION_INFO.rcNumber}</strong></span>
              <span>EXPIRY: <strong>AUG 2027</strong></span>
            </div>
          </div>

          {/* Back Side Card */}
          <div className="w-[340px] h-[215px] bg-white text-slate-900 rounded-2xl shadow-xl p-4 flex flex-col justify-between border-2 border-slate-300 relative">
            <div className="bg-[#0B132B] text-white p-1.5 rounded-lg text-[8px] text-center font-bold uppercase tracking-wider">
              Official Property of Al-Hidayah College of Advanced Studies Ltd
            </div>

            <div className="flex items-center justify-between gap-2 my-2 text-[9px]">
              <div className="space-y-1 text-slate-700">
                <p>• If found, return to Registry, MBS Close, Sabon Tasha Phase II, Abaji FCT.</p>
                <p>• Cardholder must present card at all IJMB lecture and examination halls.</p>
                <p>• Emergency Verification: {INSTITUTION_INFO.phone}</p>
              </div>
              <div className="text-center shrink-0 border p-1 rounded-lg bg-slate-50">
                <QRCodeSVG value={verificationUrl} size={50} />
                <span className="text-[7px] text-slate-500 block font-mono">Scan to Verify</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center text-[8px] text-slate-500">
              <span className="italic font-serif">Mall. Usman Saidu (Registrar)</span>
              <span className="font-bold text-[#006B35]">{INSTITUTION_INFO.website}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
