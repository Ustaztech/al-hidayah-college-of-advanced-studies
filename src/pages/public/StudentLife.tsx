import React from 'react';
import { Link } from 'react-router-dom';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import {
  GraduationCap,
  BookOpen,
  FlaskConical,
  Wifi,
  ShieldCheck,
  Heart,
  Users,
  Compass,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin
} from 'lucide-react';

export const StudentLife: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#196855] via-[#196855] to-[#0F172A] text-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-[#e69912] text-white uppercase tracking-widest">
            Campus Experience & Student Welfare
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
            Student Life at Al-Hidayah College
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
            A disciplined, academically rigorous, and supportive learning environment at the JSS Agyana Road Study Centre in Abaji, designed to nurture intellectual curiosity, moral integrity, and leadership.
          </p>
        </div>
      </section>

      {/* Campus Pillars */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#F4F6F5] dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#196855] flex items-center justify-center">
              <FlaskConical size={24} />
            </div>
            <h3 className="text-lg font-bold font-serif">Dedicated Science Laboratories</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Equipped with standard apparatus for Biology, Chemistry, and Physics practicals with an approved schedule of 3 mandatory laboratory hours per week per science subject.
            </p>
            <Link to="/laboratory" className="text-xs font-bold text-[#196855] dark:text-emerald-400 inline-flex items-center gap-1 hover:underline">
              <span>Explore Virtual E-Laboratory</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-6 bg-[#F4F6F5] dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-[#e69912] flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-bold font-serif">Library & E-Resource Hub</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Quiet reading halls stocked with standard IJMB recommended A-Level texts, revision past questions (2012–2025), and open-access digital repositories.
            </p>
            <Link to="/library" className="text-xs font-bold text-[#e69912] dark:text-amber-400 inline-flex items-center gap-1 hover:underline">
              <span>Access Digital E-Library</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-6 bg-[#F4F6F5] dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 flex items-center justify-center">
              <Wifi size={24} />
            </div>
            <h3 className="text-lg font-bold font-serif">ICT Centre & CBT Suite</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Networked computer workstations for online CBT mock assessments, digital literacy training, student portal self-service, and academic research.
            </p>
            <Link to="/student/elearning" className="text-xs font-bold text-blue-700 dark:text-blue-400 inline-flex items-center gap-1 hover:underline">
              <span>View E-Learning CBT Engine</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Student Welfare & Support Services */}
        <div className="bg-[#F4F6F5] dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-black text-[#196855] dark:text-emerald-400 uppercase tracking-widest block mb-1">
              Welfare & Academic Guidance
            </span>
            <h2 className="text-2xl font-bold font-serif">Comprehensive Student Support Services</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              From day one of resumption, students are assigned an academic advisor to monitor progress and university placement readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <Compass className="text-[#196855]" size={20} />
              <h4 className="text-xs font-extrabold uppercase text-slate-900 dark:text-white">University Placement Advisory</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Personalized counselling on target universities (ABU Zaria, UniAbuja, BUK, UDUS, UniIlorin) and cutoff points.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <Users className="text-[#e69912]" size={20} />
              <h4 className="text-xs font-extrabold uppercase text-slate-900 dark:text-white">Student Peer Mentorship</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Peer study groups organized by subject triplets (e.g. PCB, PCM, EGB, EGL) for intensive weekend revisions.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <Heart className="text-red-600" size={20} />
              <h4 className="text-xs font-extrabold uppercase text-slate-900 dark:text-white">Health & First Aid</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Campus first-aid station and retained local clinic referrals for prompt medical attention when needed.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <MapPin className="text-[#196855]" size={20} />
              <h4 className="text-xs font-extrabold uppercase text-slate-900 dark:text-white">Accommodation Guidance</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Vetted off-campus student hostels in secure, accessible residential quarters within Abaji Area Council.
              </p>
            </div>
          </div>
        </div>

        {/* Authentic Campus Life Showcase */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-black text-[#e69912] uppercase tracking-widest block mb-1">
                Authentic Campus Life
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">
                Inside the AHCAS Academic Experience
              </h3>
            </div>
            <Link
              to="/virtual-tour"
              className="text-xs font-bold text-[#196855] dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              Take Virtual Campus Tour →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden shadow border border-slate-200 dark:border-slate-700 h-52">
                <img
                  src="/ahcas-student-cohort.jpg"
                  alt="AHCAS Student Cohort"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enrolled Candidate Cohort</h4>
                <p className="text-xs text-slate-500 mt-0.5">Ambitious IJMB candidates collaborating for academic distinction.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden shadow border border-slate-200 dark:border-slate-700 h-52">
                <img
                  src="/ahcas-classroom-lecture.jpg"
                  alt="IJMB Interactive Lecture"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Interactive Lecture Ambiance</h4>
                <p className="text-xs text-slate-500 mt-0.5">Engaging teaching environment at JSS Agyana Road Study Centre.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden shadow border border-slate-200 dark:border-slate-700 h-52">
                <img
                  src="/ahcas-lecture-session.jpg"
                  alt="Direct Entry Coaching"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Rigorous Direct Entry Prep</h4>
                <p className="text-xs text-slate-500 mt-0.5">Step-by-step syllabus mastery and past question revisions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Academic Schedule */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">Weekly Academic Routine</h3>
              <p className="text-xs text-slate-500">Mondays to Fridays • JSS Agyana Road Study Centre</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-[#196855] dark:text-emerald-400 text-xs font-black rounded-full">
              Minimum 6 Lecture Hours Weekly / Subject
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-[#F4F6F5] dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-[#e69912] block">Morning Block</span>
              <p className="text-sm font-black text-slate-900 dark:text-white mt-1">08:30 AM – 12:30 PM</p>
              <p className="text-xs text-slate-500 mt-1">Theory lectures, syllabus topics, and interactive tutorials.</p>
            </div>

            <div className="p-4 bg-[#F4F6F5] dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-[#196855] block">Midday Break</span>
              <p className="text-sm font-black text-slate-900 dark:text-white mt-1">12:30 PM – 01:30 PM</p>
              <p className="text-xs text-slate-500 mt-1">Lunch, mid-day prayer, and library reference consultations.</p>
            </div>

            <div className="p-4 bg-[#F4F6F5] dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-blue-700 block">Afternoon Block</span>
              <p className="text-sm font-black text-slate-900 dark:text-white mt-1">01:30 PM – 04:30 PM</p>
              <p className="text-xs text-slate-500 mt-1">Science laboratory practicals, CBT drills, and revision workshops.</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#196855] text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black font-serif">Join the Next IJMB A-Level Cohort</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Applications for 2026/2027 admissions are currently processing. Secure your place today.
            </p>
          </div>
          <Link
            to="/apply/register"
            className="px-6 py-3 bg-[#e69912] hover:bg-[#c98207] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0"
          >
            Start Online Application
          </Link>
        </div>
      </section>
    </div>
  );
};
