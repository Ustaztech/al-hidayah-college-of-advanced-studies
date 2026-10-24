import React from 'react';
import { Link } from 'react-router-dom';
import { NEWS_DATA } from '../../data/news';
import { Newspaper, Calendar, User, ArrowRight } from 'lucide-react';

export const NewsPreview: React.FC = () => {
  return (
    <section className="py-16 bg-[#F3F6F3] dark:bg-[#12181F] border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#D4A62A] uppercase tracking-wider block mb-1">
              Campus Updates
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif tracking-tight">
              Latest News & Institutional Announcements
            </h2>
          </div>
          <Link
            to="/news"
            className="flex items-center gap-1 text-sm font-bold text-[#006B35] dark:text-emerald-400 hover:underline"
          >
            <span>View All News Articles</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS_DATA.map(n => (
            <div
              key={n.id}
              className="bg-white dark:bg-[#1A222C] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-[#006B35] dark:text-emerald-400 font-bold">
                    {n.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar size={13} />
                    <span>{n.publishDate}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white font-serif group-hover:text-[#006B35] dark:group-hover:text-emerald-400 transition-colors mb-2 leading-snug">
                  {n.title}
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {n.summary}
                </p>
              </div>

              <div className="p-4 px-6 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium flex items-center gap-1">
                  <User size={12} />
                  {n.author}
                </span>
                <Link
                  to={`/news/${n.slug}`}
                  className="font-bold text-[#006B35] dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
