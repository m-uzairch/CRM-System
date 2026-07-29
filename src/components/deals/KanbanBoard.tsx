'use me';
'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, DollarSign, Calendar, Sparkles, Building2, User } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { Deal, DealStage } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import DealDetailModal from './DealDetailModal';
import DealFormModal from './DealFormModal';
import Card from '@/components/ui/Card';

const STAGES: { id: DealStage; label: string; color: string }[] = [
  { id: 'new', label: 'New Lead', color: 'border-t-blue-500' },
  { id: 'qualified', label: 'Qualified', color: 'border-t-indigo-500' },
  { id: 'proposal', label: 'Proposal Sent', color: 'border-t-purple-500' },
  { id: 'negotiation', label: 'In Negotiation', color: 'border-t-amber-500' },
  { id: 'won', label: 'Won', color: 'border-t-violet-500' },
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

  const visibleStages = STAGES.filter((stage) => {
    if (activeMobileStage === 'all') return true;
    return stage.id === activeMobileStage;
  });

  return (
    <div className="space-y-5 min-w-0 select-none">
      {/* Top Header Summary Bar Card */}
      <Card glowColor="purple" className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-white">Active Sales Pipeline</h2>
          <p className="text-xs text-slate-400">
            Total Pipeline Value:{' '}
            <span className="font-extrabold text-purple-400">
              {formatCurrency(deals.reduce((sum, d) => sum + d.value, 0))}
            </span>{' '}
            across {deals.length} active opportunities.
          </p>
        </div>

        <button
          onClick={() => openCreateForStage('new')}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>New Deal</span>
        </button>
      </Card>

      {/* Mobile Stage Selector Tabs */}
      <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveMobileStage('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeMobileStage === 'all'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-[#151520] text-slate-400 border border-white/[0.06]'
          }`}
        >
          All Stages ({deals.length})
        </button>
        {STAGES.map((stage) => {
          const count = deals.filter((d) => d.stage === stage.id).length;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveMobileStage(stage.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeMobileStage === stage.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#151520] text-slate-400 border border-white/[0.06]'
              }`}
            >
              {stage.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Drag & Drop Board Column View */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start snap-x scrollbar-thin">
          {visibleStages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.id);
            const totalStageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div
                key={stage.id}
                className={`bg-[#0D0D14] rounded-2xl p-3.5 border-t-4 ${stage.color} border-x border-b border-white/[0.06] flex flex-col min-h-[550px] w-72 sm:w-80 shrink-0 snap-start shadow-xl`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.06]">
                  <div>
                    <h3 className="font-extrabold text-xs text-white flex items-center gap-1.5">
                      {stage.label}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-purple-300 font-bold">
                        {stageDeals.length}
                      </span>
                    </h3>
                    <span className="text-xs font-bold text-slate-400 block mt-0.5">
                      {formatCurrency(totalStageValue)}
                    </span>
                  </div>

                  <button
                    onClick={() => openCreateForStage(stage.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
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
                        snapshot.isDraggingOver ? 'bg-purple-900/10 rounded-xl p-1 border border-purple-500/20' : ''
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
                              className={`p-4 bg-[#151520] rounded-xl border border-white/[0.06] shadow-md hover:-translate-y-1 hover:scale-[1.015] hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer space-y-3 ${
                                snapshot.isDragging ? 'shadow-2xl ring-2 ring-purple-500 scale-105 rotate-1 z-50 bg-[#1c1c2b]' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-extrabold text-sm text-white line-clamp-2 leading-snug">
                                  {deal.title}
                                </h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold shrink-0 border border-purple-500/30">
                                  {deal.ai_score} AI
                                </span>
                              </div>

                              {deal.company_name && (
                                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                  <Building2 size={13} className="text-slate-400 shrink-0" />
                                  <span className="truncate">{deal.company_name}</span>
                                </p>
                              )}

                              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                                <span className="font-extrabold text-emerald-400">
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
