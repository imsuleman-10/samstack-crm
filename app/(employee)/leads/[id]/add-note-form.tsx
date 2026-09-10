'use client'

import { useState, useTransition } from 'react'
import { addNote } from '@/lib/actions/notes'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AddNoteForm({ leadId }: { leadId: string }) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    startTransition(async () => {
      const result = await addNote({ lead_id: leadId, content: content.trim() })
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success('Note added')
      setContent('')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        rows={3}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Add a note..."
        className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          Add Note
        </button>
      </div>
    </form>
  )
}
