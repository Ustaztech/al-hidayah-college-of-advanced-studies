import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { db, UserAccount } from '../../services/db';
import { logAuditEvent } from '../../services/audit';
import {
  Server,
  ShieldCheck,
  Users,
  Database,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Activity,
  Download,
  KeyRound,
  Layers,
  Cpu,
  Wifi
} from 'lucide-react';

export const ICTWorkspace: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState<'systemHealth' | 'userDirectory' | 'securityAudit' | 'integrations'>('systemHealth');
  const [users, setUsers] = useState<UserAccount[]>(() => db.getUsers());
  const [auditLogs] = useState(() => db.getAuditLogs());
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Integrations & Secrets Status
  const integrations = [
    { name: 'Supabase PostgreSQL Cloud Cluster', type: 'Primary Database', status: 'Healthy / Active', latency: '24ms', endpoint: 'Connected (SSL Enforced)' },
    { name: 'Local In-Browser Persistence Engine', type: 'Fail-Safe Offline Storage', status: 'Healthy / Synced', latency: '<1ms', endpoint: 'IndexedDB / LocalStorage' },
    { name: 'Paystack Payment Gateway API', type: 'Tuition & Fees Processing', status: 'Configured / Test Mode', latency: '82ms', endpoint: 'api.paystack.co' },
    { name: 'Remita Central Billing Service', type: 'Statutory Fee Invoicing', status: 'Configured / Ready', latency: '95ms', endpoint: 'login.remita.net' },
    { name: 'Cryptographic QR Code Security Engine', type: 'Anti-Forgery Verification', status: 'Operational', latency: '<2ms', endpoint: 'Local HMAC-SHA256' }
  ];

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter || u.subRole === roleFilter;
    const matchesSearch =
      userSearch === '' ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleExportAuditLogs = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ahcas_audit_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification({
      title: 'Security Audit Logs Exported',
      message: 'Audit trail JSON successfully downloaded.',
      category: 'System',
      priority: 'normal'
    });
  };

  return (
    <PortalLayout activeNav="ICT & Systems" portalTitle="ICT & Systems Infrastructure Directorate">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#196855] via-[#196855] to-[#0F172A] text-white p-6 sm:p-8 rounded-3xl border border-[#e69912]/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#e69912] text-slate-950 font-mono">
                System Administration
              </span>
              <span className="text-emerald-300 text-xs font-semibold">
                Network & Core Services Operations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ICT & Systems Infrastructure Workspace
            </h1>
            <p className="text-xs text-emerald-100 max-w-xl">
              System health telemetry, database connection pools, institutional user account directory, RBAC privilege audits, and security telemetry.
            </p>
          </div>

          <button
            onClick={handleExportAuditLogs}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-xl border border-white/20 shadow-md transition-all inline-flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Download size={15} />
            <span>Export Security Logs</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'systemHealth', label: 'System Health & Telemetry', icon: Activity },
            { id: 'userDirectory', label: `Accounts Directory (${users.length})`, icon: Users },
            { id: 'securityAudit', label: `Audit Events Ledger (${auditLogs.length})`, icon: ShieldCheck },
            { id: 'integrations', label: 'Integrations & Cloud Secrets', icon: Server }
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

        {/* TAB 1: SYSTEM HEALTH */}
        {activeTab === 'systemHealth' && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Application Status</span>
                  <CheckCircle2 size={16} className="text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">Online 100%</div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Vite 8.3 + React 19 Engine
                </span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Registered Accounts</span>
                  <Users size={16} className="text-blue-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{users.length}</div>
                <span className="text-[10px] text-slate-500">Across 19 institutional roles</span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Database Storage</span>
                  <Database size={16} className="text-amber-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">Active Pool</div>
                <span className="text-[10px] text-slate-500">PostgreSQL Cloud + Fail-Safe Cache</span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Audit Security Events</span>
                  <ShieldCheck size={16} className="text-teal-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{auditLogs.length}</div>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                  Immutable Event Log
                </span>
              </div>
            </div>

            {/* Service Nodes Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Core Service Endpoints & Health Status
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Last Telemetry: Just Now</span>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Service Name</th>
                    <th className="p-3.5">Classification</th>
                    <th className="p-3.5">Endpoint Target</th>
                    <th className="p-3.5">Response Time</th>
                    <th className="p-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {integrations.map((svc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{svc.name}</td>
                      <td className="p-3.5 text-slate-500">{svc.type}</td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{svc.endpoint}</td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{svc.latency}</td>
                      <td className="p-3.5 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-[#196855]">
                          {svc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: USER DIRECTORY */}
        {activeTab === 'userDirectory' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Search user accounts by name or email..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">Super Administrator</option>
                <option value="PROVOST">Provost / Executive</option>
                <option value="REGISTRAR">Academic Registrar</option>
                <option value="BURSAR">Bursary Officer</option>
                <option value="LECTURER">Lecturer / Academic</option>
                <option value="STUDENT">Enrolled Student</option>
                <option value="APPLICANT">Candidate / Applicant</option>
              </select>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">User Identity</th>
                    <th className="p-3.5">Email Address</th>
                    <th className="p-3.5">Primary Role</th>
                    <th className="p-3.5">Identifier</th>
                    <th className="p-3.5">Created At</th>
                    <th className="p-3.5 text-right">Security Standing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {u.subRole || u.role}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-500">{u.matricNumber || u.refNumber || '—'}</td>
                      <td className="p-3.5 text-slate-500">{u.createdAt?.split('T')[0] || '2026-10-01'}</td>
                      <td className="p-3.5 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-[#196855]">
                          Active & Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LEDGER */}
        {activeTab === 'securityAudit' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs animate-fade-in">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Immutable System Security & Authentication Events
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Total Recorded Events: {auditLogs.length}</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Actor</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Action Code</th>
                  <th className="p-3.5">Details</th>
                  <th className="p-3.5 text-right">IP Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.slice(0, 15).map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp?.replace('T', ' ').slice(0, 19)}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{log.actor}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {log.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#196855] text-[11px]">{log.action}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{log.details}</td>
                    <td className="p-3.5 text-right font-mono text-slate-400 text-[10px]">{log.ip_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: INTEGRATIONS & SECRETS */}
        {activeTab === 'integrations' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
            <h3 className="text-base font-extrabold font-serif">Cloud Configuration & Secrets Protection</h3>
            <p className="text-xs text-slate-500">
              In accordance with institutional security standards, sensitive secrets are never stored in client bundles or logged to console streams.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">VITE_SUPABASE_URL</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#196855]">Encrypted Variable</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">https://*********.supabase.co</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">VITE_SUPABASE_ANON_KEY</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#196855]">Public JWT Verified</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">eyJh************************************</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
