import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, UserPlus, Shield, X, CheckCircle, AlertCircle, Eye, EyeOff, Lock, Mail, User, Phone, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, register, authError, setAuthError } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'APPLICANT' | 'STAFF'>('APPLICANT');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      await login(email, password);
      setLoading(false);
      setSuccessMsg('Signed in successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 700);
    } catch (err: any) {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      await register(name, email, password, role, role === 'STAFF' ? 'REGISTRAR' : undefined, phone);
      setLoading(false);
      setSuccessMsg('Account created and signed in successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 800);
    } catch (err: any) {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#006B35] to-[#004D26] text-white p-5 flex justify-between items-center relative overflow-hidden shrink-0">
          <div className="flex items-center gap-3 relative z-10">
            <img src="/official-logo.jpg" alt="AHCAS Official Logo" className="h-11 w-auto bg-white p-0.5 rounded-xl border border-emerald-400 shadow-md" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base font-serif">AHCAS Integrated Portal Auth</h3>
              <p className="text-[10px] text-amber-300 font-medium">Abaji, FCT Abuja • Official Secure Access</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold shrink-0">
          <button
            onClick={() => { setTab('login'); setAuthError(''); }}
            className={`flex-1 py-3 text-center transition-colors ${
              tab === 'login'
                ? 'text-[#006B35] dark:text-emerald-400 border-b-2 border-[#006B35] bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In to Portal
          </button>
          <button
            onClick={() => { setTab('register'); setAuthError(''); }}
            className={`flex-1 py-3 text-center transition-colors ${
              tab === 'register'
                ? 'text-[#006B35] dark:text-emerald-400 border-b-2 border-[#006B35] bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          
          {authError && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 rounded-xl flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600 shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email, Matric Number, or Application Ref
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. AHCAS/IJMB/2025/001 or director@..."
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <span className="text-[10px] text-amber-600 font-medium">Confidential</span>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#006B35] hover:bg-[#004D26] text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={16} />
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ibrahim Abubakar"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="candidate@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  >
                    <option value="APPLICANT">Candidate / Applicant</option>
                    <option value="STAFF">Academic Staff / Officer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="08056350078"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-[11px] text-amber-800 dark:text-amber-300 rounded-xl">
                <strong>Notice:</strong> Matriculated student accounts are provisioned following registration review and issuance of admission letter.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Create Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#D4A62A] hover:bg-[#b88d1d] text-black font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <UserPlus size={16} />
                <span>Register Account</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
