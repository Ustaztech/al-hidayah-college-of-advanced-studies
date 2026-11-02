'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const forgotSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: 'Enter your registered email, matric number, or staff ID' })
    .trim()
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIdentifier, setSubmittedIdentifier] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema)
  });

  const onSubmit = async (data: ForgotFormData) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    setSubmittedIdentifier(data.identifier);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: data.identifier, action: 'request' })
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.message || 'Unable to process reset request. Please check your identifier.');
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
            AHCAS - Student & Staff Portal
          </span>
        </Link>
        <Link href="/portal/login" className="text-xs font-bold text-[#10B981] hover:text-[#059669]">
          Portal Login
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-xl">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-6 sm:p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Password Recovery
            </h1>

            {/* Amber Alert Banner */}
            <div className="p-4 rounded-xl bg-[#F97316] text-white flex items-start gap-3 shadow-xs">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="font-bold text-sm">!</span>
              </div>
              <div className="text-xs font-medium leading-relaxed">
                Enter your institutional matriculation number, assigned staff ID, or registered email address to receive password reset instructions.
              </div>
            </div>

            {isSuccess ? (
              <div className="text-center space-y-4 py-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-gray-900">
                    Password Reset Instructions Sent
                  </h2>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                    If an active institutional record matches <strong>{submittedIdentifier}</strong>, secure recovery instructions have been delivered to your email on file.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/portal/login"
                    className="py-2.5 px-6 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs inline-block transition-colors"
                  >
                    Return to Login
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
                  <input
                    type="text"
                    {...register('identifier')}
                    placeholder="Matric Number, Staff ID, or Email Address"
                    className={`w-full py-3 px-4 rounded-xl border text-xs text-gray-900 placeholder:text-gray-400 bg-white focus:outline-hidden focus:ring-1 transition-all ${
                      errors.identifier ? 'border-rose-400 focus:ring-rose-500' : 'border-gray-300 focus:ring-gray-400'
                    }`}
                  />
                  {errors.identifier && (
                    <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.identifier.message}</p>
                  )}
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <Link
                    href="/portal/login"
                    className="text-xs text-[#10B981] hover:text-[#059669] font-semibold hover:underline"
                  >
                    &larr; Back to Login
                  </Link>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-6 rounded-xl bg-[#E5E7EB] hover:bg-[#10B981] hover:text-white text-gray-700 font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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
