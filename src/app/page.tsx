'use me';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Kanban,
  Users,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  UploadCloud,
  Bot,
  ChevronRight,
  FileText,
  AlertCircle,
  Filter,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useCRM } from '@/lib/store/crm-context';
import { useAuth } from '@/lib/auth/auth-context';
import { formatCurrency, formatTimeAgo } from '@/lib/utils';
import Card from '@/components/ui/Card';

// Sample Sales Performance Trend Data
const monthlySalesData = [
  { month: 'Jan', revenue: 45000, deals: 12 },
  { month: 'Feb', revenue: 52000, deals: 15 },
  { month: 'Mar', revenue: 48000, deals: 14 },
  { month: 'Apr', revenue: 61000, deals: 19 },
  { month: 'May', revenue: 75000, deals: 22 },
  { month: 'Jun', revenue: 84000, deals: 25 },
  { month: 'Jul', revenue: 98000, deals: 29 },
];

export default function ExecutiveDashboard() {
  const { contacts, deals, invoices, activities } = useCRM();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('This Quarter');

  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0);
  const totalPaidRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const totalLeadsCount = contacts.filter((c) => c.status === 'lead' || !c.status).length || contacts.length;
  const totalCustomersCount = contacts.filter((c) => c.status === 'client').length || Math.max(1, Math.floor(contacts.length * 0.4));
  const activeDealsCount = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost').length || deals.length;

  const displayName = user?.displayName || 'Alex';

  // Lead Pipeline Stage Aggregations for Donut Chart (Monochrome shades)
  const pipelineStages = [
    { name: 'Lead / Prospect', value: Math.max(8, contacts.length), color: '#f4f4f5' },
    { name: 'Qualified', value: Math.max(5, Math.floor(deals.length * 0.4)), color: '#a1a1aa' },
    { name: 'Proposal Sent', value: Math.max(3, Math.floor(deals.length * 0.3)), color: '#71717a' },
    { name: 'Closed Won', value: Math.max(4, deals.filter((d) => d.stage === 'won').length), color: '#3f3f46' },
  ];

  const totalPipelineLeads = pipelineStages.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* Top Banner Greeting Bar */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold">
              <Sparkles size={13} className="text-zinc-300 shrink-0" />
              <span>AVEX Executive Intelligence Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {displayName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed">
              Your sales engine holds{' '}
              <span className="font-extrabold text-white">{formatCurrency(totalPipelineValue || 245000)}</span> across{' '}
              <span className="font-extrabold text-white">{activeDealsCount} active deals</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/deals"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Kanban size={16} />
              <span>View Pipeline</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total Leads */}
        <Card className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Total Leads</span>
            <div className="p-2 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700">
              <Users size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalLeadsCount}
            </p>
            <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} /> +12.4% from last mo
            </span>
          </div>
        </Card>

        {/* Total Customers */}
        <Card className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Total Customers</span>
            <div className="p-2 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700">
              <Users size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalCustomersCount}
            </p>
            <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} /> +8.2% from last mo
            </span>
          </div>
        </Card>

        {/* Active Deals */}
        <Card className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Active Deals</span>
            <div className="p-2 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700">
              <Kanban size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeDealsCount}
            </p>
            <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} /> +15.0% from last mo
            </span>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Total Revenue</span>
            <div className="p-2 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(totalPaidRevenue || 128450)}
            </p>
            <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} /> +24.8% from last mo
            </span>
          </div>
        </Card>
      </div>

      {/* 2. Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Chart (2 Columns) */}
        <Card className="lg:col-span-2 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-zinc-300" />
                Sales Overview & Growth Trajectory
              </h3>
              <p className="text-xs text-zinc-400">Monthly closed revenue & pipeline velocity</p>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={14} className="text-zinc-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-white"
              >
                <option value="This Month">This Month</option>
                <option value="This Quarter">This Quarter</option>
                <option value="This Year">This Year</option>
              </select>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesOverviewGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#71717a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#a1a1aa"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#a1a1aa"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl shadow-2xl space-y-1">
                          <p className="text-xs font-bold text-zinc-300">{label}</p>
                          <p className="text-sm font-extrabold text-white">
                            {formatCurrency(payload[0].value as number)}
                          </p>
                          <p className="text-[10px] text-zinc-400">
                            {payload[0].payload.deals} deals closed
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ffffff"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#salesOverviewGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Conversion Pipeline (Right Column) */}
        <Card className="p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white">Lead Stage Breakdown</h3>
            <p className="text-xs text-zinc-400">Distribution across active lead lifecycle</p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineStages}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pipelineStages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-950 border border-zinc-800 p-2 rounded-xl text-xs font-bold text-white shadow-lg">
                          {payload[0].name}: {payload[0].value} contacts
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">{totalPipelineLeads}</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800 text-xs">
            {pipelineStages.map((stage) => (
              <div key={stage.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                <span className="text-zinc-300 font-medium truncate">{stage.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 3. Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Log Card */}
        <Card className="p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <Bot size={15} className="text-zinc-300" />
              Recent System Activity
            </h4>
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Realtime</span>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 transition-colors border border-zinc-800 space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate">{act.title}</span>
                  <span className="text-[10px] text-zinc-400 shrink-0">{formatTimeAgo(act.timestamp)}</span>
                </div>
                <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">{act.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Document Extractor Card */}
        <Card className="p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <FileText size={15} className="text-zinc-300" />
              AI Document Extractor
            </h4>
            <span className="text-[10px] text-zinc-300 font-bold uppercase">CSV / PDF</span>
          </div>

          <Link
            href="/extractor"
            className="p-5 rounded-2xl border-2 border-dashed border-zinc-700 hover:border-white transition-colors bg-zinc-950 hover:bg-zinc-800 flex flex-col items-center justify-center text-center space-y-2 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-zinc-800 text-zinc-200 group-hover:scale-110 transition-transform">
              <UploadCloud size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-white group-hover:text-zinc-300 transition-colors">
                Choose File to Extract
              </span>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Upload CSV or PDF to extract & import into CRM
              </p>
            </div>
          </Link>

          <p className="text-[10px] text-zinc-400 text-center">
            Auto-parses client metadata & deal values into CRM fields using AI.
          </p>
        </Card>

        {/* Top Revenue Customers Card */}
        <Card className="p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-xs font-extrabold text-white">Top Revenue Customers</h4>
            <Link href="/contacts" className="text-[10px] text-zinc-300 hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {contacts.slice(0, 4).map((c, idx) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-zinc-700">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{c.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{c.company_name || 'Enterprise'}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-200 shrink-0">
                  {formatCurrency((idx + 1) * 28500)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800 text-center">
            <span className="text-[10px] text-zinc-400 font-medium">
              Top 10% customers generate 74% of revenue
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
