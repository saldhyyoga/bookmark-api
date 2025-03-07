import { Hono, type Context } from 'hono';
import { validateReqBody } from '../middleware/validate.body.js';
import { LoginSchema, RefreshTokenSchema, RegisterSchema } from './auth.dto.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { registerUser, loginUser, refreshAccessToken } from './auth.service.js'

const authRouter = new Hono();

authRouter.post('/register', validateReqBody(RegisterSchema), async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    const createdUser = await registerUser(email, password);
    return c.json(successResponse(createdUser), 201);
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 409)); // Typecast error to Error
  }
});

authRouter.post('/login', validateReqBody(LoginSchema), async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    const tokens = await loginUser(email, password);
    return c.json(successResponse(tokens));
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 400)); // Typecast error to Error
  }
});

authRouter.post('/refresh-token', validateReqBody(RefreshTokenSchema), async (c: Context) => {
  try {
    const { refreshToken } = await c.req.json();
    const newAccessToken = await refreshAccessToken(refreshToken);
    return c.json(successResponse({ accessToken: newAccessToken }));
  } catch (error) {
    return c.json(errorResponse((error as Error).message, 401)); // Typecast error to Error
  }
});

export default authRouter;
