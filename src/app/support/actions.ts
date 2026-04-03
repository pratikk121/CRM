'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateTicketStatus(ticketId: string, newStatus: string) {
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: newStatus }
  })
  
  // Revalidate both the specific ticket page and the main queue to show changes instantly
  revalidatePath(`/support/${ticketId}`)
  revalidatePath('/support')
}

export async function createTicketAction(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const contactId = (formData.get('contactId') as string) || null

  if (!title) throw new Error("Title is strictly required.");

  await prisma.ticket.create({
    data: { title, description, priority, contactId, status: 'OPEN' }
  })
  
  revalidatePath('/support')
  revalidatePath('/') // Instantly update active dashboard ticket counters
}
