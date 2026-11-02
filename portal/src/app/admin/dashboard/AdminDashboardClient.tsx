'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Briefcase,
  Building,
  Layers,
  UserPlus,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  KeyRound,
  FileText,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { AuthSessionUser, Profile, Department, Programme, UserRoleName } from '../../../lib/types';
import { PortalHeader } from '../../../components/layout/PortalHeader';
import { PortalSidebar } from '../../../components/layout/PortalSidebar';
import { ALL_ROLES, ROLE_DISPLAY_NAMES } from '../../../lib/auth/roles';

interface AdminDashboardClientProps {
  user: AuthSessionUser;
  counts: {
    studentCount: number;
    activeStudents: number;
    inactiveStudents: number;
    staffCount: number;
    activeStaff: number;
    inactiveStaff: number;
    applicantCount?: number;
    applicationTypeCount?: number;
    totalApplications?: number;
    submittedApplications?: number;
    inProgressApplications?: number;
    departmentCount: number;
    programmeCount: number;
    totalProfiles: number;
  };
  profiles: Profile[];
  students: any[];
  staffList: any[];
  departments: Department[];
  programmes: Programme[];
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({
  user,
  counts: initialCounts,
  profiles: initialProfiles,
  students: initialStudents,
  staffList: initialStaffList,
  departments,
  programmes
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profiles' | 'students' | 'staff'>('profiles');
  const [searchQuery, setSearchQuery] = useState('');

  // Provisioning Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provisionType, setProvisionType] = useState<'student' | 'staff'>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [identifierNumber, setIdentifierNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRoleName>('student');
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || '');
  const [selectedProgId, setSelectedProgId] = useState(programmes[0]?.id || '');
  const [designation, setDesignation] = useState('Lecturer');
  const [level, setLevel] = useState('100');

  const [provisionSuccessMsg, setProvisionSuccessMsg] = useState<string | null>(null);
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Filtered views
  const filteredProfiles = initialProfiles.filter(p =>
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = initialStudents.filter(s =>
    s.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.matric_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStaff = initialStaffList.filter(st =>
    st.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.staff_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvisionError(null);
    setProvisionSuccessMsg(null);
    setIsProvisioning(true);

    try {
      const res = await fetch('/api/admin/provision-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          provisionType,
          identifierNumber,
          role: provisionType === 'student' ? 'student' : selectedRole,
          departmentId: selectedDeptId,
          programmeId: selectedProgId,
          designation,
          level
        })
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setProvisionError(json.message || 'Failed to provision account.');
        setIsProvisioning(false);
        return;
      }

      setProvisionSuccessMsg(
        `Account provisioned successfully for ${fullName}. A secure setup token was created: ${json.setupToken}`
      );
      setIsProvisioning(false);

      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setIdentifierNumber('');
    } catch {
      setProvisionError('Network communication error during account provisioning.');
      setIsProvisioning(false);
    }
  };

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
          portalTitle="Executive Administration Desk"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#196855] block">
                Institutional Governance
              </span>
              <h2 className="text-2xl font-bold font-serif text-gray-900 leading-tight">
                Academic & User Directory Control
              </h2>
            </div>

            <button
              onClick={() => {
                setIsModalOpen(true);
                setProvisionError(null);
                setProvisionSuccessMsg(null);
              }}
              className="px-4 py-2.5 bg-[#196855] hover:bg-[#135344] text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <UserPlus size={16} />
              <span>Provision Student/Staff Account</span>
            </button>
          </div>

          {/* Real Statistics Cards Grid (Real database queries) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  Students Enrolled
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#196855] flex items-center justify-center">
                  <GraduationCap size={16} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900 font-serif">
                {initialCounts.studentCount}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <span className="text-emerald-700 font-bold">{initialCounts.activeStudents} Active</span>
                <span>•</span>
                <span className="text-gray-400">{initialCounts.inactiveStudents} Inactive</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  Academic Staff
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Briefcase size={16} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900 font-serif">
                {initialCounts.staffCount}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <span className="text-blue-700 font-bold">{initialCounts.activeStaff} Active</span>
                <span>•</span>
                <span className="text-gray-400">{initialCounts.inactiveStaff} On Leave</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  Departments
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#e69912] flex items-center justify-center">
                  <Building size={16} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900 font-serif">
                {initialCounts.departmentCount}
              </p>
              <p className="text-[11px] text-gray-500">
                Accredited Academic Faculties
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  Programmes
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Layers size={16} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900 font-serif">
                {initialCounts.programmeCount}
              </p>
              <p className="text-[11px] text-gray-500">
                Approved IJMB & Diploma Tracks
              </p>
            </div>

          </div>

          {/* Admissions Application Controls (Step 3) */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#e69912] uppercase tracking-wider">
                Step 3 Online Admissions Directorate
              </span>
              <h3 className="text-base font-bold font-serif">
                Multi-Step Admission Application Management
              </h3>
              <p className="text-xs text-emerald-100/70 max-w-xl">
                Configure academic sessions and programmes, inspect applicant dossiers (O-Level results & credentials), and track admission submissions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/admin/applications"
                className="py-2 px-3 rounded-xl bg-[#e69912] hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <FileText size={14} />
                <span>Applications ({initialCounts.totalApplications ?? 1})</span>
              </Link>

              <Link
                href="/admin/admission-sessions"
                className="py-2 px-3 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-50 transition-colors shadow-2xs"
              >
                <Calendar size={14} className="text-[#196855]" />
                <span>Academic Sessions</span>
              </Link>

              <Link
                href="/admin/admission-programmes"
                className="py-2 px-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 border border-emerald-600/40 transition-colors"
              >
                <Layers size={14} className="text-[#e69912]" />
                <span>Admission Courses</span>
              </Link>

              <Link
                href="/admin/applicants"
                className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Users size={14} />
                <span>Accounts</span>
              </Link>
            </div>
          </div>

          {/* Steps 5 & 6: Bursary Payments & Registry Matriculation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                    Step 5 Bursary Desk
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">Remita Payments & Receipts</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 font-serif pt-1">
                  Bursary & Electronic Payments Reconciliation
                </h3>
                <p className="text-xs text-gray-500">
                  Track Remita RRR generation, monitor electronic acceptance fee settlements (₦25,000), and record bank branch tellers.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-gray-100 mt-4">
                <div className="text-xs">
                  <span className="text-gray-400">Total Collections: </span>
                  <strong className="font-mono text-[#196855]">
                    ₦{(initialCounts as any).totalRevenue ? (initialCounts as any).totalRevenue.toLocaleString() : '0'}.00
                  </strong>
                </div>
                <Link
                  href="/admin/bursary"
                  className="px-4 py-2 rounded-xl bg-[#196855] hover:bg-[#124d3f] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                >
                  <span>Bursary Desk</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                    Step 6 Registry Desk
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">Matriculation & Clearance</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 font-serif pt-1">
                  Matriculation & Enrolled Cohort Roster
                </h3>
                <p className="text-xs text-gray-500">
                  Manage assigned institutional Matriculation Numbers (AHCAS/2026/XXX), issue Registry Clearance Slips, and audit student roll.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-gray-100 mt-4">
                <div className="text-xs">
                  <span className="text-gray-400">Matriculated: </span>
                  <strong className="font-mono text-gray-900">
                    {(initialCounts as any).matriculatedCount || (initialCounts as any).studentCount || 0} Students
                  </strong>
                </div>
                <Link
                  href="/admin/matriculation"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                >
                  <span>Matriculation Desk</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Directory Tabs & Search */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('profiles')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'profiles'
                      ? 'bg-[#196855] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All User Profiles ({initialProfiles.length})
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'students'
                      ? 'bg-[#196855] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Students ({initialStudents.length})
                </button>
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'staff'
                      ? 'bg-[#196855] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Staff ({initialStaffList.length})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#196855]"
                />
              </div>
            </div>

            {/* Table View */}
            <div className="overflow-x-auto">
              {activeTab === 'profiles' && (
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    <tr>
                      <th className="p-3.5 pl-6">Full Legal Name</th>
                      <th className="p-3.5">Email Identifier</th>
                      <th className="p-3.5">Phone</th>
                      <th className="p-3.5">Account Status</th>
                      <th className="p-3.5 pr-6 text-right">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredProfiles.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3.5 pl-6 font-bold text-gray-900 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#196855] flex items-center justify-center font-bold text-[10px]">
                            {p.full_name.charAt(0)}
                          </div>
                          <span>{p.full_name}</span>
                        </td>
                        <td className="p-3.5 font-mono text-gray-600">{p.email}</td>
                        <td className="p-3.5 font-mono text-gray-500">{p.phone || 'N/A'}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              p.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3.5 pr-6 text-right text-gray-400 font-mono text-[11px]">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'students' && (
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    <tr>
                      <th className="p-3.5 pl-6">Student Name</th>
                      <th className="p-3.5">Matric Number</th>
                      <th className="p-3.5">Enrolled Programme</th>
                      <th className="p-3.5">Level</th>
                      <th className="p-3.5 pr-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3.5 pl-6 font-bold text-gray-900">{s.profile?.full_name}</td>
                        <td className="p-3.5 font-mono font-bold text-[#196855]">{s.matric_number}</td>
                        <td className="p-3.5 text-gray-600 truncate max-w-xs">{s.programme?.name || 'IJMB Sciences'}</td>
                        <td className="p-3.5 font-bold text-gray-700">{s.level}</td>
                        <td className="p-3.5 pr-6 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'staff' && (
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    <tr>
                      <th className="p-3.5 pl-6">Staff Name</th>
                      <th className="p-3.5">Staff Number</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">Designation</th>
                      <th className="p-3.5 pr-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredStaff.map((st) => (
                      <tr key={st.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3.5 pl-6 font-bold text-gray-900">{st.profile?.full_name}</td>
                        <td className="p-3.5 font-mono font-bold text-[#196855]">{st.staff_number}</td>
                        <td className="p-3.5 text-gray-600 truncate max-w-xs">{st.department?.name || 'Academic Directorate'}</td>
                        <td className="p-3.5 font-medium text-gray-700">{st.designation}</td>
                        <td className="p-3.5 pr-6 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {st.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </main>
      </div>

      {/* Account Provisioning Modal (Secure Administrator Flow) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold font-serif text-gray-900">
                  Provision User Account
                </h3>
                <p className="text-xs text-gray-500">
                  Secure administrator-only credential dispatch flow.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {provisionError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{provisionError}</span>
              </div>
            )}

            {provisionSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
                <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-[#196855]" />
                <span className="break-all">{provisionSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleProvisionSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setProvisionType('student');
                    setSelectedRole('student');
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    provisionType === 'student' ? 'bg-[#196855] text-white shadow-xs' : 'text-gray-600'
                  }`}
                >
                  Student Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProvisionType('staff');
                    setSelectedRole('lecturer');
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    provisionType === 'staff' ? 'bg-[#196855] text-white shadow-xs' : 'text-gray-600'
                  }`}
                >
                  Staff Account
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ibrahim Abubakar"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#196855]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">Official Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@alhidayahcollege.com.ng"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#196855]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="08056350078"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#196855]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  {provisionType === 'student' ? 'Matriculation Number' : 'Staff Number'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={provisionType === 'student' ? 'AHCAS/2026/...' : 'AHCAS/STF/2026/...'}
                  value={identifierNumber}
                  onChange={e => setIdentifierNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#196855]"
                />
              </div>

              {provisionType === 'student' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Academic Programme</label>
                    <select
                      value={selectedProgId}
                      onChange={e => setSelectedProgId(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    >
                      {programmes.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Level</label>
                    <select
                      value={level}
                      onChange={e => setLevel(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    >
                      <option value="100">100 Level</option>
                      <option value="200">200 Level</option>
                      <option value="IJMB 1">IJMB Year 1</option>
                      <option value="IJMB 2">IJMB Year 2</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">Department</label>
                      <select
                        value={selectedDeptId}
                        onChange={e => setSelectedDeptId(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">Role Clearance</label>
                      <select
                        value={selectedRole}
                        onChange={e => setSelectedRole(e.target.value as UserRoleName)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                      >
                        {ALL_ROLES.filter(r => r !== 'student').map(r => (
                          <option key={r} value={r}>{ROLE_DISPLAY_NAMES[r]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Designation / Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Lecturer in Organic Chemistry"
                      value={designation}
                      onChange={e => setDesignation(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProvisioning}
                  className="px-5 py-2 bg-[#196855] hover:bg-[#135344] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isProvisioning ? 'Provisioning...' : 'Provision Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
