import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROGRAMMES_DATA } from '../../data/programmes';
import { ProgrammeCategory } from '../../types';
import { BookOpen, CheckCircle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

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
          <span className="text-xs font-bold text-[#e69912] uppercase tracking-wider block mb-1">
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
              catFilter === 'ND' ? 'bg-[#196855] text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            National Diploma (ND)
          </Link>
          <Link
            to="/programmes/hnd"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              catFilter === 'HND' ? 'bg-[#e69912] text-black shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
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
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#196855] dark:text-emerald-300 uppercase">
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
                  className="font-bold text-[#196855] dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Curriculum & Entry</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/apply/register"
                  className="px-3 py-1 bg-[#e69912] text-black font-bold rounded text-xs"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Official Study Centre Dais Banner */}
        <div className="bg-[#F4F6F5] dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-60 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-black">
            <img src="/ahcas-orientation-podium-full.jpg" alt="Official AHCAS Abaji Study Centre Dais" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#196855] text-xs font-bold rounded-full border border-emerald-200">
              <Sparkles size={14} className="text-[#e69912]" />
              <span>Official Institutional Motto</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#196855] dark:text-emerald-400">
              Make Room for Your Future — Developing the Best Minds
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Every programme at Al-Hidayah College of Advanced Studies is tailored to provide rigorous academic depth, continuous assessment, and hands-on laboratory coaching. Join our current cohort at the JSS Agyana Road Study Centre in Abaji.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/apply" className="px-5 py-2 bg-[#196855] hover:opacity-90 text-white font-bold rounded-xl text-xs shadow-xs">
                Start IJMB Application →
              </Link>
              <Link to="/gallery" className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-50 transition-colors">
                View Campus Gallery →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
