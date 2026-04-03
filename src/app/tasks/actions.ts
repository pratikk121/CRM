'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string
  const dueDateStr = formData.get('dueDate') as string
  const contactId = formData.get('contactId') as string
  
  if (!title) return;

  await prisma.taskItem.create({
    data: {
      title,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      contactId: contactId || null,
      userId: '1' // Mocking Admin user id
    }
  })

  revalidatePath('/tasks')
}

export async function toggleTaskCompletion(taskId: string, completed: boolean) {
  await prisma.taskItem.update({
    where: { id: taskId },
    data: { completed }
  })
  revalidatePath('/tasks')
}
