import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth, signOut } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

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
        <body className={inter.className}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="layout">
          <aside className="sidebar">
            <header style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Acme CRM</h2>
            </header>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/" className="nav-link">Dashboard</Link>
              <Link href="/contacts" className="nav-link">Contacts</Link>
              <Link href="/companies" className="nav-link">Companies</Link>
              <Link href="/pipeline" className="nav-link">Pipeline</Link>
              <Link href="/tasks" className="nav-link">Tasks</Link>
              <Link href="/support" className="nav-link">Support</Link>
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/admin" className="nav-link" style={{ marginTop: '1rem', color: 'var(--text-primary)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>⚙️ Admin Panel</Link>
              )}
            </nav>
            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
              <form action={async () => {
                'use server'
                await signOut({ redirectTo: '/login' })
              }}>
                <button type="submit" className="nav-link" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)' }}>
                  Sign Out
                </button>
              </form>
            </div>
          </aside>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
