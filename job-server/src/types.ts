import { D1Database} from '@cloudflare/workers-types';

export type Bindings = {
    DB: D1Database;
    JWT_SECRET: string;
    RESEND_API_KEY: string;
    VITE_API_URL: string;
    NODE_ENV: 'development' | 'staging' | 'production';
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