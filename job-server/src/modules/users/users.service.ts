// job-server/src/modules/users/users.service.ts
import { Context } from 'hono';
import { createDb } from '../../db/index';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { HonoEnv } from '../../types';

export class UserService {
    // Get all users (Admin only)
    static async getAll(c: Context<HonoEnv>) {
        const db = createDb(c.env.DB);
        
        // Fetch users but exclude sensitive data like passwords
        return await db.query.users.findMany({
            columns: {
                id: true,
                name: true,
                email: true,
                role: true,
                number: true,

            },
            orderBy: (users, { desc }) => [desc(users.id)]
        });
    }

    // Delete a user (Admin only)
    static async delete(c: Context<HonoEnv>, id: number) {
        const db = createDb(c.env.DB);
        return await db.delete(users).where(eq(users.id, id)).returning();
    }
}