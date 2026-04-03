"use client"
import { useState, useRef } from "react"
import { toast } from "sonner"
import { bulkImportContactsAction } from "./actions"
import { useRouter } from "next/navigation"

export default function CSVManager({ contacts }: { contacts: any[] }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const exportCSV = () => {
    if (contacts.length === 0) return toast.error("No valid contacts available to export.")
    
    // Build CSV standard format
    const headers = ["First Name", "Last Name", "Email", "Phone", "Company ID"]
    const rows = contacts.map(c => [
      `"${c.firstName || ''}"`, 
      `"${c.lastName || ''}"`, 
      `"${c.email || ''}"`, 
      `"${c.phone || ''}"`,
      `"${c.companyId || ''}"`
    ])
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `crm_contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("System Data Exported Successfully to CSV.");
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;

    setLoading(true)
    toast.loading("Parsing CSV Data stream...", { id: 'csv' })
    const reader = new FileReader()
    
    reader.onload = async (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter(l => l.trim().length > 0)
      
      if (lines.length < 2) {
        setLoading(false)
        return toast.error("Invalid or empty CSV format.", { id: 'csv' })
      }
      
      // Assume standard format: First Name, Last Name, Email, Phone
      const payload = lines.slice(1).map(line => {
        // Simple fast CSV split that handles basic quotes
        const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim())
        return {
          firstName: cols[0] || 'Unknown',
          lastName: cols[1] || '',
          email: cols[2] || `temp-${Math.random()}@unknown.com`,
          phone: cols[3] || ''
        }
      })

      try {
        await bulkImportContactsAction(payload)
        toast.success(`Successfully imported ${payload.length} records into Database!`, { id: 'csv' })
        router.refresh()
      } catch(err: any) {
        toast.error("Import processing failed: " + err.message, { id: 'csv' })
      }
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <button onClick={exportCSV} className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
        ⤓ Export CSV
      </button>
      
      <button onClick={() => fileInputRef.current?.click()} disabled={loading} className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
        ⤒ Import CSV
      </button>
      
      <input 
        type="file" 
        accept=".csv" 
        ref={fileInputRef} 
        onChange={handleImport} 
        style={{ display: 'none' }} 
      />
    </div>
  )
}
