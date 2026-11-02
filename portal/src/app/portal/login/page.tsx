'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  GraduationCap,
  AlertCircle,
  Quote
} from 'lucide-react';

const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: 'Please enter your Matric Number or Staff ID' })
    .trim(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().default(true)
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student');

  const {
    register,
    handleSubmit,
    setValue,
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
      // 1. Resolve Identifier (matric/staff ID -> email)
      const resolveRes = await fetch('/api/auth/resolve-identifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: data.identifier })
      });

      const resolveData = await resolveRes.json();

      if (!resolveRes.ok || !resolveData.success) {
        setErrorMessage(
          resolveData.message ||
            `Invalid ${activeTab === 'student' ? 'Matriculation Number' : 'Staff ID'}. Please verify and try again.`
        );
        setIsSubmitting(false);
        return;
      }

      // 2. Perform Session Authentication
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: resolveData.email,
          password: data.password,
          rememberMe: data.rememberMe
        })
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok || !loginData.success) {
        setErrorMessage(loginData.error || 'Invalid credentials or inactive account.');
        setIsSubmitting(false);
        return;
      }

      // 3. Role-Based Redirection
      const targetDashboard = redirectPath || loginData.targetDashboard || '/portal/profile';
      router.push(targetDashboard);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected connection error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-center p-3 sm:p-6 lg:p-10 font-sans">
      
      {/* Central Login Container with Split Layout (Image 1 Style) */}
      <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-gray-100 min-h-[620px]">
        
        {/* Left Form Column (55% on desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Heading */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Please login below to continue
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Student / Staff Segmented Pill Selector (Image 1) */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100/90 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('student');
                  setValue('identifier', '');
                  setErrorMessage(null);
                }}
                className={`py-2 px-4 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  activeTab === 'student'
                    ? 'bg-[#D1F2E8] text-[#196855] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('staff');
                  setValue('identifier', '');
                  setErrorMessage(null);
                }}
                className={`py-2 px-4 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  activeTab === 'staff'
                    ? 'bg-[#D1F2E8] text-[#196855] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Staff
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* ID Input with Outlined Top Legend Border (Image 1) */}
              <div className="relative">
                <div className="relative border border-gray-300 rounded-xl focus-within:border-[#196855] focus-within:ring-1 focus-within:ring-[#196855] bg-white transition-all">
                  {/* Floating Legend Label on Border */}
                  <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-[11px] font-semibold text-gray-500">
                    {activeTab === 'student' ? 'Student ID' : 'Staff ID'}
                  </label>

                  <div className="flex items-center px-3.5 py-2.5 gap-2.5">
                    <User size={18} className="text-gray-500 shrink-0" />
                    <input
                      type="text"
                      {...register('identifier')}
                      placeholder={activeTab === 'student' ? 'e.g. AHCAS/2026/001' : 'e.g. AHCAS/STF/2026/001'}
                      className="w-full text-xs font-medium text-gray-900 bg-[#F0F4FF] px-2.5 py-1.5 rounded-md placeholder:text-gray-400 focus:outline-hidden"
                    />
                  </div>
                </div>
                {errors.identifier && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.identifier.message}</p>
                )}
              </div>

              {/* Password Input with Outlined Top Legend Border (Image 1) */}
              <div className="relative">
                <div className="relative border border-gray-300 rounded-xl focus-within:border-[#196855] focus-within:ring-1 focus-within:ring-[#196855] bg-white transition-all">
                  {/* Floating Legend Label on Border */}
                  <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-[11px] font-semibold text-gray-500">
                    Password
                  </label>

                  <div className="flex items-center px-3.5 py-2.5 gap-2.5">
                    <Lock size={18} className="text-gray-500 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      placeholder="••••••••••••"
                      className="w-full text-xs font-medium text-gray-900 bg-[#F0F4FF] px-2.5 py-1.5 rounded-md placeholder:text-gray-400 focus:outline-hidden tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Forgot Password Link (Right Aligned in Teal) */}
              <div className="flex justify-end">
                <Link
                  href="/portal/forgot-password"
                  className="text-xs font-bold text-[#10B981] hover:text-[#196855] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button (Image 1 Style) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm tracking-wide shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

            </form>
          </div>

          {/* Bottom Portal Navigation Links (Image 1 Style) */}
          <div className="text-center pt-6 mt-6 border-t border-gray-100 space-y-1.5">
            <p className="text-xs text-gray-700">
              Not a student?{' '}
              <Link
                href="/application"
                className="font-bold text-[#10B981] hover:text-[#196855] hover:underline transition-colors"
              >
                Application Portal
              </Link>
            </p>
            <div>
              <Link
                href="/"
                className="text-xs font-bold text-[#10B981] hover:text-[#196855] hover:underline transition-colors"
              >
                Al-Hidayah College Homepage
              </Link>
            </div>
          </div>

        </div>

        {/* Right Photographic & Institutional Panel (45% on desktop, Image 1) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#145344] overflow-hidden flex-col justify-between p-8 text-white">
          
          {/* Background Photo Overlay */}
          <div className="absolute inset-0">
            <Image
              src="/ahcas-orientation-students-cohort.jpg"
              alt="Al-Hidayah College Students"
              fill
              className="object-cover object-center opacity-25 mix-blend-overlay"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#145344]/90 via-[#196855]/95 to-[#0F3D32]" />
          </div>

          {/* Content Overlays */}
          <div className="relative z-10 space-y-6">
            
            {/* Top University Header Card (Image 1) */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3.5 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-white p-1 flex items-center justify-center shrink-0 shadow-md">
                <Image
                  src="/official-logo.jpg"
                  alt="Al-Hidayah Crest"
                  width={42}
                  height={42}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-white font-serif leading-tight">
                  AL-HIDAYAH COLLEGE
                </h2>
                <p className="text-[10px] text-emerald-200 font-bold tracking-tight uppercase">
                  OF ADVANCED STUDIES
                </p>
                <p className="text-[9px] text-amber-300 font-medium">
                  Study Centre 029 • Abaji, FCT-Abuja
                </p>
              </div>
            </div>

            {/* Middle Welcome Card (Image 1) */}
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center space-y-3 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mx-auto text-emerald-200 border border-white/20">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-sm font-bold text-white leading-snug">
                Welcome to the Al-Hidayah College of Advanced Studies portal
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed font-normal">
                Access to certain services is restricted to authenticated users only.
              </p>
            </div>

          </div>

          {/* Bottom Motto Quote Card (Image 1) */}
          <div className="relative z-10 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center space-y-2 shadow-lg">
            <span className="text-2xl font-serif text-emerald-200 font-black block leading-none">
              &ldquo;&ldquo;
            </span>
            <p className="text-xs font-serif italic text-emerald-100 tracking-wide">
              Knowledge for Development & Academic Excellence
            </p>
            <p className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
              Enlightening Minds, Building Nations
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
          <div className="flex items-center gap-3 text-[#196855]">
            <div className="w-5 h-5 border-2 border-[#196855]/20 border-t-[#196855] rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading Portal Gateway...</span>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
