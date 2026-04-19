import { useState } from "react";
import { useLocation } from "wouter";
import {
  useGenerateMealPlan,
  useCreateMealPlan,
  useListMealPlans,
  getListMealPlansQueryKey,
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
  Leaf,
  ExternalLink,
} from "lucide-react";

const MEAL_LABELS: Record<number, string> = {
  1: "Breakfast",
  2: "Lunch",
  3: "Dinner",
  4: "Afternoon Snack",
  5: "Evening Snack",
};

export default function Planner() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [mealsPerDay, setMealsPerDay] = useState<number>(3);
  const [dailyCalories, setDailyCalories] = useState<number>(2000);
  const [planName, setPlanName] = useState<string>("My Clean Plan");

  const generateMealPlan = useGenerateMealPlan();
  const createMealPlan = useCreateMealPlan();

  const calPerMeal = Math.round(dailyCalories / mealsPerDay);

  const handleGenerate = () => {
    generateMealPlan.mutate({ data: { mealsPerDay, dailyCalories } });
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          AI Meal Planner
        </p>
        <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-2">
          Build Your Plan
        </h1>
        <p className="text-muted-foreground">
          Set your daily targets and let AI design a clean, balanced menu.
        </p>
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

              {/* Custom meal selector */}
              <div className="grid grid-cols-4 gap-2">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setMealsPerDay(n)}
                    className={`
                      rounded-xl py-2.5 text-sm font-bold transition-all duration-150 border
                      ${mealsPerDay === n
                        ? "gradient-emerald text-white border-transparent shadow-sm"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                      }
                    `}
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

              {/* Per meal estimate */}
              <div className="bg-muted/50 border border-border rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Clock size={13} />
                  <span>Per meal estimate</span>
                </div>
                <span className="font-bold text-foreground text-sm">~{calPerMeal} cal</span>
              </div>
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
              <Leaf size={13} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All plans prioritize <strong className="text-foreground">whole, minimally processed</strong> ingredients for clean eating and sustained energy.
            </p>
          </div>
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
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                Building your menu
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Designing {mealsPerDay} balanced meals totaling {dailyCalories.toLocaleString()} calories with clean ingredients.
              </p>
              <div className="flex gap-1.5 mt-6">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary dot-blink"
                    style={{ animationDelay: `${i * 400}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : generateMealPlan.data ? (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              {/* Plan header */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="h-1 gradient-emerald" />
                <div className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      {generateMealPlan.data.name}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      Balanced menu · Clean eating focused
                    </p>
                  </div>
                  <span className="calorie-pill px-3.5 py-2 rounded-xl text-sm flex items-center gap-1.5 whitespace-nowrap">
                    <Flame size={14} />
                    {generateMealPlan.data.meals.reduce((s, m) => s + m.calories, 0).toLocaleString()} cal total
                  </span>
                </div>
              </div>

              {/* Meal cards */}
              <div className="space-y-3">
                {generateMealPlan.data.meals.map((meal) => (
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
                        <p className="text-muted-foreground text-sm leading-relaxed mt-1.5">
                          {meal.description}
                        </p>
                        <div className="mt-3 bg-muted/40 border border-border rounded-xl p-3">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                            Ingredients
                          </p>
                          <p className="text-xs text-foreground/80 leading-relaxed">{meal.ingredients}</p>
                        </div>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`how to make ${meal.name} recipe`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                          <ExternalLink size={11} />
                          Watch for general guidance, but stay with the ingredients listed above for better calorie control
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save footer */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Save this plan
                </p>
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
              <h3 className="font-serif text-xl font-medium text-muted-foreground mb-2">
                Ready to plan
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Set your preferences on the left and click Generate — your custom clean-eating menu will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
