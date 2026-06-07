import {Context, Hono} from 'Hono'
import {HonoEnv} from '../../types'
import {createDb} from '../../db/index'
import { and, or, eq, like } from 'drizzle-orm';
import { categories, jobs } from '../../db/schema';
import { count } from 'drizzle-orm';


export class JobsService{
    // Create a Job
//    static async create(c: Context<HonoEnv>, payload: any) {

//     console.log(payload)
//     const db = createDb(c.env.DB);
//     const user = c.get('user');

//     if (!user) {
//         throw new Error('User context missing');
//     }

//     // Allow any authenticated user to create jobs

//     // 🟢 DATA CLEANUP: 
//     // The frontend sends categoryId as a string from the <select> value.
//     // We must ensure it's a number and remove the old 'category' string if it's in the payload.
//     const { id, category, categoryId, ...restOfPayload } = payload;


//     try {
//         const categoryId = Number(payload.categoryId);

//         const result = await db.insert(jobs).values({
//             title: payload.title,
//             company: payload.company,
//             location: payload.location,
//             description: payload.description,
//             salary: payload.salary || null,
//             jobType: payload.jobType,
//             link: payload.link || null,
//             categoryId: categoryId,
//             employeeId: user.id,
           
//             isFeatured: payload.isFeatured ? 1 : 0,
//         }).returning();

//         console.log("✅ Insert result:", result);
//         return result[0];
//     } catch (dbError: any) {
//         console.error("🔴 Database error during insert:", dbError);
//         console.error("Error message:", dbError.message);
//         console.error("Error cause:", dbError.cause);
//         throw dbError;
//     }
//     }

// static async create(c: Context<HonoEnv>, payload: any) {
//     const db = createDb(c.env.DB);
//     const user = c.get('user');

//     if (!user) {
//         throw new Error('User context missing');
//     }

//     // 1. Destructure to POSITIVELY EXCLUDE the 'id' and 'category' string
//     // We also pull out categoryId here so we can re-format it
//     const { id, category, categoryId: rawCategoryId, ...restOfPayload } = payload;

//     try {
//         // 2. Explicitly format values
//         const finalCategoryId = Number(rawCategoryId);

//         const result = await db.insert(jobs).values({
//             ...restOfPayload, // Spreads remaining fields (title, company, etc.)
//             categoryId: finalCategoryId,
//             employeeId: user.id,
//             // Ensure D1 receives 1/0 for boolean modes
//             isFeatured: payload.isFeatured ? 1 : 0,
//             paymentStatus: 0, 
//             status: 'pending',
//         }).returning();

//         console.log("✅ Insert result:", result);
//         return result[0];
//     } catch (dbError: any) {
//         console.error("🔴 Database error during insert:", dbError.message);
//         throw dbError;
//     }
// }


static async create(c: Context<HonoEnv>, payload: any) {
    const db = createDb(c.env.DB);
    
    // The Route already cleaned this, so just insert it directly.
    // We EXPLICITLY list the keys here to prevent ANY 'id' from leaking in.
    try {
        const result = await db.insert(jobs).values({
            title: payload.title,
            company: payload.company,
            location: payload.location,
            description: payload.description,
            salary: payload.salary,
            categoryId: payload.categoryId,
            jobType: payload.jobType,
            link: payload.link,
            employeeId: payload.employeeId,
            status: payload.status || 'pending',
            isFeatured: payload.isFeatured || 0,
            paymentStatus: payload.paymentStatus || 0,
        }).returning();

        return result[0];
    } catch (dbError: any) {
        console.error("🔴 D1 Insert Error:", dbError.message);
        throw dbError;
    }
}


// static async getAll(c: Context<HonoEnv>) {
//     const db = createDb(c.env.DB);
    
//     // 1. Notice we use 'categoryId' here if you want to filter by ID
//     const { location, categoryId, search } = c.req.query();

//     return await db.query.jobs.findMany({
//         where: (jobs, { and, eq, like, or }) => {
//             const filters = [];
            
//             if (location) filters.push(like(jobs.location, `%${location}%`));
            
//             // 2. Filter by the new integer categoryId
//             if (categoryId) filters.push(eq(jobs.categoryId, Number(categoryId)));

//             if (search) {
//                 const s = `%${search}%`;
//                 filters.push(
//                     or(
//                         like(jobs.title, s),
//                         like(jobs.company, s),
//                         like(jobs.jobType, s),
//                         like(jobs.description, s)
//                     )
//                 );
//             }
                        
//             return filters.length > 0 ? and(...filters) : undefined;
//         },
//         with: {
//             // 3. CRITICAL: Include the category details in the response
//             category: true, 
//             author: {
//                 columns: { name: true, email: true }
//             }
//         },
//         orderBy: (job, { desc }) => [
//             desc(job.isFeatured), 
//             desc(job.createdAt)
//         ]
//     });
// }


static async getAll(c: Context<HonoEnv>) {
    const db = createDb(c.env.DB);
    const { location, categoryId, search, status } = c.req.query(); // Added status here

    return await db.query.jobs.findMany({
        where: (jobs, { and, eq, like, or }) => {
            const filters = [];
            
            if (location) filters.push(like(jobs.location, `%${location}%`));
            if (categoryId) filters.push(eq(jobs.categoryId, Number(categoryId)));
            
            // NEW: If a status is provided (like 'pending'), filter by it.
            // If NO status is provided, you might want to default to 'active' 
            // for the public but 'all' for the admin.
            if (status) {
    // 2. Cast the status to the specific type your schema expects
                filters.push(eq(jobs.status, status as 'pending' | 'active' | 'rejected'));
            
            } else {
                // Default behavior for the public home page
                
                filters.push(eq(jobs.status, 'active'));
            }

            if (search) {
                const s = `%${search}%`;
                filters.push(or(
                    like(jobs.title, s),
                    like(jobs.company, s),
                    like(jobs.jobType, s),
                    like(jobs.description, s)
                ));
            }
                        
            return filters.length > 0 ? and(...filters) : undefined;
        },
        with: {
            category: true, 
            author: {
                columns: { name: true, email: true }
            }
        },
        orderBy: (job, { desc }) => [
            desc(job.isFeatured), 
            desc(job.createdAt)
        ]
    });
}


//     static async getById(c: Context<HonoEnv>, id: number) {
//     const db = createDb(c.env.DB);

//     const job = await db.query.jobs.findFirst({
//         where: (jobs, { eq }) => eq(jobs.id, Number(id)),
//         with: {
//             // 🟢 Add this to get the name and icon for the details page
//             category: true, 
//             author: {
//                 columns: { name: true, email: true }
//             }
//         }
//     });

//     if (!job) {
//         throw new Error('Job not found');
//     }

//     return job;
// }


static async getById(c: Context<HonoEnv>, id: string | number) {
    const db = createDb(c.env.DB);
    const jobId = Number(id);

    if (isNaN(jobId)) {
        throw new Error('Invalid Job ID');
    }

    const job = await db.query.jobs.findFirst({
        where: (jobs, { eq }) => eq(jobs.id, jobId),
        with: {
            category: true, 
            author: {
                columns: { 
                    name: true, 
                    email: true,
                    number: true // Added this in case you want to show contact info
                }
            }
        }
    });

    if (!job) {
        // Use Hono's context to return a proper 404 instead of a generic Error
        return c.json({ error: 'Job not found' }, 404);
    }

    return job;
}


static async getByUserId(c: Context<HonoEnv>, userId: number) {
    const db = createDb(c.env.DB);
    
    return await db.query.jobs.findMany({
        where: (jobs, { eq }) => eq(jobs.employeeId, userId),
        orderBy: (jobs, { desc }) => [desc(jobs.id)]
    });
}


static async getCategoryStats(c: Context) {
  const db = createDb(c.env.DB);
  
  const stats = await db
    .select({
      id: categories.id,
      name: categories.name,
      icon: categories.icon,
      slug: categories.slug,
      count: count(jobs.id),
    })
    .from(categories)
    // We join so we can count jobs linked to each category
    .leftJoin(jobs, eq(categories.id, jobs.categoryId)) 
    .groupBy(categories.id);

  return stats; 
}

