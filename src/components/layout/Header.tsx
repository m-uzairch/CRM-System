'use me';
'use client';

import React, { useState } from 'react';
import { Search, Plus, Bell, User, LogOut, UserPlus, LogIn, Sparkles, ChevronDown, Menu } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { useAuth } from '@/lib/auth/auth-context';
import ContactFormModal from '../contacts/ContactFormModal';
import DealFormModal from '../deals/DealFormModal';
import AuthModal from '../auth/AuthModal';
import ProfileModal from '../profile/ProfileModal';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export default function Header({ onToggleMobileSidebar }: HeaderProps) {
  const [showQuickCreateMenu, setShowQuickCreateMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { loadSampleDatasetForAccount, contacts } = useCRM();
  const { user, logout } = useAuth();

  return (
    <>
      <header className="h-16 px-4 sm:px-6 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between gap-3 z-20 shrink-0 select-none">
        {/* Left: Search Input & Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0"
              title="Open Navigation Drawer"
            >
              <Menu size={20} />
            </button>
          )}

          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search contacts, deals, tasks... (⌘K)"
              className="w-full pl-10 pr-12 py-2 bg-[#14141E] text-xs sm:text-sm text-slate-100 placeholder-slate-400 rounded-xl border border-white/[0.08] focus:border-purple-500/60 focus:outline-none transition-all"
            />
            <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white/[0.06] rounded border border-white/[0.1]">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Action Controls (Notification bell, User Avatar + Name + Dropdown) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sample Data Import Button if workspace empty */}
          {contacts.length === 0 && (
            <button
              onClick={loadSampleDatasetForAccount}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl border border-purple-500/30 transition-colors cursor-pointer"
            >
              <Sparkles size={13} className="text-purple-400" />
              Load Sample Data
            </button>
          )}

          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowQuickCreateMenu(!showQuickCreateMenu)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Create New</span>
              <span className="sm:hidden">New</span>
            </button>

            {showQuickCreateMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#14141E] rounded-2xl shadow-2xl border border-white/[0.08] py-2 z-50">
                <button
                  onClick={() => {
                    setShowContactModal(true);
                    setShowQuickCreateMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white font-medium transition-colors cursor-pointer"
                >
                  + New Contact / Lead
                </button>
                <button
                  onClick={() => {
                    setShowDealModal(true);
                    setShowQuickCreateMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white font-medium transition-colors cursor-pointer"
                >
                  + New Deal Opportunity
                </button>
              </div>
            )}
          </div>

          {/* Notification Bell with unread purple dot */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-[#0A0A0F]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-[#14141E] rounded-2xl shadow-2xl border border-white/[0.08] p-3 z-50 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-xs font-bold text-white">Notifications</span>
                  <span className="text-[10px] text-purple-400 font-medium">3 New</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                    <p className="font-semibold text-slate-200">New Deal Closed</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Enterprise Cloud Renewal closed ($45k)</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                    <p className="font-semibold text-slate-200">AI Task Reminder</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Follow up with TechCorp due today</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar + Name + Dropdown Chevron */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 pl-1.5 py-1 pr-2 rounded-2xl hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.08] cursor-pointer"
            >
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt="User Avatar"
                className="w-8 h-8 rounded-full ring-2 ring-purple-500/40 object-cover shrink-0"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">
                  {user?.displayName || 'Alex Avex'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">
                  {user?.email || 'Guest'}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#14141E] rounded-2xl shadow-2xl border border-white/[0.08] py-2 z-50">
                <div className="px-4 py-2 border-b border-white/[0.06]">
                  <p className="text-xs font-bold text-white">{user?.displayName || 'Alex Avex'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email || 'alex@avexagency.com'}</p>
                </div>

                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white font-medium flex items-center gap-2 cursor-pointer"
                >
                  <User size={14} /> Profile & Settings
                </button>

                <button
                  onClick={() => {
                    setAuthTab('signup');
                    setShowAuthModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white font-medium flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus size={14} /> Create Account
                </button>

                <button
                  onClick={() => {
                    setAuthTab('signin');
                    setShowAuthModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white font-medium flex items-center gap-2 cursor-pointer"
                >
                  <LogIn size={14} /> Switch Workspace
                </button>

                <div className="border-t border-white/[0.06] mt-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Form Modals */}
      {showContactModal && (
        <ContactFormModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      )}
      {showDealModal && (
        <DealFormModal isOpen={showDealModal} onClose={() => setShowDealModal(false)} />
      )}
      {showAuthModal && (
        <AuthModal isOpen={showAuthModal} initialTab={authTab} onClose={() => setShowAuthModal(false)} />
      )}
      {showProfileModal && (
        <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
}

