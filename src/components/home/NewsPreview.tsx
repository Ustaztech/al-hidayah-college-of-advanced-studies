import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, GraduationCap, Bell } from 'lucide-react';

export const NewsPreview: React.FC = () => {
  const newsItems = [
    {
      id: 'admission-open-2026-2027',
      title: 'Admission Open for 2026-2027',
      category: 'Admissions Open',
      icon: GraduationCap,
      iconColor: 'text-[#196855]',
      iconBg: 'bg-emerald-50 border-emerald-200',
      badgeColor: 'bg-[#196855] text-white',
      date: 'Academic Session 2026/2027',
      dateIconColor: 'text-[#196855]',
      borderTop: 'border-t-4 border-[#196855]',
      summary: 'This is to bring to the notice of the general public that our admission application for 2026-2027 academic session is currently active for IJMB Direct Entry 200 Level and Citi Polytechnic accredited National Diplomas.',
      image: '/ahcas-director-orientation-address.jpg',
      fallback: '/hero-graduate.jpg',
      link: '/apply'
    },
    {
      id: 'school-re-opening',
      title: 'SCHOOL RE-OPENING',
      category: 'School Resumption',
      icon: Bell,
      iconColor: 'text-[#e69912]',
      iconBg: 'bg-amber-50 border-amber-200',
      badgeColor: 'bg-[#e69912] text-white',
      date: 'Commencement of Lectures',
      dateIconColor: 'text-[#e69912]',
      borderTop: 'border-t-4 border-[#e69912]',
      summary: 'This is to inform the students, parents, faculty, and the general public that the College is fully prepared for the resumption of academic lectures, orientation workshops, and laboratory training sessions.',
      image: '/ahcas-orientation-students-cohort.jpg',
      fallback: '/campus-gate.jpg',
      link: '/news'
    }
  ];

  return (
    <section className="py-14 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#196855]"></span>
            <span className="text-xs font-black uppercase tracking-wider text-[#196855]">
              Institutional Announcements
            </span>
          </div>
          <h3 className="p-title text-xl sm:text-2xl font-bold font-serif text-[#196855]">
            News and Events Highlights
          </h3>
        </div>

        {/* 2-Column Grid matching platform theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {newsItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className={`card-view p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 rounded-xl bg-white ${item.borderTop}`}
              >
                <div>
                  <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4 bg-gray-100 relative group">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = item.fallback;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider shadow-md ${item.badgeColor}`}>
                        <IconComponent size={12} />
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${item.iconBg}`}>
                      <IconComponent size={14} className={item.iconColor} />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-[#196855] font-serif leading-snug">
                      <Link to={item.link} className="hover:text-[#e69912] transition-colors">
                        {item.title}
                      </Link>
                    </h4>
                  </div>

                  <div className="text-[11px] text-gray-500 mb-3 flex items-center gap-1.5 pl-0.5">
                    <Calendar size={13} className={item.dateIconColor} />
                    <span className="font-medium">{item.date}</span>
                  </div>

                  <div className="h-[1px] bg-gray-100 mb-3" />

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-justify">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#196855] hover:bg-[#135344] rounded-lg shadow-xs hover:shadow transition-all group"
                  >
                    <span>Read on</span>
                    <ArrowRight size={13} className="text-[#e69912] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* More News Button */}
        <div className="text-center mt-10">
          <Link
            to="/news"
            className="btn-fill-primary px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            More News Posts...
          </Link>
        </div>

      </div>
    </section>
  );
};

export default NewsPreview;
