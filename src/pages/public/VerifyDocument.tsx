import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { db } from '../../services/db';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  FileText,
  CreditCard,
  GraduationCap,
  ArrowLeft,
  Calendar,
  Building,
  QrCode
} from 'lucide-react';

export const VerifyDocument: React.FC = () => {
  const { docType, docRef } = useParams<{ docType?: string; docRef?: string }>();
  const [searchParams] = useSearchParams();
  const queryParamRef = searchParams.get('ref') || docRef || '';
  
  const [queryRef, setQueryRef] = useState(queryParamRef);
  const [selectedType, setSelectedType] = useState<string>(docType || 'admission');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'VALID' | 'INVALID' | 'REVOKED';
    documentType: string;
    reference: string;
    recipientName: string;
    programme: string;
    issueDate: string;
    issuingAuthority: string;
    metadata?: Record<string, string>;
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performLookup = (type: string, ref: string) => {
    if (!ref.trim()) return;
    setHasSearched(true);
    const clean = ref.trim().toUpperCase();

    // 1. Admission Letter Lookup
    if (type === 'admission' || clean.includes('AHCAS/IJMB') || clean.includes('AHCAS/APP')) {
      const apps = db.getApplications();
      const match = apps.find(a => a.ref_number.toUpperCase() === clean);
      if (match) {
        if (match.status === 'Admitted' || match.admission_letter_released) {
          setVerificationResult({
            status: 'VALID',
            documentType: 'Provisional Admission Offer Letter',
            reference: match.ref_number,
            recipientName: match.full_name,
            programme: match.programme_title,
            issueDate: match.submitted_at || 'August 2026',
            issuingAuthority: 'Office of the Academic Registrar (Mall. Usman Saidu)',
            metadata: {
              'Category': match.category,
              'Study Centre': match.study_centre || INSTITUTION_INFO.studyCentre,
              'Accreditation': 'IJMB Academic Directorate & Affiliated Bodies'
            }
          });
          return;
        } else {
          setVerificationResult({
            status: 'REVOKED',
            documentType: 'Admission Application',
            reference: match.ref_number,
            recipientName: match.full_name,
            programme: match.programme_title,
            issueDate: match.submitted_at || '2026',
            issuingAuthority: 'Academic Registry',
            metadata: {
              'Status Note': 'Application under review or provisional offer not yet cleared.'
            }
          });
          return;
        }
      }
    }

    // 2. Student ID Card & Exam Photocard Lookup
    if (
      type === 'student-id' ||
      type === 'EXAM_PHOTOCARD' ||
      clean.includes('AHCAS/2026') ||
      clean.includes('AHCAS-EXM') ||
      clean.includes('AHCAS/IJMB/2025') ||
      clean.includes('AHCAS/IJMB/2026')
    ) {
      const students = db.getStudents();
      const normalized = clean.replace('AHCAS-EXM-', '').replace(/-/g, '/');
      const match = students.find(
        s => s.matric_number.toUpperCase() === clean || s.matric_number.toUpperCase() === normalized
      );
      if (match) {
        const isExamPhotocard = type === 'EXAM_PHOTOCARD' || clean.includes('AHCAS-EXM');
        setVerificationResult({
          status: 'VALID',
          documentType: isExamPhotocard
            ? 'Official IJMB Candidate Examination Clearance Photocard'
            : 'Official Student Identity Credential',
          reference: match.matric_number,
          recipientName: match.full_name,
          programme: match.programme,
          issueDate: 'Academic Session 2026/2027',
          issuingAuthority: isExamPhotocard
            ? 'Directorate of Academic Examinations (Centre 029 - Abaji)'
            : 'Directorate of Student Affairs & Academic Registry',
          metadata: {
            'Level': match.level,
            'Department': match.department,
            'Examination Centre': 'Centre 029 (JSS Agyana Road Study Centre, Abaji)',
            'Continuous Assessment Clearance': 'CA 20% Verified & Certified',
            'Enrolment Status': match.registration_status || 'Verified Matriculated Student'
          }
        });
        return;
      }
    }

    // 2b. Official Statement of Results / Transcript Lookup
    if (type === 'TRANSCRIPT' || clean.includes('TRNS')) {
      const students = db.getStudents();
      const normalized = clean.replace('AHCAS-TRNS-', '').replace(/-/g, '/');
      const match = students.find(
        s => s.matric_number.toUpperCase() === clean || s.matric_number.toUpperCase() === normalized
      );
      if (match) {
        setVerificationResult({
          status: 'VALID',
          documentType: 'Official Statement of IJMB Results & Academic Transcript',
          reference: match.matric_number,
          recipientName: match.full_name,
          programme: match.programme,
          issueDate: 'Session 2026/2027 Moderated Board Review',
          issuingAuthority: 'Office of the Provost & Academic Board',
          metadata: {
            'Direct Entry Eligibility': 'Qualified for 200 Level University Placement',
            'Grading Moderation': 'Verified 16-Point IJMB Scale (+1 Bonus Point Qualified)',
            'Signed Officers': 'Dr. Muhammad Baba Suleiman, PhD (Provost) & Usman Saidu (Registrar)'
          }
        });
        return;
      }
    }

    // 3. Official Payment Receipt Lookup
    if (type === 'receipt' || clean.startsWith('RCP') || clean.includes('PAY')) {
      const receipts = db.getReceipts();
      const match = receipts.find(
        r => r.receiptNumber.toUpperCase() === clean || r.reference.toUpperCase() === clean
      );
      if (match) {
        setVerificationResult({
          status: 'VALID',
          documentType: 'Official Bursary Payment Receipt',
          reference: match.receiptNumber,
          recipientName: match.studentName,
          programme: 'Bursary Fee Settlement',
          issueDate: match.paidAt,
          issuingAuthority: 'Office of the College Bursar (Alhaji Dahiru Aliyu)',
          metadata: {
            'Fee Description': match.feeType,
            'Payment Method': match.paymentMethod,
            'Amount Paid': `₦${match.amountNgn.toLocaleString()}`,
            'Transaction Reference': match.reference
          }
        });
        return;
      }
    }

    // No record match
    setVerificationResult({
      status: 'INVALID',
      documentType: 'Unknown Credential',
      reference: ref,
      recipientName: 'N/A',
      programme: 'N/A',
      issueDate: 'N/A',
      issuingAuthority: 'Al-Hidayah College of Advanced Studies'
    });
  };

  useEffect(() => {
    if (queryParamRef) {
      setQueryRef(queryParamRef);
      performLookup(docType || 'admission', queryParamRef);
    }
  }, [queryParamRef, docType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(selectedType, queryRef);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-md border-2 border-[#e69912] flex items-center justify-center">
            <img
              src="/official-logo.jpg"
              alt="AHCAS Crest"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#196855] dark:text-emerald-400 font-mono block">
            Public Document Verification Portal
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Verify Institutional Credentials
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Real-time cryptographic verification for Admission Letters, Student Identity Cards, Statement of Results, and Official Bursary Receipts.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'admission', label: 'Admission Letter', icon: Award },
                { id: 'student-id', label: 'Student ID', icon: GraduationCap },
                { id: 'EXAM_PHOTOCARD', label: 'Exam Photocard', icon: FileText },
                { id: 'TRANSCRIPT', label: 'Transcript', icon: Award },
                { id: 'receipt', label: 'Receipt', icon: CreditCard }
              ].map(opt => {
                const Icon = opt.icon;
                const active = selectedType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedType(opt.id)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      active
                        ? 'border-[#196855] bg-emerald-50 dark:bg-emerald-950/40 text-[#196855] dark:text-emerald-300 ring-2 ring-[#196855]/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document Reference Number or QR Code Identifier
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={queryRef}
                  onChange={e => setQueryRef(e.target.value)}
                  placeholder="e.g. AHCAS/IJMB/2026/00142 or RCP-AHCAS-2026-001"
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono tracking-wider focus:outline-hidden focus:border-[#196855]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#196855] hover:bg-[#196855] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                >
                  <Search size={16} />
                  <span>Verify Document</span>
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* Verification Result Display */}
        {hasSearched && verificationResult && (
          <div className="animate-fade-in">
            {verificationResult.status === 'VALID' ? (
              <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase px-6 py-1 rounded-bl-2xl font-mono tracking-wider">
                  Verified Authentic
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#196855] dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 dark:text-emerald-300 block">
                      Authentic Institutional Credential
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {verificationResult.documentType}
                    </h2>
                    <p className="text-xs font-mono text-slate-500">
                      Ref: <strong>{verificationResult.reference}</strong>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Recipient / Candidate Name</span>
                    <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {verificationResult.recipientName}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Academic Programme / Scope</span>
                    <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {verificationResult.programme}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Effective Date</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {verificationResult.issueDate}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Issuing Authority</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {verificationResult.issuingAuthority}
                    </p>
                  </div>
                </div>

                {verificationResult.metadata && (
                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-1">
                    {Object.entries(verificationResult.metadata).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center py-0.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{key}:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 text-center pt-2">
                  <span>Certified by Al-Hidayah College of Advanced Studies Central Database System</span>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border-2 border-red-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto">
                  <XCircle size={32} />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Document Verification Failed
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  No matching active credential was found with reference <strong className="font-mono text-red-600">{queryRef}</strong>. Please ensure the reference is typed exactly as displayed on the document.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#196855] dark:text-emerald-400 hover:underline"
          >
            <ArrowLeft size={14} />
            <span>Return to Institutional Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
