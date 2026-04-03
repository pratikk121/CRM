"use client"
import { useState } from "react"
import { createTicketAction } from "./actions"
import { toast } from "sonner"

export default function CreateTicketModal({ contacts }: { contacts: any[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    toast.loading("Dispatching support ticket...", { id: "ticket" })
    const formData = new FormData(e.currentTarget)
    try {
      await createTicketAction(formData)
      toast.success("Support ticket successfully natively dispatched.", { id: "ticket" })
      setOpen(false)
    } catch (err: any) {
      toast.error(err.message, { id: "ticket" })
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-primary" style={{ fontWeight: 600 }}>+ New Ticket</button>
      {open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', zIndex: 101, padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Dispatch Support Ticket</h2>
               <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div><label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Issue Title</label><input name="title" required style={{ width: '100%' }} /></div>
               <div><label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Problem Description</label>
                 <textarea name="description" rows={3} style={{ width: '100%', resize: 'vertical' }}></textarea></div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div><label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Priority Level</label>
                   <select name="priority" style={{ width: '100%' }}>
                     <option value="LOW">LOW</option>
                     <option value="MEDIUM">MEDIUM</option>
                     <option value="HIGH">HIGH</option>
                     <option value="URGENT">URGENT</option>
                   </select></div>
                 <div><label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Reporting Contact</label>
                   <select name="contactId" style={{ width: '100%' }}>
                     <option value="">-- Internal System --</option>
                     {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                   </select></div>
               </div>
               <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Dispatch Ticket</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
