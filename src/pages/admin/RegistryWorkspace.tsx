import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { logAuditEvent } from '../../services/audit';
import { ApplicationRecord, StudentRecord } from '../../types';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import { RegistrationSlipModal } from '../../components/common/RegistrationSlipModal';
import { AdmissionLetterModal } from '../../components/common/AdmissionLetterModal';
import { StudentIDCardModal } from '../../components/common/StudentIDCardModal';
import {
  Users,
  UserCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Eye,
  ShieldCheck,
  Award,
  Filter,
  Check,
  FileCheck
} from 'lucide-react';

export const RegistryWorkspace: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { addNotification } = useNotifications();

  // State
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => db.getApplications());
  const [students, setStudents] = useState<StudentRecord[]>(() => db.getStudents());
  const [activeTab, setActiveTab] = useState<'admissions' | 'matriculationRoll' | 'transcripts'>('admissions');

  // Search & Filters
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState<'ALL' | 'Admitted' | 'Submitted' | 'Under Review'>('ALL');
  const [studentSearch, setStudentSearch] = useState('');

  // Modals
  const [selectedAppForSlip, setSelectedAppForSlip] = useState<ApplicationRecord | null>(null);
  const [selectedAppForLetter, setSelectedAppForLetter] = useState<ApplicationRecord | null>(null);
  const [selectedStudentForID, setSelectedStudentForID] = useState<StudentRecord | null>(null);

  // Authorize Admission
  const handleApproveAdmission = (refNumber: string) => {
    db.updateApplicationStatus(refNumber, 'Admitted');
    setApplications(db.getApplications());
    setStudents(db.getStudents());

    logAuditEvent(
      currentUser?.name || 'Academic Registrar',
      role,
      'ADMISSION_APPROVED',
      `Admission authorized for applicant ${refNumber}. Student matriculation account provisioned.`
    );

    addNotification({
      target_role: 'STUDENT',
      title: 'Admission Authorized by Registry',
      message: `Applicant ${refNumber} admitted. Matric account provisioned.`,
      category: 'Admissions',
      priority: 'urgent',
      action_url: '/student/dashboard'
    });
  };

  const handleDeclineAdmission = (refNumber: string) => {
    db.updateApplicationStatus(refNumber, 'Rejected');
    setApplications(db.getApplications());

    logAuditEvent(
      currentUser?.name || 'Academic Registrar',
      role,
      'ADMISSION_DECLINED',
      `Application ${refNumber} marked as Rejected by Academic Registry.`
    );

    addNotification({
      target_role: 'APPLICANT',
      title: 'Application Decision',
      message: `Application ${refNumber} status marked as Rejected.`,
      category: 'Admissions',
      priority: 'high',
      action_url: '/admissions/status'
    });
  };

  const filteredApps = applications.filter(app => {
    const matchSearch =
      (app.full_name || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.ref_number || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.programme_title || '').toLowerCase().includes(appSearch.toLowerCase());
    const matchFilter = appFilter === 'ALL' || app.status === appFilter;
    return matchSearch && matchFilter;
  });

  const filteredStudents = students.filter(s =>
    (s.full_name || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.matric_number || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.department || '').toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <PortalLayout activeNav="Registry" portalTitle="AHCAS Directorate of Academic Affairs & Registry">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>Total Applications Processed</span>
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {applications.length} Applicants
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              {applications.filter(a => a.status === 'Admitted').length} Admitted to Date
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>Active Matriculated Scholars</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {students.length} Scholars
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active in IJMB Session 2025/2026
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>Academic Registrar</span>
              <ShieldCheck className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              {INSTITUTION_INFO.registrar}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Academic Affairs Secretariat, Abaji
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'admissions', label: 'Admissions & Screening Desk', icon: UserCheck },
            { id: 'matriculationRoll', label: 'Matriculation Register & Student Directory', icon: Users },
            { id: 'transcripts', label: 'Transcript & Direct Entry Verification Requests', icon: FileCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Admissions Desk */}
        {activeTab === 'admissions' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                  Admissions Screening & Provisional Offer Desk
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review applicant credentials, subject combinations, O-Level requirements, and authorize matriculation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    placeholder="Search applicant or ref..."
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <select
                  value={appFilter}
                  onChange={(e) => setAppFilter(e.target.value as any)}
                  className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    <th className="py-3 px-3">App Reference</th>
                    <th className="py-3 px-3">Applicant Name</th>
                    <th className="py-3 px-3">Programme</th>
                    <th className="py-3 px-3">O-Level & Comb.</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Registry Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredApps.map((app) => (
                    <tr key={app.id || app.ref_number} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {app.ref_number}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{app.full_name}</div>
                        <div className="text-[11px] text-slate-500">{app.email} • {app.phone}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {app.programme_title}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{app.subject_combination_name || '3 Core Subjects'}</div>
                        <div className="text-[10px] text-slate-500">WAEC/NECO 5 Credits Verified</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          app.status === 'Admitted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        {app.status !== 'Admitted' ? (
                          <>
                            <button
                              onClick={() => handleApproveAdmission(app.ref_number)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors"
                            >
                              Authorize Admission
                            </button>
                            <button
                              onClick={() => handleDeclineAdmission(app.ref_number)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => setSelectedAppForLetter(app)}
                              className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 rounded text-[11px] font-bold transition-colors"
                            >
                              Admission Letter
                            </button>
                            <button
                              onClick={() => setSelectedAppForSlip(app)}
                              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded text-[11px] font-bold transition-colors"
                            >
                              Screening Slip
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Matriculation Register */}
        {activeTab === 'matriculationRoll' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                  College Matriculation Register (2025/2026 Academic Session)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Official roll of admitted and enrolled scholars, with access to cryptographic Student ID cards and verification tokens.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search matric or scholar name..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    <th className="py-3 px-3">Matriculation No</th>
                    <th className="py-3 px-3">Full Legal Name</th>
                    <th className="py-3 px-3">Discipline / Faculty</th>
                    <th className="py-3 px-3">Registered Combinations</th>
                    <th className="py-3 px-3">Study Centre</th>
                    <th className="py-3 px-3 text-right">Credentials</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.map((s) => (
                    <tr key={s.matric_number} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {s.matric_number}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {s.full_name}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {s.department}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {s.subject_combination?.join(', ') || s.subject_combination_code || 'PHY-CHM-BIO'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {s.study_centre || INSTITUTION_INFO.studyCentre}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedStudentForID(s)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Digital ID Card
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Transcripts & Verification Requests */}
        {activeTab === 'transcripts' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
              Official Academic Transcripts & Direct Entry Verification Processing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Incoming credential verification queries from Direct Entry admission offices across federal and state universities.
            </p>

            <div className="space-y-3 pt-2">
              {[
                {
                  reqId: 'VER-2026-081',
                  university: 'Ahmadu Bello University (ABU), Zaria',
                  purpose: 'Direct Entry 200L MBBS Admission Verification',
                  candidate: 'Zainab Aminu Ibrahim (AHCAS/IJMB/2025/001)',
                  date: '2026-10-24',
                  status: 'DISPATCHED'
                },
                {
                  reqId: 'VER-2026-079',
                  university: 'University of Abuja (UniAbuja)',
                  purpose: 'Direct Entry 200L Faculty of Law Admission',
                  candidate: 'Fatima Mohammed Kabir (AHCAS/IJMB/2025/042)',
                  date: '2026-10-22',
                  status: 'DISPATCHED'
                },
                {
                  reqId: 'VER-2026-075',
                  university: 'Bayero University Kano (BUK)',
                  purpose: 'Direct Entry 200L Computer Engineering',
                  candidate: 'Kabiru Mohammed (AHCAS/IJMB/2024/019)',
                  date: '2026-10-18',
                  status: 'DISPATCHED'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">{item.reqId}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.university}</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{item.purpose}</div>
                    <div className="text-[11px] text-slate-500">Candidate: <strong>{item.candidate}</strong> • Received: {item.date}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modals */}
        {selectedAppForSlip && (
          <RegistrationSlipModal
            isOpen={true}
            application={selectedAppForSlip}
            onClose={() => setSelectedAppForSlip(null)}
          />
        )}
        {selectedAppForLetter && (
          <AdmissionLetterModal
            isOpen={true}
            applicant={selectedAppForLetter}
            onClose={() => setSelectedAppForLetter(null)}
          />
        )}
        {selectedStudentForID && (
          <StudentIDCardModal
            isOpen={true}
            student={selectedStudentForID}
            onClose={() => setSelectedStudentForID(null)}
          />
        )}
      </div>
    </PortalLayout>
  );
};
export default RegistryWorkspace;
