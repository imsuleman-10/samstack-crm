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

// ============================================================
// BATCH IMPORT LEADS (From Excel / CSV / JSON Ingestion)
// ============================================================

export interface BatchLeadItem {
  business_name: string
  contact_person?: string
  phone?: string
  whatsapp?: string
  email?: string
  city?: string
  area?: string
  full_address?: string
  category?: string
  website?: string
  pipeline_stage?: string
  lead_source?: string
  google_rating?: number | string
  description?: string
  facebook_url?: string
  instagram_url?: string
  tiktok_url?: string
  linkedin_url?: string
  offered_price?: number | string
  deal_value?: number | string
  amount_received?: number | string
  currency?: string
}

export async function batchImportLeads(leadsList: BatchLeadItem[]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized: User must be logged in to import leads' }

  if (!Array.isArray(leadsList) || leadsList.length === 0) {
    return { error: 'No lead rows provided for import' }
  }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return { error: 'User profile not found' }

  const validStages = [
    'new',
    'contacted',
    'seen',
    'replied',
    'interested',
    'qualified',
    'proposal_sent',
    'negotiation',
    'won',
    'project_started',
    'project_completed',
    'not_interested',
    'not_qualified',
    'lost',
  ]

  const validSources = [
    'google_maps',
    'facebook',
    'instagram',
    'tiktok',
    'website',
    'referral',
    'manual_entry',
    'other',
  ]

  const preparedLeads = []

  for (const item of leadsList) {
    const rawName = (item.business_name || '').trim()
    if (!rawName) continue // Skip entries without business name

    const rawStage = (item.pipeline_stage || 'new').toLowerCase().trim()
    const pipeline_stage = validStages.includes(rawStage) ? rawStage : 'new'

    const rawSource = (item.lead_source || 'manual_entry').toLowerCase().trim().replace(/\s+/g, '_')
    const lead_source = validSources.includes(rawSource) ? rawSource : 'manual_entry'

    const numRating = item.google_rating ? parseFloat(String(item.google_rating)) : null
    const google_rating = !isNaN(numRating as number) ? numRating : null

    const numOffered = item.offered_price ? parseFloat(String(item.offered_price).replace(/[^0-9.]/g, '')) : null
    const offered_price = !isNaN(numOffered as number) ? numOffered : null

    const numDeal = item.deal_value ? parseFloat(String(item.deal_value).replace(/[^0-9.]/g, '')) : null
    const deal_value = !isNaN(numDeal as number) ? numDeal : null

    const numReceived = item.amount_received ? parseFloat(String(item.amount_received).replace(/[^0-9.]/g, '')) : 0
    const amount_received = !isNaN(numReceived as number) ? numReceived : 0

    const currency = (item.currency?.trim() || 'PKR').toUpperCase()

    preparedLeads.push({
      business_name: rawName,
      contact_person: item.contact_person?.trim() || null,
      phone: item.phone?.trim() || null,
      whatsapp: item.whatsapp?.trim() || null,
      email: item.email?.trim() || null,
      city: item.city?.trim() || null,
      area: item.area?.trim() || null,
      full_address: item.full_address?.trim() || null,
      category: item.category?.trim() || null,
      website: item.website?.trim() || null,
      offered_price,
      deal_value,
      amount_received,
      currency,
      pipeline_stage,
      lead_source,
      google_rating,
      description: item.description?.trim() || null,
      owner_id: profile.id,
      created_by: profile.id,
      has_website: Boolean(item.website),
      has_social_media: Boolean(
        item.facebook_url || item.instagram_url || item.tiktok_url || item.linkedin_url
      ),
      has_online_presence: Boolean(item.website || item.facebook_url || item.instagram_url),
    })
  }

  if (preparedLeads.length === 0) {
    return { error: 'No valid leads found in upload. Every lead must have at least a Business/Company Name.' }
  }

  // Insert in chunks of 50 to avoid payload limits
  const chunkSize = 50
  let totalInserted = 0
  const insertedLeads = []

  for (let i = 0; i < preparedLeads.length; i += chunkSize) {
    const chunk = preparedLeads.slice(i, i + chunkSize)
    const { data, error } = await adminSupabase
      .from('leads')
      .insert(chunk)
      .select('id, business_name')

    if (error) {
      console.error('Batch insert error chunk:', error)
      return { error: `Database error during batch insert: ${error.message}` }
    }

    if (data) {
      totalInserted += data.length
      insertedLeads.push(...data)
    }
  }

  await logAudit({
    entity_type: 'lead',
    entity_id: insertedLeads[0]?.id || profile.id,
    action: 'created',
    new_data: { batch_import_count: totalInserted, by: profile.id },
  })

  revalidatePath('/leads')
  revalidatePath('/admin/leads')
  revalidatePath('/dashboard')
  revalidatePath('/admin/dashboard')

  return { success: true, count: totalInserted }
}

