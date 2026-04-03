'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addActivity(formData: FormData) {
  const contactId = formData.get('contactId') as string
  const type = formData.get('type') as string
  const description = formData.get('description') as string

  if (!contactId || !type || !description) return;

  await prisma.activity.create({
    data: {
      type,
      description,
      contactId,
    }
  })

  revalidatePath(`/contacts/${contactId}`)
}
