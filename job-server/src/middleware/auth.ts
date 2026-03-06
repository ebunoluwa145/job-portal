
import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { HonoEnv } from '../types';
import { getCookie } from 'hono/cookie';

export const authMiddleware = async (c: Context<HonoEnv>, next: Next) => {
    // const authHeader = c.req.header('Authorization');

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return c.json({ error: 'Unauthorized: No token provided' }, 401);
    // }

    const token = getCookie(c, 'token');

    if (!token) {
        return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }


    try {
        const algorithm = 'HS256' as const;
        const payload = await verify(token, c.env.JWT_SECRET as string, 'HS256' as 'HS256');

        // Attach user info to the context so other routes can use it
        c.set('user', {
            id: payload.id as number,
            role: payload.role as string
        });

        await next();
    } catch (err) {
        return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
};
