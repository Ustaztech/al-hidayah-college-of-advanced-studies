import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { logAuditEvent } from '../../services/audit';
import { ScratchCard, StudentRecord, PaymentReceipt } from '../../types';
import { INSTITUTION_INFO, TUITION_SCHEDULE } from '../../data/ijmbData';
import {
  CreditCard,
  Receipt,
  Search,
  CheckCircle2,
  Plus,
  KeyRound,
  FileSpreadsheet,
  Building,
  ShieldCheck,
  Printer,
  Calendar,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export const BursaryWorkspace: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { addNotification } = useNotifications();

  // State hooks
  const [students, setStudents] = useState<StudentRecord[]>(() => db.getStudents());
  const [cards, setCards] = useState<ScratchCard[]>(() => db.getCards());
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(() => db.getReceipts());
  const [activeSubTab, setActiveSubTab] = useState<'receipts' | 'recordPayment' | 'scratchCards' | 'reconciliation'>('receipts');

  // New Payment Form
  const [payStudentMatric, setPayStudentMatric] = useState<string>(() => students[0]?.matric_number || '');
  const [payFeeType, setPayFeeType] = useState<string>('1st Installment (₦154,000)');
  const [payAmount, setPayAmount] = useState<number>(154000);
  const [payChannel, setPayChannel] = useState<'Bank Transfer' | 'Remita' | 'Paystack'>('Bank Transfer');
  const [paySuccess, setPaySuccess] = useState<string>('');

  // Scratch Card Generator State
  const [batchType, setBatchType] = useState<ScratchCard['card_type']>('APPLICATION');
  const [batchCount, setBatchCount] = useState<number>(25);
  const [batchPrice, setBatchPrice] = useState<number>(10500);
  const [batchSuccess, setBatchSuccess] = useState<string>('');

  // Search
  const [receiptSearch, setReceiptSearch] = useState<string>('');

  // Calculations
  const totalCollections = receipts.reduce((acc, r) => acc + (r.amountNgn || 0), 0);
  const totalCardsSold = cards.filter(c => c.status === 'Consumed').length;
  const cardRevenue = totalCardsSold * 10500;

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = students.find(s => s.matric_number === payStudentMatric);
    if (!targetStudent) {
      alert('Please select a student.');
      return;
    }

    const receipt = db.recordPaymentReceipt({
      studentId: targetStudent.id,
      matricNumber: targetStudent.matric_number,
      studentName: targetStudent.full_name,
      feeType: payFeeType,
      amountNgn: payAmount,
      paymentMethod: payChannel
    });

    setReceipts(db.getReceipts());
    setStudents(db.getStudents());

    // Audit Log
    logAuditEvent(
      currentUser?.name || 'Bursary Officer',
      role,
      'PAYMENT_RECEIVED',
      `₦${payAmount.toLocaleString()} recorded for ${targetStudent.full_name} (${receipt.receiptNumber}).`
    );

    addNotification({
      target_role: 'FINANCE_OFFICER',
      title: 'Payment Credited to Bursary Account',
      message: `₦${payAmount.toLocaleString()} recorded for ${targetStudent.full_name} (${receipt.receiptNumber}).`,
      category: 'Finance',
      priority: 'normal'
    });

    setPaySuccess(`Payment successfully booked! Official Receipt ${receipt.receiptNumber} generated.`);
    setTimeout(() => setPaySuccess(''), 4500);
  };

  const handleGenerateCards = (e: React.FormEvent) => {
    e.preventDefault();
    db.generateCardBatch(batchType, batchCount, batchPrice);
    setCards(db.getCards());

    logAuditEvent(
      currentUser?.name || 'College Bursar',
      role,
      'CARDS_GENERATED',
      `Generated batch of ${batchCount} ${batchType} cards at ₦${batchPrice.toLocaleString()} each.`
    );

    setBatchSuccess(`Successfully generated ${batchCount} new cryptographically hashed ${batchType} cards!`);
    setTimeout(() => setBatchSuccess(''), 4000);
  };

  const filteredReceipts = receipts.filter(r =>
    (r.receiptNumber || '').toLowerCase().includes(receiptSearch.toLowerCase()) ||
    (r.studentName || '').toLowerCase().includes(receiptSearch.toLowerCase()) ||
    (r.matricNumber || '').toLowerCase().includes(receiptSearch.toLowerCase())
  );

  return (
    <PortalLayout activeNav="Bursary" portalTitle="AHCAS Directorate of Bursary & Financial Administration">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>Total Bursary Collections</span>
              <Receipt className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              ₦{totalCollections.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100% reconciled to Treasury
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>Scratch Card Pin Revenue</span>
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              ₦{cardRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {totalCardsSold} of {cards.length} PINs activated
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>Total Invoiced Enrolment</span>
              <Building className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {students.length} Students
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              IJMB & Advanced Studies
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>Designated Study Centre</span>
              <ShieldCheck className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-2 truncate">
              {INSTITUTION_INFO.studyCentre}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Federal Capital Territory, Nigeria
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'receipts', label: 'Payment Receipts Ledger', icon: Receipt },
            { id: 'recordPayment', label: 'Record New Bursary Payment', icon: Plus },
            { id: 'scratchCards', label: 'Scratch Card Inventory & Generation', icon: KeyRound },
            { id: 'reconciliation', label: 'Fee Schedule & Bank Accounts', icon: Building }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* SubTab 1: Receipts Ledger */}
        {activeSubTab === 'receipts' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                  Official Payment Receipts Ledger
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time verifiable receipts recorded into the AHCAS institutional financial ledger.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={receiptSearch}
                  onChange={(e) => setReceiptSearch(e.target.value)}
                  placeholder="Search receipt, student or matric..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    <th className="py-3 px-3">Receipt No</th>
                    <th className="py-3 px-3">Student / Payer</th>
                    <th className="py-3 px-3">Matric No</th>
                    <th className="py-3 px-3">Fee Type</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Channel</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredReceipts.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {r.receiptNumber}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {r.studentName}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {r.matricNumber || 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {r.feeType}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        ₦{(r.amountNgn || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {r.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {r.paidAt}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" /> {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a
                          href={`/verify/receipt/${r.receiptNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-bold text-[11px]"
                        >
                          Verify Receipt
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SubTab 2: Record Payment */}
        {activeSubTab === 'recordPayment' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                Record & Issue Official Bursary Payment Receipt
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log direct bank transfers, scratch card collections, or teller payments directly into the college database.
              </p>
            </div>

            {paySuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{paySuccess}</span>
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Registered Student (by Matric Number)
                </label>
                <select
                  value={payStudentMatric}
                  onChange={(e) => setPayStudentMatric(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  {students.map(s => (
                    <option key={s.matric_number} value={s.matric_number}>
                      {s.matric_number} - {s.full_name} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Fee Classification
                </label>
                <select
                  value={payFeeType}
                  onChange={(e) => {
                    setPayFeeType(e.target.value);
                    if (e.target.value.includes('154,000')) setPayAmount(154000);
                    else if (e.target.value.includes('105,500')) setPayAmount(105500);
                    else if (e.target.value.includes('258,500')) setPayAmount(258500);
                    else if (e.target.value.includes('10,500')) setPayAmount(10500);
                    else if (e.target.value.includes('17,000')) setPayAmount(17000);
                  }}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="1st Installment (₦154,000)">1st Installment (₦154,000) - Acceptance & Tuitions</option>
                  <option value="2nd Installment (₦105,500)">2nd Installment (₦105,500) - Mid-Session</option>
                  <option value="Full Session (₦258,500)">Full Session One-Off (₦258,500 - 1% Discounted)</option>
                  <option value="Application Form (₦10,500)">Application Form & Screening Fee (₦10,500)</option>
                  <option value="Result Collection & Certificate (₦17,000)">Result Collection & Certificate (₦17,000)</option>
                  <option value="Convocation Gown Hire & Regalia (₦10,000)">Convocation Gown Hire & Regalia (₦10,000)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Amount Paid (₦)
                </label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Channel
                </label>
                <select
                  value={payChannel}
                  onChange={(e) => setPayChannel(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Bank Transfer">Bank Transfer (College Designated Account)</option>
                  <option value="Remita">Remita RRR Electronic Payment</option>
                  <option value="Paystack">Paystack Secured Gateway</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4" /> Issue and Validate Official Payment Receipt
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SubTab 3: Scratch Cards */}
        {activeSubTab === 'scratchCards' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                Batch Generate Institutional Scratch Cards & PINs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate secure 12-digit serials and 10-digit PINs for Admission Applications, Result Checkers, and Portal Clearance.
              </p>

              {batchSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  {batchSuccess}
                </div>
              )}

              <form onSubmit={handleGenerateCards} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Card Purpose
                  </label>
                  <select
                    value={batchType}
                    onChange={(e) => setBatchType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="APPLICATION">APPLICATION (Admission Form)</option>
                    <option value="RESULT_CHECKER">RESULT_CHECKER (Semester & IJMB Grades)</option>
                    <option value="ACCEPTANCE">ACCEPTANCE (Admission Clearance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Batch Quantity
                  </label>
                  <input
                    type="number"
                    value={batchCount}
                    min={1}
                    max={200}
                    onChange={(e) => setBatchCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Card Face Value (₦)
                  </label>
                  <input
                    type="number"
                    value={batchPrice}
                    onChange={(e) => setBatchPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Generate Batch
                  </button>
                </div>
              </form>
            </div>

            {/* Inventory table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Scratch Card Inventory ({cards.length} Total)</h4>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase font-semibold">
                      <th className="py-2.5 px-3">Serial Number</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">PIN Hash</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Used By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {cards.slice(0, 30).map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">{c.serial_number}</td>
                        <td className="py-2.5 px-3 font-semibold text-emerald-700 dark:text-emerald-400">{c.card_type}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">•••• •••• ••••</td>
                        <td className="py-2.5 px-3 font-bold">₦{c.price_ngn.toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'Consumed' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'}`}>
                            {c.status === 'Consumed' ? 'ACTIVATED / USED' : 'AVAILABLE IN TREASURY'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                          {c.consumed_by || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SubTab 4: Fee Schedule & Bank Accounts */}
        {activeSubTab === 'reconciliation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-600" /> College Approved Bank Accounts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official approved depository accounts for direct student payments and wire transfers.
              </p>
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Primary Collections Account</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">Jaiz Bank Plc</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-mono">Account No: <strong>0012894561</strong></div>
                  <div className="text-xs text-slate-500">Account Name: <strong>Al-Hidayah College of Advanced Studies</strong></div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase">Secondary Operations Account</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">Fidelity Bank Plc</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-mono">Account No: <strong>5060098412</strong></div>
                  <div className="text-xs text-slate-500">Account Name: <strong>Al-Hidayah College of Advanced Studies</strong></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Statutory Fee Schedule (2025/2026)
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Application Form & Processing</span>
                  <span className="font-bold text-slate-900 dark:text-white">₦10,500</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Acceptance & 1st Installment Tuition</span>
                  <span className="font-bold text-slate-900 dark:text-white">₦154,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">2nd Installment Tuition</span>
                  <span className="font-bold text-slate-900 dark:text-white">₦105,500</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Total Session Tuition (Standard)</span>
                  <span className="font-bold text-slate-900 dark:text-white">₦259,500</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">One-Off Full Session Discount</span>
                  <span className="font-bold text-emerald-600">₦258,500 (₦1,000 Saved)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Academic Regalia & Convocation Gown</span>
                  <span className="font-bold text-slate-900 dark:text-white">₦10,000 (₦3,000 Refundable)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};
export default BursaryWorkspace;
