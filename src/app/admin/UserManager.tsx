"use client"

import { useState } from "react"
import { deleteUserAction, updateUserAction } from "./actions"

export default function UserManager({ users }: { users: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleDelete(id: string, email: string) {
    if (email === 'admin@crm.com') {
      alert("Cannot delete the master system administrator.");
      return;
    }
    if (confirm(`SECURITY ALERT: Are you absolutely sure you want to permanently revoke system access for ${email}?`)) {
      setLoading(true)
      try {
        await deleteUserAction(id)
      } catch (e: any) {
        alert(e.message)
      }
      setLoading(false)
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await updateUserAction(id, formData)
      setEditingId(null) // Successfully completely, close window
    } catch (err: any) {
      alert("Failed to update user: " + err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              {editingId === user.id ? (
                <td colSpan={4} style={{ padding: '0' }}>
                  <form onSubmit={(e) => handleUpdate(e, user.id)} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(150px, 1fr) minmax(100px, 1fr) minmax(150px, 1fr)', gap: '1rem', padding: '1rem', background: 'rgba(99,102,241,0.05)' }}>
                    <input type="text" name="name" defaultValue={user.name || ''} placeholder="Employee Name" required />
                    <input type="email" name="email" defaultValue={user.email} placeholder="Corporate Email" required />
                    <select name="role" defaultValue={user.role} required>
                      <option value="SALES">SALES</option>
                      <option value="SUPPORT">SUPPORT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input type="password" name="newPassword" placeholder="Override Password (optional)" style={{ fontSize: '0.8rem', padding: '0.5rem' }} />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}>Lock In</button>
                        <button type="button" onClick={() => setEditingId(null)} className="btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Abort</button>
                      </div>
                    </div>
                  </form>
                </td>
              ) : (
                <>
                  <td>{user.name || 'Unknown'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                  <td>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: user.role === 'ADMIN' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', color: user.role === 'ADMIN' ? 'var(--primary-color)' : 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setEditingId(user.id)} disabled={loading} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.4rem 0.8rem', borderRadius: '0.25rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                        Modify
                      </button>
                      {user.email !== 'admin@crm.com' && (
                        <button onClick={() => handleDelete(user.id, user.email)} disabled={loading} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)', padding: '0.4rem 0.8rem', borderRadius: '0.25rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
