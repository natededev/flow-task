// Task-related constants
export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
} as const;

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const TASK_STATUS_LABELS = {
  [TASK_STATUSES.TODO]: 'Todo',
  [TASK_STATUSES.IN_PROGRESS]: 'In Progress',
  [TASK_STATUSES.DONE]: 'Done',
} as const;

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITIES.LOW]: 'Low',
  [TASK_PRIORITIES.MEDIUM]: 'Medium',
  [TASK_PRIORITIES.HIGH]: 'High',
  [TASK_PRIORITIES.URGENT]: 'Urgent',
} as const;

export const TASK_PRIORITY_COLORS = {
  [TASK_PRIORITIES.LOW]: 'bg-gray-100 text-gray-800',
  [TASK_PRIORITIES.MEDIUM]: 'bg-blue-100 text-blue-800',
  [TASK_PRIORITIES.HIGH]: 'bg-orange-100 text-orange-800',
  [TASK_PRIORITIES.URGENT]: 'bg-red-100 text-red-800',
} as const;

export const TASK_STATUS_COLORS = {
  [TASK_STATUSES.TODO]: 'bg-slate-100 text-slate-800',
  [TASK_STATUSES.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [TASK_STATUSES.DONE]: 'bg-green-100 text-green-800',
} as const;
