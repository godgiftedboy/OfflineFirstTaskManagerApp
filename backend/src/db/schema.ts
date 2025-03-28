
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Use Zod if:

// You want to validate data before inserting it (e.g., checking for a valid email format).
// You need custom error messages.
// You're building an API and want to return user-friendly validation errors.
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
})


export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert