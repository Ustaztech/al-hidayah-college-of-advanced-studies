'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  X,
  FileCheck,
  User,
  Phone,
  GraduationCap,
  Download,
  AlertCircle
} from 'lucide-react';
import { Application } from '@/lib/types';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const url = new URL('/api/admin/applications', window.location.origin);
      if (searchQuery) url.searchParams.set('q', searchQuery);
      if (statusFilter !== 'all') url.searchParams.set('status', statusFilter);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header Banner */}
      <div className="bg-[#196855] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold leading-tight">AL-HIDAYAH COLLEGE OF ADVANCED STUDIES</h1>
              <p className="text-xs text-emerald-100">Admissions Processing Directorate — Candidate Dossiers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end md:self-auto">
            <Link
              href="/admin/dashboard"
              className="text-xs font-medium text-emerald-100 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Admin Dashboard
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 mt-6">
        {/* Controls & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name, app no, ref, or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#196855]"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#196855] text-white rounded text-[11px] font-bold hover:bg-emerald-800 transition"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#196855] bg-white font-medium"
            >
              <option value="all">All Application Statuses</option>
              <option value="submitted">Submitted Only</option>
              <option value="in_progress">In Progress</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Applications Dossiers Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Candidate Applications ({applications.length})
            </h2>
            <span className="text-[11px] text-slate-500">
              Showing filtered results
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Applicant Info</th>
                  <th className="px-5 py-3">Applied Course</th>
                  <th className="px-5 py-3">Session</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Submission Ref</th>
                  <th className="px-5 py-3 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">Loading candidate applications...</td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No applications found matching criteria.</td>
                  </tr>
                ) : (
                  applications.map(app => {
                    const candidateName = [
                      app.personal_details?.surname,
                      app.personal_details?.first_name,
                      app.personal_details?.middle_name
                    ].filter(Boolean).join(' ') || app.applicant?.full_name || 'Candidate';

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-slate-900 block uppercase">{candidateName}</span>
                          <span className="text-[11px] text-[#196855] font-mono">{app.application_number}</span>
                          <span className="text-[11px] text-slate-400 block">{app.applicant?.email}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-slate-800 block">
                            {app.selected_programme?.programme?.name || 'Programme Pending'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {app.selected_programme?.duration || '1 Session'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-medium">{app.admission_session?.name || '2026/2027'}</td>
                        <td className="px-5 py-3.5">
                          {app.status === 'submitted' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Submitted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3" /> In Progress
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-[11px] text-slate-700">
                          {app.submission_reference || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] font-bold transition"
                          >
                            <Eye className="w-3.5 h-3.5" /> Inspect
                          </button>
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

      {/* Candidate Dossier Inspection Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#196855]" /> Candidate Admission Dossier
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  App ID: {selectedApp.application_number} • Ref: {selectedApp.submission_reference || 'DRAFT'}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs text-slate-700">
              {/* Bio-data Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-3 text-[#196855]">
                  1. Bio-Data & Origin
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Full Name:</span>
                    <span className="font-bold uppercase">
                      {[selectedApp.personal_details?.surname, selectedApp.personal_details?.first_name, selectedApp.personal_details?.middle_name].filter(Boolean).join(' ') || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Date of Birth:</span>
                    <span className="font-semibold">{selectedApp.personal_details?.date_of_birth || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Gender:</span>
                    <span className="font-semibold capitalize">{selectedApp.personal_details?.gender || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">State / LGA:</span>
                    <span className="font-semibold">
                      {selectedApp.personal_details?.state_of_origin || '—'} ({selectedApp.personal_details?.lga_of_origin || '—'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-3 text-[#196855]">
                  2. Contact & Address
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Phone:</span>
                    <span className="font-semibold">{selectedApp.contact_details?.phone_number || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Registered Email:</span>
                    <span className="font-semibold">{selectedApp.applicant?.email || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">State of Residence:</span>
                    <span className="font-semibold">{selectedApp.contact_details?.state_of_residence || '—'}</span>
                  </div>
                  <div className="md:col-span-3">
                    <span className="text-slate-500 block text-[11px]">Permanent Address:</span>
                    <span className="font-medium">{selectedApp.contact_details?.residential_address || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Parent / Guardian */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-3 text-[#196855]">
                  3. Parent / Guardian (Next of Kin)
                </h4>
                {(selectedApp.guardians || []).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Name:</span>
                      <span className="font-semibold">{selectedApp.guardians![0].full_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Relationship:</span>
                      <span className="font-semibold">{selectedApp.guardians![0].relationship}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Phone:</span>
                      <span className="font-semibold">{selectedApp.guardians![0].phone_number}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">None provided</span>
                )}
              </div>

              {/* O-Level Qualifications */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-3 text-[#196855]">
                  4. O-Level Examination Results
                </h4>
                {(selectedApp.qualifications || []).map((q, idx) => (
                  <div key={idx} className="mb-3 last:mb-0 bg-white p-3 rounded border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-800 pb-1 mb-2 border-b border-slate-100 text-[11px]">
                      <span>{q.exam_name} ({q.exam_year})</span>
                      <span className="font-mono">No: {q.exam_number}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {(q.subjects || []).map((s, sIdx) => (
                        <div key={sIdx} className="bg-slate-50 p-1.5 rounded flex justify-between items-center text-[11px]">
                          <span className="truncate pr-1 text-slate-600">{s.subject}</span>
                          <span className="font-bold font-mono text-emerald-800">{s.grade}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Uploaded Documents */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-3 text-[#196855]">
                  5. Uploaded Verification Documents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(selectedApp.documents || []).map((d, idx) => (
                    <div key={idx} className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center text-[11px]">
                      <div>
                        <span className="font-bold capitalize block text-slate-800">{d.document_type.replace('_', ' ')}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{d.file_name}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                        Verified File
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 bg-slate-200 text-slate-700 font-bold rounded hover:bg-slate-300 transition text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
