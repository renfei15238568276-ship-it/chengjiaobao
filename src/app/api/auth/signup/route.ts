import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/user-service'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(6),
  name: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = signupSchema.parse(body)
    
    const username = email.includes('@') ? email.split('@')[0] : email
    
    const result = await registerUser({
      username,
      password,
      displayName: name,
    })
    
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }
    
    return NextResponse.json({ success: true, message: '注册成功，请登录！' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
