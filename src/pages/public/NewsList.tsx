import React from 'react';
import { Link } from 'react-router-dom';
import { NEWS_DATA } from '../../data/news';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';

export const NewsList: React.FC = () => {
  return (
    <div className="py-12 bg-white dark:bg-[#1A222C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
          <span className="text-xs font-bold text-[#e69912] uppercase tracking-wider block mb-1">
            Media & Newsroom
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-gray-900 dark:text-white">
            News, Events & Institutional Press Releases
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Stay informed with the latest updates from Al-Hidayah College of Advanced Studies, Abaji.
          </p>
        </div>

        {/* Featured Urgent Notice: Academic Resumption & Orientation Banner */}
        <div className="bg-gradient-to-r from-[#196855] to-emerald-900 rounded-3xl overflow-hidden shadow-xl text-white grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 max-h-80 overflow-hidden flex items-center justify-center bg-black/40">
            <img
              src="/ahcas-orientation-speech.jpg"
              alt="Orientation Speech & Resumption Address"
              className="w-full h-full object-cover max-h-80 hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-300/40 rounded-full text-amber-300 text-xs font-bold">
              <span>Official Institutional Milestone</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
              College Orientation & Academic Resumption
            </h2>
            <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Al-Hidayah College of Advanced Studies has concluded the orientation program and academic code of conduct induction for the 2026/2027 matriculated IJMB Direct Entry candidates at the Abaji Study Centre.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/gallery"
                className="px-4 py-2 bg-[#e69912] hover:bg-[#c98207] text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                <span>View Ceremony Gallery</span>
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors border border-white/20"
              >
                <span>Contact Academic Registry</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEWS_DATA.map(n => (
            <div
              key={n.id}
              className="bg-[#F3F6F3] dark:bg-gray-800/60 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#196855] dark:text-emerald-300 font-bold">
                    {n.category}
                  </span>
                  <span>{n.publishDate}</span>
                </div>

                <h3 className="text-lg font-bold font-serif text-gray-900 dark:text-white mb-2 leading-snug">
                  {n.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {n.summary}
                </p>
              </div>

              <div className="p-4 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">{n.author}</span>
                <Link to={`/news/${n.slug}`} className="font-bold text-[#196855] dark:text-emerald-400 hover:underline flex items-center gap-1">
                  <span>Read Full Article</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
