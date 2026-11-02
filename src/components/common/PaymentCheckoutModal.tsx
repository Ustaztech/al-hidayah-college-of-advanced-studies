import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building2,
  FileCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import {
  INSTITUTIONAL_BANK_ACCOUNTS,
  generateRemitaRRR,
  simulatePaystackPayment,
  simulateRemitaPayment,
  simulateBankTransferSubmission
} from '../../services/paymentGateway';
import { db, PaymentReceipt } from '../../services/db';
import { logAuditEvent } from '../../services/audit';
import { sendNotification } from '../../services/notifications';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountNgn: number;
  feeDescription: string;
  payerName: string;
  payerEmail: string;
  studentId?: string;
  matricNumber?: string;
  applicantRef?: string;
  onPaymentSuccess: (receipt: PaymentReceipt) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  amountNgn,
  feeDescription,
  payerName,
  payerEmail,
  studentId,
  matricNumber,
  applicantRef,
  onPaymentSuccess
}) => {
  const [activeChannel, setActiveChannel] = useState<'Paystack' | 'Remita' | 'Bank Transfer'>('Paystack');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successReceipt, setSuccessReceipt] = useState<PaymentReceipt | null>(null);

  // Paystack form states
  const [cardNumber, setCardNumber] = useState('5399 •••• •••• 4219');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('821');

  // Remita state
  const [remitaRRR, setRemitaRRR] = useState(() => generateRemitaRRR());

  // Bank transfer state
  const [selectedBankIndex, setSelectedBankIndex] = useState(0);
  const [tellerRef, setTellerRef] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (!isOpen) return null;

  const handleCopyAccount = (acc: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFinalizePayment = (
    channel: 'Paystack' | 'Remita' | 'Bank Transfer',
    receiptNumber: string,
    reference: string
  ) => {
    const receipt = db.recordPaymentReceipt({
      studentId: studentId || applicantRef || 'EXT-PAYER',
      matricNumber: matricNumber || applicantRef || 'PENDING',
      studentName: payerName,
      feeType: feeDescription,
      amountNgn: amountNgn,
      paymentMethod: channel
    });

    // Override generated ref & receipt if provided
    receipt.receiptNumber = receiptNumber;
    receipt.reference = reference;

    logAuditEvent(
      payerName,
      studentId ? 'STUDENT' : 'APPLICANT',
      'FEE_PAYMENT_VERIFIED',
      `Payment of ₦${amountNgn.toLocaleString()} for ${feeDescription} settled via ${channel}. Receipt #${receiptNumber}`
    );

    sendNotification({
      recipient_id: studentId || applicantRef || 'GENERAL',
      recipient_role: studentId ? 'STUDENT' : 'APPLICANT',
      title: 'Official Payment Cleared',
      message: `Your payment of ₦${amountNgn.toLocaleString()} for "${feeDescription}" has been verified and recorded into the bursary ledger. Receipt #${receiptNumber}.`,
      type: 'ACADEMIC'
    });

    setSuccessReceipt(receipt);
    onPaymentSuccess(receipt);
  };

  const handleProcessPaystack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tx = await simulatePaystackPayment({
        amountNgn,
        description: feeDescription,
        payerName,
        payerEmail,
        studentId,
        matricNumber,
        applicantRef
      });
      handleFinalizePayment('Paystack', tx.receiptNumber, tx.reference);
    } catch {
      setError('Payment gateway timeout. Please check your credentials and retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRemita = async () => {
    setError('');
    setLoading(true);

    try {
      const tx = await simulateRemitaPayment({
        amountNgn,
        description: feeDescription,
        payerName,
        payerEmail,
        rrr: remitaRRR,
        studentId,
        matricNumber,
        applicantRef
      });
      handleFinalizePayment('Remita', tx.receiptNumber, tx.reference);
    } catch {
      setError('Remita verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessBankTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tellerRef.trim()) {
      setError('Please enter your Bank Session ID, Teller Number, or Transaction Reference.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const tx = await simulateBankTransferSubmission({
        amountNgn,
        description: feeDescription,
        payerName,
        payerEmail,
        selectedBank: INSTITUTIONAL_BANK_ACCOUNTS[selectedBankIndex].bankName,
        tellerOrSessionRef: tellerRef,
        studentId,
        matricNumber,
        applicantRef
      });
      handleFinalizePayment('Bank Transfer', tx.receiptNumber, tx.reference);
    } catch {
      setError('Could not verify bank transfer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]">

        {/* Modal Top Bar */}
        <div className="bg-[#196855] text-white p-5 flex items-center justify-between border-b-2 border-[#e69912]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl text-amber-300">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif leading-tight">
                AHCAS Secured Payment Gateway
              </h3>
              <p className="text-[11px] text-emerald-100">
                Official Bursary Settlement Desk • 256-Bit SSL Encrypted
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Fee Description
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {feeDescription}
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Payer: {payerName} {matricNumber ? `(${matricNumber})` : ''}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#196855] dark:text-emerald-400 block">
              Total Payable
            </span>
            <span className="text-2xl font-black font-mono text-[#196855] dark:text-emerald-400">
              ₦{amountNgn.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Body content */}
        {!successReceipt ? (
          <div className="p-6 overflow-y-auto space-y-6">

            {/* Gateway Channels Tab Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => { setActiveChannel('Paystack'); setError(''); }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeChannel === 'Paystack'
                    ? 'bg-[#196855] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CreditCard size={15} />
                <span>Paystack</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveChannel('Remita'); setError(''); }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeChannel === 'Remita'
                    ? 'bg-[#196855] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 size={15} />
                <span>Remita RRR</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveChannel('Bank Transfer'); setError(''); }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeChannel === 'Bank Transfer'
                    ? 'bg-[#196855] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileCheck size={15} />
                <span>Bank Transfer</span>
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            {/* CHANNEL 1: PAYSTACK INLINE */}
            {activeChannel === 'Paystack' && (
              <form onSubmit={handleProcessPaystack} className="space-y-4">
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-600" />
                    <span>Paystack Test & Live Gateway Channel</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-200 font-bold">
                    PCI-DSS Level 1
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Card Number (Visa / Mastercard / Verve)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      CVV / Security Code
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#196855] hover:bg-[#124d3f] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Processing Secured Paystack Checkout...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₦{amountNgn.toLocaleString()} with Paystack</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* CHANNEL 2: REMITA e-COLLECTION */}
            {activeChannel === 'Remita' && (
              <div className="space-y-4">
                <div className="p-5 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/40 text-center space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400 block">
                    Remita Retrieval Reference (RRR)
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-black font-mono tracking-wider text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-700">
                      {remitaRRR}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount(remitaRRR)}
                      className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors"
                      title="Copy RRR"
                    >
                      {copiedAccount ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-900 dark:text-slate-300 max-w-sm mx-auto">
                    Use this RRR code to pay online at remita.net or present it at any commercial bank branch nationwide.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">MDA / Beneficiary:</span>
                    <span className="font-bold">{INSTITUTION_INFO.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service Type:</span>
                    <span className="font-bold">{feeDescription}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount:</span>
                    <span className="font-bold text-[#196855] dark:text-emerald-400">₦{amountNgn.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessRemita}
                  disabled={loading}
                  className="w-full py-3 bg-[#e69912] hover:bg-[#d48806] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Verifying Remita RRR Settlement...</span>
                    </>
                  ) : (
                    <>
                      <span>Simulate Remita Bank Clearance</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* CHANNEL 3: DIRECT INSTITUTIONAL BANK TRANSFER */}
            {activeChannel === 'Bank Transfer' && (
              <form onSubmit={handleProcessBankTransfer} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Select Official Institutional Bank Account
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {INSTITUTIONAL_BANK_ACCOUNTS.map((bank, bIdx) => (
                      <button
                        key={bIdx}
                        type="button"
                        onClick={() => setSelectedBankIndex(bIdx)}
                        className={`p-3 rounded-xl border text-left transition-all text-xs ${
                          selectedBankIndex === bIdx
                            ? 'border-[#196855] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                        }`}
                      >
                        <span className="font-bold block truncate">{bank.bankName.split(' ')[0]}</span>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{bank.accountNumber}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Bank Details Card */}
                {(() => {
                  const b = INSTITUTIONAL_BANK_ACCOUNTS[selectedBankIndex];
                  return (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Bank Name</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{b.bankName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount(b.accountNumber)}
                          className="flex items-center gap-1 text-[11px] text-[#196855] dark:text-emerald-400 font-bold hover:underline"
                        >
                          {copiedAccount ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedAccount ? 'Copied' : 'Copy Acc Number'}</span>
                        </button>
                      </div>

                      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-sm font-black font-mono tracking-widest text-[#196855] dark:text-emerald-400">
                          {b.accountNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">{b.accountName}</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Bank Session ID / Narration / Teller Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 090267234821 or JAIZ-TRF-0012"
                    value={tellerRef}
                    onChange={e => setTellerRef(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#196855] hover:bg-[#124d3f] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Submitting Bank Transfer for Reconciliation...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Transfer for Instant Clearance</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Payment Reconciled & Approved
              </span>
              <h3 className="text-xl font-black font-serif text-slate-900 dark:text-white">
                Transaction Successful!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your payment has been logged in the Bursary Directorate ledger and your clearance status is updated.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Official Receipt #:</span>
                <span className="font-mono font-bold">{successReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gateway Ref:</span>
                <span className="font-mono font-bold text-[11px]">{successReceipt.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-[#196855] dark:text-emerald-400">₦{successReceipt.amountNgn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-semibold">{successReceipt.paymentMethod}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#196855] hover:bg-[#124d3f] text-white font-bold rounded-xl text-xs transition-colors shadow-md"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
