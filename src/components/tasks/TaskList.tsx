'use me';
'use client';

import React, { useState } from 'react';
import { CheckSquare, Square, Calendar, AlertCircle, Plus, Trash2, Edit, Flag, Filter } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { Task } from '@/lib/types';
import { getTaskPriorityStyle, isTaskOverdue, formatDate, formatTimeAgo } from '@/lib/utils';
import TaskFormModal from './TaskFormModal';

export default function TaskList() {
  const { tasks, toggleTaskStatus, deleteTask } = useCRM();
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(t => {
    if (filterPriority === 'all') return true;
    return t.priority === filterPriority;
  });

  const overdueTasks = filteredTasks.filter(t => isTaskOverdue(t.due_date, t.status));
  const todayTasks = filteredTasks.filter(t => !isTaskOverdue(t.due_date, t.status) && t.status !== 'completed');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const renderTaskItem = (task: Task) => {
    const isCompleted = task.status === 'completed';
    const isOverdue = isTaskOverdue(task.due_date, task.status);

    return (
      <div
        key={task.id}
        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
          isCompleted
            ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 opacity-60'
            : isOverdue
            ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/40'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => toggleTaskStatus(task.id)}
            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
          >
            {isCompleted ? (
              <CheckSquare size={20} className="text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Square size={20} />
            )}
          </button>

          <div className="space-y-1 min-w-0">
            <span className={`text-sm font-semibold text-slate-900 dark:text-white block truncate ${isCompleted ? 'line-through text-slate-400' : ''}`}>
              {task.title}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              {task.related_to_title && (
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  Relates to: {task.related_to_title}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(task.due_date)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase ${getTaskPriorityStyle(task.priority)}`}>
            {task.priority}
          </span>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button
              onClick={() => setSelectedTaskForEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus size={15} />
          <span>New Task</span>
        </button>
      </div>

      {/* Overdue Section */}
      {overdueTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle size={15} />
            Overdue ({overdueTasks.length})
          </h3>
          <div className="space-y-2.5">
            {overdueTasks.map(renderTaskItem)}
          </div>
        </div>
      )}

      {/* Active Tasks Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Active Tasks ({todayTasks.length})
        </h3>
        {todayTasks.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 italic">No active tasks pending.</p>
        ) : (
          <div className="space-y-2.5">
            {todayTasks.map(renderTaskItem)}
          </div>
        )}
      </div>

      {/* Completed Section */}
      {completedTasks.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Completed ({completedTasks.length})
          </h3>
          <div className="space-y-2.5">
            {completedTasks.map(renderTaskItem)}
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <TaskFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {selectedTaskForEdit && (
        <TaskFormModal
          isOpen={!!selectedTaskForEdit}
          initialData={selectedTaskForEdit}
          onClose={() => setSelectedTaskForEdit(null)}
        />
      )}
    </div>
  );
}
