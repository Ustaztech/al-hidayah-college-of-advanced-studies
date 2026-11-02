import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Search,
  Plus,
  Filter,
  BarChart2,
  Calendar,
  Lock,
  Download,
  AlertTriangle,
  FolderLock
} from 'lucide-react';

interface QualityCheckItem {
  id: string;
  category: 'Curriculum & Delivery' | 'Laboratories & Practicals' | 'Examinations Integrity' | 'Bursary Compliance' | 'Student Welfare';
  title: string;
  standard: string;
  status: 'Compliant' | 'Action Required' | 'Under Review';
  evidenceDoc: string;
  leadOfficer: string;
  lastReviewDate: string;
  nextReviewDate: string;
}

interface ComplianceFinding {
  id: string;
  issue: string;
  department: string;
  severity: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  deadline: string;
  resolutionStatus: 'Open' | 'In Progress' | 'Resolved';
  actionPlan: string;
}

export const QualityAssurancePortal: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState<'indicators' | 'findings' | 'inspectionChecklist' | 'policyRegister'>('indicators');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Real Institutional Quality Indicators
  const [indicators, setIndicators] = useState<QualityCheckItem[]>([
    {
      id: 'QA-2026-001',
      category: 'Curriculum & Delivery',
      title: 'IJMB Syllabus Coverage Verification',
      standard: 'Minimum 6 lecture hours per week per A-Level subject completed across 12-month calendar',
      status: 'Compliant',
      evidenceDoc: 'AHCAS/QA/LOG/2026/01 - Bi-Weekly Lecturer Logbooks',
      leadOfficer: 'Mall. Ibrahim Idris Gambo (Centre Coordinator)',
      lastReviewDate: '2026-10-15',
      nextReviewDate: '2026-11-15'
    },
    {
      id: 'QA-2026-002',
      category: 'Laboratories & Practicals',
      title: 'Science Practical Equipment & Reagents Readiness',
      standard: 'Fully functional laboratories for Biology, Chemistry, and Physics with 3 hours mandatory practicals per week',
      status: 'Compliant',
      evidenceDoc: 'AHCAS/QA/LAB/2026/03 - Laboratory Reagent Audit Certificate',
      leadOfficer: 'Head of Department (Science & Laboratories)',
      lastReviewDate: '2026-10-20',
      nextReviewDate: '2026-11-20'
    },
    {
      id: 'QA-2026-003',
      category: 'Examinations Integrity',
      title: 'Continuous Assessment (CA) 20% & Exam 80% Weighting Validation',
      standard: 'Strict adherence to 20/80 grading split with dual invigilation and moderated score recording',
      status: 'Compliant',
      evidenceDoc: 'AHCAS/QA/EXM/2026/02 - Examination Board Standard Operating Procedure',
      leadOfficer: 'Examination Officer (Mall. Usman Saidu)',
      lastReviewDate: '2026-10-18',
      nextReviewDate: '2026-12-01'
    },
    {
      id: 'QA-2026-004',
      category: 'Bursary Compliance',
      title: 'Tuition Installment Ledger & Payment Reconciliations',
      standard: 'Every candidate payment linked to a unique transaction reference and numbered bursary receipt',
      status: 'Compliant',
      evidenceDoc: 'AHCAS/QA/FIN/2026/01 - Bursary Audit Ledger Reconciliation',
      leadOfficer: 'College Bursar',
      lastReviewDate: '2026-10-22',
      nextReviewDate: '2026-11-22'
    },
    {
      id: 'QA-2026-005',
      category: 'Student Welfare',
      title: 'Health, Safety & Emergency Protocol at Abaji Centre',
      standard: 'Adequate classroom ventilation, verified first-aid kits, and emergency clinic liaison arrangement',
      status: 'Action Required',
      evidenceDoc: 'AHCAS/QA/WLF/2026/02 - First-Aid Kit Restock Request',
      leadOfficer: 'Student Affairs Officer',
      lastReviewDate: '2026-10-25',
      nextReviewDate: '2026-11-05'
    }
  ]);

  // Compliance Findings & Corrective Action Register
  const [findings, setFindings] = useState<ComplianceFinding[]>([
    {
      id: 'FND-2026-01',
      issue: 'Restock of Chemistry volumetric flasks and analytical indicators for Second Semester titrations',
      department: 'Science & Laboratories',
      severity: 'Medium',
      assignedTo: 'Laboratory Technologist',
      deadline: '2026-11-10',
      resolutionStatus: 'In Progress',
      actionPlan: 'Requisition submitted to Bursary for 12 new volumetric flasks and pH indicators.'
    },
    {
      id: 'FND-2026-02',
      issue: 'Routine servicing of the ICT Centre standby generator ahead of Second Semester CBT mock exams',
      department: 'ICT & Infrastructure',
      severity: 'High',
      assignedTo: 'IT Officer / Facilities Supervisor',
      deadline: '2026-11-07',
      resolutionStatus: 'Open',
      actionPlan: 'Service technician scheduled for on-site alternator and oil filter replacement.'
    }
  ]);

  // New Finding Form State
  const [newIssue, setNewIssue] = useState('');
  const [newDept, setNewDept] = useState('Science & Laboratories');
  const [newSeverity, setNewSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newAssignedTo, setNewAssignedTo] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newActionPlan, setNewActionPlan] = useState('');
  const [showAddFindingModal, setShowAddFindingModal] = useState(false);

  const handleCreateFinding = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ComplianceFinding = {
      id: `FND-2026-0${findings.length + 1}`,
      issue: newIssue,
      department: newDept,
      severity: newSeverity,
      assignedTo: newAssignedTo,
      deadline: newDeadline || '2026-11-30',
      resolutionStatus: 'Open',
      actionPlan: newActionPlan
    };
    setFindings([item, ...findings]);
    setShowAddFindingModal(false);
    setNewIssue('');
    setNewAssignedTo('');
    setNewActionPlan('');

    addNotification({
      title: 'New Quality Compliance Finding Logged',
      message: `Quality Assurance logged an action item for ${newDept}.`,
      category: 'System',
      priority: 'normal'
    });
  };

  const handleToggleFindingStatus = (id: string) => {
    setFindings(prev =>
      prev.map(f => {
        if (f.id === id) {
          const next = f.resolutionStatus === 'Open' ? 'In Progress' : f.resolutionStatus === 'In Progress' ? 'Resolved' : 'Open';
          return { ...f, resolutionStatus: next };
        }
        return f;
      })
    );
  };

  const filteredIndicators = indicators.filter(i => {
    const matchesCategory = filterCategory === 'ALL' || i.category === filterCategory;
    const matchesSearch = searchQuery === '' || i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.standard.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PortalLayout activeNav="Quality Assurance" portalTitle="Quality Assurance & Academic Standards">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-[#196855] via-[#196855] to-[#0F172A] text-white p-6 sm:p-8 rounded-3xl border border-[#e69912]/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#e69912] text-slate-950 font-mono">
                Academic Audit Directorate
              </span>
              <span className="text-emerald-300 text-xs font-semibold">
                Inspection & Quality Standards Desk
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Institutional Quality Assurance Portal
            </h1>
            <p className="text-xs text-emerald-100 max-w-xl">
              Continuous monitoring of academic delivery, science laboratory readiness, examination integrity, and statutory regulatory compliance at the Abaji Study Centre.
            </p>
          </div>

          <button
            onClick={() => setShowAddFindingModal(true)}
            className="px-4 py-2.5 bg-[#e69912] hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-all inline-flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus size={16} />
            <span>Log Compliance Finding</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'indicators', label: 'Quality Indicators', icon: ShieldCheck },
            { id: 'findings', label: `Corrective Action Register (${findings.filter(f => f.resolutionStatus !== 'Resolved').length})`, icon: AlertTriangle },
            { id: 'inspectionChecklist', label: 'Inspection-Readiness Checklist', icon: CheckCircle2 },
            { id: 'policyRegister', label: 'Policy Compliance Register', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#196855] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: QUALITY INDICATORS */}
        {activeTab === 'indicators' && (
          <div className="space-y-4 animate-fade-in">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Filter quality indicators by standard..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#196855]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-500" />
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#196855]"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Curriculum & Delivery">Curriculum & Delivery</option>
                  <option value="Laboratories & Practicals">Laboratories & Practicals</option>
                  <option value="Examinations Integrity">Examinations Integrity</option>
                  <option value="Bursary Compliance">Bursary Compliance</option>
                  <option value="Student Welfare">Student Welfare</option>
                </select>
              </div>
            </div>

            {/* Indicator Cards */}
            <div className="grid grid-cols-1 gap-4">
              {filteredIndicators.map(ind => (
                <div
                  key={ind.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {ind.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {ind.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          ind.status === 'Compliant'
                            ? 'bg-emerald-100 text-[#196855]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ind.status}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {ind.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <strong>Standard:</strong> {ind.standard}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span><strong>Lead:</strong> {ind.leadOfficer}</span>
                      <span><strong>Last Review:</strong> {ind.lastReviewDate}</span>
                      <span><strong>Next Due:</strong> {ind.nextReviewDate}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-mono">Evidence Record</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {ind.evidenceDoc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CORRECTIVE ACTION FINDINGS */}
        {activeTab === 'findings' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Ref</th>
                    <th className="p-3.5">Finding & Issue</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Severity</th>
                    <th className="p-3.5">Assignee & Deadline</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {findings.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 font-mono text-slate-500 font-bold">{f.id}</td>
                      <td className="p-3.5 max-w-xs">
                        <span className="font-bold text-slate-900 dark:text-white block">{f.issue}</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">{f.actionPlan}</span>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">{f.department}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            f.severity === 'High'
                              ? 'bg-red-100 text-red-800'
                              : f.severity === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {f.severity}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">
                        <span className="block font-bold">{f.assignedTo}</span>
                        <span className="text-[10px] text-slate-400">Due: {f.deadline}</span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            f.resolutionStatus === 'Resolved'
                              ? 'bg-emerald-100 text-[#196855]'
                              : f.resolutionStatus === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {f.resolutionStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleFindingStatus(f.id)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INSPECTION CHECKLIST */}
        {activeTab === 'inspectionChecklist' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
            <h3 className="text-base font-extrabold font-serif">Inspection-Readiness Checklist</h3>
            <p className="text-xs text-slate-500">
              Regulatory compliance benchmarks for interim audits and affiliation reviews.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: 'Academic Staff Qualifications & Appointment Letters', status: 'Verified', note: 'All lecturers meet minimum second class upper first degree / Master qualifications.' },
                { title: 'IJMB 73 Subject Combinations Registry', status: 'Verified', note: 'Subject triplets mapped accurately to JAMB Direct Entry brochures.' },
                { title: 'Science Laboratory Safety Log & Chemical Waste Protocol', status: 'Verified', note: 'Standard eyewash station, fire extinguisher, and lab disposal protocols in place.' },
                { title: 'CBT Centre Computer Roster & Backup Power', status: 'Verified', note: 'Dedicated LAN and dual generator power redundancy tested.' },
                { title: 'Student Dossiers & 12-Item Document Policy', status: 'Verified', note: 'Birth certificate, state of origin, O’Level results, and passport photographs filed.' }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{item.title}</span>
                    <p className="text-[11px] text-slate-500">{item.note}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-[#196855] shrink-0">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: POLICY REGISTER */}
        {activeTab === 'policyRegister' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
            <h3 className="text-base font-extrabold font-serif">College Policy Compliance Register</h3>
            <p className="text-xs text-slate-500">
              Approved institutional policies and governance guidelines.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { title: 'Examinations Malpractice & Disciplinary Policy', code: 'POL-EXM-01', status: 'Active', reviewCycle: 'Biennial' },
                { title: 'Student Code of Conduct & Dress Code', code: 'POL-STU-02', status: 'Active', reviewCycle: 'Annual' },
                { title: 'Bursary Fee Collection & Refund Policy', code: 'POL-FIN-03', status: 'Active', reviewCycle: 'Annual' },
                { title: 'Science Laboratory Safety & Hazardous Material Code', code: 'POL-LAB-04', status: 'Active', reviewCycle: 'Biennial' }
              ].map((p, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-slate-500">{p.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#196855]">{p.status}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{p.title}</h4>
                  <p className="text-[11px] text-slate-500">Review Cycle: {p.reviewCycle}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: ADD FINDING */}
        {showAddFindingModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                Log Quality Assurance Finding
              </h3>
              
              <form onSubmit={handleCreateFinding} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Observed Issue / Non-Conformance *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newIssue}
                    onChange={e => setNewIssue(e.target.value)}
                    placeholder="Describe the quality observation or resource deficiency..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#196855]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Department *
                    </label>
                    <select
                      value={newDept}
                      onChange={e => setNewDept(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Science & Laboratories">Science & Laboratories</option>
                      <option value="Curriculum & Teaching">Curriculum & Teaching</option>
                      <option value="ICT & Infrastructure">ICT & Infrastructure</option>
                      <option value="Examinations & Records">Examinations & Records</option>
                      <option value="Bursary & Finance">Bursary & Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Severity *
                    </label>
                    <select
                      value={newSeverity}
                      onChange={e => setNewSeverity(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High (Immediate Action)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Assigned Officer *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lab Technologist"
                      value={newAssignedTo}
                      onChange={e => setNewAssignedTo(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={e => setNewDeadline(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Proposed Corrective Action Plan
                  </label>
                  <textarea
                    rows={2}
                    value={newActionPlan}
                    onChange={e => setNewActionPlan(e.target.value)}
                    placeholder="Steps required to achieve compliance..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#196855]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddFindingModal(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#196855] text-white rounded-xl font-bold shadow-md hover:bg-[#196855]"
                  >
                    Save Finding
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
