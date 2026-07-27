'use me';
'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Printer, FileText } from 'lucide-react';
import { Invoice } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface InvoicePDFModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export default function InvoicePDFModal({ invoice, onClose }: InvoicePDFModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!invoice) return null;

  const handlePrintInvoice = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice_${invoice.invoice_number}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #0f172a; background: #fff; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 800; color: #4f46e5; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
            .invoice-title { text-align: right; }
            .invoice-title h1 { margin: 0; color: #4f46e5; font-size: 28px; }
            .invoice-title p { margin: 4px 0 0 0; font-size: 14px; font-weight: 600; }
            .grid { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
            th { text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e1; color: #64748b; text-transform: uppercase; font-size: 11px; }
            td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .totals { width: 250px; margin-left: auto; font-size: 13px; line-height: 1.8; }
            .total-row { font-size: 16px; font-weight: 800; color: #4f46e5; border-top: 2px solid #cbd5e1; padding-top: 8px; margin-top: 8px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoice_number}_Avex_CRM.pdf`);
    } catch (e) {
      console.error('PDF export failed, falling back to window print:', e);
      handlePrintInvoice();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="text-indigo-600 dark:text-indigo-400" size={20} />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Invoice Preview — {invoice.invoice_number}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintInvoice}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              title="Print Invoice"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <Download size={14} />
              <span>{isGenerating ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF Document Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl mt-4">
          <div
            ref={printRef}
            className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-md max-w-2xl mx-auto space-y-8 font-sans"
          >
            {/* Header branding */}
            <div className="flex items-start justify-between border-b pb-6 border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    Avex CRM Studio
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  100 Creative Avenue, Suite 400<br />
                  New York, NY 10001 • billing@avexagency.com
                </p>
              </div>

              <div className="text-right">
                <h1 className="text-2xl font-black text-indigo-600 tracking-wider">INVOICE</h1>
                <p className="text-xs font-bold text-slate-700 mt-1">{invoice.invoice_number}</p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase bg-slate-100 text-slate-800 border">
                  Status: {invoice.status}
                </span>
              </div>
            </div>

            {/* Billed To & Dates */}
            <div className="grid grid-cols-2 gap-8 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Billed To</span>
                <p className="font-bold text-slate-900 text-sm">{invoice.client_name || 'Valued Client'}</p>
                {invoice.company_name && <p className="text-slate-600 font-medium">{invoice.company_name}</p>}
                {invoice.client_email && <p className="text-slate-500">{invoice.client_email}</p>}
              </div>

              <div className="space-y-1 text-right">
                <div>
                  <span className="text-slate-400">Issue Date:</span>{' '}
                  <span className="font-semibold text-slate-800">{formatDate(invoice.issue_date)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Due Date:</span>{' '}
                  <span className="font-semibold text-slate-800">{formatDate(invoice.due_date)}</span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.line_items.map((item, idx) => (
                  <tr key={idx} className="text-slate-800">
                    <td className="py-3 font-medium">{item.description}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">{formatCurrency(item.unit_price)}</td>
                    <td className="py-3 text-right font-bold">{formatCurrency(item.quantity * item.unit_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Summary */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.tax_rate > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Tax ({invoice.tax_rate}%):</span>
                    <span>+{formatCurrency((invoice.subtotal * invoice.tax_rate) / 100)}</span>
                  </div>
                )}
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-200 text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-indigo-600">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Notes Footer */}
            {invoice.notes && (
              <div className="pt-6 border-t border-slate-100 text-xs text-slate-500">
                <span className="font-bold text-slate-700 block mb-1">Notes / Terms:</span>
                <p>{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
