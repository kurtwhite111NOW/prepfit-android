import { pgTable, text, real, serial, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const weightEntriesTable = pgTable("weight_entries", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  weight: real("weight").notNull(),
  unit: text("unit").notNull().default("lbs"),
  notes: text("notes"),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("weight_entries_user_id_idx").on(table.userId),
  index("weight_entries_user_id_recorded_at_idx").on(table.userId, table.recordedAt),
]);

export const insertWeightEntrySchema = createInsertSchema(weightEntriesTable).omit({
  id: true,
  recordedAt: true,
});

export type InsertWeightEntry = z.infer<typeof insertWeightEntrySchema>;
export type WeightEntry = typeof weightEntriesTable.$inferSelect;
