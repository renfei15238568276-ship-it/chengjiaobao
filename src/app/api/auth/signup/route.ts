import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { registerUserWithOrganization } from '@/lib/user-service'
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
      error: 'Supabase not configured. Please set environment variables.' 
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

    // Create slug from organization name
    const slug = organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now()

    // Create organization
    const { data: org, error: orgError } = await supabaseAdmin!
      .from('organizations')
      .insert({
        name: organizationName,
        slug,
        plan: 'free'
      })
      .select()
      .single()

    if (orgError) {
      return NextResponse.json({ error: orgError.message }, { status: 500 })
    }

    // Add user as owner of the organization
    const { error: memberError } = await supabaseAdmin!
      .from('organization_members')
      .insert({
        organization_id: org.id,
        user_id: userId,
        role: 'owner'
      })

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: { id: userId, email },
      organization: org
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
