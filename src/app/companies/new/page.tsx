import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function NewCompanyPage() {
  async function createCompany(formData: FormData) {
    'use server'
    await prisma.company.create({
      data: {
        name: formData.get('name') as string,
        industry: formData.get('industry') as string || null,
        website: formData.get('website') as string || null,
      }
    })
    redirect('/companies')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/companies" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontSize: '0.875rem' }}>← Back to Companies</Link>
        <h1 className="page-title">Add New Company</h1>
      </div>

      <div className="card">
        <form action={createCompany} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="name" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Company Name *</label>
            <input type="text" id="name" name="name" required style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="industry" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Industry</label>
            <input type="text" id="industry" name="industry" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="website" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Website URL</label>
            <input type="url" id="website" name="website" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/companies" className="btn" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Cancel</Link>
            <button type="submit" className="btn btn-primary">Save Company</button>
          </div>
        </form>
      </div>
    </div>
  )
}
