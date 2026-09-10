'use client'

import { useState, useTransition } from 'react'
import { createOutreach } from '@/lib/actions/outreach'
import { CHANNEL_OPTIONS, MESSAGE_STATUS_OPTIONS, RESPONSE_STATUS_OPTIONS } from '@/lib/constants'
import { MessageSquare, Loader2, X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { OutreachChannel, MessageStatus, ResponseStatus } from '@/lib/types/database'

export default function AddOutreachModal({
  leadId,
  leadName,
}: {
  leadId: string
  leadName: string
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [channel, setChannel] = useState<OutreachChannel>('facebook')
  const [messageStatus, setMessageStatus] = useState<MessageStatus>('sent')
  const [responseStatus, setResponseStatus] = useState<ResponseStatus>('no_response')
  const [messageSummary, setMessageSummary] = useState('')
  const [notes, setNotes] = useState('')
  const [sentAt, setSentAt] = useState(new Date().toISOString().slice(0, 16))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await createOutreach({
        lead_id: leadId,
        channel,
        message_status: messageStatus,
        response_status: responseStatus,
        message_summary: messageSummary || undefined,
        notes: notes || undefined,
        sent_at: new Date(sentAt).toISOString(),
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success('Outreach recorded!')
      setOpen(false)
      setMessageSummary('')
      setNotes('')
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Outreach
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <h2 className="font-semibold text-slate-800">Record Outreach</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <p className="text-sm text-slate-500">
                Recording outreach for: <span className="font-medium text-slate-800">{leadName}</span>
              </p>

              {/* Channel */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Channel</label>
                <select
                  value={channel}
                  onChange={e => setChannel(e.target.value as OutreachChannel)}
                  className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CHANNEL_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={sentAt}
                  onChange={e => setSentAt(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message Status</label>
                <select
                  value={messageStatus}
                  onChange={e => setMessageStatus(e.target.value as MessageStatus)}
                  className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {MESSAGE_STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Response Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Response Status</label>
                <select
                  value={responseStatus}
                  onChange={e => setResponseStatus(e.target.value as ResponseStatus)}
                  className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {RESPONSE_STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Message Summary */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message Summary</label>
                <textarea
                  rows={2}
                  value={messageSummary}
                  onChange={e => setMessageSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Brief summary of what was sent..."
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 h-10 rounded-lg border border-border text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Outreach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
