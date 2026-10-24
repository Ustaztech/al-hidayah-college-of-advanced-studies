import React from 'react';
import { Award, Quote, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const RectorWelcome: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Executive Chairman Official Portrait Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#006B35] bg-slate-950">
              <img
                src="/provost-mbsuleiman.jpg"
                alt="Dr. MB Suleiman, PhD (Magajin Ilimin Abaji)"
                className="w-full h-[460px] object-cover object-top filter contrast-105 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="px-3 py-1 bg-[#D4A62A] text-black text-[10px] font-black rounded-full uppercase tracking-wider w-fit mb-2 shadow-md">
                  Office of the Executive Chairman & Founder
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-serif text-white leading-tight">
                  Dr. MB Suleiman, PhD
                </h3>
                <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                  Magajin Ilimin Abaji
                </p>
                <p className="text-[11px] text-slate-300 mt-1 font-medium">
                  Executive Chairman & Director, Al-Hidayah College of Advanced Studies
                </p>
                <p className="text-[10px] text-emerald-300 italic mt-0.5 font-serif">
                  “Enlightening Minds, Building Nations”
                </p>
              </div>
            </div>

            {/* Floating Quality Badge */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
              <div className="p-3 bg-[#006B35] text-amber-300 rounded-xl shadow-md">
                <Award size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
                  Institutional Mandate
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white font-serif">
                  Direct 200L University Admission
                </p>
                <p className="text-[10px] text-slate-500">
                  ABU Coordination • JAMB Moderated
                </p>
              </div>
            </div>
          </div>

          {/* Welcome Message Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-[#006B35] dark:text-emerald-300 text-xs font-bold rounded-full">
                <Sparkles size={13} className="text-[#D4A62A]" />
                <span>Official Welcome Address</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white leading-tight">
                Opening Sustainable Pathways into Higher Education
              </h2>
            </div>

            <div className="relative pl-6 border-l-4 border-[#006B35] italic text-sm text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
              <Quote className="text-[#006B35]/25 absolute -top-3 left-0" size={36} />
              “Welcome to Al-Hidayah College of Advanced Studies, a centre of purpose, opportunity, and academic transformation. Our vision is simple yet powerful: no capable student should be denied higher education due to systemic limitations.”
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              <p>
                Every year, thousands of intelligent and determined students aspire to gain university admission, yet only a fraction succeed through conventional routes. In 2024, an intervention in Abaji sponsored over 1,000 students for WAEC and JAMB, yet only about 100 gained placement due to limited quotas and structural bottlenecks.
              </p>
              <p>
                Al-Hidayah College of Advanced Studies was founded as a solution-driven institution. Our Interim Joint Matriculation Board (IJMB) Programme provides a trusted, nationally recognised alternative that leads directly to <strong>200 Level admission into Nigerian universities</strong> and selected institutions abroad without the repeated frustration of UTME failures.
              </p>
              <p>
                For parents and guardians, Al-Hidayah represents security and assurance. For students, this is your opportunity to rewrite your academic story and step confidently toward your dream profession in Medicine, Engineering, Law, Pharmacy, and Computer Science.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <CheckCircle2 size={18} className="text-[#006B35] shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">ABU Academic Alignment & JAMB Moderated</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <CheckCircle2 size={18} className="text-[#006B35] shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Collaborating with Sam Ale & Citi Poly</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006B35] hover:bg-[#004D26] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                <span>Read Institutional Profile</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/about/management"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-xl border border-amber-300 hover:bg-amber-100 transition-colors"
              >
                <span>Principal Officers & Staff</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
