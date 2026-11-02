'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Trash2,
  Users,
  ShieldAlert,
  Search,
  X
} from 'lucide-react';
import { ApplicationType } from '@/lib/types';

export default function AdminApplicationTypesPage() {
  const [types, setTypes] = useState<ApplicationType[]>([]);
  const [applicantCounts, setApplicantCounts] = useState<Record<string, { name: string; count: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIsActive, setNewIsActive] = useState(true);

  // Edit modal state
  const [editingType, setEditingType] = useState<ApplicationType | null>(null);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [typesRes, applicantsRes] = await Promise.all([
        fetch('/api/application/types?all=true'),
        fetch('/api/admin/applicants')
      ]);

      const typesData = await typesRes.json();
      const applicantsData = await applicantsRes.json();

      if (typesData.success) {
        setTypes(typesData.types);
      }
      if (applicantsData.success && applicantsData.typeCounts) {
        setApplicantCounts(applicantsData.typeCounts);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error loading application types' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/application/types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          code: newCode,
          description: newDescription,
          is_active: newIsActive
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create application type');
      }

      setFeedback({ type: 'success', message: `Application type '${newName}' created successfully.` });
      setIsAddModalOpen(false);
      setNewName('');
      setNewCode('');
      setNewDescription('');
      setNewIsActive(true);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (type: ApplicationType) => {
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/application-types/${type.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !type.is_active })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update status');
      }

      setFeedback({
        type: 'success',
        message: `Application programme '${type.name}' is now ${!type.is_active ? 'ACTIVE' : 'INACTIVE'}.`
      });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleUpdateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/application-types/${editingType.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingType.name,
          code: editingType.code,
          description: editingType.description,
          is_active: editingType.is_active
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update application type');
      }

      setFeedback({ type: 'success', message: 'Application type updated successfully.' });
      setEditingType(null);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteType = async (type: ApplicationType) => {
    const applicantCount = applicantCounts[type.id]?.count || 0;
    if (applicantCount > 0) {
      setFeedback({
        type: 'error',
        message: `Cannot delete '${type.name}': ${applicantCount} applicant(s) are actively registered. Please deactivate it instead.`
      });
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete application type '${type.name}'?`)) {
      return;
    }

    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/application-types/${type.id}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete application type');
      }

      setFeedback({ type: 'success', message: `Application type '${type.name}' deleted successfully.` });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const filteredTypes = types.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Application Programmes Configuration
            </h1>
            <p className="text-xs text-gray-500">
              Manage admission categories, qualification tracks, and application statuses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/applicants"
            className="py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <Users size={14} className="text-[#196855]" />
            <span>View All Applicants</span>
          </Link>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-[#196855] hover:bg-[#145344] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Application Type</span>
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
            )}
            <span className="font-medium leading-relaxed">{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search & Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search application types by name or code..."
            className="w-full text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden"
          />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Total Programmes</p>
            <p className="text-lg font-black text-[#196855]">{types.length}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Active</p>
            <p className="text-sm font-bold text-emerald-600">
              {types.filter(t => t.is_active).length}
            </p>
          </div>
        </div>
      </div>

      {/* Application Types Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Configured Application Programmes
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            {filteredTypes.length} result(s)
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            <div className="w-6 h-6 border-2 border-[#196855]/20 border-t-[#196855] rounded-full animate-spin mx-auto mb-2" />
            <span>Loading application types...</span>
          </div>
        ) : filteredTypes.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs space-y-2">
            <p className="font-bold">No application types found.</p>
            <p className="text-gray-400">Click &ldquo;Add Application Type&rdquo; above to create a new category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                <tr>
                  <th className="py-3 px-4">Programme Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Applicants</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTypes.map(t => {
                  const count = applicantCounts[t.id]?.count || 0;
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {t.name}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#196855]">
                        {t.code}
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate" title={t.description || ''}>
                        {t.description || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                          <Users size={12} className="text-gray-500" />
                          <span>{count}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(t)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            t.is_active
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                          }`}
                          title={t.is_active ? 'Click to deactivate' : 'Click to activate'}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${t.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          <span>{t.is_active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingType({ ...t })}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#196855] hover:bg-emerald-50 transition-colors"
                            title="Edit Type"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteType(t)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Type"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 font-serif">
                Add Application Programme
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateType} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase">Programme Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. IJMB Regular Admission"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#196855]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase">Unique Code *</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={e => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. IJMB_REG"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#196855]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Brief programme description and prerequisites..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#196855]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="newIsActiveCheck"
                  checked={newIsActive}
                  onChange={e => setNewIsActive(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-[#196855] focus:ring-[#196855]"
                />
                <label htmlFor="newIsActiveCheck" className="text-xs font-medium text-gray-700 select-none cursor-pointer">
                  Activate for public registration immediately
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#196855] hover:bg-[#145344] text-white font-bold text-xs uppercase tracking-wider"
                >
                  {isSubmitting ? 'Creating...' : 'Create Programme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 font-serif">
                Edit Application Programme
              </h3>
              <button onClick={() => setEditingType(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateType} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase">Programme Name *</label>
                <input
                  type="text"
                  required
                  value={editingType.name}
                  onChange={e => setEditingType({ ...editingType, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#196855]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase">Code *</label>
                <input
                  type="text"
                  required
                  value={editingType.code}
                  onChange={e => setEditingType({ ...editingType, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#196855]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={editingType.description || ''}
                  onChange={e => setEditingType({ ...editingType, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#196855]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsActiveCheck"
                  checked={editingType.is_active}
                  onChange={e => setEditingType({ ...editingType, is_active: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-[#196855] focus:ring-[#196855]"
                />
                <label htmlFor="editIsActiveCheck" className="text-xs font-medium text-gray-700 select-none cursor-pointer">
                  Active for public registration
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingType(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#196855] hover:bg-[#145344] text-white font-bold text-xs uppercase tracking-wider"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
