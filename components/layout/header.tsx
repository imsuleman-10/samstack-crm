'use client'

import { Bell, Search, Plus, Sparkles, Building2, UserPlus, Check, ExternalLink } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { UserRole } from '@/lib/types/database'

interface HeaderProps {
  title?: string
  role: UserRole
}

export default function Header({ title, role }: HeaderProps) {
  const [search, setSearch] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [quickActionsOpen, setQuickActionsOpen] = useState(false)
  const router = useRouter()
  const notifRef = useRef<HTMLDivElement>(null)
  const actionRef = useRef<HTMLDivElement>(null)

  const isSuperAdmin = role === 'super_admin'
  const isAdmin = role === 'admin' || isSuperAdmin
  const basePath = isAdmin ? '/admin' : ''

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!search.trim()) return
    router.push(`${basePath}/leads?search=${encodeURIComponent(search.trim())}`)
  }

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('global-search-input')?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setQuickActionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [notifications, setNotifications] = useState<Array<{
    id: string
    title: string
    desc: string
    time: string
    unread: boolean
  }>>([])

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between gap-4 px-6 flex-shrink-0 z-20 sticky top-0 shadow-xs">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {title && (
          <div className="hidden lg:block">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h1>
            <p className="text-[11px] text-slate-400 font-medium">SAMStack Enterprise Suite</p>
          </div>
        )}
      </div>

      {/* Global Search Bar with Keyboard Hint */}
      <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-2">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            id="global-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads, phone numbers, cities..."
            className="w-full h-9.5 pl-10 pr-16 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-xs"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/70 rounded border border-slate-300">
              Ctrl
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/70 rounded border border-slate-300">
              K
            </kbd>
          </div>
        </div>
      </form>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Quick Action Button */}
        <div className="relative" ref={actionRef}>
          <button
            onClick={() => setQuickActionsOpen(!quickActionsOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-sm shadow-blue-500/20 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Action</span>
          </button>

          {quickActionsOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Create New
              </div>
              <Link
                href="/leads/new"
                onClick={() => setQuickActionsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Building2 className="w-4 h-4 text-blue-500" />
                Add New Lead
              </Link>
              {isSuperAdmin && (
                <Link
                  href="/admin/employees/new"
                  onClick={() => setQuickActionsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-amber-500" />
                  Add Team Member
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-50 animate-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      n.unread ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50/50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{n.title}</span>
                      <span className="text-[10px] font-normal text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400 font-medium">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

