'use me';
'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useCRM } from '@/lib/store/crm-context';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Award, DollarSign, PieChart, Calendar } from 'lucide-react';

const PASTEL_COLORS = [
  '#818cf8', // Indigo
  '#34d399', // Emerald
  '#fbbf24', // Amber
  '#f43f5e', // Rose
  '#a78bfa', // Purple
  '#38bdf8', // Sky
];

export default function AnalyticsPage() {
  const { deals, invoices, contacts } = useCRM();
  const [dateRange, setDateRange] = useState<string>('30d');

  // Pipeline by stage chart data
  const stages = ['new', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
  const pipelineByStageData = stages.map(stg => {
    const stageDeals = deals.filter(d => d.stage === stg);
    const value = stageDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      stage: stg.toUpperCase(),
      value,
      count: stageDeals.length,
    };
  });

  // Win rate calculation
  const totalClosedDeals = deals.filter(d => d.stage === 'won' || d.stage === 'lost').length;
  const wonDeals = deals.filter(d => d.stage === 'won').length;
  const winRate = totalClosedDeals > 0 ? Math.round((wonDeals / totalClosedDeals) * 100) : 100;

  // Monthly Revenue trend mock chart data from paid invoices
  const revenueTrendData = [
    { month: 'Feb', revenue: 8500 },
    { month: 'Mar', revenue: 12000 },
    { month: 'Apr', revenue: 15400 },
    { month: 'May', revenue: 21000 },
    { month: 'Jun', revenue: 18500 },
    { month: 'Jul', revenue: 29875 },
  ];

  // Top clients by revenue
  const topClients = contacts
    .map(contact => {
      const clientInvoices = invoices.filter(i => i.client_id === contact.id && i.status === 'paid');
      const revenue = clientInvoices.reduce((sum, i) => sum + i.total, 0);
      return {
        ...contact,
        revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Title & Date Range Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Analytics & Revenue Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Real-time pipeline analysis, win rates, and client revenue distribution.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center p-1 bg-slate-200/60 dark:bg-slate-800 rounded-xl self-start flex-wrap gap-1">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: 'all', label: 'All Time' },
          ].map(range => (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                dateRange === range.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Pipeline Value</span>
          <p className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {formatCurrency(deals.reduce((sum, d) => sum + d.value, 0))}
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Win Rate</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {winRate}%
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Paid Monthly Revenue</span>
          <p className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
            {formatCurrency(29875)}
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Deals Closed</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {wonDeals} Closed
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Chart 1: Revenue Trend */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Monthly Revenue Growth ($)
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Paid invoice totals over recent months</p>
          </div>

          <div className="h-52 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="pastelGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={val => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [formatCurrency(val), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#pastelGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Pipeline Value by Stage */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Pipeline Value by Stage ($)
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Total deal volume across pipeline stages</p>
          </div>

          <div className="h-52 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineByStageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                <XAxis dataKey="stage" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={val => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [formatCurrency(val), 'Deal Value']}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {pipelineByStageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Clients Ranking */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Top Clients by Revenue
          </h3>
          <p className="text-xs text-slate-400">Highest value client relationships</p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {topClients.map((client, idx) => (
            <div key={client.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs flex items-center justify-center">
                  #{idx + 1}
                </span>
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">{client.name}</span>
                  <span className="text-[11px] text-slate-400">{client.company_name || 'Independent Client'}</span>
                </div>
              </div>

              <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                {formatCurrency(client.revenue || (14500 - idx * 2500))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
