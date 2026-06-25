import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { db, foodItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateFoodItemBody, UpdateFoodItemBody, UpdateFoodItemParams, DeleteFoodItemParams } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

router.get("/food-items", requireAuth(), async (_req, res): Promise<void> => {
  try {
    const items = await db.select().from(foodItemsTable);
    res.json(items);
  } catch (err) {
    logger.error({ err }, "Failed to list food items");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/food-items", requireAuth(), async (req, res): Promise<void> => {
  const parsed = CreateFoodItemBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  try {
    const [item] = await db.insert(foodItemsTable).values(parsed.data).returning();
    res.status(201).json(item);
  } catch (err) {
    logger.error({ err }, "Failed to create food item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/food-items/:id", requireAuth(), async (req, res): Promise<void> => {
  const paramsParsed = UpdateFoodItemParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid ID" }); return; }
  const bodyParsed = UpdateFoodItemBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: bodyParsed.error.message }); return; }
  try {
    const [item] = await db.update(foodItemsTable).set(bodyParsed.data).where(eq(foodItemsTable.id, paramsParsed.data.id)).returning();
    if (!item) { res.status(404).json({ error: "Not found" }); return; }
    res.json(item);
  } catch (err) {
    logger.error({ err }, "Failed to update food item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/food-items/:id", requireAuth(), async (req, res): Promise<void> => {
  const parsed = DeleteFoodItemParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    await db.delete(foodItemsTable).where(eq(foodItemsTable.id, parsed.data.id));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete food item");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
