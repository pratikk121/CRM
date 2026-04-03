import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import UserManager from "./UserManager";

export default async function AdminPage() {
  const session = await auth();
  
  if ((session?.user as any)?.role !== 'ADMIN') {
    redirect('/');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  async function createUser(formData: FormData) {
    "use server"
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as any;
    
    if (!email || !password) return;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hashedPassword, name, role }
    });
    revalidatePath('/admin');
  }

  return (
    <div>
      <h1 className="page-title">Admin Configuration</h1>
      <p className="page-subtitle">Provision secure CRM access for your employees.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Create Employee</h2>
          <form action={createUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" name="name" required style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Company Email</label>
              <input type="email" name="email" required style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Temporary Setup Password</label>
              <input type="password" name="password" required style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>System Role</label>
              <select name="role" required style={{ width: '100%' }}>
                <option value="SALES">Sales Representative</option>
                <option value="SUPPORT">Support Agent</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Provision Account</button>
          </form>
        </div>

        <div className="card" style={{ alignSelf: 'start' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Active Personnel Database</h2>
          <UserManager users={users} />
        </div>
      </div>
    </div>
  )
}
