import React, { useState } from 'react';
import { ELIBRARY_RESOURCES, INSTITUTION_INFO } from '../../data/ijmbData';
import { BookOpen, Search, ExternalLink, Globe, Database, FileText, CheckCircle2, Bookmark, Sparkles } from 'lucide-react';

export const Library: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'oer' | 'databases' | 'journals' | 'pastquestions' | 'physical'>('oer');
  const [searchQuery, setSearchQuery] = useState('');
  const [reservationNotice, setReservationNotice] = useState('');

  // Physical library holdings at Abaji Study Centre
  const [physicalBooks, setPhysicalBooks] = useState([
    {
      isbn: '978-0199147335',
      title: 'Advanced Biology for A-Level (Oxford)',
      author: 'Michael Kent',
      callNumber: '570.76 KEN',
      shelfLocation: 'Science Wing Shelf B-04',
      totalCopies: 8,
      availableCopies: 6,
      category: 'Biology'
    },
    {
      isbn: '978-0198392910',
      title: 'Advanced Physics Fifth Edition',
      author: 'Tom Duncan',
      callNumber: '530.076 DUN',
      shelfLocation: 'Science Wing Shelf P-02',
      totalCopies: 10,
      availableCopies: 7,
      category: 'Physics'
    },
    {
      isbn: '978-0199146338',
      title: 'Calculus and Pure Mathematics for A-Level',
      author: 'L. Bostock & S. Chandler',
      callNumber: '515.076 BOS',
      shelfLocation: 'Mathematics Wing Shelf M-01',
      totalCopies: 12,
      availableCopies: 9,
      category: 'Mathematics'
    },
    {
      isbn: '978-0521532845',
      title: 'Economics: Principles and Policy (A-Level)',
      author: 'William J. Baumol & Alan S. Blinder',
      callNumber: '330.076 BAU',
      shelfLocation: 'Social Sciences Shelf E-03',
      totalCopies: 6,
      availableCopies: 4,
      category: 'Economics'
    },
    {
      isbn: '978-0415392570',
      title: 'The English Legal System (A-Level Law Text)',
      author: 'Jacqueline Martin',
      callNumber: '349.42 MAR',
      shelfLocation: 'Law Collection Shelf L-01',
      totalCopies: 5,
      availableCopies: 3,
      category: 'Law'
    }
  ]);

  const handleReserveBook = (title: string) => {
    setReservationNotice(`Hold reservation placed for "${title}". Please collect at the Study Centre Circulation Desk within 24 hours.`);
    setTimeout(() => setReservationNotice(''), 5000);
  };

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
        <div className="bg-gradient-to-r from-[#196855] to-[#196855] text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden border-b-4 border-[#e69912] shadow-xl">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="px-3 py-1 bg-[#e69912] text-black text-xs font-black rounded-full uppercase tracking-wider">
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
                  ? 'bg-[#196855] text-white shadow-md'
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
                  ? 'bg-[#196855] text-white shadow-md'
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
                  ? 'bg-[#196855] text-white shadow-md'
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
                  ? 'bg-[#e69912] text-black shadow-md font-black'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <FileText size={15} />
              <span>IJMB Past Question Papers</span>
            </button>

            <button
              onClick={() => setActiveTab('physical')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'physical'
                  ? 'bg-[#196855] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Bookmark size={15} />
              <span>Physical Catalogue & Circulation</span>
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
                  className="bg-[#F8FAFC] dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#196855] transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-[#196855] dark:text-emerald-300 font-extrabold px-2.5 py-1 rounded-full uppercase">
                        {res.category}
                      </span>
                      <BookOpen size={18} className="text-[#196855]" />
                    </div>

                    <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white group-hover:text-[#196855] transition-colors">
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
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#196855] dark:text-emerald-400 hover:text-[#196855]"
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
                  className="bg-[#F8FAFC] dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#e69912] transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-[#e69912] rounded-xl">
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
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e69912] hover:text-amber-600"
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
                  className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-[#e69912] flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-[#e69912] rounded-xl w-fit">
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
                      className="w-full py-2.5 bg-[#196855] hover:bg-[#196855] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
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

        {/* Tab 5: Physical Book Catalogue & Circulation */}
        {activeTab === 'physical' && (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200 flex justify-between items-center flex-wrap gap-2">
              <div>
                <strong>Study Centre Reading Hall Catalogue:</strong> Physical textbooks, revision manuals, and reference works held on open shelves at the JSS Agyana Road Study Centre.
              </div>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                Standard Loan: 14 Days • Maximum 2 Books
              </span>
            </div>

            {reservationNotice && (
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-500 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#196855] shrink-0" />
                <span>{reservationNotice}</span>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Book Title & Author</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Call Number / Shelf</th>
                    <th className="p-4">ISBN</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4 text-right">Circulation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {physicalBooks
                    .filter(b => searchQuery === '' || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(b => (
                      <tr key={b.isbn} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="p-4">
                          <span className="font-bold text-slate-900 dark:text-white block">{b.title}</span>
                          <span className="text-[11px] text-slate-500">{b.author}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {b.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">{b.callNumber}</span>
                          <span className="text-[10px] text-slate-400">{b.shelfLocation}</span>
                        </td>
                        <td className="p-4 font-mono text-slate-500 text-[10px]">{b.isbn}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              b.availableCopies > 0
                                ? 'bg-emerald-100 text-[#196855]'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {b.availableCopies} of {b.totalCopies} Available
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleReserveBook(b.title)}
                            disabled={b.availableCopies <= 0}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors cursor-pointer ${
                              b.availableCopies > 0
                                ? 'bg-[#196855] hover:bg-[#196855] text-white shadow-xs'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            Place Book Hold
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
