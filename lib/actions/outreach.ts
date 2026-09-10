'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { OutreachInput } from '@/lib/validations'
import { outreachSchema } from '@/lib/validations'
import { logAudit } from './audit'

export async function createOutreach(input: OutreachInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = outreachSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  const { data, error } = await adminSupabase
    .from('outreach_activities')
    .insert({
      ...parsed.data,
      employee_id: profile.id,
      sent_at: parsed.data.sent_at || new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Update lead's pipeline_stage based on response_status
  const stageMap: Record<string, string> = {
    replied: 'replied',
    interested: 'interested',
    meeting_scheduled: 'qualified',
    converted: 'won',
  }

  const newStage = stageMap[parsed.data.response_status]
  if (newStage) {
    await adminSupabase
      .from('leads')
      .update({ pipeline_stage: newStage, updated_at: new Date().toISOString() })
      .eq('id', parsed.data.lead_id)
  } else if (['sent', 'delivered'].includes(parsed.data.message_status) && parsed.data.response_status === 'no_response') {
    await adminSupabase
      .from('leads')
      .update({ pipeline_stage: 'contacted', updated_at: new Date().toISOString() })
      .eq('id', parsed.data.lead_id)
  } else if (parsed.data.message_status === 'seen') {
    await adminSupabase
      .from('leads')
      .update({ pipeline_stage: 'seen', updated_at: new Date().toISOString() })
      .eq('id', parsed.data.lead_id)
  }

  await logAudit({
    entity_type: 'outreach_activity',
    entity_id: data.id,
    action: 'created',
    new_data: data,
  })

  revalidatePath(`/leads/${parsed.data.lead_id}`)
  revalidatePath('/dashboard')
  revalidatePath('/admin/dashboard')
  return { data }
}

export async function updateOutreach(activityId: string, input: Partial<OutreachInput>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('outreach_activities')
    .update(input)
    .eq('id', activityId)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/leads/${data.lead_id}`)
  return { data }
}
