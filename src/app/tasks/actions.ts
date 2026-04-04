'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { createAuditLog } from '@/lib/audit'

export async function createTask(formData: FormData) {
  const session = await auth()
  const title = formData.get('title') as string
  const dueDateStr = formData.get('dueDate') as string
  const contactId = formData.get('contactId') as string
  
  if (!title) return;

  const created = await prisma.taskItem.create({
    data: {
      title,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      contactId: contactId || null,
      userId: session?.user?.id || null // Dynamically extract real Postgres runtime session structural UUID instead of the mock ID
    }
  })

  await createAuditLog('CREATE', 'TASK', created.id, `Created task: ${title}`)
  revalidatePath('/tasks')
}

export async function toggleTaskCompletion(taskId: string, completed: boolean) {
  await prisma.taskItem.update({
    where: { id: taskId },
    data: { completed }
  })
  revalidatePath('/tasks')
}
