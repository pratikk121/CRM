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
