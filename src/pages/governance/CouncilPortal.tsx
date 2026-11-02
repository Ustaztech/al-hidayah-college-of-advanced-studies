import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import {
  Building2,
  Calendar,
  FileText,
  Lock,
  Shield,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  Users,
  Eye,
  Vote
} from 'lucide-react';

export const CouncilPortal: React.FC = () => {
  const { currentUser, role } = useAuth();

  const [activeTab, setActiveTab] = useState<'papers' | 'meetings' | 'resolutions' | 'strategic'>('papers');
  const [downloadNotice, setDownloadNotice] = useState('');

  const boardPapers = [
    {
      id: 'bp-2026-001',
      title: 'Quarterly Academic Progress & Curriculum Report (IJMB Cohort I)',
      reference: 'AHCAS/GC/BP/2026/01',
      classification: 'Confidential',
      date: '2026-09-15',
      committee: 'Academic Board Liaison',
      size: '2.4 MB'
    },
    {
      id: 'bp-2026-002',
      title: 'Bursary Financial Statement & 2026/2027 Capital Budget Audit',
      reference: 'AHCAS/GC/BP/2026/02',
      classification: 'Secret',
      date: '2026-09-20',
      committee: 'Finance & General Purposes Committee',
      size: '4.1 MB'
    },
    {
      id: 'bp-2026-003',
      title: 'NBTE Institutional Accreditation & Citi Polytechnic Affiliation Memorandum',
      reference: 'AHCAS/GC/BP/2026/03',
      classification: 'Confidential',
      date: '2026-10-02',
      committee: 'Regulatory & Physical Planning',
      size: '1.8 MB'
    },
    {
      id: 'bp-2026-004',
      title: 'Infrastructure Expansion Plan: JSS Agyana Road Permanent Study Centre Labs',
      reference: 'AHCAS/GC/BP/2026/04',
      classification: 'Confidential',
      date: '2026-10-18',
      committee: 'Works & Infrastructure Committee',
      size: '5.6 MB'
    }
  ];

  const meetings = [
    {
      id: 'mtg-01',
      title: '4th Ordinary Meeting of the Governing Council',
      date: 'Thursday, 12th November 2026 • 10:00 AM',
      venue: 'Executive Council Chambers, AHCAS Directorate, Abaji Abuja',
      status: 'Scheduled',
      agendaCount: 6
    },
    {
      id: 'mtg-02',
      title: 'Extraordinary Session on 2026/2027 Academic Admissions',
      date: 'Monday, 24th August 2026 • 11:30 AM',
      venue: 'Council Chambers, Abaji',
      status: 'Concluded',
      agendaCount: 4
    }
  ];

  const resolutions = [
    {
      id: 'res-01',
      resolutionNumber: 'RES/AHCAS/GC/2026/009',
      title: 'Approval of 1st Installment IJMB Tuition Subsidies for Abaji Indigenes',
      adoptedDate: '2026-08-24',
      status: 'Implemented',
      assignedTo: 'Office of the College Bursar'
    },
    {
      id: 'res-02',
      resolutionNumber: 'RES/AHCAS/GC/2026/010',
      title: 'Establishment of Computer-Based Testing (CBT) Centre of Excellence',
      adoptedDate: '2026-08-24',
      status: 'In Progress',
      assignedTo: 'Centre Coordinator (Mall. Ibrahim Idris Gambo)'
    },
    {
      id: 'res-03',
      resolutionNumber: 'RES/AHCAS/GC/2026/011',
      title: 'Formal Affiliation Framework with Citi Polytechnic Abuja for ND/HND Programmes',
      adoptedDate: '2026-09-15',
      status: 'Adopted',
      assignedTo: 'Office of the Executive Chairman & Founder'
    }
  ];

  const handleDownloadPaper = (title: string, ref: string) => {
    setDownloadNotice(`Secure cryptographic link generated for "${title}" (${ref}). Download initiated.`);
    setTimeout(() => setDownloadNotice(''), 4000);
  };

  return (
    <PortalLayout activeNav="Council Boardroom" portalTitle="Governing Council Portal">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0A0F1D] text-white p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#e69912] text-slate-950 font-mono">
                Governing Council Workspace
              </span>
              <span className="text-amber-200 text-xs font-semibold flex items-center gap-1">
                <Lock size={12} /> Restricted Access • Level 4 Security
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AHCAS Governing Council Boardroom
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Confidential board papers repository, meeting agendas, minutes of proceedings, and institutional resolutions tracking desk.
            </p>
          </div>

          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl flex items-center gap-3">
            <img
              src="/provost-mbsuleiman.jpg"
              alt="Dr. MB Suleiman, PhD"
              className="w-12 h-12 rounded-xl object-cover border border-[#e69912]"
            />
            <div className="text-xs">
              <span className="text-amber-300 font-bold block">Dr. MB Suleiman, PhD</span>
              <span className="text-slate-400 text-[10px] font-medium">Executive Chairman of Council</span>
            </div>
          </div>
        </div>

        {downloadNotice && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-center gap-2 animate-fade-in font-medium">
            <CheckCircle2 size={16} />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'papers', label: 'Confidential Board Papers' },
            { id: 'meetings', label: 'Council Meetings & Agendas' },
            { id: 'resolutions', label: 'Resolutions & Actions Tracker' },
            { id: 'strategic', label: 'Strategic Plan Progress' }
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

        {/* Board Papers Tab */}
        {activeTab === 'papers' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Classified Council Documentation
                </h3>
                <p className="text-xs text-slate-500">
                  All documents are digitally watermarked and audited upon access.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-lg">
                {boardPapers.length} Active Board Papers
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {boardPapers.map(paper => (
                <div key={paper.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                        paper.classification === 'Secret' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {paper.classification}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{paper.reference}</span>
                      <span className="text-[10px] text-slate-400">• {paper.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {paper.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 block">
                      Committee: <strong>{paper.committee}</strong> • File size: {paper.size}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDownloadPaper(paper.title, paper.reference)}
                    className="px-4 py-2 bg-[#196855] hover:bg-[#196855] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0 transition-colors"
                  >
                    <Download size={14} />
                    <span>Download Secure PDF</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.map(mtg => (
              <div key={mtg.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    mtg.status === 'Scheduled' ? 'bg-emerald-100 text-[#196855]' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {mtg.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{mtg.agendaCount} Agenda Items</span>
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {mtg.title}
                </h4>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#196855]" />
                    <span>{mtg.date}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Building2 size={13} className="text-[#e69912]" />
                    <span>{mtg.venue}</span>
                  </p>
                </div>
                <button
                  onClick={() => alert(`Opening formal meeting notice and agenda packet for "${mtg.title}"`)}
                  className="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  View Meeting Notice & Agenda
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Resolutions Tab */}
        {activeTab === 'resolutions' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Official Governing Council Resolutions & Implementation Status
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Resolution No.</th>
                    <th className="p-3">Resolution Title</th>
                    <th className="p-3">Adopted Date</th>
                    <th className="p-3">Assigned Responsibility</th>
                    <th className="p-3">Execution Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {resolutions.map(res => (
                    <tr key={res.id}>
                      <td className="p-3 font-mono text-emerald-800 dark:text-emerald-300 font-bold">{res.resolutionNumber}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{res.title}</td>
                      <td className="p-3 font-mono text-slate-500">{res.adoptedDate}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{res.assignedTo}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          res.status === 'Implemented'
                            ? 'bg-emerald-100 text-[#196855]'
                            : res.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Strategic Plan Tab */}
        {activeTab === 'strategic' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Institutional Strategic Plan: 2025 – 2030 Milestones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-300">Phase 1: Foundation (Completed)</span>
                <h4 className="font-bold text-slate-900 dark:text-white">IJMB Accreditation & Study Centre Establishment</h4>
                <p className="text-slate-600 dark:text-slate-400">Formal ABU coordination, registration of centre at JSS Agyana Road Abaji, inaugural pioneer cohort.</p>
              </div>

              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-800 dark:text-amber-300">Phase 2: Consolidation (Active)</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Polytechnic Affiliation & CBT Excellence</h4>
                <p className="text-slate-600 dark:text-slate-400">Citi Polytechnic affiliation for ND/HND Mass Comm, Computer Science, and Science Lab Tech; full digital campus deployment.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Phase 3: Expansion (2027+)</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Permanent Campus & Degree Programmes</h4>
                <p className="text-slate-600 dark:text-slate-400">Construction of dedicated faculty buildings, lecture amphitheatres, and university degree sandwich partnerships.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
