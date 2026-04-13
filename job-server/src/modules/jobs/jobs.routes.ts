import { Hono } from 'hono';
import { HonoEnv } from '../../types';
import { authMiddleware } from '../../middleware/auth';
import { JobsService } from './jobs.service';
import { createDb, jobs } from '../../db';

const jobRoutes = new Hono<HonoEnv>();

// GET /api/jobs (Public)

// jobRoutes.get('/categories', async (c) => {
//   try {
//     // Just get all distinct categories
//     const result = await createDb(c.env.DB)
//       .selectDistinct({ name: jobs.category })
//       .from(jobs);

//     // Filter out any nulls using plain JavaScript
//     const categoryList = result
//       .map(row => row.name)
//       .filter((name): name is string => name !== null);
    
//     return c.json({ success: true, data: categoryList });
//   } catch (error) {
//     console.error(error);
//     return c.json({ success: false, error: "Could not fetch categories" }, 500);
//   }
// });

jobRoutes.get('/categories', async (c) => {
    try {
        const data = await JobsService.getCategoryStats(c);
        console.log("Category Stats Data:", data); // Now you can actually see it
        return c.json({ success: true, data });
    } catch (error) {
        console.error("Category Route Error:", error);
        return c.json({ success: false, error: "Failed to fetch stats" }, 500);
    }
});


jobRoutes.get('/', async (c) => {
    const data = await JobsService.getAll(c);
    return c.json({ success: true, data });
});

// POST /api/jobs (Protected)
jobRoutes.post('/create', authMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        console.log("Logged in User:", body);
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

jobRoutes.get('/manageable', authMiddleware, async (c) => {
    const jobs = await JobsService.getManageable(c);
    return c.json(jobs);
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