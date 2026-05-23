import {Context, Hono} from 'Hono'
import {HonoEnv} from '../../types'
import {createDb} from '../../db/index'
import { and, or, eq, like } from 'drizzle-orm';
import { categories, jobs } from '../../db/schema';
import { count } from 'drizzle-orm';

// AdminService.ts
export class AdminService {


    static async getAllJobs(c: Context<HonoEnv>) {
        const db = createDb(c.env.DB);
        const user = c.get('user');

        // Security check
        if (!user || user.role !== 'admin') {
            throw new Error('Unauthorized');
        }

        return await db.query.jobs.findMany({
            with: {
                category: true, // Required to show "Design" instead of ID "1"
                author: {
                    columns: { name: true, email: true }
                }
            },
            orderBy: (jobs, { desc }) => [desc(jobs.createdAt)]
        });
    }
    
    /**
     * Update job status, payment, and featured status
     * Used by Admin to approve/feature jobs manually
     */
    static async updateJobControls(c: Context<HonoEnv>, jobId: string, payload: any) {
        const db = createDb(c.env.DB);
        const user = c.get('user');

        // Audit Check: Ensure the user exists and is an admin
        if (!user) {
            throw new Error('User context missing');
        }

        if (user.role !== 'admin') {
            throw new Error('Unauthorized: Admin access required');
        }

        const { status, paymentStatus, isFeatured, adminFeedback } = payload;

        const result = await db.update(jobs)
            .set({
                status,          // 'pending' | 'active' | 'rejected'
                paymentStatus,   // boolean
                isFeatured,      // boolean
                adminFeedback    // string
            })
            .where(eq(jobs.id, Number(jobId)))
            .returning();

        if (result.length === 0) {
            throw new Error('Job listing not found');
        }

        return result[0];
    }

    // Inside AdminService class
    static async deleteJob(c: any, id: string) {
        const db = createDb(c.env.DB);
        // Convert string ID to number if your DB uses numeric IDs
        const jobId = Number(id);
        
        return await db.delete(jobs).where(eq(jobs.id, jobId));
    }
}