import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { logAuditEvent } from '../../services/audit';
import { REAL_STAFF, INSTITUTION_INFO } from '../../data/ijmbData';
import {
  Briefcase,
  Calendar,
  Clock,
  FileText,
  User,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  BookOpen,
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const StaffPortal: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'leave' | 'directory'>('profile');

  // Leave Form State
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  // Active staff details
  const activeStaff = REAL_STAFF.find(
    s => s.email?.toLowerCase() === currentUser?.email?.toLowerCase() || s.name.includes(currentUser?.name || '')
  ) || REAL_STAFF[0];

  const teachingSchedule = [
    { day: 'Monday', time: '09:00 – 11:00', course: 'BIO 001: General Biology I', venue: 'Science Lab A', cohort: 'IJMB Science (Code 030)' },
    { day: 'Tuesday', time: '09:00 – 11:00', course: 'CHM 001: Inorganic & Physical Chemistry', venue: 'Science Lab B', cohort: 'IJMB Science (Code 043)' },
    { day: 'Wednesday', time: '11:30 – 13:30', course: 'PHY 001: Mechanics, Heat & Waves', venue: 'Lecture Hall 1', cohort: 'IJMB Science' },
    { day: 'Thursday', time: '10:00 – 12:00', course: 'GST 001: Academic Communication', venue: 'Lecture Hall 2', cohort: 'Combined ND / IJMB' }
  ];

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveSubmitted(true);

    logAuditEvent(
      currentUser?.name || 'Staff Member',
      role,
      'LEAVE_APPLICATION_SUBMITTED',
      `Applied for ${leaveType} from ${startDate} to ${endDate}`
    );

    addNotification({
      target_role: 'PROVOST',
      title: 'Staff Leave Application',
      message: `${currentUser?.name || 'Staff Member'} applied for ${leaveType} (${startDate} to ${endDate}).`,
      category: 'System',
      priority: 'normal',
      action_url: '/provost'
    });

    setTimeout(() => {
      setLeaveSubmitted(false);
      setStartDate('');
      setEndDate('');
      setLeaveReason('');
      alert('Leave application submitted to the Office of the Executive Chairman for approval.');
    }, 2000);
  };

  return (
    <PortalLayout activeNav="Staff Self-Service" portalTitle="Staff & Employee Portal">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#196855] via-[#196855] to-[#196855] text-white p-6 sm:p-7 rounded-3xl border border-[#e69912]/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#e69912] font-mono block">
              Staff Self-Service & Work Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentUser?.name || activeStaff.name}
            </h1>
            <p className="text-xs text-emerald-100 max-w-xl">
              {activeStaff.position} • {activeStaff.department}
            </p>
          </div>

          <div className="px-4 py-2 bg-emerald-950/70 border border-emerald-800 rounded-2xl flex items-center gap-2">
            <ShieldCheck className="text-[#e69912]" size={20} />
            <div className="text-xs">
              <span className="text-amber-300 font-bold block">{role} Clearance</span>
              <span className="text-slate-300 text-[10px]">Academic Staff Directory</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'profile', label: 'My Profile & Designation' },
            { id: 'schedule', label: 'Teaching Schedule' },
            { id: 'leave', label: 'Leave Applications' },
            { id: 'directory', label: 'College Staff Directory' }
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

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-4">
              <img
                src={activeStaff.photoUrl || '/provost-mbsuleiman.jpg'}
                alt={activeStaff.name}
                className="w-28 h-28 mx-auto rounded-2xl object-cover border-2 border-[#e69912] shadow-md"
              />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">{activeStaff.name}</h3>
                <span className="text-xs text-[#196855] dark:text-emerald-400 font-bold block mt-0.5">{activeStaff.position}</span>
                <span className="text-[11px] text-slate-400 font-mono block mt-1">{activeStaff.email || currentUser?.email}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 text-left space-y-1">
                <p><strong>Qualification:</strong> {activeStaff.qualification}</p>
                <p><strong>Station:</strong> {INSTITUTION_INFO.studyCentre}</p>
              </div>
            </div>

            <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase size={18} className="text-[#196855]" />
                Institutional Duties & Terms of Reference
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {activeStaff.duties}
              </p>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pt-2">
                Biographical Overview
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeStaff.bio}
              </p>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-[#196855]" />
              Weekly Lecture & Laboratory Roster
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {teachingSchedule.map((item, idx) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                      {item.day} • {item.time}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.course}</h4>
                    <span className="text-slate-500 block">Venue: <strong>{item.venue}</strong></span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-[#196855] dark:text-emerald-300 rounded-xl font-mono text-[10px] font-bold">
                    {item.cohort}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leave Tab */}
        {activeTab === 'leave' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs max-w-xl space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-[#196855]" />
              Submit Employee Leave Application
            </h3>

            {leaveSubmitted ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200">
                <CheckCircle2 size={36} className="text-[#196855] mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Leave Application Dispatched</h4>
                <p className="text-xs text-slate-500">Your application has been logged and sent to Registry & Provost for approval.</p>
              </div>
            ) : (
              <form onSubmit={handleApplyLeave} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Leave Category</label>
                  <select
                    value={leaveType}
                    onChange={e => setLeaveType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    <option>Annual Leave</option>
                    <option>Compassionate Leave</option>
                    <option>Medical Leave</option>
                    <option>Examination Duty Leave</option>
                    <option>Academic Conference Permission</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Commencement Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Resumption Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Grounds / Reason for Leave</label>
                  <textarea
                    rows={3}
                    required
                    value={leaveReason}
                    onChange={e => setLeaveReason(e.target.value)}
                    placeholder="Provide details and relief duty arrangements..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#196855] hover:bg-[#196855] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
                >
                  <Send size={14} />
                  <span>Submit Leave Request</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Directory Tab */}
        {activeTab === 'directory' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Official Institutional Staff Directory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REAL_STAFF.map(staff => (
                <div key={staff.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3.5">
                  <img
                    src={staff.photoUrl}
                    alt={staff.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#e69912]"
                  />
                  <div className="space-y-0.5 text-xs">
                    <h4 className="font-black text-slate-900 dark:text-white">{staff.name}</h4>
                    <span className="text-[#196855] dark:text-emerald-400 font-bold block">{staff.position}</span>
                    <span className="text-slate-400 font-mono text-[10px] block">{staff.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
