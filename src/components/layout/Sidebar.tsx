'use me';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Kanban,
  CheckSquare,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Mail,
  PhoneCall,
  Bot,
  PieChart,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: string | null;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'Management',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Leads', href: '/contacts?tab=lead', icon: Users, badge: 'Hot' },
      { name: 'Customers', href: '/contacts?tab=client', icon: Users },
      { name: 'Deals', href: '/deals', icon: Kanban, badge: 'Live' },
      { name: 'Tasks', href: '/tasks', icon: CheckSquare },
      { name: 'Appointments', href: '/tasks?view=calendar', icon: Calendar },
    ],
  },
  {
    title: 'Communication',
    items: [
      { name: 'Messages', href: '/contacts?action=message', icon: MessageSquare },
      { name: 'Emails', href: '/contacts?action=email', icon: Mail },
      { name: 'Calls', href: '/contacts?action=call', icon: PhoneCall },
    ],
  },
  {
    title: 'Documents',
    items: [
      { name: 'Documents', href: '/invoices', icon: FileText },
      { name: 'AI Extractor', href: '/analytics?tab=extractor', icon: Bot, badge: 'AI' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { name: 'Reports', href: '/analytics', icon: PieChart },
      { name: 'Analytics', href: '/analytics?tab=performance', icon: BarChart3 },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const isItemActive = (itemHref: string) => {
    const searchString = searchParams ? searchParams.toString() : '';
    const currentFullPath = searchString ? `${pathname}?${searchString}` : pathname;

    // Exact full path match (including query params)
    if (currentFullPath === itemHref) return true;

    // If item.href contains query parameters (e.g. /contacts?tab=client), require exact match
    if (itemHref.includes('?')) {
      return currentFullPath === itemHref;
    }

    // If item.href has NO query parameters (e.g. /deals):
    if (pathname === itemHref) {
      // If we are on base pathname but query parameters exist, don't highlight non-query items
      if (searchString) {
        return false;
      }
      return true;
    }

    // Sub-route match (e.g. /deals/123 -> /deals)
    if (itemHref !== '/' && pathname.startsWith(itemHref + '/')) {
      return true;
    }

    return false;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0A0A0F] border-r border-white/[0.06] select-none text-slate-300">
      {/* Brand Header */}
      <div
        className={`flex items-center h-16 border-b border-white/[0.06] transition-all px-4 ${
          collapsed ? 'justify-center px-2' : 'justify-between'
        }`}
      >
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-3 overflow-hidden group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-purple-500/25 shrink-0 group-hover:scale-105 transition-transform">
            A
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
                AVEX <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CRM</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase tracking-wider">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                Sales & Agency Intelligence
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden md:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors ${
            collapsed ? 'absolute -right-3 top-5 bg-[#151520] border border-white/[0.08] shadow-lg z-40' : ''
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={16} />}
        </button>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06]"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {/* Navigation Links Grouped by Section */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto overflow-x-hidden">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400/80 mb-1.5">
                {section.title}
              </h3>
            )}

            {section.items.map((item) => {
              const active = isItemActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name + item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  title={collapsed ? item.name : undefined}
                  className={`relative flex items-center gap-3 rounded-xl font-medium text-xs transition-all duration-150 group ${
                    collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                  } ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon
                    size={17}
                    className={`shrink-0 transition-transform ${
                      active ? 'text-white scale-105' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />

                  {!collapsed && (
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                            item.badge === 'AI'
                              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40'
                              : item.badge === 'Hot'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Profile Pinned at Bottom */}
      <div className="p-3 border-t border-white/[0.06] bg-[#0D0D14]">
        <div
          className={`flex items-center gap-3 p-2 rounded-2xl hover:bg-white/[0.04] transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="relative shrink-0">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/40"
            />
            {/* Online Status Dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0D0D14]" />
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate leading-tight">
                {user?.displayName || 'Alex Avex'}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {user?.email || 'alex@avexagency.com'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden md:flex relative flex-col h-full z-30 transition-all duration-300 shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />
          <aside className="relative w-72 max-w-[80vw] h-full bg-[#0A0A0F] border-r border-white/[0.06] z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
