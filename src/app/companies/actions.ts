'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCompanyAction(formData: FormData) {
  const name = formData.get('name') as string
  const industry = formData.get('industry') as string
  const website = formData.get('website') as string

  if (!name) throw new Error("Company name is deeply required by the database schema.");

  await prisma.company.create({
    data: { name, industry, website }
  })
  
  revalidatePath('/companies')
}
