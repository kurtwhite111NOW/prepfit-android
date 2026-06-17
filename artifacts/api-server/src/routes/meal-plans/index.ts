import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, mealPlansTable, mealItemsTable } from "@workspace/db";
import {
  CreateMealPlanBody,
  GetMealPlanParams,
  DeleteMealPlanParams,
  ListMealPlansResponse,
  GetMealPlanResponse,
} from "@workspace/api-zod";
import { shoppingListCache, shoppingListCacheKey } from "../../lib/shoppingListCache";

const router: IRouter = Router();

router.get("/meal-plans", async (req: any, res): Promise<void> => {
  try {
    const userId: string = req.userId;
    const plans = await db.select().from(mealPlansTable)
      .where(eq(mealPlansTable.userId, userId))
      .orderBy(mealPlansTable.createdAt);
    res.json(ListMealPlansResponse.parse(plans));
  } catch (err) {
    req.log.error({ err }, "Failed to list meal plans");
    res.status(500).json({ error: "Failed to load meal plans" });
  }
});

router.post("/meal-plans", async (req: any, res): Promise<void> => {
  try {
    const userId: string = req.userId;
    const parsed = CreateMealPlanBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const { meals, ...planData } = parsed.data;
    const [plan] = await db.insert(mealPlansTable).values({ ...planData, userId }).returning();

    if (meals && meals.length > 0) {
      await db.insert(mealItemsTable).values(
        meals.map((meal) => ({ ...meal, mealPlanId: plan.id }))
      );
    }

    const mealItems = await db.select().from(mealItemsTable).where(eq(mealItemsTable.mealPlanId, plan.id));
    res.status(201).json(GetMealPlanResponse.parse({ ...plan, meals: mealItems }));
  } catch (err) {
    req.log.error({ err }, "Failed to create meal plan");
    res.status(500).json({ error: "Failed to create meal plan" });
  }
});

router.get("/meal-plans/:id", async (req: any, res): Promise<void> => {
  try {
    const userId: string = req.userId;
    const params = GetMealPlanParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const [plan] = await db.select().from(mealPlansTable)
      .where(and(eq(mealPlansTable.id, params.data.id), eq(mealPlansTable.userId, userId)));
    if (!plan) {
      res.status(404).json({ error: "Meal plan not found" });
      return;
    }

    const meals = await db.select().from(mealItemsTable)
      .where(eq(mealItemsTable.mealPlanId, params.data.id))
      .orderBy(mealItemsTable.mealNumber);

    res.json(GetMealPlanResponse.parse({ ...plan, meals }));
  } catch (err) {
    req.log.error({ err }, "Failed to get meal plan");
    res.status(500).json({ error: "Failed to load meal plan" });
  }
});

router.delete("/meal-plans/:id", async (req: any, res): Promise<void> => {
  try {
    const userId: string = req.userId;
    const params = DeleteMealPlanParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const [plan] = await db.delete(mealPlansTable)
      .where(and(eq(mealPlansTable.id, params.data.id), eq(mealPlansTable.userId, userId)))
      .returning();
    if (!plan) {
      res.status(404).json({ error: "Meal plan not found" });
      return;
    }

    shoppingListCache.delete(shoppingListCacheKey(userId, params.data.id));
    res.sendStatus(204);
  } catch (err) {
    req.log.error({ err }, "Failed to delete meal plan");
    res.status(500).json({ error: "Failed to delete meal plan" });
  }
});

export default router;
