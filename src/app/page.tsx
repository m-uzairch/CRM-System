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
  Clock,
  UploadCloud,
  Bot,
  ChevronRight,
  FileText,
  AlertCircle,
  CheckCircle2,
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

  // Lead Pipeline Stage Aggregations for Donut Chart
  const pipelineStages = [
    { name: 'Lead / Prospect', value: Math.max(8, contacts.length), color: '#3B82F6' },
    { name: 'Qualified', value: Math.max(5, Math.floor(deals.length * 0.4)), color: '#8B5CF6' },
    { name: 'Proposal Sent', value: Math.max(3, Math.floor(deals.length * 0.3)), color: '#EC4899' },
    { name: 'Closed Won', value: Math.max(4, deals.filter((d) => d.stage === 'won').length), color: '#10B981' },
  ];

  const totalPipelineLeads = pipelineStages.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* Top Banner Greeting Bar */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/30 border border-white/[0.08] backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
              <Sparkles size={13} className="text-amber-400 shrink-0" />
              <span>AVEX Executive Intelligence Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {displayName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Your sales engine holds{' '}
              <span className="font-extrabold text-white">{formatCurrency(totalPipelineValue || 245000)}</span> across{' '}
              <span className="font-extrabold text-white">{activeDealsCount} active deals</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/deals"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
            >
              <Kanban size={16} />
              <span>View Pipeline</span>
            </Link>
          </div>
        </div>

        {/* Ambient background glow orb */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 1. Stat Cards Row (4 cards, 2-per-row on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total Leads */}
        <Card glowColor="blue" className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Leads</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalLeadsCount}
            </p>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} /> +12.4% from last mo
            </span>
          </div>
        </Card>

        {/* Total Customers */}
        <Card glowColor="purple" className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Customers</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalCustomersCount}
            </p>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} /> +8.2% from last mo
            </span>
          </div>
        </Card>

        {/* Active Deals */}
        <Card glowColor="amber" className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Deals</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Kanban size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeDealsCount}
            </p>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} /> +15.0% from last mo
            </span>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card glowColor="emerald" className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(totalPaidRevenue || 128450)}
            </p>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} /> +24.8% from last mo
            </span>
          </div>
        </Card>
      </div>

      {/* 2. Main Analytics Row: Sales Overview Chart (Left/Center) + AI Insights Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Chart (2 Columns) */}
        <Card glowColor="blue" className="lg:col-span-2 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-400" />
                Sales Overview & Growth Trajectory
              </h3>
              <p className="text-xs text-slate-400">Monthly closed revenue & pipeline velocity</p>
            </div>

            {/* Time Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-[#0A0A0F] border border-white/[0.08] text-xs font-medium text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500"
              >
                <option value="This Month">This Month</option>
                <option value="This Quarter">This Quarter</option>
                <option value="This Year">This Year</option>
              </select>
            </div>
          </div>

          {/* Area Chart Container */}
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesOverviewGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#151520] border border-white/[0.1] p-3 rounded-xl shadow-2xl space-y-1">
                          <p className="text-xs font-bold text-slate-300">{label}</p>
                          <p className="text-sm font-extrabold text-blue-400">
                            {formatCurrency(payload[0].value as number)}
                          </p>
                          <p className="text-[10px] text-slate-400">
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
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#salesOverviewGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Insights Panel (1 Column, Glow Styling) */}
        <Card variant="ai" glowColor="purple" className="p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Bot size={18} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    AI Insights & Predictive Engine
                  </h3>
                  <span className="text-[10px] text-purple-300 font-semibold">Powered by Gemini AI</span>
                </div>
              </div>
            </div>

            {/* AI Insight Bullet List */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 size={14} />
                  <span>3 Follow-ups Due Today</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  High intent detected from Apex Corp & TechNova after proposal review.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <AlertCircle size={14} />
                  <span>1 Deal At Risk</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  CyberNet Solutions has stalled in negotiation stage for &gt; 12 days.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <TrendingUp size={14} />
                  <span>Response Time Improved</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Average response time down by 34% (1.2 hours vs 1.8 hours last week).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <Sparkles size={14} />
                  <span>Revenue Prediction</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Projected Q3 end revenue: <span className="font-bold text-white">$210,000</span> (94% confidence score).
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/analytics"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span>View All AI Insights</span>
            <ChevronRight size={14} />
          </Link>
        </Card>
      </div>

      {/* 3. Secondary Widgets Row: Lead Pipeline Donut + Recent Activities + Document Extraction + Top Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Lead Pipeline Donut Chart */}
        <Card glowColor="blue" className="p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h4 className="text-xs font-extrabold text-white">Lead Pipeline Breakdown</h4>
            <span className="text-[10px] text-slate-400 font-semibold">By Stage</span>
          </div>

          <div className="relative h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineStages}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pipelineStages.map((stage, idx) => (
                    <Cell key={idx} fill={stage.color} stroke="#151520" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-white">{totalPipelineLeads}</span>
              <span className="text-[10px] font-semibold text-slate-400">Total Leads</span>
            </div>
          </div>

          {/* Donut Legend List */}
          <div className="space-y-1.5 pt-1 text-xs">
            {pipelineStages.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-300 font-medium">{s.name}</span>
                </div>
                <span className="font-bold text-white">
                  {s.value} ({Math.round((s.value / totalPipelineLeads) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities Feed */}
        <Card glowColor="purple" className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <Clock size={15} className="text-purple-400" />
              Recent Activities
            </h4>
            <Link href="/analytics" className="text-[10px] text-purple-400 hover:underline font-semibold">
              History
            </Link>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-white/[0.04] space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate">{act.title}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{formatTimeAgo(act.timestamp)}</span>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{act.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Document Extraction Card */}
        <Card glowColor="blue" className="p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <FileText size={15} className="text-blue-400" />
              AI Document Extractor
            </h4>
            <span className="text-[10px] text-blue-400 font-bold uppercase">CSV / PDF</span>
          </div>

          {/* Dashed Upload Zone Link */}
          <Link
            href="/extractor"
            className="p-5 rounded-2xl border-2 border-dashed border-white/[0.12] hover:border-purple-500/60 transition-colors bg-white/[0.01] hover:bg-purple-500/[0.02] flex flex-col items-center justify-center text-center space-y-2 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <UploadCloud size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                Choose File to Extract
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Upload CSV or PDF to extract & import into CRM
              </p>
            </div>
          </Link>

          <p className="text-[10px] text-slate-400 text-center">
            Auto-parses client metadata & deal values into CRM fields using AI.
          </p>
        </Card>

        {/* Top Customers List */}
        <Card glowColor="emerald" className="p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h4 className="text-xs font-extrabold text-white">Top Revenue Customers</h4>
            <Link href="/contacts" className="text-[10px] text-purple-400 hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {contacts.slice(0, 4).map((c, idx) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{c.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{c.company_name || 'Enterprise'}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 shrink-0">
                  {formatCurrency((idx + 1) * 28500)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.06] text-center">
            <span className="text-[10px] text-slate-400 font-medium">
              Top 10% customers generate 74% of revenue
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
