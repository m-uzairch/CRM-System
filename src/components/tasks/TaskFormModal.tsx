'use me';
'use client';

import React, { useState } from 'react';
import { X, CheckSquare, Calendar, Flag, Link2 } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { TaskPriority } from '@/lib/types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export default function TaskFormModal({ isOpen, onClose, initialData }: TaskFormModalProps) {
  const { addTask, updateTask, contacts, deals } = useCRM();

  const [title, setTitle] = useState(initialData?.title || '');
  const [relatedType, setRelatedType] = useState<'contact' | 'deal' | 'invoice'>(initialData?.related_to_type || 'contact');
  const [relatedId, setRelatedId] = useState(initialData?.related_to_id || '');
  const [dueDate, setDueDate] = useState(
    initialData?.due_date ? new Date(initialData.due_date).toISOString().slice(0, 16) : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let relatedTitle = undefined;
    if (relatedType === 'contact') {
      const c = contacts.find(item => item.id === relatedId);
      if (c) relatedTitle = c.name;
    } else if (relatedType === 'deal') {
      const d = deals.find(item => item.id === relatedId);
      if (d) relatedTitle = d.title;
    }

    if (initialData?.id) {
      updateTask(initialData.id, {
        title,
        related_to_type: relatedType,
        related_to_id: relatedId || undefined,
        related_to_title: relatedTitle,
        due_date: new Date(dueDate).toISOString(),
        priority,
      });
    } else {
      addTask({
        title,
        related_to_type: relatedType,
        related_to_id: relatedId || undefined,
        related_to_title: relatedTitle,
        due_date: new Date(dueDate).toISOString(),
        status: 'todo',
        priority,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Follow up on proposal with Elena"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Relates To
              </label>
              <select
                value={relatedType}
                onChange={e => setRelatedType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="contact">Contact</option>
                <option value="deal">Deal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Entity
              </label>
              <select
                value={relatedId}
                onChange={e => setRelatedId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Unassigned</option>
                {relatedType === 'contact'
                  ? contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                  : deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Due Date & Time
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
