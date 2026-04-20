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
  ChefHat,
  TrendingUp,
  Plus,
  Zap,
  ArrowRight,
} from "lucide-react";

const GYM_TIPS = [
  "Cook proteins in bulk on Sundays — chicken, ground beef, or hard-boiled eggs keep for 4–5 days and make weekday meals instant.",
  "Aim for 0.7–1g of protein per pound of bodyweight daily. High protein = better muscle retention on a cut.",
  "Prep your containers first — portion meals into separate containers right after cooking so grab-and-go is effortless.",
  "Frozen veggies are just as nutritious as fresh and cut prep time in half. Stock your freezer.",
  "Rotisserie chicken is one of the best meal prep hacks — cheap, ready-made, and packed with protein.",
  "Stay hydrated — aim for 8+ glasses of water daily. Dehydration tanks gym performance more than most people realize.",
];
const dailyTip = GYM_TIPS[new Date().getDay() % GYM_TIPS.length];

export default function Home() {
  const { data: mealPlans, isLoading } = useListMealPlans({
    query: { queryKey: getListMealPlansQueryKey() },
  });

  const latestPlan = mealPlans?.[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Let's crush today" : hour < 17 ? "Keep it going" : "Finish strong";
  const greetingEmoji = hour < 12 ? "💪" : hour < 17 ? "🔥" : "⚡";

  const today = new Date().toISOString().split("T")[0];
  const waterGlasses = parseInt(localStorage.getItem(`water_${today}`) ?? "0", 10);

  const quickActions = [
    {
      href: "/planner",
      emoji: "🥗",
      label: "Build a Meal Plan",
      desc: "AI picks high-protein meals for your calorie goal",
      color: "bg-orange-500",
    },
    {
      href: "/scan",
      emoji: "📸",
      label: "Scan a Meal",
      desc: "Snap a photo — get instant calories",
      color: "bg-amber-500",
    },
    {
      href: "/shopping",
      emoji: "🛒",
      label: "Grocery List",
      desc: "What to buy for your plan",
      color: "bg-blue-500",
    },
    {
      href: "/water",
      emoji: "💧",
      label: "Water Tracker",
      desc: `${waterGlasses}/8 glasses today`,
      color: "bg-cyan-500",
    },
    {
      href: "/weight",
      emoji: "📊",
      label: "Track Weight",
      desc: "Log your progress",
      color: "bg-purple-500",
    },
    {
      href: "/plans",
      emoji: "📋",
      label: "Saved Plans",
      desc: "All your meal plan history",
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-sidebar">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative px-6 pt-7 pb-6">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>

          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{greetingEmoji}</span>
              <h1 className="font-sans text-3xl md:text-4xl font-extrabold text-sidebar-foreground leading-tight">
                {greeting}!
              </h1>
            </div>
            <span className="text-xs font-bold text-primary shrink-0">version 2.0.0</span>
          </div>

          {isLoading ? (
            <div className="flex gap-3">
              <Skeleton className="h-16 w-36 rounded-2xl bg-white/10" />
              <Skeleton className="h-16 w-36 rounded-2xl bg-white/10" />
            </div>
          ) : latestPlan ? (
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-2xl px-4 py-3">
                <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center shrink-0">
                  <Flame size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white leading-none">
                    {latestPlan.dailyCalories.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-sidebar-foreground/50 font-semibold uppercase tracking-wide mt-0.5">cal / day</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-2xl px-4 py-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/25 flex items-center justify-center shrink-0">
                  <CalendarDays size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white leading-none">{latestPlan.mealsPerDay}</p>
                  <p className="text-[11px] text-sidebar-foreground/50 font-semibold uppercase tracking-wide mt-0.5">meals / day</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-2xl px-4 py-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/25 flex items-center justify-center shrink-0">
                  <span className="text-lg">💧</span>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white leading-none">{waterGlasses}/8</p>
                  <p className="text-[11px] text-sidebar-foreground/50 font-semibold uppercase tracking-wide mt-0.5">glasses</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sidebar-foreground/60 text-sm">No plan yet —</p>
              <Link href="/planner">
                <button className="flex items-center gap-1.5 text-primary text-sm font-bold hover:underline">
                  <Zap size={14} /> Build your first plan
                </button>
              </Link>
            </div>
          )}

          {latestPlan && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sidebar-foreground/40 text-xs">
                Active: <span className="text-sidebar-foreground/70 font-semibold">{latestPlan.name}</span>
              </p>
              <Link href="/planner">
                <button className="text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  Change plan <ArrowRight size={11} />
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 px-0.5">
          What do you want to do?
        </h2>

        {/* Top 3 — big cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {quickActions.slice(0, 3).map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="group cursor-pointer rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-lg card-glow transition-all duration-200 h-full">
                <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                  {action.emoji}
                </div>
                <h3 className="font-bold text-foreground text-[15px] mb-1">{action.label}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom 3 — compact horizontal */}
        <div className="grid grid-cols-3 gap-3">
          {quickActions.slice(3).map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="group cursor-pointer rounded-2xl border border-border bg-card px-3 py-3.5 hover:border-primary/30 hover:shadow-md card-glow transition-all duration-200 flex flex-col items-center text-center gap-2">
                <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                  {action.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-xs leading-tight">{action.label}</h3>
                  <p className="text-muted-foreground text-[10px] mt-0.5 leading-tight">{action.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Active Plan Preview */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Current Plan</h2>
          <Link href="/plans">
            <button className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
              All plans <ArrowRight size={12} />
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-24 w-full rounded-xl mt-2" />
          </div>
        ) : latestPlan ? (
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm card-glow">
            <div className="h-1.5 gradient-emerald w-full" />
            <div className="p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-foreground text-base leading-tight">{latestPlan.name}</h3>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Created {new Date(latestPlan.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <span className="calorie-pill px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0">
                  <Flame size={13} />
                  {latestPlan.dailyCalories.toLocaleString()} cal
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-muted/60 border border-border p-3 text-center">
                  <p className="text-xl font-extrabold text-foreground">{latestPlan.mealsPerDay}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mt-0.5">Meals</p>
                </div>
                <div className="rounded-xl bg-muted/60 border border-border p-3 text-center">
                  <p className="text-xl font-extrabold text-foreground">
                    {Math.round(latestPlan.dailyCalories / latestPlan.mealsPerDay)}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mt-0.5">Cal/Meal</p>
                </div>
                <Link href="/shopping" className="block">
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary/15 transition-colors">
                    <ShoppingBasket size={17} className="text-primary mb-1" />
                    <p className="text-[10px] uppercase tracking-wide text-primary font-bold">Grocery</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border bg-transparent p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl mx-auto mb-4">🍽️</div>
            <h3 className="font-bold text-foreground text-lg mb-1.5">No plan yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-5">
              Build your first meal plan in seconds — set your calorie goal and we'll handle the rest.
            </p>
            <Link href="/planner">
              <Button className="gap-2 font-bold shadow-sm">
                <Plus size={16} /> Build My First Plan
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Tips Strip */}
      <section className="rounded-2xl bg-primary/8 border border-primary/15 p-4 flex gap-4 items-start">
        <span className="text-2xl shrink-0 mt-0.5">💡</span>
        <div>
          <p className="font-bold text-foreground text-sm mb-0.5">Gym & meal prep tip</p>
          <p className="text-muted-foreground text-xs leading-relaxed">{dailyTip}</p>
        </div>
      </section>

    </div>
  );
}
