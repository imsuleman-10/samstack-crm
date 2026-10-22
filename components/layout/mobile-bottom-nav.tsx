'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  FileText,
  CalendarCheck2,
  PlusCircle,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/lib/types/database'

interface MobileBottomNavProps {
  role: UserRole
}

export default function MobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname()
  const isSuperAdmin = role === 'super_admin'
  const isAdmin = role === 'admin' || isSuperAdmin

  const navItems = isAdmin
    ? [
        { href: '/admin/dashboard', label: 'Home', icon: LayoutDashboard },
        { href: '/admin/leads', label: 'Leads', icon: Building2 },
        { href: '/admin/outreach', label: 'Outreach', icon: MessageSquare },
        { href: '/admin/reports', label: 'Reports', icon: FileText },
      ]
    : [
        { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
        { href: '/leads', label: 'Leads', icon: Building2 },
        { href: '/leads/new', label: 'New Lead', icon: PlusCircle },
        { href: '/follow-ups', label: 'Follow-ups', icon: CalendarCheck2 },
      ]

  function handleOpenSidebar() {
    window.dispatchEvent(new CustomEvent('open-mobile-sidebar'))
  }

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0a0f1e]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] px-2 pt-1.5 pb-2 safe-area-bottom select-none"
      aria-label="Mobile Navigation Bar"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' &&
              item.href !== '/admin/dashboard' &&
              pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150',
                isActive
                  ? 'text-blue-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
                  isActive
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.35)]'
                    : 'text-slate-400'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[56px]">
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* 5th Button: Opens Full Sidebar Drawer */}
        <button
          type="button"
          onClick={handleOpenSidebar}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-slate-200 transition-all duration-150"
          aria-label="Open Full Navigation Menu"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-900/60 border border-slate-800 text-slate-300">
            <Menu className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
        </button>
      </div>
    </nav>
  )
}
