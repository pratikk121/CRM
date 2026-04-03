import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewTicketPage() {
  const contacts = await prisma.contact.findMany()

  async function createTicket(formData: FormData) {
    'use server'
    await prisma.ticket.create({
      data: {
        title: formData.get('title') as string,
        description: formData.get('description') as string || null,
        status: 'OPEN',
        priority: formData.get('priority') as string,
        contactId: formData.get('contactId') as string || null,
      }
    })
    redirect('/support')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/support" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontSize: '0.875rem' }}>← Back to Support</Link>
        <h1 className="page-title">Create Ticket</h1>
      </div>

      <div className="card">
        <form action={createTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="title" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Issue Title *</label>
            <input type="text" id="title" name="title" required style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="description" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Description</label>
            <textarea id="description" name="description" rows={4} style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}></textarea>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="priority" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Priority</label>
              <select id="priority" name="priority" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="contactId" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Customer Profile</label>
              <select id="contactId" name="contactId" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }}>
                <option value="">-- Anonymous --</option>
                {contacts.map((c: any) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/support" className="btn" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Cancel</Link>
            <button type="submit" className="btn btn-primary">Create Ticket</button>
          </div>
        </form>
      </div>
    </div>
  )
}
