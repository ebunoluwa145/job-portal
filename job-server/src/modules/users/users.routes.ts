// // job-server/src/modules/users/users.routes.ts
// import { Hono } from 'hono';
// import { HonoEnv } from '../../types';
// import { authMiddleware } from '../../middleware/auth';
// import { UserService } from './users.service';

// const userRouter = new Hono<HonoEnv>();

// // Apply auth to all user routes
// // src/modules/users/users.routes.ts

// // 1. GET Current User (For Profile Settings)
// userRouter.get('/me', async (c) => {
//     const user = c.get('user');
//     if (!user) return c.json({ error: 'User not found' }, 404);
//     const userData = await UserService.getById(c, user.id);
    
//     return c.json({ data: userData });
// });

// // 2. PATCH Current User (Self-Update)
// userRouter.patch('/me', async (c) => {
//     const user = c.get('user');
//         if (!user) return c.json({ error: 'User not found' }, 404);
//     const body = await c.req.json();
    
//     // Safety check: Only update non-sensitive fields
//     const cleanData = {
//         name: body.name,
//         number: body.number
//     };
    
//     const result = await UserService.update(c, user.id, cleanData);
//     return c.json({ success: true, data: result[0] });
// });

// // 3. ADMIN ONLY: Get All Users
// userRouter.get('/', async (c) => {
//     const user = c.get('user');
//     if (user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
//     const data = await UserService.getAll(c);
//     return c.json({ data });
// });

// // 4. ADMIN ONLY: Get Specific User (For the Admin Edit Page)
// userRouter.get('/:id', async (c) => {
//     const user = c.get('user');
//     if (user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
    
//     const id = Number(c.req.param('id'));
//     const userData = await UserService.getById(c, id);
//     return c.json({ data: userData });
// });

// // 5. ADMIN ONLY: Delete User
// userRouter.delete('/:id', async (c) => {
//     const user = c.get('user');
//     if (user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);

//     const id = Number(c.req.param('id'));
//     await UserService.delete(c, id);
//     return c.json({ message: 'User deleted' });
// });

// export { userRouter };


// job-server/src/modules/users/users.routes.ts
import { Hono } from 'hono';
import { HonoEnv } from '../../types';
import { authMiddleware } from '../../middleware/auth';
import { UserService } from './users.service';

const userRouter = new Hono<HonoEnv>();

// 🟢 CRITICAL: Apply auth to EVERY route in this file
userRouter.use('*', authMiddleware);

// 🟢 1. MOVE /me TO THE TOP
// This ensures 'me' isn't confused with an ':id' or the root '/'
userRouter.get('/me', async (c) => {
    const user = c.get('user');
    if (!user) return c.json({ error: 'Unauthorized' }, 401);
    
    const userData = await UserService.getById(c, user.id);
    return c.json({ data: userData });
});

// 🟢 2. PATCH /me
userRouter.patch('/me', async (c) => {
    const user = c.get('user');
    if (!user) return c.json({ error: 'Unauthorized' }, 401);
    
    const body = await c.req.json();
    const cleanData = {
        name: body.name,
        number: body.number
    };
    
    const result = await UserService.update(c, user.id, cleanData);
    return c.json({ success: true, data: result[0] });
});

// 🔴 3. ADMIN ONLY: Get All Users (Root path '/')
userRouter.get('/', async (c) => {
    const user = c.get('user');
    // Log this to see why it's failing: console.log("Current User Role:", user?.role);
    if (user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
    
    const data = await UserService.getAll(c);
    return c.json({ data });
});

// 🔵 4. ADMIN ONLY: Specific ID
userRouter.get('/:id', async (c) => {
    const user = c.get('user');
    if (user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
    
    const id = Number(c.req.param('id'));
    const userData = await UserService.getById(c, id);
    return c.json({ data: userData });
});

// 🔴 5. ADMIN ONLY: Delete User
userRouter.delete('/:id', async (c) => {
    const user = c.get('user');
    if (user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);

    const id = Number(c.req.param('id'));
    await UserService.delete(c, id);
    return c.json({ message: 'User deleted' });
});

export { userRouter };