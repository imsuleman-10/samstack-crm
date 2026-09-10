// scripts/create-admin.mjs
// Run with: node scripts/create-admin.mjs
// Creates the default super admin user via Supabase Admin API

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nqxhmdtsnwezwucnvckq.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xeGhtZHRzbndlend1Y252Y2txIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg2NDg4MywiZXhwIjoyMTA0NDQwODgzfQ.9Xu-v-es7bo2TTvR0wdICRlavWxcmIxi6K36JE-q8zU'

const ADMIN_EMAIL = 'samstacktechs@gmail.com'
const ADMIN_PASSWORD = 'Salman123@'
const ADMIN_FULL_NAME = 'Super Admin'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function createAdmin() {
  console.log('🚀 Creating super admin account...')

  // Step 1: Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existing = existingUsers?.users?.find(u => u.email === ADMIN_EMAIL)

  let authUserId

  if (existing) {
    console.log('ℹ️  Auth user already exists. Skipping auth creation.')
    authUserId = existing.id
  } else {
    // Step 2: Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: ADMIN_FULL_NAME,
        role: 'admin',
      },
    })

    if (authError) {
      console.error('❌ Failed to create auth user:', authError.message)
      process.exit(1)
    }

    authUserId = authUser.user.id
    console.log('✅ Auth user created:', authUserId)
  }

  // Step 3: Wait a moment for the trigger to create the profile row
  await new Promise(r => setTimeout(r, 1500))

  // Step 4: Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', authUserId)
    .single()

  if (existingProfile) {
    // Profile exists — update it to super_admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: ADMIN_FULL_NAME,
        role: 'super_admin',
        status: 'active',
        onboarding_completed: true,
        job_title: 'Super Administrator',
        department: 'Management',
        updated_at: new Date().toISOString(),
      })
      .eq('auth_user_id', authUserId)

    if (updateError) {
      console.error('❌ Failed to update profile:', updateError.message)
      process.exit(1)
    }

    console.log('✅ Profile updated to super_admin role')
  } else {
    // Profile doesn't exist yet — insert it manually
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        auth_user_id: authUserId,
        email: ADMIN_EMAIL,
        full_name: ADMIN_FULL_NAME,
        role: 'super_admin',
        status: 'active',
        onboarding_completed: true,
        job_title: 'Super Administrator',
        department: 'Management',
      })

    if (insertError) {
      console.error('❌ Failed to insert profile:', insertError.message)
      process.exit(1)
    }

    console.log('✅ Profile created with super_admin role')
  }

  console.log('\n🎉 Super Admin account is ready!')
  console.log('-----------------------------------')
  console.log('📧 Email   :', ADMIN_EMAIL)
  console.log('🔑 Password:', ADMIN_PASSWORD)
  console.log('🛡️  Role    : super_admin')
  console.log('-----------------------------------')
  console.log('Login at: http://localhost:3000/login')
}

createAdmin().catch(console.error)
