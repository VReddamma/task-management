import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title min contains 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z.string().optional(),
  assignee_id: z.string().min(1, 'Please select an assignee'),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['Pending', 'In Progress', 'In Review', 'Completed']),
  due_date: z.string().min(1, 'Please select a due date'),
});

export type TaskFormData = z.infer<typeof taskSchema>;
