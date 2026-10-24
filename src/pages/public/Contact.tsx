import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Globe, Building2, ShieldCheck } from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'IJMB Direct Entry Admissions',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black text-[#006B35] dark:text-emerald-400 uppercase tracking-wider">
              Official Campus Communication Desk
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-[#D4A62A] font-bold">RC: {INSTITUTION_INFO.rcNumber}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
            Contact Al-Hidayah College of Advanced Studies
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl">
            Have questions regarding IJMB admission registration, subject combination counseling, fee schedules, or study centre verification? Connect with our registry and admission helpdesk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Institutional Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 sm:p-8 bg-[#F8FAFC] dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-5 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src="/official-logo.jpg"
                  alt="Official Crest"
                  className="h-12 w-auto bg-white p-0.5 rounded-xl border border-emerald-400 shadow-sm"
                />
                <div>
                  <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white leading-tight">
                    Al-Hidayah College
                  </h3>
                  <p className="text-[11px] text-amber-600 font-bold uppercase">Abaji FCT Abuja</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#006B35] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Administrative Secretariat:</strong>
                    <span>{INSTITUTION_INFO.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 size={18} className="text-[#F58220] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Academic Study Centre:</strong>
                    <span className="text-[#006B35] dark:text-emerald-400 font-bold">{INSTITUTION_INFO.studyCentre}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-[#D4A62A] shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Direct Telephone Hotline:</strong>
                    <a href={`tel:${INSTITUTION_INFO.phone}`} className="font-mono text-sm font-bold text-slate-900 dark:text-white hover:text-[#006B35]">
                      {INSTITUTION_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Support & Admissions Email:</strong>
                    <a href={`mailto:${INSTITUTION_INFO.email}`} className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      {INSTITUTION_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-purple-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Official Institutional Portal:</strong>
                    <a href={INSTITUTION_INFO.website} target="_blank" rel="noreferrer" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
                      {INSTITUTION_INFO.website}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Office Hours:</strong>
                    <span>Monday – Friday: 8:00 AM – 5:00 PM (West Africa Time)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Assurance Note */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-[#006B35] shrink-0 mt-0.5" />
              <span>
                All official candidate correspondence is logged under Quality Assurance Manual Code <strong>{INSTITUTION_INFO.documentCode}</strong>.
              </span>
            </div>

          </div>

          {/* Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-[#F8FAFC] dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <CheckCircle2 size={52} className="mx-auto text-[#006B35]" />
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                  Message Dispatched Successfully!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out to the Al-Hidayah College Admissions Directorate. A designated advisor will review your request and get back to you within 24 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 bg-[#006B35] text-white text-xs font-bold rounded-xl hover:bg-[#004D26]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-3">
                  <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                    Submit Candidate or Stakeholder Inquiry
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct communication with the Registry and Admissions Unit
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ibrahim Abubakar"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="candidate@gmail.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="08056350078"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Inquiry Department / Subject</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium"
                  >
                    <option value="IJMB Direct Entry Admissions">IJMB Direct Entry Admissions (200L)</option>
                    <option value="Subject Combination Advisory">Subject Combination Advisory (001-073)</option>
                    <option value="Tuition Fee & Installment Structure">Tuition Fee & Installment Structure</option>
                    <option value="Citi Poly Affiliated ND/HND">Citi Poly Affiliated ND/HND Programmes</option>
                    <option value="Study Centre & Inspection Verification">Study Centre & Inspection Verification</option>
                    <option value="E-Library & Past Questions Access">E-Library & Past Questions Access</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Detailed Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="State your question or inquiry here..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#006B35] hover:bg-[#004D26] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Send size={15} />
                  <span>Transmit Inquiry to Admissions Desk</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
