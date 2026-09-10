'use client'

import { useState } from 'react'
import type { Profile } from '@/lib/types/database'
import { formatPKR } from '@/lib/analytics/formulas'
import { Trophy, Medal, Flame, Star, ArrowUpRight, User } from 'lucide-react'
import Link from 'next/link'

interface TeamLeaderboardProps {
  employees: (Profile & { wonDeals?: number; revenue?: number })[]
}

export default function TeamLeaderboard({ employees }: TeamLeaderboardProps) {
  const activeEmployees = employees.filter((e) => e.status === 'active' && e.role === 'employee')

  // Real performance ranking based on actual won deals and revenue
  const ranked = [...activeEmployees].map((emp) => {
    const monthlyConversions = emp.target_monthly_conversions || 4
    const wonDeals = emp.wonDeals || 0
    const revenue = emp.revenue || 0

    return {
      ...emp,
      wonDeals,
      revenue,
      completionRate: monthlyConversions > 0 ? Math.min(100, Math.round((wonDeals / monthlyConversions) * 100)) : 0,
    }
  }).sort((a, b) => b.revenue - a.revenue || b.wonDeals - a.wonDeals)

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Top Outreach Performers</h3>
            <p className="text-xs text-slate-500">Live team rankings & closed revenue achievements.</p>
          </div>
        </div>

        <Link
          href="/admin/analytics"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          View BI metrics <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {ranked.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {ranked.slice(0, 3).map((rep, idx) => {
            const medalColors = [
              'bg-amber-500 text-white shadow-amber-500/25', // Gold
              'bg-slate-400 text-white shadow-slate-400/25', // Silver
              'bg-amber-700 text-white shadow-amber-700/25', // Bronze
            ]

            return (
              <div
                key={rep.id}
                className={`relative p-4 rounded-2xl border transition-all ${
                  idx === 0
                    ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-300 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                {/* Podium Badge */}
                <div
                  className={`absolute -top-2.5 -right-2 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${medalColors[idx]}`}
                >
                  #{idx + 1}
                </div>

                <div className="flex items-center gap-3">
                  {rep.profile_photo_url ? (
                    <img
                      src={rep.profile_photo_url}
                      alt={rep.full_name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      {rep.full_name ? rep.full_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{rep.full_name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{rep.department || 'Outreach Rep'}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/70 grid grid-cols-2 gap-2 text-left">
                  <div>
                    <span className="text-[10px] text-slate-400">Deals Closed</span>
                    <div className="font-bold text-slate-800 text-xs">{rep.wonDeals} deals</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Revenue (PKR)</span>
                    <div className="font-bold text-emerald-600 text-xs">{formatPKR(rep.revenue)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-slate-400">
          No active sales reps registered yet.
        </div>
      )}
    </div>
  )
}
