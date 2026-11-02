'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react';
import { Applicant, ApplicationType } from '@/lib/types';

export default function AdminApplicantsDirectoryPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [types, setTypes] = useState<ApplicationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [appRes, typesRes] = await Promise.all([
        fetch(`/api/admin/applicants?q=${encodeURIComponent(searchQuery)}&type=${encodeURIComponent(selectedTypeId)}`),
        fetch('/api/application/types?all=true')
      ]);

      const appData = await appRes.json();
      const typesData = await typesRes.json();

      if (appData.success) {
        setApplicants(appData.applicants || []);
      }
      if (typesData.success) {
        setTypes(typesData.types || []);
      }
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedTypeId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#196855] hover:bg-emerald-50 transition-colors shadow-2xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 font-serif">
              Registered Admission Applicants
            </h1>
            <p className="text-xs text-gray-500">
              Official candidate registration roll, contact profiles, and verification status
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/application-types"
            className="py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <Layers size={14} className="text-[#196855]" />
            <span>Configure Programmes</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-2 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search applicants by name, applicant number (AHCAS/APP/...), or email..."
            className="w-full text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden"
          />
          <button
            type="submit"
            className="py-1.5 px-3 rounded-lg bg-[#196855] text-white font-bold text-xs shrink-0 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Programme Filter */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-2">
          <Filter size={16} className="text-gray-400 shrink-0" />
          <select
            value={selectedTypeId}
            onChange={e => setSelectedTypeId(e.target.value)}
            className="w-full text-xs text-gray-800 bg-transparent focus:outline-hidden"
          >
            <option value="all">All Programmes ({applicants.length})</option>
            {types.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Registered Candidates
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            {applicants.length} applicant(s)
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            <div className="w-6 h-6 border-2 border-[#196855]/20 border-t-[#196855] rounded-full animate-spin mx-auto mb-2" />
            <span>Loading registered applicants...</span>
          </div>
        ) : applicants.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs space-y-2">
            <Users size={32} className="mx-auto text-gray-300" />
            <p className="font-bold">No registered applicants found.</p>
            <p className="text-gray-400">Try adjusting your search criteria or select &ldquo;All Programmes&rdquo;.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                <tr>
                  <th className="py-3 px-4">Applicant ID</th>
                  <th className="py-3 px-4">Candidate Name</th>
                  <th className="py-3 px-4">Contact Information</th>
                  <th className="py-3 px-4">Programme</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applicants.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#196855]">
                      {app.applicant_number}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {app.full_name || 'Pending Profile Setup'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-gray-400" />
                        <span className="text-[11px]">{app.email || '—'}</span>
                      </div>
                      {app.phone_number && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-gray-400" />
                          <span className="text-[11px] text-gray-500">{app.phone_number}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-800">
                        {app.application_type?.name || 'General Admission'}
                      </span>
                      {app.application_type?.code && (
                        <span className="text-[10px] text-gray-400 block font-mono">
                          {app.application_type.code}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          app.registration_status === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {app.registration_status === 'verified' ? (
                          <CheckCircle2 size={10} className="text-emerald-600" />
                        ) : (
                          <Clock size={10} className="text-amber-600" />
                        )}
                        <span>{app.registration_status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-[11px]">
                      {app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
