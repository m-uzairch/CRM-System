'use me';
'use client';

import React, { useState } from 'react';
import { X, DollarSign, Kanban, Calendar, User, Building2 } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { DealStage } from '@/lib/types';

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export default function DealFormModal({ isOpen, onClose, initialData }: DealFormModalProps) {
  const { addDeal, updateDeal, contacts, companies } = useCRM();

  const [title, setTitle] = useState(initialData?.title || '');
  const [value, setValue] = useState(initialData?.value || 15000);
  const [stage, setStage] = useState<DealStage>(initialData?.stage || 'new');
  const [contactId, setContactId] = useState(initialData?.contact_id || '');
  const [companyId, setCompanyId] = useState(initialData?.company_id || '');
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    initialData?.expected_close_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(initialData?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedContact = contacts.find(c => c.id === contactId);
    const selectedCompany = companies.find(c => c.id === companyId);

    if (initialData?.id) {
      updateDeal(initialData.id, {
        title,
        value: Number(value),
        stage,
        contact_id: contactId || undefined,
        contact_name: selectedContact?.name || undefined,
        company_id: companyId || undefined,
        company_name: selectedCompany?.name || undefined,
        expected_close_date: expectedCloseDate,
        notes,
      });
    } else {
      addDeal({
        title,
        value: Number(value),
        stage,
        currency: 'USD',
        contact_id: contactId || undefined,
        contact_name: selectedContact?.name || undefined,
        company_id: companyId || undefined,
        company_name: selectedCompany?.name || undefined,
        expected_close_date: expectedCloseDate,
        ai_score: 75,
        notes,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit Pipeline Deal' : 'Add New Deal'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deal Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Website Redesign & Branding"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deal Value (USD) *
              </label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  required
                  min={0}
                  value={value}
                  onChange={e => setValue(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pipeline Stage
              </label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as DealStage)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="new">New Lead</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal Sent</option>
                <option value="negotiation">In Negotiation</option>
                <option value="won">Won (Closed)</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Contact
              </label>
              <select
                value={contactId}
                onChange={e => setContactId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">No Contact Selected</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.company_name || 'Independent'})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expected Close Date
              </label>
              <input
                type="date"
                value={expectedCloseDate}
                onChange={e => setExpectedCloseDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deal Notes & Deliverables
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Scope highlights, milestones, budget approval notes..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              {initialData ? 'Save Changes' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
