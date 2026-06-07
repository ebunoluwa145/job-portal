import { Hono } from 'hono';
import { HonoEnv } from '../../types';
import { authMiddleware } from '../../middleware/auth';
import { AdminService } from './admin.service';

const adminRoutes = new Hono<HonoEnv>();

// Apply auth to all admin routes
adminRoutes.use('*', authMiddleware);

adminRoutes.get('/jobs', async (c) => {
    try {
        const jobs = await AdminService.getAllJobs(c);
        return c.json({
            success: true,
            data: jobs
        });
    } catch (e: any) {
        return c.json({ success: false, error: e.message }, 401);
    }
});

// The "Master Control" route
adminRoutes.patch('/jobs/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    try {
        // 💡 AUTOMATIC EXPIRATION LOGIC
        // If the admin is marking this job as paid, automatically calculate 30 days into the future
        if (body.paymentStatus === 'paid') {
            body.featuredUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Current time + 30 Days
            body.isFeatured = true; // Force featured true if they paid
        } else if (body.paymentStatus === 'unpaid') {
            // If explicitly marked unpaid, clear out the timer and featured status
            body.featuredUntil = null;
            body.isFeatured = false;
        }

        // Now pass the enriched body (containing our new timestamp) to the service layer
        const result = await AdminService.updateJobControls(c, id, body);
        
        return c.json({
            success: true,
            data: result
        });
    } catch (e: any) {
        const status = e.message === 'Forbidden' ? 403 : 400;
        return c.json({ success: false, error: e.message }, status);
    }
});

adminRoutes.delete('/jobs/:id', async (c) => {
    const id = c.req.param('id');
    
    try {
        await AdminService.deleteJob(c, id);
        return c.json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (e: any) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

export default adminRoutes;