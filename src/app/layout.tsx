import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';
import { CRMProvider } from '@/lib/store/crm-context';
import AuthGuard from '@/components/auth/AuthGuard';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Avex CRM — Modern All-Purpose CRM for Freelancers & Agencies',
  description: 'Manage clients, deals, tasks, invoices, and AI lead insights in one beautifully designed workspace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <AuthGuard>
            <CRMProvider>
              <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
                {/* Animated Navigation Sidebar */}
                <Sidebar />

                {/* Main Content Viewport */}
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                  </main>
                </div>
              </div>
            </CRMProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
