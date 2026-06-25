import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { db, profilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpsertProfileBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.clerkUserId, clerkUserId));
    if (!profile) { res.status(404).json({ error: "Profile not found" }); return; }
    res.json({ ...profile, createdAt: profile.createdAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "Failed to get profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/", requireAuth(), async (req, res): Promise<void> => {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const parsed = UpsertProfileBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  try {
    const [existing] = await db.select().from(profilesTable).where(eq(profilesTable.clerkUserId, clerkUserId));
    let profile;
    if (existing) {
      [profile] = await db.update(profilesTable).set(parsed.data).where(eq(profilesTable.clerkUserId, clerkUserId)).returning();
    } else {
      [profile] = await db.insert(profilesTable).values({ ...parsed.data, clerkUserId }).returning();
    }
    res.json({ ...profile, createdAt: profile!.createdAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "Failed to upsert profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
