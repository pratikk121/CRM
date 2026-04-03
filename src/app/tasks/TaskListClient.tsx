'use client'

import { toggleTaskCompletion } from './actions'
import { useTransition } from 'react'
import Link from 'next/link'

export default function TaskListClient({ tasks }: { tasks: any[] }) {
  const [isPending, startTransition] = useTransition()

  if (tasks.length === 0) {
    return <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No tasks assigned right now.</p>
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, opacity: isPending ? 0.7 : 1, transition: 'opacity 0.2s' }}>
      {tasks.map((task: any) => (
        <li key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
          <input 
            type="checkbox" 
            checked={task.completed} 
            onChange={(e) => {
              startTransition(() => {
                toggleTaskCompletion(task.id, e.target.checked)
              })
            }}
            style={{ marginTop: '0.25rem', cursor: 'pointer', width: '1.25rem', height: '1.25rem' }} 
          />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 500, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
              {task.title}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
              {task.dueDate && (
                <span style={{ fontSize: '0.75rem', color: new Date(task.dueDate) < new Date() && !task.completed ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                  📅 {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
              {task.contact && (
                <Link href={`/contacts/${task.contact.id}`} style={{ fontSize: '0.75rem', color: 'var(--primary-color)' }}>
                  👤 {task.contact.firstName} {task.contact.lastName}
                </Link>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
