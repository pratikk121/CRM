import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function NewContactPage() {
  async function createContact(formData: FormData) {
    'use server'
    
    await prisma.contact.create({
      data: {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string || null,
        phone: formData.get('phone') as string || null,
      }
    })
    
    redirect('/contacts')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/contacts" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem', fontSize: '0.875rem' }}>← Back to Contacts</Link>
        <h1 className="page-title">Add New Contact</h1>
      </div>

      <div className="card">
        <form action={createContact} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="firstName" style={{ fontWeight: 500, fontSize: '0.875rem' }}>First Name *</label>
              <input type="text" id="firstName" name="firstName" required style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="lastName" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Last Name *</label>
              <input type="text" id="lastName" name="lastName" required style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
            <input type="email" id="email" name="email" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="phone" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Phone Number</label>
            <input type="tel" id="phone" name="phone" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/contacts" className="btn" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Cancel</Link>
            <button type="submit" className="btn btn-primary">Save Contact</button>
          </div>
        </form>
      </div>
    </div>
  )
}
