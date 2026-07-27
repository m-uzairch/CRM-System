'use me';
'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, Building2, LogIn, UserPlus, Sparkles, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function LoginPage() {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      if (tab === 'signin') {
        const success = await login(email, password);
        if (!success) setErrorMsg('Invalid email or password.');
      } else {
        const success = await signup(email, password, displayName, companyName);
        if (!success) setErrorMsg('Could not create account.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    await login('alex@avexagency.com', 'demo1234');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Column: Branding & Value Showcase */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-500/20">
              A
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Avex CRM
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase">
                  PRO
                </span>
              </span>
              <p className="text-xs text-slate-400 font-medium">Modern All-Purpose CRM Suite</p>
            </div>
          </div>

          <div className="space-y-4 pt-6 max-w-lg">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Manage clients, deals & invoices in one place.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Designed for freelancers, creative studios, and high-growth sales teams. Auto-summarize client activity with Google Gemini AI.
            </p>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-3 pt-4 max-w-md">
            {[
              'Unified Contacts & Companies Hub',
              'Drag-and-Drop Sales Pipeline Kanban',
              'Client Invoicing & Clean PDF Exporter',
              'Gemini AI Activity Auto-Summaries & Lead Scoring',
              'Isolated Multi-Tenant Per-Account Workspaces',
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <div className="relative z-10 pt-12 border-t border-slate-800/80 mt-8">
          <p className="text-xs text-slate-500 font-medium">
            © 2026 Avex CRM • Protected with Row Level Security & Encrypted Auth
          </p>
        </div>

        {/* Glow background shapes */}
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right Column: Sign In & Sign Up Form Box */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center bg-slate-900/60 relative">
        <div className="w-full max-w-md space-y-6 bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
          {/* Header & Tabs */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {tab === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {tab === 'signin'
                  ? 'Sign in with your company email to access your isolated workspace.'
                  : 'Start fresh with your own isolated CRM dataset.'}
              </p>
            </div>

            {/* Tab Pill Switcher */}
            <div className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => { setTab('signin'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  tab === 'signin'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab('signup'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  tab === 'signup'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Innovations"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Company Email *
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {tab === 'signin' ? <LogIn size={16} /> : <UserPlus size={16} />}
              <span>{isLoading ? 'Authenticating...' : tab === 'signin' ? 'Sign In to Workspace' : 'Create Isolated Account'}</span>
            </button>
          </form>

          {/* Quick Demo Guest Login Divider */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Or Explore Instantly</span>
            </div>
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Continue with Demo Agency Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
