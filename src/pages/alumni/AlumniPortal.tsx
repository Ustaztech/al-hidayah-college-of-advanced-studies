import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import {
  GraduationCap,
  Award,
  Users,
  Search,
  CheckCircle2,
  FileText,
  Briefcase,
  Calendar,
  Send,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const AlumniPortal: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'directory' | 'transcript' | 'mentorship'>('directory');
  const [transcriptMatric, setTranscriptMatric] = useState('');
  const [transcriptNotice, setTranscriptNotice] = useState('');

  const alumniMembers = [
    {
      name: 'Dr. Fatima Abdullahi (Pioneer IJMB Grad)',
      graduationYear: '2024',
      programme: 'IJMB Science (Medicine & Surgery Direct Entry)',
      currentStatus: 'House Officer, National Hospital Abuja',
      location: 'Abuja, FCT'
    },
    {
      name: 'Engr. Kabiru Mohammed',
      graduationYear: '2024',
      programme: 'IJMB Science (Computer Engineering Direct Entry)',
      currentStatus: 'Software Engineer & Network Architect',
      location: 'Garki, Abuja'
    },
    {
      name: 'Amina Usman Bello',
      graduationYear: '2025',
      programme: 'IJMB Arts & Commercial (Law Direct Entry)',
      currentStatus: 'Direct Entry 200L LL.B Student, ABU Zaria',
      location: 'Zaria / Abaji'
    }
  ];

  const handleOrderTranscript = (e: React.FormEvent) => {
    e.preventDefault();
    setTranscriptNotice(`Transcript request logged for ${transcriptMatric}. Official Academic Registry verification reference generated.`);
    setTimeout(() => {
      setTranscriptNotice('');
      setTranscriptMatric('');
    }, 4000);
  };

  return (
    <PortalLayout activeNav="Alumni Portal" portalTitle="Alumni Relations & Graduate Network">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#196855] via-[#196855] to-[#196855] text-white p-6 sm:p-7 rounded-3xl border border-[#e69912]/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#e69912] font-mono block">
              AHCAS Alumni Relations Directorate
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Graduate Community & Career Network
            </h1>
            <p className="text-xs text-emerald-100 max-w-xl">
              Connecting AHCAS IJMB and Polytechnic graduates with university Direct Entry admissions, postgraduate fellowships, and career mentorship.
            </p>
          </div>

          <div className="px-4 py-2 bg-emerald-950/70 border border-emerald-800 rounded-2xl flex items-center gap-2">
            <GraduationCap className="text-[#e69912]" size={24} />
            <div className="text-xs">
              <span className="text-amber-300 font-bold block">Pioneer Alumni Cohort</span>
              <span className="text-slate-300 text-[10px]">2024 – 2026 Cohorts</span>
            </div>
          </div>
        </div>

        {transcriptNotice && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-center gap-2 animate-fade-in font-medium">
            <CheckCircle2 size={16} />
            <span>{transcriptNotice}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'directory', label: 'Graduate Directory' },
            { id: 'transcript', label: 'Transcript & Statement of Results' },
            { id: 'mentorship', label: 'Career Mentorship Desk' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#196855] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Directory Tab */}
        {activeTab === 'directory' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Distinguished Alumni Members
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alumniMembers.map((member, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#196855] dark:text-emerald-400">Class of {member.graduationYear}</span>
                    <Award size={14} className="text-[#e69912]" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{member.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{member.programme}</p>
                  <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-700">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">{member.currentStatus}</p>
                    <p>{member.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript Tab */}
        {activeTab === 'transcript' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs max-w-xl space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-[#196855]" />
              Official Transcript Issuance Request
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Official academic transcripts are dispatched directly to accredited universities, evaluation agencies (WES, ECE), or employers.
            </p>
            <form onSubmit={handleOrderTranscript} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Matriculation Number</label>
                <input
                  type="text"
                  required
                  placeholder="AHCAS/IJMB/2025/001"
                  value={transcriptMatric}
                  onChange={e => setTranscriptMatric(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Destination Institution & Address</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Office of Undergraduate Admissions, Ahmadu Bello University, Zaria..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 text-amber-900 dark:text-amber-300 space-y-0.5">
                <span className="font-bold">Statutory Transcript Processing Fee:</span>
                <p className="font-mono font-bold">₦17,000 (Certified Sealed Copy)</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#196855] hover:bg-[#196855] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                <Send size={14} />
                <span>Submit Transcript Application</span>
              </button>
            </form>
          </div>
        )}

        {/* Mentorship Tab */}
        {activeTab === 'mentorship' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase size={18} className="text-[#196855]" />
              Career & University Mentorship Programme
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Senior alumni mentors volunteer to guide current IJMB students on JAMB Direct Entry form filling, university screening tests, and pre-med/engineering subject preparation.
            </p>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Register as an Alumni Mentor</h4>
                <span className="text-[11px] text-slate-500">Support incoming 2026/2027 students from Abaji and the Federal Capital Territory.</span>
              </div>
              <button
                onClick={() => alert('Alumni mentorship application received. Directorate of Student Affairs will contact you.')}
                className="px-4 py-2 bg-[#196855] text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Volunteer Now
              </button>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
