import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export interface MealDetail {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  cookingTime: number;
  recipeId: number | null;
}

export interface DayMeal {
  day: number;
  date: string;
  breakfast: MealDetail;
  lunch: MealDetail;
  dinner: MealDetail;
  snacks: MealDetail[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export const mealPlansTable = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  days: jsonb("days").$type<DayMeal[]>().notNull().default([]),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export type MealPlan = typeof mealPlansTable.$inferSelect;
