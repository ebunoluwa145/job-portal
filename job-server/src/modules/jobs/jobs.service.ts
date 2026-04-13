import {Context, Hono} from 'Hono'
import {HonoEnv} from '../../types'
import {createDb} from '../../db/index'
import { and, or, eq, like } from 'drizzle-orm';
import { jobs } from '../../db/schema';
import { count } from 'drizzle-orm';


export class JobsService{
    // Create a Job
    static async create(c: Context<HonoEnv>, payload:any){
        const db = createDb(c.env.DB);
        const user = c.get('user');
        if (!user) {
        return c.json({ error: 'User context missing' }, 401);
        }


        console.log(user.id);
        console.log(user.role);

        //check
        if(user.role !== 'employee' && user.role !== 'admin'){
            throw new Error('Unauthorized : Only employees  can create jobs');

        }

        const result = await db.insert(jobs).values({
            ...payload,
            employeeId: user.id,

        }).returning();

        return result[0];

    }

    static async getAll(c: Context<HonoEnv>) {
    const db = createDb(c.env.DB);
    
    // Get search filters from the URL query string
    const { location, category, search } = c.req.query();

    return await db.query.jobs.findMany({
        where: (jobs, { and, eq, like }) => {
            const filters = [];
            
            if (location) filters.push(like(jobs.location, location));
            if (category) filters.push(eq(jobs.category, category));
            if (search) {
                const s = `%${search}%`;
                    filters.push(
                    or(
                        like(jobs.title, s),
                        like(jobs.category, s), // Added this so searching "Product" works too
                    // Added this so searching "Lagos" works too
                        like(jobs.company, s),
                        like(jobs.jobType,s) // Use the exact column name from your schema
                    )
                    );
                }
                        
            // If no filters are provided, return everything (undefined)
            return filters.length > 0 ? and(...filters) : undefined;
        },
        with: {
            author: {
                columns: { name: true, email: true }
            }
        },
        orderBy: (job, { desc }) => [desc(job.createdAt)]
    });
}

    //get jobs by id
    static async getById(c:Context<HonoEnv>, id:number){
        const db = createDb(c.env.DB);

        const job = await db.query.jobs.findFirst({
            where:(jobs, {eq}) => eq(jobs.id, Number(id)),
            with:{
                author:{
                    columns:{ name:true, email:true}
                }
            }
        });

        if(!job){
            throw new Error('Job not found');
        }

        return job;
    }



static async getCategoryStats(c: Context) {
  const db = createDb(c.env.DB);
  
  const stats = await db
    .select({
      name: jobs.category,
      count: count(jobs.id),
    })
    .from(jobs)
    .groupBy(jobs.category);

  // RETURN the stats directly, don't use c.json here
  return stats; 
}


    // Get jobs for the Management Dashboard (Admin sees all, Employer sees theirs)
    static async getManageable(c: Context<HonoEnv>) {
        const db = createDb(c.env.DB);
        const user = c.get('user');

        if (!user) {
            throw new Error('Unauthorized');
        }

        return await db.query.jobs.findMany({
            where: (jobs, { eq }) => {
                // If admin, return undefined (which means no filter, get all)
                // If not admin, filter by employeeId
                return user.role === 'admin' 
                    ? undefined 
                    : eq(jobs.employeeId, user.id);
            },
            with: {
                author: {
                    columns: { name: true, email: true }
                }
            },
            orderBy: (job, { desc }) => [desc(job.createdAt)]
        });
    }

    //delete job
    static async delete(c:Context<HonoEnv>, id:number){
        const db = createDb(c.env.DB);
        const user = c.get('user');
        if (!user) {
            return c.json({ error: 'User context missing' }, 401);
        }

        const job = await db.query.jobs.findFirst({
            where:(jobs, {eq}) => eq(jobs.id, Number(id)),
        });

        if(!job){
            throw new Error('Job not found');
        }

        if(job.employeeId !== user.id && user.role !== 'admin'){
            throw new Error('Unauthorized : Only admin or job owner can delete job');
        }

        return await db.delete(jobs).where(eq(jobs.id, Number(id)));
    }

    //update job
    static async update(c:Context<HonoEnv>, id:number, payload:any){
        const db = createDb(c.env.DB);
        const user = c.get('user');
        if (!user) {
            return c.json({ error: 'User context missing' }, 401);
        }

        const job = await db.query.jobs.findFirst({
            where:(jobs, {eq}) => eq(jobs.id, Number(id)),
        });

        if(!job){
            throw new Error('Job not found');
        }

        if(job.employeeId !== user.id && user.role !== 'admin'){
            throw new Error('Unauthorized : Only admin or job owner can update job');
        }

        const result = await db.update(jobs).set(payload).where(eq(jobs.id, Number(id))).returning();

        return result[0];
    }

}
