'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { NoteInput } from '@/lib/validations'
import { noteSchema } from '@/lib/validations'

export async function addNote(input: NoteInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = noteSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('id').eq('auth_user_id', user.id).single()
  if (!profile) return { error: 'Profile not found' }

  const { data, error } = await adminSupabase
    .from('notes')
    .insert({ ...parsed.data, employee_id: profile.id })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/leads/${parsed.data.lead_id}`)
  return { data }
}
