import React from 'react';
import { Shield, Cpu, Scale, GraduationCap, MapPin, HeartHandshake, CheckCircle2, Award, BookOpen, Laptop, Users } from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const WhyAHCAS: React.FC = () => {
  const pillars = [
    {
      title: 'Academic Excellence',
      description: 'Programmes delivered by qualified and experienced professionals committed to student success and university admission.',
      icon: GraduationCap
    },
    {
      title: 'Moral and Discipline',
      description: 'An institution that fosters discipline, respect, responsibility, and ethical leadership in service to humanity.',
      icon: Scale
    },
    {
      title: 'Proven Track Record',
      description: 'Graduates acquire practical competencies that maximize direct university admission (200 Level) and employment prospects.',
      icon: Award
    },
    {
      title: 'Modern Facilities',
      description: 'Well-equipped study centre at JSS Agyana Road, high-speed ICT centers, e-library, e-laboratory (JavaLab), and e-learning facilities.',
      icon: Laptop
    },
    {
      title: 'Qualified Staffing',
      description: 'Comprehensive academic mentorship from qualified lecturers and tutors possessing a minimum of Master’s Degree credentials.',
      icon: Users
    },
    {
      title: 'Hands-on Practicals',
      description: 'Professional skills relevant to industry and workplace requirements, digital literacy, and enterprise creation training.',
      icon: Cpu
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
              <span>Why Choose AHCAS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight leading-tight">
              Why Study at Al-Hidayah College of Advanced Studies?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Established with a firm commitment to academic rigor, digital innovation, and moral character. We provide structured pathways into 200-Level university degree programmes and National Diploma certifications.
            </p>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center gap-4">
              <img src="/official-logo.jpg" alt="AHCAS Crest" className="h-14 w-auto bg-white p-1 rounded-xl shadow-xs" />
              <div>
                <span className="font-bold text-sm text-[#006B35] block font-serif">
                  AHCAS Institutional Seal
                </span>
                <p className="text-xs text-amber-700 font-serif italic font-bold">
                  “{INSTITUTION_INFO.crestMotto}”
                </p>
                <span className="text-[10px] text-slate-500 font-mono">
                  RC: {INSTITUTION_INFO.rcNumber} • Approved Manual Aug 2025
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 hover:border-emerald-500 transition-colors"
                >
                  <div className="p-2.5 bg-emerald-100 text-[#006B35] rounded-xl w-fit shadow-xs">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 font-serif">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
