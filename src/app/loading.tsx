export default function GlobalLoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', padding: '1rem 0' }}>
      {/* Skeleton Top Header Titles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ height: '3.5rem', width: '35%', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} className="animate-pulse"></div>
        <div style={{ height: '1.5rem', width: '25%', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }} className="animate-pulse"></div>
      </div>
      
      {/* Skeleton Reporting Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="card animate-pulse" style={{ height: '160px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.02)' }}></div>
        ))}
      </div>
      
      {/* Skeleton Core Table Body */}
      <div className="card animate-pulse" style={{ height: '400px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
         <div style={{ width: '200px', height: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
         <div style={{ flex: 1, borderTop: '1px solid rgba(255,255,255,0.02)', marginTop: '1rem' }}></div>
      </div>
    </div>
  )
}
