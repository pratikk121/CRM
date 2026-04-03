import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function createAuditLog(action: string, entity: string, entityId: string, details?: string) {
  try {
    const session = await auth()
    
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        details,
        userId: session?.user?.id || null
      }
    })
  } catch (error) {
    console.error("Critical: Audit Log Insertion Failed", error)
    // Fail silently in production so we don't break the app if logging fails, but log it entirely.
  }
}
