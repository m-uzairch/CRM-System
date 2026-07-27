'use me';
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Building2,
  Mail,
  Phone,
  Tag,
  DollarSign,
  Kanban,
  CheckSquare,
  FileText,
  Clock,
  Plus,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { Contact } from '@/lib/types';
import { getContactStatusStyle, getStageBadgeStyle, getInvoiceStatusStyle, formatCurrency, formatDate, formatTimeAgo } from '@/lib/utils';

interface ContactDetailModalProps {
  contact: Contact | null;
  onClose: () => void;
}

export default function ContactDetailModal({ contact, onClose }: ContactDetailModalProps) {
  const { deals, tasks, invoices, notes, activities, addNote, updateContactAISummary, updateContact } = useCRM();

  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'notes' | 'invoices' | 'activity'>('overview');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingScore, setIsGeneratingScore] = useState(false);
  const [leadScoreData, setLeadScoreData] = useState<any>(null);

  if (!contact) return null;

  // Filter linked records
  const contactDeals = deals.filter(d => d.contact_id === contact.id);
  const contactTasks = tasks.filter(t => t.related_to_id === contact.id || contactDeals.some(d => d.id === t.related_to_id));
  const contactInvoices = invoices.filter(i => i.client_id === contact.id);
  const contactNotes = notes.filter(n => n.entity_id === contact.id && n.entity_type === 'contact');
  const contactActivities = activities.filter(a => a.contact_id === contact.id);

  const totalDealsValue = contactDeals.reduce((sum, d) => sum + d.value, 0);
  const totalInvoicedValue = contactInvoices.reduce((sum, i) => sum + i.total, 0);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    addNote({
      entity_type: 'contact',
      entity_id: contact.id,
      content: newNoteContent.trim(),
      author: 'Alex Avex',
    });
    setNewNoteContent('');
  };

  const handleGenerateAISummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: contact.name,
          activities: contactActivities,
          notes: contactNotes,
        }),
      });

      const data = await res.json();
      if (data.summary) {
        updateContactAISummary(contact.id, data.summary);
      }
    } catch (e) {
      console.error('Failed to generate AI summary:', e);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleCalculateLeadScore = async () => {
    setIsGeneratingScore(true);
    try {
      const res = await fetch('/api/ai/lead-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact,
          activities: contactActivities,
          deals: contactDeals,
        }),
      });

      const data = await res.json();
      if (data) {
        setLeadScoreData(data);
      }
    } catch (e) {
      console.error('Failed to generate lead score:', e);
    } finally {
      setIsGeneratingScore(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Slide-over panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-10 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <img
                src={contact.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={contact.name}
                className="w-14 h-14 rounded-2xl ring-2 ring-indigo-500/20 object-cover shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {contact.name}
                  </h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold capitalize ${getContactStatusStyle(contact.status)}`}>
                    {contact.status}
                  </span>
                </div>
                {contact.company_name && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <Building2 size={13} />
                    {contact.company_name}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1"><Mail size={12} /> {contact.email}</span>
                  <span className="flex items-center gap-1"><Phone size={12} /> {contact.phone}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* AI Activity Summary Banner */}
          <div className="p-4 mx-6 mt-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                <Sparkles size={15} />
                <span>Gemini AI Activity Summary</span>
              </div>
              <button
                onClick={handleGenerateAISummary}
                disabled={isGeneratingSummary}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw size={11} className={isGeneratingSummary ? 'animate-spin' : ''} />
                {isGeneratingSummary ? 'Generating...' : 'Refresh AI Summary'}
              </button>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {contact.ai_summary || 'No AI summary generated yet. Click above to summarize relationship activity log via Gemini AI.'}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'deals', label: `Deals (${contactDeals.length})` },
              { id: 'notes', label: `Notes (${contactNotes.length})` },
              { id: 'invoices', label: `Invoices (${contactInvoices.length})` },
              { id: 'activity', label: 'Activity Timeline' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Viewport */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pipeline Deals Value</span>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {formatCurrency(totalDealsValue)}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Invoiced</span>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {formatCurrency(totalInvoicedValue)}
                    </p>
                  </div>
                </div>

                {/* AI Lead Score Card */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-indigo-500" />
                      AI Engagement Lead Score
                    </span>
                    <button
                      onClick={handleCalculateLeadScore}
                      disabled={isGeneratingScore}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      {isGeneratingScore ? 'Calculating...' : 'Evaluate Score'}
                    </button>
                  </div>

                  {leadScoreData ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                          {leadScoreData.score}/100
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {leadScoreData.rating} Intent
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Recommended Actions:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {leadScoreData.recommendations.map((rec: string, idx: number) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Click &quot;Evaluate Score&quot; to calculate real-time lead score (0-100) based on recency, deal size, and response velocity.
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {contact.tags.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'deals' && (
              <div className="space-y-3">
                {contactDeals.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No deals linked to this contact yet.</p>
                ) : (
                  contactDeals.map(deal => (
                    <div key={deal.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 transition-colors space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{deal.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase ${getStageBadgeStyle(deal.stage)}`}>
                          {deal.stage}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(deal.value)}</span>
                        <span>Expected: {formatDate(deal.expected_close_date)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                {/* Create Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newNoteContent}
                    onChange={e => setNewNoteContent(e.target.value)}
                    placeholder="Write a project note or call memo for this client..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      Post Note
                    </button>
                  </div>
                </form>

                {/* Notes List */}
                <div className="space-y-3 pt-2">
                  {contactNotes.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No freeform notes added yet.</p>
                  ) : (
                    contactNotes.map(n => (
                      <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{n.author}</span>
                          <span>{formatTimeAgo(n.created_at)}</span>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{n.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-3">
                {contactInvoices.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No invoices generated for this client.</p>
                ) : (
                  contactInvoices.map(inv => (
                    <div key={inv.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{inv.invoice_number}</span>
                        <p className="text-[11px] text-slate-500">Issued: {formatDate(inv.issue_date)} • Due: {formatDate(inv.due_date)}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(inv.total)}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize ${getInvoiceStatusStyle(inv.status)}`}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {contactActivities.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6">No recorded activity history.</p>
                ) : (
                  contactActivities.map(act => (
                    <div key={act.id} className="relative space-y-1">
                      <div className="absolute -left-[29px] top-0.5 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-900" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">{act.title}</span>
                        <span className="text-[10px] text-slate-400">{formatTimeAgo(act.timestamp)}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{act.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
