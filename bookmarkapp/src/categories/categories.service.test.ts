import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '../prisma/index.js';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from './categories.service.js';

describe('Categories Service', () => {
  const mockCategory = { id: 1, name: 'Electronics' };

  beforeEach(() => {
    vi.restoreAllMocks(); // Restore original implementations before each test
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      vi.spyOn(prisma.category, 'create').mockResolvedValue(mockCategory);
      const result = await createCategory('Electronics');
      expect(result).toEqual(mockCategory);
      expect(prisma.category.create).toHaveBeenCalledWith({ data: { name: 'Electronics' } });
    });
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      vi.spyOn(prisma.category, 'findMany').mockResolvedValue([mockCategory]);
      const result = await getCategories();
      expect(result).toEqual([mockCategory]);
      expect(prisma.category.findMany).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      vi.spyOn(prisma.category, 'findUnique').mockResolvedValue(mockCategory);
      const result = await getCategoryById(1);
      expect(result).toEqual(mockCategory);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if category does not exist', async () => {
      vi.spyOn(prisma.category, 'findUnique').mockResolvedValue(null);
      const result = await getCategoryById(2);
      expect(result).toBeNull();
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      vi.spyOn(prisma.category, 'update').mockResolvedValue({ id: 1, name: 'Updated Name' });
      const result = await updateCategory(1, 'Updated Name');
      expect(result).toEqual({ id: 1, name: 'Updated Name' });
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated Name' },
      });
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      vi.spyOn(prisma.category, 'delete').mockResolvedValue(mockCategory);
      const result = await deleteCategory(1);
      expect(result).toEqual(mockCategory);
      expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if category does not exist', async () => {
      vi.spyOn(prisma.category, 'delete').mockRejectedValue(new Error('Category not found'));
      await expect(deleteCategory(2)).rejects.toThrow('Category not found');
    });
  });
});
