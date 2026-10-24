import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROGRAMMES_DATA } from '../../data/programmes';
import { ProgrammeCategory } from '../../types';
import { BookOpen, CheckCircle, ArrowRight, Award, ShieldCheck } from 'lucide-react';

export const ProgrammeFilter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProgrammeCategory | 'ALL'>('ALL');

  const filteredProgrammes = activeTab === 'ALL'
    ? PROGRAMMES_DATA
    : PROGRAMMES_DATA.filter(p => p.category === activeTab);

  return (
    <section className="py-16 bg-[#F3F6F3] dark:bg-[#12181F] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#006B35]/10 dark:bg-emerald-950/40 text-[#006B35] dark:text-emerald-400 rounded-full text-xs font-bold mb-3">
            <BookOpen size={14} />
            <span>Academic Programmes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-serif tracking-tight">
            Explore Accredited Programmes at AHCAS
          </h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Choose from approved National Diploma (ND), Higher National Diploma (HND), IJMB Direct Entry A’Levels, and Professional Certifications tailored for career success.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {(['ALL', 'ND', 'HND', 'IJMB', 'Professional'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs ${
                activeTab === tab
                  ? 'bg-[#006B35] text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {tab === 'ALL' && 'All Programmes'}
              {tab === 'ND' && 'National Diploma (ND)'}
              {tab === 'HND' && 'Higher National Diploma (HND)'}
              {tab === 'IJMB' && 'IJMB Direct Entry'}
              {tab === 'Professional' && 'Professional Studies'}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProgrammes.map(p => (
            <div
              key={p.id}
              className="bg-white dark:bg-[#1A222C] rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    p.category === 'ND' ? 'bg-emerald-100 text-[#006B35] dark:bg-emerald-950/60 dark:text-emerald-300' :
                    p.category === 'HND' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                    p.category === 'IJMB' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                  }`}>
                    {p.category} • {p.duration}
                  </span>

                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
                    <ShieldCheck size={12} />
                    {p.accreditationStatus}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif group-hover:text-[#006B35] dark:group-hover:text-emerald-400 transition-colors">
                  {p.title}
                </h3>

                <p className="text-xs text-gray-500 font-medium mt-1 mb-3">{p.department}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-4">
                  {p.description}
                </p>

                <div className="space-y-1.5 border-t border-gray-100 dark:border-gray-800 pt-3 mb-4">
                  <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block">Entry Highlight:</span>
                  <div className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <CheckCircle size={14} className="text-[#006B35] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{p.entryRequirements[0]}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <Link
                  to={`/programmes/${p.slug}`}
                  className="text-xs font-bold text-[#006B35] dark:text-emerald-400 hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>View Details & Curriculum</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  to="/apply/register"
                  className="px-3 py-1.5 bg-[#D4A62A] hover:bg-[#b88d1d] text-black font-bold text-xs rounded-lg shadow-xs transition-colors"
                >
                  Apply
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
