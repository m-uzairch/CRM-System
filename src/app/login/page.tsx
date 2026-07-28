'use me';
'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, Building2, LogIn, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import AnimatedDashboardMockup from '@/components/auth/AnimatedDashboardMockup';

export default function LoginPage() {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      if (tab === 'signin') {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Invalid email or password.');
        }
      } else {
        const res = await signup(email, password, displayName, companyName);
        if (!res.success) {
          setErrorMsg(res.error || 'Could not create account in database.');
        } else if (res.requiresEmailConfirmation) {
          setSuccessMsg('Account created! Please check your email inbox to confirm your registration.');
        } else {
          setSuccessMsg('Account created successfully! Session synced to database.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    await login('alex@avexagency.com', 'demo1234');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-avex-radial text-slate-100 flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Column: Form Container */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-between relative bg-[#0A0A0F]/80 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-white/[0.06]">
        {/* Brand Header */}
        <div className="relative z-10 space-y-6 max-w-md mx-auto lg:mx-0 w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple-500/30">
              A
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                AVEX CRM
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase tracking-wider">
                  PRO
                </span>
              </span>
              <p className="text-xs text-slate-400 font-medium">Dark Premium SaaS Intelligence</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {tab === 'signin' ? 'Welcome back to Avex CRM' : 'Build your agency empire'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Automate client management, sales pipelines, and Gemini AI insights in a sleek dark workspace.
            </p>
          </div>

          {/* Form Box */}
          <div className="space-y-5 bg-[#151520] p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-2xl backdrop-blur-md">
            {/* Tab Pill Switcher */}
            <div className="flex items-center p-1 bg-[#0A0A0F] rounded-xl border border-white/[0.06]">
              <button
                type="button"
                onClick={() => { setTab('signin'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  tab === 'signin'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
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
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-medium flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder="Sarah Connor"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0F] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
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
                        placeholder="Apex Innovations"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0F] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
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
                    placeholder="alex@avexagency.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0F] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0F] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {tab === 'signin' ? <LogIn size={16} /> : <UserPlus size={16} />}
                <span>{isLoading ? 'Authenticating...' : tab === 'signin' ? 'Sign In to Workspace' : 'Create Isolated Account'}</span>
              </button>
            </form>

            {/* Quick Demo Guest Login */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-semibold text-xs rounded-xl border border-white/[0.08] transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>Explore Demo Workspace Instantly</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-8 border-t border-white/[0.06] mt-8 text-center lg:text-left">
          <p className="text-[11px] text-slate-400">
            © 2026 AVEX CRM • Encrypted Row Level Security Workspaces
          </p>
        </div>
      </div>

      {/* Right Column: Animated Live Dashboard Mockup Preview */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative bg-[#060609]/60">
        {/* Soft Radial Backlight Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-purple-600/15 to-pink-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 w-full">
          <div className="text-center mb-6 max-w-sm mx-auto space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 inline-block">
              Live Mockup Experience
            </span>
            <p className="text-xs text-slate-400">
              Interactive preview of your future command center
            </p>
          </div>

          <AnimatedDashboardMockup />
        </div>
      </div>
    </div>
  );
}
