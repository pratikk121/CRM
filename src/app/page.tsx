import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"

export const dynamic = 'force-dynamic';

export default async function DashboardHome() {
  const session = await auth();

  // If no session, intercept the database queries and return the stunning Public Landing Page!
  if (!session) {
    return (
      <div style={{ backgroundColor: '#050510', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/logo.png" alt="Acme CRM Logo" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>Acme</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/login" style={{ padding: '0.5rem 1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', color: '#fff', textDecoration: 'none', fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)' }}>Sign In to Workspace</Link>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
             <img src="/logo.png" alt="Acme Icon" style={{ width: '90px', height: '90px', borderRadius: '20px', boxShadow: '0 0 60px rgba(99, 102, 241, 0.4)' }} />
          </div>
          
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.5rem', background: 'linear-gradient(to bottom right, #ffffff, #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            The Future of<br/>Enterprise Sales.
          </h1>
          
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', marginBottom: '4rem', lineHeight: 1.6 }}>
            Acme CRM is an ultra-high performance telemetry and operations network designed explicitly for sales teams that require extreme speed and absolute security.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/login" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '99px', boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)', fontWeight: 600 }}>
              Enter Platform &rarr;
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // ==== PRISMA DASHBOARD AGGREGATIONS FOR AUTHENTICATED USERS ====
  const [
    wonDeals,
    activeDealsCount,
    openTicketsCount,
    recentActivities
  ] = await Promise.all([
    prisma.deal.aggregate({ 
      _sum: { value: true },
      where: { stage: 'WON' } 
    }),
    prisma.deal.count({ 
      where: { stage: { notIn: ['WON', 'LOST'] } } 
    }),
    prisma.ticket.count({ 
      where: { status: { notIn: ['RESOLVED', 'CLOSED'] } } 
    }),
    prisma.activity.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { contact: true, user: true }
    })
  ])

  const totalRevenue = wonDeals._sum.value || 0;

  return (
    <div>
      <h1 className="page-title">Headquarters</h1>
      <p className="page-subtitle">Real-time database telemetry and global overview.</p>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Closed Revenue</h3>
          <p style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 700, color: 'var(--primary-color)', marginTop: '0.5rem', letterSpacing: '-0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Pipeline Deals</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem', letterSpacing: '-0.03em' }}>
            {activeDealsCount}
          </p>
        </div>
        <div className="card" style={{ borderTop: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Open High-Priority Tickets</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem', color: openTicketsCount > 0 ? 'var(--danger-color)' : 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {openTicketsCount}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Live Interaction Engine</h2>
        
        {recentActivities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-color)', opacity: 0.8 }}>
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)' }}>No database activity detected yet.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Actions executed by your team across the platform will begin actively reporting here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivities.map((act: any) => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {act.type.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: 500, fontSize: '1.05rem' }}>{act.description}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Triggered by {act.user?.name || 'System'} • {act.createdAt.toLocaleString()} {act.contact ? `• Subject: ${act.contact.firstName}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
