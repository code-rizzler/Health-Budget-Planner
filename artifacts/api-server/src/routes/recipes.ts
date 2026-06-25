import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { db, recipesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetRecipeParams } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", requireAuth(), async (_req, res): Promise<void> => {
  try {
    const recipes = await db.select().from(recipesTable);
    res.json(recipes.map(r => ({
      ...r,
      ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
      steps: Array.isArray(r.steps) ? r.steps : [],
    })));
  } catch (err) {
    logger.error({ err }, "Failed to list recipes");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", requireAuth(), async (req, res): Promise<void> => {
  const parsed = GetRecipeParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [recipe] = await db.select().from(recipesTable).where(eq(recipesTable.id, parsed.data.id));
    if (!recipe) { res.status(404).json({ error: "Recipe not found" }); return; }
    res.json({
      ...recipe,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      steps: Array.isArray(recipe.steps) ? recipe.steps : [],
    });
  } catch (err) {
    logger.error({ err }, "Failed to get recipe");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
