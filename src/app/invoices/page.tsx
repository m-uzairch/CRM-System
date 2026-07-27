'use me';
'use client';

import React, { useState } from 'react';
import { Plus, FileText, Download, CheckCircle2, Clock, DollarSign, Eye, Trash2 } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { Invoice, InvoiceStatus } from '@/lib/types';
import { formatCurrency, formatDate, getInvoiceStatusStyle } from '@/lib/utils';
import InvoiceBuilderModal from '@/components/invoices/InvoiceBuilderModal';
import InvoicePDFModal from '@/components/invoices/InvoicePDFModal';

export default function InvoicesPage() {
  const { invoices, updateInvoiceStatus, deleteInvoice } = useCRM();
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [selectedInvoiceForPDF, setSelectedInvoiceForPDF] = useState<Invoice | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredInvoices = invoices.filter(i => {
    if (filterStatus === 'all') return true;
    return i.status === filterStatus;
  });

  const totalPaidRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const totalOutstanding = invoices
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Client Invoicing & Payments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create, track, and export professional PDF invoices for clients.
          </p>
        </div>

        <button
          onClick={() => setShowBuilderModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Revenue Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Paid Revenue</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalPaidRevenue)}
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Outstanding Invoices</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {formatCurrency(totalOutstanding)}
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Invoices Issued</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {invoices.length} Invoices
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Client</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No client invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {inv.invoice_number}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{inv.client_name || 'Client'}</span>
                      {inv.company_name && <span className="text-[11px] text-slate-400">{inv.company_name}</span>}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{formatDate(inv.issue_date)}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{formatDate(inv.due_date)}</td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{formatCurrency(inv.total)}</td>
                    <td className="p-4">
                      <select
                        value={inv.status}
                        onChange={e => updateInvoiceStatus(inv.id, e.target.value as InvoiceStatus)}
                        className={`px-2.5 py-1 rounded-full border text-[10px] font-bold capitalize focus:outline-none cursor-pointer ${getInvoiceStatusStyle(inv.status)}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedInvoiceForPDF(inv)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg font-semibold text-[11px] transition-colors"
                        >
                          <Eye size={13} /> PDF Preview
                        </button>
                        <button
                          onClick={() => deleteInvoice(inv.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
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

      {/* Modals */}
      {showBuilderModal && (
        <InvoiceBuilderModal
          isOpen={showBuilderModal}
          onClose={() => setShowBuilderModal(false)}
        />
      )}

      {selectedInvoiceForPDF && (
        <InvoicePDFModal
          invoice={selectedInvoiceForPDF}
          onClose={() => setSelectedInvoiceForPDF(null)}
        />
      )}
    </div>
  );
}
