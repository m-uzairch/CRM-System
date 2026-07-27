'use me';
'use client';

import React from 'react';
import TaskList from '@/components/tasks/TaskList';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tasks & Reminders
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Never miss a client follow-up, proposal deadline, or onboarding task.
        </p>
      </div>

      <TaskList />
    </div>
  );
}
