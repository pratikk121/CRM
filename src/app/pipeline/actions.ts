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
