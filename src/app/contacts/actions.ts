'use server'

import { createAuditLog } from '@/lib/audit'
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

export async function createContactAction(formData: FormData) {
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const email = formData.get('email') as string | null
  const phone = formData.get('phone') as string | null
  const companyId = (formData.get('companyId') as string) || null

  if (!firstName || !lastName) throw new Error("Names are strictly required.");

  const created = await prisma.contact.create({
    data: { firstName, lastName, email, phone, companyId }
  })
  
  await createAuditLog('CREATE', 'CONTACT', created.id, `Created contact ${firstName} ${lastName}`)
  
  revalidatePath('/contacts')
}

export async function bulkImportContactsAction(payload: any[]) {
  const validData = payload
    .filter((d: any) => d.firstName && d.email)
    .map((d: any) => ({
      firstName: d.firstName,
      lastName: d.lastName || '',
      email: d.email,
      phone: d.phone || ''
    }))

  if (validData.length === 0) throw new Error("No structurally valid rows identified in CSV stream.")

  await prisma.contact.createMany({
    data: validData
  })

  await createAuditLog('CREATE', 'CONTACT', 'BULK', `Imported ${validData.length} tabular records via CSV IO subsystem`)

  revalidatePath('/contacts')
  revalidatePath('/')
}
