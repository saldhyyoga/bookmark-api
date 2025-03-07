import { describe, test, expect, vi, beforeEach } from 'vitest';
import prisma from '../prisma/index.js';
import {
  getAllBookmarks,
  getBookmarkById,
  createBookmark,
  updateBookmark,
  deleteBookmark,
} from './bookmarks.service.js'
import { faker } from '@faker-js/faker';

// Mock Prisma Client
vi.mock('../prisma/index.js', () => ({
  default: {
    bookmark: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('Bookmark Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks(); // Reset mocks before each test
  });

  const id = faker.number.int();
  const title = faker.lorem.words(3);
  const url = faker.internet.url();
  const categoryId = faker.number.int();
  const tags = [faker.lorem.word(), faker.lorem.word()];
  const createdAt = new Date();
  const updatedAt = new Date();

  const mockBookmark = { id: id + 1, title: faker.lorem.words(3), url: faker.internet.url(), categoryId, tags, createdAt, updatedAt, description: "" };

  test('getAllBookmarks should return an array of bookmarks', async () => {
    const mockBookmarks = [
      { id, title, url, categoryId, tags, createdAt, updatedAt, description: "" },
      { id: id + 1, title: faker.lorem.words(3), url: faker.internet.url(), categoryId, tags, createdAt, updatedAt, description: "" },
    ];

    vi.spyOn(prisma.bookmark, 'findMany').mockResolvedValue(mockBookmarks);

    const result = await getAllBookmarks({ page: 1, limit: 10 });

    expect(prisma.bookmark.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockBookmarks);
  });

  test('getBookmarkById should return a bookmark when found', async () => {
    vi.spyOn(prisma.bookmark, 'findUnique').mockResolvedValue(mockBookmark);

    const result = await getBookmarkById(id);

    expect(prisma.bookmark.findUnique).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(mockBookmark);
  });

  test('getBookmarkById should return null if not found', async () => {
    vi.spyOn(prisma.bookmark, 'findUnique').mockResolvedValue(null);

    const result = await getBookmarkById(id);

    expect(prisma.bookmark.findUnique).toHaveBeenCalledWith({ where: { id } });
    expect(result).toBeNull();
  });

  test('createBookmark should create and return a new bookmark', async () => {
    vi.spyOn(prisma.bookmark, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.bookmark, 'create').mockResolvedValue(mockBookmark);

    const result = await createBookmark({ title, url, categoryId, tags });

    // expect(prisma.bookmark.findFirst).toHaveBeenCalledWith({ where: { url, categoryId } });
    expect(prisma.bookmark.create).toHaveBeenCalledWith({
      data: { title, url, categoryId, tags },
    });
    expect(result.id).toEqual(mockBookmark.id)
    expect(result.title).toEqual(mockBookmark.title)
    expect(result.url).toEqual(mockBookmark.url)
    expect(result.categoryId).toEqual(mockBookmark.categoryId)
    expect(result.tags).toEqual(mockBookmark.tags);
  });

  test('createBookmark should throw an error if bookmark already exists', async () => {
    vi.spyOn(prisma.bookmark, 'findFirst').mockResolvedValue(mockBookmark);


    await expect(createBookmark({ title, url, categoryId, tags })).rejects.toThrow(
      'Bookmark url already exists in this category'
    );
  });

  test('updateBookmark should update and return a bookmark', async () => {
    vi.spyOn(prisma.bookmark, 'findUnique').mockResolvedValue(mockBookmark);
    vi.spyOn(prisma.bookmark, 'update').mockResolvedValue(mockBookmark);

    const result = await updateBookmark(id, { title: 'Updated Title' });

    expect(prisma.bookmark.findUnique).toHaveBeenCalledWith({ where: { id } });
    expect(prisma.bookmark.update).toHaveBeenCalled();
    expect(result.title).toEqual(mockBookmark.title);
  });

  test('updateBookmark should throw an error if bookmark is not found', async () => {
    vi.spyOn(prisma.bookmark, 'findUnique').mockResolvedValue(null);

    await expect(updateBookmark(id, { title: 'Updated Title' })).rejects.toThrow('Bookmark not found');
  });

  test('deleteBookmark should delete a bookmark', async () => {
    vi.spyOn(prisma.bookmark, 'findUnique').mockResolvedValue(mockBookmark);
    vi.spyOn(prisma.bookmark, 'delete').mockResolvedValue(mockBookmark);

    await deleteBookmark(id);

    expect(prisma.bookmark.findUnique).toHaveBeenCalledWith({ where: { id } });
    expect(prisma.bookmark.delete).toHaveBeenCalledWith({ where: { id } });
  });

  test('deleteBookmark should throw an error if bookmark is not found', async () => {
    vi.spyOn(prisma.bookmark, 'findUnique').mockResolvedValue(null);

    await expect(deleteBookmark(id)).rejects.toThrow('Bookmark not found');
  });
});
