import React, { useState } from 'react';
import { FlaskConical, Cpu, ExternalLink, ShieldCheck, CheckCircle2, Play, Sparkles, MonitorCheck, Beaker } from 'lucide-react';
import { ELABORATORY_INFO, INSTITUTION_INFO } from '../../data/ijmbData';

export const Laboratory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'virtual' | 'physical'>('virtual');
  const [selectedSim, setSelectedSim] = useState('physics');

  return (
    <div className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#004D26] to-[#006B35] text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden border-b-4 border-[#F58220] shadow-xl">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="px-3 py-1 bg-[#F58220] text-white text-xs font-black rounded-full uppercase tracking-wider">
              STEM Laboratories & Practical Infrastructure
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
              AHCAS E-Laboratory & Physical Science Labs
            </h1>
            <p className="text-sm text-emerald-100 font-serif italic">
              Interactive STEM Simulations (JavaLab) & Dedicated Laboratories for A-Level Physics, Chemistry, and Biology
            </p>
            <p className="text-xs text-amber-200">
              Mandatory minimum 3 hours/week physical laboratory work required for all science candidates under IJMB syllabus regulations.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('virtual')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'virtual'
                ? 'bg-[#006B35] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FlaskConical size={16} />
            <span>Interactive Virtual E-Lab (JavaLab)</span>
          </button>

          <button
            onClick={() => setActiveTab('physical')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'physical'
                ? 'bg-[#006B35] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Cpu size={16} />
            <span>Physical Laboratories & CBT Hub</span>
          </button>
        </div>

        {/* Virtual Laboratory Tab (JavaLab) */}
        {activeTab === 'virtual' && (
          <div className="space-y-8">
            <div className="bg-[#F8FAFC] dark:bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-300">
                  <Sparkles size={13} className="text-[#F58220]" />
                  <span>Official Virtual STEM Portal: JavaLab</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-900 dark:text-white">
                  Interactive Science Simulations
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  The AHCAS E-Laboratory provides simulated practical experiments in Physics, Chemistry, Biology, and Earth Sciences directly via <strong>JavaLab</strong>. Students can manipulate laboratory parameters, observe real-time molecular interactions, and run virtual titrations and circuit tests.
                </p>

                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {ELABORATORY_INFO.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#006B35] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={ELABORATORY_INFO.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#006B35] hover:bg-[#004D26] text-white text-xs font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
                  >
                    <Play size={15} />
                    <span>Launch JavaLab Simulator (External)</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Simulation Categories Card */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-serif flex items-center gap-2">
                  <Beaker className="text-[#006B35]" size={18} />
                  <span>Explore Subject Modules</span>
                </h3>

                <div className="space-y-2">
                  {[
                    { id: 'physics', name: 'Physics Simulations', desc: 'Mechanics, Newton laws, Optics, Electromagnetism', link: 'https://javalab.org/en/category/physics_en/' },
                    { id: 'chemistry', name: 'Chemistry Laboratory', desc: 'Periodic Table, Molecular structures, Chemical reactions', link: 'https://javalab.org/en/category/chemistry_en/' },
                    { id: 'biology', name: 'Biology Simulations', desc: 'Genetics, Cell Division, Photosynthesis, Ecosystems', link: 'https://javalab.org/en/category/biology_en/' },
                    { id: 'earth', name: 'Earth Science & Astronomy', desc: 'Atmosphere, Planetary motion, Plate tectonics', link: 'https://javalab.org/en/category/earth_science_en/' }
                  ].map((cat, i) => (
                    <a
                      key={i}
                      href={cat.link}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#006B35] hover:bg-emerald-50/40 dark:hover:bg-slate-800 transition-all group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#006B35]">
                          {cat.name}
                        </span>
                        <ExternalLink size={12} className="text-slate-400 group-hover:text-[#006B35]" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</p>
                    </a>
                  ))}
                </div>

                <div className="text-[11px] text-slate-400 text-center pt-2">
                  Link verified from Institutional Manual Page 2
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Physical Laboratory Tab */}
        {activeTab === 'physical' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 bg-[#F8FAFC] dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-[#006B35] dark:text-emerald-300 rounded-2xl w-fit">
                  <Cpu size={26} />
                </div>
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                  200-Seater Computer & CBT Examination Centre
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  High-performance desktop workstations, gigabit local area network architecture, dedicated solar & UPS uninterrupted power supply, and continuous examination server monitoring.
                </p>
                <div className="pt-2 text-xs font-semibold text-[#006B35] dark:text-emerald-400">
                  ✓ High-speed Internet • ✓ Air-conditioned testing terminals
                </div>
              </div>

              <div className="p-6 bg-[#F8FAFC] dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="p-3 bg-amber-100 dark:bg-amber-950 text-[#D4A62A] rounded-2xl w-fit">
                  <FlaskConical size={26} />
                </div>
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                  Dedicated Science Laboratories (Physics, Chemistry, Biology)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Equipped with optical microscopes, chemical analytical balances, autoclaves, spectrometry apparatus, and practical experimentation benches meeting ABU and JAMB moderating standards.
                </p>
                <div className="pt-2 text-xs font-semibold text-[#D4A62A]">
                  ✓ 3 Hours/Week Mandatory Lab Practicals • ✓ Safety Compliance Audited
                </div>
              </div>

            </div>

            {/* Study Centre Inspection Info */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6">
              <img
                src="/liaison-officer-study-centre.jpg"
                alt="FCT Higher Education Inspection at Study Centre"
                className="w-full md:w-64 h-44 object-cover rounded-2xl border-2 border-emerald-600 shadow-md"
              />
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Study Centre Readiness
                </span>
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                  JSS Agyana Road Study Centre, Abaji Abuja
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Laboratory infrastructure and classroom facilities are maintained to support statutory inspection readiness with the FCT Department of Higher Education and external moderation by senior university supervisors.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
