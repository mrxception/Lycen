import { requireAuth } from "@/lib/auth"
import { query } from "@/lib/db"
import { createApplication } from "@/app/actions/apps"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, ChevronRight, Box } from "lucide-react"
import Link from "next/link"

export default async function AppsPage() {
  const user = await requireAuth()

  const apps = await query(
    `SELECT a.*, 
      CASE WHEN a.owner_id = au.user_id THEN 'Owner' ELSE 'Member' END as role 
     FROM applications a 
     JOIN application_members au ON a.id = au.application_id 
     WHERE au.user_id = ?
     ORDER BY a.created_at DESC`,
    [user.id],
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-1">Manage your software projects and issuance.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {/* Create App Card */}
        <Card className="flex flex-col h-full border-dashed border-2 shadow-none bg-muted/30 hover:bg-muted/50 transition-colors">
          <CardHeader>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Create New App</CardTitle>
            <CardDescription>Launch a new software project.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            
            {/* ✅ FIXED: Wrapped action to satisfy TypeScript */}
            <form 
              action={async (formData) => {
                "use server"
                await createApplication(formData)
              }} 
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="sr-only">App Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Ex: My Cheat Tool v2" 
                  required 
                  className="bg-background"
                />
              </div>
              <Button type="submit" className="w-full">
                Create Application
              </Button>
            </form>

          </CardContent>
        </Card>

        {/* Existing Apps */}
        {apps.map((app: any) => (
          <Card key={app.id} className="flex flex-col h-full group hover:border-primary/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="bg-blue-500/10 p-2.5 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <Box className="h-6 w-6 text-blue-600" />
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                app.role === 'Owner' ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-600'
              }`}>
                {app.role}
              </span>
            </CardHeader>
            
            <CardContent className="mt-4">
              <CardTitle className="text-xl mb-1 truncate">{app.name}</CardTitle>
              <CardDescription>
                ID: <span className="font-mono text-xs text-foreground/70">{app.id}</span>
              </CardDescription>
            </CardContent>

            <CardFooter className="mt-auto pt-0">
              <Button 
                variant="secondary" 
                className="w-full justify-between hover:bg-primary hover:text-primary-foreground transition-all duration-300" 
                asChild
              >
                <Link href={`/dashboard/apps/${app.id}`}>
                  Manage App
                  <ChevronRight className="h-4 w-4 ml-2 opacity-50 transition-all" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}