'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Lead } from '@/lib/types/database'
import LeadsKanban from './leads-kanban'
import DeleteLeadModal from './delete-lead-modal'
import StatusBadge from '@/components/ui/status-badge'
import { timeAgo } from '@/lib/utils'
import {
  LayoutGrid,
  Table as TableIcon,
  Download,
  Building2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Filter,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'

interface LeadsViewContainerProps {
  initialLeads: Lead[]
  totalCount: number
  currentPage: number
  totalPages: number
  searchQuery?: string
  statusQuery?: string
  isAdmin?: boolean
  currentProfileId?: string
}

export default function LeadsViewContainer({
  initialLeads,
  totalCount,
  currentPage,
  totalPages,
  searchQuery,
  statusQuery,
  isAdmin = false,
  currentProfileId,
}: LeadsViewContainerProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('table')
  const [search, setSearch] = useState(searchQuery || '')

  const basePath = isAdmin ? '/admin/leads' : '/leads'

  // Export leads to Excel / CSV
  const handleExportExcel = () => {
    if (!initialLeads || initialLeads.length === 0) {
      toast.error('No leads available to export')
      return
    }

    try {
      const exportData = initialLeads.map((lead) => ({
        'Business Name': lead.business_name,
        Category: lead.category || '',
        City: lead.city || '',
        Phone: lead.phone || '',
        WhatsApp: lead.whatsapp || '',
        Email: lead.email || '',
        Website: lead.website || '',
        'Pipeline Stage': lead.pipeline_stage,
        'Lead Source': lead.lead_source,
        'Google Rating': lead.google_rating || '',
        'Created Date': new Date(lead.created_at).toLocaleDateString(),
      }))

      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads Directory')
      XLSX.writeFile(workbook, `SAMStack_Leads_${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Leads exported successfully to Excel!')
    } catch (err) {
      console.error('Export failed:', err)
      toast.error('Failed to export leads')
    }
  }

  return (
    <div className="space-y-4">
      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search Bar */}
        <form
          action={basePath}
          method="GET"
          className="relative w-full sm:w-80 flex items-center"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads, cities, phone..."
            className="w-full h-9.5 pl-10 pr-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </form>

        {/* View Switcher & Export */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Toggle View Mode */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/70">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Kanban
            </button>
          </div>

          {/* Export to Excel */}
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export Excel</span>
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'kanban' ? (
        <LeadsKanban initialLeads={initialLeads} isAdmin={isAdmin} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Business</th>
                  <th className="py-3.5 px-4">City / Category</th>
                  <th className="py-3.5 px-4">Owner / Contact</th>
                  <th className="py-3.5 px-4">Pipeline Stage</th>
                  <th className="py-3.5 px-4">Updated</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4">
                      <Link
                        href={`${basePath}/${lead.id}`}
                        className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                      >
                        {lead.business_name}
                      </Link>
                      {lead.phone && (
                        <div className="text-[11px] text-slate-400 mt-0.5">{lead.phone}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{lead.city || '—'}</div>
                      <div className="text-[11px] text-slate-400">{lead.category || 'General'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {lead.contact_person || (lead.owner as any)?.full_name || '—'}
                      </div>
                      <div className="text-[11px] text-slate-400">{lead.lead_source || 'direct'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="pipeline" value={lead.pipeline_stage} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{timeAgo(lead.updated_at)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`${basePath}/${lead.id}`}
                          className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          View
                        </Link>
                        {(isAdmin ||
                          (currentProfileId &&
                            ((lead as any).owner_id === currentProfileId ||
                              (lead as any).created_by === currentProfileId))) && (
                          <DeleteLeadModal
                            leadId={lead.id}
                            leadName={lead.business_name}
                            variant="table-action"
                            onSuccess={() => window.location.reload()}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {initialLeads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="font-medium">No leads found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">
                Page {currentPage} of {totalPages} &bull; {totalCount} leads
              </span>
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <a
                    href={`${basePath}?page=${currentPage - 1}${searchQuery ? `&search=${searchQuery}` : ''}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </a>
                )}
                {currentPage < totalPages && (
                  <a
                    href={`${basePath}?page=${currentPage + 1}${searchQuery ? `&search=${searchQuery}` : ''}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
