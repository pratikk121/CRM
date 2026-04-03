import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Log In</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>Welcome back! Sign in to access your CRM.</p>
        
        <form
          action={async (formData) => {
            "use server"
            await signIn("credentials", formData, { redirectTo: '/' })
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
            <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
            <input type="email" id="email" name="email" required style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
            <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
            <input type="password" id="password" name="password" required style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem' }}>Sign In</button>
        </form>
        

      </div>
    </div>
  )
}
