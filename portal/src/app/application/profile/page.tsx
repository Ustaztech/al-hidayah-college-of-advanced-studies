'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Clock,
  Activity,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters long' })
    .max(120, { message: 'Full name must not exceed 120 characters' })
    .trim(),
  phone_number: z
    .string()
    .min(10, { message: 'Enter a valid phone number (min 10 digits)' })
    .max(20, { message: 'Phone number too long' })
    .trim()
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ApplicantProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [applicantData, setApplicantData] = useState<{
    id: string;
    applicant_number: string;
    full_name: string;
    email: string;
    phone_number: string;
    application_type?: { name: string; code: string } | null;
    account_status: string;
    registration_status: string;
    created_at: string;
    updated_at: string;
  } | null>(null);

  const [events, setEvents] = useState<Array<{ id: string; event_type: string; created_at: string }>>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone_number: ''
    }
  });

  // Load applicant profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/application/profile');
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/application/login');
            return;
          }
          throw new Error('Failed to load applicant profile');
        }

        const data = await res.json();
        if (data.success && data.applicant) {
          setApplicantData(data.applicant);
          setEvents(data.events || []);
          reset({
            full_name: data.applicant.full_name || '',
            phone_number: data.applicant.phone_number || ''
          });
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error loading profile.');
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [router, reset]);

  const onSubmit = async (formData: ProfileFormData) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/application/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      setSuccessMessage('Your applicant profile has been successfully updated.');
      if (applicantData) {
        setApplicantData({
          ...applicantData,
          full_name: formData.full_name,
          phone_number: formData.phone_number
        });
      }
      reset(formData); // clear dirty state
    } catch (err: any) {
      setErrorMessage(err.message || 'Update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#196855]">
          <div className="w-5 h-5 border-2 border-[#196855]/20 border-t-[#196855] rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider">Loading Applicant Record...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Back Link & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/application/dashboard"
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#196855] hover:bg-emerald-50 transition-colors shadow-2xs"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-gray-900 font-serif">
                Applicant Profile Management
              </h1>
              <p className="text-xs text-gray-500">
                Official institutional admission applicant profile details
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-[#196855] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            {applicantData?.applicant_number}
          </span>
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left Column: Editable Profile Fields Form */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 font-serif">
                Personal Contact Details
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Ensure your full name matches your official WAEC/NECO/O-Level certificates.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Full Legal Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    {...register('full_name')}
                    placeholder="Surname First, followed by other names"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#196855]"
                  />
                </div>
                {errors.full_name && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.full_name.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Active Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    {...register('phone_number')}
                    placeholder="e.g. 08104256900"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#196855]"
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.phone_number.message}</p>
                )}
                <p className="text-[10px] text-gray-400">
                  SMS alerts regarding admission screenings will be delivered to this number.
                </p>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="py-2.5 px-5 rounded-xl bg-[#196855] hover:bg-[#145344] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Read-Only System Identity Details */}
            <div className="pt-5 border-t border-gray-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Institutional System Identifiers (Read-Only)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Applicant ID</span>
                  <span className="font-mono font-bold text-[#196855]">{applicantData?.applicant_number}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Registered Email</span>
                  <span className="font-semibold text-gray-800 break-all">{applicantData?.email}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Application Programme</span>
                  <span className="font-semibold text-gray-800">
                    {applicantData?.application_type?.name || 'General Admission'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Date Registered</span>
                  <span className="font-semibold text-gray-800">
                    {applicantData?.created_at ? new Date(applicantData.created_at).toLocaleDateString('en-GB') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Status & Event History */}
          <div className="space-y-6">

            {/* Account Status Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 font-serif border-b border-gray-100 pb-2">
                Registration Verification
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-500">Account Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 uppercase">
                    {applicantData?.account_status}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-gray-100">
                  <span className="text-gray-500">Email Verification:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                    ● Verified
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-gray-100">
                  <span className="text-gray-500">Screening Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200 capitalize">
                    {applicantData?.registration_status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Application Lifecycle Audit Events */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 font-serif">
                  Lifecycle Audit Trail
                </h3>
                <Activity size={14} className="text-gray-400" />
              </div>

              {events.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">No lifecycle events recorded yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {events.map((ev, i) => (
                    <div key={ev.id || i} className="flex items-start gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#196855] shrink-0 mt-1.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 capitalize">
                          {ev.event_type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(ev.created_at).toLocaleString('en-GB')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
