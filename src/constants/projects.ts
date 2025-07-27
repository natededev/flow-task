// Project-related constants
export const PROJECT_STATUSES = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export const PROJECT_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUSES.ACTIVE]: 'Active',
  [PROJECT_STATUSES.COMPLETED]: 'Completed',
  [PROJECT_STATUSES.ARCHIVED]: 'Archived',
} as const;

export const PROJECT_PRIORITY_LABELS = {
  [PROJECT_PRIORITIES.LOW]: 'Low',
  [PROJECT_PRIORITIES.MEDIUM]: 'Medium',
  [PROJECT_PRIORITIES.HIGH]: 'High',
  [PROJECT_PRIORITIES.URGENT]: 'Urgent',
} as const;

export const PROJECT_STATUS_COLORS = {
  [PROJECT_STATUSES.ACTIVE]: 'bg-green-100 text-green-800',
  [PROJECT_STATUSES.COMPLETED]: 'bg-blue-100 text-blue-800',
  [PROJECT_STATUSES.ARCHIVED]: 'bg-gray-100 text-gray-800',
} as const;

export const PROJECT_PRIORITY_COLORS = {
  [PROJECT_PRIORITIES.LOW]: 'bg-gray-100 text-gray-800',
  [PROJECT_PRIORITIES.MEDIUM]: 'bg-blue-100 text-blue-800',
  [PROJECT_PRIORITIES.HIGH]: 'bg-orange-100 text-orange-800',
  [PROJECT_PRIORITIES.URGENT]: 'bg-red-100 text-red-800',
} as const;
