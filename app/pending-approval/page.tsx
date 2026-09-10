import type { Metadata } from 'next'
import { logout } from '@/lib/actions/auth'
import { Clock, Mail, LogOut } from 'lucide-react'

export const metadata: Metadata = { title: 'Account Pending Approval' }

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-5">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 mb-2">Account Pending Approval</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Your account has been created successfully but is waiting for administrator approval.
            You will be notified once your account is activated and you can start using SAMStack CRM.
          </p>

          {/* Info box */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">1</div>
              <p className="text-sm text-slate-600">Your registration has been received.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">2</div>
              <p className="text-sm text-slate-600">An administrator will review and approve your account.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">3</div>
              <p className="text-sm text-slate-600">Once approved, you can log in and access the CRM.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center text-xs text-slate-400 mb-6">
            <Mail className="w-3.5 h-3.5" />
            <span>Contact your administrator if this takes too long.</span>
          </div>

          {/* Sign out */}
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
