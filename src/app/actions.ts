'use server'

import { prisma } from '@/lib/prisma'
import { auth } from "@/auth"

export async function globalSearchAction(query: string) {
  const session = await auth()
  if (!session) return { contacts: [], companies: [], deals: [], tickets: [] }

  if (!query || query.trim().length === 0) {
    return { contacts: [], companies: [], deals: [], tickets: [] }
  }

  const term = { contains: query, mode: 'insensitive' as const }

  const [contacts, companies, deals, tickets] = await Promise.all([
    prisma.contact.findMany({ 
      where: { OR: [{ firstName: term }, { lastName: term }, { email: term }] }, 
      take: 5 
    }),
    prisma.company.findMany({ 
      where: { OR: [{ name: term }, { industry: term }] }, 
      take: 5 
    }),
    prisma.deal.findMany({ 
      where: { title: term }, 
      take: 5 
    }),
    prisma.ticket.findMany({ 
      where: { title: term }, 
      take: 5 
    })
  ])
  
  return { contacts, companies, deals, tickets }
}
