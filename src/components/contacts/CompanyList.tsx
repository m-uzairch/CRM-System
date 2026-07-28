'use me';
'use client';

import React, { useState } from 'react';
import { Globe, Users, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { Company } from '@/lib/types';
import CompanyFormModal from './CompanyFormModal';
import Card from '@/components/ui/Card';

export default function CompanyList() {
  const { companies, contacts, deleteCompany } = useCRM();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCompanyForEdit, setSelectedCompanyForEdit] = useState<Company | null>(null);

  return (
    <div className="space-y-5 select-none">
      {/* Header Bar Card */}
      <Card glowColor="purple" className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-white">Client Companies ({companies.length})</h3>
          <p className="text-xs text-slate-400">Manage client organizations and linked account details.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add Company</span>
        </button>
      </Card>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((company) => {
          const linkedContactsCount = contacts.filter((c) => c.company_id === company.id).length;

          return (
            <Card
              key={company.id}
              glowColor="blue"
              className="p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={company.logo_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                      alt={company.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/30 shrink-0"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-white">{company.name}</h4>
                      <span className="text-xs text-purple-400 font-semibold">{company.industry}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedCompanyForEdit(company)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => deleteCompany(company.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {company.notes || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-medium text-slate-300">
                  <Users size={13} className="text-purple-400" />
                  {linkedContactsCount} Linked Contacts
                </span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-400 hover:text-purple-300 transition-colors"
                  >
                    <Globe size={13} />
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </Card>
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
