"use server"

import { query, queryOne } from "@/lib/db"
import { requireAuth, generateId } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function addTeamMember(appId: string, formData: FormData) {
  const user = await requireAuth()
  const email = formData.get("email") as string

  if (!email) return { error: "Email is required" }

  
  const app = await queryOne<{ owner_id: string }>("SELECT owner_id FROM applications WHERE id = ?", [appId])
  if (!app || app.owner_id !== user.id) {
    return { error: "Only the owner can add team members" }
  }

  
  
  const memberCount = await queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM application_members WHERE application_id = ?",
    [appId],
  )

  
  if (memberCount && memberCount.count >= 6) {
    return { error: "Maximum of 5 additional users allowed per application" }
  }

  
  const targetUser = await queryOne<{ id: string }>("SELECT id FROM users WHERE email = ?", [email])
  if (!targetUser) {
    return { error: "User not found with this email" }
  }

  
  
  const existingMember = await queryOne("SELECT id FROM application_members WHERE application_id = ? AND user_id = ?", [
    appId,
    targetUser.id,
  ])
  if (existingMember) {
    return { error: "User is already a member of this application" }
  }

  
  
  await query("INSERT INTO application_members (id, application_id, user_id) VALUES (?, ?, ?)", [
    generateId(),
    appId,
    targetUser.id,
  ])

  revalidatePath(`/dashboard/apps/${appId}/team`)
  return { success: true }
}

export async function removeTeamMember(appId: string, memberId: string) {
  const user = await requireAuth()

  
  const app = await queryOne<{ owner_id: string }>("SELECT owner_id FROM applications WHERE id = ?", [appId])
  if (!app || app.owner_id !== user.id) {
    return { error: "Only the owner can remove team members" }
  }

  
  
  const targetMember = await queryOne<{ user_id: string }>("SELECT user_id FROM application_members WHERE id = ?", [
    memberId,
  ])
  
  if (targetMember?.user_id === user.id) {
    return { error: "You cannot remove yourself from your own application" }
  }

  
  await query("DELETE FROM application_members WHERE id = ?", [memberId])

  revalidatePath(`/dashboard/apps/${appId}/team`)
  return { success: true }
}