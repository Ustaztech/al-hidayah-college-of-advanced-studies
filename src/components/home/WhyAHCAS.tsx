import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ShieldCheck, Cpu, Users, Briefcase, CalendarCheck } from 'lucide-react';

export const WhyAHCAS: React.FC = () => {
  const whyCards = [
    {
      title: 'Academic Excellence',
      icon: GraduationCap,
      text: 'Programmes delivered by qualified and experienced professionals committed to student success in direct university entry and technical diplomas.'
    },
    {
      title: 'Moral and Discipline',
      icon: ShieldCheck,
      text: 'An institution that fosters discipline, respect, responsibility, ethical conduct, and dedicated service to humanity.'
    },
    {
      title: 'Proven Track Record',
      icon: CalendarCheck,
      text: 'Students acquire practical competence that improves their higher education progression and direct employment prospects.'
    },
    {
      title: 'Facilities',
      icon: Cpu,
      text: 'Training that promotes self-reliance and enterprise creation, equipped with modern e-library, science laboratories and e-learning facilities.'
    },
    {
      title: 'Qualified Staffing',
      icon: Users,
      text: 'Comprehensive academic mentorship systems with credentialed faculty holding minimum Masters Degree qualifications in relevant fields.'
    },
    {
      title: 'Hands-on Practicals',
      icon: Briefcase,
      text: 'Professional Skills: practical competence relevant to workplace requirements. Digital Literacy: ability to use technology effectively in academic and professional contexts.'
    }
  ];

  return (
    <section
      className="py-16 relative bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(17, 78, 63, 0.88), rgba(25, 104, 85, 0.92)), url('https://alhidayahcollege.com/uploads/264C8D4E27C1/frontend_image/library.jpg')`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with distinct text shadow matching alhidayahcollege.com */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-serif tracking-tight"
            style={{ textShadow: '2px 2px 4px rgba(80, 20, 10, 0.8)' }}
          >
            Why Us?
          </h2>
          <div className="w-16 h-1 bg-[#e69912] mx-auto mt-3 rounded"></div>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="card-view p-6 text-center flex flex-col justify-between hover:-translate-y-1 transition-transform duration-200 border-t-4 border-[#e69912]"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#196855]/10 text-[#196855] flex items-center justify-center mx-auto mb-3.5 shadow-xs border border-[#196855]/15">
                    <Icon size={26} className="text-[#196855]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#196855] font-serif mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-justify">
                    {card.text}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
                  <Link
                    to="/about"
                    className="text-xs font-bold text-[#e69912] hover:text-[#c98207] transition-colors"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyAHCAS;
