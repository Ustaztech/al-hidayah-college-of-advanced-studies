import React, { useState } from 'react';
import { Compass, MapPin, Building, ShieldCheck, CheckCircle2, Award, Camera } from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const VirtualTour: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('lecture-hall');

  const tourLocations = [
    {
      id: 'orientation-podium',
      name: 'Official Study Centre Dais & Academic Dais (Abaji)',
      category: 'Official Ceremonies',
      description: 'The official AHCAS podium at JSS Agyana Road, Abaji, where academic leadership delivers matriculation addresses, orientation directives, and code of conduct inductions.',
      image: '/ahcas-orientation-podium-full.jpg',
      highlights: [
        'Accredited IJMB Dais & Institutional Crest',
        'Directorate Address & Guidance Stage',
        'Study Centre Governance & Briefing Hub',
        'Matriculation & Oath Induction Venue'
      ]
    },
    {
      id: 'matriculated-assembly',
      name: 'Matriculated 2026/2027 Student Cohort Assembly',
      category: 'Student Body & Cohort',
      description: 'The newly enrolled student cohort gathered at the study centre for academic orientation, code of conduct instruction, and syllabus pacing overview.',
      image: '/ahcas-orientation-students-cohort.jpg',
      highlights: [
        'Enrolled Candidates for 200 Level Direct Entry',
        'Interactive Student-Lecturer Engagement',
        'Dedicated Study Schedules & Mentorship',
        'Continuous Assessment Readiness'
      ]
    },
    {
      id: 'lecture-hall',
      name: 'Interactive IJMB Lecture Hall (Agyana Road, Abaji)',
      category: 'Academic Facilities',
      description: 'Dedicated modern lecture hall located at the JSS Agyana Road Study Centre, Abaji Abuja. Fully arranged with lecture seating, whiteboard instruction facilities, and monitored academic ambiance for A-Level delivery.',
      image: '/ahcas-classroom-lecture.jpg',
      highlights: [
        'Dedicated IJMB Direct Entry Lecture Facility',
        'FCT Higher Education Inspection Approved',
        'Organized Seating & Focus Ambiance',
        'Certified Subject Specialists on Site'
      ]
    },
    {
      id: 'student-cohort',
      name: 'AHCAS Student Cohort & Academic Assembly',
      category: 'Student Body & Cohort',
      description: 'The vibrant student community of Al-Hidayah College of Advanced Studies, demonstrating scholarship, discipline, and shared commitment toward university Direct Entry admission.',
      image: '/ahcas-student-cohort.jpg',
      highlights: [
        'Enrolled IJMB Candidates Across Arts, Sciences & Social Sciences',
        'Academic Advisory & Peer Study Groups',
        'High Standards of Conduct & Ethics',
        'Mentorship by Seasoned Lecturers'
      ]
    },
    {
      id: 'classrooms',
      name: 'Dedicated IJMB Intensive Lecture Classrooms',
      category: 'Classroom Facilities',
      description: 'Modern, well-ventilated lecture rooms optimized for IJMB syllabus coverage, tutorial sessions, continuous assessments, and direct student-lecturer engagement.',
      image: '/ahcas-students-learning.jpg',
      highlights: [
        'Interactive Student Engagement',
        'Daily Scheduled Contact Hours',
        'Regular Progress Assessments',
        'Personalized Academic Tutoring'
      ]
    },
    {
      id: 'tutorials',
      name: 'Direct Entry Academic Coaching & Joint Sessions',
      category: 'Lecture Sessions',
      description: 'Spacious lecture sessions delivering rigorous curriculum across Physics, Chemistry, Biology, Mathematics, Government, Literature, Accounting, and Economics.',
      image: '/ahcas-lecture-session.jpg',
      highlights: [
        'Subject-Specific Problem Solving',
        'Past IJMB Question Review & Modeling',
        'Dedicated Syllabus Completion Milestones',
        'Continuous Assessment Documentation'
      ]
    },
    {
      id: 'instruction',
      name: 'Standardized Subject Coaching & Boardwork',
      category: 'Instructional Methodology',
      description: 'Detailed board-level instructional delivery breaking down complex concepts for candidates preparing for the national ABU IJMB examinations.',
      image: '/ahcas-class-instruction.jpg',
      highlights: [
        'Structured Formula & Derivation Breakdowns',
        'Interactive Q&A with Senior Tutors',
        'Standardized IJMB Marking Scheme Training',
        'Practical Laboratory Preparation Support'
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
            <MapPin size={16} className="text-[#196855]" />
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
                  ? 'bg-[#196855] text-white shadow-lg scale-102'
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
              <span className="text-xs font-black text-[#196855] dark:text-emerald-400 uppercase tracking-widest block">
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
                    <CheckCircle2 size={15} className="text-[#196855] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Study Centre Code: <strong>AHCAS/ABJ/01</strong></span>
              <span className="text-[#196855] dark:text-emerald-400 font-bold">Inspection Ready</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
