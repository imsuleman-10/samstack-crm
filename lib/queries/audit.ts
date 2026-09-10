import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function getAuditLogs(params?: {
  page?: number
  pageSize?: number
  entityType?: string
  userId?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { logs: [], count: 0 }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return { logs: [], count: 0 }
  }

  let query = adminSupabase
    .from('audit_logs')
    .select('*, user:profiles!audit_logs_user_id_fkey(full_name, profile_photo_url)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (params?.entityType) {
    query = query.eq('entity_type', params.entityType)
  }
  if (params?.userId) {
    query = query.eq('user_id', params.userId)
  }

  const page = params?.page || 1
  const pageSize = params?.pageSize || 50
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching audit logs:', error)
    return { logs: [], count: 0 }
  }

  return { logs: data, count: count || 0 }
}
