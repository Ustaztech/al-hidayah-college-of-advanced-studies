import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, BookOpen, Monitor, ShieldCheck, ArrowRight } from 'lucide-react';

export const QuickLinksGrid: React.FC<{ onOpenScratchCardModal: () => void }> = ({ onOpenScratchCardModal }) => {
  const cards = [
    {
      title: 'Online Application Portal',
      subtitle: '2026/2027 Admissions Exercise',
      description: 'Start or continue your application for National Diploma (ND), HND, or IJMB Direct Entry.',
      link: '/apply',
      icon: UserCheck,
      badge: 'ADMISSIONS',
      color: 'from-[#006B35] to-[#004D26]'
    },
    {
      title: 'Academic Faculties & Programmes',
      subtitle: 'NBTE Approved Curriculum',
      description: 'Explore our schools of Computer Science, Science Lab Tech, Mass Comm, and Engineering.',
      link: '/programmes',
      icon: BookOpen,
      badge: 'ACADEMICS',
      color: 'from-slate-800 to-slate-900'
    },
    {
      title: 'Virtual Campus & Facilities',
      subtitle: 'Modern Science & CBT Labs',
      description: 'Experience ultra-modern ICT computer laboratories, digital e-libraries, and campus halls.',
      link: '/virtual-tour',
      icon: Monitor,
      badge: 'CAMPUS TOUR',
      color: 'from-[#F58220] to-orange-700'
    },
    {
      title: 'Student Information System',
      subtitle: 'Student Portal Access',
      description: 'Authenticated student gateway for course registration, fee receipts, results, and CBT testing.',
      link: '/student/dashboard',
      icon: ShieldCheck,
      badge: 'SIS PORTAL',
      color: 'from-[#D4A62A] to-amber-700'
    }
  ];

  return (
    <section className="py-12 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            const cardContent = (
              <div className={`p-6 rounded-3xl bg-gradient-to-br ${c.color} text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group border border-white/10`}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white">
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-black bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {c.badge}
                    </span>
                  </div>

                  <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block mb-1">
                    {c.subtitle}
                  </span>
                  <h3 className="text-lg font-black font-serif text-white group-hover:text-amber-300 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore Section</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            );

            return (
              <Link key={idx} to={c.link}>{cardContent}</Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
