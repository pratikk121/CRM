'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateDealStage(dealId: string, newStage: string) {
  await prisma.deal.update({
    where: { id: dealId },
    data: { stage: newStage }
  })
  // Revalidate the pipeline page to show the new data immediately
  revalidatePath('/pipeline')
}

export async function createDealAction(formData: FormData) {
  const title = formData.get('title') as string
  const value = parseFloat(formData.get('value') as string) || 0
  const companyId = (formData.get('companyId') as string) || null
  const contactId = (formData.get('contactId') as string) || null

  if (!title) throw new Error("Title is strictly required.");

  await prisma.deal.create({
    data: { title, value, companyId, contactId, stage: 'PROSPECT' }
  })
  
  revalidatePath('/pipeline')
  revalidatePath('/') // Force dashboard analytics aggregator to recalculate active value instantly
}
