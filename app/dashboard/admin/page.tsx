import { requireAuth } from "@/lib/auth" 
import { query, queryOne } from "@/lib/db"
import { deleteUser } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Box, Key, Shield, Trash2 } from "lucide-react"
import { redirect } from "next/navigation" 
import { ConfirmDelete } from "@/components/confirm-delete" 

export default async function AdminDashboardPage() {
  
  const session = await requireAuth()

  
  const adminCheck = await queryOne<{ role: string }>(
    "SELECT role FROM users WHERE id = ?", 
    [session.id]
  )

  
  if (adminCheck?.role !== "admin") {
    redirect("/dashboard")
  }

  
  const userCount = await queryOne<{ count: number }>("SELECT COUNT(*) as count FROM users")
  const appCount = await queryOne<{ count: number }>("SELECT COUNT(*) as count FROM applications")
  const licenseCount = await queryOne<{ count: number }>("SELECT COUNT(*) as count FROM licenses")

  const allUsers = await query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 50",
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="bg-destructive/10 p-2 rounded-lg">
          <Shield className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Control Panel</h1>
          <p className="text-muted-foreground">Platform-wide overview and management.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount?.count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Total Apps
            </CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appCount?.count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Total Licenses
            </CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licenseCount?.count || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto border rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium text-right">Joined</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allUsers.map((user: any) => (
                  <tr key={user.id} className="bg-card hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          Admin
                        </span>
                      ) : (
                        <span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase text-center">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* ✅ UPGRADED TO CONFIRM DELETE COMPONENT */}
                      <ConfirmDelete
                        title="Delete User?"
                        description={`Are you sure you want to delete ${user.name}? This will remove all their apps and licenses.`}
                        successMessage="User deleted successfully."
                        action={async () => {
                          "use server"
                          await deleteUser(user.id)
                        }}
                        trigger={
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}