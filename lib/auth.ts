import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { query, queryOne } from './db'
import { randomBytes } from 'crypto'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' 
  created_at: Date
}

export interface Session {
  id: string
  user_id: string
  expires_at: Date
}

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateId(): string {
  return randomBytes(16).toString('hex')
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = generateId()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    [sessionId, userId, expiresAt]
  )

  const cookieStore = await cookies()
  cookieStore.set('session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  })

  return sessionId
}

export async function getSession(): Promise<{ session: Session; user: User } | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value

  if (!sessionId) return null

  const session = await queryOne<Session>(
    'SELECT * FROM sessions WHERE id = ? AND expires_at > NOW()',
    [sessionId]
  )

  if (!session) return null

  const user = await queryOne<User>(
    'SELECT id, email, name, role, created_at FROM users WHERE id = ?',
    [session.user_id]
  )

  if (!user) return null

  return { session, user }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value

  if (sessionId) {
    await query('DELETE FROM sessions WHERE id = ?', [sessionId])
  }

  cookieStore.delete('session')
}

export async function requireAuth(): Promise<User> {
  const data = await getSession()
  if (!data) {
    throw new Error('Unauthorized')
  }
  return data.user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()

  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }
  return user
}