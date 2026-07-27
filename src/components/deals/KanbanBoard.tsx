'use me';
'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, DollarSign, Calendar, Sparkles, Building2, User } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { Deal, DealStage } from '@/lib/types';
import { formatCurrency, formatDate, getStageBadgeStyle } from '@/lib/utils';
import DealDetailModal from './DealDetailModal';
import DealFormModal from './DealFormModal';

const STAGES: { id: DealStage; label: string; color: string }[] = [
  { id: 'new', label: 'New Lead', color: 'border-t-sky-500' },
  { id: 'qualified', label: 'Qualified', color: 'border-t-indigo-500' },
  { id: 'proposal', label: 'Proposal Sent', color: 'border-t-purple-500' },
  { id: 'negotiation', label: 'In Negotiation', color: 'border-t-amber-500' },
  { id: 'won', label: 'Won', color: 'border-t-emerald-500' },
  { id: 'lost', label: 'Lost', color: 'border-t-rose-500' },
];

export default function KanbanBoard() {
  const { deals, updateDealStage } = useCRM();
  const [selectedDealForDetail, setSelectedDealForDetail] = useState<Deal | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [defaultCreateStage, setDefaultCreateStage] = useState<DealStage>('new');
  const [activeMobileStage, setActiveMobileStage] = useState<string>('all');

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const newStage = destination.droppableId as DealStage;
    updateDealStage(draggableId, newStage);
  };

  const openCreateForStage = (stageId: DealStage) => {
    setDefaultCreateStage(stageId);
    setShowCreateModal(true);
  };

  const visibleStages = STAGES.filter(stage => {
    if (activeMobileStage === 'all') return true;
    return stage.id === activeMobileStage;
  });

  return (
    <div className="space-y-4 min-w-0">
      {/* Top Header Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Pipeline</h2>
          <p className="text-xs text-slate-500">
            Total Pipeline Value:{' '}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(deals.reduce((sum, d) => sum + d.value, 0))}
            </span>{' '}
            across {deals.length} deals.
          </p>
        </div>

        <button
          onClick={() => openCreateForStage('new')}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>New Deal</span>
        </button>
      </div>

      {/* Mobile Stage Selector Tabs (Phone screens) */}
      <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveMobileStage('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeMobileStage === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Stages ({deals.length})
        </button>
        {STAGES.map(stage => {
          const count = deals.filter(d => d.stage === stage.id).length;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveMobileStage(stage.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeMobileStage === stage.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {stage.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Drag & Drop Board: Smooth horizontal scrollable layout */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start snap-x scrollbar-thin">
          {visibleStages.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage.id);
            const totalStageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div
                key={stage.id}
                className={`bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-3.5 border-t-4 ${stage.color} border-x border-b border-slate-200/60 dark:border-slate-800 flex flex-col min-h-[550px] w-72 sm:w-80 shrink-0 snap-start shadow-xs`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      {stage.label}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                        {stageDeals.length}
                      </span>
                    </h3>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
                      {formatCurrency(totalStageValue)}
                    </span>
                  </div>

                  <button
                    onClick={() => openCreateForStage(stage.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                    title={`Add deal to ${stage.label}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 transition-colors min-h-[450px] ${
                        snapshot.isDraggingOver ? 'bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-1' : ''
                      }`}
                    >
                      {stageDeals.map((deal, index) => (
                        <Draggable key={deal.id} draggableId={deal.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedDealForDetail(deal)}
                              className={`p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-700 transition-all cursor-pointer space-y-3 ${
                                snapshot.isDragging ? 'shadow-2xl ring-2 ring-indigo-500 scale-105 rotate-1 z-50' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                  {deal.title}
                                </h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 font-bold shrink-0">
                                  {deal.ai_score} AI
                                </span>
                              </div>

                              {deal.company_name && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                  <Building2 size={13} className="text-slate-400 shrink-0" />
                                  <span className="truncate">{deal.company_name}</span>
                                </p>
                              )}

                              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                                <span className="font-extrabold text-slate-900 dark:text-slate-100">
                                  {formatCurrency(deal.value)}
                                </span>
                                <span className="text-slate-400 font-medium">
                                  {formatDate(deal.expected_close_date)}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Modals */}
      {selectedDealForDetail && (
        <DealDetailModal
          deal={selectedDealForDetail}
          onClose={() => setSelectedDealForDetail(null)}
        />
      )}

      {showCreateModal && (
        <DealFormModal
          isOpen={showCreateModal}
          initialData={{ stage: defaultCreateStage }}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
