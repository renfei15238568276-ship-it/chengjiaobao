import { NextRequest, NextResponse } from 'next/server'
import { verifyUserLogin } from '@/lib/user-service'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)
    
    // Use local login - accept username or email
    const username = email.includes('@') ? email.split('@')[0] : email
    const user = await verifyUserLogin(username, password)
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.username,
        name: user.displayName
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
