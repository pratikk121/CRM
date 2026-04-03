import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default async function AuditLedgerPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') {
    redirect('/');
  }

  const logs = await prisma.auditLog.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 100 // Hard limit for high-performance tabular rendering 
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">SOC2 Audit Ledger</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>System-wide absolute tracking of all sensitive or destructive database actions.</p>
        </div>
        <Link href="/admin" className="btn" style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
          &larr; Back to Admin Hub
        </Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
             <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
               <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Timestamp</th>
               <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Operator</th>
               <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Command</th>
               <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Entity</th>
               <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Payload Details</th>
             </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No audit traces permanently registered yet.</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                   <td style={{ padding: '1rem', fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{log.createdAt.toLocaleString()}</td>
                   <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--primary-color)' }}>{log.user?.email || 'SYSTEM'}</td>
                   <td style={{ padding: '1rem' }}>
                     <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, 
                       backgroundColor: log.action === 'DELETE' ? 'rgba(239, 68, 68, 0.1)' : log.action === 'CREATE' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                       color: log.action === 'DELETE' ? 'var(--danger-color)' : log.action === 'CREATE' ? 'var(--success-color)' : 'var(--primary-color)'
                     }}>
                       {log.action}
                     </span>
                   </td>
                   <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>{log.entity} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>#{log.entityId.slice(0, 8)}</span></td>
                   <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{log.details || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
