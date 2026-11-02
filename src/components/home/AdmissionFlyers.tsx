import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, X, ArrowRight, Sparkles, Filter, PhoneCall } from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

interface FlyerItem {
  id: string;
  title: string;
  category: 'admission' | 'advisory';
  tag: string;
  image: string;
  description: string;
  targetAudience: string;
  link: string;
  linkLabel: string;
}

export const AdmissionFlyers: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'admission' | 'advisory'>('all');
  const [selectedFlyer, setSelectedFlyer] = useState<FlyerItem | null>(null);

  const flyers: FlyerItem[] = [
    {
      id: 'admission-now-open',
      title: 'Admission Now Open 2026/2027',
      category: 'admission',
      tag: 'New Session Enrolment',
      image: '/ahcas-flyer-admission-now-open.jpg',
      description: 'Your next chapter starts here. Enquire about available accredited programmes, entry requirements, and secure your direct university pathway.',
      targetAudience: 'Prospective 200L Direct Entry Candidates',
      link: '/apply',
      linkLabel: 'Apply Online Now'
    },
    {
      id: 'next-academic-chapter-ijmb',
      title: 'Your Next Academic Chapter: IJMB',
      category: 'admission',
      tag: 'ABU Affiliated IJMB',
      image: '/ahcas-flyer-next-academic-chapter-ijmb.jpg',
      description: 'Enquire about subjects, eligibility, and application requirements. Direct Entry admission into 200 Level in federal and state universities without JAMB UTME stress.',
      targetAudience: 'Secondary School Graduates & IJMB Seekers',
      link: '/programmes',
      linkLabel: 'Explore IJMB Programme'
    },
    {
      id: 'school-reopening',
      title: 'School Re-Opening & Resumption',
      category: 'advisory',
      tag: 'Official Notice',
      image: '/ahcas-flyer-school-reopening.jpg',
      description: 'Ready for a new chapter. Prepare to learn, connect, and grow. Contact the college to confirm the re-opening date, hostel arrangements, and orientation schedules.',
      targetAudience: 'Returning & Admitted Students',
      link: '/news',
      linkLabel: 'View Notice Board'
    },
    {
      id: 'start-with-question',
      title: 'Start with a Question',
      category: 'advisory',
      tag: 'Advisory & Helpdesk',
      image: '/ahcas-flyer-start-with-a-question.jpg',
      description: 'Ask our dedicated admission counsellors about available programmes, course combinations, study fees, and the step-by-step application process.',
      targetAudience: 'Applicants, Parents & Guardians',
      link: '/contact',
      linkLabel: 'Make an Enquiry'
    },
    {
      id: 'academic-step',
      title: 'Take the Next Academic Step',
      category: 'admission',
      tag: 'IJMB Enrolment',
      image: '/ahcas-flyer-academic-step.jpg',
      description: 'Explore your study options, subject combinations, entry requirements, and application guidance for Direct Entry 200 Level university admission.',
      targetAudience: 'Secondary School Leavers & JAMB Candidates',
      link: '/apply',
      linkLabel: 'Start Registration'
    },
    {
      id: 'thinking-ijmb',
      title: 'Thinking About IJMB?',
      category: 'admission',
      tag: 'Strategic Direct Entry',
      image: '/ahcas-flyer-thinking-ijmb.jpg',
      description: 'Get total clarity on the 73 IJMB subject triplets, Ahmadu Bello University affiliation standards, and seamless transition to federal/state universities.',
      targetAudience: 'Prospective Undergraduates',
      link: '/admissions/requirements',
      linkLabel: 'View 73 Combinations'
    },
    {
      id: 'make-room',
      title: 'Make Room for Your Future',
      category: 'advisory',
      tag: 'Academic Excellence',
      image: '/ahcas-flyer-make-room.jpg',
      description: 'Developing the Best Minds for the Future through disciplined scholarship, continuous assessment, and hands-on laboratory coaching in Abaji, FCT Abuja.',
      targetAudience: 'Science, Arts & Social Science Students',
      link: '/student-life',
      linkLabel: 'Explore Campus Life'
    },
    {
      id: 'parents-guardians',
      title: 'Plan the Next Step Together',
      category: 'advisory',
      tag: 'Parents & Guardians',
      image: '/ahcas-flyer-parents-guardians.jpg',
      description: 'Guidance and advisory for parents and sponsors on academic tracking, fee installment plans, student accommodation, and university admission certainty.',
      targetAudience: 'Parents, Guardians & Community Sponsors',
      link: '/parent-portal',
      linkLabel: 'Parents Advisory Portal'
    }
  ];

  const filteredFlyers = selectedCategory === 'all' 
    ? flyers 
    : flyers.filter(f => f.category === selectedCategory);

  return (
    <section className="py-14 bg-white border-b border-gray-200 selection:bg-[#196855] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-gray-200 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-[#196855]/30 rounded-full text-xs font-bold text-[#196855]">
              <Sparkles size={14} className="text-[#e69912]" />
              <span>Official Institutional Publications & Flyers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#196855] font-serif tracking-tight">
              Admission Notices & Campaign Flyers
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Download and review our official 2026/2027 institutional flyers, campaign brochures, and guidance notices for prospective IJMB candidates, parents, and guardians.
            </p>
          </div>

          {/* Action & Filter Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-semibold">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#196855] text-white shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                All Publications ({flyers.length})
              </button>
              <button
                onClick={() => setSelectedCategory('admission')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === 'admission'
                    ? 'bg-[#196855] text-white shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Admissions & IJMB
              </button>
              <button
                onClick={() => setSelectedCategory('advisory')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === 'advisory'
                    ? 'bg-[#196855] text-white shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Notices & Advisory
              </button>
            </div>

            <a
              href={`tel:${INSTITUTION_INFO.phone}`}
              className="px-4 py-2 bg-[#196855] text-white rounded-xl text-xs font-bold hover:opacity-90 flex items-center gap-2 shadow-xs transition-all"
            >
              <PhoneCall size={14} />
              <span>Helpdesk: {INSTITUTION_INFO.phone}</span>
            </a>
          </div>
        </div>

        {/* 8 Flyers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFlyers.map((flyer) => (
            <div
              key={flyer.id}
              className="card-view rounded-2xl overflow-hidden border border-gray-200 hover:border-[#196855] transition-all duration-300 hover:shadow-xl flex flex-col group bg-[#F4F6F5]"
            >
              {/* Image Preview Container */}
              <div
                className="relative aspect-[4/5] bg-gray-100 overflow-hidden cursor-pointer"
                onClick={() => setSelectedFlyer(flyer)}
              >
                <img
                  src={flyer.image}
                  alt={flyer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#196855] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                  {flyer.tag}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white text-[#196855] flex items-center justify-center shadow-lg hover:bg-[#e69912] hover:text-white transition-colors">
                    <Eye size={18} />
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#e69912] tracking-wider block">
                    {flyer.targetAudience}
                  </span>
                  <h3 className="font-bold text-sm text-[#196855] font-serif mt-0.5 line-clamp-1">
                    {flyer.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-snug">
                    {flyer.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedFlyer(flyer)}
                    className="text-xs font-bold text-[#196855] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Flyer</span>
                    <Eye size={13} />
                  </button>

                  <Link
                    to={flyer.link}
                    className="text-xs font-bold text-[#e69912] hover:text-[#c98207] flex items-center gap-1"
                  >
                    <span>{flyer.linkLabel}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedFlyer && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedFlyer(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-[#196855] text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-amber-300">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base font-serif leading-tight">
                    {selectedFlyer.title}
                  </h4>
                  <span className="text-[11px] text-amber-300 font-medium">{selectedFlyer.tag} • Al-Hidayah College</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedFlyer(null)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-[#e69912] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Flyer Image View */}
            <div className="flex-1 overflow-y-auto bg-slate-900 p-2 flex items-center justify-center">
              <img
                src={selectedFlyer.image}
                alt={selectedFlyer.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Modal Action Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3 shrink-0">
              <p className="text-xs text-gray-600 max-w-xs sm:max-w-md">
                {selectedFlyer.description}
              </p>

              <div className="flex items-center gap-2">
                <a
                  href={selectedFlyer.image}
                  download={selectedFlyer.image.replace('/', '')}
                  className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download size={14} />
                  <span>Download Flyer</span>
                </a>

                <Link
                  to={selectedFlyer.link}
                  onClick={() => setSelectedFlyer(null)}
                  className="px-4 py-1.5 bg-[#196855] hover:opacity-90 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                >
                  <span>{selectedFlyer.linkLabel}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdmissionFlyers;
