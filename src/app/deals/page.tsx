'use me';
'use client';

import React from 'react';
import KanbanBoard from '@/components/deals/KanbanBoard';

export default function DealsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sales Pipeline & Deals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Drag and drop deal cards across stages to update status and track stage totals live.
        </p>
      </div>

      <KanbanBoard />
    </div>
  );
}
