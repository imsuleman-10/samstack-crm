'use client'

import { useState, useTransition } from 'react'
import { updateLeadStage } from '@/lib/actions/leads'
import { PIPELINE_STAGE_LABELS, PIPELINE_STAGES_ORDERED, PIPELINE_LOST_STAGES } from '@/lib/constants'
import type { PipelineStage } from '@/lib/types/database'
import StatusBadge from '@/components/ui/status-badge'
import { ChevronDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function StageSelector({
  currentStage,
  leadId,
}: {
  currentStage: PipelineStage
  leadId: string
}) {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState(currentStage)
  const [isPending, startTransition] = useTransition()

  function selectStage(s: PipelineStage) {
    if (s === stage) { setOpen(false); return }
    startTransition(async () => {
      const result = await updateLeadStage(leadId, s)
      if (result.error) {
        toast.error(result.error)
      } else {
        setStage(s)
        toast.success('Stage updated')
      }
      setOpen(false)
    })
  }

  const allStages = [...PIPELINE_STAGES_ORDERED, ...PIPELINE_LOST_STAGES]

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Pipeline Stage:</span>
        <button
          onClick={() => setOpen(!open)}
          disabled={isPending}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-slate-50 transition-colors text-sm"
        >
          <StatusBadge type="pipeline" value={stage} />
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
          ) : (
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          )}
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-8 mt-1 z-20 bg-white border border-border rounded-xl shadow-lg p-1 min-w-[200px]">
            <div className="space-y-0.5">
              <p className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Active</p>
              {PIPELINE_STAGES_ORDERED.map((s) => (
                <button
                  key={s}
                  onClick={() => selectStage(s)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    s === stage ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <StatusBadge type="pipeline" value={s} className="pointer-events-none" />
                </button>
              ))}
              <div className="border-t border-border my-1" />
              <p className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Closed</p>
              {PIPELINE_LOST_STAGES.map((s) => (
                <button
                  key={s}
                  onClick={() => selectStage(s)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    s === stage ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <StatusBadge type="pipeline" value={s} className="pointer-events-none" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
