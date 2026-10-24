import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const RectorWelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('ahcas_official_welcome_seen_v2');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('ahcas_official_welcome_seen_v2', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 flex flex-col max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/30 transition-all hover:scale-110 shadow-lg cursor-pointer"
          aria-label="Close welcome modal"
          title="Close Modal"
        >
          <X size={22} className="text-white" />
        </button>

        {/* Modal Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto flex-1">
          
          {/* Executive Chairman Portrait */}
          <div className="md:col-span-5 relative bg-slate-950 flex flex-col justify-end min-h-[280px] md:min-h-[460px] overflow-hidden">
            <img
              src="/provost-mbsuleiman.jpg"
              alt="Dr. MB Suleiman, PhD (Magajin Ilimin Abaji)"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-95 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="relative z-10 p-5 space-y-1 bg-black/80 backdrop-blur-md border-t border-[#D4A62A]/40">
              <span className="text-[10px] bg-[#D4A62A] text-black font-extrabold px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                Executive Chairman & Founder
              </span>
              <h4 className="font-extrabold text-sm sm:text-base text-white font-serif leading-tight mt-1">
                Dr. MB Suleiman, PhD
              </h4>
              <p className="text-[11px] text-amber-200 font-bold uppercase tracking-wider">
                Magajin Ilimin Abaji
              </p>
              <p className="text-[10px] text-slate-300 italic font-serif">
                “Enlightening Minds, Building Nations”
              </p>
            </div>
          </div>

          {/* Right Column: Institutional Message */}
          <div className="md:col-span-7 bg-gradient-to-br from-[#004D26] via-[#006B35] to-[#0F172A] p-6 sm:p-8 flex flex-col justify-between text-white relative">
            
            {/* Watermark Crest */}
            <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-10 pointer-events-none">
              <img src="/official-logo.jpg" alt="" className="w-72 h-72 object-contain" />
            </div>

            <div className="space-y-4 relative z-10 pr-6">
              
              {/* Header */}
              <div className="flex items-center gap-3">
                <img
                  src="/official-logo.jpg"
                  alt="Official Logo"
                  className="h-12 w-auto bg-white p-0.5 rounded-xl border border-amber-300 shadow-md"
                />
                <div>
                  <h3 className="font-black text-base sm:text-lg font-serif tracking-tight leading-none text-white">
                    AL-HIDAYAH COLLEGE
                  </h3>
                  <p className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider">
                    Of Advanced Studies, Abaji FCT Abuja
                  </p>
                </div>
              </div>

              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-400/50 rounded-full text-xs text-amber-200 font-bold">
                <Sparkles size={13} className="text-amber-300" />
                <span>Advancing Academic Excellence Through Structured A-Level Education</span>
              </div>

              {/* Message */}
              <div className="space-y-3 text-xs sm:text-sm text-emerald-50 leading-relaxed font-sans">
                <p className="font-medium text-white italic text-sm">
                  “No capable student should be denied higher education due to systemic limitations.”
                </p>
                <p>
                  Welcome to Al-Hidayah College of Advanced Studies, Abaji. Our Interim Joint Matriculation Board (IJMB) Programme provides a proven, nationally recognized pathway that leads directly to <strong>200 Level admission into Nigerian universities</strong> and international institutions without UTME bottlenecks.
                </p>
                <p className="text-xs text-emerald-200">
                  Operating in collaboration with Sam Ale College of Advanced Studies, FCT Mass Agency for Education, and Department of Higher Education under the academic framework of Ahmadu Bello University (ABU).
                </p>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5 p-2 bg-black/30 rounded-lg border border-white/10">
                  <Check size={14} className="text-[#D4A62A]" />
                  <span>Direct 200L Admission</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-black/30 rounded-lg border border-white/10">
                  <Check size={14} className="text-[#D4A62A]" />
                  <span>JAMB Moderated & ABU Aligned</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-black/30 rounded-lg border border-white/10">
                  <Check size={14} className="text-[#D4A62A]" />
                  <span>73 Approved Subject Combinations</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-black/30 rounded-lg border border-white/10">
                  <Check size={14} className="text-[#D4A62A]" />
                  <span>Study Centre at JSS Agyana Rd</span>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3 relative z-10">
              <Link
                to="/apply/register"
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4A62A] hover:bg-[#b88d1d] text-black font-extrabold rounded-xl text-xs shadow-lg transition-transform hover:scale-105"
              >
                <span>Apply for 2026/2027 Diet</span>
                <ArrowRight size={14} />
              </Link>

              <button
                onClick={handleClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Continue to Website
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
