'use client'

import { useState } from 'react'
import { deleteLead } from '@/lib/actions/leads'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface DeleteLeadModalProps {
  leadId: string
  leadName: string
  redirectTo?: string
  onSuccess?: () => void
  trigger?: React.ReactNode
  variant?: 'button' | 'icon' | 'table-action'
}

export default function DeleteLeadModal({
  leadId,
  leadName,
  redirectTo,
  onSuccess,
  trigger,
  variant = 'button',
}: DeleteLeadModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    const res = await deleteLead(leadId)
    setIsDeleting(false)

    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(`Lead "${leadName}" deleted successfully`)
      setIsOpen(false)
      if (onSuccess) {
        onSuccess()
      }
      if (redirectTo) {
        router.push(redirectTo)
        router.refresh()
      }
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer inline-block">
          {trigger}
        </div>
      ) : variant === 'icon' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete Lead"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ) : variant === 'table-action' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          title="Delete Lead"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Lead
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Lead</h3>
                <p className="text-xs text-slate-500 mt-0.5">Move lead to archive</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900 font-bold">{leadName}</strong>?
              This lead will be removed from your active pipeline view.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm shadow-red-500/25 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
