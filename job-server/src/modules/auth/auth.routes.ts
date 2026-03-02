import { Hono } from 'hono';
import { HonoEnv } from '../../types';
import { validate, getValidData } from '../../middleware/validate';
import { AuthService } from './auth.service';
import { LoginSchema, RegisterSchema } from './auth.schema';

const authRoutes = new Hono<HonoEnv>();

// POST /api/auth/register
authRoutes.post('/register', validate('json', RegisterSchema), async (c) => {
    try {
        const body = getValidData(c);

        // Basic Validation
        if (!body.email || !body.password || !body.name || !body.role) {
            return c.json({ error: 'Missing fields' }, 400);
        }
        console.log(body.role)

        // const result = await AuthService.register(c, body);
        return await AuthService.register(c, body);
        // if (result instanceof Error) {
        //     return c.json({ success: false, error: result.message }, 400);
        // }

        // return c.json({ success: true, message: 'User registered successfully' });
    } catch (err: any) {
        return c.json({ success: false, error: err.message }, 400);
    }
});

// POST /api/auth/login
authRoutes.post('/login', validate('json', LoginSchema), async (c) => {
    try {
        // const body = await c.req.json();
        const body = getValidData(c);

        if (!body.email || !body.password) {
            return c.json({ error: 'Missing fields' }, 400);
        }

        return await AuthService.login(c, body);

        // const result = await AuthService.login(c, body);
        // return c.json({ success: true, data: result });
    } catch (err: any) {
        return c.json({ success: false, error: err.message }, 401);
    }
});

// auth.routes.ts
// authRoutes.post('/forgot-password', async (c) => {
//     const { email } = await c.req.json();
//     return await AuthService.forgotPassword(c, email);
// });

authRoutes.post('/forgot-password', async (c) => {
    const body = await c.req.json(); // Don't destructure here
    return await AuthService.forgotPassword(c, body); // Pass { email: "..." }
});

authRoutes.post('/reset-password', async (c) => {
    const payload = await c.req.json();
    return await AuthService.resetPassword(c, payload);
});

export { authRoutes };