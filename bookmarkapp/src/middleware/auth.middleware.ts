import type { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { errorResponse } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json(errorResponse('Unauthorized: No token provided'), 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verify(token, JWT_SECRET);

    if (!decoded) {
      return c.json(errorResponse('Unauthorized: Invalid token'), 401);
    }

    // Attach user info to context
    c.set('user', decoded);

    await next();
  } catch (error) {
    return c.json(errorResponse('Unauthorized: Invalid or expired token'), 401);
  }
};
