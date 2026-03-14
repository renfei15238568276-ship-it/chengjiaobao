import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  organizationName: z.string().min(1),
})

export async function POST(request: NextRequest) {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Supabase not configured. Please set environment variables in Vercel.' 
    }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { email, password, name, organizationName } = signupSchema.parse(body)

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin!.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Try to create organization (will fail if table doesn't exist - that's ok)
    let org = null
    try {
      const slug = organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now()
      const { data: orgData } = await supabaseAdmin!
        .from('organizations')
        .insert({ name: organizationName, slug, plan: 'free' })
        .select()
        .single()
      org = orgData

      // Try to add member
      if (org) {
        await supabaseAdmin!
          .from('organization_members')
          .insert({ organization_id: org.id, user_id: userId, role: 'owner' })
      }
    } catch (e) {
      // Organization table might not exist yet, that's ok for now
      console.log('Organization creation skipped:', e)
    }

    return NextResponse.json({
      success: true,
      user: { id: userId, email },
      organization: org,
      message: org ? '注册成功' : '注册成功，请联系管理员创建团队'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
