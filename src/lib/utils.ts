import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DealStage, ContactStatus, TaskStatus, InvoiceStatus, TaskPriority } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
}

export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'Just now';
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return 'Recently';
  }
}

export function getStageBadgeStyle(stage: DealStage): string {
  switch (stage) {
    case 'new':
      return 'bg-sky-500/10 text-sky-300 border-sky-500/30';
    case 'qualified':
      return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    case 'proposal':
      return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
    case 'negotiation':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    case 'won':
      return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    case 'lost':
      return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}

export function getContactStatusStyle(status: ContactStatus): string {
  switch (status) {
    case 'lead':
      return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
    case 'active':
      return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    case 'client':
      return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    case 'inactive':
      return 'bg-slate-800 text-slate-400 border-slate-700';
  }
}

export function getInvoiceStatusStyle(status: InvoiceStatus): string {
  switch (status) {
    case 'draft':
      return 'bg-slate-800 text-slate-300 border-slate-700';
    case 'sent':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    case 'paid':
      return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    case 'overdue':
      return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
  }
}

export function getTaskPriorityStyle(priority: TaskPriority): string {
  switch (priority) {
    case 'high':
      return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    case 'medium':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    case 'low':
      return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
  }
}

export function isTaskOverdue(dueDateString?: string, status?: TaskStatus): boolean {
  if (!dueDateString || status === 'completed') return false;
  const dueDate = new Date(dueDateString);
  return dueDate.getTime() < Date.now();
}
