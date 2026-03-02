import * as v from 'valibot';

//login 

export const LoginSchema = v.object({
    email: v.pipe(v.string(), v.email("Invalid email format")),
    password : v.pipe(v.string(), v.minLength(1, "Password is required"))
    
})

//register
export const RegisterSchema = v.pipe(
    v.object({
        name: v.pipe(v.string(), v.minLength(2, "Name must be at least 2 chars")),
        email: v.pipe(v.string(), v.email("Invalid email format")),
        password: v.pipe(v.string(), v.minLength(6, "Password must be at least 6 chars")),
        number: v.optional(v.pipe(v.string(), v.trim(), v.regex(/^\+?[0-9]{10,15}$/, "Invalid phone format"))),
        role :v.optional(v.picklist(['user', 'employee', 'admin']), 'user'),
        
    

        // Optional Companny Fields
        is_company: v.optional(v.boolean()),
        company_name: v.optional(v.string()),
        company_address: v.optional(v.string()),
        company_location: v.optional(v.string()),
        company_details: v.optional(v.string()),
    }),

    // Cross-field validation (Job Post Logic)
    v.check((input) => {
        if (input.is_company) {
            return !!input.company_name && !!input.company_address;
        }
        return true;
    }, "Company name and address are required to Post Jobs")
)