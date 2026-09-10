'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ProjectInput } from '@/lib/validations'
import { projectSchema } from '@/lib/validations'
import { logAudit } from './audit'

export async function createProject(input: ProjectInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = projectSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('id').eq('auth_user_id', user.id).single()
  if (!profile) return { error: 'Profile not found' }

  const { data, error } = await adminSupabase
    .from('projects')
    .insert({ ...parsed.data, employee_id: profile.id })
    .select()
    .single()

  if (error) return { error: error.message }

  // If lead_id provided, update lead stage to 'won'
  if (parsed.data.lead_id) {
    await adminSupabase.from('leads').update({ pipeline_stage: 'won', updated_at: new Date().toISOString() }).eq('id', parsed.data.lead_id)
  }

  await logAudit({ entity_type: 'project', entity_id: data.id, action: 'created', new_data: data })
  revalidatePath('/projects')
  revalidatePath('/dashboard')
  revalidatePath('/admin/dashboard')
  return { data }
}

export async function updateProject(projectId: string, input: Partial<ProjectInput>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()
  const { data: existing } = await adminSupabase.from('projects').select().eq('id', projectId).single()

  const updateData: Record<string, unknown> = { ...input, updated_at: new Date().toISOString() }
  if (input.status === 'completed') {
    updateData.completed_at = new Date().toISOString()
    // Update lead stage
    if (existing?.lead_id) {
      await adminSupabase.from('leads').update({ pipeline_stage: 'project_completed', updated_at: new Date().toISOString() }).eq('id', existing.lead_id)
    }
  }

  const { data, error } = await adminSupabase.from('projects').update(updateData).eq('id', projectId).select().single()
  if (error) return { error: error.message }

  await logAudit({ entity_type: 'project', entity_id: projectId, action: 'updated', old_data: existing, new_data: data })
  revalidatePath('/projects')
  revalidatePath('/dashboard')
  revalidatePath('/admin/dashboard')
  return { data }
}
