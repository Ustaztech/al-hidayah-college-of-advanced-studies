import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Laptop,
  CheckCircle2,
  FileText,
  CreditCard,
  Building,
  ShieldCheck,
  Users,
  Compass,
  Award,
  ArrowRight,
  Sparkles,
  Search,
  ExternalLink,
  Lock,
  UserCheck
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

interface PortalCardItem {
  title: string;
  category: string;
  description: string;
  path: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  requiresAuth?: boolean;
  allowedRoles?: string[];
}

export const PortalsHub: React.FC = () => {
  const { currentUser, role, isAuthorized } = useAuth();
  const isAuthenticated = !!currentUser;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('ALL');

  const portalCards: PortalCardItem[] = [
    // Student & Learning
    {
      title: 'Student Information System',
      category: 'STUDENT',
      description: 'Access course registration, examination timetable, IJMB point calculator, and digital ID card.',
      path: '/student',
      icon: GraduationCap,
      badge: 'Active Students',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      requiresAuth: true,
      allowedRoles: ['STUDENT', 'SUPER_ADMIN']
    },
    {
      title: 'E-Learning & Virtual Campus',
      category: 'STUDENT',
      description: 'Download lecture notes, participate in discussion forums, access digital study materials and recorded sessions.',
      path: '/student/elearning',
      icon: Laptop,
      badge: 'LMS Platform',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      requiresAuth: true
    },
    {
      title: 'CBT Examination & Mock Suite',
      category: 'STUDENT',
      description: 'Practice simulated IJMB computer-based mock tests, continuous assessments, and timed past questions.',
      path: '/student/cbt',
      icon: BookOpen,
      badge: 'CBT Testing',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
      requiresAuth: true
    },
    {
      title: 'Public Document & Result Verification',
      category: 'STUDENT',
      description: 'Verify provisional admission letters, course registration slips, student IDs, and institutional clearances via QR code.',
      path: '/verify',
      icon: ShieldCheck,
      badge: 'Public & Tamper-Proof',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    },

    // Admissions
    {
      title: 'Online Application Portal',
      category: 'ADMISSIONS',
      description: 'Prospective students can submit IJMB A-Level 200L Direct Entry admission forms, O’Level grades, and documents.',
      path: '/apply',
      icon: FileText,
      badge: '2026/2027 Admissions Open',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
    },
    {
      title: 'Candidate Application Tracker',
      category: 'ADMISSIONS',
      description: 'Track application screening status, check provisional offer of admission, and download official letter.',
      path: '/apply/status',
      icon: CheckCircle2,
      badge: 'Status Tracker',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    },
    {
      title: '73 IJMB Subject Combinations',
      category: 'ADMISSIONS',
      description: 'Interactive combination and direct-entry faculty matcher for Medicine, Law, Engineering, Sciences, and Arts.',
      path: '/programmes/ijmb',
      icon: Compass,
      badge: 'Course Matcher',
      badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
    },

    // Administrative & Faculty
    {
      title: 'Academic Registry Workspace',
      category: 'ADMIN',
      description: 'Manage candidate admissions, matriculation number assignments, student records, and formal registry circulars.',
      path: '/registry',
      icon: Building,
      badge: 'Registry Staff',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      requiresAuth: true,
      allowedRoles: ['REGISTRAR', 'SUPER_ADMIN', 'PROVOST']
    },
    {
      title: 'Bursary & Fee Clearance Desk',
      category: 'ADMIN',
      description: 'Reconcile tuition installments, record verified bank drafts, generate receipts, and export financial summaries.',
      path: '/bursary',
      icon: CreditCard,
      badge: 'Finance / Bursary',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      requiresAuth: true,
      allowedRoles: ['BURSAR', 'FINANCE_OFFICER', 'SUPER_ADMIN', 'PROVOST']
    },
    {
      title: 'Examinations & Records Office',
      category: 'ADMIN',
      description: 'Record continuous assessment marks, compute IJMB 16-point scale results, and schedule mock examinations.',
      path: '/exams',
      icon: Award,
      badge: 'Exam Officers',
      badgeColor: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
      requiresAuth: true,
      allowedRoles: ['EXAMINATION_OFFICER', 'LECTURER', 'REGISTRAR', 'SUPER_ADMIN']
    },
    {
      title: 'ICT Infrastructure & Support',
      category: 'ADMIN',
      description: 'System health monitoring, user credential resets, network configuration, and database synchronization tools.',
      path: '/ict',
      icon: Laptop,
      badge: 'ICT Unit',
      badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      requiresAuth: true,
      allowedRoles: ['ICT_OFFICER', 'SUPER_ADMIN']
    },
    {
      title: 'Student Affairs Division',
      category: 'ADMIN',
      description: 'Hostel coordination, welfare administration, extracurricular activities, and student disciplinary records.',
      path: '/student-affairs',
      icon: Users,
      badge: 'Student Affairs',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      requiresAuth: true,
      allowedRoles: ['STUDENT_AFFAIRS_OFFICER', 'REGISTRAR', 'SUPER_ADMIN', 'PROVOST']
    },
    {
      title: 'Academic Quality Assurance Unit',
      category: 'ADMIN',
      description: 'Curriculum audits, teaching quality indices, IJMB syllabus benchmark adherence, and institutional compliance.',
      path: '/qa',
      icon: ShieldCheck,
      badge: 'Quality Assurance',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      requiresAuth: true,
      allowedRoles: ['QUALITY_ASSURANCE_OFFICER', 'SUPER_ADMIN', 'PROVOST']
    },

    // Governance & Executive
    {
      title: 'Provost Executive Suite',
      category: 'GOVERNANCE',
      description: 'Strategic executive oversight, real-time enrolment analytics, faculty load KPIs, and administrative directives.',
      path: '/provost',
      icon: Sparkles,
      badge: 'Executive Suite',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      requiresAuth: true,
      allowedRoles: ['PROVOST', 'SUPER_ADMIN']
    },
    {
      title: 'Governing Council Boardroom',
      category: 'GOVERNANCE',
      description: 'Council member repository for policy resolutions, committee charters, financial audits, and statutory minutes.',
      path: '/council',
      icon: Building,
      badge: 'Governing Council',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      requiresAuth: true,
      allowedRoles: ['COUNCIL_MEMBER', 'PROVOST', 'REGISTRAR', 'SUPER_ADMIN']
    },

    // Community & Stakeholder
    {
      title: 'Parents & Guardians Portal',
      category: 'COMMUNITY',
      description: 'Monitor your ward’s attendance, continuous assessment scores, fee clearance status, and institutional notifications.',
      path: '/parent',
      icon: Users,
      badge: 'Parents & Guardians',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
    },
    {
      title: 'Staff Self-Service & Directory',
      category: 'COMMUNITY',
      description: 'Faculty profile management, lecture schedules, leave requests, and inter-departmental communications.',
      path: '/staff',
      icon: UserCheck,
      badge: 'Academic & Non-Teaching Staff',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      requiresAuth: true
    },
    {
      title: 'Alumni Network & Direct Entry Success',
      category: 'COMMUNITY',
      description: 'Connect with former IJMB graduates now thriving in federal, state, and international universities.',
      path: '/alumni',
      icon: GraduationCap,
      badge: 'Alumni Association',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    },
    {
      title: 'Convocation & Matriculation Registry',
      category: 'COMMUNITY',
      description: 'Access academic ceremony programmes, order official gowns, download graduation orders of proceedings.',
      path: '/convocation',
      icon: Award,
      badge: 'Ceremonial Hub',
      badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
    }
  ];

  const categories = [
    { id: 'ALL', label: 'All Portals' },
    { id: 'STUDENT', label: 'Student & Learning' },
    { id: 'ADMISSIONS', label: 'Admissions & IJMB' },
    { id: 'ADMIN', label: 'Registry & Operations' },
    { id: 'GOVERNANCE', label: 'Executive Governance' },
    { id: 'COMMUNITY', label: 'Parents & Community' }
  ];

  const filteredCards = portalCards.filter(card => {
    const matchesCategory = selectedCategory === 'ALL' || card.category === selectedCategory;
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#196855] to-[#124d3f] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden border-b-4 border-[#e69912] shadow-xl">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#e69912] text-white text-xs font-black rounded-full uppercase tracking-wider">
                Digital Campus Directory
              </span>
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                Single Sign-On & Self-Service
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight">
              AHCAS E-Portals Directory
            </h1>
            <p className="text-base text-amber-200 font-serif italic">
              Centralized digital gateway for students, prospective candidates, bursary, faculty, and governance.
            </p>
            <p className="text-xs text-emerald-100 font-sans">
              {INSTITUTION_INFO.name} • {INSTITUTION_INFO.studyCentre}
            </p>
          </div>
        </div>

        {/* Auth Quick Status Banner */}
        <div className="p-4 sm:p-6 bg-[#F4F6F5] dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#196855] text-amber-300 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Authentication Status
              </p>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {isAuthenticated ? (
                  <span>
                    Logged in as <strong className="text-[#196855] dark:text-emerald-400">{currentUser?.name || currentUser?.email}</strong> ({currentUser?.subRole || role})
                  </span>
                ) : (
                  <span>You are browsing as a Guest. Some departmental workspaces require official login.</span>
                )}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <Link
                to="/signin"
                className="px-5 py-2.5 bg-[#196855] text-white text-xs font-bold rounded-xl hover:bg-[#124d3f] transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Institutional Sign In</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                to="/student"
                className="px-5 py-2.5 bg-[#e69912] text-white text-xs font-bold rounded-xl hover:bg-[#d48806] transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Go to My Workspace</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#196855] text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search institutional portals..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F4F6F5] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#196855]"
            />
          </div>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((portal, idx) => {
            const Icon = portal.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:shadow-lg hover:border-[#196855]/40 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="p-3 bg-emerald-50 dark:bg-slate-700 text-[#196855] dark:text-emerald-400 rounded-2xl group-hover:bg-[#196855] group-hover:text-amber-300 transition-colors">
                      <Icon size={24} />
                    </div>
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${portal.badgeColor}`}>
                      {portal.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white group-hover:text-[#196855] dark:group-hover:text-emerald-400 transition-colors">
                      {portal.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {portal.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  {portal.requiresAuth ? (
                    !isAuthenticated ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        <Lock size={12} />
                        <span>Sign In Required</span>
                      </span>
                    ) : isAuthorized(portal.allowedRoles as any) ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={12} />
                        <span>Clearance Granted</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                        <Lock size={12} />
                        <span>Restricted Clearance</span>
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <ExternalLink size={12} />
                      <span>Open Access</span>
                    </span>
                  )}

                  <Link
                    to={portal.path}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                      !portal.requiresAuth || (isAuthenticated && isAuthorized(portal.allowedRoles as any))
                        ? 'bg-[#196855] hover:bg-[#124d3f] text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-[#196855] hover:text-white'
                    }`}
                  >
                    <span>{!portal.requiresAuth || (isAuthenticated && isAuthorized(portal.allowedRoles as any)) ? 'Launch' : 'Enter'}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCards.length === 0 && (
          <div className="p-12 text-center bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              No portals match your search query "{searchQuery}".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
              className="mt-3 text-xs font-bold text-[#196855] dark:text-emerald-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Support Callout */}
        <div className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl border border-amber-200 dark:border-amber-900/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h4 className="text-lg font-bold font-serif text-amber-950 dark:text-amber-200">
              Need assistance accessing your student account or portal?
            </h4>
            <p className="text-xs text-amber-900/80 dark:text-slate-300">
              The AHCAS ICT & Support Desk at JSS Agyana Road Study Centre is available Monday – Friday, 8:00 AM – 4:00 PM.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 transition-colors shadow-sm"
            >
              Contact ICT Desk
            </Link>
            <Link
              to="/faqs"
              className="px-5 py-2.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-amber-300 dark:border-slate-600 hover:bg-amber-100 transition-colors"
            >
              Frequently Asked Questions
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
