import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  BookOpen,
  Monitor,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Calculator,
  Compass,
  FileCheck,
  Building
} from 'lucide-react';

export const QuickLinksGrid: React.FC<{ onOpenScratchCardModal: () => void }> = () => {
  const cards = [
    {
      title: 'Online Application Portal',
      subtitle: '2026/2027 Admissions Exercise',
      description: 'Start or continue your application for IJMB Direct Entry (001–073) and Citi Poly affiliated ND/HND.',
      link: '/apply',
      icon: UserCheck,
      badge: 'ADMISSIONS DESK',
      color: 'from-emerald-900 to-emerald-950 border-emerald-600/40 text-emerald-300'
    },
    {
      title: 'Convocation Secretariat',
      subtitle: 'Conferment & Regalia Clearance',
      description: 'Check graduation clearance, order official academic gowns, and download digital auditorium passes.',
      link: '/convocation',
      icon: GraduationCap,
      badge: 'CONVOCATION',
      color: 'from-amber-900/90 to-amber-950 border-amber-600/40 text-amber-300'
    },
    {
      title: 'Verify Credentials & Transcripts',
      subtitle: 'Universal Authenticity Lookup',
      description: 'Instant cryptographic verification for Admission Letters, Student ID Cards, and Bursary Receipts.',
      link: '/verify',
      icon: ShieldCheck,
      badge: 'CREDENTIAL CHECK',
      color: 'from-teal-900 to-teal-950 border-teal-600/40 text-teal-300'
    },
    {
      title: 'Student Portal & E-Learning',
      subtitle: 'Authenticated Scholar Gateway',
      description: 'Access lecture notes, course registration, continuous assessment (CA) tests, and results broadsheet.',
      link: '/student/dashboard',
      icon: BookOpen,
      badge: 'SIS & LMS',
      color: 'from-slate-900 to-slate-950 border-slate-700/60 text-blue-300'
    }
  ];

  return (
    <section className="py-12 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <Link
                key={idx}
                to={c.link}
                className="group block"
              >
                <div className={`p-6 rounded-3xl bg-gradient-to-br ${c.color} text-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full border`}>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white group-hover:scale-110 transition-transform">
                        <Icon size={24} />
                      </div>
                      <span className="text-[10px] font-black bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider text-white">
                        {c.badge}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider block mb-1">
                      {c.subtitle}
                    </span>
                    <h3 className="text-lg font-black font-serif text-white group-hover:text-amber-300 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                    <span>Enter Portal</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default QuickLinksGrid;
