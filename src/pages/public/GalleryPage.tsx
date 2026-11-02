import React, { useState } from 'react';
import { Camera, ZoomIn, Download, X, Search, Filter, Sparkles, Users, BookOpen, Building, ChevronLeft, ChevronRight } from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

interface GalleryMediaItem {
  id: string;
  title: string;
  category: 'orientation' | 'academics' | 'facilities' | 'publications';
  badge: string;
  image: string;
  fallback?: string;
  description: string;
  session: string;
  isFlyer?: boolean;
}

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const mediaItems: GalleryMediaItem[] = [
    // Orientation & Induction Photos (Real Uploaded Assets)
    {
      id: 'director-orientation-address',
      title: 'Director Academic Orientation & Welcome Address',
      category: 'orientation',
      badge: 'Induction 2026/2027',
      image: '/ahcas-director-orientation-address.jpg',
      fallback: '/ahcas-orientation-speech.jpg',
      description: 'Official address delivered from the AHCAS dais by College Leadership to the matriculated 2026/2027 IJMB Direct Entry candidates at the Abaji Study Centre.',
      session: '2026/2027 Session'
    },
    {
      id: 'matriculated-cohort-assembly',
      title: 'Matriculated IJMB Student Cohort Induction Session',
      category: 'orientation',
      badge: 'Student Cohort',
      image: '/ahcas-orientation-students-cohort.jpg',
      fallback: '/ahcas-student-cohort.jpg',
      description: 'Enrolled students seated during the orientation lecture on university progression, academic discipline, and course combination guidelines.',
      session: '2026/2027 Session'
    },
    {
      id: 'coordinator-podium-presentation',
      title: 'Study Centre Coordinator Speaking at Official Podium',
      category: 'orientation',
      badge: 'Academic Leadership',
      image: '/ahcas-coordinator-podium.jpg',
      fallback: '/ahcas-orientation-podium-full.jpg',
      description: 'Mall. Ibrahim Idris Gambo, AHCAS Centre Coordinator, briefing newly admitted students on study schedules, syllabus pacing, and continuous assessments.',
      session: '2026/2027 Session'
    },
    {
      id: 'orientation-lecture-delivery',
      title: 'Orientation Lecture on Academic Excellence & Moral Conduct',
      category: 'orientation',
      badge: 'Code of Conduct',
      image: '/ahcas-orientation-speech.jpg',
      fallback: '/ahcas-director-orientation-address.jpg',
      description: 'Senior academic briefing highlighting the core tenets of scholarship, integrity, and direct entry examination requirements.',
      session: '2026/2027 Session'
    },
    {
      id: 'official-podium-crest',
      title: 'Official AHCAS Abaji Study Centre Podium & Institutional Seal',
      category: 'orientation',
      badge: 'Official Dais',
      image: '/ahcas-orientation-podium-full.jpg',
      fallback: '/ahcas-orientation-speech.jpg',
      description: 'The official podium featuring the Al-Hidayah College of Advanced Studies crest and motto during the 2026/2027 orientation ceremony.',
      session: '2026/2027 Session'
    },

    // Academics & Lectures
    {
      id: 'classroom-interactive-lecture',
      title: 'Interactive IJMB Advanced Level Lecture Session',
      category: 'academics',
      badge: 'Lecture Hall',
      image: '/ahcas-classroom-lecture.jpg',
      fallback: '/campus-gate.jpg',
      description: 'Engaged lecture atmosphere with dedicated whiteboard instruction and active student participation in IJMB subjects.',
      session: 'Lecture Series'
    },
    {
      id: 'focused-classroom-learning',
      title: 'Focused Classroom Study & Collaborative Discussion',
      category: 'academics',
      badge: 'Study Room',
      image: '/ahcas-students-learning.jpg',
      fallback: '/ahcas-class-instruction.jpg',
      description: 'Students working through syllabus problems and course materials under guidance from certified subject specialists.',
      session: 'Tutorial Session'
    },
    {
      id: 'board-level-instruction',
      title: 'Standardized Subject Instruction & Board Analysis',
      category: 'academics',
      badge: 'Curriculum Pacing',
      image: '/ahcas-class-instruction.jpg',
      fallback: '/ahcas-lecture-session.jpg',
      description: 'In-depth board derivations aligned with Ahmadu Bello University (ABU) Zaria IJMB examination marking scheme.',
      session: 'Subject Coaching'
    },
    {
      id: 'academic-assembly-cohort',
      title: 'AHCAS Student Academic Assembly & Study Group',
      category: 'academics',
      badge: 'Student Community',
      image: '/ahcas-student-cohort.jpg',
      fallback: '/ahcas-orientation-students-cohort.jpg',
      description: 'Candidates reviewing syllabus milestones and preparing for mid-term continuous assessment tests.',
      session: 'Study Session'
    },

    // Facilities & Campus
    {
      id: 'cbt-computer-lab',
      title: 'Computer-Based Testing (CBT) & Electronic Lab',
      category: 'facilities',
      badge: 'ICT Facility',
      image: '/african-cbt-lab.jpg',
      fallback: '/campus-gate.jpg',
      description: 'High-speed networked ICT computer terminals configured for mock examinations, portal operations, and digital research.',
      session: 'Campus Infrastructure'
    },
    {
      id: 'campus-main-gate',
      title: 'Al-Hidayah College Campus Entrance & Security Post',
      category: 'facilities',
      badge: 'Main Gate',
      image: '/campus-gate.jpg',
      fallback: '/african-campus-hero.jpg',
      description: 'Secure, gated study centre perimeter located along JSS Agyana Road, Abaji Area Council, Abuja.',
      session: 'Campus Environment'
    },
    {
      id: 'administrative-directorate',
      title: 'Administrative Directorate & Registry Command Suite',
      category: 'facilities',
      badge: 'Directorate Office',
      image: '/coordinator-with-director.jpg',
      fallback: '/official-logo.jpg',
      description: 'Executive Chairman and Centre Coordinator coordinating official registration files and study centre governance.',
      session: 'Administration'
    },

    // Official Publications & Circulars (Curated Flyers)
    {
      id: 'flyer-admission-now-open',
      title: 'Admission Now Open 2026/2027 Session Circular',
      category: 'publications',
      badge: 'Official Notice',
      image: '/ahcas-flyer-admission-now-open.jpg',
      description: 'Official notice detailing Direct Entry 200 Level eligibility, subject packages, and registration instructions.',
      session: 'Campaign Circular',
      isFlyer: true
    },
    {
      id: 'flyer-next-academic-chapter',
      title: 'Next Academic Chapter: IJMB Program Brochure',
      category: 'publications',
      badge: 'Admissions Brochure',
      image: '/ahcas-flyer-next-academic-chapter-ijmb.jpg',
      description: 'Comprehensive overview of the 9-12 month accelerated pathway to federal and state universities without JAMB UTME bottleneck.',
      session: 'Official Flyer',
      isFlyer: true
    },
    {
      id: 'flyer-school-reopening',
      title: 'School Re-Opening & Resumption Schedule',
      category: 'publications',
      badge: 'Academic Circular',
      image: '/ahcas-flyer-school-reopening.jpg',
      description: 'Official academic notice announcing commencement of orientation, lectures, and hostel clearance for admitted students.',
      session: 'Notice Board',
      isFlyer: true
    },
    {
      id: 'flyer-start-with-question',
      title: 'Advisory Guidance: Start with a Question',
      category: 'publications',
      badge: 'Helpdesk Advisory',
      image: '/ahcas-flyer-start-with-a-question.jpg',
      description: 'Guidance leaflet on course selection, subject triplets, and career pathways for parents and prospective candidates.',
      session: 'Guidance Leaflet',
      isFlyer: true
    },
    {
      id: 'flyer-academic-step',
      title: 'Take the Next Academic Step: IJMB Subject Combinations',
      category: 'publications',
      badge: 'Combination Sheet',
      image: '/ahcas-flyer-academic-step.jpg',
      description: 'Detailed listing of approved ABU IJMB combinations across Medicine, Engineering, Law, Nursing, and Social Sciences.',
      session: 'Guidance Doc',
      isFlyer: true
    },
    {
      id: 'flyer-thinking-ijmb',
      title: 'Strategic Direct Entry Information Brochure',
      category: 'publications',
      badge: 'Information Sheet',
      image: '/ahcas-flyer-thinking-ijmb.jpg',
      description: 'Brochure detailing national direct entry admission statistics, 16-point scale grading, and university acceptance.',
      session: 'Campaign Flyer',
      isFlyer: true
    },
    {
      id: 'flyer-make-room',
      title: 'Institutional Mission: Make Room for Your Future',
      category: 'publications',
      badge: 'Institutional Brand',
      image: '/ahcas-flyer-make-room.jpg',
      description: 'Institutional values statement on academic rigor, moral character, and lifelong leadership development.',
      session: 'Brand Poster',
      isFlyer: true
    },
    {
      id: 'flyer-parents-guardians',
      title: 'Parents & Guardians Information Guide',
      category: 'publications',
      badge: 'Parent Advisory',
      image: '/ahcas-flyer-parents-guardians.jpg',
      description: 'Detailed handbook on student safety, hostel living conditions, flexible fee installment plans, and monitoring tools.',
      session: 'Parent Advisory',
      isFlyer: true
    }
  ];

  // Filtering
  const filteredMedia = mediaItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const activeItem = activeItemIndex !== null ? filteredMedia[activeItemIndex] : null;

  const handleNext = () => {
    if (activeItemIndex !== null && activeItemIndex < filteredMedia.length - 1) {
      setActiveItemIndex(activeItemIndex + 1);
    } else {
      setActiveItemIndex(0);
    }
  };

  const handlePrev = () => {
    if (activeItemIndex !== null && activeItemIndex > 0) {
      setActiveItemIndex(activeItemIndex - 1);
    } else {
      setActiveItemIndex(filteredMedia.length - 1);
    }
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 transition-colors selection:bg-[#196855] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-[#196855]/30 rounded-full text-xs font-bold text-[#196855] dark:text-emerald-400">
              <Camera size={14} className="text-[#e69912]" />
              <span>Campus Visual Archives & Institutional Media</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white tracking-tight">
              Al-Hidayah College Picture & Media Gallery
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore authentic documentation of our academic orientation, lectures, matriculated students, leadership, and official publications at our accredited study centre ({INSTITUTION_INFO.studyCentre}).
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72 relative shrink-0">
            <input
              type="text"
              placeholder="Filter gallery photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-[#196855] pl-9 shadow-xs"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-[#196855] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>All Media ({mediaItems.length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('orientation')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCategory === 'orientation'
                ? 'bg-[#196855] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Users size={14} />
            <span>Orientation & Induction (Real Photos)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 font-black">
              5
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('academics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCategory === 'academics'
                ? 'bg-[#196855] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <BookOpen size={14} />
            <span>Lectures & Classrooms</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              4
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('facilities')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCategory === 'facilities'
                ? 'bg-[#196855] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Building size={14} />
            <span>Campus & Facilities</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              3
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('publications')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCategory === 'publications'
                ? 'bg-[#196855] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Sparkles size={14} />
            <span>Publications & Circular Archives</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              8
            </span>
          </button>
        </div>

        {/* Media Grid */}
        {filteredMedia.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <Camera size={40} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No media found matching criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search keyword or selecting a different category tab.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-[#196855] text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMedia.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setActiveItemIndex(index)}
                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      if (item.fallback) {
                        (e.currentTarget as HTMLImageElement).src = item.fallback;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[9px] font-bold rounded uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  {/* Zoom indicator on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-[#e69912] text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                      <ZoomIn size={18} />
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 text-[9px] font-medium text-white/90 bg-black/60 px-1.5 py-0.5 rounded">
                    {item.session}
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#196855] dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-[#196855] dark:text-emerald-400 font-bold">
                    <span>{item.isFlyer ? 'Download Notice' : 'View Full Image'}</span>
                    <ZoomIn size={12} className="group-hover:scale-125 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal with Next / Prev */}
      {activeItem && activeItemIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveItemIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl animate-fade-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Close */}
            <div className="p-3 sm:p-4 bg-black/40 flex items-center justify-between border-b border-white/10 text-white">
              <span className="text-xs font-bold text-amber-300">
                Photo {activeItemIndex + 1} of {filteredMedia.length}
              </span>
              <button
                onClick={() => setActiveItemIndex(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e69912] flex items-center justify-center text-white transition-colors"
                aria-label="Close Preview"
              >
                <X size={18} />
              </button>
            </div>

            {/* Media Image with Next/Prev Overlay */}
            <div className="relative max-h-[70vh] min-h-[40vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                aria-label="Previous Photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#e69912] text-white flex items-center justify-center shadow-lg transition-colors"
              >
                <ChevronLeft size={22} />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                aria-label="Next Photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#e69912] text-white flex items-center justify-center shadow-lg transition-colors"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Details Footer */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#196855] to-[#145646] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest">
                  {activeItem.badge} • {activeItem.session}
                </span>
                <h3 className="font-extrabold text-base sm:text-lg font-serif">
                  {activeItem.title}
                </h3>
                <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={activeItem.image}
                  download={activeItem.image.replace('/', '')}
                  className="px-4 py-2 bg-[#e69912] hover:bg-[#c98207] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <Download size={14} />
                  <span>Download High-Res</span>
                </a>
                <button
                  onClick={() => setActiveItemIndex(null)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
