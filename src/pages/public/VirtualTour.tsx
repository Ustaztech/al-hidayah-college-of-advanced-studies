import React, { useState } from 'react';
import { Compass, MapPin, Building, ShieldCheck, CheckCircle2, Award, Camera } from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const VirtualTour: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('study-centre');

  const tourLocations = [
    {
      id: 'study-centre',
      name: 'JSS Agyana Road Study Centre (Abaji)',
      category: 'Academic Study Facilities',
      description: 'Official AHCAS IJMB academic study centre located on Agyana Road, Abaji Abuja. Features dedicated lecture rooms, administrative units, and external inspection readiness in collaboration with the FCT Department of Higher Education.',
      image: '/liaison-officer-study-centre.jpg',
      highlights: [
        'Dedicated IJMB Lecture Classrooms',
        'FCT Higher Education Inspection Approved',
        'Quiet, Secure Academic Environment',
        'Direct Access from Main Abaji Arterial Road'
      ]
    },
    {
      id: 'secretariat',
      name: 'Administrative Directorate & Coordinator Office',
      category: 'Secretariat & Registry',
      description: 'Administrative command room where Dr. MB Suleiman (Executive Chairman) and Mall. Ibrahim Idris Gambo (Centre Coordinator) oversee admissions processing, candidate records, and curriculum delivery.',
      image: '/coordinator-with-director.jpg',
      highlights: [
        'Registry Documentation & Verification Desk',
        'Executive Leadership Consultation Suite',
        'Official Candidate Physical Filing Vault',
        'Biometric & Verification Terminal'
      ]
    },
    {
      id: 'cbt',
      name: '200-Seater CBT Examination Hub',
      category: 'ICT Infrastructure',
      description: 'High-performance computer laboratory equipped with modern desktop workstations, gigabit network connectivity, UPS solar power backups, and server-timed examination monitoring systems.',
      image: '/african-cbt-lab.jpg',
      highlights: [
        '200 Synchronous Testing Terminals',
        'Dedicated Solar & UPS Backup Power',
        'Air-Conditioned CBT Hall',
        'Server Monitoring Control Room'
      ]
    },
    {
      id: 'campus',
      name: 'Abaji Academic Lawn & Campus Pavilions',
      category: 'Campus Grounds',
      description: 'Serene academic surroundings in Abaji Area Council, Federal Capital Territory, designed for focused A-Level scholarship and student study groups.',
      image: '/african-campus-hero.jpg',
      highlights: [
        'Solar Powered Illumination',
        'Campus High-Speed Wi-Fi Zone',
        'Modern Outdoor Study Amphitheaters',
        'Secure 24/7 Gated Perimeter'
      ]
    },
    {
      id: 'convocation',
      name: 'Convocation Arena & University Transition Square',
      category: 'Matriculation & Convocation',
      description: 'Where AHCAS candidates celebrate their academic success and receive their certified IJMB statements of results for Direct Entry (200 Level) placement into universities across Nigeria.',
      image: '/african-graduation.jpg',
      highlights: [
        'Convocation Ceremonial Arena',
        'Alumni Transition Secretariat',
        'Direct Entry Placement Guidance Desk',
        'Annual Matriculation Ceremonial Grounds'
      ]
    }
  ];

  const currentLocation = tourLocations.find(l => l.id === selectedLocation) || tourLocations[0];

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 rounded-full text-xs font-black mb-2 border border-amber-300/50">
              <Camera size={14} className="text-[#F58220]" />
              <span>Campus Visual Walkthrough</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white">
              Explore Al-Hidayah College Facilities
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Inspect our physical study centre, administrative offices, computer laboratories, and academic facilities across Abaji Area Council, FCT Abuja.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <MapPin size={16} className="text-[#006B35]" />
            <span className="font-bold">{INSTITUTION_INFO.studyCentre}</span>
          </div>
        </div>

        {/* Location Selector Tabs */}
        <div className="flex flex-wrap gap-2.5">
          {tourLocations.map(loc => (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(loc.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                selectedLocation === loc.id
                  ? 'bg-[#006B35] text-white shadow-lg scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{loc.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Location Viewer Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-xl border-2 border-slate-200 dark:border-slate-700 relative group bg-black">
            <img
              src={currentLocation.image}
              alt={currentLocation.name}
              className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-3 left-3 px-3 py-1 bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase rounded-full border border-amber-400/40">
              {currentLocation.category}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-xs font-black text-[#006B35] dark:text-emerald-400 uppercase tracking-widest block">
                {currentLocation.category}
              </span>
              <h2 className="text-2xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">
                {currentLocation.name}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {currentLocation.description}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                Key Facility Highlights:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentLocation.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
                    <CheckCircle2 size={15} className="text-[#006B35] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Study Centre Code: <strong>AHCAS/ABJ/01</strong></span>
              <span className="text-[#006B35] dark:text-emerald-400 font-bold">Inspection Ready</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
