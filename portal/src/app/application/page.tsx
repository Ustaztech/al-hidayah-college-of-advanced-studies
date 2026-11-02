'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ApplicationType } from '@/lib/types';

const registrationSchema = z
  .object({
    applicationTypeId: z.string().min(1, { message: 'This field is required' }),
    email: z.string().email({ message: 'Enter a valid email address' }).toLowerCase().trim(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Za-z]/, { message: 'Password must include at least one letter' })
      .regex(/[0-9]/, { message: 'Password must include at least one number' }),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function ApplicationRegistrationPage() {
  const router = useRouter();
  const [applicationTypes, setApplicationTypes] = useState<ApplicationType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    applicantNumber: string;
    email: string;
    verificationUrl?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      applicationTypeId: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const selectedTypeId = watch('applicationTypeId');

  useEffect(() => {
    async function loadTypes() {
      try {
        const res = await fetch('/api/application/types');
        const data = await res.json();
        if (data.success && Array.isArray(data.types)) {
          setApplicationTypes(data.types);
        }
      } catch (err) {
        console.error('Failed to load application types:', err);
      } finally {
        setIsLoadingTypes(false);
      }
    }
    loadTypes();
  }, []);

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/application/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrorMessage(result.error || 'Registration failed. Please check your details and try again.');
        setIsSubmitting(false);
        return;
      }

      setRegistrationSuccess({
        applicantNumber: result.applicantNumber,
        email: data.email,
        verificationUrl: result.verificationUrl
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col font-sans">
      
      {/* Top Header Navbar (Image 2 Style) */}
      <header className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 border border-gray-200">
            <Image
              src="/official-logo.jpg"
              alt="AHCAS Logo"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-black text-gray-900 tracking-tight">
            AHCAS - Application
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
            College Home
          </Link>
          <Link href="/portal/login" className="text-[#10B981] hover:text-[#059669] transition-colors">
            Student/Staff Portal
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-xl">
          
          {/* Card (Image 2 Style) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-6 sm:p-8 space-y-6">
            
            {/* Success State */}
            {registrationSuccess ? (
              <div className="text-center space-y-5 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-gray-900">
                    Application Account Created!
                  </h2>
                  <p className="text-xs text-gray-600">
                    Your official applicant identification number is:
                  </p>
                  <div className="inline-block px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl font-mono font-black text-sm text-[#196855]">
                    {registrationSuccess.applicantNumber}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-800 space-y-2">
                  <p className="font-bold">Check Your Email to Verify Account</p>
                  <p className="leading-relaxed text-amber-700">
                    A confirmation email has been dispatched to <strong>{registrationSuccess.email}</strong>. 
                    Please click the verification link in the message to activate your application account.
                  </p>
                  {registrationSuccess.verificationUrl && (
                    <div className="pt-2 border-t border-amber-200">
                      <Link
                        href={registrationSuccess.verificationUrl}
                        className="text-xs font-bold text-[#10B981] hover:underline"
                      >
                        Click here to verify email now (Testing Shortcut) &rarr;
                      </Link>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href="/application/login"
                    className="w-full py-3 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-colors block text-center"
                  >
                    Proceed to Applicant Login &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Heading */}
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  New application
                </h1>

                {/* Amber Notice Banner (Exact Image 2 Style) */}
                <div className="p-4 rounded-xl bg-[#F97316] text-white flex items-start gap-3 shadow-xs">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-bold text-sm">!</span>
                  </div>
                  <div className="text-xs font-medium leading-relaxed">
                    <strong className="font-bold">2026/2027 Admissions Open.</strong> Please ensure you provide a valid personal email address to receive admission correspondence and verification links.
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800 text-xs">
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Registration Form (Image 2) */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  
                  {/* Application Type Dropdown */}
                  <div className="space-y-1">
                    <div className="relative">
                      <select
                        {...register('applicationTypeId')}
                        disabled={isLoadingTypes}
                        className={`w-full py-3 px-4 rounded-xl border text-xs text-gray-900 bg-white focus:outline-hidden focus:ring-1 transition-all appearance-none cursor-pointer ${
                          errors.applicationTypeId
                            ? 'border-rose-400 focus:ring-rose-500 text-rose-900'
                            : 'border-gray-300 focus:ring-gray-400 focus:border-gray-400'
                        }`}
                      >
                        <option value="">
                          {isLoadingTypes ? 'Loading programmes...' : 'Application type'}
                        </option>
                        {applicationTypes.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.code})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-rose-500 font-bold text-xs">
                        ▼
                      </div>
                    </div>
                    {errors.applicationTypeId && (
                      <p className="text-[11px] text-rose-500 font-medium pl-1">
                        {errors.applicationTypeId.message}
                      </p>
                    )}
                  </div>

                  {/* Email address */}
                  <div className="space-y-1">
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="Email address"
                      className={`w-full py-3 px-4 rounded-xl border text-xs text-gray-900 placeholder:text-gray-400 bg-white focus:outline-hidden focus:ring-1 transition-all ${
                        errors.email
                          ? 'border-rose-400 focus:ring-rose-500'
                          : 'border-gray-300 focus:ring-gray-400 focus:border-gray-400'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-500 font-medium pl-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="Password"
                        className={`w-full py-3 pl-4 pr-11 rounded-xl border text-xs text-gray-900 placeholder:text-gray-400 bg-white focus:outline-hidden focus:ring-1 transition-all ${
                          errors.password
                            ? 'border-rose-400 focus:ring-rose-500'
                            : 'border-gray-300 focus:ring-gray-400 focus:border-gray-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-rose-500 font-medium pl-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <input
                      type="password"
                      {...register('confirmPassword')}
                      placeholder="Confirm Password"
                      className={`w-full py-3 px-4 rounded-xl border text-xs text-gray-900 placeholder:text-gray-400 bg-white focus:outline-hidden focus:ring-1 transition-all ${
                        errors.confirmPassword
                          ? 'border-rose-400 focus:ring-rose-500'
                          : 'border-gray-300 focus:ring-gray-400 focus:border-gray-400'
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-[11px] text-rose-500 font-medium pl-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Footer Row (Image 2 Style): Already registered? Login on Left, Proceed button on Right */}
                  <div className="pt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                      Already registered?{' '}
                      <Link
                        href="/application/login"
                        className="text-[#10B981] hover:text-[#059669] font-semibold hover:underline"
                      >
                        Login
                      </Link>
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="py-2.5 px-6 rounded-xl bg-[#E5E7EB] hover:bg-[#10B981] hover:text-white text-gray-700 font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      {isSubmitting ? 'Processing...' : 'Proceed'}
                    </button>
                  </div>

                </form>
              </>
            )}

          </div>

          {/* Footer note */}
          <div className="mt-4 text-center text-[11px] text-gray-400">
            Al-Hidayah College of Advanced Studies • Study Centre 029 • Abaji, FCT-Abuja
          </div>

        </div>
      </main>

    </div>
  );
}
