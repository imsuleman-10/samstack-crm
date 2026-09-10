'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TrendingUp, PieChart as PieIcon, BarChart2, Layers } from 'lucide-react'

interface DashboardChartsProps {
  metrics: {
    total_leads: number
    leads_contacted: number
    messages_sent: number
    messages_seen: number
    replies_received: number
    interested_leads: number
    qualified_leads: number
    deals_won: number
    deals_lost: number
    total_project_value: number
  }
  sourceDistribution?: { name: string; value: number }[]
  weeklyTrends?: { day: string; sent: number; replies: number }[]
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b']

export default function DashboardCharts({
  metrics,
  sourceDistribution: propSourceDist,
  weeklyTrends: propWeeklyTrends,
}: DashboardChartsProps) {
  const [activeTab, setActiveTab] = useState<'funnel' | 'activity'>('funnel')

  // Real conversion funnel data (no fake fallbacks)
  const funnelData = [
    { stage: 'Captured', count: metrics.total_leads || 0, fill: '#3b82f6' },
    { stage: 'Contacted', count: metrics.leads_contacted || 0, fill: '#6366f1' },
    { stage: 'Seen', count: metrics.messages_seen || 0, fill: '#8b5cf6' },
    { stage: 'Replied', count: metrics.replies_received || 0, fill: '#a855f7' },
    { stage: 'Interested', count: metrics.interested_leads || 0, fill: '#f59e0b' },
    { stage: 'Won Deals', count: metrics.deals_won || 0, fill: '#10b981' },
  ]

  // Real lead channels breakdown
  const sourceDistribution = (propSourceDist && propSourceDist.length > 0)
    ? propSourceDist
    : []

  const totalSourceCount = sourceDistribution.reduce((acc, curr) => acc + curr.value, 0)

  // Real weekly trends — zero-fill if no real outreach data was passed
  const weeklyTrends = (propWeeklyTrends && propWeeklyTrends.length > 0)
    ? propWeeklyTrends
    : [
        { day: 'Mon', sent: 0, replies: 0 },
        { day: 'Tue', sent: 0, replies: 0 },
        { day: 'Wed', sent: 0, replies: 0 },
        { day: 'Thu', sent: 0, replies: 0 },
        { day: 'Fri', sent: 0, replies: 0 },
      ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Conversion & Activity Chart (2 Cols) */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Pipeline Progression & Activity</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual conversion stages and weekly outreach response velocity.
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('funnel')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'funnel'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sales Funnel
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'activity'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Weekly Trend
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'funnel' ? (
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                  }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <AreaChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="repliesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="sent"
                  name="Messages Sent"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#sentGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="replies"
                  name="Replies Received"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#repliesGrad)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lead Channels Distribution Donut (1 Col) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Lead Generation Channels</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Acquisition breakdown by platform.
          </p>
        </div>

        {totalSourceCount > 0 ? (
          <>
            <div className="h-52 w-full my-auto flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '10px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              {sourceDistribution.slice(0, 4).map((src, i) => (
                <div key={src.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                  <span className="truncate">{src.name} ({src.value})</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-52 flex flex-col items-center justify-center text-center p-4">
            <PieIcon className="w-8 h-8 text-slate-200 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No channel data yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Captured leads and their acquisition sources will be displayed here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
