import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Calendar, ArrowRight, Megaphone, Bell } from 'lucide-react';

interface HeroProps {
  onOpenScratchCardModal?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const slides = [
    {
      title: 'AHCAS Student Orientation & Induction Ceremony',
      subtitle: 'Official academic orientation and code of conduct induction for newly enrolled IJMB Direct Entry candidates.',
      image: '/ahcas-director-orientation-address.jpg',
      fallback: '/ahcas-orientation-speech.jpg',
      alt: 'AHCAS Student Orientation and Induction Ceremony'
    },
    {
      title: 'Enrolled 2026/2027 Student Cohort',
      subtitle: 'Disciplined and ambitious minds embarking on the 12-month accelerated pathway to 200 Level university admission.',
      image: '/ahcas-orientation-students-cohort.jpg',
      fallback: '/ahcas-student-cohort.jpg',
      alt: 'Al-Hidayah College Student Cohort in Lecture Hall'
    },
    {
      title: 'Study Centre Leadership & Administration',
      subtitle: 'Dedicated academic guidance and accredited study centre governance at JSS Agyana Road, Abaji.',
      image: '/ahcas-coordinator-podium.jpg',
      fallback: '/ahcas-orientation-podium-full.jpg',
      alt: 'AHCAS Centre Coordinator at the Official Podium'
    },
    {
      title: 'Interactive IJMB Lecture Session',
      subtitle: 'Structured A-Level learning and dedicated tutorial guidance across Sciences, Arts, and Management disciplines.',
      image: '/ahcas-classroom-lecture.jpg',
      fallback: '/campus-gate.jpg',
      alt: 'Interactive IJMB Lecture Session at Al-Hidayah College'
    },
    {
      title: 'Academic Induction & Code of Conduct',
      subtitle: 'Fostering academic excellence, moral discipline, and direct university placement readiness.',
      image: '/ahcas-orientation-speech.jpg',
      fallback: '/ahcas-director-orientation-address.jpg',
      alt: 'Orientation Speech at Al-Hidayah College'
    },
    {
      title: 'Focused Academic Classroom Environment',
      subtitle: 'Subject-matter mastery coordinated directly with the Ahmadu Bello University (ABU) Zaria IJMB syllabus.',
      image: '/ahcas-students-learning.jpg',
      fallback: '/ahcas-class-instruction.jpg',
      alt: 'Focused Academic Classroom Environment'
    }
  ];

  const topNews = [
    {
      id: 'admission-open',
      title: 'IJMB 2026/2027 Admissions Open',
      date: 'Academic Session 2026/2027',
      image: '/ahcas-director-orientation-address.jpg',
      fallback: '/hero-graduate.jpg',
      link: '/apply',
      badge: 'Apply Now'
    },
    {
      id: 'orientation-held',
      title: 'Orientation for Newly Enrolled Students',
      date: 'Induction Milestone',
      image: '/ahcas-orientation-students-cohort.jpg',
      fallback: '/campus-gate.jpg',
      link: '/news',
      badge: 'View Brief'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/programmes/ijmb?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section
      className="pt-0 select-none"
      style={{ background: 'linear-gradient(180deg, #196855 0%, #2a7c67 35%, #F4F6F5 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8">
        
        {/* Top Ticker & Search Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
          {/* Announcement Bar */}
          <div className="w-full md:w-3/4 overflow-hidden text-xs text-white/95 font-medium flex items-center gap-2.5 bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15 shadow-sm">
            <span className="inline-flex items-center gap-1.5 bg-[#e69912] text-white px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider shrink-0 shadow-xs">
              <Megaphone size={12} className="text-white animate-pulse" />
              Notice
            </span>
            <div className="truncate text-white/90">
              Welcome to Al-Hidayah College of Advanced Studies - IJMB A-Level 200 Level Direct Entry & Citi Poly ND/HND Admissions Open!
            </div>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="Search programmes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 hover:bg-white/20 focus:bg-white text-white focus:text-gray-900 placeholder:text-white/70 focus:placeholder:text-gray-400 text-xs px-3.5 py-2 rounded border border-white/60 focus:border-[#e69912] focus:outline-none transition-all pr-9 shadow-inner"
            />
            <button
              type="submit"
              aria-label="Submit Search"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-white hover:text-[#e69912] transition-colors"
            >
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* Main Grid: 10-Col Slider + 2-Col Right News */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Main Slider (10 cols on desktop) */}
          <div className="lg:col-span-9 xl:col-span-10 relative">
            <div className="relative rounded-md overflow-hidden bg-black shadow-2xl border-[5px] border-white aspect-[16/9] sm:aspect-[21/10] max-h-[460px] group">
              {slides.map((s, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={s.image}
                    alt={s.alt}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = s.fallback;
                    }}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Overlay Gradient & Caption */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-6 text-white flex flex-col justify-end">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#e69912] mb-1">
                      Al-Hidayah College Campus
                    </span>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold font-serif leading-tight">
                      {s.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-200 mt-1 max-w-2xl line-clamp-2">
                      {s.subtitle}
                    </p>
                  </div>
                </div>
              ))}

              {/* Prev / Next Controls */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                aria-label="Previous Slide"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#e69912] text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                aria-label="Next Slide"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#e69912] text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-3 right-4 z-20 flex items-center space-x-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSlide ? 'w-6 bg-[#e69912]' : 'w-2 bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Top News and Events Minor Column (2 cols / 3 cols on xl) */}
          <div className="lg:col-span-3 xl:col-span-2 space-y-3">
            <Link
              to="/news"
              className="w-full btn-fill-white py-2 text-xs font-bold uppercase tracking-wider text-center block shadow-sm"
            >
              Top News and Events
            </Link>

            <div className="space-y-3">
              {topNews.map((news) => (
                <div
                  key={news.id}
                  className="card-view overflow-hidden hover:shadow-lg transition-shadow bg-white text-gray-800"
                >
                  <div className="relative aspect-[16/10] bg-gray-100">
                    <img
                      src={news.image}
                      alt={news.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = news.fallback;
                      }}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-[#196855] text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      Updates
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-xs text-[#196855] leading-snug line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 font-medium">
                      <Calendar size={11} className="text-[#196855]" />
                      <span>{news.date}</span>
                    </p>
                    <div className="mt-2.5 flex justify-end">
                      <Link
                        to={news.link}
                        className="bg-[#e69912] hover:bg-[#c98207] text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors"
                      >
                        {news.badge}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
