import type { Metadata } from "next";

import "./globals.css";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Toaster } from "sonner";
import CommandMenu from "./CommandMenu";



export const metadata: Metadata = {
  title: "CRM Application",
  description: "Full-stack customizable CRM",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return (
      <html lang="en">
        <body style={{ margin: 0, padding: 0 }}>
          <Toaster theme="dark" toastOptions={{ style: { background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', color: '#fff' } }} position="bottom-right" />
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <Toaster theme="dark" toastOptions={{ style: { background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', color: '#fff' } }} position="bottom-right" />
        <CommandMenu />
        <div className="layout">
          <aside className="sidebar">
            <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src="/logo.png" alt="Acme Branding Logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Acme CRM</h2>
            </header>
            <nav className="no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
              <Link href="/" className="nav-link">Dashboard</Link>
              <Link href="/contacts" className="nav-link">Contacts</Link>
              <Link href="/companies" className="nav-link">Companies</Link>
              {((session.user as any)?.role !== 'SUPPORT') && (
                <Link href="/pipeline" className="nav-link">Pipeline</Link>
              )}
              <Link href="/tasks" className="nav-link">Tasks</Link>
              <Link href="/support" className="nav-link">Support</Link>
              <Link href="/settings" className="nav-link">Settings</Link>
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/admin" className="nav-link" style={{ marginTop: '1rem', color: 'var(--text-primary)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>⚙️ Admin Panel</Link>
              )}
            </nav>
            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                 Press <strong style={{ color: 'var(--text-primary)', padding: '0.2rem 0.4rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>Cmd + K</strong> to search
              </div>
              <a href="/api/auth/signout?callbackUrl=/login" className="nav-link" style={{ display: 'block', width: '100%', color: 'var(--danger-color)' }}>
                Sign Out
              </a>
            </div>
          </aside>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>
            <header className="top-header">
              <div style={{ fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                 Welcome back, {session.user?.name || 'Admin'}
              </div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--text-secondary)' }}></div>
            </header>
            <main className="main-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
