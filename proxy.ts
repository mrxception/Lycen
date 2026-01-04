import { NextResponse } from "next/server"
import type { NextRequest } from "next/server" // Note: Import from 'next/server', not 'next/request'
import { getSession } from "./lib/auth"

// CHANGE THIS LINE: export default async function proxy
export default async function proxy(request: NextRequest) {
  const session = await getSession()
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if ((pathname === "/login" || pathname === "/register") && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}