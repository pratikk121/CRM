export default async function DashboardHome() {
  return (
    <div>
      <h1 className="page-title">Dashboard Overview</h1>
      <p className="page-subtitle">Welcome back, Admin. Here is what is happening today.</p>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Revenue (Q1)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)', marginTop: '0.5rem' }}>$84,300</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--success-color)', marginTop: '0.5rem' }}>↑ 12% vs last quarter</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Deals</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>24</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>4 in final stages</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Open Tickets</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>9</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--warning-color)', marginTop: '0.5rem' }}>2 requires immediate attention</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Activity</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Recent Interactions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✓
            </div>
            <div>
              <p style={{ fontWeight: 500 }}>Deal Won: TechCorp Enterprise License</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sarah signed the contract just now.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✉
            </div>
            <div>
              <p style={{ fontWeight: 500 }}>Email sent to John Doe</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Follow up on the Q3 proposal.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              !
            </div>
            <div>
              <p style={{ fontWeight: 500 }}>New Support Ticket: Server Outage</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Assigned to Michael. High priority.</p>
            </div>
          </div>
        </div>
        
        <button className="btn" style={{ width: '100%', marginTop: '1rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>View All Activity</button>
      </div>
    </div>
  );
}
