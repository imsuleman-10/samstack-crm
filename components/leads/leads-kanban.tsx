'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Lead } from '@/lib/types/database'
import { updateLeadStage } from '@/lib/actions/leads'
import {
  Building2,
  Phone,
  MessageCircle,
  MapPin,
  Star,
  User,
  ArrowRight,
  MoreVertical,
} from 'lucide-react'
import { toast } from 'sonner'

interface LeadsKanbanProps {
  initialLeads: Lead[]
  isAdmin?: boolean
}

const COLUMNS = [
  { id: 'new', label: 'New Captured', color: 'border-slate-300 bg-slate-100 text-slate-700' },
  { id: 'contacted', label: 'Contacted', color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { id: 'interested', label: 'Interested', color: 'border-amber-300 bg-amber-50 text-amber-700' },
  { id: 'qualified', label: 'Qualified', color: 'border-orange-300 bg-orange-50 text-orange-700' },
  { id: 'won', label: 'Deals Won', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  { id: 'lost', label: 'Lost / Closed', color: 'border-rose-300 bg-rose-50 text-rose-700' },
]

export default function LeadsKanban({ initialLeads, isAdmin = false }: LeadsKanbanProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleMoveStage = async (leadId: string, newStage: string) => {
    setUpdatingId(leadId)
    const res = await updateLeadStage(leadId, newStage)
    setUpdatingId(null)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(`Stage moved to ${newStage.replace('_', ' ')}`)
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, pipeline_stage: newStage as any } : l))
      )
    }
  }

  const basePath = isAdmin ? '/admin/leads' : '/leads'

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
      {COLUMNS.map((col) => {
        const columnLeads = leads.filter((l) => {
          if (col.id === 'lost') {
            return ['not_interested', 'not_qualified', 'lost'].includes(l.pipeline_stage)
          }
          return l.pipeline_stage === col.id
        })

        return (
          <div
            key={col.id}
            className="w-80 flex-shrink-0 bg-slate-100/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col max-h-[750px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs font-semibold text-slate-500">{columnLeads.length}</span>
              </div>
            </div>

            {/* Cards List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {columnLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3 hover-elevate"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`${basePath}/${lead.id}`}
                      className="font-bold text-slate-900 hover:text-blue-600 text-xs leading-snug transition-colors line-clamp-2"
                    >
                      {lead.business_name}
                    </Link>

                    {lead.google_rating && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex-shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {lead.google_rating}
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1 text-[11px] text-slate-500">
                    {lead.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{lead.city}</span>
                        {lead.category && <span>&bull; {lead.category}</span>}
                      </div>
                    )}
                    {lead.contact_person && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{lead.contact_person}</span>
                      </div>
                    )}
                  </div>

                  {/* Direct Contact Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {lead.whatsapp && (
                      <a
                        href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Call Phone"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Quick Move Stage Select */}
                    <div className="ml-auto">
                      <select
                        value={lead.pipeline_stage}
                        disabled={updatingId === lead.id}
                        onChange={(e) => handleMoveStage(lead.id, e.target.value)}
                        className="text-[10px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="interested">Interested</option>
                        <option value="qualified">Qualified</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {columnLeads.length === 0 && (
                <div className="text-center py-8 text-[11px] text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  No leads in {col.label}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
