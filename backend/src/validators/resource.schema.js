import { z } from 'zod';

export const resourceCreateSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  course: z.string().min(2).max(120),
  branch: z.string().min(2).max(120),
  semester: z.string().optional(),
  type: z.enum(['note', 'pyq', 'Notes', 'PYQ']),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export const resourceUpdateSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().min(10).max(2000).optional(),
  course: z.string().min(2).max(120).optional(),
  branch: z.string().min(2).max(120).optional(),
  semester: z.string().optional(),
  type: z.enum(['note', 'pyq', 'Notes', 'PYQ']).optional(),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export const resourceFilterSchema = z.object({
  course: z.string().optional(),
  branch: z.string().optional(),
  type: z.enum(['note', 'pyq', 'Notes', 'PYQ']).optional(),
  status: z.enum(['draft', 'published', 'archived', 'all']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(200).default(12),
});
