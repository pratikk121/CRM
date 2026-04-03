import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CreateContactModal from './CreateContactModal'
import CSVManager from './CSVManager'

export default async function ContactsPage() {
  // Fetch contacts from the database
  const [contacts, companies] = await Promise.all([
    prisma.contact.findMany({
      include: {
        company: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.company.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } })
  ])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage your customers and leads.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <CSVManager contacts={contacts} />
          <CreateContactModal companies={companies} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Name</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Phone</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Company</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No contacts found. Create one to get started!
                </td>
              </tr>
            ) : (
              contacts.map((contact: any) => (
                <tr key={contact.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>
                    {contact.firstName} {contact.lastName}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{contact.email || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{contact.phone || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    {contact.company ? (
                      <span style={{ backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                        {contact.company.name}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <Link href={`/contacts/${contact.id}`} style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 500 }}>
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
