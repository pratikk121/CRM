import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '2.5rem' }}>⛔</span>
      </div>
      <h1 className="page-title" style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>403: Security Clearance Rejected</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '2.5rem', lineHeight: 1.6 }}>
        Your underlying PostgreSQL identity profile does not possess the structural authorization matrix required to view or manipulate this sector.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
          Return to Headquarters
        </Link>
      </div>
    </div>
  )
}
