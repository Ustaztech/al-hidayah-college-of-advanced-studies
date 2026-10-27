import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import {
  GraduationCap,
  Users,
  Lightbulb,
  TrendingUp,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, authError, setAuthError, role } = useAuth();

  const isRegisterRoute = location.pathname.includes('register');
  const [isSignUp, setIsSignUp] = useState(isRegisterRoute);
  const [roleType, setRoleType] = useState<'Applicant' | 'Student'>('Applicant');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const fullName = `${firstName} ${lastName}`.trim() || 'New Applicant';
        await register(
          fullName,
          email,
          password,
          roleType === 'Applicant' ? 'APPLICANT' : 'STUDENT',
          undefined,
          INSTITUTION_INFO.phone
        );
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => {
          if (roleType === 'Student') {
            navigate('/student/dashboard');
          } else {
            navigate('/apply');
          }
        }, 600);
      } else {
        await login(email, password);
        setSuccessMsg('Signed in successfully! Redirecting...');
        
        // Dynamic Role-Based Redirect after authentication
        setTimeout(() => {
          if (['SUPER_ADMIN','REGISTRAR','BURSAR','LECTURER'].includes(role)) {
            navigate('/admin/dashboard');
          } else if (role === 'STUDENT') {
            navigate('/student/dashboard');
          } else {
            navigate('/apply');
          }
        }, 600);
      }
    } catch (err: any) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-stretch font-sans select-none">
      
      {/* ========================================================================= */}
      {/* LEFT COLUMN: BRANDING & GATE ARCHITECTURE (EXACT MATCH TO IMAGE 5) */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#024124] text-white p-12 flex-col justify-between relative overflow-hidden shadow-2xl">
        
        {/* Subtle Moroccan / Islamic Geometry Overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255, 215, 0, 0.4) 2%, transparent 0%)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Top Branding Section */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg border-2 border-[#D4A62A] flex items-center justify-center">
              <img
                src="/official-logo.jpg"
                alt="AHCAS Official Crest"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-white font-sans leading-tight">
                AL-HIDAYAH COLLEGE
              </h1>
              <span className="text-sm font-black text-amber-300 uppercase tracking-widest block">
                OF ADVANCED STUDIES
              </span>
              <span className="text-xs text-emerald-200 uppercase tracking-wider block">
                ABAJI, NIGERIA • RC: {INSTITUTION_INFO.rcNumber}
              </span>
            </div>
          </div>

          <p className="text-base text-amber-200 font-serif italic pt-2">
            “Developing the Best Minds for the Future”
          </p>

          {/* 4 Pillars with Icons Matching Image 5 */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-bold">
            <div className="flex items-center gap-2 text-emerald-100">
              <GraduationCap size={18} className="text-amber-400" />
              <span>Quality Education</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <Users size={18} className="text-amber-400" />
              <span>Character Development</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <Lightbulb size={18} className="text-amber-400" />
              <span>Research for Community</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <TrendingUp size={18} className="text-amber-400" />
              <span>A Brighter Tomorrow</span>
            </div>
          </div>

        </div>

        {/* Bottom Gate Illustration Matching Image 5 */}
        <div className="relative z-10 pt-8 mt-6">
          <div className="rounded-2xl overflow-hidden border-2 border-emerald-700/60 shadow-2xl relative h-64 bg-emerald-950">
            <img
              src="/campus-gate.jpg"
              alt="AHCAS Monumental Campus Gate"
              className="w-full h-full object-cover object-center filter brightness-90 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-slate-200 font-mono">
                Academic Centre: JSS Agyana Road Study Centre, Abaji Abuja
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: AUTHENTICATION FORM (EXACT MATCH TO IMAGE 5) */}
      {/* ========================================================================= */}
      <div className="flex-1 bg-white p-6 sm:p-12 lg:p-16 flex flex-col justify-between overflow-y-auto">
        
        {/* Top Right: Visit Website Link */}
        <div className="flex justify-end">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#006B35] transition-colors"
          >
            <span>Visit our website</span>
            <ExternalLink size={14} />
          </Link>
        </div>

        {/* Main Form Container */}
        <div className="max-w-md w-full mx-auto my-auto space-y-6 py-6">
          
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Join AL-HIDAYAH COLLEGE OF ADVANCED STUDIES, Abaji and take the next step in your academic journey.
            </p>
          </div>

          {/* Role Switcher Tabs Matching Image 5 */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRoleType('Applicant')}
              className={`flex items-center gap-2.5 p-3 rounded-xl text-left transition-all cursor-pointer ${
                roleType === 'Applicant'
                  ? 'bg-[#004D26] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <GraduationCap size={18} className={roleType === 'Applicant' ? 'text-amber-300' : 'text-slate-500'} />
              <div>
                <span className="font-extrabold text-xs block leading-none">Applicant</span>
                <span className={`text-[10px] block mt-0.5 ${roleType === 'Applicant' ? 'text-emerald-200' : 'text-slate-400'}`}>
                  Applying for admission
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRoleType('Student')}
              className={`flex items-center gap-2.5 p-3 rounded-xl text-left transition-all cursor-pointer ${
                roleType === 'Student'
                  ? 'bg-[#004D26] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <User size={18} className={roleType === 'Student' ? 'text-amber-300' : 'text-slate-500'} />
              <div>
                <span className="font-extrabold text-xs block leading-none">Student</span>
                <span className={`text-[10px] block mt-0.5 ${roleType === 'Student' ? 'text-emerald-200' : 'text-slate-400'}`}>
                  Already admitted
                </span>
              </div>
            </button>
          </div>

          {/* Error & Success Messages */}
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{authError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Fields Matching Image 5 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <>
                {/* First Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    First name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006B35] transition-colors"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Last name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006B35] transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006B35] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#006B35] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {isSignUp && (
                <span className="text-[10px] text-slate-400 block mt-1">
                  Use at least 8 characters with a mix of letters, numbers and symbols.
                </span>
              )}
            </div>

            {/* Terms Checkbox */}
            {isSignUp && (
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#006B35] focus:ring-emerald-500 mt-0.5"
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  I agree to the <span className="font-bold text-slate-800 underline">Terms of Service</span> and <span className="font-bold text-slate-800 underline">Privacy Policy</span>
                </span>
              </label>
            )}

            {/* Submit Golden Button Matching Image 5 */}
            <button
              type="submit"
              disabled={loading || (isSignUp && !agreeTerms)}
              className="w-full py-3 bg-[#E5A823] hover:bg-[#c99015] text-slate-950 font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in to portal'}</span>
              <ArrowRight size={16} />
            </button>

          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="text-center pt-2 text-xs text-slate-600">
            {isSignUp ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setAuthError(''); }}
                  className="font-bold text-[#006B35] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setAuthError(''); }}
                  className="font-bold text-[#006B35] hover:underline cursor-pointer"
                >
                  Create one
                </button>
              </span>
            )}
          </div>

        </div>

        {/* Official Portal Footer */}
        <div className="text-center text-[11px] text-slate-500 pt-6">
          Official Institutional Portal • Al-Hidayah College of Advanced Studies, Abaji, Abuja
        </div>

      </div>

    </div>
  );
};