// ============================================================
// UPDATE LEAD
// ============================================================

export interface UpdateLeadInput {
  business_name?: string
  contact_person?: string
  phone?: string
  whatsapp?: string
  email?: string
  city?: string
  area?: string
  full_address?: string
  category?: string
  website?: string
  description?: string
  pipeline_stage?: string
  lead_source?: string
  google_rating?: number | null
  offered_price?: number | null
  deal_value?: number | null
  amount_received?: number | null
  currency?: string
  facebook_url?: string
  instagram_url?: string
  tiktok_url?: string
  linkedin_url?: string
}

export async function updateLead(leadId: string, input: UpdateLeadInput) {
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

  const { data: existingLead, error: fetchErr } = await adminSupabase
    .from('leads')
    .select('*, social_links:lead_social_links(*)')
    .eq('id', leadId)
    .single()

  if (fetchErr || !existingLead) return { error: 'Lead not found' }

  const { facebook_url, instagram_url, tiktok_url, linkedin_url, ...leadFields } = input

  const updatePayload: Record<string, any> = {
    ...leadFields,
    updated_at: new Date().toISOString(),
  }

  if (leadFields.website !== undefined) {
    updatePayload.has_website = Boolean(leadFields.website)
  }

  const { data: updatedLead, error: updateErr } = await adminSupabase
    .from('leads')
    .update(updatePayload)
    .eq('id', leadId)
    .select()
    .single()

  if (updateErr) return { error: updateErr.message }

  // Update or insert social links
  if (
    facebook_url !== undefined ||
    instagram_url !== undefined ||
    tiktok_url !== undefined ||
    linkedin_url !== undefined
  ) {
    const existingSocial = Array.isArray(existingLead.social_links)
      ? existingLead.social_links[0]
      : existingLead.social_links

    if (existingSocial?.id) {
      await adminSupabase
        .from('lead_social_links')
        .update({
          facebook_url: facebook_url !== undefined ? facebook_url : existingSocial.facebook_url,
          instagram_url: instagram_url !== undefined ? instagram_url : existingSocial.instagram_url,
          tiktok_url: tiktok_url !== undefined ? tiktok_url : existingSocial.tiktok_url,
          linkedin_url: linkedin_url !== undefined ? linkedin_url : existingSocial.linkedin_url,
        })
        .eq('id', existingSocial.id)
    } else if (facebook_url || instagram_url || tiktok_url || linkedin_url) {
      await adminSupabase
        .from('lead_social_links')
        .insert({
          lead_id: leadId,
          facebook_url: facebook_url || null,
          instagram_url: instagram_url || null,
          tiktok_url: tiktok_url || null,
          linkedin_url: linkedin_url || null,
        })
    }
  }

  await logAudit({
    entity_type: 'lead',
    entity_id: leadId,
    action: 'updated',
    old_data: existingLead,
    new_data: updatedLead,
  })

  revalidatePath('/leads')
  revalidatePath(`/leads/${leadId}`)
  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${leadId}`)
  revalidatePath('/projects')
  revalidatePath('/admin/projects')
  revalidatePath('/dashboard')
  revalidatePath('/admin/dashboard')

  return { data: updatedLead }
}

