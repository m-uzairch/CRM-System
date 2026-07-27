'use me';
'use client';

import React from 'react';
import Link from 'next/link';
import { DollarSign, Kanban, Users, CheckSquare, TrendingUp, Sparkles, Plus, ArrowUpRight, Clock } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { useAuth } from '@/lib/auth/auth-context';
import { formatCurrency, formatTimeAgo } from '@/lib/utils';
import TodayWidget from '@/components/dashboard/TodayWidget';

export default function ExecutiveDashboard() {
  const { contacts, deals, invoices, activities } = useCRM();
  const { user } = useAuth();

  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0);
  const totalPaidRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);
  const activeDealsCount = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length;
  const wonDealsCount = deals.filter(d => d.stage === 'won').length;

  const displayName = user?.displayName || 'User';

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-white/90">
            <Sparkles size={14} className="text-amber-300" />
            <span>Avex Creative Agency & Sales Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Welcome back, {displayName}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-medium">
            Your pipeline holds{' '}
            <span className="font-extrabold text-white">{formatCurrency(totalPipelineValue)}</span> across{' '}
            {activeDealsCount} active opportunity deals.
          </p>
        </div>

        {/* Decorative background blur shape */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Paid Revenue */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Collected Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(totalPaidRevenue)}
            </p>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} /> +18.4% from last month
            </span>
          </div>
        </div>

        {/* Active Opportunities */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Deals</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Kanban size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {activeDealsCount} Deals
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {wonDealsCount} deals closed won
            </span>
          </div>
        </div>

        {/* Total Pipeline Value */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pipeline Value</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(totalPipelineValue)}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Average deal: {formatCurrency(deals.length > 0 ? totalPipelineValue / deals.length : 0)}
            </span>
          </div>
        </div>

        {/* Total Active Clients */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Contacts</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Users size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {contacts.length} Contacts
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {contacts.filter(c => c.status === 'client').length} active clients
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Main Grid: Today Widget + Recent Activities Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Today & Upcoming Task Reminders */}
        <TodayWidget />

        {/* Right: Recent Activity Stream */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Clock size={18} className="text-indigo-600 dark:text-indigo-400" />
                Recent CRM Activity Feed
              </h3>
              <p className="text-xs text-slate-400">Live interactions & deal status updates</p>
            </div>
          </div>

          <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
            {activities.slice(0, 5).map(act => (
              <div key={act.id} className="relative space-y-0.5">
                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-900" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{act.title}</span>
                  <span className="text-[10px] text-slate-400">{formatTimeAgo(act.timestamp)}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{act.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
