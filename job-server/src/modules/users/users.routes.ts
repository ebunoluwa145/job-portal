// job-server/src/modules/users/users.routes.ts
import { Hono } from 'hono';
import { HonoEnv } from '../../types';
import { authMiddleware } from '../../middleware/auth';
import { UserService } from './users.service';

const userRouter = new Hono<HonoEnv>();

// Apply auth to all user routes
userRouter.use('*', authMiddleware);

// GET /api/users
userRouter.get('/', async (c) => {
    const user = c.get('user');
    if (user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);

    const data = await UserService.getAll(c);
    return c.json({ data });
});

// DELETE /api/users/:id
userRouter.delete('/:id', async (c) => {
    const user = c.get('user');
    if (user?.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);

    const id = Number(c.req.param('id'));
    await UserService.delete(c, id);
    return c.json({ message: 'User deleted' });
});

export { userRouter };