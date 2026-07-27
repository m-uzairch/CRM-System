'use me';
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Calendar, User, Building2, Sparkles, TrendingUp, Trash2, Edit } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { Deal, DealStage } from '@/lib/types';
import { formatCurrency, formatDate, getStageBadgeStyle } from '@/lib/utils';
import DealFormModal from './DealFormModal';

interface DealDetailModalProps {
  deal: Deal | null;
  onClose: () => void;
}

export default function DealDetailModal({ deal, onClose }: DealDetailModalProps) {
  const { updateDealStage, deleteDeal, contacts, updateDealAIScore } = useCRM();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);

  if (!deal) return null;

  const linkedContact = contacts.find(c => c.id === deal.contact_id);

  const handleStageChange = (newStage: DealStage) => {
    updateDealStage(deal.id, newStage);
  };

  const handleRecalculateAIScore = async () => {
    setIsCalculatingScore(true);
    try {
      if (linkedContact) {
        const res = await fetch('/api/ai/lead-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contact: linkedContact,
            activities: [],
            deals: [deal],
          }),
        });

        const data = await res.json();
        if (data.score) {
          updateDealAIScore(deal.id, data.score);
        }
      }
    } catch (e) {
      console.error('Failed to calculate deal score:', e);
    } finally {
      setIsCalculatingScore(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div className="space-y-1">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase ${getStageBadgeStyle(deal.stage)}`}>
                  {deal.stage} stage
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-1">
                  {deal.title}
                </h2>
                {deal.company_name && (
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Building2 size={13} /> {deal.company_name}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => {
                    deleteDeal(deal.id);
                    onClose();
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Value & AI Score Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Deal Value</span>
                  <p className="text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-1">
                    {formatCurrency(deal.value)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Sparkles size={13} className="text-indigo-500" />
                      AI Score
                    </span>
                    <button
                      onClick={handleRecalculateAIScore}
                      disabled={isCalculatingScore}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {isCalculatingScore ? '...' : 'Refresh'}
                    </button>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {deal.ai_score}/100
                  </p>
                </div>
              </div>

              {/* Stage Switcher Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Move Stage
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['new', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as DealStage[]).map(stg => (
                    <button
                      key={stg}
                      onClick={() => handleStageChange(stg)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        deal.stage === stg
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      {stg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details & Dates */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Primary Contact:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{deal.contact_name || 'Unassigned'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Expected Close:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatDate(deal.expected_close_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Created Date:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatDate(deal.created_at)}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Scope & Deliverable Notes</h4>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {deal.notes || 'No notes added to this deal.'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {showEditModal && (
        <DealFormModal
          isOpen={showEditModal}
          initialData={deal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
