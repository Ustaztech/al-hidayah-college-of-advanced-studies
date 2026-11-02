import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import {
  GraduationCap,
  Award,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Search,
  ShieldCheck,
  UserCheck,
  Printer,
  Sparkles,
  QrCode
} from 'lucide-react';

interface GraduandRecord {
  matricNumber: string;
  fullName: string;
  programme: string;
  classification: string;
  academicClearance: boolean;
  bursaryClearance: boolean;
  libraryClearance: boolean;
  gownStatus: 'Cleared' | 'Pending Gown Fee' | 'Collected' | 'Returned';
  gownReference?: string;
  seatNumber: string;
  guestTickets: number;
}

const MOCK_GRADUANDS: Record<string, GraduandRecord> = {
  'AHCAS/IJMB/2025/001': {
    matricNumber: 'AHCAS/IJMB/2025/001',
    fullName: 'Zainab Aminu Ibrahim',
    programme: 'IJMB Science (Medicine Direct Entry Track - 15 Points)',
    classification: 'Distinction / High Honours',
    academicClearance: true,
    bursaryClearance: true,
    libraryClearance: true,
    gownStatus: 'Cleared',
    gownReference: 'AHCAS-GWN-2026-001',
    seatNumber: 'AUD-ROW-A14',
    guestTickets: 2
  },
  'AHCAS/IJMB/2025/014': {
    matricNumber: 'AHCAS/IJMB/2025/014',
    fullName: 'Yusuf Abubakar Sadiq',
    programme: 'IJMB Management & Social Sciences (14 Points)',
    classification: 'Upper Credit / Honours',
    academicClearance: true,
    bursaryClearance: true,
    libraryClearance: true,
    gownStatus: 'Cleared',
    gownReference: 'AHCAS-GWN-2026-014',
    seatNumber: 'AUD-ROW-B08',
    guestTickets: 2
  },
  'AHCAS/IJMB/2025/042': {
    matricNumber: 'AHCAS/IJMB/2025/042',
    fullName: 'Fatima Mohammed Kabir',
    programme: 'IJMB Arts & Humanities (Law Track - 13 Points)',
    classification: 'Honours',
    academicClearance: true,
    bursaryClearance: false,
    libraryClearance: true,
    gownStatus: 'Pending Gown Fee',
    seatNumber: 'Unassigned (Bursary Clearance Required)',
    guestTickets: 0
  }
};

