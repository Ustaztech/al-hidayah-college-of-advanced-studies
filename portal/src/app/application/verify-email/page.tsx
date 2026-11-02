'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  XCircle,
  Mail,
  ArrowRight,
  RefreshCw,
  Clock
} from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'idle'>(token ? 'verifying' : 'idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccessMessage, setResendSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function verify() {
      try {
        const res = await fetch('/api/application/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await res.json();
        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Verification link is invalid or has expired.');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Network error during verification.');
      }
    }

    verify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setIsResending(true);
    setResendSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/application/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resendEmail })
      });

      const data = await res.json();
      if (data.success) {
        setResendSuccessMessage(data.message || 'A new verification link has been sent to your email.');
      } else {
        setErrorMessage(data.error || 'Failed to dispatch new verification link.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error sending verification email.');
    } finally {
      setIsResending(false);
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
        <Link href="/application/login" className="text-xs font-bold text-[#10B981] hover:text-[#059669]">
          Applicant Login
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-xl">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-6 sm:p-8 space-y-6">
            
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Email verification
            </h1>

            {/* Status: Verifying */}
            {status === 'verifying' && (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 border-3 border-[#10B981]/20 border-t-[#10B981] rounded-full animate-spin mx-auto" />
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Verifying Email Credentials...
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Validating cryptographic token with college authentication registry.
                  </p>
                </div>
              </div>
            )}

            {/* Status: Success */}
            {status === 'success' && (
              <div className="text-center space-y-5 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    Email Successfully Verified!
                  </h2>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                    Your application account is now active. You may now sign in to your dashboard to view your applicant profile.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/application/login"
                    className="w-full py-3 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Proceed to Applicant Login</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {/* Status: Error or Idle */}
            {(status === 'error' || status === 'idle') && (
              <div className="space-y-5">
                {status === 'error' && (
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                      <XCircle size={32} />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">
                      Verification Link Invalid or Expired
                    </h2>
                    <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                      {errorMessage}
                    </p>
                  </div>
                )}

                {status === 'idle' && (
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                      <Clock size={32} />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">
                      Email Activation Required
                    </h2>
                    <p className="text-xs text-gray-500">
                      Enter your registered applicant email address below to receive a new activation link.
                    </p>
                  </div>
                )}

                {/* Resend Form */}
                <form onSubmit={handleResend} className="space-y-3 pt-2 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Request New Verification Link
                  </p>

                  {resendSuccessMessage && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                      {resendSuccessMessage}
                    </div>
                  )}

                  <input
                    type="email"
                    required
                    value={resendEmail}
                    onChange={e => setResendEmail(e.target.value)}
                    placeholder="Enter registered email address"
                    className="w-full py-3 px-4 rounded-xl border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 bg-white focus:outline-hidden focus:ring-1 focus:ring-gray-400"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <Link
                      href="/application/login"
                      className="text-xs text-[#10B981] hover:text-[#059669] font-semibold hover:underline"
                    >
                      &larr; Back to Login
                    </Link>

                    <button
                      type="submit"
                      disabled={isResending}
                      className="py-2.5 px-6 rounded-xl bg-[#E5E7EB] hover:bg-[#10B981] hover:text-white text-gray-700 font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      {isResending ? 'Sending...' : 'Send Link'}
                    </button>
                  </div>
                </form>
              </div>
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

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
          <div className="flex items-center gap-3 text-[#196855]">
            <div className="w-5 h-5 border-2 border-[#196855]/20 border-t-[#196855] rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading Verification Gateway...</span>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
