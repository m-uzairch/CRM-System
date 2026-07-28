'use me';
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Kanban, TrendingUp, ArrowUpRight, Bot } from 'lucide-react';

// Animated Count-Up Hook
function AnimatedCounter({ from = 0, to, duration = 1.5, formatter = (v: number) => v.toString() }: { from?: number; to: number; duration?: number; formatter?: (val: number) => string }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(from + (to - from) * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [from, to, duration]);

  return <span>{formatter(count)}</span>;
}

export default function AnimatedDashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{
        opacity: 1,
        y: [0, -10, 0],
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.8 },
        scale: { duration: 0.8 },
        y: {
          repeat: Infinity,
          duration: 6,
          ease: 'easeInOut',
        },
      }}
      className="relative w-full max-w-xl mx-auto rounded-3xl bg-[#0D0D14] border border-white/[0.08] shadow-2xl p-5 space-y-4 select-none overflow-hidden"
    >
      {/* Decorative Top Glow Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      {/* Mockup Header Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-purple-600/30">
            A
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              AVEX Command Center
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                LIVE DEMO
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Real-time pipeline & agency analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-semibold">Active Workspace</span>
        </div>
      </div>

      {/* Metric Stat Cards Grid with Staggered Entrance & Smooth Hover */}
      <div className="grid grid-cols-2 gap-3">
        {/* Stat Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, scale: 1.015, borderColor: 'rgba(255, 255, 255, 0.16)' }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="p-3.5 rounded-2xl bg-[#151520] border border-white/[0.06] space-y-1.5 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">Total Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign size={14} />
            </div>
          </div>
          <p className="text-lg font-bold text-white tracking-tight">
            <AnimatedCounter to={128450} formatter={(val) => `$${val.toLocaleString()}`} />
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
            <ArrowUpRight size={11} /> +24.8% vs last mo
          </span>
        </motion.div>

        {/* Stat Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, scale: 1.015, borderColor: 'rgba(255, 255, 255, 0.16)' }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="p-3.5 rounded-2xl bg-[#151520] border border-white/[0.06] space-y-1.5 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">Active Deals</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Kanban size={14} />
            </div>
          </div>
          <p className="text-lg font-bold text-white tracking-tight">
            <AnimatedCounter to={42} formatter={(val) => `${val} Opportunities`} />
          </p>
          <span className="text-[10px] text-purple-300 font-semibold">
            $380,000 Total Value
          </span>
        </motion.div>
      </div>

      {/* Sales Overview SVG Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.015, borderColor: 'rgba(255, 255, 255, 0.16)' }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="p-4 rounded-2xl bg-[#151520] border border-white/[0.06] space-y-3 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <TrendingUp size={14} className="text-blue-400" />
              Sales Revenue Growth
            </h4>
            <p className="text-[10px] text-slate-400">Monthly trajectory & closed deals</p>
          </div>
          <span className="text-[10px] font-bold text-blue-400 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            This Quarter
          </span>
        </div>

        {/* SVG Animated Chart Line */}
        <div className="relative h-28 w-full pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mockupGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#9333EA" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <motion.path
              d="M 0 80 Q 80 40 160 60 T 320 20 L 400 10 L 400 100 L 0 100 Z"
              fill="url(#mockupGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            />

            <motion.path
              d="M 0 80 Q 80 40 160 60 T 320 20 L 400 10"
              fill="none"
              stroke="url(#mockupLineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 2, ease: 'easeInOut' }}
            />

            <defs>
              <linearGradient id="mockupLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>

            <motion.circle
              cx="400"
              cy="10"
              r="4"
              fill="#EC4899"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ delay: 2.2, repeat: Infinity, duration: 2 }}
            />
          </svg>
        </div>
      </motion.div>

      {/* AI Insights Banner Mini Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.015, borderColor: 'rgba(168, 85, 247, 0.5)' }}
        transition={{ delay: 0.45, duration: 0.3 }}
        className="p-3 rounded-2xl bg-avex-ai-glow space-y-1.5 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Bot size={15} className="text-purple-400 animate-pulse" />
            <span>Gemini AI Insights</span>
          </div>
          <span className="text-[10px] text-purple-300 font-semibold bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
            Automated
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-snug">
          "3 enterprise proposals have 92% win probability. Recommended follow-up today for Apex Corp."
        </p>
      </motion.div>
    </motion.div>
  );
}
