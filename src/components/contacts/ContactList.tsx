'use me';
'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, Download, Eye, Trash2, Edit } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { Contact } from '@/lib/types';
import { getContactStatusStyle } from '@/lib/utils';
import ContactDetailModal from './ContactDetailModal';
import ContactFormModal from './ContactFormModal';
import Card from '@/components/ui/Card';

export default function ContactList() {
  const { contacts, companies, deleteContact } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  const [selectedContactForDetail, setSelectedContactForDetail] = useState<Contact | null>(null);
  const [selectedContactForEdit, setSelectedContactForEdit] = useState<Contact | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Extract all unique tags
  const allTags = Array.from(new Set(contacts.flatMap((c) => c.tags || [])));

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.company_name && contact.company_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    const matchesCompany = selectedCompany === 'all' || contact.company_id === selectedCompany;
    const matchesTag = selectedTag === 'all' || (contact.tags && contact.tags.includes(selectedTag));

    return matchesSearch && matchesStatus && matchesCompany && matchesTag;
  });

  const toggleSelectAll = () => {
    if (selectedContactIds.length === filteredContacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(filteredContacts.map((c) => c.id));
    }
  };

  const toggleSelectContact = (id: string) => {
    if (selectedContactIds.includes(id)) {
      setSelectedContactIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedContactIds((prev) => [...prev, id]);
    }
  };

  const handleExportCSV = () => {
    const contactsToExport = contacts.filter(
      (c) => selectedContactIds.length === 0 || selectedContactIds.includes(c.id)
    );
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Source', 'Tags', 'Owner'];
    const csvRows = [
      headers.join(','),
      ...contactsToExport.map((c) =>
        [
          `"${c.name}"`,
          `"${c.email}"`,
          `"${c.phone || ''}"`,
          `"${c.company_name || ''}"`,
          `"${c.status}"`,
          `"${c.source || ''}"`,
          `"${(c.tags || []).join(';')}"`,
          `"${c.owner || ''}"`,
        ].join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `avex_contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <div className="space-y-4 min-w-0 select-none">
      {/* Header Controls Bar */}
      <Card glowColor="purple" className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0A0A0F] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Right: Filters & Action Buttons */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#0A0A0F] border border-white/[0.08] rounded-xl text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="lead">Leads</option>
            <option value="active">Active</option>
            <option value="client">Active Clients</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Company Filter */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-3 py-2 bg-[#0A0A0F] border border-white/[0.08] rounded-xl text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Companies</option>
            {companies.map((co) => (
              <option key={co.id} value={co.id}>
                {co.name}
              </option>
            ))}
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold rounded-xl border border-white/[0.08] transition-colors"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          {/* Add Contact Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus size={15} />
            <span>Add Contact</span>
          </button>
        </div>
      </Card>

      {/* Mobile Card Grid (hidden on desktop) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-[#151520] rounded-2xl border border-white/[0.06]">
            No contacts found matching criteria.
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <Card
              key={contact.id}
              onClick={() => setSelectedContactForDetail(contact)}
              className="p-4 space-y-3 cursor-pointer"
              glowColor="purple"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={contact.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={contact.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 ring-2 ring-purple-500/30"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{contact.name}</h4>
                    <p className="text-xs text-slate-400">{contact.email}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold capitalize shrink-0 ${getContactStatusStyle(
                    contact.status
                  )}`}
                >
                  {contact.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
                <span>{contact.company_name || 'Independent Client'}</span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedContactForDetail(contact)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedContactForEdit(contact)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Data Table */}
      <Card className="hidden md:block overflow-hidden p-0" interactive={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D0D14] text-slate-400 font-bold uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedContactIds.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="p-4">Contact</th>
                <th className="p-4">Company</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tags</th>
                <th className="p-4">Owner</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No contacts found matching your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                    onClick={() => setSelectedContactForDetail(contact)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedContactIds.includes(contact.id)}
                        onChange={() => toggleSelectContact(contact.id)}
                        className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={contact.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={contact.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-purple-500/30"
                        />
                        <div>
                          <p className="font-bold text-white group-hover:text-purple-300 transition-colors">
                            {contact.name}
                          </p>
                          <p className="text-[11px] text-slate-400">{contact.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-300">
                      {contact.company_name || 'Independent Client'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold capitalize ${getContactStatusStyle(
                          contact.status
                        )}`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(contact.tags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-300 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 font-medium">{contact.owner || 'Alex Avex'}</td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedContactForDetail(contact)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-white/[0.06] transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setSelectedContactForEdit(contact)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      {selectedContactForDetail && (
        <ContactDetailModal
          contact={selectedContactForDetail}
          onClose={() => setSelectedContactForDetail(null)}
        />
      )}
      {selectedContactForEdit && (
        <ContactFormModal
          isOpen={true}
          initialData={selectedContactForEdit}
          onClose={() => setSelectedContactForEdit(null)}
        />
      )}
      {showCreateModal && (
        <ContactFormModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
