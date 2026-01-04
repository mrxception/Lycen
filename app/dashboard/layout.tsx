import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { requireAuth } from "@/lib/auth"
import { queryOne } from "@/lib/db"
// ✅ IMPORT MOBILE NAV
import { MobileNav } from "@/components/mobile-nav"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth()

  const user = await queryOne<{ role: string }>(
    "SELECT role FROM users WHERE id = ?", 
    [session.id]
  )
  const isAdmin = user?.role === "admin"

  return (
    <div className="flex min-h-screen bg-background flex-col md:flex-row">
      <DashboardNav isAdmin={isAdmin} />
      <MobileNav isAdmin={isAdmin} />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
      
    </div>
  )
}