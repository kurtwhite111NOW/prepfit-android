import { useListSavedMeals, getListSavedMealsQueryKey, useDeleteSavedMeal } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Search, Trash2, Camera, Calendar, Flame } from "lucide-react";
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
  const { data: savedMeals, isLoading } = useListSavedMeals({
    query: {
      queryKey: getListSavedMealsQueryKey()
    }
  });

  const deleteMeal = useDeleteSavedMeal();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    deleteMeal.mutate({ id }, {
      onSuccess: () => {
        toast({
          title: "Meal deleted",
          description: "The saved meal has been removed from your history."
        });
        queryClient.invalidateQueries({ queryKey: getListSavedMealsQueryKey() });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete meal."
        });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
              My Meals
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your personal history of scanned and saved meals.
          </p>
        </div>
        <Link href="/scan">
          <Button className="gap-2 shadow-sm whitespace-nowrap">
            <Camera size={18} /> Scan New Meal
          </Button>
        </Link>
      </section>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden border-none shadow-sm bg-card">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="pt-4 flex justify-between">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !savedMeals?.length ? (
        <Card className="border-dashed border-2 border-border bg-background shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-serif font-semibold mb-2">No meals saved yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
              Start building your food journal by scanning your first meal photo.
            </p>
            <Link href="/scan">
              <Button size="lg" className="gap-2 shadow-md hover-elevate">
                <Camera size={20} /> Open Camera
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedMeals.map((meal) => (
            <Card key={meal.id} className="overflow-hidden border-border hover:border-primary/30 transition-colors group flex flex-col">
              {meal.imageData ? (
                <div className="aspect-video w-full overflow-hidden bg-secondary border-b border-border relative">
                  <img 
                    src={meal.imageData} 
                    alt={meal.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-sm font-medium flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(meal.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video w-full bg-secondary flex items-center justify-center border-b border-border">
                  <BookOpen className="w-12 h-12 text-muted-foreground opacity-20" />
                </div>
              )}
              
              <CardHeader className="pb-3 flex-1">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl font-serif leading-tight">{meal.name}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2 mt-2 text-sm text-foreground/80">
                  {meal.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="bg-background rounded-xl p-3 border border-border mt-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Ingredients
                  </span>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {meal.ingredients}
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="bg-secondary/20 border-t border-border pt-4 pb-4 flex items-center justify-between mt-auto">
                <div className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  {meal.estimatedCalories} <span className="font-normal text-xs uppercase tracking-wide opacity-80">kcal</span>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete saved meal?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove "{meal.name}" from your meal history. This action cannot be undone.
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
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
