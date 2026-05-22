import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, mealPlansTable, mealItemsTable } from "@workspace/db";
import { GetShoppingListParams } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";
import { shoppingListCache, shoppingListCacheKey } from "../../lib/shoppingListCache";

const router: IRouter = Router();

router.get("/shopping-lists/:mealPlanId", async (req: any, res): Promise<void> => {
  const userId: string = req.userId;
  const params = GetShoppingListParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const cacheKey = shoppingListCacheKey(userId, params.data.mealPlanId);
  const cached = shoppingListCache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  const [plan] = await db.select().from(mealPlansTable)
    .where(and(eq(mealPlansTable.id, params.data.mealPlanId), eq(mealPlansTable.userId, userId)));
  if (!plan) {
    res.status(404).json({ error: "Meal plan not found" });
    return;
  }

  const meals = await db.select().from(mealItemsTable).where(eq(mealItemsTable.mealPlanId, params.data.mealPlanId));

  const mealDescriptions = meals.map((m) => `Meal ${m.mealNumber}: ${m.name} - Ingredients: ${m.ingredients}`).join("\n");

  const prompt = `Based on the following meal plan, create a detailed grocery shopping list.
Group items by category (Produce, Proteins, Dairy & Eggs, Grains & Bread, Pantry Staples, Frozen, Beverages, Condiments & Sauces).
For each item, provide:
- The item name
- Quantity needed (be specific, e.g. "2 lbs", "1 bunch", "6 oz")
- A brand suggestion preferring minimally processed, clean brands (e.g. Amy's, Bob's Red Mill, Simple Truth, etc.)
- Brief notes if relevant (e.g. "look for grass-fed", "organic preferred")

Meal Plan: ${plan.name}
Meals per day: ${plan.mealsPerDay}
Daily calories: ${plan.dailyCalories}

Meals:
${mealDescriptions}

Return the result as valid JSON in this exact format:
{
  "categories": [
    {
      "category": "Category Name",
      "items": [
        {
          "name": "Item name",
          "quantity": "Amount",
          "brandSuggestion": "Brand name",
          "notes": "Optional notes"
        }
      ]
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      {
        role: "system",
        content: "You are a nutrition expert and meal prep specialist who focuses on clean, minimally processed foods. Always respond with valid JSON only, no additional text.",
      },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "{}";

  let parsed: { categories: Array<{ category: string; items: Array<{ name: string; quantity: string; brandSuggestion: string; notes: string }> }> };
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { categories: [] };
  }

  const result = {
    mealPlanId: plan.id,
    mealPlanName: plan.name,
    categories: parsed.categories || [],
  };

  shoppingListCache.set(cacheKey, result);
  res.json(result);
});

export default router;
