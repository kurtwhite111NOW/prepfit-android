import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, savedMealsTable } from "@workspace/db";
import {
  CreateSavedMealBody,
  DeleteSavedMealParams,
  ListSavedMealsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/saved-meals", async (req: any, res): Promise<void> => {
  try {
    const userId: string = req.userId;
    const meals = await db.select().from(savedMealsTable)
      .where(eq(savedMealsTable.userId, userId))
      .orderBy(savedMealsTable.createdAt);
    res.json(ListSavedMealsResponse.parse(meals));
  } catch (err) {
    req.log.error({ err }, "Failed to list saved meals");
    res.status(500).json({ error: "Failed to load saved meals" });
  }
});

router.post("/saved-meals", async (req: any, res): Promise<void> => {
  try {
    const userId: string = req.userId;
    const parsed = CreateSavedMealBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [meal] = await db.insert(savedMealsTable).values({ ...parsed.data, userId }).returning();
    res.status(201).json(meal);
  } catch (err) {
    req.log.error({ err }, "Failed to save meal");
    res.status(500).json({ error: "Failed to save meal" });
  }
});

router.delete("/saved-meals/:id", async (req: any, res): Promise<void> => {
  try {
    const userId: string = req.userId;
    const params = DeleteSavedMealParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const [meal] = await db.delete(savedMealsTable)
      .where(and(eq(savedMealsTable.id, params.data.id), eq(savedMealsTable.userId, userId)))
      .returning();
    if (!meal) {
      res.status(404).json({ error: "Saved meal not found" });
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    req.log.error({ err }, "Failed to delete saved meal");
    res.status(500).json({ error: "Failed to delete saved meal" });
  }
});

export default router;
