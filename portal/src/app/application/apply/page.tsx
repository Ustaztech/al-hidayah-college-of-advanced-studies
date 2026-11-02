'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Phone,
  Users,
  GraduationCap,
  BookOpen,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Trash2,
  Plus,
  ArrowRight,
  Info,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Application, AcademicQualification, ApplicationGuardian, AdmissionProgramme } from '@/lib/types';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

const COMMON_SUBJECTS = [
  'English Language',
  'General Mathematics',
  'Biology',
  'Chemistry',
  'Physics',
  'Agricultural Science',
  'Economics',
  'Literature in English',
  'Government',
  'Civic Education',
  'Geography',
  'Financial Accounting',
  'Commerce',
  'Islamic Studies',
  'Christian Religious Studies',
  'Further Mathematics',
  'Computer Studies',
  'Hausa',
  'Arabic'
];

const OLEVEL_GRADES = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'];

export default function ApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Application Data States
  const [application, setApplication] = useState<Application | null>(null);
  const [programmes, setProgrammes] = useState<AdmissionProgramme[]>([]);

  // Step 1: Personal
  const [personal, setPersonal] = useState({
    surname: '',
    first_name: '',
    middle_name: '',
    date_of_birth: '2005-01-01',
    gender: 'male',
    marital_status: 'Single',
    nationality: 'Nigerian',
    state_of_origin: '',
    lga_of_origin: '',
    passport_url: ''
  });

  // Step 2: Contact
  const [contact, setContact] = useState({
    phone_number: '',
    alternative_phone: '',
    residential_address: '',
    state_of_residence: '',
    lga_of_residence: '',
    city: ''
  });

  // Step 3: Guardians
  const [guardians, setGuardians] = useState<ApplicationGuardian[]>([
    {
      id: 'g-1',
      application_id: '',
      full_name: '',
      relationship: 'Father',
      phone_number: '',
      email: '',
      address: ''
    }
  ]);

  // Step 4: Academic Qualifications
  const [qualifications, setQualifications] = useState<AcademicQualification[]>([
    {
      id: 'qual-1',
      application_id: '',
      exam_name: 'WAEC (WASSCE)',
      exam_year: '2025',
      exam_number: '',
      exam_sitting: '1st Sitting',
      centre_number: '',
      subjects: [
        { id: 'sub-1', qualification_id: 'qual-1', subject: 'English Language', grade: 'C6' },
        { id: 'sub-2', qualification_id: 'qual-1', subject: 'General Mathematics', grade: 'C5' },
        { id: 'sub-3', qualification_id: 'qual-1', subject: 'Biology', grade: 'B3' },
        { id: 'sub-4', qualification_id: 'qual-1', subject: 'Chemistry', grade: 'B3' },
        { id: 'sub-5', qualification_id: 'qual-1', subject: 'Physics', grade: 'C4' }
      ]
    }
  ]);

  // Step 5: Selected Programme ID
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>('');

  // Step 6: Documents
  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: { name: string; path: string; size: number } }>({});
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);

  // Load Application State
  useEffect(() => {
    async function loadCurrentApplication() {
      try {
        setLoading(true);
        const res = await fetch('/api/application/current');
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/application/login');
            return;
          }
          throw new Error('Failed to load application');
        }

        const data = await res.json();
        if (data.success && data.application) {
          const app: Application = data.application;
          setApplication(app);

          if (app.status === 'submitted') {
            setIsLocked(true);
          }

          if (app.personal_details) {
            setPersonal({
              surname: app.personal_details.surname || '',
              first_name: app.personal_details.first_name || '',
              middle_name: app.personal_details.middle_name || '',
              date_of_birth: app.personal_details.date_of_birth || '2005-01-01',
              gender: app.personal_details.gender || 'male',
              marital_status: app.personal_details.marital_status || 'Single',
              nationality: app.personal_details.nationality || 'Nigerian',
              state_of_origin: app.personal_details.state_of_origin || '',
              lga_of_origin: app.personal_details.lga_of_origin || '',
              passport_url: app.personal_details.passport_url || ''
            });
          }

          if (app.contact_details) {
            setContact({
              phone_number: app.contact_details.phone_number || '',
              alternative_phone: app.contact_details.alternative_phone || '',
              residential_address: app.contact_details.residential_address || '',
              state_of_residence: app.contact_details.state_of_residence || '',
              lga_of_residence: app.contact_details.lga_of_residence || '',
              city: app.contact_details.city || ''
            });
          }

          if (app.guardians && app.guardians.length > 0) {
            setGuardians(app.guardians);
          }

          if (app.qualifications && app.qualifications.length > 0) {
            setQualifications(app.qualifications);
          }

          if (app.admission_programme_id) {
            setSelectedProgrammeId(app.admission_programme_id);
          }

          if (app.documents && app.documents.length > 0) {
            const docMap: { [key: string]: { name: string; path: string; size: number } } = {};
            app.documents.forEach(d => {
              docMap[d.document_type] = {
                name: d.file_name,
                path: d.storage_path,
                size: d.file_size
              };
            });
            setUploadedDocs(docMap);
          }
        }

        // Fetch Programmes
        const progRes = await fetch('/api/application/programmes');
        if (progRes.ok) {
          const progData = await progRes.json();
          if (progData.success) {
            setProgrammes(progData.programmes || []);
          }
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error initializing application portal.');
      } finally {
        setLoading(false);
      }
    }

    loadCurrentApplication();
  }, [router]);

  // Save current step data to server
  const saveStepData = async (stepNumber: number, silent = false): Promise<boolean> => {
    if (isLocked) return true;
    try {
      setSaving(true);
      setErrorMessage(null);
      if (!silent) setSaveMessage(null);

      let stepPayload: { step: string; data: any };

      switch (stepNumber) {
        case 1:
          stepPayload = { step: 'personal', data: personal };
          break;
        case 2:
          stepPayload = { step: 'contact', data: contact };
          break;
        case 3:
          stepPayload = { step: 'guardians', data: guardians };
          break;
        case 4:
          stepPayload = { step: 'qualifications', data: qualifications };
          break;
        case 5:
          stepPayload = { step: 'programme', data: { admission_programme_id: selectedProgrammeId } };
          break;
        default:
          setSaving(false);
          return true;
      }

      const res = await fetch('/api/application/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stepPayload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save progress.');
      }

      setApplication(data.application);
      if (!silent) {
        setSaveMessage('Section saved successfully.');
        setTimeout(() => setSaveMessage(null), 3000);
      }
      return true;
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save section.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    const ok = await saveStepData(currentStep, true);
    if (ok) {
      if (currentStep < 6) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/application/review');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper for adding/editing O-Level Subjects
  const addSubject = (qIndex: number) => {
    const newQuals = [...qualifications];
    const currentSubs = newQuals[qIndex].subjects || [];
    newQuals[qIndex].subjects = [
      ...currentSubs,
      {
        id: `sub-${Date.now()}`,
        qualification_id: newQuals[qIndex].id,
        subject: COMMON_SUBJECTS[0],
        grade: 'C6'
      }
    ];
    setQualifications(newQuals);
  };

  const removeSubject = (qIndex: number, subIndex: number) => {
    const newQuals = [...qualifications];
    if ((newQuals[qIndex].subjects?.length || 0) <= 5) {
      alert('A minimum of 5 subjects is recommended for admission processing.');
    }
    newQuals[qIndex].subjects = (newQuals[qIndex].subjects || []).filter((_, idx) => idx !== subIndex);
    setQualifications(newQuals);
  };

  const updateSubject = (qIndex: number, subIndex: number, field: 'subject' | 'grade', value: string) => {
    const newQuals = [...qualifications];
    const subs = [...(newQuals[qIndex].subjects || [])];
    subs[subIndex] = { ...subs[subIndex], [field]: value };
    newQuals[qIndex].subjects = subs;
    setQualifications(newQuals);
  };

  // Helper for Document Upload simulation
  const handleFileUpload = async (docType: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB maximum allowed.');
      return;
    }

    try {
      setUploadingDocType(docType);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append('document_type', docType);
      formData.append('file', file);

      const res = await fetch('/api/application/documents/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload document.');
      }

      setUploadedDocs(prev => ({
        ...prev,
        [docType]: {
          name: data.document.file_name,
          path: data.document.storage_path,
          size: data.document.file_size
        }
      }));

      if (docType === 'passport_photo') {
        setPersonal(prev => ({ ...prev, passport_url: data.document.storage_path }));
      }

      setSaveMessage('Document uploaded and verified.');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Upload error');
    } finally {
      setUploadingDocType(null);
    }
  };

  const handleFileRemove = async (docType: string) => {
    try {
      setUploadingDocType(docType);
      const res = await fetch(`/api/application/documents/${docType}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to remove document.');
      }

      setUploadedDocs(prev => {
        const copy = { ...prev };
        delete copy[docType];
        return copy;
      });

      if (docType === 'passport_photo') {
        setPersonal(prev => ({ ...prev, passport_url: '' }));
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error removing document');
    } finally {
      setUploadingDocType(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#196855] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">Loading your application file...</p>
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Personal Information', icon: User },
    { num: 2, label: 'Contact Details', icon: Phone },
    { num: 3, label: 'Parent / Guardian', icon: Users },
    { num: 4, label: 'Academic Qualifications', icon: GraduationCap },
    { num: 5, label: 'Programme Selection', icon: BookOpen },
    { num: 6, label: 'Document Upload', icon: FileCheck }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Banner & Header */}
      <div className="bg-[#196855] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold leading-tight">AL-HIDAYAH COLLEGE OF ADVANCED STUDIES</h1>
              <p className="text-xs text-emerald-100">Integrated Online Admission Application Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="text-xs bg-emerald-800/80 px-3 py-1.5 rounded-full border border-emerald-600 font-mono">
              App ID: {application?.application_number || 'AHCAS/APP/2026/00001'}
            </span>
            <Link
              href="/application/dashboard"
              className="text-xs font-medium text-emerald-100 hover:text-white underline underline-offset-4"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-6">
        {/* Application Submitted Alert Banner */}
        {isLocked && (
          <div className="mb-6 bg-emerald-50 border border-emerald-300 rounded-lg p-4 flex items-start gap-3 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-emerald-900">Application Submitted & Locked</h3>
              <p className="text-xs text-emerald-700 mt-1">
                Your application has already been formally submitted and is currently undergoing review. No further edits can be made.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href="/application/slip"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#196855] text-white text-xs font-semibold rounded hover:bg-emerald-800 transition"
                >
                  <FileCheck className="w-3.5 h-3.5" /> Download Application Slip
                </Link>
                <Link
                  href="/application/dashboard"
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Steps Navigation Bar */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Admission Registration Wizard
            </h2>
            <span className="text-xs font-bold text-[#196855]">
              Step {currentStep} of 6
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {stepsList.map(step => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    saveStepData(currentStep, true);
                    setCurrentStep(step.num);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#196855] text-white shadow-sm ring-2 ring-emerald-600/30'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      isActive
                        ? 'bg-white text-[#196855] font-bold'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPast ? '✓' : step.num}
                  </div>
                  <span className="truncate">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification Toasts */}
        {saveMessage && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-2.5 rounded-md flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Wizard Form Panels */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
          {/* STEP 1: PERSONAL INFORMATION */}
          {currentStep === 1 && (
            <div>
              <div className="border-b border-slate-200 pb-3 mb-6">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#196855]" /> Step 1: Personal Information
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ensure candidate names match exactly as stated on secondary school certificates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Surname (Family Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={personal.surname}
                    onChange={e => setPersonal({ ...personal, surname: e.target.value.toUpperCase() })}
                    placeholder="e.g. ABUBAKAR"
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={personal.first_name}
                    onChange={e => setPersonal({ ...personal, first_name: e.target.value.toUpperCase() })}
                    placeholder="e.g. FATIMA"
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Middle Name (Optional)
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={personal.middle_name}
                    onChange={e => setPersonal({ ...personal, middle_name: e.target.value.toUpperCase() })}
                    placeholder="e.g. BELLO"
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    disabled={isLocked}
                    value={personal.date_of_birth}
                    onChange={e => setPersonal({ ...personal, date_of_birth: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={isLocked}
                    value={personal.gender}
                    onChange={e => setPersonal({ ...personal, gender: e.target.value as any })}
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Marital Status
                  </label>
                  <select
                    disabled={isLocked}
                    value={personal.marital_status}
                    onChange={e => setPersonal({ ...personal, marital_status: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none bg-white"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={personal.nationality}
                    onChange={e => setPersonal({ ...personal, nationality: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State of Origin <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={isLocked}
                    value={personal.state_of_origin}
                    onChange={e => setPersonal({ ...personal, state_of_origin: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none bg-white"
                  >
                    <option value="">-- Select State --</option>
                    {NIGERIAN_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    LGA of Origin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={personal.lga_of_origin}
                    onChange={e => setPersonal({ ...personal, lga_of_origin: e.target.value })}
                    placeholder="e.g. Keffi, Lafia, Zaria..."
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CONTACT DETAILS */}
          {currentStep === 2 && (
            <div>
              <div className="border-b border-slate-200 pb-3 mb-6">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#196855]" /> Step 2: Contact Information
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ensure all telephone numbers and addresses are active for SMS admission notices.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    disabled={isLocked}
                    value={contact.phone_number}
                    onChange={e => setContact({ ...contact, phone_number: e.target.value })}
                    placeholder="e.g. 08012345678"
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alternative Phone Number
                  </label>
                  <input
                    type="tel"
                    disabled={isLocked}
                    value={contact.alternative_phone}
                    onChange={e => setContact({ ...contact, alternative_phone: e.target.value })}
                    placeholder="e.g. 08098765432"
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Permanent Residential Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    disabled={isLocked}
                    value={contact.residential_address}
                    onChange={e => setContact({ ...contact, residential_address: e.target.value })}
                    placeholder="Street number, layout, residential estate or quarters"
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State of Residence <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={isLocked}
                    value={contact.state_of_residence}
                    onChange={e => setContact({ ...contact, state_of_residence: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none bg-white"
                  >
                    <option value="">-- Select State --</option>
                    {NIGERIAN_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Town of Residence
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={contact.city}
                    onChange={e => setContact({ ...contact, city: e.target.value })}
                    placeholder="e.g. Keffi, Lafia, Abuja..."
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PARENT / GUARDIAN (NEXT OF KIN) */}
          {currentStep === 3 && (
            <div>
              <div className="border-b border-slate-200 pb-3 mb-6">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#196855]" /> Step 3: Parent / Guardian (Next of Kin)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Provide primary emergency contact and parent/sponsor details.
                </p>
              </div>

              {guardians.map((g, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name of Guardian / Next of Kin <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={isLocked}
                        value={g.full_name}
                        onChange={e => {
                          const copy = [...guardians];
                          copy[idx].full_name = e.target.value;
                          setGuardians(copy);
                        }}
                        placeholder="e.g. Alh. Abubakar Bello"
                        className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Relationship <span className="text-red-500">*</span>
                      </label>
                      <select
                        disabled={isLocked}
                        value={g.relationship}
                        onChange={e => {
                          const copy = [...guardians];
                          copy[idx].relationship = e.target.value;
                          setGuardians(copy);
                        }}
                        className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none bg-white"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        disabled={isLocked}
                        value={g.phone_number}
                        onChange={e => {
                          const copy = [...guardians];
                          copy[idx].phone_number = e.target.value;
                          setGuardians(copy);
                        }}
                        placeholder="e.g. 08031234567"
                        className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        disabled={isLocked}
                        value={g.email || ''}
                        onChange={e => {
                          const copy = [...guardians];
                          copy[idx].email = e.target.value;
                          setGuardians(copy);
                        }}
                        placeholder="e.g. parent@example.com"
                        className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none bg-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Residential Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={isLocked}
                        value={g.address}
                        onChange={e => {
                          const copy = [...guardians];
                          copy[idx].address = e.target.value;
                          setGuardians(copy);
                        }}
                        placeholder="House / Street Address of Guardian"
                        className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] focus:border-[#196855] outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: ACADEMIC QUALIFICATIONS */}
          {currentStep === 4 && (
            <div>
              <div className="border-b border-slate-200 pb-3 mb-6">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#196855]" /> Step 4: Academic Qualifications (O-Level)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Provide your O-Level examination results (minimum 5 subjects including English and Mathematics).
                </p>
              </div>

              {qualifications.map((q, qIdx) => (
                <div key={q.id || qIdx} className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Examination Body <span className="text-red-500">*</span>
                      </label>
                      <select
                        disabled={isLocked}
                        value={q.exam_name}
                        onChange={e => {
                          const copy = [...qualifications];
                          copy[qIdx].exam_name = e.target.value;
                          setQualifications(copy);
                        }}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] bg-white"
                      >
                        <option value="WAEC (WASSCE)">WAEC (WASSCE)</option>
                        <option value="NECO (SSCE)">NECO (SSCE)</option>
                        <option value="NABTEB">NABTEB</option>
                        <option value="NBAIS">NBAIS</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Exam Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={isLocked}
                        value={q.exam_year}
                        onChange={e => {
                          const copy = [...qualifications];
                          copy[qIdx].exam_year = e.target.value;
                          setQualifications(copy);
                        }}
                        placeholder="e.g. 2024"
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Exam Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={isLocked}
                        value={q.exam_number}
                        onChange={e => {
                          const copy = [...qualifications];
                          copy[qIdx].exam_number = e.target.value;
                          setQualifications(copy);
                        }}
                        placeholder="e.g. 4251023044"
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Sitting
                      </label>
                      <select
                        disabled={isLocked}
                        value={q.exam_sitting}
                        onChange={e => {
                          const copy = [...qualifications];
                          copy[qIdx].exam_sitting = e.target.value;
                          setQualifications(copy);
                        }}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#196855] bg-white"
                      >
                        <option value="1st Sitting">1st Sitting</option>
                        <option value="2nd Sitting">2nd Sitting</option>
                      </select>
                    </div>
                  </div>

                  {/* Subjects & Grades Grid */}
                  <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase">Subjects & Grades Entered</span>
                      {!isLocked && (
                        <button
                          type="button"
                          onClick={() => addSubject(qIdx)}
                          className="inline-flex items-center gap-1 text-xs text-[#196855] font-semibold hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Subject
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-slate-100">
                      {(q.subjects || []).map((sub, sIdx) => (
                        <div key={sub.id || sIdx} className="px-4 py-2 flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-400 w-6">{sIdx + 1}.</span>
                          <div className="flex-1">
                            <input
                              type="text"
                              disabled={isLocked}
                              list={`subjects-list-${qIdx}`}
                              value={sub.subject}
                              onChange={e => updateSubject(qIdx, sIdx, 'subject', e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded focus:border-[#196855] outline-none"
                              placeholder="Type or select subject..."
                            />
                            <datalist id={`subjects-list-${qIdx}`}>
                              {COMMON_SUBJECTS.map(s => (
                                <option key={s} value={s} />
                              ))}
                            </datalist>
                          </div>
                          <div className="w-28">
                            <select
                              disabled={isLocked}
                              value={sub.grade}
                              onChange={e => updateSubject(qIdx, sIdx, 'grade', e.target.value)}
                              className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded focus:border-[#196855] outline-none font-bold text-slate-700 bg-white"
                            >
                              {OLEVEL_GRADES.map(g => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                          </div>
                          {!isLocked && (
                            <button
                              type="button"
                              onClick={() => removeSubject(qIdx, sIdx)}
                              className="text-slate-400 hover:text-red-500 p-1 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: PROGRAMME SELECTION */}
          {currentStep === 5 && (
            <div>
              <div className="border-b border-slate-200 pb-3 mb-6">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#196855]" /> Step 5: Programme Selection
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose the approved academic course you wish to study at Al-Hidayah College of Advanced Studies.
                </p>
              </div>

              {programmes.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-lg">
                  <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-600">No active programmes currently available for admission.</p>
                  <p className="text-xs text-slate-400 mt-1">Please contact the College Academic Registrar.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {programmes.map(prog => {
                    const isSelected = selectedProgrammeId === prog.id;
                    const isExpired = new Date(prog.application_deadline) < new Date();
                    const isUnavailable = !prog.application_open || isExpired;

                    return (
                      <div
                        key={prog.id}
                        onClick={() => {
                          if (!isUnavailable && !isLocked) {
                            setSelectedProgrammeId(prog.id);
                          }
                        }}
                        className={`p-4 rounded-lg border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-[#196855] bg-emerald-50/60 ring-2 ring-emerald-600/20 shadow-sm'
                            : isUnavailable
                            ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="selectedProgramme"
                            disabled={isUnavailable || isLocked}
                            checked={isSelected}
                            onChange={() => setSelectedProgrammeId(prog.id)}
                            className="mt-1 h-4 w-4 text-[#196855] focus:ring-[#196855]"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              {prog.programme?.name || 'Academic Programme'}
                            </h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {prog.entry_requirements}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                                Duration: {prog.duration}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                                Deadline: {new Date(prog.application_deadline).toLocaleDateString()}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                                {prog.application_type?.name || 'Admission'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="shrink-0 self-end md:self-center">
                            <span className="text-xs bg-[#196855] text-white px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 6: DOCUMENT UPLOAD */}
          {currentStep === 6 && (
            <div>
              <div className="border-b border-slate-200 pb-3 mb-6">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#196855]" /> Step 6: Academic Document Upload
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload clear copies in JPG, PNG, or PDF format (Max 5MB each). Passport photo and O-Level statement are mandatory.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    type: 'passport_photo',
                    title: 'Passport Photograph',
                    desc: 'Clear, front-facing colour passport with light background (Mandatory)',
                    required: true
                  },
                  {
                    type: 'olevel_result',
                    title: 'O-Level Result / Certificate',
                    desc: 'WAEC, NECO or NABTEB statement of results printout (Mandatory)',
                    required: true
                  },
                  {
                    type: 'birth_certificate',
                    title: 'Birth Certificate / Declaration of Age',
                    desc: 'Issued by National Population Commission (NPC) or court declaration',
                    required: false
                  },
                  {
                    type: 'state_origin',
                    title: 'Certificate of State of Origin',
                    desc: 'Indigene letter signed by designated Local Government Area authority',
                    required: false
                  }
                ].map(item => {
                  const doc = uploadedDocs[item.type];
                  const isUploading = uploadingDocType === item.type;

                  return (
                    <div
                      key={item.type}
                      className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800">
                            {item.title} {item.required && <span className="text-red-500">*</span>}
                          </h4>
                          {doc ? (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Uploaded
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Not Uploaded</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200">
                        {doc ? (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-700 font-mono truncate max-w-[200px]">
                              {doc.name}
                            </span>
                            {!isLocked && (
                              <button
                                type="button"
                                disabled={isUploading}
                                onClick={() => handleFileRemove(item.type)}
                                className="text-xs text-red-600 hover:text-red-800 font-medium"
                              >
                                Replace
                              </button>
                            )}
                          </div>
                        ) : (
                          <div>
                            {!isLocked ? (
                              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition">
                                <Upload className="w-3.5 h-3.5 text-slate-500" />
                                {isUploading ? 'Uploading...' : 'Choose File'}
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                                  disabled={isUploading}
                                  onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleFileUpload(item.type, e.target.files[0]);
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            ) : (
                              <span className="text-xs text-slate-400">Locked</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition w-full sm:w-auto justify-center"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
              )}
              {!isLocked && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => saveStepData(currentStep)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition w-full sm:w-auto justify-center"
                >
                  <Save className="w-3.5 h-3.5 text-slate-500" /> {saving ? 'Saving...' : 'Save Draft'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                disabled={saving}
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#196855] text-white rounded-md text-xs font-semibold hover:bg-emerald-800 transition shadow-sm w-full sm:w-auto justify-center"
              >
                {currentStep === 6 ? (
                  <>
                    Proceed to Review <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Save & Continue <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
