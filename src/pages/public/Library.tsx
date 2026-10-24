import React, { useState } from 'react';
import { ELIBRARY_RESOURCES, INSTITUTION_INFO } from '../../data/ijmbData';
import { BookOpen, Search, ExternalLink, Globe, Database, FileText, CheckCircle2, Bookmark, Sparkles } from 'lucide-react';

export const Library: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'oer' | 'databases' | 'journals' | 'pastquestions'>('oer');
  const [searchQuery, setSearchQuery] = useState('');

  const filterBySearch = (list: any[]) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(item =>
      item.title.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.desc && item.desc.toLowerCase().includes(q))
    );
  };

  return (
    <div className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#004D26] to-[#006B35] text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden border-b-4 border-[#D4A62A] shadow-xl">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="px-3 py-1 bg-[#D4A62A] text-black text-xs font-black rounded-full uppercase tracking-wider">
              Official E-Library & Digital Resource Repository
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
              AHCAS Academic E-Library
            </h1>
            <p className="text-sm text-amber-100 font-serif italic">
              Curated Open Educational Resources (OER), Peer-Reviewed Research Databases, E-Journals & IJMB Past Question Papers
            </p>
            <p className="text-xs text-emerald-100">
              Free access for students, researchers, and faculty members in Science, Allied Health, Arts, Management, and Law.
            </p>
          </div>
        </div>

        {/* Search Bar & Tab Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('oer')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'oer'
                  ? 'bg-[#006B35] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <BookOpen size={15} />
              <span>Open Educational Resources (OER)</span>
            </button>

            <button
              onClick={() => setActiveTab('databases')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'databases'
                  ? 'bg-[#006B35] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Database size={15} />
              <span>Research Databases</span>
            </button>

            <button
              onClick={() => setActiveTab('journals')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'journals'
                  ? 'bg-[#006B35] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Globe size={15} />
              <span>E-Resource Journals</span>
            </button>

            <button
              onClick={() => setActiveTab('pastquestions')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'pastquestions'
                  ? 'bg-[#D4A62A] text-black shadow-md font-black'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <FileText size={15} />
              <span>IJMB Past Question Papers</span>
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search books & resources..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

        </div>

        {/* Tab 1: Open Educational Resources */}
        {activeTab === 'oer' && (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200">
              <strong>Open Educational Resources:</strong> Free textbooks and learning materials covering Science collections, Arts & Humanities, Allied Health Sciences (Nursing), and Management & Social Sciences.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterBySearch(ELIBRARY_RESOURCES.oer).map((res, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#006B35] transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-[#006B35] dark:text-emerald-300 font-extrabold px-2.5 py-1 rounded-full uppercase">
                        {res.category}
                      </span>
                      <BookOpen size={18} className="text-[#006B35]" />
                    </div>

                    <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white group-hover:text-[#006B35] transition-colors">
                      {res.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {res.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006B35] dark:text-emerald-400 hover:text-[#004D26]"
                    >
                      <span>Access Online Repository</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Research Databases */}
        {activeTab === 'databases' && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 text-xs text-amber-900 dark:text-amber-200">
              <strong>Institutional Research Databases:</strong> Curated databases supporting A-Level independent research, academic coursework, and university 100-level syllabus harmonization.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filterBySearch(ELIBRARY_RESOURCES.researchDatabases).map((res, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#D4A62A] transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-[#D4A62A] rounded-xl">
                        <Database size={20} />
                      </div>
                      <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                        {res.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {res.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4A62A] hover:text-amber-600"
                    >
                      <span>Connect to Database</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: E-Resource Journals */}
        {activeTab === 'journals' && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 text-xs text-blue-900 dark:text-blue-200">
              <strong>Peer-Reviewed Academic Journals:</strong> Direct access to indexed literature including ScienceDirect, DOAJ, JSTOR, Law Pavilion Plus, SAGE Africa, and Springer.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filterBySearch(ELIBRARY_RESOURCES.eJournals).map((res, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-500 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Globe size={18} className="text-blue-600" />
                      <span className="text-[10px] text-slate-400 font-mono">Official Link</span>
                    </div>

                    <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {res.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {res.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      <span>Open Journal Portal</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: IJMB Past Question Papers */}
        {activeTab === 'pastquestions' && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300 text-xs text-amber-900 dark:text-amber-200">
              <strong>Official IJMB Examination Past Question Archives:</strong> Practice real exam questions from previous examination diets covering both Semester 1 and Semester 2 A-Level curricula.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filterBySearch(ELIBRARY_RESOURCES.pastQuestions).map((res, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-[#D4A62A] flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-[#D4A62A] rounded-xl w-fit">
                      <FileText size={22} />
                    </div>

                    <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                      {res.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {res.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-[#006B35] hover:bg-[#004D26] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Download Past Questions</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