export const ConvocationPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'clearance' | 'gown' | 'programme' | 'awards'>('overview');
  const [searchMatric, setSearchMatric] = useState('');
  const [graduandResult, setGraduandResult] = useState<GraduandRecord | null>(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [gownPaying, setGownPaying] = useState(false);
  const [gownPaymentSuccess, setGownPaymentSuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchInitiated(true);
    const cleaned = searchMatric.trim().toUpperCase();
    if (MOCK_GRADUANDS[cleaned]) {
      setGraduandResult(MOCK_GRADUANDS[cleaned]);
    } else {
      setGraduandResult(null);
    }
  };

  const handlePayGownFee = () => {
    setGownPaying(true);
    setTimeout(() => {
      setGownPaying(false);
      setGownPaymentSuccess(true);
      if (graduandResult) {
        setGraduandResult({
          ...graduandResult,
          bursaryClearance: true,
          gownStatus: 'Cleared',
          gownReference: `AHCAS-GWN-2026-${Math.floor(100 + Math.random() * 900)}`,
          seatNumber: 'AUD-ROW-C12',
          guestTickets: 2
        });
      }
    }, 1500);
  };

  const ceremonyDate = 'Saturday, November 28, 2026';
  const ceremonyTime = '09:00 AM Prompt';
  const ceremonyVenue = 'AHCAS Main Convocation Amphitheatre & Auditorium, JSS Agyana Road Study Centre, Abaji, Abuja FCT';

  return (
    <PortalLayout activeNav="Convocation" portalTitle="AHCAS Convocation & Graduation Secretariat">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border border-emerald-700/30 text-white p-8 md:p-10 shadow-xl">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-400/30 uppercase">
                <Sparkles className="w-3.5 h-3.5" /> 3rd Special Convocation & Investiture Ceremony
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-serif">
                Conferment of IJMB & Advanced Diplomas
              </h1>
              <p className="text-emerald-100/90 text-sm md:text-base max-w-2xl leading-relaxed">
                Celebrating the graduating scholars of {INSTITUTION_INFO.name}. Official digital clearances, academic regalia distribution, guest ticketing and ceremonial order of proceedings.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs md:text-sm text-emerald-200">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-emerald-400" /> {ceremonyDate}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-400" /> {ceremonyTime}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" /> Abaji, FCT Abuja</span>
              </div>
            </div>

            <div className="bg-emerald-900/60 backdrop-blur-md border border-emerald-500/30 rounded-xl p-5 text-center min-w-[220px]">
              <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-1">Presiding Officer</div>
              <div className="text-base font-bold text-white font-serif">{INSTITUTION_INFO.provost}</div>
              <div className="text-xs text-emerald-200 mt-0.5">Provost & Chief Academic Officer</div>
              <div className="mt-3 pt-3 border-t border-emerald-800/60 text-xs text-emerald-300/80">
                Accredited Study Centre: <span className="font-semibold text-white">{INSTITUTION_INFO.studyCentre}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Ceremony Overview', icon: Calendar },
            { id: 'clearance', label: 'Graduand Clearance Checker', icon: UserCheck },
            { id: 'gown', label: 'Academic Regalia & Gown Hiring', icon: GraduationCap },
            { id: 'programme', label: 'Order of Proceedings', icon: FileText },
            { id: 'awards', label: 'Honour Roll & Prizes', icon: Award }
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

        {/* Tab 1: Ceremony Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <GraduationCap className="w-5 h-5 text-emerald-600" /> Institutional Convocation Notice
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The Governing Council and Academic Board of <strong>{INSTITUTION_INFO.name}</strong> cordially announce the 2026 Convocation Ceremony for the conferment of IJMB Direct Entry A-Level Diplomas and Advanced Professional Certificates to successful graduands.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                    <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Ceremony Venue</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">Main College Auditorium</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{ceremonyVenue}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/40">
                    <div className="text-xs font-semibold text-teal-800 dark:text-teal-300 uppercase">Commencement & Seating</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">09:00 AM Prompt</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Doors close at 08:45 AM for Academic Procession</div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Mandatory Instructions for Graduands</h3>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-5">
                    <li>All graduands must be fully cleared by the Academic Registry, Bursary, and Library.</li>
                    <li>Academic regalia must be hired and worn throughout the procession and conferment ceremony.</li>
                    <li>Each graduand is entitled to admit a maximum of two (2) verified guests into the auditorium.</li>
                    <li>Graduands who fail to return their academic regalia on or before <strong>Friday, December 4, 2026</strong> will incur a mandatory late penalty fee of ₦1,000 per working day.</li>
                  </ul>
                </div>
              </div>

              {/* Security & Verification Callout */}
              <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    <ShieldCheck className="w-5 h-5" /> Cryptographic Credential Verification
                  </div>
                  <p className="text-xs text-slate-300 max-w-lg">
                    Employers, universities, and government parastatals can verify all diplomas and statement of results issued at convocation via the public portal.
                  </p>
                </div>
                <a
                  href="/verify"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow shrink-0"
                >
                  Verify Graduand Diploma
                </a>
              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <UserCheck className="w-4 h-4 text-emerald-600" /> Fast Clearance Lookup
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Verify your graduation clearance status, allocated seat number, and guest tickets immediately.
                </p>
                <form onSubmit={handleSearch} className="space-y-3">
                  <input
                    type="text"
                    value={searchMatric}
                    onChange={(e) => setSearchMatric(e.target.value)}
                    placeholder="e.g. AHCAS/IJMB/2025/001"
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Search className="w-3.5 h-3.5" /> Check My Clearance
                  </button>
                </form>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Try sample numbers: <span className="font-mono text-emerald-600 cursor-pointer" onClick={() => { setSearchMatric('AHCAS/IJMB/2025/001'); setActiveTab('clearance'); }}>AHCAS/IJMB/2025/001</span> or <span className="font-mono text-emerald-600 cursor-pointer" onClick={() => { setSearchMatric('AHCAS/IJMB/2025/042'); setActiveTab('clearance'); }}>AHCAS/IJMB/2025/042</span>
                </div>
              </div>

              {/* Ceremony Contacts */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Convocation Committee Secretariat</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                  <p><strong>Chairman:</strong> Dr. Muhammad Baba Suleiman (Provost)</p>
                  <p><strong>Secretary:</strong> Mall. Ibrahim Idris Gambo (Registrar)</p>
                  <p><strong>Desk Office:</strong> Registry Office, AHCAS Campus, Abaji</p>
                  <p><strong>Official Inquiries:</strong> {INSTITUTION_INFO.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Clearance Checker & Digital Pass */}
        {activeTab === 'clearance' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                <UserCheck className="w-5 h-5 text-emerald-600" /> Graduand Graduation Eligibility & Clearance Status
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enter your matriculation number below to verify full clearance from Academic Registry, Bursary, Library, and Gown Hire office.
              </p>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchMatric}
                    onChange={(e) => setSearchMatric(e.target.value)}
                    placeholder="Enter Matriculation No (e.g. AHCAS/IJMB/2025/001)"
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" /> Verify Clearance
                </button>
              </form>
            </div>

            {searchInitiated && !graduandResult && (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/40">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Not Found</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1">
                  No graduand clearance record found for matriculation number <strong>"{searchMatric}"</strong>. Please verify your number or contact the Academic Registry at the College Campus in Abaji.
                </p>
              </div>
            )}

            {graduandResult && (
              <div className="space-y-6">
                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${graduandResult.academicClearance ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-rose-100 text-rose-700'}`}>
                      {graduandResult.academicClearance ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Academic Clearance</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {graduandResult.academicClearance ? 'Approved' : 'Pending'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${graduandResult.bursaryClearance ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'}`}>
                      {graduandResult.bursaryClearance ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Bursary Clearance</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {graduandResult.bursaryClearance ? 'Tuition Paid / Nil Liability' : 'Outstanding Dues'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${graduandResult.libraryClearance ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-100 text-amber-700'}`}>
                      {graduandResult.libraryClearance ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Library Clearance</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {graduandResult.libraryClearance ? 'Cleared (0 Overdue)' : 'Books Outstanding'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${graduandResult.gownStatus === 'Cleared' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'}`}>
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Academic Regalia</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {graduandResult.gownStatus}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clearance Certificate & Invitation Pass */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-600/30 dark:border-emerald-500/30 p-8 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
                        Official Digital Convocation Pass
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-serif mt-1">
                        {graduandResult.fullName}
                      </h3>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                        Matriculation No: <span className="text-slate-900 dark:text-white font-bold">{graduandResult.matricNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Pass
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-6">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Conferred Qualification</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">{graduandResult.programme}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Academic Classification</div>
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">{graduandResult.classification}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Allocated Auditorium Seat</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 font-mono">{graduandResult.seatNumber}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Authorized Guest Pass Quota</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">{graduandResult.guestTickets} Guests Included</div>
                    </div>
                  </div>

                  {/* Resolution if Pending Bursary */}
                  {!graduandResult.bursaryClearance && (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600" /> Outstanding Convocation Gown & Clearance Dues (₦10,000)
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          Complete your academic regalia deposit fee of ₦10,000 to finalize bursary clearance and generate your auditorium pass.
                        </p>
                      </div>
                      <button
                        onClick={handlePayGownFee}
                        disabled={gownPaying}
                        className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-all shrink-0 flex items-center gap-2"
                      >
                        {gownPaying ? 'Processing...' : 'Settle Regalia Fee Now'}
                      </button>
                    </div>
                  )}

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-10 h-10 text-emerald-600" />
                      <div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200">REF: {graduandResult.gownReference || 'PENDING-CLEARANCE'}</div>
                        <div>Scan at Auditorium Entrance for Security Admittance</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div>Registrar & Academic Secretariat</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{INSTITUTION_INFO.registrar}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Academic Regalia & Gown Hiring */}
        {activeTab === 'gown' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                <GraduationCap className="w-5 h-5 text-emerald-600" /> Academic Regalia Hiring & Return Policy
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                In line with the Academic Regulations of {INSTITUTION_INFO.name}, all graduating candidates are required to procure and be robed in the prescribed institutional academic regalia comprising the College Gown, Silk Faculty Hood, and Mortarboard Cap.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Gown Hiring Fee</div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">₦10,000</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Includes ₦3,000 refundable caution deposit payable upon prompt return of unblemished regalia.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Collection Period</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">Nov 23 – Nov 27, 2026</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    09:00 AM – 04:00 PM daily at the College Central Stores, JSS Agyana Road Study Centre, Abaji.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Return Deadline</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">Friday, Dec 4, 2026</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Late returns incur a penalty surcharge of ₦1,000 per business day. Unreturned gowns result in transcript withholding.
                  </p>
                </div>
              </div>

              {/* Regalia Colours */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Approved Discipline Hood Colours</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Emerald Green Hood</div>
                      <div className="text-slate-500 dark:text-slate-400">IJMB Science & Health Direct Entry</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40">
                    <div className="w-5 h-5 rounded-full bg-blue-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Royal Blue Hood</div>
                      <div className="text-slate-500 dark:text-slate-400">IJMB Management & Social Sciences</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                    <div className="w-5 h-5 rounded-full bg-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Gold & Crimson Hood</div>
                      <div className="text-slate-500 dark:text-slate-400">IJMB Arts & Humanities / Law Direct Entry</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Order of Proceedings */}
        {activeTab === 'programme' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600">Official Programme</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif mt-1">
                Order of Ceremonial Proceedings
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Saturday, November 28, 2026 • Main Auditorium, Abaji Study Centre
              </p>
            </div>

            <div className="space-y-4">
              {[
                { time: '08:30 AM', event: 'Arrival and Seating of Graduands and Invited Guests', lead: 'Ceremonial Ushers' },
                { time: '08:50 AM', event: 'Academic Procession forms outside the Central Library', lead: 'College Marshal' },
                { time: '09:00 AM', event: 'Academic Procession enters the Convocation Auditorium', lead: 'Academic Staff, Registrar & Provost' },
                { time: '09:15 AM', event: 'National Anthem and Opening College Prayer', lead: 'Director of Student Affairs' },
                { time: '09:25 AM', event: 'Registrar formally opens the Convocation Congregation', lead: INSTITUTION_INFO.registrar },
                { time: '09:35 AM', event: 'Convocation Address by the Provost', lead: `${INSTITUTION_INFO.provost} (Provost)` },
                { time: '10:05 AM', event: 'Convocation Keynote Lecture: "The Role of Advanced Direct Entry in Bridging Tertiary Education Gaps in Northern Nigeria"', lead: 'Distinguished Guest Lecturer' },
                { time: '10:45 AM', event: 'Presentation of Graduands and Conferment of IJMB Direct Entry A-Level Diplomas', lead: 'Deans of Faculties & Academic Registry' },
                { time: '11:30 AM', event: 'Presentation of College Prizes and Merit Awards', lead: 'Chairman of Governing Council' },
                { time: '11:55 AM', event: 'Valedictory Address by the Overall Best Graduating Student', lead: 'Zainab Aminu Ibrahim (15 Points IJMB Science)' },
                { time: '12:15 PM', event: 'Registrar dissolves the Convocation Congregation', lead: INSTITUTION_INFO.registrar },
                { time: '12:25 PM', event: 'Academic Recession and Commemorative Photo Sessions', lead: 'College Marshal' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start gap-4 p-3.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                  <div className="w-24 shrink-0 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800/40 text-center">
                    {item.time}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.event}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Officiating: <span className="font-medium text-slate-700 dark:text-slate-300">{item.lead}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Honour Roll & Prizes */}
        {activeTab === 'awards' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                <Award className="w-5 h-5 text-amber-500" /> Convocation Merit Awards & Roll of Honour
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Recognizing distinguished academic performance, exemplary character, and scholarly dedication in the 2025/2026 IJMB & Diploma academic session.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100/40 dark:from-amber-950/30 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-700/50 space-y-3 relative shadow-sm">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-extrabold uppercase">
                    <Award className="w-3.5 h-3.5" /> Provost's Gold Medal
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                    Overall Best Graduating Student
                  </h3>
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    Zainab Aminu Ibrahim
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    IJMB Science Track • <strong>15 Points (Maximum Score)</strong> in Physics, Chemistry & Biology. Admitted into MBBS Direct Entry.
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-50 to-blue-100/40 dark:from-blue-950/30 dark:to-slate-900 border border-blue-200 dark:border-blue-800/50 space-y-3 relative shadow-sm">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-800 dark:text-blue-300 text-xs font-extrabold uppercase">
                    <Award className="w-3.5 h-3.5" /> Dean's Prize
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                    Faculty of Management & Social Sciences
                  </h3>
                  <div className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    Yusuf Abubakar Sadiq
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    IJMB Management Track • <strong>14 Points</strong> with Distinction in Economics, Business Management & Accounting.
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-b from-teal-50 to-teal-100/40 dark:from-teal-950/30 dark:to-slate-900 border border-teal-200 dark:border-teal-800/50 space-y-3 relative shadow-sm">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-800 dark:text-teal-300 text-xs font-extrabold uppercase">
                    <Award className="w-3.5 h-3.5" /> Dean's Prize
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                    Faculty of Arts & Humanities (Law Track)
                  </h3>
                  <div className="text-sm font-bold text-teal-700 dark:text-teal-400">
                    Fatima Mohammed Kabir
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    IJMB Arts Track • <strong>13 Points</strong> with Distinction in Literature in English, Government & Islamic Studies.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};
export default ConvocationPortal;
