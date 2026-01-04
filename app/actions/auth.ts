"use server"

import { query } from "@/lib/db"
import { createSession, deleteSession, generateId } from "@/lib/auth" 
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("--- DEBUG LOGIN ---")
  console.log("Typing Email:", email)
  console.log("Typing Password:", password) 

  
  const users = await query<any>("SELECT * FROM users WHERE email = ?", [email])
  const user = users[0]

  if (!user) {
    console.log("❌ FAIL: Email not found in DB")
    return { error: "Invalid credentials" }
  }

  
  console.log("✅ User Found. Checking hash...")
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    console.log("❌ FAIL: Password hash mismatch")
    return { error: "Invalid credentials" }
  }

  console.log("✅ SUCCESS: Logging in...")
  await createSession(user.id)
  redirect("/dashboard")
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  
  const hash = await bcrypt.hash(password, 10)
  
  
  const userId = generateId()

  try {
    
    await query(
      "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
      [userId, name, email, hash]
    )
  } catch (e) {
    console.error("Registration Error:", e) 
    return { error: "Email already exists" }
  }

  
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}