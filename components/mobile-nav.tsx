"use client"


import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, ShieldCheck, LayoutDashboard, Box, Settings, Code, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { logout } from "@/app/actions/auth"

const items = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Applications", href: "/dashboard/apps", icon: Box },
  { name: "API Guide", href: "/dashboard/guide", icon: Code },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function MobileNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden border-b bg-background p-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-lg">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold tracking-tight">Lycen</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          {/* ✅ 2. Add this hidden Title to fix the Console Error */}
          <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>

          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight">Lycen</span>
              </div>
            </div>

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
                    onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
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

            <div className="p-4 border-t bg-muted/20">
              <form action={logout}>
                <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}