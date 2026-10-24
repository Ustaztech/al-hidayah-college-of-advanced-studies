import React from 'react';
import { Link } from 'react-router-dom';
import { FileEdit, CheckCircle2, Compass, FileCheck, FolderCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { INSTITUTION_INFO, TUITION_SCHEDULE } from '../../data/ijmbData';

export const AdmissionsGuide: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Application Submission',
      description: `Prospective students apply online via the admission portal (Form Fee: ₦${INSTITUTION_INFO.formFeeNgn.toLocaleString()}) or at the Abaji Study Centre Secretariat.`,
      icon: FileEdit
    },
    {
      step: '02',
      title: 'O’Level Verification',
      description: 'Verification of minimum 5 credits in WAEC, NECO, or NABTEB in not more than 2 sittings. Remedial deficiency permitted for ELDS candidates.',
      icon: CheckCircle2
    },
    {
      step: '03',
      title: 'Subject Combination Advisory',
      description: 'Academic advisory matching candidates with one of the 73 approved IJMB subject combination codes (001–073) aligned with JAMB Direct Entry requirements.',
      icon: Compass
    },
    {
      step: '04',
      title: 'Admission Letter Issuance',
      description: 'Issuance of official provisional admission letter with verifiable institutional security code (AHCAS/IJMB/2026/2027) and QR validation.',
      icon: FileCheck
    },
    {
      step: '05',
      title: 'Student File Creation',
      description: 'Compilation of mandatory physical file and digital backup record containing the 12 statutory documentation items.',
      icon: FolderCheck
    }
  ];

  return (
    <section className="py-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black text-[#D4A62A] uppercase tracking-widest block mb-1">
            Section 3: Admission Policy & Procedure
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
            5-Stage Official Admission Workflow
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Governed by the Al-Hidayah Operations & Quality Assurance Manual (Document Code: {INSTITUTION_INFO.documentCode}).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative p-5 bg-[#F8FAFC] dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#006B35] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-[#006B35] dark:text-emerald-400 font-serif">
                      {s.step}
                    </span>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-700 text-[#006B35] dark:text-emerald-400 shadow-xs group-hover:bg-[#006B35] group-hover:text-white transition-colors">
                      <Icon size={18} />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif mb-2">
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700 text-[10px] font-bold text-[#006B35] dark:text-emerald-400 uppercase tracking-wider">
                  Phase {idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center flex flex-wrap justify-center gap-3">
          <Link
            to="/apply/register"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#006B35] hover:bg-[#004D26] text-white font-black rounded-xl shadow-lg transition-all text-xs sm:text-sm"
          >
            <span>Proceed to Application Submission (₦10,500)</span>
            <ArrowRight size={15} />
          </Link>

          <Link
            to="/admissions/requirements"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 font-bold rounded-xl text-xs sm:text-sm hover:bg-amber-100"
          >
            <span>View Approved Combinations & Cut-offs</span>
          </Link>
        </div>

      </div>
    </section>
  );
};
