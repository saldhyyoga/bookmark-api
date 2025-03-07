import type { Context, Next } from 'hono';
import { ZodSchema, ZodError } from 'zod';

export const validateReqBody = (schema: ZodSchema) => {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const result = schema.safeParse(body);

      if (!result.success) {
        return c.json({ error: formatZodError(result.error) }, 400);
      }

      // Attach the validated data to context
      c.set('validatedData', result.data);
      await next();
    } catch (error) {
      return c.json({ error: 'Invalid request format' }, 400);
    }
  };
};

// Standardized error formatter
const formatZodError = (error: ZodError) => {
  const formattedErrors: Record<string, { code: string; expected?: string; received?: string; message: string }> = {};

  error.errors.forEach((err) => {
    formattedErrors[err.path.join('.')] = {
      code: err.code,
      message: err.message,
    };
  });

  return formattedErrors;
};
