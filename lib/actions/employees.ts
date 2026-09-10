'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CreateEmployeeInput, ProfileUpdateInput } from '@/lib/validations'
import { createEmployeeSchema, profileUpdateSchema } from '@/lib/validations'
import { logAudit } from './audit'
import { sendAccountApprovedEmail } from '@/lib/mailer'

/**
 * Auto-generates the next sequential Employee ID (e.g., EMP-001, EMP-002, etc.)
 */
export async function getNextEmployeeId(): Promise<string> {
  const adminSupabase = createAdminClient()
  const { data: profiles } = await adminSupabase
    .from('profiles')
    .select('employee_id')
    .not('employee_id', 'is', null)

  let maxNum = 0
  if (profiles) {
    for (const p of profiles) {
      if (p.employee_id) {
        const match = p.employee_id.match(/\d+/)
        if (match) {
          const num = parseInt(match[0], 10)
          if (num > maxNum) maxNum = num
        }
      }
    }
  }

  const nextNum = maxNum + 1
  return `EMP-${String(nextNum).padStart(3, '0')}`
}

export async function createEmployee(input: CreateEmployeeInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()
  // Verify admin
  const { data: adminProfile } = await adminSupabase.from('profiles').select('id, role').eq('auth_user_id', user.id).single()
  if (!adminProfile || !['admin', 'super_admin'].includes(adminProfile.role)) return { error: 'Admin only' }

  const parsed = createEmployeeSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const targetRole = parsed.data.role || 'employee'

  // ONLY super_admin can create an admin!
  if (targetRole === 'admin' && adminProfile.role !== 'super_admin') {
    return { error: 'Permission denied: Only Super Admin can create Admin accounts.' }
  }

  // Auto-generate employee_id if not provided
  const finalEmployeeId = parsed.data.employee_id?.trim() || (await getNextEmployeeId())

  // Use admin client to create auth user (service role — bypasses RLS)
  const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.full_name,
      role: targetRole,
      admin_created: true, // triggers active status in DB trigger
    },
  })

  if (authError) {
    console.error('[createEmployee] Auth user creation failed:', authError.message, authError)
    return { error: authError.message }
  }
  if (!authUser.user) return { error: 'Failed to create auth user' }

  // Wait briefly for the trigger to create the profile row
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Update the profile with extra fields (trigger may have already inserted)
  const { data: profile, error: profileError } = await adminSupabase
    .from('profiles')
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
      job_title: parsed.data.job_title || null,
      employee_id: finalEmployeeId,
      department: parsed.data.department || null,
      joining_date: parsed.data.joining_date || null,
      role: targetRole,
      status: 'active',
    })
    .eq('auth_user_id', authUser.user.id)
    .select()
    .single()

  if (profileError) {
    console.error('[createEmployee] Profile update failed:', profileError.message, profileError)
    // Rollback auth user creation
    await adminSupabase.auth.admin.deleteUser(authUser.user.id)
    return { error: profileError.message }
  }

  await logAudit({ entity_type: 'employee', entity_id: profile.id, action: 'created', new_data: profile })
  revalidatePath('/admin/employees')
  return { data: profile }
}

export async function updateEmployeeStatus(profileId: string, status: 'active' | 'inactive' | 'suspended' | 'pending') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()
  const { data: adminProfile } = await adminSupabase.from('profiles').select('id, role').eq('auth_user_id', user.id).single()
  if (!adminProfile || !['admin', 'super_admin'].includes(adminProfile.role)) return { error: 'Admin only' }

  const { data: existing } = await adminSupabase
    .from('profiles')
    .select('status, email, full_name')
    .eq('id', profileId)
    .single()

  const { data, error } = await adminSupabase
    .from('profiles')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', profileId)
    .select()
    .single()

  if (error) return { error: error.message }

  // If approved/activated from pending/inactive/suspended, send approval email
  if (status === 'active' && existing?.status !== 'active' && existing?.email) {
    sendAccountApprovedEmail(existing.email, existing.full_name || 'Team Member').catch((err) => {
      console.error('[updateEmployeeStatus] Failed to send approval email:', err)
    })
  }

  const action = status === 'active' ? 'activated' : status === 'suspended' ? 'suspended' : 'deactivated'
  await logAudit({ entity_type: 'employee', entity_id: profileId, action, old_data: { status: existing?.status }, new_data: { status } })
  revalidatePath('/admin/employees')
  return { data }
}

