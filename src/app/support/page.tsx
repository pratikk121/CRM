import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CreateTicketModal from './CreateTicketModal'

export default async function SupportPage() {
  const [tickets, contacts] = await Promise.all([
    prisma.ticket.findMany({ include: { contact: true }, orderBy: { createdAt: 'desc' } }),
    prisma.contact.findMany({ orderBy: { firstName: 'asc' } })
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'var(--primary-color)'
      case 'PENDING': return 'var(--warning-color)'
      case 'RESOLVED': return 'var(--success-color)'
      default: return 'var(--text-secondary)'
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Support Queue</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage customer requests and issues.</p>
        </div>
        <CreateTicketModal contacts={contacts} />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Title</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Contact</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No tickets found.</td></tr>
            ) : (
              tickets.map((ticket: any) => (
                <tr key={ticket.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: getStatusColor(ticket.status) }}>{ticket.status}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{ticket.title}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{ticket.contact?.firstName || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{ticket.priority}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
