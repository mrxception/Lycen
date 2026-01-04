"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/app/actions/settings"
import { Loader2 } from "lucide-react"

export function SettingsForm({ user }: { user: any }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    
    try {
      
      await updateProfile(formData)

      
      toast({
        title: "Success",
        description: "Profile updated successfully.",
        className: "bg-emerald-500 text-white border-emerald-600",
      })
    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" value={user.email} disabled className="bg-muted" />
        <p className="text-[10px] text-muted-foreground">Email address cannot be changed.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input id="name" name="name" defaultValue={user.name} required />
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  )
}