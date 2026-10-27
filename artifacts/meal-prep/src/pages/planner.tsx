import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useLocation } from "wouter";
import {
  useGenerateMealPlan,
  useCreateMealPlan,
  useListMealPlans,
  getListMealPlansQueryKey,
  useGetPreferences,
  useUpdatePreferences,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Sparkles,
  ChefHat,
  Save,
  Flame,
  CalendarDays,
  Clock,
  Zap,
  ExternalLink,
  Share2,
  CheckSquare,
  Dumbbell,
  X,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

const MEAL_LABELS: Record<number, string> = {
  1: "Breakfast",
  2: "Lunch",
  3: "Dinner",
  4: "Afternoon Snack",
  5: "Evening Snack",
};

const GYM_TIPS = [
  "Cook proteins in bulk on Sundays — chicken, ground beef, or hard-boiled eggs keep for 4–5 days and make weekday meals instant.",
  "Aim for 0.7–1g of protein per pound of bodyweight daily. That's about 140–200g for a 200 lb athlete.",
  "Prep your containers first — portion your meals into separate containers right after cooking so grab-and-go is effortless.",
  "Frozen veggies are just as nutritious as fresh and cut prep time in half. Stock your freezer.",
  "Rotisserie chicken is one of the best meal prep hacks — cheap, ready-made, and high protein.",
];
const tip = GYM_TIPS[Math.floor(Math.random() * GYM_TIPS.length)];


function buildShareText(planName: string, meals: any[], dailyCalories: number): string {
  const lines: string[] = [`💪 ${planName}`, `📊 ${dailyCalories.toLocaleString()} cal/day`, ""];
  meals.forEach((m) => {
    lines.push(`${MEAL_LABELS[m.mealNumber] ?? `Meal ${m.mealNumber}`}: ${m.name} (${m.calories} cal)`);
    if (m.protein) lines.push(`  🥩 ${m.protein}g protein · 🍚 ${m.carbs}g carbs · 🥑 ${m.fat}g fat`);
    lines.push(`  Ingredients: ${m.ingredients}`);
    lines.push("");
  });
  lines.push("Generated with Simple Meal Prep — Gym & Fitness 🏋️");
  return lines.join("\n");
}

function buildPrepChecklist(meals: any[]): string[] {
  const steps: string[] = ["Gather all ingredients and containers before you start"];
  const proteins: string[] = [];
  meals.forEach((m) => {
    const first = m.ingredients?.split(",")[0]?.trim();
    if (first && !proteins.includes(first)) {
      proteins.push(first);
      steps.push(`Cook/prepare: ${first} (for ${m.name})`);
    }
  });
  steps.push("Portion each meal into separate airtight containers");
  steps.push("Label containers with meal name and calories");
  steps.push("Refrigerate — stays fresh for 4–5 days");
  return steps;
}

export default function Planner() {
  usePageTitle("Meal Planner", "Generate a personalized weekly meal plan. Set your calorie goal, meals per day, and get a high-protein gym-ready plan in seconds.");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [mealsPerDay, setMealsPerDay] = useState<number>(3);
  const [dailyCalories, setDailyCalories] = useState<number>(2000);
  const [planName, setPlanName] = useState<string>("My Clean Plan");
  const [checklistDone, setChecklistDone] = useState<Record<number, boolean>>({});

  // Allergy / food exclusions — server-side per user
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState("");
  const allergyInputRef = useRef<HTMLInputElement>(null);

  // High protein / low carb toggle — server-side per user
  const [highProtein, setHighProtein] = useState<boolean>(false);
  const [prefsInitialized, setPrefsInitialized] = useState(false);

  const { data: prefsData } = useGetPreferences();
  const { mutate: savePrefs } = useUpdatePreferences();

  // Load from server once on mount
  useEffect(() => {
    if (prefsData && !prefsInitialized) {
      setAllergies(prefsData.allergies ?? []);
      setHighProtein(prefsData.highProteinMode ?? false);
      setPrefsInitialized(true);
    }
  }, [prefsData, prefsInitialized]);

  const updateAllergies = (next: string[]) => {
    setAllergies(next);
    savePrefs({ data: { allergies: next, highProteinMode: highProtein } });
  };

  const updateHighProtein = (val: boolean) => {
    setHighProtein(val);
    savePrefs({ data: { allergies, highProteinMode: val } });
  };

  const addAllergy = () => {
    const val = allergyInput.trim();
    if (!val) return;
    const lower = val.toLowerCase();
    if (!allergies.map((a) => a.toLowerCase()).includes(lower)) {
      updateAllergies([...allergies, val]);
    }
    setAllergyInput("");
    allergyInputRef.current?.focus();
  };

  const removeAllergy = (tag: string) => {
    updateAllergies(allergies.filter((a) => a !== tag));
  };

  const handleAllergyKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addAllergy();
    } else if (e.key === "Backspace" && allergyInput === "" && allergies.length > 0) {
      updateAllergies(allergies.slice(0, -1));
    }
  };

  const generateMealPlan = useGenerateMealPlan();
  const createMealPlan = useCreateMealPlan();

  const calPerMeal = Math.round(dailyCalories / mealsPerDay);

  const handleGenerate = () => {
    setChecklistDone({});
    generateMealPlan.mutate({
      data: {
        mealsPerDay,
        dailyCalories,
        allergies: allergies.length > 0 ? allergies : undefined,
        highProtein: highProtein || undefined,
      } as any,
    });
  };

  const handleSave = () => {
    if (!generateMealPlan.data) return;
    createMealPlan.mutate(
      {
        data: {
          name: planName,
          mealsPerDay,
          dailyCalories,
          meals: generateMealPlan.data.meals.map((m) => ({
            name: m.name,
            description: m.description,
            calories: m.calories,
            mealNumber: m.mealNumber,
            ingredients: m.ingredients,
            protein: m.protein,
            carbs: m.carbs,
            fat: m.fat,
          })),
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Plan saved!", description: "Your meal plan is ready." });
          queryClient.invalidateQueries({ queryKey: getListMealPlansQueryKey() });
          setLocation("/");
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error saving plan" });
        },
      }
    );
  };

  const handleShare = async () => {
    if (!generateMealPlan.data) return;
    const text = buildShareText(
      generateMealPlan.data.name,
      generateMealPlan.data.meals,
      dailyCalories
    );
    if (navigator.share) {
      try {
        await navigator.share({ title: generateMealPlan.data.name, text });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!", description: "Share your plan anywhere." });
  };

  const plan = generateMealPlan.data;
  const totalProtein = plan?.meals.reduce((s, m) => s + (m.protein ?? 0), 0) ?? 0;
  const totalCarbs = plan?.meals.reduce((s, m) => s + (m.carbs ?? 0), 0) ?? 0;
  const totalFat = plan?.meals.reduce((s, m) => s + (m.fat ?? 0), 0) ?? 0;
  const hasMacros = totalProtein > 0;

  const prepSteps = plan ? buildPrepChecklist(plan.meals) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Meal Planner</p>
        <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-2">Build Your Plan</h1>
        <p className="text-muted-foreground">Set your daily targets and build a high-protein, gym-ready menu.</p>
      </section>

      <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start">
        {/* Settings Panel */}
        <div className="space-y-4 md:sticky md:top-8">
          <div className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-7">

            {/* Meals per day */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-foreground">Meals per day</Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">How often you eat</p>
                </div>
                <div className="w-12 h-12 rounded-xl gradient-emerald flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xl leading-none">{mealsPerDay}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setMealsPerDay(n)}
                    className={`rounded-xl py-2.5 text-sm font-bold transition-all duration-150 border ${
                      mealsPerDay === n
                        ? "gradient-emerald text-white border-transparent shadow-sm"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-medium px-0.5">
                <span>Fasting</span>
                <span>Frequent eating</span>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Daily calories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-foreground">Daily Calories</Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Total energy target</p>
                </div>
                <div className="calorie-pill px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-sm">
                  <Flame size={13} />
                  {dailyCalories.toLocaleString()}
                </div>
              </div>

              <Slider
                min={1000}
                max={6000}
                step={50}
                value={[dailyCalories]}
                onValueChange={(val) => setDailyCalories(val[0])}
                className="py-2"
              />

              <div className="flex justify-between text-[10px] text-muted-foreground font-medium px-0.5">
                <span>1,000 cal</span>
                <span>6,000 cal</span>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Clock size={13} />
                  <span>Per meal estimate</span>
                </div>
                <span className="font-bold text-foreground text-sm">{calPerMeal} cal</span>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* High Protein / Low Carb Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <TrendingUp size={13} className="text-primary" />
                    More Protein, Less Carbs
                  </Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Shifts meals to protein-dominant macros</p>
                </div>
                <button
                  onClick={() => updateHighProtein(!highProtein)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    highProtein ? "gradient-emerald" : "bg-muted border border-border"
                  }`}
                  aria-checked={highProtein}
                  role="switch"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      highProtein ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              {highProtein && (
                <div className="flex items-center gap-1.5 text-[11px] text-primary bg-primary/8 border border-primary/15 rounded-xl px-3 py-2">
                  <Zap size={11} />
                  <span>~40% protein · ~20% carbs · ~40% fat</span>
                </div>
              )}
            </div>

            <div className="border-t border-border" />

            {/* Allergy / Food Exclusions */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldAlert size={13} className="text-primary" />
                  Food Exclusions / Allergies
                </Label>
                <p className="text-[11px] text-muted-foreground mt-0.5">These foods will never appear in your plan</p>
              </div>

              {/* Tag display */}
              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {allergies.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold"
                    >
                      {tag}
                      <button
                        onClick={() => removeAllergy(tag)}
                        className="hover:text-red-300 transition-colors ml-0.5"
                        aria-label={`Remove ${tag}`}
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <input
                  ref={allergyInputRef}
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={handleAllergyKeyDown}
                  placeholder="e.g. peanuts, shellfish..."
                  className="flex-1 h-9 rounded-xl border border-border bg-muted/40 px-3 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
                />
                <button
                  onClick={addAllergy}
                  disabled={!allergyInput.trim()}
                  className="h-9 px-3 rounded-xl gradient-emerald text-white text-xs font-bold disabled:opacity-40 transition-opacity"
                >
                  Add
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground">Press Enter or comma to add · Backspace to remove last</p>
            </div>

            <Button
              className="w-full h-12 text-[15px] font-semibold gap-2 shadow-md hover-elevate gradient-emerald border-0"
              onClick={handleGenerate}
              disabled={generateMealPlan.isPending}
            >
              {generateMealPlan.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Crafting your menu...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Meal Plan
                </>
              )}
            </Button>
          </div>

          {/* Tip */}
          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
              <Dumbbell size={13} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
          </div>

          {/* Fasting callout */}
          <a
            href="/fasting"
            className="rounded-2xl border border-indigo-500/20 bg-indigo-500/8 p-4 flex items-center gap-3 hover:border-indigo-500/40 hover:bg-indigo-500/12 transition-colors group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 text-base">
              ⏱️
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-indigo-400 leading-snug">Boost your results</p>
              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                Combine this plan with the 18:6 fasting window for faster fat loss.
              </p>
            </div>
            <ExternalLink size={12} className="text-indigo-400/60 shrink-0 group-hover:text-indigo-400 transition-colors" />
          </a>
        </div>

        {/* Results */}
        <div>
          {generateMealPlan.isPending ? (
            <div className="rounded-2xl border border-primary/15 bg-primary/5 flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl gradient-emerald flex items-center justify-center shadow-lg">
                  <ChefHat size={28} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center animate-bounce">
                  <Sparkles size={10} className="text-white" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Building your menu</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Designing {mealsPerDay} high-protein meals totaling {dailyCalories.toLocaleString()} calories.
                {allergies.length > 0 && ` Excluding: ${allergies.join(", ")}.`}
                {highProtein && " Maximising protein."}
              </p>
              <div className="flex gap-1.5 mt-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary dot-blink" style={{ animationDelay: `${i * 400}ms` }} />
                ))}
              </div>
            </div>
          ) : plan ? (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              {/* Plan header */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="h-1 gradient-emerald" />
                <div className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      High-protein · Gym-focused · Simple
                      {highProtein && " · Low Carb"}
                      {allergies.length > 0 && ` · No ${allergies.join(", ")}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                    >
                      <Share2 size={13} />
                      Share
                    </button>
                    <span className="calorie-pill px-3.5 py-2 rounded-xl text-sm flex items-center gap-1.5 whitespace-nowrap">
                      <Flame size={14} />
                      {plan.meals.reduce((s, m) => s + m.calories, 0).toLocaleString()} cal
                    </span>
                  </div>
                </div>

                {/* Daily macro summary */}
                {hasMacros && (
                  <div className="px-5 pb-5 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-center">
                      <p className="text-base font-extrabold text-blue-400">{totalProtein}g</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mt-0.5">Protein</p>
                    </div>
                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-center">
                      <p className="text-base font-extrabold text-amber-400">{totalCarbs}g</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mt-0.5">Carbs</p>
                    </div>
                    <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-center">
                      <p className="text-base font-extrabold text-green-400">{totalFat}g</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mt-0.5">Fat</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Meal cards */}
              <div className="space-y-3">
                {plan.meals.map((meal) => (
                  <div
                    key={meal.mealNumber}
                    className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/25 hover:shadow-sm card-glow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center shrink-0 shadow-sm">
                        <span className="text-white font-bold text-sm">{meal.mealNumber}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                              {MEAL_LABELS[meal.mealNumber] ?? `Meal ${meal.mealNumber}`}
                            </p>
                            <h4 className="font-semibold text-foreground leading-tight">{meal.name}</h4>
                          </div>
                          <span className="calorie-pill px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 whitespace-nowrap shrink-0">
                            <Flame size={11} />
                            {meal.calories}
                          </span>
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed mt-1.5">{meal.description}</p>

                        {/* Per-meal macros */}
                        {(meal.protein || meal.carbs || meal.fat) && (
                          <div className="mt-2.5 flex gap-2 flex-wrap">
                            {meal.protein != null && (
                              <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg">
                                🥩 {meal.protein}g protein
                              </span>
                            )}
                            {meal.carbs != null && (
                              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                                🍚 {meal.carbs}g carbs
                              </span>
                            )}
                            {meal.fat != null && (
                              <span className="text-[11px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-lg">
                                🥑 {meal.fat}g fat
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-3 bg-muted/40 border border-border rounded-xl p-3">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Ingredients</p>
                          <p className="text-xs text-foreground/80 leading-relaxed">{meal.ingredients}</p>
                        </div>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`how to make ${meal.name} recipe`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                          <ExternalLink size={11} />
                          Watch recipe guidance
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Meal Prep Checklist */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <CheckSquare size={15} className="text-primary" />
                  <p className="text-sm font-bold text-foreground">Batch Prep Checklist</p>
                  <span className="text-[10px] text-muted-foreground ml-auto">Do this on Sunday 🗓</span>
                </div>
                <div className="divide-y divide-border">
                  {prepSteps.map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors ${
                        checklistDone[i] ? "bg-primary/3" : "hover:bg-muted/30"
                      }`}
                      onClick={() => setChecklistDone((prev) => ({ ...prev, [i]: !prev[i] }))}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        checklistDone[i] ? "bg-primary border-primary" : "border-border"
                      }`}>
                        {checklistDone[i] && <Zap size={11} className="text-white" />}
                      </div>
                      <p className={`text-sm transition-colors ${checklistDone[i] ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-muted/30 border-t border-border">
                  <p className="text-[11px] text-muted-foreground">
                    {Object.values(checklistDone).filter(Boolean).length} of {prepSteps.length} steps done
                  </p>
                </div>
              </div>

              {/* Save footer */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Save this plan</p>
                <div className="flex gap-3">
                  <Input
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="Name your plan..."
                    className="h-12 text-sm font-medium bg-muted/30 border-border"
                  />
                  <Button
                    className="h-12 px-6 gap-2 font-semibold shadow-sm whitespace-nowrap hover-elevate"
                    onClick={handleSave}
                    disabled={createMealPlan.isPending}
                  >
                    {createMealPlan.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save size={16} />
                        Save Plan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border bg-transparent flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-5">
                <ChefHat size={28} />
              </div>
              <h3 className="font-serif text-xl font-medium text-muted-foreground mb-2">Ready to plan</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Set your preferences and click Generate — your high-protein gym menu will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
