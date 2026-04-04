"use client"
import { useState } from "react"
import { createDealAction } from "./actions"
import { toast } from "sonner"

export default function CreateDealModal({ contacts, companies }: { contacts: any[], companies: any[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    toast.loading("Deploying opportunity record...", { id: "deal" })
    const formData = new FormData(e.currentTarget)
    try {
      await createDealAction(formData)
      toast.success("Deal successfully injected into Pipeline.", { id: "deal" })
      setOpen(false)
    } catch (err: any) {
      toast.error(err.message, { id: "deal" })
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-primary" style={{ fontWeight: 600 }}>+ Add Deal</button>
      {open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', zIndex: 101, padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>New Pipeline Opportunity</h2>
               <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div><label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Opportunity Title</label><input name="title" required style={{ width: '100%' }} /></div>
               <div><label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Projected Value ($)</label><input type="number" step="0.01" name="value" style={{ width: '100%' }} /></div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div><label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Account</label>
                   <select name="companyId" style={{ width: '100%' }}>
                     <option value="">-- No Account --</option>
                     {(companies || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select></div>
                 <div><label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Contact</label>
                   <select name="contactId" style={{ width: '100%' }}>
                     <option value="">-- No Contact --</option>
                     {(contacts || []).map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                   </select></div>
               </div>
               <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Inject Deal</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
