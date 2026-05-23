import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { jobs } from '../db/schema'; // Update with your actual schema import paths
import { createDb } from '../db';     // Update with your actual D1 init helper

export const webhookRouter = new Hono<{ Bindings: { DB: any; PAYSTACK_SECRET_KEY: string } }>();

webhookRouter.post('/paystack', async (c) => {
    const rawBody = await c.req.text();
    const paystackSignature = c.req.header('x-paystack-signature');

    if (!paystackSignature) {
        return c.text('Missing signature header', 401);
    }

    // Cryptographically verify that this request came strictly from Paystack
    const encoder = new TextEncoder();
    const keyData = encoder.encode(c.env.PAYSTACK_SECRET_KEY);
    const secretKey = await crypto.subtle.importKey(
        'raw', 
        keyData, 
        { name: 'HMAC', hash: 'SHA-512' }, 
        false, 
        ['verify']
    );

    const verified = await crypto.subtle.verify(
        'HMAC',
        secretKey,
        hexToBytes(paystackSignature),
        encoder.encode(rawBody)
    );

    if (!verified) {
        console.error('❌ CRITICAL: Paystack Webhook signature verification failed!');
        return c.text('Invalid signature verification', 401);
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
        const transactionData = event.data;
        const metadata = transactionData.metadata;

        const jobId = Number(metadata?.jobId);
        const duration = metadata?.duration; 

        if (!jobId || !duration) {
            console.warn('⚠️ Webhook received but missing jobId or duration metadata.');
            return c.text('Missing metadata', 200); 
        }

        // Calculate the expiration timestamp based on the plan purchased
        const targetDate = new Date();
        if (duration === '10min') {
            targetDate.setTime(targetDate.getTime() + 10 * 60 * 1000);
        } else if (duration === '1m') {
            targetDate.setMonth(targetDate.getMonth() + 1);
        } else if (duration === '3m') {
            targetDate.setMonth(targetDate.getMonth() + 3);
        } else if (duration === '6m') {
            targetDate.setMonth(targetDate.getMonth() + 6);
        }

       try {
    const db = createDb(c.env.DB);

    
    // Passing the actual native Date instance instead of an ISO string string 
    // satisfies Drizzle's internal schema properties layout perfectly!
    await db.update(jobs)
        .set({
            paymentStatus: true,     // Maps to 1 in SQLite
            isFeatured: true,        // Maps to 1 in SQLite
            status: 'active',        
            featuredUntil: targetDate // 💡 Pass the native Date object directly!
        })
        .where(eq(jobs.id, jobId));

    console.log(`✅ Job ID ${jobId} successfully activated via Paystack automated checkout!`);
} catch (error) {
    console.error('Database update failed during webhook handling:', error);
    return c.text('Internal Server Error', 500);
}
    }

    return c.text('Event Handled', 200);
});

function hexToBytes(hexString: string): Uint8Array {
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hexString.substring(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}