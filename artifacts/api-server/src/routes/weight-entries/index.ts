import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, weightEntriesTable } from "@workspace/db";
import {
  CreateWeightEntryBody,
  DeleteWeightEntryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/weight-entries", async (req: any, res): Promise<void> => {
  try {
    const userId: string = req.userId;
    const entries = await db.select().from(weightEntriesTable)
      .where(eq(weightEntriesTable.userId, userId))
      .orderBy(weightEntriesTable.recordedAt);
    res.json(entries);
  } catch (err) {
    req.log.error({ err }, "Failed to list weight entries");
    res.status(500).json({ error: "Failed to load weight entries" });
  }
});

router.post("/weight-entries", async (req: any, res): Promise<void> => {
  try {
    const userId: string = req.userId;
    const parsed = CreateWeightEntryBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: String(parsed.error) });
      return;
    }

    const { recordedAt, ...rest } = parsed.data as {
      weight: number;
      unit: "lbs" | "kg";
      notes?: string;
      recordedAt?: Date;
    };

    const [entry] = await db.insert(weightEntriesTable)
      .values({ ...rest, userId, ...(recordedAt ? { recordedAt } : {}) })
      .returning();

    res.status(201).json(entry);
  } catch (err) {
    req.log.error({ err }, "Failed to create weight entry");
    res.status(500).json({ error: "Failed to save weight entry" });
  }
});

router.delete("/weight-entries/:id", async (req: any, res): Promise<void> => {
  try {
    const userId: string = req.userId;
    const params = DeleteWeightEntryParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: String(params.error) });
      return;
    }

    const [deleted] = await db.delete(weightEntriesTable)
      .where(and(
        eq(weightEntriesTable.id, (params.data as { id: number }).id),
        eq(weightEntriesTable.userId, userId)
      ))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Weight entry not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete weight entry");
    res.status(500).json({ error: "Failed to delete weight entry" });
  }
});

export default router;
