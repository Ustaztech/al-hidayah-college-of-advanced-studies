'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().min(1, { message: 'Enter your email address or applicant ID' }).trim(),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().default(true)
});

type LoginFormData = z.infer<typeof loginSchema>;

function ApplicantLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/application/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: true
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Authenticate through portal login API
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: data.identifier,
          password: data.password,
          rememberMe: data.rememberMe
        })
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrorMessage(result.error || 'Invalid email address or password.');
        setIsSubmitting(false);
        return;
      }

      // Check if user is an applicant or admin
      const roles: string[] = result.user?.roles || [];
      if (!roles.includes('applicant') && !roles.includes('super_admin') && !roles.includes('college_admin')) {
        setErrorMessage('This account is registered for student/staff access. Please use the Student/Staff Portal login instead.');
        setIsSubmitting(false);
        return;
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col font-sans">
      
      {/* Top Header Navbar (Image 3 Style) */}
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
          
          {/* Card (Image 3 Style) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-6 sm:p-8 space-y-6">
            
            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Login
            </h1>

            {/* Amber Notice Banner (Image 3 Style) */}
            <div className="p-4 rounded-xl bg-[#F97316] text-white flex items-start gap-3 shadow-xs">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="font-bold text-sm">!</span>
              </div>
              <div className="text-xs font-medium leading-relaxed">
                <strong className="font-bold">Applicant Portal Access.</strong> Enter your registered email address or applicant number (e.g. AHCAS/APP/2026/00001) to continue.
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800 text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Identifier Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  {...register('identifier')}
                  placeholder="Email address / Applicant ID"
                  className={`w-full py-3 px-4 rounded-xl border text-xs text-gray-900 placeholder:text-gray-400 bg-white focus:outline-hidden focus:ring-1 transition-all ${
                    errors.identifier
                      ? 'border-rose-400 focus:ring-rose-500'
                      : 'border-gray-300 focus:ring-gray-400 focus:border-gray-400'
                  }`}
                />
                {errors.identifier && (
                  <p className="text-[11px] text-rose-500 font-medium pl-1">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
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

              {/* Footer Row (Image 3 Style): Links on left, Login button on right */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    Not registered?{' '}
                    <Link
                      href="/application"
                      className="text-[#10B981] hover:text-[#059669] font-semibold hover:underline"
                    >
                      Register
                    </Link>{' '}
                    or Forgot password?{' '}
                    <Link
                      href="/application/forgot-password"
                      className="text-[#10B981] hover:text-[#059669] font-semibold hover:underline"
                    >
                      click here
                    </Link>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-6 rounded-xl bg-[#E5E7EB] hover:bg-[#10B981] hover:text-white text-gray-700 font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-2xs self-end sm:self-auto"
                >
                  {isSubmitting ? 'Signing In...' : 'Login'}
                </button>
              </div>

            </form>

          </div>

          <div className="mt-4 text-center text-[11px] text-gray-400">
            Al-Hidayah College of Advanced Studies • Study Centre 029 • Abaji, FCT-Abuja
          </div>

        </div>
      </main>

    </div>
  );
}

export default function ApplicantLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
          <div className="flex items-center gap-3 text-[#196855]">
            <div className="w-5 h-5 border-2 border-[#196855]/20 border-t-[#196855] rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading Applicant Login...</span>
          </div>
        </div>
      }
    >
      <ApplicantLoginForm />
    </Suspense>
  );
}
