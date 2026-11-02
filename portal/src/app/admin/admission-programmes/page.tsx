'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Edit2,
  ShieldAlert,
  Search,
  X,
  Calendar,
  Layers
} from 'lucide-react';
import { AdmissionProgramme, AdmissionSession, ApplicationType, Programme } from '@/lib/types';

export default function AdminAdmissionProgrammesPage() {
  const [admProgrammes, setAdmProgrammes] = useState<AdmissionProgramme[]>([]);
  const [sessions, setSessions] = useState<AdmissionSession[]>([]);
  const [appTypes, setAppTypes] = useState<ApplicationType[]>([]);
  const [rawProgrammes, setRawProgrammes] = useState<Programme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedProgrammeId, setSelectedProgrammeId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [deadline, setDeadline] = useState('2027-02-28T23:59');
  const [duration, setDuration] = useState('9 Months (1 Academic Session)');
  const [requirements, setRequirements] = useState('5 O-Level Credits in relevant subjects');
  const [isOpen, setIsOpen] = useState(true);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [progRes, sessRes, typesRes] = await Promise.all([
        fetch('/api/admin/admission-programmes'),
        fetch('/api/admin/admission-sessions'),
        fetch('/api/application/types?all=true')
      ]);

      const pData = await progRes.json();
      const sData = await sessRes.json();
      const tData = await typesRes.json();

      if (pData.success) setAdmProgrammes(pData.programmes);
      if (sData.success) {
        setSessions(sData.sessions);
        const active = sData.sessions.find((s: AdmissionSession) => s.is_active);
        if (active) setSelectedSessionId(active.id);
      }
      if (tData.success) {
        setAppTypes(tData.types);
        if (tData.types.length > 0) setSelectedTypeId(tData.types[0].id);
      }

      // Fetch base college programmes
      const baseProgRes = await fetch('/api/portal/programmes');
      if (baseProgRes.ok) {
        const bpData = await baseProgRes.json();
        if (bpData.success) setRawProgrammes(bpData.programmes);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error loading admission programmes' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAdmissionProgramme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId || !selectedProgrammeId || !selectedTypeId) {
      setFeedback({ type: 'error', message: 'Please select all required fields' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/admission-programmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admission_session_id: selectedSessionId,
          programme_id: selectedProgrammeId,
          application_type_id: selectedTypeId,
          application_open: isOpen,
          application_deadline: new Date(deadline).toISOString(),
          duration,
          entry_requirements: requirements
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to configure admission programme');
      }

      setFeedback({ type: 'success', message: 'Programme opened for admissions successfully.' });
      setIsAddModalOpen(false);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to create programme' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleOpen = async (prog: AdmissionProgramme) => {
    try {
      const res = await fetch('/api/admin/admission-programmes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: prog.id,
          application_open: !prog.application_open
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to toggle programme');
      }

      setFeedback({
        type: 'success',
        message: `Applications for '${prog.programme?.name || 'Programme'}' set to ${!prog.application_open ? 'Open' : 'Closed'}.`
      });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to toggle programme status' });
    }
  };

  const filtered = admProgrammes.filter(p =>
    (p.programme?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.application_type?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <p className="text-xs text-emerald-100">Admission Programmes & Entry Requirements Desk</p>
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
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center justify-between text-xs font-semibold ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search programme title or admission type..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#196855]"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#196855] text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Open Programme for Admission
          </button>
        </div>

        {/* Admission Programmes Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Admission Programmes Directory ({filtered.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Course / Programme</th>
                  <th className="px-5 py-3">Academic Session</th>
                  <th className="px-5 py-3">Admission Type</th>
                  <th className="px-5 py-3">Deadline</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">Loading programmes...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No admission programmes found.</td>
                  </tr>
                ) : (
                  filtered.map(prog => (
                    <tr key={prog.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-900 block">{prog.programme?.name || 'Programme'}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{prog.duration}</span>
                      </td>
                      <td className="px-5 py-3.5 font-medium">{prog.admission_session?.name || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {prog.application_type?.name || 'Admission'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px]">
                        {new Date(prog.application_deadline).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        {prog.application_open ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Applications Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Closed
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleToggleOpen(prog)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded text-[11px] font-bold transition ${
                            prog.application_open
                              ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {prog.application_open ? 'Close' : 'Open'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#196855]" /> Configure Admission Programme
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmissionProgramme} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Session</label>
                <select
                  value={selectedSessionId}
                  onChange={e => setSelectedSessionId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] bg-white outline-none"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>{s.name} {s.is_active ? '(Active)' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Base Course / Programme</label>
                <select
                  value={selectedProgrammeId}
                  onChange={e => setSelectedProgrammeId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] bg-white outline-none"
                  required
                >
                  <option value="">-- Select Course --</option>
                  <option value="prog-sci">IJMB Direct Entry Sciences (Biology / Chemistry / Physics)</option>
                  <option value="prog-sms">IJMB Social Sciences (Accounting / Business Management / Economics)</option>
                  <option value="prog-art">IJMB Arts & Humanities (Government / Literature / Islamic Studies)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Application Type</label>
                <select
                  value={selectedTypeId}
                  onChange={e => setSelectedTypeId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] bg-white outline-none"
                >
                  {appTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="datetime-local"
                  required
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration Description</label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Entry Requirements</label>
                <textarea
                  rows={2}
                  required
                  value={requirements}
                  onChange={e => setRequirements(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="openCheck"
                  checked={isOpen}
                  onChange={e => setIsOpen(e.target.checked)}
                  className="h-4 w-4 text-[#196855] rounded border-slate-300"
                />
                <label htmlFor="openCheck" className="font-semibold text-slate-700 cursor-pointer">
                  Open immediately for prospective applicant applications
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#196855] text-white rounded font-bold hover:bg-emerald-800 transition"
                >
                  {isSubmitting ? 'Saving...' : 'Open Programme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
