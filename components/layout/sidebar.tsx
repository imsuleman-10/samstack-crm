'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Building2,
  MessageSquare,
  CalendarCheck2,
  FolderKanban,
  BarChart3,
  FileText,
  ClipboardList,
  Settings,
  LogOut,
  User,
  TrendingUp,
  Plus,
  Crown,
  Shield,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { logout } from '@/lib/actions/auth'
import type { UserRole } from '@/lib/types/database'

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/employees', label: 'Employees', icon: Users },
  { href: '/admin/leads', label: 'Leads Directory', icon: Building2 },
  { href: '/admin/outreach', label: 'Outreach Hub', icon: MessageSquare },
  { href: '/admin/follow-ups', label: 'Follow-ups', icon: CalendarCheck2 },
  { href: '/admin/projects', label: 'Projects & Deals', icon: FolderKanban },
  { href: '/admin/analytics', label: 'BI Analytics', icon: BarChart3 },
  { href: '/admin/reports', label: 'Excel Reports', icon: FileText },
  { href: '/admin/activity-logs', label: 'Audit Logs', icon: ClipboardList },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

const employeeNavItems = [
  { href: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'My Leads', icon: Building2 },
  { href: '/leads/new', label: 'Add New Lead', icon: Plus },
  { href: '/follow-ups', label: 'Follow-ups', icon: CalendarCheck2 },
  { href: '/projects', label: 'Projects & Deals', icon: FolderKanban },
  { href: '/analytics', label: 'Performance', icon: TrendingUp },
]

interface SidebarProps {
  role: UserRole
  fullName: string
  photoUrl: string | null
}

