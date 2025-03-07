import { Hono, type Context } from 'hono';
import { validateReqBody } from '../middleware/validate.body.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { CategorySchema, UpdateCategorySchema } from './categories.dto.js';
import { 
  createCategory, 
  getCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
} from './categories.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

const categoryRouter = new Hono();

categoryRouter.use('*', authMiddleware);

categoryRouter.get('/', async (c: Context) => {
  try {
    const categories = await getCategories();
    return c.json(successResponse(categories));
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 500));
  }
});

categoryRouter.post('/', validateReqBody(CategorySchema), async (c: Context) => {
  try {
    const { name } = await c.req.json();
    const category = await createCategory(name);
    return c.json(successResponse(category), 201);
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 400));
  }
});

categoryRouter.get('/:id', async (c: Context) => {
  try {
    const { id } = c.req.param();
    const category = await getCategoryById(Number(id));
    if (!category) return c.json(errorResponse('Category not found', 404));
    return c.json(successResponse(category));
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 400));
  }
});

categoryRouter.put('/:id', validateReqBody(UpdateCategorySchema), async (c: Context) => {
  try {
    const { id } = c.req.param();
    const { name } = await c.req.json();
    const updatedCategory = await updateCategory(Number(id), name);
    return c.json(successResponse(updatedCategory));
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 400));
  }
});

categoryRouter.delete('/:id', async (c: Context) => {
  try {
    const { id } = c.req.param();
    await deleteCategory(Number(id));
    return c.json(successResponse({ message: 'Category deleted' }));
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 400));
  }
});

export default categoryRouter;
