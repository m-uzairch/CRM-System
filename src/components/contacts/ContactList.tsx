'use me';
'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, Mail, Phone, Tag, Building2, Download, MoreHorizontal, Eye, Trash2, Edit } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { Contact, ContactStatus } from '@/lib/types';
import { getContactStatusStyle } from '@/lib/utils';
import ContactDetailModal from './ContactDetailModal';
import ContactFormModal from './ContactFormModal';

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
  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags || [])));

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
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
      setSelectedContactIds(filteredContacts.map(c => c.id));
    }
  };

  const toggleSelectContact = (id: string) => {
    if (selectedContactIds.includes(id)) {
      setSelectedContactIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedContactIds(prev => [...prev, id]);
    }
  };

  const handleExportCSV = () => {
    const contactsToExport = contacts.filter(c => selectedContactIds.length === 0 || selectedContactIds.includes(c.id));
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Source', 'Tags', 'Owner'];
    const rows = contactsToExport.map(c => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.company_name || ''}"`,
      `"${c.status}"`,
      `"${c.source}"`,
      `"${c.tags.join('; ')}"`,
      `"${c.owner}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `avex_contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Left: Search input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Right: Filters & Action Buttons */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-2.5 sm:px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
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
            onChange={e => setSelectedCompany(e.target.value)}
            className="px-2.5 sm:px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Companies</option>
            {companies.map(co => (
              <option key={co.id} value={co.id}>{co.name}</option>
            ))}
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl transition-colors"
            title="Export contacts to CSV file"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          {/* Add Contact Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Mobile Touch Cards View (hidden on desktop) */}
      <div className="md:hidden space-y-3">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
            No contacts found matching criteria.
          </div>
        ) : (
          filteredContacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContactForDetail(contact)}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 cursor-pointer hover:border-indigo-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={contact.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={contact.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {contact.name}
                    </h4>
                    <p className="text-xs text-slate-400">{contact.email}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold capitalize shrink-0 ${getContactStatusStyle(contact.status)}`}>
                  {contact.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>{contact.company_name || 'Independent Client'}</span>
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedContactForDetail(contact)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedContactForEdit(contact)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Data Table (hidden on mobile) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedContactIds.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
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
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No contacts found matching your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredContacts.map(contact => (
                  <tr
                    key={contact.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedContactForDetail(contact)}
                  >
                    <td className="p-4" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedContactIds.includes(contact.id)}
                        onChange={() => toggleSelectContact(contact.id)}
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={contact.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={contact.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block hover:text-indigo-600 dark:hover:text-indigo-400">
                            {contact.name}
                          </span>
                          <span className="text-[11px] text-slate-400">{contact.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                      {contact.company_name ? (
                        <span className="flex items-center gap-1.5">
                          <Building2 size={13} className="text-slate-400" />
                          {contact.company_name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Independent</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold capitalize ${getContactStatusStyle(contact.status)}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                      {contact.owner}
                    </td>
                    <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedContactForDetail(contact)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Contact Detail"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setSelectedContactForEdit(contact)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Contact"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete Contact"
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
      </div>

      {/* Detail Slide-over Modal */}
      {selectedContactForDetail && (
        <ContactDetailModal
          contact={selectedContactForDetail}
          onClose={() => setSelectedContactForDetail(null)}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <ContactFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Modal */}
      {selectedContactForEdit && (
        <ContactFormModal
          isOpen={!!selectedContactForEdit}
          initialData={selectedContactForEdit}
          onClose={() => setSelectedContactForEdit(null)}
        />
      )}
    </div>
  );
}
