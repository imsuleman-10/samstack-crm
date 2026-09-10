import { cn } from '@/lib/utils'
import {
  PIPELINE_STAGE_LABELS,
  PIPELINE_STAGE_COLORS,
  CHANNEL_LABELS,
  CHANNEL_COLORS,
  MESSAGE_STATUS_LABELS,
  MESSAGE_STATUS_COLORS,
  RESPONSE_STATUS_LABELS,
  RESPONSE_STATUS_COLORS,
  FOLLOWUP_STATUS_LABELS,
  FOLLOWUP_STATUS_COLORS,
  FOLLOWUP_PRIORITY_LABELS,
  FOLLOWUP_PRIORITY_COLORS,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  EMPLOYEE_STATUS_LABELS,
  EMPLOYEE_STATUS_COLORS,
} from '@/lib/constants'
import type {
  PipelineStage,
  OutreachChannel,
  MessageStatus,
  ResponseStatus,
  FollowUpStatus,
  FollowUpPriority,
  ProjectStatus,
  EmployeeStatus,
} from '@/lib/types/database'

interface StatusBadgeProps {
  type: 'pipeline' | 'channel' | 'message' | 'response' | 'followup' | 'priority' | 'project' | 'employee'
  value: string
  className?: string
}

export default function StatusBadge({ type, value, className }: StatusBadgeProps) {
  let label = value
  let colors = 'bg-gray-100 text-gray-600'

  switch (type) {
    case 'pipeline':
      label = PIPELINE_STAGE_LABELS[value as PipelineStage] || value
      colors = PIPELINE_STAGE_COLORS[value as PipelineStage] || colors
      break
    case 'channel':
      label = CHANNEL_LABELS[value as OutreachChannel] || value
      colors = CHANNEL_COLORS[value as OutreachChannel] || colors
      break
    case 'message':
      label = MESSAGE_STATUS_LABELS[value as MessageStatus] || value
      colors = MESSAGE_STATUS_COLORS[value as MessageStatus] || colors
      break
    case 'response':
      label = RESPONSE_STATUS_LABELS[value as ResponseStatus] || value
      colors = RESPONSE_STATUS_COLORS[value as ResponseStatus] || colors
      break
    case 'followup':
      label = FOLLOWUP_STATUS_LABELS[value as FollowUpStatus] || value
      colors = FOLLOWUP_STATUS_COLORS[value as FollowUpStatus] || colors
      break
    case 'priority':
      label = FOLLOWUP_PRIORITY_LABELS[value as FollowUpPriority] || value
      colors = FOLLOWUP_PRIORITY_COLORS[value as FollowUpPriority] || colors
      break
    case 'project':
      label = PROJECT_STATUS_LABELS[value as ProjectStatus] || value
      colors = PROJECT_STATUS_COLORS[value as ProjectStatus] || colors
      break
    case 'employee':
      label = EMPLOYEE_STATUS_LABELS[value as EmployeeStatus] || value
      colors = EMPLOYEE_STATUS_COLORS[value as EmployeeStatus] || colors
      break
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colors,
        className
      )}
    >
      {label}
    </span>
  )
}
