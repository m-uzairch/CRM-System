'use me';
'use client';

import React, { useState } from 'react';
import ContactList from '@/components/contacts/ContactList';
import CompanyList from '@/components/contacts/CompanyList';
import { Users, Building2 } from 'lucide-react';

export default function ContactsPage() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'companies'>('contacts');

  return (
    <div className="space-y-6">
      {/* Page Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contacts & Companies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Central backbone tying client relationships, deals, invoices, and activity logs together.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center p-1 bg-slate-200/60 dark:bg-slate-800 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'contacts'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users size={15} />
            <span>Contacts</span>
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'companies'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 size={15} />
            <span>Companies</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeTab === 'contacts' ? <ContactList /> : <CompanyList />}
    </div>
  );
}
