import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PaymentReceipt } from '../../services/db';
import { INSTITUTION_INFO } from '../../data/ijmbData';
import { Printer, X, ShieldCheck, CheckCircle2, Receipt } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: PaymentReceipt;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt
}) => {
  if (!isOpen) return null;

  const securityRef = `AHCAS-RCP-${receipt.receiptNumber.replace(/[^a-zA-Z0-9]/g, '-')}`;
  const verificationUrl = `${INSTITUTION_INFO.website}/verify/RECEIPT/${receipt.receiptNumber}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-6 border-4 border-[#196855] flex flex-col max-h-[95vh]">

        {/* Modal Controls Bar */}
        <div className="bg-[#0B132B] text-white p-3.5 px-6 flex justify-between items-center no-print shrink-0 border-b-2 border-[#e69912]">
          <div className="flex items-center gap-2">
            <Receipt className="text-[#e69912]" size={18} />
            <span className="font-bold text-xs sm:text-sm">
              Official AHCAS Electronic Payment Receipt
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e69912] hover:bg-[#d48806] text-slate-950 font-extrabold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Receipt</span>
            </button>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-300">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Receipt */}
        <div className="p-8 sm:p-10 space-y-6 printable-document bg-white font-serif overflow-y-auto text-xs text-slate-900 leading-normal">

          {/* Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-[#196855] pb-4">
            <div className="flex items-center gap-3">
              <img src="/official-logo.jpg" alt="AHCAS Crest" className="h-16 w-auto object-contain" />
              <div>
                <span className="text-[9px] font-black uppercase text-[#e69912] tracking-widest font-sans block">
                  BURSARY DIRECTORATE & FINANCE DIVISION
                </span>
                <h1 className="text-lg sm:text-xl font-black text-[#196855] uppercase tracking-tight">
                  AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
                </h1>
                <p className="text-[11px] font-bold text-slate-800 uppercase font-sans">
                  Abaji Study Centre • FCT-Abuja, Nigeria
                </p>
                <p className="text-[10px] text-slate-500 font-sans">
                  Tel: {INSTITUTION_INFO.phone} • Email: bursary@alhidayahcollege.edu.ng
                </p>
              </div>
            </div>

            <div className="text-right border-l-2 border-slate-200 pl-3 shrink-0">
              <QRCodeSVG value={verificationUrl} size={60} />
              <span className="text-[8px] font-mono text-slate-500 block mt-1">
                Ref: {securityRef}
              </span>
            </div>
          </div>

          {/* Receipt Title & Number */}
          <div className="bg-[#196855] text-white py-1.5 px-4 rounded-lg flex items-center justify-between text-center font-sans">
            <span className="text-[11px] font-black uppercase tracking-wider">
              OFFICIAL ELECTRONIC RECEIPT OF PAYMENT
            </span>
            <span className="text-[11px] font-mono font-bold bg-[#e69912] text-slate-950 px-2 py-0.5 rounded">
              RECEIPT NO: {receipt.receiptNumber}
            </span>
          </div>

          {/* Payment Details Table */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans space-y-3">
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Payer / Student Name:</span>
                <span className="font-bold text-slate-900">{receipt.studentName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Matric / Application No:</span>
                <span className="font-mono font-bold text-[#196855]">{receipt.matricNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Payment Date & Time:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(receipt.paidAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })} ({new Date(receipt.paidAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Gateway Channel:</span>
                <span className="font-semibold text-slate-800">{receipt.paymentMethod}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Transaction Reference:</span>
                <span className="font-mono text-[11px] text-slate-700">{receipt.reference}</span>
              </div>
            </div>

            {/* Fee Itemization */}
            <div className="pt-3 border-t border-slate-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-[10px] font-bold uppercase text-slate-500">
                    <th className="text-left pb-1">Payment Description</th>
                    <th className="text-right pb-1">Amount Settled</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 font-bold text-slate-900">{receipt.feeType}</td>
                    <td className="py-2 text-right font-black font-mono text-[#196855] text-base">
                      ₦{receipt.amountNgn.toLocaleString()}.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Status Stamp */}
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-700" />
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wide">
                  Payment Status: {receipt.status.toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded">
                BURSARY CLEARED
              </span>
            </div>
          </div>

          {/* Authorized Signature Block */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-slate-300 font-sans text-center">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center">
                <span className="font-serif italic text-slate-600 font-bold">{receipt.studentName}</span>
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-600 block mt-1">
                Payer Signature
              </span>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center">
                <span className="font-serif italic text-[#196855] font-bold">Bursar / Accounts Officer</span>
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-600 block mt-1">
                Authorized Bursary Stamp & Officer
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
