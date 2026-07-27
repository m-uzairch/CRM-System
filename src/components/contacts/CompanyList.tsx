'use me';
'use client';

import React, { useState } from 'react';
import { Building2, Globe, Users, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { Company } from '@/lib/types';
import CompanyFormModal from './CompanyFormModal';

export default function CompanyList() {
  const { companies, contacts, deleteCompany } = useCRM();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCompanyForEdit, setSelectedCompanyForEdit] = useState<Company | null>(null);

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Client Companies ({companies.length})</h3>
          <p className="text-xs text-slate-500">Manage client organizations and linked account details.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus size={15} />
          <span>Add Company</span>
        </button>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map(company => {
          const linkedContactsCount = contacts.filter(c => c.company_id === company.id).length;

          return (
            <div
              key={company.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-900 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={company.logo_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                      alt={company.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{company.name}</h4>
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{company.industry}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedCompanyForEdit(company)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => deleteCompany(company.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {company.notes || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <Users size={13} className="text-indigo-500" />
                  {linkedContactsCount} Linked Contacts
                </span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Globe size={13} />
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CompanyFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {selectedCompanyForEdit && (
        <CompanyFormModal
          isOpen={!!selectedCompanyForEdit}
          initialData={selectedCompanyForEdit}
          onClose={() => setSelectedCompanyForEdit(null)}
        />
      )}
    </div>
  );
}
