import { useState } from "react";
import { Link } from "wouter";
import {
  useListMealPlans,
  getListMealPlansQueryKey,
  useDeleteMealPlan,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, CalendarDays, ChefHat, Plus, Clock, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function Plans() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: mealPlans, isLoading } = useListMealPlans({
    query: { queryKey: getListMealPlansQueryKey() },
  });

  const deletePlan = useDeleteMealPlan();

  const handleDelete = () => {
    if (!selectedId) return;
    deletePlan.mutate(
      { id: selectedId },
      {
        onSuccess: () => {
          toast({ title: "Plan deleted" });
          setSelectedId(null);
          queryClient.invalidateQueries({ queryKey: getListMealPlansQueryKey() });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to delete plan" });
        },
      }
    );
  };

  const selectedPlan = mealPlans?.find((p) => p.id === selectedId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">History</p>
          <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-2">Saved Plans</h1>
          <p className="text-muted-foreground">All your previously generated meal plans.</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {selectedId && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="gap-2 font-semibold shadow-sm"
                  disabled={deletePlan.isPending}
                >
                  <Trash2 size={15} />
                  {deletePlan.isPending ? "Deleting..." : "Delete Plan"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this plan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <span className="font-semibold text-foreground">{selectedPlan?.name}</span> will be permanently removed. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Link href="/planner">
            <Button className="gap-2 font-semibold gradient-emerald border-0 shadow-md">
              <Plus size={15} /> New Plan
            </Button>
          </Link>
        </div>
      </section>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : !mealPlans?.length ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-transparent p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl mx-auto mb-4">
            📋
          </div>
          <h3 className="font-bold text-foreground text-lg mb-1.5">No saved plans yet</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-5">
            Generate and save a meal plan — it'll appear here for easy reference.
          </p>
          <Link href="/planner">
            <Button className="gap-2 font-semibold">
              <ChefHat size={16} /> Build a Plan
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {mealPlans.map((plan, i) => {
            const isSelected = selectedId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedId(isSelected ? null : plan.id)}
                className={`rounded-2xl border bg-card overflow-hidden shadow-sm transition-all cursor-pointer ${
                  isSelected
                    ? "border-destructive/60 ring-2 ring-destructive/20 shadow-md"
                    : i === 0
                    ? "border-primary/30 hover:border-primary/50"
                    : "border-border hover:border-primary/25"
                }`}
              >
                {i === 0 && !isSelected && <div className="h-1 gradient-emerald w-full" />}
                {isSelected && <div className="h-1 bg-destructive w-full" />}
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    {/* Radio button */}
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-destructive bg-destructive"
                          : "border-muted-foreground/40 bg-transparent"
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {i === 0 && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                            <h3 className="font-bold text-foreground text-base truncate">{plan.name}</h3>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              {new Date(plan.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays size={10} />
                              {plan.mealsPerDay} meals/day
                            </span>
                          </div>
                        </div>
                        <span className="calorie-pill px-3 py-1.5 rounded-xl text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0">
                          <Flame size={13} />
                          {plan.dailyCalories.toLocaleString()} cal
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <div className="rounded-xl bg-muted/50 border border-border px-3 py-2 text-center">
                          <p className="text-base font-extrabold text-foreground">{plan.mealsPerDay}</p>
                          <p className="text-[9px] uppercase tracking-wide text-muted-foreground font-semibold">Meals/Day</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 border border-border px-3 py-2 text-center">
                          <p className="text-base font-extrabold text-foreground">
                            {Math.round(plan.dailyCalories / plan.mealsPerDay)}
                          </p>
                          <p className="text-[9px] uppercase tracking-wide text-muted-foreground font-semibold">Cal/Meal</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 border border-border px-3 py-2 text-center">
                          <p className="text-base font-extrabold text-foreground">
                            {plan.dailyCalories.toLocaleString()}
                          </p>
                          <p className="text-[9px] uppercase tracking-wide text-muted-foreground font-semibold">Daily Cal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {selectedId && (
            <p className="text-center text-xs text-muted-foreground pt-1">
              Click the selected plan again to deselect it.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
