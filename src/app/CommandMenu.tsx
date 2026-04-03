"use client"

import { useEffect, useState, useTransition } from "react"
import { globalSearchAction } from "./actions"
import { useRouter } from "next/navigation"

export default function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  
  const [results, setResults] = useState<{ contacts: any[], companies: any[], deals: any[], tickets: any[] }>({
    contacts: [], companies: [], deals: [], tickets: []
  })
  
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (open && query) {
      startTransition(() => {
        globalSearchAction(query).then(res => setResults(res))
      })
    } else {
      setResults({ contacts: [], companies: [], deals: [], tickets: [] })
    }
  }, [query, open])

  const navigate = (path: string) => {
    setOpen(false)
    setQuery("")
    router.push(path)
  }

  if (!open) return null;

  const totalResults = results.contacts.length + results.companies.length + results.deals.length + results.tickets.length

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh' }} onClick={() => setOpen(false)}>
      <div className="card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px', padding: 0, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', background: 'var(--bg-color)', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: 'var(--text-secondary)', marginRight: '0.75rem', fontSize: '1.25rem' }}>🔍</span>
          <input 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Global Search... (Contacts, Companies, Deals, Tickets)"
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.1rem', outline: 'none' }}
          />
          <button onClick={() => setOpen(false)} style={{ border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', cursor: 'pointer' }}>ESC</button>
        </div>

        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          {query.length > 0 && isPending && <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Scanning global databases...</div>}
          
          {query.length > 0 && !isPending && totalResults === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No results found across any schema for "{query}"</div>
          )}

          {!isPending && totalResults > 0 && (
            <div style={{ padding: '0.5rem' }}>
              {/* Contacts */}
              {results.contacts.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Contacts</div>
                  {results.contacts.map(c => (
                    <div key={c.id} onClick={() => navigate(`/contacts/${c.id}`)} style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '6px', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }} className="search-result">
                      <span>{c.firstName} {c.lastName}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{c.email}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Companies */}
              {results.companies.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Companies</div>
                  {results.companies.map(c => (
                    <div key={c.id} onClick={() => navigate(`/companies/${c.id}`)} style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '6px', color: 'var(--text-primary)' }} className="search-result">
                      {c.name}
                    </div>
                  ))}
                </div>
              )}

              {/* Deals */}
              {results.deals.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Pipeline Deals</div>
                  {results.deals.map(c => (
                    <div key={c.id} onClick={() => navigate(`/pipeline`)} style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '6px', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }} className="search-result">
                      <span>{c.title}</span><span style={{ color: 'var(--text-secondary)' }}>${c.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tickets */}
              {results.tickets.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Support Tickets</div>
                  {results.tickets.map(c => (
                    <div key={c.id} onClick={() => navigate(`/support/${c.id}`)} style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '6px', color: 'var(--text-primary)' }} className="search-result">
                      {c.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
