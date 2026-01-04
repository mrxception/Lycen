"use server"

import { query } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const user = await requireAuth()
  const name = formData.get("name") as string

  if (!name) return { error: "Name is required" }

  await query("UPDATE users SET name = ? WHERE id = ?", [name, user.id])

  revalidatePath("/dashboard/settings")
  return { success: true }
}
