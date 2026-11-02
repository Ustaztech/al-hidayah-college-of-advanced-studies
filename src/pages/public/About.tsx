import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, Target, Compass, BookOpen, Users, CheckCircle2, FileText, Building2, ExternalLink } from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const About: React.FC = () => {
  return (
    <div className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#196855] to-[#196855] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden border-b-4 border-[#e69912] shadow-xl">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#e69912] text-white text-xs font-black rounded-full uppercase tracking-wider">
                Institutional Profile
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight">
              About Al-Hidayah College of Advanced Studies
            </h1>
            <p className="text-base text-amber-200 font-serif italic">
              “Advancing Academic Excellence Through Structured A-Level Education”
            </p>
            <p className="text-xs text-emerald-100 font-sans">
              IJMB Programme Abaji Study Centre • Federal Capital Territory (FCT), Abuja – Nigeria
            </p>
          </div>
        </div>

        {/* Vision, Mission & Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Vision */}
          <div className="p-8 bg-[#F4F6F5] dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-[#196855] text-amber-300 rounded-2xl w-fit shadow-md">
              <Target size={28} />
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block">
              Official Vision
            </span>
            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">Our Vision</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              “To become a leading Advanced Level Study Centre recognized nationally for academic excellence, discipline, and consistent university placement success.”
            </p>
          </div>

          {/* Mission */}
          <div className="p-8 bg-[#F4F6F5] dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-[#e69912] text-white rounded-2xl w-fit shadow-md">
              <Compass size={28} />
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">
              Official Mission
            </span>
            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">Our Mission</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              “To provide structured IJMB education that builds intellectual competence, confidence, and integrity for higher academic advancement.”
            </p>
          </div>

          {/* Core Values */}
          <div className="p-8 bg-[#F4F6F5] dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-[#e69912] text-white rounded-2xl w-fit shadow-md">
              <ShieldCheck size={28} />
            </div>
            <span className="text-xs font-bold text-[#e69912] uppercase tracking-widest block">
              Guiding Principles
            </span>
            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">Core Values</h2>
            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#196855]"></span>
                <strong>Academic Excellence</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e69912]"></span>
                <strong>Integrity & Ethics</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#196855]"></span>
                <strong>Accountability & Transparency</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <strong>Discipline & Respect</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <strong>Continuous Improvement</strong>
              </li>
            </ul>
          </div>

        </div>

        {/* Foundational Vision & History */}
        <div className="bg-[#F8FAFC] dark:bg-slate-800/60 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6">
          
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#196855] dark:text-emerald-400 uppercase tracking-widest">
              Foundational Background
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
              A Brief History & Foundational Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              <p>
                Al-Hidayah College of Advanced Studies was founded out of a deep concern for educational access, equity, and the long-term human capital development of Abaji Area Council and its environs. Championed by <strong>MB Suleiman (Magajin Ilimin Abaji)</strong>, a seasoned educationist with extensive experience across reputable programmes including NTI Degree, University of Abuja Sandwich Programme, and university-level examination administration.
              </p>
              
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border-l-4 border-[#e69912] text-amber-900 dark:text-amber-200 text-xs">
                <strong>The 2024 Educational Challenge in Abaji:</strong> In 2024, a landmark intervention by <strong>Hon. Abubakar Umar Abdullahi</strong>, the Executive Chairman of Abaji Area Council, sponsored WAEC and JAMB for over 1,000 prospective students across Abaji town and surrounding communities. However, the outcome revealed a harsh reality: <em>only about 100 students eventually secured admission into universities</em> due to limited slots, high competition, and structural bottlenecks within the conventional JAMB system.
              </div>

              <p>
                Conceived as a solution-driven institution, Al-Hidayah identified the Interim Joint Matriculation Board (IJMB) programme as a sustainable pathway. Officially commencing in August 2025 with six pioneering students, the college has established a strategic target to enroll 300 students within three years toward full licensing and institutional expansion.
              </p>
            </div>

            <div className="lg:col-span-4 space-y-3">
              <div className="rounded-2xl overflow-hidden border-2 border-[#e69912] shadow-lg bg-slate-950">
                <img
                  src="/provost-mbsuleiman.jpg"
                  alt="Dr. MB Suleiman PhD"
                  className="w-full h-64 object-cover object-top"
                />
                <div className="p-3 bg-slate-900 text-center">
                  <h4 className="font-bold text-xs text-white">Dr. MB Suleiman, PhD</h4>
                  <p className="text-[10px] text-amber-300">Magajin Ilimin Abaji • Founder</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Operations & Quality Assurance Framework */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-[#196855] dark:text-emerald-300 rounded-xl">
                <FileText size={22} />
              </div>
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                Operations & Quality Assurance Manual
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Binding on all staff and students, the College academic regulations establish structured standards to ensure:
            </p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#196855]" />
                <span>Academic excellence & strict syllabus compliance (12 months minimum)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#196855]" />
                <span>Regulatory compliance with Ahmadu Bello University & JAMB guidelines</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#196855]" />
                <span>Operational transparency & audit trails</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#196855]" />
                <span>Institutional inspection readiness with FCT Higher Education</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-[#e69912] rounded-xl">
                <Building2 size={22} />
              </div>
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                Collaborations & Study Facilities
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              To guarantee seamless examinations credibility and regulatory excellence, Al-Hidayah operates in direct synergy with:
            </p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#e69912]" />
                <span><strong>Sam Ale College of Advanced Studies</strong> (External exam coordination)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#e69912]" />
                <span><strong>Citi Polytechnic Abuja</strong> (Affiliated ND & HND Diplomas)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#e69912]" />
                <span><strong>FCT Mass Agency for Education</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#e69912]" />
                <span><strong>FCT Department of Higher Education</strong></span>
              </li>
            </ul>
          </div>

        </div>

        {/* Authentic Campus Experience Gallery */}
        <div className="bg-[#F4F6F5] dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[#e69912] font-black uppercase text-xs tracking-wider">Campus Highlights</span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mt-1">
                Inside Al-Hidayah College of Advanced Studies
              </h3>
            </div>
            <Link
              to="/virtual-tour"
              className="text-xs font-bold text-[#196855] dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              Explore Full Visual Walkthrough →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl overflow-hidden shadow group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <img src="/ahcas-classroom-lecture.jpg" alt="Lecture Hall" className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-2.5 text-center">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Interactive Lecture Hall</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <img src="/ahcas-student-cohort.jpg" alt="Student Cohort" className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-2.5 text-center">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Enrolled Student Cohort</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <img src="/ahcas-students-learning.jpg" alt="Active Learning" className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-2.5 text-center">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Focused Study Classrooms</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <img src="/ahcas-lecture-session.jpg" alt="Coaching Session" className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-2.5 text-center">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Direct Entry Coaching</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-navigation Links */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4">
          <Link
            to="/about/management"
            className="px-6 py-3 bg-[#196855] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#196855] shadow-md transition-all"
          >
            Meet the Governing Directorate & Staff →
          </Link>
          <Link
            to="/admissions/requirements"
            className="px-6 py-3 bg-[#e69912] text-white font-extrabold text-xs sm:text-sm rounded-xl hover:bg-[#c98207] shadow-md transition-all"
          >
            Explore 73 IJMB Subject Combinations →
          </Link>
        </div>

      </div>
    </div>
  );
};
