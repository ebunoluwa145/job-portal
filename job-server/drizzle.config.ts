// import type {Config} from "drizzle-kit"

// export default {
//     schema: './src/db/schema.ts',
//     out:'./migrations',
//     dialect:'sqlite',
//     driver:'d1-http',
// } satisfies Config



import type { Config } from "drizzle-kit";

// Check if we are deliberately running a remote production command
const isRemote = process.env.DB_REMOTE === "true";

export default (isRemote 
    ? {
        // ☁️ Staging / Production Cloud Setup
        schema: './src/db/schema.ts',
        out: './migrations',
        dialect: 'sqlite',
        driver: 'd1-http',
      }
    : {
        // 💻 Localhost Machine Testing Setup
        schema: './src/db/schema.ts',
        out: './migrations',
        dialect: 'sqlite',
        dbCredentials: {
            url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/db.sqlite',
        },
      }
) satisfies Config;