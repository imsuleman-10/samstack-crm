import type { Metadata } from 'next'
import { Settings, Shield, Mail, Database, CheckCircle2, Globe, DollarSign } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin - Settings' }

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">CRM & System Configuration</h1>
          <p className="text-xs text-slate-500">
            Global environment, email service, targets, and currency defaults.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Currency & Financial Defaults */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Financial & Currency Defaults
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Default Currency</span>
              <span className="font-bold text-slate-900 text-sm">PKR (Pakistani Rupee)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Default Employee Targets</span>
              <span className="font-bold text-slate-900 text-sm">50 Msgs/Wk &bull; PKR 500,000/Mo</span>
            </div>
          </div>
        </div>

        {/* Email / SMTP Credentials info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            Email Notification & Auth SMTP
          </h2>
          <p className="text-xs text-slate-600">
            Gmail SMTP credentials have been configured in <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">.env.local</code>.
          </p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
            <div className="font-bold text-blue-900">Configured Environment Variables:</div>
            <ul className="list-disc list-inside text-blue-800 space-y-0.5 font-mono text-[11px]">
              <li>GMAIL_USER</li>
              <li>GMAIL_APP_PASSWORD (App Password Active)</li>
              <li>SMTP_HOST=smtp.gmail.com (Port 587)</li>
            </ul>
          </div>
        </div>

        {/* Supabase Connection */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-600" />
            Supabase Project Infrastructure
          </h2>
          <div className="text-xs space-y-2">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Project Reference ID</span>
              <span className="font-mono text-slate-900">nqxhmdtsnwezwucnvckq</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Database Engine</span>
              <span className="font-medium text-slate-900">PostgreSQL 15 (Supabase Cloud)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">RLS (Row-Level Security)</span>
              <span className="font-semibold text-emerald-600">Enforced & Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
