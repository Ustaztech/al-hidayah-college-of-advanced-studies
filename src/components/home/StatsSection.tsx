import React from 'react';
import { Users, GraduationCap, Building2, CalendarCheck, ShieldCheck } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      label: 'Active Student Enrolment',
      value: '2,400+',
      description: 'Across ND, HND & IJMB programmes',
      icon: Users,
      color: 'text-[#006B35]'
    },
    {
      label: 'Accredited Academic Programmes',
      value: '14+',
      description: 'ND, HND & IJMB Direct Entry options',
      icon: GraduationCap,
      color: 'text-[#D4A62A]'
    },
    {
      label: 'Qualified Academic & Tech Staff',
      value: '120+',
      description: 'Dedicated lecturers & lab technologists',
      icon: Building2,
      color: 'text-[#F58220]'
    },
    {
      label: 'Years of Educational Excellence',
      value: '10+',
      description: 'Serving Abaji, FCT & Northern Nigeria',
      icon: CalendarCheck,
      color: 'text-blue-600'
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-[#1A222C] border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F3F6F3] dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-white dark:bg-gray-700 shadow-xs ${s.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AHCAS Metric</span>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif group-hover:scale-105 transition-transform origin-left">
                    {s.value}
                  </h3>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">{s.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-gray-400 italic">
            * Note: Enrolment figures represent institutional targets and verified records for the 2025/2026 academic cycle.
          </p>
        </div>

      </div>
    </section>
  );
};
