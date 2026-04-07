import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const savedMealsTable = pgTable("saved_meals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  estimatedCalories: integer("estimated_calories").notNull(),
  ingredients: text("ingredients").notNull(),
  imageData: text("image_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSavedMealSchema = createInsertSchema(savedMealsTable).omit({ id: true, createdAt: true });
export type InsertSavedMeal = z.infer<typeof insertSavedMealSchema>;
export type SavedMeal = typeof savedMealsTable.$inferSelect;
