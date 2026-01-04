import { requireAuth } from "@/lib/auth"
import { queryOne, query } from "@/lib/db"
import { removeTeamMember } from "@/app/actions/team"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Trash2, ArrowLeft, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { ConfirmDelete } from "@/components/confirm-delete"
import { InviteMemberForm } from "@/components/invite-member-form"

export default async function TeamPage({ params }: { params: { id: string } }) {
  const user = await requireAuth()
  const { id } = await params

  
  const app = await queryOne<any>("SELECT id, name, owner_id FROM applications WHERE id = ?", [id])

  if (!app || app.owner_id !== user.id) {
    redirect("/dashboard/apps")
  }

  const members = await query(
    `SELECT u.name, u.email, 
      CASE WHEN a.owner_id = u.id THEN 'owner' ELSE 'member' END as role,
      au.id as member_id, 
      au.user_id 
     FROM users u 
     JOIN application_members au ON u.id = au.user_id 
     JOIN applications a ON au.application_id = a.id
     WHERE au.application_id = ?
     ORDER BY role DESC`,
    [id],
  )

  const memberLimit = 5
  const currentMembersCount = members.filter((m: any) => m.role === "member").length

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/apps/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">{app.name}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members ({currentMembersCount}/{memberLimit})
            </CardTitle>
            <CardDescription>Collaborators can manage license keys for this application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member: any) => (
                <div
                  key={member.member_id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {member.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {member.name}
                        {member.role === "owner" && (
                          <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </div>
                  </div>

                  {member.role === "member" && (
                    
                    <ConfirmDelete
                      title="Remove Team Member?"
                      description={`Are you sure you want to remove ${member.name} from the team?`}
                      successMessage="Team member removed successfully."
                      action={async () => {
                        "use server"
                        await removeTeamMember(id, member.member_id)
                      }}
                      trigger={
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite Member
            </CardTitle>
            <CardDescription>Add a collaborator by their email.</CardDescription>
          </CardHeader>
          <CardContent>
            {currentMembersCount >= memberLimit ? (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex gap-3">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <p>You have reached the limit of 5 team members for this application.</p>
              </div>
            ) : (
              
              <InviteMemberForm appId={id} />
            )}
            <p className="text-[10px] text-muted-foreground mt-4 text-center leading-relaxed">
              Team members must have an existing Lycen account to be added.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}