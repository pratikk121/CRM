import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { updateTicketStatus } from '../actions'

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id: resolvedParams.id },
    include: {
      contact: true,
      agent: true
    }
  })

  if (!ticket) notFound()

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/support" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontSize: '0.875rem' }}>← Back to Support Queue</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="page-title">{ticket.title}</h1>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            
            {/* Interactive Status Form Buttons */}
            <form action={async () => {
              'use server'
              await updateTicketStatus(ticket.id, 'OPEN')
            }}>
              <button 
                type="submit" 
                style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', border: ticket.status === 'OPEN' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', fontSize: '0.875rem', fontWeight: 600, backgroundColor: 'var(--bg-surface)' }}
              >OPEN</button>
            </form>

            <form action={async () => {
              'use server'
              await updateTicketStatus(ticket.id, 'PENDING')
            }}>
              <button 
                type="submit" 
                style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', border: ticket.status === 'PENDING' ? '2px solid var(--warning-color)' : '1px solid var(--border-color)', fontSize: '0.875rem', fontWeight: 600, backgroundColor: 'var(--bg-surface)' }}
              >PENDING</button>
            </form>

            <form action={async () => {
              'use server'
              await updateTicketStatus(ticket.id, 'RESOLVED')
            }}>
              <button 
                type="submit" 
                style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', border: ticket.status === 'RESOLVED' ? '2px solid var(--success-color)' : '1px solid var(--border-color)', fontSize: '0.875rem', fontWeight: 600, backgroundColor: 'var(--bg-surface)' }}
              >RESOLVED</button>
            </form>

            <span style={{ marginLeft: '1rem', padding: '0.25rem 0.75rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg-surface)', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>{ticket.priority}</span>
          </div>
        </div>
        <p className="page-subtitle" style={{ color: 'var(--text-secondary)' }}>
          Opened on {new Date(ticket.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Description</h3>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{ticket.description || 'No description provided.'}</p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Discussion Thread</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>No messages in this thread yet.</p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <textarea placeholder="Reply to customer..." rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}></textarea>
              <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Send Reply</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ backgroundColor: 'var(--bg-color)', border: 'none' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Customer Profile</h3>
            {ticket.contact ? (
              <div>
                <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>{ticket.contact.firstName} {ticket.contact.lastName}</p>
                <Link href={`/contacts/${ticket.contact.id}`} style={{ display: 'inline-block', marginTop: '0.5rem', color: 'var(--primary-color)', fontSize: '0.875rem' }}>View Contact →</Link>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Anonymous / Not Linked</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
