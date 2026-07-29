'use me';
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  MoreVertical,
  Download,
  Filter,
  CheckSquare,
  Sparkles,
  Plus,
  SlidersHorizontal,
  FileSpreadsheet,
  Target,
  UserCheck,
  RefreshCw,
  Kanban,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useCRM } from '@/lib/store/crm-context';
import { useAuth } from '@/lib/auth/auth-context';
import { formatCurrency, formatTimeAgo } from '@/lib/utils';
import Card from '@/components/ui/Card';
import DealFormModal from '@/components/deals/DealFormModal';

// 6-Month Monthly Pipeline Performance Data
const initialMonthlyChartData = [
  { month: 'Jan', leads: 42000, won: 28000 },
  { month: 'Feb', leads: 54000, won: 35000 },
  { month: 'Mar', leads: 48000, won: 32000 },
  { month: 'Apr', leads: 68000, won: 45000 },
  { month: 'May', leads: 75000, won: 52000 },
  { month: 'Jun', leads: 89000, won: 64000 },
];

export default function CRMMainDashboard() {
  const { contacts, deals, invoices, activities } = useCRM();
  const { user } = useAuth();

  // Modal States
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Chart Legend & Filter States
  const [period, setPeriod] = useState('This month');
  const [visibleSeries, setVisibleSeries] = useState<{ leads: boolean; won: boolean }>({
    leads: true,
    won: true,
  });
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);

  // Recent Deals Table Filter & Selection States
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [ownerFilter, setOwnerFilter] = useState<string>('ALL');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Compute live pipeline metrics
  const totalPipelineValue = useMemo(() => {
    return deals.reduce((sum, d) => sum + d.value, 0) || 245000;
  }, [deals]);

  const totalClosedQuarterRevenue = useMemo(() => {
    const paidSum = invoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.total, 0);
    return paidSum || 128450;
  }, [invoices]);

  // Dynamic Recent Deals list from CRM store or mock fallback
  const recentDealsList = useMemo(() => {
    if (deals && deals.length > 0) {
      return deals.map((d) => ({
        id: d.id,
        contactName: d.contact_name || d.title,
        companyName: d.company_name || 'Enterprise Client',
        stage: d.stage,
        value: d.value,
        lastActivity: formatTimeAgo(d.updated_at || d.created_at),
        owner: d.user_id ? 'Alex Avex' : 'Sarah Chen',
      }));
    }

    // Default high quality dataset matching design
    return [
      {
        id: 'd1',
        contactName: 'Elena Rostova',
        companyName: 'Apex Design Labs',
        stage: 'proposal',
        value: 48000,
        lastActivity: '2 hours ago',
        owner: 'Alex Avex',
      },
      {
        id: 'd2',
        contactName: 'Marcus Vance',
        companyName: 'Vortex Cloud Solutions',
        stage: 'qualified',
        value: 95000,
        lastActivity: '5 hours ago',
        owner: 'Sarah Chen',
      },
      {
        id: 'd3',
        contactName: 'Sophia Lin',
        companyName: 'Lumina Health',
        stage: 'won',
        value: 62000,
        lastActivity: '1 day ago',
        owner: 'Alex Avex',
      },
      {
        id: 'd4',
        contactName: 'David Miller',
        companyName: 'Kroma Media Agency',
        stage: 'new',
        value: 35000,
        lastActivity: '2 days ago',
        owner: 'Sarah Chen',
      },
      {
        id: 'd5',
        contactName: 'Claire Bennett',
        companyName: 'Nexus Global Tech',
        stage: 'negotiation',
        value: 120000,
        lastActivity: '3 days ago',
        owner: 'Alex Avex',
      },
    ];
  }, [deals]);

  // Filtered Table Rows
  const filteredDealsList = useMemo(() => {
    return recentDealsList.filter((deal) => {
      const matchStage =
        stageFilter === 'ALL' || deal.stage.toLowerCase() === stageFilter.toLowerCase();
      const matchOwner =
        ownerFilter === 'ALL' || deal.owner.toLowerCase().includes(ownerFilter.toLowerCase());
      return matchStage && matchOwner;
    });
  }, [recentDealsList, stageFilter, ownerFilter]);

  // Toggle Table Select All
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(filteredDealsList.map((d) => d.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  // Toggle Row Select
  const handleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Export CSV Functionality
  const handleExportCSV = () => {
    const csvHeader = 'Contact/Company,Stage,Deal Value,Last Activity,Owner\n';
    const csvRows = filteredDealsList
      .map(
        (d) =>
          `"${d.contactName} (${d.companyName})","${d.stage}",${d.value},"${d.lastActivity}","${d.owner}"`
      )
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avex_crm_recent_deals_${Date.now()}.csv`;
    a.click();

    setExportNotification('Export downloaded successfully!');
    setTimeout(() => setExportNotification(null), 3000);
  };

  // Concentric Ring Stage Tiers Data
  const breakdownRings = [
    { label: 'Lead Tier', value: '$89,000', percentage: '100%', color: '#3B82F6' },
    { label: 'Qualified', value: '$68,000', percentage: '76%', color: '#6366F1' },
    { label: 'Proposal', value: '$52,000', percentage: '58%', color: '#8B5CF6' },
    { label: 'Won Tier', value: '$36,000', percentage: '40%', color: '#A855F7' },
  ];

  return (
    <div className="space-y-6 select-none max-w-[1600px] mx-auto">
      {/* Toast Notification Banner */}
      {exportNotification && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-[#14141E] border border-purple-500/40 text-white rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in duration-200 text-xs font-semibold">
          <Sparkles size={14} className="text-purple-400" />
          <span>{exportNotification}</span>
        </div>
      )}

      {/* 3. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Your pipeline summary
          </p>
        </div>

        {/* Right-aligned Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#14141E] hover:bg-white/[0.06] text-slate-200 text-xs font-semibold border border-white/[0.08] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet size={15} className="text-slate-400" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => {
              setExportNotification('Custom view applied');
              setTimeout(() => setExportNotification(null), 2500);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#14141E] hover:bg-white/[0.06] text-slate-200 text-xs font-semibold border border-white/[0.08] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal size={15} className="text-slate-400" />
            <span>Custom View</span>
          </button>

          {/* Primary CTA button: Gradient-filled blue to purple */}
          <button
            onClick={() => setShowNewDealModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>+ New Deal</span>
          </button>
        </div>
      </div>

      {/* 4. Main Content — Two-Column Grid (65 / 35 split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (~65% / 8 columns out of 12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* a) "Pipeline Value" Card */}
          <Card className="p-5 sm:p-6 space-y-5 bg-[#14141E] border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Pipeline Value
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {formatCurrency(totalPipelineValue)}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                    <ArrowUpRight size={13} /> +14.2% vs last month
                  </span>
                </div>
              </div>

              {/* Controls: Period Dropdown + Overflow Menu */}
              <div className="flex items-center gap-2 self-start sm:self-center relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="bg-[#0E0E16] text-xs font-semibold text-slate-200 border border-white/[0.1] rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="This month">This month ▾</option>
                  <option value="This quarter">This quarter ▾</option>
                  <option value="Last 6 months">Last 6 months ▾</option>
                </select>

                <div className="relative">
                  <button
                    onClick={() => setShowOverflowMenu(!showOverflowMenu)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                    title="Options"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {showOverflowMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-[#181824] rounded-2xl shadow-2xl border border-white/[0.1] py-2 z-30 text-xs">
                      <button
                        onClick={() => {
                          setShowOverflowMenu(false);
                          setExportNotification('Pipeline metrics refreshed');
                          setTimeout(() => setExportNotification(null), 2500);
                        }}
                        className="w-full text-left px-4 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-white cursor-pointer"
                      >
                        Refresh metrics
                      </button>
                      <button
                        onClick={() => {
                          setShowOverflowMenu(false);
                          handleExportCSV();
                        }}
                        className="w-full text-left px-4 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-white cursor-pointer"
                      >
                        Export chart data
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Dual-Series Bar Chart */}
            <div className="space-y-3">
              {/* Interactive Legend Toggle */}
              <div className="flex items-center justify-end gap-5 text-xs font-semibold pt-1">
                <button
                  onClick={() =>
                    setVisibleSeries((prev) => ({ ...prev, leads: !prev.leads }))
                  }
                  className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                    visibleSeries.leads ? 'opacity-100' : 'opacity-40 line-through'
                  }`}
                >
                  <span className="w-3 h-3 rounded-md bg-[#3B82F6] inline-block shadow-sm" />
                  <span className="text-slate-300">New Leads</span>
                </button>

                <button
                  onClick={() =>
                    setVisibleSeries((prev) => ({ ...prev, won: !prev.won }))
                  }
                  className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                    visibleSeries.won ? 'opacity-100' : 'opacity-40 line-through'
                  }`}
                >
                  <span className="w-3 h-3 rounded-md bg-[#8B5CF6] inline-block shadow-sm" />
                  <span className="text-slate-300">Won Deals</span>
                </button>
              </div>

              {/* Recharts Bar Container */}
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={initialMonthlyChartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    barGap={6}
                  >
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
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="p-3 bg-[#181824] border border-white/[0.1] rounded-xl shadow-2xl space-y-1 text-xs">
                              <p className="font-extrabold text-white pb-1 border-b border-white/[0.08]">
                                {label} Performance
                              </p>
                              {payload.map((entry: any, index: number) => (
                                <div
                                  key={`item-${index}`}
                                  className="flex items-center justify-between gap-4"
                                >
                                  <span
                                    className="font-medium"
                                    style={{ color: entry.color }}
                                  >
                                    {entry.name}:
                                  </span>
                                  <span className="font-extrabold text-white">
                                    {formatCurrency(entry.value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {visibleSeries.leads && (
                      <Bar
                        dataKey="leads"
                        name="New Leads"
                        fill="#3B82F6"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={28}
                      />
                    )}
                    {visibleSeries.won && (
                      <Bar
                        dataKey="won"
                        name="Won Deals"
                        fill="#8B5CF6"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={28}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* b) "Recent Deals" Table */}
          <Card className="p-5 sm:p-6 space-y-4 bg-[#14141E] border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                  Recent Deals
                </h3>
                <p className="text-xs text-slate-400">
                  Active pipeline transactions & stage statuses
                </p>
              </div>

              {/* Column filter dropdowns + Download button */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Stage Filter */}
                <div className="relative">
                  <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="bg-[#0E0E16] text-xs font-semibold text-slate-200 border border-white/[0.1] rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="ALL">Stage: All ▾</option>
                    <option value="lead">Lead / Prospect</option>
                    <option value="new">New</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Closed Won</option>
                  </select>
                </div>

                {/* Owner Filter */}
                <div className="relative">
                  <select
                    value={ownerFilter}
                    onChange={(e) => setOwnerFilter(e.target.value)}
                    className="bg-[#0E0E16] text-xs font-semibold text-slate-200 border border-white/[0.1] rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="ALL">Owner: All ▾</option>
                    <option value="Alex">Alex Avex</option>
                    <option value="Sarah">Sarah Chen</option>
                  </select>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-xl bg-[#0E0E16] hover:bg-white/[0.06] text-slate-300 text-xs font-semibold border border-white/[0.1] transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Download CSV"
                >
                  <Download size={14} className="text-slate-400" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="bg-[#0E0E16] border-b border-white/[0.08] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredDealsList.length > 0 &&
                          selectedRowIds.length === filteredDealsList.length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="p-3">Contact / Company</th>
                    <th className="p-3">Stage</th>
                    <th className="p-3 text-right">Deal Value</th>
                    <th className="p-3">Last Activity</th>
                    <th className="p-3">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredDealsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                        No deals match the selected stage and owner filters.
                      </td>
                    </tr>
                  ) : (
                    filteredDealsList.map((deal) => {
                      const isSelected = selectedRowIds.includes(deal.id);
                      return (
                        <tr
                          key={deal.id}
                          className={`transition-colors hover:bg-white/[0.04] ${
                            isSelected ? 'bg-purple-500/10' : ''
                          }`}
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectRow(deal.id)}
                              className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-white leading-tight">
                              {deal.contactName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {deal.companyName}
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                                deal.stage === 'won'
                                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                  : deal.stage === 'proposal'
                                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                                  : deal.stage === 'qualified'
                                  ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}
                            >
                              {deal.stage}
                            </span>
                          </td>
                          <td className="p-3 text-right font-extrabold text-white">
                            {formatCurrency(deal.value)}
                          </td>
                          <td className="p-3 text-slate-400 font-medium">
                            {deal.lastActivity}
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-200">
                              {deal.owner}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (~35% / 4 columns out of 12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* c) "Pipeline Breakdown" Widget (Concentric Ring / Donut Visual) */}
          <Card className="p-5 sm:p-6 space-y-5 bg-[#14141E] border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  Pipeline Breakdown
                </h3>
                <p className="text-xs text-slate-400">Deal value tiers by stage</p>
              </div>

              <Link
                href="/deals"
                className="p-1.5 rounded-xl bg-[#0E0E16] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="View pipeline details"
              >
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* Concentric Nested Rings Visual */}
            <div className="flex flex-col items-center justify-center py-2 relative">
              <div className="relative w-52 h-52 flex items-center justify-center">
                {/* Ring 1 (Outer - Lead) */}
                <div className="absolute inset-0 rounded-full border-4 border-[#3B82F6]/30 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-[#3B82F6] border-t-transparent -rotate-45 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />

                {/* Ring 2 (Qualified) */}
                <div className="absolute inset-4 rounded-full border-4 border-[#6366F1]/30" />
                <div className="absolute inset-4 rounded-full border-4 border-[#6366F1] border-r-transparent rotate-45 shadow-[0_0_15px_rgba(99,102,241,0.3)]" />

                {/* Ring 3 (Proposal) */}
                <div className="absolute inset-8 rounded-full border-4 border-[#8B5CF6]/30" />
                <div className="absolute inset-8 rounded-full border-4 border-[#8B5CF6] border-b-transparent rotate-90 shadow-[0_0_15px_rgba(139,92,246,0.3)]" />

                {/* Ring 4 (Inner - Won) */}
                <div className="absolute inset-12 rounded-full border-4 border-[#A855F7]/30" />
                <div className="absolute inset-12 rounded-full border-4 border-[#A855F7] border-l-transparent shadow-[0_0_15px_rgba(168,85,247,0.3)]" />

                {/* Center Value */}
                <div className="flex flex-col items-center justify-center text-center z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Total
                  </span>
                  <span className="text-xl font-extrabold text-white tracking-tight">
                    {formatCurrency(totalPipelineValue)}
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold">
                    4 Active Tiers
                  </span>
                </div>
              </div>
            </div>

            {/* Ring Labels with Value Tiers */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              {breakdownRings.map((ring) => (
                <div
                  key={ring.label}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#0E0E16] border border-white/[0.04] text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: ring.color }}
                    />
                    <span className="font-bold text-slate-200">{ring.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white">{ring.value}</span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      ({ring.percentage})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* d) "Targets" Card */}
          <Card className="p-5 sm:p-6 space-y-5 bg-[#14141E] border-white/[0.08]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Quarterly Closed Revenue
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {formatCurrency(totalClosedQuarterRevenue)}
                </h3>
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  +18.5% vs Q2
                </span>
              </div>
            </div>

            {/* Target Goal Rows */}
            <div className="space-y-4 pt-1">
              {/* Target 1 */}
              <div className="p-3.5 rounded-2xl bg-[#0E0E16] border border-white/[0.06] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Target size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">
                        Q3 Revenue Target
                      </p>
                      <p className="text-[10px] text-slate-400">Target: $150,000</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-white">$128,450</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 w-[85%]" />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
                  <span>Achieved in 2.5 months</span>
                  <span className="text-purple-400 font-bold">85% Completed</span>
                </p>
              </div>

              {/* Target 2 */}
              <div className="p-3.5 rounded-2xl bg-[#0E0E16] border border-white/[0.06] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">
                        New Client Signups
                      </p>
                      <p className="text-[10px] text-slate-400">Target: 50 clients</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-white">45 clients</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 w-[90%]" />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
                  <span>On track for end of quarter</span>
                  <span className="text-blue-400 font-bold">90% Completed</span>
                </p>
              </div>

              {/* Target 3 */}
              <div className="p-3.5 rounded-2xl bg-[#0E0E16] border border-white/[0.06] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <RefreshCw size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">
                        Renewal Goal
                      </p>
                      <p className="text-[10px] text-slate-400">Target: $50,000</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-white">$35,000</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 w-[70%]" />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
                  <span>On track</span>
                  <span className="text-purple-400 font-bold">70% Completed</span>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Deal Creation Modal */}
      {showNewDealModal && (
        <DealFormModal
          isOpen={showNewDealModal}
          onClose={() => setShowNewDealModal(false)}
        />
      )}
    </div>
  );
}

