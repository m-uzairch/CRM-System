'use me';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Kanban,
  Menu,
  Plus,
} from 'lucide-react';
import DealFormModal from '../deals/DealFormModal';

interface MobileNavProps {
  onOpenSidebar: () => void;
}

export default function MobileNav({ onOpenSidebar }: MobileNavProps) {
  const pathname = usePathname();
  const [showQuickDeal, setShowQuickDeal] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0F]/90 backdrop-blur-xl border-t border-white/[0.08] px-3 py-2 flex items-center justify-around md:hidden shadow-2xl select-none">
        {/* Dashboard Link */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            pathname === '/'
              ? 'text-purple-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard size={19} className={pathname === '/' ? 'scale-110' : ''} />
          <span className="text-[10px] tracking-tight mt-0.5">Dashboard</span>
        </Link>

        {/* Leads Link */}
        <Link
          href="/contacts"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            pathname.startsWith('/contacts')
              ? 'text-purple-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users size={19} className={pathname.startsWith('/contacts') ? 'scale-110' : ''} />
          <span className="text-[10px] tracking-tight mt-0.5">Leads</span>
        </Link>

        {/* Central Floating Quick Action [+] Button */}
        <button
          onClick={() => setShowQuickDeal(true)}
          className="-mt-5 p-3 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-600/40 active:scale-90 transition-transform ring-4 ring-[#0A0A0F]"
          title="Create New Deal"
        >
          <Plus size={20} />
        </button>

        {/* Deals Link */}
        <Link
          href="/deals"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            pathname.startsWith('/deals')
              ? 'text-purple-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Kanban size={19} className={pathname.startsWith('/deals') ? 'scale-110' : ''} />
          <span className="text-[10px] tracking-tight mt-0.5">Deals</span>
        </Link>

        {/* More Sidebar Toggle */}
        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-400 hover:text-white transition-all"
          title="Open Full Navigation Menu"
        >
          <Menu size={19} />
          <span className="text-[10px] tracking-tight mt-0.5">More</span>
        </button>
      </div>

      {showQuickDeal && (
        <DealFormModal isOpen={showQuickDeal} onClose={() => setShowQuickDeal(false)} />
      )}
    </>
  );
}
