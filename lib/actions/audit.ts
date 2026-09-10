'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { AuditAction } from '@/lib/types/database'
import { headers } from 'next/headers'

interface AuditLogParams {
  entity_type: string
  entity_id?: string
  action: AuditAction
  old_data?: any
  new_data?: any
}

export async function logAudit({ entity_type, entity_id, action, old_data, new_data }: AuditLogParams) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const adminSupabase = createAdminClient()
    // Get the user's profile ID
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (!profile) return

    const ip_address = (await headers()).get('x-forwarded-for') || 'unknown'

    await adminSupabase.from('audit_logs').insert({
      user_id: profile.id,
      entity_type,
      entity_id,
      action,
      old_data: old_data || null,
      new_data: new_data || null,
      ip_address,
    })
  } catch (error) {
    console.error('Failed to log audit:', error)
    // We intentionally don't throw here to avoid breaking the main operation if audit fails
  }
}
