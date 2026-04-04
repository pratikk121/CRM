import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import KanbanClient from './KanbanClient'
import CreateDealModal from './CreateDealModal'
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function PipelinePage() {
  const session = await auth();
  if ((session?.user as any)?.role === 'SUPPORT') {
    redirect('/unauthorized');
  }

  const [deals, contacts, companies] = await Promise.all([
    prisma.deal.findMany({ include: { company: true, contact: true }, orderBy: { createdAt: 'desc' } }),
    prisma.contact.findMany({ orderBy: { firstName: 'asc' } }),
    prisma.company.findMany({ orderBy: { name: 'asc' } })
  ])

  // Group by stage (PROSPECT, QUALIFIED, PROPOSAL, WON, LOST)
  const stages = ['PROSPECT', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST']
  const groupedDeals = stages.reduce((acc, stage) => {
    acc[stage] = deals.filter((deal: any) => deal.stage === stage)
    return acc
  }, {} as Record<string, typeof deals>)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Sales Pipeline</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Drag and drop deals across stages.</p>
        </div>
        <div>
          <CreateDealModal contacts={contacts} companies={companies} />
        </div>
      </div>

      <KanbanClient groupedDeals={groupedDeals} stages={stages} />
    </div>
  )
}
