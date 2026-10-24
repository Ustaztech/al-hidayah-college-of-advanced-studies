import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Search, X, BookOpen, Newspaper, FileText, ArrowRight } from 'lucide-react';
import { PROGRAMMES_DATA } from '../../data/programmes';
import { NEWS_DATA } from '../../data/news';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useAccessibility();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isSearchOpen) return null;

  const filteredProgrammes = query.trim()
    ? PROGRAMMES_DATA.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.department.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredNews = query.trim()
    ? NEWS_DATA.filter(n => n.title.toLowerCase().includes(query.toLowerCase()) || n.summary.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleNavigate = (path: string) => {
    setIsSearchOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-16 px-4 animate-fade-in">
      <div className="bg-white dark:bg-[#1A222C] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <Search size={20} className="text-[#006B35] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search programmes, admission requirements, news..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-base text-gray-900 dark:text-gray-100 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Results */}
        <div className="p-6 max-h-[420px] overflow-y-auto space-y-6">
          {!query.trim() && (
            <div className="text-center py-8">
              <BookOpen size={36} className="mx-auto text-gray-300 dark:text-gray-700 mb-2" />
              <p className="text-sm font-semibold text-gray-500">Type a keywords like "Computer Science", "IJMB", "Scratch Card", or "Accreditation"</p>
              <div className="mt-4 flex justify-center flex-wrap gap-2 text-xs">
                <button onClick={() => setQuery('Computer Science')} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-emerald-50">ND Computer Science</button>
                <button onClick={() => setQuery('IJMB')} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-emerald-50">IJMB Direct Entry</button>
                <button onClick={() => setQuery('Accreditation')} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-emerald-50">NBTE Accreditation</button>
              </div>
            </div>
          )}

          {filteredProgrammes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <BookOpen size={14} className="text-[#006B35]" />
                Matching Programmes ({filteredProgrammes.length})
              </h4>
              <div className="space-y-2">
                {filteredProgrammes.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleNavigate(`/programmes/${p.slug}`)}
                    className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer flex justify-between items-center group transition-colors"
                  >
                    <div>
                      <span className="font-bold text-sm text-[#006B35] dark:text-emerald-400 block">{p.title}</span>
                      <span className="text-xs text-gray-500">{p.department} • {p.duration}</span>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-[#006B35] transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredNews.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <Newspaper size={14} className="text-[#D4A62A]" />
                News & Announcements ({filteredNews.length})
              </h4>
              <div className="space-y-2">
                {filteredNews.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleNavigate(`/news/${n.slug}`)}
                    className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer flex justify-between items-center group transition-colors"
                  >
                    <div>
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100 block">{n.title}</span>
                      <span className="text-xs text-gray-500">{n.publishDate} • {n.category}</span>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-[#D4A62A] transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {query.trim() && filteredProgrammes.length === 0 && filteredNews.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No matching records found for "{query}". Try checking our <button onClick={() => handleNavigate('/faqs')} className="text-[#006B35] underline">FAQs section</button>.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
