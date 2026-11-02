import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ACADEMIC_CALENDAR_DATA } from '../../data/calendar';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import {
  Calendar,
  Clock,
  Printer,
  ChevronRight,
  Info,
  CalendarDays,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const AcademicCalendar: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<'ALL' | 'First Semester' | 'Second Semester'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'Admission' | 'Registration' | 'Exams'>('ALL');

  const filteredEvents = ACADEMIC_CALENDAR_DATA.filter(ev => {
    const matchesSemester = selectedSemester === 'ALL' || ev.semester === selectedSemester;
    const matchesCategory = selectedCategory === 'ALL' || ev.category === selectedCategory;
    return matchesSemester && matchesCategory;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 bg-white dark:bg-slate-900 transition-colors print:py-0 print:bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#196855] to-[#124d3f] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden border-b-4 border-[#e69912] shadow-xl print:border-none print:shadow-none print:rounded-none print:bg-white print:text-black print:p-4">
          <div className="max-w-3xl space-y-4 relative z-10 print:max-w-full">
            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <span className="px-3 py-1 bg-[#e69912] text-white text-xs font-black rounded-full uppercase tracking-wider">
                Official Calendar
              </span>
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                2026/2027 Academic Session
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight print:text-2xl print:text-black">
              AHCAS Academic Calendar
            </h1>
            <p className="text-base text-amber-200 font-serif italic print:text-black">
              Approved schedule of academic activities, registration cut-offs, continuous assessments, and national IJMB mock examinations.
            </p>
            <p className="text-xs text-emerald-100 font-sans print:text-black">
              {INSTITUTION_INFO.name} • {INSTITUTION_INFO.studyCentre}
            </p>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Semester:</span>
            {(['ALL', 'First Semester', 'Second Semester'] as const).map(sem => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedSemester === sem
                    ? 'bg-[#196855] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {sem === 'ALL' ? 'All Semesters' : sem}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Printer size={14} />
              <span>Print Schedule</span>
            </button>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#196855] hover:bg-[#124d3f] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <span>Apply for 2026/2027</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <span className="text-xs font-bold text-slate-500 uppercase mr-1">Activity Type:</span>
          {(['ALL', 'Admission', 'Registration', 'Exams'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'All Activities' : cat}
            </button>
          ))}
        </div>

        {/* Timeline Table / Cards */}
        <div className="space-y-4">
          {filteredEvents.map((event, index) => {
            const isExam = event.category === 'Exams';
            const isReg = event.category === 'Registration';
            return (
              <div
                key={event.id || index}
                className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl shrink-0 ${
                      isExam
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                        : isReg
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-emerald-100 text-[#196855] dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    <CalendarDays size={24} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-[#196855] dark:text-emerald-400">
                        {event.date}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
                        {event.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
                        {event.semester}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {event.category === 'Admission' && (
                    <Link
                      to="/apply"
                      className="text-xs font-bold text-[#196855] dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Online Portal</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}
                  {event.category === 'Registration' && (
                    <Link
                      to="/student"
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Student Desk</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}
                  {event.category === 'Exams' && (
                    <Link
                      to="/student/cbt"
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Mock CBT Test</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional Statutory Advisory */}
        <div className="p-6 bg-amber-50 dark:bg-slate-800 rounded-3xl border border-amber-200 dark:border-amber-900/40 flex items-start gap-4">
          <Info size={24} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs text-amber-950 dark:text-slate-300 leading-relaxed">
            <h4 className="font-bold text-sm font-serif text-amber-900 dark:text-amber-200">
              Notice from the Office of the Registrar
            </h4>
            <p>
              Dates and schedules are approved by the Academic Board and are subject to minor adjustments in alignment with the national Interim Joint Matriculation Board (IJMB) coordinating committee directives.
            </p>
            <p>
              Students are advised that 75% lecture and laboratory attendance is mandatory to qualify for the final national IJMB examination sitting.
            </p>
          </div>
        </div>

        {/* Quick Links Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
          <Link
            to="/admissions/requirements"
            className="p-5 bg-[#F4F6F5] dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#196855] transition-all group"
          >
            <Clock size={20} className="text-[#196855] mb-2" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#196855] transition-colors">
              Admission Requirements
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Check O'Level requirements and Direct Entry qualifications.
            </p>
          </Link>

          <Link
            to="/programmes/ijmb"
            className="p-5 bg-[#F4F6F5] dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#196855] transition-all group"
          >
            <BookOpen size={20} className="text-[#e69912] mb-2" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#e69912] transition-colors">
              Subject Combinations
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Explore 73 approved subjects for science, art, and management.
            </p>
          </Link>

          <Link
            to="/portals"
            className="p-5 bg-[#F4F6F5] dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#196855] transition-all group"
          >
            <Sparkles size={20} className="text-teal-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
              E-Portals Directory
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Direct access to all student, staff, and registry dashboards.
            </p>
          </Link>
        </div>

      </div>
    </div>
  );
};
