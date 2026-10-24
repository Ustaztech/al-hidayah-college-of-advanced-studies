import React from 'react';
import { ACADEMIC_CALENDAR_DATA } from '../../data/calendar';
import { Calendar, Clock, Tag } from 'lucide-react';

export const CalendarPreview: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-[#1A222C] border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 rounded-full text-xs font-bold mb-2">
            <Calendar size={14} />
            <span>Academic Schedule</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif tracking-tight">
            2026/2027 Academic Calendar Preview
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Key semester timelines, matriculation dates, continuous assessment schedules, and examination periods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACADEMIC_CALENDAR_DATA.map(ev => (
            <div
              key={ev.id}
              className="p-5 bg-[#F3F6F3] dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start gap-4"
            >
              <div className="p-3 bg-[#006B35] text-white rounded-xl text-center shrink-0 min-w-[70px]">
                <Clock size={16} className="mx-auto text-amber-300 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-300">
                  {ev.category}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#006B35] dark:text-emerald-400 block mb-0.5">
                  {ev.date}
                </span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white font-serif leading-snug">
                  {ev.title}
                </h3>
                <span className="text-[10px] text-gray-500 font-medium inline-block mt-1 bg-white dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">
                  {ev.semester}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
