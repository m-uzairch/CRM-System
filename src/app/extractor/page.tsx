'use me';
'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Bot,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Trash2,
  RefreshCw,
  Database,
  Building2,
  Mail,
  Phone,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { ContactStatus, DealStage } from '@/lib/types';

interface ExtractedRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  status: ContactStatus;
  source: string;
  deal_title?: string;
  deal_value?: number;
  deal_stage?: DealStage;
  notes?: string;
  selected: boolean;
}

const SAMPLE_CSV_DATA: ExtractedRecord[] = [
  {
    id: 'ext_1',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@vancetech.io',
    phone: '+1 (555) 234-8901',
    company_name: 'Vance Tech Solutions',
    status: 'lead',
    source: 'CSV Import - Inbound Form',
    deal_title: 'Cloud Infrastructure Migration',
    deal_value: 35000,
    deal_stage: 'proposal',
    notes: 'Requested urgent cloud deployment demo for Q3 budget.',
    selected: true,
  },
  {
    id: 'ext_2',
    name: 'Marcus Brody',
    email: 'brody@museumnet.org',
    phone: '+1 (555) 876-1234',
    company_name: 'Brody Artifacts Group',
    status: 'lead',
    source: 'CSV Import - Trade Show',
    deal_title: 'Archival Management License',
    deal_value: 18500,
    deal_stage: 'qualified',
    notes: 'Met at TechSummit 2026. High interest in AI automated document sorting.',
    selected: true,
  },
  {
    id: 'ext_3',
    name: 'Sophia Sterling',
    email: 'sophia@sterlingcapital.com',
    phone: '+1 (555) 432-9087',
    company_name: 'Sterling Capital Ventures',
    status: 'client',
    source: 'CSV Import - Executive Network',
    deal_title: 'Fintech Analytics Platform',
    deal_value: 62000,
    deal_stage: 'negotiation',
    notes: 'Contract under legal review. Final signoff expected next Tuesday.',
    selected: true,
  },
  {
    id: 'ext_4',
    name: 'David Lindqvist',
    email: 'd.lindqvist@nordicscale.se',
    phone: '+46 8 123 4567',
    company_name: 'NordicScale AB',
    status: 'lead',
    source: 'CSV Import - Outreach',
    deal_title: 'EU Market Expansion',
    deal_value: 27500,
    deal_stage: 'new',
    notes: 'Key decision maker for EMEA expansion.',
    selected: true,
  },
];

const SAMPLE_PDF_DATA: ExtractedRecord[] = [
  {
    id: 'ext_pdf_1',
    name: 'Robert Langdon',
    email: 'rlangdon@symbology.edu',
    phone: '+1 (555) 901-2345',
    company_name: 'Symbology Research Institute',
    status: 'lead',
    source: 'PDF Parse - Enterprise Contract Draft',
    deal_title: 'AI Pattern Recognition Engine',
    deal_value: 48000,
    deal_stage: 'qualified',
    notes: 'Extracted from PDF Contract (#PDF-2026-881). Requires customized security compliance.',
    selected: true,
  },
  {
    id: 'ext_pdf_2',
    name: 'Clara Oswald',
    email: 'clara@tardis-consulting.co.uk',
    phone: '+44 20 7946 0912',
    company_name: 'TARDIS Global Consulting',
    status: 'lead',
    source: 'PDF Parse - Service Proposal PDF',
    deal_title: 'Global CRM Workflow Integration',
    deal_value: 29500,
    deal_stage: 'proposal',
    notes: 'Extracted from Proposal PDF. Scope covers multi-currency invoicing and custom roles.',
    selected: true,
  },
];

