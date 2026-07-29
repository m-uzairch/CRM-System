'use me';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Kanban,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Deals', href: '/deals', icon: Kanban },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true); // Default to icon-only / collapsible
  const { user, logout } = useAuth();

  const isItemActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0A0A0F] border-r border-white/[0.08] select-none text-slate-300">
      {/* Brand Header / Logo */}
      <div
        className={`flex items-center h-16 border-b border-white/[0.08] px-3 transition-all ${
          collapsed ? 'justify-center' : 'justify-between px-4'
        }`}
      >
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-3 overflow-hidden group"
          title="Avex CRM Dashboard"
        >
          {/* Logo Mark: Blue-to-purple gradient avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-purple-500/20 shrink-0 group-hover:scale-105 transition-transform">
            A
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
                AVEX <span className="text-purple-400">CRM</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                Pipeline & Agency
              </span>
            </div>
          )}
        </Link>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden md:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors ${
            collapsed ? 'mt-0' : ''
          }`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Icons List */}
      <nav className="flex-1 px-2.5 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isItemActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name + item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={collapsed ? item.name : undefined}
              className={`relative flex items-center gap-3 rounded-xl font-medium text-xs transition-all duration-150 group ${
                collapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5'
              } ${
                active
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white font-bold border border-purple-500/30 shadow-md shadow-purple-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-purple-500" />
              )}
              <Icon
                size={18}
                className={`shrink-0 transition-transform group-hover:scale-110 ${
                  active ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!collapsed && <span className="truncate text-xs">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Pinned Bottom Controls: Settings + Logout */}
      <div className="p-2.5 border-t border-white/[0.08] bg-[#0E0E16] space-y-1">
        {/* Settings Link */}
        <Link
          href="/settings"
          onClick={onCloseMobile}
          title={collapsed ? 'Settings' : undefined}
          className={`flex items-center gap-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all font-medium text-xs ${
            collapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5'
          } ${isItemActive('/settings') ? 'text-white bg-white/[0.08] font-bold' : ''}`}
        >
          <Settings size={18} className="shrink-0 text-slate-400 group-hover:text-slate-200" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Logout Button */}
        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            logout();
          }}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all font-medium text-xs cursor-pointer ${
            collapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5'
          }`}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* User Avatar Card (if expanded) */}
        {!collapsed && (
          <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2.5 px-2 py-1">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt="User"
              className="w-7 h-7 rounded-full ring-2 ring-purple-500/40 object-cover shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate leading-tight">
                {user?.displayName || 'Alex Avex'}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {user?.email || 'alex@avexagency.com'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Collapsible Icon-Only / Expanded) */}
      <aside
        className={`hidden md:flex relative flex-col h-full z-30 transition-all duration-200 shrink-0 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />
          <aside className="relative w-64 max-w-[80vw] h-full bg-[#0A0A0F] border-r border-white/[0.08] z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

