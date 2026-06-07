import { Context, Next } from 'hono';
import { BaseSchema, safeParse } from 'valibot';

export const validate = (target: 'json' | 'form', schema: BaseSchema<any, any, any>) => {
    return async (c: Context, next: Next) => {
        try {
            let data;
            if (target === 'json') data = await c.req.json();
            else if (target === 'form') data = await c.req.parseBody();

            //Validate & Sanitize
            const result = safeParse(schema, data);

            if (!result.success) {

                const issues = result.issues.map((i) => ({
                    field: i.path?.map((p: any) => p.key).join('.') || 'unknown',
                    message: i.message,
                }));
                return c.json({ success: false, error: 'Validation Error', details: issues }, 400);
            }

            // Store sanitized data
            c.req.raw.validatedData = result.output;
            await next();
        } catch (err) {
            return c.json({ success: false, error: 'Invalid Request Format' }, 400);
        }
    };
};

export const getValidData = (c: Context) => c.req.raw.validatedData;

// Type hack to store data on request
declare global { interface Request { validatedData?: any; } }