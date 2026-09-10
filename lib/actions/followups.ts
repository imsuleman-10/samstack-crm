'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { FollowUpInput } from '@/lib/validations'
import { followUpSchema } from '@/lib/validations'
import { logAudit } from './audit'

export async function createFollowUp(input: FollowUpInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = followUpSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('id').eq('auth_user_id', user.id).single()
  if (!profile) return { error: 'Profile not found' }

  const { data, error } = await adminSupabase
    .from('follow_ups')
    .insert({ ...parsed.data, created_by: profile.id })
    .select()
    .single()

  if (error) return { error: error.message }

  await logAudit({ entity_type: 'follow_up', entity_id: data.id, action: 'created', new_data: data })
  revalidatePath(`/leads/${parsed.data.lead_id}`)
  revalidatePath('/follow-ups')
  return { data }
}

export async function completeFollowUp(followUpId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('follow_ups')
    .update({ status: 'completed', completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', followUpId)
    .select()
    .single()

  if (error) return { error: error.message }

  await logAudit({ entity_type: 'follow_up', entity_id: followUpId, action: 'completed', new_data: data })
  revalidatePath('/follow-ups')
  revalidatePath(`/leads/${data.lead_id}`)
  return { data }
}

export async function skipFollowUp(followUpId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('follow_ups')
    .update({ status: 'skipped', updated_at: new Date().toISOString() })
    .eq('id', followUpId)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/follow-ups')
  return { data }
}

export async function cancelFollowUp(followUpId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('follow_ups')
    .update({ status: 'cancelled', deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', followUpId)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/follow-ups')
  return { data }
}

export async function updateFollowUpStatus(followUpId: string, status: string) {
  if (status === 'completed') return completeFollowUp(followUpId)
  if (status === 'skipped') return skipFollowUp(followUpId)
  return cancelFollowUp(followUpId)
}
