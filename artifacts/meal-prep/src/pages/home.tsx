import { Link } from "wouter";
import { useListMealPlans, getListMealPlansQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  ScanLine,
  ShoppingBasket,
  Flame,
  CalendarDays,
  ArrowRight,
  ChefHat,
  TrendingUp,
  Plus,
} from "lucide-react";

export default function Home() {
  const { data: mealPlans, isLoading } = useListMealPlans({
    query: { queryKey: getListMealPlansQueryKey() },
  });

  const latestPlan = mealPlans?.[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-sidebar px-7 pt-8 pb-7">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary/60 blur-3xl" />
        </div>

        <span className="absolute top-4 right-5 text-[10px] font-semibold text-orange-400 tracking-wide select-none">
          Android version 2.12
        </span>

        <div className="relative">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-sidebar-foreground leading-tight mb-3">
            {greeting}.
          </h1>
          <p className="text-sidebar-foreground/50 text-base max-w-sm">
            {latestPlan
              ? `Active plan: ${latestPlan.name} · ${latestPlan.dailyCalories} cal/day`
              : "No active plan yet. Let's build one."}
          </p>

          {/* Stats row */}
          {latestPlan && (
            <div className="mt-5 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2">
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                  <CalendarDays size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-sidebar-foreground/40 uppercase tracking-wider font-semibold">Meals/Day</p>
                  <p className="text-sidebar-foreground font-bold text-sm leading-none">{latestPlan.mealsPerDay}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Flame size={14} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-sidebar-foreground/40 uppercase tracking-wider font-semibold">Daily Target</p>
                  <p className="text-sidebar-foreground font-bold text-sm leading-none">{latestPlan.dailyCalories.toLocaleString()} cal</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp size={14} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-sidebar-foreground/40 uppercase tracking-wider font-semibold">Per Meal</p>
                  <p className="text-sidebar-foreground font-bold text-sm leading-none">
                    {Math.round(latestPlan.dailyCalories / latestPlan.mealsPerDay)} cal
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/planner">
            <div className="group cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md card-glow">
              <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform shadow-sm">
                <Sparkles size={19} />
              </div>
              <h3 className="font-semibold text-foreground text-[15px] mb-0.5">Generate Plan</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">AI-crafted meals for your calorie goal</p>
            </div>
          </Link>

          <Link href="/scan">
            <div className="group cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md card-glow">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-105 transition-transform">
                <ScanLine size={19} />
              </div>
              <h3 className="font-semibold text-foreground text-[15px] mb-0.5">Scan a Meal</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">Photo-to-calorie analysis in seconds</p>
            </div>
          </Link>

          <Link href="/shopping">
            <div className="group cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md card-glow">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-200 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-105 transition-transform">
                <ShoppingBasket size={19} />
              </div>
              <h3 className="font-semibold text-foreground text-[15px] mb-0.5">Grocery List</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">Smart list with clean brand picks</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Active Plan */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Active Meal Plan
          </h2>
          <Link href="/planner">
            <button className="text-xs font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={12} />
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <div className="flex gap-3 mt-4">
              <Skeleton className="h-16 flex-1 rounded-xl" />
              <Skeleton className="h-16 flex-1 rounded-xl" />
              <Skeleton className="h-16 flex-1 rounded-xl" />
            </div>
          </div>
        ) : latestPlan ? (
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm card-glow transition-all duration-200">
            <div className="h-1 gradient-emerald w-full" />
            <div className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-foreground text-lg leading-tight">{latestPlan.name}</h3>
                  <p className="text-muted-foreground text-xs mt-1">
                    Created {new Date(latestPlan.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <span className="calorie-pill px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 whitespace-nowrap">
                  <Flame size={13} />
                  {latestPlan.dailyCalories.toLocaleString()} cal
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{latestPlan.mealsPerDay}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-0.5">Meals/Day</p>
                </div>
                <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(latestPlan.dailyCalories / latestPlan.mealsPerDay)}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-0.5">Kcal/Meal</p>
                </div>
                <Link href={`/shopping`} className="block">
                  <div className="rounded-xl bg-primary/8 border border-primary/15 p-3 text-center h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary/12 transition-colors">
                    <ShoppingBasket size={18} className="text-primary mb-1" />
                    <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">Grocery List</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border bg-transparent p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mx-auto mb-4">
              <ChefHat size={26} />
            </div>
            <h3 className="font-semibold text-foreground text-lg mb-1.5">No active meal plan</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              Generate your first AI-powered meal plan based on your calorie goal and preferred meal count.
            </p>
            <Link href="/planner">
              <Button className="gap-2 shadow-sm font-semibold">
                <Plus size={16} /> Create First Plan
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
