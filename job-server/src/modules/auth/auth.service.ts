
import { Context } from 'hono';
import { HonoEnv } from '../../types';
import * as bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';
import { users, createDb, eq } from '../../db/index';
import crypto from 'crypto';
import { and, gt } from 'drizzle-orm';

export class AuthService {
    // register new user
    static async register(c: Context<HonoEnv>, payload: any) {
        const db = createDb(c.env.DB);

        try {
            const { name, email, password, number, role } = payload;

            // check if user exists
            const existing = await db.query.users.findFirst({
                where: eq(users.email, email)
            });

            if (existing) {
                return c.json({ success: false, message: 'User already exists' }, 400);
            }

            // hash password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            // insert users 
            // NOTE: We removed the manual ID generation because your schema 
            // likely uses auto-incrementing integers.
            await db.insert(users).values({
                email: email,
                name: name,
                password: hash,
                number: number,
                role: role || 'user',
            });

            console.log("User created successfully");
            return c.json({ success: true, message: "User created successfully" }, 201);

        } catch (err: any) {
            console.log("Registration Error:", err);
            return c.json({ success: false, message: err.message }, 500);
        }
    }

    // login user
    static async login(c: Context<HonoEnv>, payload: any) {
        try {
            const { email, password } = payload;
            const db = createDb(c.env.DB);

            // 1. Get user
            const user = await db.query.users.findFirst({
                where: eq(users.email, email)
            });

            // 2. Validate user existence
            if (!user) {
                return c.json({ success: false, message: "Invalid credentials" }, 401);
            }

            // 3. Compare Password
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return c.json({ success: false, message: "Invalid credentials" }, 401);
            }

            // 4. Verify JWT_SECRET exists
            if (!c.env.JWT_SECRET) {
                console.error("Missing JWT_SECRET in environment");
                return c.json({ success: false, message: "Server configuration error" }, 500);
            }

            console.log(user)
            // 5. Generate Token
            const token = await sign(
                {
                    id: user.id,
                    role: user.role,
                    // Token expires in 24 hours
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
                },
                c.env.JWT_SECRET as string, 
    'HS256' as "HS256"
            );

            // 6. Return Success with Token
            return c.json({
                success: true,
                token: token,
                user: {
                    id: user.id,
                    role: user.role,
                    name: user.name
                }
            });

        } catch (err: any) {
            console.log("Login Error:", err);
            return c.json({ success: false, message: "Internal Server Error" }, 500);
        }
    }

    //forgot password 
    static async forgotPassword(c: Context<HonoEnv>, payload: any) {
        const db = createDb(c.env.DB);
        const {email } = payload;
        

        if (!email) {
            // console.log(email)
            return c.json({ success: false, message: "Email is required" }, 400);
        }

        const user = await db.query.users.findFirst({
            where: eq(users.email, payload.email)
        });

        if (!user) {
            return c.json({ success: false, message: "User not found" }, 404);
        }

        // Generate reset token and expiry
        const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
    
        const expiry = Math.floor(Date.now() / 1000) + (60 * 60);

        await db.update(users)
    .set({ 
        resetToken: token, 
        resetExpires: expiry // TypeScript will be happy now
    })
    .where(eq(users.id, user.id));

   console.log(`DEBUG: Reset Token for ${email} is: ${token}`);

    return c.json({ 
        success: true, 
        message: "Reset token generated. Check server logs.",
        token: token // We send it back now just for your testing
    });


    }

    // AuthService.ts


static async resetPassword(c: Context<HonoEnv>, payload: any) {
    const { token, newPassword } = payload;
    const db = createDb(c.env.DB);
    const now = new Date().getTime();

    // Find a user where the token matches AND the expiry date is in the future
    const user = await db.query.users.findFirst({
        where: (users, { eq, and, gt }) => and(
            eq(users.resetToken, token),
            gt(users.resetExpires, Math.floor(now / 1000)) // Checks if expiry > now (converted to seconds)
        )
    });

    if (!user) {
        return c.json({ success: false, message: "Invalid or expired token" }, 400);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and wipe the token fields so they can't be used again
    await db.update(users)
        .set({ 
            password: hashedPassword, 
            resetToken: null, 
            resetExpires: null 
        })
        .where(eq(users.id, user.id));

    return c.json({ success: true, message: "Password updated! You can now log in." });
}
}