import { Hono } from 'hono';
import { HonoEnv } from '../../types';
import { authMiddleware } from '../../middleware/auth';
import { JobsService } from './jobs.service';
import { categories, createDb, jobs } from '../../db';

const jobRoutes = new Hono<HonoEnv>();

jobRoutes.get('/categories', async (c) => {
    try {
        // 🟢 Use the Service method you already wrote!
        const data = await JobsService.getCategoryStats(c);
        
        console.log("Categories with Stats:", data); 
        return c.json({ success: true, data });
    } catch (error: any) {
        console.error("Category Route Error:", error);
        return c.json({ success: false, error: error.message }, 500);
    }
});

// 🟢 Place this ABOVE jobRoutes.get('/:id')
jobRoutes.get('/my-listings', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        
        if (!user?.id) {
            return c.json({ success: false, error: "User not identified" }, 401);
        }

        // Now this call will work because we added it to the service!
        const data = await JobsService.getByUserId(c, Number(user.id)); 
        
        return c.json({ success: true, data });
    } catch (error: any) {
        console.error("My Listings Error:", error);
        return c.json({ success: false, error: error.message }, 500);
    }
});



jobRoutes.get('/', async (c) => {
    const data = await JobsService.getAll(c);
    return c.json({ success: true, data });
});


jobRoutes.post('/create', authMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        const user = c.get('user');

        // EXPLICIT MAPPING: This is the safest way to handle D1 inserts
        const cleanPayload = {
            title: body.title,
            company: body.company,
            location: body.location,
            description: body.description,
            salary: body.salary,
            categoryId: Number(body.categoryId), // Ensure this is a number
            jobType: body.jobType,
            link: body.link,
            employeeId: user?.id, 
            status: 'pending',
            isFeatured: 0,
            paymentStatus: 0,
        };

        // Log this to your terminal to verify 'id' is NOT present
        console.log("Final Payload for Drizzle:", cleanPayload);

        const result = await JobsService.create(c, cleanPayload);
        return c.json({ success: true, data: result }, 201);
    } catch (err: any) {
        // Log the full error to your Wrangler/Staging logs
        console.error("Internal Create Error:", err);
        return c.json({ success: false, error: err.message }, 400);
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