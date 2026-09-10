import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types/database'

export type EmployeeWithLeadCount = Profile & { lead_count: number }

export async function getEmployees(): Promise<EmployeeWithLeadCount[]> {
  const adminSupabase = createAdminClient()

  const [{ data: profiles, error }, { data: leadCounts }] = await Promise.all([
    adminSupabase.from('profiles').select('*').order('full_name'),
    adminSupabase.from('leads').select('owner_id').is('deleted_at', null),
  ])

  if (error) {
    console.error('Error fetching employees:', error)
    return []
  }

  // Build a quick O(n) map of owner_id → count
  const countMap: Record<string, number> = {}
  for (const lead of leadCounts ?? []) {
    if (lead.owner_id) countMap[lead.owner_id] = (countMap[lead.owner_id] ?? 0) + 1
  }

  return (profiles as Profile[]).map((p) => ({
    ...p,
    lead_count: countMap[p.id] ?? 0,
  }))
}

export async function getEmployeeById(id: string) {
  const adminSupabase = createAdminClient()

  const { data, error } = await adminSupabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching employee:', error)
    return null
  }

  return data as Profile
}

export async function getCurrentProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching current profile:', error)
    return null
  }

  return data as Profile
}

export async function getEmployeesWithPerformance(): Promise<(Profile & { wonDeals: number; revenue: number })[]> {
  const adminSupabase = createAdminClient()

  const [employees, { data: wonLeads }, { data: projects }] = await Promise.all([
    getEmployees(),
    adminSupabase
      .from('leads')
      .select('owner_id')
      .in('pipeline_stage', ['won', 'project_started', 'project_completed'])
      .is('deleted_at', null),
    adminSupabase
      .from('projects')
      .select('employee_id, project_value')
      .is('deleted_at', null),
  ])

  return employees.map((emp) => {
    const wonDeals = wonLeads?.filter((l) => l.owner_id === emp.id).length || 0
    const revenue = projects
      ?.filter((p) => p.employee_id === emp.id)
      .reduce((sum, p) => sum + (p.project_value || 0), 0) || 0

    return {
      ...emp,
      wonDeals,
      revenue,
    }
  })
}
