import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import { Home, Compass, GraduationCap, Phone, Search, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/programmes?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Crest & Error Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-950/50 text-[#e69912] font-black text-xs uppercase tracking-widest rounded-full">
            <span>HTTP 404 • Page Not Located</span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-black font-serif text-[#196855] dark:text-emerald-400 tracking-tight">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
            Resource or Document Not Found
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            The page, administrative portal, or digital file you are searching for does not exist on the {INSTITUTION_INFO.shortName} server, or may have been repositioned in our latest academic portal update.
          </p>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search programmes, admissions, or topics..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-24 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#196855] shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#196855] hover:bg-[#124d3f] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#196855] hover:bg-[#124d3f] text-white text-xs font-bold rounded-xl transition-colors shadow-md"
          >
            <Home size={16} />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/portals"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e69912] hover:bg-[#d48806] text-white text-xs font-bold rounded-xl transition-colors shadow-md"
          >
            <Compass size={16} />
            <span>E-Portals Directory</span>
          </Link>
        </div>

        {/* Recommended Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-6 border-t border-slate-200 dark:border-slate-800">
          <Link
            to="/apply"
            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#196855] transition-colors"
          >
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Admissions</span>
            <span className="text-[11px] text-slate-500">Apply for IJMB</span>
          </Link>
          <Link
            to="/student"
            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#196855] transition-colors"
          >
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Student Portal</span>
            <span className="text-[11px] text-slate-500">Course & Grades</span>
          </Link>
          <Link
            to="/academic-calendar"
            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#196855] transition-colors"
          >
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Calendar</span>
            <span className="text-[11px] text-slate-500">Key 2026/27 Dates</span>
          </Link>
          <Link
            to="/contact"
            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#196855] transition-colors"
          >
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Support Desk</span>
            <span className="text-[11px] text-slate-500">Inquire & Help</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
