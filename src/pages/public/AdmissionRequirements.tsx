import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IJMB_SUBJECT_COMBINATIONS,
  UNIVERSITY_CUTOFF_POINTS,
  MANDATORY_STUDENT_DOCUMENTS,
  TUITION_SCHEDULE,
  INSTITUTION_INFO
} from '../../data/ijmbData';
import {
  CheckCircle2,
  Search,
  BookOpen,
  Award,
  CreditCard,
  FileText,
  AlertCircle,
  FolderCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const AdmissionRequirements: React.FC = () => {
  const [subSearch, setSubSearch] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'combinations' | 'cutoffs' | 'documents' | 'tuition'>('combinations');

  const filteredCombinations = IJMB_SUBJECT_COMBINATIONS.filter(item => {
    if (!subSearch) return true;
    const q = subSearch.toLowerCase();
    return (
      item.code.toLowerCase().includes(q) ||
      item.subjects.toLowerCase().includes(q) ||
      item.possibleCourses.toLowerCase().includes(q)
    );
  });

  const facultiesList = ['All', ...Array.from(new Set(UNIVERSITY_CUTOFF_POINTS.map(u => u.faculty)))];

  const filteredCutoffs = UNIVERSITY_CUTOFF_POINTS.filter(u => {
    if (facultyFilter === 'All') return true;
    return u.faculty === facultyFilter;
  });

  return (
    <div className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black text-[#006B35] dark:text-emerald-400 uppercase tracking-wider">
              Statutory Admissions Manual
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-[#D4A62A] font-bold">Code: {INSTITUTION_INFO.documentCode}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
            Entry Qualifications, Combinations & Cut-Off Points
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl">
            Official guidelines approved by the Academic Board in alignment with Ahmadu Bello University (ABU) and the Joint Admissions and Matriculation Board (JAMB).
          </p>
        </div>

        {/* Core Entry Policy Box */}
        <div className="bg-[#F8FAFC] dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-[#006B35] rounded-xl">
                <Award size={20} />
              </div>
              <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                General Entry Qualification
              </h2>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#006B35] shrink-0 mt-0.5" />
                <span>Candidates must possess a minimum of <strong>five (5) credits at O-Levels</strong> (3 basic subjects plus Mathematics and English) from WAEC, NECO, or NABTEB in not more than two (2) sittings.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#006B35] shrink-0 mt-0.5" />
                <span><strong>Educationally Less Developed States (ELDS) Policy:</strong> Deficiency is allowed in either Mathematics for Arts candidates or English for Science candidates (and not in both subjects). This deficiency must be remedied before the completion of the IJMB programme.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#006B35] shrink-0 mt-0.5" />
                <span>Candidates admitted with two (2) O-Level sittings must have five (5) credits before final registration.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 md:pl-8 pt-6 md:pt-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 dark:bg-amber-950 text-[#D4A62A] rounded-xl">
                <CreditCard size={20} />
              </div>
              <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                Official Tuition & Fee Schedule
              </h2>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="font-medium text-slate-700 dark:text-slate-300">1st Semester (First Installment):</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">₦{TUITION_SCHEDULE.ijmb.firstInstallment.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="font-medium text-slate-700 dark:text-slate-300">2nd Semester (Third Installment):</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">₦{TUITION_SCHEDULE.ijmb.secondInstallment.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 flex justify-between items-center font-bold">
                <span className="text-[#006B35] dark:text-emerald-300">One-Time Full Payment:</span>
                <span className="font-mono text-[#006B35] dark:text-emerald-300">₦{TUITION_SCHEDULE.ijmb.oneTimePayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>Application Form Fee: <strong>₦10,500</strong></span>
                <span>Collection of IJMB Result: <strong>₦17,000</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('combinations')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'combinations'
                ? 'bg-[#006B35] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Approved Subject Combinations (Codes 001 - 073)
          </button>
          <button
            onClick={() => setActiveTab('cutoffs')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'cutoffs'
                ? 'bg-[#006B35] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            University Required Points by Faculty
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'documents'
                ? 'bg-[#006B35] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            12 Mandatory Documentation Files
          </button>
          <button
            onClick={() => setActiveTab('tuition')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'tuition'
                ? 'bg-[#D4A62A] text-black shadow-md font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Citi Poly Affiliated Tuition Breakdown
          </button>
        </div>

        {/* Tab 1: 73 Approved Subject Combinations */}
        {activeTab === 'combinations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <p className="text-xs text-slate-500">
                Displaying <strong>{filteredCombinations.length}</strong> approved IJMB combinations arrived at after due consultation with JAMB Direct Entry brochure.
              </p>
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by code, subjects, or course..."
                  value={subSearch}
                  onChange={e => setSubSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto bg-[#F8FAFC] dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] bg-slate-100 dark:bg-slate-800/80">
                    <th className="py-3 px-4 font-black">Code</th>
                    <th className="py-3 px-4 font-black">Subjects Combination (A-Level)</th>
                    <th className="py-3 px-4 font-black">Possible Undergraduate Degrees (200L Direct Entry)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredCombinations.map(combo => (
                    <tr key={combo.code} className="hover:bg-white dark:hover:bg-slate-700/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#006B35] dark:text-emerald-400 whitespace-nowrap">
                        {combo.code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {combo.subjects}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                        {combo.possibleCourses}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Cut-Off Points */}
        {activeTab === 'cutoffs' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-2">Filter by Faculty:</span>
              {facultiesList.map((fac, idx) => (
                <button
                  key={idx}
                  onClick={() => setFacultyFilter(fac)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    facultyFilter === fac
                      ? 'bg-[#006B35] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {fac}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCutoffs.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#F8FAFC] dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-xs"
                >
                  <div>
                    <span className="text-[10px] text-[#006B35] dark:text-emerald-400 font-bold uppercase block">
                      {item.faculty}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      {item.course}
                    </h4>
                  </div>
                  <div className="px-3 py-1.5 bg-[#D4A62A] text-black font-mono font-black text-xs rounded-xl shadow-xs">
                    {item.points} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: 12 Mandatory Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200">
              <strong>Student Documentation Policy (Manual Page 15-16):</strong> Every registered candidate must maintain a physical file and digital backup record containing a minimum of 12 statutory documents prior to external examination clearance.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {MANDATORY_STUDENT_DOCUMENTS.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#F8FAFC] dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-[#006B35] dark:text-emerald-400 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {doc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Citi Polytechnic Affiliation */}
        {activeTab === 'tuition' && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300 text-xs text-amber-900 dark:text-amber-200">
              <strong>National Diploma & Higher National Diploma in Affiliation with Citi Polytechnic Abuja:</strong> All fees include institutional registration fees as stipulated in the official schedule.
            </div>

            <div className="overflow-x-auto bg-[#F8FAFC] dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] bg-slate-100 dark:bg-slate-800/80">
                    <th className="py-3 px-4 font-black">Programme</th>
                    <th className="py-3 px-4 font-black">Study Mode</th>
                    <th className="py-3 px-4 font-black">Approved Tuition Fee</th>
                    <th className="py-3 px-4 font-black">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {TUITION_SCHEDULE.citiPolytechnic.map((cp, idx) => (
                    <tr key={idx} className="hover:bg-white dark:hover:bg-slate-700/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {cp.programme}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#006B35] dark:text-emerald-400">
                        {cp.mode}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                        ₦{cp.fee.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {cp.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-center">
          <Link
            to="/apply/register"
            className="px-8 py-3.5 bg-[#006B35] hover:bg-[#004D26] text-white font-black rounded-xl text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2"
          >
            <span>Proceed to Online Application (₦10,500)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};
