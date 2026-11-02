import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ZoomIn, Download, X, ArrowRight, Sparkles, Building, Award, Users, BookOpen } from 'lucide-react';

export interface MediaItem {
  id: string;
  title: string;
  category: 'orientation' | 'academics' | 'publications';
  badge: string;
  image: string;
  fallback?: string;
  description: string;
  date?: string;
  isFlyer?: boolean;
}

export const CampusGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orientation' | 'academics' | 'publications'>('orientation');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const galleryItems: MediaItem[] = [
    // 1. Orientation & Induction Real Photos (Uploaded Assets)
    {
      id: 'director-orientation-address',
      title: 'Director Academic Address & Orientation 2026/2027',
      category: 'orientation',
      badge: 'Induction Ceremony',
      image: '/ahcas-director-orientation-address.jpg',
      fallback: '/ahcas-orientation-speech.jpg',
      description: 'Official welcome address by the College Directorate at the AHCAS Study Centre podium, setting academic benchmarks and code of conduct for the matriculated IJMB Direct Entry candidates.',
      date: '2026/2027 Session'
    },
    {
      id: 'orientation-students-cohort',
      title: 'Matriculated IJMB Student Cohort in Assembly',
      category: 'orientation',
      badge: 'Enrolled Candidates',
      image: '/ahcas-orientation-students-cohort.jpg',
      fallback: '/ahcas-student-cohort.jpg',
      description: 'Dedicated student body seated attentively during the 2026/2027 orientation lecture, beginning their intensive 12-month accelerated journey toward 200 Level university admission.',
      date: '2026/2027 Session'
    },
    {
      id: 'coordinator-podium-address',
      title: 'Study Centre Coordinator Speaking at Official Podium',
      category: 'orientation',
      badge: 'Centre Leadership',
      image: '/ahcas-coordinator-podium.jpg',
      fallback: '/ahcas-orientation-podium-full.jpg',
      description: 'Centre Coordinator addressing newly admitted candidates, detailing study schedules, IJMB curriculum compliance, and examination protocols at JSS Agyana Road, Abaji.',
      date: '2026/2027 Session'
    },
    {
      id: 'orientation-lecture-speech',
      title: 'Orientation Lecture on Academic Excellence & Ethics',
      category: 'orientation',
      badge: 'Moral & Study Guidance',
      image: '/ahcas-orientation-speech.jpg',
      fallback: '/ahcas-director-orientation-address.jpg',
      description: 'Orientation presentation emphasizing disciplined study routines, continuous assessment tracking, and moral character required for university placement.',
      date: '2026/2027 Session'
    },
    {
      id: 'orientation-podium-full',
      title: 'Official AHCAS Abaji Study Centre Dais & Crest',
      category: 'orientation',
      badge: 'Official Dais',
      image: '/ahcas-orientation-podium-full.jpg',
      fallback: '/ahcas-orientation-speech.jpg',
      description: 'The college podium with official AHCAS seal during the induction proceedings for newly enrolled IJMB Direct Entry students.',
      date: '2026/2027 Session'
    },

    // 2. Classrooms & Academic Facilities
    {
      id: 'classroom-lecture-hall',
      title: 'Interactive IJMB Lecture Session',
      category: 'academics',
      badge: 'Academic Facility',
      image: '/ahcas-classroom-lecture.jpg',
      fallback: '/campus-gate.jpg',
      description: 'Engaged teaching and discussion during an advanced level tutorial session in the college lecture hall.',
      date: 'Lecture Series'
    },
    {
      id: 'students-learning-focus',
      title: 'Focused Academic Classroom Learning',
      category: 'academics',
      badge: 'Student Scholarship',
      image: '/ahcas-students-learning.jpg',
      fallback: '/ahcas-class-instruction.jpg',
      description: 'Students actively working on syllabus coursework and collaborative problem-solving across science and humanities subjects.',
      date: 'Study Hall'
    },
    {
      id: 'board-instruction-coaching',
      title: 'Standardized Subject Instruction & Boardwork',
      category: 'academics',
      badge: 'Instructional Delivery',
      image: '/ahcas-class-instruction.jpg',
      fallback: '/ahcas-lecture-session.jpg',
      description: 'Senior tutors breaking down complex concepts according to the Ahmadu Bello University (ABU) IJMB curriculum.',
      date: 'Subject Mastery'
    },
    {
      id: 'cbt-testing-facility',
      title: 'Computer-Based Testing (CBT) Center',
      category: 'academics',
      badge: 'E-Testing Lab',
      image: '/african-cbt-lab.jpg',
      fallback: '/campus-gate.jpg',
      description: 'Modern networked terminal facility configured for mock assessments, electronic result checking, and computer practice.',
      date: 'ICT Infrastructure'
    },

    // 3. Official Publications & Notice Archives (Moved Flyers)
    {
      id: 'flyer-admission-open',
      title: 'Admission Now Open 2026/2027 Campaign Notice',
      category: 'publications',
      badge: 'Official Circular',
      image: '/ahcas-flyer-admission-now-open.jpg',
      description: 'Official admission notice detailing 200 Level Direct Entry opportunities and general eligibility guidelines.',
      date: '2026/2027 Circular',
      isFlyer: true
    },
    {
      id: 'flyer-next-chapter',
      title: 'Your Next Academic Chapter: IJMB Program Brochure',
      category: 'publications',
      badge: 'Programme Brief',
      image: '/ahcas-flyer-next-academic-chapter-ijmb.jpg',
      description: 'Advisory publication explaining the 12-month Direct Entry A-Level pathway without JAMB UTME bottleneck.',
      date: 'Brochure',
      isFlyer: true
    },
    {
      id: 'flyer-school-reopening',
      title: 'School Re-Opening & Resumption Notice',
      category: 'publications',
      badge: 'Academic Notice',
      image: '/ahcas-flyer-school-reopening.jpg',
      description: 'Official schedule release for semester resumption, student hostel check-in, and commencement of lectures.',
      date: 'Notice Board',
      isFlyer: true
    },
    {
      id: 'flyer-start-with-question',
      title: 'Advisory Guidance: Start with a Question',
      category: 'publications',
      badge: 'Admissions Advisory',
      image: '/ahcas-flyer-start-with-a-question.jpg',
      description: 'Guidance leaflet on selecting the optimal 3-subject combination matching your preferred university course.',
      date: 'Advisory Leaflet',
      isFlyer: true
    },
    {
      id: 'flyer-academic-step',
      title: 'Take the Next Academic Step: Subject Combinations',
      category: 'publications',
      badge: 'Guidance Circular',
      image: '/ahcas-flyer-academic-step.jpg',
      description: 'Summary guide detailing available university degree faculties and their respective IJMB combinations.',
      date: 'Guidance Doc',
      isFlyer: true
    },
    {
      id: 'flyer-thinking-ijmb',
      title: 'Strategic Direct Entry Information Sheet',
      category: 'publications',
      badge: 'Info Sheet',
      image: '/ahcas-flyer-thinking-ijmb.jpg',
      description: 'Comprehensive overview of Ahmadu Bello University affiliation, grading metrics, and direct entry admission criteria.',
      date: 'Information Sheet',
      isFlyer: true
    },
    {
      id: 'flyer-make-room',
      title: 'Institutional Mission: Make Room for Your Future',
      category: 'publications',
      badge: 'Institutional Brand',
      image: '/ahcas-flyer-make-room.jpg',
      description: 'Statement of core academic values, ethical standards, and student life expectations at Al-Hidayah College.',
      date: 'Institutional Poster',
      isFlyer: true
    },
    {
      id: 'flyer-parents-guardians',
      title: 'Parent & Sponsor Advisory Brochure',
      category: 'publications',
      badge: 'Parent Advisory',
      image: '/ahcas-flyer-parents-guardians.jpg',
      description: 'Advisory handbook for parents outlining continuous academic tracking, bursary installment schedules, and hostel safety.',
      date: 'Parent Advisory',
      isFlyer: true
    }
  ];

  const filteredItems = galleryItems.filter(item => item.category === activeTab);

  return (
    <section className="py-14 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-gray-100 dark:border-slate-800 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-[#196855]/30 rounded-full text-xs font-bold text-[#196855] dark:text-emerald-400">
              <Camera size={14} className="text-[#e69912]" />
              <span>Campus Life & Institutional Media</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#196855] dark:text-emerald-400 font-serif tracking-tight">
              Life at Al-Hidayah College
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300">
              Authentic visual documentation of our students, lecture facilities, academic orientation, and accredited study centre in Abaji, FCT Abuja.
            </p>
          </div>

          {/* Navigation to Full Gallery */}
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#196855] hover:bg-[#145646] text-white text-xs font-bold transition-all shadow-sm group"
          >
            <span>Explore Complete Gallery</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('orientation')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orientation'
                ? 'bg-[#196855] text-white shadow-md'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200'
            }`}
          >
            <Users size={14} />
            <span>Orientation & Induction (Real Photos)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'orientation' ? 'bg-amber-400 text-slate-900 font-black' : 'bg-gray-200 dark:bg-slate-700'
            }`}>
              5
            </span>
          </button>

          <button
            onClick={() => setActiveTab('academics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'academics'
                ? 'bg-[#196855] text-white shadow-md'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200'
            }`}
          >
            <BookOpen size={14} />
            <span>Classrooms & Labs</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'academics' ? 'bg-amber-400 text-slate-900 font-black' : 'bg-gray-200 dark:bg-slate-700'
            }`}>
              4
            </span>
          </button>

          <button
            onClick={() => setActiveTab('publications')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'publications'
                ? 'bg-[#196855] text-white shadow-md'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200'
            }`}
          >
            <Sparkles size={14} />
            <span>Publications & Circular Archives</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'publications' ? 'bg-amber-400 text-slate-900 font-black' : 'bg-gray-200 dark:bg-slate-700'
            }`}>
              8
            </span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
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
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>

                {/* Hover Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-[#e69912] text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                    <ZoomIn size={22} />
                  </div>
                </div>

                {item.date && (
                  <div className="absolute bottom-3 right-3 text-[10px] font-semibold text-white/90 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
                    {item.date}
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#196855] dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-[#196855] dark:text-emerald-400 font-bold">
                  <span>{item.isFlyer ? 'Download Notice' : 'View Full Image'}</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[#e69912] flex items-center justify-center transition-colors shadow-lg"
              aria-label="Close Preview"
            >
              <X size={20} />
            </button>

            {/* Media Image */}
            <div className="relative max-h-[68vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="max-h-[68vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Details Footer */}
            <div className="p-6 bg-gradient-to-r from-[#196855] to-[#145646] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
                  {selectedItem.badge} • {selectedItem.date || 'Al-Hidayah College'}
                </span>
                <h4 className="font-extrabold text-base sm:text-lg font-serif">
                  {selectedItem.title}
                </h4>
                <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={selectedItem.image}
                  download={selectedItem.image.replace('/', '')}
                  className="px-4 py-2 bg-[#e69912] hover:bg-[#c98207] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CampusGallery;
