import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, BookOpen, Building, Award, FileSpreadsheet, ShieldCheck, ArrowRight } from 'lucide-react';

export const StudentServicesGrid: React.FC = () => {
  const services = [
    {
      title: 'Digital CBT Examination Platform',
      description: 'Server-timed online testing with instant objective evaluation, anti-tab switch deterrents, and auto-save protection.',
      link: '/elearning',
      icon: Monitor,
      color: 'bg-emerald-500'
    },
    {
      title: 'Digital E-Library & Laboratories',
      description: 'Access 10,000+ academic journals, e-books, micro-biology simulation guides, and computer programming lab manuals.',
      link: '/library',
      icon: BookOpen,
      color: 'bg-amber-500'
    },
    {
      title: 'Hostel Accommodation Portal',
      description: 'Online room allocation workflow for male and female campus hostels in Abaji with clearance tracking.',
      link: '/student/dashboard',
      icon: Building,
      color: 'bg-orange-500'
    },
    {
      title: 'SIWES Placement & E-Logbook',
      description: 'Industrial Training submission for ND I students with supervisor sign-offs and university logbook tracking.',
      link: '/student/dashboard',
      icon: Award,
      color: 'bg-blue-500'
    },
    {
      title: 'Online Transcript Processing',
      description: 'Request official transcript dispatches to domestic and international universities via authenticated scratch card PINs.',
      link: '/student/dashboard',
      icon: FileSpreadsheet,
      color: 'bg-purple-500'
    },
    {
      title: 'NYSC Eligibility Mobilization',
      description: 'Automated reporting for HND graduates eligible for National Youth Service Corps mobilization.',
      link: '/student/dashboard',
      icon: ShieldCheck,
      color: 'bg-[#006B35]'
    }
  ];

  return (
    <section className="py-16 bg-[#F3F6F3] dark:bg-[#12181F] border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#006B35] dark:text-emerald-400 uppercase tracking-wider block mb-1">
            Digital Campus Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-serif tracking-tight">
            Integrated Student & Academic Services
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            A single unified ecosystem powering student records, examinations, e-library resources, and administrative workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <Link
                key={idx}
                to={svc.link}
                className="bg-white dark:bg-[#1A222C] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl text-white shadow-xs ${svc.color}`}>
                      <Icon size={22} />
                    </div>
                    <ArrowRight size={18} className="text-gray-400 group-hover:text-[#006B35] dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white font-serif group-hover:text-[#006B35] dark:group-hover:text-emerald-400 transition-colors mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 text-xs font-bold text-[#006B35] dark:text-emerald-400">
                  Access Portal Service →
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
