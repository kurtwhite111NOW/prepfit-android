import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, savedMealsTable } from "@workspace/db";
import {
  CreateSavedMealBody,
  DeleteSavedMealParams,
  ListSavedMealsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/saved-meals", async (_req, res): Promise<void> => {
  const meals = await db.select().from(savedMealsTable).orderBy(savedMealsTable.createdAt);
  res.json(ListSavedMealsResponse.parse(meals));
});

router.post("/saved-meals", async (req, res): Promise<void> => {
  const parsed = CreateSavedMealBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [meal] = await db.insert(savedMealsTable).values(parsed.data).returning();
  res.status(201).json(meal);
});

router.delete("/saved-meals/:id", async (req, res): Promise<void> => {
  const params = DeleteSavedMealParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [meal] = await db.delete(savedMealsTable).where(eq(savedMealsTable.id, params.data.id)).returning();
  if (!meal) {
    res.status(404).json({ error: "Saved meal not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
