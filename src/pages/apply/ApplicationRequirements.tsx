import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PROGRAMMES_DATA } from '../../data/programmes';
import { BookOpen, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const ApplicationRequirements: React.FC = () => {
  const navigate = useNavigate();

  const [appType, setAppType] = useState<'ND' | 'HND' | 'IJMB' | 'Professional'>('ND');
  const [selectedProgId, setSelectedProgId] = useState<string>('nd-cs');
  const [showDetail, setShowDetail] = useState<boolean>(true);

  const filteredProgrammes = PROGRAMMES_DATA.filter(p => {
    if (appType === 'ND') return p.category === 'ND';
    if (appType === 'HND') return p.category === 'HND';
    if (appType === 'IJMB') return p.category === 'IJMB';
    return p.category === 'Professional';
  });

  const selectedProgramme = PROGRAMMES_DATA.find(p => p.id === selectedProgId) || filteredProgrammes[0] || PROGRAMMES_DATA[0];

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDetail(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Background Image with Dark Overlay (UNILAG Style) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/african-campus-hero.jpg"
          alt="AHCAS Campus"
          className="w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-slate-950"></div>
      </div>

      {/* Top Header Bar (UNILAG Style) */}
      <header className="relative z-20 bg-white dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <img
            src="/ahcas-crest.jpg"
            alt="AHCAS Crest"
            className="h-12 w-auto object-contain bg-white p-1 rounded-xl border border-slate-300"
          />
          <div>
            <h1 className="text-lg font-black font-serif text-[#006B35] dark:text-emerald-400 leading-none">
              Al-Hidayah College of Advanced Studies
            </h1>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Programme Entry Requirements
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-sm font-bold text-slate-800 dark:text-slate-200">
          <Link to="/apply" className="hover:text-[#006B35] dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <Link to="/apply/requirements" className="text-[#006B35] dark:text-emerald-400 hover:underline">
            Requirements
          </Link>
          <Link to="/" className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border hover:bg-slate-200">
            Main Campus Website →
          </Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-4 py-12 flex flex-col justify-center items-center w-full">
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Card 1: Selection Form (UNILAG Screenshot 3) */}
          <div className={`bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-900 border border-slate-200 ${showDetail ? 'lg:col-span-5' : 'lg:col-span-6 mx-auto'}`}>
            
            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Programme requirements
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Select a programme to see the requirements
              </p>
            </div>

            <form onSubmit={handleContinue} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Application type
                </label>
                <select
                  value={appType}
                  onChange={e => {
                    const newType = e.target.value as any;
                    setAppType(newType);
                    const progs = PROGRAMMES_DATA.filter(p => p.category === newType);
                    if (progs.length > 0) setSelectedProgId(progs[0].id);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#006B35] focus:border-[#006B35]"
                >
                  <option value="ND">Undergraduate (National Diploma)</option>
                  <option value="HND">Higher National Diploma (HND)</option>
                  <option value="IJMB">IJMB Direct Entry (1-Year University Pathway)</option>
                  <option value="Professional">Professional Certifications</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Programme
                </label>
                <select
                  value={selectedProgId}
                  onChange={e => setSelectedProgId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#006B35] focus:border-[#006B35]"
                >
                  {filteredProgrammes.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#006B35] hover:bg-[#004D26] text-white font-extrabold rounded-xl text-xs shadow-md transition-all mt-2"
              >
                Continue
              </button>
            </form>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Ready to apply?</span>
              <Link
                to="/apply/register"
                className="text-xs font-extrabold text-[#006B35] hover:underline flex items-center gap-1"
              >
                <span>Start Application</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>

          {/* Card 2: Detailed Requirements View */}
          {showDetail && selectedProgramme && (
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-900 border border-slate-200 animate-fade-in space-y-6">
              
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-mono font-extrabold text-[#006B35] uppercase tracking-wider block">
                  ENTRY SPECIFICATION • {selectedProgramme.category} PROGRAMME
                </span>
                <h3 className="text-2xl font-black font-serif text-slate-900 mt-1">
                  {selectedProgramme.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Faculty of {selectedProgramme.department} • AHCAS Abaji
                </p>
              </div>

              {/* Programme Outline */}
              <div className="space-y-2">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Programme Outline
                </h4>
                <div className="space-y-1 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block">Duration</span>
                  <p className="text-slate-600">This programme runs for {selectedProgramme.duration || '4 semesters (2 Academic Years)'}.</p>
                </div>
              </div>

              {/* UTME Entry Requirements */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-sm font-extrabold text-slate-900">
                  UTME Entry Requirements
                </h4>
                <p className="text-xs text-slate-500">The applicant must have:</p>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-800">
                    UTME Cut-off & Subject Combination:
                  </div>
                  <p className="text-slate-700 leading-relaxed font-sans">
                    Minimum score of <strong>140+</strong> in 2026 JAMB UTME. Passes in <strong>ENGLISH LANGUAGE, MATHEMATICS, PHYSICS, CHEMISTRY</strong>, and any other 1 science or social science subject.
                  </p>
                </div>
              </div>

              {/* WASSCE / NECO SSCE Requirements */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-sm font-extrabold text-slate-900">
                  WASSCE / NECO SSCE / NABTEB Requirements
                </h4>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p className="text-slate-700 leading-relaxed font-sans">
                    Minimum of <strong>5 Credit passes</strong> in <strong>ENGLISH LANGUAGE, MATHEMATICS, PHYSICS, CHEMISTRY, BIOLOGY / FURTHER MATHEMATICS / COMPUTER STUDIES</strong> obtained at not more than two (2) sittings.
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/apply/register"
                  className="px-6 py-3 bg-[#006B35] hover:bg-[#004D26] text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>Apply Now For This Programme</span>
                </Link>
                <Link
                  to="/apply"
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border"
                >
                  Back to Portal Home
                </Link>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 px-6 border-t border-slate-800 text-center text-xs text-slate-400 bg-slate-950">
        © {new Date().getFullYear()} Al-Hidayah College of Advanced Studies (AHCAS), Abaji, FCT Abuja.
      </footer>

    </div>
  );
};
