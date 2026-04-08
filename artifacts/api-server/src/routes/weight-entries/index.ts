import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, weightEntriesTable } from "@workspace/db";
import {
  CreateWeightEntryBody,
  DeleteWeightEntryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/weight-entries", async (_req, res): Promise<void> => {
  const entries = await db
    .select()
    .from(weightEntriesTable)
    .orderBy(weightEntriesTable.recordedAt);
  res.json(entries);
});

router.post("/weight-entries", async (req, res): Promise<void> => {
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

  const [entry] = await db
    .insert(weightEntriesTable)
    .values({
      ...rest,
      ...(recordedAt ? { recordedAt } : {}),
    })
    .returning();

  res.status(201).json(entry);
});

router.delete("/weight-entries/:id", async (req, res): Promise<void> => {
  const params = DeleteWeightEntryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: String(params.error) });
    return;
  }

  const [deleted] = await db
    .delete(weightEntriesTable)
    .where(eq(weightEntriesTable.id, (params.data as { id: number }).id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Weight entry not found" });
    return;
  }

  res.status(204).send();
});

export default router;
