import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getLeads } from '@/lib/queries/leads'
import Link from 'next/link'
import LeadsViewContainer from '@/components/leads/leads-view-container'
import { Building2, Plus, Sparkles } from 'lucide-react'

export const metadata: Metadata = { title: 'My Leads' }
export const dynamic = 'force-dynamic'

interface SearchParams {
  search?: string
  status?: string
  city?: string
  category?: string
  page?: string
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) redirect('/login')

  const page = Number(sp.page) || 1
  const pageSize = 25

  const { leads, count } = await getLeads({
    search: sp.search,
    status: sp.status,
    city: sp.city,
    category: sp.category,
    ownerId: !['admin', 'super_admin'].includes(profile.role) ? profile.id : undefined,
    page,
    pageSize,
  })

  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="space-y-6 animate-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" /> Pipeline Manager
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Sales Leads</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track potential clients, update outreach stages, and convert deals.
          </p>
        </div>
        <Link
          href="/leads/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all shadow-sm shadow-blue-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Lead
        </Link>
      </div>

      {/* Main Leads View (Table & Kanban Switcher) */}
      <LeadsViewContainer
        initialLeads={leads as any}
        totalCount={count}
        currentPage={page}
        totalPages={totalPages}
        searchQuery={sp.search}
        statusQuery={sp.status}
        isAdmin={false}
        currentProfileId={profile.id}
      />
    </div>
  )
}

