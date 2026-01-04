"use server"

import { query, queryOne } from "@/lib/db"
import { requireAuth, generateId } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"




export async function createApplication(formData: FormData) {
  const user = await requireAuth()
  const name = formData.get("name") as string

  if (!name) return { error: "Name is required" }

  const appId = generateId()
  const secretKey = randomBytes(32).toString("hex")

  
  await query(
    "INSERT INTO applications (id, name, secret_key, owner_id) VALUES (?, ?, ?, ?)", 
    [appId, name, secretKey, user.id]
  )

  
  await query(
    "INSERT INTO application_members (id, application_id, user_id) VALUES (?, ?, ?)", 
    [generateId(), appId, user.id]
  )

  revalidatePath("/dashboard")
  return { success: true }
}




export async function deleteApplication(appId: string) {
  const user = await requireAuth()

  
  const app = await queryOne<{ owner_id: string }>(
    "SELECT owner_id FROM applications WHERE id = ?", 
    [appId]
  )
  
  if (!app || app.owner_id !== user.id) {
    return { error: "Unauthorized" }
  }

  await query("DELETE FROM applications WHERE id = ?", [appId])
  revalidatePath("/dashboard")
  return { success: true }
}




export async function createLicense(appId: string, formData: FormData) {
  const user = await requireAuth()

  
  const access = await queryOne(
    "SELECT id FROM application_members WHERE application_id = ? AND user_id = ?", 
    [appId, user.id]
  )

  
  const app = await queryOne<{ owner_id: string }>(
    "SELECT owner_id FROM applications WHERE id = ?", 
    [appId]
  )
  
  if (!access && app?.owner_id !== user.id) return { error: "Unauthorized" }

  
  const duration = Number.parseInt(formData.get("duration") as string) || 30 
  const licenseKey = randomBytes(16).toString("hex").toUpperCase()
  
  
  
  
  await query(
    `INSERT INTO licenses 
    (id, application_id, license_key, duration_days, expires_at, activated_at, is_active) 
    VALUES (?, ?, ?, ?, NULL, NULL, TRUE)`, 
    [
      generateId(),
      appId,
      licenseKey,
      duration 
    ]
  )

  revalidatePath(`/dashboard/apps/${appId}`)
  return { success: true }
}




export async function deleteLicense(appId: string, licenseId: string) {
  const user = await requireAuth()

  const access = await queryOne(
    "SELECT id FROM application_members WHERE application_id = ? AND user_id = ?", 
    [appId, user.id]
  )
  
  const app = await queryOne<{ owner_id: string }>(
    "SELECT owner_id FROM applications WHERE id = ?", 
    [appId]
  )

  if (!access && app?.owner_id !== user.id) return { error: "Unauthorized" }

  await query("DELETE FROM licenses WHERE id = ?", [licenseId])
  revalidatePath(`/dashboard/apps/${appId}`)
  return { success: true }
}