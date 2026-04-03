'use client'

import { updateDealStage } from './actions'
import { useTransition } from 'react'

export default function KanbanClient({ groupedDeals, stages }: { groupedDeals: Record<string, any[]>, stages: string[] }) {
  const [isPending, startTransition] = useTransition()
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStage: string) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = 'var(--bg-surface)'
    
    const dealId = e.dataTransfer.getData('dealId')
    if (dealId) {
      startTransition(() => {
        updateDealStage(dealId, newStage)
      })
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.05)'
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = 'var(--bg-surface)'
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', opacity: isPending ? 0.7 : 1, transition: 'opacity 0.2s' }}>
      {stages.map(stage => (
        <div 
          key={stage} 
          style={{ minWidth: '300px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}
          onDrop={(e) => handleDrop(e, stage)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            {stage} ({groupedDeals[stage].length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '50px' }}>
            {groupedDeals[stage].map((deal: any) => (
              <div 
                key={deal.id} 
                draggable 
                onDragStart={(e) => handleDragStart(e, deal.id)}
                style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)', cursor: 'grab' }}
              >
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{deal.title}</p>
                <p style={{ color: 'var(--success-color)', fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.5rem' }}>${deal.value?.toLocaleString() || '0'}</p>
                {deal.company && <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🏢 {deal.company.name}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
