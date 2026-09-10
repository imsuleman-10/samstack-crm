import { getInitials, formatDateTime } from '@/lib/utils'

interface NoteAuthor {
  full_name: string
  profile_photo_url?: string | null
}

interface NoteItem {
  id: string
  content: string
  created_at: string
  author?: NoteAuthor | null
}

export default function LeadNotes({ notes }: { notes: NoteItem[] }) {
  if (notes.length === 0) {
    return <p className="text-sm text-slate-400 py-2">No notes yet. Add one above.</p>
  }

  return (
    <div className="space-y-4">
      {notes.map(note => (
        <div key={note.id} className="flex gap-3">
          {note.author?.profile_photo_url ? (
            <img
              src={note.author.profile_photo_url}
              alt={note.author.full_name}
              className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-slate-200"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-slate-500">
              {note.author ? getInitials(note.author.full_name) : '?'}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-slate-700">{note.author?.full_name || 'Unknown'}</span>
              <span className="text-xs text-slate-400">{formatDateTime(note.created_at)}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
