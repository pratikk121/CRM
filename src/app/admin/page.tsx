import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth()
  
  if ((session?.user as any)?.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div>
      <h1 className="page-title">Admin Configuration</h1>
      <p className="page-subtitle">Access strictly limited to Administrative accounts.</p>
      
      <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
         <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>System Authorization Confirmed</h2>
         <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
           Your Server-Side Role-Based Access Control (RBAC) token has been successfully verified globally as <strong>'ADMIN'</strong>!
           <br/><br/>
           If you logged in as a Sales Rep (`sales@crm.com`), this exact URL `/admin` would force a hard server redirect instantly preventing rendering, and the button in the Sidebar wouldn't even physically exist in the Client's DOM.
         </p>
      </div>
    </div>
  )
}
