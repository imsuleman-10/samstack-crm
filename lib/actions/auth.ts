'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminSupabase } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import type { LoginInput } from '@/lib/validations'
import { loginSchema } from '@/lib/validations'
import { sendOtpEmail } from '@/lib/mailer'

const ADMIN_ROLES = ['admin', 'super_admin'] as const

// ─── In-memory fallback OTP store ─────────────────────────────────────────────
interface OtpEntry {
  code: string
  expiresAt: number
  attempts: number
}
const otpMemoryStore = new Map<string, OtpEntry>()

// ─── Helper: get admin supabase client ───────────────────────────────────────
function adminClient() {
  return createAdminSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

function getOtpSecret(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || 'samstack_crm_secret_key_2026'
}

// ─── Helper: find an existing Supabase auth user by email ────────────────────
async function findAuthUserByEmail(email: string): Promise<{ id: string; hasPassword: boolean } | null> {
  const admin = adminClient()
  let page = 1
  const perPage = 100

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error || !data?.users?.length) break

    const match = data.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    )
    if (match) {
      const hasPassword = !!(match as unknown as Record<string, unknown>).encrypted_password
      return { id: match.id, hasPassword }
    }

    if (data.users.length < perPage) break
    page++
  }

  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function login(input: LoginInput) {
  const supabase = await createClient()

  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    console.error('[Auth Login Error]:', error.message)
    return { error: error.message }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('[Auth Error]: User not found after signIn')
    return { error: 'Authentication failed. Please try again.' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status, onboarding_completed')
    .eq('auth_user_id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('[Profile Fetch Error]:', profileError)
    return { error: 'Profile not found. Please contact your administrator.' }
  }

  if (profile.status === 'pending') {
    await supabase.auth.signOut()
    return { error: 'Your account is pending approval. Please wait for an administrator to activate your account.' }
  }

  if (profile.status === 'inactive' || profile.status === 'suspended') {
    await supabase.auth.signOut()
    return { error: 'Your account has been deactivated. Contact your administrator.' }
  }

  const isAdmin = ADMIN_ROLES.includes(profile.role as typeof ADMIN_ROLES[number])
  console.log('[Auth Login Success]:', user.email, 'Role:', profile.role, 'IsAdmin:', isAdmin)

  return {
    role: profile.role,
    isAdmin,
    onboarding_completed: profile.onboarding_completed,
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function forgotPassword(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })
  if (error) return { error: error.message }
  return { success: true }
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRATION — Step 1: Send OTP
// ─────────────────────────────────────────────────────────────────────────────
/**
 * 1. Checks for duplicate live accounts (active/inactive/suspended).
 * 2. Generates a cryptographically secure 6-digit numeric OTP code.
 * 3. Signs it with HMAC-SHA256 and sets a secure HttpOnly cookie + in-memory store.
 * 4. Dispatches the OTP directly through Gmail SMTP via nodemailer.
 */
export async function sendRegistrationOtp(email: string) {
  const normalised = email.trim().toLowerCase()

  if (!normalised || !normalised.includes('@')) {
    return { error: 'Please provide a valid email address.' }
  }

  const admin = adminClient()

  // ── Duplicate check ─────────────────────────────────────────────────────────
  const { data: existingProfile } = await admin
    .from('profiles')
    .select('status, auth_user_id')
    .eq('email', normalised)
    .maybeSingle()

  if (existingProfile) {
    const liveStatuses = ['active', 'inactive', 'suspended']

    if (liveStatuses.includes(existingProfile.status)) {
      return { error: 'An account with this email already exists. Please log in instead.' }
    }

    if (existingProfile.status === 'pending' && existingProfile.auth_user_id) {
      const authUser = await findAuthUserByEmail(normalised)
      if (authUser?.hasPassword) {
        return { error: 'An account with this email is already pending administrator approval. Please wait for activation.' }
      }
      // Stale or temp account — remove so fresh registration works cleanly
      await admin.auth.admin.deleteUser(existingProfile.auth_user_id)
      console.log('[sendRegistrationOtp] Cleaned up stale unverified user:', normalised)
    }
  }

  // ── Generate 6-Digit OTP ────────────────────────────────────────────────────
  const otpCode = crypto.randomInt(100000, 1000000).toString()
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes
  const secret = getOtpSecret()

  // HMAC Signature: hash of email + code + expiresAt
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(`${normalised}:${otpCode}:${expiresAt}`)
    .digest('hex')

  // Save to in-memory store for instant matching
  otpMemoryStore.set(normalised, {
    code: otpCode,
    expiresAt,
    attempts: 0,
  })

  // Save to secure cookie for stateless verification
  const cookieStore = await cookies()
  cookieStore.set(
    'samstack_reg_otp',
    JSON.stringify({ email: normalised, expiresAt, hmac }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600, // 10 minutes
      sameSite: 'lax',
      path: '/',
    }
  )

  // ── Send Email via Gmail SMTP ───────────────────────────────────────────────
  const sent = await sendOtpEmail(normalised, otpCode)
  if (!sent) {
    return {
      error: 'Failed to send verification email. Please check your email address and try again.',
    }
  }

  console.log(`[sendRegistrationOtp] OTP dispatched to: ${normalised}`)
  return { success: true }
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRATION — Step 2: Verify OTP
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Validates the 6-digit code entered by the user against HMAC cookie / memory store.
 * Once verified, sets a temporary verification confirmation token cookie.
 */
export async function verifyRegistrationOtp(email: string, token: string) {
  const normalised = email.trim().toLowerCase()
  const code = token.trim()

  if (!normalised || !code || code.length !== 6) {
    return { error: 'Please enter the complete 6-digit verification code.' }
  }

  const secret = getOtpSecret()
  let isValid = false

  // 1. Check in-memory store
  const memEntry = otpMemoryStore.get(normalised)
  if (memEntry) {
    if (Date.now() > memEntry.expiresAt) {
      otpMemoryStore.delete(normalised)
      return { error: 'Verification code has expired. Please request a new code.' }
    }
    if (memEntry.attempts >= 5) {
      otpMemoryStore.delete(normalised)
      return { error: 'Too many incorrect attempts. Please request a new code.' }
    }

    if (memEntry.code === code) {
      isValid = true
      otpMemoryStore.delete(normalised)
    } else {
      memEntry.attempts++
    }
  }

  // 2. Check cookie if not already verified via memory
  if (!isValid) {
    const cookieStore = await cookies()
    const rawCookie = cookieStore.get('samstack_reg_otp')?.value

    if (rawCookie) {
      try {
        const parsed = JSON.parse(rawCookie)
        if (parsed.email === normalised && Date.now() <= parsed.expiresAt) {
          const expectedHmac = crypto
            .createHmac('sha256', secret)
            .update(`${normalised}:${code}:${parsed.expiresAt}`)
            .digest('hex')

          if (crypto.timingSafeEqual(Buffer.from(parsed.hmac), Buffer.from(expectedHmac))) {
            isValid = true
          }
        }
      } catch {
        // invalid cookie format
      }
    }
  }

  if (!isValid) {
    return { error: 'Invalid verification code. Please check your email and try again.' }
  }

  // ── Mark as verified in session ─────────────────────────────────────────────
  const cookieStore = await cookies()
  cookieStore.delete('samstack_reg_otp')

  const verifiedExpiry = Date.now() + 15 * 60 * 1000 // 15 minutes to complete form
  const verifiedHmac = crypto
    .createHmac('sha256', secret)
    .update(`verified:${normalised}:${verifiedExpiry}`)
    .digest('hex')

  cookieStore.set(
    'samstack_reg_verified',
    JSON.stringify({ email: normalised, expiresAt: verifiedExpiry, hmac: verifiedHmac }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 900, // 15 mins
      sameSite: 'lax',
      path: '/',
    }
  )

  console.log('[verifyRegistrationOtp] Verified successfully for:', normalised)
  return { success: true, verified: true }
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRATION — Step 3: Create Account
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Creates the user in Supabase Auth with password, then creates the profile row.
 * Verified via HMAC cookie to guarantee email OTP validation took place.
 */
export async function registerEmployee(input: {
  email: string
  password: string
  full_name: string
  phone?: string
}) {
  try {
    if (!input.email || !input.password || !input.full_name) {
      return { error: 'All fields are required.' }
    }
    if (input.password.length < 8) {
      return { error: 'Password must be at least 8 characters.' }
    }

    const emailNorm = input.email.trim().toLowerCase()
    const admin = adminClient()
    const secret = getOtpSecret()

    // ── Verify that OTP was validated ────────────────────────────────────────
    const cookieStore = await cookies()
    const rawVerified = cookieStore.get('samstack_reg_verified')?.value

    let isVerified = false
    if (rawVerified) {
      try {
        const parsed = JSON.parse(rawVerified)
        if (parsed.email === emailNorm && Date.now() <= parsed.expiresAt) {
          const expectedHmac = crypto
            .createHmac('sha256', secret)
            .update(`verified:${emailNorm}:${parsed.expiresAt}`)
            .digest('hex')

          if (crypto.timingSafeEqual(Buffer.from(parsed.hmac), Buffer.from(expectedHmac))) {
            isVerified = true
          }
        }
      } catch {
        // invalid cookie
      }
    }

    if (!isVerified) {
      return { error: 'Email verification required. Please complete OTP verification first.' }
    }

    // ── Check if auth user exists ───────────────────────────────────────────
    const existingAuthUser = await findAuthUserByEmail(emailNorm)
    let userId: string

    if (existingAuthUser) {
      // Update user with password & metadata
      const { error: updateError } = await admin.auth.admin.updateUserById(
        existingAuthUser.id,
        {
          password: input.password,
          email_confirm: true,
          user_metadata: {
            full_name: input.full_name.trim(),
            role: 'employee',
            admin_created: false,
          },
        }
      )

      if (updateError) {
        console.error('[registerEmployee] User update failed:', updateError.message)
        return { error: updateError.message }
      }

      userId = existingAuthUser.id
    } else {
      // Create user fresh in Supabase Auth
      const { data, error: createError } = await admin.auth.admin.createUser({
        email: emailNorm,
        password: input.password,
        email_confirm: true,
        user_metadata: {
          full_name: input.full_name.trim(),
          role: 'employee',
          admin_created: false,
        },
      })

      if (createError) {
        console.error('[registerEmployee] User create failed:', createError.message)
        if (
          createError.message.includes('already registered') ||
          createError.message.includes('already exists') ||
          createError.message.includes('duplicate')
        ) {
          return { error: 'An account with this email already exists. Please log in instead.' }
        }
        return { error: createError.message }
      }

      if (!data.user) return { error: 'Failed to create account. Please try again.' }
      userId = data.user.id
    }

    // ── Create or update profile record ──────────────────────────────────────
    await new Promise((resolve) => setTimeout(resolve, 200))

    const { error: profileError } = await admin.from('profiles').upsert(
      {
        auth_user_id: userId,
        email: emailNorm,
        full_name: input.full_name.trim(),
        role: 'employee',
        status: 'pending',
        ...(input.phone?.trim() ? { phone: input.phone.trim() } : {}),
      },
      { onConflict: 'auth_user_id' }
    )

    if (profileError) {
      console.warn('[registerEmployee] Profile upsert warning:', profileError.message)
    }

    // Clean up verified token cookie
    cookieStore.delete('samstack_reg_verified')

    console.log('[registerEmployee] Employee successfully registered:', emailNorm, 'ID:', userId)
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error during registration'
    console.error('[registerEmployee] Unexpected crash:', err)
    return { error: msg }
  }
}
