"use client"

import { useState, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addTeamMember } from "@/app/actions/team"
import { Loader2 } from "lucide-react"

export function InviteMemberForm({ appId }: { appId: string }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    
    const result = await addTeamMember(appId, formData)

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Invitation Error",
        description: String(result.error || "An unknown error occurred"),
        className: "bg-red-600 text-white border-red-700",
      })
    } else if (result?.success) {
      toast({
        title: "Success",
        description: "Member added successfully.",
        className: "bg-emerald-500 text-white border-emerald-600",
      })
      formRef.current?.reset()
    }

    setLoading(false)
  }

  return (
    <form 
      ref={formRef} 
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(new FormData(e.currentTarget))
      }} 
      className="space-y-4"
    >
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