import Link from "next/link"
import { cn } from "@/lib/utils"
import { requireAuth } from "@/lib/auth"
import { queryOne, query } from "@/lib/db"
import { deleteLicense, deleteApplication } from "@/app/actions/apps"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Key, Trash2, Shield, Users, Clock, ArrowLeft } from "lucide-react"
import { redirect } from "next/navigation"
import { CreateLicenseDialog } from "@/components/CreateLicenseDialog"
import { ConfirmDelete } from "@/components/confirm-delete"
import { CopyButton } from "@/components/copy-button"

export default async function AppDetailPage({ params }: { params: { id: string } }) {
  const user = await requireAuth()
  const { id } = await params

  const app = await queryOne<any>(
    `SELECT a.*, 
      CASE WHEN a.owner_id = au.user_id THEN 'owner' ELSE 'member' END as role 
     FROM applications a 
     JOIN application_members au ON a.id = au.application_id 
     WHERE a.id = ? AND au.user_id = ?`,
    [id, user.id],
  )

  if (!app) redirect("/dashboard/apps")

  const licenses = await query("SELECT * FROM licenses WHERE application_id = ? ORDER BY created_at DESC", [id])
  
  const members = await query(
    `SELECT u.name, u.email, 
      CASE WHEN a.owner_id = u.id THEN 'owner' ELSE 'member' END as role,
      au.id as member_id 
     FROM users u 
     JOIN application_members au ON u.id = au.user_id 
     JOIN applications a ON au.application_id = a.id
     WHERE au.application_id = ?`,
    [id],
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1 shrink-0">
            <Link href="/dashboard/apps">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold break-words">{app.name}</h1>
            <p className="text-muted-foreground truncate w-32 sm:w-auto">ID: {app.id}</p>
          </div>
        </div>

        {app.role === "owner" && (
          <div className="flex sm:block justify-end">
            <ConfirmDelete
              title="Delete Application?"
              description="This will permanently delete the application and all its licenses. This action cannot be undone."
              successMessage="Application deleted successfully."
              action={async () => {
                "use server"
                await deleteApplication(id)
                redirect("/dashboard/apps")
              }}
              trigger={
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete App
                </Button>
              }
            />
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle>Application Secret Key</CardTitle>
              <CardDescription>Use this key in your application to verify licenses.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-muted rounded-md flex justify-between items-center border gap-2">
                <code className="font-mono text-sm break-all">{app.secret_key}</code>
                <CopyButton value={app.secret_key} />
              </div>
              <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Keep this key secret! Never share it or expose it in client-side code.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Licenses</CardTitle>
                <CardDescription>Manage keys generated for your users.</CardDescription>
              </div>
              <CreateLicenseDialog appId={id} />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {licenses.map((license: any) => {
                  const isExpired = license.expires_at && new Date(license.expires_at) < new Date()
                  const isUnused = !license.activated_at
                  
                  let statusText = "Active"
                  let statusColor = "bg-emerald-500/10 text-emerald-500"

                  if (!license.is_active) {
                    statusText = "Revoked"
                    statusColor = "bg-destructive/10 text-destructive"
                  } else if (isExpired) {
                    statusText = "Expired"
                    statusColor = "bg-orange-500/10 text-orange-500"
                  } else if (isUnused) {
                    statusText = "Unused"
                    statusColor = "bg-blue-500/10 text-blue-500"
                  }

                  return (
                    <div
                      key={license.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="bg-primary/5 p-2 rounded shrink-0">
                          <Key className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono font-bold truncate">{license.license_key}</div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {license.expires_at ? (
                                <span>Expires: {new Date(license.expires_at).toLocaleDateString()}</span>
                                ) : (
                                <span>Expires: {license.duration_days} days after use</span>
                                )}
                            </div>
                            
                            <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-medium uppercase", statusColor)}>
                              {statusText}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* ✅ BUTTONS GROUP (Copy + Delete) */}
                      <div className="self-end sm:self-center flex items-center gap-1">
                        
                        {/* Copy Button Moved Here */}
                        <CopyButton value={license.license_key} className="h-9 w-9" />

                        <ConfirmDelete
                            title="Revoke License?"
                            description="Are you sure you want to delete this license key? The user will no longer be able to use it."
                            successMessage="License revoked successfully."
                            action={async () => {
                            "use server"
                            await deleteLicense(id, license.id)
                            }}
                            trigger={
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            }
                        />
                      </div>
                    </div>
                  )
                })}
                {licenses.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    No license keys generated yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Collaborate with up to 5 members.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member: any) => (
                  <div key={member.member_id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs shrink-0">
                        {member.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{member.name}</div>
                        <div className="text-xs text-muted-foreground capitalize truncate">{member.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {app.role === "owner" && members.length < 6 && (
                  <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent" asChild>
                    <Link href={`/dashboard/apps/${id}/team`}>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Team
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}