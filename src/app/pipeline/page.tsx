import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import KanbanClient from './KanbanClient'

export default async function PipelinePage() {
  const deals = await prisma.deal.findMany({
    include: { company: true, contact: true },
    orderBy: { createdAt: 'desc' }
  })

  // Group by stage (PROSPECT, QUALIFIED, PROPOSAL, WON, LOST)
  const stages = ['PROSPECT', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST']
  const groupedDeals = stages.reduce((acc, stage) => {
    acc[stage] = deals.filter((deal: any) => deal.stage === stage)
    return acc
  }, {} as Record<string, typeof deals>)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Sales Pipeline</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Drag and drop deals across stages.</p>
        </div>
        <Link href="/pipeline/new" className="btn btn-primary">+ Add Deal</Link>
      </div>

      <KanbanClient groupedDeals={groupedDeals} stages={stages} />
    </div>
  )
}
