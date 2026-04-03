import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  async function changePassword(formData: FormData) {
    "use server"
    const newPassword = formData.get("newPassword") as string;
    if (!newPassword || newPassword.length < 5) return;
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: session!.user!.email as string },
      data: { password: hashedPassword }
    });
    revalidatePath('/settings');
  }

  return (
    <div>
      <h1 className="page-title">Personal Settings</h1>
      <p className="page-subtitle">Manage your account security and preferences.</p>
      
      <div className="card" style={{ maxWidth: '500px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Update Password</h2>
        <form action={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>New Password</label>
            <input type="password" name="newPassword" required minLength={5} style={{ width: '100%' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: 'max-content' }}>Save Security Settings</button>
        </form>
      </div>
    </div>
  )
}
