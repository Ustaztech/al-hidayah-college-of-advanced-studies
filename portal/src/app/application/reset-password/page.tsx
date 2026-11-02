'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Za-z]/, { message: 'Password must include at least one letter' })
      .regex(/[0-9]/, { message: 'Password must include at least one number' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your new password' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type ResetFormData = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema)
  });

  const onSubmit = async (data: ResetFormData) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm',
          email: emailParam,
          token,
          newPassword: data.password
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMessage(json.message || 'Failed to update password. Link may have expired.');
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col font-sans">
      
      {/* Top Header Navbar */}
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
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-xl">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-6 sm:p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Set new password
            </h1>

            {isSuccess ? (
              <div className="text-center space-y-4 py-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-gray-900">
                    Password Successfully Updated
                  </h2>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Your password has been changed. You may now log in with your updated credentials.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/application/login"
                    className="py-2.5 px-6 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs inline-block transition-colors"
                  >
                    Proceed to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800 text-xs">
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      placeholder="New password (min 8 characters)"
                      className={`w-full py-3 pl-4 pr-11 rounded-xl border text-xs text-gray-900 placeholder:text-gray-400 bg-white focus:outline-hidden focus:ring-1 transition-all ${
                        errors.password ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-300 focus:ring-gray-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      placeholder="Confirm new password"
                      className={`w-full py-3 pl-4 pr-11 rounded-xl border text-xs text-gray-900 placeholder:text-gray-400 bg-white focus:outline-hidden focus:ring-1 transition-all ${
                        errors.confirmPassword ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-300 focus:ring-gray-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <Link
                    href="/application/login"
                    className="text-xs text-[#10B981] hover:text-[#059669] font-semibold hover:underline"
                  >
                    &larr; Back to Login
                  </Link>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-6 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    {isSubmitting ? 'Updating...' : 'Set New Password'}
                  </button>
                </div>
              </form>
            )}

          </div>

          <div className="mt-4 text-center text-[11px] text-gray-400">
            Al-Hidayah College of Advanced Studies • Study Centre 029 • Abaji, FCT-Abuja
          </div>

        </div>
      </main>

    </div>
  );
}

export default function ApplicantResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
          <div className="flex items-center gap-3 text-[#196855]">
            <div className="w-5 h-5 border-2 border-[#196855]/20 border-t-[#196855] rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading Password Reset Gateway...</span>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
