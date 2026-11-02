'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowRight,
  Download,
  GraduationCap
} from 'lucide-react';
import { FeePayment, FeeInvoice, Application, AuthSessionUser } from '@/lib/types';

interface ReceiptClientProps {
  user: AuthSessionUser;
  payment: FeePayment;
  invoice: FeeInvoice;
  application: Application;
}

export const ReceiptClient: React.FC<ReceiptClientProps> = ({
  user,
  payment,
  invoice,
  application
}) => {
  const candidateName = application.personal_details
    ? `${application.personal_details.surname} ${application.personal_details.first_name} ${application.personal_details.middle_name || ''}`.trim()
    : user.profile.full_name;

  const programmeName = application.selected_programme?.programme?.name || 'IJMB Regular Programme (Sciences)';

  const formattedDate = new Date(payment.transaction_date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-xs print:hidden">
        <Link
          href="/application/dashboard"
          className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/application/clearance"
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <GraduationCap size={15} />
            <span>Matriculation Clearance Slip</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="px-5 py-2 rounded-xl bg-[#196855] hover:bg-[#124d3f] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Printer size={15} />
            <span>Print Official Receipt</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE OFFICIAL BURSARY RECEIPT */}
      <div className="bg-white rounded-2xl border border-gray-300 p-8 md:p-12 shadow-md print:shadow-none print:border-none print:p-0 space-y-8 relative overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <GraduationCap size={480} />
        </div>

        {/* Institution Header */}
        <div className="text-center border-b-2 border-[#196855] pb-6 space-y-2 relative z-10">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-xl bg-emerald-50 border border-emerald-200 p-1 flex items-center justify-center shadow-xs">
              <Image
                src="/official-logo.jpg"
                alt="Al-Hidayah Logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight font-serif uppercase">
            AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Affiliated to Interim Joint Matriculation Board (IJMB Study Centre 029) • Abaji, FCT-Abuja, Nigeria
          </p>
          <div className="pt-1">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 text-white font-serif">
              DIRECTORATE OF BURSARY & FINANCIAL SERVICES
            </span>
          </div>
          <p className="text-xs font-bold text-[#196855] tracking-wide uppercase pt-1">
            Official Electronic Bursary Receipt
          </p>
        </div>

        {/* Key Receipt Identifiers Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs relative z-10">
          <div>
            <span className="text-gray-500 font-medium block">Receipt Number:</span>
            <span className="font-mono font-bold text-gray-900 text-sm mt-0.5 block">
              {payment.receipt_number}
            </span>
          </div>

          <div>
            <span className="text-gray-500 font-medium block">Remita RRR:</span>
            <span className="font-mono font-bold text-[#196855] text-sm mt-0.5 block">
              {invoice.rrr_number}
            </span>
          </div>

          <div>
            <span className="text-gray-500 font-medium block">Payment Date & Time:</span>
            <span className="font-bold text-gray-900 mt-0.5 block">
              {formattedDate}
            </span>
          </div>

          <div>
            <span className="text-gray-500 font-medium block">Payment Channel:</span>
            <span className="font-bold text-emerald-800 uppercase mt-0.5 block">
              {payment.payment_method.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Candidate / Payer Dossier */}
        <div className="space-y-3 relative z-10 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-gray-500 text-[11px] border-b pb-1">
            Payer & Candidate Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 block">Candidate Full Name:</span>
              <span className="text-sm font-bold text-gray-900 uppercase block">{candidateName}</span>
            </div>

            <div>
              <span className="text-gray-500 block">Application Number:</span>
              <span className="text-sm font-bold font-mono text-gray-900 block">{application.application_number}</span>
            </div>

            <div>
              <span className="text-gray-500 block">Academic Programme Admitted:</span>
              <span className="text-sm font-bold text-gray-900 block">{programmeName}</span>
            </div>

            <div>
              <span className="text-gray-500 block">Academic Session:</span>
              <span className="text-sm font-bold text-gray-900 block">
                {application.admission_session?.name || '2026/2027 Academic Session'}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Itemization Table */}
        <div className="relative z-10">
          <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3 border-b">S/N</th>
                <th className="py-2.5 px-3 border-b">Fee Item Description</th>
                <th className="py-2.5 px-3 border-b">Session</th>
                <th className="py-2.5 px-3 border-b text-right">Amount (NGN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-3 font-mono">01</td>
                <td className="py-3 px-3">
                  <div className="font-bold text-gray-900">{invoice.fee_name}</div>
                  <div className="text-[11px] text-gray-500">Official Non-Refundable Admission Acceptance Levy</div>
                </td>
                <td className="py-3 px-3 font-mono text-gray-600">2026/2027</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                  ₦{payment.amount_paid.toLocaleString()}.00
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50 font-bold">
              <tr>
                <td colSpan={3} className="py-3 px-3 text-right uppercase text-gray-700">
                  Total Amount Paid:
                </td>
                <td className="py-3 px-3 text-right font-mono font-black text-sm text-[#196855]">
                  ₦{payment.amount_paid.toLocaleString()}.00
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 text-xs text-emerald-900 mt-2 font-medium">
            <strong>Amount in words:</strong> Twenty-Five Thousand Naira Only (NGN 25,000.00).
          </div>
        </div>

        {/* Security Verification & Signatures */}
        <div className="pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 items-end gap-6 relative z-10 text-xs">
          {/* Barcode & Security stamp */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <ShieldCheck size={16} />
              <span>Certified College Financial Instrument</span>
            </div>
            {/* Simulated barcode */}
            <div className="bg-gray-100 p-2 rounded border border-gray-300 inline-block font-mono text-[9px] tracking-widest text-center">
              <div className="h-8 flex items-center justify-center space-x-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-full bg-black ${i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-0.5' : 'w-1.5'}`}
                  />
                ))}
              </div>
              <span className="block mt-1 text-[8px] text-gray-600">
                {invoice.rrr_number} • {payment.receipt_number}
              </span>
            </div>
            <p className="text-[10px] text-gray-400">
              Generated automatically by the Integrated Bursary Payment Portal. No physical signature required.
            </p>
          </div>

          {/* Official Signatory Box */}
          <div className="text-right space-y-1">
            <div className="inline-block text-center border-b border-gray-400 pb-1 px-8">
              <span className="font-serif italic text-base text-gray-700 font-bold block">
                M. A. Haruna (FCA)
              </span>
            </div>
            <span className="block font-bold text-gray-900 uppercase text-[11px]">
              Bursar & Chief Financial Officer
            </span>
            <span className="block text-[10px] text-gray-500">
              Al-Hidayah College of Advanced Studies, Abaji
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
