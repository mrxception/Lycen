"use server"

import { requireAdmin } from "@/lib/auth"
import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function deleteUser(userId: string) {
  
  const admin = await requireAdmin()

  
  if (admin.id === userId) {
    return { error: "You cannot delete your own admin account." }
  }

  
  await query("DELETE FROM users WHERE id = ?", [userId])

  revalidatePath("/dashboard/admin")
  return { success: true }
}