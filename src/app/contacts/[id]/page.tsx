import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { addActivity } from '../actions'

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const contact = await prisma.contact.findUnique({
    where: { id: resolvedParams.id },
    include: {
      company: true,
      deals: true,
      tickets: true,
      activities: { orderBy: { createdAt: 'desc' }}
    }
  })

  if (!contact) notFound()

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/contacts" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontSize: '0.875rem' }}>← Back to Contacts</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="page-title">{contact.firstName} {contact.lastName}</h1>
          <button className="btn" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Edit Contact</button>
        </div>
        <p className="page-subtitle" style={{ color: 'var(--text-secondary)' }}>
          {contact.email || 'No email provided'} • {contact.phone || 'No phone provided'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        {/* Main Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Related Deals */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Related Deals</h2>
              <Link href={`/pipeline/new?contactId=${contact.id}`} className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: '1px solid var(--border-color)' }}>+ Add</Link>
            </div>
            {contact.deals.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No active deals with this contact.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {contact.deals.map((deal: any) => (
                  <li key={deal.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontWeight: 500 }}>{deal.title}</span>
                    <span style={{ color: 'var(--primary-color)' }}>${deal.value?.toLocaleString() || 0} ({deal.stage})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Related Tickets */}
          <div className="card">
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Support Tickets</h2>
             {contact.tickets.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No support tickets created.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {contact.tickets.map((ticket: any) => (
                  <li key={ticket.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontWeight: 500 }}>{ticket.title}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{ticket.status} • {ticket.priority}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ backgroundColor: 'var(--bg-color)', border: 'none' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Company Profile</h3>
            {contact.company ? (
              <div>
                <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>{contact.company.name}</p>
                {contact.company.industry && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{contact.company.industry}</p>}
                <Link href={`/companies/${contact.company.id}`} style={{ display: 'inline-block', marginTop: '0.5rem', color: 'var(--primary-color)', fontSize: '0.875rem' }}>View Company →</Link>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No company associated.</p>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Activity Timeline</h3>
            
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <form action={addActivity} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input type="hidden" name="contactId" value={contact.id} />
                <select name="type" style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }}>
                  <option value="NOTE">Log a Note</option>
                  <option value="CALL">Log a Call</option>
                  <option value="EMAIL">Log an Email</option>
                  <option value="MEETING">Log a Meeting</option>
                </select>
                <textarea name="description" placeholder="Describe the interaction..." required rows={2} style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}></textarea>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Log Activity</button>
              </form>
            </div>

            {contact.activities && contact.activities.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontStyle: 'italic' }}>No activities logged yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {contact.activities && contact.activities.map((activity: any) => (
                  <div key={activity.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-color)', flexShrink: 0 }}>
                      {activity.type === 'EMAIL' ? '✉' : activity.type === 'CALL' ? '📞' : activity.type === 'MEETING' ? '🤝' : '📝'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{activity.type}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>{activity.description}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
