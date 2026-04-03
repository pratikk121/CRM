"use client"

import { useState } from "react"
import { createContactAction } from "./actions"
import { toast } from "sonner"

export default function CreateContactModal({ companies }: { companies: { id: string, name: string }[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    toast.loading("Deploying new contact records...", { id: "contact" })
    const formData = new FormData(e.currentTarget)
    try {
      await createContactAction(formData)
      toast.success("Contact strictly integrated.", { id: "contact" })
      setOpen(false)
    } catch (err: any) {
      toast.error(err.message, { id: "contact" })
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-primary" style={{ fontWeight: 600 }}>
        + Add Contact
      </button>
      
      {open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', zIndex: 101, padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Form New Record</h2>
               <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div>
                   <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>First Name</label>
                   <input name="firstName" required style={{ width: '100%' }} />
                 </div>
                 <div>
                   <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Last Name</label>
                   <input name="lastName" required style={{ width: '100%' }} />
                 </div>
               </div>
               <div>
                 <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Corporate Email</label>
                 <input type="email" name="email" style={{ width: '100%' }} />
               </div>
               <div>
                 <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Direct Line</label>
                 <input type="tel" name="phone" style={{ width: '100%' }} />
               </div>
               <div>
                 <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Account Classification</label>
                 <select name="companyId" style={{ width: '100%' }}>
                   <option value="">-- No Corporate Link --</option>
                   {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
               </div>
               <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Finalize Generation</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
