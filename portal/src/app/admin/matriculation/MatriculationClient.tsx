'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Printer,
  Users,
  Award,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { MatriculationRecord, AuthSessionUser } from '@/lib/types';
import { PortalHeader } from '@/components/layout/PortalHeader';
import { PortalSidebar } from '@/components/layout/PortalSidebar';

interface MatriculationClientProps {
  user: AuthSessionUser;
  initialMatriculations: (MatriculationRecord & { student?: any; profile?: any; application?: any })[];
  counts: any;
}

export const MatriculationClient: React.FC<MatriculationClientProps> = ({
  user,
  initialMatriculations,
  counts
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [matriculations, setMatriculations] = useState(initialMatriculations);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const filteredMatriculations = matriculations.filter(m => {
    if (levelFilter !== 'all' && m.level !== levelFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMatric = m.matric_number.toLowerCase().includes(q);
      const matchName = m.profile?.full_name?.toLowerCase().includes(q) || false;
      const matchApp = m.application?.application_number?.toLowerCase().includes(q) || false;
      const matchProg = m.programme?.name?.toLowerCase().includes(q) || false;
      return matchMatric || matchName || matchApp || matchProg;
    }
    return true;
  });

  return (
    <>
      <PortalSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        portalType="admin"
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <PortalHeader
          user={user}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          portalTitle="Registry Matriculation Desk"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full pb-16">
          {/* Top Banner */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#196855]/10 text-[#196855] border border-[#196855]/20">
                  Directorate of Academic Registry
                </span>
                <span className="text-xs text-gray-400 font-mono">Official Matriculation Registers</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight font-serif">
                Matriculation & Enrolled Cohort Desk
              </h1>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                View officially matriculated students, verify registry clearance slips, monitor assigned matriculation numbers, and export official cohort rosters.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
              >
                <Printer size={15} />
                <span>Print Official Roster</span>
              </button>
            </div>
          </div>

          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Matriculated Candidates</p>
                <p className="text-3xl font-black font-mono text-[#196855] mt-1">
                  {counts.matriculatedCount || matriculations.length}
                </p>
                <span className="text-[11px] text-emerald-600 font-medium">Bona fide Registered Students</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#196855] flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Active Students</p>
                <p className="text-3xl font-black font-mono text-gray-900 mt-1">
                  {counts.activeStudents || counts.studentCount}
                </p>
                <span className="text-[11px] text-emerald-600 font-medium">College-Wide Registry</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Users size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Academic Session</p>
                <p className="text-lg font-black font-serif text-gray-900 mt-1">2026/2027 Session</p>
                <span className="text-[11px] text-gray-500 font-medium">Admissions Open</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Calendar size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Acceptance Clearance</p>
                <p className="text-3xl font-black font-mono text-amber-600 mt-1">100%</p>
                <span className="text-[11px] text-amber-700 font-medium">Fee Reconciled</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search matriculation number, student name, application number, programme..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#196855] focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Filter size={14} className="text-gray-400" />
                <select
                  value={levelFilter}
                  onChange={e => setLevelFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-gray-700 outline-none"
                >
                  <option value="all">All Study Levels</option>
                  <option value="IJMB 1">IJMB 1</option>
                  <option value="Diploma 1">Diploma 1</option>
                </select>
              </div>
            </div>
          </div>

          {/* Matriculation Registry Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">
                Matriculation Register ({filteredMatriculations.length})
              </h3>
              <span className="text-xs text-gray-500 font-medium">Sorted by clearance timestamp</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px] border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Matriculation Number</th>
                    <th className="py-3 px-4">Candidate Full Name</th>
                    <th className="py-3 px-4">Application No</th>
                    <th className="py-3 px-4">Enrolled Programme</th>
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">Registry Clearance</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMatriculations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400">
                        No matriculated students recorded yet.
                      </td>
                    </tr>
                  ) : (
                    filteredMatriculations.map(m => {
                      const studentName = m.profile?.full_name || m.application?.personal_details?.surname || 'Enrolled Student';
                      const email = m.profile?.email || m.application?.contact_details?.email_address || '';

                      return (
                        <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-black text-gray-900">
                            <span className="text-[#196855] text-sm">{m.matric_number}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-gray-900 block">{studentName}</span>
                            <span className="text-[10px] text-gray-400 block">{email}</span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-gray-600">
                            {m.application?.application_number || 'AHCAS/APP/...'}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-gray-900 block">
                              {m.programme?.name || 'IJMB Sciences'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                            {m.level}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                              <CheckCircle2 size={13} className="text-[#196855]" />
                              <span>Cleared</span>
                            </div>
                            <span className="text-[10px] text-gray-400 block">
                              {new Date(m.matriculated_at).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {m.application ? (
                              <Link
                                href={`/application/clearance?applicationId=${m.application_id}`}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#196855] hover:bg-emerald-100 font-bold text-xs transition"
                              >
                                <FileText size={13} />
                                <span>Clearance Slip</span>
                              </Link>
                            ) : (
                              <span className="text-gray-400 text-xs">Internal Record</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
