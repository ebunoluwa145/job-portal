import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HonoEnv } from './types';
import { authRoutes } from './modules/auth/auth.routes';
import { jobRoutes } from './modules/jobs/jobs.routes';


const app = new Hono<HonoEnv>();

//  Global Middleware
app.use('*', cors({
    origin: '*', // In production, will be replaced with c.env.ALLOWED_ORIGIN
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));


app.get('/docs', (c) => {
    return c.html(`<!doctype html>
  <html>
  <head>
    <title>Job Portal API Reference</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>body { margin: 0; }</style>
  </head>
  <body>
    <script id="api-reference" data-url="/openapi.json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
  </html>`);
});

// Serve JSON Spec
// app.get('/openapi.json', (c) => {
//     const spec = { ...openApiSpec, servers: [{ url: new URL(c.req.url).origin }] };
//     return c.json(spec);
// });

// Health Check
app.get('/', (c) => {
    return c.json({
        message: 'Job Portal API is running 🚀',
        timestamp: new Date().toISOString()
    });
});

//register routes
app.route('/api/auth', authRoutes);

// Job routes

app.route('/api/jobs', jobRoutes);





// // Global Error Handler
// app.onError((err, c) => {
//     console.error('🔥 API Error:', err);
//     return c.json({
//         success: false,
//         message: err.message || 'Internal Server Error'
//     }, 500);
// });

// --- GLOBAL HANDLERS ---

// 1. Catch-All for routes that don't exist
app.notFound((c) => {
  return c.json({ 
    success: false, 
    message: `Route not found: ${c.req.method} ${c.req.url}` 
  }, 404);
});

// 2. Global Error Handler for server crashes
app.onError((err, c) => {
  console.error(`🔥 SERVER ERROR: ${err.message}`);
  
  // If it's a validation error or a custom error, you can handle it here
  const status = err instanceof Error && 'status' in err ? (err as any).status : 500;

  return c.json({
    success: false,
    message: err.message || "An unexpected server error occurred",
  }, status);
});

export default app;