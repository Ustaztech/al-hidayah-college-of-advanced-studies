import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import {
  BookOpen,
  Search,
  Filter,
  Play,
  Video,
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const ELearningPage: React.FC = () => {
  const [filterTab, setFilterTab] = useState<'all' | 'progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const courses = [
    {
      id: 'csc-101',
      title: 'Introduction to Computing',
      code: 'CSC 101 • 1st Semester',
      progress: 68,
      lessons: 12,
      resources: 4,
      liveClasses: 1,
      image: '/african-campus-hero.jpg',
      status: 'In progress'
    },
    {
      id: 'gst-102',
      title: 'Communication Skills',
      code: 'GST 102 • 1st Semester',
      progress: 42,
      lessons: 10,
      resources: 3,
      liveClasses: 1,
      image: '/provost-mbsuleiman.jpg',
      status: 'In progress'
    },
    {
      id: 'mth-101',
      title: 'Mathematics (IJMB / ND)',
      code: 'MTH 101 • 1st Semester',
      progress: 25,
      lessons: 14,
      resources: 5,
      liveClasses: 1,
      image: '/campus-gate.jpg',
      status: 'In progress'
    }
  ];

  return (
    <PortalLayout activeNav="E-Learning" portalTitle="E-Learning Portal">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Breadcrumb & Header Bar Matching Image 2 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[11px] uppercase font-black tracking-wider text-emerald-800 font-mono block">
              E-LEARNING
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              My learning
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Access your courses, live classes, assignments and learning resources.
            </p>
          </div>

          {/* Institutional Motto Card Matching Image 2 */}
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-white border border-emerald-200/80 rounded-2xl flex items-center gap-3.5 shadow-xs">
            <img
              src="/official-logo.jpg"
              alt="AHCAS Crest"
              className="h-10 w-auto object-contain bg-white p-0.5 rounded-lg border border-slate-200"
            />
            <div>
              <p className="text-xs font-serif italic text-emerald-900 font-bold">
                “Knowledge today, a brighter tomorrow.”
              </p>
              <span className="text-[10px] text-slate-400 block font-sans">
                AHCAS Virtual Learning Environment
              </span>
            </div>
          </div>
        </div>

        {/* Filter Pills & Course Search Row Matching Image 2 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
          
          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-[#004D26] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All courses (3)
            </button>
            <button
              onClick={() => setFilterTab('progress')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === 'progress'
                  ? 'bg-[#004D26] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              In progress (3)
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === 'completed'
                  ? 'bg-[#004D26] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Completed (0)
            </button>
          </div>

          {/* Search Courses & Filter Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search my courses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 shadow-xs"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>

        </div>

        {/* Section Heading */}
        <h2 className="text-lg font-black text-slate-900 tracking-tight pt-2">
          My courses
        </h2>

        {/* 3 Course Cards Grid Matching Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Course Thumbnail */}
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-lg text-[10px] font-extrabold text-[#006B35] shadow-xs border border-emerald-100">
                    {course.status}
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-black text-base text-slate-900 leading-snug">
                      {course.title}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                      {course.code}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#006B35] h-full rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="text-right text-[11px] font-bold text-slate-500 font-mono">
                      {course.progress}%
                    </div>
                  </div>

                  {/* Continue Learning Button */}
                  <button
                    onClick={() => alert(`Launching ${course.title} study module...`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#004D26] hover:bg-[#00381B] text-white font-extrabold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Play size={13} className="fill-white" />
                    <span>Continue learning</span>
                  </button>
                </div>
              </div>

              {/* Course Meta Info */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <FileText size={13} className="text-slate-400" />
                  {course.lessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={13} className="text-slate-400" />
                  {course.resources} resources
                </span>
                <span className="flex items-center gap-1">
                  <Video size={13} className="text-slate-400" />
                  {course.liveClasses} live class
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Two Cards: Next Live Class & Upcoming Assignment Matching Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Card 1: Next Live Class */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 shadow-xs">
                <Video size={22} className="text-amber-700" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 block">
                  NEXT LIVE CLASS
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Introduction to Computing
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    Tue, 15 Oct 2026
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    10:00 AM – 11:00 AM (WAT)
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                    Virtual (Zoom)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Launching Virtual Classroom (Zoom / Teams session)...')}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 border-2 border-[#006B35] text-[#006B35] font-extrabold rounded-xl text-xs shrink-0 shadow-xs cursor-pointer transition-colors"
            >
              Join class
            </button>
          </div>

          {/* Card 2: Upcoming Assignment */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
                <FileText size={22} className="text-emerald-700" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">
                  UPCOMING ASSIGNMENT
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Communication Skills
                </h4>
                <p className="text-xs text-slate-600">
                  Essay: The Role of Communication in National Development
                </p>
                <span className="text-[11px] text-amber-700 font-bold block">
                  Due: Fri, 18 Oct 2026, 11:59 PM (WAT)
                </span>
              </div>
            </div>

            <button
              onClick={() => alert('Opening Assignment Details & Document Submission Portal...')}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 border-2 border-[#006B35] text-[#006B35] font-extrabold rounded-xl text-xs shrink-0 shadow-xs cursor-pointer transition-colors"
            >
              View details
            </button>
          </div>

        </div>

      </div>
    </PortalLayout>
  );
};
