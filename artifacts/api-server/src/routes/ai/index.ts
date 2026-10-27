import { Router, type IRouter } from "express";
import { GenerateMealPlanBody, AnalyzeMealPhotoBody } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";
import { getRandomMealSample, getRandomIngredients, getRandomTheme } from "../../data/mealLibrary";
import { aiRateLimit, photoRateLimit } from "../../middlewares/aiRateLimit";
import { logger } from "../../lib/logger";

const router: IRouter = Router();

router.post("/ai/generate-meal-plan", aiRateLimit, async (req, res): Promise<void> => {
  try {
    const parsed = GenerateMealPlanBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const { mealsPerDay, dailyCalories, allergies, highProtein } = parsed.data;
    const mealTypes: Array<"breakfast" | "lunch" | "dinner" | "snack"> =
      mealsPerDay === 2 ? ["breakfast", "dinner"] :
      mealsPerDay === 3 ? ["breakfast", "lunch", "dinner"] :
      mealsPerDay === 4 ? ["breakfast", "lunch", "dinner", "snack"] :
      ["breakfast", "snack", "lunch", "snack", "dinner"];

    const mealWeights: Record<string, number> = {
      breakfast: 0.25, lunch: 0.30, dinner: 0.35, snack: 0.10,
    };
    const rawWeights = mealTypes.map((t) => mealWeights[t] ?? 0.25);
    const totalWeight = rawWeights.reduce((a, b) => a + b, 0);
    const mealCalorieTargets = rawWeights.map((w) =>
      Math.round((w / totalWeight) * dailyCalories)
    );
    const caloriesPerMeal = Math.round(dailyCalories / mealsPerDay);

    const theme = getRandomTheme();
    const [featuredProtein, featuredVeg, featuredGrain] = getRandomIngredients();
    const varietySeed = Math.random().toString(36).slice(2, 10);

    const inspirations = mealTypes.map((type, i) => {
      const samples = getRandomMealSample(type, 8, theme.cuisines);
      return `  Meal ${i + 1} (${type}) — inspiration options: ${samples.map(s => `"${s.name}" [${s.cuisine}]`).join(" | ")}`;
    }).join("\n");

    const mealTargetLines = mealTypes.map((type, i) =>
      `  Meal ${i + 1} (${type}): EXACTLY ${mealCalorieTargets[i]} calories`
    ).join("\n");

    const allergyLine = allergies && allergies.length > 0
      ? `\n⚠️ ALLERGY / EXCLUSION LIST — NEVER include these foods or ingredients in ANY meal: ${allergies.join(", ")}. This is a hard rule — violating it puts the user's health at risk.`
      : "";

    const proteinLine = highProtein
      ? "\n🥩 HIGH-PROTEIN MODE: The user wants MORE PROTEIN and FEWER CARBS. Every meal must be protein-dominant. Minimise rice, pasta, bread, and starchy carbs. Replace with extra protein, leafy greens, and healthy fats. Target macro split: ~40% protein, ~20% carbs, ~40% fat."
      : "";

    const prompt = `Create a simple, practical one-day meal plan for a gym-goer or fitness enthusiast. All meals must be VERY EASY — high-protein, everyday foods that support muscle building and performance.${allergyLine}${proteinLine}

VARIETY TOKEN (internal only, do NOT include in output): ${varietySeed}
TODAY'S THEME: ${theme.label}
STAR INGREDIENTS: protein = ${featuredProtein} | vegetable = ${featuredVeg} | grain = ${featuredGrain}

⚠️ MEAL COUNT: You MUST return EXACTLY ${mealsPerDay} meal${mealsPerDay === 1 ? "" : "s"} — no more, no less. Not ${mealsPerDay + 1}, not ${mealsPerDay - 1}. Exactly ${mealsPerDay}.

CALORIE TARGETS — YOU MUST HIT THESE EXACTLY:
${mealTargetLines}
DAILY TOTAL: ${dailyCalories} calories (the sum of all meal calories must equal exactly ${dailyCalories})

MANDATORY RULES:
1. SIMPLICITY IS THE #1 PRIORITY — every meal must be something a beginner can make in under 20 minutes with basic pantry staples
2. PRIORITIZE HIGH PROTEIN — gym-goers need protein at every meal (eggs, chicken, ground beef, tuna, Greek yogurt, cottage cheese, protein powder, shrimp, salmon, turkey, etc.)
3. LEAN INTO THE THEME: ${theme.label} — let this guide the flavor profile, ingredients, and meal names. Do NOT default to "Scrambled Eggs and Toast" or "Chicken and Rice" unless the theme calls for it.
4. Canned, frozen, and store-bought items are totally acceptable (canned tuna, frozen veggies, rotisserie chicken, jarred sauce)
5. Every meal must have a COMPLETELY DIFFERENT protein source — no repeats
6. ALWAYS include specific measured amounts for every ingredient (e.g. "6 oz chicken, 1 cup rice, 2 tbsp soy sauce, garlic")
7. CRITICAL: Each meal's "calories" field in the JSON must match the target above. Do NOT exceed the daily total of ${dailyCalories}.
8. Keep ingredient lists SHORT — 4 to 6 ingredients max per meal
9. For each meal, estimate macros in grams: protein, carbs, and fat based on the ingredients
10. Be CREATIVE with the plan name — reflect the theme (e.g. "Mexican Muscle Day", "Asian Gains Plate", "Mediterranean Cut Plan")
11. For each meal, include a "mealType" field: "breakfast", "lunch", "dinner", or "snack"
12. For each meal, include a "youtubeUrl" field: a YouTube search URL like "https://www.youtube.com/results?search_query=cottage+cheese+toast+recipe+easy" — use the actual meal name + "recipe easy" as search terms, URL-encoded with + for spaces

INSPIRATION (pick from these or create something similar in the same style — do NOT copy names exactly):
${inspirations}

Return ONLY valid JSON, no markdown:
{
  "name": "Simple, friendly plan name (e.g. 'Muscle Gain Day', 'Clean Cut Plan', 'Easy Bulk Day')",
  "meals": [
    {
      "mealNumber": 1,
      "mealType": "breakfast",
      "name": "Plain familiar meal name",
      "description": "What it is and one simple tip for making it quickly",
      "calories": ${caloriesPerMeal},
      "protein": 35,
      "carbs": 45,
      "fat": 12,
      "ingredients": "2 eggs, 1 slice toast, 1 tbsp butter, salt and pepper",
      "youtubeUrl": "https://www.youtube.com/results?search_query=scrambled+eggs+toast+recipe+easy"
    }
  ],
  "shoppingItems": [
    {
      "category": "Produce",
      "name": "Item name",
      "quantity": "Amount needed",
      "brandSuggestion": "Any brand or store brand",
      "notes": "Optional simple tip"
    }
  ]
}

Shopping categories: Produce, Proteins, Dairy & Eggs, Grains & Bread, Pantry Staples, Frozen, Condiments & Sauces, Nuts & Seeds`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      temperature: 1.2,
      messages: [
        {
          role: "system",
          content: "You are a meal planning assistant for gym-goers, fitness enthusiasts, and athletes. You create VARIED, high-protein meal plans — drawing from global cuisines like Mexican, Asian, Mediterranean, Italian, BBQ, and more. You never repeat the same meals. Every meal must be simple (under 20 minutes, beginner-friendly, basic grocery store ingredients). You always include estimated macros (protein, carbs, fat) in grams. You respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);
    if (result.name) {
      result.name = result.name.replace(/^[a-z0-9]{6,12}\s+/i, "").trim();
    }

    // Hard-enforce meal count: trim to exactly mealsPerDay
    if (Array.isArray(result.meals)) {
      result.meals = result.meals.slice(0, mealsPerDay);

      // Hard-enforce calorie targets
      result.meals = result.meals.map((meal: any, i: number) => ({
        ...meal,
        mealNumber: i + 1,
        calories: mealCalorieTargets[i] ?? Math.round(dailyCalories / mealsPerDay),
      }));

      // Patch rounding so sum equals dailyCalories exactly
      const currentTotal = result.meals.reduce((s: number, m: any) => s + m.calories, 0);
      const diff = dailyCalories - currentTotal;
      if (diff !== 0 && result.meals.length > 0) {
        result.meals[result.meals.length - 1].calories += diff;
      }
    }

    res.json(result);
  } catch (err: any) {
    logger.error({ err }, "generate-meal-plan error");
    res.status(500).json({ error: "Failed to generate meal plan. Please try again." });
  }
});

router.post("/ai/analyze-meal-photo", photoRateLimit, async (req, res): Promise<void> => {
  try {
    const parsed = AnalyzeMealPhotoBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const { imageBase64 } = parsed.data;
    const imageUrl = imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 1024,
      messages: [
        {
          role: "system",
          content: "You are a nutrition expert who analyzes food photos and estimates calories. Always respond with valid JSON only — no markdown, no extra text.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this meal photo and return ONLY valid JSON in this exact format (no markdown):
{
  "name": "Descriptive meal name",
  "description": "Brief description of what you see in the photo",
  "estimatedCalories": 550,
  "ingredients": "ingredient1, ingredient2, ingredient3",
  "confidence": "High"
}

Confidence is High/Medium/Low based on how clearly you can identify the food. If you cannot identify food at all, still return the JSON with your best guess and Low confidence.`,
            },
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "low" },
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);
    res.json(result);
  } catch (err: any) {
    logger.error({ err }, "analyze-meal-photo error");
    res.status(500).json({ error: "Failed to analyze photo. Please try a clearer, well-lit image." });
  }
});

export default router;
