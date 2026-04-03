import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const company = await prisma.company.findUnique({
    where: { id: resolvedParams.id },
    include: {
      contacts: true,
      deals: true,
    }
  })

  if (!company) notFound()

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/companies" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontSize: '0.875rem' }}>← Back to Companies</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="page-title">{company.name}</h1>
          <button className="btn" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Edit Company</button>
        </div>
        <p className="page-subtitle" style={{ color: 'var(--text-secondary)' }}>
          {company.industry || 'General Industry'} • {company.website ? <a href={company.website} target="_blank" style={{ color: 'var(--primary-color)' }}>{company.website}</a> : 'No website'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        {/* Main Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Related Contacts */}
          <div className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Employees / Contacts</h2>
            </div>
            {company.contacts.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No contacts associated with this company.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {company.contacts.map((contact: any) => (
                  <li key={contact.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 500 }}>{contact.firstName} {contact.lastName}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{contact.email || contact.phone}</p>
                    </div>
                    <Link href={`/contacts/${contact.id}`} style={{ fontSize: '0.875rem', color: 'var(--primary-color)' }}>View</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Related Deals */}
          <div className="card">
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Company Deals</h2>
            {company.deals.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No deals for this company.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {company.deals.map((deal: any) => (
                  <li key={deal.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontWeight: 500 }}>{deal.title}</span>
                    <span style={{ color: 'var(--primary-color)' }}>${deal.value?.toLocaleString() || 0} ({deal.stage})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ backgroundColor: 'var(--bg-color)', border: 'none' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Account Owner</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--text-secondary)' }}></div>
              <span style={{ fontWeight: 500 }}>Admin User</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
