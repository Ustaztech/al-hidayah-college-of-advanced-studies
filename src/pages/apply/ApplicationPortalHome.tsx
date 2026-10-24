import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { INSTITUTION_INFO, TUITION_SCHEDULE } from '../../data/ijmbData';
import {
  RotateCw,
  PlayCircle,
  CreditCard,
  CheckSquare,
  X,
  AlertCircle,
  Lock,
  ArrowRight,
  BookOpen,
  Award,
  ShieldCheck,
  Building2,
  FileCheck,
  UserCheck
} from 'lucide-react';

export const ApplicationPortalHome: React.FC = () => {
  const navigate = useNavigate();
  const { login, refreshUserData } = useAuth();

  // Modals
  const [continueModalOpen, setContinueModalOpen] = useState(false);
  const [payFeeModalOpen, setPayFeeModalOpen] = useState(false);
  
  // Continue Application Login Form State
  const [jambRegNo, setJambRegNo] = useState('');
  const [surname, setSurname] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinueLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    try {
      const apps = db.getApplications();
      const cleanJambOrRef = jambRegNo.trim().toLowerCase();
      const cleanSurname = surname.trim().toLowerCase();

      const targetApp = apps.find(a => {
        const matchesRef =
          a.ref_number.toLowerCase() === cleanJambOrRef ||
          (a.jamb_reg_no && a.jamb_reg_no.toLowerCase() === cleanJambOrRef) ||
          a.email.toLowerCase() === cleanJambOrRef;
        const matchesSurname = a.full_name.toLowerCase().includes(cleanSurname);
        return matchesRef && matchesSurname;
      });

      if (!targetApp) {
        throw new Error('Application record not found. Please verify your Reference ID / Email and Surname.');
      }

      // Log in as applicant
      const users = db.getUsers();
      const user = users.find(u => u.email.toLowerCase() === targetApp.email.toLowerCase() || u.refNumber === targetApp.ref_number);

      if (user) {
        db.setSession(user);
      } else {
        const tempUser = {
          id: `usr-app-${Date.now()}`,
          name: targetApp.full_name,
          email: targetApp.email,
          passwordHash: 'temp',
          role: 'APPLICANT' as const,
          refNumber: targetApp.ref_number,
          phone: targetApp.phone,
          createdAt: new Date().toISOString().substring(0, 10)
        };
        db.setSession(tempUser);
      }

      refreshUserData();
      setContinueModalOpen(false);
      navigate('/apply/register');
    } catch (err: any) {
      setLoginError(err.message || 'Application login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/african-campus-hero.jpg"
          alt="AHCAS Abaji Campus"
          className="w-full h-full object-cover object-center opacity-25 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-slate-950"></div>
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 bg-white dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <img
            src="/official-logo.jpg"
            alt="AHCAS Crest"
            className="h-12 w-auto object-contain bg-white p-1 rounded-xl border border-slate-300 shadow-sm"
          />
          <div>
            <h1 className="text-lg font-black font-serif text-[#006B35] dark:text-emerald-400 leading-none">
              Al-Hidayah College of Advanced Studies
            </h1>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Online Admissions & Registration Portal (RC: {INSTITUTION_INFO.rcNumber})
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-sm font-bold text-slate-800 dark:text-slate-200">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            Main Campus Website →
          </Link>
          <Link to="/apply/requirements" className="hover:text-[#006B35] dark:hover:text-emerald-400 transition-colors">
            Requirements
          </Link>
          <Link to="/admissions/status" className="hover:text-[#006B35] dark:hover:text-emerald-400 transition-colors">
            Check Status
          </Link>
        </nav>
      </header>

      {/* Main Hero & Quick Action Gateway */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-4 py-12 flex flex-col justify-center items-center w-full">
        
        <div className="text-center max-w-3xl space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#D4A62A]/20 border border-[#D4A62A]/50 rounded-full text-xs font-black text-amber-300 shadow-md">
            <Award size={14} className="text-[#D4A62A]" />
            <span>2026/2027 Academic Session Direct Entry Admissions</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">
            Apply to Al-Hidayah College of Advanced Studies
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Direct 200 Level University Placement via the Interim Joint Matriculation Board (IJMB). Study Centre at <strong>{INSTITUTION_INFO.studyCentre}</strong>.
          </p>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 max-w-lg mx-auto flex justify-between text-xs font-mono text-emerald-300">
            <span>Form Fee: <strong>₦{INSTITUTION_INFO.formFeeNgn.toLocaleString()}</strong></span>
            <span>1st Sem Tuition: <strong>₦{TUITION_SCHEDULE.ijmb.firstInstallment.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* 4 Action Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Start Application */}
          <Link
            to="/apply/register"
            className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl border-2 border-emerald-500 hover:-translate-y-1 transition-all group flex flex-col justify-between text-slate-900"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#006B35] flex items-center justify-center group-hover:bg-[#006B35] group-hover:text-white transition-colors">
                <PlayCircle size={26} />
              </div>
              <h3 className="font-bold text-base font-serif group-hover:text-[#006B35]">
                Start Application
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Begin new candidate registration for the 12-month IJMB A-Level academic cycle.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs font-bold text-[#006B35] flex items-center gap-1 mt-4">
              <span>Begin Application</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Continue Application */}
          <button
            onClick={() => setContinueModalOpen(true)}
            className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl border-2 border-slate-200 hover:border-[#D4A62A] hover:-translate-y-1 transition-all group flex flex-col justify-between text-slate-900 text-left cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#D4A62A] flex items-center justify-center group-hover:bg-[#D4A62A] group-hover:text-black transition-colors">
                <RotateCw size={26} />
              </div>
              <h3 className="font-bold text-base font-serif group-hover:text-amber-700">
                Continue Application
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log in to edit your bio-data, update O’Level credits, or print registration slip.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs font-bold text-amber-700 flex items-center gap-1 mt-4">
              <span>Sign In with Ref ID</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Check Admission Status */}
          <Link
            to="/admissions/status"
            className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl border-2 border-slate-200 hover:border-blue-500 hover:-translate-y-1 transition-all group flex flex-col justify-between text-slate-900"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CheckSquare size={26} />
              </div>
              <h3 className="font-bold text-base font-serif group-hover:text-blue-600">
                Check Admission Status
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check provisional admission lists and download official signed admission letters.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs font-bold text-blue-600 flex items-center gap-1 mt-4">
              <span>View Decisions</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: View Requirements */}
          <Link
            to="/admissions/requirements"
            className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl border-2 border-slate-200 hover:border-purple-500 hover:-translate-y-1 transition-all group flex flex-col justify-between text-slate-900"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <BookOpen size={26} />
              </div>
              <h3 className="font-bold text-base font-serif group-hover:text-purple-600">
                73 Combinations & Cut-offs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review approved subject codes (001-073) and university required points.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs font-bold text-purple-600 flex items-center gap-1 mt-4">
              <span>Explore Brochure</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

      </main>

      {/* Continue Application Modal */}
      {continueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-slate-900 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold font-serif text-[#006B35]">
                Candidate Application Sign-In
              </h3>
              <button onClick={() => setContinueModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {loginError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleContinueLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Application Reference ID or Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AHCAS/IJMB/2026/00142"
                  value={jambRegNo}
                  onChange={e => setJambRegNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Candidate Surname
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abdullahi"
                  value={surname}
                  onChange={e => setSurname(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-600">
                <span>Demo test candidate:</span>
                <strong className="block font-mono text-emerald-800">AHCAS/IJMB/2026/00142 • Abdullahi</strong>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#006B35] hover:bg-[#004D26] text-white font-bold rounded-xl text-xs shadow-md"
              >
                {isSubmitting ? 'Verifying...' : 'Sign In to Portal'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
