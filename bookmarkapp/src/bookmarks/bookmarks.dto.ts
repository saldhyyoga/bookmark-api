import { z } from 'zod';

export const CreateBookmarkSchema = z.object({
  title: z.string().min(2, 'title must be at least 2 characters long'),
  url: z.string().url('invalid URL format'),
  tags: z.array(z.string()).optional(),
  categoryId: z.number().optional(),
});

export const UpdateBookmarkSchema = z.object({
  title: z.string().min(2, 'title must be at least 2 characters long').optional(),
  url: z.string().url('invalid URL format').optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.number().optional(),
});
