import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Award,
  Star,
  Quote,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface SuccessStory {
  name: string;
  matricNo: string;
  points: string;
  subjects: string;
  universityDestination: string;
  degree: string;
  testimonial: string;
  year: string;
  avatar: string;
}

const SUCCESS_STORIES: SuccessStory[] = [
  {
    name: 'Zainab Aminu Ibrahim',
    matricNo: 'AHCAS/IJMB/2025/001',
    points: '15 Points (Max Score)',
    subjects: 'Biology (A), Chemistry (A), Physics (A)',
    universityDestination: 'Ahmadu Bello University (ABU Zaria)',
    degree: 'Direct Entry 200L MBBS (Medicine & Surgery)',
    testimonial: 'Securing university medicine through UTME was repeatedly discouraging. AHCAS provided rigorous science laboratory sessions and dedicated IJMB coaching. Scoring 15 points made my 200L Direct Entry admission into ABU seamless.',
    year: 'Class of 2025',
    avatar: '/hero-graduate.jpg'
  },
  {
    name: 'Kabiru Mohammed',
    matricNo: 'AHCAS/IJMB/2024/019',
    points: '14 Points (High Distinction)',
    subjects: 'Mathematics (A), Physics (A), Chemistry (B)',
    universityDestination: 'Bayero University Kano (BUK)',
    degree: 'Direct Entry 200L Computer Engineering',
    testimonial: 'The CBT testing software and hands-on guidance at the Abaji Study Centre transformed my understanding of advanced mathematics and physical science. Today, I am excelling in 200 Level without missing a single foundational step.',
    year: 'Class of 2024',
    avatar: '/african-graduation.jpg'
  },
  {
    name: 'Amina Usman Bello',
    matricNo: 'AHCAS/IJMB/2025/042',
    points: '13 Points (Honours)',
    subjects: 'Literature (A), Government (A), Islamic Studies (B)',
    universityDestination: 'University of Abuja (UniAbuja)',
    degree: 'Direct Entry 200L Faculty of Law (LL.B)',
    testimonial: 'The mock broadsheet moderation and analytical writing seminars prepared me not just for the IJMB exams, but for the rigorous demands of law faculty coursework. AHCAS delivers on every academic promise.',
    year: 'Class of 2025',
    avatar: '/liaison-officer-study-centre.jpg'
  }
];

export const SuccessStories: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> Proven Academic Impact
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
              Scholars Transitioning Directly into 200 Level
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Meet real AHCAS graduands who rewrote their academic trajectory through the IJMB Direct Entry A-Level Programme.
            </p>
          </div>

          <Link
            to="/alumni"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors shrink-0"
          >
            <span>Visit Alumni Relations & Roll of Honour</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUCCESS_STORIES.map((story, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Header Profile */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-14 h-14 rounded-2xl object-cover object-top border-2 border-emerald-600 shadow-md"
                  />
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-serif group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {story.name}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                      {story.matricNo}
                    </span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {story.points}
                    </span>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="relative pt-2">
                  <Quote className="w-6 h-6 text-emerald-600/20 absolute -top-1 -left-1" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed pl-3 font-serif">
                    “{story.testimonial}”
                  </p>
                </div>

                {/* Academic Destination Details */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    200L Direct Entry Placement:
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {story.degree}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-emerald-600" />
                    <span>{story.universityDestination}</span>
                  </div>
                </div>
              </div>

              {/* Verified Verification Badge */}
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Registry Verified
                </span>
                <span>{story.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default SuccessStories;
