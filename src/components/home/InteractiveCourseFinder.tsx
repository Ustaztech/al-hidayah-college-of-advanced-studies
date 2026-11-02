import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  GraduationCap,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

interface CareerTrack {
  career: string;
  category: 'Sciences & Health' | 'Law & Arts' | 'Management & Social Sciences' | 'Engineering & Technology';
  code: string;
  combination: string[];
  cutoffPoints: string;
  targetDegree: string;
  universities: string[];
  description: string;
}

const CAREER_TRACKS: CareerTrack[] = [
  {
    career: 'Medicine & Surgery (MBBS)',
    category: 'Sciences & Health',
    code: '030',
    combination: ['Biology', 'Chemistry', 'Physics'],
    cutoffPoints: '13 – 15 Points',
    targetDegree: 'Direct Entry 200 Level MBBS',
    universities: ['Ahmadu Bello University (ABU Zaria)', 'Bayero University Kano (BUK)', 'University of Abuja', 'Usmanu Danfodiyo University (UDUS)'],
    description: 'Premier medical Direct Entry pathway bypassing UTME. Requires maximum points and distinction in laboratory sciences.'
  },
  {
    career: 'Law & Jurisprudence (LL.B)',
    category: 'Law & Arts',
    code: '054',
    combination: ['Literature in English', 'Government', 'Islamic Studies / CRS'],
    cutoffPoints: '12 – 14 Points',
    targetDegree: 'Direct Entry 200 Level LL.B',
    universities: ['Ahmadu Bello University Zaria', 'University of Abuja', 'University of Jos', 'Kogi State University'],
    description: 'Direct entry into faculty of law. Emphasizes legal analytical reasoning, constitutional governance, and literary critique.'
  },
  {
    career: 'Computer Science & AI',
    category: 'Engineering & Technology',
    code: '028',
    combination: ['Mathematics', 'Physics', 'Chemistry'],
    cutoffPoints: '9 – 12 Points',
    targetDegree: 'Direct Entry 200 Level B.Sc Computer Science',
    universities: ['ABU Zaria', 'Federal University of Technology Minna', 'University of Abuja', 'BUK Kano'],
    description: 'High-demand technology track covering computational logic, algorithmic mathematics, and hardware architectures.'
  },
  {
    career: 'Nursing Science (B.N.Sc)',
    category: 'Sciences & Health',
    code: '030',
    combination: ['Biology', 'Chemistry', 'Physics'],
    cutoffPoints: '11 – 13 Points',
    targetDegree: 'Direct Entry 200 Level B.N.Sc Nursing',
    universities: ['University of Abuja', 'ABU Zaria', 'University of Ilorin', 'Nasarawa State University Keffi'],
    description: 'Clinical nursing healthcare pathway with full laboratory training at AHCAS study centre.'
  },
  {
    career: 'Accounting & Finance',
    category: 'Management & Social Sciences',
    code: '015',
    combination: ['Economics', 'Accounting', 'Business Management'],
    cutoffPoints: '8 – 11 Points',
    targetDegree: 'Direct Entry 200 Level B.Sc Accounting',
    universities: ['Ahmadu Bello University Zaria', 'Bayero University Kano', 'University of Abuja', 'Federal University Dutse'],
    description: 'Financial management, corporate audit, and entrepreneurial economics curriculum.'
  },
  {
    career: 'Civil / Mechanical Engineering',
    category: 'Engineering & Technology',
    code: '028',
    combination: ['Mathematics', 'Physics', 'Chemistry'],
    cutoffPoints: '10 – 13 Points',
    targetDegree: 'Direct Entry 200 Level B.Eng Engineering',
    universities: ['Ahmadu Bello University Zaria', 'ATBU Bauchi', 'FUT Minna', 'University of Ilorin'],
    description: 'Rigorous engineering foundations covering advanced mechanics, materials calculus, and thermodynamic principles.'
  },
  {
    career: 'Pharmacy (Pharm.D)',
    category: 'Sciences & Health',
    code: '030',
    combination: ['Biology', 'Chemistry', 'Physics'],
    cutoffPoints: '12 – 14 Points',
    targetDegree: 'Direct Entry 200 Level Doctor of Pharmacy',
    universities: ['ABU Zaria', 'University of Jos', 'Bayero University Kano', 'UDUS Sokoto'],
    description: 'Pharmacological formulations, biological chemistry, and medicinal therapeutics pathway.'
  },
  {
    career: 'Mass Communication',
    category: 'Management & Social Sciences',
    code: '062',
    combination: ['Literature in English', 'Government', 'Economics'],
    cutoffPoints: '8 – 11 Points',
    targetDegree: 'Direct Entry 200 Level B.Sc Mass Communication',
    universities: ['University of Abuja', 'Bayero University Kano', 'Nasarawa State University', 'Kogi State University'],
    description: 'Media broadcasting, investigative journalism, digital public relations, and communications analysis.'
  }
];

export const InteractiveCourseFinder: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCareer, setActiveCareer] = useState<CareerTrack>(CAREER_TRACKS[0]);

  const categories = ['ALL', 'Sciences & Health', 'Law & Arts', 'Management & Social Sciences', 'Engineering & Technology'];

  const filteredTracks = CAREER_TRACKS.filter(track => {
    const matchCat = selectedCategory === 'ALL' || track.category === selectedCategory;
    const matchSearch =
      track.career.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.combination.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      track.targetDegree.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" /> Interactive Direct Entry Career Matcher
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
              Find Your 200 Level Degree Combination
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Explore the 73 approved IJMB subject combinations (Codes 001–073). Select your desired profession to discover the mandatory 3 A-Level subjects, minimum cutoff points, and accepting Nigerian universities.
            </p>
          </div>

          <Link
            to="/admissions/requirements"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors shrink-0"
          >
            <span>View Full 73 Combinations Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search career, degree or subject..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Dynamic Split Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Track Selector List */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredTracks.map((track, idx) => {
              const isSelected = activeCareer.career === track.career;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveCareer(track)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#196855] shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#196855] dark:text-emerald-400">
                        {track.category}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-serif mt-0.5">
                        {track.career}
                      </h4>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      Code: {track.code}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1 text-[11px]">
                    {track.combination.map((sub, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Detailed Output Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#196855]/30 p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#196855] dark:text-emerald-400">
                  Approved IJMB Combination Profile
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-serif mt-1">
                  {activeCareer.career}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Direct Entry Qualification: <strong className="text-slate-900 dark:text-white">{activeCareer.targetDegree}</strong>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 rounded-xl text-center min-w-[130px]">
                <div className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300">Cut-Off Target</div>
                <div className="text-sm font-extrabold text-amber-900 dark:text-amber-200 mt-0.5 font-sans">
                  {activeCareer.cutoffPoints}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeCareer.description}
            </p>

            {/* Subjects Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#196855]" /> Mandatory 3 A-Level Subjects
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeCareer.combination.map((sub, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Subject {idx + 1}</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accepting Universities */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#e69912]" /> Key Direct Entry Accepting Universities
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeCareer.universities.map((uni, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#196855]" />
                    <span>{uni}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Application Form Fee: <strong className="text-slate-900 dark:text-white">₦10,500</strong> • Fast-Track 2026/2027 Admission
              </div>

              <Link
                to={`/apply`}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#196855] hover:bg-[#196855] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Apply for {activeCareer.career}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default InteractiveCourseFinder;
