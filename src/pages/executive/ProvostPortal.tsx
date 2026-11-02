import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/db';
import { INSTITUTION_INFO, TUITION_SCHEDULE } from '../../data/ijmbData';
import {
  TrendingUp,
  Users,
  GraduationCap,
  CreditCard,
  Award,
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  BarChart2,
  Calendar,
  ArrowUpRight,
  ExternalLink,
  Search
} from 'lucide-react';

export const ProvostPortal: React.FC = () => {
  const { currentUser } = useAuth();

  const applications = db.getApplications();
  const students = db.getStudents();
  const receipts = db.getReceipts();
  const auditLogs = db.getAuditLogs();

  // Metrics computation from real database records
  const totalEnrolled = students.length;
  const totalApplications = applications.length;
  const admittedCount = applications.filter(a => a.status === 'Admitted').length;
  const totalRevenue = receipts.reduce((sum, r) => sum + r.amountNgn, 0);
  const totalOutstanding = students.reduce((sum, s) => sum + (s.outstanding_balance || 0), 0);

  const [activeTab, setActiveTab] = useState<'overview' | 'admissions' | 'finance' | 'academics' | 'audit'>('overview');

  return (
    <PortalLayout activeNav="Provost Executive" portalTitle="Provost & Executive Governance Portal">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Executive Banner */}
        <div className="bg-gradient-to-r from-[#196855] via-[#196855] to-[#196855] text-white p-6 sm:p-8 rounded-3xl border border-[#e69912]/40 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#e69912] text-slate-950 font-mono">
                Executive Leadership
              </span>
              <span className="text-emerald-300 text-xs font-semibold">
                Office of the Executive Chairman & Founder
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Dr. Muhammad Baba Suleiman, PhD
            </h1>
            <p className="text-xs text-emerald-100 max-w-xl">
              High-level institutional performance indicators, real-time enrolment conversion metrics, financial audit ledger, and academic board oversight.
            </p>
          </div>

          <div className="p-3 bg-emerald-950/70 border border-emerald-800/80 rounded-2xl flex items-center gap-3">
            <img
              src="/provost-mbsuleiman.jpg"
              alt="Provost Portrait"
              className="w-12 h-12 rounded-xl object-cover border border-[#e69912]"
            />
            <div className="text-xs">
              <span className="text-amber-300 font-bold block">Magajin Ilimin Abaji</span>
              <span className="text-slate-300 text-[10px] font-medium">Office of the College Provost</span>
            </div>
          </div>
        </div>

        {/* Real KPI Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled Students</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#196855] flex items-center justify-center">
                <GraduationCap size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalEnrolled}</span>
              <span className="text-[10px] text-emerald-600 font-bold">100% Active</span>
            </div>
            <span className="text-[10px] text-slate-400 block">JSS Agyana Road Study Centre</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Applications Processed</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalApplications}</span>
              <span className="text-[10px] text-emerald-600 font-bold">{admittedCount} Admitted</span>
            </div>
            <span className="text-[10px] text-slate-400 block">IJMB 2026/2027 Cohort</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Tuition Fees Collected</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#196855] flex items-center justify-center">
                <CreditCard size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                ₦{totalRevenue.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">Verified Bursary Settlements</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Tuition Receivables</span>
              <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                ₦{totalOutstanding.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">Installment Due Schedule</span>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'overview', label: 'Executive Overview' },
            { id: 'admissions', label: 'Admissions Funnel' },
            { id: 'finance', label: 'Bursary Ledger' },
            { id: 'academics', label: 'Academic Standing' },
            { id: 'audit', label: 'Institutional Audit Logs' }
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Regulatory & Accreditations Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Shield size={18} className="text-[#196855]" />
                Institutional Accreditations & Regulatory Clearances
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {INSTITUTION_INFO.collaborations.map((collab, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{collab}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#196855] dark:bg-emerald-950 dark:text-emerald-300">
                      Approved
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Audit Activities */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Clock size={18} className="text-[#e69912]" />
                Recent Executive Audit Events
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {auditLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="py-2.5 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                        {log.action}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{log.details}</p>
                    <span className="text-[10px] text-slate-400">Actor: {log.actor} ({log.role})</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'admissions' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Admissions Applications Directory
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Programme</th>
                    <th className="p-3">Combinations</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications.map(app => (
                    <tr key={app.id}>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{app.full_name}</td>
                      <td className="p-3 font-mono text-emerald-800 dark:text-emerald-300">{app.ref_number}</td>
                      <td className="p-3">{app.programme_title}</td>
                      <td className="p-3 font-mono">{app.subject_combination_code || '030'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#196855]">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Bursary Payment Records & Receipts
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Receipt No.</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Matric No.</th>
                    <th className="p-3">Fee Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Channel</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {receipts.map(r => (
                    <tr key={r.receiptNumber}>
                      <td className="p-3 font-mono text-emerald-800 dark:text-emerald-300 font-bold">{r.receiptNumber}</td>
                      <td className="p-3 font-bold">{r.studentName}</td>
                      <td className="p-3 font-mono">{r.matricNumber}</td>
                      <td className="p-3">{r.feeType}</td>
                      <td className="p-3 font-mono font-bold">₦{r.amountNgn.toLocaleString()}</td>
                      <td className="p-3">{r.paymentMethod}</td>
                      <td className="p-3 text-slate-500 font-mono">{r.paidAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Immutable System Audit Logs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Event Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {auditLogs.map(l => (
                    <tr key={l.id}>
                      <td className="p-3 font-mono text-slate-400">{l.timestamp}</td>
                      <td className="p-3 font-bold">{l.actor}</td>
                      <td className="p-3 font-mono">{l.role}</td>
                      <td className="p-3 font-mono text-emerald-800 dark:text-emerald-300 font-bold">{l.action}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{l.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
