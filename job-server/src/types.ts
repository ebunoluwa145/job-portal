import { D1Database} from '@cloudflare/workers-types';

export type Bindings = {
    DB: D1Database;
    JWT_SECRET: string;
    RESEND_API_KEY: string;
};

export type Variables = {
    user?: {
        id: number;
        role: string;
    };
};

export type HonoEnv = {
    Bindings: Bindings;
    Variables: Variables;
};