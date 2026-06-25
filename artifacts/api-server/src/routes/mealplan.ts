import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { db, mealPlansTable, profilesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { generateMealPlan } from "../lib/planner";
import type { DayMeal } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [plan] = await db.select().from(mealPlansTable)
      .where(eq(mealPlansTable.clerkUserId, clerkUserId))
      .orderBy(desc(mealPlansTable.generatedAt))
      .limit(1);
    if (!plan) { res.status(404).json({ error: "No meal plan" }); return; }
    res.json({ ...plan, generatedAt: plan.generatedAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "Failed to get meal plan");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/generate", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.clerkUserId, clerkUserId));
    if (!profile) { res.status(400).json({ error: "Complete your profile first" }); return; }

    const days = generateMealPlan(profile);
    const [plan] = await db.insert(mealPlansTable).values({ clerkUserId, days }).returning();

    res.json({ ...plan, generatedAt: plan!.generatedAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "Failed to generate meal plan");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/today", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [plan] = await db.select().from(mealPlansTable)
      .where(eq(mealPlansTable.clerkUserId, clerkUserId))
      .orderBy(desc(mealPlansTable.generatedAt))
      .limit(1);
    if (!plan || !plan.days.length) {
      res.json({
        day: 1,
        date: new Date().toISOString().split("T")[0],
        breakfast: { name: "No plan yet", calories: 0, protein: 0, carbs: 0, fat: 0, cookingTime: 0, recipeId: null },
        lunch: { name: "No plan yet", calories: 0, protein: 0, carbs: 0, fat: 0, cookingTime: 0, recipeId: null },
        dinner: { name: "No plan yet", calories: 0, protein: 0, carbs: 0, fat: 0, cookingTime: 0, recipeId: null },
        snacks: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      });
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const todayDay: DayMeal = plan.days.find((d: DayMeal) => d.date === today) ?? plan.days[0];
    res.json(todayDay);
  } catch (err) {
    logger.error({ err }, "Failed to get today's meals");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
