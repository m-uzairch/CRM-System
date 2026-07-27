'use me';
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Moon, Sun, RefreshCw, User, LogOut, UserPlus, LogIn, Sparkles, ChevronDown, Menu } from 'lucide-react';
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
  const [dark, setDark] = useState(false);
  const [showQuickCreateMenu, setShowQuickCreateMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { resetDemoData, loadSampleDatasetForAccount, contacts } = useCRM();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Check initial dark mode preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (dark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDark(true);
    }
  };

  return (
    <>
      <header className="h-16 px-3 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 z-20 shrink-0">
        {/* Left Section: Mobile Menu Toggle & Global Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Open Navigation Drawer"
            >
              <Menu size={20} />
            </button>
          )}

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search Avex CRM... (⌘K)"
              className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 rounded-xl border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Load Sample Data Button (if account is empty) */}
          {contacts.length === 0 && (
            <button
              onClick={loadSampleDatasetForAccount}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              <Sparkles size={13} />
              Sample Data
            </button>
          )}

          {/* Quick Create Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowQuickCreateMenu(!showQuickCreateMenu)}
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-medium rounded-xl shadow-sm shadow-indigo-500/20 transition-all"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Create New</span>
              <span className="sm:hidden">New</span>
            </button>

            {showQuickCreateMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    setShowContactModal(true);
                    setShowQuickCreateMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  + New Contact
                </button>
                <button
                  onClick={() => {
                    setShowDealModal(true);
                    setShowQuickCreateMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  + New Deal
                </button>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
            >
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt="User Avatar"
                className="w-8 h-8 rounded-full ring-2 ring-indigo-500/30 object-cover shrink-0"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user?.displayName || 'Alex Avex'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate max-w-[110px]">
                  {user?.email || 'Guest'}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden lg:block" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-2"
                >
                  <User size={14} /> Customize Profile & Avatar
                </button>

                <button
                  onClick={() => {
                    setAuthTab('signup');
                    setShowAuthModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-2"
                >
                  <UserPlus size={14} /> Create New Account
                </button>

                <button
                  onClick={() => {
                    setAuthTab('signin');
                    setShowAuthModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-2"
                >
                  <LogIn size={14} /> Switch / Sign In Account
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800/80 mt-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-semibold flex items-center gap-2"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
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
