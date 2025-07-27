import { z } from 'zod';
import { PROJECT_STATUSES, PROJECT_PRIORITIES } from '@/constants';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  priority: z.enum([PROJECT_PRIORITIES.LOW, PROJECT_PRIORITIES.MEDIUM, PROJECT_PRIORITIES.HIGH, PROJECT_PRIORITIES.URGENT]),
  deadline: z.date().optional(),
  status: z.enum([PROJECT_STATUSES.ACTIVE, PROJECT_STATUSES.COMPLETED, PROJECT_STATUSES.ARCHIVED]),
});

export const projectUpdateSchema = projectSchema.partial();

export type ProjectFormData = z.infer<typeof projectSchema>;
export type ProjectUpdateData = z.infer<typeof projectUpdateSchema>;
