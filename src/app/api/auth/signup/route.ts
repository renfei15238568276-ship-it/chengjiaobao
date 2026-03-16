import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  organizationName: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, organizationName } = signupSchema.parse(body)

    const supabase = getSupabaseAdmin()
    
    // Check if user exists
    const username = email.split('@')[0]
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()
    
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }
    
    // Create user directly in database (no email needed)
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        display_name: name,
        password_hash: 'sha256_' + Buffer.from(password).toString('base64'),
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
    
    // Link user to org
    await supabase
      .from('organization_members')
      .insert({
        organization_id: org.id,
        user_id: user.id,
        role: 'owner'
      })
    
    return NextResponse.json({
      success: true,
      message: 'Registration successful! You can now login.'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
