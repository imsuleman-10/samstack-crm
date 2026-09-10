import type { Metadata } from 'next'
import Link from 'next/link'
import { getLeads } from '@/lib/queries/leads'
import { getEmployees } from '@/lib/queries/employees'
import LeadsViewContainer from '@/components/leads/leads-view-container'
import { Building2, Plus, Users, UserPlus } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin - All Company Leads' }
export const dynamic = 'force-dynamic'

interface SearchParams {
  search?: string
  status?: string
  ownerId?: string
  page?: string
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const pageSize = 25

  const [employees, { leads, count }] = await Promise.all([
    getEmployees(),
    getLeads({
      search: sp.search,
      status: sp.status,
      ownerId: sp.ownerId,
      page,
      pageSize,
    }),
  ])

  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" /> Global Lead Directory
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Organization Leads Database</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {count} total leads across all {employees.length} sales reps & team members.
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

      {/* Main Leads View Switcher (Kanban & Table) */}
      <LeadsViewContainer
        initialLeads={leads as any}
        totalCount={count}
        currentPage={page}
        totalPages={totalPages}
        searchQuery={sp.search}
        statusQuery={sp.status}
        isAdmin={true}
      />
    </div>
  )
}

