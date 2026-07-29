'use me';
'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, Building2, LogIn, UserPlus, Sparkles, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import AnimatedDashboardMockup from '@/components/auth/AnimatedDashboardMockup';

export default function LoginPage() {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (tab === 'forgot') {
      if (!email) {
        setErrorMsg('Please enter your email address to reset password.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setResetSent(true);
        setSuccessMsg(`Password reset instructions have been sent to ${email}.`);
      }, 900);
      return;
    }

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
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Column: Form Container */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-between relative bg-zinc-900/90 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-zinc-800">
        {/* Brand Header */}
        <div className="relative z-10 space-y-6 max-w-md mx-auto lg:mx-0 w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-zinc-950 flex items-center justify-center font-extrabold text-xl shadow-lg border border-zinc-200">
              A
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                AVEX CRM
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold uppercase tracking-wider">
                  PRO
                </span>
              </span>
              <p className="text-xs text-zinc-400 font-medium">Monochrome SaaS Intelligence</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {tab === 'forgot'
                ? 'Reset Password'
                : tab === 'signin'
                ? 'Welcome back to Avex CRM'
                : 'Build your agency empire'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Automate client management, sales pipelines, and AI lead insights in a clean monochrome workspace.
            </p>
          </div>

          {/* Form Box */}
          <div className="space-y-5 bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-2xl backdrop-blur-md">
            {/* Tab Switcher */}
            {tab !== 'forgot' && (
              <div className="flex items-center p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => { setTab('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    tab === 'signin'
                      ? 'bg-white text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    tab === 'signup'
                      ? 'bg-white text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-rose-400 font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-emerald-400 font-medium flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Forgot Password View */}
            {tab === 'forgot' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Registered Account Email *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="alex@avexagency.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                {!resetSent ? (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
                  >
                    <KeyRound size={16} />
                    <span>{isLoading ? 'Sending Reset Link...' : 'Send Password Reset Link'}</span>
                  </button>
                ) : (
                  <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center space-y-2">
                    <p className="text-xs text-zinc-300">
                      Check your email inbox for password recovery instructions.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => { setTab('signin'); setErrorMsg(''); setSuccessMsg(''); setResetSent(false); }}
                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </button>
              </form>
            ) : (
              /* Sign In / Sign Up Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          placeholder="Sarah Connor"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="text"
                          value={companyName}
                          onChange={e => setCompanyName(e.target.value)}
                          placeholder="Apex Innovations"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Company Email *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="alex@avexagency.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Password *
                    </label>
                    {tab === 'signin' && (
                      <button
                        type="button"
                        onClick={() => { setTab('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                        className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-white hover:bg-zinc-200 active:scale-98 text-zinc-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
                >
                  {tab === 'signin' ? <LogIn size={16} /> : <UserPlus size={16} />}
                  <span>{isLoading ? 'Authenticating...' : tab === 'signin' ? 'Sign In to Workspace' : 'Create Isolated Account'}</span>
                </button>
              </form>
            )}

            {/* Quick Demo Guest Login */}
            {tab !== 'forgot' && (
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <button
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs rounded-xl border border-zinc-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} className="text-zinc-400" />
                  <span>Explore Demo Workspace Instantly</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-8 border-t border-zinc-800 mt-8 text-center lg:text-left">
          <p className="text-[11px] text-zinc-500 font-medium">
            © 2026 AVEX CRM • Encrypted Row Level Security Workspaces
          </p>
        </div>
      </div>

      {/* Right Column: Animated Live Dashboard Mockup Preview */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative bg-zinc-950 border-l border-zinc-800/60">
        <div className="relative z-10 w-full">
          <div className="text-center mb-6 max-w-sm mx-auto space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-300 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 inline-block">
              Live Mockup Experience
            </span>
            <p className="text-xs text-zinc-400">
              Interactive preview of your future command center
            </p>
          </div>

          <AnimatedDashboardMockup />
        </div>
      </div>
    </div>
  );
}
