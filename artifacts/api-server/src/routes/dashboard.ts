import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { db, profilesTable, groceryPlansTable, mealPlansTable, expensesTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import type { DayMeal } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

router.get("/summary", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.clerkUserId, clerkUserId));
    const [mealPlan] = await db.select().from(mealPlansTable)
      .where(eq(mealPlansTable.clerkUserId, clerkUserId))
      .orderBy(desc(mealPlansTable.generatedAt)).limit(1);
    const [groceryPlan] = await db.select().from(groceryPlansTable)
      .where(eq(groceryPlansTable.clerkUserId, clerkUserId))
      .orderBy(desc(groceryPlansTable.generatedAt)).limit(1);
    const [expResult] = await db
      .select({ total: sql<number>`coalesce(sum(${expensesTable.amount}),0)` })
      .from(expensesTable)
      .where(eq(expensesTable.clerkUserId, clerkUserId));

    const todayStr = new Date().toISOString().split("T")[0];
    const todayMeal = mealPlan?.days?.find((d: DayMeal) => d.date === todayStr) ?? mealPlan?.days?.[0];
    const budgetSpent = Number(expResult?.total ?? 0);
    const monthlyBudget = profile?.monthlyBudget ?? 0;

    res.json({
      todayCalories: todayMeal?.totalCalories ?? 0,
      todayProtein: todayMeal?.totalProtein ?? 0,
      monthlyBudget,
      budgetSpent,
      budgetRemaining: monthlyBudget - budgetSpent,
      groceryItemsCount: groceryPlan?.items?.length ?? 0,
      mealPlanGenerated: !!mealPlan,
      groceryPlanGenerated: !!groceryPlan,
    });
  } catch (err) {
    logger.error({ err }, "Failed to get dashboard summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [mealPlan] = await db.select().from(mealPlansTable)
      .where(eq(mealPlansTable.clerkUserId, clerkUserId))
      .orderBy(desc(mealPlansTable.generatedAt)).limit(1);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyNutrition = dayNames.map((day, i) => {
      const planDay: DayMeal | undefined = mealPlan?.days?.[i];
      return {
        day,
        calories: planDay?.totalCalories ?? 0,
        protein: planDay?.totalProtein ?? 0,
        carbs: planDay?.totalCarbs ?? 0,
        fat: planDay?.totalFat ?? 0,
      };
    });

    const expenses = await db.select().from(expensesTable)
      .where(eq(expensesTable.clerkUserId, clerkUserId));

    const weekMap = new Map<string, number>();
    for (const e of expenses) {
      const d = new Date(e.date);
      const weekNum = Math.ceil(d.getDate() / 7);
      const key = `Week ${weekNum}`;
      weekMap.set(key, (weekMap.get(key) ?? 0) + e.amount);
    }
    const weeklyExpenses = ["Week 1", "Week 2", "Week 3", "Week 4"].map(w => ({
      week: w,
      amount: Math.round((weekMap.get(w) ?? 0) * 100) / 100,
    }));

    res.json({ weeklyNutrition, weeklyExpenses });
  } catch (err) {
    logger.error({ err }, "Failed to get analytics");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