export default function Sidebar({ role, fullName, photoUrl }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Restore collapsed preference from localStorage
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('samstack_sidebar_collapsed')
      if (saved !== null) {
        setCollapsed(saved === 'true')
      }
    } catch {
      // Ignore localStorage access errors
    }

    // Listen for custom events
    function handleExternalToggle() {
      setCollapsed((prev) => {
        const next = !prev
        try {
          localStorage.setItem('samstack_sidebar_collapsed', String(next))
        } catch {}
        return next
      })
    }

    function handleOpenMobile() {
      setMobileOpen(true)
    }

    function handleCloseMobile() {
      setMobileOpen(false)
    }

    function handleToggleMobile() {
      setMobileOpen((prev) => !prev)
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileOpen(false)
      }
    }

    window.addEventListener('toggle-sidebar', handleExternalToggle)
    window.addEventListener('open-mobile-sidebar', handleOpenMobile)
    window.addEventListener('close-mobile-sidebar', handleCloseMobile)
    window.addEventListener('toggle-mobile-sidebar', handleToggleMobile)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('toggle-sidebar', handleExternalToggle)
      window.removeEventListener('open-mobile-sidebar', handleOpenMobile)
      window.removeEventListener('close-mobile-sidebar', handleCloseMobile)
      window.removeEventListener('toggle-mobile-sidebar', handleToggleMobile)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  function toggleCollapse() {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('samstack_sidebar_collapsed', String(next))
      } catch {}
      return next
    })
  }

  const isSuperAdmin = role === 'super_admin'
  const isAdmin = role === 'admin' || isSuperAdmin
  const navItems = isAdmin ? adminNavItems : employeeNavItems

  const roleBadge = isSuperAdmin ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
      <Crown className="w-2.5 h-2.5 text-amber-400" /> Super Admin
    </span>
  ) : isAdmin ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
      <Shield className="w-2.5 h-2.5 text-blue-400" /> Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
      <Sparkles className="w-2.5 h-2.5 text-emerald-400" /> Team Rep
    </span>
  )

  // Navigation Links Content Component (shared between Desktop & Mobile)
  const renderNavLinks = (isMobile: boolean = false) => (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2.5 space-y-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' &&
            item.href !== '/admin/dashboard' &&
            pathname.startsWith(item.href))

        return (
          <div key={item.href} className="relative group">
            <Link
              href={item.href}
              onClick={() => {
                if (isMobile) setMobileOpen(false)
              }}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100',
                !isMobile && collapsed && 'justify-center px-0 w-full'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 flex-shrink-0 transition-transform duration-150',
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 group-hover:scale-110'
                )}
              />
              {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
              {isActive && (!collapsed || isMobile) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              )}
            </Link>

            {/* Floating Tooltip when Collapsed (Desktop only) */}
            {!isMobile && collapsed && (
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-xs font-semibold whitespace-nowrap shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-50">
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )

  // Profile and Logout Footer Component (shared)
  const renderFooter = (isMobile: boolean = false) => (
    <div className="border-t border-slate-800/80 p-2.5 space-y-1 bg-[#0a0f1e]/95 overflow-hidden">
      <div className="relative group">
        <Link
          href={isAdmin ? '/admin/profile' : '/profile'}
          onClick={() => {
            if (isMobile) setMobileOpen(false)
          }}
          className={cn(
            'flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/70 transition-colors group',
            !isMobile && collapsed && 'justify-center p-1.5'
          )}
        >
          <div className="relative flex-shrink-0">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={fullName}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-700 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {fullName ? fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0a0f1e]" />
          </div>

          {(!collapsed || isMobile) && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white">
                {fullName || 'My Profile'}
              </p>
              <p className="text-[10px] text-slate-500 capitalize truncate">
                {role.replace('_', ' ')}
              </p>
            </div>
          )}
        </Link>

        {/* Tooltip for profile when collapsed (Desktop only) */}
        {!isMobile && collapsed && (
          <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-xs font-semibold whitespace-nowrap shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-50">
            {fullName || 'Profile'} ({role.replace('_', ' ')})
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
          </div>
        )}
      </div>

      <div className="relative group">
        <button
          onClick={() => logout()}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400',
            'hover:bg-rose-500/15 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20',
            !isMobile && collapsed && 'justify-center px-0'
          )}
          title={!isMobile && collapsed ? 'Sign out' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Sign out</span>}
        </button>

        {!isMobile && collapsed && (
          <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-rose-400 text-xs font-semibold whitespace-nowrap shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-50">
            Sign out
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP SIDEBAR (Visible only on lg: and up)
      ───────────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen bg-[#0a0f1e] text-slate-200 border-r border-slate-800/80 transition-all duration-300 cubic-bezier(0.4,0,0.2,1) flex-shrink-0 z-30 select-none overflow-x-hidden',
          'shadow-[4px_0_24px_rgba(0,0,0,0.4)]',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Brand Header */}
        <div
          onClick={toggleCollapse}
          className={cn(
            'group relative flex items-center h-16 border-b border-slate-800/80 cursor-pointer select-none',
            'bg-[#0a0f1e] hover:bg-slate-900/80 active:bg-slate-900 transition-all duration-200 flex-shrink-0',
            collapsed ? 'justify-center px-2' : 'px-4'
          )}
          title={collapsed ? 'Click to open sidebar' : 'Click to close sidebar'}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleCollapse()
            }
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0 w-10 h-10 rounded-2xl overflow-hidden bg-white p-1 flex items-center justify-center shadow-md shadow-black/25 group-hover:scale-105 group-hover:shadow-[0_0_14px_rgba(255,255,255,0.3)] transition-all duration-200">
              <Image
                src="/logo.png"
                alt="SAMStack CRM"
                width={34}
                height={34}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1 animate-in fade-in duration-200">
                <div className="font-extrabold text-[15px] text-white tracking-tight leading-none flex items-center gap-1.5">
                  SAMStack <span className="text-blue-400 font-bold">CRM</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium truncate">
                  Sales & Outreach
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Role Pill */}
        {!collapsed ? (
          <div className="px-3 pt-3 pb-1">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] text-slate-500 font-medium">Access Level</span>
              {roleBadge}
            </div>
          </div>
        ) : (
          <div className="flex justify-center pt-3 pb-1" title={`Role: ${role}`}>
            <div className="w-3 h-3 rounded-full flex items-center justify-center">
              {isSuperAdmin ? (
                <Crown className="w-3.5 h-3.5 text-amber-400" />
              ) : isAdmin ? (
                <Shield className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        {renderNavLinks(false)}

        {/* User Profile & Sign Out Footer */}
        {renderFooter(false)}
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE DRAWER OVERLAY & SHEET (Visible on mobile when triggered)
      ───────────────────────────────────────────────────────────── */}
      {/* Backdrop Blur Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300',
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col h-screen bg-[#0a0f1e] text-slate-200 border-r border-slate-800/90 shadow-2xl transition-transform duration-300 ease-out lg:hidden select-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 bg-[#0a0f1e] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden bg-white p-1 flex items-center justify-center shadow-md">
              <Image
                src="/logo.png"
                alt="SAMStack CRM"
                width={30}
                height={30}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1">
                SAMStack <span className="text-blue-400 font-bold">CRM</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Sales & Outreach
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Role Pill */}
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-500 font-medium">Access Level</span>
            {roleBadge}
          </div>
        </div>

        {/* Mobile Navigation Links */}
        {renderNavLinks(true)}

        {/* Mobile Profile & Logout Footer */}
        {renderFooter(true)}
      </aside>
    </>
  )
}
