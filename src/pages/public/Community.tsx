import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import {
  Users,
  Heart,
  Handshake,
  BookOpen,
  GraduationCap,
  Building,
  CheckCircle2,
  Send,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';

export const Community: React.FC = () => {
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [sponsorPhone, setSponsorPhone] = useState('');
  const [sponsorshipTier, setSponsorshipTier] = useState('Full Tuition (₦258,500)');
  const [beneficiaryPreference, setBeneficiaryPreference] = useState('Science & Medicine (Female)');
  const [submitted, setSubmitted] = useState(false);

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#196855] via-[#196855] to-[#0F172A] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#e69912] text-slate-950 uppercase tracking-widest">
              Community Engagement & Development
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
              Empowering Minds, Transforming Abaji Community
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans">
              Al-Hidayah College of Advanced Studies is anchored in educational accessibility. Through community partnerships, youth educational mentoring, and our Sponsor-A-Student initiative, we break financial barriers to ensure promising secondary school graduates in Abaji and the FCT secure direct university admission.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#sponsor"
                className="px-6 py-3 bg-[#e69912] hover:bg-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <Heart size={16} />
                <span>Sponsor a Deserving Student</span>
              </a>
              <Link
                to="/contact"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm rounded-xl border border-white/20 transition-all inline-flex items-center gap-2"
              >
                <span>Partner with AHCAS</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Initiatives Grid */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black text-[#196855] dark:text-emerald-400 uppercase tracking-widest block mb-1">
            Community Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Active Community Initiatives
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Delivering tangible educational and social impact across the Federal Capital Territory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#196855] dark:text-emerald-400 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Sponsor-A-Student Fund
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Provides tuition and examination subsidies for high-achieving public secondary school leavers who face financial constraints, enabling them to complete the 12-month IJMB A-Level curriculum.
            </p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#196855] shrink-0" />
                <span>100% transparent bursary disbursement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#196855] shrink-0" />
                <span>Direct semester progress updates to sponsors</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Secondary School Mentoring
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Annual subject combination clinics and university career advisory hosted for secondary schools in Abaji Area Council to prevent career mismatch and guide students on direct 200 Level entry options.
            </p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-amber-600 shrink-0" />
                <span>Free career counseling sessions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-amber-600 shrink-0" />
                <span>O’Level deficiency remediation advisory</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Handshake size={24} />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Institutional Partnerships
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Collaborating with community leaders, corporate organizations, and philanthropic foundations to expand laboratory infrastructure, digital e-library resources, and subsidized student accommodation.
            </p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                <span>Community liaison committee engagement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                <span>Modern science laboratory support</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sponsorship Form Section */}
      <section id="sponsor" className="py-14 bg-emerald-950 text-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900/90 border border-emerald-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-black text-[#e69912] uppercase tracking-widest">
                Educational Philanthropy
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
                Sponsor a Student’s IJMB Academic Journey
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                Join our network of alumni, community leaders, and well-wishers investing directly in young leaders from Abaji and the Federal Capital Territory.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-900/60 border border-emerald-500 rounded-2xl text-center space-y-3">
                <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Thank You for Your Pledge!</h3>
                <p className="text-xs text-emerald-200 max-w-md mx-auto">
                  Your sponsorship pledge for <strong>{sponsorshipTier}</strong> has been logged. Our Bursary & Community Liaison Desk will contact you at <strong>{sponsorEmail}</strong> with official verification and candidate matching details.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-lg text-white"
                >
                  Submit Another Pledge
                </button>
              </div>
            ) : (
              <form onSubmit={handleSponsorSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Full Name / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={sponsorName}
                      onChange={e => setSponsorName(e.target.value)}
                      placeholder="e.g. Alh. Bashir Garba / Unity Foundation"
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e69912]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={sponsorEmail}
                      onChange={e => setSponsorEmail(e.target.value)}
                      placeholder="sponsor@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e69912]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={sponsorPhone}
                      onChange={e => setSponsorPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e69912]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Sponsorship Tier *
                    </label>
                    <select
                      value={sponsorshipTier}
                      onChange={e => setSponsorshipTier(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e69912]"
                    >
                      <option value="Full Tuition (₦258,500)">Full Tuition & Exam Registration (₦258,500)</option>
                      <option value="1st Semester Installment (₦154,000)">1st Semester Resumption Installment (₦154,000)</option>
                      <option value="2nd Semester Installment (₦105,500)">2nd Semester Exam Installment (₦105,500)</option>
                      <option value="Application Form Subsidies (₦50,000)">Subsidize 5 Candidate Forms (₦52,500)</option>
                      <option value="Custom Donation">Custom Educational Endowment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Beneficiary Preference (Optional)
                  </label>
                  <select
                    value={beneficiaryPreference}
                    onChange={e => setBeneficiaryPreference(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e69912]"
                  >
                    <option value="Science & Medicine (Female)">Merit-Based Science & Medicine (Female)</option>
                    <option value="Engineering & Technology">Engineering & Technology Candidates</option>
                    <option value="Law & Social Sciences">Law, Arts & Commercial Candidates</option>
                    <option value="Indigent Abaji Resident">Indigent Resident of Abaji Area Council</option>
                    <option value="No Preference">No Preference (Discretion of Scholarship Board)</option>
                  </select>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#e69912] hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Send size={16} />
                    <span>Confirm Sponsorship Pledge</span>
                  </button>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Official Bursary receipts and candidate matching documents will be issued upon clearance.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Community Contacts */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h3 className="text-xl font-extrabold font-serif">Community Liaison Secretariat</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {INSTITUTION_INFO.address} • Abaji, Federal Capital Territory (FCT), Abuja.
        </p>
        <p className="text-xs text-slate-500 font-mono">
          Email: {INSTITUTION_INFO.email} • Telephone: {INSTITUTION_INFO.phone}
        </p>
      </section>
    </div>
  );
};
