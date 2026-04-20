import { useParams, Link } from "wouter";
import {
  useGetMealPlan,
  getGetMealPlanQueryKey,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Flame,
  CalendarDays,
  Clock,
  Dumbbell,
} from "lucide-react";

const MEAL_LABELS: Record<number, string> = {
  1: "Breakfast",
  2: "Lunch",
  3: "Dinner",
  4: "Afternoon Snack",
  5: "Evening Snack",
};

const MEAL_EMOJIS: Record<number, string> = {
  1: "🌅",
  2: "☀️",
  3: "🌙",
  4: "🍎",
  5: "🌙",
};

export default function PlanDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? "0", 10);

  const { data: plan, isLoading } = useGetMealPlan(id, {
    query: { queryKey: getGetMealPlanQueryKey(id), enabled: !!id },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-20 animate-in fade-in duration-500">
        <p className="text-4xl mb-4">😕</p>
        <h2 className="font-bold text-foreground text-xl mb-2">Plan not found</h2>
        <p className="text-muted-foreground mb-6">This plan may have been deleted.</p>
        <Link href="/plans">
          <Button variant="outline" className="gap-2"><ArrowLeft size={15} /> Back to Plans</Button>
        </Link>
      </div>
    );
  }

  const totalProtein = plan.meals?.reduce((sum, m) => sum + (m.protein ?? 0), 0) ?? 0;
  const totalCarbs = plan.meals?.reduce((sum, m) => sum + (m.carbs ?? 0), 0) ?? 0;
  const totalFat = plan.meals?.reduce((sum, m) => sum + (m.fat ?? 0), 0) ?? 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Back nav */}
      <Link href="/plans">
        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
          <ArrowLeft size={15} /> Back to Saved Plans
        </button>
      </Link>

      {/* Header card */}
      <div className="rounded-2xl border border-primary/25 bg-card overflow-hidden shadow-sm">
        <div className="h-1.5 gradient-emerald w-full" />
        <div className="p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Meal Plan</p>
          <h1 className="font-serif text-3xl font-bold text-foreground leading-tight mb-3">{plan.name}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-5">
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {new Date(plan.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} />
              {plan.mealsPerDay} meals / day
            </span>
          </div>

          {/* Macro summary row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/8 border border-primary/15 px-4 py-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame size={13} className="text-primary" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Calories</p>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{plan.dailyCalories.toLocaleString()}</p>
            </div>
            {totalProtein > 0 && (
              <>
                <div className="rounded-xl bg-muted/60 border border-border px-4 py-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Protein</p>
                  <p className="text-2xl font-extrabold text-foreground">{totalProtein}<span className="text-sm font-normal text-muted-foreground">g</span></p>
                </div>
                <div className="rounded-xl bg-muted/60 border border-border px-4 py-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Carbs</p>
                  <p className="text-2xl font-extrabold text-foreground">{totalCarbs}<span className="text-sm font-normal text-muted-foreground">g</span></p>
                </div>
                <div className="rounded-xl bg-muted/60 border border-border px-4 py-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Fat</p>
                  <p className="text-2xl font-extrabold text-foreground">{totalFat}<span className="text-sm font-normal text-muted-foreground">g</span></p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Meals */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Meals</p>
        <div className="space-y-4">
          {plan.meals?.map((meal) => (
            <div key={meal.id} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Meal header */}
              <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{MEAL_EMOJIS[meal.mealNumber] ?? "🍽️"}</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {MEAL_LABELS[meal.mealNumber] ?? `Meal ${meal.mealNumber}`}
                    </p>
                    <h3 className="font-bold text-foreground text-base leading-tight">{meal.name}</h3>
                  </div>
                </div>
                <div className="calorie-pill px-3 py-1.5 rounded-xl text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0">
                  <Flame size={13} />
                  {meal.calories} cal
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Macros */}
                {(meal.protein || meal.carbs || meal.fat) && (
                  <div className="flex gap-2 flex-wrap">
                    {meal.protein != null && (
                      <span className="flex items-center gap-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 rounded-lg px-2.5 py-1 text-xs font-bold">
                        <Dumbbell size={11} /> {meal.protein}g protein
                      </span>
                    )}
                    {meal.carbs != null && (
                      <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg px-2.5 py-1 text-xs font-bold">
                        🍚 {meal.carbs}g carbs
                      </span>
                    )}
                    {meal.fat != null && (
                      <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-lg px-2.5 py-1 text-xs font-bold">
                        🥑 {meal.fat}g fat
                      </span>
                    )}
                  </div>
                )}

                {/* Ingredients */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Ingredients</p>
                  <div className="flex flex-wrap gap-1.5">
                    {meal.ingredients.split(",").map((ing, idx) => (
                      <span
                        key={idx}
                        className="bg-muted border border-border rounded-lg px-2.5 py-1 text-xs text-foreground/80 font-medium"
                      >
                        {ing.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
