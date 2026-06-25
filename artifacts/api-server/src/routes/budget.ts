import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { db, expensesTable, profilesTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { AddExpenseBody, DeleteExpenseParams } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.clerkUserId, clerkUserId));
    const monthlyBudget = profile?.monthlyBudget ?? 0;

    const [result] = await db
      .select({ total: sql<number>`coalesce(sum(${expensesTable.amount}),0)` })
      .from(expensesTable)
      .where(eq(expensesTable.clerkUserId, clerkUserId));

    const totalSpent = Number(result?.total ?? 0);
    const remaining = monthlyBudget - totalSpent;
    const percentUsed = monthlyBudget > 0 ? Math.min((totalSpent / monthlyBudget) * 100, 100) : 0;

    res.json({ monthlyBudget, totalSpent, remaining, percentUsed });
  } catch (err) {
    logger.error({ err }, "Failed to get budget");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/expenses", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const expenses = await db.select().from(expensesTable)
      .where(eq(expensesTable.clerkUserId, clerkUserId))
      .orderBy(desc(expensesTable.createdAt));
    res.json(expenses.map(e => ({ ...e, createdAt: e.createdAt.toISOString() })));
  } catch (err) {
    logger.error({ err }, "Failed to list expenses");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/expenses", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const parsed = AddExpenseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  try {
    const [expense] = await db.insert(expensesTable).values({ ...parsed.data, clerkUserId }).returning();
    res.status(201).json({ ...expense, createdAt: expense!.createdAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "Failed to add expense");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/expenses/:id", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const parsed = DeleteExpenseParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    await db.delete(expensesTable).where(eq(expensesTable.id, parsed.data.id));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete expense");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
