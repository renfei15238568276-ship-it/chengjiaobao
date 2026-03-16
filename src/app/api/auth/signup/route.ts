import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  organizationName: z.string().min(1),
})

function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt
  return 'hash_' + password
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, organizationName } = signupSchema.parse(body)

    // Create Supabase client with anon key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gdzdwwwagueplbignhxy.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemR3d3dhZ3VlcGxiaWduaHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTQ1MDksImV4cCI6MjA4ODg5MDUwOX0.sb_publishable_2KndRHYM05SsWTLJx08-4g_tmjYPHQO'
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', email.split('@')[0])
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Create user in local users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        username: email.split('@')[0],
        email: email,
        display_name: name,
        password_hash: hashPassword(password),
        role: 'user',
        status: 'active'
      })
      .select()
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    // Create organization
    const slug = organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now()
    const { data: org, error: orgError } = await supabase
      .from('organization')
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

    // Add user as owner
    await supabase
      .from('organization_members')
      .insert({
        organization_id: org.id,
        user_id: user.id,
        role: 'owner'
      })

    return NextResponse.json({
      success: true,
      user: { id: user.id, email, name },
      organization: org
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
