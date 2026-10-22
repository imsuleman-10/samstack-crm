import { cn, formatNumber } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'slate'
  className?: string
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-green-50 text-green-600 border-green-100',
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  red: 'bg-red-50 text-red-600 border-red-100',
  slate: 'bg-slate-50 text-slate-600 border-slate-100',
}

const iconBg = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
  slate: 'bg-slate-100 text-slate-600',
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
  className,
}: StatCardProps) {
  return (
    <div className={cn('bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 sm:gap-3 shadow-xs', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">{title}</p>
        {Icon && (
          <div className={cn('w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0', iconBg[color])}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>
        )}
      </div>

      {trend && trendValue && (
        <div className="flex items-center gap-1.5 pt-0.5">
          {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
          {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />}
          {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
          <span className={cn(
            'text-[11px] sm:text-xs font-semibold',
            trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-500'
          )}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  )
}
