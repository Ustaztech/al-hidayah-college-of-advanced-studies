import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROGRAMMES_DATA } from '../../data/programmes';
import { ProgrammeCategory } from '../../types';
import { BookOpen, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export const Programmes: React.FC = () => {
  const { category } = useParams<{ category?: string }>();

  let catFilter: ProgrammeCategory | null = null;
  if (category) {
    const upper = category.toUpperCase();
    if (upper === 'ND' || upper === 'HND' || upper === 'IJMB' || upper === 'PROFESSIONAL') {
      catFilter = upper as ProgrammeCategory;
    }
  }

  const list = catFilter
    ? PROGRAMMES_DATA.filter(p => p.category === catFilter)
    : PROGRAMMES_DATA;

  return (
    <div className="py-12 bg-white dark:bg-[#1A222C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
          <span className="text-xs font-bold text-[#D4A62A] uppercase tracking-wider block mb-1">
            Academic Offerings
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-gray-900 dark:text-white">
            {catFilter ? `${catFilter} Programmes` : 'All Accredited Programmes'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Explore approved National Diploma (ND), Higher National Diploma (HND), IJMB Direct Entry, and Professional courses at AHCAS Abaji.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <Link
            to="/programmes/nd"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              catFilter === 'ND' ? 'bg-[#006B35] text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            National Diploma (ND)
          </Link>
          <Link
            to="/programmes/hnd"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              catFilter === 'HND' ? 'bg-[#D4A62A] text-black shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Higher National Diploma (HND)
          </Link>
          <Link
            to="/programmes/ijmb"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              catFilter === 'IJMB' ? 'bg-amber-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            IJMB Direct Entry
          </Link>
          <Link
            to="/programmes/professional"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              catFilter === 'Professional' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Professional Studies
          </Link>
        </div>

        {/* List of Programmes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(p => (
            <div
              key={p.id}
              className="bg-[#F3F6F3] dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#006B35] dark:text-emerald-300 uppercase">
                    {p.category} • {p.duration}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {p.accreditationStatus}
                  </span>
                </div>

                <h3 className="text-base font-bold font-serif text-gray-900 dark:text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
                  {p.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs">
                <Link
                  to={`/programmes/${p.slug}`}
                  className="font-bold text-[#006B35] dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Curriculum & Entry</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/apply/register"
                  className="px-3 py-1 bg-[#D4A62A] text-black font-bold rounded text-xs"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
