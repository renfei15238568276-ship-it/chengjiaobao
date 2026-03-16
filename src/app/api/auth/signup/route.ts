import { NextRequest, NextResponse } from 'next/server'
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gdzdwwwagueplbignhxy.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemR3d3dhZ3VlcGxiaWduaHh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMxNDUwOSwiZXhwIjoyMDg4ODkwNTA5fQ.zNbc23CEjpdE1-oS2PAVDuVghCOeEyT4F_qa4vjNX8M'
    
    const username = email.split('@')[0]
    
    // Check if user exists
    const checkRes = await fetch(`${supabaseUrl}/rest/v1/users?username=eq.${username}`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    const existing = await checkRes.json()
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }
    
    // Create user
    const passwordHash = 'sha256_' + Buffer.from(password).toString('base64')
    const createRes = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        username,
        email,
        display_name: name,
        password_hash: passwordHash,
        role: 'user',
        status: 'active'
      })
    })
    const user = await createRes.json()
    if (createRes.status !== 201) {
      return NextResponse.json({ error: user.message || 'Failed to create user' }, { status: 500 })
    }
    
    // Create organization
    const slug = organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now()
    const orgRes = await fetch(`${supabaseUrl}/rest/v1/organization`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: organizationName,
        slug,
        plan: 'free'
      })
    })
    const org = await orgRes.json()
    
    return NextResponse.json({
      success: true,
      message: 'Registration successful! You can now login.'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
