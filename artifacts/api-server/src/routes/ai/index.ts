import { Router, type IRouter } from "express";
import { GenerateMealPlanBody, AnalyzeMealPhotoBody } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";
import { getRandomMealSample, getRandomCuisines, getRandomIngredients } from "../../data/mealLibrary";

const router: IRouter = Router();

router.post("/ai/generate-meal-plan", async (req, res): Promise<void> => {
  try {
    const parsed = GenerateMealPlanBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const { mealsPerDay, dailyCalories } = parsed.data;
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

    const inspirations = mealTypes.map((type, i) => {
      const samples = getRandomMealSample(type, 6);
      return `  Meal ${i + 1} (${type}) — inspiration: ${samples.map(s => `"${s.name}" [${s.cuisine}]`).join(" | ")}`;
    }).join("\n");

    const featuredCuisines = getRandomCuisines(4);
    const [featuredProtein, featuredVeg, featuredGrain] = getRandomIngredients();
    const varietySeed = Math.random().toString(36).slice(2, 10);
    const moodWords = ["bright & zesty", "hearty & warming", "light & refreshing", "bold & spiced", "umami-rich", "sweet & savory", "smoky & charred", "fresh & herbaceous"];
    const mood = moodWords[Math.floor(Math.random() * moodWords.length)];

    const mealTargetLines = mealTypes.map((type, i) =>
      `  Meal ${i + 1} (${type}): EXACTLY ${mealCalorieTargets[i]} calories`
    ).join("\n");

    const prompt = `Create a UNIQUE one-day clean eating meal plan for a busy mom.

VARIETY TOKEN (internal only, do NOT include in output): ${varietySeed} — every plan must be completely different.
TODAY'S MOOD: ${mood}
FEATURED CUISINES: ${featuredCuisines.join(", ")}
STAR INGREDIENTS TO FEATURE: protein = ${featuredProtein} | vegetable = ${featuredVeg} | grain = ${featuredGrain}

CALORIE TARGETS — YOU MUST HIT THESE EXACTLY:
${mealTargetLines}
DAILY TOTAL: ${dailyCalories} calories (the sum of all meal calories must equal exactly ${dailyCalories})

MANDATORY RULES:
1. NO generic fallbacks — avoid plain chicken breast salads, basic smoothies, "overnight oats with berries", or any dish you've likely generated before
2. Feature the star ingredients somewhere across the plan
3. Draw at least 2 meals from the featured cuisines
4. Every meal must have a completely different protein + vegetable + grain combination
5. Minimum 1 vegetarian/plant-based meal
6. Minimum 1 globally-inspired meal (non-American)
7. Meal names must be specific and appetizing (e.g. "Harissa-Spiced Salmon over Freekeh with Mint Yogurt" NOT "Salmon with Grain")
8. Be creative — surprise the user with something they wouldn't think to make
9. ALWAYS include specific measured amounts for every ingredient (e.g. "3 oz salmon, 1 cup cooked quinoa, 2 cups baby spinach, 1 tbsp olive oil, ½ lemon juiced") — no bare ingredient names without a quantity
10. CRITICAL: Each meal's "calories" field in the JSON must match the target above. Do NOT exceed the daily total of ${dailyCalories}.
11. BALANCE complexity: at least 1 meal per plan must be genuinely quick and simple (5 ingredients or fewer, under 15 minutes — e.g. "Greek Yogurt Bowl with Berries & Honey", "Tuna & Avocado Rice Cake", "Cottage Cheese with Sliced Peaches & Walnuts", "Hard-Boiled Eggs with Sliced Cucumber & Hummus"). Not every meal should require a long ingredient list or exotic techniques.

INSPIRATION (use as style inspiration only — create your own original versions):
${inspirations}

Return ONLY valid JSON, no markdown:
{
  "name": "Creative themed plan name (e.g. 'Moroccan-Korean Fusion Clean Day')",
  "meals": [
    {
      "mealNumber": 1,
      "name": "Specific descriptive meal name",
      "description": "What it is, why it's delicious and nutritious, one quick prep tip",
      "calories": ${caloriesPerMeal},
      "ingredients": "3 oz ingredient1, 1 cup ingredient2, 2 tbsp ingredient3, ½ tsp ingredient4"
    }
  ],
  "shoppingItems": [
    {
      "category": "Produce",
      "name": "Item name",
      "quantity": "Amount needed",
      "brandSuggestion": "Clean brand or 'Any fresh'",
      "notes": "Optional tip like organic preferred"
    }
  ]
}

Shopping categories: Produce, Proteins, Dairy & Eggs, Grains & Bread, Pantry Staples, Frozen, Condiments & Sauces, Nuts & Seeds`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: "You are a creative registered dietitian and world cuisine expert specializing in globally-inspired clean eating. You NEVER repeat meal combinations. You draw from 50+ cuisines. Each plan is completely original and surprising. You respond with valid JSON only.",
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

    // Hard-enforce calorie targets: override each meal's calorie field with the
    // pre-calculated target so the total always equals dailyCalories exactly.
    if (Array.isArray(result.meals)) {
      result.meals = result.meals.map((meal: any, i: number) => ({
        ...meal,
        calories: mealCalorieTargets[i] ?? Math.round(dailyCalories / mealsPerDay),
      }));
      // Patch rounding: make sure the sum hits the target exactly by adjusting last meal
      const currentTotal = result.meals.reduce((s: number, m: any) => s + m.calories, 0);
      const diff = dailyCalories - currentTotal;
      if (diff !== 0 && result.meals.length > 0) {
        result.meals[result.meals.length - 1].calories += diff;
      }
    }

    res.json(result);
  } catch (err: any) {
    console.error("generate-meal-plan error:", err?.message ?? err);
    res.status(500).json({ error: "Failed to generate meal plan. Please try again." });
  }
});

router.post("/ai/analyze-meal-photo", async (req, res): Promise<void> => {
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
    console.error("analyze-meal-photo error:", err?.message ?? err);
    res.status(500).json({ error: "Failed to analyze photo. Please try a clearer, well-lit image." });
  }
});

export default router;
