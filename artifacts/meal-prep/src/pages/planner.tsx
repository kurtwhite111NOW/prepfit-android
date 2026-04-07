import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGenerateMealPlan, useCreateMealPlan, useListMealPlans, getListMealPlansQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, ChefHat, Save, CheckCircle2, ChevronRight, CalendarDays, Flame } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Planner() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [mealsPerDay, setMealsPerDay] = useState<number>(3);
  const [dailyCalories, setDailyCalories] = useState<number>(2000);
  const [planName, setPlanName] = useState<string>("My Weekly Plan");

  const generateMealPlan = useGenerateMealPlan();
  const createMealPlan = useCreateMealPlan();

  const handleGenerate = () => {
    generateMealPlan.mutate({
      data: {
        mealsPerDay,
        dailyCalories
      }
    });
  };

  const handleSave = () => {
    if (!generateMealPlan.data) return;

    const generatedData = generateMealPlan.data;

    createMealPlan.mutate({
      data: {
        name: planName,
        mealsPerDay,
        dailyCalories,
        meals: generatedData.meals.map(m => ({
          name: m.name,
          description: m.description,
          calories: m.calories,
          mealNumber: m.mealNumber,
          ingredients: m.ingredients
        }))
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Plan Saved!",
          description: "Your meal plan has been saved successfully.",
        });
        queryClient.invalidateQueries({ queryKey: getListMealPlansQueryKey() });
        setLocation("/");
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Error saving plan",
          description: "There was a problem saving your meal plan."
        });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-2">
        <div className="flex items-center gap-3 text-primary">
          <CalendarDays className="w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
            Meal Planner
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Let AI design a personalized menu based on your goals.
        </p>
      </section>

      <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-start">
        {/* Settings Panel */}
        <Card className="sticky top-24 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Plan Settings
            </CardTitle>
            <CardDescription>Configure your daily targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="meals-per-day" className="text-base">Meals per day</Label>
                <span className="font-bold text-lg text-primary">{mealsPerDay}</span>
              </div>
              <Slider
                id="meals-per-day"
                min={2}
                max={5}
                step={1}
                value={[mealsPerDay]}
                onValueChange={(val) => setMealsPerDay(val[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2 (Fasting)</span>
                <span>5 (Frequent)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="daily-calories" className="text-base">Daily Calories</Label>
                <span className="font-bold text-lg text-primary flex items-center gap-1">
                  <Flame className="w-4 h-4" /> {dailyCalories} kcal
                </span>
              </div>
              <Slider
                id="daily-calories"
                min={1200}
                max={4000}
                step={100}
                value={[dailyCalories]}
                onValueChange={(val) => setDailyCalories(val[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1200</span>
                <span>4000</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button 
                className="w-full h-12 text-lg gap-2 shadow-md hover-elevate"
                onClick={handleGenerate}
                disabled={generateMealPlan.isPending}
              >
                {generateMealPlan.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Crafting Menu...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Plan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="space-y-6">
          {generateMealPlan.isPending ? (
            <Card className="border-primary/20 bg-primary/5 animate-pulse">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary relative">
                  <Sparkles className="w-8 h-8 absolute animate-ping duration-1000" />
                  <ChefHat className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-semibold text-primary">Our AI Chef is working...</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Designing a balanced menu of {mealsPerDay} meals totaling ~{dailyCalories} calories.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : generateMealPlan.data ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <Card className="border-border">
                <CardHeader className="bg-secondary/30 pb-4 border-b border-border">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-serif text-foreground">
                        {generateMealPlan.data.name}
                      </CardTitle>
                      <CardDescription>
                        A balanced daily menu customized to your targets
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-background px-3 py-1.5 rounded-lg border border-border flex flex-col items-center">
                        <span className="text-xs text-muted-foreground font-semibold uppercase">Total</span>
                        <span className="font-bold text-primary flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {generateMealPlan.data.meals.reduce((sum, m) => sum + m.calories, 0)} kcal
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {generateMealPlan.data.meals.map((meal) => (
                      <div key={meal.mealNumber} className="p-6 transition-colors hover:bg-secondary/10">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold shrink-0 border border-border shadow-sm">
                            {meal.mealNumber}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <h4 className="text-lg font-semibold text-foreground leading-tight">
                                {meal.name}
                              </h4>
                              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap border border-primary/20">
                                {meal.calories} kcal
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {meal.description}
                            </p>
                            <div className="mt-3 bg-background border border-border rounded-xl p-3">
                              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                                Ingredients
                              </span>
                              <p className="text-sm text-foreground">
                                {meal.ingredients}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-secondary/20 border-t border-border p-6 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-auto flex-1">
                    <Label htmlFor="plan-name" className="sr-only">Plan Name</Label>
                    <Input 
                      id="plan-name" 
                      value={planName} 
                      onChange={(e) => setPlanName(e.target.value)}
                      placeholder="Name your plan..."
                      className="bg-background text-lg font-medium border-border h-12"
                    />
                  </div>
                  <Button 
                    className="w-full sm:w-auto h-12 px-8 gap-2 text-base shadow-md hover-elevate group"
                    onClick={handleSave}
                    disabled={createMealPlan.isPending}
                  >
                    {createMealPlan.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Save This Plan
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <Card className="border-dashed border-2 border-border bg-transparent shadow-none h-full flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-6 opacity-50">
                <ChefHat size={40} />
              </div>
              <h3 className="text-2xl font-serif font-medium mb-3 text-muted-foreground">Ready to create your menu</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Adjust your settings on the left and hit generate. We'll instantly create a customized meal plan and matching grocery list.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
