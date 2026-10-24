import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Award,
  Users,
  Building,
  GraduationCap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const Hero: React.FC<{ onOpenScratchCardModal: () => void }> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'AL-HIDAYAH COLLEGE OF ADVANCED STUDIES',
      subtitle: 'Pioneering Research. Transforming the Future.',
      ribbon: 'The Citadel of Learning...',
      motto: '“Enlightening Minds, Building Nations”',
      stats: [
        { icon: Users, label: 'Approved Combinations', value: '73 Courses' },
        { icon: Award, label: 'Most Subscribed Centre', value: 'No 1 in Abaji' },
        { icon: Building, label: 'Academic Study Centre', value: 'JSS Agyana Rd' },
        { icon: GraduationCap, label: 'Direct Entry Pathway', value: '200 Level' }
      ],
      image: '/hero-graduate.jpg',
      imageAlt: 'AHCAS University Graduate Student'
    },
    {
      title: 'IJMB A-LEVEL & DIRECT ENTRY PROGRAMME',
      subtitle: 'Fast-Track University Admission without JAMB UTME.',
      ribbon: 'Academic Excellence & Moral Discipline...',
      motto: '“Developing the Best Minds for the Future”',
      stats: [
        { icon: ShieldCheck, label: 'CAC Registration', value: `RC ${INSTITUTION_INFO.rcNumber}` },
        { icon: Award, label: 'Tuition Flexibility', value: '2 Installments' },
        { icon: BookOpen, label: 'OER Digital Library', value: '8 Databases' },
        { icon: Building, label: 'Main Secretariat', value: 'MBS Close, Abaji' }
      ],
      image: '/campus-gate.jpg',
      imageAlt: 'AHCAS Campus Gate Architectural Entrance'
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative overflow-hidden bg-[#2D0A12] border-b-4 border-[#C98B18] select-none text-white shadow-2xl">
      
      {/* Background African / Islamic Geometric Motif Watermark */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 215, 0, 0.4) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 215, 0, 0.4) 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Subtle Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E060C] via-[#3B0D18] to-[#120306] opacity-95" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 min-h-[500px] flex flex-col justify-between">
        
        {/* Carousel Circular Left Navigation Buttons (Exact Match to Image 1) */}
        <div className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
          <button
            onClick={prevSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E51E2B] hover:bg-[#c9121e] active:scale-95 text-white flex items-center justify-center shadow-2xl border-2 border-white/20 transition-all cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} className="stroke-[3]" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E51E2B] hover:bg-[#c9121e] active:scale-95 text-white flex items-center justify-center shadow-2xl border-2 border-white/20 transition-all cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight size={24} className="stroke-[3]" />
          </button>
        </div>

        {/* Top/Middle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pl-12 sm:pl-16">
          
          {/* Left Text Column */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Crest Badge */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-gradient-to-b from-[#E5A823] to-[#B47B14] rounded-xl shadow-lg border border-amber-200/40">
                <img
                  src="/official-logo.jpg"
                  alt="AHCAS Official Crest"
                  className="h-14 sm:h-16 w-auto object-contain bg-white rounded-lg p-0.5"
                />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-black text-amber-300 block">
                  Official Institution Portal • RC: {INSTITUTION_INFO.rcNumber}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Approved QA Manual: {INSTITUTION_INFO.documentCode}
                </span>
              </div>
            </div>

            {/* Monumental Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-white leading-tight uppercase drop-shadow-md">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-200 font-medium tracking-wide">
              {slide.subtitle}
            </p>

            {/* Gold Serif Ribbon: "The Citadel of Learning..." (Exact Match to Image 1) */}
            <div className="relative inline-block my-2">
              <div className="bg-gradient-to-r from-[#DDA734] via-[#F3C85C] to-[#C49121] text-[#2D0A12] px-6 sm:px-10 py-2 sm:py-2.5 rounded-lg shadow-xl border-t border-b-2 border-amber-100 flex items-center gap-3 font-serif italic text-lg sm:text-2xl font-black tracking-wide">
                <span>{slide.ribbon}</span>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/apply"
                className="flex items-center gap-2 px-6 py-3 bg-[#E5A823] hover:bg-[#c99015] text-slate-950 font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all active:scale-95"
              >
                <span>Apply for 2026/2027</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/student/dashboard"
                className="flex items-center gap-2 px-5 py-3 bg-[#006B35] hover:bg-[#004D26] text-white font-bold rounded-xl text-xs sm:text-sm border border-emerald-400 shadow-xl transition-all active:scale-95"
              >
                <GraduationCap size={16} />
                <span>Student Portal</span>
              </Link>
              <Link
                to="/admissions/requirements"
                className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all"
              >
                <span>View 73 Combinations</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Hero Graduate Student (Exact Match to Image 1) */}
          <div className="lg:col-span-4 relative flex justify-center lg:justify-end">
            <div className="relative w-72 sm:w-80 lg:w-96 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-[#C98B18]/70 bg-[#1A050A]">
              <img
                src={slide.image}
                alt={slide.imageAlt}
                className="w-full h-full object-cover object-top filter brightness-105 contrast-105 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 text-center">
                <span className="text-xs font-bold text-amber-300 block">
                  Al-Hidayah College of Advanced Studies
                </span>
                <span className="text-[10px] text-slate-300">
                  Developing the Best Minds for the Future
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM STATISTICS RIBBON (EXACT MATCH TO IMAGE 1) */}
        {/* ========================================================================= */}
        <div className="mt-8 pt-4 pl-12 sm:pl-16">
          <div className="bg-gradient-to-r from-[#170308]/90 via-[#27060E]/95 to-[#170308]/90 border-2 border-[#DDA734] rounded-2xl p-3 sm:p-4 shadow-2xl relative">
            
            {/* "OUR STATISTICS" Header Banner */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#DDA734] via-[#F3C85C] to-[#C49121] text-[#2D0A12] px-6 py-0.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
              OUR STATISTICS
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {slide.stats.map((st, i) => {
                const Icon = st.icon;
                return (
                  <div key={i} className="flex items-center gap-3 justify-center text-left">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#E5A823] to-[#A87410] text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                      <Icon size={18} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="block text-[10px] sm:text-[11px] text-slate-300 font-semibold leading-tight">
                        {st.label}
                      </span>
                      <span className="block text-sm sm:text-base font-black text-amber-300 font-sans tracking-tight">
                        {st.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
