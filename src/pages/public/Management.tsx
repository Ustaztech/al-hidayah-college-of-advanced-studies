import React from 'react';
import { User, Award, ShieldCheck, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { REAL_STAFF, INSTITUTION_INFO } from '../../data/ijmbData';

export const Management: React.FC = () => {
  return (
    <div className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Banner */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black text-[#006B35] dark:text-emerald-400 uppercase tracking-wider">
              Leadership & Principal Officers
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-[#D4A62A] font-bold">RC: {INSTITUTION_INFO.rcNumber}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
            Governing Council & Administrative Directorate
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl">
            Meet the experienced academic leadership directing operations at Al-Hidayah College of Advanced Studies, Abaji Study Centre, under the statutory framework of Ahmadu Bello University (ABU).
          </p>
        </div>

        {/* Featured Founder & Executive Chairman Card */}
        <div className="bg-gradient-to-br from-[#004D26] via-[#006B35] to-[#0F172A] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-[#D4A62A] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4A62A] shadow-2xl w-full max-w-sm">
              <img
                src="/provost-mbsuleiman.jpg"
                alt="Dr. MB Suleiman, PhD (Magajin Ilimin Abaji)"
                className="w-full h-80 sm:h-96 object-cover object-top"
              />
              <div className="p-3 bg-black/80 text-center backdrop-blur-xs">
                <span className="text-[10px] text-amber-300 uppercase tracking-widest font-black block">
                  Provost Official Portrait
                </span>
                <span className="text-xs font-serif italic text-emerald-200">
                  “Enlightening Minds, Building Nations”
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/40 rounded-full text-xs font-bold text-amber-200">
              <Award size={14} className="text-[#D4A62A]" />
              <span>Founder & Executive Chairman</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white">
              Dr. Muhammad Baba Suleiman, PhD
            </h2>
            <p className="text-sm text-amber-300 font-bold uppercase tracking-wider">
              Magajin Ilimin Abaji • Proprietor & CEO
            </p>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              An accomplished educationist with extensive experience across reputable academic programmes, including NTI Degree, University of Abuja Sandwich Programme, and university-level examination administration. He has served as Proctor with Iconic Open University, safeguarding academic integrity and examination standards.
            </p>

            <div className="p-4 bg-black/30 rounded-2xl border border-white/10 space-y-2">
              <strong className="text-xs text-amber-300 block uppercase tracking-wider">
                Statutory Duties & Responsibilities:
              </strong>
              <p className="text-xs text-slate-300 leading-relaxed">
                Provides strategic vision and overall leadership; ensures compliance with regulatory bodies; oversees finance, operations, partnerships; represents the centre at official engagements.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-emerald-200">
              <span>Location: <strong>Abaji FCT Abuja</strong></span>
              <span>•</span>
              <span>Phone: <strong className="text-white font-mono">{INSTITUTION_INFO.phone}</strong></span>
              <span>•</span>
              <span>Email: <strong className="text-white">{INSTITUTION_INFO.email}</strong></span>
            </div>
          </div>

        </div>

        {/* Officers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Mall. Ibrahim Idris Gambo */}
          <div className="bg-[#F8FAFC] dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border-2 border-emerald-600 bg-slate-950 h-64">
                <img
                  src="/coordinator-ibrahim-gambo.jpg"
                  alt="Mall. Ibrahim Idris Gambo"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div>
                <span className="text-[11px] font-black text-[#006B35] dark:text-emerald-400 uppercase tracking-widest block">
                  IJMB Academic Programme
                </span>
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                  Mall. Ibrahim Idris Gambo
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  Centre Coordinator
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p className="leading-relaxed">
                  Oversees programs and curriculum; coordinates examinations and academic records; supervises departmental units; liaises with affiliated external examining bodies.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Study Centre Lead</span>
              <span className="font-bold text-[#006B35] dark:text-emerald-400">JSS Agyana Rd Centre</span>
            </div>
          </div>

          {/* Mall. Usman Saidu */}
          <div className="bg-[#F8FAFC] dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border-2 border-[#D4A62A] bg-slate-950 h-64">
                <img
                  src="/registrar-usman-saidu.jpg"
                  alt="Mall. Usman Saidu"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div>
                <span className="text-[11px] font-black text-[#D4A62A] uppercase tracking-widest block">
                  Registry & Examinations
                </span>
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                  Mall. Usman Saidu
                </h3>
                <p className="text-xs text-[#006B35] dark:text-emerald-400 font-semibold">
                  Registrar / Examination Officer
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p className="leading-relaxed">
                  Organizes examinations; ensures absolute integrity of assessment processes; maintains student registration files, O’Level verification, and statutory archival records.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Verification Desk</span>
              <span className="font-bold text-[#D4A62A]">Registry Active</span>
            </div>
          </div>

          {/* Liaison & Inspection Officer */}
          <div className="bg-[#F8FAFC] dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border-2 border-slate-400 bg-slate-950 h-64">
                <img
                  src="/liaison-officer-study-centre.jpg"
                  alt="FCT Department of Higher Education Liaison Officer"
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div>
                <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
                  Government Regulatory Compliance
                </span>
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                  FCT Higher Education Liaison
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Liaison Officer for Al-Hidayah College
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p className="leading-relaxed">
                  Conducts regulatory monitoring, quality control assessments, and ensures institutional inspection readiness in coordination with the FCT Mass Agency for Education.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Regulatory Oversight</span>
              <span className="font-bold text-blue-600">Inspection Ready</span>
            </div>
          </div>

        </div>

        {/* Working Partnership Photo Banner */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6">
          <img
            src="/coordinator-with-director.jpg"
            alt="Centre Coordinator with the Director"
            className="w-full md:w-64 h-44 object-cover rounded-2xl border-2 border-emerald-600 shadow-md"
          />
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Administrative Unity
            </span>
            <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
              Executive Directorate in Session
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Dr. MB Suleiman (Executive Chairman) and Mall. Ibrahim Idris Gambo (Centre Coordinator) actively supervising curriculum implementation, lecturer rosters, and candidate registrations at the college secretariat.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
