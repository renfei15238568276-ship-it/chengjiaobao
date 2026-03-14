import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { verifyUserLogin } from '@/lib/user-service'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function POST(request: NextRequest) {
  // Fallback to local login if Supabase not configured
  if (!isSupabaseConfigured()) {
    try {
      const body = await request.json()
      const { email, password } = loginSchema.parse(body)
      
      // Use local login (username-based)
      const user = await verifyUserLogin(email, password)
      
      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
      }
      
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.username,
          name: user.displayName
        },
        message: 'Logged in successfully (local mode)'
      })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  // Supabase authentication
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Authenticate user
    const { data: authData, error: authError } = await supabaseAdmin!.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Get user's organization
    const { data: membership } = await supabaseAdmin!
      .from('organization_members')
      .select('*, organization:organizations(*), user:users(*)')
      .eq('userId', authData.user.id)
      .single()

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name
      },
      organization: membership?.organization || null,
      session: authData.session
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
