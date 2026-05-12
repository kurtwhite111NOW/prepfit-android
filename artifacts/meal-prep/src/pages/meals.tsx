import { usePageTitle } from "@/hooks/use-page-title";
import {
  useListSavedMeals,
  getListSavedMealsQueryKey,
  useDeleteSavedMeal,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Trash2,
  Camera,
  Calendar,
  Flame,
  ScanLine,
  Utensils,
  ExternalLink,
} from "lucide-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
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

export default function Meals() {
  usePageTitle("My Meals Journal", "Browse all your photo-scanned meals with calorie counts, ingredients, and macros saved over time.");
  const { data: savedMeals, isLoading } = useListSavedMeals({
    query: { queryKey: getListSavedMealsQueryKey() },
  });

  const deleteMeal = useDeleteSavedMeal();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    deleteMeal.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Meal removed", description: "Deleted from your journal." });
          queryClient.invalidateQueries({ queryKey: getListSavedMealsQueryKey() });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error deleting meal" });
        },
      }
    );
  };

  const totalCalories = savedMeals?.reduce((s, m) => s + m.estimatedCalories, 0) ?? 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            Food Journal
          </p>
          <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-1.5">
            My Meals
          </h1>
          <p className="text-muted-foreground">
            Every meal you've scanned and saved.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedMeals && savedMeals.length > 0 && (
            <div className="calorie-pill px-3.5 py-2 rounded-xl text-sm flex items-center gap-1.5">
              <Flame size={14} />
              <span className="font-bold">{totalCalories.toLocaleString()}</span>
              <span className="font-normal opacity-70 text-xs">cal logged</span>
            </div>
          )}
          <Link href="/scan">
            <Button className="gap-2 font-semibold shadow-sm">
              <Camera size={15} />
              Scan Meal
            </Button>
          </Link>
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <Skeleton className="h-44 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : !savedMeals?.length ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-transparent p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mx-auto mb-5">
            <ScanLine size={28} />
          </div>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
            Start your food journal
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-7">
            Scan a photo of any meal to instantly analyze its calories and ingredients. All saved meals appear here.
          </p>
          <Link href="/scan">
            <Button size="lg" className="gap-2 font-semibold shadow-sm">
              <Camera size={17} /> Open Scanner
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {savedMeals.map((meal) => (
            <div
              key={meal.id}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:border-primary/25 hover:shadow-md card-glow transition-all duration-200 flex flex-col group"
            >
              {meal.imageData ? (
                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                  <img
                    src={meal.imageData}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/80 text-[11px] font-medium">
                    <Calendar size={11} />
                    {new Date(meal.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="calorie-pill px-2.5 py-1 rounded-lg text-xs flex items-center gap-1">
                      <Flame size={11} />
                      {meal.estimatedCalories}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video w-full bg-muted flex items-center justify-center relative">
                  <Utensils size={32} className="text-muted-foreground/30" />
                  <div className="absolute top-3 right-3">
                    <span className="calorie-pill px-2.5 py-1 rounded-lg text-xs flex items-center gap-1">
                      <Flame size={11} />
                      {meal.estimatedCalories}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex-1 p-4">
                <h4 className="font-semibold text-foreground leading-tight mb-1">
                  {meal.name}
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                  {meal.description}
                </p>

                {meal.ingredients && (
                  <div className="mt-3 bg-muted/40 border border-border rounded-xl p-3">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                      Ingredients
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                      {meal.ingredients}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-4 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                    <Calendar size={11} />
                    {new Date(meal.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`how to make ${meal.name} recipe`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                  >
                    <ExternalLink size={10} />
                    Recipe
                  </a>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this meal?</AlertDialogTitle>
                      <AlertDialogDescription>
                        "{meal.name}" will be permanently removed from your journal. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(meal.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
