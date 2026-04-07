import { Router, type IRouter } from "express";
import { GenerateMealPlanBody, AnalyzeMealPhotoBody } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

router.post("/ai/generate-meal-plan", async (req, res): Promise<void> => {
  const parsed = GenerateMealPlanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { mealsPerDay, dailyCalories } = parsed.data;
  const caloriesPerMeal = Math.round(dailyCalories / mealsPerDay);

  const prompt = `Create a clean, healthy one-day meal plan with ${mealsPerDay} meals totaling approximately ${dailyCalories} calories.

Requirements:
- Focus on whole, minimally processed foods
- Each meal should be balanced with protein, complex carbs, and healthy fats
- Calorie targets per meal: approximately ${caloriesPerMeal} calories each (can vary slightly)
- Total must be close to ${dailyCalories} calories
- Include practical, easy-to-prepare meals
- Prefer anti-inflammatory, nutrient-dense ingredients

For each meal include:
- A descriptive name
- A brief description of what it is and why it's good
- Exact calorie count
- List of ingredients (comma-separated)

Also generate a complete shopping list for all the meals with:
- Item name
- Quantity needed
- Brand suggestion (clean, minimally processed brands preferred: e.g. Bob's Red Mill, Simple Truth, Amy's, Kite Hill, Siggis, etc.)
- Notes (e.g. organic preferred, grass-fed)
- Category (Produce, Proteins, Dairy & Eggs, Grains & Bread, Pantry Staples, Frozen, Condiments & Sauces)

Return ONLY valid JSON in this exact format, no additional text:
{
  "name": "Clean Eating ${dailyCalories}-Calorie Meal Plan",
  "meals": [
    {
      "mealNumber": 1,
      "name": "Meal name",
      "description": "What it is and why it's good",
      "calories": 450,
      "ingredients": "ingredient1, ingredient2, ingredient3"
    }
  ],
  "shoppingItems": [
    {
      "category": "Produce",
      "name": "Item name",
      "quantity": "2 cups",
      "brandSuggestion": "Brand or 'Any fresh'",
      "notes": "Organic preferred"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      {
        role: "system",
        content: "You are a registered dietitian and meal prep expert specializing in clean, whole-food nutrition. You only respond with valid JSON.",
      },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "{}";

  let result: { name: string; meals: Array<{ mealNumber: number; name: string; description: string; calories: number; ingredients: string }>; shoppingItems: Array<{ category: string; name: string; quantity: string; brandSuggestion: string; notes: string }> };
  try {
    result = JSON.parse(content);
  } catch {
    res.status(500).json({ error: "Failed to generate meal plan" });
    return;
  }

  res.json(result);
});

router.post("/ai/analyze-meal-photo", async (req, res): Promise<void> => {
  const parsed = AnalyzeMealPhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { imageBase64 } = parsed.data;

  const imageUrl = imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      {
        role: "system",
        content: "You are a nutrition expert who can analyze food photos and estimate calories. Be thorough and accurate. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this meal photo and provide:
1. The name of the meal/dish
2. A brief description of what you see
3. Estimated total calorie count (be as accurate as possible)
4. List of visible ingredients
5. Your confidence level (High, Medium, or Low) based on how clearly you can see the food

Return ONLY valid JSON in this exact format:
{
  "name": "Meal name",
  "description": "Brief description of what you see",
  "estimatedCalories": 550,
  "ingredients": "ingredient1, ingredient2, ingredient3",
  "confidence": "High"
}`,
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "{}";

  let result: { name: string; description: string; estimatedCalories: number; ingredients: string; confidence: string };
  try {
    result = JSON.parse(content);
  } catch {
    res.status(500).json({ error: "Failed to analyze photo" });
    return;
  }

  res.json(result);
});

export default router;
