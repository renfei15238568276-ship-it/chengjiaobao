import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Simple file-based user storage (for demo without database)
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

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
    const { email, password } = loginSchema.parse(body)

    // Local file-based login
    const users = getUsers()
    const user = users.find((u: any) => u.email === email)
    
    if (!user) {
      return NextResponse.json({ error: '用户不存在，请先注册' }, { status: 401 })
    }

    if (user.passwordHash !== hashPassword(password)) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      organization: { name: user.organizationName },
      message: '登录成功！'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
