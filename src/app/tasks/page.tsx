import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import TaskListClient from './TaskListClient'

export default async function TasksPage() {
  const tasks = await prisma.taskItem.findMany({
    include: { contact: true },
    orderBy: [
      { completed: 'asc' },
      { dueDate: 'asc' }
    ]
  })

  const contacts = await prisma.contact.findMany()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage your daily to-dos and assignments.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '2rem' }}>
        
        {/* Create Task Form */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add New Task</h3>
          <form action={async (formData) => {
            'use server'
            const { createTask } = await import('./actions')
            await createTask(formData)
          }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="title" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Task Description *</label>
              <input type="text" id="title" name="title" required placeholder="Follow up with..." style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="dueDate" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Due Date</label>
              <input type="date" id="dueDate" name="dueDate" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="contactId" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Related Contact</label>
              <select id="contactId" name="contactId" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }}>
                <option value="">-- None --</option>
                {contacts.map((c: any) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Add Task</button>
          </form>
        </div>
        
        {/* Task List */}
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Active Tasks</h3>
          <TaskListClient tasks={tasks} />
        </div>
      </div>
    </div>
  )
}
