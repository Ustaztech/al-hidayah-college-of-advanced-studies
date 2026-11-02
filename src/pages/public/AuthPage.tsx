import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRoleMetadata } from '../../services/rbac';
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
  AlertCircle,
  KeyRound,
  FileText
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, authError, setAuthError } = useAuth();

  const isRegisterRoute = location.pathname.includes('register');
  const [isSignUp, setIsSignUp] = useState(isRegisterRoute);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const ADMIN_ACCOUNT = {
    role: 'SUPER_ADMIN',
    label: 'Institutional Administrator',
    department: 'Executive Administration Desk',
    identifier: 'admin@alhidayahcollege.com.ng',
    pass: 'Admin@AHCAS2026!'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const cleanId = identifier.trim();
    if (!cleanId) {
      setAuthError('Please enter your email, matriculation number, or application reference.');
      return;
    }

    if (!password) {
      setAuthError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
        if (!fullName) {
          setAuthError('Please enter your full name.');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setAuthError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        await register(
          fullName,
          cleanId.toLowerCase(),
          password,
          'APPLICANT',
          undefined,
          INSTITUTION_INFO.phone
        );
        setSuccessMsg('Application account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/apply');
        }, 600);
      } else {
        const user = await login(cleanId, password);
        setSuccessMsg(`Welcome back, ${user.name}! Redirecting...`);
        
        setTimeout(() => {
          const fromDest = (location.state as any)?.from?.pathname;
          if (fromDest) {
            navigate(fromDest);
            return;
          }
          const effectiveRole = user.role === 'STAFF' ? (user.subRole || 'SUPER_ADMIN') : user.role;
          const meta = getRoleMetadata(effectiveRole);
          navigate(meta.portalHome || '/');
        }, 600);
      }
    } catch (err: any) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-stretch font-sans select-none">
      
      {/* Left Column: Institutional Identity & Gate */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#196855] text-white p-12 flex-col justify-between relative overflow-hidden shadow-2xl">
        
        {/* Top Header */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg border-2 border-[#e69912] flex items-center justify-center">
              <img
                src="/official-logo.jpg"
                alt="AHCAS Official Crest"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-white leading-tight">
                Al-Hidayah College
              </h1>
              <span className="text-sm font-black text-amber-300 uppercase tracking-widest block">
                of Advanced Studies
              </span>
              <span className="text-xs text-emerald-200 uppercase tracking-wider block">
                Abaji, FCT Abuja
              </span>
            </div>
          </div>

          <p className="text-base text-amber-200 font-serif italic pt-2">
            “Developing the Best Minds for the Future”
          </p>

          {/* Core Institutional Highlights */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-bold">
            <div className="flex items-center gap-2 text-emerald-100">
              <GraduationCap size={18} className="text-amber-400" />
              <span>Accredited IJMB Study Centre</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <Users size={18} className="text-amber-400" />
              <span>200 Level Direct Entry</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <Lightbulb size={18} className="text-amber-400" />
              <span>Continuous Assessment & CBT</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <TrendingUp size={18} className="text-amber-400" />
              <span>Rigorous Academic Pacing</span>
            </div>
          </div>
        </div>

        {/* Campus Gate Photo */}
        <div className="relative z-10 pt-8 mt-6">
          <div className="rounded-2xl overflow-hidden border-2 border-emerald-700/60 shadow-2xl relative h-64 bg-emerald-950">
            <img
              src="/campus-gate.jpg"
              alt="Al-Hidayah College Campus Entrance"
              className="w-full h-full object-cover object-center filter brightness-90 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-slate-200 font-mono">
                Study Centre: JSS Agyana Road, Abaji, Abuja
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Authentication Form */}
      <div className="flex-1 bg-white p-6 sm:p-12 lg:p-16 flex flex-col justify-between overflow-y-auto">
        
        {/* Top Link: Back to Home */}
        <div className="flex justify-end">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#196855] transition-colors"
          >
            <span>Back to website</span>
            <ExternalLink size={14} />
          </Link>
        </div>

        {/* Main Form Box */}
        <div className="max-w-md w-full mx-auto my-auto space-y-6 py-6">
          
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              {isSignUp ? 'Create Applicant Account' : 'Sign in to College Portal'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {isSignUp
                ? 'Register to start your 2026/2027 IJMB Direct Entry application.'
                : 'Sign in with your Email, Student Matriculation Number, or Application Reference.'}
            </p>
          </div>

          {/* Clean Sign In vs Sign Up Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setAuthError(''); }}
              className={`py-2.5 rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-[#196855] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Portal Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setAuthError(''); }}
              className={`py-2.5 rounded-lg transition-all ${
                isSignUp
                  ? 'bg-[#196855] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Applicant Sign Up
            </button>
          </div>

          {/* Feedback Messages */}
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ibrahim"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#196855]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gambo"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#196855]"
                  />
                </div>
              </div>
            )}

            {/* Identifier: Email, Matric Number, or App Reference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isSignUp ? 'Email Address' : 'Email, Matric Number, or Application Reference'}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={isSignUp ? 'email' : 'text'}
                  required
                  placeholder={
                    isSignUp
                      ? 'e.g. candidate@gmail.com'
                      : 'e.g. student@alhidayahcollege.com.ng, AHCAS/2026/001'
                  }
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#196855]"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#196855]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {isSignUp && (
                <span className="text-[10px] text-slate-400 block mt-1">
                  Use at least 6 characters.
                </span>
              )}
            </div>

            {/* Terms Checkbox */}
            {isSignUp && (
              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#196855] focus:ring-emerald-500 mt-0.5"
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  I agree to institutional admission guidelines and academic code of conduct.
                </span>
              </label>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (isSignUp && !agreeTerms)}
              className="w-full py-3 bg-[#e69912] hover:bg-[#c99015] text-slate-950 font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Applicant Account' : 'Sign in to Portal'}</span>
              <ArrowRight size={16} />
            </button>

            {/* Administrator Sign-In Assistance */}
            {!isSignUp && (
              <div className="pt-3 border-t border-slate-200 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setIdentifier(ADMIN_ACCOUNT.identifier);
                    setPassword(ADMIN_ACCOUNT.pass);
                    setAuthError('');
                  }}
                  className="w-full p-2.5 text-left rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound size={15} className="text-[#196855]" />
                    <div>
                      <span className="font-extrabold text-xs text-slate-800 group-hover:text-[#196855] block">
                        Institutional Administrator Access
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {ADMIN_ACCOUNT.identifier}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#196855] uppercase tracking-wider bg-white px-2 py-1 rounded-md border border-emerald-200 shadow-xs">
                    Admin Sign-In
                  </span>
                </button>
              </div>
            )}

          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="text-center pt-2 text-xs text-slate-600">
            {isSignUp ? (
              <span>
                Already enrolled or have an application?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setAuthError(''); }}
                  className="font-bold text-[#196855] hover:underline"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Prospective candidate seeking admission?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setAuthError(''); }}
                  className="font-bold text-[#196855] hover:underline"
                >
                  Apply Here
                </button>
              </span>
            )}
          </div>

        </div>

        {/* Portal Footer */}
        <div className="text-center text-[11px] text-slate-500 pt-6">
          Official Institutional Portal • Al-Hidayah College of Advanced Studies, Abaji, Abuja
        </div>

      </div>

    </div>
  );
};

export default AuthPage;
