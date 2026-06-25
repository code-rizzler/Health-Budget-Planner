import { pgTable, serial, text, real, jsonb, timestamp } from "drizzle-orm/pg-core";

export interface GroceryItem {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  category: string;
}

export const groceryPlansTable = pgTable("grocery_plans", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  items: jsonb("items").$type<GroceryItem[]>().notNull().default([]),
  totalCost: real("total_cost").notNull().default(0),
  remainingBudget: real("remaining_budget").notNull().default(0),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export type GroceryPlan = typeof groceryPlansTable.$inferSelect;
