import {Context, Hono} from 'Hono'
import {HonoEnv} from '../../types'
import {createDb} from '../../db/index'
import { and, or, eq, like } from 'drizzle-orm';
import { jobs } from '../../db/schema';



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

    // Get all jobs
    // static async getAll(c:Context<HonoEnv>){
    //     const db = createDb(c.env.DB);
    //     return await db.query.jobs.findMany({
    //         with:
    //         {
    //             author:{
    //                 columns:{ name:true, email:true}
    //             }
    //         }, orderBy: (job, {desc}) => [desc(job.createdAt)]
    //     });
    // }

    static async getAll(c: Context<HonoEnv>) {
    const db = createDb(c.env.DB);
    
    // Get search filters from the URL query string
    const { location, category, search } = c.req.query();

    return await db.query.jobs.findMany({
        where: (jobs, { and, eq, like }) => {
            const filters = [];
            
            if (location) filters.push(eq(jobs.location, location));
            if (category) filters.push(eq(jobs.category, category));
            if (search) {
                const s = `%${search}%`;
                    filters.push(
                    or(
                        like(jobs.title, s),
                        like(jobs.category, s), // Added this so searching "Product" works too
                        like(jobs.location, s), // Added this so searching "Lagos" works too
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
