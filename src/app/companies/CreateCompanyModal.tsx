"use client"
import { useState } from "react"
import { createCompanyAction } from "./actions"
import { toast } from "sonner"

export default function CreateCompanyModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    toast.loading("Registering new corporate account...", { id: "company" })
    const formData = new FormData(e.currentTarget)
    try {
      await createCompanyAction(formData)
      toast.success("Company successfully natively onboarded.", { id: "company" })
      setOpen(false)
    } catch (err: any) {
      toast.error(err.message, { id: "company" })
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-primary" style={{ fontWeight: 600 }}>
        + Add Company
      </button>
      
      {open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', zIndex: 101, padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>New Corporate Account</h2>
               <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div>
                 <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Company Name</label>
                 <input name="name" required style={{ width: '100%' }} />
               </div>
               <div>
                 <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Industry</label>
                 <input name="industry" style={{ width: '100%' }} />
               </div>
               <div>
                 <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>Website URL</label>
                 <input type="url" name="website" style={{ width: '100%' }} />
               </div>
               <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Register Account</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
