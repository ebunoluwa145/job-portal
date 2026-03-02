import { Hono } from 'hono';
import { HonoEnv } from '../../types';
import { authMiddleware } from '../../middleware/auth';
import { JobsService } from './jobs.service';

const jobRoutes = new Hono<HonoEnv>();

// GET /api/jobs (Public)
jobRoutes.get('/', async (c) => {
    const data = await JobsService.getAll(c);
    return c.json({ success: true, data });
});

// POST /api/jobs (Protected)
jobRoutes.post('/create', authMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        const result = await JobsService.create(c, body);
        return c.json({ success: true, data: result }, 201);
    } catch (err: any) {
        return c.json({ success: false, error: err.message }, 403);
    }
});

//getbyid
// GET /api/jobs/:id
jobRoutes.get('/:id', async (c) => {
    try {
        const id = c.req.param('id'); // Gets the :id from the URL
        const job = await JobsService.getById(c, Number(id));
        
        return c.json({ success: true, data: job });
    } catch (err: any) {
        return c.json({ success: false, error: err.message }, 404);
    }
});

//api/jobs/:update
jobRoutes.put('/:id', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const result = await JobsService.update(c, Number(id), body);
        return c.json({ success: true, data: result });
    } catch (err: any) {
        return c.json({ success: false, error: err.message }, 403);
    }
});

//api/jobs/:delete
jobRoutes.delete('/:id', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        await JobsService.delete(c, Number(id));
        return c.json({ success: true, message: 'Job deleted successfully' });
    } catch (err: any) {
        return c.json({ success: false, error: err.message }, 403);
    }
});

export { jobRoutes };