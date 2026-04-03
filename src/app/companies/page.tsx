import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Companies</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage your B2B accounts.</p>
        </div>
        <Link href="/companies/new" className="btn btn-primary">
          + Add Company
        </Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Name</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Industry</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Website</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No companies found.</td></tr>
            ) : (
              companies.map((company: any) => (
                <tr key={company.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{company.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{company.industry || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{company.website || '-'}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <Link href={`/companies/${company.id}`} style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 500 }}>View</Link>
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
