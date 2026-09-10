import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { Lead } from '@/lib/types/database'

export async function getLeads(params?: {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  city?: string
  category?: string
  ownerId?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { leads: [], count: 0 }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  const isAdmin = profile && ['admin', 'super_admin'].includes(profile.role)

  let query = adminSupabase
    .from('leads')
    .select('id, business_name, category, city, phone, lead_source, pipeline_stage, owner_id, created_by, updated_at, owner:profiles!leads_owner_id_fkey(full_name, profile_photo_url), outreach:outreach_activities(count)', { count: 'exact' })
    .is('deleted_at', null)

  // Non-admins can only see leads they own or created
  if (!isAdmin && profile) {
    query = query.or(`owner_id.eq.${profile.id},created_by.eq.${profile.id}`)
  }

  if (params?.search) {
    query = query.ilike('business_name', `%${params.search}%`)
  }
  if (params?.status) {
    query = query.eq('pipeline_stage', params.status)
  }
  if (params?.city) {
    query = query.eq('city', params.city)
  }
  if (params?.category) {
    query = query.eq('category', params.category)
  }
  if (params?.ownerId) {
    query = query.eq('owner_id', params.ownerId)
  }

  query = query.order('updated_at', { ascending: false })

  const page = params?.page || 1
  const pageSize = params?.pageSize || 20
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching leads:', error)
    return { leads: [], count: 0 }
  }

  return { leads: data, count: count || 0 }
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  const { data, error } = await adminSupabase
    .from('leads')
    .select(`
      *,
      owner:profiles!leads_owner_id_fkey(id, full_name, role, profile_photo_url),
      created_by:profiles!leads_created_by_fkey(id, full_name, profile_photo_url),
      social_links:lead_social_links(*)
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    return null
  }

  const isAdmin = profile && ['admin', 'super_admin'].includes(profile.role)
  const isOwnerOrCreator = profile && (data.owner_id === profile.id || data.created_by === profile.id)

  if (!isAdmin && !isOwnerOrCreator) {
    return null
  }

  // Flatten social_links array into single object since it's 1-to-1 but supabase returns array
  if (data.social_links && Array.isArray(data.social_links)) {
    data.social_links = data.social_links[0] || null
  }

  return data as any
}

export async function getBusinessCategories() {
  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase.from('business_categories').select('*').order('name')
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  
  return data
}

export async function getCities() {
  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('leads')
    .select('city')
    .is('deleted_at', null)
    .not('city', 'is', null)
  
  if (error) {
    console.error('Error fetching cities:', error)
    return []
  }
  
  const cities = new Set(data.map(d => d.city).filter(Boolean))
  return Array.from(cities).sort()
}