export async function updateProfile(input: ProfileUpdateInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = profileUpdateSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('profiles')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('auth_user_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/profile')
  return { data }
}

export async function uploadProfilePhoto(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const file = formData.get('file') as File
  if (!file) return { error: 'No file provided' }
  if (file.size > 5 * 1024 * 1024) return { error: 'File must be under 5MB' }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return { error: 'Only JPEG, PNG, and WebP images are allowed' }
  }

  const ext = file.name.split('.').pop()
  const path = `${user.id}/profile.${ext}`

  const adminSupabase = createAdminClient()
  const { error: uploadError } = await adminSupabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (uploadError) return { error: uploadError.message }

  const { data: urlData } = adminSupabase.storage.from('avatars').getPublicUrl(path)

  const { data, error } = await adminSupabase
    .from('profiles')
    .update({ profile_photo_url: urlData.publicUrl, updated_at: new Date().toISOString() })
    .eq('auth_user_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/profile')
  revalidatePath('/onboarding')
  return { data, url: urlData.publicUrl }
}

export async function completeOnboarding(input: {
  full_name: string
  phone: string
  job_title: string
  employee_id?: string
  department?: string
  bio?: string
  joining_date?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Use employee_id passed from client (already generated) or fallback
  const finalEmpId = input.employee_id?.trim() || await getNextEmployeeId()

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('profiles')
    .update({
      full_name: input.full_name,
      phone: input.phone,
      job_title: input.job_title,
      employee_id: finalEmpId,
      department: input.department || null,
      bio: input.bio || null,
      joining_date: input.joining_date || null,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('auth_user_id', user.id)
    .select('id, role')
    .single()

  if (error) return { error: error.message }

  // Revalidate all relevant paths so middleware cache is cleared
  revalidatePath('/onboarding')
  revalidatePath('/dashboard')
  revalidatePath('/admin/dashboard')

  return { data, role: data.role }
}

export async function getMyRole(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()

  return profile?.role || null
}

export async function deleteEmployee(profileId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()
  // Verify caller is admin or super_admin
  const { data: adminProfile } = await adminSupabase
    .from('profiles')
    .select('id, role, auth_user_id')
    .eq('auth_user_id', user.id)
    .single()

  if (!adminProfile || !['admin', 'super_admin'].includes(adminProfile.role)) {
    return { error: 'Permission denied: Only Admin or Super Admin can delete employees.' }
  }

  // Fetch the target employee
  const { data: targetEmployee } = await adminSupabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  if (!targetEmployee) {
    return { error: 'Employee not found.' }
  }

  // Prevent self-deletion
  if (targetEmployee.id === adminProfile.id || targetEmployee.auth_user_id === user.id) {
    return { error: 'You cannot delete your own account.' }
  }

  // Prevent deleting super_admin
  if (targetEmployee.role === 'super_admin') {
    return { error: 'Super Admin accounts cannot be deleted.' }
  }

  // Admin cannot delete another admin
  if (targetEmployee.role === 'admin' && adminProfile.role !== 'super_admin') {
    return { error: 'Permission denied: Only Super Admin can delete Admin accounts.' }
  }

  // Safely reassign linked records to executing admin so foreign key constraints are not violated
  await Promise.all([
    adminSupabase
      .from('leads')
      .update({ owner_id: adminProfile.id, updated_at: new Date().toISOString() })
      .eq('owner_id', profileId),
    adminSupabase
      .from('leads')
      .update({ created_by: adminProfile.id, updated_at: new Date().toISOString() })
      .eq('created_by', profileId),
    adminSupabase
      .from('follow_ups')
      .update({ assigned_to: adminProfile.id, updated_at: new Date().toISOString() })
      .eq('assigned_to', profileId),
    adminSupabase
      .from('outreach_activities')
      .update({ employee_id: adminProfile.id })
      .eq('employee_id', profileId),
    adminSupabase
      .from('notes')
      .update({ employee_id: adminProfile.id })
      .eq('employee_id', profileId),
    adminSupabase
      .from('projects')
      .update({ employee_id: adminProfile.id, updated_at: new Date().toISOString() })
      .eq('employee_id', profileId),
  ])

  // Delete profile from profiles table
  const { error: profileDeleteError } = await adminSupabase
    .from('profiles')
    .delete()
    .eq('id', profileId)

  if (profileDeleteError) {
    console.error('[deleteEmployee] Profile delete error:', profileDeleteError)
    return { error: profileDeleteError.message }
  }

  // Delete auth user from Supabase auth.users
  if (targetEmployee.auth_user_id) {
    const { error: authDeleteError } = await adminSupabase.auth.admin.deleteUser(targetEmployee.auth_user_id)
    if (authDeleteError) {
      console.warn('[deleteEmployee] Auth user delete warning:', authDeleteError.message)
    }
  }

  await logAudit({
    entity_type: 'employee',
    entity_id: profileId,
    action: 'deleted',
    old_data: targetEmployee,
    new_data: { deleted_by: adminProfile.id, deleted_at: new Date().toISOString() },
  })

  revalidatePath('/admin/employees')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/analytics')
  return { success: true }
}

/**
 * Hard-deletes an employee AND all data they own (leads, follow-ups, notes,
 * outreach, projects). This is irreversible — use with extreme caution.
 * Only admins and super_admins may call this action.
 */
export async function deleteEmployeeWithLeads(profileId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()

  // Verify caller role
  const { data: adminProfile } = await adminSupabase
    .from('profiles')
    .select('id, role, auth_user_id')
    .eq('auth_user_id', user.id)
    .single()

  if (!adminProfile || !['admin', 'super_admin'].includes(adminProfile.role)) {
    return { error: 'Permission denied: Only Admin or Super Admin can delete employees.' }
  }

  // Fetch target employee
  const { data: targetEmployee } = await adminSupabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  if (!targetEmployee) return { error: 'Employee not found.' }

  // Guard rails
  if (targetEmployee.id === adminProfile.id || targetEmployee.auth_user_id === user.id) {
    return { error: 'You cannot delete your own account.' }
  }
  if (targetEmployee.role === 'super_admin') {
    return { error: 'Super Admin accounts cannot be deleted.' }
  }
  if (targetEmployee.role === 'admin' && adminProfile.role !== 'super_admin') {
    return { error: 'Permission denied: Only Super Admin can delete Admin accounts.' }
  }

  // ── Cascade delete in FK-safe order ────────────────────────────────────────
  // 1. Notes (reference leads.id & profiles.id)
  // First get lead IDs owned by this employee
  const { data: ownedLeads } = await adminSupabase
    .from('leads')
    .select('id')
    .eq('owner_id', profileId)

  const leadIds = ownedLeads?.map((l: { id: string }) => l.id) ?? []

  // Delete notes on owned leads
  if (leadIds.length > 0) {
    await adminSupabase.from('notes').delete().in('lead_id', leadIds)
    await adminSupabase.from('follow_ups').delete().in('lead_id', leadIds)
    await adminSupabase.from('outreach_activities').delete().in('lead_id', leadIds)
  }

  // Delete notes/follow-ups/outreach created BY this employee on other leads
  await Promise.all([
    adminSupabase.from('notes').delete().eq('employee_id', profileId),
    adminSupabase.from('follow_ups').delete().eq('assigned_to', profileId),
    adminSupabase.from('outreach_activities').delete().eq('employee_id', profileId),
    adminSupabase.from('projects').delete().eq('employee_id', profileId),
  ])

  // 2. Hard-delete all leads owned or created by the employee
  await Promise.all([
    adminSupabase.from('leads').delete().eq('owner_id', profileId),
    adminSupabase.from('leads').delete().eq('created_by', profileId),
  ])

  // 3. Delete profile row
  const { error: profileDeleteError } = await adminSupabase
    .from('profiles')
    .delete()
    .eq('id', profileId)

  if (profileDeleteError) {
    console.error('[deleteEmployeeWithLeads] Profile delete error:', profileDeleteError)
    return { error: profileDeleteError.message }
  }

  // 4. Delete auth user
  if (targetEmployee.auth_user_id) {
    const { error: authDeleteError } = await adminSupabase.auth.admin.deleteUser(
      targetEmployee.auth_user_id
    )
    if (authDeleteError) {
      console.warn('[deleteEmployeeWithLeads] Auth user delete warning:', authDeleteError.message)
    }
  }

  await logAudit({
    entity_type: 'employee',
    entity_id: profileId,
    action: 'deleted_with_leads',
    old_data: targetEmployee,
    new_data: {
      deleted_by: adminProfile.id,
      deleted_at: new Date().toISOString(),
      leads_deleted: leadIds.length,
    },
  })

  revalidatePath('/admin/employees')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/analytics')
  return { success: true }
}
