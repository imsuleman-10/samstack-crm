'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { QuickAddLeadInput, FullLeadInput } from '@/lib/validations'
import { quickAddLeadSchema, fullLeadSchema } from '@/lib/validations'
import { logAudit } from './audit'

// ============================================================
// CREATE LEAD (Quick Add)
// ============================================================

export async function createLeadQuick(input: QuickAddLeadInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = quickAddLeadSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  const { facebook_url, instagram_url, tiktok_url, ...leadData } = parsed.data

  const { data: lead, error } = await adminSupabase
    .from('leads')
    .insert({
      ...leadData,
      owner_id: profile.id,
      created_by: profile.id,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Create social links row if any social URL was provided
  if (facebook_url || instagram_url || tiktok_url) {
    await adminSupabase.from('lead_social_links').insert({
      lead_id: lead.id,
      facebook_url: facebook_url || null,
      instagram_url: instagram_url || null,
      tiktok_url: tiktok_url || null,
    })
  }

  await logAudit({
    entity_type: 'lead',
    entity_id: lead.id,
    action: 'created',
    new_data: lead,
  })

  revalidatePath('/leads')
  revalidatePath('/admin/leads')
  revalidatePath('/dashboard')
  revalidatePath('/admin/dashboard')
  return { data: lead }
}

// ============================================================
// CREATE LEAD (Full Form)
// ============================================================

export async function createLeadFull(input: FullLeadInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = fullLeadSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  const {
    facebook_url,
    instagram_url,
    tiktok_url,
    linkedin_url,
    youtube_url,
    ...leadData
  } = parsed.data

  const { data: lead, error } = await adminSupabase
    .from('leads')
    .insert({
      ...leadData,
      owner_id: profile.id,
      created_by: profile.id,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  if (facebook_url || instagram_url || tiktok_url || linkedin_url || youtube_url) {
    await adminSupabase.from('lead_social_links').insert({
      lead_id: lead.id,
      facebook_url: facebook_url || null,
      instagram_url: instagram_url || null,
      tiktok_url: tiktok_url || null,
      linkedin_url: linkedin_url || null,
      youtube_url: youtube_url || null,
    })
  }

  await logAudit({
    entity_type: 'lead',
    entity_id: lead.id,
    action: 'created',
    new_data: lead,
  })

  revalidatePath('/leads')
  revalidatePath('/admin/leads')
  revalidatePath('/dashboard')
  revalidatePath('/admin/dashboard')
  return { data: lead }
}

// ============================================================
// UPDATE LEAD
// ============================================================

export async function updateLead(leadId: string, input: Partial<FullLeadInput>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  const { data: existing } = await adminSupabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (!existing) return { error: 'Lead not found' }

  const isAdmin = ['admin', 'super_admin'].includes(profile.role)
  const isOwnerOrCreator = existing.created_by === profile.id || existing.owner_id === profile.id

  if (!isAdmin && !isOwnerOrCreator) {
    return { error: 'Permission denied: You can only edit your own leads.' }
  }

  const { facebook_url, instagram_url, tiktok_url, linkedin_url, youtube_url, ...leadData } = input

  const { data: lead, error } = await adminSupabase
    .from('leads')
    .update({ ...leadData, updated_at: new Date().toISOString() })
    .eq('id', leadId)
    .select()
    .single()

  if (error) return { error: error.message }

  // Update social links
  if (facebook_url !== undefined || instagram_url !== undefined || tiktok_url !== undefined || linkedin_url !== undefined || youtube_url !== undefined) {
    await adminSupabase
      .from('lead_social_links')
      .upsert({
        lead_id: leadId,
        facebook_url: facebook_url || null,
        instagram_url: instagram_url || null,
        tiktok_url: tiktok_url || null,
        linkedin_url: linkedin_url || null,
        youtube_url: youtube_url || null,
      }, { onConflict: 'lead_id' })
  }

  await logAudit({
    entity_type: 'lead',
    entity_id: leadId,
    action: 'updated',
    old_data: existing,
    new_data: lead,
  })

  revalidatePath(`/leads/${leadId}`)
  revalidatePath('/leads')
  revalidatePath('/admin/leads')
  return { data: lead }
}

// ============================================================
// UPDATE PIPELINE STAGE
// ============================================================

export async function updateLeadStage(leadId: string, stage: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  const { data: existing } = await adminSupabase
    .from('leads')
    .select('pipeline_stage, created_by, owner_id')
    .eq('id', leadId)
    .single()

  if (!existing) return { error: 'Lead not found' }

  const isAdmin = ['admin', 'super_admin'].includes(profile.role)
  const isOwnerOrCreator = existing.created_by === profile.id || existing.owner_id === profile.id

  if (!isAdmin && !isOwnerOrCreator) {
    return { error: 'Permission denied: You can only update stage on your own leads.' }
  }

  const { data, error } = await adminSupabase
    .from('leads')
    .update({ pipeline_stage: stage, updated_at: new Date().toISOString() })
    .eq('id', leadId)
    .select()
    .single()

  if (error) return { error: error.message }

  await logAudit({
    entity_type: 'lead',
    entity_id: leadId,
    action: 'stage_changed',
    old_data: { pipeline_stage: existing?.pipeline_stage },
    new_data: { pipeline_stage: stage },
  })

  revalidatePath(`/leads/${leadId}`)
  revalidatePath('/leads')
  revalidatePath('/admin/leads')
  return { data }
}

// ============================================================
// REASSIGN LEAD (Admin only)
// ============================================================

export async function reassignLead(leadId: string, newOwnerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) return { error: 'Admin only' }

  const { data: existing } = await adminSupabase
    .from('leads')
    .select('owner_id')
    .eq('id', leadId)
    .single()

  const { data, error } = await adminSupabase
    .from('leads')
    .update({ owner_id: newOwnerId, updated_at: new Date().toISOString() })
    .eq('id', leadId)
    .select()
    .single()

  if (error) return { error: error.message }

  await logAudit({
    entity_type: 'lead',
    entity_id: leadId,
    action: 'reassigned',
    old_data: { owner_id: existing?.owner_id },
    new_data: { owner_id: newOwnerId },
  })

  revalidatePath(`/leads/${leadId}`)
  revalidatePath('/admin/leads')
  revalidatePath('/leads')
  return { data }
}

// ============================================================
// SOFT DELETE LEAD (Admin/SuperAdmin any lead, Employee own leads)
// ============================================================

export async function deleteLead(leadId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  // Fetch the lead to check ownership
  const { data: lead } = await adminSupabase
    .from('leads')
    .select('id, owner_id, created_by, business_name')
    .eq('id', leadId)
    .single()

  if (!lead) return { error: 'Lead not found' }

  const isAdmin = ['admin', 'super_admin'].includes(profile.role)
  const isOwnerOrCreator = lead.created_by === profile.id || lead.owner_id === profile.id

  if (!isAdmin && !isOwnerOrCreator) {
    return { error: 'Permission denied: You can only delete leads that you created or are assigned to you.' }
  }

  const { error } = await adminSupabase
    .from('leads')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', leadId)

  if (error) return { error: error.message }

  await logAudit({
    entity_type: 'lead',
    entity_id: leadId,
    action: 'deleted',
    old_data: lead,
    new_data: { deleted_at: new Date().toISOString(), deleted_by: profile.id },
  })

  revalidatePath('/leads')
  revalidatePath('/admin/leads')
  revalidatePath('/dashboard')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

// ============================================================
// CHECK DUPLICATE
// ============================================================

export async function checkDuplicate(params: {
  business_name?: string
  phone?: string
  email?: string
  website?: string
  google_place_id?: string
}) {
  const adminSupabase = createAdminClient()

  if (params.google_place_id) {
    const { data } = await adminSupabase
      .from('leads')
      .select('id, business_name, city, owner_id, pipeline_stage, owner:profiles!leads_owner_id_fkey(full_name)')
      .eq('google_place_id', params.google_place_id)
      .is('deleted_at', null)
      .limit(3)
    if (data && data.length > 0) return { duplicates: data }
  }

  if (params.phone) {
    const { data } = await adminSupabase
      .from('leads')
      .select('id, business_name, city, owner_id, pipeline_stage, owner:profiles!leads_owner_id_fkey(full_name)')
      .eq('phone', params.phone)
      .is('deleted_at', null)
      .limit(3)
    if (data && data.length > 0) return { duplicates: data }
  }

  if (params.email) {
    const { data } = await adminSupabase
      .from('leads')
      .select('id, business_name, city, owner_id, pipeline_stage, owner:profiles!leads_owner_id_fkey(full_name)')
      .eq('email', params.email)
      .is('deleted_at', null)
      .limit(3)
    if (data && data.length > 0) return { duplicates: data }
  }

  // Fuzzy name check
  if (params.business_name && params.business_name.length >= 3) {
    const { data } = await adminSupabase
      .from('leads')
      .select('id, business_name, city, owner_id, pipeline_stage, owner:profiles!leads_owner_id_fkey(full_name)')
      .ilike('business_name', `%${params.business_name}%`)
      .is('deleted_at', null)
      .limit(5)
    if (data && data.length > 0) return { duplicates: data }
  }

  return { duplicates: [] }
}
