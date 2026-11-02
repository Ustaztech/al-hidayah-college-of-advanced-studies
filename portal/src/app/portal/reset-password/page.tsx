'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

const resetSchema = z
  .object({
    email: z.string().email({ message: 'Enter your valid account email address' }).trim(),
    password: z.string().min(8, { message: 'New password must be at least 8 characters' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
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
          email: data.email,
          newPassword: data.password,
          action: 'confirm'
        })
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.message || 'Failed to update password. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setIsSubmitting(false);
    } catch {
      setErrorMessage('Communication error. Please try again later.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F5]">
      <header className="bg-white border-b border-gray-200 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#e69912]/40 shadow-xs p-1 flex items-center justify-center">
              <img src="/official-logo.jpg" alt="AHCAS Crest" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#196855] uppercase font-serif">
                AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Set New Password</p>
            </div>
          </div>
          <Link
            href="/portal/login"
            className="text-xs font-bold text-[#196855] hover:text-[#e69912] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-[#e69912] border border-amber-200 flex items-center justify-center mx-auto">
              <KeyRound size={24} />
            </div>
            <h2 className="text-xl font-bold font-serif text-gray-900">
              Create New Password
            </h2>
            <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
              Ensure your new password contains at least 8 characters with letters and numbers.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 text-center">
              <CheckCircle2 size={32} className="text-[#196855] mx-auto" />
              <h3 className="font-bold text-sm">Password Updated Successfully</h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Your portal security credentials have been updated. You can now log in with your new password.
              </p>
              <div className="pt-2">
                <Link
                  href="/portal/login"
                  className="inline-block px-5 py-2.5 bg-[#196855] text-white font-bold text-xs rounded-xl hover:bg-[#135344] transition-colors shadow-xs"
                >
                  Sign In with New Password
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Registered Account Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="your.email@alhidayahcollege.com.ng"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#196855] ${
                    errors.email ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-600 font-medium pl-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Minimum 8 characters"
                    className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#196855] ${
                      errors.password ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-600 font-medium pl-1">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Re-type new password"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#196855] ${
                    errors.confirmPassword ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-[11px] text-red-600 font-medium pl-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#196855] hover:bg-[#135344] text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Updating Password...' : 'Save & Update Password'}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-500">
        AL-HIDAYAH COLLEGE OF ADVANCED STUDIES • Student & Staff Information Management
      </footer>
    </div>
  );
}
