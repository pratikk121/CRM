import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ContactsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if ((session?.user as any)?.role === 'SUPPORT') {
    redirect('/unauthorized')
  }
  return <>{children}</>
}
