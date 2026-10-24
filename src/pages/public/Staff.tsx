import React from 'react';
import { ACADEMIC_GOVERNANCE_STRUCTURE, INSTITUTION_INFO } from '../../data/ijmbData';
import { ShieldCheck, BookOpen, Clock, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Staff: React.FC = () => {
  return (
    <div className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Banner */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <span className="text-xs font-black text-[#006B35] dark:text-emerald-400 uppercase tracking-wider block mb-1">
            Academic Operations Manual (AHC/IJMB/OQAM/2026)
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
            Academic Structure & Delivery Model
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl">
            Established governance framework and operational roles ensuring academic excellence, regulatory compliance, and continuous audit readiness at Al-Hidayah College of Advanced Studies.
          </p>
        </div>

        {/* Delivery Standards Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-800 space-y-2">
            <Clock className="text-[#006B35] dark:text-emerald-400" size={24} />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-serif">
              6 Lecture Hours / Week
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              For effective syllabus coverage over the 12-month period, each examinable A-Level subject is allocated a minimum of 6 contact lecture hours weekly.
            </p>
          </div>

          <div className="p-6 bg-amber-50 dark:bg-amber-950/40 rounded-3xl border border-amber-200 dark:border-amber-800 space-y-2">
            <BookOpen className="text-[#D4A62A]" size={24} />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-serif">
              3 Practical Hours / Week
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Science subjects with practical components (Physics, Chemistry, Biology) feature an additional 3 hours of mandatory laboratory sessions weekly.
            </p>
          </div>

          <div className="p-6 bg-blue-50 dark:bg-blue-950/40 rounded-3xl border border-blue-200 dark:border-blue-800 space-y-2">
            <ShieldCheck className="text-blue-600" size={24} />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-serif">
              20% C.A. + 80% Examination
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Continuous Assessment (attendance, assignments, laboratory practicals, tests) accounts for 20%, complemented by 80% external JAMB-moderated written papers.
            </p>
          </div>
        </div>

        {/* 12 Statutory Positions and Duties Table */}
        <div className="bg-[#F8FAFC] dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              Institutional Delivery Roster: Duties & Responsibilities
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Statutory roles defined in Section 2 of the approved Operations and Quality Assurance Manual.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-black">Position</th>
                  <th className="py-3 px-4 font-black">Appointed Incumbent / Unit</th>
                  <th className="py-3 px-4 font-black">Statutory Duties & Responsibilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {ACADEMIC_GOVERNANCE_STRUCTURE.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/60 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#006B35] dark:text-emerald-400 whitespace-nowrap">
                      {item.position}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {item.incumbent}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.duties}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Academic Departments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-[11px] font-bold text-emerald-600 uppercase">Faculty Division 1</span>
            <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
              Science & Technology Directorate
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Biology, Chemistry, Physics, A/L Mathematics, Geology, Geography, Computer Science, and Engineering Sciences.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-[11px] font-bold text-[#D4A62A] uppercase">Faculty Division 2</span>
            <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
              Arts, Law & Humanities Directorate
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Literature in English, Government, History, Islamic Studies, Christian Religious Studies, Hausa, Arabic, and French.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-[11px] font-bold text-blue-600 uppercase">Faculty Division 3</span>
            <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
              Management & Social Sciences
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Accounting, Business Management, Economics, Sociology, Public Administration, Marketing, and Mass Communication.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
