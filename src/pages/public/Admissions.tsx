import React from 'react';
import { Link } from 'react-router-dom';
import { AdmissionsGuide } from '../../components/home/AdmissionsGuide';
import { CreditCard, FileCheck, UserCheck, HelpCircle, ArrowRight, Download, GraduationCap, CalendarCheck, Headphones, PhoneCall, Sparkles, Camera } from 'lucide-react';

export const Admissions: React.FC = () => {
  return (
    <div className="py-12 bg-white dark:bg-[#1A222C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Hero Header */}
        <div className="bg-[#196855] text-white p-6 sm:p-10 rounded-3xl border-b-4 border-[#e69912] shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-black text-xs font-bold rounded-full uppercase">
              <Sparkles size={14} className="text-black" />
              <span>2026/2027 Admissions Open</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif leading-tight">
              AHCAS Admissions Portal & Guidelines
            </h1>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Welcome to the Al-Hidayah College of Advanced Studies, Abaji online admissions hub. Apply for accredited ND, HND, and IJMB Direct Entry 200 Level programs with guaranteed university progression.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/apply/register"
                className="px-6 py-3 bg-[#e69912] hover:bg-[#c98207] text-white font-extrabold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Start Application Form</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/admissions/status"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm border border-white/20 transition-all"
              >
                Check Admission Status
              </Link>
            </div>
          </div>

          {/* Orientation Feature Photo */}
          <div className="w-full sm:w-64 lg:w-80 shrink-0 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-black relative group">
            <img
              src="/ahcas-director-orientation-address.jpg"
              alt="AHCAS Director Academic Orientation Address"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 text-center">
              <span className="text-[11px] font-bold text-amber-300">
                Official Orientation & Induction
              </span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Admissions Guide */}
        <AdmissionsGuide />

        {/* Real Campus Orientation Showcase */}
        <div className="bg-[#F4F6F5] dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[#e69912] font-black uppercase text-xs tracking-wider flex items-center gap-1.5">
                <Camera size={14} />
                Authentic Campus Life
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#196855] dark:text-emerald-400 mt-1">
                Student Orientation & Academic Induction Experience
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/gallery"
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                View Full Gallery & Circulars
              </Link>
              <a
                href="tel:08056350078"
                className="px-4 py-2 bg-[#196855] hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
              >
                <PhoneCall size={14} />
                <span>Admissions: 08056350078</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Real Photo Card 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md flex flex-col p-5 space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs bg-black">
                <img src="/ahcas-orientation-speech.jpg" alt="Orientation Address" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-[#e69912] uppercase tracking-wider">Academic Induction</span>
                  <h3 className="font-bold text-base text-[#196855] dark:text-emerald-400 font-serif mt-0.5">Orientation & Ethics Address</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                    Guidance on academic discipline, lecture attendance, continuous assessment metrics, and university Direct Entry placement.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-700">
                  <Link to="/gallery" className="text-xs font-bold text-[#196855] dark:text-emerald-400 hover:underline flex items-center gap-1">
                    <span>View in Gallery</span>
                  </Link>
                  <Link to="/apply" className="px-3 py-1.5 bg-[#196855] text-white rounded-lg text-xs font-bold hover:opacity-90">
                    Apply Now →
                  </Link>
                </div>
              </div>
            </div>

            {/* Real Photo Card 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md flex flex-col p-5 space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs bg-black">
                <img src="/ahcas-orientation-students-cohort.jpg" alt="Enrolled Students Cohort" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-[#e69912] uppercase tracking-wider">Matriculated Students</span>
                  <h3 className="font-bold text-base text-[#196855] dark:text-emerald-400 font-serif mt-0.5">2026/2027 Student Assembly</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                    Enrolled candidates in session at JSS Agyana Road, Abaji study centre, participating in structured academic orientation.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-700">
                  <Link to="/gallery" className="text-xs font-bold text-[#196855] dark:text-emerald-400 hover:underline flex items-center gap-1">
                    <span>View in Gallery</span>
                  </Link>
                  <Link to="/apply" className="px-3 py-1.5 bg-[#196855] text-white rounded-lg text-xs font-bold hover:opacity-90">
                    Apply Now →
                  </Link>
                </div>
              </div>
            </div>

            {/* Real Photo Card 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md flex flex-col p-5 space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs bg-black">
                <img src="/ahcas-coordinator-podium.jpg" alt="Centre Coordinator at Podium" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-[#e69912] uppercase tracking-wider">Centre Leadership</span>
                  <h3 className="font-bold text-base text-[#196855] dark:text-emerald-400 font-serif mt-0.5">Coordinator Dais Briefing</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                    Study centre governance ensuring full syllabus coverage compliant with the Ahmadu Bello University IJMB board.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-700">
                  <Link to="/gallery" className="text-xs font-bold text-[#196855] dark:text-emerald-400 hover:underline flex items-center gap-1">
                    <span>View in Gallery</span>
                  </Link>
                  <Link to="/admissions/requirements" className="px-3 py-1.5 bg-[#e69912] text-white rounded-lg text-xs font-bold hover:opacity-90">
                    Requirements →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Links Grid Featuring Professional Lucide Vector Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admissions/requirements" className="p-6 bg-[#F4F6F5] dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#196855] dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#196855] dark:text-white font-serif mb-1">Entry Requirements</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">View WAEC/NECO/NABTEB O’Level credit requirements & Direct Entry guidelines.</p>
            </div>
          </Link>
          <Link to="/admissions/status" className="p-6 bg-[#F4F6F5] dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-[#e69912] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <CalendarCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#196855] dark:text-white font-serif mb-1">Scratch Card Verification</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Verify serial number & PIN credentials for application and status checking.</p>
            </div>
          </Link>
          <Link to="/faqs" className="p-6 bg-[#F4F6F5] dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#196855] dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <Headphones size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#196855] dark:text-white font-serif mb-1">Admissions FAQs & Help</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Frequently asked questions regarding acceptance fees, hostels, and resumption.</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Admissions;