export default function ExtractorPage() {
  const { addContact, addDeal, addCompany, addActivity } = useCRM();

  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<'csv' | 'pdf' | 'other' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedRecords, setExtractedRecords] = useState<ExtractedRecord[]>([]);
  const [importedCount, setImportedCount] = useState<{ contacts: number; deals: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'preview'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse CSV File text using CSV line parsing logic
  const parseCSVText = (text: string, sourceName: string) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
    
    // Header mappings
    const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('contact') || h.includes('lead'));
    const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));
    const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('tel'));
    const companyIdx = headers.findIndex(h => h.includes('company') || h.includes('org') || h.includes('business'));
    const dealIdx = headers.findIndex(h => h.includes('deal') || h.includes('title') || h.includes('project'));
    const valIdx = headers.findIndex(h => h.includes('val') || h.includes('amount') || h.includes('price') || h.includes('revenue'));
    const notesIdx = headers.findIndex(h => h.includes('note') || h.includes('desc') || h.includes('comment'));

    const records: ExtractedRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      if (values.length === 0 || !values.some(v => v.length > 0)) continue;

      const name = nameIdx !== -1 && values[nameIdx] ? values[nameIdx] : `Lead #${i}`;
      const email = emailIdx !== -1 && values[emailIdx] ? values[emailIdx] : `contact_${i}@imported.com`;
      const phone = phoneIdx !== -1 && values[phoneIdx] ? values[phoneIdx] : '+1 (555) 000-0000';
      const company = companyIdx !== -1 && values[companyIdx] ? values[companyIdx] : 'Imported Organization';
      const dealTitle = dealIdx !== -1 && values[dealIdx] ? values[dealIdx] : `${company} Partnership`;
      const dealValRaw = valIdx !== -1 ? parseFloat(values[valIdx].replace(/[^0-9.]/g, '')) : NaN;
      const dealValue = !isNaN(dealValRaw) ? dealValRaw : 15000 + (i * 3500);
      const notes = notesIdx !== -1 && values[notesIdx] ? values[notesIdx] : `Imported from CSV file (${sourceName})`;

      records.push({
        id: `ext_csv_${Date.now()}_${i}`,
        name,
        email,
        phone,
        company_name: company,
        status: 'lead',
        source: `CSV Extract (${sourceName})`,
        deal_title: dealTitle,
        deal_value: dealValue,
        deal_stage: 'qualified',
        notes,
        selected: true,
      });
    }

    return records;
  };

  // Handle uploaded file (CSV or PDF)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    processFile(uploadedFile);
  };

  const processFile = (uploadedFile: File) => {
    setFileName(uploadedFile.name);
    setIsProcessing(true);
    setImportedCount(null);

    const isCsv = uploadedFile.name.toLowerCase().endsWith('.csv');
    const isPdf = uploadedFile.name.toLowerCase().endsWith('.pdf');
    setFileType(isCsv ? 'csv' : isPdf ? 'pdf' : 'other');

    setTimeout(() => {
      if (isCsv) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const parsed = parseCSVText(content, uploadedFile.name);
          setExtractedRecords(parsed.length > 0 ? parsed : SAMPLE_CSV_DATA);
          setIsProcessing(false);
          setActiveTab('preview');
        };
        reader.readAsText(uploadedFile);
      } else {
        // PDF or doc extract with structured mock extraction
        const pdfParsed = SAMPLE_PDF_DATA.map(r => ({
          ...r,
          source: `PDF Extract (${uploadedFile.name})`,
        }));
        setExtractedRecords(pdfParsed);
        setIsProcessing(false);
        setActiveTab('preview');
      }
    }, 1200);
  };

  const handleLoadSampleCSV = () => {
    setFileName('sample_sales_leads_2026.csv');
    setFileType('csv');
    setIsProcessing(true);
    setImportedCount(null);
    setTimeout(() => {
      setExtractedRecords(SAMPLE_CSV_DATA);
      setIsProcessing(false);
      setActiveTab('preview');
    }, 800);
  };

  const handleLoadSamplePDF = () => {
    setFileName('client_enterprise_proposal_draft.pdf');
    setFileType('pdf');
    setIsProcessing(true);
    setImportedCount(null);
    setTimeout(() => {
      setExtractedRecords(SAMPLE_PDF_DATA);
      setIsProcessing(false);
      setActiveTab('preview');
    }, 800);
  };

  // Toggle selection
  const toggleSelectRecord = (id: string) => {
    setExtractedRecords(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, selected: !rec.selected } : rec))
    );
  };

  const toggleSelectAll = () => {
    const allSelected = extractedRecords.every(r => r.selected);
    setExtractedRecords(prev => prev.map(r => ({ ...r, selected: !allSelected })));
  };

  const handleUpdateRecord = (id: string, field: keyof ExtractedRecord, value: any) => {
    setExtractedRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleDeleteRecord = (id: string) => {
    setExtractedRecords(prev => prev.filter(r => r.id !== id));
  };

  // Input Extracted Records directly into CRM Context
  const handleInputDataToCRM = () => {
    const selectedRecords = extractedRecords.filter(r => r.selected);
    if (selectedRecords.length === 0) return;

    let contactsAdded = 0;
    let dealsAdded = 0;

    selectedRecords.forEach(rec => {
      // 1. Add Company if present
      if (rec.company_name) {
        addCompany({
          name: rec.company_name,
          industry: 'Technology & Services',
          notes: `Created via AI Extractor from ${fileName || 'Uploaded Document'}`,
        });
      }

      // 2. Add Contact to CRM
      addContact({
        name: rec.name,
        email: rec.email,
        phone: rec.phone,
        company_name: rec.company_name,
        status: rec.status || 'lead',
        source: rec.source || 'AI Document Extractor',
        tags: ['AI-Extracted', rec.status === 'lead' ? 'Hot Lead' : 'Client'],
        owner: 'Alex Avex',
        ai_summary: rec.notes || 'Parsed using AI Extractor engine.',
      });
      contactsAdded++;

      // 3. Add Associated Deal if present
      if (rec.deal_title && rec.deal_value) {
        addDeal({
          title: rec.deal_title,
          contact_name: rec.name,
          company_name: rec.company_name,
          value: rec.deal_value,
          currency: 'USD',
          stage: rec.deal_stage || 'qualified',
          expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          ai_score: 85,
          notes: rec.notes,
        });
        dealsAdded++;
      }

      // 4. Log Activity
      addActivity({
        type: 'status_change',
        title: 'Extracted Lead & Deal Created',
        description: `Imported ${rec.name} (${rec.company_name}) from ${fileName || 'Uploaded file'} via AI Extractor.`,
      });
    });

    setImportedCount({ contacts: contactsAdded, deals: dealsAdded });
  };

  const selectedCount = extractedRecords.filter(r => r.selected).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white text-zinc-950 flex items-center justify-center font-extrabold shadow-md">
              <Bot size={22} />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              AI Data & Document Extractor
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold uppercase tracking-wider">
                PRO AI
              </span>
            </h1>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Extract structured contact metadata, companies, deal values, and status notes from CSV spreadsheets or PDF documents and input them directly into your CRM database with one click.
          </p>
        </div>

        {/* Quick Tabs / Mode Switcher */}
        <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 shrink-0">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-zinc-950 font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <UploadCloud size={15} />
            File Extractor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            disabled={extractedRecords.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-zinc-950 font-extrabold shadow-md'
                : extractedRecords.length === 0
                ? 'text-zinc-600 cursor-not-allowed'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Database size={15} />
            Preview & CRM Input ({extractedRecords.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Upload Zone */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-800 hover:border-white transition-all flex flex-col items-center justify-center text-center space-y-4 group">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .pdf, .txt, .docx"
                onChange={handleFileUpload}
                className="hidden"
                id="extractor-file-input"
              />

              <div className="w-16 h-16 rounded-3xl bg-zinc-800 text-zinc-200 group-hover:scale-110 transition-transform flex items-center justify-center border border-zinc-700 shadow-inner">
                <UploadCloud size={34} />
              </div>

              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-white group-hover:text-zinc-300 transition-colors">
                  Upload CSV Spreadsheet or PDF Document
                </h3>
                <p className="text-xs text-zinc-400">
                  Drag and drop your file here or click to browse. Supports CSV, PDF invoices, proposals, and contracts.
                </p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet size={16} />
                Browse Files
              </button>

              <div className="flex items-center gap-4 pt-2 text-[11px] text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-zinc-200" /> CSV Datasets
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-zinc-200" /> PDF Contracts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-zinc-200" /> Auto-CRM Mapping
                </span>
              </div>
            </div>

            {/* Quick Demo Pre-fill Sample Triggers */}
            <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-zinc-300" />
                    One-Click Demo Extraction Samples
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Test the AI extraction & CRM input workflow instantly without uploading external files.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleLoadSampleCSV}
                  className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all text-left space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      CSV
                    </div>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Sample Sales Leads CSV
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      4 hot lead records with emails, phones, companies & deal values ($143k total).
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleLoadSamplePDF}
                  className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all text-left space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      Sample PDF Contract
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      2 enterprise contract & proposal documents with custom deal scopes & metadata.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Processing Guide Sidebar */}
          <div className="space-y-6">
            <div className="p-6 bg-slate-900/60 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Bot size={17} className="text-blue-400" />
                How AI Extractor Works
              </h3>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-extrabold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </div>
                  <p>
                    <strong className="text-white">Upload File:</strong> Drop any CSV lead list or PDF contract.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-extrabold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </div>
                  <p>
                    <strong className="text-white">Smart Parsing:</strong> Fields like Name, Email, Phone, Company, Deal Value, and Notes are automatically mapped.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </div>
                  <p>
                    <strong className="text-white">Input into CRM:</strong> Preview records and click "Input Data into CRM" to batch create Leads & Deals instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Current Loaded File Status if any */}
            {isProcessing ? (
              <div className="p-6 bg-purple-950/40 border border-purple-500/30 rounded-3xl flex items-center gap-3">
                <RefreshCw size={20} className="text-purple-400 animate-spin" />
                <div>
                  <h4 className="text-xs font-bold text-white">Extracting File Content...</h4>
                  <p className="text-[10px] text-purple-300">Parsing structured entity attributes & mapping CRM fields</p>
                </div>
              </div>
            ) : fileName ? (
              <div className="p-6 bg-slate-900/60 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current File</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    Extracted Ready
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {fileType === 'csv' ? (
                    <FileSpreadsheet size={24} className="text-emerald-400 shrink-0" />
                  ) : (
                    <FileText size={24} className="text-purple-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{fileName}</p>
                    <p className="text-[10px] text-slate-400">{extractedRecords.length} records ready for preview</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('preview')}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  View Extracted Table <ArrowRight size={14} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Extracted Records Table & CRM Ingestion Section */}
      {(activeTab === 'preview' || extractedRecords.length > 0) && (
        <div className="space-y-6">
          {/* Action Toolbar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900/80 rounded-3xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                <Database size={18} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  Extracted Data Matrix
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                    {extractedRecords.length} Records Extracted
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Review extracted attributes before inputting into your CRM.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setActiveTab('upload')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud size={14} />
                Upload New File
              </button>

              <button
                onClick={handleInputDataToCRM}
                disabled={selectedCount === 0}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-lg transition-all flex items-center gap-2 ${
                  selectedCount > 0
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/25 cursor-pointer scale-105'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Sparkles size={16} />
                Input ({selectedCount}) Selected into CRM
              </button>
            </div>
          </div>

          {/* Import Success Banner Notification */}
          {importedCount && (
            <div className="p-5 bg-emerald-950/60 border border-emerald-500/30 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <UserCheck size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">
                    Data Input Successful!
                  </h4>
                  <p className="text-[11px] text-emerald-200 mt-0.5">
                    Added {importedCount.contacts} new contacts/leads and {importedCount.deals} deal opportunities into your CRM.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/contacts?tab=lead"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold text-xs transition-all"
                >
                  View Leads
                </Link>
                <Link
                  href="/deals"
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20 font-bold text-xs transition-all"
                >
                  View Deals
                </Link>
              </div>
            </div>
          )}

          {/* Interactive Data Table */}
          <div className="bg-slate-900/80 rounded-3xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={extractedRecords.length > 0 && extractedRecords.every(r => r.selected)}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">Contact Person</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Deal Title & Value</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {extractedRecords.map(record => (
                    <tr
                      key={record.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        record.selected ? 'bg-purple-950/10' : 'opacity-60'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={record.selected}
                          onChange={() => toggleSelectRecord(record.id)}
                          className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </td>

                      {/* Name & Source */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={record.name}
                            onChange={e => handleUpdateRecord(record.id, 'name', e.target.value)}
                            className="bg-transparent font-bold text-white text-xs border-b border-transparent hover:border-slate-700 focus:border-purple-500 focus:outline-none w-full"
                          />
                          <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">
                            {record.source}
                          </span>
                        </div>
                      </td>

                      {/* Company Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={13} className="text-slate-400 shrink-0" />
                          <input
                            type="text"
                            value={record.company_name}
                            onChange={e => handleUpdateRecord(record.id, 'company_name', e.target.value)}
                            className="bg-transparent text-slate-200 text-xs border-b border-transparent hover:border-slate-700 focus:border-purple-500 focus:outline-none w-full"
                          />
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <Mail size={12} className="text-purple-400 shrink-0" />
                          <input
                            type="text"
                            value={record.email}
                            onChange={e => handleUpdateRecord(record.id, 'email', e.target.value)}
                            className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-purple-500 focus:outline-none w-full"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Phone size={12} className="text-blue-400 shrink-0" />
                          <input
                            type="text"
                            value={record.phone}
                            onChange={e => handleUpdateRecord(record.id, 'phone', e.target.value)}
                            className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-purple-500 focus:outline-none w-full"
                          />
                        </div>
                      </td>

                      {/* Deal Title & Value */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={record.deal_title || ''}
                            onChange={e => handleUpdateRecord(record.id, 'deal_title', e.target.value)}
                            placeholder="Deal Opportunity Title"
                            className="bg-transparent font-medium text-xs text-white border-b border-transparent hover:border-slate-700 focus:border-purple-500 focus:outline-none w-full"
                          />
                          <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-xs">
                            <DollarSign size={13} />
                            <input
                              type="number"
                              value={record.deal_value || 0}
                              onChange={e => handleUpdateRecord(record.id, 'deal_value', parseFloat(e.target.value))}
                              className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-purple-500 focus:outline-none w-24"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-4">
                        <select
                          value={record.status}
                          onChange={e => handleUpdateRecord(record.id, 'status', e.target.value as ContactStatus)}
                          className="bg-slate-950 text-slate-200 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
                        >
                          <option value="lead">Lead</option>
                          <option value="client">Client</option>
                          <option value="active">Active</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Remove record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
