import { z } from 'zod';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/constants';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  status: z.enum([TASK_STATUSES.TODO, TASK_STATUSES.IN_PROGRESS, TASK_STATUSES.DONE]),
  priority: z.enum([TASK_PRIORITIES.LOW, TASK_PRIORITIES.MEDIUM, TASK_PRIORITIES.HIGH, TASK_PRIORITIES.URGENT]),
  dueDate: z.date().optional(),
  projectId: z.string().min(1, 'Project is required'),
});

export const taskUpdateSchema = taskSchema.partial();

export const taskFilterSchema = z.object({
  status: z.enum([TASK_STATUSES.TODO, TASK_STATUSES.IN_PROGRESS, TASK_STATUSES.DONE]).optional(),
  priority: z.enum([TASK_PRIORITIES.LOW, TASK_PRIORITIES.MEDIUM, TASK_PRIORITIES.HIGH, TASK_PRIORITIES.URGENT]).optional(),
  assignee: z.string().optional(),
  project: z.string().optional(),
  search: z.string().optional(),
  dueDate: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type TaskUpdateData = z.infer<typeof taskUpdateSchema>;
export type TaskFilterData = z.infer<typeof taskFilterSchema>;
