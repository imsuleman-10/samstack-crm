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
    <div className={cn('bg-white border border-border rounded-xl p-5 flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        {Icon && (
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBg[color])}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-foreground">
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      {trend && trendValue && (
        <div className="flex items-center gap-1.5">
          {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-green-500" />}
          {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
          {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
          <span className={cn(
            'text-xs font-medium',
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
          )}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  )
}
