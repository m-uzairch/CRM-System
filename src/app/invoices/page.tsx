'use me';
'use client';

import React, { useState } from 'react';
import { Plus, Download, Eye, Trash2, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { Invoice } from '@/lib/types';
import { formatCurrency, formatDate, getInvoiceStatusStyle } from '@/lib/utils';
import InvoiceBuilderModal from '@/components/invoices/InvoiceBuilderModal';
import InvoicePDFModal from '@/components/invoices/InvoicePDFModal';
import Card from '@/components/ui/Card';

export default function InvoicesPage() {
  const { invoices, updateInvoiceStatus, deleteInvoice } = useCRM();
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [selectedInvoiceForPDF, setSelectedInvoiceForPDF] = useState<Invoice | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredInvoices = invoices.filter((i) => {
    if (filterStatus === 'all') return true;
    return i.status === filterStatus;
  });

  const totalPaidRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const totalOutstanding = invoices
    .filter((i) => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.total, 0);

  const handleExportCSV = () => {
    const csvRows = [
      ['Invoice Number', 'Client Name', 'Client Email', 'Total Amount', 'Status', 'Issue Date', 'Due Date'].join(','),
      ...filteredInvoices.map(inv =>
        [
          `"${inv.invoice_number}"`,
          `"${inv.client_name || ''}"`,
          `"${inv.client_email || ''}"`,
          `"${inv.total}"`,
          `"${inv.status}"`,
          `"${inv.issue_date}"`,
          `"${inv.due_date}"`
        ].join(',')
      )
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `avex_invoices_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Client Invoicing & Payments
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, track, and export professional PDF invoices for clients.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            title="Download CSV Invoice Report"
          >
            <Download size={14} />
            <span>Download CSV Report</span>
          </button>

          <button
            onClick={() => setShowBuilderModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-extrabold rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Revenue Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card glowColor="emerald" className="p-5 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Total Paid Revenue</span>
          <p className="text-2xl font-extrabold text-emerald-400">
            {formatCurrency(totalPaidRevenue)}
          </p>
        </Card>

        <Card glowColor="amber" className="p-5 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Outstanding Balance</span>
          <p className="text-2xl font-extrabold text-amber-400">
            {formatCurrency(totalOutstanding)}
          </p>
        </Card>

        <Card glowColor="blue" className="p-5 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Total Invoices</span>
          <p className="text-2xl font-extrabold text-white">
            {invoices.length} Invoices
          </p>
        </Card>
      </div>

      {/* Invoices List Table */}
      <Card className="overflow-hidden p-0" interactive={false}>
        {/* Table Filter Controls */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between gap-4">
          <span className="text-xs font-extrabold text-white">Invoice History</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-[#0A0A0F] border border-white/[0.08] rounded-xl text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Invoices</option>
            <option value="draft">Drafts</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D0D14] text-slate-400 font-bold uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Client / Company</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="p-4 font-bold text-white">{inv.invoice_number}</td>
                    <td className="p-4 font-medium text-slate-300">{inv.client_name}</td>
                    <td className="p-4 font-extrabold text-white">{formatCurrency(inv.total)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold capitalize ${getInvoiceStatusStyle(
                          inv.status
                        )}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{formatDate(inv.issue_date)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {inv.status !== 'paid' && (
                          <button
                            onClick={() => updateInvoiceStatus(inv.id, 'paid')}
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                            title="Mark as Paid"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvoiceForPDF(inv)}
                          className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
                          title="Download / View PDF Invoice"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          onClick={() => setSelectedInvoiceForPDF(inv)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                          title="Preview Invoice"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => deleteInvoice(inv.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
                          title="Delete Invoice"
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
      {showBuilderModal && (
        <InvoiceBuilderModal isOpen={showBuilderModal} onClose={() => setShowBuilderModal(false)} />
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
