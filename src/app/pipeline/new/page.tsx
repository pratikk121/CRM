import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewDealPage() {
  const companies = await prisma.company.findMany()
  const contacts = await prisma.contact.findMany()

  async function createDeal(formData: FormData) {
    'use server'
    await prisma.deal.create({
      data: {
        title: formData.get('title') as string,
        value: parseFloat(formData.get('value') as string) || null,
        companyId: formData.get('companyId') as string || null,
        contactId: formData.get('contactId') as string || null,
        stage: formData.get('stage') as string,
      }
    })
    redirect('/pipeline')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/pipeline" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontSize: '0.875rem' }}>← Back to Pipeline</Link>
        <h1 className="page-title">Add New Deal</h1>
      </div>

      <div className="card">
        <form action={createDeal} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="title" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Deal Title *</label>
            <input type="text" id="title" name="title" required style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="value" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Expected Value ($)</label>
              <input type="number" id="value" name="value" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="stage" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Initial Stage</label>
              <select id="stage" name="stage" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }}>
                <option value="PROSPECT">Prospect</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="companyId" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Associated Company</label>
              <select id="companyId" name="companyId" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }}>
                <option value="">-- None --</option>
                {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="contactId" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Primary Contact</label>
              <select id="contactId" name="contactId" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }}>
                <option value="">-- None --</option>
                {contacts.map((c: any) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/pipeline" className="btn" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Cancel</Link>
            <button type="submit" className="btn btn-primary">Save Deal</button>
          </div>
        </form>
      </div>
    </div>
  )
}
