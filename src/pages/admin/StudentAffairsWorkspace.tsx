import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { logAuditEvent } from '../../services/audit';
import { StudentRecord } from '../../types';
import {
  HeartHandshake,
  ShieldAlert,
  Home,
  MessageSquare,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Filter,
  FileText,
  UserCheck
} from 'lucide-react';

interface WelfareCase {
  id: string;
  studentMatric: string;
  studentName: string;
  category: 'Accommodation' | 'Health & Welfare' | 'Academic Guidance' | 'Disciplinary Hearing' | 'Financial Hardship';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  title: string;
  description: string;
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';
  assignedOfficer: string;
  confidentialNotes?: string;
  createdAt: string;
}

export const StudentAffairsWorkspace: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { addNotification } = useNotifications();

  const [students] = useState<StudentRecord[]>(() => db.getStudents());
  const [activeTab, setActiveTab] = useState<'welfareCases' | 'accommodation' | 'conductRegister' | 'clubs'>('welfareCases');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Initial Welfare Cases
  const [cases, setCases] = useState<WelfareCase[]>([
    {
      id: 'WEL-2026-001',
      studentMatric: 'AHCAS/2026/IJMB/004',
      studentName: 'Zainab Aminu Ibrahim',
      category: 'Accommodation',
      priority: 'normal',
      title: 'Hostel Room Relocation Request',
      description: 'Requesting room transfer to Sabon Tasha Off-Campus Lodge 2 due to proximity to Science Laboratory.',
      status: 'Resolved',
      assignedOfficer: 'Student Affairs Officer',
      confidentialNotes: 'Accommodated in Block B Room 4 after inspection by warden.',
      createdAt: '2026-10-14'
    },
    {
      id: 'WEL-2026-002',
      studentMatric: 'AHCAS/2026/IJMB/009',
      studentName: 'Yusuf Abubakar Sadiq',
      category: 'Academic Guidance',
      priority: 'high',
      title: 'Subject Triplet Revision Advisory',
      description: 'Candidate requesting guidance on scoring maximum points in Mathematics to meet Engineering cutoff.',
      status: 'Open',
      assignedOfficer: 'Lead Academic Mentor',
      confidentialNotes: 'Assigned to extra tutorial hours on Saturdays with Head of Mathematics.',
      createdAt: '2026-10-24'
    },
    {
      id: 'WEL-2026-003',
      studentMatric: 'AHCAS/2026/IJMB/012',
      studentName: 'Hauwa Mohammed Bello',
      category: 'Financial Hardship',
      priority: 'urgent',
      title: 'Tuition Installment Extension Request',
      description: 'Family requesting 3-week extension on 2nd installment due to delayed agricultural harvest proceeds.',
      status: 'Under Investigation',
      assignedOfficer: 'Dean of Student Affairs',
      confidentialNotes: 'Referred to Sponsor-A-Student committee for emergency bursary matching.',
      createdAt: '2026-10-28'
    }
  ]);

  // New Case Modal State
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newMatric, setNewMatric] = useState(students[0]?.matric_number || '');
  const [newCategory, setNewCategory] = useState<WelfareCase['category']>('Accommodation');
  const [newPriority, setNewPriority] = useState<WelfareCase['priority']>('normal');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newConfidentialNotes, setNewConfidentialNotes] = useState('');

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.matric_number === newMatric);
    const newCase: WelfareCase = {
      id: `WEL-2026-00${cases.length + 1}`,
      studentMatric: newMatric,
      studentName: st?.full_name || 'Student',
      category: newCategory,
      priority: newPriority,
      title: newTitle,
      description: newDescription,
      status: 'Open',
      assignedOfficer: currentUser?.name || 'Student Affairs Desk',
      confidentialNotes: newConfidentialNotes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCases([newCase, ...cases]);
    setShowNewCaseModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewConfidentialNotes('');

    logAuditEvent(
      currentUser?.name || 'Student Affairs Officer',
      role,
      'WELFARE_CASE_CREATED',
      `Created welfare case ${newCase.id} for student ${newMatric}`
    );

    addNotification({
      title: 'Welfare Case Logged',
      message: `New student affairs case ${newCase.id} submitted for review.`,
      category: 'Welfare',
      priority: newPriority
    });
  };

  const handleUpdateStatus = (id: string, nextStatus: WelfareCase['status']) => {
    setCases(prev =>
      prev.map(c => (c.id === id ? { ...c, status: nextStatus } : c))
    );
  };

  const filteredCases = cases.filter(c => {
    const matchesCat = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesQuery =
      searchQuery === '' ||
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentMatric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <PortalLayout activeNav="Student Affairs" portalTitle="Student Affairs & Welfare Directorate">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#196855] via-[#196855] to-[#0F172A] text-white p-6 sm:p-8 rounded-3xl border border-[#e69912]/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#e69912] text-slate-950 font-mono">
                Student Welfare
              </span>
              <span className="text-emerald-300 text-xs font-semibold">
                Guidance & Counselling Desk
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Student Affairs & Helpdesk Workspace
            </h1>
            <p className="text-xs text-emerald-100 max-w-xl">
              Confidential student welfare support, off-campus accommodation vetting, emergency counseling, and student conduct management.
            </p>
          </div>

          <button
            onClick={() => setShowNewCaseModal(true)}
            className="px-4 py-2.5 bg-[#e69912] hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-all inline-flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus size={16} />
            <span>Open Welfare Request</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'welfareCases', label: `Welfare & Support Cases (${cases.filter(c => c.status !== 'Closed').length})`, icon: HeartHandshake },
            { id: 'accommodation', label: 'Vetted Hostels & Lodges', icon: Home },
            { id: 'conductRegister', label: 'Conduct & Disciplinary Register', icon: ShieldAlert },
            { id: 'clubs', label: 'Student Societies & Academic Clubs', icon: Users }
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

        {/* TAB 1: WELFARE CASES */}
        {activeTab === 'welfareCases' && (
          <div className="space-y-4 animate-fade-in">
            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Search by student name or matric..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#196855]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-500" />
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Health & Welfare">Health & Welfare</option>
                  <option value="Academic Guidance">Academic Guidance</option>
                  <option value="Financial Hardship">Financial Hardship</option>
                  <option value="Disciplinary Hearing">Disciplinary Hearing</option>
                </select>
              </div>
            </div>

            {/* Cases Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredCases.map(c => (
                <div
                  key={c.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-400">{c.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {c.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.priority === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : c.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {c.priority.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          c.status === 'Resolved' || c.status === 'Closed'
                            ? 'bg-emerald-100 text-[#196855]'
                            : c.status === 'Under Investigation'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400">Logged: {c.createdAt}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{c.title}</span>
                      <span className="text-xs text-slate-500 font-medium">— {c.studentName} ({c.studentMatric})</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{c.description}</p>
                  </div>

                  {c.confidentialNotes && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-700 dark:text-amber-400">
                        Confidential Staff Notes
                      </span>
                      <p>{c.confidentialNotes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-500">Officer: <strong>{c.assignedOfficer}</strong></span>
                    <div className="flex items-center gap-2">
                      {c.status !== 'Resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(c.id, 'Resolved')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      )}
                      {c.status === 'Open' && (
                        <button
                          onClick={() => handleUpdateStatus(c.id, 'Under Investigation')}
                          className="px-3 py-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] rounded-lg hover:bg-slate-100 cursor-pointer"
                        >
                          Assign & Investigate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACCOMMODATION */}
        {activeTab === 'accommodation' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
            <h3 className="text-base font-extrabold font-serif">Vetted Student Lodges (Abaji Area Council)</h3>
            <p className="text-xs text-slate-500">
              Hostel facilities inspected by Student Affairs for security, continuous borehole water supply, and electric power.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                { name: 'Sabon Tasha Scholars Lodge', rooms: '18 Single/Double Rooms', distance: '5 mins walk to Study Centre', warden: 'Mall. Aliyu Gambo', phone: '+234 803 234 5678' },
                { name: 'Agyana Road Unity Hall', rooms: '24 Self-Contained Rooms', distance: 'Opposite JSS Study Centre', warden: 'Hajiya Maryam Idris', phone: '+234 805 123 4567' },
                { name: 'Phase II Executive Student Flats', rooms: '12 Double Suites', distance: '8 mins walk to Secretariat', warden: 'Mr. Patrick Oche', phone: '+234 802 987 6543' }
              ].map((h, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-[#196855] uppercase block">Inspected & Approved</span>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{h.name}</h4>
                  <p className="text-[11px] text-slate-500">{h.rooms} • {h.distance}</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                    Warden: {h.warden} ({h.phone})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CONDUCT REGISTER */}
        {activeTab === 'conductRegister' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
            <h3 className="text-base font-extrabold font-serif">Disciplinary & Conduct Oversight</h3>
            <p className="text-xs text-slate-500">
              Zero tolerance for examination malpractice, unruly conduct, or violation of institutional regulations.
            </p>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3">
              <CheckCircle2 size={24} className="text-[#196855] shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-[#196855] block">Clean Disciplinary Standing</span>
                <p className="text-slate-600 dark:text-slate-400">Current 2025/2026 IJMB Cohort maintains 100% exemplary conduct record with zero examination malpractice incidents.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CLUBS */}
        {activeTab === 'clubs' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
            <h3 className="text-base font-extrabold font-serif">Approved Student Academic Societies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { name: 'AHCAS Science & Innovation Club', focus: 'Lab experiments, robotics, and STEM Olympiad preparation', lead: 'HOD Science' },
                { name: 'Literary & Debating Society', focus: 'Public speaking, moot court simulations, and essay competitions', lead: 'Lead English Lecturer' },
                { name: 'Young Economists & Managers Forum', focus: 'Commerce, entrepreneurship, and financial literacy workshops', lead: 'HOD Commercial' }
              ].map((c, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</h4>
                  <p className="text-[11px] text-slate-500">{c.focus}</p>
                  <span className="text-[10px] text-amber-700 block font-medium">Faculty Advisor: {c.lead}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: NEW WELFARE CASE */}
        {showNewCaseModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                Log Student Welfare / Support Request
              </h3>

              <form onSubmit={handleCreateCase} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Matriculation Number *
                  </label>
                  <select
                    value={newMatric}
                    onChange={e => setNewMatric(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  >
                    {students.map(s => (
                      <option key={s.matric_number} value={s.matric_number}>
                        {s.full_name} ({s.matric_number})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Accommodation">Accommodation</option>
                      <option value="Health & Welfare">Health & Welfare</option>
                      <option value="Academic Guidance">Academic Guidance</option>
                      <option value="Financial Hardship">Financial Hardship</option>
                      <option value="Disciplinary Hearing">Disciplinary Hearing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Priority *
                    </label>
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Case Subject / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of request..."
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Details & Background *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Provide full description of the student's circumstance..."
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confidential Officer Notes (Restricted View)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Internal recommendations or sensitive notes..."
                    value={newConfidentialNotes}
                    onChange={e => setNewConfidentialNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewCaseModal(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#196855] text-white rounded-xl font-bold shadow-md hover:bg-[#196855]"
                  >
                    Submit Case
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
