'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Building2,
  Printer,
  ExternalLink,
  PlusCircle,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import { FeeInvoice, AuthSessionUser } from '@/lib/types';
import { PortalHeader } from '@/components/layout/PortalHeader';
import { PortalSidebar } from '@/components/layout/PortalSidebar';

type HydratedInvoice = FeeInvoice & { application?: any; applicant?: any };

interface BursaryClientProps {
  user: AuthSessionUser;
  initialInvoices: HydratedInvoice[];
  counts: any;
}

export const BursaryClient: React.FC<BursaryClientProps> = ({
  user,
  initialInvoices,
  counts
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [invoices, setInvoices] = useState<HydratedInvoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [feeTypeFilter, setFeeTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<HydratedInvoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Modal form states
  const [bankName, setBankName] = useState('Jaiz Bank Plc');
  const [tellerNumber, setTellerNumber] = useState('');
  const [payerName, setPayerName] = useState('');

  // Filter list
  const filteredInvoices = invoices.filter(inv => {
    if (feeTypeFilter !== 'all' && inv.fee_type !== feeTypeFilter) return false;
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRRR = inv.rrr_number.toLowerCase().includes(q);
      const matchApplicant = inv.applicant?.full_name?.toLowerCase().includes(q) || false;
      const matchAppNo = inv.application?.application_number?.toLowerCase().includes(q) || false;
      const matchReceipt = inv.payment?.receipt_number?.toLowerCase().includes(q) || false;
      return matchRRR || matchApplicant || matchAppNo || matchReceipt;
    }
    return true;
  });

  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const paidCount = invoices.filter(i => i.status === 'paid').length;
  const pendingCount = invoices.filter(i => i.status === 'pending').length;

  const handleRecordOfflinePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setIsSubmitting(true);
    setModalError(null);

    try {
      const res = await fetch('/api/admin/bursary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          tellerNumber,
          bankName,
          payerName: payerName || selectedInvoice.applicant?.full_name
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to record payment');
      }

      // Update local state
      setInvoices(prev =>
        prev.map(inv => (inv.id === data.invoice.id ? { ...inv, ...data.invoice, payment: data.payment } : inv))
      );

      setIsModalOpen(false);
      setSelectedInvoice(null);
      setTellerNumber('');
    } catch (err: any) {
      setModalError(err.message || 'Payment reconciliation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PortalSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        portalType="admin"
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <PortalHeader
          user={user}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          portalTitle="Bursary & Financial Services"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full pb-16">
          {/* Top Banner */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#196855]/10 text-[#196855] border border-[#196855]/20">
                  Institutional Bursary Desk
                </span>
                <span className="text-xs text-gray-400 font-mono">Real-time Remita Invoicing & Settlements</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight font-serif">
                Bursary & Electronic Payments Reconciliation
              </h1>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Monitor Remita Retrieval References (RRRs), audit incoming candidate tuition & acceptance payments, reconcile commercial bank branch tellers, and review bursary transaction ledgers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
              >
                <Printer size={15} />
                <span>Export Financial Ledger</span>
              </button>
            </div>
          </div>

          {/* Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Reconciled Revenue</p>
                <p className="text-2xl font-black font-mono text-[#196855] mt-1">
                  ₦{totalRevenue.toLocaleString()}.00
                </p>
                <span className="text-[11px] text-emerald-600 font-medium">Bursary Settled</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#196855] flex items-center justify-center">
                <DollarSign size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Paid Invoices</p>
                <p className="text-2xl font-black font-mono text-gray-900 mt-1">{paidCount}</p>
                <span className="text-[11px] text-emerald-600 font-medium">Verified Transactions</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Electronic Invoices</p>
                <p className="text-2xl font-black font-mono text-amber-600 mt-1">{pendingCount}</p>
                <span className="text-[11px] text-amber-700 font-medium">Awaiting Candidate Payment</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Matriculation Clearances</p>
                <p className="text-2xl font-black font-mono text-slate-800 mt-1">
                  {counts.matriculatedCount || paidCount}
                </p>
                <span className="text-[11px] text-gray-500 font-medium">Auto-Cleared Cohort</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by RRR number, Candidate Name, Application Number, Receipt Ref..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#196855] focus:border-transparent outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Filter size={14} className="text-gray-400" />
                <select
                  value={feeTypeFilter}
                  onChange={e => setFeeTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-gray-700 outline-none"
                >
                  <option value="all">All Fee Categories</option>
                  <option value="acceptance_fee">Acceptance Fee (₦25,000)</option>
                  <option value="tuition_fee">Tuition Fees</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-gray-700 outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid & Cleared</option>
                  <option value="pending">Pending Payment</option>
                </select>
              </div>
            </div>
          </div>

          {/* Invoices Reconciliation Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">
                Electronic Invoices & Payment Ledger ({filteredInvoices.length})
              </h3>
              <span className="text-xs text-gray-500 font-medium">Sorted by creation date</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px] border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">RRR / Invoice No</th>
                    <th className="py-3 px-4">Candidate & App No</th>
                    <th className="py-3 px-4">Fee Description</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Payment Channel / Ref</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400">
                        No matching billing invoices found.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map(inv => {
                      const applicantName = inv.applicant?.full_name || inv.application?.personal_details?.surname || 'Candidate';
                      const appNo = inv.application?.application_number || 'AHCAS/APP/2026/...';
                      const isPaid = inv.status === 'paid';

                      return (
                        <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                            <span className="text-[#196855]">{inv.rrr_number}</span>
                            <span className="block text-[10px] text-gray-400 font-mono font-normal">
                              {new Date(inv.created_at).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-gray-900 block">{applicantName}</span>
                            <span className="font-mono text-[10px] text-gray-500 block">{appNo}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-gray-800 block">{inv.fee_name}</span>
                            <span className="text-[10px] text-gray-500 block">{inv.session_name || '2026/2027'}</span>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                            ₦{inv.amount.toLocaleString()}.00
                          </td>

                          <td className="py-3.5 px-4">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 size={11} />
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                <Clock size={11} />
                                Pending
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {isPaid && inv.payment ? (
                              <div>
                                <span className="font-bold text-gray-900 uppercase text-[11px] block">
                                  {inv.payment.payment_method.replace('_', ' ')}
                                </span>
                                <span className="font-mono text-[10px] text-emerald-700 block">
                                  {inv.payment.receipt_number}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-[11px]">Awaiting settlement</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {isPaid && inv.payment ? (
                              <Link
                                href={`/application/receipt?receiptNumber=${inv.payment.receipt_number}`}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#196855] hover:bg-emerald-100 font-bold text-xs transition"
                              >
                                <FileText size={13} />
                                <span>Receipt</span>
                              </Link>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setPayerName(applicantName);
                                  setIsModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
                              >
                                <Building2 size={13} />
                                <span>Confirm Branch Teller</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RECORD OFFLINE BANK PAYMENT MODAL */}
          {isModalOpen && selectedInvoice && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 font-serif">
                      Record Commercial Bank Branch Payment
                    </h3>
                    <p className="text-xs text-gray-500">
                      Manual Bursary reconciliation for over-the-counter Remita cash payments.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {modalError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{modalError}</span>
                  </div>
                )}

                <form onSubmit={handleRecordOfflinePayment} className="space-y-4 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Remita RRR:</span>
                      <span className="font-mono font-bold text-gray-900">{selectedInvoice.rrr_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-mono font-bold text-[#196855]">
                        ₦{selectedInvoice.amount.toLocaleString()}.00
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#196855] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">
                      Bank Teller / Reference Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TEL-8941209"
                      value={tellerNumber}
                      onChange={e => setTellerNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono focus:ring-2 focus:ring-[#196855] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">
                      Depositor / Payer Name
                    </label>
                    <input
                      type="text"
                      required
                      value={payerName}
                      onChange={e => setPayerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#196855] outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 rounded-xl bg-[#196855] hover:bg-[#124d3f] text-white font-bold transition shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? 'Confirming...' : 'Confirm & Clear Student'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};
