'use client'

import { useState } from 'react'
import { deleteEmployee, deleteEmployeeWithLeads } from '@/lib/actions/employees'
import { Trash2, AlertTriangle, Loader2, UserX, Users, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface DeleteEmployeeModalProps {
  employeeId: string
  employeeName: string
  leadCount?: number
  redirectTo?: string
  onSuccess?: () => void
  trigger?: React.ReactNode
}

type DeleteMode = 'reassign' | 'delete_leads'

export default function DeleteEmployeeModal({
  employeeId,
  employeeName,
  leadCount = 0,
  redirectTo,
  onSuccess,
  trigger,
}: DeleteEmployeeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mode, setMode] = useState<DeleteMode>('reassign')
  const [confirmText, setConfirmText] = useState('')
  const router = useRouter()

  const confirmRequired = mode === 'delete_leads' && leadCount > 0
  const canConfirm = !confirmRequired || confirmText.trim().toLowerCase() === 'delete'

  const handleDelete = async () => {
    if (!canConfirm) return
    setIsDeleting(true)

    const res =
      mode === 'delete_leads'
        ? await deleteEmployeeWithLeads(employeeId)
        : await deleteEmployee(employeeId)

    setIsDeleting(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      const label =
        mode === 'delete_leads'
          ? `${employeeName} and all their data have been permanently deleted.`
          : `${employeeName} has been removed. Their leads were reassigned.`
      toast.success(label)
      setIsOpen(false)
      setConfirmText('')
      if (onSuccess) onSuccess()
      if (redirectTo) {
        router.push(redirectTo)
        router.refresh()
      }
    }
  }

  const handleClose = () => {
    if (isDeleting) return
    setIsOpen(false)
    setConfirmText('')
    setMode('reassign')
  }

  return (
    <>
      {/* Trigger */}
      {trigger ? (
        <div onClick={() => setIsOpen(true)} className="inline-block cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
          title="Delete Employee"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Employee</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Removing <span className="font-semibold text-slate-700">{employeeName}</span>
                  {leadCount > 0 && (
                    <span className="ml-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
                      <Users className="w-2.5 h-2.5" />
                      {leadCount} lead{leadCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-slate-700">What should happen to their leads?</p>

              {/* Option A — Reassign */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  mode === 'reassign'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="delete-mode"
                  value="reassign"
                  checked={mode === 'reassign'}
                  onChange={() => { setMode('reassign'); setConfirmText('') }}
                  className="mt-0.5 accent-blue-600"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Reassign leads to me</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    All leads, follow-ups, notes, and outreach history will be safely transferred to
                    your account. <span className="text-emerald-600 font-semibold">Recommended.</span>
                  </p>
                </div>
              </label>

              {/* Option B — Delete everything */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  mode === 'delete_leads'
                    ? 'border-red-500 bg-red-50'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="delete-mode"
                  value="delete_leads"
                  checked={mode === 'delete_leads'}
                  onChange={() => setMode('delete_leads')}
                  className="mt-0.5 accent-red-600"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    Delete employee <span className="text-red-500">&amp;</span> all their leads
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">PERMANENT</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Permanently removes the employee account, all their leads, follow-ups, notes, and
                    outreach records. <span className="text-red-600 font-semibold">This cannot be undone.</span>
                  </p>
                </div>
              </label>
            </div>

            {/* Confirm phrase for destructive mode */}
            {confirmRequired && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-[11px] text-red-700">
                    This will permanently delete{' '}
                    <strong>{leadCount} lead{leadCount !== 1 ? 's' : ''}</strong> and all associated
                    data. Type <strong className="font-mono">delete</strong> to confirm.
                  </p>
                </div>
                <input
                  type="text"
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  placeholder='Type "delete" to confirm'
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-red-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20 transition-all font-mono"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || !canConfirm}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                  mode === 'delete_leads'
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/25'
                    : 'bg-slate-800 hover:bg-slate-700 shadow-slate-500/20'
                }`}
              >
                {isDeleting ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" />Deleting…</>
                ) : mode === 'delete_leads' ? (
                  <><Trash2 className="w-3.5 h-3.5" />Delete Everything</>
                ) : (
                  <><UserX className="w-3.5 h-3.5" />Delete &amp; Reassign Leads</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
