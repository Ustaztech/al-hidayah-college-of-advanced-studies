'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Building2,
  PhoneCall,
  FileText,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Printer,
  Sparkles,
  GraduationCap,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { FeeInvoice, Application, AuthSessionUser, FeePayment, MatriculationRecord } from '@/lib/types';

interface PaymentClientProps {
  user: AuthSessionUser;
  initialInvoice: FeeInvoice;
  application: Application;
}

export const PaymentClient: React.FC<PaymentClientProps> = ({
  user,
  initialInvoice,
  application
}) => {
  const router = useRouter();
  const [invoice, setInvoice] = useState<FeeInvoice>(initialInvoice);
  const [activeTab, setActiveTab] = useState<'card' | 'bank_transfer' | 'ussd' | 'branch'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedRRR, setCopiedRRR] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(invoice.status === 'paid');
  const [completedPayment, setCompletedPayment] = useState<FeePayment | null>(invoice.payment || null);
  const [matricRecord, setMatricRecord] = useState<MatriculationRecord | null>(application.matriculation_record || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [cardNumber, setCardNumber] = useState('5399 4120 8890 3412');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('821');
  const [cardPin, setCardPin] = useState('1234');

  const copyRRR = () => {
    navigator.clipboard.writeText(invoice.rrr_number);
    setCopiedRRR(true);
    setTimeout(() => setCopiedRRR(false), 2500);
  };

  const handleSimulatePayment = async (method: 'card' | 'bank_transfer' | 'ussd' | 'bank_branch') => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/application/payments/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          paymentMethod: method,
          payerName: user.profile.full_name || 'Candidate',
          payerEmail: user.profile.email
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment failed to process');
      }

      setInvoice(data.invoice);
      setCompletedPayment(data.payment);
      if (data.matriculation) {
        setMatricRecord(data.matriculation);
      }
      setPaymentSuccess(true);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment simulation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const candidateName = application.personal_details
    ? `${application.personal_details.surname} ${application.personal_details.first_name} ${application.personal_details.middle_name || ''}`.trim()
    : user.profile.full_name;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#196855]/10 text-[#196855] border border-[#196855]/20">
                Official Electronic Billing
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {application.admission_session?.name || '2026/2027 Academic Session'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight font-serif">
              Acceptance Fee Payment Desk
            </h1>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Pay the mandatory institutional acceptance fee to validate your provisional admission, clear your academic file with the Registry, and issue your official College Matriculation Number.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Amount Payable</span>
            <div className="text-3xl font-black text-[#196855] font-mono">
              ₦{invoice.amount.toLocaleString()}.00
            </div>
            <span className="text-[11px] text-gray-500 font-medium">Non-refundable institutional levy</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="shrink-0 text-red-600" size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SUCCESS BANNER & MATRICULATION CLEARANCE NOTICE */}
      {paymentSuccess && (
        <div className="bg-gradient-to-br from-emerald-900 to-[#196855] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 text-white">
            <GraduationCap size={260} />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-900">
                  Payment Verified • Officially Enrolled
                </span>
                <h2 className="text-xl md:text-2xl font-black font-serif mt-0.5">
                  Acceptance Fee Successfully Paid & Cleared!
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/20 backdrop-blur-md p-5 rounded-2xl border border-white/10">
              <div>
                <p className="text-xs text-emerald-200">Receipt Reference</p>
                <p className="text-base font-bold font-mono text-white mt-0.5">
                  {completedPayment?.receipt_number || invoice.payment?.receipt_number || 'AHCAS/REC/2026/00501'}
                </p>
              </div>

              <div>
                <p className="text-xs text-emerald-200">Remita RRR</p>
                <p className="text-base font-bold font-mono text-amber-300 mt-0.5">
                  {invoice.rrr_number}
                </p>
              </div>

              <div>
                <p className="text-xs text-emerald-200">Issued Matriculation Number</p>
                <p className="text-base font-black font-mono text-emerald-300 mt-0.5">
                  {matricRecord?.matric_number || 'AHCAS/2026/002'}
                </p>
              </div>
            </div>

            <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Your Bursary payment has been confirmed and Registry clearance has been executed. Your student academic dossier is fully active. You may now print your official College Bursary Receipt and Registry Clearance Slip, or immediately access the Student Academic Portal.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/application/receipt"
                className="px-5 py-3 rounded-xl bg-white text-[#196855] hover:bg-emerald-50 font-bold text-sm flex items-center gap-2 transition-all shadow-md"
              >
                <Printer size={16} />
                <span>View & Print Bursary Receipt</span>
              </Link>

              <Link
                href="/application/clearance"
                className="px-5 py-3 rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300 font-bold text-sm flex items-center gap-2 transition-all shadow-md"
              >
                <FileText size={16} />
                <span>Download Matriculation Slip</span>
              </Link>

              <Link
                href="/student/dashboard"
                className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 transition-all border border-emerald-500/50"
              >
                <GraduationCap size={16} />
                <span>Proceed to Student Portal</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ELECTRONIC INVOICE CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white p-5 md:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Electronic Invoice Details
            </span>
            <h3 className="text-lg font-bold font-serif text-white mt-0.5">
              Remita Retrieval Reference (RRR)
            </h3>
          </div>

          <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-xl md:text-2xl font-mono font-bold tracking-wider text-amber-400 select-all">
              {invoice.rrr_number}
            </span>
            <button
              onClick={copyRRR}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors cursor-pointer"
              title="Copy RRR"
            >
              {copiedRRR ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 font-medium">Candidate Name</span>
              <p className="font-bold text-gray-900 mt-0.5">{candidateName}</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 font-medium">Application Number</span>
              <p className="font-bold text-gray-900 font-mono mt-0.5">{application.application_number}</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 font-medium">Course / Programme</span>
              <p className="font-bold text-gray-900 mt-0.5 truncate">
                {application.selected_programme?.programme?.name || 'IJMB Regular Sciences'}
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 font-medium">Invoice Status</span>
              <div className="mt-1">
                {invoice.status === 'paid' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 size={12} />
                    Paid & Cleared
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    <Clock size={12} />
                    Pending Payment
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT CHANNELS GATEWAY (IF NOT PAID) */}
      {!paymentSuccess && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 font-serif">
              Select Payment Channel
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Choose your preferred payment method to complete your institutional transaction securely.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab('card')}
              className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'card'
                  ? 'border-[#196855] text-[#196855] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard size={16} />
              <span>Debit / Credit Card</span>
            </button>

            <button
              onClick={() => setActiveTab('bank_transfer')}
              className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'bank_transfer'
                  ? 'border-[#196855] text-[#196855] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 size={16} />
              <span>Bank Transfer</span>
            </button>

            <button
              onClick={() => setActiveTab('ussd')}
              className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'ussd'
                  ? 'border-[#196855] text-[#196855] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <PhoneCall size={16} />
              <span>USSD Dial Code</span>
            </button>

            <button
              onClick={() => setActiveTab('branch')}
              className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'branch'
                  ? 'border-[#196855] text-[#196855] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText size={16} />
              <span>Bank Branch Slip</span>
            </button>
          </div>

          <div className="p-6 md:p-8">
            {/* 1. CARD TAB */}
            {activeTab === 'card' && (
              <div className="max-w-xl mx-auto space-y-6">
                <div className="bg-gradient-to-r from-emerald-800 to-[#196855] rounded-2xl p-6 text-white shadow-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                      Al-Hidayah Payment Gateway
                    </span>
                    <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-0.5 rounded-md">
                      VERVE / VISA / MASTERCARD
                    </span>
                  </div>

                  <div className="text-xl md:text-2xl font-mono tracking-widest pt-2">
                    {cardNumber}
                  </div>

                  <div className="flex justify-between items-end pt-2 text-xs">
                    <div>
                      <p className="text-emerald-200 text-[10px] uppercase font-bold">Card Holder</p>
                      <p className="font-bold tracking-wide uppercase">{candidateName}</p>
                    </div>
                    <div>
                      <p className="text-emerald-200 text-[10px] uppercase font-bold">Expires</p>
                      <p className="font-mono font-bold">{cardExpiry}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-[#196855] focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-[#196855] focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-[#196855] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={16} className="text-[#196855] shrink-0" />
                  <span>256-bit SSL encrypted institutional payment gateway with simulated 3D Secure verification.</span>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulatePayment('card')}
                  className="w-full py-4 rounded-xl bg-[#196855] hover:bg-[#124d3f] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying & Processing Payment...</span>
                  ) : (
                    <>
                      <span>Pay ₦25,000.00 Online</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 2. BANK TRANSFER TAB */}
            {activeTab === 'bank_transfer' && (
              <div className="max-w-xl mx-auto space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 text-sm">
                  <div className="font-bold flex items-center gap-2 mb-1">
                    <Sparkles size={16} className="text-amber-600" />
                    <span>Instant Dynamic Virtual Bank Account</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Transfer exactly ₦25,000.00 to the dedicated dynamic Remita account below using your mobile bank app or Internet banking. Verification is automatic upon receipt.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-xs text-gray-500 font-medium">Bank Name</span>
                    <span className="font-bold text-gray-900">Wema Bank / Remita Gateway</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-xs text-gray-500 font-medium">Account Name</span>
                    <span className="font-bold text-gray-900 text-right">Al-Hidayah College - Acceptance</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-xs text-gray-500 font-medium">Virtual Account Number</span>
                    <span className="font-mono font-black text-xl text-[#196855]">
                      {invoice.rrr_number.replace(/-/g, '')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Exact Amount</span>
                    <span className="font-mono font-bold text-base text-gray-900">₦25,000.00</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulatePayment('bank_transfer')}
                  className="w-full py-4 rounded-xl bg-[#196855] hover:bg-[#124d3f] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Confirming Bank Transfer with Central Bank Gateway...</span>
                  ) : (
                    <>
                      <span>I Have Completed The Transfer (Simulate Verification)</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 3. USSD TAB */}
            {activeTab === 'ussd' && (
              <div className="max-w-xl mx-auto space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center space-y-4">
                  <PhoneCall size={36} className="mx-auto text-[#196855]" />
                  <div>
                    <h4 className="font-bold text-gray-900">Dial USSD Code on Your Registered Phone</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Dial the shortcode from any Nigerian mobile network to authorize the ₦25,000 acceptance fee.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 font-mono text-2xl font-black text-[#196855] tracking-wider select-all">
                    *737*000*{invoice.rrr_number.replace(/-/g, '')}#
                  </div>

                  <p className="text-[11px] text-gray-400">
                    Supports GTBank, Zenith (*966#), Access (*901#), UBA (*919#), FirstBank (*894#).
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulatePayment('ussd')}
                  className="w-full py-4 rounded-xl bg-[#196855] hover:bg-[#124d3f] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying USSD Session...</span>
                  ) : (
                    <>
                      <span>Simulate USSD PIN Approval</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 4. BANK BRANCH TAB */}
            {activeTab === 'branch' && (
              <div className="max-w-xl mx-auto space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="text-[#196855]" size={28} />
                    <div>
                      <h4 className="font-bold text-gray-900">Commercial Bank Branch Payment</h4>
                      <p className="text-xs text-gray-500">
                        Pay over the counter at any commercial bank in Nigeria using Remita.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 bg-white p-4 rounded-xl border border-gray-200">
                    <p className="font-bold text-gray-800">Instructions for the Bank Teller:</p>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600">
                      <li>Inform the teller you are paying for <strong>Al-Hidayah College of Advanced Studies via Remita</strong>.</li>
                      <li>Provide your Remita Retrieval Reference (RRR): <strong className="font-mono text-gray-900">{invoice.rrr_number}</strong>.</li>
                      <li>Pay the total sum of <strong>₦25,000.00</strong>.</li>
                      <li>Collect your stamped bank teller with the Remita electronic receipt.</li>
                    </ol>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-3.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Printer size={16} />
                    <span>Print Invoice Advice</span>
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleSimulatePayment('bank_branch')}
                    className="flex-1 py-3.5 rounded-xl bg-[#196855] hover:bg-[#124d3f] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Verifying Teller...</span>
                    ) : (
                      <>
                        <span>Simulate Teller Confirmation</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
