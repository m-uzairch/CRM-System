'use me';
'use client';

import React from 'react';
import { CheckSquare, Square, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCRM } from '@/lib/store/crm-context';
import { formatDate, isTaskOverdue, getTaskPriorityStyle } from '@/lib/utils';

export default function TodayWidget() {
  const { tasks, toggleTaskStatus } = useCRM();

  const pendingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 4);

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar size={18} className="text-indigo-600 dark:text-indigo-400" />
            Today & Action Items
          </h3>
          <p className="text-xs text-slate-400">High priority follow-ups requiring attention</p>
        </div>

        <Link
          href="/tasks"
          className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
        >
          View All <ArrowRight size={13} />
        </Link>
      </div>

      <div className="space-y-2.5">
        {pendingTasks.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No pending tasks for today. You&apos;re all caught up!</p>
        ) : (
          pendingTasks.map(t => {
            const isOverdue = isTaskOverdue(t.due_date, t.status);
            return (
              <div
                key={t.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isOverdue
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                  >
                    <Square size={17} />
                  </button>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {t.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Due: {formatDate(t.due_date)}
                    </span>
                  </div>
                </div>

                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase ${getTaskPriorityStyle(t.priority)}`}>
                  {t.priority}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
