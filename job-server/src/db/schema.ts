import { integer,sqliteTable,text,real,primaryKey} from "drizzle-orm/sqlite-core";
import { relations } from 'drizzle-orm';

export const users = sqliteTable("users", {
  id: integer().primaryKey(),
  name: text().notNull(),
  password: text().notNull(),
  email: text().notNull().unique(),
  number: text().notNull(),
  role:text().notNull(),
  resetToken: text('reset_token'),
  resetExpires: integer('reset_expires'),
});

export const jobs = sqliteTable('jobs', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    company: text('company').notNull(),
    location: text('location').notNull(),
    description: text('description').notNull(),
    salary: text('salary'),
    category: text('category').notNull(),
    jobType: text('job_type').notNull(),
    link: text('link'),
    
    // The foreign key linking to users.id
    employeeId: integer('employee_id')
        .notNull()
        .references(() => users.id),
    
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Defining the connections
export const jobsRelations = relations(jobs, ({ one }) => ({
    author: one(users, {
        fields: [jobs.employeeId],
        references: [users.id],
    }),
}));

export const usersRelations = relations(users, ({ many }) => ({
    postedJobs: many(jobs),
}));