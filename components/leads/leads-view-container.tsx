'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Lead } from '@/lib/types/database'
import LeadsKanban from './leads-kanban'
import DeleteLeadModal from './delete-lead-modal'
import ExcelLeadImporter from './excel-lead-importer'
import StatusBadge from '@/components/ui/status-badge'
import { timeAgo } from '@/lib/utils'
import {
  LayoutGrid,
  Table as TableIcon,
  Download,
  Upload,
  Building2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Filter,
  Phone,
  MessageCircle,
  FileSpreadsheet,
  Sparkles,
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
  const [isImporterOpen, setIsImporterOpen] = useState(false)

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
      {/* Smart File Importer Modal */}
      <ExcelLeadImporter
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onSuccess={() => window.location.reload()}
      />

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

        {/* View Switcher, Import & Export */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
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

          {/* Import from Excel / CSV */}
          <button
            onClick={() => setIsImporterOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/25 active:scale-95"
            title="Import Excel, CSV or JSON data automatically with Groq AI"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import File</span>
            <span className="hidden sm:inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded-md bg-white/20 uppercase font-black tracking-wider">
              AI
            </span>
          </button>

          {/* Export to Excel */}
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'kanban' ? (
        <LeadsKanban initialLeads={initialLeads} isAdmin={isAdmin} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* MOBILE PHONE CARD VIEW (< 640px) */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {initialLeads.map((lead) => {
              const phoneClean = lead.phone?.replace(/[^0-9+]/g, '')
              const waClean = (lead.whatsapp || lead.phone)?.replace(/[^0-9]/g, '')

              return (
                <div key={lead.id} className="p-4 space-y-3 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`${basePath}/${lead.id}`}
                        className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {lead.business_name}
                      </Link>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <span>{lead.city || 'Pakistan'}</span>
                        <span>&bull;</span>
                        <span className="text-slate-400">{lead.category || 'General'}</span>
                      </div>
                    </div>
                    <StatusBadge type="pipeline" value={lead.pipeline_stage} />
                  </div>

                  {/* Deal Pricing & Financial Status */}
                  {(lead.deal_value || lead.offered_price || Number(lead.amount_received || 0) > 0) && (
                    <div className="flex flex-wrap items-center gap-2 p-2 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-[11px]">
                      {lead.deal_value ? (
                        <span className="font-bold text-emerald-950">
                          Deal: {lead.currency || 'PKR'} {Number(lead.deal_value).toLocaleString()}
                        </span>
                      ) : lead.offered_price ? (
                        <span className="font-medium text-amber-900">
                          Quote: {lead.currency || 'PKR'} {Number(lead.offered_price).toLocaleString()}
                        </span>
                      ) : null}

                      {Number(lead.amount_received || 0) > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px]">
                          ✓ Paid {lead.currency || 'PKR'} {Number(lead.amount_received).toLocaleString()}
                        </span>
                      )}

                      {lead.deal_value && Number(lead.deal_value) > Number(lead.amount_received || 0) && (
                        <span className="text-amber-800 font-semibold text-[10px] ml-auto">
                          Due: {lead.currency || 'PKR'} {(Number(lead.deal_value) - Number(lead.amount_received || 0)).toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Owner & Updated */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400">Owner: </span>
                      <span className="font-semibold text-slate-700">
                        {lead.contact_person || (lead.owner as any)?.full_name || 'Unassigned'}
                      </span>
                    </div>
                    <span className="text-slate-400">{timeAgo(lead.updated_at)}</span>
                  </div>

                  {/* Quick Action Touch Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    {phoneClean && (
                      <a
                        href={`tel:${phoneClean}`}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>Call</span>
                      </a>
                    )}
                    {waClean && (
                      <a
                        href={`https://wa.me/${waClean}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <Link
                      href={`${basePath}/${lead.id}`}
                      className="py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs text-center transition-colors"
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
                </div>
              )
            })}
            {initialLeads.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="font-medium">No leads found</p>
              </div>
            )}
          </div>

          {/* TABLE VIEW (>= 640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Business</th>
                  <th className="py-3.5 px-4">City / Category</th>
                  <th className="py-3.5 px-4">Deal Pricing &amp; Paid</th>
                  <th className="py-3.5 px-4">Owner / Contact</th>
                  <th className="py-3.5 px-4">Pipeline Stage</th>
                  <th className="py-3.5 px-4">Updated</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialLeads.map((lead) => {
                  const dealVal = Number(lead.deal_value || 0)
                  const offeredVal = Number(lead.offered_price || 0)
                  const receivedVal = Number(lead.amount_received || 0)
                  const balanceDue = Math.max(0, dealVal - receivedVal)
                  const cur = lead.currency || 'PKR'

                  return (
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
                        {dealVal > 0 ? (
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-900">
                              {cur} {dealVal.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px]">
                              {receivedVal > 0 ? (
                                <span className="text-emerald-700 font-semibold">
                                  ✓ Paid {cur} {receivedVal.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">No payment yet</span>
                              )}
                              {balanceDue > 0 && receivedVal > 0 && (
                                <span className="text-amber-700 font-medium">
                                  &bull; Due {cur} {balanceDue.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : offeredVal > 0 ? (
                          <div>
                            <div className="text-slate-700 font-medium">
                              {cur} {offeredVal.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-amber-600 font-medium">Offered Quote</div>
                          </div>
                        ) : (
                          <span className="text-slate-300 italic">—</span>
                        )}
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
                  )
                })}
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 text-xs">
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

