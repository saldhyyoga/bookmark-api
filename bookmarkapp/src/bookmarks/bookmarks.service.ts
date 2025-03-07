import prisma from '../prisma/index.js';

export const getAllBookmarks = async ({
  search,
  categoryId,
  tags,
  page = 1,
  limit = 10,
}: {
  search?: string;
  categoryId?: number;
  tags?: string[];
  page?: number;
  limit?: number;
}) => {
  const skip = (page - 1) * limit;

  return await prisma.bookmark.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { url: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        categoryId ? { categoryId: Number(categoryId) } : {},
        tags && tags.length > 0 ? { tags: { hasSome: tags } } : {},
      ],
    },
    skip,
    take: limit,
  });
};

export const getBookmarkById = async (id: number) => {
  return await prisma.bookmark.findUnique({ where: { id } });
};

export const createBookmark = async (data: { title: string; url: string; categoryId?: number; tags?: string[] }) => {
  const { title, url, categoryId, tags } = data;
  
  const existingBookmark = await prisma.bookmark.findFirst({
    where: { 
      url,
      categoryId
    },
  });

  if (existingBookmark) {
    throw new Error('Bookmark url already exists in this category');
  }

  return await prisma.bookmark.create({
    data: {
      title,
      url,
      tags: tags ?? [],
      ...(categoryId && { categoryId: Number(categoryId) }),
    },
  });
};

export const updateBookmark = async (id: number, data: { title?: string; url?: string; categoryId?: number; tags?: string[] }) => {
  const bookmark = await prisma.bookmark.findUnique({ where: { id } });

  if (!bookmark) {
    throw new Error('Bookmark not found');
  }

  return await prisma.bookmark.update({
    where: { id },
    data: {
      ...data,
      tags: data.tags ?? bookmark.tags,
    },
  });
};

export const deleteBookmark = async (id: number) => {
  const bookmark = await prisma.bookmark.findUnique({ where: { id } });

  if (!bookmark) {
    throw new Error('Bookmark not found');
  }

  await prisma.bookmark.delete({ where: { id } });
};
