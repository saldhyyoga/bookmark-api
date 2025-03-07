import { z } from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').optional(),
});
