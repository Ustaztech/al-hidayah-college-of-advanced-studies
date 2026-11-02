import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Calculator,
  CheckCircle2,
  ShieldCheck,
  Building,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { TUITION_SCHEDULE, INSTITUTION_INFO } from '../../data/ijmbData';

export const TuitionCalculator: React.FC = () => {
  const [includeHostel, setIncludeHostel] = useState<boolean>(false);
  const [paymentOption, setPaymentOption] = useState<'installments' | 'oneTime'>('installments');

  const baseTuition = paymentOption === 'oneTime'
    ? TUITION_SCHEDULE.ijmb.oneTimePayment
    : TUITION_SCHEDULE.ijmb.firstInstallment + TUITION_SCHEDULE.ijmb.secondInstallment;

  const hostelFee = includeHostel ? 45000 : 0;
  const totalPayable = baseTuition + hostelFee;

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" /> Institutional Fee Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
            Transparent Tuition & Flexible Installments
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No hidden levies. All laboratory manuals, continuous assessment tests, digital library access, and examination fees are fully incorporated.
          </p>
        </div>

        {/* Interactive Pricing Card Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Plan Selector */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
                  1. Select Payment Structure
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentOption('installments')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentOption === 'installments'
                        ? 'border-emerald-600 bg-white dark:bg-slate-900 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Two Flexible Installments</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Popular
                      </span>
                    </div>
                    <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                      ₦154,000 <span className="text-xs font-medium text-slate-500">+ ₦105,500</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                      Pay ₦154,000 upon admission offer; clear the remaining balance mid-session before examinations.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentOption('oneTime')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentOption === 'oneTime'
                        ? 'border-emerald-600 bg-white dark:bg-slate-900 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">One-Off Full Session</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Save ₦1,000
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">
                      ₦258,500
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                      Single complete session settlement with statutory discount. Covers entire academic year.
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional Add-on */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
                  2. Optional Accommodation Add-On
                </label>
                <div
                  onClick={() => setIncludeHostel(!includeHostel)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    includeHostel
                      ? 'border-emerald-600 bg-white dark:bg-slate-900 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${includeHostel ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'}`}>
                      {includeHostel && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        AHCAS Student Hostel Lodging (Abaji Study Centre)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Furnished room with power backup, clean water, and 24/7 security.
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">+₦45,000</span>
                    <span className="text-[10px] text-slate-500 block">per session</span>
                  </div>
                </div>
              </div>

              {/* Inclusions Checkmarks */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Mandatory Benefits Included in Tuition:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>73 Approved Combination Lectures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Science Laboratory Practicals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Continuous Assessment (20% CA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited OER E-Library Access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory Bank Guarantee */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Payments made strictly to official College accounts at <strong>Jaiz Bank Plc (0012894561)</strong> or Fidelity Bank.</span>
            </div>
          </div>

          {/* Right Column: Financial Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border-2 border-emerald-600/40 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300">
                    Tuition Estimate Breakdown
                  </span>
                  <h3 className="text-2xl font-black font-serif text-white mt-1">
                    2026/2027 Academic Session
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md">
                  <CreditCard className="w-6 h-6 text-amber-300" />
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-3 border-t border-white/15 pt-4 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Programme:</span>
                  <span className="font-bold text-white">IJMB Direct Entry (1 Year)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Payment Mode:</span>
                  <span className="font-bold text-amber-300">
                    {paymentOption === 'installments' ? '2 Installments' : 'Full Session (1-Off)'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Initial Due at Acceptance:</span>
                  <span className="font-bold text-white font-mono">
                    {paymentOption === 'installments' ? '₦154,000' : '₦258,500'}
                  </span>
                </div>
                {paymentOption === 'installments' && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>2nd Installment (Mid-Session):</span>
                    <span className="font-bold text-white font-mono">₦105,500</span>
                  </div>
                )}
                {includeHostel && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Hostel Lodging (Session):</span>
                    <span className="font-bold text-white font-mono">₦45,000</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-center space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold">
                  Total Session Commitment
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
                  ₦{totalPayable.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">
                  Application screening form: ₦10,500 (one-off purchase)
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-6">
              <Link
                to="/apply"
                className="w-full py-3.5 px-4 bg-[#e69912] hover:bg-[#c99015] text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Online Application</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/bursary"
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors text-center block border border-white/15"
              >
                Access Bursary Portal & Fees Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TuitionCalculator;
