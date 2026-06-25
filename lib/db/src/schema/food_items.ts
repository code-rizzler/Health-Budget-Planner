import { pgTable, serial, text, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const foodItemsTable = pgTable("food_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  pricePerUnit: real("price_per_unit").notNull(),
  unit: text("unit").notNull(),
  calories: real("calories").notNull(),
  protein: real("protein").notNull(),
  carbs: real("carbs").notNull(),
  fat: real("fat").notNull(),
  dietType: text("diet_type").notNull().default("Veg"),
});

export const insertFoodItemSchema = createInsertSchema(foodItemsTable).omit({ id: true });
export type InsertFoodItem = z.infer<typeof insertFoodItemSchema>;
export type FoodItem = typeof foodItemsTable.$inferSelect;
