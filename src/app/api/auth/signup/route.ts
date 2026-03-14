import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  organizationName: z.string().min(1),
})

// Simple file-based user storage (for demo without database)
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

function getUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
    }
  } catch (e) {}
  return []
}

function saveUsers(users: any[]) {
  const dir = path.dirname(USERS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, organizationName } = signupSchema.parse(body)

    // Check if user already exists
    const users = getUsers()
    if (users.find((u: any) => u.email === email)) {
      return NextResponse.json({ error: '用户已存在' }, { status: 400 })
    }

    // Create simple user (demo mode - no real auth)
    const userId = 'user_' + Date.now()
    const newUser = {
      id: userId,
      email,
      name,
      organizationName,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    saveUsers(users)

    return NextResponse.json({
      success: true,
      user: { id: userId, email, name },
      organization: { name: organizationName },
      message: '注册成功！'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