    static async getManageable(c: Context<HonoEnv>) {
    const db = createDb(c.env.DB);
    const user = c.get('user');

    if (!user) {
        throw new Error('Unauthorized');
    }

    return await db.query.jobs.findMany({
        where: (jobs, { eq }) => {
            // Admin sees everything; Employees see only their own posts
            return user.role === 'admin' 
                ? undefined 
                : eq(jobs.employeeId, user.id);
        },
        with: {
            // 🟢 Pull in Category so the Dashboard shows "Technology" instead of "1"
            category: true, 
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

    

    static async update(c: Context<HonoEnv>, id: number, payload: any) {
    const db = createDb(c.env.DB);
    const user = c.get('user');

    if (!user) {
        throw new Error('Unauthorized: User context missing');
    }

    const job = await db.query.jobs.findFirst({
        where: (jobs, { eq }) => eq(jobs.id, Number(id)),
    });

    if (!job) {
        throw new Error('Job not found');
    }

    // Guard rails check
    const isAdmin = user.role?.toLowerCase() === 'admin';
    const isOwner = job.employeeId === user.id;
    if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized: Access denied');
    }

    // 🟢 THE BULLETPROOF PAYLOAD FUSION:
    // If the frontend passed values inside 'updates', flatten them into the main object!
    const incomingData = payload.updates ? { ...payload, ...payload.updates } : payload;

    // Debugging logs to verify exactly what values hit your cloudflare terminal wrangler logs
    console.log("👉 FINAL UNPACKED BACKEND PAYLOAD:", incomingData);

    // Extract fields safely
    const { category, categoryId, isFeatured, paymentStatus, featuredUntil, ...updateData } = incomingData;

    // Map your write states safely using clean conditional evaluation fallbacks
    const result = await db
    .update(jobs)
    .set({
        ...updateData,
        status: incomingData.status !== undefined ? incomingData.status : job.status,
        
        // Handle numeric conversion for the relation key safely
        ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
        
        // 🟢 FIX 1: Pass native JavaScript Date objects or null cleanly
        ...(featuredUntil !== undefined && { 
            featuredUntil: featuredUntil ? new Date(featuredUntil) : null 
        }),
        
        // 🟢 FIX 2: Evaluate fields to true/false booleans to satisfy Drizzle columns schema mapping
        ...(paymentStatus !== undefined && { 
            paymentStatus: (paymentStatus === 1 || paymentStatus === 'paid' || paymentStatus === true) 
        }),
        
        ...(isFeatured !== undefined && { 
            isFeatured: (isFeatured === 1 || isFeatured === 'paid' || isFeatured === true) 
        }),
    })
    .where(eq(jobs.id, Number(id)))
    .returning();

    return result[0];
}

}
