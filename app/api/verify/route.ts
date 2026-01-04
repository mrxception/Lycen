import { queryOne, query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { secret_key, license_key, hwid } = await request.json()

    if (!secret_key || !license_key) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    
    const app = await queryOne<{ id: string }>(
      "SELECT id FROM applications WHERE secret_key = ?", 
      [secret_key]
    )
    
    if (!app) {
      return NextResponse.json({ success: false, message: "Invalid application secret key" }, { status: 401 })
    }

    
    const license = await queryOne<any>(
      "SELECT * FROM licenses WHERE application_id = ? AND license_key = ?",
      [app.id, license_key]
    )

    if (!license) {
      return NextResponse.json({ success: false, message: "Invalid license key" }, { status: 401 })
    }

    
    if (!license.is_active) {
      return NextResponse.json({ success: false, message: "License has been revoked/banned" }, { status: 403 })
    }

    
    
    
    let expiresAt = license.expires_at ? new Date(license.expires_at) : null

    
    if (!license.activated_at) {
      const durationDays = license.duration_days || 30
      
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + durationDays)

      await query(
        "UPDATE licenses SET activated_at = NOW(), expires_at = ? WHERE id = ?",
        [expiresAt, license.id]
      )
    }

    
    const now = new Date()
    if (expiresAt && expiresAt < now) {
       return NextResponse.json({ success: false, message: "License key has expired" }, { status: 401 })
    }

    
    if (hwid) {
      if (!license.hwid) {
        await query("UPDATE licenses SET hwid = ? WHERE id = ?", [hwid, license.id])
      } 
      else if (license.hwid !== hwid) {
        return NextResponse.json({ success: false, message: "Hardware ID mismatch" }, { status: 403 })
      }
    }

    
    const ip = request.headers.get("x-forwarded-for") || "0.0.0.0"
    await query("UPDATE licenses SET last_used = NOW(), is_active = TRUE WHERE id = ?", [license.id])

    
    let daysRemaining = 0
    if (expiresAt) {
      
      const diffTime = expiresAt.getTime() - now.getTime()
      
      
      daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    }

    return NextResponse.json({
      success: true,
      message: "License verified successfully",
      expires_at: expiresAt,
      days_remaining: daysRemaining, 
    })

  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}