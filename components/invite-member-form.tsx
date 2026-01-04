"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addTeamMember } from "@/app/actions/team"
import { Loader2 } from "lucide-react"

export function InviteMemberForm({ appId }: { appId: string }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const result = await addTeamMember(appId, formData)

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
      } else {
        
        toast({
          title: "Invitation Sent",
          description: "User has been added to the team.",
          className: "bg-emerald-500 text-white border-emerald-600",
        })
        
        const form = document.getElementById("invite-form") as HTMLFormElement
        if (form) form.reset()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form id="invite-form" action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" placeholder="colleague@example.com" required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          "Invite to Team"
        )}
      </Button>
    </form>
  )
}