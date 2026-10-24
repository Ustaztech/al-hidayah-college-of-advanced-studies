import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { NEWS_DATA } from '../../data/news';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const article = NEWS_DATA.find(n => n.slug === slug) || NEWS_DATA[0];

  return (
    <div className="py-12 bg-white dark:bg-[#1A222C] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link to="/news" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#006B35]">
          <ArrowLeft size={14} />
          Back to Newsroom
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="px-3 py-1 bg-[#006B35] text-white font-bold rounded-full">
              {article.category}
            </span>
            <span>Published: {article.publishDate}</span>
            <span>• By {article.author}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-gray-900 dark:text-white leading-tight">
            {article.title}
          </h1>
        </div>

        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-l-4 border-[#006B35] rounded-r-xl text-sm italic text-gray-800 dark:text-gray-200">
          {article.summary}
        </div>

        <div className="prose dark:prose-invert max-w-none text-sm text-gray-800 dark:text-gray-200 space-y-4 leading-relaxed font-sans whitespace-pre-line">
          {article.content}
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-xs">
          <span className="text-gray-500">Official Release • Al-Hidayah College of Advanced Studies, Abaji</span>
          <button onClick={() => alert('Article link copied to clipboard!')} className="flex items-center gap-1 text-[#006B35] font-bold">
            <Share2 size={14} />
            <span>Share Article</span>
          </button>
        </div>

      </div>
    </div>
  );
};
