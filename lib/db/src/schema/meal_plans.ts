import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mealPlansTable = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  mealsPerDay: integer("meals_per_day").notNull(),
  dailyCalories: integer("daily_calories").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMealPlanSchema = createInsertSchema(mealPlansTable).omit({ id: true, createdAt: true });
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type MealPlan = typeof mealPlansTable.$inferSelect;

export const mealItemsTable = pgTable("meal_items", {
  id: serial("id").primaryKey(),
  mealPlanId: integer("meal_plan_id").notNull().references(() => mealPlansTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  calories: integer("calories").notNull(),
  mealNumber: integer("meal_number").notNull(),
  ingredients: text("ingredients").notNull(),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fat: integer("fat"),
});

export const insertMealItemSchema = createInsertSchema(mealItemsTable).omit({ id: true });
export type InsertMealItem = z.infer<typeof insertMealItemSchema>;
export type MealItem = typeof mealItemsTable.$inferSelect;
