import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';
import { CRMProvider } from '@/lib/store/crm-context';
import AuthGuard from '@/components/auth/AuthGuard';
import AppLayout from '@/components/layout/AppLayout';
import CustomCursor from '@/components/ui/CustomCursor';

export const metadata: Metadata = {
  title: 'Avex CRM — Modern All-Purpose Dark SaaS CRM for Agencies',
  description: 'Manage clients, deals, tasks, invoices, and AI lead insights in a dark, premium SaaS workspace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-avex-radial text-slate-100 min-h-screen antialiased selection:bg-purple-500 selection:text-white">
        <CustomCursor />
        <AuthProvider>
          <AuthGuard>
            <CRMProvider>
              <AppLayout>{children}</AppLayout>
            </CRMProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
