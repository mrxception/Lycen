"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Box, Settings, ShieldCheck, LogOut, Code } from "lucide-react"
import { logout } from "@/app/actions/auth"

const items = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Applications", href: "/dashboard/apps", icon: Box },
  { name: "API Guide", href: "/dashboard/guide", icon: Code },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()

  return (
    
    <nav className="hidden md:flex flex-col h-screen sticky top-0 bg-card border-r w-64">
      
      {/* Header Section */}
      <div className="p-4 pb-2 border-b border-transparent">
        <div className="flex items-center gap-2 px-2 mb-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">Lycen</span>
        </div>
      </div>

      {/* Links Section */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        {items.map((item) => {
          const isActive = 
            item.href === "/dashboard" 
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              {item.name}
            </Link>
          )
        })}

        {isAdmin && (
          <>
            <div className="my-4 border-t border-border/50 mx-1" />
            <Link
              href="/dashboard/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith("/dashboard/admin")
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : "text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Panel
            </Link>
          </>
        )}
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-border/50 bg-card">
        <form action={logout}>
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group">
            <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </form>
      </div>
    </nav>
  )
}