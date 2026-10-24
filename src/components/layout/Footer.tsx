import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Shield, CheckCircle, ExternalLink, BookOpen, FlaskConical, Globe } from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-gray-300 border-t-4 border-[#006B35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Strip with RC & Contact */}
        <div className="py-3.5 px-4 bg-slate-900/90 rounded-2xl border border-slate-800 mb-10 flex flex-wrap justify-between items-center text-xs text-slate-300 gap-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#D4A62A] text-black font-black px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
              RC: {INSTITUTION_INFO.rcNumber}
            </span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Mail size={14} className="text-[#D4A62A]" />
              <span className="font-mono">{INSTITUTION_INFO.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Phone size={14} className="text-emerald-400" />
              <span className="font-mono">{INSTITUTION_INFO.phone}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 font-bold text-xs">
            <Link to="/about/staff" className="hover:text-amber-300 transition-colors">Staff Directory</Link>
            <Link to="/student/dashboard" className="hover:text-emerald-300 transition-colors">Student Portal</Link>
            <Link to="/admin/dashboard" className="hover:text-amber-300 transition-colors">Staff Portal</Link>
            <Link to="/apply" className="font-extrabold text-[#D4A62A] hover:underline">Admission 2026/2027</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Identity & Official Logos */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/official-logo.jpg"
                alt="Al-Hidayah College Official Crest"
                className="h-14 w-auto bg-white p-1 rounded-xl shadow-md border border-slate-700"
              />
              <div>
                <span className="font-black text-base text-white block tracking-tight font-serif leading-none">
                  AL-HIDAYAH
                </span>
                <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block mt-0.5">
                  College of Advanced Studies
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Abaji Study Centre, FCT Abuja
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Advancing academic excellence through structured A-Level education and direct 200 Level university admission. Operating in alignment with Ahmadu Bello University (ABU) coordination framework and affiliated with Citi Polytechnic Abuja.
            </p>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-amber-300 block uppercase tracking-wider">
                Motto
              </span>
              <p className="text-xs italic text-gray-200 font-serif">
                “Enlightening Minds, Building Futures”
              </p>
              <p className="text-[10px] text-emerald-400">
                “Developing the Best Minds for the Future”
              </p>
            </div>
          </div>

          {/* Column 2: Academic Pathways */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4A62A]"></span>
              Programmes & Admissions
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/programmes/ijmb" className="hover:text-amber-400 transition-colors font-medium">
                  IJMB Direct Entry (200 Level Pathway)
                </Link>
              </li>
              <li>
                <Link to="/programmes/nd" className="hover:text-amber-400 transition-colors">
                  Citi Poly Affiliated ND Programmes
                </Link>
              </li>
              <li>
                <Link to="/programmes/hnd" className="hover:text-amber-400 transition-colors">
                  Higher National Diploma (HND)
                </Link>
              </li>
              <li>
                <Link to="/admissions/requirements" className="hover:text-amber-400 transition-colors">
                  Approved IJMB Combinations & Cut-offs
                </Link>
              </li>
              <li>
                <Link to="/admissions/status" className="hover:text-amber-400 transition-colors text-amber-300 font-bold">
                  Check Admission Status & Letter
                </Link>
              </li>
              <li>
                <Link to="/apply/register" className="hover:text-amber-400 transition-colors">
                  Apply Online (Form Fee: ₦10,500)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Resources & E-Library */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#006B35]"></span>
              E-Learning & Digital Labs
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/library" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-300 font-semibold">
                  <BookOpen size={13} />
                  <span>AHCAS Digital E-Library (OER)</span>
                </Link>
              </li>
              <li>
                <Link to="/laboratory" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-amber-300 font-semibold">
                  <FlaskConical size={13} />
                  <span>Interactive E-Laboratory (JavaLab)</span>
                </Link>
              </li>
              <li>
                <Link to="/library" className="hover:text-emerald-400 transition-colors">
                  IJMB Past Questions (1st Sem & Diets)
                </Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-emerald-400 transition-colors">
                  Continuous Assessment (20%) Checker
                </Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-emerald-400 transition-colors">
                  Tuition Installments & Receipts
                </Link>
              </li>
              <li>
                <Link to="/virtual-tour" className="hover:text-emerald-400 transition-colors">
                  JSS Agyana Road Study Centre Tour
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F58220]"></span>
              Official Contacts
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#F58220] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block text-white">Administrative Secretariat:</strong>
                  <span className="text-gray-400">{INSTITUTION_INFO.address}</span>
                  <strong className="block text-white pt-1">Academic Study Centre:</strong>
                  <span className="text-emerald-400 font-medium">{INSTITUTION_INFO.studyCentre}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#D4A62A] shrink-0" />
                <span className="font-mono text-white">{INSTITUTION_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe size={15} className="text-blue-400 shrink-0" />
                <a href={INSTITUTION_INFO.website} target="_blank" rel="noreferrer" className="text-blue-300 hover:underline">
                  {INSTITUTION_INFO.website}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-emerald-400" />
            <span>Document Code: {INSTITUTION_INFO.documentCode} • Quality Assurance Manual Approved</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-slate-400 text-[11px]">
            <Link to="/about" className="hover:underline">About AHCAS</Link>
            <Link to="/about/management" className="hover:underline">Management & Founder</Link>
            <Link to="/faqs" className="hover:underline">FAQs</Link>
            <Link to="/contact" className="hover:underline">Contact Desk</Link>
          </div>
          <div className="text-right text-[11px]">
            © {new Date().getFullYear()} Al-Hidayah College of Advanced Studies Ltd. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
