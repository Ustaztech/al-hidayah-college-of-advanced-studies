import React from 'react';
import { Link } from 'react-router-dom';
import { AdmissionsGuide } from '../../components/home/AdmissionsGuide';
import { CreditCard, FileCheck, UserCheck, HelpCircle } from 'lucide-react';

export const Admissions: React.FC = () => {
  return (
    <div className="py-12 bg-white dark:bg-[#1A222C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="bg-[#006B35] text-white p-8 sm:p-12 rounded-3xl border-b-4 border-[#D4A62A] space-y-4">
          <span className="px-3 py-1 bg-amber-400 text-black text-xs font-bold rounded-full uppercase">
            2026/2027 Admissions Open
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            AHCAS Admissions Portal & Guidelines
          </h1>
          <p className="text-sm text-emerald-100 max-w-2xl">
            Welcome to the Al-Hidayah College of Advanced Studies, Abaji online admissions hub. Apply for accredited ND, HND, and IJMB programs.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/apply/register"
              className="px-6 py-3 bg-[#D4A62A] hover:bg-[#b88d1d] text-black font-extrabold rounded-xl text-sm"
            >
              Start Application Form →
            </Link>
            <Link
              to="/admissions/status"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm border border-white/20"
            >
              Check Admission Status
            </Link>
          </div>
        </div>

        <AdmissionsGuide />

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admissions/requirements" className="p-6 bg-[#F3F6F3] dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
            <h3 className="font-bold text-base text-gray-900 dark:text-white font-serif mb-2">Entry Requirements</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">View WAEC/NECO/NABTEB O’Level credit requirements & JAMB cut-off marks.</p>
          </Link>
          <Link to="/admissions/status" className="p-6 bg-[#F3F6F3] dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
            <h3 className="font-bold text-base text-gray-900 dark:text-white font-serif mb-2">Scratch Card Verification</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Verify serial number & PIN credentials for application and status checking.</p>
          </Link>
          <Link to="/faqs" className="p-6 bg-[#F3F6F3] dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
            <h3 className="font-bold text-base text-gray-900 dark:text-white font-serif mb-2">Admissions FAQs</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Frequently asked questions regarding acceptance fees, hostels, and resumption.</p>
          </Link>
        </div>

      </div>
    </div>
  );
};
