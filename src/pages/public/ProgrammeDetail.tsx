import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROGRAMMES_DATA } from '../../data/programmes';
import { BookOpen, CheckCircle, ShieldCheck, Clock, Award, UserCheck, ArrowLeft } from 'lucide-react';

export const ProgrammeDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const prog = PROGRAMMES_DATA.find(p => p.slug === slug) || PROGRAMMES_DATA[0];

  return (
    <div className="py-12 bg-white dark:bg-[#1A222C] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        <Link to="/programmes/nd" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#006B35]">
          <ArrowLeft size={14} />
          Back to All Programmes
        </Link>

        {/* Programme Header Card */}
        <div className="p-8 bg-[#006B35] text-white rounded-3xl border-b-4 border-[#D4A62A] space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 bg-amber-400 text-black font-extrabold rounded-full uppercase">
              {prog.category} Programme
            </span>
            <span className="px-3 py-1 bg-emerald-900/80 text-emerald-200 font-bold rounded-full flex items-center gap-1">
              <Clock size={13} />
              {prog.duration}
            </span>
            <span className="px-3 py-1 bg-emerald-900/80 text-emerald-200 font-bold rounded-full flex items-center gap-1">
              <ShieldCheck size={13} />
              {prog.accreditationStatus}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            {prog.title}
          </h1>

          <p className="text-sm text-emerald-100 font-medium">
            Department: {prog.department}
          </p>

          <p className="text-xs text-gray-200 leading-relaxed max-w-3xl">
            {prog.description}
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              to={`/apply/register?programme=${prog.id}`}
              className="px-6 py-3 bg-[#D4A62A] hover:bg-[#b88d1d] text-black font-extrabold rounded-xl text-sm flex items-center gap-2 shadow-md"
            >
              <UserCheck size={18} />
              <span>Apply for {prog.title}</span>
            </Link>
          </div>
        </div>

        {/* Requirements & Curriculum Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Entry Requirements */}
          <div className="p-6 bg-[#F3F6F3] dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="text-lg font-bold font-serif text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="text-[#006B35]" size={20} />
              Entry Requirements
            </h2>
            <ul className="space-y-2.5 text-xs text-gray-700 dark:text-gray-300">
              {prog.entryRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006B35] shrink-0 mt-1.5"></span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum Highlights */}
          <div className="p-6 bg-[#F3F6F3] dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="text-lg font-bold font-serif text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="text-[#D4A62A]" size={20} />
              Curriculum & Practical Modules
            </h2>
            <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
              {prog.curriculumHighlights.map((curr, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A62A] shrink-0 mt-1.5"></span>
                  <span>{curr}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Career Pathways & Fee Structure */}
        <div className="p-6 bg-[#F3F6F3] dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h2 className="text-lg font-bold font-serif text-gray-900 dark:text-white flex items-center gap-2">
            <Award className="text-blue-600" size={20} />
            Career Pathways & Future Direct Entry Opportunities
          </h2>
          <div className="flex flex-wrap gap-2">
            {prog.careerPathways.map((path, idx) => (
              <span key={idx} className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-800 dark:text-gray-200 rounded-lg">
                {path}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs">
            <span className="text-gray-500">Estimated Tuition & Fees:</span>
            <span className="font-extrabold text-[#006B35] dark:text-emerald-400 text-sm">{prog.feeEstimate}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
