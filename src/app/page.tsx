import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'; // Ensure Next.js doesn't cache the live dashboard numbers

export default async function DashboardHome() {
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
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-color)', marginTop: '0.5rem', letterSpacing: '-0.03em' }}>
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
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈</div>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)' }}>No database activity detected yet.</p>
            <p style={{ fontSize: '0.875rem' }}>Actions executed by your team across the platform will begin actively reporting here.</p>
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
