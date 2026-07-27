'use me';
'use client';

import React, { useState } from 'react';
import { RefreshCw, Database, Sparkles, User, UserPlus, LogIn, Check } from 'lucide-react';
import { useCRM } from '@/lib/store/crm-context';
import { useAuth } from '@/lib/auth/auth-context';
import ProfileModal from '@/components/profile/ProfileModal';
import AuthModal from '@/components/auth/AuthModal';

export default function SettingsPage() {
  const { resetDemoData, loadSampleDatasetForAccount, contacts } = useCRM();
  const { user } = useAuth();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signup');

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Application & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize display profile, switch accounts, configure Supabase auth, and manage isolated datasets.
        </p>
      </div>

      {/* User Account Profile Card */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.displayName}
              className="w-14 h-14 rounded-2xl ring-4 ring-indigo-500/20 object-cover shrink-0"
            />
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                {user?.displayName || 'Alex Avex'}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                  Active Account
                </span>
              </h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{user?.companyName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProfileModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <User size={14} /> Edit Profile
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">Account Isolation Status:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check size={14} /> Scoped Dataset Active ({contacts.length} Contacts)
          </span>
        </div>
      </div>

      {/* Account Switcher / Sign Up Card */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Multi-User Account Switcher</h3>
          <p className="text-xs text-slate-500">Sign in with another company email or create a new isolated account.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAuthTab('signin');
              setShowAuthModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs rounded-xl transition-colors"
          >
            <LogIn size={14} /> Sign In
          </button>

          <button
            onClick={() => {
              setAuthTab('signup');
              setShowAuthModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <UserPlus size={14} /> Create New Account
          </button>
        </div>
      </div>

      {/* Supabase Status Card */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Database size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Supabase Multi-Tenant Postgres Schema</h3>
            <p className="text-xs text-slate-500">Row Level Security policy `auth.uid() = user_id` for database isolation.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Migrations Schema:</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">supabase/schema.sql</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Seed Script:</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">supabase/seed.sql</span>
          </div>
        </div>
      </div>

      {/* Reset Seed Data */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Dataset Management for This Account</h3>
          <p className="text-xs text-slate-500">Clear workspace or load pre-seeded sample agency dataset.</p>
        </div>

        <div className="flex items-center gap-2">
          {contacts.length === 0 && (
            <button
              onClick={loadSampleDatasetForAccount}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-semibold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              <Sparkles size={14} /> Load Sample Data
            </button>
          )}

          <button
            onClick={resetDemoData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs rounded-xl transition-colors"
          >
            <RefreshCw size={14} /> Clear Workspace
          </button>
        </div>
      </div>

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      )}
      {showAuthModal && (
        <AuthModal isOpen={showAuthModal} initialTab={authTab} onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
