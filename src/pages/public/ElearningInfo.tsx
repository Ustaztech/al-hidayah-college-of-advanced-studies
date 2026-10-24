import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, ShieldCheck, Clock, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export const ElearningInfo: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner with African CBT Image Background */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-b-4 border-[#D4A62A]">
          <img src="/african-cbt-lab.jpg" alt="African Students CBT Lab" className="w-full h-80 sm:h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-[#004D26]/90 to-transparent p-8 sm:p-12 flex flex-col justify-center text-white">
            <div className="max-w-2xl space-y-3">
              <span className="px-3.5 py-1 bg-amber-400 text-black text-xs font-black rounded-full uppercase">
                Digital Learning Hub & CBT
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif">
                AHCAS E-Learning & Examination Platform
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Streamlining lecture materials, continuous assessment quizzes, CBT objective testing, and auto-graded computer examinations.
              </p>
              <div className="pt-2">
                <Link to="/student/dashboard" className="px-6 py-3 bg-[#D4A62A] hover:bg-[#b88d1d] text-black font-extrabold rounded-2xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-xl transition-all">
                  <Monitor size={18} />
                  <span>Launch CBT Examination Hall →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <Clock className="text-[#006B35]" size={28} />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-serif">Server-Timed Testing</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Exams enforce authoritative server-side countdown timers with automated submission on time expiration.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <ShieldCheck className="text-[#D4A62A]" size={28} />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-serif">Anti-Switch Deterrents</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Browser focus monitoring and anti-copy deterrents ensure fair, auditable testing environments.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <Award className="text-blue-600" size={28} />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-serif">Instant Results & Feedback</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Objective multiple-choice tests yield instant real-time scores and lecturer review logs.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
