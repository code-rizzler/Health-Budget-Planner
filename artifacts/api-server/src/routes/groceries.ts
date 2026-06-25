import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { db, groceryPlansTable, profilesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { generateGroceryList } from "../lib/planner";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [plan] = await db.select().from(groceryPlansTable)
      .where(eq(groceryPlansTable.clerkUserId, clerkUserId))
      .orderBy(desc(groceryPlansTable.generatedAt))
      .limit(1);
    if (!plan) { res.status(404).json({ error: "No grocery plan" }); return; }
    res.json({ ...plan, generatedAt: plan.generatedAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "Failed to get grocery plan");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/generate", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.clerkUserId, clerkUserId));
    if (!profile) { res.status(400).json({ error: "Complete your profile first" }); return; }

    const items = generateGroceryList(profile);
    const totalCost = items.reduce((sum, i) => sum + i.estimatedCost, 0);
    const remainingBudget = profile.monthlyBudget - totalCost;

    const [plan] = await db.insert(groceryPlansTable).values({
      clerkUserId,
      items,
      totalCost,
      remainingBudget,
    }).returning();

    res.json({ ...plan, generatedAt: plan!.generatedAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "Failed to generate grocery plan");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
