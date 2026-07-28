'use me';
'use client';

import React from 'react';
import { Square, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCRM } from '@/lib/store/crm-context';
import { formatDate, isTaskOverdue, getTaskPriorityStyle } from '@/lib/utils';
import Card from '@/components/ui/Card';

export default function TodayWidget() {
  const { tasks, toggleTaskStatus } = useCRM();

  const pendingTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 4);

  return (
    <Card glowColor="purple" className="p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
            <Calendar size={18} className="text-purple-400" />
            Today & Action Items
          </h3>
          <p className="text-xs text-slate-400">High priority follow-ups requiring attention</p>
        </div>

        <Link
          href="/tasks"
          className="text-xs text-purple-400 font-semibold hover:underline flex items-center gap-1"
        >
          View All <ArrowRight size={13} />
        </Link>
      </div>

      <div className="space-y-2.5">
        {pendingTasks.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No pending tasks for today. You&apos;re all caught up!</p>
        ) : (
          pendingTasks.map((t) => {
            const isOverdue = isTaskOverdue(t.due_date, t.status);
            return (
              <div
                key={t.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isOverdue
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.05] text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    className="text-slate-400 hover:text-purple-400 transition-colors shrink-0"
                  >
                    <Square size={17} />
                  </button>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
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
    </Card>
  );
}
