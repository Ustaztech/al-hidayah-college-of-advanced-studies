'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  X,
  User,
  Award,
  AlertTriangle,
  XCircle,
  Send,
  BookOpen,
  Calendar,
  Layers,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Application, Programme, AdmissionSession } from '@/lib/types';

export default function AdminAdmissionProcessingPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [sessions, setSessions] = useState<AdmissionSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected App for Screening
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [screeningVerdict, setScreeningVerdict] = useState<string>('under_review');
  const [screeningScore, setScreeningScore] = useState<string>('75');
  const [olevelVerified, setOlevelVerified] = useState<boolean>(true);
  const [credentialsVerified, setCredentialsVerified] = useState<boolean>(true);
  const [actionRequiredNote, setActionRequiredNote] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [isSubmittingScreening, setIsSubmittingScreening] = useState<boolean>(false);

  // Offer Modal State
  const [offerApp, setOfferApp] = useState<Application | null>(null);
  const [admittedProgrammeId, setAdmittedProgrammeId] = useState<string>('');
  const [acceptanceDays, setAcceptanceDays] = useState<number>(21);
  const [isIssuingOffer, setIsIssuingOffer] = useState<boolean>(false);

  // Reject Modal State
  const [rejectApp, setRejectApp] = useState<Application | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Candidate does not meet the minimum prerequisite academic subject combinations for the selected faculty.');
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const url = new URL('/api/admin/admission-processing', window.location.origin);
      if (searchQuery) url.searchParams.set('q', searchQuery);
      if (statusFilter !== 'all') url.searchParams.set('status', statusFilter);

      const [res, progRes, sessRes] = await Promise.all([
        fetch(url.toString()),
        fetch('/api/portal/programmes'),
        fetch('/api/admin/admission-sessions')
      ]);

      const data = await res.json();
      const pData = await progRes.json();
      const sData = await sessRes.json();

      if (data.success) setApplications(data.applications || []);
      if (pData.success) setProgrammes(pData.programmes || []);
      if (sData.success) setSessions(sData.sessions || []);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error loading applications' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  // Open Screening Panel
  const openScreening = (app: Application) => {
    setSelectedApp(app);
    setScreeningVerdict(app.screening?.screening_status || (app.status === 'action_required' ? 'action_required' : 'under_review'));
    setScreeningScore(app.screening?.screening_score ? String(app.screening.screening_score) : '75');
    setOlevelVerified(app.screening ? app.screening.olevel_verified : true);
    setCredentialsVerified(app.screening ? app.screening.credentials_verified : true);
    setActionRequiredNote(app.screening?.action_required_note || '');
    setInternalNotes(app.screening?.internal_notes || '');
  };

  // Submit Screening
  const handleSubmitScreening = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setIsSubmittingScreening(true);
      setFeedback(null);

      const res = await fetch('/api/admin/admission-processing/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          status: screeningVerdict,
          screeningScore: Number(screeningScore) || 70,
          olevelVerified,
          credentialsVerified,
          actionRequiredNote: screeningVerdict === 'action_required' ? actionRequiredNote : null,
          internalNotes
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit screening review');
      }

      setFeedback({ type: 'success', message: 'Candidate screening review recorded successfully.' });
      setSelectedApp(null);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsSubmittingScreening(false);
    }
  };

  // Issue Offer
  const handleIssueOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerApp || !admittedProgrammeId) return;

    try {
      setIsIssuingOffer(true);
      setFeedback(null);

      const res = await fetch('/api/admin/admission-processing/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: offerApp.id,
          programmeId: admittedProgrammeId,
          acceptanceDeadlineDays: acceptanceDays
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to issue admission offer');
      }

      setFeedback({ type: 'success', message: `Provisional Admission Offer issued! Letter No: ${data.offer?.offer_letter_number}` });
      setOfferApp(null);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsIssuingOffer(false);
    }
  };

  // Reject Application
  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectApp) return;

    try {
      setIsRejecting(true);
      setFeedback(null);

      const res = await fetch('/api/admin/admission-processing/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: rejectApp.id,
          reason: rejectReason
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to record rejection');
      }

      setFeedback({ type: 'success', message: 'Candidate status updated to not admitted.' });
      setRejectApp(null);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header Banner */}
      <div className="bg-[#196855] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold leading-tight">AL-HIDAYAH COLLEGE OF ADVANCED STUDIES</h1>
              <p className="text-xs text-emerald-100">Academic Registrar & Admissions Directorate Screening Desk</p>
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

      <main className="max-w-7xl mx-auto px-4 mt-6">
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center justify-between text-xs font-semibold ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
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
              Filter
            </button>
          </form>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#196855] bg-white font-medium"
            >
              <option value="all">All Screening Queues</option>
              <option value="submitted">Submitted (Awaiting Initial Screening)</option>
              <option value="under_review">Under Active Review</option>
              <option value="action_required">Deficiency Query / Action Required</option>
              <option value="accepted">Admitted / Offer Issued</option>
              <option value="rejected">Not Admitted</option>
            </select>
          </div>
        </div>

        {/* Screening Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Admission Screening Candidates ({applications.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Candidate</th>
                  <th className="px-5 py-3">Applied Course</th>
                  <th className="px-5 py-3">Session</th>
                  <th className="px-5 py-3">Screening Status</th>
                  <th className="px-5 py-3">Offer Letter Ref</th>
                  <th className="px-5 py-3 text-right">Directorate Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">Loading screening queue...</td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No applications in this screening queue.</td>
                  </tr>
                ) : (
                  applications.map(app => {
                    const name = [
                      app.personal_details?.surname,
                      app.personal_details?.first_name,
                      app.personal_details?.middle_name
                    ].filter(Boolean).join(' ') || app.applicant?.full_name || 'Applicant';

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-slate-900 block uppercase">{name}</span>
                          <span className="font-mono text-[11px] text-[#196855]">{app.application_number}</span>
                          <span className="text-[11px] text-slate-400 block">{app.applicant?.email}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-slate-800 block">
                            {app.admission_offer?.programme?.name || app.selected_programme?.programme?.name || 'Programme Pending'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {app.selected_programme?.duration || '1 Session'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-medium">{app.admission_session?.name || '2026/2027'}</td>
                        <td className="px-5 py-3.5">
                          {app.status === 'accepted' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Offer Issued ({app.admission_offer?.offer_status})
                            </span>
                          ) : app.status === 'action_required' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <AlertTriangle className="w-3 h-3" /> Query / Action Required
                            </span>
                          ) : app.status === 'under_review' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              <Clock className="w-3 h-3" /> Under Review
                            </span>
                          ) : app.status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                              <XCircle className="w-3 h-3" /> Not Admitted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              Submitted Queue
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-[11px]">
                          {app.admission_offer?.offer_letter_number || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {/* Screen Button */}
                          <button
                            onClick={() => openScreening(app)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-[#196855]" /> Screen
                          </button>

                          {/* Issue Offer Button */}
                          {app.status !== 'accepted' && (
                            <button
                              onClick={() => {
                                setOfferApp(app);
                                setAdmittedProgrammeId(app.admission_programme_id ? (app.selected_programme?.programme_id || programmes[0]?.id || '') : (programmes[0]?.id || ''));
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition"
                            >
                              <Award className="w-3.5 h-3.5 text-[#e69912]" /> Offer
                            </button>
                          )}

                          {/* Reject Button */}
                          {app.status !== 'accepted' && app.status !== 'rejected' && (
                            <button
                              onClick={() => setRejectApp(app)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold transition"
                            >
                              <XCircle className="w-3.5 h-3.5 text-red-500" /> Decline
                            </button>
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

      {/* 1. SCREENING DRAWER / MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 sticky top-0 bg-white z-10">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#196855]" /> Admissions Screening Review
              </h3>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900 text-sm">
                    {[selectedApp.personal_details?.surname, selectedApp.personal_details?.first_name].filter(Boolean).join(' ')}
                  </span>
                  <span className="font-mono text-[#196855] font-bold">{selectedApp.application_number}</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Applied: {selectedApp.selected_programme?.programme?.name || 'Programme'}
                </div>
              </div>

              {/* O-Level Results Breakdown */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-2">Academic Qualifications Verified:</h4>
                {(selectedApp.qualifications || []).map((q, idx) => (
                  <div key={idx} className="mb-2 last:mb-0">
                    <div className="flex justify-between font-bold text-[11px] text-slate-700 pb-1 mb-1 border-b border-slate-100">
                      <span>{q.exam_name} ({q.exam_year})</span>
                      <span className="font-mono">Exam No: {q.exam_number}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(q.subjects || []).map((s, sIdx) => (
                        <div key={sIdx} className="p-1 bg-slate-50 rounded border border-slate-200 flex justify-between text-[11px]">
                          <span className="truncate pr-1 text-slate-600">{s.subject}</span>
                          <span className="font-bold font-mono text-emerald-800">{s.grade}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Screening Form Controls */}
              <form onSubmit={handleSubmitScreening} className="space-y-4 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Screening Verdict / Recommendation</label>
                  <select
                    value={screeningVerdict}
                    onChange={e => setScreeningVerdict(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] bg-white font-medium outline-none"
                  >
                    <option value="under_review">Under Review (Keep In Evaluation)</option>
                    <option value="recommended_for_admission">Recommended for Provisional Admission</option>
                    <option value="action_required">Action Required (Issue Deficiency Notice)</option>
                    <option value="not_recommended">Not Recommended</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Screening Assessment Score (0 - 100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={screeningScore}
                      onChange={e => setScreeningScore(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] outline-none"
                    />
                  </div>

                  <div className="flex flex-col justify-end space-y-2 pb-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={olevelVerified}
                        onChange={e => setOlevelVerified(e.target.checked)}
                        className="h-4 w-4 text-[#196855] rounded"
                      />
                      <span className="font-semibold text-slate-700">O-Level Credits Verified</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={credentialsVerified}
                        onChange={e => setCredentialsVerified(e.target.checked)}
                        className="h-4 w-4 text-[#196855] rounded"
                      />
                      <span className="font-semibold text-slate-700">Certificates & ID Verified</span>
                    </label>
                  </div>
                </div>

                {screeningVerdict === 'action_required' && (
                  <div>
                    <label className="block font-semibold text-amber-800 mb-1">
                      Deficiency Notice to Applicant (Query Explanation)
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Please re-upload a clearer colour scan of your O-Level statement of result."
                      value={actionRequiredNote}
                      onChange={e => setActionRequiredNote(e.target.value)}
                      className="w-full px-3 py-2 border border-amber-300 bg-amber-50 rounded focus:ring-1 focus:ring-amber-500 outline-none text-amber-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Internal Registrar Notes (Confidential)</label>
                  <input
                    type="text"
                    placeholder="e.g. Verified with WAEC online portal. Strong grades in biology and chemistry."
                    value={internalNotes}
                    onChange={e => setInternalNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingScreening}
                    className="px-5 py-2 bg-[#196855] text-white rounded font-bold hover:bg-emerald-800 transition shadow-sm"
                  >
                    {isSubmittingScreening ? 'Saving...' : 'Save Screening Verdict'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. ISSUE OFFER MODAL */}
      {offerApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#e69912]" /> Issue Provisional Admission Offer
              </h3>
              <button onClick={() => setOfferApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueOffer} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900">
                <div className="font-bold uppercase">
                  {[offerApp.personal_details?.surname, offerApp.personal_details?.first_name].filter(Boolean).join(' ')}
                </div>
                <div className="text-[11px] text-emerald-700 font-mono">App ID: {offerApp.application_number}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admitted Programme</label>
                <select
                  value={admittedProgrammeId}
                  onChange={e => setAdmittedProgrammeId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] bg-white font-medium outline-none"
                  required
                >
                  {programmes.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Acceptance Deadline (Days)</label>
                <input
                  type="number"
                  min="3"
                  max="90"
                  value={acceptanceDays}
                  onChange={e => setAcceptanceDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Candidate has {acceptanceDays} days to accept or decline the offer.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOfferApp(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isIssuingOffer}
                  className="px-5 py-2 bg-[#196855] text-white rounded font-bold hover:bg-emerald-800 transition shadow-sm"
                >
                  {isIssuingOffer ? 'Generating Letter...' : 'Confirm & Issue Admission Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. REJECT MODAL */}
      {rejectApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-red-700 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" /> Record Not Offered Admission
              </h3>
              <button onClick={() => setRejectApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReject} className="space-y-4 text-xs">
              <div className="p-3 bg-red-50 rounded border border-red-200 text-red-900">
                <div className="font-bold uppercase">
                  {[rejectApp.personal_details?.surname, rejectApp.personal_details?.first_name].filter(Boolean).join(' ')}
                </div>
                <div className="text-[11px] text-red-700 font-mono">App ID: {rejectApp.application_number}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Non-Admission</label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectApp(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRejecting}
                  className="px-5 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition shadow-sm"
                >
                  {isRejecting ? 'Updating...' : 'Confirm Non-Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
