import 'dotenv/config';
import { serve } from '@hono/node-server'
import { Hono, type Context } from 'hono'
import authRouter from './auth/auth.routes.js'
import bookmarkRouter from './bookmarks/bookmarks.routes.js'
import categoryRouter from './categories/categories.routes.js'
import logger from './utils/logger.js'

const app = new Hono()
app.use('*', async (c: Context, next) => {
  const start = Date.now();
  const duration = Date.now() - start;

  logger.info({
    method: c.req.method,
    url: c.req.url,
    status: c.res.status,
    duration: `${duration}ms`,
  });

  await next()
});

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/auth', authRouter)
app.route('/bookmarks', bookmarkRouter)
app.route('/categories', categoryRouter)

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
