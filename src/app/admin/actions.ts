"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { createAuditLog } from "@/lib/audit"

async function requireAdmin() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    throw new Error("Unauthorized access. Admin privileges required.")
  }
}

export async function deleteUserAction(id: string) {
  await requireAdmin()
  
  // Prevent deleting the very first admin to strictly avoid lockouts
  const user = await prisma.user.findUnique({ where: { id } })
  if (user?.email === 'admin@crm.com') {
    throw new Error("Cannot completely delete the master administrator core account.")
  }

  const deleted = await prisma.user.delete({ where: { id } })
  await createAuditLog('DELETE', 'USER', id, `Permanently revoked structural access for ${deleted.email}`)
  revalidatePath('/admin')
}

export async function updateUserAction(id: string, formData: FormData) {
  await requireAdmin()
  
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as any
  const newPassword = formData.get("newPassword") as string

  const updateData: any = { name, email, role }
  
  // If they provided a new password, encrypt and overwrite it instantly!
  if (newPassword && newPassword.trim() !== '') {
    updateData.password = await bcrypt.hash(newPassword, 10)
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData
  })
  
  await createAuditLog('UPDATE', 'USER', id, `Modified security or role configurations for ${updated.email}`)
  
  revalidatePath('/admin')
}
