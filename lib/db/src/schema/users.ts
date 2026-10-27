import { pgTable, text, timestamp, boolean, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  allergies: json("allergies").$type<string[]>().default([]),
  highProteinMode: boolean("high_protein_mode").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
