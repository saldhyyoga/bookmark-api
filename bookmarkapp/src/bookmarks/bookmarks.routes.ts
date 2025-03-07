import { Hono, type Context } from 'hono';
import { validateReqBody } from '../middleware/validate.body.js';
import { CreateBookmarkSchema, UpdateBookmarkSchema } from './bookmarks.dto.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { getAllBookmarks, getBookmarkById, createBookmark, updateBookmark, deleteBookmark } from './bookmarks.service.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const bookmarkRouter = new Hono();
bookmarkRouter.use('*', authMiddleware);

bookmarkRouter.get('/', async (c: Context) => {
  try {
    const search = c.req.query('search');
    const categoryId = c.req.query('categoryId') ? Number(c.req.query('categoryId')) : undefined;
    const tags = c.req.query('tags')?.split(',');
    const page = c.req.query('page') ? Number(c.req.query('page')) : 1;
    const limit = c.req.query('limit') ? Number(c.req.query('limit')) : 10;

    const bookmarks = await getAllBookmarks({ search, categoryId, tags, page, limit });
    return c.json(successResponse(bookmarks));
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 500));
  }
});

bookmarkRouter.get('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    const bookmark = await getBookmarkById(id);
    if (!bookmark) return c.json(errorResponse('Bookmark not found', 404));

    return c.json(successResponse(bookmark));
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 500));
  }
});

bookmarkRouter.post('/', validateReqBody(CreateBookmarkSchema), async (c: Context) => {
  try {
    const { title, url, categoryId,tags } = await c.req.json();
    const newBookmark = await createBookmark({ title, url, categoryId, tags });
    return c.json(successResponse(newBookmark), 201);
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 409));
  }
});

bookmarkRouter.put('/:id', validateReqBody(UpdateBookmarkSchema), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    const updateData = await c.req.json();
    const updatedBookmark = await updateBookmark(id, updateData);
    return c.json(successResponse(updatedBookmark));
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 400));
  }
});

bookmarkRouter.delete('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    await deleteBookmark(id);
    return c.json(successResponse(null, 'Bookmark deleted successfully'));
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 401));
  }
});

export default bookmarkRouter;
