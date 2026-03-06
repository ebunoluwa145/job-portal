
import { Context } from 'hono';
import { HonoEnv } from '../../types';
import * as bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';
import { users, createDb, eq } from '../../db/index';
import crypto from 'crypto';
import { and, gt } from 'drizzle-orm';

export class AuthService {
    // register new user
    // static async register(c: Context<HonoEnv>, payload: any) {
    //     const db = createDb(c.env.DB);

    //     try {
    //         const { name, email, password, number, role } = payload;

    //         // check if user exists
    //         const existing = await db.query.users.findFirst({
    //             where: eq(users.email, email)
    //         });

    //         if (existing) {
    //             return c.json({ success: false, message: 'User already exists' }, 400);
    //         }

    //         // hash password
    //         const salt = await bcrypt.genSalt(10);
    //         const hash = await bcrypt.hash(password, salt);

    //         // insert users 
    //         // NOTE: We removed the manual ID generation because your schema 
    //         // likely uses auto-incrementing integers.
    //         await db.insert(users).values({
    //             email: email,
    //             name: name,
    //             password: hash,
    //             number: number,
    //             role: role || 'user',
    //         });

    //         console.log("User created successfully");
    //         return c.json({ success: true, message: "User created successfully" }, 201);
            

    //     } catch (err: any) {
    //         console.log("Registration Error:", err);
    //         return c.json({ success: false, message: err.message }, 500);
    //     }
    // }

    static async register(c: Context<HonoEnv>, payload: any) {
    const db = createDb(c.env.DB);

    try {
        const { name, email, password, number, role } = payload;

        // 1. Check if user already exists
        const existing = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (existing) {
            return c.json({ success: false, message: 'User already exists' }, 400);
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // 3. Insert into the database
        await db.insert(users).values({
            email,
            name,
            password: hash,
            number,
            role: role || 'user',
        });

        // 4. FETCH the user we just created to get the auto-generated ID
        const newUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!newUser) throw new Error("Verification failed after user creation");

        // 5. GENERATE the JWT Token immediately
        const token = await sign(
            {
                id: newUser.id,
                role: newUser.role,
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
            },
            c.env.JWT_SECRET as string,
            'HS256'
        );

        console.log("User created and logged in automatically:", newUser.email);
        
        // 6. Return EVERYTHING the frontend needs to stay logged in
        return c.json({ 
            success: true, 
            message: "User created successfully",
            token: token,
            user: {
                id: newUser.id,
                name: newUser.name,
                role: newUser.role
            }
        }, 201);

    } catch (err: any) {
        // console.log("Registration Error:", err);
        // return c.json({ success: false, message: err.message }, 500);
        console.log("Detailed DB Error:", err); // Look at your SERVER terminal for this
    return c.json({ 
        success: false, 
        message: err.message || "Database error",
        debug: err // This will help us see the exact constraint that failed
    }, 400);
    }
}

    // login user
    // Inside AuthService.ts
static async login(c: Context<HonoEnv>, payload: any) {
    const { email, password } = payload;
    const db = createDb(c.env.DB);

    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    // Don't return c.json. Throw instead!
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
    }

    if (!c.env.JWT_SECRET) throw new Error("Server configuration error");

    const token = await sign(
        {
            id: user.id,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
        },
        c.env.JWT_SECRET as string, 
        'HS256'
    );

    // Return just the raw data object
    return {
        token,
        user: { id: user.id, role: user.role, name: user.name }
    };
}
    //forgot password 
   static async forgotPassword(c: Context<HonoEnv>, payload: any) {
    const db = createDb(c.env.DB);
    const { email } = payload;
    
    console.log(`[1/3] Forgot password request received for: ${email}`);

    if (!email) return c.json({ success: false, message: "Email is required" }, 400);

    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user) {
        console.log(`[!] User not found in DB for email: ${email}`);
        return c.json({ success: false, message: "User not found" }, 404);
    }

    // Generate reset token and expiry
    const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
    
    const expiry = Math.floor(Date.now() / 1000) + (60 * 60);

    // [2/3] LOG THE TOKEN HERE
    console.log(`[2/3] Token Generated: ${token} (Expires at: ${expiry})`);

    await db.update(users)
        .set({ resetToken: token, resetExpires: expiry })
        .where(eq(users.id, user.id));

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Aventon Jobs <onboarding@resend.dev>',
                to: [email],
                subject: 'Reset your Aventon Password',
                html: `<p>Reset link: <a href="${resetLink}">${resetLink}</a></p>`,
            }),
        });

        const emailResult = await emailResponse.json();
        // [3/3] LOG THE EMAIL STATUS
        console.log(`[3/3] Resend API Response:`, emailResult);

    } catch (error) {
        console.error("CRITICAL: Email failed to fire:", error);
    }

    return c.json({ success: true, message: "Check your email", token });
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